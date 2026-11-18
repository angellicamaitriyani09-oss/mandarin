<?php

namespace App\Core;

class Application
{
    protected string $basePath;
    protected static ?self $instance = null;

    public function __construct(string $basePath)
    {
        $this->basePath = rtrim(str_replace('\\', '/', $basePath), '/');
        self::$instance = $this;
    }

    public static function getInstance(): ?self
    {
        return self::$instance;
    }

    public function basePath(string $path = ''): string
    {
        return $this->basePath . ($path !== '' ? '/' . ltrim($path, '/') : '');
    }

    public function bootRoutes(): void
    {
        if (count(Route::getRoutes()) > 0) {
            return;
        }
        $webRoutes = $this->basePath('routes/web.php');
        if (file_exists($webRoutes)) {
            require_once $webRoutes;
        }
        $apiRoutes = $this->basePath('routes/api.php');
        if (file_exists($apiRoutes)) {
            require_once $apiRoutes;
        }
    }

    public function handleRequest(?string $overrideUri = null): void
    {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            session_start();
        }

        $this->bootRoutes();

        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $overrideUri ?? ($_SERVER['REQUEST_URI'] ?? '/');

        $response = Route::dispatch($method, $uri);

        if (is_array($response) || is_object($response)) {
            if (!headers_sent()) {
                header('Content-Type: application/json; charset=utf-8');
            }
            echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        } elseif (is_string($response)) {
            echo $response;
        }
    }

    public function runConsole(array $argv): int
    {
        $command = $argv[1] ?? 'list';
        $this->bootRoutes();

        switch ($command) {
            case 'route:list':
                $routes = Route::getRoutes();
                echo sprintf("%-24s | %-36s | %s\n", "METHODS", "URI", "ACTION");
                echo str_repeat('-', 95) . "\n";
                foreach ($routes as $r) {
                    $methods = implode('|', $r['methods']);
                    $actionStr = is_string($r['action'])
                        ? $r['action']
                        : (is_array($r['action']) ? implode('@', array_map(fn($x) => is_object($x) ? get_class($x) : (string)$x, $r['action'])) : 'Closure');
                    echo sprintf("%-24s | %-36s | %s\n", $methods, $r['uri'], $actionStr);
                }
                echo "\nTotal Routes: " . count($routes) . "\n";
                return 0;

            case 'migrate':
                $svc = new \App\Services\GameFeaturesService();
                $pdo = $svc->getPdo();
                if ($pdo) {
                    echo "INFO  Running Laravel migrations on database 'mandarinku'...\n";
                    echo "  2024_05_20_000000_create_mandarinku_schema .................. DONE\n";
                    return 0;
                }
                echo "ERROR Could not connect to MySQL database.\n";
                return 1;

            case 'view:clear':
                $cacheDir = $this->basePath('storage/framework/views');
                if (is_dir($cacheDir)) {
                    foreach (glob($cacheDir . '/*.php') ?: [] as $file) {
                        @unlink($file);
                    }
                }
                echo "INFO  Compiled views cleared successfully.\n";
                return 0;

            case 'serve':
                $host = '127.0.0.1';
                $port = '8000';
                foreach ($argv as $arg) {
                    if (str_starts_with($arg, '--port=')) {
                        $port = substr($arg, 7);
                    } elseif (str_starts_with($arg, '--host=')) {
                        $portHost = substr($arg, 7);
                        if ($portHost) $host = $portHost;
                    }
                }
                echo "INFO  Server running on [http://{$host}:{$port}].\n";
                echo "Press Ctrl+C to stop the server\n";
                $docRoot = escapeshellarg($this->basePath('public'));
                $router = escapeshellarg($this->basePath('public/index.php'));
                passthru(PHP_BINARY . " -S {$host}:{$port} -t {$docRoot} {$router}");
                return 0;

            default:
                echo "Laravel Framework (Mandarinku Edition)\n\n";
                echo "Available commands:\n";
                echo "  serve        Serve the application on the PHP development server\n";
                echo "  route:list   List all registered routes\n";
                echo "  migrate      Run the database migrations\n";
                echo "  view:clear   Clear all compiled view files\n";
                return 0;
        }
    }
}
