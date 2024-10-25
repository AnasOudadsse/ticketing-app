<?php

namespace App\Http\Controllers;

use App\Models\Fonction;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FonctionController extends Controller
{
    public function index()
{
    try {
        $fonctions = Fonction::all();
        return response()->json($fonctions, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des fonctions',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $fonction = Fonction::create($validated);

        return response()->json([
            'message' => 'Fonction créée avec succès',
            'fonction' => $fonction
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la création de la fonction',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function show($id)
{
    try {
        $fonction = Fonction::findOrFail($id);
        return response()->json($fonction, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Fonction non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération de la fonction',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $fonction = Fonction::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $fonction->update($validated);

        return response()->json([
            'message' => 'Fonction mise à jour avec succès',
            'fonction' => $fonction
        ], 200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Fonction non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la mise à jour de la fonction',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $fonction = Fonction::findOrFail($id);
        $fonction->delete();

        return response()->json([
            'message' => 'Fonction supprimée avec succès'
        ], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Fonction non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression de la fonction',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
