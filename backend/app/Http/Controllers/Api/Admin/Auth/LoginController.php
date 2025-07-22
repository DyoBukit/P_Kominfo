<?php

namespace App\Http\Controllers\Api\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt for an admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // 1. Validasi input dari request
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Coba autentikasi dengan kredensial yang diberikan
        if (!Auth::attempt($credentials)) {
            // Jika kredensial salah, kembalikan error Unauthorized
            return response()->json([
                'message' => 'Kredensial yang diberikan salah.'
            ], 401);
        }

        // 3. Dapatkan user yang berhasil login
        $user = $request->user();

        // 4. Periksa apakah peran user adalah 'admin'
        if ($user->role !== 'admin') {
            // Jika bukan admin, batalkan sesi/token dan kembalikan error Forbidden
            $user->tokens()->delete(); // Menghapus semua token user ini
            return response()->json([
                'message' => 'Akses ditolak. Anda bukan admin.'
            ], 403);
        }

        // 5. Jika user adalah admin, buat token baru
        $token = $user->createToken('admin-auth-token')->plainTextToken;

        // 6. Kembalikan respons sukses dengan token
        return response()->json([
            'message' => 'Login admin berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout admin berhasil']);
    }
}