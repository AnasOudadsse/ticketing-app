<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Exports\TicketsExport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Laravel\Sanctum\PersonalAccessToken;

class TicketController extends Controller
{
    public function allTickets() {
        $tickets = Ticket::all();

        return response()->json(["tickets" => $tickets]);
    }

    public function createTicket(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'problem_id' => 'required|exists:problems,id',
            'description' => 'required|string',
            'attachement' => 'file', // Optional for now, since it might not always be included
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $ticket = Ticket::create([
            'title' => $request->title,
            'problem_id' => $request->problem_id,
            'description' => $request->description,
            'attachement' => $attachementPath, // Store relative path attachement
            'created_by' => $request->clientID,
            'status' => 'opened',
        ]);
    
        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket,
            'attachment_url' => $attachementPath ? asset('storage' . $attachementPath) : null,
        ], 201);
    }
    
    
    
    public function closeTicket(Request $request, $id)
{
    $ticket = Ticket::findOrFail($id);

    if ($ticket->status !== 'opened') {
        return response()->json(['message' => 'Ticket must be opened before closing'], 400);
    }

    // if (Auth::id() !== $ticket->created_by) {
    //     return response()->json(['message' => 'You are not authorized to close this ticket'], 403);
    // }
    $closed_by = $request->closed_by;

    $ticket->closed_by = $closed_by;
    $ticket->status = 'closed';
    $ticket->save();

    return response()->json([
        'message' => 'Ticket closed successfully',
        'ticket' => $ticket
    ], 200);
}

    public function reserveTicket(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        if ($ticket->status !== 'opened') {
            return response()->json(['message' => 'Ticket is not available for reservation'], 400);
        }

        $validated = $request->validate([
            'reserved_by' => 'required',
        ]);

        $ticket->reserved_by = $validated['reserved_by'];   
        $ticket->status = 'reserved';
        $ticket->save();

        return response()->json([
            'message' => 'Ticket reserved successfully',
            'ticket' => $ticket
        ], 200);
    }

    public function assignTicket(Request $request, $id)
{
    $request->validate([
        'reserved_by' => 'required|exists:users,id',
    ]);

    $ticket = Ticket::findOrFail($id);

    if (Auth::user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized action'], 403);
    }

    if ($ticket->status !== 'opened') {
        return response()->json(['message' => 'Ticket is not available for assignment'], 400);
    }

    $supportItUser = User::findOrFail($request->reserved_by);
    
    if ($supportItUser->role !== 'supportIt') {
        return response()->json(['message' => 'Assigned user must be a supportIt'], 400);
    }

    $ticket->reserved_by = $request->reserved_by;
    $ticket->admin_id = Auth::id(); 
    $ticket->status = 'reserved';
    $ticket->save();

    return response()->json([
        'message' => 'Ticket assigned successfully',
        'ticket' => $ticket
    ], 200);
}

public function resolveTicket(Request $request, $id)
{
    
    $ticket = Ticket::findOrFail($id);

    // if (Auth::user()->role !== 'supportIt' || Auth::id() !== $ticket->reserved_by) {
    //     return response()->json(['message' => 'Unauthorized action'], 403);
    // }   pour le test en insomnia

    if ($ticket->status !== 'reserved') {
        return response()->json(['message' => 'Ticket is not in a state to be resolved'], 400);
    }

    $ticket->resolved_by = $request->resolved_by;
    $ticket->status = 'resolved';
    $ticket->resolution_date = now();
    $ticket->save();

    return response()->json(['message' => 'Ticket clôturé avec succès', 'ticket' => $ticket], 200);
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

public function getTicketsByUser(Request $request) {
    $user = $request->user();

    if(!$user) return response()->json(['message' => 'Unauthorized'], 401);

    if($user->role === "client") {
        $tickets = Ticket::where("created_by", $user->id)->get();
        return response()->json(["tickets" => $tickets]);
    }
    if($user->role === "supportIt") {
        $tickets = Ticket::where("created_by", $user->id)
        ->orWhere('resolved_by', $user->id)
        ->orWhere("reserved_by", $user->id)->with("supportIt")->with("creator")->with("problem")
        ->get();

        return response()->json(["tickets" => $tickets]);
    }
    if($user->role === "admin") {
        $tickets = Ticket::all()->With("supportIt")->with("creator")->with("problem")->get();
        return response()->json(["tickets" => $tickets]);
    }
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
        $tickets = Ticket::with(['problem', 'creator', 'SupportIt'])->orderby("created_at", "desc")->get();
    
        // Loop through each ticket and add the client's name
        $tickets->transform(function ($ticket) {
            $creator = User::find($ticket->created_by); // Fetch client from User model

            $created_by = 'created_by';
    
              $ticket->$created_by = $creator->name;   

            return $ticket;
        });
    
        return response()->json($tickets, 200);
    } else {
        // If the user is a client, return only their tickets with associated problems
        $ticketsWithProblems = Ticket::with('problem','creator')->where('created_by', $user->id)->orderBy('created_at', 'desc')->get();
    }

    return response()->json($ticketsWithProblems);
}

public function getOneTicket($id){
    $ticket = Ticket::with('problem', 'creator')->find($id);
    return response()->json($ticket);
}


public function downloadAttachment($id)
{
    $ticket = Ticket::find($id);

    if (!$ticket || !$ticket->attachement) {
        return response()->json(['message' => 'No attachment found'], 404);
    }

    // Locate the file within 'storage/app/public'
    $filePath = storage_path('app/public/' . $ticket->attachement);

    if (!file_exists($filePath)) {
        return response()->json(['message' => 'File not found'], 404);
    }

    return response()->download($filePath, basename($filePath));
}




}


