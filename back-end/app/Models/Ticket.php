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
        'description',
        'problem_id',
        'status',
        'priority',
        'created_by',
        'reserved_by',
        'admin_id',
        'resolution_date',
        'attachement',
        'first_response_at',
    ];

    protected $casts = [
        'first_response_at' => 'datetime',
        'priority' => 'string',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
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
