  <!-- ==========================================================================
       TOP NAVIGATION BAR (Mandarinku Modern & Structured)
       ========================================================================== -->
  <header class="main-navbar">
    <div class="nav-brand" onclick="navigateTo('beranda')">
      <img src="assets/images/sakura-logo.svg" alt="Sakura Logo" class="brand-icon">
      <div>
        <div class="brand-title">Mandarinku</div>
        <div class="brand-subtitle">Platform Belajar Mandarin Interaktif</div>
      </div>
    </div>

    <!-- Center Navigation Tabs (Terstruktur, Rapi, & Tanpa Duplikasi) -->
    <nav class="nav-menu" id="main-nav-menu">
      <!-- 1. Beranda -->
      <button type="button" class="nav-item active" data-page="beranda" onclick="navigateTo('beranda')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>Beranda</span>
      </button>

      <!-- 2. Dropdown: Materi Pembelajaran -->
      <div class="nav-dropdown-wrapper">
        <button type="button" class="nav-dropdown-btn" id="nav-btn-materi" onclick="navigateTo('hsk')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <span>Materi HSK</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="nav-dropdown-menu">
          <div class="nav-dropdown-group-title">KURIKULUM & 4 KETERAMPILAN</div>
          <button type="button" class="nav-dropdown-item" data-page="hsk" onclick="navigateTo('hsk')">
            <span class="item-icon">🎓</span>
            <div class="item-text">
              <span class="item-main-title">Modul Inti HSK 1 - 6</span>
              <span class="item-desc">Materi terstruktur tata bahasa & contoh soal</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="listening" onclick="navigateTo('listening')">
            <span class="item-icon">🎧</span>
            <div class="item-text">
              <span class="item-main-title">Listening (听力)</span>
              <span class="item-desc">Audio percakapan penutur asli & kuis pendengaran</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="speaking" onclick="navigateTo('speaking')">
            <span class="item-icon">🎙️</span>
            <div class="item-text">
              <span class="item-main-title">Speaking (口语)</span>
              <span class="item-desc">Latihan pelafalan dengan AI Voice Recognition</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="reading" onclick="navigateTo('reading')">
            <span class="item-icon">📖</span>
            <div class="item-text">
              <span class="item-main-title">Reading (阅读)</span>
              <span class="item-desc">Teks bacaan, dialog kontekstual & kosakata</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="writing" onclick="navigateTo('writing')">
            <span class="item-icon">✍️</span>
            <div class="item-text">
              <span class="item-main-title">Writing (书写)</span>
              <span class="item-desc">Animasi urutan goresan stroke order & cek kalimat</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="cerita" onclick="navigateTo('cerita')">
            <span class="item-icon">🏮</span>
            <div class="item-text">
              <span class="item-main-title">Kumpulan Cerita HSK</span>
              <span class="item-desc">Dongeng, fabel Chengyu & wacana budaya</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 3. Dropdown: Latihan & Ujian -->
      <div class="nav-dropdown-wrapper">
        <button type="button" class="nav-dropdown-btn" id="nav-btn-latihan" onclick="navigateTo('quiz')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>Latihan & Kuis</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="nav-dropdown-menu">
          <div class="nav-dropdown-group-title">EVALUASI & PEMAHAMAN</div>
          <button type="button" class="nav-dropdown-item" data-page="quiz" onclick="navigateTo('quiz')">
            <span class="item-icon">🎯</span>
            <div class="item-text">
              <span class="item-main-title">Quiz Interaktif HSK</span>
              <span class="item-desc">Kuis berwaktu per level dengan pembahasan</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="bank-soal" onclick="navigateTo('bank-soal')">
            <span class="item-icon">📋</span>
            <div class="item-text">
              <span class="item-main-title">Bank Soal Terintegrasi</span>
              <span class="item-desc">Koleksi butir soal HSK 1-6 komprehensif</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="flashcard" onclick="navigateTo('flashcard')">
            <span class="item-icon">🃏</span>
            <div class="item-text">
              <span class="item-main-title">Flashcard Kosakata (SRS)</span>
              <span class="item-desc">Hafalan kartu bolak-balik dengan audio</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="latihan-ekstra" onclick="if(window.MandarinkuExtras) MandarinkuExtras.openLatihanTab('scramble'); else navigateTo('latihan-ekstra');">
            <span class="item-icon">🧩</span>
            <div class="item-text">
              <span class="item-main-title" style="color: #ea580c;">Susun Kalimat & Dikte Audio</span>
              <span class="item-desc">Latihan 连词成句 & 听写 Tīngxiě HSK 1-6</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 4. Dropdown: Arena Game Mandarin -->
      <div class="nav-dropdown-wrapper">
        <button type="button" class="nav-dropdown-btn" id="nav-btn-game" onclick="navigateTo('game-arena')">
          <span>🎮</span>
          <span>Game Arena</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="nav-dropdown-menu">
          <div class="nav-dropdown-group-title">MINI GAMES EDUKATIF</div>
          <button type="button" class="nav-dropdown-item" data-page="game-arena" onclick="navigateTo('game-arena'); if(window.MandarinkuExtras) MandarinkuExtras.switchGameTab('tone');">
            <span class="item-icon">🎵</span>
            <div class="item-text">
              <span class="item-main-title">Pelatih 4 Nada (四声)</span>
              <span class="item-desc">Latih ketajaman pendengaran nada 1-4</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="game-arena" onclick="navigateTo('game-arena'); if(window.MandarinkuExtras) MandarinkuExtras.switchGameTab('link');">
            <span class="item-icon">🔗</span>
            <div class="item-text">
              <span class="item-main-title">Pasang Kata (组词连线)</span>
              <span class="item-desc">Satukan 2 karakter menjadi kosakata utuh</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="game-arena" onclick="navigateTo('game-arena'); if(window.MandarinkuExtras) MandarinkuExtras.switchGameTab('memory');">
            <span class="item-icon">🃏</span>
            <div class="item-text">
              <span class="item-main-title">Kartu Memori Balik (4x4 - 6x6)</span>
              <span class="item-desc">Pencocokan kartu memori konsentrasi visual</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="game-arena" onclick="navigateTo('game-arena'); if(window.MandarinkuExtras) MandarinkuExtras.switchGameTab('pinyin_hanzi');">
            <span class="item-icon">🔤</span>
            <div class="item-text">
              <span class="item-main-title">Cocok Pinyin ➔ Hanzi</span>
              <span class="item-desc">Tebak karakter Hanzi yang tepat dari bunyi pinyin</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 5. Dropdown: Fitur Cerdas & Alat Bantu -->
      <div class="nav-dropdown-wrapper">
        <button type="button" class="nav-dropdown-btn" id="nav-btn-fitur" onclick="navigateTo('fitur-pintar')">
          <span>💡</span>
          <span>Fitur Cerdas</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="nav-dropdown-menu">
          <div class="nav-dropdown-group-title">ALAT BANTU BELAJAR PINTAR</div>
          <button type="button" class="nav-dropdown-item" data-page="fitur-pintar" onclick="navigateTo('fitur-pintar'); if(window.MandarinkuExtras) MandarinkuExtras.switchFiturPintarTab('anatomy');">
            <span class="item-icon">🧩</span>
            <div class="item-text">
              <span class="item-main-title">Anatomi Hanzi & Mnemonik</span>
              <span class="item-desc">Bedah radikal dan cerita visual pengingat karakter</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="fitur-pintar" onclick="navigateTo('fitur-pintar'); if(window.MandarinkuExtras) MandarinkuExtras.switchFiturPintarTab('colorizer');">
            <span class="item-icon">🎨</span>
            <div class="item-text">
              <span class="item-main-title">Pewarna Nada Karakter</span>
              <span class="item-desc">Highlight warna otomatis per nada pinyin Hanzi</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="cetak-hanzi" onclick="navigateTo('cetak-hanzi')">
            <span class="item-icon">🖨️</span>
            <div class="item-text">
              <span class="item-main-title">Lembar Tulis Tian Zi Ge</span>
              <span class="item-desc">Generator cetak PDF kisi kotak & urutan goresan</span>
            </div>
          </button>
          <button type="button" class="nav-dropdown-item" data-page="fitur-pintar" onclick="navigateTo('fitur-pintar'); if(window.MandarinkuExtras) MandarinkuExtras.switchFiturPintarTab('leaderboard');">
            <span class="item-icon">🏆</span>
            <div class="item-text">
              <span class="item-main-title">Papan Peringkat (Leaderboard)</span>
              <span class="item-desc">Pantau skor EXP dan streak belajar siswa</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 6. Tombol Kamus Cepat HSK Global (Ctrl+K) -->
      <button type="button" class="nav-item" onclick="if(window.MandarinkuExtras) MandarinkuExtras.openQuickDictModal()" title="Buka Kamus Cepat HSK 1-6 & Pencarian Radikal (Ctrl+K)" style="background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa;">
        <span>🔍</span>
        <span>Kamus HSK</span>
      </button>

      <!-- 7. Panel Admin (Langsung Tampil di Navbar) -->
      <button type="button" class="nav-item" data-page="admin" onclick="navigateTo('admin')" title="Pusat Manajemen Pengelola (Kelola Game, Soal, Flashcard & Modul)" style="background: #eff6ff; color: #1e40af; border: 1.5px solid #bfdbfe; font-weight: 800;">
        <span>🛡️</span>
        <span>Panel Admin</span>
      </button>
    </nav>

    <!-- Right Profile Pill, Role Mode Switcher & Mobile Hamburger -->
    <div class="nav-profile-area" style="position: relative; display: flex; align-items: center; gap: 8px;">
      <button id="btn-open-upload-modal" class="btn-primary-sakura" style="display: none; padding: 6px 14px; font-size: 0.8rem; margin: 0;" onclick="openUploadModal()">
        ➕ Unggah Modul
      </button>

      <!-- Dark / Light Mode Switcher Toggle Button -->
      <button type="button" id="theme-toggle-btn" class="theme-toggle-btn" onclick="toggleThemeMode()" title="Ganti Mode Gelap / Terang (Dark / Light Mode)">
        <span class="theme-toggle-icon" id="theme-toggle-icon">🌙</span>
        <span class="theme-toggle-text" id="theme-toggle-text">Gelap</span>
      </button>

      <!-- Quick Role Mode Switcher Pill -->
      <div id="nav-role-badge-pill" style="display: flex; align-items: center; gap: 6px; background: #fff0f3; border: 1.5px solid #fbcfe8; padding: 5px 12px; border-radius: 9999px; font-size: 0.76rem; font-weight: 800; cursor: pointer;" onclick="toggleRoleSwitchDropdown()" title="Klik untuk berganti hak akses pengguna">
        <span id="nav-role-icon">👨‍🎓</span>
        <span id="nav-role-text" style="color: var(--primary-pink);">Mode Siswa</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>

      <!-- Dropdown Quick Switcher -->
      <div id="role-switch-dropdown" style="display: none; position: absolute; right: 0; top: 115%; width: 250px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); padding: 12px; z-index: 1000;">
        <div style="font-size: 0.74rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
          Ganti Hak Akses Pengguna:
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button type="button" onclick="switchUserRole('student')" style="text-align: left; padding: 8px 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
            <span style="font-size: 1.2rem;">👨‍🎓</span>
            <div>
              <div style="font-size: 0.82rem; font-weight: 800; color: var(--dark-text);">Siswa (Pelajar)</div>
              <div style="font-size: 0.7rem; color: #64748b;">Melihat, mempelajari & mengerjakan modul</div>
            </div>
          </button>
          <button type="button" onclick="switchUserRole('admin')" style="text-align: left; padding: 8px 10px; border-radius: 8px; border: 1px solid #bfdbfe; background: #eff6ff; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
            <span style="font-size: 1.2rem;">🛡️</span>
            <div>
              <div style="font-size: 0.82rem; font-weight: 800; color: #1e40af;">Admin (Pengelola)</div>
              <div style="font-size: 0.7rem; color: #3b82f6;">Mengelola game, materi & bank kuis</div>
            </div>
          </button>
        </div>
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between;">
          <a href="javascript:void(0)" onclick="navigateTo('profil')" style="font-size: 0.75rem; color: var(--primary-pink); font-weight: 700; text-decoration: none;">Profil Akun</a>
          <a href="javascript:void(0)" onclick="handleLogout()" style="font-size: 0.75rem; color: #ef4444; font-weight: 700; text-decoration: none;">Keluar (Logout)</a>
        </div>
      </div>

      <!-- Profile Avatar Pill -->
      <div class="profile-pill-btn" onclick="navigateTo('profil')" title="Lihat Profil Saya">
        <div class="profile-avatar-mini">
          <img src="assets/images/panda-mascot.svg" alt="Panda Mini" style="width: 28px; height: 28px;">
        </div>
        <div style="text-align: left;">
          <div id="nav-user-name" style="font-size: 0.85rem; font-weight: 700; line-height: 1.1;">Learner Panda</div>
          <span id="nav-user-role" class="role-badge">SISWA</span>
        </div>
      </div>

      <!-- Mobile Hamburger Toggle Button -->
      <button type="button" class="mobile-menu-toggle" id="mobile-menu-toggle-btn" onclick="toggleMobileNavMenu()" aria-label="Menu Navigasi">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <!-- Mobile Navigation Drawer / Dropdown Overlay -->
  <div class="mobile-nav-drawer" id="mobile-nav-drawer">
    <div class="mobile-nav-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <img src="assets/images/sakura-logo.svg" alt="Sakura" style="width: 28px; height: 28px;">
        <span style="font-weight: 800; font-size: 1.1rem; color: var(--dark-text);">Navigasi Mandarinku</span>
      </div>
      <button type="button" onclick="toggleMobileNavMenu()" style="background: none; border: none; font-size: 1.4rem; color: #64748b; cursor: pointer;">✕</button>
    </div>

    <!-- Mobile Theme Switcher Bar -->
    <div style="padding: 12px 18px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02);">
      <span style="font-size: 0.84rem; font-weight: 800; color: var(--dark-text); display: flex; align-items: center; gap: 6px;">
        <span>🌓</span> Mode Tampilan
      </span>
      <button type="button" onclick="toggleThemeMode()" class="theme-toggle-btn" style="margin: 0;">
        <span class="mobile-theme-icon">🌙</span>
        <span class="mobile-theme-text">Gelap</span>
      </button>
    </div>

    <div class="mobile-nav-content">
      <div class="mobile-nav-section-title">MENU UTAMA</div>
      <button type="button" class="mobile-nav-link active" data-page="beranda" onclick="navigateTo('beranda'); toggleMobileNavMenu();">
        <span>🏠</span> <span>Beranda</span>
      </button>

      <div class="mobile-nav-section-title">MATERI PEMBELAJARAN</div>
      <button type="button" class="mobile-nav-link" data-page="hsk" onclick="navigateTo('hsk'); toggleMobileNavMenu();">
        <span>🎓</span> <span>Modul Inti HSK 1 - 6</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="listening" onclick="navigateTo('listening'); toggleMobileNavMenu();">
        <span>🎧</span> <span>Listening (Mendengar)</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="speaking" onclick="navigateTo('speaking'); toggleMobileNavMenu();">
        <span>🎙️</span> <span>Speaking (Berbicara AI)</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="reading" onclick="navigateTo('reading'); toggleMobileNavMenu();">
        <span>📖</span> <span>Reading (Membaca Teks)</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="writing" onclick="navigateTo('writing'); toggleMobileNavMenu();">
        <span>✍️</span> <span>Writing (Menulis Hanzi)</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="cerita" onclick="navigateTo('cerita'); toggleMobileNavMenu();">
        <span>🏮</span> <span>Cerita Sastra & Dongeng</span>
      </button>

      <div class="mobile-nav-section-title">LATIHAN & UJIAN</div>
      <button type="button" class="mobile-nav-link" data-page="quiz" onclick="navigateTo('quiz'); toggleMobileNavMenu();">
        <span>🎯</span> <span>Quiz HSK Interaktif</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="bank-soal" onclick="navigateTo('bank-soal'); toggleMobileNavMenu();">
        <span>📋</span> <span>Bank Soal HSK</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="flashcard" onclick="navigateTo('flashcard'); toggleMobileNavMenu();">
        <span>🃏</span> <span>Flashcard Kosakata</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="latihan-ekstra" onclick="navigateTo('latihan-ekstra'); toggleMobileNavMenu();">
        <span>🧩</span> <span>Susun Kalimat & Dikte</span>
      </button>

      <div class="mobile-nav-section-title">GAME & FITUR CERDAS</div>
      <button type="button" class="mobile-nav-link" data-page="game-arena" onclick="navigateTo('game-arena'); toggleMobileNavMenu();">
        <span>🎮</span> <span>Arena Game Mandarin</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="fitur-pintar" onclick="navigateTo('fitur-pintar'); toggleMobileNavMenu();">
        <span>💡</span> <span>Fitur Cerdas (Anatomi & Pewarna)</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="cetak-hanzi" onclick="navigateTo('cetak-hanzi'); toggleMobileNavMenu();">
        <span>🖨️</span> <span>Cetak Lembar Tian Zi Ge</span>
      </button>
      <button type="button" class="mobile-nav-link" onclick="if(window.MandarinkuExtras) MandarinkuExtras.openQuickDictModal(); toggleMobileNavMenu();">
        <span>🔍</span> <span>Kamus Cepat HSK (Ctrl+K)</span>
      </button>

      <div class="mobile-nav-section-title">ADMINISTRASI & PROFIL</div>
      <button type="button" class="mobile-nav-link" data-page="profil" onclick="navigateTo('profil'); toggleMobileNavMenu();">
        <span>👤</span> <span>Profil Akun Saya</span>
      </button>
      <button type="button" class="mobile-nav-link" data-page="admin" onclick="navigateTo('admin'); toggleMobileNavMenu();" style="background: #eff6ff; color: #1e40af; font-weight: 800;">
        <span>🛡️</span> <span>Pusat Manajemen Admin</span>
      </button>
      <a href="admin/index.php" target="_blank" class="mobile-nav-link" style="text-decoration: none; color: #4338ca; background: #eef2ff;">
        <span>⚙️</span> <span>Dashboard Backend Lengkap ↗</span>
      </a>
    </div>
  </div>
