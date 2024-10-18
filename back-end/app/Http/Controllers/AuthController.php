<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Client;
use App\Models\SupportIT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
            'user' => $user,
        ]);
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|required|in:admin,client,supportIt',
            'fonction_id' => 'sometimes|nullable|integer',
            'departement_id' => 'sometimes|nullable|integer',
            'localisation_id' => 'sometimes|nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->name = $request->get('name', $user->name);
        $user->email = $request->get('email', $user->email);

        if ($request->has('password') && $request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->role = $request->get('role', $user->role);
        $user->fonction_id = $request->get('fonction_id', $user->fonction_id);
        $user->departement_id = $request->get('departement_id', $user->departement_id);
        $user->localisation_id = $request->get('localisation_id', $user->localisation_id);

        $user->save();

        switch ($user->role) {
            case 'admin':
                if (!$user->admin) {
                    Admin::create(['admin_id' => $user->id]);
                }
                break;

            case 'client':
                if (!$user->client) {
                    Client::create(['client_id' => $user->id]);
                }
                break;

            case 'supportIt':
                if (!$user->supportIt) {
                    SupportIT::create(['supportIt_id' => $user->id]);
                }
                break;
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function getUser(Request $request)
{
    // Load the authenticated user with their function using eager loading
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
