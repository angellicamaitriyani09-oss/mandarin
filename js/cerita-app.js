/**
 * Mandarinku - Cerita HSK 1 - 6 Interactive Controller
 * Mengatur UI Kumpulan Cerita Mandarin:
 * - Filter Tab Level HSK 1 - 6, Status Baca & Pelacakan Progres (localStorage)
 * - Tampilan Kartu Cerita & Halaman Baca Detail
 * - Toggle Tampilkan/Sembunyikan Pinyin & Terjemahan Bahasa Indonesia
 * - Click-to-Translate Tooltip (Klik Karakter/Kata Hanzi untuk Kamus Pop-up & Simpan Flashcard)
 * - Kontrol Kecepatan Audio (0.5x, 0.85x, 1.0x, 1.25x) & Read-Along Highlight (Karaoke Kalimat/Karakter)
 * - Tabbed Panel: Teks Cerita, Analisis Tata Bahasa (Grammar), Kosakata Kunci (+ Simpan Flashcard), dan Kuis Interaktif
 * - Validasi & Skor Realtime Kuis Pemahaman Cerita dengan Pembahasan Lengkap
 */

window.CeritaApp = {
  activeLevel: 'all',
  statusFilter: 'all', // 'all', 'read', 'unread'
  currentStoryId: null,
  showPinyin: false,
  showTranslation: false,
  speechRate: 0.85,
  isSpeaking: false,
  speakingTimer: null,
  quizAnswers: {},
  quizSubmitted: false,
  progressKey: 'mandarinku_cerita_progress_v1',

  init() {
    this.bindGlobalTooltipEvents();
    this.renderListPage();
  },

  getProgressMap() {
    try {
      const raw = localStorage.getItem(this.progressKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  saveStoryProgress(storyId, updates) {
    try {
      const map = this.getProgressMap();
      const prev = map[storyId] || { read: false, quizScore: null };
      map[storyId] = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.progressKey, JSON.stringify(map));
      if (updates.read && window.MandarinkuExtras && typeof window.MandarinkuExtras.recordMissionProgress === 'function') {
        window.MandarinkuExtras.recordMissionProgress('read_story', 1);
      }
    } catch (e) {}
  },

  toggleReadStatus(storyId) {
    const map = this.getProgressMap();
    const cur = map[storyId] && map[storyId].read;
    this.saveStoryProgress(storyId, { read: !cur });
    const btn = document.getElementById('btn-mark-story-read');
    if (btn) {
      const isNowRead = !cur;
      btn.classList.toggle('active', isNowRead);
      btn.style.background = isNowRead ? '#ecfdf5' : '#ffffff';
      btn.style.color = isNowRead ? '#059669' : '#475569';
      btn.style.borderColor = isNowRead ? '#6ee7b7' : '#cbd5e1';
      btn.innerHTML = isNowRead ? '✅ Selesai Dibaca' : '☑️ Tandai Selesai Dibaca';
    }
    if (typeof showToast === 'function') {
      showToast(!cur ? '🎉 Cerita ditandai Selesai Dibaca! (+15 EXP)' : 'Status baca cerita direset.', !cur ? 'success' : 'info');
    }
  },

  setLevelFilter(lvl) {
    this.activeLevel = lvl;
    this.currentStoryId = null;
    this.stopSpeak();
    this.renderListPage();
  },

  setStatusFilter(status) {
    this.statusFilter = status;
    this.renderListPage();
  },

  openStory(storyId) {
    this.stopSpeak();
    this.hideCharTooltip();
    this.currentStoryId = storyId;
    this.showPinyin = false;
    this.showTranslation = false;
    this.quizAnswers = {};
    this.quizSubmitted = false;
    this.renderDetailPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  backToList() {
    this.stopSpeak();
    this.hideCharTooltip();
    this.currentStoryId = null;
    this.renderListPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setSpeechRate(rate) {
    this.speechRate = parseFloat(rate) || 0.85;
    document.querySelectorAll('.cerita-speed-pill').forEach(btn => {
      const r = parseFloat(btn.getAttribute('data-rate'));
      btn.classList.toggle('active', Math.abs(r - this.speechRate) < 0.02);
    });
    if (typeof showToast === 'function') {
      showToast(`🔊 Kecepatan suara diatur ke ${this.speechRate}x`, 'info');
    }
  },

  togglePinyin() {
    this.showPinyin = !this.showPinyin;
    
    // Toggle ruby pinyin di atas Hanzi pada judul dan semua paragraf
    const titleEl = document.getElementById('cerita-story-title');
    if (titleEl) titleEl.classList.toggle('hide-pinyin', !this.showPinyin);

    document.querySelectorAll('.cerita-hanzi-text').forEach(el => {
      el.classList.toggle('hide-pinyin', !this.showPinyin);
    });
    document.querySelectorAll('.cerita-paragraph-block').forEach(el => {
      el.classList.toggle('hide-pinyin', !this.showPinyin);
    });

    const btn = document.getElementById('btn-toggle-pinyin');
    if (btn) {
      btn.classList.toggle('active', this.showPinyin);
      btn.innerHTML = this.showPinyin ? '🔤 Pinyin: Ditampilkan ✓' : '🔤 Tampilkan Pinyin';
    }

    // Perbarui tombol status per paragraf
    document.querySelectorAll('[id^="btn-para-pinyin-"]').forEach(btnPara => {
      btnPara.classList.toggle('active', this.showPinyin);
      btnPara.innerHTML = this.showPinyin ? '🔤 Tutup Pinyin' : '🔤 Pinyin';
    });

    this.updateBothBtnState();
  },

  toggleTranslation() {
    this.showTranslation = !this.showTranslation;
    const elements = document.querySelectorAll('.cerita-trans-line');
    elements.forEach(el => {
      el.style.display = this.showTranslation ? 'block' : 'none';
    });
    const btn = document.getElementById('btn-toggle-trans');
    if (btn) {
      btn.classList.toggle('active', this.showTranslation);
      btn.innerHTML = this.showTranslation ? '🌐 Terjemahan: Ditampilkan ✓' : '🌐 Tampilkan Terjemahan ID';
    }
    document.querySelectorAll('[id^="btn-para-trans-"]').forEach(btnPara => {
      btnPara.classList.toggle('active', this.showTranslation);
      btnPara.innerHTML = this.showTranslation ? '🌐 Tutup Arti' : '🌐 Terjemahan';
    });
    this.updateBothBtnState();
  },

  toggleBoth() {
    const shouldShow = !(this.showPinyin && this.showTranslation);
    this.showPinyin = shouldShow;
    this.showTranslation = shouldShow;

    const titleEl = document.getElementById('cerita-story-title');
    if (titleEl) titleEl.classList.toggle('hide-pinyin', !shouldShow);

    document.querySelectorAll('.cerita-hanzi-text').forEach(el => {
      el.classList.toggle('hide-pinyin', !shouldShow);
    });
    document.querySelectorAll('.cerita-paragraph-block').forEach(el => {
      el.classList.toggle('hide-pinyin', !shouldShow);
    });
    document.querySelectorAll('.cerita-trans-line').forEach(el => {
      el.style.display = shouldShow ? 'block' : 'none';
    });

    const btnPinyin = document.getElementById('btn-toggle-pinyin');
    if (btnPinyin) {
      btnPinyin.classList.toggle('active', shouldShow);
      btnPinyin.innerHTML = shouldShow ? '🔤 Pinyin: Ditampilkan ✓' : '🔤 Tampilkan Pinyin';
    }
    const btnTrans = document.getElementById('btn-toggle-trans');
    if (btnTrans) {
      btnTrans.classList.toggle('active', shouldShow);
      btnTrans.innerHTML = shouldShow ? '🌐 Terjemahan: Ditampilkan ✓' : '🌐 Tampilkan Terjemahan ID';
    }

    document.querySelectorAll('[id^="btn-para-pinyin-"]').forEach(btnPara => {
      btnPara.classList.toggle('active', shouldShow);
      btnPara.innerHTML = shouldShow ? '🔤 Tutup Pinyin' : '🔤 Pinyin';
    });
    document.querySelectorAll('[id^="btn-para-trans-"]').forEach(btnPara => {
      btnPara.classList.toggle('active', shouldShow);
      btnPara.innerHTML = shouldShow ? '🌐 Tutup Arti' : '🌐 Terjemahan';
    });

    this.updateBothBtnState();
  },

  updateBothBtnState() {
    const btnBoth = document.getElementById('btn-toggle-both');
    if (btnBoth) {
      const isBoth = this.showPinyin && this.showTranslation;
      btnBoth.classList.toggle('active', isBoth);
      btnBoth.innerHTML = isBoth ? '🙈 Sembunyikan Semua Bantuan' : '👁️ Tampilkan Pinyin & Terjemahan';
    }
  },

  toggleParagraphPinyin(idx) {
    const hanziEl = document.getElementById(`hanzi-para-${idx}`);
    const blockEl = document.getElementById(`para-block-${idx}`);
    if (!hanziEl) return;
    const isCurrentlyHidden = hanziEl.classList.contains('hide-pinyin');
    hanziEl.classList.toggle('hide-pinyin', !isCurrentlyHidden);
    if (blockEl) blockEl.classList.toggle('hide-pinyin', !isCurrentlyHidden);

    const btn = document.getElementById(`btn-para-pinyin-${idx}`);
    if (btn) {
      btn.classList.toggle('active', isCurrentlyHidden);
      btn.innerHTML = isCurrentlyHidden ? '🔤 Tutup Pinyin' : '🔤 Pinyin';
    }
  },

  toggleParagraphTrans(idx) {
    const el = document.getElementById(`trans-para-${idx}`);
    if (!el) return;
    const isVisible = (el.style.display === 'block');
    el.style.display = isVisible ? 'none' : 'block';
    const btn = document.getElementById(`btn-para-trans-${idx}`);
    if (btn) {
      btn.classList.toggle('active', !isVisible);
      btn.innerHTML = !isVisible ? '🌐 Tutup Arti' : '🌐 Terjemahan';
    }
  },

  // Fallback ruby generator if data doesn't have precomputed rubyHtml
  generateRubyFallback(cn, pinyin) {
    if (!cn) return '';
    if (!pinyin) return cn;
    return `<ruby class="cerita-ruby">${cn}<rt>${pinyin}</rt></ruby>`;
  },

  stopSpeak() {
    if (this.speakingTimer) {
      clearInterval(this.speakingTimer);
      this.speakingTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    document.querySelectorAll('.cerita-paragraph-speaking').forEach(el => el.classList.remove('cerita-paragraph-speaking'));
    document.querySelectorAll('.cerita-ruby-speaking').forEach(el => el.classList.remove('cerita-ruby-speaking'));
    const stopBtn = document.getElementById('btn-cerita-stop-audio');
    if (stopBtn) stopBtn.style.display = 'none';
  },

  speak(text, paraIdx = null) {
    this.stopSpeak();
    const rate = this.speechRate || 0.85;
    this.isSpeaking = true;

    const stopBtn = document.getElementById('btn-cerita-stop-audio');
    if (stopBtn) stopBtn.style.display = 'inline-flex';

    // Highlight active paragraph & progressive ruby karaoke
    let rubies = [];
    if (paraIdx !== null && paraIdx !== undefined) {
      const blockEl = document.getElementById(`para-block-${paraIdx}`);
      if (blockEl) {
        blockEl.classList.add('cerita-paragraph-speaking');
        rubies = Array.from(blockEl.querySelectorAll('ruby.cerita-ruby'));
      }
    }

    if (rubies.length > 0) {
      let idx = 0;
      const charIntervalMs = Math.max(140, Math.round(280 / rate));
      rubies[0].classList.add('cerita-ruby-speaking');
      this.speakingTimer = setInterval(() => {
        rubies.forEach(r => r.classList.remove('cerita-ruby-speaking'));
        idx++;
        if (idx < rubies.length) {
          rubies[idx].classList.add('cerita-ruby-speaking');
        } else {
          clearInterval(this.speakingTimer);
          this.speakingTimer = null;
        }
      }, charIntervalMs);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = rate;
      u.onend = () => {
        this.stopSpeak();
      };
      u.onerror = () => {
        this.stopSpeak();
      };
      window.speechSynthesis.speak(u);
    } else if (typeof speakMandarin === 'function') {
      speakMandarin(text, rate);
      setTimeout(() => this.stopSpeak(), Math.max(2000, text.length * 300));
    }
  },

  speakAllStory() {
    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    if (!story || !story.paragraphs.length) return;

    this.stopSpeak();
    let currentIdx = 0;
    const rate = this.speechRate || 0.85;

    const playNextParagraph = () => {
      if (currentIdx >= story.paragraphs.length) {
        this.stopSpeak();
        return;
      }
      const p = story.paragraphs[currentIdx];
      const blockEl = document.getElementById(`para-block-${currentIdx}`);
      document.querySelectorAll('.cerita-paragraph-speaking').forEach(el => el.classList.remove('cerita-paragraph-speaking'));
      document.querySelectorAll('.cerita-ruby-speaking').forEach(el => el.classList.remove('cerita-ruby-speaking'));

      let rubies = [];
      if (blockEl) {
        blockEl.classList.add('cerita-paragraph-speaking');
        blockEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        rubies = Array.from(blockEl.querySelectorAll('ruby.cerita-ruby'));
      }

      const stopBtn = document.getElementById('btn-cerita-stop-audio');
      if (stopBtn) stopBtn.style.display = 'inline-flex';

      if (rubies.length > 0) {
        let rIdx = 0;
        const charIntervalMs = Math.max(140, Math.round(280 / rate));
        if (this.speakingTimer) clearInterval(this.speakingTimer);
        rubies[0].classList.add('cerita-ruby-speaking');
        this.speakingTimer = setInterval(() => {
          rubies.forEach(r => r.classList.remove('cerita-ruby-speaking'));
          rIdx++;
          if (rIdx < rubies.length) {
            rubies[rIdx].classList.add('cerita-ruby-speaking');
          } else {
            clearInterval(this.speakingTimer);
            this.speakingTimer = null;
          }
        }, charIntervalMs);
      }

      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(p.cn);
        u.lang = 'zh-CN';
        u.rate = rate;
        u.onend = () => {
          currentIdx++;
          playNextParagraph();
        };
        u.onerror = () => {
          this.stopSpeak();
        };
        window.speechSynthesis.speak(u);
      }
    };

    playNextParagraph();
  },

  // =========================================================================
  // CLICK-TO-TRANSLATE TOOLTIP (KAMUS POP-UP SAAT KLIK KARAKTER HANZI)
  // =========================================================================
  bindGlobalTooltipEvents() {
    if (this._tooltipBound) return;
    this._tooltipBound = true;

    document.addEventListener('click', (e) => {
      const rubyEl = e.target.closest('ruby.cerita-ruby');
      const tooltipEl = document.getElementById('cerita-char-tooltip');

      if (rubyEl && document.getElementById('cerita-content-container')?.contains(rubyEl)) {
        e.stopPropagation();
        this.showCharTooltip(rubyEl);
        return;
      }

      if (tooltipEl && !tooltipEl.contains(e.target)) {
        this.hideCharTooltip();
      }
    });
  },

  lookupCharacterContext(charText, rubyEl) {
    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    const rtEl = rubyEl.querySelector('rt');
    const charPinyin = rtEl ? rtEl.textContent.trim() : '';

    // Gather sibling characters to form surrounding text context
    let matchedVocab = null;
    if (story && Array.isArray(story.vocabularies)) {
      matchedVocab = story.vocabularies.find(v => {
        const cleanHanzi = v.hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
        return cleanHanzi.includes(charText);
      });
    }

    // Also search in global flashcardData if available
    let matchedFlashcard = null;
    if (typeof flashcardData === 'object' && flashcardData) {
      for (let lvl = 1; lvl <= 6; lvl++) {
        const list = flashcardData[lvl] || [];
        const exact = list.find(c => c.hanzi === charText);
        if (exact) {
          matchedFlashcard = { ...exact, lvl };
          break;
        }
        if (!matchedFlashcard) {
          const partial = list.find(c => c.hanzi && c.hanzi.includes(charText));
          if (partial) matchedFlashcard = { ...partial, lvl };
        }
      }
    }

    return {
      char: charText,
      pinyin: charPinyin || (matchedFlashcard ? matchedFlashcard.pinyin : ''),
      vocabMatch: matchedVocab,
      fcMatch: matchedFlashcard,
      storyLevel: story ? story.level : 1
    };
  },

  showCharTooltip(rubyEl) {
    this.hideCharTooltip();

    // Extract base character text (without <rt>)
    const clone = rubyEl.cloneNode(true);
    clone.querySelectorAll('rt, rp').forEach(n => n.remove());
    const charText = clone.textContent.trim();
    if (!charText) return;

    const info = this.lookupCharacterContext(charText, rubyEl);
    rubyEl.classList.add('cerita-ruby-active');
    this._activeRuby = rubyEl;

    const primaryWord = info.vocabMatch
      ? info.vocabMatch.hanzi.replace(/\s*\(.*?\)\s*/g, '').trim()
      : (info.fcMatch ? info.fcMatch.hanzi : info.char);
    const primaryPinyin = info.vocabMatch
      ? info.vocabMatch.pinyin
      : (info.fcMatch ? info.fcMatch.pinyin : info.pinyin);
    const primaryMeaning = info.vocabMatch
      ? info.vocabMatch.meaning
      : (info.fcMatch ? info.fcMatch.meaning : 'Klik tombol suara untuk mendengar pelafalan atau simpan ke Flashcard.');

    const tooltip = document.createElement('div');
    tooltip.id = 'cerita-char-tooltip';
    tooltip.className = 'cerita-char-tooltip';
    tooltip.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 6px;">
        <div>
          <span style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; padding: 2px 7px; border-radius: 99px;">
            🔍 Kamus Cepat Karakter
          </span>
        </div>
        <button type="button" onclick="CeritaApp.hideCharTooltip()" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.95rem; line-height: 1; padding: 0;">✕</button>
      </div>

      <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px;">
        <span style="font-family: var(--font-chinese, serif); font-size: 1.9rem; font-weight: 900; color: #0f172a; line-height: 1.1;">
          ${info.char}
        </span>
        <span style="font-size: 1.05rem; font-weight: 800; color: #ea580c;">
          [${info.pinyin || primaryPinyin}]
        </span>
      </div>

      ${primaryWord !== info.char || info.vocabMatch || info.fcMatch ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; margin-bottom: 10px;">
          <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">
            ${info.vocabMatch ? '📌 Kosakata dalam Cerita:' : `📚 Kosakata HSK ${info.fcMatch ? info.fcMatch.lvl : info.storyLevel}:`}
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">
            ${primaryWord} <span style="color: #ea580c; font-weight: 700; font-size: 0.82rem;">(${primaryPinyin})</span>
          </div>
          <div style="font-size: 0.83rem; color: #059669; font-weight: 700; margin-top: 2px;">
            🇮🇩 ${primaryMeaning}
          </div>
        </div>
      ` : `
        <div style="font-size: 0.8rem; color: #475569; margin-bottom: 10px;">
          Karakter Hanzi: <strong>${info.char}</strong> (${info.pinyin})
        </div>
      `}

      <div style="display: flex; gap: 6px;">
        <button type="button" class="btn-speech-mini" style="flex: 1; justify-content: center; padding: 6px 10px;" onclick="CeritaApp.speak('${primaryWord.replace(/'/g, "\\'")}')">
          🔊 Dengar
        </button>
        <button type="button" class="btn-speech-mini" style="flex: 1.3; justify-content: center; padding: 6px 10px; background: #fff0f3; border-color: #fbcfe8; color: #e11d48;" onclick="CeritaApp.saveVocabToFlashcard('${primaryWord.replace(/'/g, "\\'")}', '${(primaryPinyin || '').replace(/'/g, "\\'")}', '${(primaryMeaning || '').replace(/'/g, "\\'")}', ${info.storyLevel})">
          ⭐ + Flashcard
        </button>
      </div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip near the clicked ruby character
    const rect = rubyEl.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX - (ttRect.width / 2) + (rect.width / 2);

    if (left < 12) left = 12;
    if (left + ttRect.width > window.innerWidth - 12) {
      left = window.innerWidth - ttRect.width - 12;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  },

  hideCharTooltip() {
    const existing = document.getElementById('cerita-char-tooltip');
    if (existing) existing.remove();
    if (this._activeRuby) {
      this._activeRuby.classList.remove('cerita-ruby-active');
      this._activeRuby = null;
    }
  },

  saveVocabToFlashcard(hanzi, pinyin, meaning, level = 1) {
    if (window.MandarinkuExtras && typeof window.MandarinkuExtras.addBookmarkWord === 'function') {
      window.MandarinkuExtras.addBookmarkWord({ hanzi, pinyin, meaning, lvl: level });
    } else {
      // Fallback direct push to flashcardData
      const cleanHanzi = hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
      if (typeof flashcardData === 'object' && flashcardData[level]) {
        const exists = flashcardData[level].some(c => c.hanzi === cleanHanzi);
        if (!exists) {
          flashcardData[level].unshift({
            hanzi: cleanHanzi,
            pinyin: pinyin,
            meaning: meaning,
            meaning_en: meaning,
            example: cleanHanzi,
            exampleTrans: meaning,
            exampleTrans_en: meaning
          });
        }
      }
      if (typeof showToast === 'function') {
        showToast(`⭐ "${cleanHanzi}" disimpan ke Flashcard HSK ${level}!`, 'success');
      }
    }
    this.hideCharTooltip();
    // Refresh vocab buttons if on vocab tab
    document.querySelectorAll(`[data-vocab-hanzi="${hanzi}"]`).forEach(btn => {
      btn.innerHTML = '✅ Tersimpan';
      btn.style.background = '#ecfdf5';
      btn.style.color = '#059669';
      btn.style.borderColor = '#a7f3d0';
    });
  },

  saveAllStoryVocab() {
    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    if (!story || !Array.isArray(story.vocabularies)) return;

    story.vocabularies.forEach(v => {
      this.saveVocabToFlashcard(v.hanzi, v.pinyin, v.meaning, story.level);
    });
    if (typeof showToast === 'function') {
      showToast(`🎉 Seluruh ${story.vocabularies.length} kosakata cerita berhasil disimpan ke Flashcard Favorit!`, 'success');
    }
  },

  renderListPage() {
    const container = document.getElementById('cerita-content-container');
    if (!container) return;

    const data = window.MandarinkuCeritaData || [];
    const progressMap = this.getProgressMap();

    let filtered = (this.activeLevel === 'all') 
      ? data 
      : data.filter(s => s.level === parseInt(this.activeLevel));

    if (this.statusFilter === 'read') {
      filtered = filtered.filter(s => progressMap[s.id] && progressMap[s.id].read);
    } else if (this.statusFilter === 'unread') {
      filtered = filtered.filter(s => !progressMap[s.id] || !progressMap[s.id].read);
    }

    const totalStories = data.length;
    const readCount = data.filter(s => progressMap[s.id] && progressMap[s.id].read).length;
    const readPercent = totalStories > 0 ? Math.round((readCount / totalStories) * 100) : 0;

    let html = `
      <!-- Progress Bar Membaca Cerita HSK 1-6 -->
      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-radius: 16px; padding: 16px 22px; margin-bottom: 16px; border: 1.5px solid #fed7aa; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ffedd5; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800;">
            📚
          </div>
          <div>
            <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a;">
              Progres Literasi Cerita HSK Anda: <span style="color: #ea580c;">${readCount} / ${totalStories} Cerita Selesai (${readPercent}%)</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              💡 Klik karakter Hanzi apa saja di dalam cerita untuk membuka <strong>Kamus Pop-up</strong> & menyimpan kosakata ke Flashcard!
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="cerita-filter-pill ${this.statusFilter === 'all' ? 'active' : ''}" onclick="CeritaApp.setStatusFilter('all')" style="font-size: 0.76rem; padding: 5px 12px;">
            📖 Semua (${totalStories})
          </button>
          <button class="cerita-filter-pill ${this.statusFilter === 'read' ? 'active' : ''}" onclick="CeritaApp.setStatusFilter('read')" style="font-size: 0.76rem; padding: 5px 12px;">
            ✅ Selesai Dibaca (${readCount})
          </button>
          <button class="cerita-filter-pill ${this.statusFilter === 'unread' ? 'active' : ''}" onclick="CeritaApp.setStatusFilter('unread')" style="font-size: 0.76rem; padding: 5px 12px;">
            📌 Belum Dibaca (${totalStories - readCount})
          </button>
        </div>
      </div>

      <!-- Toolbar Filter Level HSK -->
      <div style="background: #ffffff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-weight: 800; font-size: 0.86rem; color: #475569; display: flex; align-items: center; gap: 6px;">
            <span>🎯</span> Pilih Tingkatan:
          </span>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="cerita-filter-pill ${this.activeLevel === 'all' ? 'active' : ''}" onclick="CeritaApp.setLevelFilter('all')">
              Semua Level (HSK 1-6)
            </button>
            ${[1, 2, 3, 4, 5, 6].map(lvl => `
              <button class="cerita-filter-pill ${this.activeLevel == lvl ? 'active' : ''}" onclick="CeritaApp.setLevelFilter(${lvl})">
                HSK ${lvl}
              </button>
            `).join('')}
          </div>
        </div>
        <div style="font-size: 0.82rem; color: #64748b; font-weight: 700;">
          Menampilkan <span style="color: #ea580c; font-weight: 800;">${filtered.length}</span> Cerita Panjang Terpilih
        </div>
      </div>

      <!-- Grid Daftar Cerita -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
        ${filtered.map(story => {
          const stProg = progressMap[story.id] || {};
          const isRead = !!stProg.read;
          const bestScore = stProg.quizScore;
          return `
          <div class="cerita-card" onclick="CeritaApp.openStory('${story.id}')" style="background: #ffffff; border-radius: 18px; border: 1.5px solid ${isRead ? '#6ee7b7' : '#f1f5f9'}; padding: 22px; box-shadow: 0 6px 18px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.25s ease; cursor: pointer; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: ${isRead ? '#10b981' : story.badgeColor};"></div>
            
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="background: ${story.badgeBg}; color: ${story.badgeColor}; font-weight: 800; font-size: 0.76rem; padding: 4px 10px; border-radius: 9999px; border: 1px solid ${story.badgeColor}33;">
                    ${story.levelName}
                  </span>
                  ${isRead ? `
                    <span style="background: #ecfdf5; color: #059669; font-weight: 800; font-size: 0.72rem; padding: 3px 9px; border-radius: 9999px; border: 1px solid #6ee7b7;">
                      ✅ Selesai
                    </span>
                  ` : ''}
                  ${bestScore !== undefined && bestScore !== null ? `
                    <span style="background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.72rem; padding: 3px 9px; border-radius: 9999px; border: 1px solid #fde68a;">
                      🏆 Kuis: ${bestScore}
                    </span>
                  ` : ''}
                </div>
                <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  ⏱️ ±${story.estimatedMinutes} menit
                </span>
              </div>

              <div style="font-size: 0.76rem; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                ${story.theme}
              </div>

              <h3 style="font-family: var(--font-chinese, 'Noto Serif SC', serif); font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
                ${story.titleCn}
              </h3>
              <div style="font-size: 0.82rem; color: #64748b; font-style: italic; margin-bottom: 6px;">
                ${story.titlePinyin}
              </div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #334155; margin-bottom: 12px; line-height: 1.35;">
                ${story.titleId}
              </h4>

              <p style="font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 16px;">
                ${story.summary}
              </p>
            </div>

            <div>
              <div style="border-top: 1px dashed #e2e8f0; padding-top: 14px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; gap: 12px; font-size: 0.78rem; color: #64748b; font-weight: 700;">
                  <span>📝 ${story.paragraphs.length} Paragraf</span>
                  <span>📐 ${story.grammarNotes.length} Tata Bahasa</span>
                  <span>❓ ${story.questions.length} Kuis</span>
                </div>
                <button class="btn-primary-sakura" style="padding: 7px 16px; font-size: 0.82rem; margin: 0; background: linear-gradient(135deg, ${story.badgeColor}, #0f172a);" onclick="event.stopPropagation(); CeritaApp.openStory('${story.id}')">
                  ${isRead ? 'Baca Ulang →' : 'Baca & Uji Pemahaman →'}
                </button>
              </div>
            </div>
          </div>
        `}).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  renderDetailPage() {
    const container = document.getElementById('cerita-content-container');
    if (!container) return;

    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    if (!story) {
      this.backToList();
      return;
    }

    const progressMap = this.getProgressMap();
    const stProg = progressMap[story.id] || {};
    const isRead = !!stProg.read;

    let html = `
      <!-- Tombol Kembali & Breadcrumb Nav -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-learn-outline" style="padding: 8px 18px; font-size: 0.85rem; margin: 0; display: inline-flex; align-items: center; gap: 8px;" onclick="CeritaApp.backToList()">
            ← Kembali ke Kumpulan Cerita
          </button>
          <button id="btn-mark-story-read" class="cerita-control-btn ${isRead ? 'active' : ''}" style="background: ${isRead ? '#ecfdf5' : '#ffffff'}; color: ${isRead ? '#059669' : '#475569'}; border-color: ${isRead ? '#6ee7b7' : '#cbd5e1'};" onclick="CeritaApp.toggleReadStatus('${story.id}')">
            ${isRead ? '✅ Selesai Dibaca' : '☑️ Tandai Selesai Dibaca'}
          </button>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button id="btn-toggle-pinyin" class="cerita-control-btn ${this.showPinyin ? 'active' : ''}" onclick="CeritaApp.togglePinyin()">
            🔤 ${this.showPinyin ? 'Pinyin: Ditampilkan ✓' : 'Tampilkan Pinyin'}
          </button>
          <button id="btn-toggle-trans" class="cerita-control-btn ${this.showTranslation ? 'active' : ''}" onclick="CeritaApp.toggleTranslation()">
            🌐 ${this.showTranslation ? 'Terjemahan: Ditampilkan ✓' : 'Tampilkan Terjemahan ID'}
          </button>
          <button id="btn-toggle-both" class="cerita-control-btn ${this.showPinyin && this.showTranslation ? 'active' : ''}" onclick="CeritaApp.toggleBoth()">
            👁️ ${this.showPinyin && this.showTranslation ? 'Sembunyikan Semua Bantuan' : 'Tampilkan Pinyin & Terjemahan'}
          </button>
        </div>
      </div>

      <!-- Header Judul Cerita -->
      <div style="background: linear-gradient(135deg, #ffffff 0%, #fffbf0 100%); border: 1.5px solid #fed7aa; border-radius: 20px; padding: 26px 30px; box-shadow: 0 6px 24px rgba(217, 119, 6, 0.08); margin-bottom: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <span style="background: ${story.badgeBg}; color: ${story.badgeColor}; font-weight: 800; font-size: 0.8rem; padding: 5px 14px; border-radius: 9999px; border: 1px solid ${story.badgeColor}40;">
              ${story.levelName}
            </span>
            <span style="background: #f8fafc; color: #475569; font-weight: 700; font-size: 0.8rem; padding: 5px 12px; border-radius: 9999px; border: 1px solid #e2e8f0;">
              Tema: ${story.theme}
            </span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button class="btn-primary-sakura" style="padding: 7px 18px; font-size: 0.82rem; margin: 0; background: #ea580c; display: flex; align-items: center; gap: 6px;" onclick="CeritaApp.speak('${story.titleCn.replace(/'/g, "\\'")}')">
              🔊 Dengar Judul
            </button>
          </div>
        </div>

        <h1 id="cerita-story-title" class="cerita-story-title-ruby ${this.showPinyin ? '' : 'hide-pinyin'}" title="Klik karakter Hanzi untuk membuka kamus pop-up">
          ${story.titleRubyHtml || CeritaApp.generateRubyFallback(story.titleCn, story.titlePinyin)}
        </h1>
        <div class="cerita-trans-line" style="display: ${this.showTranslation ? 'block' : 'none'}; font-size: 1.15rem; font-weight: 700; color: #334155; margin-bottom: 14px;">
          ${story.titleId}
        </div>
        <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.5; border-top: 1px solid #fed7aa66; padding-top: 12px;">
          💡 <strong>Ringkasan Cerita:</strong> ${story.summary}
        </p>
      </div>

      <!-- Navigasi Tab Bagian Pembelajaran Cerita -->
      <div class="cerita-nav-tabs">
        <button class="cerita-tab-item active" onclick="CeritaApp.switchTab('teks', this)">
          📖 Teks Cerita Mandarin
        </button>
        <button class="cerita-tab-item" onclick="CeritaApp.switchTab('grammar', this)">
          📐 Analisis Tata Bahasa (${story.grammarNotes.length})
        </button>
        <button class="cerita-tab-item" onclick="CeritaApp.switchTab('vocab', this)">
          🗂️ Kosakata Kunci (${story.vocabularies.length})
        </button>
        <button class="cerita-tab-item" onclick="CeritaApp.switchTab('quiz', this)">
          🎯 Kuis Pemahaman (${story.questions.length} Soal)
        </button>
      </div>

      <!-- KONTEN TAB 1: TEKS CERITA LENGKAP -->
      <div id="tab-cerita-teks" class="cerita-tab-content active" style="margin-top: 20px;">
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 32px 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <!-- Toolbar Atas Naskah Cerita + Kontrol Kecepatan Suara -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem;">📖</span>
              <div>
                <div style="font-size: 0.92rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">
                  Naskah Cerita Utuh (完整阅读文章)
                </div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
                  💡 <strong>Tips Interaktif:</strong> Klik <strong>satu karakter Hanzi</strong> mana saja untuk melihat Pinyin & arti katanya secara instan tanpa membuka seluruh Pinyin!
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <!-- Kontrol Kecepatan Suara -->
              <div style="display: inline-flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 3px;">
                <span style="font-size: 0.72rem; font-weight: 800; color: #64748b; padding: 0 8px;">Kecepatan:</span>
                ${[
                  { r: 0.5, label: '🐢 0.5x' },
                  { r: 0.85, label: '🚶 0.85x' },
                  { r: 1.0, label: '🏃 1.0x' },
                  { r: 1.25, label: '⚡ 1.25x' }
                ].map(sp => `
                  <button type="button" data-rate="${sp.r}" class="cerita-speed-pill ${Math.abs(this.speechRate - sp.r) < 0.02 ? 'active' : ''}" onclick="CeritaApp.setSpeechRate(${sp.r})" style="border: none; background: ${Math.abs(this.speechRate - sp.r) < 0.02 ? '#ea580c' : 'transparent'}; color: ${Math.abs(this.speechRate - sp.r) < 0.02 ? '#fff' : '#475569'}; font-size: 0.72rem; font-weight: 800; padding: 4px 9px; border-radius: 999px; cursor: pointer; transition: all 0.15s;">
                    ${sp.label}
                  </button>
                `).join('')}
              </div>

              <button id="btn-cerita-stop-audio" type="button" class="btn-learn-outline" style="display: none; padding: 7px 14px; font-size: 0.8rem; margin: 0; border-color: #ef4444; color: #dc2626; background: #fef2f2; align-items: center; gap: 5px;" onclick="CeritaApp.stopSpeak()">
                ⏹️ Hentikan Audio
              </button>

              <button class="btn-primary-sakura" style="padding: 8px 18px; font-size: 0.82rem; margin: 0; background: linear-gradient(135deg, #ea580c, #c2410c); display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.25);" onclick="CeritaApp.speakAllStory()">
                🔊 Dengarkan Seluruh Cerita (Read-Along)
              </button>
            </div>
          </div>

          <!-- Satu Bagian Artikel Cerita Utuh yang Mengalir dengan Format Paragraf -->
          <article class="cerita-full-article" style="background: #fffdfa; border: 1px solid #fef3c7; border-radius: 16px; padding: 28px 30px;">
            <div style="display: flex; flex-direction: column; gap: 24px;">
              ${story.paragraphs.map((p, idx) => `
                <div id="para-block-${idx}" class="cerita-paragraph-block ${this.showPinyin ? '' : 'hide-pinyin'}" style="border-bottom: ${idx < story.paragraphs.length - 1 ? '1px dashed #f1f5f9' : 'none'}; padding-bottom: ${idx < story.paragraphs.length - 1 ? '22px' : '0'};">
                  <!-- Hanzi dengan Pinyin di atas karakter (Ruby) & toggle per paragraf -->
                  <div style="display: flex; flex-direction: column-reverse; align-items: stretch; gap: 8px; margin-bottom: 10px;">
                    <p id="hanzi-para-${idx}" class="cerita-hanzi-text ${this.showPinyin ? '' : 'hide-pinyin'}" style="flex: 1;">
                      ${p.rubyHtml || CeritaApp.generateRubyFallback(p.cn, p.pinyin)}
                    </p>
                    <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0; margin-top: 4px; flex-wrap: wrap; justify-content: flex-end;">
                      <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; margin-right: auto;">Paragraf ${idx + 1}</span>
                      <button class="btn-speech-mini" onclick="CeritaApp.speak('${p.cn.replace(/'/g, "\\'")}', ${idx})" title="Dengarkan pelafalan paragraf ini dengan sorotan kata">
                        🔊 Audio Read-Along
                      </button>
                      <button id="btn-para-pinyin-${idx}" class="cerita-control-btn ${this.showPinyin ? 'active' : ''}" onclick="CeritaApp.toggleParagraphPinyin(${idx})" style="font-size: 0.72rem; padding: 3px 8px; border-radius: 6px;" title="Tampilkan / Sembunyikan Pinyin di atas karakter paragraf ini">
                        🔤 ${this.showPinyin ? 'Tutup Pinyin' : 'Pinyin'}
                      </button>
                      <button id="btn-para-trans-${idx}" class="cerita-control-btn ${this.showTranslation ? 'active' : ''}" onclick="CeritaApp.toggleParagraphTrans(${idx})" style="font-size: 0.72rem; padding: 3px 8px; border-radius: 6px;" title="Lihat terjemahan paragraf ini">
                        🌐 ${this.showTranslation ? 'Tutup Arti' : 'Terjemahan'}
                      </button>
                    </div>
                  </div>

                  <!-- Terjemahan Bahasa Indonesia (Tersembunyi secara default) -->
                  <div id="trans-para-${idx}" class="cerita-trans-line" style="display: ${this.showTranslation ? 'block' : 'none'}; font-size: 0.88rem; color: #1e40af; line-height: 1.65; margin: 0 0 0 2em; background: #eff6ff; padding: 6px 14px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; font-weight: 800; color: #1d4ed8; display: block; margin-bottom: 2px;">Arti Bahasa Indonesia:</span>
                    ${p.id}
                  </div>
                </div>
              `).join('')}
            </div>
          </article>
        </div>
      </div>

      <!-- KONTEN TAB 2: ANALISIS TATA BAHASA (GRAMMAR) -->
      <div id="tab-cerita-grammar" class="cerita-tab-content" style="display: none; margin-top: 20px;">
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
            <div style="font-size: 1.4rem;">📐</div>
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">
                Kaidah & Tata Bahasa Mandarin Sesuai Cerita
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0 0;">
                Penjelasan mendalam rumus tata bahasa HSK tingkat ${story.level} yang langsung diterapkan dalam bacaan di atas.
              </p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${story.grammarNotes.map((g, idx) => `
              <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 22px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <span style="background: #3b82f6; color: #ffffff; width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">
                    ${idx + 1}
                  </span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a; margin: 0;">
                    ${g.title}
                  </h4>
                </div>

                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px;">
                  <div style="font-size: 0.75rem; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">
                    Rumus / Pola Kalimat:
                  </div>
                  <div style="font-size: 0.92rem; font-weight: 800; color: #1e293b; font-family: monospace; margin-top: 2px;">
                    ${g.formula}
                  </div>
                </div>

                <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 12px;">
                  ${g.explanation}
                </p>

                <div style="background: #fff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <div>
                    <div style="font-size: 0.74rem; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 4px;">
                      Contoh Penerapan dalam Cerita:
                    </div>
                    <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a; font-family: var(--font-chinese, serif);">
                      ${g.exampleInStory}
                    </div>
                  </div>
                  <button type="button" class="btn-speech-mini" onclick="CeritaApp.speak('${g.exampleInStory.replace(/'/g, "\\'")}')">
                    🔊 Dengar Contoh
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- KONTEN TAB 3: KOSAKATA KUNCI (VOCABULARY) -->
      <div id="tab-cerita-vocab" class="cerita-tab-content" style="display: none; margin-top: 20px;">
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="font-size: 1.4rem;">🗂️</div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">
                  Daftar Kosakata Inti Cerita (生词表)
                </h3>
                <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0 0;">
                  Kuasai kata-kata kunci pilihan dari cerita dan simpan ke dek Flashcard Anda untuk latihan berulang.
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn-learn-outline" style="padding: 7px 14px; font-size: 0.8rem; margin: 0;" onclick="if(window.MandarinkuExtras) MandarinkuExtras.printHanziSheet('${story.vocabularies.map(v => v.hanzi.replace(/\s*\(.*?\)\s*/g, '')).join('')}', '${story.titleId.replace(/'/g, "\\'")}')">
                🖨️ Cetak Kotak Latihan Menulis (PDF)
              </button>
              <button type="button" class="btn-primary-sakura" style="padding: 7px 16px; font-size: 0.8rem; margin: 0;" onclick="CeritaApp.saveAllStoryVocab()">
                ⭐ Simpan Semua ke Flashcard
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;">
            ${story.vocabularies.map(v => {
              const isSaved = window.MandarinkuExtras && window.MandarinkuExtras.isBookmarked(v.hanzi);
              return `
              <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
                    <span style="font-family: var(--font-chinese, serif); font-size: 1.45rem; font-weight: 800; color: #0f172a;">
                      ${v.hanzi}
                    </span>
                    <span style="font-size: 0.85rem; font-weight: 700; color: #ea580c;">
                      ${v.pinyin}
                    </span>
                  </div>
                  <div style="font-size: 0.82rem; color: #475569; margin-top: 2px; font-weight: 600;">
                    ${v.meaning}
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px; flex-shrink: 0;">
                  <button class="btn-speech-mini" onclick="CeritaApp.speak('${v.hanzi.replace(/'/g, "\\'")}')" title="Lafalkan kata ini">
                    🔊 Suara
                  </button>
                  <button class="btn-speech-mini" data-vocab-hanzi="${v.hanzi}" style="${isSaved ? 'background:#ecfdf5;color:#059669;border-color:#a7f3d0;' : 'background:#fff0f3;color:#e11d48;border-color:#fbcfe8;'}" onclick="CeritaApp.saveVocabToFlashcard('${v.hanzi.replace(/'/g, "\\'")}', '${v.pinyin.replace(/'/g, "\\'")}', '${v.meaning.replace(/'/g, "\\'")}', ${story.level})">
                    ${isSaved ? '✅ Tersimpan' : '⭐ Simpan'}
                  </button>
                </div>
              </div>
            `}).join('')}
          </div>
        </div>
      </div>

      <!-- KONTEN TAB 4: KUIS PEMAHAMAN BACAAN INTERAKTIF -->
      <div id="tab-cerita-quiz" class="cerita-tab-content" style="display: none; margin-top: 20px;">
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">
                🎯 Kuis Pemahaman Cerita Interaktif (阅读理解测验)
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0 0;">
                Jawab pertanyaan berikut berdasarkan isi cerita untuk menguji pemahaman membaca Anda!
              </p>
            </div>
            <div id="quiz-score-badge" style="display: none;"></div>
          </div>

          <form id="cerita-quiz-form" onsubmit="event.preventDefault(); CeritaApp.submitQuiz();">
            <div style="display: flex; flex-direction: column; gap: 24px;">
              ${story.questions.map((q, qIdx) => `
                <div class="cerita-quiz-item" id="quiz-card-${qIdx}" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px;">
                  <div style="font-weight: 800; font-size: 0.96rem; color: #1e293b; margin-bottom: 14px; line-height: 1.45; display: flex; gap: 10px;">
                    <span style="background: #ea580c; color: #fff; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.78rem; flex-shrink: 0;">
                      ${qIdx + 1}
                    </span>
                    <span>${q.question}</span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${q.options.map((opt, optIdx) => `
                      <label class="cerita-option-label" id="opt-label-${qIdx}-${optIdx}" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="question_${qIdx}" value="${optIdx}" onchange="CeritaApp.selectOption(${qIdx}, ${optIdx})" style="accent-color: #ea580c; width: 17px; height: 17px;">
                        <span style="font-size: 0.88rem; font-weight: 600; color: #334155;">${opt}</span>
                      </label>
                    `).join('')}
                  </div>

                  <!-- Wadah Pembahasan Soal -->
                  <div id="quiz-feedback-${qIdx}" style="display: none; margin-top: 14px; padding: 12px 16px; border-radius: 10px; font-size: 0.84rem; line-height: 1.5;"></div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 26px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
              <button type="button" class="btn-learn-outline" style="padding: 10px 22px; font-size: 0.88rem;" onclick="CeritaApp.resetQuiz()">
                🔄 Ulangi Kuis
              </button>
              <button type="submit" id="btn-submit-cerita-quiz" class="btn-primary-sakura" style="padding: 10px 28px; font-size: 0.88rem; margin: 0; background: linear-gradient(135deg, #ea580c, #c2410c);">
                ✅ Kumpulkan Jawaban
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.bindGlobalTooltipEvents();
  },

  switchTab(tabName, btnElem) {
    this.hideCharTooltip();
    document.querySelectorAll('.cerita-tab-content').forEach(el => {
      el.style.display = 'none';
      el.classList.remove('active');
    });
    document.querySelectorAll('.cerita-tab-item').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(`tab-cerita-${tabName}`);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active');
    }
    if (btnElem) {
      btnElem.classList.add('active');
    }
  },

  selectOption(qIdx, optIdx) {
    this.quizAnswers[qIdx] = optIdx;
  },

  submitQuiz() {
    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    if (!story) return;

    let correctCount = 0;
    const total = story.questions.length;

    story.questions.forEach((q, idx) => {
      const userAns = this.quizAnswers[idx];
      const feedbackEl = document.getElementById(`quiz-feedback-${idx}`);
      const isCorrect = userAns !== undefined && userAns === q.answer;

      if (isCorrect) correctCount++;

      // Tandai label opsi
      q.options.forEach((_, optIdx) => {
        const lbl = document.getElementById(`opt-label-${idx}-${optIdx}`);
        if (!lbl) return;
        lbl.style.borderColor = '#cbd5e1';
        lbl.style.background = '#ffffff';

        if (optIdx === q.answer) {
          lbl.style.borderColor = '#10b981';
          lbl.style.background = '#ecfdf5';
        } else if (userAns === optIdx && !isCorrect) {
          lbl.style.borderColor = '#ef4444';
          lbl.style.background = '#fef2f2';
        }
      });

      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        if (isCorrect) {
          feedbackEl.style.background = '#ecfdf5';
          feedbackEl.style.border = '1px solid #a7f3d0';
          feedbackEl.style.color = '#065f46';
          feedbackEl.innerHTML = `<strong>✅ Benar!</strong> ${q.explanation}`;
        } else {
          feedbackEl.style.background = '#fef2f2';
          feedbackEl.style.border = '1px solid #fecaca';
          feedbackEl.style.color = '#991b1b';
          feedbackEl.innerHTML = `<strong>❌ Kurang tepat.</strong> Jawaban benar: <em>${q.options[q.answer]}</em>.<br><span style="margin-top: 4px; display: block;">💡 <strong>Penjelasan:</strong> ${q.explanation}</span>`;
        }
      }
    });

    const score = Math.round((correctCount / total) * 100);
    const scoreBadge = document.getElementById('quiz-score-badge');
    if (scoreBadge) {
      scoreBadge.style.display = 'block';
      scoreBadge.innerHTML = `
        <span style="background: ${score >= 75 ? '#ecfdf5' : '#fef2f2'}; color: ${score >= 75 ? '#059669' : '#dc2626'}; border: 1.5px solid ${score >= 75 ? '#a7f3d0' : '#fecaca'}; padding: 6px 14px; border-radius: 9999px; font-weight: 800; font-size: 0.88rem;">
          Skor Pemahaman: ${score} / 100 (${correctCount}/${total} Benar)
        </span>
      `;
    }

    // Simpan progres baca & skor kuis tertinggi ke localStorage
    const prevMap = this.getProgressMap();
    const prevScore = (prevMap[story.id] && prevMap[story.id].quizScore) || 0;
    this.saveStoryProgress(story.id, {
      read: true,
      quizScore: Math.max(prevScore, score)
    });

    const btnRead = document.getElementById('btn-mark-story-read');
    if (btnRead) {
      btnRead.classList.add('active');
      btnRead.style.background = '#ecfdf5';
      btnRead.style.color = '#059669';
      btnRead.style.borderColor = '#6ee7b7';
      btnRead.innerHTML = '✅ Selesai Dibaca';
    }

    if (typeof showToast === 'function') {
      showToast(score >= 75 ? `🎉 Luar biasa! Skor Pemahaman Cerita: ${score} (Tersimpan)` : `💡 Selesai! Skor Anda: ${score}. Pelajari pembahasan di bawah.`, score >= 75 ? 'success' : 'info');
    }

    this.quizSubmitted = true;
  },

  resetQuiz() {
    this.quizAnswers = {};
    this.quizSubmitted = false;
    const form = document.getElementById('cerita-quiz-form');
    if (form) form.reset();

    const data = window.MandarinkuCeritaData || [];
    const story = data.find(s => s.id === this.currentStoryId);
    if (!story) return;

    story.questions.forEach((q, idx) => {
      const feedbackEl = document.getElementById(`quiz-feedback-${idx}`);
      if (feedbackEl) {
        feedbackEl.style.display = 'none';
        feedbackEl.innerHTML = '';
      }
      q.options.forEach((_, optIdx) => {
        const lbl = document.getElementById(`opt-label-${idx}-${optIdx}`);
        if (lbl) {
          lbl.style.borderColor = '#cbd5e1';
          lbl.style.background = '#ffffff';
        }
      });
    });

    const scoreBadge = document.getElementById('quiz-score-badge');
    if (scoreBadge) scoreBadge.style.display = 'none';
  }
};

// Global Helper untuk memanggil render cerita dari router
function renderCeritaPage() {
  if (window.CeritaApp) {
    window.CeritaApp.bindGlobalTooltipEvents();
    if (!window.CeritaApp.currentStoryId) {
      window.CeritaApp.renderListPage();
    }
  }
}
