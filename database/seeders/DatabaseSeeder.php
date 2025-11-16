<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            FacultySeeder::class,
            DepartmentSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            IndicatorSeeder::class,
            PermissionSeeder::class,
            IndicatorPermissionSeeder::class,
        ]);
    }
}
// php artisan db:seed --class= UserSeeder