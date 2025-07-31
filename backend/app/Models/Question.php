<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'question_text', 
        'type'
    ];

    public function forms() {
        return $this->belongsToMany(Form::class, 'form_question');
}
    public function options()
    {
        return $this->hasMany(Option::class);
    }
}
