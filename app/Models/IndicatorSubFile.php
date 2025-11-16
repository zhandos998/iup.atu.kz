<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorSubFile extends Model
{
    protected $fillable = ['indicator_sub_id', 'path', 'original_name', 'uploaded_by'];

    public function sub()
    {
        return $this->belongsTo(IndicatorSub::class, 'indicator_sub_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
