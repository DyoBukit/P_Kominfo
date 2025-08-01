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
        $users = User::where('role', 'user')->latest()->paginate(3);
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
            'opd' => ['required', 'string', 'max:255'], // <-- PERBAIKAN 1
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'opd' => $request->opd, // <-- PERBAIKAN 2
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        return response()->json($user, 201);
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
        $validatedData = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'username' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'opd' => ['sometimes', 'nullable', 'string', 'max:255'], // <-- PERBAIKAN 3
            'email' => ['sometimes', 'required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($request->filled('password')) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }
        
        $user->update($validatedData);  

        return response()->json($user);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403);
        }
        
        $user->delete();

        return response()->json(['message' => 'Data berhasil dihapus!'], 200);
    }
}