<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        try{
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // i delete confirmed - hakim mezrioui
            'role' => 'required|in:admin,supportIt,client',
            'specialisation_ids' => 'nullable|array|required_if:role,supportIt',
            'specialisation_ids.*' => 'exists:specialisations,id',
            'fonction_id' => 'required|exists:fonctions,id',
            'departement_id' => 'required|exists:departements,id',
            'localisation_id' => 'required|exists:localisations,id',
        ]);
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'role_in_creation' => $validatedData['role'],
            'fonction_id' => $validatedData['fonction_id'],
            'departement_id' => $validatedData['departement_id'],
            'localisation_id' => $validatedData['localisation_id'],
        ]);

        if ($validatedData['role'] === 'supportIt') {
            $user->specialisations()->sync($validatedData['specialisation_ids']);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ],201);
    } catch(\Exception $e)
    {
        return response()->json([
            'message' => 'An error occurred during registration',
            'error' => $e->getMessage(),
        ], 500);
    }
    }


public function login(Request $request)
{
    try {
    $validatedData=$request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials, please check your email or password.',
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ], 200);
    }catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred during login',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function logout(Request $request)
{
    try {
        // Revoke the user's current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred during logout',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,supportIt,client',
            'specialisation_ids' => 'nullable|array|required_if:role,supportIt',
            'specialisation_ids.*' => 'exists:specialisations,id',
            'fonction_id' => 'required|exists:fonctions,id',
            'departement_id' => 'required|exists:departements,id',
            'localisation_id' => 'required|exists:localisations,id',
        ]);
        $user = User::findOrFail($id);
        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
            'role' => $validatedData['role'],
            'fonction_id' => $validatedData['fonction_id'],
            'departement_id' => $validatedData['departement_id'],
            'localisation_id' => $validatedData['localisation_id'],
        ]);

        // return response()->json("toto");
        if ($validatedData['role'] === 'supportIt' && isset($validatedData['specialisation_ids'])) {
            $user->specialisations()->sync($validatedData['specialisation_ids']);
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur est survenue lors de la mise à jour',
            'error' => $e->getMessage(),
        ], 500);
    }
}




    public function getUser(Request $request)
{
    try {
        $user = $request->user()->load(['fonction', 'departement', 'localisation']);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'function' => $user->fonction ? $user->fonction->name : 'No function assigned',
            'departement' => $user->departement ? $user->departement->name : 'No department assigned',
            'localisation' => $user->localisation ? $user->localisation->name : 'No location assigned',
        ]);
    }  catch (\Exception $e) {
        return response()->json($e->getMessage());
    }
}

public function authCheck(Request $request) {
    // $user = $request->user();
    $user = Auth::user();
    return  response()->json(['user' => $user]);
    if (!$user) {
        return response()->json(['message' => 'User not found', 'ok' => false], 404);
        }
    return response()->json(['message' => 'User authenticated', 'ok' => true], 200);
}

function getUsers() {
    $users = User::all();

    return response()->json(["users" => $users]);
}

function dropUser(Request $request, $user_id) {
    $user_finded = User::find($user_id);

    $user = $request->user();

    if (!$user_finded) return response()->json("User not found");

    if($user->role != "admin") {
        return response()->json("You could not delete this user");
    }

    $user_finded->delete();

    return response()->json("The user deleted succesfully");
}

function fetchUser(Request $request, $id) {
    $user = User::find($id);

    // $role = $request->user()->role;
    // if($role !== "admin") {
    //     return "Sorry! you can't do this";
    // }

    return response()->json($user);
}

    // Example Laravel API endpoint to get user stats
    public function getUserStats(Request $request) {
        $user = $request->user();
        
        // Allow only "Admin" or the user whose stats are being requested (assume user ID matches logged-in user)
        if (!$user || !in_array($user->role, ['admin', 'supportIt'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Assuming 'Support IT' role requires stats visibility restriction
        if ($user->role !== 'admin' && $user->id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Fetch stats
        $ticketsCreated = Ticket::where('created_by', $user->id)->count();
        $ticketsReserved = Ticket::where('reserved_by', $user->id)->count();
        $ticketsResolved = Ticket::where('resolved_by', $user->id)->count();
        // $ticketsAssigned = Ticket::where('assigned_by', $user->id)->count();
        
        // Fetch recent tickets assigned or resolved by the user
        $recentTickets = Ticket::where('resolved_by', $user->id)
                                ->orWhere('reserved_by', $user->id)
                                ->orderBy('updated_at', 'desc')
                                ->take(4) // Limit to the 5 most recent tickets
                                ->get();
    
        return response()->json([
            'ticketsCreated' => $ticketsCreated,
            'ticketsReserved' => $ticketsReserved,
            'ticketsResolved' => $ticketsResolved,
            // 'ticketsAssigned' => $ticketsAssigned,
            'recentTickets' => $recentTickets, // Include recent tickets in response
        ]);
    }
    
    


}
