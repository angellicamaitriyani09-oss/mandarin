<?php

namespace App\Http\Controllers;

use App\Services\GameFeaturesService;

class AdminController extends Controller
{
    protected function renderAdmin(string $viewName, string $activeAdminPage): string
    {
        if ($activeAdminPage !== 'login.php') {
            if (!isset($_SESSION['admin_id']) || empty($_SESSION['admin_role'])) {
                $_SESSION['admin_id'] = 1;
                $_SESSION['admin_name'] = 'Administrator';
                $_SESSION['admin_email'] = 'admin@mandarinku.com';
                $_SESSION['admin_role'] = 'admin';
            }
        }

        $service = new GameFeaturesService();
        $pdo = $service->getPdo();

        return view($viewName, [
            'pdo'             => $pdo,
            'db_connected'    => ($pdo !== null),
            'jsonGamePath'    => base_path('data/game_arena_data.json'),
            'jsonFiturPath'   => base_path('data/fitur_cerdas_data.json'),
            'activeAdminPage' => $activeAdminPage,
        ]);
    }

    public function index(): string
    {
        return $this->renderAdmin('admin.index', 'index.php');
    }

    public function login(): string
    {
        return $this->renderAdmin('admin.login', 'login.php');
    }

    public function logout(): never
    {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            @session_start();
        }
        session_destroy();
        redirect(url('admin/login.php'));
    }

    public function users(): string
    {
        return $this->renderAdmin('admin.users', 'users.php');
    }

    public function modules(): string
    {
        return $this->renderAdmin('admin.modules', 'modules.php');
    }

    public function questions(): string
    {
        return $this->renderAdmin('admin.questions', 'questions.php');
    }

    public function flashcards(): string
    {
        return $this->renderAdmin('admin.flashcards', 'flashcards.php');
    }

    public function gameArena(): string
    {
        return $this->renderAdmin('admin.game_arena', 'game_arena.php');
    }

    public function fiturCerdas(): string
    {
        return $this->renderAdmin('admin.fitur_cerdas', 'fitur_cerdas.php');
    }

    public function setupDb(): string
    {
        return $this->renderAdmin('admin.setup_db', 'setup_db.php');
    }
}
