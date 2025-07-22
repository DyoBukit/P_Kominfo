<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     */
    public function index()
    {
        // Mengambil semua user, kecuali admin itu sendiri jika diperlukan
        $users = User::where('role', 'user')->latest()->get();
        return response()->json($users);
    }

    /**
     * Menyimpan pengguna baru yang dibuat oleh admin.
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:'.User::class],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Otomatis set peran sebagai 'pengguna'
        ]);

        // Kembalikan respons sukses dengan data user yang baru dibuat
        return response()->json($user, 201); // 201 = Created
    }

    /**
     * Menampilkan detail satu pengguna.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Mengupdate data pengguna.
     */
    public function update(Request $request, User $user)
    {
        // Logika untuk update user bisa ditambahkan di sini
        // ...

        return response()->json($user);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204); // 204 = No Content
    }
}