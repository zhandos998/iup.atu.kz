<?php

namespace App\Http\Controllers;

use App\Exports\DepartmentReportExport;
use App\Models\Department;
use Maatwebsite\Excel\Facades\Excel;

class DepartmentReportController extends Controller
{
    public function export($departmentId)
    {
        $department = Department::findOrFail($departmentId);
        $fileName = 'Отчет_' . str_replace(' ', '_', $department->name) . '.xlsx';

        return Excel::download(new DepartmentReportExport($departmentId), $fileName);
    }
}
