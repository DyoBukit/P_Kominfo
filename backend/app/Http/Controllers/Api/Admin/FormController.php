<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FormController extends Controller
{
    /**
     * Menampilkan semua form.
     */
    public function index()
    {
        return Form::withCount('questions')->latest()->get();
    }

    /**
     * Membuat form baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $form = Form::create($validated);
        return response()->json($form, 201);
    }

    /**
     * Menampilkan detail satu form beserta pertanyaannya.
     */
    public function show(Form $form)
    {
        return $form->load('questions');   
    }

    /**
     * Mengupdate judul/deskripsi form.
     */
    public function update(Request $request, Form $form)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $form->update($validated);
        return response()->json($form);
    }

    /**
     * Menghapus form.
     */
    public function destroy(Form $form)
    {
        $form->delete();
        return response()->json(['message'=>'Form berhasil dihapus'], 200);
    }

    /**
     * Menambahkan pertanyaan baru ke dalam form yang sudah ada.
     */
    public function addQuestion(Request $request, Form $form)
    {
        $validated = $request->validate([
            // 1. Validasi 'question' dari React, mapping ke 'question_text'
            'question' => 'required|string',
            'type' => [
                'required',
                // 2. Validasi 'type' yang baru dan benar dari React
                Rule::in(['essay', 'multiple_choice', 'file']),
            ],
            // 'description' dan 'category' bisa divalidasi jika kolomnya sudah ada
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);
        
        // 3. Buat pertanyaan baru dengan data yang sudah disesuaikan untuk DB
        $question = Question::create([
            'question_text' => $validated['question'], // Mapping 'question' -> 'question_text'
            'type' => $validated['type'], // Langsung gunakan tipe dari frontend
            // Tambahkan baris ini jika Anda sudah memperbaiki migrasi
            // 'description' => $validated['description'],
            // 'category' => $validated['category'],
        ]);
        
        // 4. Lampirkan pertanyaan ke form menggunakan tabel penghubung
        $form->questions()->attach($question->id);

        return response()->json($question, 201);
    }

    /**
     * Mengupdate pertanyaan yang sudah ada.
     */
    public function updateQuestion(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'type' => [
                'required',
                Rule::in(['essay', 'multiple_choice', 'file']),
            ],
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);
        
        $question->update([
            'question_text' => $validated['question'],
            'type' => $validated['type'],
            // 'description' => $validated['description'],
            // 'category' => $validated['category'],
        ]);
        
        return response()->json($question);
    }

    /**
     * Menghapus pertanyaan.
     */
    public function removeQuestion(Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'Pertanyaan berhasil dihapus'], 200);
    }
}
