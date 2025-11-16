<?php

namespace App\Exports;

use App\Models\User;
use App\Models\IndicatorValue;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class SummaryReportExport implements FromArray, WithTitle, WithStyles
{
    public function array(): array
    {
        $users = User::with(['department.faculty'])
            // ->whereHas('roles', function ($q) {
            //     $q->where('name', 'teacher');
            // })
            ->get();

        $rows = [];
        $rows[] = [
            '#',
            'Имя',
            'Факультет',
            'Кафедра',
            'План',
            'Факт',
            'План (баллы)',
            'Факт (баллы)',
        ];

        $index = 1;
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

            $rows[] = [
                $index++,
                $user->name,
                $user->department->faculty->name ?? '—',
                $user->department->name ?? '—',
                $totalPlan,
                $totalFact,
                $totalPlanPoints,
                $totalFactPoints,
            ];
        }

        return $rows;
    }

    public function title(): string
    {
        return 'Итог преподавателей';
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();

        // 🔹 Заголовок жирный, голубой фон
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE3F2FD'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // 🔹 Границы и выравнивание
        $sheet->getStyle("A1:H{$highestRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FFCCCCCC'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
        ]);

        // 🔹 Ширина колонок
        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(25);
        $sheet->getColumnDimension('E')->setWidth(12);
        $sheet->getColumnDimension('F')->setWidth(12);
        $sheet->getColumnDimension('G')->setWidth(15);
        $sheet->getColumnDimension('H')->setWidth(15);

        return [];
    }
}
