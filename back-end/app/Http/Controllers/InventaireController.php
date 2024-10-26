<?php

namespace App\Http\Controllers;

use App\Models\Inventaire;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InventaireController extends Controller
{
    public function index()
{
    try {
        $inventaires = Inventaire::all();
        return response()->json($inventaires, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des inventaires',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'materiel' => 'required|string|max:255',
            'serialNumber' => 'required|string|max:255',
            'fonction_id' => 'required|exists:fonctions,id',
            'departement_id' => 'required|exists:departements,id',
            'emplacement' => 'required|string|max:255',
            'statut' => 'required|in:actif,non actif',
        ]);

        $inventaire = Inventaire::create($validated);

        return response()->json([
            'message' => 'Inventaire créé avec succès',
            'inventaire' => $inventaire
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la création de l\'inventaire',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function show(Inventaire $inventaire)
{
    try {
        return response()->json($inventaire, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Inventaire non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération de l\'inventaire',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, Inventaire $inventaire)
{
    try {
        $validated = $request->validate([
            'materiel' => 'string|max:255',
            'serialNumber' => 'string|max:255',
            'fonction_id' => 'exists:fonctions,id',
            'departement_id' => 'exists:departements,id',
            'emplacement' => 'string|max:255',
            'statut' => 'in:actif,non actif',
        ]);

        $inventaire->update($validated);

        return response()->json([
            'message' => 'Inventaire mis à jour avec succès',
            'inventaire' => $inventaire
        ], 200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Inventaire non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la mise à jour de l\'inventaire',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function destroy(Inventaire $inventaire)
{
    try {
        $inventaire->delete();

        return response()->json([
            'message' => 'Inventaire supprimé avec succès'
        ], 204);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Inventaire non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression de l\'inventaire',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
