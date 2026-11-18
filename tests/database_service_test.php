<?php
require_once __DIR__ . '/../bootstrap/app.php';

$svc = new \App\Services\GameFeaturesService();
$tones = $svc->getAllToneTrainer();
$links = $svc->getAllWordLink();
$mem = $svc->getAllMemoryMatch();
$ph = $svc->getAllPinyinHanzi();
$anat = $svc->getAllHanziAnatomy();
$lb = $svc->getAllLeaderboard();

assert(is_array($tones) && count($tones) > 0, 'ToneTrainer data must not be empty');
assert(is_array($links) && count($links) > 0, 'WordLink data must not be empty');
assert(is_array($anat) && count($anat) > 0, 'HanziAnatomy data must not be empty');
assert(\App\Models\Flashcard::count() >= 0, 'Flashcard model count must work');
echo "PASS: Database service & models test\n";
