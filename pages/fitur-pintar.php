    <!-- ==========================================================================
         HALAMAN FITUR PINTAR & ALAT BANTU MANDARIN
         (TONE COLORIZER, ANATOMI HANZI, EKSPOR ANKI, LEADERBOARD)
         ========================================================================== -->
    <?php
    require_once __DIR__ . '/../config/game_features_db.php';
    $frontendAnatomy = get_all_hanzi_anatomy();
    $frontendLeaderboard = get_all_leaderboard();
    ?>
    <script>
      window.DB_HANZI_ANATOMY = <?= json_encode($frontendAnatomy, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_LEADERBOARD = <?= json_encode($frontendLeaderboard, JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <section id="page-fitur-pintar" class="app-page">
      <div id="fitur-pintar-container">
        <!-- Rendered dynamically via MandarinkuExtras.renderFiturPintarPage() -->
      </div>
    </section>
