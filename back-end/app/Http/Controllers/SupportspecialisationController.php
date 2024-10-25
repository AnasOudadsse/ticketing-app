<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Specialisation;

class SupportspecialisationController extends Controller
{
    public function getSupportItsWithSpecialisations()
    {
        $supportIts = User::with('specialisations')->where('role', 'supportIt')->get();

        $data = $supportIts->map(function ($user) {
            return [
                'user_name' => $user->name,
                'specialisations' => $user->specialisations->pluck('name') 
            ];
        });
        return response()->json($data, 200);
    }
    public function getSpecialisationsWithSupportIts()
    {
        $specialisations =Specialisation::with('users')->get();

    if (!$specialisations) {
        return response()->json(['message' => 'Spécialisation non trouvée'], 404);
    }
    
    $data = $specialisations->map(function ($specialisation) {
        return [
            'specialisation_name' => $specialisation->name,
            'users' => $specialisation->users->pluck('name') // Affiche uniquement les noms des utilisateurs
        ];
    });

    return response()->json($data, 200);
    }
}
