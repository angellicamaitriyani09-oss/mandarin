    <section id="page-login" class="app-page">
      <div class="auth-container">
        <div class="auth-split-card">
          <!-- Left Visual Illustration -->
          <div class="auth-left-illustration">
            <img src="assets/images/panda-mascot.svg" alt="Panda Mascot with Books and Pagoda" class="auth-mascot-img">
          </div>

          <!-- Right Form Area -->
          <div class="auth-right-form">
            <svg class="auth-lantern-icon" viewBox="0 0 100 100" fill="none">
              <rect x="35" y="10" width="30" height="6" rx="2" fill="#d9536d"/>
              <ellipse cx="50" cy="45" rx="34" ry="28" fill="#ff758c"/>
              <ellipse cx="50" cy="45" rx="18" ry="28" fill="#ff9ebb"/>
              <line x1="50" y1="16" x2="50" y2="73" stroke="#d9536d" stroke-width="3"/>
              <rect x="38" y="73" width="24" height="5" rx="2" fill="#d9536d"/>
              <line x1="50" y1="78" x2="50" y2="92" stroke="#e07a5f" stroke-width="3"/>
            </svg>
            <h1 class="auth-title">Selamat Datang!</h1>
            <p class="auth-subtitle">Belajar Mandarin jadi lebih mudah dan menyenangkan.</p>
            <div class="auth-divider-line"></div>

            <form id="login-form">
              <div class="form-group">
                <label for="login-email">Email</label>
                <div class="input-with-icon">
                  <span class="input-icon">✉️</span>
                  <input type="email" id="login-email" class="form-control" placeholder="Masukkan email Anda" value="learner@mandarinku.com" required>
                </div>
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <div class="input-with-icon">
                  <span class="input-icon">🔒</span>
                  <input type="password" id="login-password" class="form-control" placeholder="Masukkan password" value="PandaBelajar2024!" required>
                  <span id="toggle-password-btn" class="toggle-password">👁️</span>
                </div>
              </div>

              <button type="submit" class="btn-primary-sakura">
                <span>Berikutnya</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </form>

            <div class="auth-helper-links">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" checked style="accent-color: var(--primary-pink);"> Ingat saya
              </label>
              <a href="#" onclick="showToast('Fitur reset kata sandi telah dikirim ke email 📧')">Lupa password?</a>
            </div>

            <!-- Demo Quick Role Switcher (2 Pengelola / Akses) -->
            <div class="role-quick-selector" style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 14px; padding: 14px; margin-top: 1.2rem;">
              <p style="font-weight: 800; font-size: 0.85rem; color: var(--dark-text); margin-bottom: 8px;">
                ⚡ Pilih Akses Masuk Pengguna:
              </p>
              <div class="role-btns" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" class="role-btn-chip selected" data-role="student" style="padding: 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <span style="font-size: 1.1rem;">👨‍🎓</span>
                  <strong style="font-size: 0.88rem;">Siswa (Pelajar)</strong>
                  <span style="font-size: 0.72rem; color: #64748b;">Akses materi & soal</span>
                </button>
                <button type="button" class="role-btn-chip" data-role="admin" style="padding: 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <span style="font-size: 1.1rem;">🛡️</span>
                  <strong style="font-size: 0.88rem;">Admin (Pengelola)</strong>
                  <span style="font-size: 0.72rem; color: #64748b;">Kelola modul, kuis & flashcard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
