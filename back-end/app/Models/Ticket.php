<?php

namespace App\Models;

use App\Models\User;
use App\Models\Problem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'problem_id',
        'description',
        'attachement',
        'created_by',
        'status',
        'reserved_by',
        'resolved_by',
        'closed_by',
        'priority',
        'fonction_id',
        'departement_id',
        'localisation_id',
        'first_response_at',
        'resolution_date',
        'satisfaction_rating',
        'satisfaction_comment',
        'rated_at',
        'rated_by',
        'response_time_rating',
        'resolution_quality_rating',
        'communication_rating',
        'would_recommend',
    ];

    protected $casts = [
        'first_response_at' => 'datetime',
        'priority' => 'string',
        'rated_at' => 'datetime',
        'would_recommend' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function reservedBy()
    {
        return $this->belongsTo(User::class, 'reserved_by');
    }
    
    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
    
    public function ratedBy()
    {
        return $this->belongsTo(User::class, 'rated_by');
    }
    
    public function SupportIt()
    {
        return $this->belongsTo(User::class, 'reserved_by');
    }
    
    public function adminRole()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function problem(){
        return $this->belongsTo(Problem::class);
    }

    /**
     * Update the first_response_at timestamp when the first response is made
     */
    public function updateFirstResponseTime()
    {
        if (!$this->first_response_at) {
            $this->first_response_at = now();
            $this->save();
        }
    }
}
