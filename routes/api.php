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
