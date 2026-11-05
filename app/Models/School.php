<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $guarded = [];

    public function classRooms()
    {
        return $this->hasMany(ClassRoom::class);
    }
}
