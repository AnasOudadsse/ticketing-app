<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartementController extends Controller
{
    public function index()
    {
        $departements = Departement::all();
        return response()->json($departements, 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);
            $departement = Departement::create($validated);
    
            return response()->json([
                'message' => 'Département créé avec succès',
                'departement' => $departement
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during the creation of the département',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $departement = Departement::findOrFail($id);
        return response()->json($departement, 200);
    }

    public function update(Request $request, $id)
    {
        try {
            $departement = Departement::findOrFail($id);
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);
            $departement->update($validated);
            return response()->json([
                'message' => 'Département mis à jour avec succès',
                'departement' => $departement
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Département non trouvé',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur s\'est produite lors de la mise à jour du département',
                'error' => $e->getMessage()
            ], 500);
        }
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
