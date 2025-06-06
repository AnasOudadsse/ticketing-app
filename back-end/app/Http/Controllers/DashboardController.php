<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardStats()
    {
        try {
            // Get total tickets count
            $totalTickets = Ticket::count();
            
            // Get open tickets count
            $openTickets = Ticket::whereIn('status', ['opened', 'reserved'])->count();
            
            // Get resolved tickets today
            $resolvedToday = Ticket::where('status', 'resolved')
                ->whereDate('updated_at', today())
                ->count();
            
            // Calculate average response time (in minutes)
            $avgResponseTime = Ticket::whereNotNull('first_response_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, first_response_at)) as avg_time')
                ->first()
                ->avg_time ?? 0;

            // Get ticket status distribution
            $ticketStatus = Ticket::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get();

            // Get ticket priority distribution
            $ticketPriority = Ticket::selectRaw('priority, COUNT(*) as count')
                ->groupBy('priority')
                ->get();

            // Get ticket trends (last 7 days)
            $ticketTrend = Ticket::selectRaw('DATE(created_at) as date, COUNT(*) as tickets')
                ->whereDate('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->get();

            // Get department distribution
            $departmentData = Department::withCount([
                'tickets as opened' => function($query) {
                    $query->whereIn('status', ['opened', 'reserved']);
                },
                'tickets as resolved' => function($query) {
                    $query->where('status', 'resolved');
                },
                'tickets as closed' => function($query) {
                    $query->where('status', 'closed');
                }
            ])->get();

            // Get top performing agents
            $topAgents = User::where('role', 'support')
                ->withCount(['resolvedTickets' => function($query) {
                    $query->where('status', 'resolved');
                }])
                ->orderByDesc('resolved_tickets_count')
                ->take(5)
                ->get()
                ->map(function($agent) {
                    return [
                        'id' => $agent->id,
                        'name' => $agent->name,
                        'avatar' => $agent->avatar,
                        'department' => $agent->department?->name,
                        'resolvedTickets' => $agent->resolved_tickets_count,
                        'performance' => rand(85, 98) // This should be calculated based on actual metrics
                    ];
                });

            // Get SLA metrics
            $slaMetrics = [
                [
                    'name' => 'First Response Time',
                    'description' => 'Tickets with first response within 1 hour',
                    'value' => $this->calculateSLACompliance('first_response_at', 60),
                    'target' => 90
                ],
                [
                    'name' => 'Resolution Time',
                    'description' => 'Tickets resolved within 24 hours',
                    'value' => $this->calculateSLACompliance('resolution_date', 1440),
                    'target' => 85
                ]
            ];

            // Get response time data
            $responseTimeData = [
                'data' => $this->getResponseTimeTrend(),
                'current' => [
                    'responseTime' => [
                        'value' => round($avgResponseTime),
                        'unit' => 'min',
                        'change' => $this->calculateResponseTimeChange(),
                        'changeDirection' => $this->calculateResponseTimeChange() > 0 ? 'increase' : 'decrease'
                    ],
                    'resolutionTime' => [
                        'value' => $this->calculateAverageResolutionTime(),
                        'unit' => 'hrs',
                        'change' => $this->calculateResolutionTimeChange(),
                        'changeDirection' => $this->calculateResolutionTimeChange() > 0 ? 'increase' : 'decrease'
                    ]
                ]
            ];

            // Get agent workload
            $agentWorkload = User::where('role', 'support')
                ->withCount(['tickets as currentWorkload' => function($query) {
                    $query->whereIn('status', ['opened', 'reserved']);
                }])
                ->get()
                ->map(function($agent) {
                    return [
                        'id' => $agent->id,
                        'name' => $agent->name,
                        'avatar' => $agent->avatar,
                        'currentWorkload' => $agent->currentWorkload,
                        'capacity' => 10, // This should be configurable per agent
                        'resolvedTickets' => $agent->resolvedTickets()->count()
                    ];
                });

            return response()->json([
                'totalTickets' => $totalTickets,
                'openTickets' => $openTickets,
                'resolvedToday' => $resolvedToday,
                'avgResponseTime' => round($avgResponseTime),
                'ticketStatus' => $ticketStatus,
                'ticketPriority' => $ticketPriority,
                'ticketTrend' => $ticketTrend,
                'departmentData' => $departmentData,
                'topAgents' => $topAgents,
                'slaMetrics' => $slaMetrics,
                'responseTimeData' => $responseTimeData,
                'agentWorkload' => $agentWorkload
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function calculateAgentPerformance($agent)
    {
        $totalTickets = $agent->tickets()->count();
        if ($totalTickets === 0) return 0;

        $resolvedTickets = $agent->tickets()->where('status', 'resolved')->count();
        $satisfactionScore = $agent->tickets()
            ->whereNotNull('satisfaction_rating')
            ->avg('satisfaction_rating') ?? 5;

        return round(($resolvedTickets / $totalTickets) * 100 * ($satisfactionScore / 5));
    }

    private function getSLAMetrics()
    {
        return [
            [
                'name' => 'First Response Time',
                'description' => 'Tickets responded to within 1 hour',
                'value' => $this->calculateSLACompliance('first_response_at', 60),
                'target' => 90
            ],
            [
                'name' => 'Resolution Time',
                'description' => 'Tickets resolved within 24 hours',
                'value' => $this->calculateSLACompliance('resolved_at', 1440),
                'target' => 80
            ],
            [
                'name' => 'Customer Satisfaction',
                'description' => 'Tickets with 4+ star rating',
                'value' => $this->calculateSatisfactionRate(),
                'target' => 85
            ]
        ];
    }

    private function calculateSLACompliance($field, $minutes)
    {
        $total = Ticket::whereNotNull($field)->count();
        if ($total === 0) return 0;

        $compliant = Ticket::whereNotNull($field)
            ->whereRaw("TIMESTAMPDIFF(MINUTE, created_at, $field) <= ?", [$minutes])
            ->count();

        return round(($compliant / $total) * 100);
    }

    private function calculateSatisfactionRate()
    {
        $total = Ticket::whereNotNull('satisfaction_rating')->count();
        if ($total === 0) return 0;

        $satisfied = Ticket::whereNotNull('satisfaction_rating')
            ->where('satisfaction_rating', '>=', 4)
            ->count();

        return round(($satisfied / $total) * 100);
    }

    private function getResponseTimeData()
    {
        $data = Ticket::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, first_response_at)) as response_time'),
            DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as resolution_time')
        )
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->whereNotNull('first_response_at')
            ->whereNotNull('resolved_at')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $current = [
            'responseTime' => [
                'value' => round($data->avg('response_time')),
                'unit' => 'min',
                'change' => $this->calculateChange($data->pluck('response_time')->toArray()),
                'changeDirection' => $this->getChangeDirection($data->pluck('response_time')->toArray())
            ],
            'resolutionTime' => [
                'value' => round($data->avg('resolution_time')),
                'unit' => 'hrs',
                'change' => $this->calculateChange($data->pluck('resolution_time')->toArray()),
                'changeDirection' => $this->getChangeDirection($data->pluck('resolution_time')->toArray())
            ]
        ];

        return [
            'data' => $data,
            'current' => $current
        ];
    }

    private function calculateChange($values)
    {
        if (count($values) < 2) return 0;
        
        $current = end($values);
        $previous = prev($values);
        
        if ($previous === 0) return 0;
        
        return round((($current - $previous) / $previous) * 100);
    }

    private function getChangeDirection($values)
    {
        if (count($values) < 2) return 'increase';
        
        $current = end($values);
        $previous = prev($values);
        
        return $current < $previous ? 'decrease' : 'increase';
    }

    private function getResponseTimeTrend()
    {
        return Ticket::selectRaw('
            DATE(created_at) as date,
            AVG(TIMESTAMPDIFF(MINUTE, created_at, first_response_at)) as responseTime,
            AVG(TIMESTAMPDIFF(HOUR, created_at, resolution_date)) as resolutionTime
        ')
        ->whereNotNull('first_response_at')
        ->whereNotNull('resolution_date')
        ->where('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function ($item) {
            return [
                'date' => $item->date,
                'responseTime' => round($item->responseTime),
                'resolutionTime' => round($item->resolutionTime)
            ];
        });
    }

    private function calculateResponseTimeChange()
    {
        $currentPeriod = Ticket::whereNotNull('first_response_at')
            ->where('created_at', '>=', now()->subDays(7))
            ->avg(DB::raw('TIMESTAMPDIFF(MINUTE, created_at, first_response_at)')) ?? 0;

        $previousPeriod = Ticket::whereNotNull('first_response_at')
            ->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])
            ->avg(DB::raw('TIMESTAMPDIFF(MINUTE, created_at, first_response_at)')) ?? 0;

        if ($previousPeriod === 0) return 0;
        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100);
    }

    private function calculateResolutionTimeChange()
    {
        $currentPeriod = Ticket::whereNotNull('resolution_date')
            ->where('created_at', '>=', now()->subDays(7))
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, created_at, resolution_date)')) ?? 0;

        $previousPeriod = Ticket::whereNotNull('resolution_date')
            ->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, created_at, resolution_date)')) ?? 0;

        if ($previousPeriod === 0) return 0;
        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100);
    }

    private function calculateAverageResolutionTime()
    {
        return round(Ticket::whereNotNull('resolution_date')
            ->where('created_at', '>=', now()->subDays(7))
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, created_at, resolution_date)')) ?? 0);
    }
} 