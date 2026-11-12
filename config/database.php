<?php
// config/database.php

$host = '127.0.0.1';
$db   = 'mandarinku';
$user = 'root';
$passwords = ['', 'ZhuoShanYi0908']; // Coba password kosong lalu password tersimpan
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = null;
$db_connected = false;
$db_error = '';

foreach ($passwords as $pass) {
    try {
        // Coba konek tanpa db terlebih dahulu untuk memastikan DB ada
        $tempPdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
        $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        // Konek langsung ke database mandarinku
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
        $db_connected = true;
        break;
    } catch (\PDOException $e) {
        $db_error = $e->getMessage();
    }
}
?>
