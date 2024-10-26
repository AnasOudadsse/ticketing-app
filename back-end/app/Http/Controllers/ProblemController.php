<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use App\Models\Problems;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProblemController extends Controller
{
    public function index()
{
    try {
        $problems = Problem::all();
        return response()->json($problems, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des problèmes',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'specification' => 'nullable|string'
        ]);

        $problem = Problem::create($validated);

        return response()->json([
            'message' => 'Problème créé avec succès',
            'problem' => $problem
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la création du problème',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function show($id)
{
    try {
        $problem = Problem::findOrFail($id);
        return response()->json($problem, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Problème non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération du problème',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $problem = Problem::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $problem->update($validated);

        return response()->json([
            'message' => 'Problème mis à jour avec succès',
            'problem' => $problem
        ], 200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Problème non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la mise à jour du problème',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $problem = Problem::findOrFail($id);
        $problem->delete();

        return response()->json([
            'message' => 'Problème supprimé avec succès'
        ], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Problème non trouvé',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression du problème',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function getProblems()
{
    try {
        $problems = Problem::all();

        // Group the problems by type
        $groupedProblems = $problems->groupBy('type');

        return response()->json($groupedProblems, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la récupération des problèmes groupés',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
