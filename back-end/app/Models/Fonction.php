<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fonction extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    
    public function User(){
        return $this->hasMany(User::class);
    }
    public function inventaire(){
        return $this->hasMany(Inventaire::class);
    }
    public function users()
    {
        return $this->hasMany(\App\Models\User::class, 'fonction_id');
    }
}
