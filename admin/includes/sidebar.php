<?php if (basename($_SERVER['PHP_SELF']) != 'login.php'): ?>
  <aside class="admin-sidebar">
    <!-- Brand Header -->
    <div style="padding: 0 20px 16px; border-bottom: 1px solid #fae2e6; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.6rem;">🌸</span>
        <div>
          <h2 style="color: var(--primary-pink); font-size: 1.15rem; font-weight: 800; margin: 0; line-height: 1.1;">Mandarinku</h2>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Control Panel Pengelola</span>
        </div>
      </div>
    </div>

    <!-- Admin Profile Badge -->
    <div style="padding: 10px 14px; margin: 0 14px 16px; background: #fff0f3; border: 1px solid #fce7f3; border-radius: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-size: 0.68rem; text-transform: uppercase; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 2px 8px; border-radius: 6px;">ADMIN AKTIF</span>
        <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">● Online</span>
      </div>
      <div style="font-weight: 800; color: var(--dark-text); font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><?= htmlspecialchars($_SESSION['admin_name'] ?? 'Administrator') ?></div>
      <div style="font-size: 0.74rem; color: var(--text-muted);"><?= htmlspecialchars($_SESSION['admin_email'] ?? 'admin@mandarinku.com') ?></div>
    </div>

    <!-- Navigation Menu Grouped -->
    <div class="admin-nav-scroll" style="padding: 0 10px;">
      <!-- Group 1: Ringkasan & Analitik -->
      <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 4px; letter-spacing: 0.5px;">Ringkasan & Metrik</div>
      <ul class="admin-menu" style="list-style: none; padding: 0; margin: 0 0 10px 0;">
        <li>
          <a href="index.php" class="<?= basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : '' ?>">
            <span>📊</span> <span>Dashboard Utama</span>
          </a>
        </li>
        <li>
          <a href="users.php" class="<?= basename($_SERVER['PHP_SELF']) == 'users.php' ? 'active' : '' ?>">
            <span>👥</span> <span>Kelola Pengguna Siswa</span>
          </a>
        </li>
      </ul>

      <!-- Group 2: Kurikulum & Materi -->
      <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 4px; letter-spacing: 0.5px;">Kurikulum & Evaluasi</div>
      <ul class="admin-menu" style="list-style: none; padding: 0; margin: 0 0 10px 0;">
        <li>
          <a href="modules.php" class="<?= basename($_SERVER['PHP_SELF']) == 'modules.php' ? 'active' : '' ?>">
            <span>📚</span> <span>Kelola Modul Ajar</span>
          </a>
        </li>
        <li>
          <a href="questions.php" class="<?= basename($_SERVER['PHP_SELF']) == 'questions.php' ? 'active' : '' ?>">
            <span>❓</span> <span>Kelola Bank Soal Kuis</span>
          </a>
        </li>
        <li>
          <a href="flashcards.php" class="<?= basename($_SERVER['PHP_SELF']) == 'flashcards.php' ? 'active' : '' ?>">
            <span>🃏</span> <span>Kelola Flashcard HSK</span>
          </a>
        </li>
      </ul>

      <!-- Group 3: Game & Fitur Cerdas -->
      <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 4px; letter-spacing: 0.5px;">Fitur Interaktif & Game</div>
      <ul class="admin-menu" style="list-style: none; padding: 0; margin: 0 0 10px 0;">
        <li>
          <a href="game_arena.php" class="<?= basename($_SERVER['PHP_SELF']) == 'game_arena.php' ? 'active' : '' ?>">
            <span>🎮</span> <span>Kelola Game Arena</span>
          </a>
        </li>
        <li>
          <a href="fitur_cerdas.php" class="<?= basename($_SERVER['PHP_SELF']) == 'fitur_cerdas.php' ? 'active' : '' ?>">
            <span>💡</span> <span>Kelola Fitur Cerdas</span>
          </a>
        </li>
      </ul>

      <!-- Group 4: Sistem & Navigasi Luar -->
      <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 6px 12px 4px; letter-spacing: 0.5px;">Navigasi Sistem</div>
      <ul class="admin-menu" style="list-style: none; padding: 0; margin: 0;">
        <li>
          <a href="../index.php" target="_blank" style="color: #2563eb; background: #eff6ff; font-weight: 700; border-radius: 8px;">
            <span>🌐</span> <span>Tinjau Web Siswa ↗</span>
          </a>
        </li>
        <li>
          <a href="logout.php" style="color: #ef4444; font-weight: 700;">
            <span>🚪</span> <span>Keluar (Logout)</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <main class="admin-main">
<?php endif; ?>
