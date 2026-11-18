<?php

define('LARAVEL_START', microtime(true));

/** @var \App\Core\Application $app */
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->handleRequest();
