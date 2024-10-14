<?php

namespace App\Http\Controllers;

use App\Models\Problems;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index()
    {
        $problems = Problems::all();
        return response()->json($problems, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'specification' => ''
        ]);

        $problem = Problems::create($validated);

        return response()->json([
            'message' => 'problemt créé avec succès',
            'problem' => $problem
        ], 201);
    }

    public function show($id)
    {
        $problem = Problems::findOrFail($id);
        return response()->json($problem, 200);
    }

    public function update(Request $request, $id)
    {
        $problem = Problems::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $problem->update($validated);

        return response()->json([
            'message' => 'problem mis à jour avec succès',
            'problem' => $problem
        ], 200);
    }

    public function destroy($id)
    {
        $problem = Problems::findOrFail($id);
        $problem->delete();

        return response()->json([
            'message' => 'problem supprimé avec succès'
        ], 200);
    }

    public function getProblems()
    {
        // Fetch all problems from the database
        $problems = Problems::all();
    
        // Group the problems by type
        $groupedProblems = $problems->groupBy('type');
    
        return response()->json($groupedProblems);
    }

}
