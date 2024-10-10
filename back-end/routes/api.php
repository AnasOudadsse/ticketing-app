<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\LocalisationController;
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
Route::prefix('fonctions')->group(function(){
    Route::get('/', [FonctionController::class, 'index']);
    Route::post('/', [FonctionController::class, 'store']);
    Route::get('/{id}', [FonctionController::class, 'show']);
    Route::put('/{id}', [FonctionController::class, 'update']);
    Route::delete('/{id}', [FonctionController::class, 'destroy']); 
});
Route::prefix('departements')->group(function(){
    Route::get('/', [DepartementController::class, 'index']);
    Route::post('/', [DepartementController::class, 'store']);
    Route::get('/{id}', [DepartementController::class, 'show']); 
    Route::put('/{id}', [DepartementController::class, 'update']); 
    Route::delete('/{id}', [DepartementController::class, 'destroy']);
});

Route::prefix('localisations')->group(function(){
    Route::get('/', [LocalisationController::class, 'index']);
    Route::post('/', [LocalisationController::class, 'store']);
    Route::get('/{id}', [LocalisationController::class, 'show']); 
    Route::put('/{id}', [LocalisationController::class, 'update']); 
    Route::delete('/{id}', [LocalisationController::class, 'destroy']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/addUser', [UserController::class, 'store']);

Route::prefix('tickets')->group(function () {
    Route::post('/', [TicketController::class, 'store']);
    Route::get('/listTickets', [TicketController::class, 'listTickets']);
    Route::post('/{id}/reserve', [TicketController::class, 'reserveTicket']);
    Route::post('/{id}/assign', [TicketController::class, 'assignTicketByAdmin']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
