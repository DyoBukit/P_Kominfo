<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\EvaluationController;
use App\Models\Evaluation;

require __DIR__.'/auth.php';

Route::prefix('admin')->name('admin.')->group(function() {
    Route::post('login', [AdminLoginController::class, 'login']);
    Route::post('logout', [AdminLoginController::class, 'logout'])->middleware('auth:sanctum');
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::apiResource('users', AdminUserController::class);
    });

});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function (){
    Route::get('/question', [EvaluationController::class, 'getQuestions']);
    Route::post('/evaluation', [EvaluationController::class, 'store']);
});

Route::middleware(['auth:sacntum', 'admin'])->prefix('admin')->group(function(){
    Route::get('/evaluasi', [EvaluationController::class, 'index']);
    Route::get('/evaluasi/{evaluation}', [EvaluationController::class, 'show']);
});
