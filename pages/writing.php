    <section id="page-writing" class="app-page">
      <div class="module-header-banner">
        <div>
          <span class="role-badge" style="background: #fff8eb; color: #ff9f1c;">✍️ Writing</span>
          <h2 class="module-header-title">Latih penulisan karakter & tata bahasa Mandarin</h2>
          <p class="module-header-desc">Panduan animasi goresan Tian Zi Ge dan pengecekan tata bahasa otomatis berbasis AI.</p>
          <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-learn-outline" style="padding: 6px 14px; font-size: 0.8rem; margin: 0; background: #fff;" onclick="navigateTo('cetak-hanzi')">
              🖨️ Cetak Lembar Latihan Kotak Hanzi (PDF)
            </button>
            <button type="button" class="btn-learn-outline" style="padding: 6px 14px; font-size: 0.8rem; margin: 0; background: #fff;" onclick="if(window.MandarinkuExtras) MandarinkuExtras.openLatihanTab('dictation')">
              🎧 Latihan Dikte Audio (听写)
            </button>
          </div>
        </div>
        <img src="assets/images/panda-writing.svg" alt="Panda Writing Banner" style="width: 130px; height: auto;">
      </div>

      <!-- Subtab Switcher: Pemisah Materi & Contoh Latihan -->
      <div class="skill-subtab-bar">
        <button class="skill-subtab-btn active" id="btn-subtab-writing-materi" onclick="switchSkillSubtab('writing', 'materi')">
          <span>📚</span> <span>Materi Pembelajaran</span>
        </button>
        <button class="skill-subtab-btn" id="btn-subtab-writing-latihan" onclick="switchSkillSubtab('writing', 'latihan')">
          <span>🎯</span> <span>Contoh Latihan & Soal</span>
        </button>
      </div>

      <div class="writing-container-grid" id="writing-content-container"></div>
    </section>
