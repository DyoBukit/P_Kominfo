<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = ['user_id', 'form_title', 'status'];

    public function user() {
    return $this->belongsTo(User::class);
}

    public function answers() {
    return $this->hasMany(Answer::class);
}
}
