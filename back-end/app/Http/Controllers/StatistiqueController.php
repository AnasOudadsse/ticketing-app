<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function allUsersCount(){
        $allUsers = User::count();
        $usersLastDay = User::where('created_at', '>=', now()->subDay())->count();
        return response()->json([
            'totalUsers' => $allUsers,
            'usersLastDay' => $usersLastDay
        ]);
    }
    public function userRoles(){
        $UserAdmin=User::where('role','admin')->count();
        $UserClient=User::where('role','client')->count();
        $UserSupport=User::where('role','supportIt')->count();
        $allUsers = User::all()->count();

        return response()->json([
            [
                "title"=> "admins",
                'number'=>$UserAdmin,
            ],
            [
                "title" => "clients",
                'number'=>$UserClient,
            ],
            [
                "title" => "support",
                'number'=>$UserSupport
            ],
            [
                "title" => "Users",
                "number" => $allUsers,
            ]
        ]);
    }
    public function allTicketsCount(){
        $allTickets = Ticket::count();
        $ticketsLastDay = Ticket::where('created_at', '>=', now()->subDay())->count();
        return response()->json([
            'totalTickets' => $allTickets,
            'ticketsLastDay' => $ticketsLastDay
        ]);
    }
    public function statusTickets(){
        $publishedCount = Ticket::where('status', 'published')->count();
        $reservedCount = Ticket::where('status', 'reserved')->count();
        $resolvedCount = Ticket::where('status', 'resolved')->count();
        $assignedCount = Ticket::where('status', 'assigned')->count();

        return response()->json([
            'publishedCount'=>$publishedCount,
            'reservedCount'=>$reservedCount,
            'resolvedCount'=>$resolvedCount,
            'assignedCount'=>$assignedCount
        ]);
    }
    public function monthlyTickets(){
        $startDate = Carbon::now()->subMonths(6)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $ticketsPerMonth = Ticket::select(DB::raw('COUNT(id) as count'), DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month', 'ASC')
            ->get();
            return response()->json([
                'ticketsPerMonth'=>$ticketsPerMonth
            ]);
    }

    public function statistiques() {
        $users = User::all()->count();
        $tickets = Ticket::all()->count();
        $material = 200;
        $materialActive = 150;
        $materialInActive = 50;

        return response()->json(["users" => $users, "tickets" => $tickets, "material" => $material, "materialActive" => $materialActive, "materialInActive" => $materialInActive]);
    }
}
