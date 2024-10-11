<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,supportIt,client',
            // 'fonction_id' => 'required|exists:fonctions,id',
            // 'departement_id' => 'required|exists:departements,id',
            // 'localisation_id' => 'required|exists:localisations,id',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => $request->role,
            // 'fonction_id' => $request->fonction_id,
            // 'departement_id' => $request->departement_id,
            // 'localisation_id' => $request->localisation_id,
        ]);

        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

}
