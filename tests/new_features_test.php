<?php
require_once __DIR__ . '/../bootstrap/app.php';

$svc = new \App\Services\GameFeaturesService();

// Snapshot existing JSON stores so test mutations don't leave test fixtures behind
$userJsonPath = base_path('data/user_progress.json');
$histJsonPath = base_path('data/quiz_histories.json');
$origUserJson = file_exists($userJsonPath) ? file_get_contents($userJsonPath) : null;
$origHistJson = file_exists($histJsonPath) ? file_get_contents($histJsonPath) : null;

try {
    // 1. Test QuizHistory model class
    assert(class_exists(\App\Models\QuizHistory::class), 'QuizHistory model must exist');
    assert(\App\Models\QuizHistory::getTable() === 'quiz_histories', 'QuizHistory table name must match');

    // 2. Test saveUserProgress & getUserProgress
    $testEmail = 'unittest.sync@mandarinku.com';
    $savedUser = $svc->saveUserProgress([
        'name' => 'Unit Test Student',
        'email' => $testEmail,
        'role' => 'student',
        'level' => 3,
        'exp' => 145,
        'max_exp' => 700,
        'points' => 320,
        'streak' => 9,
        'study_hours' => 12,
        'completed_modules' => 8,
        'progress' => ['listening' => 75, 'speaking' => 60, 'reading' => 80, 'writing' => 55],
    ]);
    assert($savedUser['email'] === $testEmail, 'Saved email must match');
    assert($savedUser['level'] === 3 && $savedUser['exp'] === 145, 'Saved level and exp must match');

    $fetchedUser = $svc->getUserProgress($testEmail);
    assert($fetchedUser['name'] === 'Unit Test Student', 'Fetched user name must match');
    assert((int)$fetchedUser['streak'] === 9, 'Fetched streak must match');
    assert((int)$fetchedUser['progress']['reading'] === 80, 'Fetched skill progress must match');

    // 3. Test recordQuizHistory & getQuizHistories & XP increment
    $recordedQuiz = $svc->recordQuizHistory([
        'user_email' => $testEmail,
        'user_name' => 'Unit Test Student',
        'hsk_level' => 'HSK 3',
        'skill_type' => 'reading',
        'quiz_mode' => 'timed',
        'total_questions' => 10,
        'correct_answers' => 9,
        'score_percent' => 90,
        'grade' => 'A+',
        'exp_earned' => 165,
        'points_earned' => 110,
    ]);
    assert((int)$recordedQuiz['score_percent'] === 90, 'Recorded score percent must match');
    assert($recordedQuiz['grade'] === 'A+', 'Recorded grade must match');

    $userHistories = $svc->getQuizHistories($testEmail);
    assert(count($userHistories) >= 1, 'User quiz history must contain recorded attempt');
    assert($userHistories[0]['hsk_level'] === 'HSK 3', 'Quiz history HSK level must match');

    $afterQuizUser = $svc->getUserProgress($testEmail);
    assert((int)$afterQuizUser['exp'] === 310, 'User EXP must increment cleanly (145 + 165 = 310)');
    assert((int)$afterQuizUser['points'] === 430, 'User points must increment cleanly (320 + 110 = 430)');

    // 4. Test getAllUsersWithStats
    $allUsersStats = $svc->getAllUsersWithStats();
    assert(count($allUsersStats) >= 1, 'getAllUsersWithStats must return seeded/saved users');

    // 5. Test MandarinkuApiController endpoints & routes
    $app = \App\Core\Application::getInstance();
    $app->bootRoutes();
    $routes = \App\Core\Route::getRoutes();
    $routeUris = array_map(fn($r) => $r['uri'], $routes);
    assert(in_array('/api/user-progress', $routeUris, true), '/api/user-progress route must be registered');
    assert(in_array('/api/quiz-history', $routeUris, true), '/api/quiz-history route must be registered');
    assert(in_array('/api/stories', $routeUris, true), '/api/stories route must be registered');

    $apiCtrl = new \App\Http\Controllers\MandarinkuApiController();
    $resGetProg = $apiCtrl->getUserProgress(['email' => $testEmail]);
    assert($resGetProg['status'] === 'success' && $resGetProg['data']['email'] === $testEmail, 'API getUserProgress must succeed');
    assert(is_array($resGetProg['quiz_history']) && count($resGetProg['quiz_history']) >= 1, 'API getUserProgress must include quiz_history');

    $resSaveProg = $apiCtrl->saveUserProgress(['email' => $testEmail, 'name' => 'Unit Test Student Updated', 'exp' => 350]);
    assert($resSaveProg['status'] === 'success' && $resSaveProg['data']['name'] === 'Unit Test Student Updated', 'API saveUserProgress must succeed');

    $resGetHist = $apiCtrl->getQuizHistory(['email' => $testEmail]);
    assert($resGetHist['status'] === 'success' && $resGetHist['total'] >= 1, 'API getQuizHistory must succeed');

    $resSaveHist = $apiCtrl->saveQuizHistory(['user_email' => $testEmail, 'hsk_level' => 'HSK 4', 'total_questions' => 10, 'correct_answers' => 8]);
    assert($resSaveHist['status'] === 'success' && (int)$resSaveHist['data']['score_percent'] === 80, 'API saveQuizHistory must succeed');

    $resStoriesAll = $apiCtrl->getStories([]);
    assert($resStoriesAll['status'] === 'success' && (int)$resStoriesAll['total'] === 24, 'API getStories must return 24 stories');

    $resStoriesHsk6 = $apiCtrl->getStories(['level' => 6]);
    assert($resStoriesHsk6['status'] === 'success' && (int)$resStoriesHsk6['total'] === 4, 'API getStories(level=6) must return 4 stories');

    // 6. Verify js/cerita-data.js contains all 24 compiled stories with ruby annotations
    $ceritaJs = file_get_contents(base_path('js/cerita-data.js'));
    assert(is_string($ceritaJs), 'js/cerita-data.js must exist');
    $jsonPart = preg_replace('/^.*?window\.MandarinkuCeritaData\s*=\s*/s', '', $ceritaJs);
    $jsonPart = rtrim(trim($jsonPart), ';');
    $decodedStories = json_decode($jsonPart, true);
    assert(is_array($decodedStories) && count($decodedStories) === 24, 'js/cerita-data.js must decode cleanly to 24 stories');
    foreach ($decodedStories as $st) {
        assert(count($st['questions'] ?? []) === 5, "Story {$st['id']} must have 5 questions");
        $isNewStory = str_ends_with($st['id'], '-4');
        foreach ($st['paragraphs'] as $pIdx => $para) {
            assert(!empty($para['rubyHtml']), "Story {$st['id']} paragraph {$pIdx} must have rubyHtml");
            if ($isNewStory) {
                assert(!str_contains($para['rubyHtml'], '<rt></rt>'), "New story {$st['id']} paragraph {$pIdx} must have complete ruby pinyin annotations");
            }
        }
    }

    // 7. Verify Admin Users & Dashboard Blade Views render cleanly
    $_SESSION['admin_id'] = 1;
    $_SESSION['admin_name'] = 'Administrator';
    $_SESSION['admin_email'] = 'admin@mandarinku.com';
    $_SESSION['admin_role'] = 'admin';

    $adminCtrl = new \App\Http\Controllers\AdminController();
    $usersHtml = $adminCtrl->users();
    assert(str_contains($usersHtml, 'Ekspor CSV / Excel'), 'Admin users view must include CSV export button');
    assert(str_contains($usersHtml, 'Cetak Laporan Nilai (PDF)'), 'Admin users view must include Print PDF button');
    assert(str_contains($usersHtml, 'quizHistoryAdminTable'), 'Admin users view must include quiz history transcript table');

    $dashHtml = $adminCtrl->index();
    assert(str_contains($dashHtml, 'Riwayat Kuis Siswa'), 'Admin dashboard must show Quiz History summary card');

    echo "PASS: New features (Cloud Sync, Quiz History, Admin Print/CSV Reports, & 24 Interactive Stories) verified!\n";
} finally {
    // Cleanup temporary test user from JSON stores (and MySQL if connected)
    if ($origUserJson !== null) {
        file_put_contents($userJsonPath, $origUserJson);
    }
    if ($origHistJson !== null) {
        file_put_contents($histJsonPath, $origHistJson);
    }
    if ($svc->isDbConnected()) {
        try {
            $pdo = $svc->getPdo();
            $pdo->prepare("DELETE FROM users WHERE email = ?")->execute(['unittest.sync@mandarinku.com']);
            $pdo->prepare("DELETE FROM quiz_histories WHERE user_email = ?")->execute(['unittest.sync@mandarinku.com']);
        } catch (\Throwable $e) {
        }
    }
}
