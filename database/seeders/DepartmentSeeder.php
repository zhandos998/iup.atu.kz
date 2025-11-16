<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::insert([
            ['faculty_id' => 1, 'name' => 'Кафедра «Технология хлебопродуктов и перерабатывающих производств»'],
            ['faculty_id' => 1, 'name' => 'Кафедра «Технология продуктов питания»'],
            ['faculty_id' => 1, 'name' => 'Кафедра «Безопасность и качество пищевых продуктов»'],
            ['faculty_id' => 1, 'name' => 'Кафедра «Химия, химическая технология и экология»'],
            ['faculty_id' => 1, 'name' => 'Кафедра «Пищевая биотехнология»'],

            ['faculty_id' => 2, 'name' => 'Кафедра «Технология и конструирование изделий и товаров»'],
            ['faculty_id' => 2, 'name' => 'Кафедра «Технология текстильного производства»'],
            ['faculty_id' => 2, 'name' => 'Кафедра «Дизайн»'],
            ['faculty_id' => 2, 'name' => 'Кафедра «Физическое воспитания»'],
            ['faculty_id' => 2, 'name' => 'Кафедра «Государственный и иностранные языки»'],

            ['faculty_id' => 3, 'name' => 'Кафедра «Бухгалтерский учет и финансы»'],
            ['faculty_id' => 3, 'name' => 'Кафедра «Туризм и сервисное обслуживание»'],
            ['faculty_id' => 3, 'name' => 'Кафедра «Экономика и менеджмент»'],

            ['faculty_id' => 4, 'name' => 'Кафедра «Машины и аппараты производственных процессов»'],
            ['faculty_id' => 4, 'name' => 'Кафедра «Информационные системы»'],
            ['faculty_id' => 4, 'name' => 'Кафедра «Социально-гуманитарных дисциплин»'],
            ['faculty_id' => 4, 'name' => 'Кафедра «Автоматизация и робототехника»'],
            ['faculty_id' => 4, 'name' => 'Кафедра «Высшая математика и физика»'],
            ['faculty_id' => 4, 'name' => 'Кафедра «Компьютерная инженерия»'],
        ]);
    }
}
