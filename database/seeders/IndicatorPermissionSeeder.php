<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\IndicatorPermission;
use App\Models\Indicator;

class IndicatorPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $indicators = Indicator::all();

        // foreach ($indicators as $indicator) {
        //     IndicatorPermission::create([
        //         'indicator_id' => $indicator->id,
        //         'role' => 'teacher',
        //         'can_edit_plan' => true,
        //         'can_edit_fact' => true,
        //         'can_add_files' => true,
        //         'can_delete_files' => true,
        //     ]);

        //     IndicatorPermission::create([
        //         'indicator_id' => $indicator->id,
        //         'role' => 'student',
        //         'can_edit_plan' => false,
        //         'can_edit_fact' => false,
        //         'can_add_files' => false,
        //         'can_delete_files' => false,
        //     ]);
        // }
    }
}
