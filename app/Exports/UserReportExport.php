<?php

namespace App\Exports;

use App\Models\Category;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class UserReportExport implements FromArray, WithTitle, WithStyles
{
    protected $userId;
    protected $userName;

    public function __construct($userId, $userName = null)
    {
        $this->userId = $userId;
        $this->userName = $userName;
    }

    public function array(): array
    {
        $user = User::with(['department.faculty'])->find($this->userId);
        $categories = Category::with([
            'indicators.values.files',
            'indicators.subs.files',
        ])->get();

        $rows = [];

        // Заголовок
        $rows[] = ['Отчёт преподавателя'];
        $rows[] = ['Преподаватель: ' . $user->name];
        $rows[] = ['Кафедра: ' . ($user->department->name ?? '—')];
        $rows[] = ['Факультет: ' . ($user->department->faculty->name ?? '—')];
        $rows[] = ['']; // пустая строка

        $rows[] = [
            'Код',
            'Наименование',
            'Ед. изм.',
            'Очки',
            'План',
            'Факт',
            'План (баллы)',
            'Факт (баллы)',
            // 'Файлы',
        ];
        foreach ($categories as $cat) {
            $rows[] = [$cat->name]; // строка категории

            // заголовки таблицы
            // $rows[] = [
            //     'Код',
            //     'Наименование',
            //     'Ед. изм.',
            //     'Очки',
            //     'План',
            //     'Факт',
            //     'План (баллы)',
            //     'Факт (баллы)',
            //     // 'Файлы',
            // ];

            $catPlan = $catFact = 0;

            foreach ($cat->indicators as $ind) {
                $points = $ind->points ?? 1;
                $val = $ind->values->first();
                $plan = $val->plan ?? 0;
                $fact = $val->fact ?? 0;

                // if ($val) dd($val->files()->count());

                // $files = $val && optional($val->files())->count()
                //     ? $val->files()->get()->map(
                //         fn($f) =>
                //         '=HYPERLINK("' . url('storage/' . $f->path) . '","' . $f->original_name . '")'
                //     )->implode("\n")
                //     : '';

                $rows[] = [
                    $ind->code . " ",
                    $ind->title,
                    $ind->unit,
                    $points,
                    $plan,
                    $fact,
                    $plan * $points,
                    $fact * $points,
                    // $files,
                ];

                $catPlan += $plan * $points;
                $catFact += $fact * $points;

                foreach ($ind->subs as $sub) {
                    // $subFiles = optional($sub->files())->count()
                    //     ? $sub->files()->get()->map(
                    //         fn($f) =>
                    //         '=HYPERLINK("' . url('storage/' . $f->path) . '","' . $f->original_name . '")'
                    //     )->implode("\n")
                    //     : '';

                    $rows[] = [
                        $sub->code . " ",
                        '    ' . $sub->title,
                        $ind->unit,
                        $points,
                        $sub->plan ?? 0,
                        $sub->fact ?? 0,
                        ($sub->plan ?? 0) * $points,
                        ($sub->fact ?? 0) * $points,
                        // $subFiles,
                    ];

                    $catPlan += ($sub->plan ?? 0) * $points;
                    $catFact += ($sub->fact ?? 0) * $points;
                }
            }

            // итог по категории
            $rows[] = [
                '',
                'ИТОГ по категории:',
                '',
                '',
                '',
                '',
                $catPlan,
                $catFact,
                '',
            ];

            // собираем общие итоги
            $allPlan[] = $catPlan;
            $allFact[] = $catFact;
            // $rows[] = ['']; // разделитель
        }

        // 🔹 общий итог по всем категориям
        $totalPlan = array_sum($allPlan ?? []);
        $totalFact = array_sum($allFact ?? []);

        $rows[] = [
            '',
            'ИТОГ ОБЩИЙ:',
            '',
            '',
            '',
            '',
            $totalPlan,
            $totalFact,
            '',
        ];

        return $rows;
    }

    public function title(): string
    {
        return mb_substr($this->userName ?? 'Пользователь', 0, 31);
    }

    public function styles(Worksheet $sheet)
    {
        // Получаем последнюю строку
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        // Задаём ширину колонок
        // foreach (range('A', 'I') as $col) {
        //     $sheet->getColumnDimension($col)->setAutoSize(true);
        // }
        $sheet->getColumnDimension('A')->setWidth(8);   // Код
        $sheet->getColumnDimension('B')->setWidth(55);  // Наименование
        $sheet->getColumnDimension('C')->setWidth(12);  // Ед. изм.
        $sheet->getColumnDimension('D')->setWidth(8);   // Очки
        $sheet->getColumnDimension('E')->setWidth(10);  // План
        $sheet->getColumnDimension('F')->setWidth(10);  // Факт
        $sheet->getColumnDimension('G')->setWidth(15);  // План (баллы)
        $sheet->getColumnDimension('H')->setWidth(15);  // Факт (баллы)

        $sheet->getStyle("A1:A{$highestRow}")
            ->getNumberFormat()
            ->setFormatCode(NumberFormat::FORMAT_TEXT);

        // Применяем стили
        $sheet->getStyle("B8:H{$highestRow}")->applyFromArray([
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FFCCCCCC'],
                ],
            ],
        ]);

        $sheet->getStyle("A6:H{$highestRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // черный
                ],
            ],
        ]);
        // Категории — голубой фон
        foreach (range(1, $highestRow) as $row) {
            $value = $sheet->getCell("A{$row}")->getValue();
            if ($value && !str_contains($value, '↳') && !str_contains($value, 'ИТОГ')) {
                if (strlen($value) > 3 && !preg_match('/^\d/', $value)) {
                    $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                        'font' => ['bold' => true, 'size' => 12],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['argb' => 'FFE3F2FD'],
                        ],
                    ]);
                }
            }
        }

        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
        ];
    }
}
