<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     */
    public function index()
    {
        // Mengambil semua user dengan peran 'user', diurutkan dari yang terbaru.
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
            'role' => 'user', // Otomatis set peran sebagai 'user'
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
     * Mengupdate data pengguna yang sudah ada.
     */
    public function update(Request $request, User $user)
    {
        // --- PERBAIKAN DI SINI ---
        // Hasil validasi harus disimpan ke dalam variabel $validatedData
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        // Update data dasar pengguna
        $user->name = $validatedData['name'];
        $user->username = $validatedData['username'];
        $user->email = $validatedData['email'];

        // Jika ada password baru yang dikirim, update passwordnya
        if ($request->filled('password')) {
            $user->password = Hash::make($validatedData['password']);
        }

        // Simpan perubahan ke database
        $user->save();

        // Kembalikan respons sukses dengan data user yang sudah diupdate
        return response()->json($user);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(User $user)
    {
        // Tambahan keamanan: Pastikan admin tidak bisa menghapus akunnya sendiri.
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403); // 403 = Forbidden
        }
        
        // Hapus user dari database
        $user->delete();

        // Kembalikan respons sukses tanpa konten
        return response()->json(null, 204); // 204 = No Content
    }
}
