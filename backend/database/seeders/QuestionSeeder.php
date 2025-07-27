<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('questions')->delete();

        $questions = [
            [
                'question_text' => 'Pilih OPD Anda.',
                'type' => 'multiple_choice', 
            ],
            [
                'question_text' => 'Nama Lengkap Petugas Upload Data.',
                'type' => 'essay', 
            ],
            [
                'question_text' => 'Apakah terdapat layanan/kebijakan/aplikasi terbaru terkait indikator evaluasi SPBE pada OPD anda?',
                'type' => 'multiple_choice', 
            ],
            [
                'question_text' => 'Upload Data Dukung Anda disini.',
                'type' => 'file',
            ],
            [
                'question_text' => 'Mohon tuliskan penjelasan atas masing-masing data dukung yang diunggah.',
                'type' => 'essay',
            ],
        ];
        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
