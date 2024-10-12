<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Specialisation;

class SpecialisationController extends Controller
{
    public function index()
    {
        $specialisations = Specialisation::with('supportIts')->get();
        return response()->json($specialisations, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supportIts' => 'array|exists:support_its,id',
        ]);

        $specialisation = Specialisation::create($validated);

        if ($request->has('supportIts')) {
            $specialisation->supportIts()->sync($validated['supportIts']);
        }

        return response()->json([
            'message' => 'Spécialisation créée avec succès',
            'specialisation' => $specialisation->load('supportIts')
        ], 201);
    }

    public function show($id)
    {
        $specialisation = Specialisation::with('supportIts')->findOrFail($id);
        return response()->json($specialisation, 200);
    }

    public function update(Request $request, $id)
    {
        $specialisation = Specialisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supportIts' => 'array|exists:support_its,id',
        ]);

        $specialisation->update($validated);

        if ($request->has('supportIts')) {
            $specialisation->supportIts()->sync($validated['supportIts']);
        }

        return response()->json([
            'message' => 'Spécialisation mise à jour avec succès',
            'specialisation' => $specialisation->load('supportIts')
        ], 200);
    }

    public function destroy($id)
    {
        $specialisation = Specialisation::findOrFail($id);
        $specialisation->supportIts()->detach();
        $specialisation->delete();

        return response()->json([
            'message' => 'Spécialisation supprimée avec succès'
        ], 200);
    }
}
