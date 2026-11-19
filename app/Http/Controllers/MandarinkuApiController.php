<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Question;
use App\Services\GameFeaturesService;

class MandarinkuApiController extends Controller
{
    protected function readRequestPayload(): array
    {
        $rawBody = @file_get_contents('php://input');
        $json = [];
        if (is_string($rawBody) && trim($rawBody) !== '') {
            $decoded = json_decode($rawBody, true);
            if (is_array($decoded)) {
                $json = $decoded;
            }
        }
        return array_merge($_GET ?? [], $_POST ?? [], $json);
    }

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
        $input = $this->readRequestPayload();
        $text = trim((string)($input['text'] ?? ''));
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

    public function getUserProgress(?array $overrideInput = null): array
    {
        $input = $overrideInput ?? $this->readRequestPayload();
        $email = trim((string)($input['email'] ?? 'learner@mandarinku.com'));
        if ($email === '') {
            $email = 'learner@mandarinku.com';
        }

        $service = new GameFeaturesService();
        $profile = $service->getUserProgress($email);
        $history = $service->getQuizHistories($email);

        return response()->json([
            'status'       => 'success',
            'data'         => $profile,
            'quiz_history' => $history,
        ]);
    }

    public function saveUserProgress(?array $overrideInput = null): array
    {
        $input = $overrideInput ?? $this->readRequestPayload();
        $email = trim((string)($input['email'] ?? ''));
        if ($email === '') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Parameter email wajib diisi untuk sinkronisasi progres.',
            ], 422);
        }

        $service = new GameFeaturesService();
        $saved = $service->saveUserProgress($input);

        return response()->json([
            'status' => 'success',
            'data'   => $saved,
        ]);
    }

    public function getQuizHistory(?array $overrideInput = null): array
    {
        $input = $overrideInput ?? $this->readRequestPayload();
        $email = isset($input['email']) && trim((string)$input['email']) !== ''
            ? trim((string)$input['email'])
            : null;

        $service = new GameFeaturesService();
        $list = $service->getQuizHistories($email);

        return response()->json([
            'status' => 'success',
            'total'  => count($list),
            'data'   => $list,
        ]);
    }

    public function saveQuizHistory(?array $overrideInput = null): array
    {
        $input = $overrideInput ?? $this->readRequestPayload();
        $service = new GameFeaturesService();
        $record = $service->recordQuizHistory($input);

        return response()->json([
            'status' => 'success',
            'data'   => $record,
        ]);
    }

    public function getStories(?array $overrideInput = null): array
    {
        $input = $overrideInput ?? $this->readRequestPayload();
        $levelFilter = isset($input['level']) && $input['level'] !== '' && $input['level'] !== 'all'
            ? (int)$input['level']
            : null;

        $stories = [];
        for ($lvl = 1; $lvl <= 6; $lvl++) {
            $file = base_path("cerita_source/hsk{$lvl}.php");
            if (file_exists($file)) {
                $loaded = require $file;
                if (is_array($loaded)) {
                    $stories = array_merge($stories, $loaded);
                }
            }
        }

        if ($levelFilter !== null && $levelFilter >= 1 && $levelFilter <= 6) {
            $stories = array_values(array_filter(
                $stories,
                fn($s) => (int)($s['level'] ?? 0) === $levelFilter
            ));
        }

        return response()->json([
            'status' => 'success',
            'total'  => count($stories),
            'data'   => $stories,
        ]);
    }
}
