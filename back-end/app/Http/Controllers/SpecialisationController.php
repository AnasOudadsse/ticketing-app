<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Specialisation;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SpecialisationController extends Controller
{

    public function index()
{
    try {
        $specialisations = Specialisation::all();
        return response()->json($specialisations, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des spécialisation',
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

        $specialisation = Specialisation::create($validated);

        return response()->json([
            'message' => 'Spécialisation créée avec succès',
            'specialisation' => $specialisation
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la création de la spécialisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function show($id)
{
    try {
        $specialisation = Specialisation::findOrFail($id);
        return response()->json($specialisation, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Spécialisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération de la spécialisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $specialisation = Specialisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $specialisation->update($validated);

        return response()->json([
            'message' => 'Spécialisation mise à jour avec succès',
            'specialisation' => $specialisation
        ], 200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Spécialisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la mise à jour de la spécialisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $specialisation = Specialisation::findOrFail($id);
        $specialisation->delete();

        return response()->json([
            'message' => 'Spécialisation supprimée avec succès'
        ], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Spécialisation non trouvée',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression de la spécialisation',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
