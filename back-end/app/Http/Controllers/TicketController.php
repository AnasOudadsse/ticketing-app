<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Exports\TicketsExport;
use Maatwebsite\Excel\Facades\Excel;
use Laravel\Sanctum\PersonalAccessToken;

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
            'clientID' => 'required|exists:clients,client_id',
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

    public function show($id)
    {
        $ticket = Ticket::with(['problem', 'client'])->find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $client = User::find($ticket->clientID);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }
    
        $ticket->client_name = $client->name;
        return response()->json($ticket);
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

    if ($ticket->status === 'resolved') {
        return response()->json(['message' => 'Ce ticket est déjà clôturé'], 400);
    }

    $ticket->status = 'resolved';
    $ticket->save();

    return response()->json(['message' => 'Ticket clôturé avec succès', 'ticket' => $ticket], 200);
}


public function getTicketsWithProblems(Request $request)
{
    
    $token = $request->bearerToken();

    if (!$token) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Assuming you're using Sanctum or Passport, use the token to find the associated user
    $accessToken = PersonalAccessToken::findToken($token);

    if (!$accessToken) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Get the user associated with the token
    $user = $accessToken->tokenable; // tokenable refers to the User model

    if ($user->role === 'admin' || $user->role === 'supportIt') {
        // Fetch all tickets with their associated problems
        $tickets = Ticket::with(['problem', 'client'])->get();
    
        // Loop through each ticket and add the client's name
        $tickets->transform(function ($ticket) {
            $client = User::find($ticket->clientID); // Fetch client from User model

            $blabla = 'client_name';
    
            // Add client_name to each ticket
            $ticket->$blabla = $client->name;   

            return $ticket;
        });
    
        return response()->json($tickets, 200);
    } else {
        // If the user is a client, return only their tickets with associated problems
        $ticketsWithProblems = Ticket::with('problem')->where('clientID', $user->id)->get();
    }

    return response()->json($ticketsWithProblems);
}

public function exportTicketsToExcel()
{
    $fileName = 'tickets_export_' . date('Ymd_His') . '.xlsx';

    return Excel::download(new TicketsExport, $fileName);
}
}