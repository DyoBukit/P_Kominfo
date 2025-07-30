<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'is_active'];

    public function questions(){
        return $this->belongsToMany(Question::class)->withPivot('order')->orderBy('pivot_order');
    }
}
