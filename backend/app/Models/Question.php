<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['evaluation_id', 'question_id', 'answer_value'];

    public function evaluation() {
        return $this->belongsTo(Evaluation::class);
}

    public function question() {
        return $this->belongsTo(Question::class);
}
}
