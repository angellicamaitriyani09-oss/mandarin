<?php
require_once 'config/database.php';

if (!$pdo) {
    echo "Koneksi database GAGAL: " . ($db_error ?? '') . "\n";
    exit;
}

echo "Koneksi berhasil!\n";
$stmt = $pdo->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

if (empty($tables)) {
    echo "Database masih kosong (belum ada tabel).\n";
} else {
    echo "Daftar tabel dalam database:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }
}
?>
