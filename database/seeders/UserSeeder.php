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
        $roles = [
            'admin',
            'teacher',
            'student',
            'methodist',
            'dean'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Создаём пользователей
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@iup.kz',
                'password' => Hash::make('password'),
                'roles' => ['admin'],
            ],
            [
                'name' => 'Teacher User',
                'email' => 'teacher@iup.kz',
                'password' => Hash::make('password'),
                'roles' => ['teacher'],
            ],
            [
                'name' => 'Student User',
                'email' => 'student@iup.kz',
                'password' => Hash::make('password'),
                'roles' => ['student'],
            ],
            [
                'name' => 'Methodist User',
                'email' => 'methodist@iup.kz',
                'password' => Hash::make('password'),
                'roles' => ['methodist'],
            ],
            [
                'name' => 'Dean User',
                'email' => 'dean@iup.kz',
                'password' => Hash::make('password'),
                'roles' => ['dean'],
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                ]
            );

            // Привязываем роли
            $roleIds = Role::whereIn('name', $data['roles'])->pluck('id');
            $user->roles()->sync($roleIds);
        }
    }
}
