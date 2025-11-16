<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\IndicatorFile;
use App\Models\IndicatorSub;
use App\Models\IndicatorSubFile;
use App\Models\IndicatorValue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IndicatorSubController extends Controller
{
    public function store(Request $request, Indicator $indicator)
    {
        // $validated = $request->validate([
        //     'title' => 'nullable|string|max:255',
        //     'plan' => 'nullable|string|max:255',
        //     'fact' => 'nullable|string|max:255',
        // ]);

        $lastSub = IndicatorSub::where('indicator_id', $indicator->id)->latest('id')->first();
        $newCode = $indicator->code . '.' . chr(97 + ($lastSub ? ($lastSub->id % 26) : 0)); // a, b, c...

        $sub = IndicatorSub::create([
            'indicator_id' => $indicator->id,
            'user_id' => Auth::id(),
            'code' => $newCode,
            // 'title' => $validated['title'] ?? null,
            // 'plan' => $validated['plan'] ?? null,
            // 'fact' => $validated['fact'] ?? null,
        ]);

        return back()->with('success', 'Подиндикатор добавлен.');
    }

    // IndicatorSubController.php
    public function update(Request $request, IndicatorSub $indicatorSub)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'plan' => 'nullable|string|max:255',
            'fact' => 'nullable|string|max:255',
            'files.*' => 'file|max:10240',
        ]);



        $data = [
            'title' => $validated['title'] ?? $indicatorSub->title,
            'plan' => $validated['plan'] ?? $indicatorSub->plan,
            'fact' => $validated['fact'] ?? $indicatorSub->fact,
        ];


        $indicatorSub->update($data);

        // добавление файлов
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('indicator_subs', 'public');
                $indicatorSub->files()->create([
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_by' => auth()->id(),
                ]);
            }
        }

        $this->recalculateParent($indicatorSub->indicator_id);


        return back()->with('success', 'Подиндикатор обновлён.');
    }

    public function destroyFile($fileId)
    {
        $file = IndicatorSubFile::findOrFail($fileId);

        if (Storage::disk('public')->exists($file->path)) {
            Storage::disk('public')->delete($file->path);
        }

        $file->delete();

        return back()->with('success', 'Файл удалён.');
    }


    public function destroy(IndicatorSub $indicatorSub)
    {
        $parentId = $indicatorSub->indicator_id; // поле связи с родителем

        // удаляем физические файлы и их записи
        $files = $indicatorSub->files;
        $allSubFiles = IndicatorSubFile::where(
            'indicator_sub_id',
            $indicatorSub->id
        )->get();
        // dd($allSubFiles);
        foreach ($allSubFiles as $file) {
            if (Storage::disk('public')->exists($file->path)) {
                Storage::disk('public')->delete($file->path);
            }
            $file->delete();
        }

        // удаляем сам подиндикатор
        $indicatorSub->delete();

        // пересчёт родителя (если нужно)
        $this->recalculateParent($parentId);

        return back()->with('success', 'Подиндикатор и его файлы удалены.');
    }

    private function recalculateParent($parentId)
    {
        $parent = Indicator::find($parentId);
        if (!$parent) return;

        // суммируем все подиндикаторы
        $totalPlan = $parent->subs()->sum('plan');
        $totalFact = $parent->subs()->sum('fact');

        // находим или создаём значение для пользователя
        $value = IndicatorValue::firstOrCreate([
            'indicator_id' => $parent->id,
            'user_id' => auth()->id(),
        ]);

        $value->update([
            'plan' => $totalPlan,
            'fact' => $totalFact,
        ]);

        // --- 🔽 Новая часть: копируем файлы из подиндикаторов в indicator_files
        $allSubFiles = IndicatorSubFile::whereIn(
            'indicator_sub_id',
            $parent->subs()->pluck('id')
        )->get();

        // Удаляем старые файлы родителя, чтобы не дублировались
        IndicatorFile::where('indicator_value_id', $value->id)->delete();

        foreach ($allSubFiles as $subFile) {
            \App\Models\IndicatorFile::create([
                'indicator_value_id' => $value->id,
                'path' => $subFile->path,
                'original_name' => $subFile->original_name,
                'uploaded_by' => $subFile->uploaded_by,
            ]);
        }
    }
}
