<?php

namespace App\Http\Controllers;

use App\Models\localisation;
use Illuminate\Http\Request;

class LocalisationController extends Controller
{
    public function index()
    {
        $localisations = localisation::all();
        return response()->json($localisations, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $localisation = localisation::create($validated);

        return response()->json([
            'message' => 'Localisationt créé avec succès',
            'localisation' => $localisation
        ], 201);
    }

    public function show($id)
    {
        $localisation = localisation::findOrFail($id);
        return response()->json($localisation, 200);
    }

    public function update(Request $request, $id)
    {
        $localisation = localisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $localisation->update($validated);

        return response()->json([
            'message' => 'Localisation mis à jour avec succès',
            'localisation' => $localisation
        ], 200);
    }

    public function destroy($id)
    {
        $localisation = localisation::findOrFail($id);
        $localisation->delete();

        return response()->json([
            'message' => 'Localisation supprimé avec succès'
        ], 200);
    }
}
