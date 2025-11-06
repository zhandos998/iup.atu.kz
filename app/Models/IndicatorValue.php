<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorValue extends Model
{
    protected $guarded = [];

    // protected $fillable = [
    //     'indicator_id',
    //     'user_id',
    //     'plan',
    //     'fact',
    //     'is_locked',
    // ];

    //
    public function files()
    {
        return $this->hasMany(\App\Models\IndicatorFile::class);
    }
}
