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
            'attachement'=>'nullable'
        ]);

        $ticket = Ticket::create([
            'title' => $request->title,
            'problem_id' => $request->problem_id,
            'description' => $request->description,
            'attachement'=>$request->attachement,
            'created_by' => Auth::id(),
            // 'created_by'=> $request->created_by, // pour le test
            'status' => 'opened',
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket
        ], 201);
    }

    public function closeTicket(Request $request, $ticketId)
{
    $ticket = Ticket::findOrFail($ticketId);

    if ($ticket->status !== 'opened') {
        return response()->json(['message' => 'Ticket must be opened before closing'], 400);
    }

    // if (Auth::id() !== $ticket->created_by) {
    //     return response()->json(['message' => 'You are not authorized to close this ticket'], 403);
    // }

    $ticket->status = 'closed';
    $ticket->save();

    return response()->json([
        'message' => 'Ticket closed successfully',
        'ticket' => $ticket
    ], 200);
}

    public function reserveTicket(Request $request, $ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);

        if ($ticket->status !== 'opened') {
            return response()->json(['message' => 'Ticket is not available for reservation'], 400);
        }

        // if (Auth::user()->role !== 'supportIt') {
        //     return response()->json(['message' => 'Unauthorized action'], 403);
        // }

        // $ticket->reserved_by = Auth::id();
        $ticket->reserved_by=$request->reserved_by;//juste pour le test
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
        'reserved_by' => 'required|exists:users,id',
        'admin_id' => 'required|exists:users,id'    //Juste pour le test en Insomnia
    ]);

    $ticket = Ticket::findOrFail($ticketId);

    // if (Auth::user()->role !== 'admin') {
    //     return response()->json(['message' => 'Unauthorized action'], 403);
    // }

    if ($ticket->status !== 'opened') {
        return response()->json(['message' => 'Ticket is not available for assignment'], 400);
    }

    $supportItUser = User::findOrFail($request->reserved_by);
    
    if ($supportItUser->role !== 'supportIt') {
        return response()->json(['message' => 'Assigned user must be a supportIt'], 400);
    }

    $ticket->reserved_by = $request->reserved_by;
    // $ticket->admin_id = Auth::id(); 
    $ticket->admin_id = $request->admin_id;
    $ticket->status = 'reserved';
    $ticket->save();                             

    return response()->json([
        'message' => 'Ticket assigned successfully',
        'ticket' => $ticket
    ], 200);
}

public function resolveTicket(Request $request, $ticketId)
{
    
    $ticket = Ticket::findOrFail($ticketId);

    // if (Auth::user()->role !== 'supportIt' || Auth::id() !== $ticket->reserved_by) {
    //     return response()->json(['message' => 'Unauthorized action'], 403);
    // }   pour le test en insomnia

    if ($ticket->status !== 'reserved') {
        return response()->json(['message' => 'Ticket is not in a state to be resolved'], 400);
    }

    $ticket->status = 'resolved';
    $ticket->resolution_date = now();
    $ticket->save();

    return response()->json([
        'message' => 'Ticket resolved successfully',
        'ticket' => $ticket
    ], 200);
}
public function getTickets(Request $request)
{
    $user = Auth::user();
    if ($user->role === 'client') {
        $allTickets = Ticket::where('created_by', $user->id)->get();
        $reservedTickets = Ticket::where('created_by', $user->id)
                                 ->where('status', 'reserved')
                                 ->get();
        $resolvedTickets = Ticket::where('created_by', $user->id)
                                 ->where('status', 'resolved')
                                 ->get();
    } else {
        $allTickets = Ticket::all();
        $reservedTickets = Ticket::where('status', 'reserved')->get();
        $resolvedTickets = Ticket::where('status', 'resolved')->get();
    }

    return response()->json([
        'all_tickets' => $allTickets,
        'reserved_tickets' => $reservedTickets,
        'resolved_tickets' => $resolvedTickets
    ], 200);
}


}
