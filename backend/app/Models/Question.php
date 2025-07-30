<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = ['question_text', 'category', 'type'];

    public function forms() {
        return $this->belongsToMany(Form::class);
}
}
