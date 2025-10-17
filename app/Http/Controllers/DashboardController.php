<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();

        // Можно проверить роли
        $roles = $user->roles->pluck('name');

        // Возвращаем компонент Inertia
        return Inertia::render('Dashboard/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles,
            ],
        ]);
    }
}
