<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Evaluation;
use App\Models\Answer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Form;
use App\Exports\EvaluationsExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
class EvaluationController extends Controller
{
    /**
     * Mengambil semua pertanyaan untuk form evaluasi.
     */
    public function getQuestions()
    {
        $questions = Question::orderBy('id')->get();
        return response()->json($questions);
    }

    /**
     * Menyimpan hasil form evaluasi.
     */
    public function store(Request $request)
    {
        $request->validate([
            'form_title' => 'required|string',
            'answers' => 'required|array',
            'form_id' => 'required|exists:forms,id'
        ]);

        $evaluation = Evaluation::create([
            'user_id' => Auth::id(),
            'form_title' => $request->form_title,
            'status' => 'completed',
            'form_id' => $request->form_id
        ]);

        

        // --- PERBAIKAN UTAMA DI SINI ---
        foreach ($request->answers as $questionId => $answerValue){
            
            // Mengganti nama variabel dari $questions menjadi $question (tunggal)
            $question = Question::find($questionId);
            if(!$question) continue;
            
            $finalAnswerValue = $answerValue;

            // Menggunakan variabel $question yang sudah benar
            if ($question->type === 'file' && is_file($answerValue)) {
                $path = $answerValue->store('uploads', 'public');
                $finalAnswerValue = $path; 
            }
            
            Answer::create([
                'evaluation_id' => $evaluation->id,
                'question_id' => $questionId,  
                'answer_value' => $finalAnswerValue, // Menggunakan $finalAnswerValue yang sudah diproses
            ]);
        }

        return response()->json(['message' => 'Evaluasi berhasil disimpan.'], 201);
    }

    /**
     * Menampilkan semua hasil evaluasi (untuk Admin).
     */
    public function index(Request $request)
    {
        $query = Evaluation::with('user:id,name,username,email')->latest(); // Muat relasi user

        // LOGIKA PENCARIAN (SEARCH)
        if ($search = $request->input('search')) {
            $query->where('form_title', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
        }

        $perPage = $request->input('per_page', 10); // Ambil per_page dari request, default 10
        $evaluations = $query->paginate($perPage);

        return response()->json($evaluations);
    }

    /** 
     * Menampilkan detail satu hasil evaluasi (untuk Admin).
     */
    public function show(Evaluation $evaluation)
    {
        // Muat relasi jawaban beserta pertanyaan terkait
        $evaluation->load('answers.question');
        return response()->json($evaluation);
    }

    public function getActiveForm()
    {
        $activeForm = Form::where('is_active', true)->with(['questions.options'])->first();

        if (!$activeForm) {
            return response()->json(['message' => 'Saat ini tidak ada form evaluasi yang aktif.'], 404);
        }

        return response()->json($activeForm);
    }

    public function export(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $fileName = 'Form-' . now()->format('Y-m-d-His') . '.xlsx';

        return Excel::download(new EvaluationsExport($startDate, $endDate), $fileName);
    }
}
