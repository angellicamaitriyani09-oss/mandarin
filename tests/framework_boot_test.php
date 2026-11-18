<?php
require_once __DIR__ . '/../bootstrap/app.php';

assert(class_exists(\App\Core\Application::class), 'Application class must exist');
assert(class_exists(\App\Core\Route::class), 'Route facade must exist');
assert(class_exists(\App\Core\View::class), 'Blade View compiler must exist');
assert(function_exists('view') && function_exists('asset'), 'Laravel global helpers must exist');
echo "PASS: Framework boot test\n";
