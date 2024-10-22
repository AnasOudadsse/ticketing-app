<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Client;
use App\Models\SupportIT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Valider les données d'entrée
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,client,supportIt', 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'fonction_id' => $request->fonction_id,
            'departement_id' => $request->departement_id,
            'localisation_id' => $request->localisation_id,
        ]);
        switch ($user->role) {
            case 'admin':
                Admin::create(['admin_id' => $user->id]);
                break;

            case 'client':
                Client::create(['client_id' => $user->id]);
                break;

            case 'supportIt':
                SupportIT::create(['supportIt_id' => $user->id]);
                break;
        }
        $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
    ]);
}


public function login(Request $request)
{
    // Validation des entrées
    $request->validate([
        'email' => 'required|string|email', // Validation pour l'email
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'role' => $user->role,
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:users,name,' . $user->id, // Ignore le nom actuel de l'utilisateur
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id, // Ignore l'email actuel
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'role' => 'sometimes|required|in:admin,supportIt,client',
            'specialisation_id' => 'nullable|required_if:role,supportIt|exists:specialisations,id',
            'fonction_id' => 'sometimes|required|exists:fonctions,id',
            'departement_id' => 'sometimes|required|exists:departements,id',
            'localisation_id' => 'sometimes|required|exists:localisations,id',
        ]);

        $user->update([
            'name' => $validatedData['name'] ?? $user->name,
            'email' => $validatedData['email'] ?? $user->email,
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
            'role' => $validatedData['role'] ?? $user->role,
            'specialisation_id' => $validatedData['role'] === 'supportIt' ? $validatedData['specialisation_id'] : null,
            'fonction_id' => $validatedData['fonction_id'] ?? $user->fonction_id,
            'departement_id' => $validatedData['departement_id'] ?? $user->departement_id,
            'localisation_id' => $validatedData['localisation_id'] ?? $user->localisation_id,
        ]);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }
    public function getUser(Request $request)
{
    $user = $request->user()->load('fonction');

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'profile_image' => $user->profile_image,
        'function' => $user->fonction ? $user->fonction->name : 'No function assigned',
    ]);
}

function getUsers() {
    $users = User::all();

    return response()->json(["users" => $users]);
}


}
