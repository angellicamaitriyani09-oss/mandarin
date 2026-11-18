    <section id="page-listening" class="app-page">
      <!-- Header Banner -->
      <div class="module-header-banner">
        <div>
          <span class="role-badge">🎧 Listening</span>
          <h2 class="module-header-title">Latih kemampuan mendengar bahasa Mandarin</h2>
          <p class="module-header-desc">Dengarkan audio, pahami percakapan, dan jawab pertanyaan dengan tepat.</p>
        </div>
        <img src="assets/images/panda-listening.svg" alt="Panda Listening Banner" style="width: 130px; height: auto;">
      </div>

      <!-- Subtab Switcher: Pemisah Materi & Contoh Latihan -->
      <div class="skill-subtab-bar">
        <button class="skill-subtab-btn active" id="btn-subtab-listening-materi" onclick="switchSkillSubtab('listening', 'materi')">
          <span>📚</span> <span>Materi Pembelajaran</span>
        </button>
        <button class="skill-subtab-btn" id="btn-subtab-listening-latihan" onclick="switchSkillSubtab('listening', 'latihan')">
          <span>🎯</span> <span>Contoh Latihan & Soal</span>
        </button>
      </div>

      <!-- Container Dinamis Listening -->
      <div id="listening-content-container"></div>
    </section>
