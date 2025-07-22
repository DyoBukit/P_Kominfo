<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Menampilkan data ringkasan untuk dashboard admin.
     */
    public function index()
    {
        // Untuk sekarang, kita hanya akan mengembalikan pesan sukses.
        // Nantinya, Anda bisa mengambil data seperti jumlah pengguna, dll.
        
        $userCount = User::where('role', 'user')->count();

        return response()->json([
            'message' => 'Selamat datang di Dashboard Admin!',
            'data' => [
                'total_user' => $userCount,
            ]
        ]);
    }
}
