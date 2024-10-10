<?php

namespace App\Http\Controllers;

use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    public function index()
    {
        $fonctions = Fonction::all();
        return response()->json($fonctions, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $fonction = Fonction::create($validated);

        return response()->json([
            'message' => 'Fonction créée avec succès',
            'fonction' => $fonction
        ], 201);
    }

    public function show($id)
    {
        $fonction = Fonction::findOrFail($id);
        return response()->json($fonction, 200);
    }

    public function update(Request $request, $id)
    {
        $fonction = Fonction::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $fonction->update($validated);

        return response()->json([
            'message' => 'Fonction mise à jour avec succès',
            'fonction' => $fonction
        ], 200);
    }

    public function destroy($id)
    {
        $fonction = Fonction::findOrFail($id);
        $fonction->delete();

        return response()->json([
            'message' => 'Fonction supprimée avec succès'
        ], 200);
    }
}
