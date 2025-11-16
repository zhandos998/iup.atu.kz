<?php

namespace App\Exports;

use App\Models\Department;
use App\Exports\UserReportExport;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DepartmentReportExport implements WithMultipleSheets
{
    protected $departmentId;

    public function __construct($departmentId)
    {
        $this->departmentId = $departmentId;
    }

    public function sheets(): array
    {
        $department = Department::with(['users'])->findOrFail($this->departmentId);

        $sheets = [];

        foreach ($department->users as $user) {
            // Для каждого пользователя создаём отдельный лист
            $sheets[] = new UserReportExport($user->id, $user->name);
        }

        return $sheets;
    }
}
