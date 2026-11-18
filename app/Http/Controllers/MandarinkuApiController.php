<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Question;
use App\Services\GameFeaturesService;

class MandarinkuApiController extends Controller
{
    public function getModules(): array
    {
        return response()->json([
            'status' => 'success',
            'data'   => Module::all(),
        ]);
    }

    public function getBankQuestions(int|string $level): array
    {
        return response()->json([
            'status' => 'success',
            'data'   => Question::where('hsk_level', (int)$level),
        ]);
    }

    public function getGameFeatures(): array
    {
        $service = new GameFeaturesService();
        return response()->json([
            'status' => 'success',
            'data'   => [
                'toneTrainer' => $service->getAllToneTrainer(),
                'wordLink'    => $service->getAllWordLink(),
                'memoryMatch' => $service->getAllMemoryMatch(),
                'pinyinHanzi' => $service->getAllPinyinHanzi(),
                'anatomy'     => $service->getAllHanziAnatomy(),
                'leaderboard' => $service->getAllLeaderboard(),
            ],
        ]);
    }

    public function checkAIGrammar(): array
    {
        $text = trim($_POST['text'] ?? $_GET['text'] ?? '');
        $corrections = [];
        $score = 95;
        $correctedText = $text;

        if (str_contains($text, '他们') && (str_contains($text, '苹果') || str_contains($text, '菜'))) {
            $correctedText = str_replace('他们', '它们', $text);
            $corrections[] = "Gunakan kata ganti '它们' (tāmen) untuk merujuk pada benda/makanan, bukan '他们'.";
            $score = 88;
        }

        return response()->json([
            'status'         => 'success',
            'original_text'  => $text,
            'corrected_text' => $correctedText,
            'score'          => $score,
            'notes'          => $corrections,
        ]);
    }
}
