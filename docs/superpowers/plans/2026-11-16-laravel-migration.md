# Mandarinku Full Laravel MVC Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the entire Mandarinku application (18 student SPA modules + full CRUD Admin Panel + AJAX sync API + database schema) in `c:\laragon\www\web` into a standard runnable Laravel MVC application.

**Architecture:** We structure `c:\laragon\www\web` with Laravel's standard directory layout (`artisan`, `composer.json`, `app/Http/Controllers/`, `app/Models/`, `app/Services/`, `bootstrap/`, `config/`, `database/migrations/`, `public/`, `resources/views/`, `routes/`, `storage/`). A dual-entry bridge allows the app to serve identically via `php artisan serve`, Laragon virtual host (`public/index.php`), and Laragon subdirectory (`http://localhost/web/`), while connecting to the existing MySQL `mandarinku` database with automated JSON synchronization.

**Tech Stack:** PHP 8.3 (`C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe`), Laravel MVC (Routing, Blade, Controllers, Models, Migrations, Artisan CLI), MySQL (`mandarinku` DB via PDO/Eloquent), Vanilla JS & CSS (Dark/Light Mode).

**Spec:** `c:\laragon\www\web\docs\superpowers\specs\2026-11-16-laravel-migration-design.md`

## Global Constraints

- Lingkungan Mesin: Windows + Laragon (`PHP 8.3.33` di `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe`, Composer di `C:\laragon\bin\composer\composer.phar`).
- Database `mandarinku` pada MySQL lokal menggunakan user `root` dengan fallback password otomatis `''` atau `'ZhuoShanYi0908'`.
- Mendukung eksekusi baik melalui `php artisan serve` (`http://127.0.0.1:8000`), Laragon virtual host (`http://web.test`), maupun subdirektori Laragon (`http://localhost/web/`).
- Menyediakan rute bersih Laravel (`/`, `/admin`, `/admin/flashcards`, dll.) sekaligus rute kompatibilitas `.php` lama (`/index.php`, `/admin/index.php`, `/admin/flashcards.php`, `/admin/api_sync.php`, dll.).
- Endpoint `POST /admin/api_sync.php` (dan `/admin/api-sync`) serta form admin tidak boleh gagal karena error 419 CSRF ketika dipanggil dari `fetch()` JS existing.

## Review Focus

1. **MySQL Password Fallback (`''` vs `'ZhuoShanYi0908'`):** `GameFeaturesService` and database connection must try `''` then `'ZhuoShanYi0908'` automatically and create `mandarinku` database if missing, never crashing on connection boot.
2. **Subdirectory Asset & Route Resolution (`/web/admin/...` vs `/admin/...`):** Relative asset paths (`css/style.css`, `../css/style.css`, `js/app.js`, `assets/images/...`) and route matching must normalize any `/web` base prefix so both `http://localhost/web/` and `http://127.0.0.1:8000/` resolve routes and static assets cleanly.
3. **Legacy `.php` AJAX & Navigation Links (`admin/api_sync.php`, `admin/game_arena.php?tab=...`):** Existing frontend JS (`js/app.js` and `js/features-plus.js`) calls `admin/api_sync.php`, `admin/game_arena.php`, and `admin/fitur_cerdas.php`; routes must accept both `.php` and extensionless paths for `GET` and `POST`.
4. **CSV/JSON File Upload in `import_anatomy` (`fitur_cerdas`):** Multipart file upload (`$_FILES['import_file']` / `$request->file('import_file')`) and raw text paste (`import_raw_text`) must parse CSV, JSON, and TXT formats identically without data loss.
5. **Dark Mode Cookie & LocalStorage Sync in Blade Layouts:** Both `resources/views/layouts/app.blade.php` and `resources/views/layouts/admin.blade.php` must preserve `mandarinku_theme=dark` cookie/localStorage classes on `<html>` and `<body>`.

---

### Task 1: Laravel Framework Core, `artisan`, Autoloader & Dual-Entry Bootstrap

**Files:**
- Create: `composer.json`
- Create: `.env`
- Create: `.env.example`
- Create: `artisan`
- Create: `bootstrap/app.php`
- Create: `app/Core/Application.php`
- Create: `app/Core/Route.php`
- Create: `app/Core/View.php`
- Create: `public/index.php`
- Create: `public/.htaccess`
- Modify: `index.php`
- Create: `tests/framework_boot_test.php`

**Interfaces:**
- Consumes: none
- Produces:
  - `App\Core\Application` (`handleRequest(): void`, `runConsole(array $argv): int`, `basePath(string $path = ''): string`)
  - `App\Core\Route` (`get(string $uri, callable|array $action)`, `post(string $uri, callable|array $action)`, `any(string $uri, callable|array $action)`, `getRoutes(): array`)
  - `App\Core\View` (`make(string $view, array $data = []): string` — compiles Blade directives `@extends`, `@section`, `@yield`, `@include`, `@csrf`, `@if/@elseif/@else/@endif`, `@foreach/@endforeach`, `@for/@endfor`, `{{ }}`, `{!! !!}`)
  - Global helpers: `view(string $view, array $data = [])`, `response()`, `redirect(string $to)`, `asset(string $path)`, `url(string $path = '')`, `csrf_token()`, `csrf_field()`, `env(string $key, $default = null)`

- [ ] **Step 1: Write the failing test `tests/framework_boot_test.php`**

```php
<?php
require_once __DIR__ . '/../bootstrap/app.php';

assert(class_exists(\App\Core\Application::class), 'Application class must exist');
assert(class_exists(\App\Core\Route::class), 'Route facade must exist');
assert(class_exists(\App\Core\View::class), 'Blade View compiler must exist');
assert(function_exists('view') && function_exists('asset'), 'Laravel global helpers must exist');
echo "PASS: Framework boot test\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/framework_boot_test.php`
Expected: FAIL with "Failed opening required '.../bootstrap/app.php'"

- [ ] **Step 3: Implement `composer.json`, `.env`, `.env.example`, `bootstrap/app.php`, `app/Core/Application.php`, `app/Core/Route.php`, `app/Core/View.php`, `artisan`, and `public/index.php`**

Implement PSR-4 autoloader + Laravel application kernel, Blade template compiler supporting `@extends`, `@section`, `@yield`, `@include`, `@csrf`, `{{ }}`, `{!! !!}`, and inline PHP blocks, plus `artisan` CLI (`serve`, `route:list`, `migrate`, `db:seed`, `view:clear`) and URI normalization stripping `/web` or `/public` prefixes automatically.

- [ ] **Step 4: Run test to verify it passes**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/framework_boot_test.php`
Expected: `PASS: Framework boot test`

---

### Task 2: Database Service, Eloquent-Style Models & Migrations

**Files:**
- Create: `app/Services/GameFeaturesService.php`
- Create: `app/Models/Model.php`
- Create: `app/Models/User.php`
- Create: `app/Models/Module.php`
- Create: `app/Models/Question.php`
- Create: `app/Models/Flashcard.php`
- Create: `app/Models/GameToneTrainer.php`
- Create: `app/Models/GameWordLink.php`
- Create: `app/Models/GameMemoryMatch.php`
- Create: `app/Models/GamePinyinHanzi.php`
- Create: `app/Models/SmartHanziAnatomy.php`
- Create: `app/Models/SmartLeaderboard.php`
- Modify: `database/migrations/2024_05_20_000000_create_mandarinku_schema.php`
- Create: `tests/database_service_test.php`

**Interfaces:**
- Consumes: `bootstrap/app.php`
- Produces:
  - `App\Services\GameFeaturesService`:
    - `getPdo(): ?\PDO` (auto-connects to `127.0.0.1` `mandarinku` trying `''` then `'ZhuoShanYi0908'`, initializes all 10 tables and seeds defaults if empty)
    - `getAllToneTrainer(): array`
    - `getAllWordLink(): array`
    - `getAllMemoryMatch(): array`
    - `getAllPinyinHanzi(): array`
    - `getAllHanziAnatomy(): array`
    - `getAllLeaderboard(): array`
    - `syncGameArenaToJson(): void`
    - `syncFiturCerdasToJson(): void`
  - Global backwards-compatible functions (`get_all_tone_trainer()`, `get_all_word_link()`, `get_all_memory_match()`, `get_all_pinyin_hanzi()`, `get_all_hanzi_anatomy()`, `get_all_leaderboard()`, `sync_game_arena_to_json()`, `sync_fitur_cerdas_to_json()`) delegating to `GameFeaturesService`.

- [ ] **Step 1: Write the failing test `tests/database_service_test.php`**

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/database_service_test.php`
Expected: FAIL with "Class 'App\Services\GameFeaturesService' not found"

- [ ] **Step 3: Implement `App\Services\GameFeaturesService`, `App\Models\*`, and `database/migrations/2024_05_20_000000_create_mandarinku_schema.php`**

Migrate all schema creation, seeding, JSON fallback, and CRUD helpers from `config/database.php` and `config/game_features_db.php` into `App\Services\GameFeaturesService` and `App\Models\*`, keeping `config/game_features_db.php` as a thin wrapper for backwards compatibility.

- [ ] **Step 4: Run test to verify it passes**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/database_service_test.php`
Expected: `PASS: Database service & models test`

---

### Task 3: Student SPA Controller & Blade Views (`layouts/app.blade.php` + 18 `pages/*.blade.php`)

**Files:**
- Create: `app/Http/Controllers/Controller.php`
- Create: `app/Http/Controllers/StudentController.php`
- Create: `resources/views/layouts/app.blade.php`
- Create: `resources/views/partials/navbar.blade.php`
- Create: `resources/views/partials/footer.blade.php`
- Create: `resources/views/student/index.blade.php`
- Create: `resources/views/pages/login.blade.php`
- Create: `resources/views/pages/beranda.blade.php`
- Create: `resources/views/pages/listening.blade.php`
- Create: `resources/views/pages/speaking.blade.php`
- Create: `resources/views/pages/reading.blade.php`
- Create: `resources/views/pages/writing.blade.php`
- Create: `resources/views/pages/flashcard.blade.php`
- Create: `resources/views/pages/quiz.blade.php`
- Create: `resources/views/pages/bank-soal.blade.php`
- Create: `resources/views/pages/hsk.blade.php`
- Create: `resources/views/pages/profil.blade.php`
- Create: `resources/views/pages/modul-detail.blade.php`
- Create: `resources/views/pages/cerita.blade.php`
- Create: `resources/views/pages/latihan-ekstra.blade.php`
- Create: `resources/views/pages/cetak-hanzi.blade.php`
- Create: `resources/views/pages/game-arena.blade.php`
- Create: `resources/views/pages/fitur-pintar.blade.php`
- Create: `resources/views/pages/admin.blade.php`
- Create: `tests/student_view_test.php`

**Interfaces:**
- Consumes: `App\Services\GameFeaturesService`, `App\Core\View`
- Produces:
  - `App\Http\Controllers\StudentController::index(): string` (renders `student.index` Blade view with `$frontendToneTrainer`, `$frontendWordLink`, `$frontendMemoryMatch`, `$frontendPinyinHanzi`, `$frontendAnatomy`, `$frontendLeaderboard`)

- [ ] **Step 1: Write the failing test `tests/student_view_test.php`**

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/student_view_test.php`
Expected: FAIL with "Class 'App\Http\Controllers\StudentController' not found"

- [ ] **Step 3: Implement `StudentController` and convert `includes/*.php` and `pages/*.php` into `resources/views/` Blade templates**

Create `resources/views/layouts/app.blade.php`, `resources/views/partials/navbar.blade.php`, `resources/views/partials/footer.blade.php`, `resources/views/student/index.blade.php`, and all 18 `resources/views/pages/*.blade.php` templates, injecting game and smart feature datasets from `GameFeaturesService`.

- [ ] **Step 4: Run test to verify it passes**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/student_view_test.php`
Expected: `PASS: Student Blade view test`

---

### Task 4: Admin Controllers, AJAX Sync API, Blade Views, Routes & Public Asset Bridge

**Files:**
- Create: `app/Http/Controllers/AdminController.php`
- Create: `app/Http/Controllers/AdminApiController.php`
- Create: `app/Http/Controllers/MandarinkuApiController.php`
- Create: `resources/views/layouts/admin.blade.php`
- Create: `resources/views/admin/index.blade.php`
- Create: `resources/views/admin/login.blade.php`
- Create: `resources/views/admin/users.blade.php`
- Create: `resources/views/admin/modules.blade.php`
- Create: `resources/views/admin/questions.blade.php`
- Create: `resources/views/admin/flashcards.blade.php`
- Create: `resources/views/admin/game_arena.blade.php`
- Create: `resources/views/admin/fitur_cerdas.blade.php`
- Create: `routes/web.php`
- Create: `routes/api.php`
- Modify: `admin/index.php`, `admin/login.php`, `admin/logout.php`, `admin/users.php`, `admin/modules.php`, `admin/questions.php`, `admin/flashcards.php`, `admin/game_arena.php`, `admin/fitur_cerdas.php`, `admin/api_sync.php`, `admin/setup_db.php` (delegate to Laravel kernel so direct Apache access also runs through Laravel)
- Create: `tests/admin_and_routes_test.php`

**Interfaces:**
- Consumes: `App\Core\Application`, `App\Core\Route`, `App\Services\GameFeaturesService`, `App\Models\*`
- Produces:
  - `App\Http\Controllers\AdminController` (`index`, `login`, `logout`, `users`, `modules`, `questions`, `flashcards`, `gameArena`, `fiturCerdas`, `setupDb`)
  - `App\Http\Controllers\AdminApiController` (`sync`)
  - `App\Http\Controllers\MandarinkuApiController` (`getModules`, `getBankQuestions`, `checkAIGrammar`)
  - Complete route table in `routes/web.php` and `routes/api.php`

- [ ] **Step 1: Write the failing test `tests/admin_and_routes_test.php`**

```php
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

$routes = \App\Core\Route::getRoutes();
assert(count($routes) >= 20, 'Web and API routes must be registered');
echo "PASS: Admin controllers, Blade views, and routes test\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/admin_and_routes_test.php`
Expected: FAIL with "Class 'App\Http\Controllers\AdminController' not found"

- [ ] **Step 3: Implement `AdminController`, `AdminApiController`, `MandarinkuApiController`, `resources/views/layouts/admin.blade.php`, `resources/views/admin/*.blade.php`, `routes/web.php`, `routes/api.php`, and `public/` asset links**

Migrate all Admin Panel pages and `admin/api_sync.php` (including CSV/JSON/TXT upload & paste import in `fitur_cerdas`) into Laravel controllers and Blade views, register all clean and `.php` compatibility routes in `routes/web.php` and `routes/api.php`, route entry points through `bootstrap/app.php`, and verify `php artisan route:list`.

- [ ] **Step 4: Run tests and `php artisan route:list` to verify everything passes**

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe tests/admin_and_routes_test.php`
Expected: `PASS: Admin controllers, Blade views, and routes test`

Run: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe artisan route:list`
Expected: Displays all registered Student, Admin, and API routes with exit code 0.
