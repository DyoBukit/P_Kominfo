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
    protected $onDate;

    public function __construct($startDate, $onDate)
    {
        $this->startDate = $startDate;
        $this->onDate = $onDate;
    }
    public function query()
    {
        $query = Evaluation::query()
            ->with(['user', 'answers.questions'])
            ->select('evaluations');

        if($this->startDate && this->endDate) {
            $query->whereBeetwen('evaluations.created_at', [$this->startDate. $this->endDate]);
        }
        
        return $query;
    }

    public function heading (): array
    {
        return [
            'No',
            'Nama Lengkap',
            'Email',
            'OPD',
            'Tanggal Pengisian',
            'Pertanyaan',
            'Jawaban',
        ];
    }

    public function map ($evaluation) : array 
    {
        $rows = [];

        if ($evaluation->answers->isEmpty()) {
            $rows[] = [
                $evaluation->id,
                $evaluation->user->name ?? 'N/A',
                $evaluation->user->email ?? 'N/A',
                $evaluation->user->OPD ?? 'N/A',
                $evaluation->created_at->format('Y-m-d H:i:s'),
                '-',
                '-',
            ];
         } else {
foreach ($evaluation->answers as $answer) {
                $rows[] = [
                    $evaluation->id,
                    $evaluation->user->name ?? 'N/A',
                    $evaluation->user->email ?? 'N/A',
                    $evaluation->user->OPD ?? 'N/A',
                    $evaluation->created_at->format('Y-m-d H:i:s'),
                    $answer->question->question_text ?? 'Pertanyaan tidak ditemukan',
                    $answer->answer_value,
                ];
            }
        }

        return $rows;
    }
}

