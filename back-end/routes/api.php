<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/addUser', [UserController::class, 'store']);

Route::prefix('tickets')->group(function () {
    Route::post('/create', [TicketController::class, 'store']);
    Route::get('/unassigned', [TicketController::class, 'listUnassignedTickets']);
    Route::post('/{id}/reserve', [TicketController::class, 'reserveTicket']);
    Route::post('/{id}/assign', [TicketController::class, 'assignTicketByAdmin']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
