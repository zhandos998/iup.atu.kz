<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\IndicatorValue;
use App\Models\IndicatorPermission;

class DashboardController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();
        $roleNames = $user->roles->pluck('name');

        $categories = Category::with(['indicators.values.files'])->get();

        foreach ($categories as $category) {
            foreach ($category->indicators as $indicator) {
                $perm = IndicatorPermission::where('indicator_id', $indicator->id)
                    ->where(function ($q) use ($user, $roleNames) {
                        $q->where('user_id', $user->id)
                            ->orWhereIn('role', $roleNames);
                    })
                    ->orderByRaw('user_id IS NULL') // приоритет индивидуальных прав
                    ->first();

                $indicator->permissions = $perm ?? [
                    'can_edit_plan' => false,
                    'can_edit_fact' => false,
                    'can_add_files' => false,
                    'can_delete_files' => false,
                ];
            }
        }

        return Inertia::render('Dashboard/Index', [
            'user' => $user->only('id', 'name', 'email'),
            'categories' => $categories,
        ]);
    }
}
