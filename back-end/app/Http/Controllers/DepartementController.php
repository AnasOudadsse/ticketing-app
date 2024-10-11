<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index()
    {
        $departements = Departement::all();
        return response()->json($departements, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $departement = Departement::create($validated);

        return response()->json([
            'message' => 'Département créé avec succès',
            'departement' => $departement
        ], 201);
    }

    public function show($id)
    {
        $departement = Departement::findOrFail($id);
        return response()->json($departement, 200);
    }

    public function update(Request $request, $id)
    {
        $departement = Departement::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $departement->update($validated);

        return response()->json([
            'message' => 'Département mis à jour avec succès',
            'departement' => $departement
        ], 200);
    }

    public function destroy($id)
    {
        $departement = Departement::findOrFail($id);
        $departement->delete();

        return response()->json([
            'message' => 'Département supprimé avec succès'
        ], 200);
    }
}
