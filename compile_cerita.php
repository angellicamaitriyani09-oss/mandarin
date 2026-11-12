<?php
/**
 * Master Script: Menggabungkan dataset kumpulan cerita Mandarin HSK 1 - 6
 * Menghasilkan data komprehensif 18 cerita panjang (3 cerita per level HSK 1 s/d 6)
 * Masing-masing cerita memiliki tepat 5 pertanyaan kuis pemahaman interaktif!
 */

// Muat data dari file cerita generator
require_once __DIR__ . '/cerita_database_builder.php';

$jsonData = json_encode($allCeritaData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

$jsContent = "/**\n * Mandarinku - Data Kumpulan Cerita Panjang Mandarin HSK 1 - 6\n * Total: 18 Cerita Lengkap (3 Cerita x 6 Level HSK) dengan 5 Pertanyaan Kuis Pemahaman per Cerita.\n */\nwindow.MandarinkuCeritaData = " . $jsonData . ";\n";

file_put_contents(__DIR__ . '/js/cerita-data.js', $jsContent);
echo "SUCCESS: Berhasil menulis " . count($allCeritaData) . " cerita ke js/cerita-data.js!\n";
