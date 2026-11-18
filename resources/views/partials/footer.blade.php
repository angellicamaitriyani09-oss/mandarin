  <!-- ==========================================================================
       MODERN WEBSITE FOOTER (Struktur Rapi, Sitemap Lengkap & Informatif)
       ========================================================================== -->
  <footer class="main-footer">
    <div class="footer-top-container">
      <!-- Col 1: Brand & Identity -->
      <div class="footer-col footer-col-brand">
        <div class="footer-brand" onclick="navigateTo('beranda')">
          <img src="assets/images/sakura-logo.svg" alt="Sakura Logo" class="brand-icon">
          <div>
            <div class="brand-title">Mandarinku</div>
            <div class="brand-subtitle">Belajar Mandarin jadi mudah!</div>
          </div>
        </div>
        <p class="footer-brand-desc">
          Platform pembelajaran bahasa Mandarin interaktif modern yang memadukan kurikulum HSK 1-6, pengenalan suara AI Voice Recognition, visualisasi goresan Hanzi, gamifikasi arena, dan mnemonik karakter.
        </p>
        <div class="footer-mascot-pill">
          <img src="assets/images/panda-mascot.svg" alt="Panda Mini" style="width: 26px; height: 26px;">
          <span>🐼 Bersama Panda Belajar Setiap Hari!</span>
        </div>
      </div>

      <!-- Col 2: Materi & 4 Keterampilan -->
      <div class="footer-col">
        <h4 class="footer-heading">📚 Kurikulum & Materi</h4>
        <ul class="footer-links-list">
          <li><a href="javascript:void(0)" onclick="navigateTo('hsk')">🎓 Modul Inti HSK 1 - 6</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('listening')">🎧 Listening (Mendengar Percakapan)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('speaking')">🎙️ Speaking (AI Voice Recognition)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('reading')">📖 Reading (Membaca Teks & Dialog)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('writing')">✍️ Writing (Animasi Goresan Hanzi)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('cerita')">🏮 Kumpulan Cerita & Fabel HSK</a></li>
        </ul>
      </div>

      <!-- Col 3: Latihan & Game Arena -->
      <div class="footer-col">
        <h4 class="footer-heading">🎯 Latihan & Game Arena</h4>
        <ul class="footer-links-list">
          <li><a href="javascript:void(0)" onclick="navigateTo('quiz')">🎯 Quiz Interaktif Berwaktu</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('bank-soal')">📋 Bank Soal Ujian Komprehensif</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('flashcard')">🃏 Flashcard Kosakata (SRS Anki)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('latihan-ekstra')">🧩 Susun Kalimat & Dikte Audio</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('game-arena')">🎮 Arena Game (Pelatih Nada, Pasang Kata)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('game-arena'); if(window.MandarinkuExtras) MandarinkuExtras.switchGameTab('memory');">🃏 Kartu Memori Balik 4x4 - 6x6</a></li>
        </ul>
      </div>

      <!-- Col 4: Fitur Pintar & Akses -->
      <div class="footer-col">
        <h4 class="footer-heading">💡 Fitur Pintar & Akses</h4>
        <ul class="footer-links-list">
          <li><a href="javascript:void(0)" onclick="navigateTo('fitur-pintar')">🧩 Anatomi Karakter & Mnemonik</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('fitur-pintar'); if(window.MandarinkuExtras) MandarinkuExtras.switchFiturPintarTab('colorizer');">🎨 Pewarna Nada Karakter Hanzi</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('cetak-hanzi')">🖨️ Cetak Lembar Tian Zi Ge (PDF)</a></li>
          <li><a href="javascript:void(0)" onclick="if(window.MandarinkuExtras) MandarinkuExtras.openQuickDictModal()">🔍 Kamus Cepat HSK (Ctrl+K)</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('profil')">👤 Profil Siswa & e-Sertifikat</a></li>
          <li><a href="javascript:void(0)" onclick="navigateTo('admin')" style="color: #2563eb; font-weight: 700;">🛡️ Panel Manajemen Pengelola</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <div class="footer-bottom-content">
        <div class="footer-copy">
          © <?= date('Y') ?> <strong>Mandarinku</strong>. Seluruh hak cipta dilindungi undang-undang.
          <span class="footer-badge-sys">⚡ Laragon Edition • v2.5 Modern</span>
        </div>
        <div class="footer-bottom-actions">
          <button type="button" class="back-to-top-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Kembali ke atas halaman">
            <span>↑</span> <span>Ke Atas</span>
          </button>
        </div>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       MODALS: UPLOAD MODULE & TARGET SETTINGS
       ========================================================================== -->
  <!-- Modal Upload / Edit Modul Ajar -->
  <div id="upload-module-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);" id="upload-module-modal-title">
            📤 Unggah Modul Ajar Baru (HSK 1 - 6)
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;" id="upload-module-modal-desc">
            Modul akan otomatis memiliki halaman tersendiri, materi pembelajaran, contoh soal, dan paket latihan 50 soal.
          </p>
        </div>
        <button onclick="closeUploadModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <input type="hidden" id="upload-mod-id" value="">

      <div class="form-group">
        <label for="upload-mod-title">Judul Modul Ajar:</label>
        <input type="text" id="upload-mod-title" class="form-control" placeholder="Contoh: Tata Bahasa Partikel Le (了) & Percakapan Praktis">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="upload-mod-cat">Kategori Keterampilan:</label>
          <select id="upload-mod-cat" class="form-control" style="padding-left: 14px;">
            <option value="listening">🎧 Listening (Mendengar)</option>
            <option value="speaking">🎙️ Speaking (Berbicara)</option>
            <option value="reading">📖 Reading (Membaca)</option>
            <option value="writing">✍️ Writing (Menulis)</option>
            <option value="komprehensif">🌟 Komprehensif (4 Keterampilan)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="upload-mod-level">Tingkat HSK:</label>
          <select id="upload-mod-level" class="form-control" style="padding-left: 14px;">
            <option value="HSK 1">🌱 HSK 1 (Dasar Pemula)</option>
            <option value="HSK 2">🌿 HSK 2 (Percakapan Sehari-hari)</option>
            <option value="HSK 3">🌳 HSK 3 (Menengah Dasar)</option>
            <option value="HSK 4">🍁 HSK 4 (Menengah Lanjutan)</option>
            <option value="HSK 5">🌸 HSK 5 (Mahir / Akademik)</option>
            <option value="HSK 6">👑 HSK 6 (Master / Sastra)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="upload-mod-desc">Deskripsi & Ringkasan Materi:</label>
        <textarea id="upload-mod-desc" class="writing-textarea" style="height: 80px;" placeholder="Tuliskan rangkuman dan poin-poin yang akan dipelajari siswa dalam modul ini..."></textarea>
      </div>

      <div class="form-group">
        <label for="upload-mod-materi">Teks Materi Pembelajaran (Opsional / Tambahan):</label>
        <textarea id="upload-mod-materi" class="writing-textarea" style="height: 100px; font-family: monospace; font-size: 0.85rem;" placeholder="Tulis penjelasan konsep tata bahasa, daftar kosakata (Hanzi - Pinyin - Arti), atau dialog percakapan di sini..."></textarea>
      </div>

      <div style="background: #fff8f9; border: 1.5px dashed #f8c2cd; border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 1rem;">
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-pink); margin-bottom: 4px;">
          ✨ Fitur Otomatis Modul Mandarinku:
        </div>
        <ul style="font-size: 0.8rem; color: var(--text-muted); margin-left: 18px; line-height: 1.5;">
          <li>Otomatis membuat <strong>Halaman Modul Tersendiri</strong> lengkap dengan layout profesional.</li>
          <li>Menyertakan <strong>Contoh Soal Pembahasan</strong> per kategori.</li>
          <li>Menyertakan <strong>Paket Latihan 50 Soal Lengkap</strong> (Listening, Speaking, Reading, Writing) dengan audio penutur asli dan kunci jawaban.</li>
          <li>Dapat langsung diunduh oleh siswa sebagai <strong>Modul Cetak / PDF Resmi</strong>.</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="upload-mod-file">Lampiran File Tambahan (Opsional: PDF / Audio):</label>
        <input type="file" id="upload-mod-file" class="form-control" style="padding: 10px 14px;" accept=".pdf,.mp3,.mp4,.wav,.m4a,.ogg">
        <div id="upload-file-preview" style="margin-top: 8px; font-size: 0.82rem; color: var(--text-muted);"></div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
        <button class="btn-primary-sakura" style="flex: 1;" id="btn-save-module" onclick="handleUploadNewModule()">
          Simpan & Terbitkan Modul
        </button>
        <button class="btn-learn-outline" onclick="closeUploadModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Pembelajaran Interaktif (Materi 'Pelajari') -->
  <div id="learning-detail-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 620px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary-pink); text-transform: uppercase;">
          📚 Modul Materi Interaktif
        </span>
        <button onclick="closeLearningModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <div id="learning-modal-dynamic-content">
        <!-- Content injected dynamically via openLearningModal() -->
      </div>
    </div>
  </div>

  <!-- Modal Target Settings -->
  <div id="target-settings-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 480px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);">
          🎯 Atur Target Belajar Mandiri
        </h3>
        <button onclick="closeTargetSettingsModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">
        Tentukan target waktu latihan harian Anda agar sistem dapat memberikan pengingat dan memantau kedisiplinan belajar.
      </p>

      <div class="form-group">
        <label for="target-minutes-input">Target Waktu Belajar Per Hari (Menit):</label>
        <input type="number" id="target-minutes-input" class="form-control" value="20" min="5" max="180" style="padding-left: 14px;">
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
        <button class="btn-primary-sakura" style="flex: 1;" onclick="saveTargetSettings()">
          Simpan Pengaturan
        </button>
        <button class="btn-learn-outline" onclick="closeTargetSettingsModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Lihat Semua (Speaking, Reading, Writing, Listening HSK 1-6) -->
  <div id="see-all-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 860px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 1.8rem 2rem;">
      <!-- Header Modal -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #fae2e6;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span id="see-all-modal-icon" style="font-size: 1.8rem;">🎧</span>
            <div>
              <h3 id="see-all-modal-title" style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text); margin: 0;">
                Daftar Lengkap Latihan
              </h3>
              <p id="see-all-modal-subtitle" style="font-size: 0.82rem; color: var(--text-muted); margin: 2px 0 0 0;">
                Jelajahi seluruh materi & latihan terstruktur dari tingkat HSK 1 sampai HSK 6
              </p>
            </div>
          </div>
        </div>
        <button onclick="closeSeeAllModal()" style="background: #fff0f3; border: 1px solid #ffd8e0; border-radius: 50%; width: 36px; height: 36px; font-size: 1.2rem; cursor: pointer; color: var(--primary-pink); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">✕</button>
      </div>

      <!-- Filter Bar (HSK 1 - 6 + Search) -->
      <div style="padding: 1rem 0; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; border-bottom: 1px solid #f8f9fa;">
        <!-- HSK Level Filter Chips -->
        <div id="see-all-hsk-chips" style="display: flex; flex-wrap: wrap; gap: 6px;">
          <button class="bank-filter-chip active" data-level="all" onclick="filterSeeAllHsk('all')">🌟 Semua Level</button>
          <button class="bank-filter-chip" data-level="HSK 1" onclick="filterSeeAllHsk('HSK 1')">HSK 1</button>
          <button class="bank-filter-chip" data-level="HSK 2" onclick="filterSeeAllHsk('HSK 2')">HSK 2</button>
          <button class="bank-filter-chip" data-level="HSK 3" onclick="filterSeeAllHsk('HSK 3')">HSK 3</button>
          <button class="bank-filter-chip" data-level="HSK 4" onclick="filterSeeAllHsk('HSK 4')">HSK 4</button>
          <button class="bank-filter-chip" data-level="HSK 5" onclick="filterSeeAllHsk('HSK 5')">HSK 5</button>
          <button class="bank-filter-chip" data-level="HSK 6" onclick="filterSeeAllHsk('HSK 6')">HSK 6</button>
        </div>

        <!-- Search Input -->
        <div style="position: relative; min-width: 220px;">
          <input type="text" id="see-all-search-input" placeholder="Cari topik / kosakata..." 
                 oninput="handleSeeAllSearch(this.value)"
                 style="width: 100%; padding: 6px 12px 6px 30px; font-size: 0.82rem; border-radius: var(--radius-pill); border: 1px solid #e2e8f0; outline: none;">
          <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; color: #a0a6bd;">🔍</span>
        </div>
      </div>

      <!-- Scrollable List Container -->
      <div id="see-all-modal-list" style="flex: 1; overflow-y: auto; padding: 1rem 0; display: flex; flex-direction: column; gap: 10px; min-height: 280px; max-height: 55vh;">
        <!-- Injected dynamically via renderSeeAllList() -->
      </div>

      <!-- Modal Footer -->
      <div style="padding-top: 0.8rem; border-top: 1px solid #fae2e6; display: flex; justify-content: space-between; align-items: center;">
        <span id="see-all-count-info" style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
          Menampilkan materi
        </span>
        <button class="btn-learn-outline" style="padding: 6px 16px; font-size: 0.85rem;" onclick="closeSeeAllModal()">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Flashcard Pembelajaran -->
  <div id="flashcard-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 680px;">
      <!-- Header -->
      <div class="flashcard-modal-header">
        <h3>
          🃏 Metode Flashcard HSK
          <span id="fc-level-badge" style="background: rgba(255,255,255,0.25); border-radius: 99px; padding: 2px 10px; font-size: 0.78rem;">HSK 1</span>
        </h3>
        <button onclick="closeFlashcardModal()" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 34px; height: 34px; color: #fff; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <div class="flashcard-modal-body">
        <!-- Level Picker -->
        <div class="fc-level-chips" id="fc-level-chips-row">
          <button class="fc-level-chip active" onclick="setFlashcardLevel(1)">🌱 HSK 1</button>
          <button class="fc-level-chip" onclick="setFlashcardLevel(2)">🌿 HSK 2</button>
          <button class="fc-level-chip" onclick="setFlashcardLevel(3)">🌳 HSK 3</button>
          <button class="fc-level-chip" onclick="setFlashcardLevel(4)">🍁 HSK 4</button>
          <button class="fc-level-chip" onclick="setFlashcardLevel(5)">🌸 HSK 5</button>
          <button class="fc-level-chip" onclick="setFlashcardLevel(6)">👑 HSK 6</button>
        </div>

        <!-- Progress Bar -->
        <div class="fc-progress-bar">
          <div class="fc-progress-fill" id="fc-progress-fill" style="width: 0%;"></div>
        </div>

        <!-- Card Area -->
        <div id="fc-card-area">
          <!-- Flashcard Scene (flip card) -->
          <div class="flashcard-scene" id="flashcard-scene" onclick="flipFlashcard()">
            <div class="flashcard-inner" id="flashcard-inner">
              <div class="flashcard-face flashcard-front">
                <div class="fc-chinese" id="fc-front-hanzi">你好</div>
                <div class="fc-pinyin" id="fc-front-pinyin">nǐ hǎo</div>
                <div class="fc-hint">👆 Ketuk kartu untuk lihat arti</div>
              </div>
              <div class="flashcard-face flashcard-back">
                <div class="fc-chinese-small" id="fc-back-hanzi">你好</div>
                <div class="fc-meaning" id="fc-back-meaning">Halo / Apa kabar</div>
                <div class="fc-example" id="fc-back-example">你好！我是小明。<br><em>Halo! Saya Xiao Ming.</em></div>
              </div>
            </div>
          </div>

          <!-- Audio Button -->
          <div style="display: flex; justify-content: center; margin-bottom: 0.8rem;">
            <button onclick="fcSpeakCurrent()" style="background: var(--primary-pink-light); border: 1.5px solid var(--primary-pink-border); border-radius: 99px; padding: 6px 18px; color: var(--primary-pink); font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
              🔊 Dengar Ucapan
            </button>
          </div>

          <!-- Navigation -->
          <div class="flashcard-nav">
            <button class="fc-nav-btn" id="fc-prev-btn" onclick="fcNavigate(-1)" title="Kartu Sebelumnya">←</button>
            <div class="fc-counter">
              <span id="fc-current-num">1</span> / <span id="fc-total-num">10</span>
              <div style="font-size: 0.72rem; color: var(--text-light); text-align: center; margin-top: 1px;">Kosakata</div>
            </div>
            <button class="fc-nav-btn" id="fc-next-btn" onclick="fcNavigate(1)" title="Kartu Berikutnya">→</button>
          </div>

          <!-- Know / Review Buttons -->
          <div class="fc-result-row">
            <button class="fc-btn-review" onclick="fcMarkCard(false)">
              🔄 Perlu Ulang
            </button>
            <button class="fc-btn-know" onclick="fcMarkCard(true)">
              ✅ Sudah Tahu!
            </button>
          </div>
        </div>

        <!-- Summary Screen (hidden by default) -->
        <div id="fc-summary-area" style="display: none;">
          <div class="fc-summary">
            <div class="fc-summary-emoji" id="fc-summary-emoji">🎉</div>
            <div class="fc-summary-title" id="fc-summary-title">Sesi Selesai!</div>
            <p style="font-size: 0.85rem; color: var(--text-muted);" id="fc-summary-desc">Kamu telah menyelesaikan semua kartu di sesi ini.</p>
            <div class="fc-summary-stats">
              <div class="fc-stat-box">
                <div class="fc-stat-num" id="fc-stat-know" style="color: #2ec4b6;">0</div>
                <div class="fc-stat-label">✅ Sudah Hafal</div>
              </div>
              <div class="fc-stat-box">
                <div class="fc-stat-num" id="fc-stat-review" style="color: var(--primary-pink);">0</div>
                <div class="fc-stat-label">🔄 Perlu Ulang</div>
              </div>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <button class="btn-primary-sakura" style="margin: 0; padding: 10px 22px;" onclick="fcRestartSession()">
                🔁 Ulangi Sesi
              </button>
              <button class="btn-learn-outline" style="padding: 10px 22px;" onclick="fcReviewWrong()">
                🔄 Kartu Salah Saja
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL ADMIN: TAMBAH / EDIT SOAL KUIS (HSK 1 - 6)
       ========================================================================== -->
  <div id="admin-quiz-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 640px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);" id="admin-quiz-modal-title">
            📝 Tambah Butir Soal Kuis Baru
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            Soal akan otomatis terintegrasi ke Bank Soal HSK & paket ujian interaktif siswa.
          </p>
        </div>
        <button onclick="closeAdminQuizModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="quiz-input-level">Tingkat HSK:</label>
          <select id="quiz-input-level" class="form-control" style="padding-left: 14px;">
            <option value="1">🌱 HSK 1</option>
            <option value="2">🌿 HSK 2</option>
            <option value="3">🌳 HSK 3</option>
            <option value="4">🍁 HSK 4</option>
            <option value="5">🌸 HSK 5</option>
            <option value="6">👑 HSK 6</option>
          </select>
        </div>
        <div class="form-group">
          <label for="quiz-input-type">Kategori Keterampilan:</label>
          <select id="quiz-input-type" class="form-control" style="padding-left: 14px;">
            <option value="reading">📖 Reading (Membaca)</option>
            <option value="listening">🎧 Listening (Mendengar)</option>
            <option value="speaking">🎙️ Speaking (Berbicara)</option>
            <option value="writing">✍️ Writing (Menulis)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="quiz-input-question">Teks Pertanyaan / Soal:</label>
        <textarea id="quiz-input-question" class="writing-textarea" style="height: 75px;" placeholder="Contoh: Pilih arti kata yang tepat untuk kalimat: 他在学校喝水。(Tā zài xuéxiào hē shuǐ.)"></textarea>
      </div>

      <div class="form-group">
        <label for="quiz-input-audio">Teks Audio Penutur Asli (Opsional untuk Listening/Speaking):</label>
        <input type="text" id="quiz-input-audio" class="form-control" placeholder="Contoh: 他在学校喝水。">
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 1rem;">
        <label style="font-size: 0.85rem; font-weight: 800; color: var(--dark-text); margin-bottom: 8px; display: block;">
          Pilihan Jawaban & Kunci Benar:
        </label>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="radio" name="quiz-correct-radio" value="0" checked style="accent-color: #10b981; width: 18px; height: 18px;">
            <span style="font-weight: 800; color: #10b981; min-width: 22px;">A.</span>
            <input type="text" id="quiz-opt-0" class="form-control" placeholder="Pilihan A (Jawaban Benar / Opsi 1)" required>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="radio" name="quiz-correct-radio" value="1" style="accent-color: #10b981; width: 18px; height: 18px;">
            <span style="font-weight: 800; color: #64748b; min-width: 22px;">B.</span>
            <input type="text" id="quiz-opt-1" class="form-control" placeholder="Pilihan B" required>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="radio" name="quiz-correct-radio" value="2" style="accent-color: #10b981; width: 18px; height: 18px;">
            <span style="font-weight: 800; color: #64748b; min-width: 22px;">C.</span>
            <input type="text" id="quiz-opt-2" class="form-control" placeholder="Pilihan C" required>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="radio" name="quiz-correct-radio" value="3" style="accent-color: #10b981; width: 18px; height: 18px;">
            <span style="font-weight: 800; color: #64748b; min-width: 22px;">D.</span>
            <input type="text" id="quiz-opt-3" class="form-control" placeholder="Pilihan D" required>
          </div>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0;">*Pilih tombol radio bundar di sebelah kiri sebagai kunci jawaban yang benar.</p>
      </div>

      <div class="form-group">
        <label for="quiz-input-explanation">Penjelasan / Pembahasan Soal:</label>
        <textarea id="quiz-input-explanation" class="writing-textarea" style="height: 60px;" placeholder="Tuliskan analisis tata bahasa atau alasan kenapa opsi tersebut adalah jawaban yang tepat..."></textarea>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
        <button id="admin-quiz-save-btn" class="btn-primary-sakura" style="flex: 1;" onclick="handleSaveAdminQuiz()">
          💾 Simpan Soal Kuis
        </button>
        <button class="btn-learn-outline" onclick="closeAdminQuizModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL ADMIN: TAMBAH / EDIT KARTU FLASHCARD BARU
       ========================================================================== -->
  <div id="admin-flashcard-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 580px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 id="admin-flashcard-modal-title" style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);">
            🃏 Tambah Kartu Flashcard Baru
          </h3>
          <p id="admin-flashcard-modal-desc" style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            Kartu flashcard hafalan kosakata Mandarin akan langsung muncul pada fitur Flashcard interaktif.
          </p>
        </div>
        <button onclick="closeAdminFlashcardModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <div class="form-group">
        <label for="fc-input-level">Tingkat Level HSK:</label>
        <select id="fc-input-level" class="form-control" style="padding-left: 14px;">
          <option value="1">🌱 HSK 1</option>
          <option value="2">🌿 HSK 2</option>
          <option value="3">🌳 HSK 3</option>
          <option value="4">🍁 HSK 4</option>
          <option value="5">🌸 HSK 5</option>
          <option value="6">👑 HSK 6</option>
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="fc-input-hanzi">Karakter Hanzi:</label>
          <input type="text" id="fc-input-hanzi" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 学习">
        </div>
        <div class="form-group">
          <label for="fc-input-pinyin">Pinyin Bernada:</label>
          <input type="text" id="fc-input-pinyin" class="form-control" placeholder="Contoh: xuéxí">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="fc-input-meaning">Arti Bahasa Indonesia:</label>
          <input type="text" id="fc-input-meaning" class="form-control" placeholder="Contoh: Belajar / Mempelajari">
        </div>
        <div class="form-group">
          <label for="fc-input-meaning-en">Arti Bahasa Inggris (English):</label>
          <input type="text" id="fc-input-meaning-en" class="form-control" placeholder="Contoh: Study / Learn">
        </div>
      </div>

      <div class="form-group">
        <label for="fc-input-example">Contoh Kalimat Mandarin:</label>
        <input type="text" id="fc-input-example" class="form-control" style="font-family: var(--font-chinese);" placeholder="Contoh: 我每天努力学习汉语。">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="fc-input-example-trans">Terjemahan Contoh (ID):</label>
          <input type="text" id="fc-input-example-trans" class="form-control" placeholder="Contoh: Saya setiap hari giat belajar bahasa Mandarin.">
        </div>
        <div class="form-group">
          <label for="fc-input-example-trans-en">Terjemahan Contoh (EN):</label>
          <input type="text" id="fc-input-example-trans-en" class="form-control" placeholder="Contoh: I study Chinese diligently every day.">
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
        <button id="admin-flashcard-save-btn" class="btn-primary-sakura" style="flex: 1;" onclick="handleSaveAdminFlashcard()">
          💾 Simpan Kartu Flashcard
        </button>
        <button class="btn-learn-outline" onclick="closeAdminFlashcardModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL ADMIN: TAMBAH / EDIT SOAL GAME ARENA
       ========================================================================== -->
  <div id="admin-game-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 620px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 id="admin-game-modal-title" style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);">
            🎮 Kelola Soal Game Arena
          </h3>
          <p id="admin-game-modal-desc" style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            Soal akan otomatis tersinkronisasi ke Game Arena interaktif dan database.
          </p>
        </div>
        <button onclick="closeAdminGameModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <input type="hidden" id="game-modal-action" value="add">
      <input type="hidden" id="game-modal-subgame" value="tone">
      <input type="hidden" id="game-modal-id" value="">
      <input type="hidden" id="game-modal-cat-key" value="">

      <!-- Common Level / Session & Difficulty selector -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group" id="group-game-level">
          <label for="game-input-level">Tingkat Level HSK:</label>
          <select id="game-input-level" class="form-control" style="padding-left: 14px;">
            <option value="1">🌱 HSK 1</option>
            <option value="2">🌿 HSK 2</option>
            <option value="3">🌳 HSK 3</option>
            <option value="4">🍁 HSK 4</option>
            <option value="5">🌸 HSK 5</option>
            <option value="6">👑 HSK 6</option>
          </select>
        </div>
        <div class="form-group" id="group-game-category" style="display: none;">
          <label for="game-input-category">Kategori Pasang Kata:</label>
          <select id="game-input-category" class="form-control" style="padding-left: 14px;">
            <option value="cat1">🌟 Kategori 1 (Dasar)</option>
            <option value="cat2">🌿 Kategori 2 (Sehari-hari)</option>
            <option value="cat3">🍜 Kategori 3 (Kuliner)</option>
            <option value="cat4">💼 Kategori 4 (Aktivitas)</option>
            <option value="cat5">☀️ Kategori 5 (Waktu/Arah)</option>
            <option value="cat6">🚗 Kategori 6 (Kota/Transportasi)</option>
          </select>
        </div>
        <div class="form-group" id="group-game-session" style="display: none;">
          <label for="game-input-session">Sesi Permainan Memori:</label>
          <select id="game-input-session" class="form-control" style="padding-left: 14px;">
            <option value="session1">Sesi 1: Salam & Dasar</option>
            <option value="session2">Sesi 2: Keluarga & Orang</option>
            <option value="session3">Sesi 3: Kuliner & Minuman</option>
            <option value="session4">Sesi 4: Aktivitas & Belajar</option>
            <option value="session5">Sesi 5: Waktu, Cuaca & Arah</option>
            <option value="session6">Sesi 6: Kota & Transportasi</option>
          </select>
        </div>
        <div class="form-group">
          <label for="game-input-difficulty">Tingkat Kesulitan:</label>
          <select id="game-input-difficulty" class="form-control" style="padding-left: 14px;">
            <option value="easy">🟢 Easy (Mudah)</option>
            <option value="medium">🟡 Medium (Sedang)</option>
            <option value="hard">🔴 Hard (Tantangan)</option>
          </select>
        </div>
      </div>

      <!-- Tone Trainer Fields -->
      <div id="fields-game-tone">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-hanzi">Karakter Hanzi:</label>
            <input type="text" id="game-input-hanzi" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 妈">
          </div>
          <div class="form-group">
            <label for="game-input-pinyin">Pinyin:</label>
            <input type="text" id="game-input-pinyin" class="form-control" placeholder="Contoh: mā">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-tone">Nada (Tone 1 - 4):</label>
            <select id="game-input-tone" class="form-control" style="padding-left: 14px;">
              <option value="1">Nada 1 (— Datar Tinggi)</option>
              <option value="2">Nada 2 (ˊ Naik Cepat)</option>
              <option value="3">Nada 3 (ˇ Turun-Naik)</option>
              <option value="4">Nada 4 (ˋ Hentak Tegas)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="game-input-meaning">Arti Bahasa Indonesia:</label>
            <input type="text" id="game-input-meaning" class="form-control" placeholder="Contoh: Ibu / Mama">
          </div>
        </div>
        <div class="form-group">
          <label for="game-input-tip">Tips / Panduan Nada (Opsional):</label>
          <input type="text" id="game-input-tip" class="form-control" placeholder="Contoh: Suara datar tinggi seperti bernyanyi do-re-mi di nada mi.">
        </div>
      </div>

      <!-- Word Link Fields -->
      <div id="fields-game-link" style="display: none;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-parta">Karakter Bagian A (Kiri):</label>
            <input type="text" id="game-input-parta" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 汽">
          </div>
          <div class="form-group">
            <label for="game-input-partb">Karakter Bagian B (Kanan):</label>
            <input type="text" id="game-input-partb" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 车">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-link-pinyin">Pinyin Gabungan:</label>
            <input type="text" id="game-input-link-pinyin" class="form-control" placeholder="Contoh: qìchē">
          </div>
          <div class="form-group">
            <label for="game-input-link-meaning">Arti Gabungan Kata:</label>
            <input type="text" id="game-input-link-meaning" class="form-control" placeholder="Contoh: Mobil">
          </div>
        </div>
      </div>

      <!-- Memory Match Fields -->
      <div id="fields-game-memory" style="display: none;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-mem-hanzi">Karakter Hanzi (Sisi Depan):</label>
            <input type="text" id="game-input-mem-hanzi" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 苹果">
          </div>
          <div class="form-group">
            <label for="game-input-mem-text">Teks Pinyin & Arti (Sisi Belakang):</label>
            <input type="text" id="game-input-mem-text" class="form-control" placeholder="Contoh: Píngguǒ (Apel)">
          </div>
        </div>
      </div>

      <!-- Pinyin Hanzi Match Fields -->
      <div id="fields-game-pinyin-hanzi" style="display: none;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label for="game-input-ph-pinyin">Soal Pinyin:</label>
            <input type="text" id="game-input-ph-pinyin" class="form-control" placeholder="Contoh: nǐ hǎo">
          </div>
          <div class="form-group">
            <label for="game-input-ph-hanzi">Kunci Jawaban Hanzi:</label>
            <input type="text" id="game-input-ph-hanzi" class="form-control" style="font-family: var(--font-chinese); font-size: 1.2rem;" placeholder="Contoh: 你好">
          </div>
        </div>
        <div class="form-group">
          <label for="game-input-ph-meaning">Arti Bahasa Indonesia:</label>
          <input type="text" id="game-input-ph-meaning" class="form-control" placeholder="Contoh: Halo / Apa kabar">
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
        <button id="admin-game-save-btn" class="btn-primary-sakura" style="flex: 1;" onclick="handleSaveAdminGame()">
          💾 Simpan Soal Game
        </button>
        <button class="btn-learn-outline" onclick="closeAdminGameModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL ADMIN: TAMBAH / EDIT ANATOMI KARAKTER FITUR CERDAS
       ========================================================================== -->
  <div id="admin-fitur-cerdas-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 620px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 id="admin-fitur-modal-title" style="font-size: 1.3rem; font-weight: 800; color: var(--dark-text);">
            💡 Kelola Anatomi Karakter & Mnemonik
          </h3>
          <p id="admin-fitur-modal-desc" style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            Bedah struktur radikal dan berikan cerita mnemonik visual untuk memudahkan daya ingat siswa.
          </p>
        </div>
        <button onclick="closeAdminFiturCerdasModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted);">✕</button>
      </div>

      <input type="hidden" id="fitur-modal-action" value="add">
      <input type="hidden" id="fitur-modal-id" value="">

      <div class="form-group">
        <label for="fitur-input-level">Tingkat Level HSK:</label>
        <select id="fitur-input-level" class="form-control" style="padding-left: 14px;">
          <option value="1">🌱 HSK 1</option>
          <option value="2">🌿 HSK 2</option>
          <option value="3">🌳 HSK 3</option>
          <option value="4">🍁 HSK 4</option>
          <option value="5">🌸 HSK 5</option>
          <option value="6">👑 HSK 6</option>
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="fitur-input-char">Karakter Hanzi:</label>
          <input type="text" id="fitur-input-char" class="form-control" style="font-family: var(--font-chinese); font-size: 1.3rem;" placeholder="Contoh: 好">
        </div>
        <div class="form-group">
          <label for="fitur-input-pinyin">Pinyin Bernada:</label>
          <input type="text" id="fitur-input-pinyin" class="form-control" placeholder="Contoh: hǎo">
        </div>
      </div>

      <div class="form-group">
        <label for="fitur-input-meaning">Arti Karakter:</label>
        <input type="text" id="fitur-input-meaning" class="form-control" placeholder="Contoh: Baik / Bagus">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label for="fitur-input-rada">Radikal A (Kiri/Atas):</label>
          <input type="text" id="fitur-input-rada" class="form-control" placeholder="Contoh: 女 (Wanita / Ibu)">
        </div>
        <div class="form-group">
          <label for="fitur-input-radb">Radikal B (Kanan/Bawah):</label>
          <input type="text" id="fitur-input-radb" class="form-control" placeholder="Contoh: 子 (Anak)">
        </div>
      </div>

      <div class="form-group">
        <label for="fitur-input-story">Cerita Mnemonik & Asal-usul Karakter:</label>
        <textarea id="fitur-input-story" class="writing-textarea" style="height: 80px;" placeholder="Contoh: Ketika seorang wanita (女) bersama anaknya (子), terciptalah kebahagiaan dan kebaikan (好)."></textarea>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
        <button id="admin-fitur-save-btn" class="btn-primary-sakura" style="flex: 1;" onclick="handleSaveAdminFiturCerdas()">
          💾 Simpan Anatomi Karakter
        </button>
        <button class="btn-learn-outline" onclick="closeAdminFiturCerdasModal()">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/questions-data.js?v=<?= time() ?>"></script>
  <script src="js/modules-data.js?v=<?= time() ?>"></script>
  <script src="js/cerita-data.js?v=<?= time() ?>"></script>
  <script src="js/cerita-app.js?v=<?= time() ?>"></script>
  <script src="js/app.js?v=<?= time() ?>"></script>
  <script src="js/features-plus.js?v=<?= time() ?>"></script>
</body>
</html>
