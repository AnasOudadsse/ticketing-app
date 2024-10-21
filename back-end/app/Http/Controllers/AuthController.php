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
    $validatedData = $request->validate([
        'name' => 'required|string|max:255|unique:users',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'required|in:admin,supportIt,client',
        'specialisation_id' => 'nullable|exists:specialisations,id',
        'fonction_id' => 'required|exists:fonctions,id',
        'departement_id' => 'required|exists:departements,id',
        'localisation_id' => 'required|exists:localisations,id',
    ]);

    $specialisationId = $validatedData['role'] === 'supportIt' ? $validatedData['specialisation_id'] : null;

    // return response()->json($validatedData);
    $user = User::create([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
        'role' => $validatedData['role'],
        'role_in_creation' => $validatedData['role'],
        'specialisation_id' => $specialisationId,
        'fonction_id' => $validatedData['fonction_id'],
        'departement_id' => $validatedData['departement_id'],
        'localisation_id' => $validatedData['localisation_id'],
    ]);

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


}
