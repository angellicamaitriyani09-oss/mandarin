<?php

namespace App\Http\Controllers;

use App\Services\GameFeaturesService;

class StudentController extends Controller
{
    public function index(): string
    {
        $service = new GameFeaturesService();

        return view('student.index', [
            'frontendToneTrainer' => $service->getAllToneTrainer(),
            'frontendWordLink'    => $service->getAllWordLink(),
            'frontendMemoryMatch' => $service->getAllMemoryMatch(),
            'frontendPinyinHanzi' => $service->getAllPinyinHanzi(),
            'frontendAnatomy'     => $service->getAllHanziAnatomy(),
            'frontendLeaderboard' => $service->getAllLeaderboard(),
        ]);
    }
}
