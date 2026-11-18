<?php

namespace App\Core;

class View
{
    protected static array $sections = [];
    protected static array $sectionStack = [];

    public static function make(string $view, array $data = []): string
    {
        return self::renderView($view, $data);
    }

    public static function renderView(string $view, array $__data = []): string
    {
        $viewPath = self::resolveViewPath($view);
        $compiledPath = self::getCompiledPath($viewPath);

        $parentLayout = null;
        $rawContent = file_get_contents($viewPath);

        if (preg_match('/@extends\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)/', $rawContent, $m)) {
            $parentLayout = $m[1];
        }

        extract($__data, EXTR_SKIP);

        ob_start();
        include $compiledPath;
        $output = ob_get_clean();

        if ($parentLayout) {
            return self::renderView($parentLayout, $__data);
        }

        return $output;
    }

    public static function startSection(string $name, ?string $inlineContent = null): void
    {
        if ($inlineContent !== null) {
            self::$sections[$name] = $inlineContent;
            return;
        }
        self::$sectionStack[] = $name;
        ob_start();
    }

    public static function endSection(): void
    {
        $content = ob_get_clean();
        $name = array_pop(self::$sectionStack);
        if ($name !== null) {
            self::$sections[$name] = $content;
        }
    }

    public static function yieldContent(string $name, string $default = ''): string
    {
        return self::$sections[$name] ?? $default;
    }

    public static function resolveViewPath(string $view): string
    {
        $rel = str_replace('.', '/', $view);
        $base = dirname(__DIR__, 2) . '/resources/views/';
        $candidates = [
            $base . $rel . '.blade.php',
            $base . $rel . '.php',
        ];
        foreach ($candidates as $file) {
            if (file_exists($file)) {
                return $file;
            }
        }
        throw new \RuntimeException("Blade view [{$view}] not found in resources/views/.");
    }

    public static function getCompiledPath(string $viewPath): string
    {
        $cacheDir = dirname(__DIR__, 2) . '/storage/framework/views';
        if (!is_dir($cacheDir)) {
            @mkdir($cacheDir, 0777, true);
        }

        $hash = md5($viewPath);
        $compiledFile = $cacheDir . '/' . $hash . '.php';

        if (!file_exists($compiledFile) || filemtime($viewPath) >= filemtime($compiledFile)) {
            $raw = file_get_contents($viewPath);
            $compiled = self::compileString($raw);
            file_put_contents($compiledFile, $compiled);
        }

        return $compiledFile;
    }

    public static function compileString(string $value): string
    {
        // Strip @extends (handled by renderView)
        $value = preg_replace('/@extends\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)/', '', $value);

        // Inline @section('name', 'value')
        $value = preg_replace(
            '/@section\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^\n\r\)]+)\)/',
            '<?php \App\Core\View::startSection(\'$1\', $2); ?>',
            $value
        );

        // Block @section('name') ... @endsection
        $value = preg_replace(
            '/@section\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)/',
            '<?php \App\Core\View::startSection(\'$1\'); ?>',
            $value
        );
        $value = preg_replace('/@endsection\b/', '<?php \App\Core\View::endSection(); ?>', $value);

        // @yield('name', 'default') and @yield('name')
        $value = preg_replace(
            '/@yield\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^\n\r\)]+)\)/',
            '<?= \App\Core\View::yieldContent(\'$1\', $2) ?>',
            $value
        );
        $value = preg_replace(
            '/@yield\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)/',
            '<?= \App\Core\View::yieldContent(\'$1\') ?>',
            $value
        );

        // @include('view.name', [...]) and @include('view.name')
        $value = preg_replace(
            '/@include\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*(\[[^\]]*\])\s*\)/',
            '<?= \App\Core\View::renderView(\'$1\', array_merge(get_defined_vars(), $2)) ?>',
            $value
        );
        $value = preg_replace(
            '/@include\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)/',
            '<?= \App\Core\View::renderView(\'$1\', get_defined_vars()) ?>',
            $value
        );

        // @csrf
        $value = preg_replace('/@csrf\b/', '<?= csrf_field() ?>', $value);

        // @php and @endphp
        $value = preg_replace('/@php\b/', '<?php ', $value);
        $value = preg_replace('/@endphp\b/', ' ?>', $value);

        // Unescaped {!! ... !!}
        $value = preg_replace('/\{!!\s*(.+?)\s*!!\}/s', '<?= $1 ?>', $value);

        // Escaped {{ ... }} (ignore @{{ ... }} for JS templates if any)
        $value = preg_replace('/(?<!@)\{\{\s*(.+?)\s*\}\}/s', '<?= htmlspecialchars((string)($1), ENT_QUOTES, \'UTF-8\') ?>', $value);
        $value = str_replace('@{{', '{{', $value);

        return $value;
    }
}
