<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'name' => 'opd',
                'label' => 'Pilih OPD Anda.',
                'type' => 'select',
                'options' => ['Dinas Kominfo', 'Dinas Kesehatan', 'Dinas Pendidikan'],
                'required' => true
            ],
            [
                'name' => 'petugas',
                'label' => 'Nama Lengkap Petugas Upload Data.',
                'type' => 'essay',
                'options' => null,
                'required' => true
            ],
            [
                'name' => 'layanan_baru',
                'label' => 'Apakah terdapat layanan/kebijakan/aplikasi terbaru?',
                'type' => 'select',
                'options' => ['Ya', 'Tidak'],
                'required' => true
            ],
            [
                'name' => 'upload_data',
                'label' => 'Upload Data Dukung Anda di sini.',
                'type' => 'file',
                'options' => null,
                'required' => true
            ],
            [
                'name' => 'penjelasan_data',
                'label' => 'Mohon tuliskan penjelasan atas masing-masing data dukung yang diunggah.',
                'type' => 'essay',
                'options' => null,
                'required' => true
            ],
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}
