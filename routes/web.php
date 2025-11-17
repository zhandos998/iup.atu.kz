<?php

use App\Exports\SummaryReportExport;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentReportController;
use Inertia\Inertia;
use App\Http\Controllers\IndicatorController;
use App\Http\Controllers\IndicatorFileController;
use App\Http\Controllers\PlanOverviewController;
use App\Http\Controllers\IndicatorSubController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserPermissionController;
use Maatwebsite\Excel\Facades\Excel;

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
    Route::patch('/indicator-values/{indicatorValue}/toggle-lock', [IndicatorController::class, 'toggle'])->name('indicators.toggle-lock');

    Route::get('/plans', [PlanOverviewController::class, 'index'])->name('plans.index');
    Route::get('/plans/summary', [PlanOverviewController::class, 'summary'])->name('plans.summary');
    Route::get('/plans/{user}', [PlanOverviewController::class, 'show'])->name('plans.show');
    Route::get('/plans/summary/export', function () {
        $date = now()->format('Y-m-d'); // или d.m.Y
        return Excel::download(new SummaryReportExport, 'Общий_итог_преподавателей_' . $date . '.xlsx');
    })->name('plans.summary.export');

    Route::delete('/indicator-files/{indicatorFile}', [IndicatorFileController::class, 'destroy'])->name('indicator-files.destroy');

    Route::post('/indicators/{indicator}/subs', [IndicatorSubController::class, 'store']);
    Route::delete('/indicator-subs/{indicatorSub}', [IndicatorSubController::class, 'destroy']);
    Route::post('/indicator-subs/{indicatorSub}', [IndicatorSubController::class, 'update']);
    Route::delete('/indicator-sub-files/{file}', [IndicatorSubController::class, 'destroyFile'])->name('indicator-sub-files.destroy');


    // 🔹 Управление ролями
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::post('/roles/{role}/update', [RoleController::class, 'update'])->name('roles.update');

    Route::post('/roles/{role}/permissions/{permission}/attach', [RoleController::class, 'attachPermission'])->name('roles.permissions.attach');
    Route::post('/roles/{role}/permissions/{permission}/detach', [RoleController::class, 'detachPermission'])->name('roles.permissions.detach');

    // 🔹 Управление базовыми разрешениями
    // Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    // Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    // Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

    // 🔹 Индивидуальные права пользователей
    Route::get('/user-permissions', [UserPermissionController::class, 'index'])->name('user_permissions.index');
    Route::post('/user-permissions/bulk', [UserPermissionController::class, 'bulkStore'])->name('user_permissions.bulkStore');
    Route::delete('/user-permissions/{id}', [UserPermissionController::class, 'destroy'])->name('user_permissions.destroy');

    Route::get('/reports/{user}', [ReportController::class, 'show'])->name('reports.show');
    Route::get('/reports/{user}/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/departments/{id}/export', [DepartmentReportController::class, 'export'])->name('departments.export');
});
