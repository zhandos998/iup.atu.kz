<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Faculty;
use App\Models\Department;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            ['name' => 'admin', 'label' => 'Админ'],
            ['name' => 'dean', 'label' => 'Декан факультета'],
            ['name' => 'head', 'label' => 'Заведующий кафедры'],
            ['name' => 'teacher', 'label' => 'Учитель'],
        ]);
    }
}
