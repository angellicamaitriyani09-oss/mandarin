<?php

namespace App\Core;

class Route
{
    protected static array $routes = [];

    public static function get(string $uri, callable|array|string $action): void
    {
        self::addRoute(['GET', 'HEAD'], $uri, $action);
    }

    public static function post(string $uri, callable|array|string $action): void
    {
        self::addRoute(['POST'], $uri, $action);
    }

    public static function any(string $uri, callable|array|string $action): void
    {
        self::addRoute(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'], $uri, $action);
    }

    public static function match(array $methods, string $uri, callable|array|string $action): void
    {
        self::addRoute(array_map('strtoupper', $methods), $uri, $action);
    }

    protected static function addRoute(array $methods, string $uri, callable|array|string $action): void
    {
        $normalized = '/' . trim($uri, '/');
        if ($normalized === '//') {
            $normalized = '/';
        }
        self::$routes[] = [
            'methods' => $methods,
            'uri' => $normalized,
            'action' => $action,
        ];
    }

    public static function getRoutes(): array
    {
        return self::$routes;
    }

    public static function dispatch(string $method, string $requestUri): mixed
    {
        $path = parse_url($requestUri, PHP_URL_PATH) ?: '/';
        // Strip subdirectory prefixes (/web/public, /web, /public) when running under Laragon
        $path = preg_replace('#^/web/public(?=/|$)#i', '', $path);
        $path = preg_replace('#^/web(?=/|$)#i', '', $path);
        $path = preg_replace('#^/public(?=/|$)#i', '', $path);
        $path = '/' . trim((string)$path, '/');
        if ($path === '//') {
            $path = '/';
        }

        $method = strtoupper($method);

        foreach (self::$routes as $route) {
            if (!in_array($method, $route['methods'], true)) {
                continue;
            }

            $pattern = preg_replace('#\{([a-zA-Z0-9_]+)\}#', '(?P<$1>[^/]+)', $route['uri']);
            $regex = '#^' . $pattern . '$#';

            if (preg_match($regex, $path, $matches)) {
                $params = [];
                foreach ($matches as $key => $val) {
                    if (!is_int($key)) {
                        $params[] = $val;
                    }
                }
                return self::invokeAction($route['action'], $params);
            }
        }

        http_response_code(404);
        return "404 Not Found: " . htmlspecialchars($path);
    }

    protected static function invokeAction(callable|array|string $action, array $params = []): mixed
    {
        if (is_callable($action)) {
            return call_user_func_array($action, $params);
        }

        if (is_string($action) && str_contains($action, '@')) {
            [$class, $method] = explode('@', $action, 2);
            if (!str_starts_with($class, 'App\\')) {
                $class = 'App\\Http\\Controllers\\' . ltrim($class, '\\');
            }
            $action = [$class, $method];
        }

        if (is_array($action) && count($action) === 2) {
            [$class, $method] = $action;
            $instance = is_object($class) ? $class : new $class();
            return call_user_func_array([$instance, $method], $params);
        }

        throw new \RuntimeException('Invalid route action');
    }
}
