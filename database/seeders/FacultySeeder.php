<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faculty;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Faculty::insert([
            ['name' => 'Факультет пищевых технологий'],
            ['name' => 'Факультет дизайна, технологий текстиля и одежды'],
            ['name' => 'Факультет экономики и бизнеса'],
            ['name' => 'Факультет инжиниринга и информационных технологий'],
        ]);
    }
}
