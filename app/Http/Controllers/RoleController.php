<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $role->load('permissions');

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        // Принудительно превращаем строку в массив, если что-то пошло не так
        $permissions = is_array($validated['permissions'] ?? null)
            ? $validated['permissions']
            : explode(',', $request->input('permissions', ''));

        $permissions = array_filter($permissions); // убираем пустые элементы

        $role->permissions()->sync($permissions);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Права роли обновлены.');
    }

    public function attachPermission(Role $role, $permissionId)
    {
        if (!$role->permissions()->where('permission_id', $permissionId)->exists()) {
            $role->permissions()->attach($permissionId);
        }

        return back()->with('success', 'Разрешение добавлено.');
    }

    public function detachPermission(Role $role, $permissionId)
    {
        $role->permissions()->detach($permissionId);

        return back()->with('success', 'Разрешение удалено.');
    }
}
