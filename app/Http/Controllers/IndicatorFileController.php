<?php

namespace App\Http\Controllers;

use App\Models\IndicatorFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class IndicatorFileController extends Controller
{
    //
    public function destroy(IndicatorFile $indicatorFile)
    {
        // Проверим, что пользователь имеет право удалять (загрузил сам)
        if ($indicatorFile->uploaded_by !== auth()->id()) {
            abort(403, 'Недостаточно прав');
        }

        // Удаляем физический файл
        if (Storage::disk('public')->exists($indicatorFile->path)) {
            Storage::disk('public')->delete($indicatorFile->path);
        }

        // Удаляем запись из БД
        $indicatorFile->delete();

        return back()->with('success', 'Файл удалён');
    }
}
