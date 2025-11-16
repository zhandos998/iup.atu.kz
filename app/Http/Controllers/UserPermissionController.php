<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Faculty;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPermissionController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->user();

        $roleFilter = $request->input('role');
        $facultyFilter = $request->input('faculty_id');
        $departmentFilter = $request->input('department_id');
        $search = $request->input('search');

        $roles = Role::select('id', 'name', 'label')->get();
        $permissions = Permission::get();

        $faculties = Faculty::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();

        // --- Фильтр пользователей ---
        $users = User::with(['roles:id,name,label', 'faculty:id,name', 'department:id,name'])
            ->select('id', 'name', 'email', 'faculty_id', 'department_id')

            // Фильтр по роли
            ->when(
                $roleFilter,
                fn($q) => $q->whereHas('roles', fn($r) => $r->where('name', $roleFilter))
            )

            // Фильтр по факультету
            ->when($facultyFilter, fn($q) => $q->where('faculty_id', $facultyFilter))

            // Фильтр по кафедре
            ->when($departmentFilter, fn($q) => $q->where('department_id', $departmentFilter))

            // Фильтр по поиску
            ->when(
                $search,
                fn($q) =>
                $q->where(function ($s) use ($search) {
                    $s->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                })
            )

            // --- ДОПОЛНИТЕЛЬНО: Ограничение прав доступа ---
            // Если зав. кафедры → видит только свою кафедру
            ->when(
                $auth->roles->contains('name', 'head'),
                fn($q) => $q->where('department_id', $auth->department_id)
            )

            // Если декан → видит только свой факультет
            ->when(
                $auth->roles->contains('name', 'dean'),
                fn($q) => $q->where('faculty_id', $auth->faculty_id)
            )

            ->orderBy('name')
            ->get();

        // Активные временные права
        $userPermissions = UserPermission::with(['user', 'permission'])
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->get();

        return Inertia::render('UserPermissions/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'faculties' => $faculties,
            'departments' => $departments,
            'userPermissions' => $userPermissions,
            'filters' => [
                'role' => $roleFilter,
                'faculty_id' => $facultyFilter,
                'department_id' => $departmentFilter,
                'search' => $search,
            ],
        ]);
    }



    // Массовая выдача прав
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at',
        ]);

        foreach ($validated['user_ids'] as $userId) {
            foreach ($validated['permission_ids'] as $permId) {
                \App\Models\UserPermission::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'permission_id' => $permId,
                    ],
                    [
                        // сохраняем с учётом часового пояса Алматы
                        'starts_at' => \Carbon\Carbon::parse($validated['starts_at'])->setTimezone('Asia/Almaty'),
                        'expires_at' => \Carbon\Carbon::parse($validated['expires_at'])->setTimezone('Asia/Almaty'),
                    ]
                );
            }
        }

        return back()->with('success', 'Права назначены с указанным временем.');
    }

    public function destroy($id)
    {
        UserPermission::findOrFail($id)->delete();
        return back()->with('success', 'Разрешение удалено.');
    }
}
