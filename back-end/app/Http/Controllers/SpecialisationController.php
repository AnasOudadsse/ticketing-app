<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Specialisation;

class SpecialisationController extends Controller
{

    public function index()
    {
        $specialisations = Specialisation::all();
        return response()->json($specialisations, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $specialisation = Specialisation::create($validated);

        return response()->json([
            'message' => 'Spécialisation créée avec succès',
            'specialisation' => $specialisation
        ], 201);
    }

    public function show($id)
    {
        $specialisation = Specialisation::findOrFail($id);
        return response()->json($specialisation, 200);
    }

    public function update(Request $request, $id)
    {
        $specialisation = Specialisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $specialisation->update($validated);

        return response()->json([
            'message' => 'Spécialisation mise à jour avec succès',
            'specialisation' => $specialisation
        ], 200);
    }
    public function destroy($id)
    {
        $specialisation = Specialisation::findOrFail($id);
        $specialisation->delete();

        return response()->json([
            'message' => 'Spécialisation supprimée avec succès'
        ], 200);
    }
}
