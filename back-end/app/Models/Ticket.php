<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;
    protected $fillable = [
        'problem_id', 'description', 'status', 'attachement', 'supportItID', 'adminID', 'clientID', 'resolutionDate'
    ];

    public function Problem(){
        return $this->hasMany(Ticket::class);
    }

    public function client()
{
    return $this->belongsTo(Client::class);
}

public function admin()
{
    return $this->belongsTo(Admin::class);
}

public function supportIt()
{
    return $this->belongsTo(SupportIt::class);
}
}




