<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Services\ChatService;
use App\Data\ChatExamples;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected $chatService;
    protected $examples;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
        $this->examples = ChatExamples::getExamples();
    }

    /**
     * Handle a chat message from the user, maintain conversation context,
     * and return the assistant's reply.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ask(Request $request)
    {
        // 1. Validate input
        $request->validate([
            'message' => 'required|string',
        ]);

        // 2. Fetch or create a conversation
        $conversation = ChatConversation::firstOrCreate(
            ['id' => 1],
            []
        );

        // 3. Seed the system prompt if this is the first message
        if ($conversation->messages()->count() === 0) {
            $conversation->messages()->create([
                'role'    => 'system',
                'content' => 'You are an IT diagnostic assistant. Ask the user one step‑by‑step clarifying question to diagnose their issue; once you have enough information, provide clear troubleshooting steps.',
            ]);
        }

        // 4. Save the user's message
        $conversation->messages()->create([
            'role'    => 'user',
            'content' => $request->message,
        ]);

        // 5. Load full message history for context
        $history = $conversation->messages()
            ->orderBy('id')
            ->get(['role', 'content'])
            ->map(fn($m) => [
                'role'    => $m->role,
                'content' => $m->content,
            ])->toArray();

        // 6. Get the assistant's reply via ChatService
        $reply = $this->chatService->diagnose($history);

        // 7. Save the assistant's reply
        $conversation->messages()->create([
            'role'    => 'assistant',
            'content' => $reply,
        ]);

        // 8. Return the reply to the frontend
        return response()->json([
            'answer' => $reply,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'required|array'
        ]);

        Log::info('Received message:', ['message' => $request->message]);

        // Check if the question matches any examples
        foreach ($this->examples as $example) {
            if (stripos($request->message, $example['question']) !== false) {
                Log::info('Found matching example response');
                return response()->json(['response' => $example['answer']]);
            }
        }

        $response = $this->chatService->diagnose($request->history);
        return response()->json(['response' => $response]);
    }
}
