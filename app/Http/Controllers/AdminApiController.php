<?php

namespace App\Http\Controllers;

use App\Services\GameFeaturesService;

class AdminApiController extends Controller
{
    public function sync(): string
    {
        $service = new GameFeaturesService();
        $pdo = $service->getPdo();
        $db_connected = ($pdo !== null);
        $jsonGamePath = base_path('data/game_arena_data.json');
        $jsonFiturPath = base_path('data/fitur_cerdas_data.json');

        ob_start();
        include base_path('resources/views/admin/api_sync_handler.php');
        return (string)ob_get_clean();
    }
}
