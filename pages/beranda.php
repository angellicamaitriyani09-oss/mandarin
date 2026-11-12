    <section id="page-beranda" class="app-page active-page">
      <div class="beranda-full-container">
        <!-- Main Dashboard Content -->
        <div>
          <!-- Hero Banner -->
          <div class="hero-welcome-card">
            <div class="hero-content">
              <h2>Selamat datang di Mandarinku!</h2>
              <p>Teman belajar Mandarin-mu setiap hari.<br>Yuk, mulai perjalanan bahasa yang seru dan menyenangkan!</p>
              <button class="btn-hero-action" onclick="navigateTo('listening')">
                <span>Mulai Belajar</span>
                <span>→</span>
              </button>
            </div>
            <div class="hero-mascot-wrapper">
              <span class="speech-bubble-mini">你好！</span>
              <img src="assets/images/panda-mascot.svg" alt="Panda Welcoming" class="hero-mascot-img">
            </div>
          </div>

          <!-- Role Access Notice Banner -->
          <div id="beranda-role-notice" class="modern-banner-card" style="margin-bottom: 1.5rem; padding: 14px 22px; border-radius: 20px; background: linear-gradient(135deg, rgba(236,253,245,0.85), rgba(209,250,229,0.5)); border: 1px solid rgba(167,243,208,0.6); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-shadow: 0 4px 16px rgba(16,185,129,0.06);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.6rem; background: rgba(255,255,255,0.8); width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">🎓</span>
              <div>
                <strong style="font-size: 0.9rem; color: #065f46; display: block;">Akses Siswa Aktif</strong>
                <span style="font-size: 0.82rem; color: #047857;">Lihat, pelajari, dan kerjakan seluruh paket modul, flashcard, dan bank soal.</span>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="switchUserRole('admin')" style="background: #059669; border: none; color: #ffffff; padding: 7px 18px; border-radius: 9999px; font-size: 0.8rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
                🛡️ Masuk Mode Admin
              </button>
            </div>
          </div>

          <!-- Mulai Belajar: 4 Main Skill Cards -->
          <div class="section-heading-with-icon">
            <span style="color: var(--primary-pink)">🌸</span> Mulai Belajar
          </div>

          <div class="skill-cards-grid">
            <!-- Listening Card -->
            <div class="skill-card" onclick="navigateTo('listening')">
              <img src="assets/images/panda-listening.svg" alt="Listening Panda" class="skill-card-img">
              <h3 class="skill-card-title">Listening</h3>
              <p class="skill-card-desc">Latih telingamu dengan berbagai audio seru percakapan penutur asli.</p>
              <div class="skill-card-btn-arrow">→</div>
            </div>

            <!-- Speaking Card -->
            <div class="skill-card" onclick="navigateTo('speaking')">
              <img src="assets/images/panda-speaking.svg" alt="Speaking Panda" class="skill-card-img">
              <h3 class="skill-card-title">Speaking</h3>
              <p class="skill-card-desc">Berlatih berbicara dan tingkatkan pelafalan dengan AI Voice Recognition.</p>
              <div class="skill-card-btn-arrow">→</div>
            </div>

            <!-- Reading Card -->
            <div class="skill-card" onclick="navigateTo('reading')">
              <img src="assets/images/panda-reading.svg" alt="Reading Panda" class="skill-card-img">
              <h3 class="skill-card-title">Reading</h3>
              <p class="skill-card-desc">Baca cerita pendek dan teks interaktif dalam karakter Hanzi & Pinyin.</p>
              <div class="skill-card-btn-arrow">→</div>
            </div>

            <!-- Writing Card -->
            <div class="skill-card" onclick="navigateTo('writing')">
              <img src="assets/images/panda-writing.svg" alt="Writing Panda" class="skill-card-img">
              <h3 class="skill-card-title">Writing</h3>
              <p class="skill-card-desc">Tulis huruf Hanzi animasi goresan dan cek tata bahasa otomatis berbasis AI.</p>
              <div class="skill-card-btn-arrow">→</div>
            </div>
          </div>

          <!-- Highlight Banner: Kumpulan Cerita Mandarin HSK 1 - 6 -->
          <div class="modern-feature-banner" style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 22px; padding: 22px 26px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: 0 8px 24px rgba(234, 88, 12, 0.08); border: 1px solid rgba(253, 186, 116, 0.4);">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="font-size: 2.2rem; background: rgba(255,255,255,0.9); width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(234,88,12,0.12); flex-shrink: 0;">🏮</div>
              <div>
                <span class="role-badge" style="background: #ea580c; color: #fff; font-size: 0.72rem; padding: 3px 10px; font-weight: 800; border-radius: 9999px;">FITUR CERITA</span>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #7c2d12; margin: 4px 0 3px 0;">Kumpulan Cerita Mandarin HSK 1 - 6</h3>
                <p style="font-size: 0.84rem; color: #9a3412; margin: 0; line-height: 1.45;">Tingkatkan literasi lewat dongeng klasik, fabel idiom Chengyu, dan kuis pemahaman interaktif.</p>
              </div>
            </div>
            <button class="btn-primary-sakura" style="background: linear-gradient(135deg, #ea580c, #c2410c); margin: 0; padding: 10px 22px; font-size: 0.88rem; white-space: nowrap; border-radius: 9999px; box-shadow: 0 4px 14px rgba(234,88,12,0.3);" onclick="navigateTo('cerita')">
              📖 Jelajahi Cerita Sekarang →
            </button>
          </div>

          <!-- Highlight Grid: Arena Game Mandarin & Fitur Cerdas -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 2rem;">
            <!-- Card 1: Arena Game -->
            <div class="modern-feature-card" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 22px; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 8px 24px rgba(139, 92, 246, 0.08); border: 1px solid rgba(221, 214, 254, 0.5);" onclick="navigateTo('game-arena')">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="font-size: 2.2rem; background: rgba(255,255,255,0.9); width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(139,92,246,0.14); flex-shrink: 0;">🎮</div>
                <div>
                  <span class="role-badge" style="background: #8b5cf6; color: #fff; font-size: 0.7rem; padding: 2px 8px; font-weight: 800; border-radius: 9999px;">GAME ARENA</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #5b21b6; margin: 3px 0 2px 0;">Arena Game Mandarin</h4>
                  <p style="font-size: 0.8rem; color: #6d28d9; margin: 0;">Tone Trainer, Word Link & Memory Match.</p>
                </div>
              </div>
              <button class="btn-primary-sakura" style="background: #8b5cf6; margin: 0; padding: 8px 18px; font-size: 0.82rem; white-space: nowrap; border-radius: 9999px; box-shadow: 0 4px 12px rgba(139,92,246,0.25);" onclick="event.stopPropagation(); navigateTo('game-arena')">
                Main ➔
              </button>
            </div>

            <!-- Card 2: Fitur Cerdas & Alat Bantu -->
            <div class="modern-feature-card" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 22px; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 8px 24px rgba(2, 132, 199, 0.08); border: 1px solid rgba(186, 230, 253, 0.5);" onclick="navigateTo('fitur-pintar')">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="font-size: 2.2rem; background: rgba(255,255,255,0.9); width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(2,132,199,0.14); flex-shrink: 0;">💡</div>
                <div>
                  <span class="role-badge" style="background: #0284c7; color: #fff; font-size: 0.7rem; padding: 2px 8px; font-weight: 800; border-radius: 9999px;">SMART TOOLS</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #0369a1; margin: 3px 0 2px 0;">Fitur Cerdas & Alat Bantu</h4>
                  <p style="font-size: 0.8rem; color: #0284c7; margin: 0;">Pewarna Nada, Anatomi & Kamus Cepat.</p>
                </div>
              </div>
              <button class="btn-primary-sakura" style="background: #0284c7; margin: 0; padding: 8px 18px; font-size: 0.82rem; white-space: nowrap; border-radius: 9999px; box-shadow: 0 4px 12px rgba(2,132,199,0.25);" onclick="event.stopPropagation(); navigateTo('fitur-pintar')">
                Buka ➔
              </button>
            </div>
          </div>

          <!-- Modul Pembelajaran Interaktif HSK 1 - 6 (Home Level Selector) -->
          <div class="section-heading-with-icon" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div><span style="color: var(--primary-pink)">📚</span> Modul Pembelajaran HSK 1 - 6</div>
            <button class="btn-learn-outline" style="padding: 4px 12px; font-size: 0.8rem; margin: 0;" onclick="navigateTo('hsk')">Lihat Semua Level HSK →</button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 2.2rem;">
            <!-- HSK 1 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #ecfdf5; color: #10b981; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🌱</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #ecfdf5; color: #059669; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 1 • Pemula</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Fondasi Mandarin Dasar</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">150 Kosakata, Pinyin 4 Nada & Pola 是.</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-1', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-1', 'contoh')">💡 Soal</button>
              </div>
            </div>

            <!-- HSK 2 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #cff4fc; color: #06b6d4; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🌿</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #cff4fc; color: #0891b2; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 2 • Percakapan</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Komunikasi Sehari-hari</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">300 Kosakata, Kalimat 比 & Pola 在...呢.</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-2', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-2', 'contoh')">💡 Soal</button>
              </div>
            </div>

            <!-- HSK 3 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #dbeafe; color: #3b82f6; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🌳</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 3 • Menengah</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Tata Bahasa & Cerita</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">600 Kosakata, Pola 把 & 虽然...但是...</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-3', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-3', 'contoh')">💡 Soal</button>
              </div>
            </div>

            <!-- HSK 4 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #f3e8ff; color: #8b5cf6; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🍁</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #f3e8ff; color: #6d28d9; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 4 • Lanjutan</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Diskusi & Kalimat Pasif</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">1.200 Kosakata, Bentuk 被 & 无论...都...</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-4', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-4', 'contoh')">💡 Soal</button>
              </div>
            </div>

            <!-- HSK 5 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #fce7f3; color: #ec4899; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🌸</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #fce7f3; color: #be185d; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 5 • Mahir</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Fasih Opini & Wacana</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">2.500 Kosakata, 合作共赢 & Berita.</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-5', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-5', 'contoh')">💡 Soal</button>
              </div>
            </div>

            <!-- HSK 6 Card -->
            <div class="modern-course-card" style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 0; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: #fef3c7; color: #d97706; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">👑</div>
              <div style="flex: 1;">
                <span class="role-badge" style="background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.72rem; padding: 2px 10px; border-radius: 9999px;">HSK 6 • Master</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin: 3px 0 2px 0;">Kesusastraan & Idiom</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">5.000+ Kosakata & Chengyu Klasik.</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="btn-primary-sakura" style="padding: 7px 14px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-6', 'materi')">📖 Materi</button>
                <button class="btn-learn-outline" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 9999px;" onclick="openModuleDetailPage('mod-hsk-6', 'contoh')">💡 Soal</button>
              </div>
            </div>
          </div>

          <!-- Progress Belajarmu, Streak, Poin & Quote Section -->
          <div class="section-heading-with-icon">
            <span style="color: var(--primary-pink)">🌸</span> Progress Belajarmu & Misi Harian
          </div>

          <div class="home-stats-row" id="home-stats-dynamic-row">
            <!-- Dynamic Content injected via updateHomeDashboard() -->
          </div>

          <!-- Daily Missions & Gamification Panel -->
          <div id="beranda-daily-missions-panel" style="margin-top: 1.25rem; margin-bottom: 1.25rem;"></div>

          <!-- Adaptive Recommendation Card -->
          <div id="home-adaptive-recommendation" style="margin-top: 1rem;"></div>

          <!-- Modul Tambahan & Komentar Section -->
          <div style="margin-top: 2.5rem;" id="custom-modules-list-container"></div>
        </div>
      </div>
    </section>
