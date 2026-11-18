<?php
require_once __DIR__ . '/../bootstrap/app.php';

$adminCtrl = new \App\Http\Controllers\AdminController();
$dashHtml = $adminCtrl->index();
assert(str_contains($dashHtml, 'Selamat Datang'), 'Admin dashboard must render');
assert(str_contains($dashHtml, 'admin-theme-toggle-btn'), 'Admin dark mode toggle must exist');

$fcHtml = $adminCtrl->flashcards();
assert(str_contains($fcHtml, 'Kelola Flashcard Kosakata'), 'Admin flashcards view must render');

$gaHtml = $adminCtrl->gameArena();
assert(str_contains($gaHtml, 'Kelola Game Arena'), 'Admin game arena view must render');

$fcSmartHtml = $adminCtrl->fiturCerdas();
assert(str_contains($fcSmartHtml, 'Kelola Fitur Cerdas'), 'Admin fitur cerdas view must render');

// Test Issue 1: Admin login view renders full HTML layout when logged out
$_SESSION = [];
$loginHtml = $adminCtrl->login();
assert(str_contains($loginHtml, '<!DOCTYPE html>'), 'Login view must extend layouts.admin');
assert(str_contains($loginHtml, 'Login Pengelola'), 'Login view must render form instead of redirecting');

// Test Issue 3: Sidebar links use url('admin/...') so /admin without trailing slash resolves properly
$dashHtml2 = $adminCtrl->index();
assert(str_contains($dashHtml2, 'admin/users.php'), 'Sidebar links must include admin/ prefix');

// Test Issue 2: api_sync_handler supports add_leaderboard / import_anatomy / add_pinyin aliases
$apiHandlerCode = file_get_contents(__DIR__ . '/../resources/views/admin/api_sync_handler.php');
assert(str_contains($apiHandlerCode, 'import_anatomy'), 'api_sync_handler must support import_anatomy');
assert(str_contains($apiHandlerCode, 'add_leaderboard'), 'api_sync_handler must support add_leaderboard');

$app = \App\Core\Application::getInstance();
$app->bootRoutes();
$routes = \App\Core\Route::getRoutes();
assert(count($routes) >= 20, 'Web and API routes must be registered');
echo "PASS: Admin controllers, Blade views, and routes test\n";
