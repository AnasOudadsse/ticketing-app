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
            'admin_id' => null,
            'supportItID' => null
        ]);

        dd($ticket);

        return response()->json(['message' => 'Ticket créé avec succès', 'ticket' => $ticket], 201);
    }

    public function listUnassignedTickets()
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
        $ticket->status = 'réservé';
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
            'clientID' => 'required|exists:admins,id',
        ]);

        $ticket->supportItID = $validated['supportItID'];
        $ticket->clientID = $validated['clientID'];
        $ticket->status = 'assigné';
        $ticket->save();

        return response()->json(['message' => 'Ticket assigné par l\'admin avec succès', 'ticket' => $ticket], 200);
    }
}