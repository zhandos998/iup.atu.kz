<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Category::insert([
            ['code' => '1', 'name' => 'УЧЕБНАЯ РАБОТА'],
            ['code' => '2', 'name' => 'УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА'],
            ['code' => '3', 'name' => 'ОРГАНИЗАЦИОННО-МЕТОДИЧЕСКАЯ РАБОТА'],
            ['code' => '4', 'name' => 'НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА (НИР)'],
            ['code' => '5', 'name' => 'ВОСПИТАТЕЛЬНАЯ И ПРОФОРИЕНТАЦИОННАЯ РАБОТА'],
            ['code' => '6', 'name' => 'ПОВЫШЕНИЕ КВАЛИФИКАЦИИ'],
        ]);
    }
}
