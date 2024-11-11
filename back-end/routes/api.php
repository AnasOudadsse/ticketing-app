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
use App\Http\Controllers\SupportspecialisationController;

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
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::put('/users/{id}', [AuthController::class, 'update']);
Route::get('/users', [AuthController::class, 'getUsers']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('specialisations')->group(function(){
    Route::get('/', [SpecialisationController::class, 'index']);
    Route::post('/', [SpecialisationController::class, 'store']);
    Route::get('/{id}', [SpecialisationController::class, 'show']);
    Route::put('/{id}', [SpecialisationController::class, 'update']);
    Route::delete('/{id}', [SpecialisationController::class, 'destroy']);
});

Route::get('/supportitsSpecialisation', [SupportspecialisationController::class, 'getSupportItsWithSpecialisations']);
Route::get('/specialisationsSupport', [SupportspecialisationController::class, 'getSpecialisationsWithSupportIts']);


Route::prefix('problems')->group(function(){
    Route::get('/', [ProblemController::class, 'index']);
    Route::get('/getProblems', [ProblemController::class, 'getProblems']);
    Route::post('/', [ProblemController::class, 'store']);
    Route::get('/{id}', [ProblemController::class, 'show']);
    Route::put('/{id}', [ProblemController::class, 'update']);
    Route::delete('/{id}', [ProblemController::class, 'destroy']);
    
});
// Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tickets', [TicketController::class, 'createTicket']);
    Route::get('tickets/get/{id}', [TicketController::class, 'getOneTicket']);
    Route::post('/tickets/{id}/reserve', [TicketController::class, 'reserveTicket']);//pour test
    Route::put('/tickets/{id}/close', [TicketController::class, 'closeTicket']);//test
    Route::put('/tickets/{id}/assign', [TicketController::class, 'assignTicket']);//aussi pour le test
    Route::put('/tickets/{id}/resolve', [TicketController::class, 'resolveTicket']);
    Route::get('/all-tickets', [TicketController::class, 'allTickets']);//pour test api
    
    Route::get('/tickets/getTicketsWithProblems', [TicketController::class, 'getTicketsWithProblems']);
    Route::get('/tickets/export/excel', [TicketController::class, 'exportTicketsToExcel']);
    Route::get('users/count',[StatistiqueController::class,'allUsersCount']);
    Route::get('tickets/count',[StatistiqueController::class,'allTicketsCount']);
    Route::get('users/roles',[StatistiqueController::class,'userRoles']);
Route::get('ticketsStatus/count',[StatistiqueController::class,'statusTickets']);
Route::get('ticketsPerMonth',[StatistiqueController::class,'monthlyTickets']);
Route::get('statistiques',[StatistiqueController::class,'statistiques']);
Route::delete('drop-user/{user_id}',[AuthController::class,'dropUser']);
Route::get('user/{id}',[AuthController::class,'fetchUser']);
// });




// Route::get('users/count',[StatistiqueController::class,'allUsersCount']);
// Route::get('tickets/count',[StatistiqueController::class,'allTicketsCount']);
// Route::get('users/roles',[StatistiqueController::class,'userRoles']);
// Route::get('ticketsStatus/count',[StatistiqueController::class,'statusTickets']);
// Route::get('ticketsPerMonth',[StatistiqueController::class,'monthlyTickets']);

Route::apiResource('inventaires', InventaireController::class);

Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);

Route::middleware('auth:sanctum')->get('/getUserStats', [AuthController::class, 'getUserStats']);
Route::get("authCheck", [AuthController::class, "authCheck"]);
