<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Evaluation;
use App\Models\Answer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EvaluationController extends Controller
{
    public function getQuestions()
    {
        $questions = Question::orderBy('id')->get();
        return response()->json($questions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'form_title' => 'required|string|max:255',
        ]);

    
        $evaluation = Evaluation::create([
            'user_id' => Auth::id(),
            'form_title' => $request->form_title,
            'status' => 'completed',
        ]);

    
        $questions = Question::all()->keyBy('id');

      
        foreach ($questions as $id => $question) {
            $answerValue = null;
            $inputKey = 'answers.'.$id; 

            if ($question->type === 'file') {
                if ($request->hasFile($inputKey)) {
                    $request->validate([$inputKey => 'required|file|mimes:pdf,jpg,png,docx|max:2048']);
                    $path = $request->file($inputKey)->store('uploads', 'public');
                    $answerValue = $path; 
            } else {
                if ($request->has($inputKey)) {
                    $request->validate([$inputKey => 'required|string']);
                    $answerValue = $request->input($inputKey);
                }
            }

            if ($answerValue !== null) {
                Answer::create([
                    'evaluation_id' => $evaluation->id,
                    'question_id' => $id,
                    'answer_value' => $answerValue,
                ]);
            }
        }

        return response()->json(['message' => 'Evaluasi berhasil disimpan.'], 201);
    }

}
    public function index()
    {
        $evaluations = Evaluation::with('user:id,name,username')->latest()->get();
        return response()->json($evaluations);
    }
    public function show(Evaluation $evaluation)
    {
        $evaluation->load('answers.question');
        return response()->json($evaluation);
    }
}
