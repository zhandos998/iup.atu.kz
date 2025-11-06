<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorPermission extends Model
{
    //

    protected $fillable = [
        'indicator_id',
        'user_id',
        'role',
        'can_edit_plan',
        'can_edit_fact',
        'can_add_files',
        'can_delete_files',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
}
