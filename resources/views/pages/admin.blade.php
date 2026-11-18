    <?php
    require_once base_path('config/game_features_db.php');
    if (!isset($frontendToneTrainer)) $frontendToneTrainer = get_all_tone_trainer();
    if (!isset($frontendWordLink)) $frontendWordLink = get_all_word_link();
    if (!isset($frontendMemoryMatch)) $frontendMemoryMatch = get_all_memory_match();
    if (!isset($frontendPinyinHanzi)) $frontendPinyinHanzi = get_all_pinyin_hanzi();
    if (!isset($frontendAnatomy)) $frontendAnatomy = get_all_hanzi_anatomy();
    if (!isset($frontendLeaderboard)) $frontendLeaderboard = get_all_leaderboard();
    ?>
    <script>
      window.DB_TONE_TRAINER = window.DB_TONE_TRAINER || <?= json_encode($frontendToneTrainer, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_WORD_LINK = window.DB_WORD_LINK || <?= json_encode($frontendWordLink, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_MEMORY_MATCH = window.DB_MEMORY_MATCH || <?= json_encode($frontendMemoryMatch, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_PINYIN_HANZI = window.DB_PINYIN_HANZI || <?= json_encode($frontendPinyinHanzi, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_HANZI_ANATOMY = window.DB_HANZI_ANATOMY || <?= json_encode($frontendAnatomy, JSON_UNESCAPED_UNICODE) ?>;
      window.DB_LEADERBOARD = window.DB_LEADERBOARD || <?= json_encode($frontendLeaderboard, JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <section id="page-admin" class="app-page">
      <div class="dashboard-layout">
        <!-- Left Admin Navigation Menu -->
        <aside class="sidebar-panel">
          <div style="padding: 0 10px 14px 10px; border-bottom: 1px solid #fce7f3; margin-bottom: 10px;">
            <span class="role-badge" style="background: #eff6ff; color: #1e40af; font-weight: 800;">🛡️ PANEL PENGELOLA</span>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); margin-top: 4px;">Pusat Manajemen</h4>
          </div>

          <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 2px; letter-spacing: 0.5px;">Ringkasan & Siswa</div>
          <ul class="sidebar-menu" style="margin-bottom: 10px;">
            <li>
              <button class="sidebar-link active" onclick="switchAdminTab('overview')">
                <span>📊</span> <span>Ringkasan & Metrik</span>
              </button>
            </li>
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('students')">
                <span>👥</span> <span>Data Siswa & Aktivitas</span>
              </button>
            </li>
          </ul>

          <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 2px; letter-spacing: 0.5px;">Kurikulum & Materi</div>
          <ul class="sidebar-menu" style="margin-bottom: 10px;">
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('modules')">
                <span>📚</span> <span>Kelola Modul Ajar</span>
              </button>
            </li>
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('quizzes')">
                <span>📝</span> <span>Kelola Soal & Kuis</span>
              </button>
            </li>
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('flashcards')">
                <span>🃏</span> <span>Kelola Flashcard</span>
              </button>
            </li>
          </ul>

          <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 2px; letter-spacing: 0.5px;">Game & Fitur Pintar</div>
          <ul class="sidebar-menu" style="margin-bottom: 10px;">
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('game_arena')">
                <span>🎮</span> <span>Kelola Game Arena</span>
              </button>
            </li>
            <li>
              <button class="sidebar-link" onclick="switchAdminTab('fitur_cerdas')">
                <span>💡</span> <span>Kelola Fitur Cerdas</span>
              </button>
            </li>
          </ul>

          <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 2px; letter-spacing: 0.5px;">Navigasi Sistem</div>
          <ul class="sidebar-menu">
            <li>
              <button class="sidebar-link" onclick="navigateTo('beranda')">
                <span>👁️</span> <span>Lihat Tampilan Siswa</span>
              </button>
            </li>
            <li>
              <a href="admin/index.php" target="_blank" class="sidebar-link" style="text-decoration: none; color: #1e40af; background: #eff6ff; font-weight: 800; border: 1px solid #bfdbfe; border-radius: 8px; margin-top: 6px; display: flex; align-items: center; gap: 8px; padding: 10px 14px;">
                <span>⚙️</span> <span>Dashboard Backend ↗</span>
              </a>
            </li>
          </ul>

          <div style="margin-top: 2rem; padding: 12px; background: #fff0f3; border-radius: 12px; border: 1px solid #fbcfe8;">
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary-pink); margin-bottom: 4px;">Mode Pengelola Aktif</div>
            <p style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; margin: 0;">Semua perubahan materi, soal, dan flashcard langsung tersimpan ke sistem.</p>
          </div>
        </aside>

        <!-- Right Main Content Area -->
        <div style="flex: 1;">
          <!-- Header Banner Pengelola -->
          <div class="module-header-banner" style="background: linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%); border: 1.5px solid #bfdbfe; margin-bottom: 1.5rem;">
            <div>
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                <span class="role-badge" style="background: #1e3a8a; color: #fff; font-weight: 800;">ADMINISTRATOR</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Sistem Manajemen Konten Mandarinku</span>
              </div>
              <h2 class="module-header-title" style="color: #1e3a8a;">Dashboard Pengelola & Pembuat Materi</h2>
              <p class="module-header-desc">Kelola konten modul pembelajaran HSK 1 - 6, buat butir kuis baru, tambahkan kartu flashcard hafalan kosakata, serta pantau progres belajar seluruh siswa.</p>
            </div>
            <img src="assets/images/panda-mascot.svg" alt="Panda Admin" style="width: 100px; height: auto;">
          </div>

          <!-- Dynamic Container for Admin Subtabs -->
          <div id="admin-subtab-content">
            <!-- Rendered by renderAdminDashboard() in app.js -->
          </div>
        </div>
      </div>
    </section>
