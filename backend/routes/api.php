<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\Api\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\FormController;
use App\Http\Controllers\Api\EvaluationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// === RUTE AUTENTIKASI UMUM ===
require __DIR__.'/auth.php';


Route::prefix('admin')->name('admin.')->group(function() {
    // Rute publik untuk admin (login)
    Route::post('login', [AdminLoginController::class, 'login']);

    
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AdminLoginController::class, 'logout']);
        Route::apiResource('users', AdminUserController::class);
        // Form & Question Management
        Route::apiResource('forms', FormController::class);
        Route::post('forms/{form}/questions', [FormController::class, 'addQuestion']);
        Route::put('questions/{question}', [FormController::class, 'updateQuestion']);
        Route::delete('questions/{question}', [FormController::class, 'removeQuestion']);
        Route::patch('forms/{form}/toggle-active', [FormController::class, 'toggleIsActive']);
        // Evaluation Export
        Route::get('evaluations/export', [EvaluationController::class, 'export']);
        Route::get('evaluations', [EvaluationController::class, 'index']);
    });
});

// === RUTE UNTUK USER BIASA (OPD) ===
Route::middleware('auth:sanctum')->group(function () {
    // Mengambil user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Mengambil form evaluasi yang aktif
    Route::get('forms/active', [EvaluationController::class, 'getActiveForm']);
    
    // Menyimpan hasil evaluasi
    Route::post('/evaluations', [EvaluationController::class, 'store']);
});