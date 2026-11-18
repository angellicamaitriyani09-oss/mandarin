<?php

define('LARAVEL_START', microtime(true));

// Built-in PHP server static file fallback (for `php artisan serve`)
if (PHP_SAPI === 'cli-server') {
    $urlPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if ($urlPath && $urlPath !== '/' && !str_ends_with($urlPath, '.php')) {
        $publicFile = __DIR__ . $urlPath;
        $rootFile = dirname(__DIR__) . $urlPath;
        if (is_file($publicFile)) {
            return false;
        }
        if (is_file($rootFile)) {
            $ext = strtolower(pathinfo($rootFile, PATHINFO_EXTENSION));
            $mimes = [
                'css'  => 'text/css; charset=utf-8',
                'js'   => 'application/javascript; charset=utf-8',
                'json' => 'application/json; charset=utf-8',
                'svg'  => 'image/svg+xml',
                'png'  => 'image/png',
                'jpg'  => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'ico'  => 'image/x-icon',
                'wav'  => 'audio/wav',
                'mp3'  => 'audio/mpeg',
            ];
            if (isset($mimes[$ext])) {
                header('Content-Type: ' . $mimes[$ext]);
            }
            readfile($rootFile);
            exit();
        }
    }
}

/** @var \App\Core\Application $app */
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$app->handleRequest();
