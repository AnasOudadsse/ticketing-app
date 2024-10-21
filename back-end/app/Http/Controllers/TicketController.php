<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function createTicket(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'problem_id' => 'required|exists:problems,id',
            'description' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'title' => $request->title,
            'problem_id' => $request->problem_id,
            'description' => $request->description,
            // 'created_by' => Auth::id(),
            'created_by'=> $request->created_by, // pour le test
            'status' => 'opened',
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket
        ], 201);
    }

    public function reserveTicket(Request $request, $ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);

        if ($ticket->status !== 'opened') {
            return response()->json(['message' => 'Ticket is not available for reservation'], 400);
        }

        if (Auth::user()->role !== 'supportIt') {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $ticket->reserved_by = Auth::id();
        $ticket->status = 'reserved';
        $ticket->save();

        return response()->json([
            'message' => 'Ticket reserved successfully',
            'ticket' => $ticket
        ], 200);
    }

    public function assignTicket(Request $request, $ticketId)
    {
        $request->validate([
            'supportIt_id' => 'required|exists:users,id'
        ]);

        $ticket = Ticket::findOrFail($ticketId);

        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        if ($ticket->status !== 'opened') {
            return response()->json(['message' => 'Ticket is not available for assignment'], 400);
        }

        $supportItUser = User::findOrFail($request->supportIt_id);
        if ($supportItUser->role !== 'supportIt') {
            return response()->json(['message' => 'Assigned user must be a supportIt'], 400);
        }

        $ticket->reserved_by = $request->supportIt_id;
        $ticket->admin_id = Auth::id();
        $ticket->status = 'reserved';
        $ticket->save();

        return response()->json([
            'message' => 'Ticket assigned successfully',
            'ticket' => $ticket
        ], 200);
    }
}
