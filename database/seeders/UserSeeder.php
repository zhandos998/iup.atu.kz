<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаём роли, если их ещё нет
        // $roles = [
        //     'admin',
        //     'teacher',
        //     'head',
        //     'dean'
        // ];

        // foreach ($roles as $roleName) {
        //     Role::firstOrCreate(['name' => $roleName]);
        // }

        // Создаём пользователей
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@iup.kz',
                'faculty_id' => 1,
                'department_id' => 1,
                'password' => Hash::make('password'),
                'roles' => ['admin'],
            ],
            [
                'name' => 'Teacher User',
                'email' => 'teacher@iup.kz',
                'faculty_id' => 2,
                'department_id' => 6,
                'password' => Hash::make('password'),
                'roles' => ['teacher'],
            ],
            [
                'name' => 'Dean User',
                'email' => 'dean@iup.kz',
                'faculty_id' => 3,
                'department_id' => 11,
                'password' => Hash::make('password'),
                'roles' => ['dean'],
            ],
            [
                'name' => 'Head User',
                'email' => 'head@iup.kz',
                'faculty_id' => 4,
                'department_id' => 14,
                'password' => Hash::make('password'),
                'roles' => ['head'],
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                    'faculty_id' => $data['faculty_id'],
                    'department_id' => $data['department_id'],
                ]
            );

            // Привязываем роли
            $roleIds = Role::whereIn('name', $data['roles'])->pluck('id');
            $user->roles()->sync($roleIds);
        }
    }
}
