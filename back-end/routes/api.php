<?php

use App\Console\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\InventaireController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Controllers\LocalisationController;
use App\Http\Controllers\SpecialisationController;
use App\Http\Controllers\SupportItSpecialisationController;
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
Route::put('/users/{id}', [AuthController::class, 'update']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('specialisations')->group(function(){
    Route::get('/', [SpecialisationController::class, 'index']);
    Route::post('/', [SpecialisationController::class, 'store']);
    Route::get('/{id}', [SpecialisationController::class, 'show']);
    Route::put('/{id}', [SpecialisationController::class, 'update']);
    Route::delete('/{id}', [SpecialisationController::class, 'destroy']); 
});

Route::prefix('support-it-specialisations')->group(function(){
    Route::post('/', [SupportItSpecialisationController::class, 'store']);
    Route::get('/support-it/{support_it_id}', [SupportItSpecialisationController::class, 'showBySupportIt']);
    Route::get('/specialisation/{specialisation_id}', [SupportItSpecialisationController::class, 'showBySpecialisation']);
    Route::delete('/support-it-specialisations', [SupportItSpecialisationController::class, 'destroy']);
});

Route::prefix('problems')->group(function(){
    Route::get('/', [ProblemController::class, 'index']);
    Route::get('/getProblems', [ProblemController::class, 'getProblems']);
    Route::post('/', [ProblemController::class, 'store']);
    Route::get('/{id}', [ProblemController::class, 'show']); 
    Route::put('/{id}', [ProblemController::class, 'update']); 
    Route::delete('/{id}', [ProblemController::class, 'destroy']);

});


Route::prefix('tickets')->group(function () {
    Route::post('/', [TicketController::class, 'store']);
    Route::get('/listTickets', [TicketController::class, 'listTickets']);
    Route::post('/{id}/reserve', [TicketController::class, 'reserveTicket']);
    Route::post('/{id}/assign', [TicketController::class, 'assignTicketByAdmin']);
    Route::post('/{id}/resolve',[TicketController::class,'closeTicket']);
    Route::get('/getTicketsWithProblems', [TicketController::class, 'getTicketsWithProblems']);
    Route::get('/get/{id}', [TicketController::class, 'show']);

});
Route::get('/tickets/export/excel', [TicketController::class, 'exportTicketsToExcel']);
Route::get('users/count',[StatistiqueController::class,'allUsersCount']);
Route::get('tickets/count',[StatistiqueController::class,'allTicketsCount']);
Route::get('users/roles',[StatistiqueController::class,'userRoles']);
Route::get('ticketsStatus/count',[StatistiqueController::class,'statusTickets']);
Route::get('ticketsPerMonth',[StatistiqueController::class,'monthlyTickets']);

Route::apiResource('inventaires', InventaireController::class);


// api.php
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);
