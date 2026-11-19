<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MandarinkuApiController;

// ==========================================================================
// MANDARINKU REST API ROUTES
// ==========================================================================
Route::get('/api/modules', [MandarinkuApiController::class, 'getModules']);
Route::get('/api/questions/{level}', [MandarinkuApiController::class, 'getBankQuestions']);
Route::get('/api/game-features', [MandarinkuApiController::class, 'getGameFeatures']);
Route::post('/api/ai-grammar', [MandarinkuApiController::class, 'checkAIGrammar']);

// Progress Sync, Quiz History, & Stories APIs
Route::get('/api/user-progress', [MandarinkuApiController::class, 'getUserProgress']);
Route::post('/api/user-progress', [MandarinkuApiController::class, 'saveUserProgress']);
Route::get('/api/quiz-history', [MandarinkuApiController::class, 'getQuizHistory']);
Route::post('/api/quiz-history', [MandarinkuApiController::class, 'saveQuizHistory']);
Route::get('/api/stories', [MandarinkuApiController::class, 'getStories']);
