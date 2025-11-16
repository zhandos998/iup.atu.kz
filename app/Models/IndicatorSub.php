<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorSub extends Model
{
    protected $fillable = [
        'indicator_id',
        'user_id',
        'code',
        'title',
        'plan',
        'fact',
        'files'
    ];

    protected $casts = [
        'files' => 'array',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function files()
    {
        return $this->hasMany(IndicatorSubFile::class, 'indicator_sub_id');
    }
}
