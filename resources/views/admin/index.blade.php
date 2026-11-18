@extends('layouts.admin')

@section('content')
<?php
require_once base_path('config/database.php');
require_once base_path('config/game_features_db.php');
// Get counts
$users_count = 0;
$modules_count = 0;
$questions_count = 0;
$flashcards_count = 0;

if ($db_connected && $pdo) {
    try { $users_count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(); } catch (Exception $e) {}
    try { $modules_count = $pdo->query("SELECT COUNT(*) FROM modules")->fetchColumn(); } catch (Exception $e) {}
    try { $questions_count = $pdo->query("SELECT COUNT(*) FROM questions")->fetchColumn(); } catch (Exception $e) {}
    try { $flashcards_count = $pdo->query("SELECT COUNT(*) FROM flashcards")->fetchColumn(); } catch (Exception $e) {}
}

$game_tone_count = count(get_all_tone_trainer());
$game_link_count = count(get_all_word_link());
$game_mem_count = count(get_all_memory_match());
$game_pinyin_count = count(get_all_pinyin_hanzi());
$total_game_items = $game_tone_count + $game_link_count + $game_mem_count + $game_pinyin_count;

$smart_anat_count = count(get_all_hanzi_anatomy());
$smart_lb_count = count(get_all_leaderboard());
$total_smart_items = $smart_anat_count + $smart_lb_count;
?>

<div class="admin-card">
  <h1 style="color: var(--dark-text); margin-top: 0;">Selamat Datang, <?= htmlspecialchars($_SESSION['admin_name']) ?>!</h1>
  <p style="color: var(--text-muted);">Berikut adalah ringkasan statistik aplikasi Mandarinku saat ini.</p>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
  <div class="admin-card" style="border-left: 5px solid var(--primary-pink);">
    <h3 style="margin-top: 0; color: var(--text-muted); font-size: 0.9rem;">Total Pengguna</h3>
    <div style="font-size: 2rem; font-weight: 900; color: var(--dark-text);"><?= $users_count ?></div>
  </div>
  <div class="admin-card" style="border-left: 5px solid #2ec4b6;">
    <h3 style="margin-top: 0; color: var(--text-muted); font-size: 0.9rem;">Total Modul</h3>
    <div style="font-size: 2rem; font-weight: 900; color: var(--dark-text);"><?= $modules_count ?></div>
  </div>
  <div class="admin-card" style="border-left: 5px solid #ff9f1c;">
    <h3 style="margin-top: 0; color: var(--text-muted); font-size: 0.9rem;">Total Soal</h3>
    <div style="font-size: 2rem; font-weight: 900; color: var(--dark-text);"><?= $questions_count ?></div>
  </div>
  <div class="admin-card" style="border-left: 5px solid #8b5cf6;">
    <h3 style="margin-top: 0; color: var(--text-muted); font-size: 0.9rem;">Total Flashcard</h3>
    <div style="font-size: 2rem; font-weight: 900; color: var(--dark-text);"><?= $flashcards_count ?></div>
  </div>
  <a href="game_arena.php" class="admin-card" style="border-left: 5px solid #7c3aed; text-decoration: none; display: block; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
    <h3 style="margin-top: 0; color: #6d28d9; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
      <span>🎮 Konten Game Arena</span>
      <span style="font-size: 0.75rem; background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 99px;">Kelola ➔</span>
    </h3>
    <div style="font-size: 2rem; font-weight: 900; color: #4c1d95;"><?= $total_game_items ?></div>
    <div style="font-size: 0.75rem; color: #7c3aed; margin-top: 4px;">Nada, Pasang Kata, Memori & Cocok Pinyin</div>
  </a>
  <a href="fitur_cerdas.php" class="admin-card" style="border-left: 5px solid #0284c7; text-decoration: none; display: block; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
    <h3 style="margin-top: 0; color: #0369a1; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
      <span>💡 Item Fitur Cerdas</span>
      <span style="font-size: 0.75rem; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 99px;">Kelola ➔</span>
    </h3>
    <div style="font-size: 2rem; font-weight: 900; color: #0369a1;"><?= $total_smart_items ?></div>
    <div style="font-size: 0.75rem; color: #0284c7; margin-top: 4px;">Anatomi Karakter & Leaderboard</div>
  </a>
</div>



@endsection
