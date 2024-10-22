<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use App\Models\Problems;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index()
    {
        $problems = Problem::all();
        return response()->json($problems, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'specification' => ''
        ]);

        $problem = Problem::create($validated);

        return response()->json([
            'message' => 'problemt créé avec succès',
            'problem' => $problem
        ], 201);
    }

    public function show($id)
    {
        $problem = Problem::findOrFail($id);
        return response()->json($problem, 200);
    }

    public function update(Request $request, $id)
    {
        $problem = Problem::findOrFail($id);

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
        $problem = Problem::findOrFail($id);
        $problem->delete();

        return response()->json([
            'message' => 'problem supprimé avec succès'
        ], 200);
    }

    public function getProblems()
    {
        // Fetch all problems from the database
        $problems = Problem::all();
    
        // Group the problems by type
        $groupedProblems = $problems->groupBy('type');
    
        return response()->json($groupedProblems);
    }

}
