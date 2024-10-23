<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // return response()->json($request);
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
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
        ]);
    }


public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
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
    $validatedData = $request->validate([
        'name' => 'sometimes|required|string|max:255|unique:users,name,' . $id,
        'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
        'password' => 'nullable|string|min:8|confirmed',
        'role' => 'sometimes|required|in:admin,supportIt,client',
        'specialisation_ids' => 'nullable|array|required_if:role,supportIt',
        'specialisation_ids.*' => 'exists:specialisations,id',
        'fonction_id' => 'sometimes|required|exists:fonctions,id',
        'departement_id' => 'sometimes|required|exists:departements,id',
        'localisation_id' => 'sometimes|required|exists:localisations,id',
    ]);

    $user = User::findOrFail($id);
    $user->name = $validatedData['name'] ?? $user->name;
    $user->email = $validatedData['email'] ?? $user->email;

    if (!empty($validatedData['password'])) {
        $user->password = Hash::make($validatedData['password']);
    }
    $user->role = $validatedData['role'] ?? $user->role;
    $user->fonction_id = $validatedData['fonction_id'] ?? $user->fonction_id;
    $user->departement_id = $validatedData['departement_id'] ?? $user->departement_id;
    $user->localisation_id = $validatedData['localisation_id'] ?? $user->localisation_id;
    $user->save();

    if ($validatedData['role'] === 'supportIt' && isset($validatedData['specialisation_ids'])) {
        $user->specialisations()->sync($validatedData['specialisation_ids']);
    }
    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ]);
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
