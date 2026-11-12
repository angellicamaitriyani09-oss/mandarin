<?php
// Initialize database connection
require_once 'config/database.php';

// Include the HTML header
include 'includes/header.php';

// Include the top navigation bar
include 'includes/navbar.php';
?>

  <!-- ==========================================================================
       MAIN CONTENT CONTAINER
       ========================================================================== -->
  <main class="main-wrapper">

    <?php include 'pages/login.php'; ?>
    
    <?php include 'pages/beranda.php'; ?>
    
    <?php include 'pages/listening.php'; ?>
    
    <?php include 'pages/speaking.php'; ?>
    
    <?php include 'pages/reading.php'; ?>
    
    <?php include 'pages/writing.php'; ?>
    
    <?php include 'pages/flashcard.php'; ?>
    
    <?php include 'pages/quiz.php'; ?>
    
    <?php include 'pages/bank-soal.php'; ?>
    
    <?php include 'pages/hsk.php'; ?>
    
    <?php include 'pages/profil.php'; ?>
    
    <?php include 'pages/modul-detail.php'; ?>
    
    <?php include 'pages/cerita.php'; ?>
    
    <?php include 'pages/latihan-ekstra.php'; ?>
    
    <?php include 'pages/cetak-hanzi.php'; ?>
    
    <?php include 'pages/game-arena.php'; ?>
    
    <?php include 'pages/fitur-pintar.php'; ?>
    
    <?php include 'pages/admin.php'; ?>

  </main>

<?php
// Include the modals and footer scripts
include 'includes/footer.php';
?>
