    <!-- ==========================================================================
         HALAMAN ARENA GAME MANDARIN (TONE TRAINER, WORD LINK, MEMORY MATCH)
         ========================================================================== -->
    <?php
    require_once base_path('config/game_features_db.php');
    $frontendToneTrainer = get_all_tone_trainer();
    $frontendWordLink = get_all_word_link();
    $frontendMemoryMatch = get_all_memory_match();
    $frontendPinyinHanzi = get_all_pinyin_hanzi();
    ?>
    <script>
      window.DB_TONE_TRAINER = <?= json_encode($frontendToneTrainer, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_WORD_LINK = <?= json_encode($frontendWordLink, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_MEMORY_MATCH = <?= json_encode($frontendMemoryMatch, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_PINYIN_HANZI = <?= json_encode($frontendPinyinHanzi, JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <section id="page-game-arena" class="app-page">
      <div id="game-arena-container">
        <!-- Rendered dynamically via MandarinkuExtras.renderGameArenaPage() -->
      </div>
    </section>
