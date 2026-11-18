<?php

// PSR-4 Autoloader for App\ and Database\Seeders\
spl_autoload_register(function (string $class) {
    $prefixes = [
        'App\\' => dirname(__DIR__) . '/app/',
        'Database\\Seeders\\' => dirname(__DIR__) . '/database/seeders/',
    ];

    foreach ($prefixes as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }
        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Load Composer autoloader if vendor/autoload.php is present
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

// Alias Illuminate\Support\Facades\Route to App\Core\Route if not loaded from vendor
if (!class_exists('Illuminate\\Support\\Facades\\Route')) {
    class_alias(\App\Core\Route::class, 'Illuminate\\Support\\Facades\\Route');
}

// Parse .env file
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\n\r\0\x0B\"'");
        $_ENV[$k] = $v;
        putenv("{$k}={$v}");
    }
}

if (!function_exists('env')) {
    function env(string $key, mixed $default = null): mixed
    {
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }
}

if (!function_exists('base_path')) {
    function base_path(string $path = ''): string
    {
        $base = str_replace('\\', '/', dirname(__DIR__));
        return $base . ($path !== '' ? '/' . ltrim($path, '/') : '');
    }
}

if (!function_exists('public_path')) {
    function public_path(string $path = ''): string
    {
        return base_path('public' . ($path !== '' ? '/' . ltrim($path, '/') : ''));
    }
}

if (!function_exists('storage_path')) {
    function storage_path(string $path = ''): string
    {
        return base_path('storage' . ($path !== '' ? '/' . ltrim($path, '/') : ''));
    }
}

if (!function_exists('view')) {
    function view(string $viewName, array $data = []): string
    {
        return \App\Core\View::make($viewName, $data);
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
        $baseUrl = '';
        if (str_contains($scriptName, '/web/')) {
            $baseUrl = '/web';
        }
        return $baseUrl . '/' . ltrim($path, '/');
    }
}

if (!function_exists('url')) {
    function url(string $path = ''): string
    {
        return asset($path);
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            @session_start();
        }
        if (empty($_SESSION['_token'])) {
            $_SESSION['_token'] = bin2hex(random_bytes(16));
        }
        return $_SESSION['_token'];
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_token" value="' . htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8') . '">';
    }
}

if (!function_exists('redirect')) {
    function redirect(string $to): never
    {
        header('Location: ' . $to);
        exit();
    }
}

if (!function_exists('response')) {
    function response(): object
    {
        return new class {
            public function json(array $data, int $status = 200): array
            {
                if (!headers_sent()) {
                    http_response_code($status);
                    header('Content-Type: application/json; charset=utf-8');
                }
                return $data;
            }
        };
    }
}

// Configure Laravel session storage path in storage/framework/sessions
$sessionDir = dirname(__DIR__) . '/storage/framework/sessions';
if (!is_dir($sessionDir)) {
    @mkdir($sessionDir, 0777, true);
}
if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
    @session_save_path($sessionDir);
    @session_start();
}
if (!isset($_SESSION) || !is_array($_SESSION)) {
    $_SESSION = [];
}
$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$_SERVER['PHP_SELF'] = $_SERVER['PHP_SELF'] ?? '/index.php';

$app = new \App\Core\Application(dirname(__DIR__));
return $app;
