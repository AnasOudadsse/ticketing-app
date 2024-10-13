<?php

namespace App\Http\Controllers;

use App\Models\SupportIt;
use Illuminate\Http\Request;
use App\Models\Specialisation;

class SupportItSpecialisationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'support_it_id' => 'required|exists:support_its,id',
            'specialisation_id' => 'required|exists:specialisations,id',
        ]);

        $supportIt = SupportIt::findOrFail($validated['support_it_id']);
        $supportIt->specialisations()->attach($validated['specialisation_id']);

        return response()->json([
            'message' => 'Relation ajoutée avec succès entre Support IT et Spécialisation',
            'support_it' => $supportIt->load('specialisations')
        ], 201);
    }

    // Supprimer une relation entre un support IT et une spécialité
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'support_it_id' => 'required|exists:support_its,id',
            'specialisation_id' => 'required|exists:specialisations,id',
        ]);

        $supportIt = SupportIt::findOrFail($validated['support_it_id']);
        $supportIt->specialisations()->detach($validated['specialisation_id']);

        return response()->json([
            'message' => 'Relation supprimée avec succès',
            'support_it' => $supportIt->load('specialisations')
        ], 200);
    }

    // Récupérer toutes les spécialités d'un support IT
    public function showBySupportIt($support_it_id)
    {
        $supportIt = SupportIt::with('specialisations')->findOrFail($support_it_id);
        return response()->json($supportIt->specialisations, 200);
    }

    // Récupérer tous les supports IT d'une spécialité
    public function showBySpecialisation($specialisation_id)
    {
        $specialisation = Specialisation::with('supportIts')->findOrFail($specialisation_id);
        return response()->json($specialisation->supportIts, 200);
    }
}
