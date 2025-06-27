<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departements';

    protected $fillable = [
        'name',
        'description',
        'manager_id'
    ];

    /**
     * Get the users that belong to this department
     */
    public function users()
    {
        return $this->hasMany(User::class, 'departement_id');
    }

    /**
     * Get the manager of this department
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get the tickets associated with this department through users
     */
    public function tickets()
    {
        return $this->hasManyThrough(
            Ticket::class,
            User::class,
            'department_id', // Foreign key on users table
            'created_by',    // Foreign key on tickets table
            'id',           // Local key on departments table
            'id'            // Local key on users table
        );
    }
} 