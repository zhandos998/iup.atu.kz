<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\IndicatorValue;
use App\Models\Role;
use App\Models\UserPermission;
use Illuminate\Container\Attributes\DB;

// use App\Models\IndicatorPermission;

class DashboardController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();
        $roleNames = $user->roles->pluck('name');

        // базовый запрос
        $categories = Category::with([
            'indicators' => function ($q) use ($user) {
                $q->with([
                    'values' => function ($v) use ($user) {
                        $v->where('user_id', $user->id)
                            ->with('files:id,indicator_value_id,path,original_name');
                    },
                    'subs' => function ($s) use ($user) {
                        $s->where('user_id', $user->id)
                            ->with([
                                'files:id,indicator_sub_id,path,original_name',
                            ]);
                    }, // 👈 просто добавляем связь без условий
                ]);
            },
        ])->get();

        // --- Базовые права через роли ---
        $rolePermissions = Role::with('permissions')
            ->whereIn('name', $roleNames)
            ->get()
            ->pluck('permissions')
            ->flatten();

        // --- Индивидуальные (временные) права пользователя ---
        $now = now();
        $userPermissionsTimed = UserPermission::with('permission')
            ->where('user_id', $user->id)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', $now);
            })
            ->get()
            ->pluck('permission');

        // dd($now);
        // dd(UserPermission::with('permission')
        //     ->where('user_id', $user->id)
        //     ->where(function ($q) use ($now) {
        //         $q->whereNull('starts_at')
        //             ->orWhere('starts_at', '<=', $now);
        //     })
        //     ->where(function ($q) use ($now) {
        //         $q->whereNull('expires_at')
        //             ->orWhere('expires_at', '>', $now);
        //     })->toSQL());

        // --- Объединяем все источники разрешений ---
        $permissions = $rolePermissions
            ->merge($userPermissionsTimed)
            ->unique('id');

        // --- Формируем финальный массив разрешений для фронтенда ---
        $user_permissions = [
            'can_edit_plan' => false,
            'can_edit_fact' => false,
            'can_add_files' => false,
            'can_delete_files' => false,
            'can_view' => false,
        ];

        foreach ($permissions as $permission) {
            match ($permission->key) {
                'edit_plan'   => $user_permissions['can_edit_plan'] = true,
                'edit_fact'   => $user_permissions['can_edit_fact'] = true,
                'upload_file' => $user_permissions['can_add_files'] = true,
                'delete_file' => $user_permissions['can_delete_files'] = true,
                'view'        => $user_permissions['can_view'] = true,
                default       => null,
            };
        }

        // dd($user_permissions);

        return Inertia::render('Dashboard/Index', [
            'user' => $user->only('id', 'name', 'email'),
            'categories' => $categories,
            'permissions' => $user_permissions,
        ]);
    }
}
