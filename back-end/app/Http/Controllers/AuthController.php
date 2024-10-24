<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try{
            $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
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
        $validatedData = $request->validate([
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

    } catch (ValidationException $e) {
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
public function update(Request $request, $id)
{
    try {
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
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);

    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'User not found',
        ], 404);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred during the update',
            'error' => $e->getMessage(),
        ], 500);
    }
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
