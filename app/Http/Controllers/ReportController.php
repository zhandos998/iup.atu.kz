<?php

namespace App\Http\Controllers;

use App\Exports\UserReportExport;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function show($userId)
    {
        $user = User::with(['department.faculty'])->findOrFail($userId);

        // Загружаем все категории с показателями и подиндикаторами
        $categories = Category::with([
            'indicators' => function ($q) use ($userId) {
                $q->with([
                    'values' => function ($v) use ($userId) {
                        $v->where('user_id', $userId)
                            ->with('files:id,indicator_value_id,path,original_name');
                    },
                    'subs' => function ($s) use ($userId) {
                        $s->where('user_id', $userId)
                            ->with('files:id,indicator_sub_id,path,original_name');
                    },
                ]);
            },
        ])->get();

        // Подсчёт итогов
        $totalPlanPoints = 0;
        $totalFactPoints = 0;

        foreach ($categories as $cat) {
            foreach ($cat->indicators as $ind) {
                $points = $ind->points ?? 1;
                $val = $ind->values->first();
                if ($val) {
                    $totalPlanPoints += ($val->plan ?? 0) * $points;
                    $totalFactPoints += ($val->fact ?? 0) * $points;
                }
            }
        }

        return Inertia::render('Reports/Show', [
            'teacher' => $user,
            'categories' => $categories,
            'totalPlanPoints' => $totalPlanPoints,
            'totalFactPoints' => $totalFactPoints,
        ]);
    }

    public function export($userId)
    {
        $user = User::findOrFail($userId);
        $fileName = 'Отчёт_' . str_replace(' ', '_', $user->name) . '.xlsx';

        return Excel::download(new UserReportExport($userId), $fileName);
    }
}
