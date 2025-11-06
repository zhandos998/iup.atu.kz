<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['key' => 'edit_plan', 'label' => 'Редактировать план'],
            ['key' => 'edit_fact', 'label' => 'Редактировать факт'],
            ['key' => 'upload_file', 'label' => 'Добавлять файлы'],
            ['key' => 'delete_file', 'label' => 'Удалять файлы'],
        ];

        Permission::insert($permissions);
    }
}
