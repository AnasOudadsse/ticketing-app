<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportIt extends Model
{
    use HasFactory;

    protected $fillable = ['supportIt_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function specialisations()
    {
        return $this->belongsToMany(Specialisation::class, 'support_its_specialisations');
    }
}
