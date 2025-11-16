<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Indicator;
use App\Models\IndicatorValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\IndicatorFile;

class IndicatorController extends Controller
{
    public function index(Category $category)
    {
        $indicators = Indicator::where('category_id', $category->id)->get();
        return Inertia::render('Indicators/Index', [
            'category' => $category,
            'indicators' => $indicators
        ]);
    }

    public function store(Request $request, Indicator $indicator)
    {
        $data = $request->validate([
            'plan_' . $indicator->id => 'nullable|string',
            'fact_' . $indicator->id => 'nullable|string',
            'files_' . $indicator->id . '.*' => 'file|max:10240',
        ]);

        // dd($data);

        $value = IndicatorValue::updateOrCreate(
            [
                'indicator_id' => $indicator->id,
                'user_id' => $request->user()->id,
            ],
            [
                'plan' => $data['plan_' . $indicator->id] ?? null,
                'fact' => $data['fact_' . $indicator->id] ?? null,
            ]
        );

        if ($request->hasFile('files_' . $indicator->id)) {
            foreach ($request->file('files_' . $indicator->id) as $file) {
                $path = $file->store('uploads', 'public');

                IndicatorFile::create([
                    'indicator_value_id' => $value->id,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_by' => $request->user()->id,
                ]);
            }
        }

        return back()->with('success', 'Сохранено');
    }

    public function toggle(IndicatorValue $indicatorValue)
    {
        // Только для админов
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Недостаточно прав');
        }

        $indicatorValue->update([
            'is_locked' => ! $indicatorValue->is_locked,
        ]);

        return back()->with('success', 'Статус блокировки обновлён');
    }
}
