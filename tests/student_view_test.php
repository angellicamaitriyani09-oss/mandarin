<?php
require_once __DIR__ . '/../bootstrap/app.php';

$ctrl = new \App\Http\Controllers\StudentController();
$html = $ctrl->index();

assert(str_contains($html, 'id="page-beranda"'), 'Must render beranda page');
assert(str_contains($html, 'id="page-game-arena"'), 'Must render game-arena page');
assert(str_contains($html, 'id="page-fitur-pintar"'), 'Must render fitur-pintar page');
assert(str_contains($html, 'window.DB_TONE_TRAINER'), 'Must inject DB_TONE_TRAINER');
assert(str_contains($html, 'css/style.css'), 'Must include style.css');
echo "PASS: Student Blade view test\n";
