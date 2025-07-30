<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use app\Models\Question;
use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Form::withCount('questions')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $form = Form::create($validated);
        return response()->json($form, 201);
    }

    public function show(Form $form)
    {
        return $form->load('questions');    
    }

    public function update(Request $request, Form $form)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $form->update($validated);
        return response()->json($form);
    }

    public function destroy(string $id)
    {
        $form->delete();
        return response()->json(['message'=>'Form berhasil dihapus'], 201);
    }

    public function updateQuestion(Request $request, Question $question)
     {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'category' => 'required|string',
            'type' => 'required|in:multiple_choice,essay,file,dropdown',
        ]);
        
        $question->update($validated);
        return response()->json($question);
    }

    public function removeQuestion(Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'Pertanyaan berhasil dihapus'], 201);
    }
}
