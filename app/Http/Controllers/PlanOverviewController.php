<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Faculty;
use App\Models\IndicatorValue;
use App\Models\User;

class PlanOverviewController extends Controller
{
    public function index()
    {
        $faculties = Faculty::with([
            'departments.users.roles', // кафедры → пользователи → роли
        ])->get();

        return Inertia::render('Plans/Index', [
            'faculties' => $faculties,
        ]);
    }

    public function show($userId)
    {
        $user = User::with(['department.faculty'])->findOrFail($userId);

        // Загружаем все категории с индикаторами и их подиндикаторами
        $categories = Category::with([
            'indicators' => function ($q) use ($userId) {
                $q->with([
                    // значения для индикаторов
                    'values' => function ($v) use ($userId) {
                        $v->where('user_id', $userId)
                            ->with('files:id,indicator_value_id,path,original_name');
                    },
                    // подиндикаторы и их файлы
                    'subs' => function ($s) use ($userId) {
                        $s->where('user_id', $userId)
                            ->with('files:id,indicator_sub_id,path,original_name');
                    },
                ]);
            },
        ])->get();

        return Inertia::render('Plans/Show', [
            'teacher' => $user,
            'categories' => $categories,
        ]);
    }

    public function summary()
    {
        $users = User::with(['department.faculty'])
            // ->whereHas('roles', function ($q) {
            //     $q->where('name', 'teacher');
            // })
            ->get();

        $data = [];

        foreach ($users as $user) {
            $values = IndicatorValue::with('indicator')
                ->where('user_id', $user->id)
                ->get();

            $totalPlan = 0;
            $totalFact = 0;
            $totalPlanPoints = 0;
            $totalFactPoints = 0;

            foreach ($values as $v) {
                $points = $v->indicator->points ?? 1;
                $plan = (int)($v->plan ?? 0);
                $fact = (int)($v->fact ?? 0);

                $totalPlan += $plan;
                $totalFact += $fact;
                $totalPlanPoints += $plan * $points;
                $totalFactPoints += $fact * $points;
            }

            $data[] = [
                'id' => $user->id,
                'name' => $user->name,
                'faculty' => $user->department->faculty->name ?? '—',
                'department' => $user->department->name ?? '—',
                'plan' => $totalPlan,
                'fact' => $totalFact,
                'plan_points' => $totalPlanPoints,
                'fact_points' => $totalFactPoints,
            ];
        }

        return Inertia::render('Plans/Summary', [
            'users' => $data,
        ]);
    }
}
