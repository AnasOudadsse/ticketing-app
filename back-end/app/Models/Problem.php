<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'type', 'specification'];
    public function Ticket(){
        return $this->hasMany(Ticket::class);
    }
} 
