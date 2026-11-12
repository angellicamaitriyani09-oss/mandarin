    <section id="page-reading" class="app-page">
      <div class="module-header-banner">
        <div>
          <span class="role-badge" style="background: #eff6ff; color: #3a86ff;">📖 Reading</span>
          <h2 class="module-header-title">Latih kemampuan membaca teks & cerita Mandarin</h2>
          <p class="module-header-desc">Pahami struktur kalimat, perluas perbendaharaan kosakata, dan uji pemahaman bacaan dengan cerita interaktif.</p>
        </div>
        <img src="assets/images/panda-reading.svg" alt="Panda Reading Banner" style="width: 130px; height: auto;">
      </div>

      <!-- Subtab Switcher: Pemisah Materi & Contoh Latihan -->
      <div class="skill-subtab-bar">
        <button class="skill-subtab-btn active" id="btn-subtab-reading-materi" onclick="switchSkillSubtab('reading', 'materi')">
          <span>📚</span> <span>Materi Pembelajaran</span>
        </button>
        <button class="skill-subtab-btn" id="btn-subtab-reading-latihan" onclick="switchSkillSubtab('reading', 'latihan')">
          <span>🎯</span> <span>Contoh Latihan & Soal</span>
        </button>
      </div>

      <!-- Dynamic Reading Module Container -->
      <div id="reading-content-container"></div>
    </section>
