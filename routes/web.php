<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminApiController;

// ==========================================================================
// 1. STUDENT FRONTEND SPA ROUTES
// ==========================================================================
Route::get('/', [StudentController::class, 'index']);
Route::get('/index.php', [StudentController::class, 'index']);
Route::get('/beranda', [StudentController::class, 'index']);

// ==========================================================================
// 2. ADMIN PANEL ROUTES (CLEAN LARAVEL URLS + .PHP COMPATIBILITY URLS)
// ==========================================================================
Route::any('/admin', [AdminController::class, 'index']);
Route::any('/admin/index.php', [AdminController::class, 'index']);
Route::any('/admin/dashboard', [AdminController::class, 'index']);

Route::any('/admin/login', [AdminController::class, 'login']);
Route::any('/admin/login.php', [AdminController::class, 'login']);

Route::any('/admin/logout', [AdminController::class, 'logout']);
Route::any('/admin/logout.php', [AdminController::class, 'logout']);

Route::any('/admin/users', [AdminController::class, 'users']);
Route::any('/admin/users.php', [AdminController::class, 'users']);

Route::any('/admin/modules', [AdminController::class, 'modules']);
Route::any('/admin/modules.php', [AdminController::class, 'modules']);

Route::any('/admin/questions', [AdminController::class, 'questions']);
Route::any('/admin/questions.php', [AdminController::class, 'questions']);

Route::any('/admin/flashcards', [AdminController::class, 'flashcards']);
Route::any('/admin/flashcards.php', [AdminController::class, 'flashcards']);

Route::any('/admin/game-arena', [AdminController::class, 'gameArena']);
Route::any('/admin/game_arena', [AdminController::class, 'gameArena']);
Route::any('/admin/game_arena.php', [AdminController::class, 'gameArena']);

Route::any('/admin/fitur-cerdas', [AdminController::class, 'fiturCerdas']);
Route::any('/admin/fitur_cerdas', [AdminController::class, 'fiturCerdas']);
Route::any('/admin/fitur_cerdas.php', [AdminController::class, 'fiturCerdas']);

Route::any('/admin/api-sync', [AdminApiController::class, 'sync']);
Route::any('/admin/api_sync', [AdminApiController::class, 'sync']);
Route::any('/admin/api_sync.php', [AdminApiController::class, 'sync']);

Route::any('/admin/setup-db', [AdminController::class, 'setupDb']);
Route::any('/admin/setup_db.php', [AdminController::class, 'setupDb']);
