<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\LocalisationController;
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

Route::prefix('problems')->group(function(){
    Route::get('/', [ProblemController::class, 'index']);
    Route::post('/', [ProblemController::class, 'store']);
    Route::get('/{id}', [ProblemController::class, 'show']); 
    Route::put('/{id}', [ProblemController::class, 'update']); 
    Route::delete('/{id}', [ProblemController::class, 'destroy']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/specialisations', [SpecialisationController::class, 'index']);
Route::post('/specialisations', [SpecialisationController::class, 'store']);
Route::get('/specialisations/{id}', [SpecialisationController::class, 'show']);
Route::put('/specialisations/{id}', [SpecialisationController::class, 'update']);
Route::delete('/specialisations/{id}', [SpecialisationController::class, 'destroy']);


Route::prefix('tickets')->group(function () {
    Route::post('/', [TicketController::class, 'store']);
    Route::get('/listTickets', [TicketController::class, 'listTickets']);
    Route::post('/{id}/reserve', [TicketController::class, 'reserveTicket']);
    Route::post('/{id}/assign', [TicketController::class, 'assignTicketByAdmin']);
    Route::put('/{id}/close',[TicketController::class,'closeTicket']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
