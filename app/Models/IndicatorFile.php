<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorFile extends Model
{
    //
    protected $fillable = [
        'indicator_value_id',
        'path',
        'original_name',
        'uploaded_by',
    ];

    public function indicatorValue()
    {
        return $this->belongsTo(IndicatorValue::class);
    }
}
