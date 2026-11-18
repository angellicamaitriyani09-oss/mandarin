<?php
// Delegated to Laravel MVC Kernel (routes/web.php -> AdminController / AdminApiController)
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$app->handleRequest('/admin/fitur_cerdas.php');
