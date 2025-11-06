<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;
use App\Http\Controllers\IndicatorController;
use App\Http\Controllers\IndicatorFileController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', fn() => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/categories/{category}', [IndicatorController::class, 'index'])->name('indicators.index');
    Route::post('/indicators/{indicator}', [IndicatorController::class, 'store'])->name('indicators.store');
    Route::patch('/indicator-values/{indicatorValue}/toggle-lock', [IndicatorController::class, 'toggle'])
        ->name('indicators.toggle-lock');

    Route::delete('/indicator-files/{indicatorFile}', [IndicatorFileController::class, 'destroy'])->name('indicator-files.destroy');
});
