<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialisation extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function supportITs()
    {
        return $this->belongsToMany(SupportIt::class, 'support_its_specialisations');
    }
}
