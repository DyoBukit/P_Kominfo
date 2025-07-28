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
            'form_title' => 'required|string',
            'answers' => 'required|array'
        ]);

    
        $evaluations = Evaluation::create([
            'user_id' => Auth::id(),
            'form_title' => $request->form_title,
            'status' => 'completed',
        ]);

        foreach ($request->answers as $questionId => $answerValue){
            
            $questions = Question::find($questionId);
            if(!$questions) continue;
            
            $finalAnswerValue = $answerValue;

            if ($questions->type === 'file' && is_file($answerValue)) {
                    $path = $answerValue->store('uploads', 'public');
                    $finalAnswerValue = $path; 
            }
            
                Answer::create([
                    'evaluation_id' => $evaluations->id,
                    'question_id' => $questionId,   
                    'answer_value' => $answerValue,
                ]);
            
        }

        return response()->json(['message' => 'Evaluasi berhasil disimpan.'], 201);
    }

    public function index()
    {
        $evaluations = Evaluation::with('user:id,name,username')->latest()->get();
        return response()->json($evaluations);
    }
    public function show(Evaluation $evaluations)
    {
        $evaluations->load('answers.question');
        return response()->json($evaluations);
    }
}
