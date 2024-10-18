<?php

namespace App\Http\Controllers;

use App\Models\Inventaire;
use Illuminate\Http\Request;

class InventaireController extends Controller
{
    public function index()
    {
        return Inventaire::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'materiel' => 'required|string|max:255',
            'serialNumber' => 'required|string|max:255',
            'fonction_id' => 'required|exists:fonctions,id',
            'departement_id' => 'required|exists:departements,id',
            'emplacement' => 'required|string|max:255',
            'statut' => 'required|in:actif,non actif',
        ]);

        $inventaire = Inventaire::create($request->all());
        return response()->json($inventaire, 201);
    }

    public function show(Inventaire $inventaire)
    {
        return $inventaire;
    }

    public function update(Request $request, Inventaire $inventaire)
    {
        $request->validate([
            'materiel' => 'string|max:255',
            'serialNumber' => 'string|max:255',
            'fonction_id' => 'exists:fonctions,id',
            'departement_id' => 'exists:departements,id',
            'emplacement' => 'string|max:255',
            'statut' => 'in:actif,non actif',
        ]);

        $inventaire->update($request->all());
        return response()->json($inventaire, 200);
    }

    public function destroy(Inventaire $inventaire)
    {
        $inventaire->delete();
        return response()->json(null, 204);
    }
}
