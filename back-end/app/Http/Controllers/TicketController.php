<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'problem_id' => 'required|exists:problems,id',
            'description' => 'required|string',
            'status' => 'required|string',
            'attachement' => 'nullable|string',
            'clientID' => 'required|exists:clients,id',
        ]);

        $ticket = Ticket::create([
            'problem_id' => $validated['problem_id'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'attachement' => $validated['attachement'],
            'clientID' => $validated['clientID'],
            'adminID' => null,
            'supportItID' => null
        ]);


        return response()->json(['message' => 'Ticket créé avec succès', 'ticket' => $ticket], 201);
    }

    public function listTickets()
    {
        //$tickets = Ticket::whereNull('supportItID')->get();
        $tickets = Ticket::all();
        return response()->json($tickets, 200);
    }

    public function reserveTicket(Request $request, $ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);

        if ($ticket->supportItID) {
            return response()->json(['message' => 'Ce ticket est déjà réservé'], 400);
        }

        $validated = $request->validate([
            'supportItID' => 'required|exists:support_its,id',
        ]);

        $ticket->supportItID = $validated['supportItID'];
        $ticket->status = 'reserved';
        $ticket->save();

        return response()->json(['message' => 'Ticket réservé avec succès', 'ticket' => $ticket], 200);
    }

    public function assignTicketByAdmin(Request $request, $ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);

        if ($ticket->supportItID) {
            return response()->json(['message' => 'Ce ticket est déjà réservé'], 400);
        }

        $validated = $request->validate([
            'supportItID' => 'required|exists:support_its,id',
            'adminID' => 'required|exists:admins,id',
        ]);

        $ticket->supportItID = $validated['supportItID'];
        $ticket->adminID = $validated['adminID'];
        $ticket->status = 'assigned';
        $ticket->save();

        return response()->json(['message' => 'Ticket assigné par l\'admin avec succès', 'ticket' => $ticket], 200);
    }

    public function closeTicket($ticket_id)
{
    $ticket = Ticket::findOrFail($ticket_id);

    if ($ticket->status === 'closed') {
        return response()->json(['message' => 'Ce ticket est déjà clôturé'], 400);
    }

    $ticket->status = 'closed';
    $ticket->save();

    return response()->json(['message' => 'Ticket clôturé avec succès', 'ticket' => $ticket], 200);
}
}
