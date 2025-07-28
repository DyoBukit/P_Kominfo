<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // --- PERBAIKAN DI SINI ---
    // Tambahkan 'evaluation_id' ke dalam array ini
    protected $fillable = [
        'evaluation_id',
        'question_id',
        'answer_value'
    ];

    /**
     * Mendapatkan data evaluasi yang terkait dengan jawaban ini.
     */
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    /**
     * Mendapatkan data pertanyaan yang terkait dengan jawaban ini.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
