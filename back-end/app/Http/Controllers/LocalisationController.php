<?php

namespace App\Http\Controllers;

use App\Models\localisation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class LocalisationController extends Controller
{
    public function index()
{
    try {
        $localisations = Localisation::all();
        return response()->json($localisations, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des localisations',
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

        $localisation = Localisation::create($validated);

        return response()->json([
            'message' => 'Localisation créée avec succès',
            'localisation' => $localisation
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la création de la localisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function show($id)
{
    try {
        $localisation = Localisation::findOrFail($id);
        return response()->json($localisation, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Localisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération de la localisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $localisation = Localisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $localisation->update($validated);

        return response()->json([
            'message' => 'Localisation mise à jour avec succès',
            'localisation' => $localisation
        ], 200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Localisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la mise à jour de la localisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $localisation = Localisation::findOrFail($id);
        $localisation->delete();

        return response()->json([
            'message' => 'Localisation supprimée avec succès'
        ], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Localisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression de la localisation',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
