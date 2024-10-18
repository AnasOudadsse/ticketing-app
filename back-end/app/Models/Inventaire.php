<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventaire extends Model
{
    use HasFactory;
    protected $fillable = ['materiel','serialNumber','fonction_id','departement_id','emplacement','statut'];
    public function fonction()
    {
        return $this->belongsTo(Fonction::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

}
