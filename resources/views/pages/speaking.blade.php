    <section id="page-speaking" class="app-page">
      <!-- Header Banner -->
      <div class="module-header-banner">
        <div>
          <span class="role-badge" style="background: #e6faf7; color: #2ec4b6;">🎙️ Speaking</span>
          <h2 class="module-header-title">Latih kemampuan berbicara bahasa Mandarin</h2>
          <p class="module-header-desc">Berlatih berbicara dengan pengucapan yang tepat, percaya diri, dan lancar dalam berbagai situasi.</p>
        </div>
        <img src="assets/images/panda-speaking.svg" alt="Panda Speaking Banner" style="width: 130px; height: auto;">
      </div>

      <!-- Subtab Switcher: Pemisah Materi, Latihan Ucap & Simulasi Percakapan -->
      <div class="skill-subtab-bar">
        <button class="skill-subtab-btn active" id="btn-subtab-speaking-materi" onclick="switchSkillSubtab('speaking', 'materi')">
          <span>📚</span> <span>Materi Pembelajaran</span>
        </button>
        <button class="skill-subtab-btn" id="btn-subtab-speaking-latihan" onclick="switchSkillSubtab('speaking', 'latihan')">
          <span>🎯</span> <span>Latihan Ucap & Evaluasi AI</span>
        </button>
        <button class="skill-subtab-btn" id="btn-subtab-speaking-roleplay" onclick="switchSkillSubtab('speaking', 'roleplay')">
          <span>🎭</span> <span>Simulasi Percakapan (Roleplay)</span>
        </button>
      </div>

      <!-- Container Dinamis Speaking -->
      <div id="speaking-content-container"></div>
    </section>
