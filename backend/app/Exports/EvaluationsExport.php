<?php

namespace App\Exports;

use App\Models\Evaluation;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Facades\DB;

class EvaluationsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    // Menggunakan nama variabel yang konsisten: $endDate
    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * Mendefinisikan query ke database dengan filter tanggal.
     */
    public function query()
    {
        $query = Evaluation::query()
            // Menggunakan relasi yang benar: answers.question (tunggal)
            ->with(['user', 'answers.question'])
            // Menggunakan select yang benar
            ->select('evaluations.*');

        // Menggunakan nama variabel dan method yang benar
        if ($this->startDate && $this->endDate) {
            $query->whereBetween('evaluations.created_at', [$this->startDate, $this->endDate]);
        }
        
        return $query;
    }

    /**
     * Mendefinisikan judul kolom untuk file Excel.
     * Nama method yang benar adalah headings() (dengan 's').
     */
    public function headings(): array
    {
        return [
            'ID Evaluasi',
            'Nama Lengkap',
            'Email',
            'OPD',
            'Tanggal Pengisian',
            'Pertanyaan',
            'Jawaban',
        ];
    }

    /**
     * Memetakan setiap data evaluasi menjadi baris-baris di Excel.
     * Satu evaluasi bisa menjadi beberapa baris, tergantung jumlah jawabannya.
     */
    public function map($evaluation): array
    {
        $rows = [];
        
        // Cari jawaban untuk pertanyaan OPD (asumsi question_id = 1)
        $opdAnswer = $evaluation->answers->firstWhere('question_id', 1);
        $opdName = $opdAnswer ? $opdAnswer->answer_value : 'N/A';

        if ($evaluation->answers->isEmpty()) {
            // Jika tidak ada jawaban, tetap tampilkan satu baris info evaluasi
            $rows[] = [
                $evaluation->id,
                $evaluation->user->name ?? 'N/A',
                $evaluation->user->email ?? 'N/A',
                $opdName,
                $evaluation->created_at->format('Y-m-d H:i:s'),
                '-- Tidak ada jawaban --',
                '',
            ];
        } else {
            // Buat satu baris untuk setiap jawaban
            foreach ($evaluation->answers as $answer) {
                $rows[] = [
                    $evaluation->id,
                    $evaluation->user->name ?? 'N/A',
                    $evaluation->user->email ?? 'N/A',
                    $opdName,
                    $evaluation->created_at->format('Y-m-d H:i:s'),
                    $answer->question->question_text ?? 'Pertanyaan tidak ditemukan',
                    $answer->answer_value,
                ];
            }
        }

        return $rows;
    }
}
