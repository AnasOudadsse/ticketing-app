<?php

namespace App\Models;

use App\Models\Ticket;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password', 'role','specialisation_id', 'fonction_id', 'departement_id', 'localisation_id',
        "role_in_creation"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string',
    ];
    
    public function fonction()
    {
        return $this->belongsTo(Fonction::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function localisation()
    {
        return $this->belongsTo(Localisation::class);
    }
    public function createdTickets()
    {
        return $this->hasMany(Ticket::class, 'created_by');
    }
    public function reservedTickets()
    {
        return $this->hasMany(Ticket::class, 'reserved_by');
    }
    public function resolvedTickets()
    {
        return $this->hasMany(Ticket::class, 'reserved_by')
            ->where('status', 'resolved');
    }
    public function admin()
    {
        return $this->hasMany(Ticket::class, 'admin_id');
    }
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'created_by')
            ->orWhere('reserved_by', $this->id)
            ->orWhere('admin_id', $this->id);
    }
    public function specialisations()
    {
        return $this->belongsToMany(Specialisation::class, 'specialisation_user');
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Scope a query to only include users with a specific role
     */
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
