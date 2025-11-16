<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function values()
    {
        return $this->hasMany(IndicatorValue::class);
    }

    public function subs()
    {
        return $this->hasMany(IndicatorSub::class, 'indicator_id')->orderBy('id');
    }
}
