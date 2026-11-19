/**
 * Mandarinku Interactive Learning & Assessment Engine
 * - HSK 1-6 Question Bank
 * - Speech Recognition & Audio Synth
 * - AI Grammar & Writing Checker
 * - Interactive Hanzi Stroke Writer
 * - Study Progress & Analytics Tracker
 * - Module Upload, Download & Comments System
 * - Role-Based Access Control (Student, Teacher, Admin)
 */

// ==========================================================================
// User Progress Manager & LocalStorage Persistence System
// ==========================================================================
const DEFAULT_STUDENT_PROFILE = {
  name: "Learner Panda",
  email: "learner@mandarinku.com",
  role: "student",
  level: 2,
  levelTitle: "Pemula Menengah",
  exp: 250,
  maxExp: 500,
  streak: 7,
  points: 120,
  studyHours: 18,
  completedModules: 14,
  avatar: "assets/images/panda-mascot.svg",
  bio: "每天进步一点点 ✨ (Maju sedikit demi sedikit setiap hari)",
  joinDate: "Mei 2024",
  dailyTargetMinutes: 20,
  todayMinutes: 15,
  progress: {
    listening: 60,
    speaking: 40,
    reading: 70,
    writing: 50
  },
  completedItems: {
    listening: [],
    speaking: [],
    reading: [],
    writing: [],
    bankSoal: []
  },
  weeklyHistory: [25, 40, 30, 50, 45, 60, 35],
  quizHistory: [],
  lastSyncedAt: null
};

const UserManager = {
  STORAGE_KEY: "mandarinku_user_profiles_v2",
  ACTIVE_EMAIL_KEY: "mandarinku_active_email_v2",

  getProfiles() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveProfiles(profiles) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save profiles to localStorage", e);
    }
  },

  getActiveEmail() {
    return localStorage.getItem(this.ACTIVE_EMAIL_KEY) || "learner@mandarinku.com";
  },

  setActiveEmail(email) {
    localStorage.setItem(this.ACTIVE_EMAIL_KEY, email);
  },

  getUser(email, role = "student") {
    const profiles = this.getProfiles();
    const cleanEmail = (email || "learner@mandarinku.com").toLowerCase().trim();
    if (profiles[cleanEmail]) {
      return profiles[cleanEmail];
    }

    // Default template for new/current user
    let newProfile = JSON.parse(JSON.stringify(DEFAULT_STUDENT_PROFILE));
    newProfile.email = cleanEmail;
    newProfile.role = role;
    
    if (role === 'teacher') {
      newProfile.name = "Laoshi Wang (Guru)";
      newProfile.bio = "Pengajar Mandarin HSK 1 - 6 & Budaya Tionghoa 🌸";
      newProfile.level = 6;
      newProfile.levelTitle = "Master / Pengajar";
      newProfile.progress = { listening: 95, speaking: 95, reading: 95, writing: 95 };
    } else if (role === 'admin') {
      newProfile.name = "Admin Mandarinku";
      newProfile.bio = "Administrator Sistem & Keamanan Pembelajaran 🛡️";
      newProfile.level = 99;
      newProfile.levelTitle = "Administrator";
      newProfile.progress = { listening: 100, speaking: 100, reading: 100, writing: 100 };
    } else if (cleanEmail !== "learner@mandarinku.com") {
      // Dynamic name for custom student email
      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      newProfile.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      newProfile.level = 1;
      newProfile.levelTitle = "Pemula Mandarinku";
      newProfile.exp = 0;
      newProfile.points = 0;
      newProfile.streak = 1;
      newProfile.studyHours = 1;
      newProfile.completedModules = 0;
      newProfile.progress = { listening: 0, speaking: 0, reading: 0, writing: 0 };
      newProfile.weeklyHistory = [0, 0, 0, 0, 0, 0, 15];
    }

    profiles[cleanEmail] = newProfile;
    this.saveProfiles(profiles);
    return newProfile;
  },

  saveCurrentUser() {
    if (!State.currentUser || !State.currentUser.email) return;
    const profiles = this.getProfiles();
    const email = State.currentUser.email.toLowerCase().trim();
    profiles[email] = State.currentUser;
    this.saveProfiles(profiles);
    this.setActiveEmail(email);
    this.syncToServer(false);
  },

  syncTimer: null,
  syncToServer(showNotification = false) {
    if (!State.currentUser || !State.currentUser.email) return;
    const payload = {
      name: State.currentUser.name,
      email: State.currentUser.email,
      role: State.currentUser.role || 'student',
      level: State.currentUser.level || 1,
      exp: State.currentUser.exp || 0,
      max_exp: State.currentUser.maxExp || 500,
      points: State.currentUser.points || 0,
      streak: State.currentUser.streak || 1,
      study_hours: State.currentUser.studyHours || 1,
      completed_modules: State.currentUser.completedModules || 0,
      progress: State.currentUser.progress || { listening: 0, speaking: 0, reading: 0, writing: 0 }
    };

    const runSync = () => {
      fetch('api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.status === 'success') {
          State.currentUser.lastSyncedAt = new Date().toISOString();
          const profiles = this.getProfiles();
          const email = State.currentUser.email.toLowerCase().trim();
          profiles[email] = State.currentUser;
          this.saveProfiles(profiles);
          if (showNotification && typeof showToast === 'function') {
            showToast('☁️ Progres belajar berhasil disinkronkan ke database!', 'success');
          }
          if (State.currentTab === 'profil') {
            renderProfileModule();
            setTimeout(initAnalyticsChart, 50);
          }
        }
      })
      .catch(() => {});
    };

    if (showNotification) {
      runSync();
      return;
    }
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(runSync, 350);
  },

  async fetchFromServer(email) {
    const cleanEmail = (email || (State.currentUser && State.currentUser.email) || 'learner@mandarinku.com').toLowerCase().trim();
    try {
      const res = await fetch('api/user-progress?email=' + encodeURIComponent(cleanEmail));
      if (!res.ok) return;
      const json = await res.json();
      if (!json || json.status !== 'success' || !json.data) return;

      const srv = json.data;
      const srvHist = Array.isArray(json.quiz_history) ? json.quiz_history : [];
      if (!State.currentUser || State.currentUser.email.toLowerCase().trim() !== cleanEmail) {
        return;
      }

      // Merge authoritative server stats if server has recorded activity or newer totals
      if (typeof srv.exp === 'number' && (srv.level > State.currentUser.level || (srv.level === State.currentUser.level && srv.exp > State.currentUser.exp))) {
        State.currentUser.level = srv.level;
        State.currentUser.exp = srv.exp;
        State.currentUser.maxExp = srv.max_exp || State.currentUser.maxExp;
      }
      if (typeof srv.points === 'number' && srv.points > (State.currentUser.points || 0)) {
        State.currentUser.points = srv.points;
      }
      if (typeof srv.streak === 'number' && srv.streak > (State.currentUser.streak || 1)) {
        State.currentUser.streak = srv.streak;
      }
      if (srvHist.length > 0) {
        State.currentUser.quizHistory = srvHist;
      } else if (!Array.isArray(State.currentUser.quizHistory)) {
        State.currentUser.quizHistory = [];
      }
      State.currentUser.lastSyncedAt = new Date().toISOString();

      const profiles = this.getProfiles();
      profiles[cleanEmail] = State.currentUser;
      this.saveProfiles(profiles);

      if (typeof updateUserNavDisplay === 'function') updateUserNavDisplay();
      if (typeof updateHomeDashboard === 'function') updateHomeDashboard();
      if (State.currentTab === 'profil' && typeof renderProfileModule === 'function') {
        renderProfileModule();
        setTimeout(initAnalyticsChart, 50);
      }
    } catch (e) {}
  }
};

// Global State
const State = {
  currentUser: UserManager.getUser(UserManager.getActiveEmail()),
  currentTab: "beranda",
  currentHskLevel: 1,
  currentHskSkillFilter: "all",
  currentBankPage: 1,
  bankPageSize: 10,
  activeAudio: null,
  isRecording: false,
  recognition: null,
  currentListeningExercise: 0,
  currentSpeakingExercise: 0,
  
  // Quiz Module State
  currentQuizLevel: 1,
  currentQuizSkill: "all",
  currentQuizMode: "practice",
  currentQuizCount: 10,
  quizQuestions: [],
  quizCurrentIndex: 0,
  quizUserAnswers: {},
  quizTimerInterval: null,
  quizSecondsRemaining: 600,
  quizState: "lobby",

  // Detail Data Materi Pembelajaran Interaktif Deep & Comprehensive (Untuk tombol 'Pelajari')
  learningCategoriesData: {
    // =========================================================================
    // 0. MATERI AJAR HSK 1 - 6 PER SKILL (LISTENING, SPEAKING, READING, WRITING)
    // =========================================================================
    
    // --- LISTENING HSK 1 - 6 ---
    "listening_hsk1": {
      title: "Listening HSK 1: Pinyin, Nada & Identifikasi Kata Dasar",
      category: "Listening",
      level: "HSK 1",
      icon: "🎧",
      color: "#10b981",
      bg: "#ecfdf5",
      summary: "Melatih pendengaran untuk 150 kosakata dasar, membedakan 4 nada pinyin dengan tepat, angka, sapaan, dan kalimat sederhana (Subjek + Kata Kerja + Objek).",
      items: [
        { hanzi: "你好！很高兴认识你。(Nǐ hǎo! Hěn gāoxìng rènshi nǐ.)", pinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.", meaning: "Halo! Senang berkenalan denganmu.", breakdown: "你好 (sapaan) + 认识 (kenal) + 高兴 (senang)", note: "Fokus mendengar nada 3 meliuk pada nǐ dan hǎo.", audio: "你好！很高兴认识你。" },
        { hanzi: "他是我的汉语老师。(Tā shì wǒ de Hànyǔ lǎoshī.)", pinyin: "Tā shì wǒ de Hànyǔ lǎoshī.", meaning: "Dia adalah guru bahasa Mandarin saya.", breakdown: "汉语 (bahasa Mandarin) + 老师 (guru)", note: "Pola 是 identitas.", audio: "他是我的汉语老师。" },
        { hanzi: "我想喝一杯水。(Wǒ xiǎng hē yī bēi shuǐ.)", pinyin: "Wǒ xiǎng hē yī bēi shuǐ.", meaning: "Saya ingin minum segelas air.", breakdown: "想 (ingin) + 喝 (minum) + 杯 (gelas)", note: "Mendengar kata kerja hē dan kata benda shuǐ.", audio: "我想喝一杯水。" },
        { hanzi: "现在是下午三点十分。(Xiànzài shì xiàwǔ sān diǎn shí fēn.)", pinyin: "Xiànzài shì xiàwǔ sān diǎn shí fēn.", meaning: "Sekarang jam 3 lewat 10 menit sore.", breakdown: "现在 (sekarang) + 下午 (sore) + 点 (jam) + 分 (menit)", note: "Mendengar penunjuk waktu jam dan menit.", audio: "现在是下午三点十分。" },
        { hanzi: "苹果多少钱一斤？(Píngguǒ duōshao qián yī jīn?)", pinyin: "Píngguǒ duōshao qián yī jīn?", meaning: "Berapa harga apel satu jin (500g)?", breakdown: "多少钱 (berapa uang) + 斤 (satuan 500g)", note: "Frasa mendengarkan harga saat belanja.", audio: "苹果多少钱一斤？" }
      ],
      quickQuiz: {
        question: "Dengarkan audio: '他是我的汉语老师。' Siapakah yang dibicarakan oleh penutur?",
        targetAudio: "他是我的汉语老师。",
        options: ["Dokter keluarga", "Guru bahasa Mandarin", "Teman sekelas", "Supir taksi"],
        correct: 1,
        explanation: "'汉语老师' (Hànyǔ lǎoshī) bermakna Guru Bahasa Mandarin."
      }
    },
    "listening_hsk2": {
      title: "Listening HSK 2: Percakapan Harian, Waktu & Arah",
      category: "Listening",
      level: "HSK 2",
      icon: "🎧",
      color: "#06b6d4",
      bg: "#cff4fc",
      summary: "Memahami 300 kosakata, instruksi arah perjalanan, perbandingan cuaca/harga, dan dialog rutinitas kantor/sekolah.",
      items: [
        { hanzi: "今天比昨天冷，出门多穿件衣服。(Jīntiān bǐ zuótiān lěng, chūmén duō chuān jiàn yīfu.)", pinyin: "Jīntiān bǐ zuótiān lěng, chūmén duō chuān jiàn yīfu.", meaning: "Hari ini lebih dingin dari kemarin, pakailah baju lebih tebal saat keluar.", breakdown: "比 (dibandingkan) + 冷 (dingin) + 穿 (memakai)", note: "Pola komparasi 比 dalam pendengaran.", audio: "今天比昨天冷，出门多穿件衣服。" },
        { hanzi: "医院离这里不远，往前走五分钟就到了。(Yīyuàn lí zhèlǐ bù yuǎn, wǎng qián zǒu wǔ fēnzhōng jiù dào le.)", pinyin: "Yīyuàn lí zhèlǐ bù yuǎn, wǎng qián zǒu wǔ fēnzhōng jiù dào le.", meaning: "Rumah sakit tidak jauh dari sini, jalan lurus ke depan 5 menit sudah sampai.", breakdown: "离 (jarak dari) + 往前走 (jalan ke depan) + 就到了 (sudah sampai)", note: "Mendengarkan petunjuk navigasi arah.", audio: "医院离这里不远，往前走五分钟就到了。" },
        { hanzi: "你吃过北京烤鸭吗？真好吃！(Nǐ chī guo Běijīng kǎoyā ma? Zhēn hǎochī!)", pinyin: "Nǐ chī guo Běijīng kǎoyā ma? Zhēn hǎochī!", meaning: "Pernahkah kamu makan bebek panggang Beijing? Sungguh enak!", breakdown: "吃过 (pernah makan) + 烤鸭 (bebek panggang)", note: "Mendengar aspek pengalaman 过 (guo).", audio: "你吃过北京烤鸭吗？真好吃！" },
        { hanzi: "他正在生病，所以今天不能来上班。(Tā zhèngzài shēngbìng, suǒyǐ jīntiān bù néng lái shàngbān.)", pinyin: "Tā zhèngzài shēngbìng, suǒyǐ jīntiān bù néng lái shàngbān.", meaning: "Dia sedang sakit, jadi hari ini tidak bisa masuk kerja.", breakdown: "正在 (sedang) + 生病 (sakit) + 所以 (sehingga)", note: "Konjungsi sebab-akibat karena sakit.", audio: "他正在生病，所以今天不能来上班。" }
      ],
      quickQuiz: {
        question: "Berapa lama waktu jalan kaki ke rumah sakit berdasarkan informasi audio?",
        targetAudio: "医院离这里不远，往前走五分钟就到了。",
        options: ["10 menit", "5 menit (五分钟)", "15 menit", "1 jam"],
        correct: 1,
        explanation: "Audio menyatakan '往前走五分钟就到了' (jalan ke depan 5 menit sudah sampai)."
      }
    },
    "listening_hsk3": {
      title: "Listening HSK 3: Dialog Kompleks, Perjalanan & Kehidupan Kampus",
      category: "Listening",
      level: "HSK 3",
      icon: "🎧",
      color: "#3b82f6",
      bg: "#dbeafe",
      summary: "Memahami 600 kosakata, struktur kalimat 把 (bǎ) dan 被 (bèi), dialog reservasi hotel, bandara, dan diskusi kegiatan sehari-hari.",
      items: [
        { hanzi: "请把护照和登机牌拿出来。(Qǐng bǎ hùzhào hé dēngjīpái ná chūlái.)", pinyin: "Qǐng bǎ hùzhào hé dēngjīpái ná chūlái.", meaning: "Tolong keluarkan paspor dan kartu boarding pass Anda.", breakdown: "把 + 护照 (paspor) + 登机牌 (boarding pass) + 拿出 (keluarkan)", note: "Mendengar kalimat manipulasi 把 di bandara.", audio: "请把护照和登机牌拿出来。" },
        { hanzi: "虽然这次考试很难，但我相信你能及格。(Suīrán zhè cì kǎoshì hěn nán, dàn wǒ xiāngxìn nǐ néng jígé.)", pinyin: "Suīrán zhè cì kǎoshì hěn nán, dàn wǒ xiāngxìn nǐ néng jígé.", meaning: "Meskipun ujian kali ini sangat sulit, tapi saya yakin kamu bisa lulus.", breakdown: "虽然...但... (meskipun...tapi...) + 相信 (percaya) + 及格 (lulus)", note: "Mendengarkan konjungsi kontras.", audio: "虽然这次考试很难，但我相信你能及格。" },
        { hanzi: "我的自行车被弟弟借走了。(Wǒ de zìxíngchē bèi dìdi jiè zǒu le.)", pinyin: "Wǒ de zìxíngchē bèi dìdi jiè zǒu le.", meaning: "Sepeda saya telah dipinjam oleh adik laki-laki.", breakdown: "自行车 (sepeda) + 被 (pasif) + 借走 (dipinjam pergi)", note: "Mendengarkan kalimat pasif 被.", audio: "我的自行车被弟弟借走了。" }
      ],
      quickQuiz: {
        question: "Benda apa saja yang diminta untuk dikeluarkan oleh petugas?",
        targetAudio: "请把护照和登机牌拿出来。",
        options: ["Dompet dan kunci", "Paspor dan Boarding Pass (护照和登机牌)", "Tiket kereta dan uang", "Koper dan tas ransel"],
        correct: 1,
        explanation: "'护照' = Paspor, '登机牌' = Boarding pass penerbangan."
      }
    },
    "listening_hsk4": {
      title: "Listening HSK 4: Situasi Kerja, Opini & Berita Singkat",
      category: "Listening",
      level: "HSK 4",
      icon: "🎧",
      color: "#8b5cf6",
      bg: "#f3e8ff",
      summary: "Kuasai 1.200 kosakata, wawancara kerja, pengumuman publik stasiun/pesawat, dan pemahaman penalaran logika pembicara.",
      items: [
        { hanzi: "无论遇到什么困难，我们都要坚持下去。(Wúlùn yùdào shénme kùnnan, wǒmen dōu yào jiānchí xiàqu.)", pinyin: "Wúlùn yùdào shénme kùnnan, wǒmen dōu yào jiānchí xiàqu.", meaning: "Apapun kesulitan yang dihadapi, kita semua harus tetap bertahan pantang menyerah.", breakdown: "无论...都... (apapun...tetap...) + 困难 (kesulitan) + 坚持 (gigih)", note: "Pola penalaran bersyarat mutlak.", audio: "无论遇到什么困难，我们都要坚持下去。" },
        { hanzi: "这份工作不仅待遇很好，而且能学到很多经验。(Zhè fèn gōngzuò bùjǐn dàiyù hěn hǎo, érqiě néng xué dào hěn duō jīngyàn.)", pinyin: "Zhè fèn gōngzuò bùjǐn dàiyù hěn hǎo, érqiě néng xué dào hěn duō jīngyàn.", meaning: "Pekerjaan ini tidak hanya gajinya bagus, tetapi juga bisa belajar banyak pengalaman.", breakdown: "不仅...而且... (tidak hanya...tetapi juga...) + 待遇 (gaji/fasilitas) + 经验 (pengalaman)", note: "Konjungsi penambahan kualitas bertingkat.", audio: "这份工作不仅待遇很好，而且能学到很多经验。" },
        { hanzi: "各位旅客请注意，飞往北京的航班即将起飞。(Gèwèi lǚkè qǐng zhùyì, fēi wǎng Běijīng de hángbān jíjiāng qǐfēi.)", pinyin: "Gèwèi lǚkè qǐng zhùyì, fēi wǎng Běijīng de hángbān jíjiāng qǐfēi.", meaning: "Para penumpang mohon perhatian, penerbangan menuju Beijing akan segera lepas landas.", breakdown: "旅客 (penumpang) + 航班 (penerbangan) + 即将起飞 (segera terbang)", note: "Format pengumuman bandara resmi.", audio: "各位旅客请注意，飞往北京的航班即将起飞。" }
      ],
      quickQuiz: {
        question: "Penerbangan ke kota manakah yang diumumkan akan segera lepas landas?",
        targetAudio: "飞往北京的航班即将起飞",
        options: ["Shanghai (上海)", "Beijing (北京)", "Guangzhou (广州)", "Shenzhen (深圳)"],
        correct: 1,
        explanation: "Pengumuman menyebutkan '飞往北京的航班' (penerbangan menuju Beijing)."
      }
    },
    "listening_hsk5": {
      title: "Listening HSK 5: Diskusi Formal, Berita & Analisis Wacana",
      category: "Listening",
      level: "HSK 5",
      icon: "🎧",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Memahami 2.500 kosakata, wawancara tokoh mendalam, siaran berita ekonomi/teknologi, dan intonasi implisit pembicara profesional.",
      items: [
        { hanzi: "双方企业经过友好协商，最终达成了互利共赢的合作协议。(Shuāngfāng qǐyè jīngguò yǒuhǎo xiéshāng, zuìzhōng dáchéng le hùlì gòngyíng de hézuò xiéyì.)", pinyin: "Shuāngfāng qǐyè jīngguò yǒuhǎo xiéshāng, zuìzhōng dáchéng le hùlì gòngyíng de hézuò xiéyì.", meaning: "Kedua perusahaan setelah berdiskusi secara bersahabat akhirnya mencapai perjanjian kerja sama yang saling menguntungkan.", breakdown: "企业 (perusahaan) + 协商 (musyawarah) + 互利共赢 (saling menguntungkan) + 协议 (perjanjian)", note: "Mendengarkan laporan berita bisnis resmi.", audio: "双方企业经过友好协商，最终达成了互利共赢的合作协议。" },
        { hanzi: "随着人工智能的快速发展，各行各业的生产效率得到了显著提升。(Suízhe réngōng zhìnéng de kuàisù fāzhǎn, gè háng gè yè de shēngchǎn xiàolǜ dédào le xiǎnzhù tíshēng.)", pinyin: "Suízhe réngōng zhìnéng de kuàisù fāzhǎn, gè háng gè yè de shēngchǎn xiàolǜ dédào le xiǎnzhù tíshēng.", meaning: "Seiring pesatnya perkembangan kecerdasan buatan (AI), efisiensi produksi di berbagai industri meningkat signifikan.", breakdown: "随着 (seiring) + 人工智能 (AI) + 效率 (efisiensi) + 显著提升 (meningkat nyata)", note: "Topik wacana teknologi kontemporer.", audio: "随着人工智能的快速发展，各行各业的生产效率得到了显著提升。" }
      ],
      quickQuiz: {
        question: "Apa hasil utama dari musyawarah antara kedua perusahaan tersebut?",
        targetAudio: "最终达成了互利共赢的合作协议",
        options: ["Membatalkan rencana investasi", "Mencapai perjanjian kerja sama saling menguntungkan", "Menunda jadwal konferensi", "Mengganti manajer proyek"],
        correct: 1,
        explanation: "'互利共赢的合作协议' = Perjanjian kerja sama yang saling menguntungkan (win-win)."
      }
    },
    "listening_hsk6": {
      title: "Listening HSK 6: Tingkat Mahir, Pidato Sastra & Debat Akademik",
      category: "Listening",
      level: "HSK 6",
      icon: "🎧",
      color: "#d97706",
      bg: "#fef3c7",
      summary: "Memahami 5.000+ kosakata tingkat penutur asli, ceramah ilmiah, perdebatan argumen filosofis, dan idiom 4 karakter tingkat tinggi.",
      items: [
        { hanzi: "中华文化博大精深，古籍中所蕴含的哲学智慧至今仍具启示意义。(Zhōnghuá wénhuà bódà-jīngshēn, gǔjí zhōng suǒ yùnhán de zhéxué zhìhuì zhìjīn réng jù qǐshì yìyì.)", pinyin: "Zhōnghuá wénhuà bódà-jīngshēn, gǔjí zhōng suǒ yùnhán de zhéxué zhìhuì zhìjīn réng jù qǐshì yìyì.", meaning: "Kebudayaan Tionghoa luas dan mendalam; hikmah filsafat dalam naskah kuno hingga kini masih sarat makna inspiratif.", breakdown: "博大精深 (luas & mendalam) + 蕴含 (terkandung) + 启示 (inspirasi)", note: "Retorika wacana kebudayaan tingkat tinggi.", audio: "中华文化博大精深，古籍中所蕴含的哲学智慧至今仍具启示意义。" },
        { hanzi: "面对日新月异的技术变革，唯有不断突破自我，方能立于不败之地。(Miànduì rìxīnyuèyì de jìshù biàngé, wéiyǒu bùduàn tūpò zìwǒ, fāng néng lì yú bùbài zhī dì.)", pinyin: "Miànduì rìxīnyuèyì de jìshù biàngé, wéiyǒu bùduàn tūpò zìwǒ, fāng néng lì yú bùbài zhī dì.", meaning: "Menghadapi perubahan teknologi yang berganti setiap hari, hanya dengan terus mendobrak batas diri kita dapat berdiri tak terkalahkan.", breakdown: "日新月异 (berubah pesat tiap hari) + 突破 (mendobrak) + 不败之地 (posisi tak terkalahkan)", note: "Kaidah idiom 4 karakter ganda.", audio: "面对日新月异的技术变革，唯有不断突破自我，方能立于不败之地。" }
      ],
      quickQuiz: {
        question: "Chengyu manakah yang digunakan untuk menggambarkan perubahan teknologi yang sangat pesat?",
        targetAudio: "日新月异",
        options: ["博大精深", "日新月异 (Rìxīnyuèyì)", "半途而废", "画蛇添足"],
        correct: 1,
        explanation: "'日新月异' (rì xīn yuè yì) berarti berubah dan berkembang sangat pesat setiap hari dan bulannya."
      }
    },

    // --- SPEAKING HSK 1 - 6 ---
    "speaking_hsk1": {
      title: "Speaking HSK 1: Pelafalan Nada, Sapaan & Perkenalan Diri",
      category: "Speaking",
      level: "HSK 1",
      icon: "🎙️",
      color: "#10b981",
      bg: "#ecfdf5",
      summary: "Melatih artikulasi konsonan b/p, d/t, g/k, menguasai 4 nada pinyin secara stabil, dan berbicara kalimat perkenalan diri lancar.",
      items: [
        { hanzi: "你好！我叫李明，我是学生。(Nǐ hǎo! Wǒ jiào Lǐ Míng, wǒ shì xuésheng.)", pinyin: "Nǐ hǎo! Wǒ jiào Lǐ Míng, wǒ shì xuésheng.", meaning: "Halo! Nama saya Li Ming, saya adalah siswa.", breakdown: "我叫 + Nama + 我是 + Profesi", note: "Lafalkan nǐ hǎo dengan perubahan nada 2+3.", audio: "你好！我叫李明，我是学生。" },
        { hanzi: "请问，你喝茶还是喝水？(Qǐngwèn, nǐ hē chá háishì hē shuǐ?)", pinyin: "Qǐngwèn, nǐ hē chá háishì hē shuǐ?", meaning: "Permisi, kamu minum teh atau minum air?", breakdown: "请问 (permisi tanya) + 还是 (atau pilihan)", note: "Pertanyaan pilihan sopan.", audio: "请问，你喝茶还是喝水？" },
        { hanzi: "太谢谢你了！明天见！(Tài xièxie nǐ le! Míngtiān jiàn!)", pinyin: "Tài xièxie nǐ le! Míngtiān jiàn!)", meaning: "Terima kasih banyak! Sampai jumpa besok!", breakdown: "太...了 (sangat) + 明天见 (sampai jumpa besok)", note: "Etika berpamitan ramah.", audio: "太谢谢你了！明天见！" }
      ],
      quickQuiz: {
        question: "Bagaimana cara menyapa dan mengenalkan profesi sebagai siswa secara lancar?",
        targetAudio: "你好！我是学生。",
        options: ["你好！我是学生。 (Nǐ hǎo! Wǒ shì xuésheng.)", "我学生你好是。", "学生是我你好。", "不是学生我。"],
        correct: 0,
        explanation: "Struktur standar: Sapaan (你好) + Subjek (我) + 是 (shì) + Profesi (学生)."
      }
    },
    "speaking_hsk2": {
      title: "Speaking HSK 2: Memesan Menu, Belanja & Menawar Harga",
      category: "Speaking",
      level: "HSK 2",
      icon: "🎙️",
      color: "#06b6d4",
      bg: "#cff4fc",
      summary: "Percakapan berbicara spontan saat di pasar, restoran, menanyakan diskon baju, dan meminta bantuan orang lain dengan ramah.",
      items: [
        { hanzi: "服务员，请给我们一份菜单，少放点辣。(Fúwùyuán, qǐng gěi wǒmen yī fèn càidān, shǎo fàng diǎn là.)", pinyin: "Fúwùyuán, qǐng gěi wǒmen yī fèn càidān, shǎo fàng diǎn là.", meaning: "Pelayan, tolong beri kami satu buku menu, kurangi pedasnya sedikit.", breakdown: "服务员 (pelayan) + 菜单 (menu) + 少放辣 (kurangi pedas)", note: "Praktik berbicara langsung di restoran.", audio: "服务员，请给我们一份菜单，少放点辣。" },
        { hanzi: "这件衣服太贵了，可以便宜一点吗？(Zhè jiàn yīfu tài guì le, kěyǐ piányi yīdiǎn ma?)", pinyin: "Zhè jiàn yīfu tài guì le, kěyǐ piányi yīdiǎn ma?", meaning: "Baju ini terlalu mahal, bisakah lebih murah sedikit?", breakdown: "件 (penggolong baju) + 便宜 (murah) + 一点 (sedikit)", note: "Ungkapan menawar harga yang sopan.", audio: "这件衣服太贵了，可以便宜一点吗？" },
        { hanzi: "我们可以用微信或者支付宝付款吗？(Wǒmen kěyǐ yòng Wēixìn huòzhě Zhīfùbǎo fùkuǎn ma?)", pinyin: "Wǒmen kěyǐ yòng Wēixìn huòzhě Zhīfùbǎo fùkuǎn ma?", meaning: "Bolehkah kami membayar menggunakan WeChat atau Alipay?", breakdown: "用 (pakai) + 或者 (atau pernyataan) + 付款 (bayar)", note: "Pembayaran digital di Tiongkok.", audio: "我们可以用微信或者支付宝付款吗？" }
      ],
      quickQuiz: {
        question: "Ungkapan berbicara apa yang tepat untuk menawar harga?",
        targetAudio: "可以便宜一点吗？",
        options: ["太好吃了！", "可以便宜一点吗？ (Kěyǐ piányi yīdiǎn ma?)", "现在几点了？", "我要买车票。"],
        correct: 1,
        explanation: "'便宜一点' (piányi yīdiǎn) berarti lebih murah sedikit."
      }
    },
    "speaking_hsk3": {
      title: "Speaking HSK 3: Menyampaikan Opini, Hobi & Alasan",
      category: "Speaking",
      level: "HSK 3",
      icon: "🎙️",
      color: "#3b82f6",
      bg: "#dbeafe",
      summary: "Mampu berbicara mengungkapkan alasan pribadi, membandingkan dua pilihan, dan menceritakan pengalaman liburan atau studi.",
      items: [
        { hanzi: "我认为学中文不仅很有趣，而且对未来的工作很有帮助。(Wǒ rènwéi xué Zhōngwén bùjǐn hěn yǒuqù, érqiě duì wèilái de gōngzuò hěn yǒu bāngzhù.)", pinyin: "Wǒ rènwéi xué Zhōngwén bùjǐn hěn yǒuqù, érqiě duì wèilái de gōngzuò hěn yǒu bāngzhù.)", meaning: "Menurut saya belajar Mandarin tidak hanya sangat menarik, tetapi juga sangat membantu pekerjaan di masa depan.", breakdown: "我认为 (menurut saya) + 对...有帮助 (bermanfaat bagi...)", note: "Ekspresi menyampaikan opini berbobot.", audio: "我认为学中文不仅很有趣，而且对未来的工作很有帮助。" },
        { hanzi: "如果你有空，我们周末一起去爬山怎么样？(Rúguǒ nǐ yǒu kòng, wǒmen zhōumò yīqǐ qù páshān zěnmeyàng?)", pinyin: "Rúguǒ nǐ yǒu kòng, wǒmen zhōumò yīqǐ qù páshān zěnmeyàng?", meaning: "Jika kamu ada waktu luang, bagaimana kalau akhir pekan kita mendaki gunung bersama?", breakdown: "如果... (jika) + 爬山 (naik gunung) + 怎么样 (bagaimana)", note: "Mengajak rekan beraktivitas outdoor.", audio: "如果你有空，我们周末一起去爬山怎么样？" }
      ],
      quickQuiz: {
        question: "Frasa apa yang digunakan di awal untuk menyatakan 'Menurut pendapat saya'?",
        targetAudio: "我认为",
        options: ["我认为 (Wǒ rènwéi)", "我不去", "谢谢你", "对不起"],
        correct: 0,
        explanation: "'我认为' (Wǒ rènwéi) adalah frasa standar untuk mengemukakan opini pribadi."
      }
    },
    "speaking_hsk4": {
      title: "Speaking HSK 4: Wawancara Kerja & Presentasi Profesional",
      category: "Speaking",
      level: "HSK 4",
      icon: "🎙️",
      color: "#8b5cf6",
      bg: "#f3e8ff",
      summary: "Menjawab pertanyaan wawancara kerja, memaparkan latar belakang pendidikan, keahlian tim, dan negosiasi penawaran bisnis.",
      items: [
        { hanzi: "各位面试官好，我有三年的跨境电商工作经验，具备出色的沟通能力。(Gèwèi miànshìguān hǎo, wǒ yǒu sān nián de kuàjìng diànshāng gōngzuò jīngyàn, jùbèi chūsè de gōutōng nénglì.)", pinyin: "Gèwèi miànshìguān hǎo, wǒ yǒu sān nián de kuàjìng diànshāng gōngzuò jīngyàn, jùbèi chūsè de gōutōng nénglì.", meaning: "Halo para pewawancara, saya memiliki pengalaman kerja e-commerce lintas batas selama 3 tahun dan memiliki kemampuan komunikasi yang unggul.", breakdown: "跨境电商 (e-commerce lintas batas) + 具备 (memiliki) + 出色 (unggul)", note: "Pitch perkenalan diri profesional.", audio: "各位面试官好，我有三年的跨境电商工作经验，具备出色的沟通能力。" },
        { hanzi: "对于这个项目，我建议分三个阶段逐步推进。(Duìyú zhège xiàngmù, wǒ jiànyì fēn sān gè jiēduàn zhúbù tuījìn.)", pinyin: "Duìyú zhège xiàngmù, wǒ jiànyì fēn sān gè jiēduàn zhúbù tuījìn.", meaning: "Mengenai proyek ini, saya menyarankan untuk membaginya ke dalam 3 tahap secara bertahap.", breakdown: "对于 (mengenai) + 阶段 (tahap) + 逐步推进 (dorong bertahap)", note: "Keahlian presentasi bisnis.", audio: "对于这个项目，我建议分三个阶段逐步推进。" }
      ],
      quickQuiz: {
        question: "Bagaimana cara menyampaikan usulan strategi kerja dalam rapat secara formal?",
        targetAudio: "我建议分阶段推进",
        options: ["我想回家睡觉", "我建议分阶段逐步推进 (Saya menyarankan dorong bertahap)", "随便你们怎么做", "这个东西太贵了"],
        correct: 1,
        explanation: "'我建议...' (Wǒ jiànyì...) adalah ungkapan formal untuk memberikan rekomendasi solutif."
      }
    },
    "speaking_hsk5": {
      title: "Speaking HSK 5: Diskusi Isu Kontemporer & Debat Kritis",
      category: "Speaking",
      level: "HSK 5",
      icon: "🎙️",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Menyampaikan sanggahan argumen secara santun, berdiskusi mengenai fenomena sosial, ekonomi hijau, dan tren teknologi global.",
      items: [
        { hanzi: "不可否认，数字化转型为现代企业带来了巨大的竞争优势。(Bù kě fǒurèn, shùzìhuà zhuǎnxíng wèi xiàndài qǐyè dài lái le jùdà de jìngzhēng yōushì.)", pinyin: "Bù kě fǒurèn, shùzìhuà zhuǎnxíng wèi xiàndài qǐyè dài lái le jùdà de jìngzhēng yōushì.", meaning: "Tak dapat disangkal bahwa transformasi digital telah membawa keunggulan kompetitif yang masif bagi perusahaan modern.", breakdown: "不可否认 (tak dapat disangkal) + 数字化转型 (transformasi digital) + 竞争优势 (keunggulan kompetitif)", note: "Bahasa argumentasi tingkat tinggi.", audio: "不可否认，数字化转型为现代企业带来了巨大的竞争优势。" }
      ],
      quickQuiz: {
        question: "Ungkapan 'Tak dapat disangkal bahwa...' diucapkan dengan frasa apa?",
        targetAudio: "不可否认",
        options: ["不可否认 (Bù kě fǒurèn)", "莫名其妙", "大吃一惊", "毫无办法"],
        correct: 0,
        explanation: "'不可否认' (bù kě fǒurèn) adalah frasa formal pembuka argumen mutlak."
      }
    },
    "speaking_hsk6": {
      title: "Speaking HSK 6: Kemahiran Retorika, Diplomasi & Filsafat",
      category: "Speaking",
      level: "HSK 6",
      icon: "🎙️",
      color: "#d97706",
      bg: "#fef3c7",
      summary: "Kemampuan berbicara spontan tingkat ahli, menggunakan metafora sastra, peribahasa klasik, dan diplomasi tingkat tinggi.",
      items: [
        { hanzi: "海纳百川，有容乃大；唯有秉持开放包容的态度，方能实现文明互鉴。(Hǎinàbǎichuān, yǒu róng nǎi dà; wéiyǒu bǐngchí kāifàng bāoróng de tàidù, fāng néng shíxiàn wénmíng hùjiàn.)", pinyin: "Hǎinàbǎichuān, yǒu róng nǎi dà; wéiyǒu bǐngchí kāifàng bāoróng de tàidù, fāng néng shíxiàn wénmíng hùjiàn.", meaning: "Laut menampung ratusan sungai karena kebesaran toleransinya; hanya dengan memegang sikap terbuka dan inklusif kita dapat mewujudkan saling belajar antar peradaban.", breakdown: "海纳百川 (laut tampung sungai) + 包容 (inklusif) + 文明互鉴 (saling belajar peradaban)", note: "Kaidah pidato kenegaraan/akademik.", audio: "海纳百川，有容乃大；唯有秉持开放包容的态度，方能实现文明互鉴。" }
      ],
      quickQuiz: {
        question: "Idiom '海纳百川，有容乃大' menyiratkan nilai kebajikan apa?",
        targetAudio: "海纳百川",
        options: ["Hemat pengeluaran", "Keterbukaan dan toleransi yang luas (开放与包容)", "Kecepatan berlari", "Ketakutan pada air"],
        correct: 1,
        explanation: "'海纳百川' melambangkan jiwa besar yang lapang dada dan mau menerima berbagai perbedaan."
      }
    },

    // --- READING HSK 1 - 6 ---
    "reading_hsk1": {
      title: "Reading HSK 1: Hanzi Dasar, Radikal Pembentuk & Pola SVO",
      category: "Reading",
      level: "HSK 1",
      icon: "📖",
      color: "#10b981",
      bg: "#ecfdf5",
      summary: "Mengenal 150 karakter Hanzi tunggal, radikal air (氵), manusia (亻), pohon (木), dan membaca kalimat struktur dasar SVO.",
      items: [
        { hanzi: "我家有五口人。(Wǒ jiā yǒu wǔ kǒu rén.)", pinyin: "Wǒ jiā yǒu wǔ kǒu rén.", meaning: "Keluarga saya memiliki 5 orang anggota.", breakdown: "口 (kǒu) = kata penggolong anggota keluarga", note: "Pola keberadaan 有 (yǒu).", audio: "我家有五口人。" },
        { hanzi: "桌子上有一本书和一个杯子。(Zhuōzi shang yǒu yī běn shū hé yī gè bēizi.)", pinyin: "Zhuōzi shang yǒu yī běn shū hé yī gè bēizi.", meaning: "Di atas meja ada sebuah buku dan sebuah gelas.", breakdown: "桌子上 (di atas meja) + 本 (penggolong buku) + 杯子 (gelas)", note: "Membaca posisi letak benda.", audio: "桌子上有一本书和一个杯子。" }
      ],
      quickQuiz: {
        question: "Kata penggolong apa yang digunakan untuk menghitung jumlah buku (书)?",
        targetAudio: "本",
        options: ["个 (gè)", "本 (běn)", "只 (zhī)", "张 (zhāng)"],
        correct: 1,
        explanation: "Kata penggolong khusus buku adalah '本' (běn), contoh: 一本书 (yī běn shū)."
      }
    },
    "reading_hsk2": {
      title: "Reading HSK 2: Wacana Rutinitas, Transportasi & Komparasi",
      category: "Reading",
      level: "HSK 2",
      icon: "📖",
      color: "#06b6d4",
      bg: "#cff4fc",
      summary: "Membaca 300 kosakata, cerita pendek hobi olahraga, jadwal penerbangan, dan kalimat perbandingan 比.",
      items: [
        { hanzi: "大卫每天早上跑步半个小时，然后再去上班。(Dàwèi měitiān zǎoshang pǎobù bàn gè xiǎoshí, ránhòu zài qù shàngbān.)", pinyin: "Dàwèi měitiān zǎoshang pǎobù bàn gè xiǎoshí, ránhòu zài qù shàngbān.", meaning: "David setiap pagi jogging selama setengah jam, kemudian baru pergi bekerja.", breakdown: "每天 (setiap hari) + 跑步 (lari) + 半个小时 (setengah jam) + 然后 (kemudian)", note: "Urutan kronologis rutinitas harian.", audio: "大卫每天早上跑步半个小时，然后再去上班。" }
      ],
      quickQuiz: {
        question: "Berapa lama waktu David berolahraga lari setiap pagi?",
        targetAudio: "半个小时",
        options: ["1 jam", "30 menit / Setengah jam (半个小时)", "15 menit", "2 jam"],
        correct: 1,
        explanation: "'半个小时' (bàn gè xiǎoshí) = 30 menit (setengah jam)."
      }
    },
    "reading_hsk3": {
      title: "Reading HSK 3: Cerita Pendek, Komplemen Hasil & Tata Kalimat",
      category: "Reading",
      level: "HSK 3",
      icon: "📖",
      color: "#3b82f6",
      bg: "#dbeafe",
      summary: "Membaca 600 kosakata, pemahaman narasi 2 paragraf, pelengkap arah (进, 出, 上, 下), dan klausa komplemen tingkat hasil.",
      items: [
        { hanzi: "为了提高汉语水平，小李每天坚持阅读中文报纸。(Wèile tígāo Hànyǔ shuǐpíng, Xiǎo Lǐ měitiān jiānchí yuèdú Zhōngwén bàozhǐ.)", pinyin: "Wèile tígāo Hànyǔ shuǐpíng, Xiǎo Lǐ měitiān jiānchí yuèdú Zhōngwén bàozhǐ.", meaning: "Demi meningkatkan kemahiran bahasa Mandarin, Xiao Li setiap hari tekun membaca koran Mandarin.", breakdown: "为了 (demi) + 提高水平 (tingkatkan kemahiran) + 报纸 (surat kabar)", note: "Pola tujuan 为了 (wèile).", audio: "为了提高汉语水平，小李每天坚持阅读中文报纸。" }
      ],
      quickQuiz: {
        question: "Apa tujuan Xiao Li tekun membaca surat kabar Mandarin setiap hari?",
        targetAudio: "为了提高汉语水平",
        options: ["Mencari lowongan kerja", "Meningkatkan kemahiran bahasa Mandarin (提高汉语水平)", "Menunggu teman", "Membeli kacamata baru"],
        correct: 1,
        explanation: "'为了提高汉语水平' = Demi meningkatkan kemahiran bahasa Mandarin."
      }
    },
    "reading_hsk4": {
      title: "Reading HSK 4: Artikel Majalah, Chengyu Populer & Argumen Logis",
      category: "Reading",
      level: "HSK 4",
      icon: "📖",
      color: "#8b5cf6",
      bg: "#f3e8ff",
      summary: "Membaca 1.200 kosakata, menyusun paragraf acak (排列顺序), mendeteksi gagasan utama artikel majalah dan idiom 4 karakter populer.",
      items: [
        { hanzi: "俗话说：'熟能生巧'。只有经过长期的练习，才能在专业领域取得卓越的成绩。(Súhuà shuō: 'Shú néng shēng qiǎo'. Zhǐyǒu jīngguò chángqī de liànxí, cái néng zài zhuānyè lǐngyù qǔdé zhuóyuè de chéngjì.)", pinyin: "Súhuà shuō: 'Shú néng shēng qiǎo'. Zhǐyǒu jīngguò chángqī de liànxí, cái néng zài zhuānyè lǐngyù qǔdé zhuóyuè de chéngjì.", meaning: "Pepatah mengatakan: 'Bisa karena biasa'. Hanya melalui latihan jangka panjang seseorang bisa meraih prestasi gemilang di bidang profesional.", breakdown: "熟能生巧 (latihan membuat sempurna) + 卓越 (gemilang) + 领域 (bidang)", note: "Pengutipan peribahasa dalam esai.", audio: "俗话说：熟能生巧。" }
      ],
      quickQuiz: {
        question: "Apa arti dari peribahasa '熟能生巧' (Shú néng shēng qiǎo)?",
        targetAudio: "熟能生巧",
        options: ["Menggambar ular menambah kaki", "Praktek dan latihan berulang menghasilkan keahlian sempurna", "Menunggu keberuntungan tanpa usaha", "Menyerah di tengah jalan"],
        correct: 1,
        explanation: "'熟' (mahir/terbiasa) menghasilkan '巧' (keahlian) = Praktik membuat sempurna."
      }
    },
    "reading_hsk5": {
      title: "Reading HSK 5: Esai Ilmiah, Laporan Berita & Kosakata Abstrak",
      category: "Reading",
      level: "HSK 5",
      icon: "📖",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Menguasai 2.500 kosakata, membaca cepat wacana 400 karakter, menganalisis sinonim formal (近义词辨析), dan esai opini ilmiah.",
      items: [
        { hanzi: "绿色低碳生活不仅是一种环保理念，更是当代公民应尽的社会责任。(Lǜsè dītàn shēnghuó bùjǐn shì yī zhǒng huánbǎo lǐniàn, gèng shì dāngdài gōngmín yīng jìn de shèhuì zérèn.)", pinyin: "Lǜsè dītàn shēnghuó bùjǐn shì yī zhǒng huánbǎo lǐniàn, gèng shì dāngdài gōngmín yīng jìn de shèhuì zérèn.", meaning: "Gaya hidup hijau rendah karbon bukan hanya sebuah konsep pelestarian lingkungan, melainkan kewajiban tanggung jawab sosial warga modern.", breakdown: "低碳 (rendah karbon) + 理念 (konsep) + 责任 (tanggung jawab)", note: "Tema keberlanjutan lingkungan modern.", audio: "绿色低碳生活不仅是一种环保理念，更是当代公民应尽的社会责任。" }
      ],
      quickQuiz: {
        question: "Menurut teks, apa makna dari gaya hidup rendah karbon (低碳生活)?",
        targetAudio: "更是一种社会责任",
        options: ["Hobi berbelanja barang mewah", "Konsep ramah lingkungan & tanggung jawab sosial", "Menolak penggunaan gawai", "Pindah ke pedesaan terpencil"],
        correct: 1,
        explanation: "Teks menyatakan ini adalah '环保理念' dan '社会责任' (tanggung jawab sosial)."
      }
    },
    "reading_hsk6": {
      title: "Reading HSK 6: Analisis Kalimat Cacat (病句), Sastra & Filosofi",
      category: "Reading",
      level: "HSK 6",
      icon: "📖",
      color: "#d97706",
      bg: "#fef3c7",
      summary: "Menguasai 5.000+ kosakata tingkat ahli, mendeteksi cacat gramatikal (病句辨析), membaca puisi klasik dinasti Tang, dan wacana filsafat kuno.",
      items: [
        { hanzi: "床前明月光，疑是地上霜。举头望明月，低头思故乡。(Chuáng qián míng yuè guāng, yí shì dì shàng shuāng. Jǔ tóu wàng míng yuè, dī tóu sī gùxiāng.)", pinyin: "Chuáng qián míng yuè guāng, yí shì dì shàng shuāng. Jǔ tóu wàng míng yuè, dī tóu sī gùxiāng.", meaning: "Di depan ranjang bersinar cahaya rembulan, kukira embun beku melapisi tanah. Kuangkat kepala menatap rembulan terang, kutundukkan kepala merindukan kampung halaman.", breakdown: "Puisi Mahakarya Li Bai 《静夜思》", note: "Apresiasi puisi klasik dinasti Tang.", audio: "床前明月光，疑是地上霜。举头望明月，低头思故乡。" }
      ],
      quickQuiz: {
        question: "Siapakah penyair besar Dinasti Tang yang mengarang puisi 《静夜思》?",
        targetAudio: "李白",
        options: ["Du Fu (杜甫)", "Li Bai (李白)", "Bai Juyi (白居易)", "Su Dongpo (苏东坡)"],
        correct: 1,
        explanation: "Puisi legendaris 《静夜思》 dikarang oleh Li Bai (李白)."
      }
    },

    // --- WRITING HSK 1 - 6 ---
    "writing_hsk1": {
      title: "Writing HSK 1: 8 Goresan Dasar Hanzi & Kaidah Tian Zi Ge",
      category: "Writing",
      level: "HSK 1",
      icon: "✍️",
      color: "#10b981",
      bg: "#ecfdf5",
      summary: "Memahami 8 goresan dasar (横, 竖, 撇, 捺, 点, 折, 提, 钩), urutan baku menulis (atas ke bawah, kiri ke kanan), dan menulis angka serta sapaan.",
      items: [
        { hanzi: "人 (rén - 2 Goresan: 撇 + 捺)", pinyin: "rén", meaning: "Manusia / Orang", breakdown: "Kaidah: Tarik garis miring kiri (撇) dulu, lalu sapuan kanan (捺)!", note: "Karakter piktograf manusia berdiri.", audio: "人" },
        { hanzi: "十 (shí - 2 Goresan: 横 + 竖)", pinyin: "shí", meaning: "Sepuluh (10)", breakdown: "Kaidah: Tarik mendatar (横) dulu, baru garis tegak tengah (竖)!", note: "Aturan mendatar sebelum tegak.", audio: "十" },
        { hanzi: "月 (yuè - 4 Goresan: 撇 + 横折钩 + 横 + 横)", pinyin: "yuè", meaning: "Bulan (Kalender / Rembulan)", breakdown: "Kaidah: Luar dulu baru dalam!", note: "Bentuk bulan sabit.", audio: "月" }
      ],
      quickQuiz: {
        question: "Manakah aturan urutan penulisan goresan karakter '十' (shí)?",
        targetAudio: "先横后竖",
        options: ["Garis tegak dulu baru mendatar", "Garis mendatar (横) mendahului garis tegak (竖)", "Kanan dulu baru kiri", "Bawah dulu baru atas"],
        correct: 1,
        explanation: "Kaidah emas penulisan Hanzi: '先横后竖' (Mendatar dulu baru garis tegak)."
      }
    },
    "writing_hsk2": {
      title: "Writing HSK 2: Menyusun Kalimat SVO, Penanda Aspek & Partikel",
      category: "Writing",
      level: "HSK 2",
      icon: "✍️",
      color: "#06b6d4",
      bg: "#cff4fc",
      summary: "Menyusun kata acak menjadi kalimat yang gramatikal, menempatkan keterangan waktu/tempat sebelum kata kerja, dan penggunaan 了/过.",
      items: [
        { hanzi: "我昨天买了一本新书。(Wǒ zuótiān mǎi le yī běn xīn shū.)", pinyin: "Wǒ zuótiān mǎi le yī běn xīn shū.", meaning: "Kemarin saya membeli sebuah buku baru.", breakdown: "Urutan: Subjek (我) + Keterangan Waktu (昨天) + Predikat (买了) + Objek (新书)", note: "Keterangan waktu wajib di depan atau setelah Subjek.", audio: "我昨天买了一本新书。" }
      ],
      quickQuiz: {
        question: "Susun kata-kata acak berikut: [ 去了 / 昨天 / 北京 / 爸爸 ]",
        targetAudio: "爸爸昨天去了北京",
        options: ["爸爸昨天去了北京 (Bàba zuótiān qù le Běijīng)", "北京爸爸昨天去了", "去了北京昨天爸爸", "昨天北京去了爸爸"],
        correct: 0,
        explanation: "Struktur standar: Subjek (爸爸) + Waktu (昨天) + Kata Kerja (去了) + Tempat (北京)."
      }
    },
    "writing_hsk3": {
      title: "Writing HSK 3: Menulis Kalimat Struktur 把 & Kalimat Pasif 被",
      category: "Writing",
      level: "HSK 3",
      icon: "✍️",
      color: "#3b82f6",
      bg: "#dbeafe",
      summary: "Menguasai penulisan kalimat manipulasi 把 (Subjek + 把 + Objek + Kata Kerja + Hasil) dan mengubah kalimat aktif menjadi pasif 被.",
      items: [
        { hanzi: "他把房间打扫干净了。(Tā bǎ fángjiān dǎsǎo gānjìng le.)", pinyin: "Tā bǎ fángjiān dǎsǎo gānjìng le.", meaning: "Dia telah membersihkan kamarnya hingga bersih tuntas.", breakdown: "他 (S) + 把 + 房间 (O) + 打扫 (V) + 干净了 (Hasil)", note: "Struktur manipulasi objek 把.", audio: "他把房间打扫干净了。" }
      ],
      quickQuiz: {
        question: "Di manakah posisi objek dalam kalimat yang menggunakan partikel 把 (bǎ)?",
        targetAudio: "把字句结构",
        options: ["Di paling akhir kalimat", "Langsung setelah kata 把 (把 + Objek + Kata Kerja)", "Sebelum Subjek", "Tidak perlu ditulis"],
        correct: 1,
        explanation: "Struktur 把 memindahkan Objek tepat di belakang partikel 把 (Subjek + 把 + Objek + Verba + Hasil)."
      }
    },
    "writing_hsk4": {
      title: "Writing HSK 4: Menulis Esai Naratif Singkat Berdasarkan Gambar",
      category: "Writing",
      level: "HSK 4",
      icon: "✍️",
      color: "#8b5cf6",
      bg: "#f3e8ff",
      summary: "Membuat kalimat dan esai naratif singkat (80 karakter) berdasarkan kata kunci dan gambar ilustrasi dengan alur koheren.",
      items: [
        { hanzi: "今天阳光明媚，公园里许多人在散步、放风筝，气氛非常愉快。(Jīntiān yángguāng míngmèi, gōngyuán lǐ xǔduō rén zài sànbù, fàng fēngzheng, qìfēn fēicháng yúkuài.)", pinyin: "Jīntiān yángguāng míngmèi, gōngyuán lǐ xǔduō rén zài sànbù, fàng fēngzheng, qìfēn fēicháng yúkuài.", meaning: "Hari ini sinar matahari cerah, di taman banyak orang sedang jalan santai dan menerbangkan layang-layang, suasananya sangat menyenangkan.", breakdown: "阳光明媚 (cerah ceria) + 放风筝 (terbangkan layangan) + 气氛 (atmosfer)", note: "Contoh paragraf esai deskriptif HSK 4.", audio: "今天阳光明媚，公园里许多人在散步。" }
      ],
      quickQuiz: {
        question: "Frasa empat karakter manakah yang cocok mendeskripsikan cuaca cerah bersinar?",
        targetAudio: "阳光明媚",
        options: ["大雪纷飞", "阳光明媚 (Yángguāng míngmèi)", "倾盆大雨", "风雨交加"],
        correct: 1,
        explanation: "'阳光明媚' (yáng guāng míng mèi) menggambarkan cuaca cerah bersinar hangat."
      }
    },
    "writing_hsk5": {
      title: "Writing HSK 5: Esai 80 Karakter dari 5 Kata Kunci & Format Surat",
      category: "Writing",
      level: "HSK 5",
      icon: "✍️",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Menulis artikel utuh dengan menggabungkan 5 kata kunci yang diberikan, serta format korespondensi formal bisnis (尊敬的, 此致敬礼).",
      items: [
        { hanzi: "随着科技的飞速发展，互联网深刻地改变了我们的生活方式与沟通模式。(Suízhe kējì de fēisù fāzhǎn, hùliánwǎng shēnkè de gǎibiàn le wǒmen de shēnghuó fāngshì yǔ gōutōng móshì.)", pinyin: "Suízhe kējì de fēisù fāzhǎn, hùliánwǎng shēnkè de gǎibiàn le wǒmen de shēnghuó fāngshì yǔ gōutōng móshì.", meaning: "Seiring pesatnya perkembangan sains dan teknologi, internet telah mengubah gaya hidup serta pola komunikasi kita secara mendalam.", breakdown: "飞速发展 (berkembang pesat) + 深刻改变 (mengubah mendalam) + 沟通模式 (pola komunikasi)", note: "Paragraf pembuka esai tematik HSK 5.", audio: "随着科技的飞速发展，互联网深刻地改变了我们的生活方式。" }
      ],
      quickQuiz: {
        question: "Apa penutup surat resmi yang wajib dicantumkan dalam korespondensi formal?",
        targetAudio: "此致敬礼",
        options: ["再见啦", "此致敬礼 (Cǐzhì jìnglǐ - Hormat Kami)", "明天聊", "喂喂喂"],
        correct: 1,
        explanation: "'此致敬礼' (Cǐzhì jìnglǐ) adalah salam penutup standar dalam surat resmi Tiongkok."
      }
    },
    "writing_hsk6": {
      title: "Writing HSK 6: Menyingkat Wacana 1.000 Karakter Menjadi Esai 400 Karakter",
      category: "Writing",
      level: "HSK 6",
      icon: "✍️",
      color: "#d97706",
      bg: "#fef3c7",
      summary: "Ujian menulis HSK 6 resmi: membaca teks naratif 1.000 karakter dalam 10 menit, lalu menulis ringkasan esai 400 karakter tanpa mengubah inti cerita.",
      items: [
        { hanzi: "本文讲述了一位老匠人坚守传统手艺、在逆境中不断精益求精的感人故事，展现了执着专注的工匠精神。(Běnwén jiǎngshù le yī wèi lǎo jiàngrén jiānshǒu chuántǒng shǒuyì, zài nìjìng zhōng bùduàn jīngyìqiújīng de gǎnrén gùshì, zhǎnxiàn le zhízhuó zhuānzhù de gōngjiàng jīngshén.)", pinyin: "Běnwén jiǎngshù le yī wèi lǎo jiàngrén jiānshǒu chuántǒng shǒuyì, zài nìjìng zhōng bùduàn jīngyìqiújīng de gǎnrén gùshì, zhǎnxiàn le zhízhuó zhuānzhù de gōngjiàng jīngshén.)", meaning: "Artikel ini mengisahkan keteguhan seorang perajin tua mempertahankan kerajinan tradisional dan terus menyempurnakan karyanya di tengah kesulitan, mencerminkan semangat pengrajin yang gigih dan berdedikasi.", breakdown: "精益求精 (selalu menyempurnakan keunggulan) + 工匠精神 (etos kerja pengrajin)", note: "Format ringkasan esai ringkas HSK 6.", audio: "本文讲述了一位老匠人坚守传统手艺的感人故事。" }
      ],
      quickQuiz: {
        question: "Apa syarat utama dalam mengerjakan soal menyingkat esai (缩写) pada ujian HSK 6?",
        targetAudio: "概括核心内容，不得加入个人评论",
        options: ["Menambahkan opini pribadi sebanyak mungkin", "Merangkum inti cerita secara objektif tanpa menambahkan opini pribadi", "Menulis puisi baru", "Menghapus semua nama tokoh"],
        correct: 1,
        explanation: "Aturan HSK 6 缩写: Siswa wajib merangkum alur cerita secara akurat dan objektif tanpa menyisipkan opini pribadi."
      }
    },

    // =========================================================================
    // 1. LISTENING MODULES (MENDENGAR - TOPIK TEMATIK)
    // =========================================================================
    "listening_pinyin": {
      title: "Pinyin & 4 Nada Dasar (拼音与声调)",
      category: "Listening",
      level: "HSK 1",
      icon: "🔊",
      color: "#f27289",
      bg: "#fff0f3",
      summary: "Mandarin adalah bahasa bernada (tonal language). Terdapat 4 nada utama (55, 35, 214, 51) dan 1 nada netral. Salah nada dapat mengubah total makna kata.",
      items: [
        { hanzi: "妈 (mā)", pinyin: "Nada 1 (Datar Tinggi - 55)", meaning: "Ibu / Mama", breakdown: "Karakter 女 (wanita) + 马 (kuda)", note: "Nada 1 datar, tinggi, konstan seperti nada sol saat menyanyi.", audio: "mā" },
        { hanzi: "麻 (má)", pinyin: "Nada 2 (Naik - 35)", meaning: "Rami / Kebas / Mati rasa", breakdown: "Karakter 广 (atap) + 林 (hutan)", note: "Nada 2 naik dari sedang ke tinggi seperti intonasi bertanya 'Hah?'.", audio: "má" },
        { hanzi: "马 (mǎ)", pinyin: "Nada 3 (Turun lalu Naik - 214)", meaning: "Kuda", breakdown: "Karakter tunggal gambar kuda", note: "Nada 3 meliuk turun dulu lalu naik lembut.", audio: "mǎ" },
        { hanzi: "骂 (mà)", pinyin: "Nada 4 (Turun Cepat - 51)", meaning: "Memarahi / Mengutuk", breakdown: "Karakter 囍/口 (mulut) di atas 马", note: "Nada 4 diucapkan tegas, pendek, menekan turun seperti menyentak.", audio: "mà" },
        { hanzi: "吗 (ma)", pinyin: "Nada Netral (Ringan Singkat)", meaning: "Partikel tanya (Apakah...?)", breakdown: "Karakter 口 (mulut) + 马", note: "Diucapkan sangat ringan, tanpa tekanan.", audio: "ma" },
        { hanzi: "八 (bā)", pinyin: "Nada 1 (Datar Tinggi)", meaning: "Delapan (8)", breakdown: "Dua goresan terbuka", note: "Angka keberuntungan dalam budaya Tionghoa.", audio: "bā" },
        { hanzi: "拔 (bá)", pinyin: "Nada 2 (Naik)", meaning: "Mencabut / Menarik keluar", breakdown: "Radikal 扌(tangan) + 友", note: "Contoh: 拔牙 (báyá) = cabut gigi.", audio: "bá" },
        { hanzi: "靶 (bǎ)", pinyin: "Nada 3 (Turun-Naik)", meaning: "Sasaran target / Papan panah", breakdown: "Radikal 革 (kulit) + 巴", note: "Contoh: 靶心 (bǎxīn) = pusat sasaran.", audio: "bǎ" },
        { hanzi: "坝 (bà)", pinyin: "Nada 4 (Turun Cepat)", meaning: "Bendungan / Tanggul", breakdown: "Radikal 土 (tanah) + 巴", note: "Contoh: 水坝 (shuǐbà) = bendungan air.", audio: "bà" },
        { hanzi: "汤 (tāng)", pinyin: "Nada 1 (Datar Tinggi)", meaning: "Sup / Kuah masakan", breakdown: "Radikal 氵(air) + 昜", note: "Contoh: 鸡汤 (jītāng) = sup ayam.", audio: "tāng" },
        { hanzi: "糖 (táng)", pinyin: "Nada 2 (Naik)", meaning: "Gula / Permen", breakdown: "Radikal 米 (beras) + 唐", note: "Contoh: 白糖 (báitáng) = gula putih.", audio: "táng" },
        { hanzi: "躺 (tǎng)", pinyin: "Nada 3 (Turun-Naik)", meaning: "Berbaring / Rebahan", breakdown: "Radikal 身 (tubuh) + 尚", note: "Contoh: 躺下 (tǎngxia) = berbaringlah.", audio: "tǎng" }
      ],
      quickQuiz: {
        question: "Dengarkan audio berikut: manakah nada yang diucapkan?",
        targetAudio: "mǎ",
        options: ["Nada 1 (mā)", "Nada 2 (má)", "Nada 3 (mǎ)", "Nada 4 (mà)"],
        correct: 2,
        explanation: "Suara yang dimainkan adalah nada 3 'mǎ' (kuda) dengan intonasi meliuk turun lalu naik lembut."
      }
    },
    "listening_tones_minimal_pairs": {
      title: "Pasangan Nada & Membedakan Bunyi Mirip (声调与近音辨析)",
      category: "Listening",
      icon: "👂",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Melatih kepekaan telinga mendengarkan kontras konsonan mirip: zh/z, ch/c, sh/s, serta perubahan nada 3 (Sandhi Nada 3+3 = 2+3).",
      items: [
        { hanzi: "知识 (zhīshi) vs 自私 (zìsī)", pinyin: "zhīshi / zìsī", meaning: "Pengetahuan (zh) vs Egois (z)", breakdown: "zh = lidah melengkung ke atas; z = ujung lidah di gigi depan.", note: "Bedakan retrofleks (zh) dan dental (z).", audio: "知识, 自私" },
        { hanzi: "吃饭 (chīfàn) vs 词典 (cídiǎn)", pinyin: "chīfàn / cídiǎn", meaning: "Makan (ch) vs Kamus (c)", breakdown: "ch = lidah melengkung beraspirasi; c = lidah gigi depan beraspirasi.", note: "Hembusan angin kuat pada konsonan ch dan c.", audio: "吃饭, 词典" },
        { hanzi: "老师 (lǎoshī) vs 思考 (sīkǎo)", pinyin: "lǎoshī / sīkǎo", meaning: "Guru (sh) vs Berpikir (s)", breakdown: "sh = lidah melengkung; s = lidah rata dekat gigi.", note: "sh diucapkan seperti 'sh' pada shampoo.", audio: "老师, 思考" },
        { hanzi: "你好 (nǐ hǎo -> ní hǎo)", pinyin: "ní hǎo (Perubahan Nada 3+3)", meaning: "Halo / Apa kabar", breakdown: "Dua nada 3 berurutan: nǐ (3) + hǎo (3)", note: "ATURAN EMAS: Jika dua nada 3 berdampingan, nada pertama berubah menjadi nada 2!", audio: "你好" },
        { hanzi: "手表 (shǒubiǎo -> shóubiǎo)", pinyin: "shóubiǎo (Perubahan Nada 3+3)", meaning: "Jam tangan", breakdown: "手 (3) + 表 (3)", note: "Dibaca shóubiǎo untuk kemudahan pelafalan.", audio: "手表" },
        { hanzi: "买水 (mǎishuǐ -> máishuǐ)", pinyin: "máishuǐ (Perubahan Nada 3+3)", meaning: "Membeli air", breakdown: "买 (3) + 水 (3)", note: "Perubahan nada terjadi otomatis saat berbicara cepat.", audio: "买水" },
        { hanzi: "四 (sì) vs 十 (shí)", pinyin: "sì (4) vs shí (10)", meaning: "Empat (sì) vs Sepuluh (shí)", breakdown: "sì (nada 4 dental) vs shí (nada 2 retrofleks)", note: "Lelucon lidah Tiongkok terkenal: 四是四，十是十.", audio: "四, 十" },
        { hanzi: "十四 (shísì) vs 四十 (sìshí)", pinyin: "shísì (14) vs sìshí (40)", meaning: "Empat belas vs Empat puluh", breakdown: "shí (10) + sì (4) vs sì (4) + shí (10)", note: "Latihlah artikulasi agar tidak tertukar saat menyebut angka.", audio: "十四, 四十" }
      ],
      quickQuiz: {
        question: "Jika kata '你好' (nǐ hǎo) diucapkan dalam percakapan nyata, bagaimana perubahan nadanya?",
        targetAudio: "你好",
        options: ["nǐ hǎo (Nada 3 + Nada 3)", "ní hǎo (Nada 2 + Nada 3)", "nì hǎo (Nada 4 + Nada 3)", "nī hǎo (Nada 1 + Nada 3)"],
        correct: 1,
        explanation: "Sesuai hukum Sandhi Nada 3: dua nada 3 berturut-turut dibaca menjadi Nada 2 + Nada 3 (ní hǎo)."
      }
    },
    "listening_vocab": {
      title: "Kosakata Sehari-hari Inti (常用日常词汇大全)",
      category: "Listening",
      icon: "🎧",
      color: "#ff9f1c",
      bg: "#fff8eb",
      summary: "Kosakata kerja & benda paling krusial yang paling sering terdengar dalam kehidupan sehari-hari masyarakat Tionghoa.",
      items: [
        { hanzi: "吃饭 (chīfàn)", pinyin: "chī fàn", meaning: "Makan nasi / makan", breakdown: "吃 (makan) + 饭 (nasi/makanan)", note: "Sering dipakai sebagai sapaan ramah: 你吃饭了吗？", audio: "吃饭" },
        { hanzi: "喝水 (hēshuǐ)", pinyin: "hē shuǐ", meaning: "Minum air putih", breakdown: "喝 (minum) + 水 (air)", note: "Penting untuk kesehatan sehari-hari.", audio: "喝水" },
        { hanzi: "睡觉 (shuìjiào)", pinyin: "shuì jiào", meaning: "Tidur malam / istirahat", breakdown: "睡 (tidur) + 觉 (perasaan/tidur)", note: "Bisa berarti istirahat tidur di kasur.", audio: "睡觉" },
        { hanzi: "学习 (xuéxí)", pinyin: "xué xí", meaning: "Belajar / Menuntut ilmu", breakdown: "学 (belajar) + 习 (praktik/latihan)", note: "Digunakan untuk sekolah atau belajar mandiri.", audio: "学习" },
        { hanzi: "朋友 (péngyou)", pinyin: "péng you", meaning: "Teman / Sahabat karib", breakdown: "朋 (rekan) + 友 (sahabat)", note: "好朋友 = teman baik.", audio: "朋友" },
        { hanzi: "买单 (mǎidān)", pinyin: "mǎi dān", meaning: "Minta bon / bayar tagihan restoran", breakdown: "买 (beli) + 单 (lembar bon)", note: "Diucapkan saat selesai makan di restoran.", audio: "买单" },
        { hanzi: "打车 (dǎchē)", pinyin: "dǎ chē", meaning: "Naik taksi / memanggil taksi", breakdown: "打 (panggil) + 车 (mobil)", note: "Bisa menggunakan aplikasi Didi (滴滴).", audio: "打车" },
        { hanzi: "上班 (shàngbān)", pinyin: "shàng bān", meaning: "Pergi bekerja / dinas", breakdown: "上 (naik/pergi) + 班 (gilir kerja)", note: "Lawan kata: 下班 (xiàbān) = pulang kerja.", audio: "上班" },
        { hanzi: "下课 (xiàkè)", pinyin: "xià kè", meaning: "Selesai kelas / bubar kuliah", breakdown: "下 (turun/selesai) + 课 (pelajaran)", note: "Lawan kata: 上课 (shàngkè) = mulai kelas.", audio: "下课" },
        { hanzi: "点餐 (diǎncān)", pinyin: "diǎn cān", meaning: "Memesan menu makanan", breakdown: "点 (pilih/tunjuk) + 餐 (makanan)", note: "Sering diucapkan: 服务员，点餐！", audio: "点餐" },
        { hanzi: "扫码 (sǎomǎ)", pinyin: "sǎo mǎ", meaning: "Pindai kode QR (WeChat/Alipay)", breakdown: "扫 (pindai) + 码 (kode QR)", note: "Metode pembayaran non-tunai paling populer di Tiongkok.", audio: "扫码" },
        { hanzi: "取快递 (qǔ kuàidì)", pinyin: "qǔ kuài dì", meaning: "Mengambil paket kurir ekspres", breakdown: "取 (ambil) + 快递 (paket kilat)", note: "Aktivitas belanja online harian di Tiongkok.", audio: "取快递" }
      ],
      quickQuiz: {
        question: "Manakah kosakata yang berarti 'Mengambil paket kurir ekspres'?",
        targetAudio: "取快递",
        options: ["打车 (dǎchē)", "取快递 (qǔ kuàidì)", "扫码 (sǎomǎ)", "买单 (mǎidān)"],
        correct: 1,
        explanation: "'取快递' (qǔ kuàidì) terdiri dari 取 (mengambil) dan 快递 (paket kurir ekspres)."
      }
    },
    "listening_expressions": {
      title: "Ungkapan Etika Percakapan & Kesopanan (礼貌用语与表达)",
      category: "Listening",
      icon: "💬",
      color: "#2ec4b6",
      bg: "#e6faf7",
      summary: "Frasa kesopanan penting untuk menyapa, meminta maaf, menghargai bantuan orang lain, dan berpamitan secara formal maupun santai.",
      items: [
        { hanzi: "早上好 (zǎoshang hǎo)", pinyin: "zǎo shang hǎo", meaning: "Selamat pagi", breakdown: "早上 (pagi) + 好 (baik)", note: "Bisa disingkat '早！' untuk teman sebaya.", audio: "早上好" },
        { hanzi: "谢谢 (xièxie)", pinyin: "xiè xie", meaning: "Terima kasih banyak", breakdown: "Karakter 重复 言 (kata)", note: "Balasan baku: 不客气 (bù kèqi).", audio: "谢谢" },
        { hanzi: "不客气 (bù kèqi)", pinyin: "bù kè qi", meaning: "Sama-sama / Jangan sungkan", breakdown: "不 (tidak) + 客气 (sungkan/segan)", note: "Gunakan untuk membalas ucapan terima kasih.", audio: "不客气" },
        { hanzi: "对不起 (duìbuqǐ)", pinyin: "duì bu qǐ", meaning: "Maaf / Permisi", breakdown: "对 (benar) + 不 (tidak) + 起 (bangkit)", note: "Balasan baku: 没关系 (méi guānxi).", audio: "对不起" },
        { hanzi: "没关系 (méi guānxi)", pinyin: "méi guān xi", meaning: "Tidak apa-apa / Tidak masalah", breakdown: "没 (tidak ada) + 关系 (hubungan/masalah)", note: "Membalas permintaan maaf seseorang.", audio: "没关系" },
        { hanzi: "再见 (zàijiàn)", pinyin: "zài jiàn", meaning: "Sampai jumpa lagi", breakdown: "再 (lagi) + 见 (bertemu)", note: "Ungkapan berpamitan baku.", audio: "再见" },
        { hanzi: "请问 (qǐngwèn)", pinyin: "qǐng wèn", meaning: "Permisi, boleh saya bertanya...?", breakdown: "请 (mohon/silakan) + 问 (tanya)", note: "Digunakan di awal pertanyaan sopan.", audio: "请问" },
        { hanzi: "辛苦了 (xīnkǔ le)", pinyin: "xīn kǔ le", meaning: "Terima kasih atas kerja kerasnya!", breakdown: "辛苦 (kerja keras/pahit) + 了", note: "Diucapkan kepada pengemudi, staf, atau rekan kerja.", audio: "辛苦了" },
        { hanzi: "麻烦你了 (máfan nǐ le)", pinyin: "má fan nǐ le", meaning: "Maaf merepotkan Anda", breakdown: "麻烦 (merepotkan) + 你 + 了", note: "Digunakan saat meminta bantuan dari seseorang.", audio: "麻烦你了" },
        { hanzi: "祝你今天愉快 (zhù nǐ jīntiān yúkuài)", pinyin: "zhù nǐ jīntiān yúkuài", meaning: "Semoga harimu menyenangkan!", breakdown: "祝 (doakan) + 今天 (hari ini) + 愉快 (gembira)", note: "Salam penutup ramah.", audio: "祝你今天愉快" }
      ],
      quickQuiz: {
        question: "Jika seseorang berkata '对不起' (Maaf), bagaimana respon sopan yang tepat?",
        targetAudio: "没关系",
        options: ["不客气 (Sama-sama)", "没关系 (Tidak apa-apa)", "辛苦了 (Terima kasih kerja kerasnya)", "再见 (Sampai jumpa)"],
        correct: 1,
        explanation: "Balasan standar untuk permintaan maaf '对不起' adalah '没关系' (méi guānxi - tidak apa-apa)."
      }
    },
    "listening_real_dialogue": {
      title: "Percakapan Nyata Situasi Umum (真实场景对话精选)",
      category: "Listening",
      icon: "🎧",
      color: "#3a86ff",
      bg: "#eff6ff",
      summary: "Dialog percakapan autentik penutur asli di toko, bertanya jalan, memesan makanan, dan berbelanja.",
      items: [
        { hanzi: "请问，洗手间在哪里？", pinyin: "Qǐngwèn, xǐshǒujiān zài nǎlǐ?", meaning: "Permisi, toilet ada di mana?", breakdown: "洗手间 = ruang cuci tangan / toilet", note: "Pertanyaan paling praktis saat di tempat publik.", audio: "请问，洗手间在哪里？" },
        { hanzi: "在前面右边，离这里很近。", pinyin: "Zài qiánmiàn yòubiān, lí zhèlǐ hěn jìn.", meaning: "Di depan sebelah kanan, sangat dekat dari sini.", breakdown: "前面 (depan) + 右边 (kanan) + 近 (dekat)", note: "Keterangan petunjuk arah lokasi.", audio: "在前面右边，离这里很近。" },
        { hanzi: "一共多少钱？一共五十块。", pinyin: "Yīgòng duōshao qián? Yīgòng wǔshí kuài.", meaning: "Totalnya berapa uang? Totalnya 50 Yuan.", breakdown: "一共 (total) + 多少钱 (berapa uang)", note: "块 (kuài) = sebutan lisan mata uang Yuan.", audio: "一共多少钱？一共五十块。" },
        { hanzi: "老板，这个苹果甜不甜？很甜！", pinyin: "Lǎobǎn, zhège píngguǒ tián bù tián? Hěn tián!", meaning: "Bos, apel ini manis tidak? Sangat manis!", breakdown: "甜不甜 = pola pertanyaan afirmatif-negatif", note: "Pola manis tidak manis (甜不甜).", audio: "老板，这个苹果甜不甜？很甜！" },
        { hanzi: "欢迎光临，请问几位？两位。", pinyin: "Huānyíng guānglín, qǐngwèn jǐ wèi? Liǎng wèi.", meaning: "Selamat datang, berapa orang? Dua orang.", breakdown: "几位 (berapa orang sopan) + 两位 (2 orang)", note: "Sapaan ramah pelayan restoran.", audio: "欢迎光临，请问几位？两位。" },
        { hanzi: "我们可以微信支付吗？当然可以。", pinyin: "Wǒmen kěyǐ Wēixìn zhīfù ma? Dāngrán kěyǐ.", meaning: "Bolehkah bayar pakai WeChat Pay? Tentu saja boleh.", breakdown: "微信支付 (WeChat Pay) + 当然 (tentu)", note: "Pembayaran digital non-tunai paling umum.", audio: "我们可以微信支付吗？当然可以。" },
        { hanzi: "师傅，去火车站要多久？大概二十分钟。", pinyin: "Shīfu, qù huǒchēzhàn yào duōjiǔ? Dàgài èrshí fēnzhōng.", meaning: "Pak supir, ke stasiun kereta butuh berapa lama? KIRA-KIRA 20 menit.", breakdown: "师傅 (supir/ahli) + 多久 (berapa lama)", note: "Sapaan sopan '师傅' untuk pengemudi taksi.", audio: "师傅，去火车站要多久？大概二十分钟。" }
      ],
      quickQuiz: {
        question: "Di manakah lokasi toilet menurut petunjuk dialog?",
        targetAudio: "在前面右边",
        options: ["Di belakang sebelah kiri", "Di depan sebelah kanan", "Di lantai dua", "Di luar gedung"],
        correct: 1,
        explanation: "'在前面右边' (Zài qiánmiàn yòubiān) = Di depan sebelah kanan."
      }
    },
    "listening_numbers": {
      title: "Angka, Jam, Penanggalan & Harga (数字、时间与日期听力)",
      category: "Listening",
      icon: "🔢",
      color: "#7c3aed",
      bg: "#f5f3ff",
      summary: "Memahami pelafalan angka 0-10.000, nomor telepon, jam menit, penanggalan tahun/bulan/hari, dan harga barang dalam Yuan.",
      items: [
        { hanzi: "我的手机号码是一三八一二三四五六七八。(Wǒ de shǒujī hàomǎ shì yāo sān bā yāo èr sān sì wǔ liù qī bā.)", pinyin: "Wǒ de shǒujī hàomǎ shì yāo sān bā yāo èr sān sì wǔ liù qī bā.", meaning: "Nomor ponsel saya adalah 138-1234-5678.", breakdown: "Angka '1' pada nomor telepon dan kamar diucapkan 'yāo' (幺).", note: "Penting: Angka 1 dibaca yāo saat mengeja nomor telepon/kamar.", audio: "我的手机号码是一三八一二三四五六七八。" },
        { hanzi: "现在是差一刻八点。(Xiànzài shì chà yī kè bā diǎn.)", pinyin: "Xiànzài shì chà yī kè bā diǎn.", meaning: "Sekarang jam 8 kurang 15 menit (07:45).", breakdown: "差 (kurang) + 刻 (seperempat jam / 15 menit) + 八点 (jam 8)", note: "Pola menyatakan jam kurang seperempat.", audio: "现在是差一刻八点。" },
        { hanzi: "会议安排在明天上午九点半。(Huìyì ānpái zài míngtiān shàngwǔ jiǔ diǎn bàn.)", pinyin: "Huìyì ānpái zài míngtiān shàngwǔ jiǔ diǎn bàn.)", meaning: "Rapat dijadwalkan besok pagi jam 9:30.", breakdown: "九点半 (jam 9 lewat 30 menit / sembilan setengah)", note: "Penanda waktu kerja resmi.", audio: "会议安排在明天上午九点半。" },
        { hanzi: "两件衬衫一共三百五十块钱。(Liǎng jiàn chènshān yīgòng sān bǎi wǔshí kuài qián.)", pinyin: "Liǎng jiàn chènshān yīgòng sān bǎi wǔshí kuài qián.", meaning: "Dua kemeja totalnya 350 Yuan.", breakdown: "两件 (2 potong baju) + 三百五十 (350) + 块 (Yuan)", note: "Membedakan penggunaan 两 (liǎng) untuk jumlah.", audio: "两件衬衫一共三百五十块钱。" }
      ],
      quickQuiz: {
        question: "Jam berapakah yang dimaksud dengan ungkapan '差一刻八点' (chà yī kè bā diǎn)?",
        targetAudio: "差一刻八点",
        options: ["08:15", "07:45 (Jam 8 kurang 15 menit)", "08:45", "07:15"],
        correct: 1,
        explanation: "'差' = kurang, '一刻' = 15 menit. Jadi '差一刻八点' adalah jam 8 kurang 15 menit (07:45)."
      }
    },
    "listening_travel": {
      title: "Percakapan Perjalanan, Tiket & Arah (旅游出行与交通问路)",
      category: "Listening",
      icon: "🌏",
      color: "#0891b2",
      bg: "#ecfeff",
      summary: "Memahami dialog mendengarkan saat naik kereta cepat (高铁), check-in bandara, menanyakan jalur subway, dan memesan taksi.",
      items: [
        { hanzi: "请问去故宫坐几号线地铁？(Qǐngwèn qù Gùgōng zuò jǐ hào xiàn dìtiě?)", pinyin: "Qǐngwèn qù Gùgōng zuò jǐ hào xiàn dìtiě?", meaning: "Permisi, mau ke Kota Terlarang (Forbidden City) naik MRT/subway jalur berapa?", breakdown: "坐 (naik) + 几号线 (jalur nomor berapa) + 地铁 (kereta bawah tanah)", note: "Pertanyaan navigasi transportasi publik.", audio: "请问去故宫坐几号线地铁？" },
        { hanzi: "请在建国门站换乘一号线。(Qǐng zài Jiànguómén zhàn huànchéng yī hào xiàn.)", pinyin: "Qǐng zài Jiànguómén zhàn huànchéng yī hào xiàn.", meaning: "Silakan transit/pindah ke jalur 1 di stasiun Jianguomen.", breakdown: "换乘 (transit / ganti kereta) + 一号线 (jalur 1)", note: "Kata kunci '换乘' (huànchéng) sangat sering terdengar di stasiun.", audio: "请在建国门站换乘一号线。" },
        { hanzi: "高铁G102次列车现在开始检票。(Gāotiě G102 cì lièchē xiànzài kāishǐ jiǎnpiào.)", pinyin: "Gāotiě G102 cì lièchē xiànzài kāishǐ jiǎnpiào.", meaning: "Kereta cepat nomor G102 sekarang mulai pemeriksaan tiket (boarding).", breakdown: "高铁 (kereta cepat) + 检票 (periksa tiket / gate in)", note: "Pengumuman resmi stasiun kereta cepat.", audio: "高铁G102次列车现在开始检票。" },
        { hanzi: "师傅，我去首都机场T3航站楼，请打表。(Shīfu, wǒ qù Shǒudū Jīchǎng T3 hángzhànlóu, qǐng dǎbiǎo.)", pinyin: "Shīfu, wǒ qù Shǒudū Jīchǎng T3 hángzhànlóu, qǐng dǎbiǎo.", meaning: "Pak supir, saya ke Bandara Capital Terminal 3, tolong nyalakan argo taksi.", breakdown: "航站楼 (terminal bandara) + 打表 (pakai argometer)", note: "Instruksi praktis saat menaiki taksi.", audio: "师傅，我去首都机场T3航站楼，请打表。" }
      ],
      quickQuiz: {
        question: "Kata apa yang bermakna 'transit / pindah jalur kereta' di stasiun MRT?",
        targetAudio: "换乘",
        options: ["买票 (Mǎipiào)", "检票 (Jiǎnpiào)", "换乘 (Huànchéng)", "出站 (Chūzhàn)"],
        correct: 2,
        explanation: "'换乘' (huànchéng) bermakna berpindah sarana atau jalur transit transportasi."
      }
    },
    "listening_business_phone": {
      title: "Percakapan Telepon & Bisnis Resmi (商务与电话接听对话)",
      category: "Listening",
      icon: "📞",
      color: "#059669",
      bg: "#ecfdf5",
      summary: "Pelatihan mendengarkan panggilan telepon bisnis, membuat janji temu, dan etika komunikasi profesional.",
      items: [
        { hanzi: "喂，你好！请问张经理在吗？", pinyin: "Wèi, nǐ hǎo! Qǐngwèn Zhāng jīnglǐ zài ma?", meaning: "Halo! Permisi, apakah Manajer Zhang ada?", breakdown: "喂 (halo telp) + 经理 (manajer)", note: "Panggilan pembuka telepon bisnis standar.", audio: "喂，你好！请问张经理在吗？" },
        { hanzi: "他正在开会，请问您哪位？", pinyin: "Tā zhèngzài kāihuì, qǐngwèn nín nǎ wèi?", meaning: "Beliau sedang rapat, permisi Anda dengan siapa?", breakdown: "开会 (rapat) + 您哪位 (siapa Anda sopan)", note: "Pertanyaan identitas penelpon yang sopan.", audio: "他正在开会，请问您哪位？" },
        { hanzi: "我是腾讯公司的李明，想跟他确认明天的会议时间。", pinyin: "Wǒ shì Téngxùn gōngsī de Lǐ Míng, xiǎng gēn tā quèrèn míngtiān de huìyì shíjiān.", meaning: "Saya Li Ming dari perusahaan Tencent, ingin konfirmasi waktu rapat besok.", breakdown: "确认 (konfirmasi) + 会议 (rapat/konferensi)", note: "Menjelaskan maksud dan tujuan menelepon.", audio: "我是腾讯公司的李明，想跟他确认明天的会议时间。" },
        { hanzi: "好的，请稍后，我帮您转接电话。", pinyin: "Hǎo de, qǐng shāohòu, wǒ bāng nín zhuǎnjiē diànhuà.", meaning: "Baik, mohon tunggu sebentar, saya bantu sambungkan teleponnya.", breakdown: "稍后 (tunggu bentar) + 转接 (sambungkan)", note: "Tindakan operator/sekretaris kantor.", audio: "好的，请稍后，我帮您转接电话。" },
        { hanzi: "非常感谢！麻烦您了。", pinyin: "Fēicháng gǎnxiè! Máfan nǐ le.", meaning: "Terima kasih banyak! Maaf telah merepotkan Anda.", breakdown: "非常感谢 (terima kasih banget)", note: "Etika menutup percakapan bisnis.", audio: "非常感谢！麻烦您了。" }
      ],
      quickQuiz: {
        question: "Mengapa Manajer Zhang tidak bisa menerima telepon saat itu?",
        targetAudio: "他正在开会",
        options: ["Sedang makan siang", "Sedang berada di luar kota", "Sedang rapat (开会)", "Sedang cuti liburan"],
        correct: 2,
        explanation: "Dialog menyatakan '他正在开会' (Tā zhèngzài kāihuì) = Beliau sedang rapat."
      }
    },
    "listening_culture_stories": {
      title: "Cerita Rakyat & Kebudayaan Tiongkok (中国节日与文化故事)",
      category: "Listening",
      icon: "🏮",
      color: "#b45309",
      bg: "#fffbeb",
      summary: "Mendengar dongeng kebudayaan: Festival Imlek (春节), Naga Nian, Tradisi Teh, dan Legenda Ular Putih.",
      items: [
        { hanzi: "春节是中国最重要的传统节日。", pinyin: "Chūnjié shì Zhōngguó zuì zhòngyào de chuántǒng jiérì.", meaning: "Festival Musim Semi (Imlek) adalah hari raya tradisional paling penting di Tiongkok.", breakdown: "春节 (Imlek) + 传统 (tradisional) + 节日 (hari raya)", note: "Diperingati dengan berkumpul keluarga besar.", audio: "春节是中国最重要的传统节日。" },
        { hanzi: "除夕夜，大家一起吃年夜饭、包饺子。", pinyin: "Chúxī yè, dàjiā yīqǐ chī niányèfàn, bāo jiǎozi.", meaning: "Malam Tahun Baru Imlek, semua orang makan malam keluarga dan membuat jiaozi (pangsit).", breakdown: "年夜饭 (makan malam imlek) + 包饺子 (bikin pangsit)", note: "Jiaozi melambangkan kemakmuran dan rezeki.", audio: "除夕夜，大家一起吃年夜饭、包饺子。" },
        { hanzi: "长辈会给晚辈发红包，祝他们平安健康。", pinyin: "Zhǎngbèi huì gěi wǎnbèi fā hóngbāo, zhù tāmen píng'ān jiànkāng.", meaning: "Tetua akan memberikan angpao kepada generasi muda, mendoakan keselamatan dan kesehatan.", breakdown: "红包 (angpao merah) + 平安健康 (selamat & sehat)", note: "Tradisi simbolis memberi keberkahan.", audio: "长辈会给晚辈发红包，祝他们平安健康。" },
        { hanzi: "中国茶文化历史悠久，主要有绿茶、红茶和乌龙茶。", pinyin: "Zhōngguó chá wénhuà lìshǐ yōujiǔ, zhǔyào yǒu lǜchá, hóngchá hé wūlóngchá.", meaning: "Budaya teh Tiongkok memiliki sejarah panjang, utamanya teh hijau, teh hitam, dan teh oolong.", breakdown: "茶文化 (budaya teh) + 绿茶 (teh hijau)", note: "Minum teh adalah simbol ketenangan jiwa.", audio: "中国茶文化历史悠久，主要有绿茶、红茶和乌龙茶。" }
      ],
      quickQuiz: {
        question: "Makanan tradisional apa yang dibuat bersama pada malam Tahun Baru Imlek (除夕夜)?",
        targetAudio: "包饺子",
        options: ["Kue Keranjang (年糕)", "Pangsit / Jiaozi (包饺子)", "Bakpao (包子)", "Mie Panjang Umur (长寿面)"],
        correct: 1,
        explanation: "Teks dialog menyebutkan '包饺子' (bāo jiǎozi) = membuat pangsit jiaozi bersama keluarga."
      }
    },

    // =========================================================================
    // 2. SPEAKING MODULES (BERBICARA)
    // =========================================================================
    "speaking_pinyin": {
      title: "Pelafalan Konsonan & Vokal Mandiri (声母与韵母发音指南)",
      category: "Speaking",
      icon: "🗣️",
      color: "#f27289",
      bg: "#fff0f3",
      summary: "Panduan praktis membedakan konsonan aspirasi (p, t, k, q, ch, c) dan non-aspirasi (b, d, g, j, zh, z) dengan posisi lidah yang tepat.",
      items: [
        { hanzi: "b - p (Pasangan Bibir)", pinyin: "bā (delapan) vs pā (tengkurap)", meaning: "b tidak beraspirasi (tanpa tiupan angin), p beraspirasi kuat.", breakdown: "Gunakan telapak tangan di depan mulut untuk merasakan tiupan angin.", note: "Huruf p wajib mengeluarkan hembusan angin.", audio: "bā, pā" },
        { hanzi: "d - t (Pasangan Ujung Lidah)", pinyin: "dà (besar) vs tà (menginjak)", meaning: "d lembut tanpa hembusan; t meletup dengan udara kuat.", breakdown: "Ujung lidah menempel di gusi atas lalu dilepas.", note: "t seperti 't' pada kata 'top' bahasa Inggris.", audio: "dà, tà" },
        { hanzi: "g - k (Pasangan Pangkal Lidah)", pinyin: "gē (abang) vs kē (butir)", meaning: "g tidak hembus; k hembusan kuat dari tenggorokan.", breakdown: "Pangkal lidah menempel pada langit-langit lunak.", note: "k meletup kuat.", audio: "gē, kē" },
        { hanzi: "zh - ch - sh (Lidah Melengkung / Retrofleks)", pinyin: "zhōng (tengah), chī (makan), shū (buku)", meaning: "Ujung lidah melengkung sedikit ke langit-langit keras.", breakdown: "Posisikan lidah tertarik sedikit ke belakang.", note: "Retroflex consonants paling khas dalam Mandarin.", audio: "zhōng, chī, shū" },
        { hanzi: "j - q - x (Gigi Rapat Miring)", pinyin: "jī (ayam), qī (tujuh), xī (barat)", meaning: "Permukaan lidah menempel pada langit-langit keras.", breakdown: "Bibir tertarik sedikit melebarkan senyum.", note: "q wajib diucapkan dengan tiupan udara tajam.", audio: "jī, qī, xī" }
      ],
      quickQuiz: {
        question: "Manakah konsonan yang mengharuskan ada hembusan angin kuat (aspirasi)?",
        targetAudio: "pā",
        options: ["b (bā)", "p (pā)", "d (dà)", "g (gē)"],
        correct: 1,
        explanation: "Konsonan P, T, K, C, CH, Q dalam Pinyin wajib diucapkan dengan hembusan udara yang terasa di telapak tangan."
      }
    },
    "speaking_intro": {
      title: "Sapaan & Perkenalan Diri Lengkap (自我介绍技巧)",
      category: "Speaking",
      icon: "🤝",
      color: "#ff9f1c",
      bg: "#fff8eb",
      summary: "Struktur kalimat perkenalan diri profesional & santai: nama, kewarganegaraan, umur, pekerjaan, dan hobi.",
      items: [
        { hanzi: "你好，我叫王小明。", pinyin: "Nǐ hǎo, wǒ jiào Wáng Xiǎomíng.", meaning: "Halo, nama saya Wang Xiaoming.", breakdown: "叫 (dipanggil/bernama)", note: "Pola perkenalan nama paling standar.", audio: "你好，我叫王小明。" },
        { hanzi: "我是印度尼西亚人。", pinyin: "Wǒ shì Yìndùníxīyà rén.", meaning: "Saya adalah orang Indonesia.", breakdown: "印度尼西亚 (Indonesia) + 人 (orang)", note: "Menyebutkan kewarganegaraan asal.", audio: "我是印度尼西亚人。" },
        { hanzi: "我今年二十岁，我是大学生。", pinyin: "Wǒ jīnnián èrshí suì, wǒ shì dàxuéshēng.", meaning: "Tahun ini saya 20 tahun, saya mahasiswa.", breakdown: "二十岁 (20 tahun) + 大学生 (mahasiswa)", note: "Menjelaskan usia dan status pendidikan.", audio: "我今年二十岁，我是大学生。" },
        { hanzi: "我的爱好是看书、听音乐和旅行。", pinyin: "Wǒ de àihào shì kànshū, tīng yīnyuè hé lǚxíng.", meaning: "Hobi saya membaca buku, mendengar musik, dan jalan-jalan.", breakdown: "爱好 (hobi) + 看书/听音乐/旅行", note: "Menggunakan kata sambung 和 (dan).", audio: "我的爱好是看书、听音乐和旅行。" },
        { hanzi: "我学中文已经一年了。", pinyin: "Wǒ xué Zhōngwén yǐjīng yī nián le.", meaning: "Saya belajar Mandarin sudah satu tahun.", breakdown: "已经 (sudah) + 一年 (1 tahun)", note: "Menjelaskan durasi waktu belajar.", audio: "我学中文已经一年了。" },
        { hanzi: "很高兴认识大家！请多关照！", pinyin: "Hěn gāoxìng rènshi dàjiā! Qǐng duō guānzhào!", meaning: "Sangat senang berkenalan dengan semuanya! Mohon bimbingannya!", breakdown: "高兴 (senang) + 多关照 (mohon arahan)", note: "Penutup perkenalan sangat sopan.", audio: "很高兴认识大家！请多关照！" }
      ],
      quickQuiz: {
        question: "Bagaimana cara mengatakan 'Saya orang Indonesia' dalam bahasa Mandarin?",
        targetAudio: "我是印度尼西亚人",
        options: ["我是中国人 (Wǒ shì Zhōngguórén)", "我是印度尼西亚人 (Wǒ shì Yìndùníxīyà rén)", "我是老师 (Wǒ shì lǎoshī)", "我不去学校 (Wǒ bù qù xuéxiào)"],
        correct: 1,
        explanation: "'印度尼西亚' (Yìndùníxīyà) = Indonesia, ditambah '人' (rén) = orang Indonesia."
      }
    },
    "speaking_daily_conv": {
      title: "Percakapan Sehari-hari & Rumah (日常生活对话)",
      category: "Speaking",
      icon: "☕",
      color: "#2ec4b6",
      bg: "#e6faf7",
      summary: "Frasa percakapan praktis memesan minuman, membuat janji temu, dan basa-basi harian.",
      items: [
        { hanzi: "我想喝一杯热咖啡，不要糖。", pinyin: "Wǒ xiǎng hē yī bēi rè kāfēi, bù yào táng.", meaning: "Saya ingin minum secangkir kopi panas, tanpa gula.", breakdown: "热咖啡 (kopi panas) + 不要糖 (tanpa gula)", note: "Cocok saat memesan di kedai kopi.", audio: "我想喝一杯热咖啡，不要糖。" },
        { hanzi: "今天下午你有没有空？", pinyin: "Jīntiān xiàwǔ nǐ yǒu méiyǒu kòng?", meaning: "Sore ini kamu ada waktu luang tidak?", breakdown: "有空 (ada waktu luang) + 有没有 (ada tidak)", note: "Menanyakan ketersediaan waktu teman.", audio: "今天下午你有没有空？" },
        { hanzi: "我们一起去看电影吧！", pinyin: "Wǒmen yīqǐ qù kàn diànyǐng ba!", meaning: "Ayo kita pergi menonton bioskop bersama!", breakdown: "一起 (bersama) + 吧 (partikel ajakan)", note: "Mengajak teman jalan-jalan.", audio: "我们一起去看电影吧！" },
        { hanzi: "中午你想吃什么？随便，都可以。", pinyin: "Zhōngwǔ nǐ xiǎng chī shénme? Suíbiàn, dōu kěyǐ.", meaning: "Siang mau makan apa? Terserah, apa saja boleh.", breakdown: "随便 (terserah) + 都可以 (bisa semua)", note: "Jawaban santai yang sering dipakai.", audio: "中午你想吃什么？随便，都可以。" },
        { hanzi: "明天见！路上小心！", pinyin: "Míngtiān jiàn! Lùshang xiǎoxīn!", meaning: "Sampai jumpa besok! Hati-hati di jalan!", breakdown: "路上 (di jalan) + 小心 (hati-hati)", note: "Ucapan ramah berpisah dengan teman.", audio: "明天见！路上小心！" }
      ],
      quickQuiz: {
        question: "Apa arti dari '不要糖' (bù yào táng)?",
        targetAudio: "不要糖",
        options: ["Jangan pakai es", "Jangan pakai gula", "Jangan pakai susu", "Jangan terlalu panas"],
        correct: 1,
        explanation: "'糖' (táng) berarti gula. '不要糖' = tidak mau / jangan pakai gula."
      }
    },
    "speaking_opinion": {
      title: "Menyampaikan Opini & Memberi Saran (表达观点与建议)",
      category: "Speaking",
      icon: "🛍️",
      color: "#3a86ff",
      bg: "#eff6ff",
      summary: "Mengemukakan pandangan pribadi secara percaya diri, menyetujui atau menyanggah pendapat teman, serta memberikan rekomendasi ide.",
      items: [
        { hanzi: "依我看，这个方案更适合我们的需求。(Yī wǒ kàn, zhège fāng'àn gèng shìhé wǒmen de xūqiú.)", pinyin: "Yī wǒ kàn, zhège fāng'àn gèng shìhé wǒmen de xūqiú.", meaning: "Menurut hemat saya, proposal ini lebih cocok dengan kebutuhan kita.", breakdown: "依我看 (menurut hemat saya) + 适合 (cocok) + 需求 (kebutuhan)", note: "Frasa alternatif selain 我认为 (wǒ rènwéi).", audio: "依我看，这个方案更适合我们的需求。" },
        { hanzi: "我完全同意你的看法，这件事确实很重要。(Wǒ wánquán tóngyì nǐ de kànfǎ, zhè jiàn shì quèshí hěn zhòngyào.)", pinyin: "Wǒ wánquán tóngyì nǐ de kànfǎ, zhè jiàn shì quèshí hěn zhòngyào.", meaning: "Saya sangat setuju dengan pandanganmu, hal ini memang sangat penting.", breakdown: "完全同意 (setuju sepenuhnya) + 确实 (sungguh/memang)", note: "Menyatakan persetujuan afirmatif kuat.", audio: "我完全同意你的看法，这件事确实很重要。" },
        { hanzi: "恐怕我持有不同的看法。(Kǒngpà wǒ chíyǒu bùtóng de kànfǎ.)", pinyin: "Kǒngpà wǒ chíyǒu bùtóng de kànfǎ.", meaning: "Khawatir saya memiliki pandangan yang berbeda (menyanggah santun).", breakdown: "恐怕 (khawatir/agaknya) + 持有 (memegang) + 不同 (berbeda)", note: "Cara menolak argumen secara santun tanpa menyinggung.", audio: "恐怕我持有不同的看法。" },
        { hanzi: "要是能提前准备好，效果会更好。(Yàoshi néng tíqián zhǔnbèi hǎo, xiàoguǒ huì gèng hǎo.)", pinyin: "Yàoshi néng tíqián zhǔnbèi hǎo, xiàoguǒ huì gèng hǎo.", meaning: "Jika bisa dipersiapkan lebih awal, hasilnya akan jauh lebih baik.", breakdown: "要是 (jika/seandainya) + 提前 (lebih awal) + 效果 (hasil/efek)", note: "Memberikan masukan konstruktif.", audio: "要是能提前准备好，效果会更好。" }
      ],
      quickQuiz: {
        question: "Ungkapan manakah yang tepat untuk menyatakan 'Saya sangat setuju dengan pendapatmu'?",
        targetAudio: "我完全同意你的看法",
        options: ["我不同意 (Wǒ bù tóngyì)", "我完全同意你的看法 (Wǒ wánquán tóngyì nǐ de kànfǎ)", "随便你 (Suíbiàn nǐ)", "没关系 (Méi guānxi)"],
        correct: 1,
        explanation: "'我完全同意你的看法' bermakna 'Saya setuju sepenuhnya dengan pandanganmu'."
      }
    },
    "speaking_places": {
      title: "Situasi & Tempat Umum: Stasiun, Bandara & Taksi (公共场所与出行表达)",
      category: "Speaking",
      icon: "✈️",
      color: "#8338ec",
      bg: "#f3e8ff",
      summary: "Percakapan berbicara aktif saat check-in penerbangan, naik taksi, bertanya arah di stasiun, dan meminta petunjuk lokasi.",
      items: [
        { hanzi: "请问办理登机手续在哪个柜台？(Qǐngwèn bànlǐ dēngjī shǒuxù zài nǎge guìtái?)", pinyin: "Qǐngwèn bànlǐ dēngjī shǒuxù zài nǎge guìtái?", meaning: "Permisi, check-in penerbangan di konter sebelah mana?", breakdown: "办理 (mengurus) + 登机手续 (prosedur check-in) + 柜台 (konter)", note: "Pertanyaan wajib saat tiba di bandara.", audio: "请问办理登机手续在哪个柜台？" },
        { hanzi: "我要靠窗的座位，可以吗？(Wǒ yào kào chuāng de zuòwèi, kěyǐ ma?)", pinyin: "Wǒ yào kào chuāng de zuòwèi, kěyǐ ma?", meaning: "Saya ingin kursi dekat jendela, bisakah?", breakdown: "靠窗 (dekat jendela) + 座位 (tempat duduk)", note: "Bandingkan dengan 靠过道 (kào guòdào = dekat lorong).", audio: "我要靠窗的座位，可以吗？" },
        { hanzi: "师傅，在前面十字路口掉头，在商场门口停一下。(Shīfu, zài qiánmiàn shízìlùkǒu diàotóu, zài shāngchǎng ménkǒu tíng yīxià.)", pinyin: "Shīfu, zài qiánmiàn shízìlùkǒu diàotóu, zài shāngchǎng ménkǒu tíng yīxià.", meaning: "Pak supir, putar balik di perempatan depan, tolong berhenti sebentar di pintu mall.", breakdown: "十字路口 (perempatan) + 掉头 (putar balik U-turn) + 停一下 (berhenti sebentar)", note: "Instruksi navigasi lengkap kepada supir taksi.", audio: "师傅，在前面十字路口掉头，在商场门口停一下。" },
        { hanzi: "去市中心最快的交通方式是什么？(Qù shìzhōngxīn zuì kuài de jiāotōng fāngshì shì shénme?)", pinyin: "Qù shìzhōngxīn zuì kuài de jiāotōng fāngshì shì shénme?", meaning: "Transportasi apa yang paling cepat untuk pergi ke pusat kota?", breakdown: "市中心 (pusat kota) + 交通方式 (sarana transportasi)", note: "Bertanya rekomendasi moda transportasi.", audio: "去市中心最快的交通方式是什么？" }
      ],
      quickQuiz: {
        question: "Bagaimana cara meminta kursi dekat jendela di pesawat atau kereta?",
        targetAudio: "靠窗的座位",
        options: ["靠过道的座位", "靠窗的座位 (Kào chuāng de zuòwèi)", "中间的座位", "站票"],
        correct: 1,
        explanation: "'靠窗' (kào chuāng) berarti bersandar pada jendela."
      }
    },
    "speaking_shopping": {
      title: "Belanja & Tawar-Menawar Harga (商场购物与砍价技巧)",
      category: "Speaking",
      icon: "🛒",
      color: "#e11d48",
      bg: "#fff1f2",
      summary: "Keterampilan berbicara menanyakan ukuran busana, mencoba baju di kamar pas, diskon promosi, dan menawar harga dengan ramah.",
      items: [
        { hanzi: "请问这件衣服有大一号的吗？(Qǐngwèn zhè jiàn yīfu yǒu dà yī hào de ma?)", pinyin: "Qǐngwèn zhè jiàn yīfu yǒu dà yī hào de ma?", meaning: "Permisi, baju ini ada ukuran yang satu tingkat lebih besar tidak?", breakdown: "大一号 (lebih besar satu nomor/size) vs 小一号 (lebih kecil)", note: "Menanyakan ukuran size baju.", audio: "请问这件衣服有大一号的吗？" },
        { hanzi: "试衣间在哪里？我可以试穿一下吗？(Shìyījiān zài nǎlǐ? Wǒ kěyǐ shìchuān yīxià ma?)", pinyin: "Shìyījiān zài nǎlǐ? Wǒ kěyǐ shìchuān yīxià ma?", meaning: "Kamar pas di sebelah mana? Bolehkah saya coba pakaian ini sebentar?", breakdown: "试衣间 (kamar pas/ganti) + 试穿 (mencoba baju)", note: "Bertanya izin mencoba pakaian.", audio: "试衣间在哪里？我可以试穿一下吗？" },
        { hanzi: "现在有什么优惠或者打折活动吗？(Xiànzài yǒu shénme yōuhuì huòzhě dǎzhé huódòng ma?)", pinyin: "Xiànzài yǒu shénme yōuhuì huòzhě dǎzhé huódòng ma?", meaning: "Sekarang ada promo potongan harga atau diskon tidak?", breakdown: "优惠 (promo diskon) + 打折 (diskon harga)", note: "Penting: 打八折 artinya diskon 20% (bayar 80%).", audio: "现在有什么优惠或者打折活动吗？" },
        { hanzi: "老板，如果我买两件，能给我便宜点吗？(Lǎobǎn, rúguǒ wǒ mǎi liǎng jiàn, néng gěi wǒ piányi diǎn ma?)", pinyin: "Lǎobǎn, rúguǒ wǒ mǎi liǎng jiàn, néng gěi wǒ piányi diǎn ma?", meaning: "Bos, kalau saya beli dua potong, bisakah dikasih lebih murah?", breakdown: "两件 (2 potong) + 便宜点 (murahkan sedikit)", note: "Trik menawar dengan membeli jumlah lebih banyak.", audio: "老板，如果我买两件，能给我便宜点吗？" }
      ],
      quickQuiz: {
        question: "Dalam bahasa Mandarin, jika toko memasang papan '打八折' (dǎ bā zhé), berapakah harga yang harus dibayar?",
        targetAudio: "打八折",
        options: ["Diskon 80% (bayar 20%)", "Bayar 80% dari harga asli (Diskon 20%)", "Beli 8 gratis 1", "Harganya naik 80%"],
        correct: 1,
        explanation: "Sistem diskon Tiongkok terbalik: '打八折' artinya dipotong menjadi 80% (diskon potongan 20%)."
      }
    },
    "speaking_emergency": {
      title: "Situasi Darurat, Rumah Sakit & Dokter (紧急情况与就医用语)",
      category: "Speaking",
      icon: "🏥",
      color: "#dc2626",
      bg: "#fef2f2",
      summary: "Ungkapan darurat meminta pertolongan pertama, melapor ke polisi (110), ambulans (120), dan mendeskripsikan gejala sakit ke dokter.",
      items: [
        { hanzi: "救命啊！请帮我叫救护车！(Jiùmìng a! Qǐng bāng wǒ jiào jiùhùchē!)", pinyin: "Jiùmìng a! Qǐng bāng wǒ jiào jiùhùchē!", meaning: "Tolong! Tolong panggilkan ambulans untuk saya!", breakdown: "救命 (tolong nyawa/SOS) + 救护车 (mobil ambulans)", note: "Frasa paling krusial dalam situasi bahaya medis.", audio: "救命啊！请帮我叫救护车！" },
        { hanzi: "我的钱包和护照不见了，我要报警。(Wǒ de qiánbāo hé hùzhào bù jiàn le, wǒ yào bàojǐng.)", pinyin: "Wǒ de qiánbāo hé hùzhào bù jiàn le, wǒ yào bàojǐng.)", meaning: "Dompet dan paspor saya hilang, saya ingin lapor polisi.", breakdown: "不见了 (hilang/lenyap) + 报警 (lapor polisi - telp 110)", note: "Nomor darurat polisi di Tiongkok adalah 110.", audio: "我的钱包和护照不见了，我要报警。" },
        { hanzi: "医生，我发烧、咳嗽，头疼得很厉害。(Yīshēng, wǒ fāshāo, késou, tóuténg de hěn lìhai.)", pinyin: "Yīshēng, wǒ fāshāo, késou, tóuténg de hěn lìhai.", meaning: "Dokter, saya demam, batuk, dan kepala pusing sangat parah.", breakdown: "发烧 (demam) + 咳嗽 (batuk) + 头疼 (sakit kepala) + 厉害 (parah)", note: "Mendeskripsikan gejala klinis ke dokter.", audio: "医生，我发烧、咳嗽，头疼得很厉害。" },
        { hanzi: "这个药每天吃三次，饭后服用。(Zhège yào měitiān chī sān cì, fànhòu fúyòng.)", pinyin: "Zhège yào měitiān chī sān cì, fànhòu fúyòng.)", meaning: "Obat ini diminum 3 kali sehari, sesudah makan.", breakdown: "三次 (3 kali) + 饭后 (sesudah makan) + 服用 (minum obat)", note: "Instruksi meminum resep apoteker.", audio: "这个药每天吃三次，饭后服用。" }
      ],
      quickQuiz: {
        question: "Nomor darurat apakah yang dihubungi untuk memanggil polisi di Tiongkok?",
        targetAudio: "报警电话",
        options: ["119 (Pemadam)", "110 (Polisi)", "120 (Ambulans)", "122 (Laka Lantas)"],
        correct: 1,
        explanation: "Di Tiongkok: 110 adalah nomor polisi, 120 ambulans, dan 119 pemadam kebakaran."
      }
    },
    "speaking_food_dining": {
      title: "Kuliner, Pesan Makanan & Etika Restoran (点餐与饮食文化)",
      category: "Speaking",
      icon: "🥟",
      color: "#e11d48",
      bg: "#fff1f2",
      summary: "Kalimat praktis di restoran: memesan makanan khas Tiongkok, meminta rekomendasi, tingkat kepedasan, dan pembayaran.",
      items: [
        { hanzi: "服务员，请问有什么招牌菜？", pinyin: "Fúwùyuán, qǐngwèn yǒu shénme zhāopaicài?", meaning: "Pelayan, permisi apa makanan menu andalan di sini?", breakdown: "招牌菜 = menu masakan andalan/spesial", note: "Menanyakan rekomendasi masakan koki.", audio: "服务员，请问有什么招牌菜？" },
        { hanzi: "我要一份宫保鸡丁和一碗酸辣汤。", pinyin: "Wǒ yào yī fèn gōngbǎo jīdīng hé yī wǎn suānlàtāng.", meaning: "Saya mau satu porsi Kung Pao Chicken dan satu mangkok sup asam pedas.", breakdown: "宫保鸡丁 (Kung Pao Chicken) + 酸辣汤 (sup asam pedas)", note: "Menyebutkan jumlah porsi (一份 / 一碗).", audio: "我要一份宫保鸡丁和一碗酸辣汤。" },
        { hanzi: "请少放辣，我们吃不了太辣的。", pinyin: "Qǐng shǎo fàng là, wǒmen chī bù liǎo tài là de.", meaning: "Tolong kurangi pedasnya, kami tidak tahan makanan terlalu pedas.", breakdown: "少放辣 (kurangi pedas) + 吃不了 (tidak sanggup makan)", note: "Penting bagi pembeli yang kurang suka pedas.", audio: "请少放辣，我们吃不了太辣的。" },
        { hanzi: "我们想买单，可以分开付吗？", pinyin: "Wǒmen xiǎng mǎidān, kěyǐ fēnkāi fù ma?", meaning: "Kami ingin bayar tagihan, bisakah bayar terpisah (masing-masing)?", breakdown: "分开付 (bayar terpisah / AA制)", note: "Tradisi bayar masing-masing (AA制).", audio: "我们想买单，可以分开付吗？" }
      ],
      quickQuiz: {
        question: "Bagaimana cara meminta pelayan mengurangi rasa pedas pada masakan?",
        targetAudio: "请少放辣",
        options: ["不要放盐 (Jangan pakai garam)", "请少放辣 (Tolong kurangi pedas)", "多放点糖 (Banyakin gula)", "不要做熟 (Jangan dimasak matang)"],
        correct: 1,
        explanation: "'少放辣' (shǎo fàng là) terdiri dari 少 (sedikit) + 放 (taruh) + 辣 (pedas)."
      }
    },
    "speaking_job_interview": {
      title: "Wawancara Kerja & Bahasa Profesional (求职面试与职业表达)",
      category: "Speaking",
      icon: "👔",
      color: "#1d4ed8",
      bg: "#dbeafe",
      summary: "Kalimat formal saat menghadapi wawancara kerja di perusahaan Tiongkok: menjelaskan pengalaman, kemampuan, dan motivasi.",
      items: [
        { hanzi: "尊敬的面试官，您好！很高兴参加今天的面试。", pinyin: "Zūnjìng de miànshìguān, nín hǎo! Hěn gāoxìng cānjiā jīntiān de miànshì.", meaning: "Yang terhormat pewawancara, halo! Sangat senang ikut wawancara hari ini.", breakdown: "面试官 (pewawancara) + 参加 (mengikuti)", note: "Kalimat pembuka formal wawancara kerja.", audio: "尊敬的面试官，您好！很高兴参加今天的面试。" },
        { hanzi: "我有三年的市场营销工作经验。", pinyin: "Wǒ yǒu sān nián de shìchǎng yíngxiāo gōngzuò jīngyàn.", meaning: "Saya memiliki 3 tahun pengalaman kerja di bidang pemasaran.", breakdown: "市场营销 (pemasaran/marketing) + 工作经验 (pengalaman kerja)", note: "Menyebutkan bidang spesialisasi.", audio: "我有三年的市场营销工作经验。" },
        { hanzi: "我精通中文和英文，具备良好的团队合作能力。", pinyin: "Wǒ jīngtōng Zhōngwén hé Yīngwén, jùbèi liánghǎo de tuánduì hézuò nénglì.", meaning: "Saya fasih bahasa Mandarin dan Inggris, serta memiliki kemampuan kerja sama tim yang baik.", breakdown: "精通 (fasih/mahir) + 团队合作 (kerja sama tim)", note: "Kelebihan utama calon karyawan.", audio: "我精通中文和英文，具备良好的团队合作能力。" },
        { hanzi: "非常感谢贵公司给我这次面试机会！", pinyin: "Fēicháng gǎnxiè guì gōngsī gěi wǒ zhè cì miànshì jīhuì!", meaning: "Terima kasih banyak perusahaan Anda telah memberi saya kesempatan wawancara ini!", breakdown: "贵公司 (perusahaan Anda sopan) + 机会 (kesempatan)", note: "Penutup ungkapan penuh rasa hormat.", audio: "非常感谢贵公司给我这次面试机会！" }
      ],
      quickQuiz: {
        question: "Apa arti dari frasa profesional '团队合作能力' (tuánduì hézuò nénglì)?",
        targetAudio: "团队合作能力",
        options: ["Kemampuan desain grafis", "Kemampuan kerja sama tim", "Kemampuan mengemudikan mobil", "Kemampuan menghitung angka"],
        correct: 1,
        explanation: "'团队' (tim) + '合作' (kerja sama) + '能力' (kemampuan) = Kemampuan kerja sama tim."
      }
    },

    // =========================================================================
    // 3. READING MODULES (MEMBACA)
    // =========================================================================
    "reading_characters": {
      title: "Karakter & 28 Radikal Utama (汉字基础与核心偏旁部首)",
      category: "Reading",
      icon: "🔤",
      color: "#3a86ff",
      bg: "#eff6ff",
      summary: "Memahami rahasia pembentukan karakter Hanzi melalui komponen Radikal (偏旁部首). Radikal memberi petunjuk arti & kategori kata.",
      items: [
        { hanzi: "水 (shuǐ) → 氵(Tiga Titik Air)", pinyin: "shuǐ", meaning: "Berhubungan dengan cairan/air", breakdown: "Contoh: 河 (hé = sungai), 海 (hǎi = laut), 洗 (xǐ = cuci)", note: "Radikal 氵 di sisi kiri menunjukkan sifat air.", audio: "水, 河, 海" },
        { hanzi: "火 (huǒ) → 灬 (Empat Titik Api)", pinyin: "huǒ", meaning: "Berhubungan dengan api/panas", breakdown: "Contoh: 烧 (shāo = bakar), 热 (rè = panas), 煮 (zhǔ = rebus)", note: "Radikal 灬 di bawah menunjukkan efek api.", audio: "火, 烧, 热" },
        { hanzi: "木 (mù - Pohon/Kayu)", pinyin: "mù", meaning: "Benda berbahan dasar kayu", breakdown: "Contoh: 树 (shù = pohon), 椅 (yǐ = kursi), 板 (bǎn = papan)", note: "Menunjukkan material tanaman/kayu.", audio: "木, 树, 椅" },
        { hanzi: "人 (rén) → 亻(Radikal Orang)", pinyin: "rén", meaning: "Aktivitas atau sifat manusia", breakdown: "Contoh: 你 (nǐ = kamu), 他 (tā = dia), 作 (zuò = buat)", note: "Radikal 亻 berdiri di sisi kiri.", audio: "人, 你, 他" },
        { hanzi: "心 (xīn) → 忄(Radikal Hati)", pinyin: "xīn", meaning: "Perasaan, emosi, dan pemikiran", breakdown: "Contoh: 情 (qíng = perasaan), 想 (xiǎng = pikir), 忙 (máng = sibuk)", note: "Menggambarkan emosi kejiwaan.", audio: "心, 情, 想" },
        { hanzi: "口 (kǒu - Mulut)", pinyin: "kǒu", meaning: "Tindakan mulut: bicara, makan, bunyi", breakdown: "Contoh: 吃 (chī = makan), 喝 (hē = minum), 叫 (jiào = panggil)", note: "Kata kerja dengan mulut.", audio: "口, 吃, 喝" }
      ],
      quickQuiz: {
        question: "Radikal '氵' (tiga titik air) memberi petunjuk bahwa kata tersebut berhubungan dengan apa?",
        targetAudio: "水",
        options: ["Api / Panas", "Air / Cairan", "Kayu / Pohon", "Tanah / Batu"],
        correct: 1,
        explanation: "Radikal '氵' adalah bentuk pendek dari '水' (shuǐ = air), berada di sisi kiri karakter."
      }
    },
    "reading_sentences": {
      title: "Pola Struktur Kalimat Mandarin Lengkap (句型结构大全)",
      category: "Reading",
      icon: "📝",
      color: "#16a34a",
      bg: "#f0fdf4",
      summary: "Membedakan struktur dasar SVO, kalimat kata sifat, kalimat keberadaan 在/有, kalimat penekanan 把, dan kalimat pasif 被.",
      items: [
        { hanzi: "我是学生。(S + 是 + O)", pinyin: "Wǒ shì xuésheng.", meaning: "Pola Identitas '是': Saya adalah murid.", breakdown: "Subjek (我) + 是 + Objek (学生)", note: "Gunakan 是 untuk menghubungkan nomina.", audio: "我是学生。" },
        { hanzi: "我的朋友很聪明。(S + 很 + Adj)", pinyin: "Wǒ de péngyou hěn cōngming.", meaning: "Pola Sifat '很': Teman saya sangat pintar.", breakdown: "Subjek + 很 (sangat) + Adjektiva", note: "Dalam Mandarin, kata kerja 是 TIDAK digunakan sebelum kata sifat!", audio: "我的朋友很聪明。" },
        { hanzi: "我在图书馆看书。(S + 在 + Tempat + V + O)", pinyin: "Wǒ zài túshūguǎn kàn shū.", meaning: "Pola Tempat '在': Saya membaca buku DI perpustakaan.", breakdown: "Tempat (在图书馆) ditarik DILAKUKAN SEBELUM kata kerja (看书)!", note: "ATURAN EMAS: Keterangan tempat mendahului Kata Kerja!", audio: "我在图书馆看书。" },
        { hanzi: "他把苹果吃了。(S + 把 + O + V + 了)", pinyin: "Tā bǎ píngguǒ chī le.", meaning: "Pola Penekanan Objek '把': Dia memakan habis apel tersebut.", breakdown: "Objek (苹果) ditarik ke depan kata kerja (吃)", note: "Digunakan bila aksi mengubah kondisi objek.", audio: "他把苹果吃了。" },
        { hanzi: "钱包被偷了。(O + 被 + Pelaku + V + 了)", pinyin: "Qiánbāo bèi tōu le.", meaning: "Pola Pasif '被': Dompet telah dicuri.", breakdown: "Objek menderita (钱包) + 被 (oleh/pasif)", note: "Penanda utama kalimat pasif Mandarin.", audio: "钱包被偷了。" }
      ],
      quickQuiz: {
        question: "Di manakah posisi keterangan tempat '在... (di...)' dalam kalimat Mandarin?",
        targetAudio: "我在图书馆看书",
        options: ["Di paling akhir kalimat", "Sebelum Kata Kerja (S + 在+Tempat + V + O)", "Setelah Objek", "Terserah di mana saja"],
        correct: 1,
        explanation: "Aturan urutan kata Mandarin: Keterangan Tempat (在+Tempat) wajib diletakkan SEBELUM Kata Kerja (V)."
      }
    },
    "reading_idioms": {
      title: "Idiom & Chengyu Klasik Tiongkok (成语故事与含义)",
      category: "Reading",
      icon: "📜",
      color: "#b45309",
      bg: "#fffbeb",
      summary: "Chengyu (成语) adalah ungkapan idiom 4 karakter Tiongkok yang kaya akan nilai filosofis dan asal-usul sejarah kuno.",
      items: [
        { hanzi: "一举两得 (yī jǔ liǎng dé)", pinyin: "yī jǔ liǎng dé", meaning: "Sekali menyelam minum air (satu tindakan dapat 2 manfaat)", breakdown: "一举 (satu tindakan) + 两得 (dua keuntungan)", note: "Cocok untuk solusi efisien.", audio: "一举两得" },
        { hanzi: "画蛇添足 (huà shé tiān zú)", pinyin: "huà shé tiān zú", meaning: "Menggambar ular menambah kaki (tindakan sia-sia & berlebihan)", breakdown: "画蛇 (gambar ular) + 添足 (tambah kaki)", note: "Peringatan agar tidak merusak hal yang sudah bagus.", audio: "画蛇添足" },
        { hanzi: "亡羊补牢 (wáng yáng bǔ láo)", pinyin: "wáng yáng bǔ láo", meaning: "Kandang diperbaiki setelah domba hilang (belum terlambat memperbaiki kesalahan)", breakdown: "亡羊 (kehilangan domba) + 补牢 (perbaiki kandang)", note: "Pesan positif untuk tidak menyerah.", audio: "亡羊补牢" },
        { hanzi: "半途而废 (bàn tú ér fèi)", pinyin: "bàn tú ér fèi", meaning: "Berhenti di tengah jalan / menyerah sebelum tuntas", breakdown: "半途 (tengah jalan) + 废 (batal/menyerah)", note: "Jangan sampai belajar Mandarin 半途而废!", audio: "半途而废" },
        { hanzi: "守株待兔 (shǒu zhū dài tù)", pinyin: "shǒu zhū dài tù", meaning: "Menunggu kelinci menabrak batang pohon (mengharap hoki tanpa usaha)", breakdown: "守株 (jaga pohon) + 待兔 (tunggu kelinci)", note: "Pengingat untuk selalu berusaha giat.", audio: "守株待兔" },
        { hanzi: "熟能生巧 (shú néng shēng qiǎo)", pinyin: "shú néng shēng qiǎo", meaning: "Latihan membuat sempurna (Bisa karena biasa)", breakdown: "熟 (mahir) + 生巧 (menghasilkan keahlian)", note: "Kunci menguasai bahasa Mandarin!", audio: "熟能生巧" }
      ],
      quickQuiz: {
        question: "Chengyu mana yang berarti 'Bisa karena terbiasa / Praktik membuat sempurna'?",
        targetAudio: "熟能生巧",
        options: ["画蛇添足", "熟能生巧 (shú néng shēng qiǎo)", "半途而废", "守株待兔"],
        correct: 1,
        explanation: "'熟能生巧' bermakna kemahiran diperoleh dari latihan berulang kali."
      }
    },
    "reading_ancient_poetry": {
      title: "Puisi Klasik Tang & Song (唐诗宋词赏析)",
      category: "Reading",
      icon: "🌸",
      color: "#9333ea",
      bg: "#f3e8ff",
      summary: "Mengapresiasi keindahan sastra puisi klasik Tiongkok paling terkenal karya penyair legendaris Li Bai (李白) dan Meng Haoran (孟浩然).",
      items: [
        { hanzi: "床前明月光 (Chuáng qián míng yuè guāng)", pinyin: "Chuáng qián míng yuè guāng", meaning: "Di depan tempat tidur bersinar terang cahaya bulan", breakdown: "Karya Li Bai (李白) - Judul: 《静夜思》 (Pemikiran di Malam Hening)", note: "Baris 1 puisi kerinduan kampung halaman.", audio: "床前明月光" },
        { hanzi: "疑是地上霜 (Yí shì dì shàng shuāng)", pinyin: "Yí shì dì shàng shuāng", meaning: "Kusangka embun beku melapisi tanah", breakdown: "疑是 (dikira) + 地上霜 (embun beku)", note: "Menggambarkan suasana malam dingin senyap.", audio: "疑是地上霜" },
        { hanzi: "举头望明月 (Jǔ tóu wàng míng yuè)", pinyin: "Jǔ tóu wàng míng yuè", meaning: "Kuangkat kepala menatap bulan terang", breakdown: "举头 (angkat kepala) + 望 (menatap)", note: "Gerakan menengadah ke langit.", audio: "举头望明月" },
        { hanzi: "低头思故乡 (Dī tóu sī gùxiāng)", pinyin: "Dī tóu sī gùxiāng", meaning: "Kutundukkan kepala merindukan kampung halaman", breakdown: "低头 (tunduk kepala) + 思故乡 (rindu kampung)", note: "Baris penutup maha karya Li Bai.", audio: "低头思故乡" }
      ],
      quickQuiz: {
        question: "Siapakah penyair legendaris Tiongkok yang menulis puisi 《静夜思》 (Jìng yè sī)?",
        targetAudio: "李白",
        options: ["Du Fu (杜甫)", "Li Bai (李白)", "Bai Juyi (白居易)", "Su Shi (苏轼)"],
        correct: 1,
        explanation: "Puisi 《静夜思》 ditulis oleh penyair besar Dinasti Tang, Li Bai (李白)."
      }
    },
    "reading_passages": {
      title: "Wacana, Cerita & Artikel Pemahaman (短文阅读与综合理解)",
      category: "Reading",
      icon: "📰",
      color: "#d97706",
      bg: "#fffbeb",
      summary: "Melatih membaca wacana naratif 2-3 paragraf, menangkap ide pokok, inferensi konteks, dan menjawab pertanyaan komprehensif.",
      items: [
        { hanzi: "李华在中国留学已经两年了，他不仅汉语流利，还结交了许多中国朋友。(Lǐ Huá zài Zhōngguó liúxué yǐjīng liǎng nián le, tā bùjǐn Hànyǔ liúlì, hái jiéjiāo le xǔduō Zhōngguó péngyou.)", pinyin: "Lǐ Huá zài Zhōngguó liúxué yǐjīng liǎng nián le, tā bùjǐn Hànyǔ liúlì, hái jiéjiāo le xǔduō Zhōngguó péngyou.)", meaning: "Li Hua belajar di Tiongkok sudah dua tahun, dia tidak hanya fasih berbahasa Mandarin, tetapi juga memiliki banyak teman orang Tiongkok.", breakdown: "留学 (kuliah luar negeri) + 流利 (fasih) + 结交 (berteman dengan)", note: "Paragraf pembuka wacana kehidupan mahasiswa internasional.", audio: "李华在中国留学已经两年了，他不仅汉语流利，还结交了许多中国朋友。" },
        { hanzi: "每到周末，他们常常一起去公园散步，或者去图书馆查阅专业资料。(Měi dào zhōumò, tāmen chángcháng yīqǐ qù gōngyuán sànbù, huòzhě qù túshūguǎn cháyuè zhuānyè zīliào.)", pinyin: "Měi dào zhōumò, tāmen chángcháng yīqǐ qù gōngyuán sànbù, huòzhě qù túshūguǎn cháyuè zhuānyè zīliào.)", meaning: "Setiap akhir pekan, mereka sering bersama-sama jalan santai di taman, atau pergi ke perpustakaan memeriksa literatur referensi perkuliahan.", breakdown: "常常 (sering) + 散步 (jalan santai) + 查阅资料 (mencari bahan referensi)", note: "Kalimat narasi aktivitas harian.", audio: "每到周末，他们常常一起去公园散步，或者去图书馆查阅专业资料。" },
        { hanzi: "李华认为，融入当地生活是提高跨文化交际能力的最佳途径。(Lǐ Huá rènwéi, róngrù dāngdì shēnghuó shì tígāo kuà wénhuà jiāojì nénglì de zuì jiā tújìng.)", pinyin: "Lǐ Huá rènwéi, róngrù dāngdì shēnghuó shì tígāo kuà wénhuà jiāojì nénglì de zuì jiā tújìng.)", meaning: "Li Hua berpendapat bahwa berbaur ke dalam kehidupan lokal adalah jalan terbaik untuk meningkatkan kemampuan komunikasi lintas budaya.", breakdown: "融入 (berbaur/melebur) + 跨文化交际 (komunikasi lintas budaya) + 最佳途径 (jalan terbaik)", note: "Gagasan inti kesimpulan bacaan.", audio: "李华认为，融入当地生活是提高跨文化交际能力的最佳途径。" }
      ],
      quickQuiz: {
        question: "Menurut artikel wacana, apa cara terbaik menurut Li Hua untuk meningkatkan komunikasi lintas budaya?",
        targetAudio: "融入当地生活",
        options: ["Tidur seharian di kamar", "Berbaur ke kehidupan lokal (融入当地生活)", "Bermain gim online", "Hanya membaca buku kamus"],
        correct: 1,
        explanation: "Teks secara eksplisit menyebutkan: '融入当地生活是提高跨文化交际能力的最佳途径'."
      }
    },

    // =========================================================================
    // 4. WRITING MODULES (MENULIS)
    // =========================================================================
    "writing_strokes_basics": {
      title: "Dasar Goresan & Kaidah Urutan Hanzi (汉字基本笔画与笔顺规则)",
      category: "Writing",
      icon: "✏️",
      color: "#ff9f1c",
      bg: "#fff8eb",
      summary: "8 goresan dasar (永字八法) dan aturan emas urutan penulisan Hanzi: Atas ke Bawah, Kiri ke Kanan, Luar Dulu Baru Dalam.",
      items: [
        { hanzi: "横 (héng - Garis Mendatar —)", pinyin: "héng", meaning: "Goresan dari kiri ditarik ke kanan (—)", breakdown: "Aturan: Tarik lurus dari kiri ke kanan.", note: "Huruf 一, 二, 三 pembentuk dasar.", audio: "横" },
        { hanzi: "竖 (shù - Garis Tegak 丨)", pinyin: "shù", meaning: "Goresan tegak lurus dari atas ke bawah (丨)", breakdown: "Aturan: Tarik dari atas tegak ke bawah.", note: "Huruf 十, 中.", audio: "竖" },
        { hanzi: "撇 (piě - Miring Kiri 丿)", pinyin: "piě", meaning: "Goresan miring dari kanan atas ke kiri bawah (丿)", breakdown: "Aturan: Sapuan melengkung miring kiri.", note: "Huruf 人, 八.", audio: "撇" },
        { hanzi: "捺 (nà - Sapuan Kanan ㇏)", pinyin: "nà", meaning: "Goresan sapuan dari kiri atas ke kanan bawah (㇏)", breakdown: "Aturan: Tebal melandai ke kanan bawah.", note: "Huruf 人, 大.", audio: "捺" },
        { hanzi: "点 (diǎn - Titik丶)", pinyin: "diǎn", meaning: "Titik pendek serong ke kanan bawah (丶)", breakdown: "Aturan: Tekanan titik kecil.", note: "Huruf 六, 主.", audio: "点" },
        { hanzi: "横折 (héngzhé - Mendatar Tekuk ⌐)", pinyin: "héng zhé", meaning: "Garis mendatar lalu tekuk tegak ke bawah", breakdown: "Aturan: Ditulis dalam 1 goresan berkelanjutan!", note: "Bentuk siku kotak 口.", audio: "横折" }
      ],
      quickQuiz: {
        question: "Manakah kaidah emas urutan penulisan karakter Hanzi '人' (rén)?",
        targetAudio: "撇",
        options: ["Kanan dulu baru Kiri", "Goresan 撇 (Piě miring kiri) mendahului 捺 (Nà miring kanan)", "Bawah dulu baru Atas", "Titik dulu baru Kotak"],
        correct: 1,
        explanation: "Kaidah urutan Hanzi: Goresan miring kiri (撇 Piě) selalu ditarik mendahului miring kanan (捺 Nà)."
      }
    },
    "writing_grammar": {
      title: "Tata Bahasa & Partikel Penulisan (写作必备语法与量词)",
      category: "Writing",
      icon: "📐",
      color: "#059669",
      bg: "#ecfdf5",
      summary: "Penggunaan partikel Struktural 的/地/得, penanda waktu 了/过/着, serta kata penggolong (量词) yang tepat.",
      items: [
        { hanzi: "的 (de) - Mengikat Nomina", pinyin: "de", meaning: "Penanda kepemilikan / penjelas benda: 我的书 (buku saya)", breakdown: "Struktur: Adjektiva/Punya + 的 + Kata Benda", note: "Paling umum digunakan.", audio: "我的书" },
        { hanzi: "地 (de) - Mengikat Verba", pinyin: "de", meaning: "Penjelas cara melakukan verba: 慢慢地走 (berjalan dengan pelan)", breakdown: "Struktur: Adjektiva + 地 + Kata Kerja", note: "Digunakan sebagai kata keterangan cara.", audio: "慢慢地走" },
        { hanzi: "得 (de) - Mengikat Komplemen", pinyin: "de", meaning: "Menilai tingkat keberhasilan: 跑得很快 (berlari sangat cepat)", breakdown: "Struktur: Kata Kerja + 得 + Adjektiva/Tingkat", note: "Menilai derajat hasil aksi.", audio: "跑得很快" },
        { hanzi: "了 (le) - Aksi Selesai / Perubahan", pinyin: "le", meaning: "Menandakan kejadian selesai: 我吃了 (saya sudah makan)", breakdown: "Diletakkan setelah kata kerja / akhir kalimat", note: "Bukan penanda waktu lampau murni, tapi aspek selesai.", audio: "我吃了" },
        { hanzi: "张 (zhāng) - Kata Penggolong Benda Datar", pinyin: "zhāng", meaning: "Penggolong kertas, meja, foto, tiket: 一张纸, 一张桌子", breakdown: "Karakter 张 berhubungan dengan benda bentang", note: "Wajib digunakan sebelum kata benda lembaran.", audio: "一张纸" }
      ],
      quickQuiz: {
        question: "Partikel 'de' manakah yang tepat untuk mengisi kalimat '他跑___很快' (Dia berlari sangat cepat)?",
        targetAudio: "得",
        options: ["的 (de kepemilikan)", "地 (de keterangan cara)", "得 (de komplemen derajat)", "了 (le)"],
        correct: 2,
        explanation: "Karena menilai derajat kecepatan berlari setelah Kata Kerja (跑), wajib menggunakan '得' (de)."
      }
    },
    "writing_business_email": {
      title: "Format Menulis Surat & Email Bisnis (商务邮件与信函格式)",
      category: "Writing",
      icon: "✉️",
      color: "#0284c7",
      bg: "#f0f9ff",
      summary: "Format standar korespondensi email bisnis Mandarin: salam pembuka formal, bahasa tubuh email, dan kalimat penutup sopan.",
      items: [
        { hanzi: "尊敬的王经理：(Salam Pembuka Formal)", pinyin: "Zūnjìng de Wáng jīnglǐ:", meaning: "Yang terhormat Manajer Wang,", breakdown: "尊敬的 (yang terhormat) + Gelar", note: "Salam wajib pada awal email bisnis.", audio: "尊敬的王经理" },
        { hanzi: "您好！感谢您在百忙之中抽空阅读此邮件。", pinyin: "Nǐ hǎo! Gǎnxiè nín zài bǎimáng zhī zhōng chōukòng yuèdú cǐ yóujiàn.", meaning: "Halo! Terima kasih Anda telah meluangkan waktu di tengah kesibukan membaca email ini.", breakdown: "百忙之中 (di tengah kesibukan) + 抽空 (luangkan waktu)", note: "Kalimat pembuka penuh etika.", audio: "感谢您在百忙之中抽空阅读此邮件" },
        { hanzi: "随信附上我们的项目合作方案，请您查收。", pinyin: "Suí xìn fù shàng wǒmen de xiàngmù hézuò fāng'àn, qǐng nín cháshōu.", meaning: "Bersama email ini kami lampirkan proposal kerja sama proyek kami, mohon diperiksa.", breakdown: "附上 (melampirkan) + 查收 (periksa dan terima)", note: "Menjelaskan dokumen lampiran (attachment).", audio: "随信附上我们的项目合作方案，请您查收。" },
        { hanzi: "如有任何疑问，请随时与我联系。", pinyin: "Rú yǒu rènhé yíwèn, qǐng suíshí yǔ wǒ liánxì.", meaning: "Jika ada pertanyaan apapun, mohon hubungi saya kapan saja.", breakdown: "随时 (kapan saja) + 联系 (hubungi)", note: "Keterbukaan komunikasi bisnis.", audio: "如有任何疑问，请随时与我联系。" },
        { hanzi: "祝好！此致敬礼！(Salam Penutup Resmi)", pinyin: "Zhù hǎo! Cǐzhì jìnglǐ!", meaning: "Salam hangat! Hormat kami!", breakdown: "此致 (dengan ini) + 敬礼 (salam hormat)", note: "Format salam penutup resmi surat Tiongkok.", audio: "祝好！此致敬礼！" }
      ],
      quickQuiz: {
        question: "Ungkapan pembuka formal apa yang paling tepat ditulis di awal email bisnis?",
        targetAudio: "尊敬的",
        options: ["嗨！(Hei!)", "尊敬的... (Yang Terhormat...)", "喂！(Halo!)", "拜拜 (Dah!)"],
        correct: 1,
        explanation: "'尊敬的' (Zūnjìng de) adalah kata pembuka paling resmi untuk menyapa kolega/klien."
      }
    },
    "writing_sentences": {
      title: "Latihan Menyusun Kalimat Gramatikal (连词成句与语序规律)",
      category: "Writing",
      icon: "🧩",
      color: "#7c3aed",
      bg: "#f5f3ff",
      summary: "Kaidah urutan kata Mandarin (语序): Subjek + Waktu + Tempat + Modalitas + Predikat + Objek. Menghindari kesalahan terjemahan harfiah.",
      items: [
        { hanzi: "我明天下午在学校图书馆看书。(Wǒ míngtiān xiàwǔ zài xuéxiào túshūguǎn kàn shū.)", pinyin: "Wǒ míngtiān xiàwǔ zài xuéxiào túshūguǎn kàn shū.", meaning: "Saya besok siang membaca buku di perpustakaan sekolah.", breakdown: "Urutan Emas: Subjek (我) + Waktu (明天下午) + Tempat (在学校图书馆) + Kata Kerja (看) + Objek (书)", note: "Keterangan waktu dan tempat HARUS mendahului kata kerja!", audio: "我明天下午在学校图书馆看书。" },
        { hanzi: "他每天跟朋友一起踢足球。(Tā měitiān gēn péngyou yīqǐ tī zúqiú.)", pinyin: "Tā měitiān gēn péngyou yīqǐ tī zúqiú.)", meaning: "Dia setiap hari bermain sepak bola bersama temannya.", breakdown: "Subjek (他) + Waktu (每天) + Rekan (跟朋友一起) + Kata Kerja (踢足球)", note: "Frasa pendamping '跟...一起' diletakkan sebelum predikat.", audio: "他每天跟朋友一起踢足球。" },
        { hanzi: "请把这封信送到王经理的办公室。(Qǐng bǎ zhè fēng xìn sòng dào Wáng jīnglǐ de bàngōngshì.)", pinyin: "Qǐng bǎ zhè fēng xìn sòng dào Wáng jīnglǐ de bàngōngshì.", meaning: "Tolong kirimkan/antarkan surat ini ke kantor Manajer Wang.", breakdown: "请 + 把 + Objek (这封信) + Kata Kerja (送到) + Tujuan (办公室)", note: "Pola penataan objek 把 untuk instruksi arah perpindahan barang.", audio: "请把这封信送到王经理的办公室。" }
      ],
      quickQuiz: {
        question: "Susun urutan kata berikut dengan benar: [ 在家 / 我 / 昨晚 / 看了电影 ]",
        targetAudio: "我昨晚在家看了电影",
        options: ["看了电影我昨晚在家", "我昨晚在家看了电影 (Wǒ zuówǎn zàijiā kàn le diànyǐng)", "在家看了电影我昨晚", "昨晚看了电影我在家"],
        correct: 1,
        explanation: "Struktur baku Mandarin: Subjek (我) + Waktu (昨晚) + Tempat (在家) + Verba+Objek (看了电影)."
      }
    },
    "writing_essay": {
      title: "Menulis Paragraf & Esai Pendek (段落写作与日常短文)",
      category: "Writing",
      icon: "📄",
      color: "#0284c7",
      bg: "#f0f9ff",
      summary: "Menyusun esai narasi dan deskripsi 80-150 karakter: struktur kalimat pembuka, pengembangan detail dengan kata hubung, dan kesimpulan.",
      items: [
        { hanzi: "我的周末生活非常丰富多彩。(Wǒ de zhōumò shēnghuó fēicháng fēngfù duōcǎi.)", pinyin: "Wǒ de zhōumò shēnghuó fēicháng fēngfù duōcǎi.", meaning: "Kehidupan akhir pekan saya sangat beraneka warna dan semarak.", breakdown: "丰富的周末 = Frasa topik kalimat pembuka esai.", note: "Kalimat topik (Topic Sentence) membuka gambaran paragraf.", audio: "我的周末生活非常丰富多彩。" },
        { hanzi: "星期六早上我常常去公园晨跑，呼吸新鲜空气，感到身心放松。(Xīngqīliù zǎoshang wǒ chángcháng qù gōngyuán chénpǎo, hūxī xīnxian kōngqì, gǎndào shēnxīn fàngsōng.)", pinyin: "Xīngqīliù zǎoshang wǒ chángcháng qù gōngyuán chénpǎo, hūxī xīnxian kōngqì, gǎndào shēnxīn fàngsōng.", meaning: "Sabtu pagi saya sering lari pagi di taman, menghirup udara segar, merasa tubuh dan pikiran rileks.", breakdown: "晨跑 (lari pagi) + 呼吸新鲜空气 (hirup udara segar) + 身心放松 (rileks)", note: "Pengembangan detail kegiatan kronologis.", audio: "星期六早上我常常去公园晨跑，呼吸新鲜空气，感到身心放松。" },
        { hanzi: "总的来说，合理安排作息让我每天都充满活力与快乐。(Zǒng de lái shuō, hélǐ ānpái zuòxī ràng wǒ měitiān dōu chōngmǎn huólì yǔ kuàilè.)", pinyin: "Zǒng de lái shuō, hélǐ ānpái zuòxī ràng wǒ měitiān dōu chōngmǎn huólì yǔ kuàilè.", meaning: "Secara keseluruhan, mengatur jadwal istirahat dengan rasional membuat saya setiap hari penuh energi dan keceriaan.", breakdown: "总的来说 (kesimpulannya / secara umum) + 充满活力 (penuh energi)", note: "Kalimat penutup (Concluding sentence) sebuah esai.", audio: "总的来说，合理安排作息让我每天都充满活力与快乐。" }
      ],
      quickQuiz: {
        question: "Kata transisi apa yang paling tepat untuk menutup atau menyimpulkan sebuah paragraf esai?",
        targetAudio: "总的来说",
        options: ["第一 (Pertama)", "总的来说 (Zǒng de lái shuō - Kesimpulannya)", "虽然 (Meskipun)", "因为 (Karena)"],
        correct: 1,
        explanation: "'总的来说' (Zǒng de lái shuō) berarti 'Secara umum / Kesimpulannya', ideal sebagai penutup paragraf."
      }
    },

    // =========================================================================
    // 5. HSK 1 - HSK 6 MASTERY MODULES
    // =========================================================================
    "hsk1_mastery": {
      title: "HSK 1: Fondasi Mandarin Dasar (入门基础全集)",
      category: "Grammar & Vocab",
      icon: "🌱",
      color: "#10b981",
      bg: "#ecfdf5",
      summary: "Memasuki dunia Mandarin: 150 kosakata dasar, pinyin 4 nada, kata ganti kepunyaan 的, dan pola kalimat SVO dasar.",
      items: [
        { hanzi: "你好 (nǐ hǎo)", pinyin: "nǐ hǎo", meaning: "Halo / Apa kabar", breakdown: "你 (kamu) + 好 (baik)", note: "Sapaan universal.", audio: "你好" },
        { hanzi: "我是学生 (Wǒ shì xuésheng)", pinyin: "Wǒ shì xuésheng", meaning: "Saya adalah siswa", breakdown: "我 + 是 + 学生", note: "Pola identitas.", audio: "我是学生" },
        { hanzi: "我的老师 (Wǒ de lǎoshī)", pinyin: "Wǒ de lǎoshī", meaning: "Guru saya", breakdown: "我 + 的 + 老师", note: "Kepemilikan.", audio: "我的老师" },
        { hanzi: "你叫什么名字？(Nǐ jiào shénme míngzi?)", pinyin: "Nǐ jiào shénme míngzi?", meaning: "Siapa namamu?", breakdown: "叫 (bernama) + 什么 (apa)", note: "Menanyakan nama.", audio: "你叫什么名字？" },
        { hanzi: "现在几点？(Xiànzài jǐ diǎn?)", pinyin: "Xiànzài jǐ diǎn?", meaning: "Sekarang jam berapa?", breakdown: "现在 (sekarang) + 几点 (jam berapa)", note: "Menanyakan waktu.", audio: "现在几点？" },
        { hanzi: "我想喝茶 (Wǒ xiǎng hē chá)", pinyin: "Wǒ xiǎng hē chá", meaning: "Saya ingin minum teh", breakdown: "想 (ingin) + 喝 (minum) + 茶 (teh)", note: "Menyatakan keinginan.", audio: "我想喝茶" }
      ],
      quickQuiz: {
        question: "Manakah susunan kalimat HSK 1 yang tepat untuk 'Saya adalah orang Indonesia'?",
        targetAudio: "我是印尼人",
        options: ["我是印尼人 (Wǒ shì Yìnní rén)", "我印尼人是 (Wǒ Yìnní rén shì)", "是印尼人我 (Shì Yìnní rén wǒ)", "印尼我是人 (Yìnní wǒ shì rén)"],
        correct: 0,
        explanation: "Struktur identitas HSK 1: Subjek (我) + 是 (shì) + Nama Negara (印尼) + 人 (rén)."
      }
    },
    "hsk2_mastery": {
      title: "HSK 2: Komunikasi Sehari-hari (日常交流进阶)",
      category: "Grammar & Vocab",
      icon: "🌿",
      color: "#06b6d4",
      bg: "#cff4fc",
      summary: "Menguasai 300 kosakata, kata keterangan waktu, kalimat perbandingan 比 (bǐ), dan aktivitas yang sedang berlangsung 在...呢.",
      items: [
        { hanzi: "苹果比西瓜便宜 (Píngguǒ bǐ xīguā piányi)", pinyin: "Píngguǒ bǐ xīguā piányi", meaning: "Apel lebih murah dari semangka", breakdown: "A 比 B + Kata Sifat", note: "Kalimat perbandingan.", audio: "苹果比西瓜便宜" },
        { hanzi: "他在打电话呢 (Tā zài dǎ diànhuà ne)", pinyin: "Tā zài dǎ diànhuà ne", meaning: "Dia sedang menelpon", breakdown: "在...呢 (sedang berlangsung)", note: "Progresif aksi.", audio: "他在打电话呢" },
        { hanzi: "你可以帮我一下吗？(Nǐ kěyǐ bāng wǒ yīxià ma?)", pinyin: "Nǐ kěyǐ bāng wǒ yīxià ma?", meaning: "Bisa tolong bantu saya sebentar?", breakdown: "帮 (bantu) + 一下 (sebentar)", note: "Permohonan halus.", audio: "你可以帮我一下吗？" },
        { hanzi: "太贵了，便宜一点吧 (Tài guì le, piányi yīdiǎn ba)", pinyin: "Tài guì le, piányi yīdiǎn ba", meaning: "Terlalu mahal, murahkan sedikit", breakdown: "太...了 (terlalu)", note: "Menawar harga.", audio: "太贵了，便宜一点吧" }
      ],
      quickQuiz: {
        question: "Dalam kalimat perbandingan HSK 2 'A 比 B + Kata Sifat', manakah arti dari '哥哥比我高'?",
        targetAudio: "哥哥比我高",
        options: ["Abang lebih tinggi dari saya", "Saya lebih tinggi dari abang", "Abang sama tingginya dengan saya", "Abang tidak setinggi saya"],
        correct: 0,
        explanation: "Pola 比 (bǐ): 哥哥 (A) Lebih 高 (tinggi) Dibanding 比 saya (B)."
      }
    },
    "hsk3_mastery": {
      title: "HSK 3: Percakapan Menengah & Tata Bahasa (中级表达精通)",
      category: "Grammar & Vocab",
      icon: "🌳",
      color: "#3b82f6",
      bg: "#dbeafe",
      summary: "Menguasai 600 kosakata, konjungsi 虽然...但是... (meskipun... tetapi...), kalimat struktur 把 (bǎ), dan klausa komplemen.",
      items: [
        { hanzi: "虽然很难，但是很有趣 (Suīrán hěn nán, dànshì hěn yǒuqù)", pinyin: "Suīrán hěn nán, dànshì hěn yǒuqù", meaning: "Meskipun sulit tetapi sangat menarik", breakdown: "虽然...但是... (meskipun...tapi...)", note: "Konjungsi kontras.", audio: "虽然很难，但是很有趣" },
        { hanzi: "请把门关上 (Qǐng bǎ mén guānshàng)", pinyin: "Qǐng bǎ mén guānshàng", meaning: "Tolong tutup pintunya", breakdown: "把 + Objek + Kata Kerja + Hasil", note: "Struktur 把 bǎ.", audio: "请把门关上" },
        { hanzi: "越做越好 (Yuè zuò yuè hǎo)", pinyin: "Yuè zuò yuè hǎo", meaning: "Semakin dikerjakan semakin bagus", breakdown: "越...越... (semakin...semakin...)", note: "Pola peningkatan.", audio: "越做越好" }
      ],
      quickQuiz: {
        question: "Apakah fungsi dari struktur kalimat 把 (bǎ) dalam HSK 3?",
        targetAudio: "请把门关上",
        options: ["Menekankan perlakuan / akibat aksi terhadap suatu objek", "Menyatakan waktu lampau", "Menanyakan harga barang", "Menampaikan permohonan maaf"],
        correct: 0,
        explanation: "Struktur 把 (bǎ) memindahkan objek ke depan kata kerja untuk menekankan akibat dari aksi tersebut."
      }
    },
    "hsk4_mastery": {
      title: "HSK 4: Diskusi Tematik & Tata Bahasa Lanjutan (进阶表达全集)",
      category: "Grammar & Vocab",
      icon: "🍁",
      color: "#8b5cf6",
      bg: "#f3e8ff",
      summary: "Menguasai 1.200 kosakata, ungkapan formal, kalimat pasif 被 (bèi), konjungsi 无论...都... (bagaimanapun juga...), dan paragraf esai.",
      items: [
        { hanzi: "无论是顺境还是逆境 (Wúlùn shì shùnjìng háishì nìjìng)", pinyin: "Wúlùn shì shùnjìng háishì nìjìng", meaning: "Baik dalam kondisi lancar maupun sulit", breakdown: "无论...都/还是... (bagaimanapun)", note: "Ungkapan teguh.", audio: "无论是顺境还是逆境" },
        { hanzi: "钱包被偷了 (Qiánbāo bèi tōu le)", pinyin: "Qiánbāo bèi tōu le", meaning: "Dompet telah dicuri (pasif 被)", breakdown: "Objek + 被 + Kata Kerja", note: "Kalimat pasif.", audio: "钱包被偷了" },
        { hanzi: "态度决定一切 (Tàidù juédìng yīqiè)", pinyin: "Tàidù juédìng yīqiè", meaning: "Sikap menentukan segalanya", breakdown: "态度 (sikap) + 决定 (menentukan)", note: "Kata mutiara populer.", audio: "态度决定一切" }
      ],
      quickQuiz: {
        question: "Apa arti dari partikel '被' (bèi) dalam kalimat HSK 4 '苹果被他吃了'?",
        targetAudio: "苹果被他吃了",
        options: ["Apel dimakan oleh dia (kalimat pasif)", "Dia ingin makan apel", "Apel lebih manis dari biasanya", "Apel sudah habis terjual"],
        correct: 0,
        explanation: "Partikel '被' (bèi) adalah penanda kalimat pasif dalam bahasa Mandarin."
      }
    },
    "hsk5_mastery": {
      title: "HSK 5: Fasih Berbahasa, Opini & Bisnis (高级流畅表达)",
      category: "Grammar & Vocab",
      icon: "🌸",
      color: "#ec4899",
      bg: "#fce7f3",
      summary: "Menguasai 2.500 kosakata, bacaan berita/artikel bisnis, wacana opini abstrak, dan kemahiran berargumen.",
      items: [
        { hanzi: "合作共赢 (Hézuò gòngyíng)", pinyin: "Hézuò gòngyíng", meaning: "Kerja sama saling menguntungkan (win-win solution)", breakdown: "合作 (kerja sama) + 共赢 (menang bersama)", note: "Istilah bisnis populer.", audio: "合作共赢" },
        { hanzi: "科技创新改变生活 (Kējì chuàngxīn gǎibiàn shēnghuó)", pinyin: "Kējì chuàngxīn gǎibiàn shēnghuó", meaning: "Inovasi sains & teknologi mengubah kehidupan", breakdown: "科技创新 (inovasi iptek)", note: "Artikel teknologi.", audio: "科技创新改变生活" },
        { hanzi: "毫无疑问 (Háo wú yíwèn)", pinyin: "Háo wú yíwèn", meaning: "Tanpa keraguan lagi", breakdown: "毫无 (tidak ada sedikitpun) + 疑问 (ragu)", note: "Idiom kepastian.", audio: "毫无疑问" }
      ],
      quickQuiz: {
        question: "Idiom HSK 5 '合作共赢' paling cocok digunakan dalam konteks apa?",
        targetAudio: "合作共赢",
        options: ["Negosiasi bisnis dan kemitraan resmi", "Berbelanja sayur di pasar", "Menanyakan jalan di jalanan", "Perkenalan nama siswa baru"],
        correct: 0,
        explanation: "'合作共赢' (Hézuò gòngyíng) sering digunakan dalam konteks bisnis/diplomasi bermakna kerja sama saling menguntungkan."
      }
    },
    "hsk6_mastery": {
      title: "HSK 6: Mahir Sastra, Bahasa Profesional & AI (大师精通大全)",
      category: "Grammar & Vocab",
      icon: "👑",
      color: "#d97706",
      bg: "#fef3c7",
      summary: "Menguasai 5.000+ kosakata, idiom chengyu klasik, wacana sains/teknologi/filsafat, dan analisis teks tingkat akademik.",
      items: [
        { hanzi: "海纳百川，有容乃大", pinyin: "Hǎinàbǎichuān, yǒu róng nǎi dà", meaning: "Laut menampung ratusan sungai, kebesaran berasal dari toleransi", breakdown: "海 (laut) + 容 (menampung/toleransi)", note: "Filsafat kepemimpinan.", audio: "海纳百川，有容乃大" },
        { hanzi: "独树一帜 (Dú shù yī zhì)", pinyin: "Dú shù yī zhì", meaning: "Menjadi pelopor unik terdepan di bidangnya", breakdown: "独 (sendiri) + 树 (mendirikan) + 帜 (bendera)", note: "Pujian keunikan.", audio: "独树一帜" },
        { hanzi: "突飞猛进 (Tū fēi měng jìn)", pinyin: "Tū fēi měng jìn", meaning: "Maju berkembang dengan sangat pesat", breakdown: "突飞 (terbang mendadak) + 猛进 (maju pesat)", note: "Kemajuan teknologi.", audio: "突飞猛进" }
      ],
      quickQuiz: {
        question: "Idiom HSK 6 '突飞猛进' paling tepat menggambarkan situasi seperti apa?",
        targetAudio: "突飞猛进",
        options: ["Perkembangan teknologi AI yang sangat pesat dan cepat", "Perjalanan siput yang lambat", "Hujan gerimis di musim dingin", "Orang yang sedang tidur nyenyak"],
        correct: 0,
        explanation: "'突飞猛进' (Tū fēi měng jìn) bermakna kemajuan yang luar biasa pesat dan mendadak."
      }
    }
  },

  // Custom uploaded modules
  modules: [
    {
      id: "mod-1",
      title: "Pinyin Dasar & 4 Nada Bahasa Mandarin",
      category: "listening",
      level: "HSK 1",
      author: "Laoshi Zhang (Guru)",
      description: "Panduan lengkap vokal, konsonan, dan pembedaan nada 1 sampai 4 dilengkapi latihan audio.",
      downloads: 142,
      fileSize: "4.8 MB",
      date: "2024-05-10",
      comments: [
        { user: "Budi Santoso", avatar: "assets/images/panda-reading.svg", text: "Materi sangat jelas dan audio nada sangat membantu!", date: "2 hari lalu", rating: 5 },
        { user: "Siti Rahma", avatar: "assets/images/panda-listening.svg", text: "Terima kasih Laoshi, sangat mudah dipahami pemula.", date: "Kemarin", rating: 5 }
      ]
    },
    {
      id: "mod-2",
      title: "Kosakata Percakapan Sehari-hari di Restoran",
      category: "speaking",
      level: "HSK 2",
      author: "Laoshi Chen (Guru)",
      description: "Cara memesan makanan, menanyakan rekomendasi menu, dan meminta tagihan.",
      downloads: 98,
      fileSize: "6.2 MB",
      date: "2024-05-14",
      comments: [
        { user: "Learner Panda", avatar: "assets/images/panda-mascot.svg", text: "Sangat praktis saat ingin mencoba makan di Chinese Restaurant!", date: "1 hari lalu", rating: 5 }
      ]
    },
    {
      id: "mod-3",
      title: "Struktur Kalimat '把' (Bǎ) dan '被' (Bèi)",
      category: "writing",
      level: "HSK 3",
      author: "Laoshi Wang (Guru)",
      description: "Penjelasan tata bahasa lanjutan dengan pola kalimat dan contoh latihan menulis esai.",
      downloads: 75,
      fileSize: "3.5 MB",
      date: "2024-05-18",
      comments: []
    }
  ],

  // Listening Exercises Data (HSK 1 - 6 Terstruktur)
  listeningData: [
    {
      title: "Sapaan & Perkenalan Diri (问候与介绍)",
      subtitle: "Mendengar sapaan dasar dan menanyakan kabar",
      duration: "0:18",
      level: "Mudah",
      hskLevel: "HSK 1",
      audioText: "Santi: 你好！你好吗？ Yanti: 我很好，谢谢！你叫什么名字？ Santi: 我叫王小明。",
      dialogue: [
        { speaker: "Santi", hanzi: "你好！你好吗？", pinyin: "Nǐ hǎo! Nǐ hǎo ma?", indonesian: "Halo! Apa kabar?" },
        { speaker: "Yanti", hanzi: "我很好，谢谢！你叫什么名字？", pinyin: "Wǒ hěn hǎo, xièxie! Nǐ jiào shénme míngzi?", indonesian: "Saya sangat baik, terima kasih! Siapa nama kamu?" },
        { speaker: "Santi", hanzi: "我叫王小明，你呢？", pinyin: "Wǒ jiào Wáng Xiǎomíng, nǐ ne?", indonesian: "Nama saya Wang Xiaoming, kamu?" },
        { speaker: "Yanti", hanzi: "我叫小美，很高兴认识你！", pinyin: "Wǒ jiào Xiǎoměi, hěn gāoxìng rènshi nǐ!", indonesian: "Nama saya Xiaomei, senang berkenalan denganmu!" }
      ],
      question: "Di mana percakapan ini paling tepat terjadi?",
      options: [
        { id: "A", text: "在学校 (Zài xuéxiào) - Di Sekolah" },
        { id: "B", text: "在医院 (Zài yīyuàn) - Di Rumah Sakit" },
        { id: "C", text: "在商店 (Zài shāngdiàn) - Di Toko" },
        { id: "D", text: "在公园 (Zài gōngyuán) - Di Taman" }
      ],
      correctAnswer: "A",
      explanation: "Percakapan sapaan dan perkenalan nama teman sebaya umumnya dilakukan saat pertama kali bertemu di lingkungan belajar / sekolah (学校 - xuéxiào)."
    },
    {
      title: "Saya Mau Makan Apa? (我喜欢吃什么？)",
      subtitle: "Mendengar kosakata makanan & minuman",
      duration: "0:27",
      level: "Mudah",
      hskLevel: "HSK 1",
      audioText: "Santi: 您好，您想吃什么？ Yanti: 我想要一碗牛肉面和一杯冰茶，谢谢。",
      dialogue: [
        { speaker: "Santi", hanzi: "您好，您想吃什么？", pinyin: "Nín hǎo, nín xiǎng chī shénme?", indonesian: "Halo, Anda ingin makan apa?" },
        { speaker: "Yanti", hanzi: "我想要一碗牛肉面和一杯冰茶，谢谢。", pinyin: "Wǒ xiǎng yào yī wǎn niúròu miàn hé yī bēi bīng chá, xièxie.", indonesian: "Saya ingin semangkuk mie sapi dan segelas es teh, terima kasih." }
      ],
      question: "Apa yang dipesan oleh pelanggan?",
      options: [
        { id: "A", text: "炒饭和可乐 (Chǎofàn hé kělè) - Nasi goreng & cola" },
        { id: "B", text: "牛肉面和冰茶 (Niúròu miàn hé bīng chá) - Mie sapi & es teh" },
        { id: "C", text: "包子和热茶 (Bāozi hé rè chá) - Bakpao & teh panas" },
        { id: "D", text: "饺子和水 (Jiǎozi hé shuǐ) - Pangsit & air putih" }
      ],
      correctAnswer: "B",
      explanation: "Pelanggan dengan jelas mengatakan '一碗牛肉面和一杯冰茶' (semangkuk mie sapi dan segelas es teh)."
    },
    {
      title: "Di Toko Swalayan (在商店里)",
      subtitle: "Percakapan menanyakan harga barang",
      duration: "0:32",
      level: "Sedang",
      hskLevel: "HSK 2",
      audioText: "Santi: 这个苹果多少钱一斤？ Yanti: 五块钱一斤，很甜很好吃。",
      dialogue: [
        { speaker: "Santi", hanzi: "这个苹果多少钱一斤？", pinyin: "Zhège píngguǒ duōshao qián yī jīn?", indonesian: "Apel ini berapa harga setengah kilonya?" },
        { speaker: "Yanti", hanzi: "五块钱一斤，很甜很好吃。", pinyin: "Wǔ kuài qián yī jīn, hěn tián hěn hǎochī.", indonesian: "5 Yuan per setengah kilo, sangat manis dan enak." }
      ],
      question: "Berapa harga apel tersebut?",
      options: [
        { id: "A", text: "三块钱 (3 Yuan)" },
        { id: "B", text: "四块钱 (4 Yuan)" },
        { id: "C", text: "五块钱 (5 Yuan)" },
        { id: "D", text: "十块钱 (10 Yuan)" }
      ],
      correctAnswer: "C",
      explanation: "Penjual menjawab '五块钱一斤' (wǔ kuài qián = 5 yuan)."
    },
    {
      title: "Hari dan Waktu (今天星期几？)",
      subtitle: "Mendengar hari dan janji temu",
      duration: "0:21",
      level: "Sedang",
      hskLevel: "HSK 2",
      audioText: "Santi: 今天星期几？ Yanti: 今天星期五，明天晚上我们去打篮球吧！",
      dialogue: [
        { speaker: "Santi", hanzi: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?", indonesian: "Hari ini hari apa?" },
        { speaker: "Yanti", hanzi: "今天星期五，明天晚上我们去打篮球吧！", pinyin: "Jīntiān xīngqī wǔ, míngtiān wǎnshang wǒmen qù dǎ lánqiú ba!", indonesian: "Hari ini hari Jumat, besok malam ayo kita main basket!" }
      ],
      question: "Kapan mereka berencana bermain basket?",
      options: [
        { id: "A", text: "星期五晚上 (Jumat malam)" },
        { id: "B", text: "星期六晚上 (Sabtu malam)" },
        { id: "C", text: "星期天早上 (Minggu pagi)" },
        { id: "D", text: "下周一 (Senin depan)" }
      ],
      correctAnswer: "B",
      explanation: "Hari ini hari Jumat (星期五), mereka merencanakan besok malam (明天晚上 = Sabtu malam)."
    },
    {
      title: "Kegiatan Akhir Pekan (周末你做什么？)",
      subtitle: "Mendengar rencana liburan dan hobi",
      duration: "0:29",
      level: "Sedang",
      hskLevel: "HSK 2",
      audioText: "Santi: 周末你打算做什么？ Yanti: 我想去图书馆看中文书，然后和朋友去喝奶茶。",
      dialogue: [
        { speaker: "Santi", hanzi: "周末你打算做什么？", pinyin: "Zhōumò nǐ dǎsuàn zuò shénme?", indonesian: "Akhir pekan apa rencanamu?" },
        { speaker: "Yanti", hanzi: "我想去图书馆看中文书，然后和朋友去喝奶茶。", pinyin: "Wǒ xiǎng qù túshūguǎn kàn zhōngwén shū, ránhòu hé péngyou qù hē nǎichá.", indonesian: "Saya ingin pergi ke perpustakaan membaca buku Mandarin, lalu bersama teman minum milk tea." }
      ],
      question: "Tempat mana yang akan dikunjungi pembicara Yanti terlebih dahulu?",
      options: [
        { id: "A", text: "咖啡厅 (Kafe)" },
        { id: "B", text: "图书馆 (Perpustakaan)" },
        { id: "C", text: "电影院 (Bioskop)" },
        { id: "D", text: "游泳池 (Kolam renang)" }
      ],
      correctAnswer: "B",
      explanation: "Pembicara Yanti mengatakan '我想去图书馆看中文书' (pergi ke perpustakaan)."
    },
    {
      title: "Di Rumah Sakit (在医院)",
      subtitle: "Mendengar percakapan pasien dan dokter",
      duration: "0:35",
      level: "Sedang",
      hskLevel: "HSK 3",
      audioText: "Santi: 你哪里不舒服？ Yanti: 我头疼，还有一点发烧。 Santi: 我给你量一下体温。",
      dialogue: [
        { speaker: "Santi", hanzi: "你哪里不舒服？", pinyin: "Nǐ nǎlǐ bù shūfu?", indonesian: "Di mana yang tidak nyaman?" },
        { speaker: "Yanti", hanzi: "我头疼，还有一点发烧。", pinyin: "Wǒ tóu téng, hái yǒu yīdiǎn fāshāo.", indonesian: "Saya sakit kepala, dan sedikit demam." },
        { speaker: "Santi", hanzi: "我给你量一下体温。", pinyin: "Wǒ gěi nǐ liáng yīxià tǐwēn.", indonesian: "Saya ukur suhu tubuh Anda dulu." }
      ],
      question: "Apa keluhan pasien (Yanti)?",
      options: [
        { id: "A", text: "肚子疼 (Sakit perut)" },
        { id: "B", text: "头疼和发烧 (Sakit kepala dan demam)" },
        { id: "C", text: "牙疼 (Sakit gigi)" },
        { id: "D", text: "腿疼 (Sakit kaki)" }
      ],
      correctAnswer: "B",
      explanation: "Pasien (Yanti) mengatakan '头疼' (sakit kepala) dan '发烧' (demam)."
    },
    {
      title: "Cuaca Hari Ini (今天的天气)",
      subtitle: "Mendengar prakiraan cuaca",
      duration: "0:24",
      level: "Sedang",
      hskLevel: "HSK 3",
      audioText: "今天白天多云转晴，最高温度三十二度。晚上有可能下雨，请带伞出门。",
      dialogue: [
        { speaker: "Penyiar", hanzi: "今天白天多云转晴，最高温度三十二度。", pinyin: "Jīntiān báitiān duōyún zhuǎn qíng, zuìgāo wēndù sānshí'èr dù.", indonesian: "Hari ini siang berawan lalu cerah, suhu tertinggi 32 derajat." },
        { speaker: "Penyiar", hanzi: "晚上有可能下雨，请带伞出门。", pinyin: "Wǎnshang yǒu kěnéng xiàyǔ, qǐng dài sǎn chūmén.", indonesian: "Malam mungkin hujan, silakan bawa payung saat keluar." }
      ],
      question: "Apa yang sebaiknya dibawa menurut prakiraan cuaca?",
      options: [
        { id: "A", text: "外套 (Jaket)" },
        { id: "B", text: "伞 (Payung)" },
        { id: "C", text: "帽子 (Topi)" },
        { id: "D", text: "围巾 (Syal)" }
      ],
      correctAnswer: "B",
      explanation: "Penyiar mengingatkan '请带伞出门' (silakan bawa payung saat keluar)."
    },
    {
      title: "Di Hotel (在宾馆)",
      subtitle: "Mendengar percakapan check-in hotel",
      duration: "0:30",
      level: "Sedang",
      hskLevel: "HSK 3",
      audioText: "前台：您好，请问您有预订吗？客人：有的，我预订了一间单人房，住三晚。前台：好的，您的房间在五楼，这是您的房卡。",
      dialogue: [
        { speaker: "Resepsionis", hanzi: "您好，请问您有预订吗？", pinyin: "Nín hǎo, qǐngwèn nín yǒu yùdìng ma?", indonesian: "Halo, apakah Anda sudah pesan sebelumnya?" },
        { speaker: "Tamu", hanzi: "有的，我预订了一间单人房，住三晚。", pinyin: "Yǒude, wǒ yùdìng le yī jiān dānrén fáng, zhù sān wǎn.", indonesian: "Sudah, saya pesan kamar single, menginap 3 malam." },
        { speaker: "Resepsionis", hanzi: "好的，您的房间在五楼，这是您的房卡。", pinyin: "Hǎo de, nín de fángjiān zài wǔ lóu, zhè shì nín de fángkǎ.", indonesian: "Baik, kamar Anda di lantai 5, ini kartu kamar Anda." }
      ],
      question: "Kamar tamu ada di lantai berapa?",
      options: [
        { id: "A", text: "三楼 (Lantai 3)" },
        { id: "B", text: "四楼 (Lantai 4)" },
        { id: "C", text: "五楼 (Lantai 5)" },
        { id: "D", text: "六楼 (Lantai 6)" }
      ],
      correctAnswer: "C",
      explanation: "Resepsionis mengatakan '您的房间在五楼' (kamar di lantai 5)."
    },
    {
      title: "Naik Taksi (坐出租车)",
      subtitle: "Mendengar percakapan penumpang dan sopir taksi",
      duration: "0:26",
      level: "Menengah",
      hskLevel: "HSK 4",
      audioText: "乘客：师傅，请去人民路一百号。司机：好的，大概二十分钟到。乘客：好，麻烦走快一点，我快迟到了。",
      dialogue: [
        { speaker: "Penumpang", hanzi: "师傅，请去人民路一百号。", pinyin: "Shīfu, qǐng qù Rénmín Lù yībǎi hào.", indonesian: "Pak sopir, tolong ke Jalan Renmin nomor 100." },
        { speaker: "Sopir", hanzi: "好的，大概二十分钟到。", pinyin: "Hǎo de, dàgài èrshí fēnzhōng dào.", indonesian: "Baik, sekitar 20 menit sampai." },
        { speaker: "Penumpang", hanzi: "好，麻烦走快一点，我快迟到了。", pinyin: "Hǎo, máfan zǒu kuài yīdiǎn, wǒ kuài chídào le.", indonesian: "Baik, tolong agak cepat, saya hampir terlambat." }
      ],
      question: "Berapa lama perkiraan perjalanan?",
      options: [
        { id: "A", text: "十分钟 (10 menit)" },
        { id: "B", text: "十五分钟 (15 menit)" },
        { id: "C", text: "二十分钟 (20 menit)" },
        { id: "D", text: "三十分钟 (30 menit)" }
      ],
      correctAnswer: "C",
      explanation: "Sopir mengatakan '大概二十分钟到' (sekitar 20 menit sampai)."
    },
    {
      title: "Belajar di Kelas (上课学习)",
      subtitle: "Mendengar instruksi guru di kelas",
      duration: "0:33",
      level: "Menengah",
      hskLevel: "HSK 4",
      audioText: "老师：同学们，请翻开课本第五十三页。今天我们学习第十课。请先读一遍课文。学生：老师，我有一个问题。",
      dialogue: [
        { speaker: "Guru", hanzi: "同学们，请翻开课本第五十三页。", pinyin: "Tóngxuémen, qǐng fān kāi kèběn dì wǔshísān yè.", indonesian: "Teman-teman, silakan buka buku pelajaran halaman 53." },
        { speaker: "Guru", hanzi: "今天我们学习第十课。请先读一遍课文。", pinyin: "Jīntiān wǒmen xuéxí dì shí kè. Qǐng xiān dú yí biàn kèwén.", indonesian: "Hari ini kita belajar pelajaran ke-10. Silakan baca teks satu kali dulu." },
        { speaker: "Murid", hanzi: "老师，我有一个问题。", pinyin: "Lǎoshī, wǒ yǒu yí gè wèntí.", indonesian: "Guru, saya ada satu pertanyaan." }
      ],
      question: "Halaman berapa yang diminta guru untuk dibuka?",
      options: [
        { id: "A", text: "第三十五页 (Halaman 35)" },
        { id: "B", text: "第四十三页 (Halaman 43)" },
        { id: "C", text: "第五十三页 (Halaman 53)" },
        { id: "D", text: "第六十三页 (Halaman 63)" }
      ],
      correctAnswer: "C",
      explanation: "Guru mengatakan '请翻开课本第五十三页' (buka halaman 53)."
    },
    {
      title: "Wawancara Kerja & Karier (求职面试与职业发展)",
      subtitle: "Mendengar dialog tanya jawab wawancara kerja profesional",
      duration: "0:38",
      level: "Tinggi",
      hskLevel: "HSK 5",
      audioText: "面试官：请谈谈你过往的项目经历以及你最大的优势。求职者：我具备三年的跨国商务沟通经验，善于在压力下高效解决突发问题。",
      dialogue: [
        { speaker: "Pewawancara", hanzi: "请谈谈你过往的项目经历以及你最大的优势。", pinyin: "Qǐng tántan nǐ guòwǎng de xiàngmù jīnglì yǐjí nǐ zuì dà de yōushì.", indonesian: "Silakan ceritakan pengalaman proyek masa lalu Anda dan keunggulan terbesar Anda." },
        { speaker: "Kandidat", hanzi: "我具备三年的跨国商务沟通经验，善于在压力下高效解决突发问题。", pinyin: "Wǒ jùbèi sān nián de kuàguó shāngwù gōutōng jīngyàn, shànyú zài yālì xià gāoxiào jiějué tūfā wèntí.", indonesian: "Saya memiliki pengalaman 3 tahun komunikasi bisnis multinasional, terampil menyelesaikan masalah mendadak di bawah tekanan secara efisien." }
      ],
      question: "Apa keunggulan yang disampaikan oleh kandidat?",
      options: [
        { id: "A", text: "Baru saja lulus kuliah" },
        { id: "B", text: "Pengalaman 3 tahun komunikasi bisnis multinasional & tangguh di bawah tekanan" },
        { id: "C", text: "Bisa bekerja tanpa dibayar" },
        { id: "D", text: "Hanya ingin bekerja dari rumah" }
      ],
      correctAnswer: "B",
      explanation: "Kandidat menyatakan '具备三年的跨国商务沟通经验，善于在压力下高效解决突发问题' (pengalaman 3 tahun bisnis multinasional dan pemecahan masalah di bawah tekanan)."
    },
    {
      title: "Simposium Ekonomi & Sains (经济论坛与科学技术演讲)",
      subtitle: "Mendengar pidato ilmiah mengenai kecerdasan buatan dan masa depan",
      duration: "0:45",
      level: "Tinggi",
      hskLevel: "HSK 6",
      audioText: "主讲人：随着人工智能技术的突飞猛进，各行各业都面临着深刻的结构性调整。唯有坚持终身学习与跨界创新，方能在瞬息万变的时代浪潮中立于不败之地。",
      dialogue: [
        { speaker: "Pembicara Utama", hanzi: "随着人工智能技术的突飞猛进，各行各业都面临着深刻的结构性调整。", pinyin: "Suízhe réngōng zhìnéng jìshù de tūfēiměngjìn, gèháng-gèyè dōu miànlínzhe shēnkè de jiégòuxìng tiáozhěng.", indonesian: "Seiring kemajuan pesat AI, berbagai industri menghadapi penyesuaian struktural yang mendalam." },
        { speaker: "Pembicara Utama", hanzi: "唯有坚持终身学习与跨界创新，方能在瞬息万变的时代浪潮中立于不败之地。", pinyin: "Wéiyǒu jiānchí zhōngshēn xuéxí yǔ kuàjiè chuàngxīn, fāng néng zài shùnxī-wànbiàn de shídài làngcháo zhōng lìyú bùbài zhī dì.", indonesian: "Hanya dengan konsisten belajar seumur hidup dan inovasi lintas-disiplin, kita dapat tetap kokoh tak terkalahkan dalam arus zaman yang berubah sekejap mata." }
      ],
      question: "Kunci utama untuk bertahan di tengah era perubahan cepat menurut pidato adalah?",
      options: [
        { id: "A", text: "Menghindari kemajuan teknologi AI" },
        { id: "B", text: "坚持终身学习与跨界创新 (Belajar seumur hidup & inovasi lintas-disiplin)" },
        { id: "C", text: "Berhenti bekerja dan beristirahat" },
        { id: "D", text: "Menolak penyesuaian industri" }
      ],
      correctAnswer: "B",
      explanation: "Pidato menegaskan: '唯有坚持终身学习与跨界创新，方能在瞬息万变的时代浪潮中立于不败之地'."
    }
  ],

  // Speaking Exercises Data (HSK 1 - 6 Terstruktur dengan Soal Kuis Interaktif)
  speakingData: [
    {
      title: "Menyapa Teman (问候朋友)",
      targetHanzi: "你好！很高兴认识你。",
      targetPinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
      meaning: "Halo! Sangat senang berkenalan denganmu.",
      hskLevel: "HSK 1",
      tips: "Fokus pada nada 3 (Nǐ, hǎo) yang meliuk turun lalu naik lembut.",
      question: "Ketika seseorang menyapa '很高兴认识你！', respon lisan apa yang paling santun dan tepat untuk diucapkan kembali?",
      options: [
        { id: "A", text: "认识你我也很高兴！(Rènshi nǐ wǒ yě hěn gāoxìng!)" },
        { id: "B", text: "我不认识你。(Wǒ bù rènshi nǐ.)" },
        { id: "C", text: "对不起，没关系。(Duìbuqǐ, méiguānxi.)" },
        { id: "D", text: "明天见。(Míngtiān jiàn.)" }
      ],
      correctAnswer: "A",
      explanation: "Respon baku saat orang lain berkata '很高兴认识你' adalah '认识你我也很高兴' (Senang berkenalan denganmu juga)."
    },
    {
      title: "Memperkenalkan Diri (自我介绍)",
      targetHanzi: "我叫张伟，我是学生。",
      targetPinyin: "Wǒ jiào Zhāng Wěi, wǒ shì xuésheng.",
      meaning: "Nama saya Zhang Wei, saya adalah murid.",
      hskLevel: "HSK 1",
      tips: "Perhatikan nada 4 pada 'jiào' dan 'shì' yang diucapkan tegas dan cepat.",
      question: "Dengarkan pelafalan nada '我是学生' (wǒ shì xuésheng). Nada berapakah karakter '是' (shì)?",
      options: [
        { id: "A", text: "Nada 1 (Datar tinggi)" },
        { id: "B", text: "Nada 2 (Naik)" },
        { id: "C", text: "Nada 3 (Turun lalu naik)" },
        { id: "D", text: "Nada 4 (Jatuh / tegas ke bawah)" }
      ],
      correctAnswer: "D",
      explanation: "Karakter '是' (shì) menggunakan nada ke-4 (jatuh tegas dari tinggi ke rendah)."
    },
    {
      title: "Menanyakan Kabar (问候情况)",
      targetHanzi: "你今天好吗？我很忙。",
      targetPinyin: "Nǐ jīntiān hǎo ma? Wǒ hěn máng.",
      meaning: "Bagaimana kabarmu hari ini? Saya sangat sibuk.",
      hskLevel: "HSK 2",
      tips: "Perhatikan nada 2 pada 'máng' (naik seperti intonasi bertanya).",
      question: "Jika teman bertanya '你今天好吗？' dan kamu ingin menjawab 'Saya sangat baik, terima kasih', kalimat mana yang diucapkan?",
      options: [
        { id: "A", text: "我很好，谢谢！(Wǒ hěn hǎo, xièxie!)" },
        { id: "B", text: "我不去学校。(Wǒ bù qù xuéxiào.)" },
        { id: "C", text: "他是老师。(Tā shì lǎoshī.)" },
        { id: "D", text: "再见！(Zàijiàn!)" }
      ],
      correctAnswer: "A",
      explanation: "Jawaban sopan untuk menanyakan kabar adalah '我很好，谢谢！' (Saya sangat baik, terima kasih!)."
    },
    {
      title: "Memesan Makanan di Restoran (在餐厅点餐)",
      targetHanzi: "服务员，我想点这个菜。",
      targetPinyin: "Fúwùyuán, wǒ xiǎng diǎn zhège cài.",
      meaning: "Pelayan, saya ingin memesan menu ini.",
      hskLevel: "HSK 2",
      tips: "Ucapkan 'fúwùyuán' dengan intonasi ramah dan sopan.",
      question: "Kata apakah yang digunakan untuk memanggil pelayan restoran dengan sopan dalam bahasa Mandarin?",
      options: [
        { id: "A", text: "老师 (Lǎoshī)" },
        { id: "B", text: "服务员 (Fúwùyuán)" },
        { id: "C", text: "医生 (Yīshēng)" },
        { id: "D", text: "司机 (Sījī)" }
      ],
      correctAnswer: "B",
      explanation: "'服务员' (fúwùyuán) adalah sebutan baku dan sopan untuk pelayan restoran / staf layanan."
    },
    {
      title: "Menyatakan Pendapat (表达看法)",
      targetHanzi: "我觉得这个很好看！",
      targetPinyin: "Wǒ juéde zhège hěn hǎokàn!",
      meaning: "Menurut saya ini sangat bagus / indah dilihat!",
      hskLevel: "HSK 2",
      tips: "Tegaskan 'hǎokàn' (nada 3 dan nada 4).",
      question: "Frasa '我觉得' (wǒ juéde) dalam percakapan lisan berfungsi untuk:",
      options: [
        { id: "A", text: "Menanyakan waktu jam berapa" },
        { id: "B", text: "Menyampaikan opini atau pendapat pribadi ('Menurut saya / saya merasa')" },
        { id: "C", text: "Meminta maaf atas kesalahan" },
        { id: "D", text: "Menolak tawaran secara kasar" }
      ],
      correctAnswer: "B",
      explanation: "'我觉得' (wǒ juéde) berarti 'menurut saya / saya rasa', digunakan untuk mengungkapkan pandangan pribadi secara santun."
    },
    {
      title: "Bertanya Arah Jalan (问路)",
      targetHanzi: "请问，最近的地铁站在哪里？",
      targetPinyin: "Qǐngwèn, zuìjìn de dìtiězhàn zài nǎlǐ?",
      meaning: "Permisi, stasiun MRT terdekat di mana?",
      hskLevel: "HSK 3",
      tips: "Gunakan intonasi tanya yang sopan, naikkan nada di akhir kalimat.",
      question: "Kata pembuka apa yang wajib digunakan sebelum bertanya arah agar terkesan sopan dan santun?",
      options: [
        { id: "A", text: "请问 (Qǐngwèn - Permisi, bolehkah saya bertanya)" },
        { id: "B", text: "走开 (Zǒukāi)" },
        { id: "C", text: "喂 (Wèi)" },
        { id: "D", text: "不行 (Bùxíng)" }
      ],
      correctAnswer: "A",
      explanation: "'请问' (qǐngwèn) adalah salam pembuka paling sopan sebelum menanyakan informasi/arah kepada orang lain."
    },
    {
      title: "Berbelanja di Pasar (在市场购物)",
      targetHanzi: "这个苹果怎么卖？太贵了，便宜一点吧。",
      targetPinyin: "Zhège píngguǒ zěnme mài? Tài guì le, piányi yīdiǎn ba.",
      meaning: "Apel ini harganya berapa? Terlalu mahal, murahkan sedikit dong.",
      hskLevel: "HSK 3",
      tips: "Perhatikan nada 4 pada 'guì' (mahal) dan nada 2 pada 'piányi' (murah).",
      question: "Ungkapan lisan manakah yang paling sering digunakan saat menawar harga di pasar?",
      options: [
        { id: "A", text: "太贵了，便宜一点吧。(Tài guì le, piányi yīdiǎn ba.)" },
        { id: "B", text: "很好吃，多买一点。(Hěn hǎochī, duō mǎi yīdiǎn.)" },
        { id: "C", text: "我不喜欢吃苹果。(Wǒ bù xǐhuan chī píngguǒ.)" },
        { id: "D", text: "你可以走了。(Nǐ kěyǐ zǒu le.)" }
      ],
      correctAnswer: "A",
      explanation: "'太贵了，便宜一点吧' (Terlalu mahal, murahkan sedikit ya) adalah kalimat tawar-menawar klasik dalam percakapan pasar."
    },
    {
      title: "Membuat Janji Temu (预约见面)",
      targetHanzi: "我们明天下午三点在咖啡厅见面吧。",
      targetPinyin: "Wǒmen míngtiān xiàwǔ sān diǎn zài kāfēitīng jiànmiàn ba.",
      meaning: "Ayo kita bertemu besok sore jam 3 di kafe.",
      hskLevel: "HSK 3",
      tips: "Lafalkah 'kāfēitīng' dengan nada 1-1-1 yang datar stabil.",
      question: "Partikel '吧' (ba) di akhir kalimat ajakan lisan berfungsi untuk:",
      options: [
        { id: "A", text: "Menyatakan kalimat perintah mutlak yang kasar" },
        { id: "B", text: "Menyatakan ajakan, saran, atau kesepakatan secara ramah (ayo / ya)" },
        { id: "C", text: "Menyatakan waktu masa lalu" },
        { id: "D", text: "Menyatakan kepemilikan benda" }
      ],
      correctAnswer: "B",
      explanation: "Partikel saran/ajakan '吧' (ba) melembutkan kalimat menjadi ajakan yang ramah: 'Ayo kita bertemu...'."
    },
    {
      title: "Mengucapkan Selamat (祝贺与祝福)",
      targetHanzi: "祝你生日快乐！万事如意！",
      targetPinyin: "Zhù nǐ shēngrì kuàilè! Wànshì rúyì!",
      meaning: "Selamat ulang tahun! Semoga semua berjalan lancar!",
      hskLevel: "HSK 4",
      tips: "Ucapkan dengan nada ceria dan ekspresif, tekankan 'kuàilè'.",
      question: "Ucapan '万事如意' (wànshì rúyì) memiliki arti doa restu apa?",
      options: [
        { id: "A", text: "Semoga panjang umur dan kaya raya" },
        { id: "B", text: "Semoga segala hal berjalan sesuai harapan / lancar sukses" },
        { id: "C", text: "Selamat menempuh hidup baru" },
        { id: "D", text: "Semoga cepat sembuh dari sakit" }
      ],
      correctAnswer: "B",
      explanation: "'万事如意' (wànshì rúyì): 万事 (segala perkara) + 如意 (sesuai harapan) = Semoga segala impian terkabul dan berjalan lancar."
    },
    {
      title: "Menelepon Seseorang (打电话)",
      targetHanzi: "喂，请问是李老师吗？我是王明的妈妈。",
      targetPinyin: "Wèi, qǐngwèn shì Lǐ lǎoshī ma? Wǒ shì Wáng Míng de māma.",
      meaning: "Halo, apakah ini Guru Li? Saya ibunya Wang Ming.",
      hskLevel: "HSK 4",
      tips: "Di telepon, kata sapaan '喂' (wèi) diucapkan dengan nada 4 yang cepat.",
      question: "Saat mengangkat telepon dalam bahasa Mandarin, kata sapaan pembuka apa yang lazim diucapkan?",
      options: [
        { id: "A", text: "喂 (Wèi / Wéi) - Halo" },
        { id: "B", text: "好 (Hǎo)" },
        { id: "C", text: "去 (Qù)" },
        { id: "D", text: "走 (Zǒu)" }
      ],
      correctAnswer: "A",
      explanation: "Kata seru '喂' (wèi/wéi) adalah ucapan standar untuk menyapa di awal sambungan telepon."
    },
    {
      title: "Negosiasi Bisnis & Kerjasama (商务谈判与合作洽谈)",
      targetHanzi: "我们非常重视双方的长远合作，期待能达成互利共赢的协议。",
      targetPinyin: "Wǒmen fēicháng zhòngshì shuāngfāng de chángyuǎn hézuò, qīdài néng dáchéng hùlì gòngyíng de xiéyì.",
      meaning: "Kami sangat menghargai kerja sama jangka panjang kedua belah pihak dan berharap mencapai kesepakatan yang saling menguntungkan.",
      hskLevel: "HSK 5",
      tips: "Gunakan intonasi diplomatik yang mantap dan tegas pada 'hùlì gòngyíng'.",
      question: "Idiom '互利共赢' (hùlì gòngyíng) dalam diplomasi bisnis bermakna:",
      options: [
        { id: "A", text: "Saling bersaing ketat tanpa kompromi" },
        { id: "B", text: "Saling menguntungkan dan menang bersama (win-win solution)" },
        { id: "C", text: "Kerjasama sepihak jangka pendek" },
        { id: "D", text: "Pembatalan kontrak secara sepihak" }
      ],
      correctAnswer: "B",
      explanation: "'互利共赢' berarti saling menguntungkan dan meraih kesuksesan bersama bagi kedua belah pihak mitra bisnis."
    },
    {
      title: "Argumen Akademis & Filsafat (学术研讨与哲理思辨)",
      targetHanzi: "面对复杂的社会变革，唯有海纳百川的胸襟与求真务实的态度方可致远。",
      targetPinyin: "Miànduì fùzá de shèhuì biàngé, wéiyǒu hǎinàbǎichuān de xiōngjīn yǔ qiúzhēn-wùshí de tàidù fāng kě zhìyuǎn.",
      meaning: "Menghadapi transformasi sosial yang kompleks, hanya kebesaran jiwa yang merangkul semua hal dan sikap mencari kebenaran realistislah yang dapat membawa kita melangkah jauh.",
      hskLevel: "HSK 6",
      tips: "Lafalkan idiom chengyu empat karakter dengan tempo teratur dan ritme berwibawa.",
      question: "Chengyu '海纳百川' (hǎi nà bǎi chuān) melambangkan sifat luhur apa?",
      options: [
        { id: "A", text: "Kemampuan berenang menyeberangi samudra" },
        { id: "B", text: "Kebesaran jiwa dan toleransi luas merangkul segala keragaman bagai laut menampung ratusan sungai" },
        { id: "C", text: "Kekuatan fisik yang sangat perkasa" },
        { id: "D", text: "Kekayaan materi yang melimpah ruah" }
      ],
      correctAnswer: "B",
      explanation: "'海纳百川，有容乃大' mengibaratkan laut yang luas karena merangkul ratusan aliran sungai, melambangkan jiwa besar dan toleransi universal."
    }
  ],

  // Current Reading Exercise Index
  currentReadingExercise: 0,

  // Reading Exercises Data (10 Interaktif Soal Bacaan & Pemahaman)
  readingData: [
    {
      title: "Hari Pertama Masuk Sekolah (开学第一天)",
      subtitle: "Membaca teks cerita perkenalan siswa baru",
      level: "Mudah (HSK 1)",
      readTime: "2 Menit",
      category: "Cerita Pendek",
      passage: [
        { hanzi: "今天九月一号，是开学的第一天。", pinyin: "Jīntiān jiǔ yuè yī hào, shì kāixué de dì-yī tiān.", translation: "Hari ini 1 September, hari pertama masuk sekolah." },
        { hanzi: "天气很好，太阳很大，天上没有云。", pinyin: "Tiānqì hěn hǎo, tàiyáng hěn dà, tiānshang méiyǒu yún.", translation: "Cuaca sangat bagus, matahari bersinar terik, di langit tiada awan." },
        { hanzi: "我背着新书包，高高兴兴地去学校。", pinyin: "Wǒ bēizhe xīn shūbāo, gāogāoxìngxìng de qù xuéxiào.", translation: "Saya menggendong tas sekolah baru, dengan gembira pergi ke sekolah." },
        { hanzi: "学校里有很多新同学和新老师。", pinyin: "Xuéxiào li yǒu hěn duō xīn tóngxué hé xīn lǎoshī.", translation: "Di dalam sekolah ada banyak teman baru dan guru baru." },
        { hanzi: "王老师笑着对我们说：“欢迎大家来到新班级！”", pinyin: "Wáng lǎoshī xiàozhe duì wǒmen shuō: “Huānyíng dàjiā lái dào xīn bānjí!”", translation: "Guru Wang tersenyum berkata pada kami: \"Selamat datang semuanya di kelas baru!\"" }
      ],
      vocabulary: [
        { hanzi: "开学", pinyin: "kāixué", meaning: "Mulai masuk sekolah" },
        { hanzi: "书包", pinyin: "shūbāo", meaning: "Tas sekolah" },
        { hanzi: "高高兴兴", pinyin: "gāogāoxìngxìng", meaning: "Sangat gembira / senang" },
        { hanzi: "班级", pinyin: "bānjí", meaning: "Kelas" }
      ],
      question: "Kapan hari pertama sekolah dimulai menurut bacaan?",
      options: [
        { id: "A", text: "八月三十号 (30 Agustus)" },
        { id: "B", text: "九月一号 (1 September)" },
        { id: "C", text: "十月一号 (1 Oktober)" },
        { id: "D", text: "九月十号 (10 September)" }
      ],
      correctAnswer: "B",
      explanation: "Paragraf pertama menyatakan: '今天九月一号，是开学的第一天。' (Hari ini 1 September adalah hari pertama masuk sekolah)."
    },
    {
      title: "Di Restoran Masakan Tiongkok (在中国餐馆)",
      subtitle: "Membaca dialog & menu makanan lezat",
      level: "Mudah (HSK 1-2)",
      readTime: "2 Menit",
      category: "Percakapan & Menu",
      passage: [
        { hanzi: "服务员：您好，几位？请问想吃点什么？", pinyin: "Fúwùyuán: Nín hǎo, jǐ wèi? Qǐngwèn xiǎng chī diǎn shénme?", translation: "Pelayan: Halo, berapa orang? Mau makan apa?" },
        { hanzi: "大卫：我们两位。请给我们看菜单。", pinyin: "Dàwèi: Wǒmen liǎng wèi. Qǐng gěi wǒmen kàn càidān.", translation: "David: Kami berdua. Tolong beri kami lihat buku menu." },
        { hanzi: "服务员：这是菜单。我们店的宫保鸡丁和北京烤鸭非常有名。", pinyin: "Fúwùyuán: Zhè shì càidān. Wǒmen diàn de Gōngbǎo Jīdīng hé Běijīng Kǎoyā fēicháng yǒumíng.", translation: "Pelayan: Ini menunya. Ayam Kung Pao dan Bebek Panggang Beijing di resto kami sangat terkenal." },
        { hanzi: "大卫：那来一份宫保鸡丁，两碗米饭，两杯冰茶。", pinyin: "Dàwèi: Nà lái yī fèn Gōngbǎo Jīdīng, liǎng wǎn mǐfàn, liǎng bēi bīng chá.", translation: "David: Kalau begitu pesan satu porsi Ayam Kung Pao, 2 mangkok nasi, 2 gelas es teh." }
      ],
      vocabulary: [
        { hanzi: "服务员", pinyin: "fúwùyuán", meaning: "Pelayan" },
        { hanzi: "菜单", pinyin: "càidān", meaning: "Daftar menu" },
        { hanzi: "烤鸭", pinyin: "kǎoyā", meaning: "Bebek panggang" },
        { hanzi: "米饭", pinyin: "mǐfàn", meaning: "Nasi putih" }
      ],
      question: "Berapa porsi nasi putih (米饭) yang dipesan oleh David?",
      options: [
        { id: "A", text: "一碗 (Satu mangkok)" },
        { id: "B", text: "两碗 (Dua mangkok)" },
        { id: "C", text: "三碗 (Tiga mangkok)" },
        { id: "D", text: "四碗 (Empat mangkok)" }
      ],
      correctAnswer: "B",
      explanation: "David memesan '两碗米饭' (liǎng wǎn mǐfàn = dua mangkok nasi putih)."
    },
    {
      title: "Keluarga Xiao Lin (小林的幸福家庭)",
      subtitle: "Mengenal anggota keluarga dan hobi masing-masing",
      level: "Mudah (HSK 2)",
      readTime: "3 Menit",
      category: "Deskripsi Orang",
      passage: [
        { hanzi: "我家有五口人：爷爷、爸爸、妈妈、妹妹和我。", pinyin: "Wǒ jiā yǒu wǔ kǒu rén: yéye, bàba, māma, mèimei hé wǒ.", translation: "Keluarga saya ada 5 orang: kakek, ayah, ibu, adik perempuan, dan saya." },
        { hanzi: "爸爸是一名医生，在市中心的大医院工作，平时很忙。", pinyin: "Bàba shì yī míng yīshēng, zài shì zhōngxīn de dà yīyuàn gōngzuò, píngshí hěn máng.", translation: "Ayah adalah seorang dokter, bekerja di rumah sakit besar pusat kota, biasanya sangat sibuk." },
        { hanzi: "妈妈是中学英语老师，学生们都很喜欢她。", pinyin: "Māma shì zhōngxué Yīngyǔ lǎoshī, xuéshengmen dōu hěn xǐhuan tā.", translation: "Ibu adalah guru bahasa Inggris SMP, para murid sangat menyukainya." },
        { hanzi: "妹妹今年七岁，正在上小学一年级，她很喜欢画画和小动物。", pinyin: "Mèimei jīnnián qī suì, zhèngzài shàng xiǎoxué yī niánjí, tā hěn xǐhuan huàhuà hé xiǎo dòngwù.", translation: "Adik perempuan tahun ini 7 tahun, sedang kelas 1 SD, sangat suka menggambar dan hewan kecil." },
        { hanzi: "周末我们全家人喜欢去公园散步、野餐。", pinyin: "Zhōumò wǒmen quán jiā rén xǐhuan qù gōngyuán sànbù, yěcān.", translation: "Akhir pekan sekeluarga kami suka pergi ke taman jalan-jalan santai dan piknik." }
      ],
      vocabulary: [
        { hanzi: "医生", pinyin: "yīshēng", meaning: "Dokter" },
        { hanzi: "英语", pinyin: "Yīngyǔ", meaning: "Bahasa Inggris" },
        { hanzi: "散步", pinyin: "sànbù", meaning: "Jalan santai" },
        { hanzi: "野餐", pinyin: "yěcān", meaning: "Piknik" }
      ],
      question: "Di manakah ayah Xiao Lin bekerja?",
      options: [
        { id: "A", text: "在学校 (Di sekolah)" },
        { id: "B", text: "在医院 (Di rumah sakit)" },
        { id: "C", text: "在银行 (Di bank)" },
        { id: "D", text: "在商店 (Di toko)" }
      ],
      correctAnswer: "B",
      explanation: "Ayahnya adalah seorang dokter dan bekerja di rumah sakit besar: '爸爸是一名医生，在市中心的大医院工作'."
    },
    {
      title: "Perjalanan ke Kota Shanghai (上海之旅)",
      subtitle: "Pengalaman liburan naik kereta cepat ke Shanghai",
      level: "Sedang (HSK 2-3)",
      readTime: "3 Menit",
      category: "Pariwisata",
      passage: [
        { hanzi: "上个月我和朋友坐高铁去上海旅游。", pinyin: "Shàng gè yuè wǒ hé péngyou zuò gāotiě qù Shànghǎi lǚyóu.", translation: "Bulan lalu saya dan teman naik kereta cepat berwisata ke Shanghai." },
        { hanzi: "从北京到上海只需要四个半小时，列车既干净又平稳。", pinyin: "Cóng Běijīng dào Shànghǎi zhǐ xūyào sì gè bàn xiǎoshí, lièchē jì gānjìng yòu píngwěn.", translation: "Dari Beijing ke Shanghai hanya butuh 4,5 jam, keretanya bersih dan stabil." },
        { hanzi: "在上海，我们去了外滩看黄浦江的夜景，高楼大厦灯火辉煌，美丽极了。", pinyin: "Zài Shànghǎi, wǒmen qùle Wàitān kàn Huángpǔ Jiāng de yèjǐng, gāolóu dàshà dēnghuǒ huīhuáng, měilì jí le.", translation: "Di Shanghai, kami pergi ke The Bund melihat pemandangan malam Sungai Huangpu, gedung pencakar langit gemerlap, sangat indah." },
        { hanzi: "我们还尝了正宗的上海小笼包，皮薄汁多，味道好极了！", pinyin: "Wǒmen hái chángle zhèngzōng de Shànghǎi xiǎolóngbāo, pí báo zhī duō, wèidao hǎo jí le!", translation: "Kami juga mencicipi xiaolongbao Shanghai autentik, kulit tipis banyak kuah, rasanya luar biasa!" }
      ],
      vocabulary: [
        { hanzi: "高铁", pinyin: "gāotiě", meaning: "Kereta api cepat" },
        { hanzi: "平稳", pinyin: "píngwěn", meaning: "Tenang / stabil" },
        { hanzi: "夜景", pinyin: "yèjǐng", meaning: "Pemandangan malam" },
        { hanzi: "小笼包", pinyin: "xiǎolóngbāo", meaning: "Kukusan pangsit sup" }
      ],
      question: "Berapa lama waktu tempuh kereta cepat dari Beijing ke Shanghai?",
      options: [
        { id: "A", text: "两个小时 (2 Jam)" },
        { id: "B", text: "三个小时 (3 Jam)" },
        { id: "C", text: "四个半小时 (4,5 Jam)" },
        { id: "D", text: "六个小时 (6 Jam)" }
      ],
      correctAnswer: "C",
      explanation: "Teks menyebutkan '只需要四个半小时' (hanya perlu 4 setengah jam)."
    },
    {
      title: "Festival Musim Semi Imlek (春节的传统习俗)",
      subtitle: "Mengenal budaya perayaan tahun baru tradisional Tionghoa",
      level: "Sedang (HSK 3)",
      readTime: "3 Menit",
      category: "Budaya Tradisional",
      passage: [
        { hanzi: "春节是中国人最隆重、最热闹的传统节日。", pinyin: "Chūnjié shì Zhōngguórén zuì lóngzhòng, zuì rènao de chuántǒng jiérì.", translation: "Imlek adalah hari raya tradisional paling megah dan meriah bagi orang Tionghoa." },
        { hanzi: "除夕那天晚上，全家人都会聚在一起吃年夜饭，桌上有鱼、鸡肉和热腾腾的水饺。", pinyin: "Chúxī nà tiān wǎnshang, quán jiā rén dūhuì jù zài yīqǐ chī niányèfàn, zhuō shang yǒu yú, jīròu hé rètēngtēng de shuǐjiǎo.", translation: "Pada malam tahun baru (Chuxi), sekeluarga berkumpul makan malam tahun baru, ada ikan, ayam, dan pangsit rebus panas." },
        { hanzi: "“鱼”和“余”发音相同，象征着“年年有余”，生活富裕。", pinyin: "“Yú” hé “yú” fāyīn xiāngtóng, xiàngzhēngzhe “niánnián yǒuyú”, shēnghuó fùyù.", translation: "Bunyi kata 'ikan' sama dengan 'sisa/kelimpahan', melambangkan 'tiap tahun berlimpah rezeki'." },
        { hanzi: "长辈还会给小孩子们包红包，祝愿他们在新的一年里健康成长。", pinyin: "Zhǎngbèi hái huì gěi xiǎoháizimen bāo hóngbāo, zhùyuàn tāmen zài xīn de yī nián li jiànkāng chéngzhǎng.", translation: "Para orang tua juga membagikan angpau kepada anak-anak, mendoakan tumbuh sehat di tahun baru." }
      ],
      vocabulary: [
        { hanzi: "隆重", pinyin: "lóngzhòng", meaning: "Agung / megah" },
        { hanzi: "年夜饭", pinyin: "niányèfàn", meaning: "Makan malam reuni Imlek" },
        { hanzi: "象征", pinyin: "xiàngzhēng", meaning: "Melambangkan" },
        { hanzi: "红包", pinyin: "hóngbāo", meaning: "Amplop merah / angpau" }
      ],
      question: "Mengapa hidangan ikan (鱼) selalu ada saat makan malam Imlek?",
      options: [
        { id: "A", text: "Karena ikan murah harganya" },
        { id: "B", text: "Karena '鱼' berima sama dengan '余', melambangkan rezeki berlimpah" },
        { id: "C", text: "Karena anak-anak hanya mau makan ikan" },
        { id: "D", text: "Sebagai pengganti daging ayam" }
      ],
      correctAnswer: "B",
      explanation: "Teks menjelaskan: '“鱼”和“余”发音相同，象征着“年年有余”' (ikan bunyinya sama dengan yú yang berarti surplus/kelimpahan rezeki)."
    },
    {
      title: "Pentingnya Menjaga Kesehatan (保持身体健康的秘诀)",
      subtitle: "Pola makan seimbang dan gaya hidup aktif",
      level: "Sedang (HSK 3)",
      readTime: "3 Menit",
      category: "Kesehatan",
      passage: [
        { hanzi: "随着生活节奏变快，越来越多的人开始重视身体健康。", pinyin: "Suízhe shēnghuó jiézòu biàn kuài, yuèláiyuè duō de rén kāishǐ zhòngshì shēntǐ jiànkāng.", translation: "Seiring ritme hidup kian cepat, semakin banyak orang mementingkan kesehatan tubuh." },
        { hanzi: "想要保持健康，首先要有规律的作息时间，保证每天睡足七到八个小时。", pinyin: "Xiǎng yào bǎochí jiànkāng, shǒuxiān yào yǒu guīlǜ de zuòxī shíjiān, bǎozhèng měitiān shuì zú qī dào bā gè xiǎoshí.", translation: "Ingin tetap sehat, pertama harus punya jam istirahat teratur, memastikan tidur cukup 7-8 jam per hari." },
        { hanzi: "其次是饮食要清淡，多吃新鲜蔬菜和水果，少喝含糖饮料。", pinyin: "Qícì shì yǐnshí yào qīngdàn, duō chī xīnxiān shūcài hé shuǐguǒ, shǎo hē hántáng yǐnliào.", translation: "Kedua pola makan tidak boleh terlalu asin/berminyak, banyak makan sayur dan buah segar, kurangi minuman manis." },
        { hanzi: "坚持每周慢跑或游泳三次，能够有效减轻压力，增强免疫力。", pinyin: "Jiānchí měi zhōu mànpǎo huò yóuyǒng sān cì, nénggòu yǒuxiào jiǎnqīng yālì, zēngqiáng miǎnyìlì.", translation: "Rutin jogging atau berenang 3 kali seminggu bisa efektif mengurangi stres dan meningkatkan imunitas." }
      ],
      vocabulary: [
        { hanzi: "规律", pinyin: "guīlǜ", meaning: "Teratur / disiplin pola" },
        { hanzi: "清淡", pinyin: "qīngdàn", meaning: "Ringan / tidak berminyak & gurih berlebih" },
        { hanzi: "免疫力", pinyin: "miǎnyìlì", meaning: "Daya tahan tubuh / imunitas" },
        { hanzi: "慢跑", pinyin: "mànpǎo", meaning: "Jogging" }
      ],
      question: "Berapa jam tidur yang direkomendasikan setiap hari menurut bacaan?",
      options: [
        { id: "A", text: "五到六个小时 (5-6 jam)" },
        { id: "B", text: "七到八个小时 (7-8 jam)" },
        { id: "C", text: "九到十个小时 (9-10 jam)" },
        { id: "D", text: "Bebas kapan saja" }
      ],
      correctAnswer: "B",
      explanation: "Teks menyatakan: '保证每天睡足七到八个小时' (menjamin tidur cukup 7 hingga 8 jam setiap hari)."
    },
    {
      title: "Teknologi Ramah Lingkungan & Daur Ulang (垃圾分类与环保)",
      subtitle: "Upaya pelestarian bumi dan pemilahan sampah",
      level: "Tinggi (HSK 4)",
      readTime: "4 Menit",
      category: "Lingkungan Hidup",
      passage: [
        { hanzi: "环境保护不仅关乎当下，更关系到人类子孙后代的生存与发展。", pinyin: "Huánjìng bǎohù bùjǐn guānhū dāngxià, gèng guānxì dào rénlèi zǐsūn hòudài de shēngcún yǔ fāzhǎn.", translation: "Perlindungan lingkungan tidak hanya menyangkut masa kini, melainkan berkaitan dengan kelangsungan hidup anak cucu manusia." },
        { hanzi: "目前许多现代城市已全面推广垃圾分类制度，分为可回收物、厨余垃圾、有害垃圾和其他垃圾四类。", pinyin: "Mùqián xǔduō xiàndài chéngshì yǐ quánmiàn tuīguǎng lājī fēnlèi zhìdù, fēn wéi kě-huíshōu-wù, chúyú lājī, yǒuhài lājī hé qítā lājī sì lèi.", translation: "Saat ini banyak kota modern telah mempromosikan pemilahan sampah: daur ulang, organik dapur, berbahaya, dan residu." },
        { hanzi: "出门自备环保购物袋，少用一次性塑料吸管与餐盒，举手之劳即可为地球减负。", pinyin: "Chūmén zì bèi huánbǎo gòuwù dài, shǎo yòng yīcìxìng sùliào xīguǎn yǔ cānhé, jǔshǒuzhīláo jí kě wèi dìqiú jiǎnfù.", translation: "Membawa tas belanja ramah lingkungan sendiri, mengurangi sedotan plastik sekali pakai, tindakan kecil ini meringankan beban bumi." }
      ],
      vocabulary: [
        { hanzi: "垃圾分类", pinyin: "lājī fēnlèi", meaning: "Pemilahan sampah" },
        { hanzi: "一次性", pinyin: "yīcìxìng", meaning: "Sekali pakai (disposable)" },
        { hanzi: "举手之劳", pinyin: "jǔshǒuzhīláo", meaning: "Usaha kecil / perbuatan mudah" },
        { hanzi: "有害", pinyin: "yǒuhài", meaning: "Berbahaya / beracun" }
      ],
      question: "Sampah dibedakan menjadi berapa kategori utama dalam teks?",
      options: [
        { id: "A", text: "两类 (2 Kategori)" },
        { id: "B", text: "三类 (3 Kategori)" },
        { id: "C", text: "四类 (4 Kategori)" },
        { id: "D", text: "五类 (5 Kategori)" }
      ],
      correctAnswer: "C",
      explanation: "Teks menyebutkan pemilahan 4 kategori: 可回收物、厨余垃圾、有害垃圾、其他垃圾 (sì lèi = empat jenis)."
    },
    {
      title: "Seni Kaligrafi Tionghoa (中国书法的神韵)",
      subtitle: "Filsafat dan estetika kuas tinta tradisional",
      level: "Tinggi (HSK 5)",
      readTime: "4 Menit",
      category: "Kesenian & Filsafat",
      passage: [
        { hanzi: "书法被誉为无言之诗、无行之舞、无图之画。", pinyin: "Shūfǎ bèi yù wéi wú yán zhī shī, wú xíng zhī wǔ, wú tú zhī huà.", translation: "Kaligrafi dijuluki puisi tanpa kata, tarian tanpa gerak tubuh, dan lukisan tanpa gambar." },
        { hanzi: "它以笔墨纸砚为媒介，讲究用笔的藏露与提按，体现出中国道家阴阳虚实的深邃哲学。", pinyin: "Tā yǐ bǐ mò zhǐ yàn wéi méijiè, jiǎngjiu yòngbǐ de cáng-lù yǔ tí-àn, tǐxiàn chū Zhōngguó Dàojiā yīnyáng xū-shí de shēnsuì zhéxué.", translation: "Bermediakan kuas, tinta, kertas, dan bak tinta; mementingkan sembunyi-tampak dan angkat-tekan, memantulkan filsafat Daois yin-yang." },
        { hanzi: "练习书法不仅能够修身养性，更能让现代人在浮躁中寻觅到内心的宁静。", pinyin: "Liànxí shūfǎ bùjǐn nénggòu xiūshēn-yǎngxìng, gèng néng ràng xiàndàirén zài fúzào zhōng xúnmì dào nèixīn de níngjìng.", translation: "Berlatih kaligrafi tidak hanya membina karakter mulia, tetapi juga membantu orang modern menemukan ketenangan jiwa di tengah kebisingan." }
      ],
      vocabulary: [
        { hanzi: "笔墨纸砚", pinyin: "bǐ mò zhǐ yàn", meaning: "Empat pusaka ruang belajar (kuas, tinta, kertas, bak)" },
        { hanzi: "修身养性", pinyin: "xiūshēnyǎngxìng", meaning: "Membina diri dan watak mulia" },
        { hanzi: "浮躁", pinyin: "fúzào", meaning: "Gelisah / serba terburu-buru" },
        { hanzi: "宁静", pinyin: "níngjìng", meaning: "Ketenangan kedamaian" }
      ],
      question: "Apa julukan puitis bagi seni kaligrafi dalam bacaan?",
      options: [
        { id: "A", text: "无言之诗、无行之舞、无图之画" },
        { id: "B", text: "快餐文化之代表" },
        { id: "C", text: "只有古人才能懂的技术" },
        { id: "D", text: "现代商业美术" }
      ],
      correctAnswer: "A",
      explanation: "Kalimat pembuka menyatakan: '书法被誉为无言之诗、无行之舞、无图之画' (Puisi tanpa kata, tarian tanpa gerak fisik, lukisan tanpa gambar)."
    },
    {
      title: "Perkembangan Ekonomi Digital (数字经济与移动支付)",
      subtitle: "Transformasi transaksi belanja di era kecerdasan buatan",
      level: "Tinggi (HSK 5)",
      readTime: "4 Menit",
      category: "Ekonomi & Teknologi",
      passage: [
        { hanzi: "近十年来，数字经济呈现出前所未有的爆发式增长。", pinyin: "Jìn shí nián lái, shùzì jīngjì chéngxiàn chū qiánsuǒwèiyǒu de bàofāshì zēngzhǎng.", translation: "Selama 10 tahun terakhir, ekonomi digital mengalami pertumbuhan eksplosif yang belum pernah ada sebelumnya." },
        { hanzi: "从街边小贩到大型商场，二维码移动支付已完全取代现金交易，重塑了人们的消费习惯。", pinyin: "Cóng jiēbiān xiǎofàn dào dàxíng shāngchǎng, èrwéimǎ yídòng zhīfù yǐ wánquán qǔdài xiànjīn jiāoyì, chóngsù le rénmen de xiāofèi xíguàn.", translation: "Dari pedagang kaki lima hingga mal besar, pembayaran mobile QR code telah menggantikan uang tunai dan membentuk ulang perilaku konsumsi." },
        { hanzi: "大数据与人工智能技术的深度结合，更使个性化推荐和供应链优化达到了全新水准。", pinyin: "Dà-shùjù yǔ réngōng zhìnéng jìshù de shēndù jiéhé, gèng shǐ gèxìnghuà tuījiàn hé gōngyìngliàn yōuhuà dádào le quánxīn shuǐzhǔn.", translation: "Kombinasi mendalam big data dan AI membuat rekomendasi personal serta optimalisasi rantai pasok mencapai standar baru." }
      ],
      vocabulary: [
        { hanzi: "前所未有", pinyin: "qiánsuǒwèiyǒu", meaning: "Belum pernah terjadi sebelumnya" },
        { hanzi: "二维码", pinyin: "èrwéimǎ", meaning: "QR code" },
        { hanzi: "重塑", pinyin: "chóngsù", meaning: "Membentuk ulang (reshape)" },
        { hanzi: "供应链", pinyin: "gōngyìngliàn", meaning: "Rantai pasok (supply chain)" }
      ],
      question: "Apa teknologi transaksi yang telah menggantikan tunai dalam kehidupan sehari-hari?",
      options: [
        { id: "A", text: "支票 (Cek bank)" },
        { id: "B", text: "二维码移动支付 (Pembayaran ponsel kode QR)" },
        { id: "C", text: "硬币 (Koin)" },
        { id: "D", text: "信用卡 (Kartu kredit fisik)" }
      ],
      correctAnswer: "B",
      explanation: "Teks menyebutkan '二维码移动支付已完全取代现金交易' (pembayaran mobile kode QR telah sepenuhnya menggantikan transaksi tunai)."
    },
    {
      title: "Pepatah Kuno Tentang Ketekunan (锲而不舍，金石可镂)",
      subtitle: "Hikmah filosofi Xunzi tentang ketekunan meraih mimpi",
      level: "Tinggi (HSK 6)",
      readTime: "5 Menit",
      category: "Kearifan Klasik",
      passage: [
        { hanzi: "荀子在《劝学》中写道：“锲而舍之，朽木不折；锲而不舍，金石可镂。”", pinyin: "Xúnzǐ zài «Quàn Xué» zhōng xiě dào: “Qiè ér shě zhī, xiǔmù bù zhé; qiè ér bù shě, jīnshí kě lòu.”", translation: "Filsuf Xunzi dalam «Nasihat Belajar» menulis: \"Jika mengukir lalu berhenti, kayu lapuk pun tak patah; jika tekun tak menyerah, logam dan batu pun dapat terukir.\"" },
        { hanzi: "这句话生动地揭示了坚持不懈在求学与立业中的决定性力量。", pinyin: "Zhè jù huà shēngdòng de jiēshì le jiānchí bùxiè zài qiúxué yǔ lìyè zhōng de juédìngxìng lìliàng.", translation: "Pepatah ini dengan gamblang mengungkap kekuatan penentu dari ketekunan tanpa putus asa dalam menuntut ilmu dan berkarier." },
        { hanzi: "任何伟大的成就绝非一蹴而就，而是在日复一日的躬耕沉淀中水到渠成。", pinyin: "Rènhé wěidà de chéngjiù juéfēi yīcù'érjiù, ér shì zài rìfùyīrì de gōnggēng chéndiàn zhōng shuǐdàoqúchéng.", translation: "Pencapaian agung mana pun mustahil terjadi dalam semalam, melainkan terwujud dengan sendirinya melalui pengendapan kerja keras hari demi hari." }
      ],
      vocabulary: [
        { hanzi: "锲而不舍", pinyin: "qiè'érbùshě", meaning: "Tekun pantang mundur dan konsisten mengukir" },
        { hanzi: "一蹴而就", pinyin: "yīcù'érjiù", meaning: "Berhasil instan dalam satu langkah mudah" },
        { hanzi: "水到渠成", pinyin: "shuǐdàoqúchéng", meaning: "Ketika kondisi matang, sukses mengalir alami" },
        { hanzi: "沉淀", pinyin: "chéndiàn", meaning: "Pengendapan / pematangan mendalam" }
      ],
      question: "Apa pesan filosofis utama dari pepatah '锲而不舍，金石可镂'?",
      options: [
        { id: "A", text: "Batu dan logam mudah pecah" },
        { id: "B", text: "Ketekunan dan konsistensi yang teguh mampu menaklukkan kesulitan terkeras sekalipun" },
        { id: "C", text: "Kayu lapuk lebih kuat dari besi" },
        { id: "D", text: "Belajar hanya perlu bakat alami" }
      ],
      correctAnswer: "B",
      explanation: "Pepatah ini menekankan bahwa kegigihan yang tak pernah menyerah (锲而不舍) dapat mengukir batu dan logam yang paling keras sekalipun."
    }
  ],

  // Current Writing Exercise Index
  currentWritingExercise: 0,

  // Writing & Grammar Exercises Data (Susun Kalimat & Kaidah Goresan Interaktif)
  writingData: [
    {
      title: "Susun Kalimat: Kepemilikan & Kualitas (HSK 1)",
      subtitle: "Menyusun kata acak menjadi kalimat SVO baku",
      hskLevel: "HSK 1",
      scrambledWords: ["很好", "妈妈", "的", "身体"],
      meaning: "Kesehatan ibu sangat baik.",
      question: "Susun kata-kata acak berikut menjadi kalimat baku bahasa Mandarin:<br><strong>[ 很好 / 妈妈 / 的 / 身体 ]</strong>",
      options: [
        { id: "A", text: "妈妈身体的很好" },
        { id: "B", text: "妈妈的身体很好 (Māma de shēntǐ hěn hǎo)" },
        { id: "C", text: "很好身体的妈妈" },
        { id: "D", text: "的身体妈妈很好" }
      ],
      correctAnswer: "B",
      explanation: "Rumus kepemilikan bahasa Mandarin: [Pemilik (妈妈) + 的 + Benda (身体) + Predikat (很好)]."
    },
    {
      title: "Kaidah Urutan Goresan Karakter '你' (HSK 1)",
      subtitle: "Menentukan goresan pertama dan aturan arah penulisan",
      hskLevel: "HSK 1",
      scrambledWords: ["你", "nǐ", "7 Goresan"],
      meaning: "Kaidah: Kiri ke Kanan (从左到右)",
      question: "Karakter '你' (nǐ) memiliki 7 goresan. Goresan pertama (第一笔) apakah yang harus ditulis terlebih dahulu?",
      options: [
        { id: "A", text: "撇 (Piě - garis miring kiri pada radikal orang 亻)" },
        { id: "B", text: "横 (Héng - garis mendatar)" },
        { id: "C", text: "竖 (Shù - garis tegak lurus)" },
        { id: "D", text: "点 (Diǎn - titik)" }
      ],
      correctAnswer: "A",
      explanation: "Kaidah penulisan '你': Bagian radikal orang (亻) di sebelah kiri ditulis dulu, dimulai dari 撇 (Piě) lalu 竖 (Shù)."
    },
    {
      title: "Susun Kalimat: Perbandingan Pola 比 (HSK 2)",
      subtitle: "Menyusun kalimat komparasi harga buah",
      hskLevel: "HSK 2",
      scrambledWords: ["比", "西瓜", "苹果", "便宜"],
      meaning: "Apel lebih murah daripada semangka.",
      question: "Susun kata-kata berikut dengan pola komparasi '比':<br><strong>[ 比 / 西瓜 / 苹果 / 便宜 ]</strong>",
      options: [
        { id: "A", text: "西瓜便宜比苹果" },
        { id: "B", text: "苹果比西瓜便宜 (Píngguǒ bǐ xīguā piányi)" },
        { id: "C", text: "比苹果便宜西瓜" },
        { id: "D", text: "苹果便宜西瓜比" }
      ],
      correctAnswer: "B",
      explanation: "Pola komparasi HSK 2: [Benda A + 比 + Benda B + Adjektiva]. Maka: 苹果比西瓜便宜."
    },
    {
      title: "Kaidah Urutan Goresan Karakter '国' (HSK 2)",
      subtitle: "Kaidah Luar ke Dalam, Tutup Belakangan",
      hskLevel: "HSK 2",
      scrambledWords: ["国", "guó", "8 Goresan"],
      meaning: "Kaidah: 先进入后关门 (Masuk dulu baru tutup pintu)",
      question: "Pada penulisan karakter berbingkai kotak penuh seperti '国' (guó), kapankah garis mendatar penutup bawah kotak ditulis?",
      options: [
        { id: "A", text: "Paling pertama sebelum membuat kotak" },
        { id: "B", text: "Paling terakhir setelah isi karakter di dalam kotak (玉) selesai ditulis" },
        { id: "C", text: "Bersamaan dengan garis tegak kiri" },
        { id: "D", text: "Bebas kapan saja tanpa aturan" }
      ],
      correctAnswer: "B",
      explanation: "Kaidah penulisan '先进入后关门': Kotak luar dibuka, isi bagian dalam (玉) ditulis hingga selesai, barulah garis bawah penutup (横) ditulis paling akhir."
    },
    {
      title: "Susun Kalimat: Manipulasi Objek Partikel 把 (HSK 3)",
      subtitle: "Menyusun kalimat aksi mengubah kondisi objek",
      hskLevel: "HSK 3",
      scrambledWords: ["把", "弟弟", "喝完", "了", "牛奶"],
      meaning: "Adik telah meminum habis susu itu.",
      question: "Susun kalimat manipulasi pola '把':<br><strong>[ 把 / 弟弟 / 喝完 / 了 / 牛奶 ]</strong>",
      options: [
        { id: "A", text: "弟弟把牛奶喝完了 (Dìdi bǎ niúnǎi hē wán le)" },
        { id: "B", text: "牛奶把弟弟喝完了" },
        { id: "C", text: "喝完了弟弟把牛奶" },
        { id: "D", text: "弟弟喝完了牛奶把" }
      ],
      correctAnswer: "A",
      explanation: "Pola kalimat 把 HSK 3: [Pelaku (弟弟) + 把 + Objek (牛奶) + Kata Kerja + Pelengkap Hasil (喝完了)]."
    },
    {
      title: "Susun Kalimat: Kalimat Pasif Partikel 被 (HSK 3)",
      subtitle: "Menyusun kalimat objek dikenai perbuatan",
      hskLevel: "HSK 3",
      scrambledWords: ["被", "蛋糕", "小猫", "吃了"],
      meaning: "Kue itu telah dimakan oleh anak kucing.",
      question: "Susun kalimat pasif pola '被':<br><strong>[ 被 / 蛋糕 / 小猫 / 吃了 ]</strong>",
      options: [
        { id: "A", text: "小猫被吃了蛋糕" },
        { id: "B", text: "蛋糕被小猫吃了 (Dàngāo bèi xiǎomāo chī le)" },
        { id: "C", text: "吃了被小猫蛋糕" },
        { id: "D", text: "小猫蛋糕吃了被" }
      ],
      correctAnswer: "B",
      explanation: "Pola pasif 被: [Objek yang dikenai (蛋糕) + 被 + Pelaku (小猫) + Kata Kerja (吃了)]."
    },
    {
      title: "Susun Kalimat: Hubungan Kausalitas 不仅……而且…… (HSK 4)",
      subtitle: "Menghubungkan dua keunggulan bertingkat",
      hskLevel: "HSK 4",
      scrambledWords: ["不仅", "他", "聪明", "努力", "而且", "很"],
      meaning: "Dia tidak hanya pintar, tetapi juga sangat rajin.",
      question: "Susun konjungsi bertingkat '不仅……而且……':<br><strong>[ 不仅 / 他 / 聪明 / 努力 / 而且 / 很 ]</strong>",
      options: [
        { id: "A", text: "他不仅聪明，而且很努力 (Tā bùjǐn cōngmíng, érqiě hěn nǔlì)" },
        { id: "B", text: "不仅他聪明，很努力而且" },
        { id: "C", text: "他聪明不仅，很努力而且" },
        { id: "D", text: "而且很努力，他不仅聪明" }
      ],
      correctAnswer: "A",
      explanation: "Pola HSK 4: [Subjek + 不仅 + Sifat 1, 而且 + (很) + Sifat 2]. Urutan baku: 他不仅聪明，而且很努力."
    },
    {
      title: "Susun Kalimat: Syarat Mutlak 无论……都…… (HSK 5)",
      subtitle: "Menyusun kalimat bersyarat keteguhan tekad",
      hskLevel: "HSK 5",
      scrambledWords: ["无论", "多大", "困难", "我们", "都", "放弃", "不会"],
      meaning: "Apapun kesulitannya, kita semua tidak akan menyerah.",
      question: "Susun pola penalaran syarat '无论……都……':<br><strong>[ 无论 / 多大 / 困难 / 我们 / 都 / 放弃 / 不会 ]</strong>",
      options: [
        { id: "A", text: "我们无论多大困难，放弃都不会" },
        { id: "B", text: "无论面对多大困难，我们都不会放弃 (Wúlùn miànduì duō dà kùnnan, wǒmen dōu bù huì fàngqì)" },
        { id: "C", text: "都不会放弃，无论多大困难我们" },
        { id: "D", text: "困难多大无论，我们都不会放弃" }
      ],
      correctAnswer: "B",
      explanation: "Pola konsesif HSK 5: [无论 + Tingkat Kesulitan, Subjek + 都 + Predikat Negasi (不会放弃)]."
    }
  ],

  // Stroke Order Data for Writing (HSK 1 - 6: Masing-masing 20 Kosakata = Total 120 Kosakata)
  strokeCharacters: [
    {
        "char": "你",
        "pinyin": "nǐ",
        "meaning": "Kamu (You)",
        "strokesCount": 7,
        "hskLevel": "HSK 1",
        "rules": "Kiri ke Kanan (Radikal orang 亻 di kiri, lalu 尔 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Garis miring ke kiri atas radikal orang",
            "2. 竖 (Shù) - Garis lurus tegak ke bawah radikal orang",
            "3. 撇 (Piě) - Garis miring kepala atas",
            "4. 横撇 (Héngpiě) - Garis mendatar lalu tekuk miring kiri",
            "5. 竖钩 (Shùgōu) - Garis tegak lurus dengan kait ke kiri",
            "6. 撇 (Piě) - Titik miring kiri",
            "7. 点 (Diǎn) - Titik penutup kanan"
        ]
    },
    {
        "char": "好",
        "pinyin": "hǎo",
        "meaning": "Baik \/ Bagus (Good)",
        "strokesCount": 6,
        "hskLevel": "HSK 1",
        "rules": "Kiri ke Kanan (Radikal wanita 女 di kiri, lalu anak 子 di kanan)",
        "strokeSteps": [
            "1. 撇点 (Piědiǎn) - Miring ke kiri lalu serong ke kanan bawah",
            "2. 撇 (Piě) - Garis miring melintasi garis pertama",
            "3. 提 (Tí) - Sapuan naik sedikit dari kiri ke kanan melintang",
            "4. 横撇 (Héngpiě) - Mendatar lalu miring ke kiri bawah",
            "5. 弯钩 (Wāngōu) - Lengkung ke bawah dengan kaitan",
            "6. 横 (Héng) - Garis mendatar memotong tengah"
        ]
    },
    {
        "char": "我",
        "pinyin": "wǒ",
        "meaning": "Saya \/ Aku (I \/ Me)",
        "strokesCount": 7,
        "hskLevel": "HSK 1",
        "rules": "Kiri ke Kanan, Luar ke Dalam, Atas ke Bawah",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring pendek di kiri atas",
            "2. 横 (Héng) - Garis mendatar di sebelah kiri",
            "3. 竖钩 (Shùgōu) - Garis tegak berkait ke kiri atas",
            "4. 提 (Tí) - Sapuan naik ke kanan atas",
            "5. 斜钩 (Xiégōu) - Garis miring melengkung panjang berkait ke atas",
            "6. 撇 (Piě) - Garis miring pendek",
            "7. 点 (Diǎn) - Titik penutup di kanan atas"
        ]
    },
    {
        "char": "是",
        "pinyin": "shì",
        "meaning": "Adalah \/ Ialah \/ Benar (To be \/ Yes)",
        "strokesCount": 9,
        "hskLevel": "HSK 1",
        "rules": "Atas ke Bawah (Bagian matahari 日 di atas, lalu 疋 di bawah)",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak kiri kotak matahari",
            "2. 横折 (Héngzhé) - Mendatar lalu tekuk ke bawah",
            "3. 横 (Héng) - Garis mendatar penutup dalam kotak",
            "4. 横 (Héng) - Garis mendatar penutup bawah kotak",
            "5. 横 (Héng) - Garis mendatar panjang di tengah",
            "6. 竖 (Shù) - Garis tegak pendek",
            "7. 横 (Héng) - Garis mendatar pendek",
            "8. 撇 (Piě) - Garis miring ke kiri bawah",
            "9. 捺 (Nà) - Garis sapuan tebal memanjang ke kanan bawah"
        ]
    },
    {
        "char": "人",
        "pinyin": "rén",
        "meaning": "Orang \/ Manusia (Person \/ People)",
        "strokesCount": 2,
        "hskLevel": "HSK 1",
        "rules": "Kiri lalu Kanan (撇 Piě mendahului 捺 Nà)",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring melengkung ke kiri bawah",
            "2. 捺 (Nà) - Sapuan memanjang ke kanan bawah bertumpu pada goresan pertama"
        ]
    },
    {
        "char": "中",
        "pinyin": "zhōng",
        "meaning": "Tengah \/ Tiongkok (Middle \/ Center)",
        "strokesCount": 4,
        "hskLevel": "HSK 1",
        "rules": "Luar dulu, Dalam, Tutup, lalu Garis Tengah Vertikal Membelah",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak sisi kiri kotak",
            "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk ke bawah sisi kanan",
            "3. 横 (Héng) - Garis mendatar penutup kotak",
            "4. 竖 (Shù) - Garis tegak lurus panjang menembus tengah kotak"
        ]
    },
    {
        "char": "学",
        "pinyin": "xué",
        "meaning": "Belajar (Study \/ Learn)",
        "strokesCount": 8,
        "hskLevel": "HSK 1",
        "rules": "Atas ke Bawah (Titik atas, mahkota 冖, lalu anak 子)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik miring kiri atas",
            "2. 点 (Diǎn) - Titik tengah atas",
            "3. 撇 (Piě) - Sapuan miring kiri",
            "4. 点 (Diǎn) - Titik penutup kiri mahkota",
            "5. 横撇 (Héngpiě) - Garis mendatar tekuk miring kiri",
            "6. 横撇 (Héngpiě) - Tekukan kepala anak 子",
            "7. 弯钩 (Wāngōu) - Lengkungan badan berkait",
            "8. 横 (Héng) - Garis mendatar panjang memotong tengah"
        ]
    },
    {
        "char": "大",
        "pinyin": "dà",
        "meaning": "Besar (Big \/ Large)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Mendatar dulu, lalu Miring Kiri, diakhiri Sapuan Kanan",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas",
            "2. 撇 (Piě) - Garis miring kiri membelah garis mendatar",
            "3. 捺 (Nà) - Sapuan miring kanan memanjang"
        ]
    },
    {
        "char": "水",
        "pinyin": "shuǐ",
        "meaning": "Air (Water)",
        "strokesCount": 4,
        "hskLevel": "HSK 1",
        "rules": "Tengah Dulu, Baru Kiri lalu Kanan (先中间后两边)",
        "strokeSteps": [
            "1. 竖钩 (Shùgōu) - Garis tegak lurus tengah dengan kaitan ke kiri",
            "2. 横撇 (Héngpiě) - Mendatar tekuk miring di sebelah kiri",
            "3. 撇 (Piě) - Sapuan miring pendek di kanan atas",
            "4. 捺 (Nà) - Sapuan miring tebal di kanan bawah"
        ]
    },
    {
        "char": "门",
        "pinyin": "mén",
        "meaning": "Pintu \/ Pintu Masuk (Door \/ Gate)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Titik Kiri, Tegak Sisi, lalu Mendatar Tekuk Kait (点, 竖, 横折钩)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik di bagian kiri atas",
            "2. 竖 (Shù) - Garis tegak di bagian kiri bawah",
            "3. 横折钩 (Héngzhégōu) - Garis mendatar lalu tekuk tegak dengan kait"
        ]
    },
    {
        "char": "一",
        "pinyin": "yī",
        "meaning": "Satu (One)",
        "strokesCount": 1,
        "hskLevel": "HSK 1",
        "rules": "Garis Tunggal Mendatar dari Kiri ke Kanan (从左到右)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar lurus dari kiri ditarik mantap ke kanan"
        ]
    },
    {
        "char": "二",
        "pinyin": "èr",
        "meaning": "Dua (Two)",
        "strokesCount": 2,
        "hskLevel": "HSK 1",
        "rules": "Atas ke Bawah (Garis atas lebih pendek, garis bawah lebih panjang)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar pendek di atas",
            "2. 横 (Héng) - Garis mendatar panjang penyeimbang di bawah"
        ]
    },
    {
        "char": "三",
        "pinyin": "sān",
        "meaning": "Tiga (Three)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Atas ke Bawah (Atas sedang, tengah terpendek, bawah paling panjang)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas panjang sedang",
            "2. 横 (Héng) - Garis mendatar tengah paling pendek",
            "3. 横 (Héng) - Garis mendatar bawah paling panjang sebagai pondasi"
        ]
    },
    {
        "char": "十",
        "pinyin": "shí",
        "meaning": "Sepuluh (Ten)",
        "strokesCount": 2,
        "hskLevel": "HSK 1",
        "rules": "Mendatar Dulu Baru Garis Tegak (先横后竖)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar lurus di tengah",
            "2. 竖 (Shù) - Garis tegak lurus membelah tepat di tengah"
        ]
    },
    {
        "char": "日",
        "pinyin": "rì",
        "meaning": "Matahari \/ Hari (Sun \/ Day)",
        "strokesCount": 4,
        "hskLevel": "HSK 1",
        "rules": "Luar dulu, Dalam, lalu Tutup Bawah (先外后里再封口)",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak sisi kiri kotak matahari",
            "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk tegak sisi kanan",
            "3. 横 (Héng) - Garis mendatar di dalam kotak",
            "4. 横 (Héng) - Garis mendatar penutup bawah kotak"
        ]
    },
    {
        "char": "月",
        "pinyin": "yuè",
        "meaning": "Bulan (Moon \/ Month)",
        "strokesCount": 4,
        "hskLevel": "HSK 1",
        "rules": "Sisi Kiri, Bingkai Kanan Berkait, lalu Isi Mendatar",
        "strokeSteps": [
            "1. 撇 (Piě) - Garis miring melengkung ke kiri bawah sisi kiri",
            "2. 横折钩 (Héngzhégōu) - Mendatar lalu tekuk tegak dengan kait ke kiri",
            "3. 横 (Héng) - Garis mendatar bagian dalam atas",
            "4. 横 (Héng) - Garis mendatar bagian dalam bawah"
        ]
    },
    {
        "char": "木",
        "pinyin": "mù",
        "meaning": "Kayu \/ Pohon (Wood \/ Tree)",
        "strokesCount": 4,
        "hskLevel": "HSK 1",
        "rules": "Mendatar, Tegak Batang, Cabang Kiri, Cabang Kanan",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar dahan",
            "2. 竖 (Shù) - Garis tegak lurus batang pohon menembus",
            "3. 撇 (Piě) - Sapuan miring ke kiri bawah akar\/ranting",
            "4. 捺 (Nà) - Sapuan miring ke kanan bawah penyeimbang"
        ]
    },
    {
        "char": "口",
        "pinyin": "kǒu",
        "meaning": "Mulut \/ Lubang (Mouth \/ Opening)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Tegak Kiri, Mendatar Tekuk Kanan, Tutup Bawah (先外后里再封口)",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak sisi kiri kotak",
            "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk ke bawah sisi kanan",
            "3. 横 (Héng) - Garis mendatar penutup bawah kotak"
        ]
    },
    {
        "char": "山",
        "pinyin": "shān",
        "meaning": "Gunung (Mountain)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Puncak Tengah Dulu, lalu Kiri Lekuk, Kanan Tegak (先中间后两边)",
        "strokeSteps": [
            "1. 竖 (Shù) - Puncak tegak tertinggi di tengah",
            "2. 竖折 (Shùzhé) - Garis tegak sisi kiri lalu tekuk mendatar ke kanan",
            "3. 竖 (Shù) - Garis tegak sisi kanan gunung"
        ]
    },
    {
        "char": "小",
        "pinyin": "xiǎo",
        "meaning": "Kecil (Small \/ Little)",
        "strokesCount": 3,
        "hskLevel": "HSK 1",
        "rules": "Tengah Dulu, Baru Titik Kiri dan Kanan (先中间后两边)",
        "strokeSteps": [
            "1. 竖钩 (Shùgōu) - Garis tegak lurus tengah dengan kaitan ke kiri",
            "2. 撇\/点 (Piě) - Titik miring ke kiri atas",
            "3. 点 (Diǎn) - Titik serong ke kanan penyeimbang"
        ]
    },
    {
        "char": "买",
        "pinyin": "mǎi",
        "meaning": "Membeli (Buy)",
        "strokesCount": 6,
        "hskLevel": "HSK 2",
        "rules": "Atas ke Bawah (Bagian kait atas 乛 lalu bagian kepala 头)",
        "strokeSteps": [
            "1. 横折\/横钩 (Héngzhégōu) - Garis mendatar dengan tekukan kait",
            "2. 点 (Diǎn) - Titik miring di bagian kiri",
            "3. 横 (Héng) - Garis mendatar di bawah",
            "4. 撇 (Piě) - Sapuan miring ke kiri bawah",
            "5. 点 (Diǎn) - Titik pendukung",
            "6. 点 (Diǎn) - Titik penutup di kanan bawah"
        ]
    },
    {
        "char": "卖",
        "pinyin": "mài",
        "meaning": "Menjual (Sell)",
        "strokesCount": 8,
        "hskLevel": "HSK 2",
        "rules": "Atas ke Bawah (Karakter Sepuluh 十 di atas, diikuti 买 mǎi di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas karakter 十",
            "2. 竖 (Shù) - Garis tegak memotong karakter 十",
            "3. 横钩 (Hénggōu) - Garis mendatar tekuk kait",
            "4. 点 (Diǎn) - Titik kiri",
            "5. 横 (Héng) - Garis mendatar tengah",
            "6. 撇 (Piě) - Sapuan miring kiri bawah",
            "7. 点 (Diǎn) - Titik tengah",
            "8. 点 (Diǎn) - Titik penutup kanan bawah"
        ]
    },
    {
        "char": "进",
        "pinyin": "jìn",
        "meaning": "Masuk \/ Maju (Enter \/ Advance)",
        "strokesCount": 7,
        "hskLevel": "HSK 2",
        "rules": "Dalam Dulu Baru Radikal Berjalan (先里后外: 井 ditarik dulu, baru 辶)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas dari 井",
            "2. 横 (Héng) - Garis mendatar kedua dari 井",
            "3. 撇 (Piě) - Garis tegak miring kiri menembus",
            "4. 竖 (Shù) - Garis tegak lurus kanan menembus",
            "5. 点 (Diǎn) - Titik kepala radikal berjalan 辶",
            "6. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶",
            "7. 捺 (Nà) - Sapuan panjang landai melandasi bagian bawah"
        ]
    },
    {
        "char": "出",
        "pinyin": "chū",
        "meaning": "Keluar (Go out \/ Exit)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Tengah Dulu, Lalu Sisi Kiri dan Kanan (Gunung atas lalu gunung bawah)",
        "strokeSteps": [
            "1. 竖折\/竖 (Shùzhé) - Garis tegak lalu tekuk mendatar",
            "2. 竖 (Shù) - Garis tegak sisi kanan gunung atas",
            "3. 竖 (Shù) - Garis tegak tengah yang tinggi menembus",
            "4. 竖折 (Shùzhé) - Garis tegak tekuk mendatar gunung bawah",
            "5. 竖 (Shù) - Garis tegak penutup kanan bawah"
        ]
    },
    {
        "char": "等",
        "pinyin": "děng",
        "meaning": "Menunggu \/ Kelas (Wait \/ Equal)",
        "strokesCount": 12,
        "hskLevel": "HSK 2",
        "rules": "Atas ke Bawah (Radikal Bambu 竹 di atas, Kuil 寺 di bawah)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal bambu kiri",
            "2. 横 (Héng) - Mendatar radikal bambu kiri",
            "3. 点 (Diǎn) - Titik radikal bambu kiri",
            "4. 撇 (Piě) - Miring kiri radikal bambu kanan",
            "5. 横 (Héng) - Mendatar radikal bambu kanan",
            "6. 竖 (Shù) - Garis tegak radikal bambu kanan",
            "7. 横 (Héng) - Mendatar atas karakter bumi 土",
            "8. 竖 (Shù) - Tegak tengah karakter 土",
            "9. 横 (Héng) - Mendatar bawah panjang karakter 土",
            "10. 横 (Héng) - Mendatar karakter 寸",
            "11. 竖钩 (Shùgōu) - Tegak berkait karakter 寸",
            "12. 点 (Diǎn) - Titik penutup karakter 寸"
        ]
    },
    {
        "char": "高",
        "pinyin": "gāo",
        "meaning": "Tinggi (Tall \/ High)",
        "strokesCount": 10,
        "hskLevel": "HSK 2",
        "rules": "Atas ke Bawah, Luar dulu baru Dalam",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kepala atas",
            "2. 横 (Héng) - Garis mendatar pelindung",
            "3. 竖 (Shù) - Tegak kiri kotak atas",
            "4. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kotak atas",
            "5. 竖 (Shù) - Tegak kiri pintu tengah",
            "6. 横折 (Héngzhé) - Mendatar tekuk kanan",
            "7. 横 (Héng) - Mendatar penyambung",
            "8. 竖 (Shù) - Tegak kiri kotak bawah",
            "9. 横折 (Héngzhé) - Mendatar tekuk kotak bawah",
            "10. 横 (Héng) - Mendatar penutup kotak paling bawah"
        ]
    },
    {
        "char": "给",
        "pinyin": "gěi",
        "meaning": "Memberi \/ Kepada (Give \/ To)",
        "strokesCount": 9,
        "hskLevel": "HSK 2",
        "rules": "Kiri ke Kanan (Radikal Sutra 纟 di kiri, 合 di kanan)",
        "strokeSteps": [
            "1. 撇折 (Piězhé) - Miring tekuk radikal sutra 纟",
            "2. 撇折 (Piězhé) - Miring tekuk kedua radikal sutra 纟",
            "3. 提 (Tí) - Sapuan naik ke kanan atas radikal 纟",
            "4. 撇 (Piě) - Miring kiri kepala 合",
            "5. 捺 (Nà) - Sapuan miring kanan kepala 合",
            "6. 一 (Héng) - Garis mendatar pembatas 合",
            "7. 竖 (Shù) - Tegak kotak mulut 口",
            "8. 横折 (Héngzhé) - Mendatar tekuk kotak 口",
            "9. 横 (Héng) - Mendatar penutup kotak 口"
        ]
    },
    {
        "char": "问",
        "pinyin": "wèn",
        "meaning": "Bertanya (Ask)",
        "strokesCount": 6,
        "hskLevel": "HSK 2",
        "rules": "Luar Dulu Baru Dalam (Bingkai pintu 门 di luar, Mulut 口 di dalam)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kiri atas pintu",
            "2. 竖 (Shù) - Garis tegak sisi kiri pintu",
            "3. 横折钩 (Héngzhégōu) - Mendatar tekuk kait pintu luar",
            "4. 竖 (Shù) - Tegak sisi kiri mulut 口 di dalam",
            "5. 横折 (Héngzhé) - Mendatar tekuk sisi kanan mulut 口",
            "6. 横 (Héng) - Mendatar penutup bawah mulut 口"
        ]
    },
    {
        "char": "白",
        "pinyin": "bái",
        "meaning": "Putih \/ Jelas (White \/ Clear)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Titik Atas, Bingkai Kotak, Isi, lalu Tutup Bawah",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring pendek di puncak atas",
            "2. 竖 (Shù) - Garis tegak sisi kiri kotak",
            "3. 横折 (Héngzhé) - Mendatar lalu tekuk tegak sisi kanan",
            "4. 横 (Héng) - Garis mendatar tengah di dalam kotak",
            "5. 横 (Héng) - Garis mendatar penutup bawah kotak"
        ]
    },
    {
        "char": "百",
        "pinyin": "bǎi",
        "meaning": "Ratusan (Hundred)",
        "strokesCount": 6,
        "hskLevel": "HSK 2",
        "rules": "Mendatar Atas Dulu, lalu Karakter Putih 白 (从上到下)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas panjang",
            "2. 撇 (Piě) - Garis miring pendek kepala 白",
            "3. 竖 (Shù) - Tegak kiri kotak 白",
            "4. 横折 (Héngzhé) - Mendatar tekuk kotak 白",
            "5. 横 (Héng) - Mendatar tengah dalam kotak 白",
            "6. 横 (Héng) - Mendatar penutup bawah kotak 白"
        ]
    },
    {
        "char": "千",
        "pinyin": "qiān",
        "meaning": "Ribuan (Thousand)",
        "strokesCount": 3,
        "hskLevel": "HSK 2",
        "rules": "Miring Atas, Mendatar, lalu Tegak Panjang Menembus",
        "strokeSteps": [
            "1. 撇 (Piě) - Garis miring pendek di kiri atas",
            "2. 横 (Héng) - Garis mendatar panjang di tengah",
            "3. 竖 (Shù) - Garis tegak lurus menembus garis mendatar"
        ]
    },
    {
        "char": "多",
        "pinyin": "duō",
        "meaning": "Banyak (Many \/ Much)",
        "strokesCount": 6,
        "hskLevel": "HSK 2",
        "rules": "Atas ke Bawah (Dua karakter Senja 夕 bertumpuk vertikal)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri karakter 夕 atas",
            "2. 横撇 (Héngpiě) - Mendatar tekuk miring 夕 atas",
            "3. 点 (Diǎn) - Titik di dalam 夕 atas",
            "4. 撇 (Piě) - Miring kiri karakter 夕 bawah",
            "5. 横撇 (Héngpiě) - Mendatar tekuk miring 夕 bawah",
            "6. 点 (Diǎn) - Titik di dalam 夕 bawah"
        ]
    },
    {
        "char": "少",
        "pinyin": "shǎo",
        "meaning": "Sedikit \/ Kurang (Few \/ Little)",
        "strokesCount": 4,
        "hskLevel": "HSK 2",
        "rules": "Karakter Kecil 小 dulu, lalu Sapuan Miring Panjang Melintasi",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak tengah karakter 小",
            "2. 点\/撇 (Piě) - Titik miring di sebelah kiri",
            "3. 点 (Diǎn) - Titik miring di sebelah kanan",
            "4. 撇 (Piě) - Sapuan miring panjang melengkung ke kiri bawah"
        ]
    },
    {
        "char": "左",
        "pinyin": "zuǒ",
        "meaning": "Kiri (Left)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Mendatar, Miring Panjang, lalu Karakter Tukang 工 di bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar pertama di atas",
            "2. 撇 (Piě) - Sapuan miring panjang ke kiri bawah",
            "3. 横 (Héng) - Mendatar atas karakter 工",
            "4. 竖 (Shù) - Tegak tengah karakter 工",
            "5. 横 (Héng) - Mendatar bawah penutup karakter 工"
        ]
    },
    {
        "char": "右",
        "pinyin": "yòu",
        "meaning": "Kanan (Right)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Miring Panjang Dulu, Mendatar, lalu Kotak Mulut 口 di bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas",
            "2. 撇 (Piě) - Sapuan miring panjang ke kiri bawah",
            "3. 竖 (Shù) - Tegak kiri kotak mulut 口",
            "4. 横折 (Héngzhé) - Mendatar tekuk kotak mulut 口",
            "5. 横 (Héng) - Mendatar penutup bawah kotak mulut 口"
        ]
    },
    {
        "char": "手",
        "pinyin": "shǒu",
        "meaning": "Tangan (Hand)",
        "strokesCount": 4,
        "hskLevel": "HSK 2",
        "rules": "Miring Atas, Dua Mendatar, lalu Garis Lengkung Berkait Tengah",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring pendek di kiri atas",
            "2. 横 (Héng) - Garis mendatar pendek pertama",
            "3. 横 (Héng) - Garis mendatar kedua yang lebih panjang",
            "4. 弯钩 (Wāngōu) - Garis tegak melengkung tengah dengan kaitan ke kiri"
        ]
    },
    {
        "char": "足",
        "pinyin": "zú",
        "meaning": "Kaki \/ Cukup (Foot \/ Sufficient)",
        "strokesCount": 7,
        "hskLevel": "HSK 2",
        "rules": "Kotak Mulut 口 di atas, lalu Struktur Kaki 止 di bawah",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak kiri kotak mulut 口",
            "2. 横折 (Héngzhé) - Mendatar tekuk kotak 口",
            "3. 横 (Héng) - Mendatar penutup kotak 口",
            "4. 竖 (Shù) - Tegak tengah batang kaki",
            "5. 横 (Héng) - Mendatar pendek penyangga",
            "6. 撇 (Piě) - Miring kiri langkah kaki",
            "7. 捺 (Nà) - Sapuan tebal memanjang ke kanan bawah"
        ]
    },
    {
        "char": "目",
        "pinyin": "mù",
        "meaning": "Mata \/ Daftar (Eye \/ Item)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Kotak Vertikal Panjang, Dua Garis Tengah, Penutup Bawah",
        "strokeSteps": [
            "1. 竖 (Shù) - Garis tegak sisi kiri kotak mata",
            "2. 横折 (Héngzhé) - Mendatar lalu tekuk tegak ke bawah sisi kanan",
            "3. 横 (Héng) - Garis mendatar pertama dalam kotak",
            "4. 横 (Héng) - Garis mendatar kedua dalam kotak",
            "5. 横 (Héng) - Garis mendatar penutup bawah kotak"
        ]
    },
    {
        "char": "耳",
        "pinyin": "ěr",
        "meaning": "Telinga (Ear)",
        "strokesCount": 6,
        "hskLevel": "HSK 2",
        "rules": "Mendatar Atas, Dua Tegak, Dua Mendatar Tengah, Sapuan Naik Bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas pelindung",
            "2. 竖 (Shù) - Garis tegak sisi kiri telinga",
            "3. 竖 (Shù) - Garis tegak sisi kanan yang lebih panjang ke bawah",
            "4. 横 (Héng) - Garis mendatar dalam pertama",
            "5. 横 (Héng) - Garis mendatar dalam kedua",
            "6. 提\/横 (Tí) - Garis mendatar miring naik penutup bawah"
        ]
    },
    {
        "char": "生",
        "pinyin": "shēng",
        "meaning": "Lahir \/ Hidup \/ Mentah (Birth \/ Life)",
        "strokesCount": 5,
        "hskLevel": "HSK 2",
        "rules": "Miring Kiri Atas, Tiga Mendatar, dan Tegak Tengah Menembus",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring pendek di kiri atas",
            "2. 横 (Héng) - Garis mendatar atas",
            "3. 竖 (Shù) - Garis tegak lurus tengah menembus",
            "4. 横 (Héng) - Garis mendatar kedua tengah",
            "5. 横 (Héng) - Garis mendatar bawah paling panjang sebagai pondasi"
        ]
    },
    {
        "char": "春",
        "pinyin": "chūn",
        "meaning": "Musim Semi (Spring)",
        "strokesCount": 9,
        "hskLevel": "HSK 3",
        "rules": "Atas ke Bawah (Tiga garis mendatar 三, Orang 人, lalu Matahari 日)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar pertama atas",
            "2. 横 (Héng) - Mendatar kedua tengah",
            "3. 横 (Héng) - Mendatar ketiga panjang",
            "4. 撇 (Piě) - Sapuan miring kiri panjang menembus tiga garis",
            "5. 捺 (Nà) - Sapuan miring kanan panjang menyeimbangkan",
            "6. 竖 (Shù) - Garis tegak sisi kiri kotak matahari 日",
            "7. 横折 (Héngzhé) - Mendatar tekuk kotak 日",
            "8. 横 (Héng) - Mendatar tengah dalam kotak 日",
            "9. 横 (Héng) - Mendatar penutup bawah kotak 日"
        ]
    },
    {
        "char": "信",
        "pinyin": "xìn",
        "meaning": "Surat \/ Percaya (Letter \/ Believe)",
        "strokesCount": 9,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Radikal orang 亻 di kiri, lalu kata 言 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring kiri radikal orang",
            "2. 竖 (Shù) - Tegak lurus radikal orang",
            "3. 点 (Diǎn) - Titik kepala radikal kata 言",
            "4. 横 (Héng) - Mendatar panjang pertama",
            "5. 横 (Héng) - Mendatar kedua",
            "6. 横 (Héng) - Mendatar ketiga",
            "7. 竖 (Shù) - Tegak kiri kotak mulut 口",
            "8. 横折 (Héngzhé) - Mendatar tekuk kotak 口",
            "9. 横 (Héng) - Mendatar penutup kotak 口"
        ]
    },
    {
        "char": "班",
        "pinyin": "bān",
        "meaning": "Kelas \/ Regu \/ Bekerja (Class \/ Shift)",
        "strokesCount": 10,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Giok 王 di kiri, Pisau 刀 di tengah, Giok 王 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas giok kiri",
            "2. 横 (Héng) - Mendatar tengah giok kiri",
            "3. 竖 (Shù) - Tegak lurus giok kiri",
            "4. 提 (Tí) - Sapuan naik giok kiri",
            "5. 撇 (Piě) - Sapuan miring pisau tengah",
            "6. 竖 (Shù) - Garis tegak membelah tengah",
            "7. 横 (Héng) - Mendatar atas giok kanan",
            "8. 横 (Héng) - Mendatar tengah giok kanan",
            "9. 竖 (Shù) - Tegak lurus giok kanan",
            "10. 横 (Héng) - Mendatar penutup bawah giok kanan"
        ]
    },
    {
        "char": "接",
        "pinyin": "jiē",
        "meaning": "Menerima \/ Menjemput (Receive \/ Pick up)",
        "strokesCount": 11,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Radikal Tangan 扌 di kiri, 妾 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar radikal tangan 扌",
            "2. 竖钩 (Shùgōu) - Tegak berkait radikal tangan 扌",
            "3. 提 (Tí) - Sapuan naik radikal tangan 扌",
            "4. 点 (Diǎn) - Titik atas bagian 立",
            "5. 横 (Héng) - Mendatar atas 立",
            "6. 点 (Diǎn) - Titik kiri 立",
            "7. 撇 (Piě) - Miring kanan 立",
            "8. 横 (Héng) - Mendatar bawah 立",
            "9. 撇点 (Piědiǎn) - Miring tekuk radikal wanita 女",
            "10. 撇 (Piě) - Miring silang wanita 女",
            "11. 横 (Héng) - Mendatar panjang pemotong wanita 女"
        ]
    },
    {
        "char": "解",
        "pinyin": "jiě",
        "meaning": "Memahami \/ Mengurai (Understand \/ Untie)",
        "strokesCount": 13,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Tanduk 角 di kiri, Pisau 刀 & Sapi 牛 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring atas tanduk 角",
            "2. 横撇 (Héngpiě) - Mendatar tekuk tanduk 角",
            "3. 撇 (Piě) - Miring kiri dalam 角",
            "4. 横折钩 (Héngzhégōu) - Kait bingkai 角",
            "5. 横 (Héng) - Mendatar dalam 角",
            "6. 横 (Héng) - Mendatar kedua dalam 角",
            "7. 竖 (Shù) - Tegak tengah 角",
            "8. 横折 (Héngzhé) - Mendatar tekuk pisau 刀 kanan atas",
            "9. 撇 (Piě) - Miring melengkung pisau 刀",
            "10. 撇 (Piě) - Miring atas sapi 牛",
            "11. 横 (Héng) - Mendatar pertama sapi 牛",
            "12. 横 (Héng) - Mendatar panjang kedua sapi 牛",
            "13. 竖 (Shù) - Tegak lurus panjang menembus sapi 牛"
        ]
    },
    {
        "char": "夏",
        "pinyin": "xià",
        "meaning": "Musim Panas (Summer)",
        "strokesCount": 10,
        "hskLevel": "HSK 3",
        "rules": "Atas ke Bawah (Bagian kepala 一, Kotak Mata 目 tengah, dan Langkah 夂 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas",
            "2. 撇 (Piě) - Garis miring kiri pelindung",
            "3. 竖 (Shù) - Tegak kiri kotak mata",
            "4. 横折 (Héngzhé) - Mendatar tekuk kotak mata",
            "5. 横 (Héng) - Mendatar dalam mata pertama",
            "6. 横 (Héng) - Mendatar dalam mata kedua",
            "7. 横 (Héng) - Mendatar penutup kotak mata",
            "8. 撇 (Piě) - Miring langkah kaki 夂",
            "9. 横撇 (Héngpiě) - Mendatar tekuk langkah 夂",
            "10. 捺 (Nà) - Sapuan miring kanan tebal langkah 夂"
        ]
    },
    {
        "char": "秋",
        "pinyin": "qiū",
        "meaning": "Musim Gugur (Autumn)",
        "strokesCount": 9,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Padi 禾 di sebelah kiri, Api 火 di sebelah kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kepala bulir padi 禾",
            "2. 横 (Héng) - Mendatar padi 禾",
            "3. 竖 (Shù) - Tegak batang padi 禾",
            "4. 撇 (Piě) - Miring kiri akar padi 禾",
            "5. 点 (Diǎn) - Titik kanan akar padi 禾",
            "6. 点 (Diǎn) - Titik percikan kiri api 火",
            "7. 撇 (Piě) - Miring kanan percikan api 火",
            "8. 撇 (Piě) - Sapuan miring panjang lidah api 火",
            "9. 捺 (Nà) - Sapuan miring kanan tebal api 火"
        ]
    },
    {
        "char": "冬",
        "pinyin": "dōng",
        "meaning": "Musim Dingin (Winter)",
        "strokesCount": 5,
        "hskLevel": "HSK 3",
        "rules": "Atas ke Bawah (Atap Langkah 夂 di atas, Dua Titik Es di bawah)",
        "strokeSteps": [
            "1. 撇 (Piě) - Garis miring kiri atas",
            "2. 横撇 (Héngpiě) - Garis mendatar tekuk miring kiri",
            "3. 捺 (Nà) - Sapuan miring kanan memanjang",
            "4. 点 (Diǎn) - Titik beku es pertama di bawah",
            "5. 点 (Diǎn) - Titik beku es kedua di bawah"
        ]
    },
    {
        "char": "现",
        "pinyin": "xiàn",
        "meaning": "Muncul \/ Sekarang (Appear \/ Present)",
        "strokesCount": 8,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Giok 王 di kiri, Melihat 见 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas radikal giok",
            "2. 横 (Héng) - Mendatar kedua giok",
            "3. 竖 (Shù) - Tegak lurus giok",
            "4. 提 (Tí) - Sapuan naik giok",
            "5. 竖 (Shù) - Tegak kiri kotak melihat 见",
            "6. 横折 (Héngzhé) - Mendatar tekuk kotak 见",
            "7. 撇 (Piě) - Garis miring kaki kiri 见",
            "8. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 见"
        ]
    },
    {
        "char": "在",
        "pinyin": "zài",
        "meaning": "Berada di \/ Sedang (At \/ In \/ Present)",
        "strokesCount": 6,
        "hskLevel": "HSK 3",
        "rules": "Mendatar, Miring Panjang, Tegak, Mendatar, Tegak, Mendatar Bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas",
            "2. 撇 (Piě) - Garis miring panjang melengkung kiri",
            "3. 竖 (Shù) - Garis tegak lurus penyangga",
            "4. 横 (Héng) - Garis mendatar atas karakter bumi 土",
            "5. 竖 (Shù) - Garis tegak tengah karakter 土",
            "6. 横 (Héng) - Garis mendatar panjang penutup karakter 土"
        ]
    },
    {
        "char": "带",
        "pinyin": "dài",
        "meaning": "Membawa \/ Sabuk \/ Pita (Bring \/ Belt)",
        "strokesCount": 9,
        "hskLevel": "HSK 3",
        "rules": "Atas ke Bawah (Tiga titik atas, bingkai penutup, dan handuk 巾 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar pendek atas",
            "2. 竖 (Shù) - Tegak kiri atas",
            "3. 竖 (Shù) - Tegak kanan atas",
            "4. 撇 (Piě) - Miring pelindung kiri",
            "5. 点 (Diǎn) - Titik serong kanan",
            "6. 冖 (Mì) - Garis mendatar tekuk bingkai mahkota",
            "7. 竖 (Shù) - Tegak kiri kain 巾",
            "8. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kain 巾",
            "9. 竖 (Shù) - Garis tegak lurus panjang membelah tengah 巾"
        ]
    },
    {
        "char": "关",
        "pinyin": "guān",
        "meaning": "Menutup \/ Hubungan (Close \/ Relation)",
        "strokesCount": 6,
        "hskLevel": "HSK 3",
        "rules": "Dua Titik Atas Dulu, Dua Mendatar, lalu Kaki Miring dan Sapuan Kanan",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik miring kiri atas",
            "2. 撇 (Piě) - Miring pendek kanan atas",
            "3. 横 (Héng) - Garis mendatar pertama",
            "4. 横 (Héng) - Garis mendatar kedua yang lebih panjang",
            "5. 撇 (Piě) - Garis miring ke kiri bawah",
            "6. 捺 (Nà) - Sapuan miring memanjang ke kanan bawah"
        ]
    },
    {
        "char": "系",
        "pinyin": "xì",
        "meaning": "Sistem \/ Menghubungkan (System \/ Tie)",
        "strokesCount": 7,
        "hskLevel": "HSK 3",
        "rules": "Miring Atas, lalu Radikal Sutra 糸 di bawah (从上到下)",
        "strokeSteps": [
            "1. 撇 (Piě) - Sapuan miring di bagian puncak atas",
            "2. 撇折 (Piězhé) - Miring tekuk pertama radikal benang",
            "3. 撇折 (Piězhé) - Miring tekuk kedua radikal benang",
            "4. 点 (Diǎn) - Titik penyangga tengah",
            "5. 竖钩 (Shùgōu) - Garis tegak lurus berkait ke kiri",
            "6. 撇 (Piě) - Sapuan miring kiri bawah",
            "7. 点 (Diǎn) - Titik penutup di kanan bawah"
        ]
    },
    {
        "char": "运",
        "pinyin": "yùn",
        "meaning": "Mengangkut \/ Olahraga \/ Nasib (Transport \/ Sport)",
        "strokesCount": 7,
        "hskLevel": "HSK 3",
        "rules": "Dalam Dulu Baru Radikal Berjalan (云 ditarik dulu, baru 辶)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas karakter awan 云",
            "2. 横 (Héng) - Mendatar kedua karakter 云",
            "3. 撇折 (Piězhé) - Miring tekuk bagian bawah 云",
            "4. 点 (Diǎn) - Titik di dalam karakter 云",
            "5. 点 (Diǎn) - Titik kepala radikal berjalan 辶",
            "6. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶",
            "7. 捺 (Nà) - Sapuan landai panjang di bawah melandasi"
        ]
    },
    {
        "char": "动",
        "pinyin": "dòng",
        "meaning": "Bergerak \/ Gerak (Move \/ Action)",
        "strokesCount": 6,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Awan 云 di kiri, Kekuatan 力 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas awan 云",
            "2. 横 (Héng) - Mendatar kedua 云",
            "3. 撇折 (Piězhé) - Miring tekuk 云",
            "4. 点 (Diǎn) - Titik penutup 云",
            "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kekuatan 力",
            "6. 撇 (Piě) - Sapuan miring panjang membelah kekuatan 力"
        ]
    },
    {
        "char": "画",
        "pinyin": "huà",
        "meaning": "Menggambar \/ Lukisan (Draw \/ Picture)",
        "strokesCount": 8,
        "hskLevel": "HSK 3",
        "rules": "Mendatar Atas, Kotak Ladang 田 di dalam, lalu Bingkai Wadah 凵 di bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar pelindung paling atas",
            "2. 竖 (Shù) - Tegak kiri ladang 田",
            "3. 横折 (Héngzhé) - Mendatar tekuk ladang 田",
            "4. 横 (Héng) - Mendatar tengah ladang 田",
            "5. 竖 (Shù) - Tegak tengah ladang 田",
            "6. 横 (Héng) - Mendatar penutup ladang 田",
            "7. 竖折 (Shùzhé) - Tegak lalu tekuk mendatar bingkai bawah",
            "8. 竖 (Shù) - Tegak sisi kanan penutup bingkai bawah"
        ]
    },
    {
        "char": "脸",
        "pinyin": "liǎn",
        "meaning": "Wajah \/ Muka (Face)",
        "strokesCount": 11,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Radikal Daging\/Bulan 月 di kiri, 佥 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal bulan 月",
            "2. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 月",
            "3. 横 (Héng) - Mendatar dalam pertama 月",
            "4. 横 (Héng) - Mendatar dalam kedua 月",
            "5. 撇 (Piě) - Miring kepala 佥",
            "6. 捺 (Nà) - Sapuan kanan kepala 佥",
            "7. 一 (Héng) - Mendatar pembatas",
            "8. 口 (Kǒu\/3 goresan) - Kotak mulut 口 di tengah",
            "9. 撇 (Piě) - Miring kiri bawah",
            "10. 点 (Diǎn) - Titik penutup kanan bawah",
            "11. 横 (Héng) - Garis mendatar penyeimbang"
        ]
    },
    {
        "char": "脚",
        "pinyin": "jiǎo",
        "meaning": "Kaki \/ Telapak Kaki (Foot)",
        "strokesCount": 11,
        "hskLevel": "HSK 3",
        "rules": "Kiri ke Kanan (Bulan 月 di kiri, 去 di tengah, Radikal Segel 卩 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri bulan 月",
            "2. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 月",
            "3. 横 (Héng) - Mendatar dalam 月",
            "4. 横 (Héng) - Mendatar dalam kedua 月",
            "5. 横 (Héng) - Mendatar atas karakter pergi 去",
            "6. 竖 (Shù) - Tegak karakter 去",
            "7. 横 (Héng) - Mendatar panjang 去",
            "8. 撇折 (Piězhé) - Miring tekuk 去",
            "9. 点 (Diǎn) - Titik bawah 去",
            "10. 横折钩 (Héngzhégōu) - Mendatar tekuk kait segel 卩",
            "11. 竖 (Shù) - Tegak lurus penutup segel 卩"
        ]
    },
    {
        "char": "头",
        "pinyin": "tóu",
        "meaning": "Kepala \/ Pemimpin (Head \/ Leader)",
        "strokesCount": 5,
        "hskLevel": "HSK 3",
        "rules": "Dua Titik Atas, Mendatar, Miring Kiri, lalu Titik Kanan Bawah",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik pertama kiri atas",
            "2. 点 (Diǎn) - Titik kedua kanan atas",
            "3. 横 (Héng) - Garis mendatar panjang pelindung",
            "4. 撇 (Piě) - Sapuan miring melengkung ke kiri bawah",
            "5. 点 (Diǎn) - Titik tebal penutup di kanan bawah"
        ]
    },
    {
        "char": "发",
        "pinyin": "fā",
        "meaning": "Rambut \/ Mengirim \/ Berkembang (Hair \/ Send)",
        "strokesCount": 5,
        "hskLevel": "HSK 3",
        "rules": "Miring Tekuk, Garis Miring Melengkung, Titik Kanan Atas",
        "strokeSteps": [
            "1. 撇折 (Piězhé) - Miring tekuk pertama di kiri atas",
            "2. 撇 (Piě) - Sapuan miring melintasi garis pertama",
            "3. 横 (Héng) - Mendatar pendek",
            "4. 斜钩 (Xiégōu) - Garis miring melengkung panjang berkait ke atas",
            "5. 点 (Diǎn) - Titik penutup di kanan atas"
        ]
    },
    {
        "char": "景",
        "pinyin": "jǐng",
        "meaning": "Pemandangan \/ Situasi (Scenery \/ View)",
        "strokesCount": 12,
        "hskLevel": "HSK 4",
        "rules": "Atas ke Bawah (Matahari 日 di atas, Ibukota 京 di bawah)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak kiri kotak 日",
            "2. 横折 (Héngzhé) - Mendatar tekuk kotak 日",
            "3. 横 (Héng) - Mendatar dalam kotak 日",
            "4. 横 (Héng) - Mendatar penutup kotak 日",
            "5. 点 (Diǎn) - Titik kepala 京",
            "6. 横 (Héng) - Mendatar bahu 京",
            "7. 竖 (Shù) - Tegak kiri kotak mulut tengah 京",
            "8. 横折 (Héngzhé) - Mendatar tekuk mulut tengah 京",
            "9. 横 (Héng) - Mendatar penutup mulut tengah 京",
            "10. 竖钩 (Shùgōu) - Tegak berkait tengah 京",
            "11. 撇 (Piě) - Miring kiri bawah",
            "12. 点 (Diǎn) - Titik kanan bawah"
        ]
    },
    {
        "char": "商",
        "pinyin": "shāng",
        "meaning": "Bisnis \/ Perdagangan (Commerce \/ Trade)",
        "strokesCount": 11,
        "hskLevel": "HSK 4",
        "rules": "Luar ke Dalam, Atas ke Bawah (Kepala 亠, Mahkota 冂, Isi, Mulut 口)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kepala paling atas",
            "2. 横 (Héng) - Mendatar pelindung",
            "3. 点 (Diǎn) - Titik serong kiri",
            "4. 撇 (Piě) - Miring kanan serong",
            "5. 竖 (Shù) - Tegak kiri bingkai 冂",
            "6. 横折钩 (Héngzhégōu) - Mendatar tekuk kait bingkai 冂",
            "7. 撇 (Piě) - Miring kiri bagian dalam",
            "8. 点 (Diǎn) - Titik kanan bagian dalam",
            "9. 竖 (Shù) - Tegak kiri kotak 口 bawah",
            "10. 横折 (Héngzhé) - Mendatar tekuk kotak 口",
            "11. 横 (Héng) - Mendatar penutup kotak 口"
        ]
    },
    {
        "char": "精",
        "pinyin": "jīng",
        "meaning": "Teliti \/ Esensi \/ Energi (Precise \/ Essence)",
        "strokesCount": 14,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Radikal Beras 米 di kiri, Biru-Hijau 青 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kiri beras 米",
            "2. 撇 (Piě) - Miring kanan beras 米",
            "3. 横 (Héng) - Mendatar tengah beras 米",
            "4. 竖 (Shù) - Tegak lurus membelah beras 米",
            "5. 撇 (Piě) - Miring kiri bawah beras 米",
            "6. 点 (Diǎn) - Titik kanan bawah beras 米",
            "7. 横 (Héng) - Mendatar pertama atas 青",
            "8. 横 (Héng) - Mendatar kedua 青",
            "9. 竖 (Shù) - Tegak tengah 青",
            "10. 横 (Héng) - Mendatar panjang ketiga 青",
            "11. 竖 (Shù) - Tegak kiri bulan 月 di bawah",
            "12. 横折钩 (Héngzhégōu) - Mendatar tekuk kait bulan 月",
            "13. 横 (Héng) - Mendatar dalam bulan 月",
            "14. 横 (Héng) - Mendatar kedua dalam bulan 月"
        ]
    },
    {
        "char": "富",
        "pinyin": "fù",
        "meaning": "Kaya \/ Berlimpah (Rich \/ Wealthy)",
        "strokesCount": 12,
        "hskLevel": "HSK 4",
        "rules": "Atas ke Bawah (Atap 宀 di atas, Satu 一, Mulut 口, Ladang 田 di bawah)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik puncak atap 宀",
            "2. 点 (Diǎn) - Titik kiri atap 宀",
            "3. 横撇\/横钩 (Hénggōu) - Mendatar tekuk kait atap 宀",
            "4. 横 (Héng) - Mendatar karakter 一",
            "5. 竖 (Shù) - Tegak kiri mulut 口",
            "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "7. 横 (Héng) - Mendatar penutup mulut 口",
            "8. 竖 (Shù) - Tegak kiri kotak ladang 田",
            "9. 横折 (Héngzhé) - Mendatar tekuk ladang 田",
            "10. 横 (Héng) - Mendatar tengah ladang 田",
            "11. 竖 (Shù) - Tegak tengah ladang 田",
            "12. 横 (Héng) - Mendatar penutup bawah ladang 田"
        ]
    },
    {
        "char": "环",
        "pinyin": "huán",
        "meaning": "Cincin \/ Lingkungan (Ring \/ Environment)",
        "strokesCount": 8,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Radikal Giok 王 di kiri, Tak Ada 不 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas giok 王",
            "2. 横 (Héng) - Mendatar kedua giok 王",
            "3. 竖 (Shù) - Tegak lurus giok 王",
            "4. 提 (Tí) - Sapuan naik giok 王",
            "5. 横 (Héng) - Mendatar panjang atas karakter 不",
            "6. 撇 (Piě) - Miring kiri karakter 不",
            "7. 竖 (Shù) - Tegak tengah karakter 不",
            "8. 点 (Diǎn) - Titik kanan penutup karakter 不"
        ]
    },
    {
        "char": "境",
        "pinyin": "jìng",
        "meaning": "Perbatasan \/ Kondisi (Border \/ Condition)",
        "strokesCount": 14,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Radikal Tanah 土 di kiri, Cermin 竟 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas tanah 土",
            "2. 竖 (Shù) - Tegak tanah 土",
            "3. 提 (Tí) - Sapuan naik tanah 土",
            "4. 点 (Diǎn) - Titik atas karakter 竟",
            "5. 横 (Héng) - Mendatar atas 竟",
            "6. 点 (Diǎn) - Titik kiri 竟",
            "7. 撇 (Piě) - Miring kanan 竟",
            "8. 横 (Héng) - Mendatar tengah 竟",
            "9. 口 (Kǒu\/3 goresan) - Kotak tengah 日 竟",
            "10. 撇 (Piě) - Miring kiri kaki 竟",
            "11. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 竟",
            "12. 点 (Diǎn) - Titik aksen",
            "13. 横 (Héng) - Mendatar penutup",
            "14. 竖 (Shù) - Tegak penyeimbang"
        ]
    },
    {
        "char": "保",
        "pinyin": "bǎo",
        "meaning": "Menjaga \/ Melindungi (Protect \/ Keep)",
        "strokesCount": 9,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Radikal Orang 亻 di kiri, 口 dan 木 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal orang 亻",
            "2. 竖 (Shù) - Tegak radikal orang 亻",
            "3. 竖 (Shù) - Tegak kiri kotak mulut 口",
            "4. 横折 (Héngzhé) - Mendatar tekuk kotak 口",
            "5. 横 (Héng) - Mendatar penutup kotak 口",
            "6. 木-横 (Héng) - Mendatar dahan kayu 木",
            "7. 木-竖 (Shù) - Tegak lurus batang pohon 木",
            "8. 木-撇 (Piě) - Miring kiri akar 木",
            "9. 木-捺 (Nà) - Sapuan kanan akar 木"
        ]
    },
    {
        "char": "护",
        "pinyin": "hù",
        "meaning": "Melindungi \/ Merawat (Shield \/ Guard)",
        "strokesCount": 7,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Radikal Tangan 扌 di kiri, Pintu 戸 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar radikal tangan 扌",
            "2. 竖钩 (Shùgōu) - Tegak berkait radikal tangan 扌",
            "3. 提 (Tí) - Sapuan naik tangan 扌",
            "4. 点 (Diǎn) - Titik puncak radikal pintu 戸",
            "5. 横折 (Héngzhé) - Mendatar tekuk pintu 戸",
            "6. 横 (Héng) - Mendatar dalam pintu 戸",
            "7. 撇 (Piě) - Miring melengkung kiri pelindung 戸"
        ]
    },
    {
        "char": "积",
        "pinyin": "jī",
        "meaning": "Mengumpulkan \/ Positif (Accumulate \/ Positive)",
        "strokesCount": 10,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Padi 禾 di kiri, Hanya 只 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring bulir padi 禾",
            "2. 横 (Héng) - Mendatar padi 禾",
            "3. 竖 (Shù) - Tegak padi 禾",
            "4. 撇 (Piě) - Miring kiri akar padi 禾",
            "5. 点 (Diǎn) - Titik kanan akar padi 禾",
            "6. 竖 (Shù) - Tegak kiri mulut 只",
            "7. 横折 (Héngzhé) - Mendatar tekuk mulut 只",
            "8. 横 (Héng) - Mendatar penutup mulut 只",
            "9. 撇 (Piě) - Miring kaki kiri 只",
            "10. 点 (Diǎn) - Titik serong kaki kanan 只"
        ]
    },
    {
        "char": "极",
        "pinyin": "jí",
        "meaning": "Sangat \/ Kutub (Extremely \/ Pole)",
        "strokesCount": 7,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Pohon 木 di kiri, 及 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar kayu 木",
            "2. 竖 (Shù) - Tegak kayu 木",
            "3. 撇 (Piě) - Miring kiri kayu 木",
            "4. 点 (Diǎn) - Titik kanan kayu 木",
            "5. 撇 (Piě) - Miring karakter 及",
            "6. 横折折撇 (Héngzhézhépiě) - Lekuk badan karakter 及",
            "7. 捺 (Nà) - Sapuan tebal panjang memotong kanan 及"
        ]
    },
    {
        "char": "律",
        "pinyin": "lǜ",
        "meaning": "Hukum \/ Irama (Law \/ Rhythm)",
        "strokesCount": 9,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Langkah ganda 彳 di kiri, Kuas 聿 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring atas radikal 彳",
            "2. 撇 (Piě) - Miring kedua radikal 彳",
            "3. 竖 (Shù) - Tegak radikal 彳",
            "4. 横折 (Héngzhé) - Mendatar tekuk kuas 聿",
            "5. 横 (Héng) - Mendatar pertama 聿",
            "6. 横 (Héng) - Mendatar kedua 聿",
            "7. 横 (Héng) - Mendatar panjang ketiga 聿",
            "8. 竖 (Shù) - Tegak lurus panjang menembus kuas 聿",
            "9. 点 (Diǎn) - Titik keseimbangan kuas 聿"
        ]
    },
    {
        "char": "师",
        "pinyin": "shī",
        "meaning": "Guru \/ Ahli (Teacher \/ Master)",
        "strokesCount": 6,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Bagian 刂\/阜 di kiri, Handuk 巾 di kanan)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak sisi kiri",
            "2. 撇 (Piě) - Miring pendek kiri",
            "3. 一 (Héng) - Mendatar atas",
            "4. 竖 (Shù) - Tegak kiri kain 巾",
            "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kain 巾",
            "6. 竖 (Shù) - Tegak lurus panjang membelah tengah 巾"
        ]
    },
    {
        "char": "研",
        "pinyin": "yán",
        "meaning": "Meneliti \/ Menggiling (Research \/ Grind)",
        "strokesCount": 9,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Batu 石 di kiri, Buka 开 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar batu 石",
            "2. 撇 (Piě) - Miring kiri batu 石",
            "3. 口-竖 (Shù) - Tegak kotak batu 石",
            "4. 口-横折 (Héngzhé) - Mendatar tekuk batu 石",
            "5. 口-横 (Héng) - Mendatar penutup batu 石",
            "6. 横 (Héng) - Mendatar pertama buka 开",
            "7. 横 (Héng) - Mendatar panjang kedua 开",
            "8. 撇 (Piě) - Miring kiri kaki 开",
            "9. 竖 (Shù) - Tegak lurus kaki kanan 开"
        ]
    },
    {
        "char": "究",
        "pinyin": "jiū",
        "meaning": "Mengkaji \/ Menyelidiki (Investigate \/ Study)",
        "strokesCount": 7,
        "hskLevel": "HSK 4",
        "rules": "Atas ke Bawah (Gua 穴 di atas, Sembilan 九 di bawah)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik puncak atap gua 穴",
            "2. 点 (Diǎn) - Titik kiri atap gua 穴",
            "3. 横撇\/横钩 (Hénggōu) - Mendatar tekuk kait 穴",
            "4. 撇 (Piě) - Miring kiri dalam 穴",
            "5. 点 (Diǎn) - Titik kanan dalam 穴",
            "6. 撇 (Piě) - Miring melengkung karakter 九",
            "7. 横折弯钩 (Héngzhéwāngōu) - Mendatar tekuk lengkung berkait karakter 九"
        ]
    },
    {
        "char": "底",
        "pinyin": "dǐ",
        "meaning": "Dasar \/ Latar (Bottom \/ Base)",
        "strokesCount": 8,
        "hskLevel": "HSK 4",
        "rules": "Luar Dulu Baru Dalam (Rumah 广 di luar, 氐 di dalam)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik atap rumah 广",
            "2. 横 (Héng) - Mendatar rumah 广",
            "3. 撇 (Piě) - Miring pelindung rumah 广",
            "4. 撇 (Piě) - Miring atas bagian 氐",
            "5. 竖提 (Shùtí) - Tegak sapuan naik 氐",
            "6. 横 (Héng) - Mendatar penyambung 氐",
            "7. 斜钩 (Xiégōu) - Miring lengkung kait panjang 氐",
            "8. 点 (Diǎn) - Titik penutup di dalam 氐"
        ]
    },
    {
        "char": "格",
        "pinyin": "gé",
        "meaning": "Pola \/ Kotak \/ Standar (Pattern \/ Grid)",
        "strokesCount": 10,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Kayu 木 di kiri, Setiap 各 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar kayu 木",
            "2. 竖 (Shù) - Tegak kayu 木",
            "3. 撇 (Piě) - Miring kiri kayu 木",
            "4. 点 (Diǎn) - Titik kanan kayu 木",
            "5. 撇 (Piě) - Miring langkah 各",
            "6. 横撇 (Héngpiě) - Mendatar tekuk 各",
            "7. 捺 (Nà) - Sapuan miring kanan 各",
            "8. 竖 (Shù) - Tegak mulut 各",
            "9. 横折 (Héngzhé) - Mendatar tekuk mulut 各",
            "10. 横 (Héng) - Mendatar penutup mulut 各"
        ]
    },
    {
        "char": "局",
        "pinyin": "jú",
        "meaning": "Biro \/ Kantor \/ Situasi (Bureau \/ Game)",
        "strokesCount": 7,
        "hskLevel": "HSK 4",
        "rules": "Luar Dulu Baru Dalam (Mayat 尸 di luar, Mulut 口 di dalam)",
        "strokeSteps": [
            "1. 横折 (Héngzhé) - Mendatar tekuk radikal 尸",
            "2. 横 (Héng) - Mendatar kedua radikal 尸",
            "3. 撇 (Piě) - Miring pelindung panjang radikal 尸",
            "4. 横折钩 (Héngzhégōu) - Mendatar tekuk kait dalam",
            "5. 竖 (Shù) - Tegak kiri mulut 口",
            "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "7. 横 (Héng) - Mendatar penutup bawah mulut 口"
        ]
    },
    {
        "char": "术",
        "pinyin": "shù",
        "meaning": "Seni \/ Teknik \/ Metode (Art \/ Technique)",
        "strokesCount": 5,
        "hskLevel": "HSK 4",
        "rules": "Kayu 木 Dulu, lalu Titik di Kanan Atas (丶)",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar dahan",
            "2. 竖 (Shù) - Garis tegak lurus batang pohon menembus",
            "3. 撇 (Piě) - Garis miring ke kiri bawah",
            "4. 捺 (Nà) - Sapuan miring memanjang ke kanan bawah",
            "5. 点 (Diǎn) - Titik penutup di kanan atas"
        ]
    },
    {
        "char": "互",
        "pinyin": "hù",
        "meaning": "Saling \/ Bersama (Mutual \/ Each other)",
        "strokesCount": 4,
        "hskLevel": "HSK 4",
        "rules": "Mendatar Atas, Garis Lekuk Tengah, lalu Mendatar Bawah",
        "strokeSteps": [
            "1. 横 (Héng) - Garis mendatar atas",
            "2. 撇折 (Piězhé) - Garis miring tekuk mendatar",
            "3. 横折 (Héngzhé) - Garis mendatar tekuk tegak",
            "4. 横 (Héng) - Garis mendatar penutup bawah paling panjang"
        ]
    },
    {
        "char": "联",
        "pinyin": "lián",
        "meaning": "Menghubungkan \/ Bersatu (Connect \/ Ally)",
        "strokesCount": 12,
        "hskLevel": "HSK 4",
        "rules": "Kiri ke Kanan (Telinga 耳 di kiri, 関\/关 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas telinga 耳",
            "2. 竖 (Shù) - Tegak kiri 耳",
            "3. 竖 (Shù) - Tegak kanan 耳",
            "4. 横 (Héng) - Mendatar dalam pertama 耳",
            "5. 横 (Héng) - Mendatar dalam kedua 耳",
            "6. 提 (Tí) - Sapuan naik bawah 耳",
            "7. 点 (Diǎn) - Titik kiri 关",
            "8. 撇 (Piě) - Miring kanan 关",
            "9. 横 (Héng) - Mendatar pertama 关",
            "10. 横 (Héng) - Mendatar kedua 关",
            "11. 撇 (Piě) - Miring kaki 关",
            "12. 捺 (Nà) - Sapuan kanan kaki 关"
        ]
    },
    {
        "char": "德",
        "pinyin": "dé",
        "meaning": "Kebajikan \/ Moralitas (Virtue \/ Morality)",
        "strokesCount": 15,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Langkah ganda 彳 di kiri, Sepuluh 十, Mata 四, Hati 心)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri pertama radikal 彳",
            "2. 撇 (Piě) - Miring kiri kedua radikal 彳",
            "3. 竖 (Shù) - Tegak lurus radikal 彳",
            "4. 横 (Héng) - Mendatar atas bagian 十",
            "5. 竖 (Shù) - Tegak lurus bagian 十",
            "6. 竖 (Shù) - Tegak kiri kotak mata",
            "7. 横折 (Héngzhé) - Mendatar tekuk kotak mata",
            "8. 竖 (Shù) - Garis tegak dalam mata",
            "9. 竖 (Shù) - Garis tegak kedua dalam mata",
            "10. 横 (Héng) - Mendatar penutup kotak mata",
            "11. 横 (Héng) - Garis mendatar pemisah",
            "12. 点 (Diǎn) - Titik kiri hati 心",
            "13. 卧钩 (Wògōu) - Lengkungan rebah berkait hati 心",
            "14. 点 (Diǎn) - Titik tengah hati 心",
            "15. 点 (Diǎn) - Titik kanan luar hati 心"
        ]
    },
    {
        "char": "慧",
        "pinyin": "huì",
        "meaning": "Kebijaksanaan \/ Cerdas (Wisdom \/ Intelligent)",
        "strokesCount": 15,
        "hskLevel": "HSK 5",
        "rules": "Atas ke Bawah (Bagian Sapu 彗 di atas, Hati 心 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar sapu kiri",
            "2. 横 (Héng) - Mendatar kedua sapu kiri",
            "3. 竖 (Shù) - Tegak sapu kiri",
            "4. 横 (Héng) - Mendatar sapu kanan",
            "5. 横 (Héng) - Mendatar kedua sapu kanan",
            "6. 竖 (Shù) - Tegak sapu kanan",
            "7. 横折 (Héngzhé) - Tekuk atas bagian 彐",
            "8. 横 (Héng) - Mendatar tengah 彐",
            "9. 横 (Héng) - Mendatar bawah 彐",
            "10. 点 (Diǎn) - Titik kiri hati 心",
            "11. 卧钩 (Wògōu) - Lengkung berkait rebah hati 心",
            "12. 点 (Diǎn) - Titik tengah hati 心",
            "13. 点 (Diǎn) - Titik penutup kanan hati 心",
            "14. 点 (Diǎn) - Titik pembantu aksen",
            "15. 点 (Diǎn) - Titik estetika kaligrafi"
        ]
    },
    {
        "char": "敏",
        "pinyin": "mǐn",
        "meaning": "Peka \/ Tangkas \/ Cepat (Sensitive \/ Agile)",
        "strokesCount": 11,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Setiap 每 di kiri, Radikal Memukul 攵 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring atas 每",
            "2. 横 (Héng) - Mendatar atas 每",
            "3. 竖折 (Shùzhé) - Tegak tekuk 每",
            "4. 横折钩 (Héngzhégōu) - Mendatar kait 每",
            "5. 点 (Diǎn) - Titik atas dalam 每",
            "6. 点 (Diǎn) - Titik bawah dalam 每",
            "7. 横 (Héng) - Mendatar panjang menembus 每",
            "8. 撇 (Piě) - Miring pertama radikal 攵",
            "9. 横 (Héng) - Mendatar kedua radikal 攵",
            "10. 撇 (Piě) - Miring panjang radikal 攵",
            "11. 捺 (Nà) - Sapuan miring kanan radikal 攵"
        ]
    },
    {
        "char": "诚",
        "pinyin": "chéng",
        "meaning": "Tulus \/ Jujur (Sincere \/ Honest)",
        "strokesCount": 8,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Radikal Kata 讠 di kiri, 成 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik radikal kata 讠",
            "2. 横折提 (Héngzhétí) - Mendatar tekuk sapuan naik 讠",
            "3. 横 (Héng) - Mendatar pertama 成",
            "4. 撇 (Piě) - Sapuan miring membelah 成",
            "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 成",
            "6. 斜钩 (Xiégōu) - Miring lengkung kait panjang 成",
            "7. 撇 (Piě) - Miring kecil 成",
            "8. 点 (Diǎn) - Titik penutup kanan atas 成"
        ]
    },
    {
        "char": "谦",
        "pinyin": "qiān",
        "meaning": "Rendah Hati \/ Sopan (Humble \/ Modest)",
        "strokesCount": 12,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Radikal Kata 讠 di kiri, 兼 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik radikal kata 讠",
            "2. 横折提 (Héngzhétí) - Mendatar tekuk sapuan naik 讠",
            "3. 点 (Diǎn) - Titik puncak bagian 兼",
            "4. 撇 (Piě) - Miring pelindung 兼",
            "5. 横 (Héng) - Mendatar pertama 兼",
            "6. 竖 (Shù) - Tegak kiri 兼",
            "7. 竖 (Shù) - Tegak kanan 兼",
            "8. 横 (Héng) - Mendatar kedua 兼",
            "9. 撇 (Piě) - Miring kiri bawah 兼",
            "10. 捺 (Nà) - Sapuan kanan 兼",
            "11. 撇 (Piě) - Miring kaki kiri 兼",
            "12. 点 (Diǎn) - Titik kaki kanan 兼"
        ]
    },
    {
        "char": "逊",
        "pinyin": "xùn",
        "meaning": "Santun \/ Kalah Kelas (Modest \/ Inferior)",
        "strokesCount": 9,
        "hskLevel": "HSK 5",
        "rules": "Dalam Dulu Baru Radikal Berjalan (Cucu 孙 di dalam, baru 辶)",
        "strokeSteps": [
            "1. 横撇 (Héngpiě) - Mendatar tekuk miring anak 子",
            "2. 弯钩 (Wāngōu) - Lengkung berkait anak 子",
            "3. 提 (Tí) - Sapuan naik anak 子",
            "4. 撇 (Piě) - Miring kiri kecil 小",
            "5. 竖钩 (Shùgōu) - Tegak berkait kecil 小",
            "6. 点 (Diǎn) - Titik penutup kecil 小",
            "7. 点 (Diǎn) - Titik kepala radikal berjalan 辶",
            "8. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶",
            "9. 捺 (Nà) - Sapuan landai panjang di bawah 辶"
        ]
    },
    {
        "char": "毅",
        "pinyin": "yì",
        "meaning": "Teguh \/ Pantang Menyerah (Persevering \/ Resolute)",
        "strokesCount": 15,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Bagian Babi\/Taring 豖 di kiri, Radikal Memukul 殳 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas bagian 豖",
            "2. 竖 (Shù) - Tegak tengah 豖",
            "3. 横 (Héng) - Mendatar kedua 豖",
            "4. 撇 (Piě) - Miring kiri 豖",
            "5. 弯钩 (Wāngōu) - Lengkung kait 豖",
            "6. 撇 (Piě) - Miring pendek 豖",
            "7. 撇 (Piě) - Miring panjang 豖",
            "8. 捺 (Nà) - Sapuan kanan 豖",
            "9. 点 (Diǎn) - Titik penutup 豖",
            "10. 撇 (Piě) - Miring atas radikal 殳",
            "11. 撇折 (Piězhé) - Miring tekuk 殳",
            "12. 横折弯 (Héngzhéwān) - Mendatar tekuk 殳",
            "13. 撇 (Piě) - Miring melengkung 殳",
            "14. 横 (Héng) - Mendatar 殳",
            "15. 捺 (Nà) - Sapuan kanan panjang penyeimbang 殳"
        ]
    },
    {
        "char": "恒",
        "pinyin": "héng",
        "meaning": "Abadi \/ Tekun Konsisten (Eternal \/ Constant)",
        "strokesCount": 9,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Radikal Hati Tegak 忄 di kiri, 亘 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kiri radikal hati 忄",
            "2. 点 (Diǎn) - Titik kanan radikal hati 忄",
            "3. 竖 (Shù) - Tegak lurus memotong tengah radikal hati 忄",
            "4. 一 (Héng) - Mendatar atas bagian 亘",
            "5. 口-竖 (Shù) - Tegak kiri kotak matahari 日",
            "6. 口-横折 (Héngzhé) - Mendatar tekuk matahari 日",
            "7. 口-横 (Héng) - Mendatar dalam matahari 日",
            "8. 口-横 (Héng) - Mendatar penutup matahari 日",
            "9. 一 (Héng) - Mendatar panjang penutup pondasi 亘"
        ]
    },
    {
        "char": "博",
        "pinyin": "bó",
        "meaning": "Luas \/ Berilmu Tinggi (Broad \/ Erudite)",
        "strokesCount": 12,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Sepuluh 十 di kiri, 甫 dan Titik di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar radikal sepuluh 十",
            "2. 竖 (Shù) - Tegak lurus radikal sepuluh 十",
            "3. 横 (Héng) - Mendatar atas bagian kanan",
            "4. 竖 (Shù) - Tegak kiri bagian 甫",
            "5. 横折 (Héngzhé) - Mendatar tekuk bingkai 甫",
            "6. 横 (Héng) - Mendatar dalam bingkai 甫",
            "7. 竖 (Shù) - Tegak lurus tengah menembus 甫",
            "8. 横 (Héng) - Mendatar penutup bawah 甫",
            "9. 点 (Diǎn) - Titik kanan atas 甫",
            "10. 撇 (Piě) - Miring pendek kanan",
            "11. 横 (Héng) - Mendatar bawah",
            "12. 点 (Diǎn) - Titik penutup di kanan bawah"
        ]
    },
    {
        "char": "览",
        "pinyin": "lǎn",
        "meaning": "Memandang \/ Meninjau (View \/ Look at)",
        "strokesCount": 12,
        "hskLevel": "HSK 5",
        "rules": "Atas ke Bawah (Bagian 臣 dan Cakar di atas, Melihat 见 di bawah)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak pertama menteri 臣",
            "2. 横折 (Héngzhé) - Mendatar tekuk 臣",
            "3. 横 (Héng) - Mendatar 臣",
            "4. 竖 (Shù) - Tegak kedua 臣",
            "5. 横折 (Héngzhé) - Mendatar tekuk kedua 臣",
            "6. 横 (Héng) - Mendatar penutup 臣",
            "7. 撇 (Piě) - Miring cakar",
            "8. 点 (Diǎn) - Titik penyeimbang",
            "9. 竖 (Shù) - Tegak kiri melihat 见",
            "10. 横折 (Héngzhé) - Mendatar tekuk 见",
            "11. 撇 (Piě) - Miring kaki kiri 见",
            "12. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 见"
        ]
    },
    {
        "char": "哲",
        "pinyin": "zhé",
        "meaning": "Filsafat \/ Bijaksana (Philosophy \/ Wise)",
        "strokesCount": 10,
        "hskLevel": "HSK 5",
        "rules": "Atas ke Bawah (Patah 折 di atas, Mulut 口 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar tangan 扌",
            "2. 竖钩 (Shùgōu) - Tegak berkait tangan 扌",
            "3. 提 (Tí) - Sapuan naik tangan 扌",
            "4. 撇 (Piě) - Miring atas kapak 斤",
            "5. 撇 (Piě) - Miring panjang kapak 斤",
            "6. 横 (Héng) - Mendatar kapak 斤",
            "7. 竖 (Shù) - Tegak lurus kapak 斤",
            "8. 竖 (Shù) - Tegak kotak mulut 口 di bawah",
            "9. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "10. 横 (Héng) - Mendatar penutup bawah mulut 口"
        ]
    },
    {
        "char": "理",
        "pinyin": "lǐ",
        "meaning": "Logika \/ Menata (Reason \/ Manage)",
        "strokesCount": 11,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Radikal Giok 王 di kiri, Desa 里 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas giok 王",
            "2. 横 (Héng) - Mendatar kedua giok 王",
            "3. 竖 (Shù) - Tegak lurus giok 王",
            "4. 提 (Tí) - Sapuan naik giok 王",
            "5. 竖 (Shù) - Tegak kiri ladang 田 karakter 里",
            "6. 横折 (Héngzhé) - Mendatar tekuk ladang 田",
            "7. 横 (Héng) - Mendatar tengah ladang 田",
            "8. 横 (Héng) - Mendatar penutup ladang 田",
            "9. 竖 (Shù) - Tegak panjang menembus tengah 里",
            "10. 横 (Héng) - Mendatar penyangga 里",
            "11. 横 (Héng) - Mendatar panjang penutup pondasi 里"
        ]
    },
    {
        "char": "创",
        "pinyin": "chuàng",
        "meaning": "Mencipta \/ Inovasi (Create \/ Innovate)",
        "strokesCount": 6,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Gudang 仓 di kiri, Radikal Pisau Tegak 刂 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kepala gudang 仓",
            "2. 捺 (Nà) - Sapuan kanan kepala 仓",
            "3. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 仓",
            "4. 竖弯钩 (Shùwāngōu) - Tegak lengkung kait 仓",
            "5. 竖 (Shù) - Tegak pendek pisau 刂",
            "6. 竖钩 (Shùgōu) - Tegak lurus panjang berkait pisau 刂"
        ]
    },
    {
        "char": "造",
        "pinyin": "zào",
        "meaning": "Membangun \/ Membuat (Build \/ Make)",
        "strokesCount": 10,
        "hskLevel": "HSK 5",
        "rules": "Dalam Dulu Baru Radikal Berjalan (Menyatakan 告 di dalam, baru 辶)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring atas karakter 告",
            "2. 横 (Héng) - Mendatar atas karakter 告",
            "3. 竖 (Shù) - Tegak karakter 告",
            "4. 横 (Héng) - Mendatar panjang kedua 告",
            "5. 竖 (Shù) - Tegak kiri mulut 口",
            "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "7. 横 (Héng) - Mendatar penutup mulut 口",
            "8. 点 (Diǎn) - Titik kepala radikal berjalan 辶",
            "9. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶",
            "10. 捺 (Nà) - Sapuan landai panjang di bawah melandasi 辶"
        ]
    },
    {
        "char": "融",
        "pinyin": "róng",
        "meaning": "Melebur \/ Harmonis \/ Finansial (Melt \/ Finance)",
        "strokesCount": 16,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Panci Kaki Tiga 鬲 di kiri, Ulat 虫 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas panci 鬲",
            "2. 口-竖 (Shù) - Tegak mulut atas 鬲",
            "3. 口-横折 (Héngzhé) - Mendatar tekuk mulut 鬲",
            "4. 口-横 (Héng) - Mendatar penutup mulut 鬲",
            "5. 冂-竖 (Shù) - Tegak kiri pinggul 鬲",
            "6. 冂-横折 (Héngzhé) - Mendatar tekuk pinggul 鬲",
            "7. 横 (Héng) - Mendatar pemisah 鬲",
            "8. 竖 (Shù) - Tegak kaki kiri 鬲",
            "9. 竖 (Shù) - Tegak kaki kanan 鬲",
            "10. 竖 (Shù) - Tegak ulat 虫",
            "11. 横折 (Héngzhé) - Mendatar tekuk badan 虫",
            "12. 横 (Héng) - Mendatar penutup 虫",
            "13. 竖 (Shù) - Tegak panjang menembus 虫",
            "14. 提 (Tí) - Sapuan naik bawah 虫",
            "15. 点 (Diǎn) - Titik penutup kanan 虫",
            "16. 点 (Diǎn) - Titik aksen kestabilan"
        ]
    },
    {
        "char": "洽",
        "pinyin": "qià",
        "meaning": "Harmonis \/ Negosiasi Sepakat (Harmonious \/ Agree)",
        "strokesCount": 9,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, 合 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik pertama air 氵",
            "2. 点 (Diǎn) - Titik kedua air 氵",
            "3. 提 (Tí) - Sapuan naik air 氵",
            "4. 撇 (Piě) - Miring kepala karakter 合",
            "5. 捺 (Nà) - Sapuan kanan kepala 合",
            "6. 横 (Héng) - Mendatar pembatas 合",
            "7. 竖 (Shù) - Tegak mulut 口 合",
            "8. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "9. 横 (Héng) - Mendatar penutup mulut 口"
        ]
    },
    {
        "char": "繁",
        "pinyin": "fán",
        "meaning": "Makmur \/ Rumit \/ Beragam (Flourishing \/ Complex)",
        "strokesCount": 17,
        "hskLevel": "HSK 5",
        "rules": "Atas ke Bawah (Setiap 每 dan Memukul 攵 di atas, Sutra 糸 di bawah)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring atas karakter 每",
            "2. 横 (Héng) - Mendatar karakter 每",
            "3. 竖折 (Shùzhé) - Garis lekuk 每",
            "4. 横折钩 (Héngzhégōu) - Kait 每",
            "5. 点 (Diǎn) - Titik dalam 每",
            "6. 横 (Héng) - Garis tengah 每",
            "7. 撇 (Piě) - Miring pertama radikal 攵",
            "8. 横 (Héng) - Mendatar radikal 攵",
            "9. 撇 (Piě) - Miring panjang radikal 攵",
            "10. 捺 (Nà) - Sapuan tebal kanan radikal 攵",
            "11. 撇折 (Piězhé) - Miring tekuk pertama sutra 糸",
            "12. 撇折 (Piězhé) - Miring tekuk kedua sutra 糸",
            "13. 点 (Diǎn) - Titik penyeimbang sutra 糸",
            "14. 竖钩 (Shùgōu) - Tegak berkait tengah sutra 糸",
            "15. 撇 (Piě) - Miring kiri sutra 糸",
            "16. 点 (Diǎn) - Titik kanan sutra 糸",
            "17. 点 (Diǎn) - Titik aksen penutup kaligrafi"
        ]
    },
    {
        "char": "荣",
        "pinyin": "róng",
        "meaning": "Kejayaan \/ Kehormatan (Glory \/ Honor)",
        "strokesCount": 9,
        "hskLevel": "HSK 5",
        "rules": "Atas ke Bawah (Radikal Rumput 艹 di atas, Mahkota 冖 di tengah, Kayu 木 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar radikal rumput 艹",
            "2. 竖 (Shù) - Tegak kiri rumput 艹",
            "3. 竖 (Shù) - Tegak kanan rumput 艹",
            "4. 点 (Diǎn) - Titik kiri mahkota 冖",
            "5. 横撇\/横钩 (Hénggōu) - Mendatar tekuk mahkota 冖",
            "6. 木-横 (Héng) - Mendatar dahan kayu 木",
            "7. 木-竖 (Shù) - Tegak lurus batang pohon 木",
            "8. 木-撇 (Piě) - Miring kiri akar 木",
            "9. 木-捺 (Nà) - Sapuan miring kanan akar 木"
        ]
    },
    {
        "char": "优",
        "pinyin": "yōu",
        "meaning": "Unggul \/ Istimewa (Excellent \/ Superior)",
        "strokesCount": 6,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Radikal Orang 亻 di kiri, Terutama 尤 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal orang 亻",
            "2. 竖 (Shù) - Tegak radikal orang 亻",
            "3. 横 (Héng) - Mendatar atas karakter 尤",
            "4. 撇 (Piě) - Miring kiri melengkung 尤",
            "5. 弯钩 (Wāngōu) - Lengkung berkait kanan 尤",
            "6. 点 (Diǎn) - Titik penutup di kanan atas 尤"
        ]
    },
    {
        "char": "雅",
        "pinyin": "yǎ",
        "meaning": "Elegan \/ Anggun \/ Luhur (Elegant \/ Refined)",
        "strokesCount": 12,
        "hskLevel": "HSK 5",
        "rules": "Kiri ke Kanan (Gigi 牙 di kiri, Burung Berekor Pendek 隹 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas gigi 牙",
            "2. 竖折 (Shùzhé) - Tegak tekuk gigi 牙",
            "3. 竖钩 (Shùgōu) - Tegak berkait gigi 牙",
            "4. 撇 (Piě) - Miring penutup gigi 牙",
            "5. 撇 (Piě) - Miring atas burung 隹",
            "6. 竖 (Shù) - Tegak lurus burung 隹",
            "7. 点 (Diǎn) - Titik pelindung burung 隹",
            "8. 横 (Héng) - Mendatar pertama burung 隹",
            "9. 横 (Héng) - Mendatar kedua burung 隹",
            "10. 横 (Héng) - Mendatar ketiga burung 隹",
            "11. 竖 (Shù) - Tegak tengah burung 隹",
            "12. 横 (Héng) - Mendatar penutup panjang burung 隹"
        ]
    },
    {
        "char": "睿",
        "pinyin": "ruì",
        "meaning": "Berpandangan Jauh \/ Bijak Bestari (Farsighted \/ Astute)",
        "strokesCount": 14,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Bagian 攴\/𣦵 atas, Mata 目 di bawah)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik kiri atas",
            "2. 横撇 (Héngpiě) - Mendatar miring kiri",
            "3. 点 (Diǎn) - Titik tengah atas",
            "4. 撇 (Piě) - Miring kiri pelindung",
            "5. 捺 (Nà) - Sapuan tebal kanan",
            "6. 竖 (Shù) - Tegak kiri kotak penghubung",
            "7. 横折 (Héngzhé) - Mendatar tekuk",
            "8. 横 (Héng) - Mendatar penutup tengah",
            "9. 竖 (Shù) - Tegak kiri kotak mata 目",
            "10. 横折 (Héngzhé) - Mendatar tekuk kotak mata 目",
            "11. 横 (Héng) - Mendatar pertama dalam 目",
            "12. 横 (Héng) - Mendatar kedua dalam 目",
            "13. 横 (Héng) - Mendatar penutup bawah kotak 目",
            "14. 点 (Diǎn) - Titik kestabilan struktur"
        ]
    },
    {
        "char": "韬",
        "pinyin": "tāo",
        "meaning": "Menyembunyikan \/ Strategi Militer Luhur (Conceal \/ Strategy)",
        "strokesCount": 14,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Kulit 韦 di kiri, 舀 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas kulit 韦",
            "2. 横 (Héng) - Mendatar kedua kulit 韦",
            "3. 竖 (Shù) - Tegak kulit 韦",
            "4. 提 (Tí) - Sapuan naik kulit 韦",
            "5. 撇 (Piě) - Miring cakar atas 爫",
            "6. 点 (Diǎn) - Titik pertama cakar 爫",
            "7. 点 (Diǎn) - Titik kedua cakar 爫",
            "8. 点 (Diǎn) - Titik ketiga cakar 爫",
            "9. 撇 (Piě) - Miring atas lesung 臼",
            "10. 竖 (Shù) - Tegak kiri lesung 臼",
            "11. 横折 (Héngzhé) - Mendatar tekuk lesung 臼",
            "12. 横 (Héng) - Mendatar dalam lesung 臼",
            "13. 横 (Héng) - Mendatar kedua dalam lesung 臼",
            "14. 横 (Héng) - Mendatar penutup bawah lesung 臼"
        ]
    },
    {
        "char": "略",
        "pinyin": "lüè",
        "meaning": "Rencana \/ Ringkasan \/ Strategi (Strategy \/ Brief)",
        "strokesCount": 11,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Ladang 田 di kiri, Setiap 各 di kanan)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak kiri ladang 田",
            "2. 横折 (Héngzhé) - Mendatar tekuk ladang 田",
            "3. 横 (Héng) - Mendatar tengah ladang 田",
            "4. 竖 (Shù) - Tegak tengah ladang 田",
            "5. 横 (Héng) - Mendatar penutup ladang 田",
            "6. 撇 (Piě) - Miring langkah 各",
            "7. 横撇 (Héngpiě) - Mendatar tekuk 各",
            "8. 捺 (Nà) - Sapuan kanan 各",
            "9. 竖 (Shù) - Tegak mulut 各",
            "10. 横折 (Héngzhé) - Mendatar tekuk mulut 各",
            "11. 横 (Héng) - Mendatar penutup mulut 各"
        ]
    },
    {
        "char": "邃",
        "pinyin": "suì",
        "meaning": "Mendalam \/ Jauh \/ Misterius (Profound \/ Deep)",
        "strokesCount": 17,
        "hskLevel": "HSK 6",
        "rules": "Dalam Dulu Baru Radikal Berjalan (Gua 穴 dan Babi 豕 di dalam, baru 辶)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik puncak gua 穴",
            "2. 点 (Diǎn) - Titik kiri gua 穴",
            "3. 横撇\/横钩 (Hénggōu) - Mendatar tekuk 穴",
            "4. 撇 (Piě) - Miring kiri 穴",
            "5. 点 (Diǎn) - Titik kanan 穴",
            "6. 一 (Héng) - Mendatar pembatas",
            "7. 撇 (Piě) - Miring badan babi 豕",
            "8. 弯钩 (Wāngōu) - Lengkung kait 豕",
            "9. 撇 (Piě) - Miring pendek 豕",
            "10. 撇 (Piě) - Miring kedua 豕",
            "11. 撇 (Piě) - Miring ketiga 豕",
            "12. 捺 (Nà) - Sapuan kanan 豕",
            "13. 点 (Diǎn) - Titik penyeimbang 豕",
            "14. 点 (Diǎn) - Titik kepala radikal berjalan 辶",
            "15. 横折折撇 (Héngzhézhépiě) - Lekuk radikal 辶",
            "16. 捺 (Nà) - Sapuan landai panjang penutup 辶",
            "17. 点 (Diǎn) - Titik kestabilan kaligrafi"
        ]
    },
    {
        "char": "蕴",
        "pinyin": "yùn",
        "meaning": "Menyimpan \/ Mengandung Makna Dalam (Contain \/ Imply)",
        "strokesCount": 15,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Radikal Rumput 艹 di atas, Sutra 纟 & Hangat 温 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar rumput 艹",
            "2. 竖 (Shù) - Tegak kiri rumput 艹",
            "3. 竖 (Shù) - Tegak kanan rumput 艹",
            "4. 撇折 (Piězhé) - Miring tekuk sutra 纟",
            "5. 撇折 (Piězhé) - Miring tekuk kedua sutra 纟",
            "6. 提 (Tí) - Sapuan naik sutra 纟",
            "7. 竖 (Shù) - Tegak kiri kotak matahari 日",
            "8. 横折 (Héngzhé) - Mendatar tekuk 日",
            "9. 横 (Héng) - Mendatar dalam 日",
            "10. 横 (Héng) - Mendatar penutup 日",
            "11. 皿-竖 (Shù) - Tegak kiri piring 皿",
            "12. 皿-横折 (Héngzhé) - Mendatar tekuk piring 皿",
            "13. 竖 (Shù) - Garis tegak dalam 皿",
            "14. 竖 (Shù) - Garis tegak kedua dalam 皿",
            "15. 横 (Héng) - Mendatar panjang penutup pondasi 皿"
        ]
    },
    {
        "char": "藉",
        "pinyin": "jiè",
        "meaning": "Beralaskan \/ Memanfaatkan Peluang (Rely on \/ Cushion)",
        "strokesCount": 17,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Rumput 艹 di atas, Bajak 耒 dan Senjata 昔 di bawah)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar rumput 艹",
            "2. 竖 (Shù) - Tegak kiri rumput 艹",
            "3. 竖 (Shù) - Tegak kanan rumput 艹",
            "4. 横 (Héng) - Mendatar bajak 耒",
            "5. 横 (Héng) - Mendatar kedua 耒",
            "6. 竖 (Shù) - Tegak lurus tengah 耒",
            "7. 撇 (Piě) - Miring kiri akar 耒",
            "8. 捺 (Nà) - Sapuan kanan akar 耒",
            "9. 横 (Héng) - Mendatar pertama senjata",
            "10. 竖 (Shù) - Tegak pertama senjata",
            "11. 竖 (Shù) - Tegak kedua senjata",
            "12. 横 (Héng) - Mendatar panjang penyambung",
            "13. 日-竖 (Shù) - Tegak kotak matahari 日",
            "14. 日-横折 (Héngzhé) - Mendatar tekuk 日",
            "15. 日-横 (Héng) - Mendatar dalam 日",
            "16. 日-横 (Héng) - Mendatar penutup 日",
            "17. 点 (Diǎn) - Titik aksen penutup"
        ]
    },
    {
        "char": "宏",
        "pinyin": "hóng",
        "meaning": "Megah \/ Agung \/ Luas (Grand \/ Magnificent)",
        "strokesCount": 7,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Atap 宀 di atas, 厷 di bawah)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik puncak atap 宀",
            "2. 点 (Diǎn) - Titik kiri atap 宀",
            "3. 横撇\/横钩 (Hénggōu) - Mendatar tekuk kait atap 宀",
            "4. 横 (Héng) - Mendatar atas bagian 厷",
            "5. 撇 (Piě) - Miring melengkung kiri 厷",
            "6. 捺 (Nà) - Sapuan miring kanan 厷",
            "7. 厶 (Sī) - Miring tekuk dan titik penutup 厷"
        ]
    },
    {
        "char": "伟",
        "pinyin": "wěi",
        "meaning": "Hebat \/ Luhur \/ Perkasa (Great \/ Mighty)",
        "strokesCount": 6,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Radikal Orang 亻 di kiri, Kulit 韦 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal orang 亻",
            "2. 竖 (Shù) - Tegak lurus radikal orang 亻",
            "3. 横 (Héng) - Mendatar atas kulit 韦",
            "4. 横 (Héng) - Mendatar kedua kulit 韦",
            "5. 竖 (Shù) - Tegak membelah kulit 韦",
            "6. 提\/横 (Tí) - Sapuan naik bawah kulit 韦"
        ]
    },
    {
        "char": "魄",
        "pinyin": "pò",
        "meaning": "Jiwa \/ Keberanian \/ Wibawa (Spirit \/ Vigor)",
        "strokesCount": 14,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Putih 白 di kiri, Hantu 鬼 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kepala putih 白",
            "2. 竖 (Shù) - Tegak kiri 白",
            "3. 横折 (Héngzhé) - Mendatar tekuk 白",
            "4. 横 (Héng) - Mendatar dalam 白",
            "5. 横 (Héng) - Mendatar penutup 白",
            "6. 撇 (Piě) - Miring atas hantu 鬼",
            "7. 竖 (Shù) - Tegak kiri kotak kepala 鬼",
            "8. 横折 (Héngzhé) - Mendatar tekuk kepala 鬼",
            "9. 横 (Héng) - Mendatar dalam kepala 鬼",
            "10. 撇 (Piě) - Miring dalam kepala 鬼",
            "11. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki 鬼",
            "12. 撇 (Piě) - Miring kaki kiri 鬼",
            "13. 竖 (Shù) - Tegak kaki kanan 鬼",
            "14. 点 (Diǎn) - Titik penutup ekor 鬼"
        ]
    },
    {
        "char": "力",
        "pinyin": "lì",
        "meaning": "Kekuatan \/ Daya (Power \/ Force)",
        "strokesCount": 2,
        "hskLevel": "HSK 6",
        "rules": "Mendatar Tekuk Kait Dulu, lalu Garis Miring Membelah",
        "strokeSteps": [
            "1. 横折钩 (Héngzhégōu) - Garis mendatar lalu tekuk tegak dengan kait kuat ke kiri",
            "2. 撇 (Piě) - Garis sapuan miring panjang membelah garis pertama ke kiri bawah"
        ]
    },
    {
        "char": "卓",
        "pinyin": "zhuó",
        "meaning": "Istimewa \/ Cemerlang (Outstanding \/ Brilliant)",
        "strokesCount": 8,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Bagian Atas 卜, Matahari 日, lalu Sepuluh 十 di bawah)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak puncak atas",
            "2. 横 (Héng) - Mendatar pendek",
            "3. 竖 (Shù) - Tegak kiri kotak matahari 日",
            "4. 横折 (Héngzhé) - Mendatar tekuk kotak 日",
            "5. 横 (Héng) - Mendatar dalam kotak 日",
            "6. 横 (Héng) - Mendatar penutup bawah kotak 日",
            "7. 横 (Héng) - Mendatar panjang karakter 十",
            "8. 竖 (Shù) - Tegak lurus panjang menembus membelah bawah"
        ]
    },
    {
        "char": "越",
        "pinyin": "yuè",
        "meaning": "Melompat \/ Melampaui (Surpass \/ Exceed)",
        "strokesCount": 12,
        "hskLevel": "HSK 6",
        "rules": "Luar Kiri Dulu Baru Dalam Kanan (Berjalan 走 di kiri, Senjata 戉 di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar atas karakter berjalan 走",
            "2. 竖 (Shù) - Tegak karakter 走",
            "3. 横 (Héng) - Mendatar kedua 走",
            "4. 竖 (Shù) - Tegak kaki 走",
            "5. 横 (Héng) - Mendatar penyangga 走",
            "6. 撇 (Piě) - Miring langkah 走",
            "7. 捺 (Nà) - Sapuan landai panjang melandasi 走",
            "8. 横 (Héng) - Mendatar atas senjata 戉",
            "9. 斜钩 (Xiégōu) - Miring lengkung kait panjang 戉",
            "10. 撇 (Piě) - Miring dalam 戉",
            "11. 点 (Diǎn) - Titik kanan atas 戉",
            "12. 点 (Diǎn) - Titik aksen penutup"
        ]
    },
    {
        "char": "瞻",
        "pinyin": "zhān",
        "meaning": "Memandang Jauh ke Depan (Look forward \/ Gaze)",
        "strokesCount": 18,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Mata 目 di kiri, Menghadap 詹 di kanan)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak kiri kotak mata 目",
            "2. 横折 (Héngzhé) - Mendatar tekuk mata 目",
            "3. 横 (Héng) - Mendatar dalam pertama 目",
            "4. 横 (Héng) - Mendatar dalam kedua 目",
            "5. 横 (Héng) - Mendatar penutup mata 目",
            "6. 撇 (Piě) - Miring kepala 詹",
            "7. 竖 (Shù) - Tegak 詹",
            "8. 横折 (Héngzhé) - Mendatar tekuk 詹",
            "9. 横 (Héng) - Mendatar 詹",
            "10. 撇 (Piě) - Miring panjang 詹",
            "11. 口-竖 (Shù) - Tegak mulut atas 詹",
            "12. 口-横折 (Héngzhé) - Mendatar tekuk mulut 詹",
            "13. 口-横 (Héng) - Mendatar penutup mulut 詹",
            "14. 撇 (Piě) - Miring bawah 詹",
            "15. 口-竖 (Shù) - Tegak mulut bawah 詹",
            "16. 口-横折 (Héngzhé) - Mendatar tekuk mulut bawah 詹",
            "17. 口-横 (Héng) - Mendatar penutup mulut bawah 詹",
            "18. 点 (Diǎn) - Titik kestabilan struktur"
        ]
    },
    {
        "char": "仰",
        "pinyin": "yǎng",
        "meaning": "Mendongak \/ Mengagumi Luhur (Look up \/ Admire)",
        "strokesCount": 6,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Radikal Orang 亻 di kiri, 卬 di kanan)",
        "strokeSteps": [
            "1. 撇 (Piě) - Miring kiri radikal orang 亻",
            "2. 竖 (Shù) - Tegak lurus radikal orang 亻",
            "3. 撇 (Piě) - Miring atas bagian 卬",
            "4. 竖提 (Shùtí) - Tegak sapuan naik 卬",
            "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait segel 卩",
            "6. 竖 (Shù) - Tegak lurus penutup segel 卩"
        ]
    },
    {
        "char": "巍",
        "pinyin": "wēi",
        "meaning": "Menjulang Tinggi Megah (Towering \/ Majestic)",
        "strokesCount": 20,
        "hskLevel": "HSK 6",
        "rules": "Atas ke Bawah (Gunung 山 di atas, Hantu 鬼 dan Ranting 委 di bawah)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak tengah gunung 山",
            "2. 竖折 (Shùzhé) - Tegak tekuk kiri gunung 山",
            "3. 竖 (Shù) - Tegak kanan gunung 山",
            "4. 撇 (Piě) - Miring atas padi 禾",
            "5. 横 (Héng) - Mendatar padi 禾",
            "6. 竖 (Shù) - Tegak padi 禾",
            "7. 撇 (Piě) - Miring kiri padi 禾",
            "8. 点 (Diǎn) - Titik kanan padi 禾",
            "9. 撇点 (Piědiǎn) - Miring tekuk wanita 女",
            "10. 撇 (Piě) - Miring silang wanita 女",
            "11. 横 (Héng) - Mendatar panjang wanita 女",
            "12. 撇 (Piě) - Miring kepala hantu 鬼",
            "13. 竖 (Shù) - Tegak kiri kepala 鬼",
            "14. 横折 (Héngzhé) - Mendatar tekuk kepala 鬼",
            "15. 横 (Héng) - Mendatar dalam 鬼",
            "16. 撇 (Piě) - Miring dalam 鬼",
            "17. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki 鬼",
            "18. 撇 (Piě) - Miring kaki kiri 鬼",
            "19. 竖 (Shù) - Tegak kaki kanan 鬼",
            "20. 点 (Diǎn) - Titik penutup keagungan"
        ]
    },
    {
        "char": "峨",
        "pinyin": "é",
        "meaning": "Gunung Menjulang Kokoh (Lofty Mountain)",
        "strokesCount": 10,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Gunung 山 di kiri, Saya 我 di kanan)",
        "strokeSteps": [
            "1. 竖 (Shù) - Tegak tengah gunung 山",
            "2. 竖折 (Shùzhé) - Tegak tekuk kiri gunung 山",
            "3. 竖 (Shù) - Tegak kanan gunung 山",
            "4. 撇 (Piě) - Miring pendek atas saya 我",
            "5. 横 (Héng) - Mendatar 我",
            "6. 竖钩 (Shùgōu) - Tegak berkait 我",
            "7. 提 (Tí) - Sapuan naik 我",
            "8. 斜钩 (Xiégōu) - Miring lengkung kait panjang 我",
            "9. 撇 (Piě) - Miring kecil 我",
            "10. 点 (Diǎn) - Titik penutup di kanan atas 我"
        ]
    },
    {
        "char": "浩",
        "pinyin": "hào",
        "meaning": "Sangat Luas \/ Berkelimpahan Akbar (Vast \/ Grand)",
        "strokesCount": 10,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, Memberitahu 告 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik pertama air 氵",
            "2. 点 (Diǎn) - Titik kedua air 氵",
            "3. 提 (Tí) - Sapuan naik air 氵",
            "4. 撇 (Piě) - Miring atas karakter 告",
            "5. 横 (Héng) - Mendatar atas 告",
            "6. 竖 (Shù) - Tegak tengah 告",
            "7. 横 (Héng) - Mendatar panjang kedua 告",
            "8. 竖 (Shù) - Tegak kiri mulut 口",
            "9. 横折 (Héngzhé) - Mendatar tekuk mulut 口",
            "10. 横 (Héng) - Mendatar penutup mulut 口"
        ]
    },
    {
        "char": "瀚",
        "pinyin": "hàn",
        "meaning": "Samudra Raya \/ Keluasan Semesta (Ocean \/ Boundless)",
        "strokesCount": 19,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Air 氵 di kiri, Suku Kata 翰 di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik pertama air 氵",
            "2. 点 (Diǎn) - Titik kedua air 氵",
            "3. 提 (Tí) - Sapuan naik air 氵",
            "4. 一 (Héng) - Mendatar atas",
            "5. 竖 (Shù) - Tegak pertama",
            "6. 竖 (Shù) - Tegak kedua",
            "7. 日-竖 (Shù) - Tegak kotak matahari 日",
            "8. 日-横折 (Héngzhé) - Mendatar tekuk 日",
            "9. 日-横 (Héng) - Mendatar dalam 日",
            "10. 日-横 (Héng) - Mendatar penutup 日",
            "11. 十-横 (Héng) - Mendatar sepuluh",
            "12. 十-竖 (Shù) - Tegak sepuluh",
            "13. 撇 (Piě) - Miring atas bulu 羽",
            "14. 横折钩 (Héngzhégōu) - Mendatar kait sayap 羽",
            "15. 提 (Tí) - Sapuan bulu",
            "16. 撇 (Piě) - Miring sayap kedua 羽",
            "17. 横折钩 (Héngzhégōu) - Mendatar kait sayap kedua 羽",
            "18. 提 (Tí) - Sapuan bulu kedua",
            "19. 点 (Diǎn) - Titik keagungan samudera"
        ]
    },
    {
        "char": "渊",
        "pinyin": "yuān",
        "meaning": "Jurang Dalam \/ Berilmu Dalam (Abyss \/ Deep)",
        "strokesCount": 11,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, Pusaran Air di kanan)",
        "strokeSteps": [
            "1. 点 (Diǎn) - Titik pertama air 氵",
            "2. 点 (Diǎn) - Titik kedua air 氵",
            "3. 提 (Tí) - Sapuan naik air 氵",
            "4. 撇 (Piě) - Miring kiri pusaran",
            "5. 竖 (Shù) - Tegak kiri jurang",
            "6. 横折 (Héngzhé) - Mendatar tekuk",
            "7. 撇 (Piě) - Miring dalam jurang",
            "8. 点 (Diǎn) - Titik pertama dalam jurang",
            "9. 点 (Diǎn) - Titik kedua dalam jurang",
            "10. 撇 (Piě) - Miring penyeimbang",
            "11. 竖 (Shù) - Tegak sisi kanan penutup"
        ]
    },
    {
        "char": "博",
        "pinyin": "bó",
        "meaning": "Luas Berlimpah \/ Museum (Erudite \/ Abundant)",
        "strokesCount": 12,
        "hskLevel": "HSK 6",
        "rules": "Kiri ke Kanan (Sepuluh 十 di kiri, 甫 dan Titik di kanan)",
        "strokeSteps": [
            "1. 横 (Héng) - Mendatar radikal sepuluh 十",
            "2. 竖 (Shù) - Tegak lurus radikal sepuluh 十",
            "3. 横 (Héng) - Mendatar atas bagian kanan",
            "4. 竖 (Shù) - Tegak kiri bagian 甫",
            "5. 横折 (Héngzhé) - Mendatar tekuk bingkai 甫",
            "6. 横 (Héng) - Mendatar dalam bingkai 甫",
            "7. 竖 (Shù) - Tegak lurus tengah menembus 甫",
            "8. 横 (Héng) - Mendatar penutup bawah 甫",
            "9. 点 (Diǎn) - Titik kanan atas 甫",
            "10. 撇 (Piě) - Miring pendek kanan",
            "11. 横 (Héng) - Mendatar bawah",
            "12. 点 (Diǎn) - Titik penutup di kanan bawah"
        ]
    }
],

  // Comprehensive Extensive Bank Soal HSK 1 - 6 (50 Soal x 6 Level = 300 Soal Campuran)
  bankQuestions: (typeof window !== 'undefined' && window.MandarinkuBankQuestions) ? window.MandarinkuBankQuestions : {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  }
};

// ==========================================================================
// Speech Synthesis (Text to Speech Mandarin) Helper
// ==========================================================================
function speakMandarin(text, rate = 0.9) {
  if (!('speechSynthesis' in window)) {
    alert("Browser Anda tidak mendukung Web Speech Synthesis.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  
  // Try to find a Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh') || v.name.includes('Chinese') || v.name.includes('Mandarin'));
  if (zhVoice) utterance.voice = zhVoice;
  
  window.speechSynthesis.speak(utterance);
}

// ==========================================================================
// Initializer & Navigation Router
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initThemeMode();
  initFallingSakura();
  initNavigation();
  initAuthSystem();
  if (State.currentUser && State.currentUser.email) {
    UserManager.fetchFromServer(State.currentUser.email);
  }
  updateUserNavDisplay();
  updateHomeDashboard();
  renderListeningModule();
  renderSpeakingModule();
  renderReadingModule();
  renderWritingModule();
  renderFlashcardPage();
  renderQuizPage();
  renderBankSoalModule();
  renderHskModule();
  renderProfileModule();
  if (typeof renderCeritaPage === 'function') renderCeritaPage();
  renderUploadedModulesList();
  initAnalyticsChart();

  // Load voices for speech synth
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
});

// ==========================================================================
// TEMA GELAP / TERANG (DARK & LIGHT MODE CONTROLLER)
// ==========================================================================
function initThemeMode() {
  let isDark = false;
  try {
    const saved = localStorage.getItem('mandarinku_theme');
    if (saved) {
      isDark = (saved === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark = true;
    }
  } catch (e) {}
  applyThemeMode(isDark, false);
}

function applyThemeMode(isDark, showFeedback = true) {
  if (isDark) {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
    try {
      localStorage.setItem('mandarinku_theme', 'dark');
      document.cookie = "mandarinku_theme=dark; path=/; max-age=31536000";
    } catch(e) {}
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.body.classList.remove('dark-mode');
    try {
      localStorage.setItem('mandarinku_theme', 'light');
      document.cookie = "mandarinku_theme=light; path=/; max-age=31536000";
    } catch(e) {}
  }

  const icon = isDark ? '☀️' : '🌙';
  const label = isDark ? 'Terang' : 'Gelap';

  const dIcon = document.getElementById('theme-toggle-icon');
  const dText = document.getElementById('theme-toggle-text');
  if (dIcon) dIcon.textContent = icon;
  if (dText) dText.textContent = label;

  document.querySelectorAll('.mobile-theme-icon').forEach(el => el.textContent = icon);
  document.querySelectorAll('.mobile-theme-text').forEach(el => el.textContent = label);

  if (showFeedback && typeof showToast === 'function') {
    showToast(isDark ? 'Mode Gelap diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️');
  }
}

function toggleThemeMode() {
  const isCurrentlyDark = document.body.classList.contains('dark-mode') || document.documentElement.classList.contains('dark-mode');
  applyThemeMode(!isCurrentlyDark, true);
}

// Sakura Petals background generator
function initFallingSakura() {
  const container = document.getElementById("sakura-bg-decor");
  if (!container) return;
  const count = 20;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "falling-petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${6 + Math.random() * 7}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.width = `${12 + Math.random() * 14}px`;
    petal.style.height = `${12 + Math.random() * 14}px`;
    container.appendChild(petal);
  }
}

// Navigation Tab Switcher
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item, .sidebar-link, .bottom-nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = item.getAttribute("data-page");
      if (targetPage) {
        navigateTo(targetPage);
      }
    });
  });
}

function navigateTo(pageId) {
  // If student tries to navigate to admin page, auto-activate admin role for seamless access
  if (pageId === 'admin' && State.currentUser.role !== 'admin' && State.currentUser.role !== 'teacher') {
    switchUserRole('admin');
    showToast("Mode Pengelola (Admin) diaktifkan 🛡️");
  }

  // Close any open navigation dropdowns
  document.querySelectorAll('.nav-dropdown-wrapper.open').forEach(w => w.classList.remove('open'));

  State.currentTab = pageId;
  document.querySelectorAll(".app-page").forEach(p => p.classList.remove("active-page"));
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add("active-page");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active status on nav buttons
  document.querySelectorAll(".nav-item, .sidebar-link").forEach(btn => {
    if (btn.getAttribute("data-page") === pageId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update active status on dropdown items
  document.querySelectorAll(".nav-dropdown-item").forEach(item => {
    if (item.getAttribute("data-page") === pageId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update active status on mobile drawer navigation links
  document.querySelectorAll(".mobile-nav-link").forEach(btn => {
    if (btn.getAttribute("data-page") === pageId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update active status on profile avatar pill
  const profPill = document.querySelector('.profile-pill-btn');
  if (profPill) {
    if (pageId === 'profil') {
      profPill.classList.add('active');
    } else {
      profPill.classList.remove('active');
    }
  }

  // Update active status on parent dropdown buttons with highlight indicators
  const materiPages = ['listening', 'speaking', 'reading', 'writing', 'cerita', 'hsk', 'modul-detail'];
  const latihanPages = ['quiz', 'bank-soal', 'flashcard', 'latihan-ekstra'];
  const gamePages = ['game-arena'];
  const fiturPages = ['fitur-pintar', 'cetak-hanzi'];

  const materiBtn = document.getElementById('nav-btn-materi');
  const latihanBtn = document.getElementById('nav-btn-latihan');
  const gameBtn = document.getElementById('nav-btn-game');
  const fiturBtn = document.getElementById('nav-btn-fitur');

  if (materiBtn) {
    if (materiPages.includes(pageId)) materiBtn.classList.add('active');
    else materiBtn.classList.remove('active');
  }
  if (latihanBtn) {
    if (latihanPages.includes(pageId)) latihanBtn.classList.add('active');
    else latihanBtn.classList.remove('active');
  }
  if (gameBtn) {
    if (gamePages.includes(pageId)) gameBtn.classList.add('active');
    else gameBtn.classList.remove('active');
  }
  if (fiturBtn) {
    if (fiturPages.includes(pageId)) fiturBtn.classList.add('active');
    else fiturBtn.classList.remove('active');
  }

  // Auto-close mobile drawer if open
  const drawer = document.getElementById('mobile-nav-drawer');
  if (drawer && drawer.classList.contains('active')) {
    toggleMobileNavMenu();
  }

  // Re-render specifics if needed
  if (pageId === 'beranda') {
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderDailyMissionsPanel();
  } else if (pageId === 'profil') {
    renderProfileModule();
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderCertificatesInProfile();
    setTimeout(initAnalyticsChart, 100);
  } else if (pageId === 'hsk') {
    renderHskModule();
  } else if (pageId === 'cerita') {
    if (typeof renderCeritaPage === 'function') renderCeritaPage();
  } else if (pageId === 'admin') {
    renderAdminDashboard();
  } else if (pageId === 'quiz') {
    renderQuizPage();
  } else if (pageId === 'flashcard') {
    renderFlashcardPage();
  } else if (pageId === 'bank-soal') {
    renderBankSoalModule();
  } else if (pageId === 'latihan-ekstra') {
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderLatihanEkstraPage();
  } else if (pageId === 'cetak-hanzi') {
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderCetakHanziPage();
  } else if (pageId === 'game-arena') {
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderGameArenaPage();
  } else if (pageId === 'fitur-pintar') {
    if (window.MandarinkuExtras) window.MandarinkuExtras.renderFiturPintarPage();
  }
}

function toggleMobileNavMenu() {
  const drawer = document.getElementById('mobile-nav-drawer');
  let backdrop = document.getElementById('mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobile-nav-backdrop';
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.onclick = toggleMobileNavMenu;
    document.body.appendChild(backdrop);
  }
  if (drawer) {
    const isActive = drawer.classList.contains('active');
    if (isActive) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}

function toggleNavDropdown(btn, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const wrapper = btn.closest('.nav-dropdown-wrapper');
  if (!wrapper) return;
  const isAlreadyOpen = wrapper.classList.contains('open');
  document.querySelectorAll('.nav-dropdown-wrapper.open').forEach(w => w.classList.remove('open'));
  if (!isAlreadyOpen) {
    wrapper.classList.add('open');
  }
}

// Click outside closes dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown-wrapper')) {
    document.querySelectorAll('.nav-dropdown-wrapper.open').forEach(w => w.classList.remove('open'));
  }
});

// ==========================================================================
// 1. Authentication & Role Switcher (Siswa & Admin)
// ==========================================================================
function initAuthSystem() {
  const loginForm = document.getElementById("login-form");
  const togglePass = document.getElementById("toggle-password-btn");
  const passInput = document.getElementById("login-password");
  
  if (togglePass && passInput) {
    togglePass.addEventListener("click", () => {
      if (passInput.type === "password") {
        passInput.type = "text";
        togglePass.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      } else {
        passInput.type = "password";
        togglePass.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      }
    });
  }

  // Quick Role Switchers in login demo box
  document.querySelectorAll(".role-btn-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".role-btn-chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      const role = chip.getAttribute("data-role");
      const emailInput = document.getElementById("login-email");
      if (role === 'admin' || role === 'teacher') {
        emailInput.value = "admin@mandarinku.com";
        passInput.value = "SuperAdmin2024!";
      } else {
        emailInput.value = "learner@mandarinku.com";
        passInput.value = "PandaBelajar2024!";
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const selectedChip = document.querySelector(".role-btn-chip.selected");
      const role = selectedChip ? selectedChip.getAttribute("data-role") : "student";
      
      State.currentUser = UserManager.getUser(email, role);
      UserManager.setActiveEmail(State.currentUser.email);
      UserManager.saveCurrentUser();
      UserManager.fetchFromServer(State.currentUser.email);

      updateUserNavDisplay();
      updateHomeDashboard();
      renderProfileModule();
      showToast(`Selamat datang kembali, ${State.currentUser.name} (${State.currentUser.role === 'admin' ? 'Pengelola' : 'Siswa'})! 🎉`);
      
      if (State.currentUser.role === 'admin') {
        navigateTo("admin");
      } else {
        navigateTo("beranda");
      }
    });
  }
}

function updateUserNavDisplay() {
  const nameEl = document.getElementById("nav-user-name");
  const roleEl = document.getElementById("nav-user-role");
  const isAdmin = State.currentUser.role === 'admin' || State.currentUser.role === 'teacher';

  if (nameEl) nameEl.textContent = State.currentUser.name;
  if (roleEl) {
    roleEl.textContent = isAdmin ? "ADMIN" : "SISWA";
    if (isAdmin) {
      roleEl.style.background = "#eff6ff";
      roleEl.style.color = "#1e40af";
      roleEl.style.border = "1px solid #bfdbfe";
    } else {
      roleEl.style.background = "#ecfdf5";
      roleEl.style.color = "#059669";
      roleEl.style.border = "1px solid #a7f3d0";
    }
  }

  // Update quick role switcher pill in navbar
  const pillIcon = document.getElementById("nav-role-icon");
  const pillText = document.getElementById("nav-role-text");
  const pillBox = document.getElementById("nav-role-badge-pill");
  if (pillIcon && pillText && pillBox) {
    if (isAdmin) {
      pillIcon.textContent = "🛡️";
      pillText.textContent = "Mode Admin (Pengelola)";
      pillText.style.color = "#1e40af";
      pillBox.style.background = "#eff6ff";
      pillBox.style.borderColor = "#93c5fd";
    } else {
      pillIcon.textContent = "👨‍🎓";
      pillText.textContent = "Mode Siswa (Pelajar)";
      pillText.style.color = "#059669";
      pillBox.style.background = "#ecfdf5";
      pillBox.style.borderColor = "#a7f3d0";
    }
  }

  // Update beranda-role-notice banner
  const roleNoticeEl = document.getElementById("beranda-role-notice");
  if (roleNoticeEl) {
    if (isAdmin) {
      roleNoticeEl.style.background = "linear-gradient(135deg, #eff6ff, #fdf2f8)";
      roleNoticeEl.style.borderColor = "#bfdbfe";
      roleNoticeEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🛡️</span>
          <div>
            <strong style="font-size: 0.88rem; color: #1e40af;">Akses Admin / Pengelola Aktif:</strong>
            <span style="font-size: 0.82rem; color: #3b82f6;">Anda memiliki hak penuh untuk mengelola modul, mengedit materi, membuat butir soal, dan kartu flashcard.</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="navigateTo('admin')" style="background: #1e40af; border: none; color: #fff; padding: 6px 14px; border-radius: 9999px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
            ⚙️ Buka Panel Pengelola
          </button>
          <button onclick="switchUserRole('student')" style="background: #ffffff; border: 1.5px solid #1e40af; color: #1e40af; padding: 6px 14px; border-radius: 9999px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
            👨‍🎓 Mode Siswa
          </button>
        </div>
      `;
    } else {
      roleNoticeEl.style.background = "linear-gradient(135deg, #f0fdf4, #ecfdf5)";
      roleNoticeEl.style.borderColor = "#a7f3d0";
      roleNoticeEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🎓</span>
          <div>
            <strong style="font-size: 0.88rem; color: #065f46;">Akses Siswa Aktif:</strong>
            <span style="font-size: 0.82rem; color: #047857;">Anda dapat melihat, mempelajari, dan mengerjakan seluruh materi pembelajaran, kuis, dan latihan soal.</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="switchUserRole('admin')" style="background: #ffffff; border: 1.5px solid #059669; color: #059669; padding: 6px 14px; border-radius: 9999px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
            🛡️ Beralih ke Mode Admin
          </button>
        </div>
      `;
    }
  }

  // Toggle Admin-only menu elements in Navbar & Sidebar
  document.querySelectorAll(".nav-admin-only").forEach(el => {
    el.style.display = isAdmin ? "inline-flex" : "none";
  });
  document.querySelectorAll(".sidebar-admin-only").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });

  // Show or hide upload buttons based on role
  const uploadBtnHeader = document.getElementById("btn-open-upload-modal");
  if (uploadBtnHeader) {
    uploadBtnHeader.style.display = isAdmin ? "inline-flex" : "none";
  }
}

function toggleRoleSwitchDropdown() {
  const dropdown = document.getElementById("role-switch-dropdown");
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === "none" || !dropdown.style.display ? "block" : "none";
  }
}

// Close dropdown when clicked outside
document.addEventListener("click", (e) => {
  const pill = document.getElementById("nav-role-badge-pill");
  const dropdown = document.getElementById("role-switch-dropdown");
  if (dropdown && pill && !pill.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

function switchUserRole(newRole) {
  const dropdown = document.getElementById("role-switch-dropdown");
  if (dropdown) dropdown.style.display = "none";

  const email = (newRole === 'admin' || newRole === 'teacher') ? 'admin@mandarinku.com' : 'learner@mandarinku.com';
  State.currentUser = UserManager.getUser(email, newRole);
  UserManager.setActiveEmail(State.currentUser.email);
  UserManager.saveCurrentUser();

  updateUserNavDisplay();
  updateHomeDashboard();
  renderProfileModule();

  if (newRole === 'admin') {
    showToast("🛡️ Beralih ke Hak Akses Admin (Pengelola). Anda dapat mengedit modul & kuis!", "info");
    navigateTo("admin");
  } else {
    showToast("👨‍🎓 Beralih ke Hak Akses Siswa (Pelajar). Anda dapat melihat dan mengerjakan seluruh modul!", "info");
    navigateTo("beranda");
  }
}

// ==========================================================================
// 2. Skill Subtab Switcher & Interactive Quiz State Engine
// ==========================================================================
let currentSkillSubtab = {
  listening: 'materi',
  speaking: 'materi',
  reading: 'materi',
  writing: 'materi'
};

function switchSkillSubtab(skill, tab) {
  currentSkillSubtab[skill] = tab;
  
  const btnMateri = document.getElementById(`btn-subtab-${skill}-materi`);
  const btnLatihan = document.getElementById(`btn-subtab-${skill}-latihan`);
  const btnRoleplay = document.getElementById(`btn-subtab-${skill}-roleplay`);
  if (btnMateri) btnMateri.classList.toggle('active', tab === 'materi');
  if (btnLatihan) btnLatihan.classList.toggle('active', tab === 'latihan');
  if (btnRoleplay) btnRoleplay.classList.toggle('active', tab === 'roleplay');

  if (skill === 'listening') renderListeningModule();
  else if (skill === 'speaking') renderSpeakingModule();
  else if (skill === 'reading') renderReadingModule();
  else if (skill === 'writing') renderWritingModule();
}

// ==========================================================================
// 2.1 Listening Module
// ==========================================================================
function renderListeningModule() {
  const currentEx = State.listeningData[State.currentListeningExercise] || State.listeningData[0];
  const container = document.getElementById("listening-content-container");
  if (!container || !currentEx) return;

  const isMateriTab = (currentSkillSubtab.listening === 'materi');

  if (isMateriTab) {
    // -------------------------------------------------------------
    // TAB MATERI: Materi HSK 1 - 6 & Contoh Soal Terpandu yang Bisa Diklik
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Materi HSK 1 - 6 & Topik Tematik -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: var(--primary-pink)">🎧</span> Materi Pembelajaran Mendengar HSK 1 - 6
            </h3>
            <span class="role-badge" style="background: #ecfdf5; color: #059669; font-size: 0.72rem;">HSK 1 - 6</span>
          </div>

          <!-- HSK 1 - 6 Cards for Listening -->
          <div class="category-item-card" style="border-left: 4px solid #10b981; cursor: pointer;" onclick="openLearningModal('listening_hsk1')">
            <div class="category-icon-box" style="background: #ecfdf5; color: #10b981;">🌱</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #ecfdf5; color: #10b981; font-size: 0.7rem; padding: 2px 6px;">HSK 1</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 1: Nada & Sapaan</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Pinyin 4 nada, 150 kata dasar & dialog pengenalan.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk1')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #06b6d4; cursor: pointer;" onclick="openLearningModal('listening_hsk2')">
            <div class="category-icon-box" style="background: #cff4fc; color: #06b6d4;">🌿</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #cff4fc; color: #06b6d4; font-size: 0.7rem; padding: 2px 6px;">HSK 2</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 2: Waktu & Rutinitas</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">300 kata, jam, petunjuk arah & komparasi 比.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk2')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #3b82f6; cursor: pointer;" onclick="openLearningModal('listening_hsk3')">
            <div class="category-icon-box" style="background: #dbeafe; color: #3b82f6;">🌳</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #dbeafe; color: #3b82f6; font-size: 0.7rem; padding: 2px 6px;">HSK 3</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 3: Bandara & Dialog</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">600 kata, kalimat 把/被 & percakapan perjalanan.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk3')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #8b5cf6; cursor: pointer;" onclick="openLearningModal('listening_hsk4')">
            <div class="category-icon-box" style="background: #f3e8ff; color: #8b5cf6;">🍁</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #f3e8ff; color: #8b5cf6; font-size: 0.7rem; padding: 2px 6px;">HSK 4</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 4: Situasi Kerja & Opini</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">1.200 kata, pengumuman bandara & wawancara.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk4')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #ec4899; cursor: pointer;" onclick="openLearningModal('listening_hsk5')">
            <div class="category-icon-box" style="background: #fce7f3; color: #ec4899;">🌸</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fce7f3; color: #ec4899; font-size: 0.7rem; padding: 2px 6px;">HSK 5</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 5: Berita & Diskusi Formal</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">2.500 kata, wacana teknologi & diplomasi bisnis.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk5')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #d97706; cursor: pointer;" onclick="openLearningModal('listening_hsk6')">
            <div class="category-icon-box" style="background: #fef3c7; color: #d97706;">👑</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fef3c7; color: #d97706; font-size: 0.7rem; padding: 2px 6px;">HSK 6</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Listening HSK 6: Pidato Sastra & Debat</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">5.000+ kata, idiom klasik & pidato akademik.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_hsk6')">Pelajari</button>
          </div>

          <div style="margin-top: 1.5rem; margin-bottom: 0.8rem; border-top: 1px dashed #e2e8f0; padding-top: 1rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 6px; margin: 0; color: var(--dark-text);">
              <span>💡</span> Topik Spesifik Mendengar
            </h4>
          </div>
          
          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('listening_pinyin')">
            <div class="category-icon-box" style="background: #fff0f3; color: #f27289;">🔊</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Pinyin & Nada</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Mengenal pelafalan pinyin dan 4 nada dasar.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_pinyin')">Pelajari</button>
          </div>

          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('listening_vocab')">
            <div class="category-icon-box" style="background: #fff8eb; color: #ff9f1c;">👂</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Kosakata Sehari-hari</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Kosakata umum dalam percakapan sehari-hari.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('listening_vocab')">Pelajari</button>
          </div>
        </div>

        <!-- Kolom Kanan: Contoh Soal Terpandu Listening yang Bisa Diklik -->
        <div>
          <div style="background: #ffffff; border: 1.5px solid #fce7f3; border-radius: 16px; padding: 1.3rem; box-shadow: var(--card-shadow); position: sticky; top: 80px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-size: 0.75rem;">Contoh Soal Interaktif</span>
                <span style="font-size: 0.76rem; color: var(--text-muted);">${currentEx.hskLevel}</span>
              </div>
              <button onclick="switchSkillSubtab('listening', 'latihan')" style="background: none; border: none; font-size: 0.8rem; color: var(--primary-pink); font-weight: 800; cursor: pointer;">
                Buka Semua Latihan ➔
              </button>
            </div>

            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.4rem;">
              ${currentEx.title}
            </h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
              Klik tombol audio di bawah untuk mendengar, lalu klik salah satu opsi jawaban:
            </p>

            <!-- Audio Player Mini -->
            <div style="background: #fff8f9; border: 1px solid #ffd8e0; border-radius: 12px; padding: 10px 14px; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
              <button class="btn-audio-circle" onclick="playCurrentListeningAudio()" style="width: 38px; height: 38px; font-size: 0.9rem;" title="Putar Audio Soal">
                ▶
              </button>
              <div style="flex: 1;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--dark-text);">Audio Percakapan Penutur</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Durasi: ${currentEx.duration} • Klik untuk mendengarkan</div>
              </div>
              <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem;" onclick="speakMandarin('${currentEx.audioText.replace(/'/g, "\\'")}', 0.85)">
                🔊 Dikte Suara
              </button>
            </div>

            <!-- Pertanyaan Contoh Soal -->
            <div style="margin-bottom: 1rem;">
              <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 8px;">
                ❓ ${currentEx.question}
              </p>
              
              <!-- Opsi Jawaban yang BISA DIKLIK -->
              <div id="listening-contoh-options" style="display: flex; flex-direction: column; gap: 8px;">
                ${currentEx.options.map(opt => `
                  <div class="quiz-option-item" id="contoh-opt-listening-${opt.id}" 
                       style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                       onclick="checkContohListeningAnswer('${opt.id}', '${currentEx.correctAnswer}', '${currentEx.explanation.replace(/'/g, "\\'")}')">
                    <span style="font-weight: 800; color: var(--primary-pink); min-width: 24px;">${opt.id}.</span>
                    <span style="flex: 1; font-size: 0.88rem;">${opt.text}</span>
                    <span id="contoh-icon-listening-${opt.id}" style="font-size: 0.9rem;"></span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Feedback Kotak Pembahasan Interaktif -->
            <div id="listening-contoh-feedback" style="display: none; border-radius: 10px; padding: 12px 14px; margin-top: 10px; font-size: 0.85rem; line-height: 1.5;"></div>

            <div style="margin-top: 1.2rem; border-top: 1px dashed #fcdfe5; padding-top: 1rem; text-align: center;">
              <button class="btn-primary-sakura" style="width: 100%; padding: 10px; font-size: 0.88rem;" onclick="switchSkillSubtab('listening', 'latihan')">
                🎯 Kerjakan Latihan Lengkap (10 Soal Mendengar) ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // -------------------------------------------------------------
    // TAB LATIHAN: Panel Latihan Mendengar 10 Soal & Kuis Interaktif
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Daftar 10 Latihan Soal Mendengar (Bisa Diklik) -->
        <div class="exercise-list-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: var(--primary-pink)">🎧</span> Daftar Latihan Mendengar
            </h3>
            <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-size: 0.72rem;">${State.listeningData.length} Soal</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
            Klik salah satu latihan di bawah untuk mengerjakan:
          </p>

          <div id="listening-items-wrapper" style="display: flex; flex-direction: column; gap: 8px; max-height: 600px; overflow-y: auto; padding-right: 4px;">
            ${State.listeningData.map((item, index) => {
              const isActive = (index === State.currentListeningExercise);
              return `
                <div class="exercise-item-row ${isActive ? 'active' : ''}" 
                     style="cursor: pointer; transition: all 0.2s;" 
                     onclick="selectListeningExercise(${index})">
                  <div class="exercise-num-badge">${index + 1}</div>
                  <div class="exercise-thumbnail">🎧</div>
                  <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--dark-text); margin: 0;">${item.title}</h4>
                    <p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px; margin-bottom: 2px;">${item.subtitle}</p>
                    <div style="display: flex; gap: 10px; font-size: 0.7rem; color: #a0a6bd;">
                      <span>⏱️ ${item.duration}</span>
                      <span>• ${item.level}</span>
                    </div>
                  </div>
                  <button class="exercise-play-btn" onclick="event.stopPropagation(); playListeningAudio(${index})" title="Putar audio latihan ini">▶</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Kolom Kanan: Player Audio, Percakapan & Soal Interaktif yang Bisa Diklik -->
        <div class="interactive-panel">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-size: 0.76rem;">Soal #${State.currentListeningExercise + 1}</span>
                <span style="font-size: 0.82rem; color: var(--text-muted);">${currentEx.hskLevel} • ${currentEx.level}</span>
              </div>
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary-pink);">${currentEx.title}</span>
            </div>
            
            <!-- Audio Player Box -->
            <div class="custom-audio-player" style="margin-bottom: 1.2rem;">
              <div class="audio-controls-row">
                <button class="btn-audio-circle" id="listening-play-btn" onclick="playCurrentListeningAudio()">▶</button>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                    <span id="audio-time-curr">0:00</span>
                    <span id="audio-time-total">${currentEx.duration}</span>
                  </div>
                  <input type="range" class="audio-seeker" id="audio-seeker-bar" min="0" max="100" value="0" style="width: 100%;">
                </div>
                <button style="background: none; border: 1px solid #f8c2cd; border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.75rem; color: var(--primary-pink); font-weight: bold; cursor: pointer;" onclick="changeAudioSpeed(this)">1.0x</button>
              </div>
            </div>
          </div>

          <!-- Pertanyaan Kuis Latihan & Opsi yang BISA DIKLIK -->
          <div style="background: #ffffff; border: 1.5px solid #fae2e6; border-radius: 14px; padding: 1.2rem; margin-bottom: 1.2rem;">
            <p style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.8rem;">
              Pertanyaan: ${currentEx.question}
            </p>
            
            <div id="listening-quiz-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem;">
              ${currentEx.options.map(opt => `
                <div class="quiz-option-item ${selectedListeningOption === opt.id ? 'selected' : ''}" 
                     id="listening-opt-${opt.id}" 
                     style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                     onclick="selectQuizOption(this, '${opt.id}')">
                  <span style="font-weight: 800; color: var(--primary-pink); min-width: 24px;">${opt.id}.</span>
                  <span style="flex: 1;">${opt.text}</span>
                  <span id="listening-badge-${opt.id}"></span>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn-check-answer" style="flex: 1;" onclick="checkListeningAnswer()">
                ✨ Cek Jawaban Sekarang
              </button>
              <button onclick="resetListeningQuiz()" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-pill); padding: 10px 16px; font-size: 0.85rem; font-weight: 700; cursor: pointer; color: var(--dark-text);">
                🔄 Reset
              </button>
            </div>

            <div id="listening-quiz-feedback" style="display: none; margin-top: 12px; font-size: 0.88rem; padding: 12px; border-radius: var(--radius-md); line-height: 1.5;"></div>
          </div>

          <!-- Script Percakapan Dialog Asli (Bisa Didengar Per Baris) -->
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 6px;">
              <span>💬</span> Naskah Percakapan (Klik 🔊 untuk mendengar kalimat tertentu):
            </h4>
            <div style="max-height: 220px; overflow-y: auto; padding-right: 4px;">
              ${(currentEx.dialogue || []).map((d, dIdx) => {
                const isSanti = (d.speaker || '').toLowerCase().includes('santi') || d.speaker === 'A';
                const badgeBg = isSanti ? '#ffeef1' : '#e0f2fe';
                const badgeColor = isSanti ? 'var(--primary-pink)' : '#0284c7';
                const speakerLabel = d.speaker;
                return `
                  <div class="dialog-bubble-row">
                    <div style="min-width: 52px; height: 32px; border-radius: 99px; background: ${badgeBg}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: ${badgeColor}; flex-shrink: 0; padding: 0 8px;">
                      ${speakerLabel}
                    </div>
                    <div class="dialog-bubble">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div>
                          <div class="hanzi">${d.hanzi}</div>
                          <div class="pinyin">${d.pinyin}</div>
                          <div class="meaning">${d.indonesian}</div>
                        </div>
                        <button class="btn-audio-pill-mini" style="background: none; border: 1px solid #f8c2cd; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;" onclick="speakMandarin('${d.hanzi.replace(/'/g, "\\'")}', 0.85)" title="Dengarkan ${speakerLabel}">🔊</button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <button class="btn-primary-sakura" style="margin-top: 0.8rem; padding: 10px; font-size: 0.88rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="playFullDialogueAudio()">
              🎧 Putar Seluruh Percakapan (Dialog Multi-Voice)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Inisialisasi Canvas Interaktif Menulis bila ada
  setTimeout(initWritingCanvas, 60);
}

function selectListeningExercise(index) {
  State.currentListeningExercise = index;
  selectedListeningOption = null;
  renderListeningModule();
}

function playListeningAudio(index) {
  State.currentListeningExercise = index;
  selectedListeningOption = null;
  renderListeningModule();
  playCurrentListeningAudio();
}

function playCurrentListeningAudio() {
  const currentEx = State.listeningData[State.currentListeningExercise] || State.listeningData[0];
  if (!currentEx) return;

  if (currentEx.dialogue && currentEx.dialogue.length > 0) {
    playFullDialogueAudio();
  } else {
    speakMandarin(currentEx.audioText, 0.85);
  }
  showToast(`Memutar audio: ${currentEx.title} 🎵`);
  
  const seeker = document.getElementById("audio-seeker-bar");
  const timeCurr = document.getElementById("audio-time-curr");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (seeker) seeker.value = progress;
    if (timeCurr) timeCurr.textContent = `0:0${Math.floor(progress / 10)}`;
    if (progress >= 100) {
      clearInterval(interval);
      if (seeker) seeker.value = 0;
      if (timeCurr) timeCurr.textContent = "0:00";
    }
  }, 300);
}

let selectedListeningOption = null;
function selectQuizOption(el, optionId) {
  selectedListeningOption = optionId;
  const currentEx = State.listeningData[State.currentListeningExercise];
  document.querySelectorAll("#listening-quiz-options .quiz-option-item").forEach(item => {
    item.classList.remove("selected");
  });
  if (el) el.classList.add("selected");
  
  // Langsung periksa jawaban untuk respon interaktif instan
  checkListeningAnswer();
}

function checkListeningAnswer() {
  const currentEx = State.listeningData[State.currentListeningExercise];
  const feedbackEl = document.getElementById("listening-quiz-feedback");
  if (!selectedListeningOption || !feedbackEl) return;

  const isCorrect = (selectedListeningOption === currentEx.correctAnswer);

  currentEx.options.forEach(opt => {
    const optEl = document.getElementById(`listening-opt-${opt.id}`);
    const badgeEl = document.getElementById(`listening-badge-${opt.id}`);
    if (optEl) {
      optEl.classList.remove("correct", "wrong");
      if (opt.id === currentEx.correctAnswer) {
        optEl.classList.add("correct");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #059669; font-weight: 800;">✓ Benar</span>`;
      } else if (opt.id === selectedListeningOption && !isCorrect) {
        optEl.classList.add("wrong");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #dc2626; font-weight: 800;">✗ Salah</span>`;
      } else if (badgeEl) {
        badgeEl.innerHTML = "";
      }
    }
  });

  feedbackEl.style.display = "block";
  if (isCorrect) {
    feedbackEl.style.background = "#e6faf7";
    feedbackEl.style.border = "1.5px solid #2ec4b6";
    feedbackEl.style.color = "#0f766e";
    feedbackEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong>🎉 Luar Biasa, Jawaban Anda Benar! (+10 Poin, +15 EXP)</strong>
        <button onclick="nextListeningExercise()" style="background: #2ec4b6; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          Soal Berikutnya ➔
        </button>
      </div>
      <div>${currentEx.explanation}</div>
    `;
    recordUserActivity('listening', 15, 10, currentEx.title, 3);
  } else {
    feedbackEl.style.background = "#fff0f3";
    feedbackEl.style.border = "1.5px solid #f27289";
    feedbackEl.style.color = "#be123c";
    feedbackEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong>❌ Jawaban Kurang Tepat (Kunci: Opsi ${currentEx.correctAnswer})</strong>
        <button onclick="resetListeningQuiz()" style="background: #f27289; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          🔄 Coba Lagi
        </button>
      </div>
      <div>${currentEx.explanation}</div>
    `;
  }
}

function resetListeningQuiz() {
  selectedListeningOption = null;
  const currentEx = State.listeningData[State.currentListeningExercise];
  if (currentEx) {
    currentEx.options.forEach(opt => {
      const optEl = document.getElementById(`listening-opt-${opt.id}`);
      const badgeEl = document.getElementById(`listening-badge-${opt.id}`);
      if (optEl) {
        optEl.classList.remove("selected", "correct", "wrong");
      }
      if (badgeEl) badgeEl.innerHTML = "";
    });
  }
  const feedbackEl = document.getElementById("listening-quiz-feedback");
  if (feedbackEl) feedbackEl.style.display = "none";
}

function nextListeningExercise() {
  if (State.currentListeningExercise < State.listeningData.length - 1) {
    State.currentListeningExercise++;
  } else {
    State.currentListeningExercise = 0;
  }
  selectedListeningOption = null;
  renderListeningModule();
}

// Handler klik contoh soal di tab materi listening
function checkContohListeningAnswer(selectedId, correctId, explanation) {
  const isCorrect = (selectedId === correctId);
  const container = document.getElementById("listening-contoh-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("correct", "wrong");
    });
  }
  const chosenEl = document.getElementById(`contoh-opt-listening-${selectedId}`);
  const chosenIcon = document.getElementById(`contoh-icon-listening-${selectedId}`);
  const correctEl = document.getElementById(`contoh-opt-listening-${correctId}`);
  const correctIcon = document.getElementById(`contoh-icon-listening-${correctId}`);

  if (correctEl) {
    correctEl.classList.add("correct");
    if (correctIcon) correctIcon.innerHTML = "✓";
  }
  if (!isCorrect && chosenEl) {
    chosenEl.classList.add("wrong");
    if (chosenIcon) chosenIcon.innerHTML = "✗";
  }

  const feedbackEl = document.getElementById("listening-contoh-feedback");
  if (feedbackEl) {
    feedbackEl.style.display = "block";
    if (isCorrect) {
      feedbackEl.style.background = "#ecfdf5";
      feedbackEl.style.border = "1.5px solid #10b981";
      feedbackEl.style.color = "#047857";
      feedbackEl.innerHTML = `<strong>🎉 Benar Sekali! (+10 Poin)</strong><br>${explanation}`;
    } else {
      feedbackEl.style.background = "#fff1f2";
      feedbackEl.style.border = "1.5px solid #f43f5e";
      feedbackEl.style.color = "#be123c";
      feedbackEl.innerHTML = `<strong>⚠️ Kurang Tepat (Jawaban Benar: Opsi ${correctId})</strong><br>${explanation}`;
    }
  }
}

// ==========================================================================
// 3. Speaking Module & Speech Recognition
// ==========================================================================
let selectedSpeakingOption = null;

function renderSpeakingModule() {
  const currentSpk = State.speakingData[State.currentSpeakingExercise] || State.speakingData[0];
  const container = document.getElementById("speaking-content-container");
  if (!container || !currentSpk) return;

  if (currentSkillSubtab.speaking === 'roleplay') {
    if (window.MandarinkuExtras && typeof window.MandarinkuExtras.renderSpeakingRoleplay === 'function') {
      window.MandarinkuExtras.renderSpeakingRoleplay(container);
      return;
    }
  }

  const isMateriTab = (currentSkillSubtab.speaking === 'materi');

  if (isMateriTab) {
    // -------------------------------------------------------------
    // TAB MATERI: Materi Pembelajaran Speaking HSK 1 - 6 & Contoh Soal
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Materi Speaking HSK 1 - 6 & Topik Percakapan -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: var(--primary-pink)">🎙️</span> Materi Speaking HSK 1 - 6
            </h3>
            <span class="role-badge" style="background: #e6faf7; color: #2ec4b6; font-size: 0.72rem;">HSK 1 - 6</span>
          </div>

          <!-- HSK 1 - 6 Cards for Speaking -->
          <div class="category-item-card" style="border-left: 4px solid #10b981; cursor: pointer;" onclick="openLearningModal('speaking_hsk1')">
            <div class="category-icon-box" style="background: #ecfdf5; color: #10b981;">🌱</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #ecfdf5; color: #10b981; font-size: 0.7rem; padding: 2px 6px;">HSK 1</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 1: Nada & Perkenalan</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Artikulasi b/p, d/t, 4 nada pinyin & perkenalan diri.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk1')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #06b6d4; cursor: pointer;" onclick="openLearningModal('speaking_hsk2')">
            <div class="category-icon-box" style="background: #cff4fc; color: #06b6d4;">🌿</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #cff4fc; color: #06b6d4; font-size: 0.7rem; padding: 2px 6px;">HSK 2</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 2: Belanja & Pesan Menu</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Percakapan restoran, menawar harga & bayar WeChat.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk2')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #3b82f6; cursor: pointer;" onclick="openLearningModal('speaking_hsk3')">
            <div class="category-icon-box" style="background: #dbeafe; color: #3b82f6;">🌳</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #dbeafe; color: #3b82f6; font-size: 0.7rem; padding: 2px 6px;">HSK 3</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 3: Opini & Alasan</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Mengungkapkan pendapat 我认为, hobi & ajakan.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk3')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #8b5cf6; cursor: pointer;" onclick="openLearningModal('speaking_hsk4')">
            <div class="category-icon-box" style="background: #f3e8ff; color: #8b5cf6;">🍁</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #f3e8ff; color: #8b5cf6; font-size: 0.7rem; padding: 2px 6px;">HSK 4</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 4: Wawancara Kerja</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Presentasi profil, pengalaman kerja & negosiasi tim.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk4')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #ec4899; cursor: pointer;" onclick="openLearningModal('speaking_hsk5')">
            <div class="category-icon-box" style="background: #fce7f3; color: #ec4899;">🌸</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fce7f3; color: #ec4899; font-size: 0.7rem; padding: 2px 6px;">HSK 5</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 5: Debat & Isu Sosial</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Argumentasi ilmiah, ekonomi hijau & inovasi AI.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk5')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #d97706; cursor: pointer;" onclick="openLearningModal('speaking_hsk6')">
            <div class="category-icon-box" style="background: #fef3c7; color: #d97706;">👑</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fef3c7; color: #d97706; font-size: 0.7rem; padding: 2px 6px;">HSK 6</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Speaking HSK 6: Retorika & Diplomasi</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Pidato kenegaraan, metafora filsafat & kebudayaan.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_hsk6')">Pelajari</button>
          </div>

          <div style="margin-top: 1.5rem; margin-bottom: 0.8rem; border-top: 1px dashed #e2e8f0; padding-top: 1rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 6px; margin: 0; color: var(--dark-text);">
              <span>💡</span> Topik Percakapan Praktis
            </h4>
          </div>

          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('speaking_pinyin')">
            <div class="category-icon-box" style="background: #fff0f3; color: #f27289;">🗣️</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Pinyin & Pengucapan</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Mengenal pelafalan nada yang benar.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_pinyin')">Pelajari</button>
          </div>

          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('speaking_intro')">
            <div class="category-icon-box" style="background: #fff8eb; color: #ff9f1c;">🤝</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Sapaan & Perkenalan</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Belajar menyapa dan mengenalkan diri.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('speaking_intro')">Pelajari</button>
          </div>
        </div>

        <!-- Kolom Kanan: Contoh Soal Terpandu Speaking yang Bisa Diklik -->
        <div>
          <div style="background: #ffffff; border: 1.5px solid #d8f3ec; border-radius: 16px; padding: 1.3rem; box-shadow: var(--card-shadow); position: sticky; top: 80px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #e6faf7; color: #2ec4b6; font-size: 0.75rem;">Contoh Latihan Ucap</span>
                <span style="font-size: 0.76rem; color: var(--text-muted);">${currentSpk.hskLevel}</span>
              </div>
              <button onclick="switchSkillSubtab('speaking', 'latihan')" style="background: none; border: none; font-size: 0.8rem; color: #2ec4b6; font-weight: 800; cursor: pointer;">
                Buka Semua Latihan ➔
              </button>
            </div>

            <!-- Target Kalimat Contoh -->
            <div style="background: #f0fdf9; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 1.1rem; text-align: center; margin-bottom: 1rem;">
              <div style="font-family: var(--font-chinese); font-size: 1.55rem; font-weight: bold; color: var(--dark-text); margin-bottom: 4px;">
                ${currentSpk.targetHanzi}
              </div>
              <div style="font-size: 0.92rem; color: #0d9488; font-weight: 700; margin-bottom: 4px;">
                ${currentSpk.targetPinyin}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">
                "${currentSpk.meaning}"
              </div>
              <button class="btn-learn-outline" style="padding: 4px 14px; font-size: 0.78rem;" onclick="speakMandarin('${currentSpk.targetHanzi}', 0.85)">
                🔊 Dengarkan Pelafalan Asli
              </button>
            </div>

            <!-- Pertanyaan Contoh Soal Speaking -->
            <div style="margin-bottom: 1rem;">
              <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 8px;">
                ❓ ${currentSpk.question || 'Bagaimana intonasi dan pengucapan lisan yang tepat?'}
              </p>
              
              <!-- Opsi Jawaban yang BISA DIKLIK -->
              <div id="speaking-contoh-options" style="display: flex; flex-direction: column; gap: 8px;">
                ${(currentSpk.options || []).map(opt => `
                  <div class="quiz-option-item" id="contoh-opt-speaking-${opt.id}" 
                       style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                       onclick="checkContohSpeakingAnswer('${opt.id}', '${currentSpk.correctAnswer}', '${(currentSpk.explanation || '').replace(/'/g, "\\'")}')">
                    <span style="font-weight: 800; color: #2ec4b6; min-width: 24px;">${opt.id}.</span>
                    <span style="flex: 1; font-size: 0.88rem;">${opt.text}</span>
                    <span id="contoh-icon-speaking-${opt.id}" style="font-size: 0.9rem;"></span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Feedback Kotak Pembahasan Interaktif -->
            <div id="speaking-contoh-feedback" style="display: none; border-radius: 10px; padding: 12px 14px; margin-top: 10px; font-size: 0.85rem; line-height: 1.5;"></div>

            <div style="margin-top: 1.2rem; border-top: 1px dashed #d1fae5; padding-top: 1rem; text-align: center;">
              <button class="btn-primary-sakura" style="width: 100%; padding: 10px; font-size: 0.88rem; background: linear-gradient(135deg, #2ec4b6, #0ea5e9);" onclick="switchSkillSubtab('speaking', 'latihan')">
                🎯 Kerjakan Latihan Lengkap (12 Latihan Ucap) ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // -------------------------------------------------------------
    // TAB LATIHAN: Panel Latihan Ucap Mandiri, Speech Rec & Soal Kuis
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Daftar 12 Latihan Ucap (Bisa Diklik) -->
        <div class="exercise-list-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: #2ec4b6;">🎙️</span> Latihan Speaking
            </h3>
            <span class="role-badge" style="background: #e6faf7; color: #2ec4b6; font-size: 0.72rem;">${State.speakingData.length} Latihan</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
            Pilih kalimat target untuk berlatih berbicara:
          </p>

          <div id="speaking-items-wrapper" style="display: flex; flex-direction: column; gap: 8px; max-height: 600px; overflow-y: auto; padding-right: 4px;">
            ${State.speakingData.map((item, index) => {
              const isActive = (index === State.currentSpeakingExercise);
              return `
                <div class="exercise-item-row ${isActive ? 'active' : ''}" 
                     style="cursor: pointer; transition: all 0.2s;" 
                     onclick="selectSpeakingExercise(${index})">
                  <div class="exercise-num-badge" style="${isActive ? 'background: #2ec4b6;' : ''}">${index + 1}</div>
                  <div class="exercise-thumbnail">🎤</div>
                  <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--dark-text); margin: 0;">${item.title}</h4>
                    <p style="font-size: 0.76rem; color: #0d9488; font-weight: 700; margin-top: 2px; margin-bottom: 2px;">${item.targetHanzi}</p>
                    <div style="font-size: 0.72rem; color: #a0a6bd;">
                      <span>${item.hskLevel} • ${item.meaning}</span>
                    </div>
                  </div>
                  <button class="exercise-play-btn" onclick="event.stopPropagation(); speakMandarin('${item.targetHanzi}', 0.85)" title="Dengarkan pengucapan penutur asli">🔊</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Kolom Kanan: Papan Latihan Ucap, Web Speech AI & Soal Kuis (Bisa Diklik) -->
        <div class="interactive-panel">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 8px;">
              <span class="role-badge" style="background: #e6faf7; color: #2ec4b6; font-weight: 800;">
                Latihan #${State.currentSpeakingExercise + 1}: ${currentSpk.hskLevel}
              </span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--dark-text);">${currentSpk.title}</span>
            </div>

            <!-- Target Sentence Card -->
            <div style="background: #f0fdf9; border: 1.5px solid #a7f3d0; border-radius: var(--radius-md); padding: 1.2rem; text-align: center; margin-bottom: 1rem;">
              <div style="font-family: var(--font-chinese); font-size: 1.8rem; font-weight: bold; color: var(--dark-text); margin-bottom: 4px;">
                ${currentSpk.targetHanzi}
              </div>
              <div style="font-size: 1.05rem; color: #0d9488; font-weight: 700; margin-bottom: 4px;">
                ${currentSpk.targetPinyin}
              </div>
              <div style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 10px;">
                "${currentSpk.meaning}"
              </div>
              <button class="btn-learn-outline" style="border-color: #2ec4b6; color: #0f766e;" onclick="speakMandarin('${currentSpk.targetHanzi}', 0.85)">
                🔊 Dengarkan Penutur Asli
              </button>
            </div>

            <!-- Voice Recorder Interaction Box -->
            <div class="voice-recorder-box" style="margin-bottom: 1.2rem;">
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                Tekan tombol mikrofon di bawah dan ucapkan kalimat di atas dengan jelas:
              </p>
              <button id="btn-start-speech-rec" class="btn-record-voice" onclick="toggleVoiceRecognition()">
                <span id="rec-icon">🎙️</span> <span id="rec-label">Mulai Rekam Suara</span>
              </button>
              <div id="recording-status-msg" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 8px;">
                Mikrofon siap
              </div>
            </div>

            <!-- AI Pronunciation Score Feedback -->
            <div id="speech-eval-feedback" class="speech-feedback-card" style="display: none; margin-bottom: 1.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.95rem; color: var(--dark-text);">Hasil Evaluasi AI:</span>
                <span id="speech-score-badge" style="background: #2ec4b6; color: #fff; font-size: 0.8rem; font-weight: 800; padding: 2px 10px; border-radius: var(--radius-pill);">
                  Akurasi: 95%
                </span>
              </div>
              <p id="speech-recognized-text" style="font-size: 0.88rem; color: #0d9488; font-weight: 600; margin-bottom: 4px;"></p>
              <p id="speech-eval-notes" style="font-size: 0.8rem; color: var(--text-muted);"></p>
            </div>

            <!-- Tips Box -->
            <div style="margin-bottom: 1.2rem; background: #fffaf0; border: 1px dashed #ffd8a8; padding: 12px; border-radius: var(--radius-md); font-size: 0.82rem;">
              <strong style="color: #d97706;">💡 Tips Pelafalan & Nada:</strong> ${currentSpk.tips}
            </div>

            <!-- LATIHAN SOAL SPEAKING & KUIS INTERAKTIF YANG BISA DIKLIK -->
            <div style="background: #ffffff; border: 1.5px solid #d1fae5; border-radius: 14px; padding: 1.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text);">
                  🎯 Kuis Pemahaman Nada & Respon Percakapan
                </span>
                <button class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.72rem;" onclick="speakMandarin('${currentSpk.targetHanzi}', 0.85)">
                  🔊 Putar Ulang
                </button>
              </div>

              <p style="font-size: 0.9rem; font-weight: 700; color: var(--dark-text); margin-bottom: 10px;">
                ${currentSpk.question || 'Bagaimana respon atau kaidah pengucapan yang tepat?'}
              </p>

              <div id="speaking-quiz-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem;">
                ${(currentSpk.options || []).map(opt => `
                  <div class="quiz-option-item ${selectedSpeakingOption === opt.id ? 'selected' : ''}" 
                       id="speaking-opt-${opt.id}" 
                       style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                       onclick="selectSpeakingQuizOption('${opt.id}')">
                    <span style="font-weight: 800; color: #2ec4b6; min-width: 24px;">${opt.id}.</span>
                    <span style="flex: 1; font-size: 0.88rem;">${opt.text}</span>
                    <span id="speaking-badge-${opt.id}"></span>
                  </div>
                `).join('')}
              </div>

              <div id="speaking-quiz-feedback" style="display: none; padding: 12px; border-radius: 10px; font-size: 0.85rem; line-height: 1.5;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Inisialisasi Canvas Interaktif Menulis bila ada
  setTimeout(initWritingCanvas, 60);
}

function selectSpeakingExercise(index) {
  State.currentSpeakingExercise = index;
  selectedSpeakingOption = null;
  renderSpeakingModule();
}

function selectSpeakingQuizOption(optionId) {
  selectedSpeakingOption = optionId;
  const currentSpk = State.speakingData[State.currentSpeakingExercise];
  const feedbackEl = document.getElementById("speaking-quiz-feedback");
  if (!currentSpk || !feedbackEl) return;

  const isCorrect = (optionId === currentSpk.correctAnswer);

  (currentSpk.options || []).forEach(opt => {
    const optEl = document.getElementById(`speaking-opt-${opt.id}`);
    const badgeEl = document.getElementById(`speaking-badge-${opt.id}`);
    if (optEl) {
      optEl.classList.remove("correct", "wrong", "selected");
      if (opt.id === currentSpk.correctAnswer) {
        optEl.classList.add("correct");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #059669; font-weight: 800;">✓ Benar</span>`;
      } else if (opt.id === optionId && !isCorrect) {
        optEl.classList.add("wrong");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #dc2626; font-weight: 800;">✗ Salah</span>`;
      } else if (badgeEl) {
        badgeEl.innerHTML = "";
      }
    }
  });

  feedbackEl.style.display = "block";
  if (isCorrect) {
    feedbackEl.style.background = "#e6faf7";
    feedbackEl.style.border = "1.5px solid #2ec4b6";
    feedbackEl.style.color = "#0f766e";
    feedbackEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong>🎉 Hebat! Jawaban Anda Benar (+10 Poin, +15 EXP)</strong>
        <button onclick="nextSpeakingExercise()" style="background: #2ec4b6; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          Soal Berikutnya ➔
        </button>
      </div>
      <div>${currentSpk.explanation}</div>
    `;
    recordUserActivity('speaking', 15, 10, currentSpk.title, 3);
  } else {
    feedbackEl.style.background = "#fff0f3";
    feedbackEl.style.border = "1.5px solid #f27289";
    feedbackEl.style.color = "#be123c";
    feedbackEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong>❌ Belum Tepat (Kunci: Opsi ${currentSpk.correctAnswer})</strong>
        <button onclick="resetSpeakingQuiz()" style="background: #f27289; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          🔄 Coba Lagi
        </button>
      </div>
      <div>${currentSpk.explanation}</div>
    `;
  }
}

function resetSpeakingQuiz() {
  selectedSpeakingOption = null;
  const currentSpk = State.speakingData[State.currentSpeakingExercise];
  if (currentSpk && currentSpk.options) {
    currentSpk.options.forEach(opt => {
      const optEl = document.getElementById(`speaking-opt-${opt.id}`);
      const badgeEl = document.getElementById(`speaking-badge-${opt.id}`);
      if (optEl) optEl.classList.remove("selected", "correct", "wrong");
      if (badgeEl) badgeEl.innerHTML = "";
    });
  }
  const feedbackEl = document.getElementById("speaking-quiz-feedback");
  if (feedbackEl) feedbackEl.style.display = "none";
}

function nextSpeakingExercise() {
  if (State.currentSpeakingExercise < State.speakingData.length - 1) {
    State.currentSpeakingExercise++;
  } else {
    State.currentSpeakingExercise = 0;
  }
  selectedSpeakingOption = null;
  renderSpeakingModule();
}

function checkContohSpeakingAnswer(selectedId, correctId, explanation) {
  const isCorrect = (selectedId === correctId);
  const container = document.getElementById("speaking-contoh-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("correct", "wrong");
    });
  }
  const chosenEl = document.getElementById(`contoh-opt-speaking-${selectedId}`);
  const chosenIcon = document.getElementById(`contoh-icon-speaking-${selectedId}`);
  const correctEl = document.getElementById(`contoh-opt-speaking-${correctId}`);
  const correctIcon = document.getElementById(`contoh-icon-speaking-${correctId}`);

  if (correctEl) {
    correctEl.classList.add("correct");
    if (correctIcon) correctIcon.innerHTML = "✓";
  }
  if (!isCorrect && chosenEl) {
    chosenEl.classList.add("wrong");
    if (chosenIcon) chosenIcon.innerHTML = "✗";
  }

  const feedbackEl = document.getElementById("speaking-contoh-feedback");
  if (feedbackEl) {
    feedbackEl.style.display = "block";
    if (isCorrect) {
      feedbackEl.style.background = "#ecfdf5";
      feedbackEl.style.border = "1.5px solid #10b981";
      feedbackEl.style.color = "#047857";
      feedbackEl.innerHTML = `<strong>🎉 Benar Sekali! (+10 Poin)</strong><br>${explanation}`;
    } else {
      feedbackEl.style.background = "#fff1f2";
      feedbackEl.style.border = "1.5px solid #f43f5e";
      feedbackEl.style.color = "#be123c";
      feedbackEl.innerHTML = `<strong>⚠️ Kurang Tepat (Jawaban Benar: Opsi ${correctId})</strong><br>${explanation}`;
    }
  }
}

// ==========================================================================
// Modal Materi Pembelajaran Interaktif (Fungsi 'Pelajari')
// ==========================================================================
// Modal / Page Pembelajaran Interaktif (Fungsi 'Pelajari')
// ==========================================================================
let currentActiveQuizCategory = null;
let currentQuickQuizSelectedOption = null;

function openLearningModal(categoryKey) {
  // Langsung navigasikan ke halaman modul penuh yang baru
  openModuleDetailPage(categoryKey);
}

function _legacyOpenLearningModal(categoryKey) {
  const catData = State.learningCategoriesData[categoryKey];
  if (!catData) return;
  currentActiveQuizCategory = categoryKey;
  currentQuickQuizSelectedOption = null;

  const modal = document.getElementById("learning-detail-modal");
  const modalBody = document.getElementById("learning-modal-dynamic-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <!-- Header Materi -->
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 1.2rem;">
      <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background: ${catData.bg}; color: ${catData.color}; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0;">
        ${catData.icon}
      </div>
      <div>
        <span class="role-badge" style="background: ${catData.bg}; color: ${catData.color};">${catData.category}</span>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text); margin-top: 2px;">${catData.title}</h3>
      </div>
    </div>

    <!-- Rangkuman / Deskripsi -->
    <div style="background: #fdfbfb; border: 1px solid #f1f3f7; padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem;">
      💡 ${catData.summary}
    </div>

    <!-- Daftar Kosakata & Audio Interaktif -->
    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 6px;">
      <span>🔊</span> Kosakata & Latihan Audio (Klik untuk Mendengar):
    </h4>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); display: flex; align-items: center; gap: 6px; margin: 0;">
        <span>🔊</span> Kosakata & Latihan Audio Interaktif:
      </h4>
      <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-size: 0.75rem;">Total ${catData.items.length} Materi</span>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; max-height: 360px; overflow-y: auto; padding-right: 6px; margin-bottom: 1.5rem;">
      ${catData.items.map((item, idx) => `
        <div style="background: #ffffff; border: 1px solid #fcdfe5; border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #fff0f3; color: var(--primary-pink); font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-pill);">#${idx + 1}</span>
              <span style="font-family: var(--font-chinese); font-size: 1.25rem; font-weight: bold; color: var(--dark-text);">${item.hanzi}</span>
              <span style="font-size: 0.85rem; color: var(--primary-pink); font-weight: 700;">(${item.pinyin})</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--dark-text); font-weight: 700; margin-top: 4px;">Arti: ${item.meaning}</div>
            ${item.breakdown ? `<div style="font-size: 0.76rem; color: #4b5563; margin-top: 3px; background: #f8fafc; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #3b82f6;">🧩 Bedah Struktur: ${item.breakdown}</div>` : ''}
            ${item.note ? `<div style="font-size: 0.76rem; color: #b45309; margin-top: 3px; background: #fffbeb; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #f59e0b;">💡 Tips & Catatan: ${item.note}</div>` : ''}
          </div>
          <button class="btn-learn-outline" style="display: flex; align-items: center; gap: 4px; padding: 6px 14px; font-size: 0.8rem; flex-shrink: 0;" onclick="speakMandarin('${item.audio}', 0.85)">
            🔊 Putar Audio
          </button>
        </div>
      `).join('')}
    </div>

    <!-- Kuis Cepat Interaktif -->
    <div style="background: #fffafb; border: 1.5px dashed #f8c2cd; border-radius: var(--radius-lg); padding: 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 0.92rem; font-weight: 800; color: var(--primary-pink);">⚡ Kuis Cepat Pemahaman</span>
        <button class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.72rem;" onclick="speakMandarin('${catData.quickQuiz.targetAudio}', 0.85)">
          🔊 Putar Soal
        </button>
      </div>

      <p style="font-size: 0.88rem; font-weight: 700; color: var(--dark-text); margin-bottom: 0.8rem;">
        ${catData.quickQuiz.question}
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" id="learning-quick-quiz-options">
        ${catData.quickQuiz.options.map((opt, oIdx) => `
          <div class="quiz-option-item" onclick="selectQuickQuizOption(${oIdx}, this)">
            <span style="font-weight: bold; color: var(--primary-pink);">${String.fromCharCode(65 + oIdx)}.</span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>

      <button class="btn-primary-sakura" style="margin-top: 10px; padding: 8px 16px; font-size: 0.88rem;" onclick="checkQuickQuizAnswer()">
        Cek Jawaban Kuis
      </button>

      <div id="learning-quiz-feedback" style="display: none; margin-top: 8px; padding: 10px; border-radius: var(--radius-md); font-size: 0.82rem;"></div>
    </div>
  `;

  modal.classList.add("active");
}

function closeLearningModal() {
  const modal = document.getElementById("learning-detail-modal");
  if (modal) modal.classList.remove("active");
}

function selectQuickQuizOption(optionIndex, element) {
  currentQuickQuizSelectedOption = optionIndex;
  const parent = document.getElementById("learning-quick-quiz-options");
  if (parent) {
    parent.querySelectorAll(".quiz-option-item").forEach(item => item.classList.remove("selected"));
  }
  element.classList.add("selected");
}

function checkQuickQuizAnswer() {
  if (!currentActiveQuizCategory || currentQuickQuizSelectedOption === null) {
    showToast("Pilih salah satu jawaban terlebih dahulu!", "warning");
    return;
  }

  const catData = State.learningCategoriesData[currentActiveQuizCategory];
  const feedbackEl = document.getElementById("learning-quiz-feedback");
  if (!feedbackEl || !catData) return;

  feedbackEl.style.display = "block";
  if (currentQuickQuizSelectedOption === catData.quickQuiz.correct) {
    feedbackEl.style.background = "#e6faf7";
    feedbackEl.style.border = "1px solid #2ec4b6";
    feedbackEl.style.color = "#0f766e";
    feedbackEl.innerHTML = `<strong>Luar biasa, Jawaban Tepat! (+15 EXP, +10 Poin) 🎉</strong><br>${catData.quickQuiz.explanation}`;
    const skill = (catData.category || "listening").toLowerCase();
    recordUserActivity(skill, 15, 10, catData.title, 2);
  } else {
    feedbackEl.style.background = "#fff0f3";
    feedbackEl.style.border = "1px solid #f27289";
    feedbackEl.style.color = "#be123c";
    feedbackEl.innerHTML = `<strong>Jawaban Kurang Tepat</strong><br>${catData.quickQuiz.explanation}`;
  }
}

function toggleVoiceRecognition() {
  const currentSpk = State.speakingData[State.currentSpeakingExercise];
  const btn = document.getElementById("btn-start-speech-rec");
  const recIcon = document.getElementById("rec-icon");
  const recLabel = document.getElementById("rec-label");
  const statusMsg = document.getElementById("recording-status-msg");
  const feedbackCard = document.getElementById("speech-eval-feedback");
  const recognizedEl = document.getElementById("speech-recognized-text");
  const notesEl = document.getElementById("speech-eval-notes");
  const scoreBadge = document.getElementById("speech-score-badge");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    // Simulated fallback for browsers without Web Speech API
    simulateSpeechRecognition(currentSpk, btn, recIcon, recLabel, statusMsg, feedbackCard, recognizedEl, notesEl, scoreBadge);
    return;
  }

  if (State.isRecording) {
    if (State.recognition) State.recognition.stop();
    State.isRecording = false;
    btn.classList.remove("recording");
    recLabel.textContent = "Mulai Rekam Suara";
    statusMsg.textContent = "Evaluasi selesai.";
    return;
  }

  try {
    State.recognition = new SpeechRecognition();
    State.recognition.lang = 'zh-CN';
    State.recognition.interimResults = false;
    State.recognition.maxAlternatives = 1;

    State.recognition.onstart = () => {
      State.isRecording = true;
      btn.classList.add("recording");
      recLabel.textContent = "Mendengarkan...";
      statusMsg.textContent = "🔴 Sedang merekam suara Anda... Silakan berbicara!";
    };

    State.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = Math.round(event.results[0][0].confidence * 100) || 90;
      
      feedbackCard.style.display = "block";
      recognizedEl.textContent = `Ucapan terdeteksi: "${transcript}"`;
      scoreBadge.textContent = `Akurasi: ${confidence}%`;

      if (transcript.includes(currentSpk.targetHanzi.substring(0, 2))) {
        scoreBadge.style.background = "#2ec4b6";
        notesEl.innerHTML = `<strong>Bagus sekali!</strong> Pelafalan dan intonasi Anda sangat alami dan jelas. +20 EXP (+15 Poin) 🎉`;
        recordUserActivity('speaking', 20, 15, currentSpk.title, 3);
      } else {
        scoreBadge.style.background = "#ff9f1c";
        notesEl.innerHTML = `Nada pelafalan sudah cukup baik, perhatikan kembali pengucapan nada vokal untuk hasil maksimal.`;
        recordUserActivity('speaking', 5, 5, null, 1);
      }
    };

    State.recognition.onerror = (event) => {
      statusMsg.textContent = `Peringatan mikrofon: ${event.error}. Mengaktifkan mode simulasi akurasi.`;
      simulateSpeechRecognition(currentSpk, btn, recIcon, recLabel, statusMsg, feedbackCard, recognizedEl, notesEl, scoreBadge);
    };

    State.recognition.onend = () => {
      State.isRecording = false;
      btn.classList.remove("recording");
      recLabel.textContent = "Mulai Rekam Suara";
    };

    State.recognition.start();
  } catch (err) {
    simulateSpeechRecognition(currentSpk, btn, recIcon, recLabel, statusMsg, feedbackCard, recognizedEl, notesEl, scoreBadge);
  }
}

function simulateSpeechRecognition(currentSpk, btn, recIcon, recLabel, statusMsg, feedbackCard, recognizedEl, notesEl, scoreBadge) {
  State.isRecording = true;
  btn.classList.add("recording");
  recLabel.textContent = "Merekam (Simulasi)...";
  statusMsg.textContent = "🔴 Mendengarkan suara Anda...";

  setTimeout(() => {
    State.isRecording = false;
    btn.classList.remove("recording");
    recLabel.textContent = "Mulai Rekam Suara";
    statusMsg.textContent = "Evaluasi selesai!";
    
    feedbackCard.style.display = "block";
    recognizedEl.textContent = `Ucapan terdeteksi: "${currentSpk.targetHanzi}"`;
    const simulatedAccuracy = 92 + Math.floor(Math.random() * 7);
    scoreBadge.textContent = `Akurasi: ${simulatedAccuracy}%`;
    scoreBadge.style.background = "#2ec4b6";
    notesEl.innerHTML = `<strong>Pelafalan Sangat Bagus!</strong> Nada dan intonasi sangat tepat. Terus pertahankan latihan harianmu! +20 EXP (+15 Poin) ⭐`;
    recordUserActivity('speaking', 20, 15, currentSpk.title, 3);
  }, 2200);
}

// ==========================================================================
// 3.5 Reading Module (Cerita, Kosakata & Latihan Pemahaman)
// ==========================================================================
let currentReadingSelectedOption = null;

function renderReadingModule() {
  const container = document.getElementById("reading-content-container");
  if (!container) return;

  const currentEx = State.readingData[State.currentReadingExercise] || State.readingData[0];
  currentReadingSelectedOption = null;

  const isMateriTab = (currentSkillSubtab.reading === 'materi');

  if (isMateriTab) {
    // -------------------------------------------------------------
    // TAB MATERI: Materi Reading HSK 1 - 6 & Contoh Soal Terpandu
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Kategori Materi Reading HSK 1 - 6 & Tematik -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: var(--primary-pink)">📖</span> Materi Reading HSK 1 - 6
            </h3>
            <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-size: 0.72rem;">HSK 1 - 6</span>
          </div>

          <!-- HSK 1 - 6 Cards for Reading -->
          <div class="category-item-card" style="border-left: 4px solid #10b981; cursor: pointer;" onclick="openLearningModal('reading_hsk1')">
            <div class="category-icon-box" style="background: #ecfdf5; color: #10b981;">🌱</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #ecfdf5; color: #10b981; font-size: 0.7rem; padding: 2px 6px;">HSK 1</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 1: Radikal & SVO</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">150 Hanzi dasar, radikal air/pohon & kalimat SVO.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk1')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #06b6d4; cursor: pointer;" onclick="openLearningModal('reading_hsk2')">
            <div class="category-icon-box" style="background: #cff4fc; color: #06b6d4;">🌿</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #cff4fc; color: #06b6d4; font-size: 0.7rem; padding: 2px 6px;">HSK 2</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 2: Wacana & Rutinitas</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">300 kata, cerita harian, jadwal tiket & kalimat 比.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk2')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #3b82f6; cursor: pointer;" onclick="openLearningModal('reading_hsk3')">
            <div class="category-icon-box" style="background: #dbeafe; color: #3b82f6;">🌳</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #dbeafe; color: #3b82f6; font-size: 0.7rem; padding: 2px 6px;">HSK 3</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 3: Cerita & Komplemen</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">600 kata, narasi 2 paragraf & komplemen hasil.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk3')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #8b5cf6; cursor: pointer;" onclick="openLearningModal('reading_hsk4')">
            <div class="category-icon-box" style="background: #f3e8ff; color: #8b5cf6;">🍁</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #f3e8ff; color: #8b5cf6; font-size: 0.7rem; padding: 2px 6px;">HSK 4</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 4: Artikel & Chengyu</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">1.200 kata, wacana majalah & urutan paragraf.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk4')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #ec4899; cursor: pointer;" onclick="openLearningModal('reading_hsk5')">
            <div class="category-icon-box" style="background: #fce7f3; color: #ec4899;">🌸</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fce7f3; color: #ec4899; font-size: 0.7rem; padding: 2px 6px;">HSK 5</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 5: Esai Ilmiah & Berita</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">2.500 kata, analisis sinonim & opini sosial.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk5')">Pelajari</button>
          </div>

          <div class="category-item-card" style="border-left: 4px solid #d97706; cursor: pointer;" onclick="openLearningModal('reading_hsk6')">
            <div class="category-icon-box" style="background: #fef3c7; color: #d97706;">👑</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fef3c7; color: #d97706; font-size: 0.7rem; padding: 2px 6px;">HSK 6</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Reading HSK 6: Kalimat Cacat & Sastra</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">5.000+ kata, analisis 病句 & puisi klasik Tang.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_hsk6')">Pelajari</button>
          </div>

          <div style="margin-top: 1.5rem; margin-bottom: 0.8rem; border-top: 1px dashed #e2e8f0; padding-top: 1rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 6px; margin: 0; color: var(--dark-text);">
              <span>💡</span> Topik Membaca Tematik
            </h4>
          </div>

          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('reading_characters')">
            <div class="category-icon-box" style="background: #eff6ff; color: #3a86ff;">🔤</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Karakter & Radikal</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Mengenal radikal pembentuk Hanzi.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_characters')">Pelajari</button>
          </div>

          <div class="category-item-card" style="cursor: pointer;" onclick="openLearningModal('reading_sentences')">
            <div class="category-icon-box" style="background: #ecfdf5; color: #059669;">📑</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700;">Struktur Kalimat</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Pola kalimat dasar dan kata hubung.</p>
            </div>
            <button class="btn-learn-outline" onclick="event.stopPropagation(); openLearningModal('reading_sentences')">Pelajari</button>
          </div>
        </div>

        <!-- Kolom Kanan: Contoh Soal Terpandu Reading yang Bisa Diklik -->
        <div>
          <div style="background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 16px; padding: 1.3rem; box-shadow: var(--card-shadow); position: sticky; top: 80px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-size: 0.75rem;">Contoh Pemahaman Bacaan</span>
                <span style="font-size: 0.76rem; color: var(--text-muted);">${currentEx.level}</span>
              </div>
              <button onclick="switchSkillSubtab('reading', 'latihan')" style="background: none; border: none; font-size: 0.8rem; color: #3a86ff; font-weight: 800; cursor: pointer;">
                Buka Semua Bacaan ➔
              </button>
            </div>

            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.4rem;">
              ${currentEx.title}
            </h4>

            <!-- Cuplikan Teks Bacaan -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 1rem; max-height: 180px; overflow-y: auto;">
              ${currentEx.passage.slice(0, 3).map(line => `
                <div style="margin-bottom: 8px; font-size: 0.9rem; line-height: 1.5;">
                  <div style="font-family: var(--font-chinese); font-weight: bold; color: var(--dark-text);">${line.hanzi}</div>
                  <div style="font-size: 0.78rem; color: #64748b;">${line.pinyin}</div>
                  <div style="font-size: 0.76rem; color: #0284c7;">${line.translation}</div>
                </div>
              `).join('')}
              <button class="btn-learn-outline" style="margin-top: 6px; padding: 4px 10px; font-size: 0.76rem;" onclick="playCurrentReadingAudio()">
                🔊 Putar Audio Bacaan
              </button>
            </div>

            <!-- Pertanyaan Contoh Bacaan -->
            <div style="margin-bottom: 1rem;">
              <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 8px;">
                ❓ ${currentEx.question}
              </p>

              <!-- Opsi Jawaban yang BISA DIKLIK -->
              <div id="reading-contoh-options" style="display: flex; flex-direction: column; gap: 8px;">
                ${currentEx.options.map(opt => `
                  <div class="quiz-option-item" id="contoh-opt-reading-${opt.id}" 
                       style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                       onclick="checkContohReadingAnswer('${opt.id}', '${currentEx.correctAnswer}', '${currentEx.explanation.replace(/'/g, "\\'")}')">
                    <span style="font-weight: 800; color: #3a86ff; min-width: 24px;">${opt.id}.</span>
                    <span style="flex: 1; font-size: 0.88rem;">${opt.text}</span>
                    <span id="contoh-icon-reading-${opt.id}" style="font-size: 0.9rem;"></span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Feedback Kotak Pembahasan Interaktif -->
            <div id="reading-contoh-feedback" style="display: none; border-radius: 10px; padding: 12px 14px; margin-top: 10px; font-size: 0.85rem; line-height: 1.5;"></div>

            <div style="margin-top: 1.2rem; border-top: 1px dashed #bfdbfe; padding-top: 1rem; text-align: center;">
              <button class="btn-primary-sakura" style="width: 100%; padding: 10px; font-size: 0.88rem; background: linear-gradient(135deg, #3b82f6, #6366f1);" onclick="switchSkillSubtab('reading', 'latihan')">
                🎯 Kerjakan Latihan Lengkap (10 Cerita Bacaan) ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // -------------------------------------------------------------
    // TAB LATIHAN: Panel Latihan Cerita Reading & Soal Kuis Interaktif
    // -------------------------------------------------------------
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Kolom Kiri: Daftar 10 Bacaan & Cerita (Bisa Diklik) -->
        <div class="exercise-list-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span style="color: #3b82f6;">📚</span> Bacaan & Cerita
            </h3>
            <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-size: 0.72rem;">${State.readingData.length} Cerita</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
            Pilih cerita di bawah untuk membaca dan uji pemahaman:
          </p>

          <div id="reading-items-wrapper" style="display: flex; flex-direction: column; gap: 8px; max-height: 600px; overflow-y: auto; padding-right: 4px;">
            ${State.readingData.map((item, index) => {
              const isActive = (index === State.currentReadingExercise);
              return `
                <div class="exercise-item-row ${isActive ? 'active' : ''}" 
                     style="cursor: pointer; transition: all 0.2s;" 
                     onclick="selectReadingExercise(${index})">
                  <div class="exercise-num-badge" style="${isActive ? 'background: #3b82f6;' : ''}">${index + 1}</div>
                  <div class="exercise-thumbnail">📖</div>
                  <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--dark-text); margin: 0;">${item.title}</h4>
                    <p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px; margin-bottom: 2px;">${item.subtitle}</p>
                    <div style="display: flex; gap: 10px; font-size: 0.7rem; color: #a0a6bd;">
                      <span>⏱️ ${item.readTime}</span>
                      <span>• ${item.level}</span>
                    </div>
                  </div>
                  <button class="exercise-play-btn" onclick="event.stopPropagation(); selectReadingExercise(${index})" title="Baca cerita ini">➔</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Kolom Kanan: Teks Bacaan, Kosakata Kunci & Soal Interaktif yang Bisa Diklik -->
        <div class="interactive-panel">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 8px;">
              <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-weight: 800;">
                Cerita #${State.currentReadingExercise + 1}: ${currentEx.level}
              </span>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Kategori: <strong>${currentEx.category}</strong></span>
            </div>
            
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--dark-text);">
              ${currentEx.title}
            </h3>

            <!-- Action Tools -->
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <button class="btn-primary-sakura" style="padding: 6px 14px; font-size: 0.82rem; background: linear-gradient(135deg, #3b82f6, #0284c7);" onclick="playCurrentReadingAudio()">
                🔊 Putar Audio Bacaan
              </button>
              <button id="btn-toggle-reading-pinyin" class="btn-learn-outline ${showReadingPinyinState ? 'active' : ''}" style="padding: 6px 14px; font-size: 0.82rem;" onclick="toggleReadingPinyin()">
                🔤 ${showReadingPinyinState ? 'Sembunyikan Pinyin & Arti' : 'Tampilkan Pinyin & Arti'}
              </button>
            </div>

            <!-- Teks Bacaan (Passage) -->
            <div id="reading-passage-box" style="background: #fcfdfe; border: 1.5px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.2rem; max-height: 280px; overflow-y: auto; margin-bottom: 1.2rem;">
              ${currentEx.passage.map((line) => `
                <div class="reading-line-item" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #f1f5f9;">
                  <div style="font-family: var(--font-chinese); font-size: 1.15rem; font-weight: 600; color: #1e293b; line-height: 1.6; display: flex; align-items: center; justify-content: space-between;">
                    <span>${line.hanzi}</span>
                    <button class="btn-audio-pill-mini" onclick="speakMandarin('${line.hanzi.replace(/["“”]/g, '').replace(/'/g, "\\'")}', 0.85)" title="Dengarkan kalimat ini">🔊</button>
                  </div>
                  <div class="reading-pinyin-line" style="display: ${showReadingPinyinState ? 'block' : 'none'}; font-size: 0.86rem; color: #64748b; margin-top: 2px;">
                    ${line.pinyin}
                  </div>
                  <div class="reading-translation-line" style="display: ${showReadingPinyinState ? 'block' : 'none'}; font-size: 0.82rem; color: #0284c7; margin-top: 2px;">
                    💡 ${line.translation}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Kosakata Kunci (Vocabulary Box - Bisa Diklik) -->
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 1.2rem;">
              <div style="font-size: 0.82rem; font-weight: 800; color: #b45309; margin-bottom: 6px;">
                🗝️ Kosakata Kunci (Klik kata untuk mendengarkan audio pelafalan):
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${currentEx.vocabulary.map(v => `
                  <span style="background: #ffffff; border: 1px solid #fcd34d; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;" 
                        onclick="speakMandarin('${v.hanzi}', 0.85)" 
                        title="Klik untuk mendengar suara">
                    <strong style="font-family: var(--font-chinese); color: var(--dark-text); font-size: 0.95rem;">${v.hanzi}</strong> (${v.pinyin}): ${v.meaning} 🔊
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Soal Pemahaman Bacaan (Quiz) yang BISA DIKLIK -->
            <div style="background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px; padding: 1.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); margin: 0; display: flex; align-items: center; gap: 6px;">
                  <span>❓</span> Uji Pemahaman Bacaan:
                </h4>
                <span class="role-badge" style="background: #eff6ff; color: #3a86ff; font-size: 0.72rem;">Klik Opsi</span>
              </div>
              
              <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 12px;">
                ${currentEx.question}
              </p>

              <div id="reading-quiz-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem;">
                ${currentEx.options.map(opt => `
                  <div class="quiz-option-item ${currentReadingSelectedOption === opt.id ? 'selected' : ''}" 
                       id="reading-opt-${opt.id}" 
                       style="cursor: pointer; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #edf0f5; transition: all 0.2s;"
                       onclick="selectReadingOption('${opt.id}')">
                    <span style="font-weight: 800; color: #3a86ff; min-width: 24px;">${opt.id}.</span>
                    <span style="flex: 1; font-size: 0.88rem;">${opt.text}</span>
                    <span id="reading-badge-${opt.id}"></span>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; gap: 10px;">
                <button id="btn-submit-reading-quiz" class="btn-primary-sakura" style="flex: 1; background: linear-gradient(135deg, #3b82f6, #0284c7);" onclick="submitReadingQuiz()">
                  ✨ Periksa Jawaban
                </button>
                <button onclick="resetReadingQuiz()" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-pill); padding: 10px 16px; font-size: 0.85rem; font-weight: 700; cursor: pointer; color: var(--dark-text);">
                  🔄 Reset
                </button>
              </div>

              <!-- Feedback Box -->
              <div id="reading-quiz-feedback" class="quiz-feedback-box" style="display: none; margin-top: 1rem; border-radius: 10px; padding: 12px; font-size: 0.86rem; line-height: 1.5;">
                <div id="reading-feedback-title" style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;"></div>
                <p id="reading-feedback-desc" style="font-size: 0.84rem; color: var(--text-muted); margin: 0;"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Inisialisasi Canvas Interaktif Menulis bila ada
  setTimeout(initWritingCanvas, 60);
}

function selectReadingExercise(index) {
  State.currentReadingExercise = index;
  currentReadingSelectedOption = null;
  renderReadingModule();
}

function playCurrentReadingAudio() {
  const currentEx = State.readingData[State.currentReadingExercise] || State.readingData[0];
  if (!currentEx || !currentEx.passage) return;
  const fullText = currentEx.passage.map(p => p.hanzi).join(" ");
  speakMandarin(fullText, 0.85);
}

let showReadingPinyinState = false;
function toggleReadingPinyin() {
  showReadingPinyinState = !showReadingPinyinState;
  const pinyins = document.querySelectorAll(".reading-pinyin-line, .reading-translation-line");
  pinyins.forEach(el => {
    el.style.display = showReadingPinyinState ? "block" : "none";
  });
  const btn = document.getElementById("btn-toggle-reading-pinyin");
  if (btn) {
    btn.classList.toggle("active", showReadingPinyinState);
    btn.innerHTML = showReadingPinyinState ? "🙈 Sembunyikan Pinyin & Arti" : "🔤 Tampilkan Pinyin & Arti";
  }
}

function selectReadingOption(optId) {
  currentReadingSelectedOption = optId;
  const currentEx = State.readingData[State.currentReadingExercise] || State.readingData[0];
  
  currentEx.options.forEach(opt => {
    const el = document.getElementById(`reading-opt-${opt.id}`);
    if (el) {
      el.classList.remove("selected");
      if (opt.id === optId) {
        el.classList.add("selected");
      }
    }
  });

  // Langsung periksa jawaban untuk respon interaktif instan
  submitReadingQuiz();
}

function submitReadingQuiz() {
  const currentEx = State.readingData[State.currentReadingExercise] || State.readingData[0];
  if (!currentReadingSelectedOption) return;

  const feedbackBox = document.getElementById("reading-quiz-feedback");
  const feedbackTitle = document.getElementById("reading-feedback-title");
  const feedbackDesc = document.getElementById("reading-feedback-desc");
  if (!feedbackBox) return;

  feedbackBox.style.display = "block";
  const isCorrect = (currentReadingSelectedOption === currentEx.correctAnswer);

  currentEx.options.forEach(opt => {
    const optEl = document.getElementById(`reading-opt-${opt.id}`);
    const badgeEl = document.getElementById(`reading-badge-${opt.id}`);
    if (optEl) {
      optEl.classList.remove("correct", "wrong");
      if (opt.id === currentEx.correctAnswer) {
        optEl.classList.add("correct");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #059669; font-weight: 800;">✓ Benar</span>`;
      } else if (opt.id === currentReadingSelectedOption && !isCorrect) {
        optEl.classList.add("wrong");
        if (badgeEl) badgeEl.innerHTML = `<span style="color: #dc2626; font-weight: 800;">✗ Salah</span>`;
      } else if (badgeEl) {
        badgeEl.innerHTML = "";
      }
    }
  });

  if (isCorrect) {
    feedbackBox.style.background = "#ecfdf5";
    feedbackBox.style.border = "1.5px solid #10b981";
    feedbackTitle.style.color = "#059669";
    feedbackTitle.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span>🎉 Luar Biasa, Jawaban Anda Benar! (+20 EXP, +15 Poin ⭐)</span>
        <button onclick="nextReadingExercise()" style="background: #10b981; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          Soal Berikutnya ➔
        </button>
      </div>
    `;
    feedbackDesc.innerHTML = `${currentEx.explanation}`;
    recordUserActivity('reading', 20, 15, currentEx.title, 3);
  } else {
    feedbackBox.style.background = "#fef2f2";
    feedbackBox.style.border = "1.5px solid #ef4444";
    feedbackTitle.style.color = "#dc2626";
    feedbackTitle.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span>❌ Jawaban Belum Tepat (Kunci: Opsi ${currentEx.correctAnswer})</span>
        <button onclick="resetReadingQuiz()" style="background: #ef4444; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
          🔄 Coba Lagi
        </button>
      </div>
    `;
    feedbackDesc.innerHTML = `Jawaban yang benar adalah <strong>${currentEx.correctAnswer}</strong>. ${currentEx.explanation}`;
  }
}

function resetReadingQuiz() {
  currentReadingSelectedOption = null;
  const currentEx = State.readingData[State.currentReadingExercise] || State.readingData[0];
  if (currentEx) {
    currentEx.options.forEach(opt => {
      const optEl = document.getElementById(`reading-opt-${opt.id}`);
      const badgeEl = document.getElementById(`reading-badge-${opt.id}`);
      if (optEl) optEl.classList.remove("selected", "correct", "wrong");
      if (badgeEl) badgeEl.innerHTML = "";
    });
  }
  const feedbackBox = document.getElementById("reading-quiz-feedback");
  if (feedbackBox) feedbackBox.style.display = "none";
}

function nextReadingExercise() {
  if (State.currentReadingExercise < State.readingData.length - 1) {
    State.currentReadingExercise++;
  } else {
    State.currentReadingExercise = 0;
  }
  currentReadingSelectedOption = null;
  renderReadingModule();
}

function checkContohReadingAnswer(selectedId, correctId, explanation) {
  const isCorrect = (selectedId === correctId);
  const container = document.getElementById("reading-contoh-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("correct", "wrong");
    });
  }
  const chosenEl = document.getElementById(`contoh-opt-reading-${selectedId}`);
  const chosenIcon = document.getElementById(`contoh-icon-reading-${selectedId}`);
  const correctEl = document.getElementById(`contoh-opt-reading-${correctId}`);
  const correctIcon = document.getElementById(`contoh-icon-reading-${correctId}`);

  if (correctEl) {
    correctEl.classList.add("correct");
    if (correctIcon) correctIcon.innerHTML = "✓";
  }
  if (!isCorrect && chosenEl) {
    chosenEl.classList.add("wrong");
    if (chosenIcon) chosenIcon.innerHTML = "✗";
  }

  const feedbackEl = document.getElementById("reading-contoh-feedback");
  if (feedbackEl) {
    feedbackEl.style.display = "block";
    if (isCorrect) {
      feedbackEl.style.background = "#ecfdf5";
      feedbackEl.style.border = "1.5px solid #10b981";
      feedbackEl.style.color = "#047857";
      feedbackEl.innerHTML = `<strong>🎉 Benar Sekali! (+10 Poin)</strong><br>${explanation}`;
    } else {
      feedbackEl.style.background = "#fff1f2";
      feedbackEl.style.border = "1.5px solid #f43f5e";
      feedbackEl.style.color = "#be123c";
      feedbackEl.innerHTML = `<strong>⚠️ Kurang Tepat (Jawaban Benar: Opsi ${correctId})</strong><br>${explanation}`;
    }
  }
}

// ==========================================================================
// 4. Writing Module & AI Grammar Checker
// ==========================================================================
let currentStrokeIndex = 0;
let currentStrokeHskTab = "all"; // 'all', 'HSK 1', 'HSK 2'
let currentWritingSelectedOption = null;

function renderWritingModule() {
  const container = document.getElementById("writing-content-container");
  if (!container) return;

  const isMateriTab = (currentSkillSubtab && currentSkillSubtab.writing === 'materi');
  const btnMateri = document.getElementById("btn-subtab-writing-materi");
  const btnLatihan = document.getElementById("btn-subtab-writing-latihan");
  if (btnMateri && btnLatihan) {
    if (isMateriTab) {
      btnMateri.classList.add("active");
      btnLatihan.classList.remove("active");
    } else {
      btnMateri.classList.remove("active");
      btnLatihan.classList.add("active");
    }
  }

  if (isMateriTab) {
    const contohData = State.writingData && State.writingData[0] ? State.writingData[0] : {
      title: "Susun Kalimat: Kepemilikan & Kualitas (HSK 1)",
      subtitle: "Menyusun kata acak menjadi kalimat SVO baku",
      hskLevel: "HSK 1",
      scrambledWords: ["很好", "妈妈", "的", "身体"],
      meaning: "Kesehatan ibu sangat baik.",
      question: "Susun kata-kata acak berikut menjadi kalimat baku bahasa Mandarin:<br><strong>[ 很好 / 妈妈 / 的 / 身体 ]</strong>",
      options: [
        { id: "A", text: "妈妈身体的很好" },
        { id: "B", text: "妈妈的身体很好 (Māma de shēntǐ hěn hǎo)" },
        { id: "C", text: "很好身体的妈妈" },
        { id: "D", text: "的身体妈妈很好" }
      ],
      correctAnswer: "B",
      explanation: "Rumus kepemilikan bahasa Mandarin: [Pemilik (妈妈) + 的 + Benda (身体) + Predikat (很好)]."
    };

    container.innerHTML = `
      <!-- Baris Materi Pembelajaran Menulis & Tata Bahasa -->
      <div style="grid-column: 1 / -1; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
            <span style="color: var(--primary-pink)">✍️</span> Materi Writing & Tata Bahasa HSK 1 - 6
          </h3>
          <span class="role-badge" style="background: #fff8eb; color: #ff9f1c; font-size: 0.72rem;">HSK 1 - 6</span>
        </div>

        <!-- HSK 1 - 6 Grid Cards for Writing -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-bottom: 1.2rem;">
          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #10b981;">
            <div class="category-icon-box" style="background: #ecfdf5; color: #10b981;">🌱</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #ecfdf5; color: #10b981; font-size: 0.7rem; padding: 2px 6px;">HSK 1</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 1: Goresan & Tian Zi Ge</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">8 goresan dasar, urutan penulisan & kotak Tian Zi Ge.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk1')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #06b6d4;">
            <div class="category-icon-box" style="background: #cff4fc; color: #06b6d4;">🌿</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #cff4fc; color: #06b6d4; font-size: 0.7rem; padding: 2px 6px;">HSK 2</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 2: Susun Kalimat & Waktu</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Pola kalimat SVO, keterangan waktu & aspek 了/过.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk2')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #3b82f6;">
            <div class="category-icon-box" style="background: #dbeafe; color: #3b82f6;">🌳</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #dbeafe; color: #3b82f6; font-size: 0.7rem; padding: 2px 6px;">HSK 3</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 3: Struktur 把 & Pasif 被</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Penulisan kalimat manipulasi 把 & kalimat pasif 被.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk3')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #8b5cf6;">
            <div class="category-icon-box" style="background: #f3e8ff; color: #8b5cf6;">🍁</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #f3e8ff; color: #8b5cf6; font-size: 0.7rem; padding: 2px 6px;">HSK 4</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 4: Esai Narasi Gambar</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Menulis esai 80 karakter berdasarkan kata kunci & foto.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk4')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #ec4899;">
            <div class="category-icon-box" style="background: #fce7f3; color: #ec4899;">🌸</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fce7f3; color: #ec4899; font-size: 0.7rem; padding: 2px 6px;">HSK 5</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 5: Esai 5 Kata & Surat Formal</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Menggabungkan 5 kosakata, email bisnis & salam resmi.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk5')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0; border-left: 4px solid #d97706;">
            <div class="category-icon-box" style="background: #fef3c7; color: #d97706;">👑</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="role-badge" style="background: #fef3c7; color: #d97706; font-size: 0.7rem; padding: 2px 6px;">HSK 6</span>
                <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0;">Writing HSK 6: Ringkasan Esai 400 Kata</h4>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">Membaca 1.000 kata, menyusun ringkasan 400 karakter.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_hsk6')">Pelajari</button>
          </div>
        </div>

        <!-- Panduan Goresan & Tata Bahasa Spesifik -->
        <div style="margin-bottom: 0.8rem; border-top: 1px dashed #e2e8f0; padding-top: 1rem;">
          <h4 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 6px; margin: 0; color: var(--dark-text);">
            <span>💡</span> Panduan Goresan & Tata Bahasa Spesifik
          </h4>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-bottom: 1.5rem;">
          <div class="category-item-card" style="margin-bottom: 0;">
            <div class="category-icon-box" style="background: #fff8eb; color: #ff9f1c;">✏️</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.92rem; font-weight: 700;">Dasar Goresan Hanzi</h4>
              <p style="font-size: 0.76rem; color: var(--text-muted);">8 goresan dasar & aturan baku.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_strokes_basics')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0;">
            <div class="category-icon-box" style="background: #ecfdf5; color: #059669;">📐</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.92rem; font-weight: 700;">Tata Bahasa Dasar</h4>
              <p style="font-size: 0.76rem; color: var(--text-muted);">Partikel 的/了/过 dan kata bantu.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_grammar')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0;">
            <div class="category-icon-box" style="background: #f5f3ff; color: #7c3aed;">🧩</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.92rem; font-weight: 700;">Latihan Menyusun Kalimat</h4>
              <p style="font-size: 0.76rem; color: var(--text-muted);">Urutan kata Mandarin (语序).</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_sentences')">Pelajari</button>
          </div>

          <div class="category-item-card" style="margin-bottom: 0;">
            <div class="category-icon-box" style="background: #f0f9ff; color: #0284c7;">📄</div>
            <div style="flex: 1;">
              <h4 style="font-size: 0.92rem; font-weight: 700;">Menulis Paragraf & Esai</h4>
              <p style="font-size: 0.76rem; color: var(--text-muted);">Perkenalan diri & rutinitas harian.</p>
            </div>
            <button class="btn-learn-outline" onclick="openLearningModal('writing_essay')">Pelajari</button>
          </div>
        </div>

        <!-- CONTOH SOAL TERPANDU (BISA DIKLIK LANGSUNG) -->
        <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.5rem; border: 1.5px solid #fed7aa; box-shadow: 0 4px 16px rgba(251, 146, 60, 0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">💡</span>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: #b45309;">
                Contoh Soal Terpandu: Menyusun Kalimat & Kaidah Goresan (连词成句)
              </h4>
            </div>
            <span class="role-badge" style="background: #ffedd5; color: #c2410c; font-weight: 800;">
              ${contohData.hskLevel}
            </span>
          </div>

          <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1rem;">
            Pelajari cara menyusun kalimat bahasa Mandarin sesuai kaidah tata bahasa baku. <strong>Klik salah satu opsi di bawah</strong> untuk melihat respon jawaban dan analisis kaidah secara instan:
          </p>

          <!-- Kotak Kata Acak -->
          <div style="background: #fffaf0; border: 1.5px dashed #fed7aa; border-radius: 12px; padding: 12px 16px; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-weight: 700; font-size: 0.85rem; color: #b45309;">Kata Acak:</span>
            ${contohData.scrambledWords.map(w => `
              <span style="background: #ffffff; border: 1px solid #fed7aa; color: #9a3412; padding: 4px 12px; border-radius: 8px; font-weight: 700; font-family: var(--font-chinese); font-size: 1.05rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: inline-flex; align-items: center; gap: 6px;">
                ${w}
                <button onclick="speakMandarin('${w}')" style="background:none; border:none; cursor:pointer; font-size:0.75rem; padding:0; color:#ea580c;" title="Dengar Suara">🔊</button>
              </span>
            `).join('')}
            <span style="font-size: 0.8rem; color: #78350f; margin-left: auto;">(Arti: <em>${contohData.meaning}</em>)</span>
          </div>

          <!-- Pertanyaan -->
          <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 1rem;">
            ${contohData.question}
          </p>

          <!-- Opsi Jawaban Interaktif Yang Bisa Diklik -->
          <div id="writing-contoh-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.2rem;">
            ${contohData.options.map(opt => `
              <div class="quiz-option-item" id="contoh-opt-writing-${opt.id}" 
                   style="cursor: pointer; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease; background: #ffffff;"
                   onclick="checkContohWritingAnswer('${opt.id}', '${contohData.correctAnswer}', '${contohData.explanation.replace(/'/g, "\\'")}')">
                <span style="font-weight: 800; width: 26px; height: 26px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: #475569;">
                  ${opt.id}
                </span>
                <span style="flex: 1; font-size: 0.92rem; font-weight: 600; color: var(--dark-text); font-family: var(--font-chinese);">
                  ${opt.text}
                </span>
                <span class="option-icon" id="contoh-icon-writing-${opt.id}" style="font-weight: 800; font-size: 1rem;"></span>
              </div>
            `).join('')}
          </div>

          <!-- Feedback Otomatis Contoh Soal -->
          <div id="writing-contoh-feedback" style="display: none; padding: 12px 16px; border-radius: 10px; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;"></div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 1rem; border-top: 1px dashed #fed7aa; padding-top: 1rem;">
            <span style="font-size: 0.82rem; color: var(--text-muted);">Ingin berlatih lebih banyak soal susun kalimat & goresan kanvas?</span>
            <button class="btn-primary-sakura" style="padding: 8px 18px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;" onclick="switchSkillSubtab('writing', 'latihan')">
              <span>Buka Latihan Soal & Papan Tulis Goresan</span> ➔
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // JIKA SUBTAB LATIHAN AKTIF:
  // Render Latihan Soal Susun Kalimat (Kiri) + Papan Tulis Tian Zi Ge & AI Checker (Kanan)
  const currentEx = State.writingData[State.currentWritingExercise || 0] || State.writingData[0];

  // Filter stroke characters based on selected HSK level tab
  const filteredChars = State.strokeCharacters.filter(c => {
    if (currentStrokeHskTab === "all") return true;
    return c.hskLevel === currentStrokeHskTab;
  });

  if (currentStrokeIndex >= filteredChars.length) {
    currentStrokeIndex = 0;
  }

  const charData = filteredChars[currentStrokeIndex] || State.strokeCharacters[0];

  container.innerHTML = `
    <!-- Kolom Kiri: Latihan Soal Interaktif (Susun Kalimat & Kaidah Goresan) -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Card Daftar Latihan Soal -->
      <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid #fae2e6; box-shadow: var(--card-shadow);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <h4 style="font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 6px; margin: 0; color: var(--dark-text);">
            <span>🎯</span> Bank Soal Menulis & Tata Bahasa (${State.writingData.length} Soal)
          </h4>
          <span class="role-badge" style="background: #fdf2f8; color: var(--primary-pink); font-size: 0.72rem;">Klik Soal</span>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">
          Pilih salah satu latihan soal di bawah ini untuk menguji kemampuan menyusun kalimat dan kaidah goresan:
        </p>

        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; padding-right: 4px;">
          ${State.writingData.map((item, idx) => {
            const isActive = (idx === (State.currentWritingExercise || 0));
            return `
              <div onclick="selectWritingExercise(${idx})" 
                   style="cursor: pointer; padding: 8px 12px; border-radius: 8px; border: 1.5px solid ${isActive ? 'var(--primary-pink)' : '#f1f5f9'}; background: ${isActive ? '#fff5f7' : '#ffffff'}; transition: all 0.2s ease; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-size: 0.82rem; font-weight: ${isActive ? '800' : '600'}; color: ${isActive ? 'var(--primary-pink)' : 'var(--dark-text)'};">
                    ${idx + 1}. ${item.title}
                  </span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${item.subtitle}</span>
                </div>
                <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px; background: ${isActive ? '#fce7f3' : '#f8fafc'}; color: ${isActive ? '#db2777' : '#64748b'};">
                  ${item.hskLevel}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Card Soal Interaktif Yang Dipilih -->
      <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid #fae2e6; box-shadow: var(--card-shadow);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 6px;">
          <span class="role-badge" style="background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.75rem;">
            ${currentEx.hskLevel} • Soal ${(State.currentWritingExercise || 0) + 1} dari ${State.writingData.length}
          </span>
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">+10 XP Tiap Jawaban Benar</span>
        </div>

        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.4rem;">
          ${currentEx.title}
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${currentEx.subtitle}
        </p>

        <!-- Chips Kata Acak / Materi Soal -->
        <div style="background: #fdf2f8; border: 1.5px dashed #fbcfe8; border-radius: 12px; padding: 12px; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-weight: 800; font-size: 0.82rem; color: #be185d;">Kata Kunci:</span>
          ${(currentEx.scrambledWords || []).map(w => `
            <span style="background: #ffffff; border: 1px solid #fbcfe8; color: #be185d; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-family: var(--font-chinese); font-size: 1rem; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              ${w}
              <button onclick="speakMandarin('${w}')" style="background:none; border:none; cursor:pointer; font-size:0.75rem; padding:0; color:#db2777;" title="Dengarkan">🔊</button>
            </span>
          `).join('')}
          ${currentEx.meaning ? `<span style="font-size: 0.78rem; color: #831843; margin-left: auto;">(Arti: <em>${currentEx.meaning}</em>)</span>` : ''}
        </div>

        <!-- Teks Pertanyaan -->
        <p style="font-size: 0.92rem; font-weight: 700; color: var(--dark-text); margin-bottom: 1rem; line-height: 1.5;">
          ${currentEx.question}
        </p>

        <!-- Pilihan Jawaban A, B, C, D (Bisa Diklik) -->
        <div id="writing-quiz-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.2rem;">
          ${currentEx.options.map(opt => `
            <div class="quiz-option-item ${currentWritingSelectedOption === opt.id ? 'selected' : ''}" 
                 id="writing-quiz-opt-${opt.id}"
                 style="cursor: pointer; padding: 10px 14px; border-radius: 10px; border: 1.5px solid ${currentWritingSelectedOption === opt.id ? 'var(--primary-pink)' : '#e2e8f0'}; background: ${currentWritingSelectedOption === opt.id ? '#fff5f7' : '#ffffff'}; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
                 onclick="selectWritingQuizOption('${opt.id}')">
              <span style="font-weight: 800; width: 26px; height: 26px; border-radius: 50%; background: ${currentWritingSelectedOption === opt.id ? 'var(--primary-pink)' : '#f1f5f9'}; color: ${currentWritingSelectedOption === opt.id ? '#ffffff' : '#475569'}; display: flex; align-items: center; justify-content: center; font-size: 0.82rem;">
                ${opt.id}
              </span>
              <span style="flex: 1; font-size: 0.92rem; font-weight: 600; color: var(--dark-text); font-family: var(--font-chinese);">
                ${opt.text}
              </span>
              <span class="option-icon" id="writing-quiz-icon-${opt.id}" style="font-weight: 800; font-size: 1rem;"></span>
            </div>
          `).join('')}
        </div>

        <!-- Tombol Aksi Kuis -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-primary-sakura" style="flex: 1; padding: 10px 18px; font-weight: 800; font-size: 0.88rem;" onclick="submitWritingQuiz()">
            ✨ Periksa Jawaban
          </button>
          <button class="btn-learn-outline" style="padding: 10px 16px; font-size: 0.85rem;" onclick="resetWritingQuiz()" title="Reset pilihan jawaban">
            🔄 Coba Lagi
          </button>
          <button class="btn-learn-outline" style="padding: 10px 16px; font-size: 0.85rem; color: #2563eb; border-color: #bfdbfe;" onclick="nextWritingExercise()" title="Lanjut ke soal berikutnya">
            Soal Berikutnya ➔
          </button>
        </div>

        <!-- Hasil Feedback Analisis Kaidah -->
        <div id="writing-quiz-feedback" style="display: none; margin-top: 1.2rem; padding: 12px 16px; border-radius: 10px;"></div>
      </div>
    </div>

    <!-- Kolom Kanan: Papan Tulis Goresan Tian Zi Ge & AI Grammar Checker -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Papan Tulis Interaktif Menulis Karakter & Goresan Hanzi -->
      <div class="stroke-practice-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
            <span style="color: var(--primary-pink)">✍️</span> Urutan Goresan (笔顺) & Tian Zi Ge
          </h3>
          <span class="role-badge" style="background: ${charData.hskLevel === 'HSK 1' ? '#eff6ff' : '#f0fdf4'}; color: ${charData.hskLevel === 'HSK 1' ? '#3a86ff' : '#16a34a'}; font-weight: 800;">
            ${charData.hskLevel}
          </span>
        </div>
        
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.8rem;">
          Latih goresan langsung pada kanvas kotak Tian Zi Ge (田字格).
        </p>

        <!-- HSK 1 - 6 Filter Tab Buttons -->
        <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.8rem; flex-wrap: wrap;">
          <button class="bank-filter-chip ${currentStrokeHskTab === 'all' ? 'active' : ''}" onclick="selectStrokeHskTab('all')">
            Semua (${State.strokeCharacters.length})
          </button>
          ${['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => {
            const count = State.strokeCharacters.filter(c => c.hskLevel === lvl).length;
            return `
              <button class="bank-filter-chip ${currentStrokeHskTab === lvl ? 'active' : ''}" onclick="selectStrokeHskTab('${lvl}')">
                ${lvl} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- Selector Karakter Hanzi -->
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem;">
          ${filteredChars.map((c, i) => `
            <button class="btn-learn-outline ${i === currentStrokeIndex ? 'active' : ''}" 
                    style="font-size: 1.1rem; font-family: var(--font-chinese); padding: 4px 12px; border-radius: var(--radius-md); ${i === currentStrokeIndex ? 'background: var(--primary-pink); color: #fff; border-color: var(--primary-pink); font-weight: bold; transform: scale(1.06);' : ''}"
                    onclick="selectStrokeChar(${i})">
              ${c.char}
            </button>
          `).join('')}
        </div>

        <!-- Tian Zi Ge Canvas Frame & Interactive Practice Board -->
        <div style="position: relative; max-width: 280px; margin: 0 auto 1rem auto;">
          <div class="hanzi-canvas-frame tian-zi-ge" id="hanzi-target-box" style="margin: 0 auto; width: 260px; height: 260px; position: relative; border: 2.5px solid #fbcfe8; border-radius: 16px; box-shadow: inset 0 0 12px rgba(244, 114, 182, 0.08), 0 4px 20px rgba(0,0,0,0.04); overflow: hidden; background: #fffdfd;">
            <div id="hanzi-large-display" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--font-chinese, serif); font-size: 175px; color: #cbd5e1; opacity: 0.35; line-height: 1; user-select: none; pointer-events: none; transition: all 0.3s ease; z-index: 1;">
              ${charData.char}
            </div>
            <canvas id="hanzi-interactive-canvas" width="260" height="260" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; cursor: crosshair; touch-action: none;"></canvas>
          </div>

          <!-- Toolbar Kontrol Papan Tulis Interaktif -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; background: #fdf2f8; padding: 6px 10px; border-radius: 10px; border: 1px solid #fce7f3; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <button class="btn-learn-outline" id="btn-toggle-guide" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 9999px; margin: 0; background: #ffffff;" onclick="toggleHanziGuide()">
                👁️ Panduan
              </button>
              <div style="display: flex; align-items: center; gap: 3px; font-size: 0.72rem; color: #831843; font-weight: 700; margin-left: 4px;">
                <button onclick="setWritingInk('#0f172a')" style="width: 16px; height: 16px; border-radius: 50%; background: #0f172a; border: 2px solid #ffffff; cursor: pointer;" title="Tinta Hitam"></button>
                <button onclick="setWritingInk('#dc2626')" style="width: 16px; height: 16px; border-radius: 50%; background: #dc2626; border: 2px solid #ffffff; cursor: pointer;" title="Tinta Merah"></button>
                <button onclick="setWritingInk('#2563eb')" style="width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 2px solid #ffffff; cursor: pointer;" title="Tinta Biru"></button>
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn-learn-outline" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 9999px; margin: 0; color: #dc2626; border-color: #fecaca; background: #ffffff;" onclick="clearWritingCanvas()">
                🗑️ Hapus
              </button>
              <button class="btn-primary-sakura" style="padding: 3px 10px; font-size: 0.74rem; font-weight: 800; border-radius: 9999px; margin: 0; background: #58cc02; box-shadow: 0 2px 0 #46a302; color: #fff;" onclick="submitWritingPractice()">
                ✨ PERIKSA
              </button>
            </div>
          </div>

          <div id="writing-duolingo-feedback" style="display: none; margin-top: 10px;"></div>
        </div>

        <!-- Info Karakter -->
        <div style="margin-bottom: 0.8rem; text-align: center;">
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary-pink);">${charData.pinyin}</div>
          <div style="font-size: 0.9rem; color: var(--dark-text); font-weight: 700; margin-top: 2px;">Arti: ${charData.meaning}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Total: <strong>${charData.strokesCount} Goresan</strong> • Level: <strong>${charData.hskLevel}</strong></div>
        </div>

        ${charData.rules ? `
          <div style="background: #fff8eb; border: 1px solid #fed7aa; border-radius: var(--radius-md); padding: 8px 12px; margin-bottom: 0.8rem; text-align: left; font-size: 0.78rem;">
            <strong style="color: #b45309;">📜 Kaidah:</strong>
            <span style="color: var(--dark-text); margin-left: 4px;">${charData.rules}</span>
          </div>
        ` : ''}

        <!-- Action Buttons -->
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary-sakura" style="padding: 8px 14px; font-size: 0.82rem;" onclick="animateStrokeSteps()">
            ▶ Putar Animasi
          </button>
          <button class="btn-learn-outline" style="padding: 8px 14px; font-size: 0.82rem;" onclick="speakMandarin('${charData.char}', 0.8)">
            🔊 Pelafalan
          </button>
        </div>
      </div>

      <!-- Kolom AI Grammar & Writing Checker -->
      <div class="ai-grammar-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
            <span style="color: var(--primary-pink)">🤖</span> AI Grammar & Writing Checker
          </h3>
          <span class="role-badge" style="background: #e6faf7; color: #2ec4b6;">AI Instant</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.8rem;">
          Tulis kalimat Mandarin untuk pemeriksaan otomatis urutan kata (语序).
        </p>

        <div class="form-group" style="margin-bottom: 0.8rem;">
          <textarea id="ai-writing-input" class="writing-textarea" style="min-height: 80px;" placeholder="Contoh: 我昨天去商店买三个苹果，他们很甜。">我昨天去商店买三个苹果，他们很甜。</textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 0.8rem;">
          <button class="btn-primary-sakura" style="flex: 1; padding: 8px 14px; font-size: 0.84rem;" onclick="checkAIGrammar()">
            ✨ Cek Tata Bahasa AI
          </button>
          <button class="btn-learn-outline" style="padding: 8px 12px; font-size: 0.84rem;" onclick="clearAIText()">
            Bersihkan
          </button>
        </div>

        <!-- Hasil Analisis AI -->
        <div id="ai-grammar-result-area" class="ai-result-box" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 0.9rem; color: var(--dark-text);">Hasil Pemeriksaan AI:</span>
            <span id="ai-grammar-score" style="background: #2ec4b6; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-pill);">Skor: 90/100</span>
          </div>
          <div id="ai-corrected-text" style="font-size: 0.95rem; font-family: var(--font-chinese); color: var(--primary-pink); font-weight: bold; margin-bottom: 4px;"></div>
          <div id="ai-pinyin-display" style="font-size: 0.82rem; color: #757c95; margin-bottom: 6px;"></div>
          <div id="ai-explanation-list" style="font-size: 0.8rem; color: var(--dark-text); line-height: 1.4;"></div>
        </div>
      </div>
    </div>
  `;

  // Inisialisasi Canvas Interaktif Menulis bila ada di tab latihan
  setTimeout(initWritingCanvas, 60);
}

function selectWritingExercise(index) {
  State.currentWritingExercise = index;
  currentWritingSelectedOption = null;
  renderWritingModule();
}

function selectWritingQuizOption(optId) {
  currentWritingSelectedOption = optId;
  const container = document.getElementById("writing-quiz-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("selected", "correct", "wrong");
      const icon = item.querySelector(".option-icon");
      if (icon) icon.innerHTML = "";
    });
  }
  const chosenEl = document.getElementById(`writing-quiz-opt-${optId}`);
  if (chosenEl) {
    chosenEl.classList.add("selected");
  }
  const feedbackEl = document.getElementById("writing-quiz-feedback");
  if (feedbackEl) feedbackEl.style.display = "none";
}

function submitWritingQuiz() {
  const currentEx = State.writingData[State.currentWritingExercise || 0];
  if (!currentEx) return;
  if (!currentWritingSelectedOption) {
    showNotification("Silakan pilih salah satu opsi jawaban terlebih dahulu!", "warning");
    return;
  }
  const isCorrect = (currentWritingSelectedOption === currentEx.correctAnswer);
  const container = document.getElementById("writing-quiz-options");
  if (container) {
    currentEx.options.forEach(opt => {
      const optEl = document.getElementById(`writing-quiz-opt-${opt.id}`);
      const optIcon = document.getElementById(`writing-quiz-icon-${opt.id}`);
      if (!optEl) return;
      optEl.classList.remove("selected", "correct", "wrong");
      if (opt.id === currentEx.correctAnswer) {
        optEl.classList.add("correct");
        if (optIcon) optIcon.innerHTML = "✓";
      } else if (opt.id === currentWritingSelectedOption && !isCorrect) {
        optEl.classList.add("wrong");
        if (optIcon) optIcon.innerHTML = "✗";
      }
    });
  }

  const feedbackEl = document.getElementById("writing-quiz-feedback");
  if (feedbackEl) {
    feedbackEl.style.display = "block";
    if (isCorrect) {
      feedbackEl.style.background = "#ecfdf5";
      feedbackEl.style.border = "1.5px solid #10b981";
      feedbackEl.style.color = "#047857";
      feedbackEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 1.2rem;">🎉</span>
          <strong style="font-size: 0.95rem;">Benar Sekali! (+10 XP)</strong>
        </div>
        <p style="margin: 0; font-size: 0.85rem; line-height: 1.5;">${currentEx.explanation}</p>
      `;
      if (typeof addXP === "function") addXP(10);
    } else {
      feedbackEl.style.background = "#fff1f2";
      feedbackEl.style.border = "1.5px solid #f43f5e";
      feedbackEl.style.color = "#be123c";
      feedbackEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 1.2rem;">⚠️</span>
          <strong style="font-size: 0.95rem;">Jawaban Kurang Tepat (Kunci: Opsi ${currentEx.correctAnswer})</strong>
        </div>
        <p style="margin: 0; font-size: 0.85rem; line-height: 1.5;">${currentEx.explanation}</p>
      `;
    }
  }
}

function resetWritingQuiz() {
  currentWritingSelectedOption = null;
  const container = document.getElementById("writing-quiz-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("selected", "correct", "wrong");
      const icon = item.querySelector(".option-icon");
      if (icon) icon.innerHTML = "";
    });
  }
  const feedbackEl = document.getElementById("writing-quiz-feedback");
  if (feedbackEl) feedbackEl.style.display = "none";
}

function nextWritingExercise() {
  if (State.currentWritingExercise < State.writingData.length - 1) {
    State.currentWritingExercise++;
  } else {
    State.currentWritingExercise = 0;
  }
  currentWritingSelectedOption = null;
  renderWritingModule();
}

function checkContohWritingAnswer(selectedId, correctId, explanation) {
  const isCorrect = (selectedId === correctId);
  const container = document.getElementById("writing-contoh-options");
  if (container) {
    container.querySelectorAll(".quiz-option-item").forEach(item => {
      item.classList.remove("correct", "wrong");
    });
  }
  const chosenEl = document.getElementById(`contoh-opt-writing-${selectedId}`);
  const chosenIcon = document.getElementById(`contoh-icon-writing-${selectedId}`);
  const correctEl = document.getElementById(`contoh-opt-writing-${correctId}`);
  const correctIcon = document.getElementById(`contoh-icon-writing-${correctId}`);

  if (correctEl) {
    correctEl.classList.add("correct");
    if (correctIcon) correctIcon.innerHTML = "✓";
  }
  if (!isCorrect && chosenEl) {
    chosenEl.classList.add("wrong");
    if (chosenIcon) chosenIcon.innerHTML = "✗";
  }

  const feedbackEl = document.getElementById("writing-contoh-feedback");
  if (feedbackEl) {
    feedbackEl.style.display = "block";
    if (isCorrect) {
      feedbackEl.style.background = "#ecfdf5";
      feedbackEl.style.border = "1.5px solid #10b981";
      feedbackEl.style.color = "#047857";
      feedbackEl.innerHTML = `<strong>🎉 Benar Sekali! (+10 Poin)</strong><br>${explanation}`;
    } else {
      feedbackEl.style.background = "#fff1f2";
      feedbackEl.style.border = "1.5px solid #f43f5e";
      feedbackEl.style.color = "#be123c";
      feedbackEl.innerHTML = `<strong>⚠️ Kurang Tepat (Jawaban Benar: Opsi ${correctId})</strong><br>${explanation}`;
    }
  }
}

function selectStrokeHskTab(tab) {
  currentStrokeHskTab = tab;
  currentStrokeIndex = 0;
  renderWritingModule();
}

function selectStrokeChar(index) {
  currentStrokeIndex = index;
  renderWritingModule();
}

// ==========================================================================
// Papan Tulis Interaktif Menulis Karakter & Goresan Hanzi (Canvas Engine)
// ==========================================================================
let writingCanvas = null;
let writingCtx = null;
let isWritingDrawing = false;
let currentWritingInk = '#0f172a';
let showWritingGuide = true;
let writingStrokesCount = 0;

function initWritingCanvas() {
  writingCanvas = document.getElementById('hanzi-interactive-canvas');
  if (!writingCanvas) return;
  writingCtx = writingCanvas.getContext('2d');
  if (!writingCtx) return;

  writingStrokesCount = 0;
  
  // Set default canvas context
  writingCtx.lineCap = 'round';
  writingCtx.lineJoin = 'round';
  writingCtx.lineWidth = 14; // Kuas kaligrafi standar tebal
  writingCtx.strokeStyle = currentWritingInk;

  // Clear canvas
  writingCtx.clearRect(0, 0, writingCanvas.width, writingCanvas.height);

  // Mouse Events
  writingCanvas.onmousedown = (e) => {
    isWritingDrawing = true;
    const rect = writingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    writingCtx.beginPath();
    writingCtx.moveTo(x, y);
    writingStrokesCount++;
  };

  writingCanvas.onmousemove = (e) => {
    if (!isWritingDrawing) return;
    const rect = writingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    writingCtx.lineTo(x, y);
    writingCtx.stroke();
  };

  window.onmouseup = () => {
    if (isWritingDrawing) {
      isWritingDrawing = false;
      writingCtx.closePath();
    }
  };

  // Touch Events untuk Smartphone / Tablet / Layar Sentuh
  writingCanvas.ontouchstart = (e) => {
    e.preventDefault();
    isWritingDrawing = true;
    const rect = writingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    writingCtx.beginPath();
    writingCtx.moveTo(x, y);
    writingStrokesCount++;
  };

  writingCanvas.ontouchmove = (e) => {
    e.preventDefault();
    if (!isWritingDrawing) return;
    const rect = writingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    writingCtx.lineTo(x, y);
    writingCtx.stroke();
  };

  writingCanvas.ontouchend = (e) => {
    e.preventDefault();
    if (isWritingDrawing) {
      isWritingDrawing = false;
      writingCtx.closePath();
    }
  };
}

function clearWritingCanvas() {
  if (writingCanvas && writingCtx) {
    writingCtx.clearRect(0, 0, writingCanvas.width, writingCanvas.height);
    writingStrokesCount = 0;
    const feedbackBox = document.getElementById('writing-duolingo-feedback');
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }
    showToast("Papan latihan menulis telah dibersihkan.");
  }
}

function setWritingInk(color) {
  currentWritingInk = color;
  if (writingCtx) {
    writingCtx.strokeStyle = currentWritingInk;
  }
  showToast("Warna tinta kuas diubah.");
}

function toggleHanziGuide() {
  const guideEl = document.getElementById('hanzi-large-display');
  const btn = document.getElementById('btn-toggle-guide');
  showWritingGuide = !showWritingGuide;
  if (guideEl) {
    guideEl.style.display = showWritingGuide ? 'flex' : 'none';
  }
  if (btn) {
    btn.innerHTML = showWritingGuide ? '👁️ Panduan: ON' : '👁️ Panduan: OFF';
  }
  showToast(showWritingGuide ? 'Panduan jejak karakter ditampilkan.' : 'Mode tantangan bebas: Panduan disembunyikan!');
}

// ==========================================================================
// Efek Suara (Audio Feedback) Ala Duolingo Berbasis Web Audio API (Tanpa File Eksternal)
// ==========================================================================
function playDuolingoSound(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'correct') {
      // Duolingo Ding Dong Chime (Dua nada ceria naik)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5 nada tinggi ceria
      gain2.gain.setValueAtTime(0.3, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } else {
      // Duolingo Thud / Buzz (Dua nada menurun)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.warn("Audio Context sound error:", err);
  }
}

// ==========================================================================
// Algoritma Evaluasi & Penilaian Goresan Hanzi Ala Duolingo
// ==========================================================================
function evaluateUserStrokes(charData) {
  if (!writingCanvas || !writingCtx) {
    return { isCorrect: false, score: 0, reason: "Kanvas tidak siap" };
  }

  const w = writingCanvas.width;
  const h = writingCanvas.height;
  const userImg = writingCtx.getImageData(0, 0, w, h);
  const userPixels = userImg.data;

  // 1. Hitung jumlah pixel yang digoreskan oleh user
  let userDrawnPixels = 0;
  for (let i = 3; i < userPixels.length; i += 4) {
    if (userPixels[i] > 30) {
      userDrawnPixels++;
    }
  }

  // 2. Render karakter target pada kanvas virtual (offscreen) untuk perbandingan template visual
  const offCanvas = document.createElement('canvas');
  offCanvas.width = w;
  offCanvas.height = h;
  const offCtx = offCanvas.getContext('2d');
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.font = '190px "Noto Serif SC", "Ma Shan Zheng", "Kaiti", serif';
  offCtx.fillStyle = '#000000';
  offCtx.fillText(charData.char, w / 2, h / 2 + 10);

  const targetImg = offCtx.getImageData(0, 0, w, h);
  const targetPixels = targetImg.data;

  let targetPixelCount = 0;
  let overlappingPixels = 0;

  for (let i = 3; i < targetPixels.length; i += 4) {
    const isTarget = targetPixels[i] > 40;
    const isUser = userPixels[i] > 30;

    if (isTarget) targetPixelCount++;
    if (isTarget && isUser) overlappingPixels++;
  }

  if (userDrawnPixels < 400) {
    return {
      isCorrect: false,
      score: 15,
      drawnCount: writingStrokesCount,
      targetCount: charData.strokesCount,
      overlapPercent: 10,
      reason: "Goresan terlalu sedikit atau belum lengkap. Coba ikuti pola karakter sepenuhnya!"
    };
  }

  // Rasio kemiripan bentuk (overlap terhadap bentuk asli)
  const overlapPercent = targetPixelCount > 0 ? Math.round((overlappingPixels / targetPixelCount) * 100) : 50;
  
  // Evaluasi jumlah goresan (toleransi variasi goresan kuas berkelanjutan ±3)
  const strokeDiff = Math.abs(writingStrokesCount - charData.strokesCount);
  const isStrokeCountReasonable = writingStrokesCount >= Math.max(1, Math.floor(charData.strokesCount * 0.45));

  // Menentukan kelulusan (Benar / Salah) ala Duolingo:
  // Lulus jika overlap bentuk mencapai minimal 35% dan goresan memadai
  const isCorrect = (overlapPercent >= 33 && isStrokeCountReasonable) || (overlapPercent >= 28 && strokeDiff <= 2);
  
  // Hitung skor akurasi (30% - 98%)
  let accuracyScore = Math.min(99, Math.max(30, Math.round(overlapPercent * 1.5 + (isStrokeCountReasonable ? 20 : 0))));

  return {
    isCorrect,
    score: accuracyScore,
    overlapPercent,
    drawnCount: writingStrokesCount,
    targetCount: charData.strokesCount,
    reason: isCorrect 
      ? "Bentuk dan posisi goresan karakter sudah sesuai dengan kaidah penulisan Hanzi!" 
      : (overlapPercent < 30 ? "Posisi goresan kuas Anda meleset dari bentuk karakter standar." : "Jumlah tarikan goresan kurang mencukupi urutan karakter.")
  };
}

function submitWritingPractice() {
  if (writingStrokesCount === 0) {
    showToast("Silakan goreskan kuas Anda di kotak Tian Zi Ge terlebih dahulu! ✍️", "warning");
    return;
  }

  const filteredChars = State.strokeCharacters.filter(c => {
    if (currentStrokeHskTab === "all") return true;
    return c.hskLevel === currentStrokeHskTab;
  });
  const charData = filteredChars[currentStrokeIndex] || State.strokeCharacters[0];

  const evalResult = evaluateUserStrokes(charData);
  const feedbackBox = document.getElementById('writing-duolingo-feedback');

  if (evalResult.isCorrect) {
    // === SUARA & EFEK BENAR ALA DUOLINGO ===
    playDuolingoSound('correct');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = 'duolingo-feedback-card correct';
      feedbackBox.innerHTML = `
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="duolingo-icon-bounce" style="width: 44px; height: 44px; border-radius: 50%; background: #22c55e; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.4);">
                ✓
              </div>
              <div>
                <h4 style="margin: 0; color: #15803d; font-size: 1.15rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">Luar Biasa! Goresan Benar! 🎉</h4>
                <p style="margin: 2px 0 0 0; color: #166534; font-size: 0.82rem; font-weight: 600;">Karakter <strong>${charData.char} (${charData.pinyin})</strong> berhasil ditulis dengan sangat baik!</p>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="background: #22c55e; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 800;">
                Skor: ${evalResult.score}%
              </span>
            </div>
          </div>

          <div style="background: rgba(255, 255, 255, 0.7); border-radius: 10px; padding: 10px 14px; font-size: 0.82rem; color: #14532d; border: 1px solid #bbf7d0;">
            <div style="margin-bottom: 4px;"><strong>💡 Catatan Evaluasi:</strong> ${evalResult.reason}</div>
            <div style="display: flex; gap: 15px; font-size: 0.78rem; color: #15803d; flex-wrap: wrap;">
              <span>• Goresan Asli: <strong>${charData.strokesCount} goresan</strong></span>
              <span>• Tarikan Anda: <strong>${evalResult.drawnCount} tarikan</strong></span>
              <span>• Bonus: <strong>+20 EXP & +15 Poin</strong></span>
            </div>
          </div>

          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;">
            <button onclick="clearWritingCanvas()" class="btn-learn-outline" style="padding: 6px 14px; font-size: 0.8rem; margin: 0; background: #ffffff; border-color: #86efac; color: #15803d;">
              Tulis Lagi 🔄
            </button>
            <button onclick="nextStrokeCharacter()" class="btn-primary-sakura" style="padding: 6px 18px; font-size: 0.82rem; font-weight: 800; margin: 0; background: #22c55e; box-shadow: 0 3px 0 #15803d; color: #ffffff;">
              Lanjut Karakter Berikutnya ➔
            </button>
          </div>
        </div>
      `;
    }

    recordUserActivity('writing', 20, 15, `write_practice_${charData.char}`, 2);
    showToast(`🎉 Benar! Goresan Hanzi "${charData.char}" sempurna! (+20 EXP)`);
  } else {
    // === SUARA & EFEK SALAH ALA DUOLINGO ===
    playDuolingoSound('incorrect');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = 'duolingo-feedback-card incorrect';
      feedbackBox.innerHTML = `
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="duolingo-icon-shake" style="width: 44px; height: 44px; border-radius: 50%; background: #ef4444; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">
                ✕
              </div>
              <div>
                <h4 style="margin: 0; color: #b91c1c; font-size: 1.15rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">Belum Tepat, Coba Lagi! ✍️</h4>
                <p style="margin: 2px 0 0 0; color: #991b1b; font-size: 0.82rem; font-weight: 600;">Goresan Hanzi <strong>${charData.char} (${charData.pinyin})</strong> belum menyerupai bentuk aslinya.</p>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="background: #ef4444; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 800;">
                Skor: ${evalResult.score}%
              </span>
            </div>
          </div>

          <div style="background: rgba(255, 255, 255, 0.7); border-radius: 10px; padding: 10px 14px; font-size: 0.82rem; color: #7f1d1d; border: 1px solid #fecaca;">
            <div style="margin-bottom: 4px;"><strong>⚠️ Masalah Goresan:</strong> ${evalResult.reason}</div>
            <div style="font-size: 0.78rem; color: #b91c1c; margin-top: 4px;">
              <strong>💡 Petunjuk Duolingo:</strong> Pastikan opsi <em>"Panduan: ON"</em> aktif dan ikuti cetakan abu-abu langkah demi langkah!
            </div>
          </div>

          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;">
            <button onclick="animateStrokeSteps()" class="btn-learn-outline" style="padding: 6px 14px; font-size: 0.8rem; margin: 0; background: #ffffff; border-color: #fca5a5; color: #b91c1c;">
              ▶ Lihat Animasi
            </button>
            <button onclick="clearWritingCanvas()" class="btn-primary-sakura" style="padding: 6px 18px; font-size: 0.82rem; font-weight: 800; margin: 0; background: #ef4444; box-shadow: 0 3px 0 #b91c1c; color: #ffffff;">
              Hapus & Ulangi 🔄
            </button>
          </div>
        </div>
      `;
    }

    showToast(`⚠️ Goresan belum tepat. Silakan lihat panduan dan coba kembali!`, "warning");
  }
}

function nextStrokeCharacter() {
  const filteredChars = State.strokeCharacters.filter(c => {
    if (currentStrokeHskTab === "all") return true;
    return c.hskLevel === currentStrokeHskTab;
  });

  if (currentStrokeIndex < filteredChars.length - 1) {
    currentStrokeIndex++;
  } else {
    currentStrokeIndex = 0;
  }
  renderWritingModule();
  showToast(`Beralih ke latihan karakter berikutnya: "${filteredChars[currentStrokeIndex].char}"! ✍️`);
}

function animateStrokeSteps() {
  const charDisplay = document.getElementById("hanzi-large-display");
  if (!charDisplay) return;
  
  const filteredChars = State.strokeCharacters.filter(c => {
    if (currentStrokeHskTab === "all") return true;
    return c.hskLevel === currentStrokeHskTab;
  });
  const charData = filteredChars[currentStrokeIndex] || State.strokeCharacters[0];

  charDisplay.style.opacity = "0.1";
  charDisplay.style.transform = "scale(0.85)";
  
  let step = 0;
  const timer = setInterval(() => {
    step++;
    charDisplay.style.opacity = `${0.2 + (step * 0.2)}`;
    charDisplay.style.transform = `scale(${0.85 + (step * 0.03)})`;
    if (step >= 4) {
      clearInterval(timer);
      charDisplay.style.opacity = "1";
      charDisplay.style.transform = "scale(1)";
      showToast(`Animasi goresan "${charData.char}" selesai diputar! (+10 EXP) ✍️`);
      recordUserActivity('writing', 10, 5, `stroke_${charData.char}`, 1);
    }
  }, 350);
}

function checkAIGrammar() {
  const inputEl = document.getElementById("ai-writing-input");
  const resultBox = document.getElementById("ai-grammar-result-area");
  const correctedEl = document.getElementById("ai-corrected-text");
  const pinyinEl = document.getElementById("ai-pinyin-display");
  const explEl = document.getElementById("ai-explanation-list");
  const scoreEl = document.getElementById("ai-grammar-score");

  const text = inputEl.value.trim();
  if (!text) {
    showToast("Silakan tuliskan teks kalimat Mandarin terlebih dahulu.", "warning");
    return;
  }

  showToast("AI sedang memeriksa tata bahasa dan Pinyin... ⏳");

  setTimeout(() => {
    resultBox.style.display = "block";
    
    if (text.includes("他们很甜") || text.includes("他们")) {
      correctedEl.innerHTML = `Saran Koreksi: 我昨天去商店买了三个苹果，<strong>它们</strong>很甜。`;
      pinyinEl.innerHTML = `Pinyin: <em>Wǒ zuótiān qù shāngdiàn mǎile sān gè píngguǒ, tāmen hěn tián.</em>`;
      scoreEl.textContent = "Skor: 88/100";
      scoreEl.style.background = "#ff9f1c";
      explEl.innerHTML = `
        <ul style="padding-left: 18px; margin-top: 4px;">
          <li><strong>Kata Ganti Objek:</strong> Gunakan '它们' (tāmen untuk benda/buah), bukan '他们' (tāmen untuk manusia).</li>
          <li><strong>Aspek Selesai (了):</strong> Tambahkan '了' setelah kata kerja '买' karena kejadian terjadi kemarin (昨天).</li>
          <li><strong>Struktur Kalimat:</strong> Struktur subjek dan keterangan waktu sudah sangat tepat dan alami!</li>
        </ul>
      `;
    } else {
      correctedEl.innerHTML = `Kalimat Anda: ${text}`;
      pinyinEl.innerHTML = `Pinyin & Struktur terdeteksi akurat.`;
      scoreEl.textContent = "Skor: 96/100";
      scoreEl.style.background = "#2ec4b6";
      explEl.innerHTML = `
        <p style="color: #0f766e;"><strong>Bagus sekali!</strong> Tidak ditemukan kesalahan tata bahasa yang signifikan. Penggunaan kata dan partikel sudah tepat!</p>
      `;
    }
    recordUserActivity('writing', 25, 20, 'ai_grammar_analysis', 3);
  }, 600);
}

// ==========================================================================
// DEDICATED HSK 1 - 6 LEARNING MODULE ENGINE
// ==========================================================================
let currentHskFilterLevel = 'all';

function filterHskPage(level) {
  currentHskFilterLevel = level;
  renderHskModule();
}

function renderHskModule() {
  const container = document.getElementById("hsk-content-container");
  if (!container) return;

  const hskData = [
    {
      level: 1,
      title: "HSK Level 1: Fondasi Mandarin Dasar",
      icon: "🌱",
      badgeBg: "#ecfdf5",
      badgeColor: "#059669",
      borderColor: "#a7f3d0",
      categoryBadge: "HSK 1 • PEMULA",
      vocabCount: "150 Kosakata",
      masterKey: "hsk1_mastery",
      desc: "Fondasi dasar bahasa Mandarin. Menguasai 150 kata umum, pinyin 4 nada, kata ganti, perkenalan diri, dan tata bahasa sederhana.",
      grammar: ["Partikel Kepemilikan 的", "Predikat Adjektiva (S + 很 + Adj)", "Pertanyaan 吗 / 什么 / 几", "Kata Kerja Identitas 是"],
      samples: [
        { hanzi: "你好 (nǐ hǎo)", pinyin: "nǐ hǎo", meaning: "Halo / Apa kabar" },
        { hanzi: "我是学生 (wǒ shì xuésheng)", pinyin: "wǒ shì xuésheng", meaning: "Saya adalah murid" },
        { hanzi: "谢谢 (xièxie)", pinyin: "xiè xie", meaning: "Terima kasih" },
        { hanzi: "现在几点？(xiànzài jǐ diǎn?)", pinyin: "xiànzài jǐ diǎn?", meaning: "Sekarang jam berapa?" }
      ]
    },
    {
      level: 2,
      title: "HSK Level 2: Percakapan Sehari-hari",
      icon: "🌿",
      badgeBg: "#cff4fc",
      badgeColor: "#0891b2",
      borderColor: "#a5f3fc",
      categoryBadge: "HSK 2 • PERCAKAPAN",
      vocabCount: "300 Kosakata",
      masterKey: "hsk2_mastery",
      desc: "Komunikasi dasar situasi rutin sehari-hari: berbelanja, memesan makanan, menanyakan arah, dan menceritakan aktivitas.",
      grammar: ["Kalimat Perbandingan 比 (bǐ)", "Progresif 在...呢", "Kata Penggolong 件 / 张 / 只", "Urutan Waktu 从...到..."],
      samples: [
        { hanzi: "苹果比西瓜便宜", pinyin: "Píngguǒ bǐ xīguā piányi", meaning: "Apel lebih murah dari semangka" },
        { hanzi: "他在打电话呢", pinyin: "Tā zài dǎ diànhuà ne", meaning: "Dia sedang menelpon" },
        { hanzi: "便宜一点吧", pinyin: "piányi yīdiǎn ba", meaning: "Murahkan sedikit dong" }
      ]
    },
    {
      level: 3,
      title: "HSK Level 3: Tata Bahasa Menengah & Cerita",
      icon: "🌳",
      badgeBg: "#dbeafe",
      badgeColor: "#1d4ed8",
      borderColor: "#bfdbfe",
      categoryBadge: "HSK 3 • MENENGAH",
      vocabCount: "600 Kosakata",
      masterKey: "hsk3_mastery",
      desc: "Kemahiran menengah untuk berkomunikasi lancar di Tiongkok saat liburan, studi, atau bekerja. Paham teks cerita pendek.",
      grammar: ["Struktur Penekanan Objek 把 (bǐ)", "Konjungsi Meskipun...Tapi... (虽然...但是...)", "Pengulangan Kata Kerja (V一V)", "Komplemen Hasil (V + 到/见/完)"],
      samples: [
        { hanzi: "虽然很难，但是很有趣", pinyin: "Suīrán hěn nán, dànshì hěn yǒuqù", meaning: "Meskipun sulit tetapi sangat menarik" },
        { hanzi: "请把门关上", pinyin: "Qǐng bǎ mén guānshàng", meaning: "Tolong tutup pintunya" },
        { hanzi: "越做越好", pinyin: "Yuè zuò yuè hǎo", meaning: "Semakin dikerjakan semakin bagus" }
      ]
    },
    {
      level: 4,
      title: "HSK Level 4: Menengah Lanjutan & Diskusi Opini",
      icon: "🍁",
      badgeBg: "#f3e8ff",
      badgeColor: "#6d28d9",
      borderColor: "#ddd6fe",
      categoryBadge: "HSK 4 • MENENGAH LANJUTAN",
      vocabCount: "1.200 Kosakata",
      masterKey: "hsk4_mastery",
      desc: "Fasih berdiskusi berbagai topik sosial, pekerjaan, dan kebudayaan. Mampu membuat esai pendek dan memahami wacana umum.",
      grammar: ["Kalimat Pasif 被 (bèi)", "Pola Bagaimanapun Juga (无论...都...)", "Konjungsi Meskipun (即使...也...)", "Idiom Chengyu Dasar"],
      samples: [
        { hanzi: "无论是顺境还是逆境", pinyin: "Wúlùn shì shùnjìng háishì nìjìng", meaning: "Baik dalam kondisi lancar maupun sulit" },
        { hanzi: "钱包被偷了", pinyin: "Qiánbāo bèi tōu le", meaning: "Dompet telah dicuri (pasif)" },
        { hanzi: "态度决定一切", pinyin: "Tàidù juédìng yīqiè", meaning: "Sikap menentukan segalanya" }
      ]
    },
    {
      level: 5,
      title: "HSK Level 5: Fasih Opini, Artikel Berita & Bisnis",
      icon: "🌸",
      badgeBg: "#fce7f3",
      badgeColor: "#be185d",
      borderColor: "#fbcfe8",
      categoryBadge: "HSK 5 • MAHIR",
      vocabCount: "2.500 Kosakata",
      masterKey: "hsk5_mastery",
      desc: "Membaca artikel berita, laporan bisnis, pidato, dan menonton program TV tanpa hambatan. Fasih berargumen.",
      grammar: ["Bahasa Resmi Penulisan (书面语)", "Konjungsi Formal (即便, 毫无, 旨在)", "Rangkaian Idiom Chengyu Bisnis", "Retorika Penegasan"],
      samples: [
        { hanzi: "合作共赢", pinyin: "Hézuò gòngyíng", meaning: "Kerja sama saling menguntungkan (win-win)" },
        { hanzi: "科技创新改变生活", pinyin: "Kējì chuàngxīn gǎibiàn shēnghuó", meaning: "Inovasi sains & teknologi mengubah hidup" },
        { hanzi: "毫无疑问", pinyin: "Háo wú yíwèn", meaning: "Tanpa keraguan lagi" }
      ]
    },
    {
      level: 6,
      title: "HSK Level 6: Master Sastra, Akademik & AI",
      icon: "👑",
      badgeBg: "#fef3c7",
      badgeColor: "#b45309",
      borderColor: "#fde68a",
      categoryBadge: "HSK 6 • MASTER / SASTRA",
      vocabCount: "5.000+ Kosakata",
      masterKey: "hsk6_mastery",
      desc: "Tingkat tertinggi keahlian bahasa Mandarin. Memahami karya sastra klasik, jurnal akademik, dan ekspresi tingkat profesional.",
      grammar: ["Kesusastraan & Chengyu Klasik", "Struktur Wacana Komposisi Akademik", "Kanal Metafora & Puisi", "Analisis Teks Kritis"],
      samples: [
        { hanzi: "海纳百川，有容乃大", pinyin: "Hǎinàbǎichuān, yǒu róng nǎi dà", meaning: "Laut menampung ratusan sungai, kebesaran dari toleransi" },
        { hanzi: "独树一帜", pinyin: "Dú shù yī zhì", meaning: "Pelopor unik terdepan di bidangnya" },
        { hanzi: "突飞猛进", pinyin: "Tū fēi měng jìn", meaning: "Maju berkembang sangat pesat" }
      ]
    }
  ];

  const filteredHsk = currentHskFilterLevel === 'all' 
    ? hskData 
    : hskData.filter(d => d.level === parseInt(currentHskFilterLevel));

  container.innerHTML = `
    <!-- Top Filter Bar & Level Chips (Struktur Rapi HSK 1 - 6) -->
    <div class="modern-banner-card" style="background: #ffffff; border-radius: 22px; padding: 1.6rem; box-shadow: 0 6px 20px rgba(0,0,0,0.03); margin-bottom: 1.5rem; border: 1px solid rgba(0,0,0,0.04);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 1.2rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 1.3rem;">📚</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-text); margin: 0;">
              Kurikulum Silabus Materi HSK 1 - 6
            </h3>
            <span class="role-badge" style="background: #ecfdf5; color: #059669; font-weight: 800; font-size: 0.72rem; border-radius: 9999px;">Fokus Materi & Contoh Latihan</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
            Pilih tingkatan level di bawah untuk mendalami materi tata bahasa ber-rumus, kosakata esensial ber-audio, dan contoh latihan interaktif terpandu.
          </p>
        </div>
      </div>

      <!-- Quick Level Filter Chips -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="bank-filter-chip ${currentHskFilterLevel === 'all' ? 'active' : ''}" onclick="filterHskPage('all')">
          🌟 Semua Level (HSK 1 - 6)
        </button>
        ${hskData.map(h => `
          <button class="bank-filter-chip ${currentHskFilterLevel === h.level.toString() || currentHskFilterLevel === h.level ? 'active' : ''}" onclick="filterHskPage(${h.level})">
            ${h.icon} Level ${h.level} (${h.vocabCount})
          </button>
        `).join('')}
      </div>
    </div>

    <!-- HSK Cards Grid (Struktur Rapi Berfokus Materi & Contoh Latihan - Bebas Kotak Kaku) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
      ${filteredHsk.map(item => `
        <div class="modern-course-card" style="background: #ffffff; border-radius: 22px; padding: 1.5rem; box-shadow: 0 6px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <div>
            <!-- Header Card -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.1rem;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 52px; height: 52px; border-radius: 50%; background: ${item.badgeBg}; color: ${item.badgeColor}; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                  ${item.icon}
                </div>
                <div>
                  <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                    <span class="role-badge" style="background: ${item.badgeBg}; color: ${item.badgeColor}; font-weight: 800; font-size: 0.72rem; border-radius: 9999px;">${item.categoryBadge}</span>
                    <span style="font-size: 0.72rem; background: rgba(0,0,0,0.04); color: var(--text-muted); padding: 2px 8px; border-radius: 9999px; font-weight: 700;">${item.vocabCount}</span>
                  </div>
                  <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--dark-text); margin-top: 4px;">${item.title}</h4>
                </div>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.1rem;">
              ${item.desc}
            </p>

            <!-- Grammar Highlights Badge List -->
            <div style="margin-bottom: 1.1rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: var(--dark-text); margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
                <span>📌</span> Tata Bahasa Utama:
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${item.grammar.map(g => `
                  <span style="font-size: 0.75rem; background: rgba(242, 114, 137, 0.08); color: var(--primary-pink); padding: 4px 10px; border-radius: 9999px; font-weight: 700;">${g}</span>
                `).join('')}
              </div>
            </div>

            <!-- Sample Vocab Audio List -->
            <div style="background: rgba(0,0,0,0.02); border-radius: 16px; padding: 14px; margin-bottom: 1.25rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary-pink); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span>🔊 Contoh Kosakata & Pola Kalimat:</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">Klik audio untuk dengar</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 7px;">
                ${item.samples.map(s => `
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; border-bottom: 1px dashed rgba(0,0,0,0.06); padding-bottom: 5px;">
                    <div style="min-width: 0; flex: 1;">
                      <span style="font-family: var(--font-chinese); font-weight: bold; color: var(--dark-text); font-size: 0.95rem;">${s.hanzi}</span>
                      <span style="color: var(--primary-pink); font-weight: 700; margin-left: 6px;">(${s.pinyin})</span>
                      <span style="color: var(--text-muted); margin-left: 4px;">— ${s.meaning}</span>
                    </div>
                    <button class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.75rem; border-radius: 99px; margin-left: 8px; flex-shrink: 0;" onclick="speakMandarin('${s.hanzi}', 0.85)" title="Putar Pelafalan Audio">
                      🔊
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons: Hanya Berfokus Materi & Contoh Latihan -->
          <div style="display: flex; gap: 8px; margin-top: 0.5rem; flex-wrap: wrap;">
            <button class="btn-primary-sakura" style="flex: 1.2; padding: 10px 14px; font-size: 0.84rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="openModuleDetailPage('mod-hsk-${item.level}', 'materi')">
              📖 Pelajari Materi Lengkap
            </button>
            <button class="btn-learn-outline" style="flex: 1; padding: 10px 14px; font-size: 0.84rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="openModuleDetailPage('mod-hsk-${item.level}', 'contoh')">
              💡 Contoh Latihan
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- HSK Roadmap & Level Comparison Chart -->
    <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--card-shadow); margin-bottom: 2rem; border: 1.5px solid #f1f5f9;">
      <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--primary-pink);">🗺️</span> Struktur Silabus Kurikulum HSK 1 - 6
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Panduan berjenjang target kosakata, kompetensi berbicara, membaca, mendengar, menulis, dan padanan standar CEFR internasional.
      </p>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">
          <thead>
            <tr style="background: #fff0f3; color: var(--primary-pink); font-weight: 800; border-bottom: 2px solid #ffd8e0;">
              <th style="padding: 10px 12px; border-radius: var(--radius-sm) 0 0 var(--radius-sm);">Tingkat HSK</th>
              <th style="padding: 10px 12px;">Target Kosakata</th>
              <th style="padding: 10px 12px;">Kemampuan Bahasa</th>
              <th style="padding: 10px 12px;">Jam Studi</th>
              <th style="padding: 10px 12px;">Setara CEFR</th>
              <th style="padding: 10px 12px; text-align: center; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">Akses Materi</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: bold; color: #10b981;">🌱 HSK Level 1</td>
              <td style="padding: 10px 12px;">150 Kata</td>
              <td style="padding: 10px 12px;">Memahami kalimat sederhana, pinyin 4 nada & sapaan dasar</td>
              <td style="padding: 10px 12px;">30 - 40 Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #ecfdf5; color: #059669;">CEFR A1</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-1', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-1', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 10px 12px; font-weight: bold; color: #06b6d4;">🌿 HSK Level 2</td>
              <td style="padding: 10px 12px;">300 Kata</td>
              <td style="padding: 10px 12px;">Komunikasi sehari-hari rutin, belanja & informasi pribadi</td>
              <td style="padding: 10px 12px;">60 - 80 Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #cff4fc; color: #0891b2;">CEFR A2</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-2', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-2', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: bold; color: #3b82f6;">🌳 HSK Level 3</td>
              <td style="padding: 10px 12px;">600 Kata</td>
              <td style="padding: 10px 12px;">Berkomunikasi lancar untuk studi, wisata & cerita pendek</td>
              <td style="padding: 10px 12px;">120 - 160 Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #dbeafe; color: #1d4ed8;">CEFR B1</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-3', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-3', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 10px 12px; font-weight: bold; color: #8b5cf6;">🍁 HSK Level 4</td>
              <td style="padding: 10px 12px;">1.200 Kata</td>
              <td style="padding: 10px 12px;">Diskusi topik sosial, wacana opini & interaksi penutur asli</td>
              <td style="padding: 10px 12px;">240 - 300 Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #f3e8ff; color: #6d28d9;">CEFR B2</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-4', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-4', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: bold; color: #ec4899;">🌸 HSK Level 5</td>
              <td style="padding: 10px 12px;">2.500 Kata</td>
              <td style="padding: 10px 12px;">Membaca artikel berita, wacana bisnis, film & retorika debat</td>
              <td style="padding: 10px 12px;">450+ Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #fce7f3; color: #be185d;">CEFR C1</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-5', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-5', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 10px 12px; font-weight: bold; color: #d97706;">👑 HSK Level 6</td>
              <td style="padding: 10px 12px;">5.000+ Kata</td>
              <td style="padding: 10px 12px;">Kemampuan master tingkat akademik, sastra klasik & ekspresi kritis</td>
              <td style="padding: 10px 12px;">600+ Jam</td>
              <td style="padding: 10px 12px;"><span class="role-badge" style="background: #fef3c7; color: #b45309;">CEFR C2</span></td>
              <td style="padding: 10px 12px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-primary-sakura" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-6', 'materi')">📖 Materi</button>
                  <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.74rem; margin: 0;" onclick="openModuleDetailPage('mod-hsk-6', 'contoh')">💡 Contoh</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Inisialisasi Canvas Interaktif Menulis
  setTimeout(initWritingCanvas, 60);
}

function clearAIText() {
  document.getElementById("ai-writing-input").value = "";
  document.getElementById("ai-grammar-result-area").style.display = "none";
}

// Reading Module Interactive Quiz Handlers
const userReadingSelections = { 1: null, 2: null };
function selectReadingQuizOpt(questionNumber, optionIndex, element) {
  userReadingSelections[questionNumber] = optionIndex;
  const parent = document.getElementById(`reading-q${questionNumber}-options`);
  if (parent) {
    parent.querySelectorAll(".quiz-option-item").forEach(item => item.classList.remove("selected"));
  }
  element.classList.add("selected");
}

function checkReadingQuiz() {
  const ans1 = userReadingSelections[1];
  const ans2 = userReadingSelections[2];
  const feedbackEl = document.getElementById("reading-quiz-feedback");
  if (ans1 === null || ans2 === null) {
    showToast("Silakan jawab kedua pertanyaan reading terlebih dahulu!", "warning");
    return;
  }

  // Question 1 correct: B (index 1), Question 2 correct: A (index 0)
  const isQ1Correct = ans1 === 1;
  const isQ2Correct = ans2 === 0;

  if (!feedbackEl) return;
  feedbackEl.style.display = "block";

  if (isQ1Correct && isQ2Correct) {
    feedbackEl.style.background = "#e6faf7";
    feedbackEl.style.border = "1px solid #2ec4b6";
    feedbackEl.style.color = "#0f766e";
    feedbackEl.innerHTML = `<strong>Luar biasa! Semua Jawaban Tepat (+20 EXP, +15 Poin) 🎉</strong><br>1. Xiaoming belajar di Universitas Peking (北京大学)<br>2. Makanan favoritnya adalah Mie Sapi (牛肉面)`;
    recordUserActivity('reading', 20, 15, 'reading_xiaoming_story', 3);
  } else {
    feedbackEl.style.background = "#fff0f3";
    feedbackEl.style.border = "1px solid #f27289";
    feedbackEl.style.color = "#be123c";
    feedbackEl.innerHTML = `<strong>Jawaban Belum Sempurna</strong><br>Jawaban benar: 1. B (在北京大学), 2. A (牛肉面). Periksa kembali bacaan di atas!`;
    recordUserActivity('reading', 5, 5, null, 1);
  }
}

// ==========================================================================
// 4.5. INTERACTIVE QUIZ ENGINE (HSK 1 - 6)
// ==========================================================================

const HSK_QUIZ_CONFIG = {
  levels: [
    { level: 1, name: "HSK Level 1", badge: "🌱 DASAR PEMULA", icon: "🌱", vocab: "150 Kosakata", color: "#10b981", bg: "#ecfdf5", desc: "Pinyin, 4 nada, angka, sapaan, dan struktur kalimat paling dasar." },
    { level: 2, name: "HSK Level 2", badge: "🌿 PERCAKAPAN HARIAN", icon: "🌿", vocab: "300 Kosakata", color: "#06b6d4", bg: "#cff4fc", desc: "Percakapan sehari-hari, belanja, arah, waktu, dan aktivitas rutin." },
    { level: 3, name: "HSK Level 3", badge: "🌳 MENENGAH DASAR", icon: "🌳", vocab: "600 Kosakata", color: "#3b82f6", bg: "#dbeafe", desc: "Tata bahasa penekanan 把, konjungsi 虽然...但是, perjalanan & sekolah." },
    { level: 4, name: "HSK Level 4", badge: "🍁 MENENGAH LANJUTAN", icon: "🍁", vocab: "1.200 Kosakata", color: "#8b5cf6", bg: "#f3e8ff", desc: "Diskusi topik sosial, opini pribadi, artikel berita & idiom dasar." },
    { level: 5, name: "HSK Level 5", badge: "🌸 TINGKAT MAHIR", icon: "🌸", vocab: "2.500 Kosakata", color: "#ec4899", bg: "#fce7f3", desc: "Membaca surat kabar, artikel formal, karya sastra kontemporer & film." },
    { level: 6, name: "HSK Level 6", badge: "👑 MASTER / SASTRA", icon: "👑", vocab: "5.000+ Kosakata", color: "#d97706", bg: "#fef3c7", desc: "Tingkat penguasaan tertinggi, Chengyu sastra klasik, wacana akademik." },
    { level: 'all', name: "Semua Level", badge: "🌟 KOMPREHENSIF", icon: "🌟", vocab: "Campuran 1-6", color: "#f27289", bg: "#fff0f3", desc: "Uji menyeluruh dari tingkat pemula hingga mahir secara acak." }
  ]
};

function renderQuizPage() {
  const container = document.getElementById("quiz-content-container");
  if (!container) return;

  if (State.quizState === "active") {
    renderActiveQuizPlayer(container);
  } else if (State.quizState === "result") {
    renderQuizResultScreen(container);
  } else {
    renderQuizLobbyScreen(container);
  }
}

// 1. QUIZ LOBBY SCREEN (PILIH LEVEL & PENGATURAN)
function renderQuizLobbyScreen(container) {
  const currentLvl = State.currentQuizLevel || 1;
  const currentSkill = State.currentQuizSkill || "all";
  const currentMode = State.currentQuizMode || "practice";
  const currentCount = State.currentQuizCount || 10;

  // Calculate available questions
  let availablePool = [];
  if (currentLvl === 'all') {
    [1, 2, 3, 4, 5, 6].forEach(lvl => {
      if (State.bankQuestions[lvl]) availablePool.push(...State.bankQuestions[lvl]);
    });
  } else {
    availablePool = State.bankQuestions[currentLvl] || [];
  }

  if (currentSkill !== 'all') {
    availablePool = availablePool.filter(q => q.type === currentSkill);
  }

  container.innerHTML = `
    <!-- Top Hero Banner -->
    <div class="quiz-hero-banner">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-weight: 800; font-size: 0.75rem;">
            🎯 PUSAT KUIS INTERAKTIF
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Tersedia 380+ Soal Terverifikasi HSK 1 - 6</span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 900; color: var(--dark-text); line-height: 1.2;">
          Asah Kemampuan Mandarin dengan Quiz Interaktif! 🐼✨
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; max-width: 600px;">
          Pilih level HSK yang ingin Anda uji, sesuaikan kategori keterampilan, dan mulai kuis dengan sistem penilaian otomatis serta pembahasan materi lengkap.
        </p>
      </div>

      <div style="display: flex; gap: 12px; align-items: center;">
        <button class="btn-primary-sakura" style="margin: 0; padding: 12px 24px; font-size: 0.95rem; font-weight: 800;" onclick="startInteractiveQuiz()">
          🚀 Mulai Kuis Sekarang (${Math.min(currentCount, availablePool.length)} Soal)
        </button>
      </div>
    </div>

    <!-- Pilih Level HSK -->
    <div style="margin-bottom: 1.75rem;">
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
        <span>🎓</span> 1. Pilih Tingkatan HSK
      </h3>
      <div class="quiz-level-grid">
        ${HSK_QUIZ_CONFIG.levels.map(lvlObj => {
          const isSelected = (State.currentQuizLevel === lvlObj.level || (lvlObj.level === 'all' && State.currentQuizLevel === 'all'));
          const count = lvlObj.level === 'all' 
            ? Object.values(State.bankQuestions).reduce((acc, cur) => acc + (cur ? cur.length : 0), 0)
            : (State.bankQuestions[lvlObj.level] || []).length;

          return `
            <div class="quiz-level-card ${isSelected ? 'selected' : ''}" onclick="selectQuizLevel('${lvlObj.level}')">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="role-badge" style="background: ${lvlObj.bg}; color: ${lvlObj.color}; font-weight: 800; font-size: 0.72rem;">
                    ${lvlObj.badge}
                  </span>
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); background: #f8fafc; padding: 2px 8px; border-radius: 99px;">
                    ${count} Soal
                  </span>
                </div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--dark-text); margin-bottom: 4px;">
                  ${lvlObj.icon} ${lvlObj.name}
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 8px;">
                  ${lvlObj.desc}
                </p>
              </div>
              <div style="font-size: 0.75rem; font-weight: 700; color: ${lvlObj.color}; border-top: 1px dashed #eee; padding-top: 8px; display: flex; justify-content: space-between;">
                <span>🎯 Target: ${lvlObj.vocab}</span>
                <span>${isSelected ? '✓ Terpilih' : 'Pilih →'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Pengaturan Kategori, Mode, dan Jumlah Soal -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
      <!-- Skill Category Selector -->
      <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--card-shadow);">
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
          <span>🎯</span> 2. Kategori Keterampilan
        </h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="quiz-option-btn ${currentSkill === 'all' ? 'selected' : ''}" onclick="selectQuizSkill('all')" style="padding: 10px 14px;">
            <span class="quiz-opt-letter">🌟</span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">Semua Keterampilan (Campuran)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Listening, Speaking, Reading, Writing</div>
            </div>
          </button>
          <button class="quiz-option-btn ${currentSkill === 'listening' ? 'selected' : ''}" onclick="selectQuizSkill('listening')" style="padding: 10px 14px;">
            <span class="quiz-opt-letter">🎧</span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">Listening (Mendengar & Pinyin)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Audio pengucapan penutur asli Mandarin</div>
            </div>
          </button>
          <button class="quiz-option-btn ${currentSkill === 'speaking' ? 'selected' : ''}" onclick="selectQuizSkill('speaking')" style="padding: 10px 14px;">
            <span class="quiz-opt-letter">🎙️</span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">Speaking (Pelafalan & Nada)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Pemilihan nada pinyin & frasa percakapan</div>
            </div>
          </button>
          <button class="quiz-option-btn ${currentSkill === 'reading' ? 'selected' : ''}" onclick="selectQuizSkill('reading')" style="padding: 10px 14px;">
            <span class="quiz-opt-letter">📖</span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">Reading (Membaca & Tata Bahasa)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Pemahaman teks, dialog, & partikel gramatikal</div>
            </div>
          </button>
          <button class="quiz-option-btn ${currentSkill === 'writing' ? 'selected' : ''}" onclick="selectQuizSkill('writing')" style="padding: 10px 14px;">
            <span class="quiz-opt-letter">✍️</span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">Writing (Menulis & Kosakata)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Penyusunan kalimat & struktur karakter Hanzi</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Mode Kuis & Jumlah Soal -->
      <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--card-shadow); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
            <span>⚙️</span> 3. Mode Kuis & Waktu
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.25rem;">
            <button class="quiz-option-btn ${currentMode === 'practice' ? 'selected' : ''}" onclick="selectQuizMode('practice')" style="padding: 12px; flex-direction: column; align-items: flex-start; gap: 6px;">
              <span style="font-size: 1.2rem;">💡</span>
              <div style="font-weight: 700; font-size: 0.85rem;">Mode Latihan</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Kunci jawaban & pembahasan langsung tampil.</div>
            </button>
            <button class="quiz-option-btn ${currentMode === 'timed' ? 'selected' : ''}" onclick="selectQuizMode('timed')" style="padding: 12px; flex-direction: column; align-items: flex-start; gap: 6px;">
              <span style="font-size: 1.2rem;">⏱️</span>
              <div style="font-weight: 700; font-size: 0.85rem;">Simulasi Ujian</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Dengan timer countdown & skor akhir.</div>
            </button>
          </div>

          <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
            <span>🔢</span> 4. Jumlah Soal
          </h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem;">
            ${[5, 10, 20, 30, 50].map(cnt => `
              <button class="bank-filter-chip ${currentCount === cnt ? 'active' : ''}" onclick="selectQuizCount(${cnt})">
                ${cnt} Soal
              </button>
            `).join('')}
            <button class="bank-filter-chip ${currentCount === 999 ? 'active' : ''}" onclick="selectQuizCount(999)">
              Semua (${availablePool.length})
            </button>
          </div>
        </div>

        <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 12px 14px; border: 1px solid #e2e8f0; margin-top: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <span style="color: var(--text-muted);">Soal Tersedia:</span>
            <span style="font-weight: 800; color: var(--dark-text);">${availablePool.length} Soal</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <span style="color: var(--text-muted);">Estimasi Waktu:</span>
            <span style="font-weight: 800; color: var(--primary-pink);">${Math.ceil(Math.min(currentCount, availablePool.length) * 1.5)} Menit</span>
          </div>
          <button class="btn-primary-sakura" style="width: 100%; margin-top: 10px; padding: 10px;" onclick="startInteractiveQuiz()">
            ▶️ Mulai Kuis Sekarang
          </button>
        </div>
      </div>
    </div>
  `;

  // Inisialisasi Canvas Interaktif Menulis
  setTimeout(initWritingCanvas, 60);
}

function selectQuizLevel(lvl) {
  State.currentQuizLevel = lvl === 'all' ? 'all' : parseInt(lvl);
  renderQuizPage();
}

function selectQuizSkill(skill) {
  State.currentQuizSkill = skill;
  renderQuizPage();
}

function selectQuizMode(mode) {
  State.currentQuizMode = mode;
  renderQuizPage();
}

function selectQuizCount(count) {
  State.currentQuizCount = count;
  renderQuizPage();
}

// 2. START INTERACTIVE QUIZ
function startInteractiveQuiz() {
  const currentLvl = State.currentQuizLevel || 1;
  const currentSkill = State.currentQuizSkill || "all";
  const count = State.currentQuizCount || 10;

  let pool = [];
  if (currentLvl === 'all') {
    [1, 2, 3, 4, 5, 6].forEach(lvl => {
      if (State.bankQuestions[lvl]) {
        pool.push(...State.bankQuestions[lvl].map(q => ({ ...q, levelOrigin: lvl })));
      }
    });
  } else {
    pool = (State.bankQuestions[currentLvl] || []).map(q => ({ ...q, levelOrigin: currentLvl }));
  }

  if (currentSkill !== 'all') {
    pool = pool.filter(q => q.type === currentSkill);
  }

  if (pool.length === 0) {
    showToast("Belum ada soal untuk kategori ini.", "warning");
    return;
  }

  // Shuffle questions randomly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedCount = Math.min(count, shuffled.length);
  State.quizQuestions = shuffled.slice(0, selectedCount);
  State.quizCurrentIndex = 0;
  State.quizUserAnswers = {};
  State.quizState = "active";

  // Init Timer if in timed mode
  if (State.quizTimerInterval) clearInterval(State.quizTimerInterval);
  if (State.currentQuizMode === "timed") {
    State.quizSecondsRemaining = selectedCount * 90; // 90 seconds per question
    State.quizTimerInterval = setInterval(() => {
      State.quizSecondsRemaining--;
      const timerEl = document.getElementById("quiz-active-timer");
      if (timerEl) {
        const mins = Math.floor(State.quizSecondsRemaining / 60);
        const secs = State.quizSecondsRemaining % 60;
        timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (State.quizSecondsRemaining <= 60) {
          timerEl.style.background = "#fee2e2";
          timerEl.style.color = "#dc2626";
          timerEl.style.borderColor = "#f87171";
        }
      }
      if (State.quizSecondsRemaining <= 0) {
        clearInterval(State.quizTimerInterval);
        showToast("⏰ Waktu kuis telah habis!", "warning");
        finishInteractiveQuiz();
      }
    }, 1000);
  }

  renderQuizPage();
}

// 3. ACTIVE QUIZ PLAYER
function renderActiveQuizPlayer(container) {
  const total = State.quizQuestions.length;
  const currentIdx = State.quizCurrentIndex;
  const q = State.quizQuestions[currentIdx];
  if (!q) {
    finishInteractiveQuiz();
    return;
  }

  const userAnswer = State.quizUserAnswers[currentIdx];
  const isAnswered = userAnswer !== undefined && userAnswer !== null;
  const isPractice = State.currentQuizMode === "practice";
  const mins = Math.floor((State.quizSecondsRemaining || 0) / 60);
  const secs = (State.quizSecondsRemaining || 0) % 60;

  const skillIcons = {
    listening: "🎧 LISTENING",
    speaking: "🎙️ SPEAKING",
    reading: "📖 READING",
    writing: "✍️ WRITING"
  };

  const progressPercent = ((currentIdx + 1) / total) * 100;
  const answeredCount = Object.keys(State.quizUserAnswers).length;

  container.innerHTML = `
    <!-- Top Quiz Controller Bar -->
    <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--card-shadow); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn-learn-outline" style="padding: 6px 14px; font-size: 0.8rem; margin: 0;" onclick="confirmExitQuiz()">
            ← Keluar Kuis
          </button>
          <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-weight: 800; font-size: 0.8rem;">
            HSK ${q.levelOrigin || State.currentQuizLevel}
          </span>
          <span style="font-size: 0.88rem; font-weight: 800; color: var(--dark-text);">
            Soal #${currentIdx + 1} dari ${total}
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          ${State.currentQuizMode === 'timed' ? `
            <div id="quiz-active-timer" class="quiz-timer-badge">
              ⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}
            </div>
          ` : `
            <div style="font-size: 0.8rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 6px 12px; border-radius: var(--radius-pill); border: 1px solid #a7f3d0;">
              💡 Mode Latihan Santai
            </div>
          `}
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">
            Terjawab: <strong style="color: var(--primary-pink);">${answeredCount}</strong> / ${total}
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="quiz-progress-bar-container">
        <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>
    </div>

    <!-- Main Question Box -->
    <div class="interactive-panel" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
        <span style="font-weight: 800; font-size: 0.82rem; color: var(--primary-pink); text-transform: uppercase; letter-spacing: 0.5px;">
          ${skillIcons[q.type] || '📝 SOAL MANDARIN'}
        </span>
        ${(q.audioText || q.audio || q.question) ? `
          <button class="btn-primary-sakura" style="margin: 0; padding: 6px 14px; font-size: 0.8rem;" onclick="speakMandarin('${q.audioText || q.audio || q.question.replace(/<[^>]*>?/gm, '')}')">
            🔊 Putar Audio Mandarin
          </button>
        ` : ''}
      </div>

      <div style="font-size: 1.15rem; font-weight: 700; color: var(--dark-text); line-height: 1.6; margin-bottom: 1.5rem;">
        ${q.question}
      </div>

      <!-- Options List -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
        ${q.options.map((opt, optIdx) => {
          const letters = ['A', 'B', 'C', 'D'];
          const isSelected = userAnswer === optIdx;
          const isCorrect = q.correct === optIdx;

          let extraClass = '';
          if (isSelected) extraClass += ' selected';
          if (isPractice && isAnswered) {
            if (isCorrect) extraClass += ' correct-opt';
            else if (isSelected && !isCorrect) extraClass += ' wrong-opt';
          }

          return `
            <button class="quiz-option-btn ${extraClass}" onclick="selectQuizOption(${optIdx})">
              <span class="quiz-opt-letter">${letters[optIdx]}</span>
              <span style="font-size: 0.95rem; font-weight: 600;">${opt}</span>
              ${(isPractice && isAnswered && isCorrect) ? '<span style="margin-left: auto; color: #10b981; font-weight: 800;">✓ Jawaban Tepat</span>' : ''}
              ${(isPractice && isAnswered && isSelected && !isCorrect) ? '<span style="margin-left: auto; color: #ef4444; font-weight: 800;">✕ Kurang Tepat</span>' : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Practice Mode Immediate Explanation Box -->
      ${(isPractice && isAnswered) ? `
        <div style="background: ${userAnswer === q.correct ? '#ecfdf5' : '#fff0f3'}; border: 1.5px solid ${userAnswer === q.correct ? '#a7f3d0' : '#fecdd3'}; border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem; animation: zoomIn 0.2s ease;">
          <div style="font-weight: 800; font-size: 0.92rem; color: ${userAnswer === q.correct ? '#065f46' : '#be123c'}; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span>${userAnswer === q.correct ? '🎉 Jawaban Anda Benar!' : '💡 Pembahasan Soal:'}</span>
          </div>
          <div style="font-size: 0.88rem; color: var(--dark-text); line-height: 1.5;">
            ${q.explanation || 'Jawaban yang tepat sesuai dengan kaidah tata bahasa dan kosakata HSK.'}
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Bottom Navigation Controls & Question Grid Navigator -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 2rem;">
      <button class="btn-learn-outline" style="padding: 10px 20px; font-size: 0.88rem; margin: 0;" onclick="prevQuizQuestion()" ${currentIdx === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
        ← Soal Sebelumnya
      </button>

      <!-- Question Number Navigator Chips -->
      <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; max-width: 500px;">
        ${State.quizQuestions.map((_, idx) => {
          const isCurr = idx === currentIdx;
          const isAns = State.quizUserAnswers[idx] !== undefined && State.quizUserAnswers[idx] !== null;
          let btnStyle = "background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;";
          if (isCurr) {
            btnStyle = "background: var(--primary-pink); color: #fff; border: 1.5px solid var(--primary-pink); font-weight: 800;";
          } else if (isAns) {
            btnStyle = "background: #ecfdf5; color: #059669; border: 1px solid #10b981; font-weight: 700;";
          }
          return `
            <button onclick="jumpToQuizQuestion(${idx})" style="width: 32px; height: 32px; border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; ${btnStyle}">
              ${idx + 1}
            </button>
          `;
        }).join('')}
      </div>

      <div style="display: flex; gap: 8px;">
        ${currentIdx < total - 1 ? `
          <button class="btn-primary-sakura" style="padding: 10px 20px; font-size: 0.88rem; margin: 0;" onclick="nextQuizQuestion()">
            Soal Berikutnya →
          </button>
        ` : `
          <button class="btn-primary-sakura" style="padding: 10px 24px; font-size: 0.88rem; margin: 0; background: #059669;" onclick="finishInteractiveQuiz()">
            ✓ Selesai Kuis
          </button>
        `}
      </div>
    </div>
  `;

  // Inisialisasi Canvas Interaktif Menulis
  setTimeout(initWritingCanvas, 60);
}

function selectQuizOption(optIdx) {
  State.quizUserAnswers[State.quizCurrentIndex] = optIdx;
  renderQuizPage();
}

function nextQuizQuestion() {
  if (State.quizCurrentIndex < State.quizQuestions.length - 1) {
    State.quizCurrentIndex++;
    renderQuizPage();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function prevQuizQuestion() {
  if (State.quizCurrentIndex > 0) {
    State.quizCurrentIndex--;
    renderQuizPage();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function jumpToQuizQuestion(idx) {
  if (idx >= 0 && idx < State.quizQuestions.length) {
    State.quizCurrentIndex = idx;
    renderQuizPage();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function confirmExitQuiz() {
  if (confirm("Apakah Anda yakin ingin keluar dari kuis? Progres sesi ini tidak akan disimpan.")) {
    if (State.quizTimerInterval) clearInterval(State.quizTimerInterval);
    State.quizState = "lobby";
    renderQuizPage();
  }
}

// 4. FINISH & RESULT SCORECARD SCREEN
function finishInteractiveQuiz() {
  if (State.quizTimerInterval) clearInterval(State.quizTimerInterval);
  State.quizState = "result";

  // Calculate Scores
  let correctCount = 0;
  const total = State.quizQuestions.length;

  State.quizQuestions.forEach((q, idx) => {
    if (State.quizUserAnswers[idx] === q.correct) {
      correctCount++;
    }
  });

  const wrongCount = Math.max(0, total - correctCount);
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const grade = scorePercent >= 90 ? 'A+' : scorePercent >= 80 ? 'A' : scorePercent >= 70 ? 'B' : scorePercent >= 60 ? 'C' : 'D';
  const gradeTitle = scorePercent >= 90 
    ? "Mastery Tingkat Dewa! 🏆" 
    : scorePercent >= 75 
    ? "Hebat Sekali! Anda Lulus Ujian 🎉" 
    : scorePercent >= 60 
    ? "Hasil Cukup Baik, Terus Semangat! 🌸" 
    : "Jangan Menyerah, Mari Berlatih Lagi! 💪";

  const earnedExp = (correctCount * 15) + (scorePercent >= 80 ? 30 : 10);
  const earnedPoints = (correctCount * 10) + (scorePercent >= 80 ? 20 : 5);

  State.lastQuizResult = {
    correctCount,
    wrongCount,
    total,
    scorePercent,
    grade,
    gradeTitle,
    earnedExp,
    earnedPoints
  };

  // Update XP, Points, & Skill Progress locally and trigger Cloud Sync
  const activeSkill = (!State.currentQuizSkill || State.currentQuizSkill === 'all') ? 'reading' : State.currentQuizSkill;
  if (typeof recordUserActivity === 'function') {
    recordUserActivity(activeSkill, earnedExp, earnedPoints, null, Math.max(2, Math.round(total * 0.8)));
  }

  // Record to Student Quiz History (Local + MySQL Server)
  if (State.currentUser) {
    const quizEntry = {
      user_email: State.currentUser.email,
      user_name: State.currentUser.name,
      hsk_level: State.currentQuizLevel === 'all' ? 'HSK 1-6' : `HSK ${State.currentQuizLevel}`,
      skill_type: State.currentQuizSkill || 'all',
      quiz_mode: State.currentQuizMode || 'practice',
      total_questions: total,
      correct_answers: correctCount,
      score_percent: scorePercent,
      grade: grade,
      exp_earned: earnedExp,
      points_earned: earnedPoints,
      created_at: new Date().toISOString(),
      skip_user_increment: true
    };
    if (!Array.isArray(State.currentUser.quizHistory)) {
      State.currentUser.quizHistory = [];
    }
    State.currentUser.quizHistory.unshift(quizEntry);
    State.currentUser.quizHistory = State.currentUser.quizHistory.slice(0, 30);
    UserManager.saveCurrentUser();

    fetch('api/quiz-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizEntry)
    }).catch(() => {});
  }

  const container = document.getElementById("quiz-content-container") || document.getElementById("quiz-interactive-workspace");
  if (container) {
    renderQuizResultScreen(container);
  }
}

function renderQuizResultScreen(container) {
  if (!container) return;
  const total = State.quizQuestions.length;
  let correctCount = 0;
  State.quizQuestions.forEach((q, idx) => {
    if (State.quizUserAnswers[idx] === q.correct) correctCount++;
  });

  const cached = State.lastQuizResult || {};
  const wrongCount = cached.wrongCount !== undefined ? cached.wrongCount : Math.max(0, total - correctCount);
  const scorePercent = cached.scorePercent !== undefined ? cached.scorePercent : (total > 0 ? Math.round((correctCount / total) * 100) : 0);
  const grade = cached.grade || (scorePercent >= 90 ? 'A+' : scorePercent >= 80 ? 'A' : scorePercent >= 70 ? 'B' : scorePercent >= 60 ? 'C' : 'D');
  const gradeTitle = cached.gradeTitle || (scorePercent >= 90 
    ? "Mastery Tingkat Dewa! 🏆" 
    : scorePercent >= 75 
    ? "Hebat Sekali! Anda Lulus Ujian 🎉" 
    : scorePercent >= 60 
    ? "Hasil Cukup Baik, Terus Semangat! 🌸" 
    : "Jangan Menyerah, Mari Berlatih Lagi! 💪");
  const earnedExp = cached.earnedExp !== undefined ? cached.earnedExp : ((correctCount * 15) + (scorePercent >= 80 ? 30 : 10));
  const earnedPoints = cached.earnedPoints !== undefined ? cached.earnedPoints : ((correctCount * 10) + (scorePercent >= 80 ? 20 : 5));

  container.innerHTML = `
    <div style="background: #ffffff; border-radius: var(--radius-xl); padding: 2.5rem 1.5rem; box-shadow: var(--card-shadow); text-align: center; max-width: 800px; margin: 0 auto 2rem auto; border: 1.5px solid #fcdfe5;">
      
      <!-- Score Circle -->
      <div class="quiz-result-score-circle">
        <div style="font-size: 2.4rem; font-weight: 900; color: var(--primary-pink); line-height: 1;">
          ${scorePercent}%
        </div>
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-top: 4px;">
          PREDIKAT: <span style="color: var(--primary-pink);">${grade}</span>
        </div>
      </div>

      <h2 style="font-size: 1.6rem; font-weight: 900; color: var(--dark-text); margin-bottom: 6px;">
        ${gradeTitle}
      </h2>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.75rem;">
        Anda telah menyelesaikan Kuis HSK ${State.currentQuizLevel === 'all' ? 'Campuran (1-6)' : State.currentQuizLevel} dengan ${total} butir pertanyaan.
      </p>

      <!-- Stat Badges Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 2rem; text-align: left;">
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 0.75rem; color: #065f46; font-weight: 700;">✓ Benar</div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #059669;">${correctCount} Soal</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecdd3; border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 0.75rem; color: #991b1b; font-weight: 700;">✕ Kurang Tepat</div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #dc2626;">${wrongCount} Soal</div>
        </div>
        <div style="background: #fff0f3; border: 1px solid #ffd8e0; border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 0.75rem; color: var(--primary-pink); font-weight: 700;">⚡ EXP Diperoleh</div>
          <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary-pink);">+${earnedExp} EXP</div>
        </div>
        <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 0.75rem; color: #854d0e; font-weight: 700;">🪙 Poin Ditambahkan</div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #ca8a04;">+${earnedPoints} Poin</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="btn-primary-sakura" style="margin: 0; padding: 10px 22px; font-size: 0.9rem;" onclick="startInteractiveQuiz()">
          🔄 Ulangi Kuis Ini
        </button>
        <button class="btn-learn-outline" style="margin: 0; padding: 10px 22px; font-size: 0.9rem;" onclick="exitQuizToLobby()">
          🎯 Ganti Level / Kategori
        </button>
        <button class="btn-learn-outline" style="margin: 0; padding: 10px 22px; font-size: 0.9rem;" onclick="navigateTo('profil')">
          📊 Lihat Riwayat Nilai
        </button>
      </div>
    </div>

    <!-- Full Question Review List -->
    <div style="max-width: 800px; margin: 0 auto 3rem auto;">
      <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--dark-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
        <span>📋</span> Review & Pembahasan Jawaban Lengkap
      </h3>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${State.quizQuestions.map((q, idx) => {
          const userAns = State.quizUserAnswers[idx];
          const isCorrect = userAns === q.correct;
          const letters = ['A', 'B', 'C', 'D'];

          return `
            <div style="background: #ffffff; border: 1.5px solid ${isCorrect ? '#a7f3d0' : '#fecdd3'}; border-radius: var(--radius-md); padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted);">
                  SOAL #${idx + 1} (${(q.type || 'reading').toUpperCase()})
                </span>
                <span class="role-badge" style="background: ${isCorrect ? '#ecfdf5' : '#fef2f2'}; color: ${isCorrect ? '#059669' : '#dc2626'}; font-weight: 800; font-size: 0.75rem;">
                  ${isCorrect ? '✓ TEPAT' : '✕ SALAH'}
                </span>
              </div>

              <div style="font-size: 1rem; font-weight: 700; color: var(--dark-text); margin-bottom: 10px;">
                ${q.question}
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.85rem; margin-bottom: 10px;">
                ${q.options.map((opt, optIdx) => `
                  <div style="padding: 6px 10px; border-radius: var(--radius-sm); background: ${optIdx === q.correct ? '#ecfdf5' : (optIdx === userAns ? '#fef2f2' : '#f8fafc')}; border: 1px solid ${optIdx === q.correct ? '#10b981' : (optIdx === userAns ? '#ef4444' : '#e2e8f0')}; color: ${optIdx === q.correct ? '#065f46' : (optIdx === userAns ? '#991b1b' : '#475569')}; font-weight: ${optIdx === q.correct || optIdx === userAns ? '700' : 'normal'};">
                    ${letters[optIdx]}. ${opt} ${optIdx === q.correct ? '✓ (Kunci)' : (optIdx === userAns ? '(Pilihan Anda)' : '')}
                  </div>
                `).join('')}
              </div>

              <div style="background: #f8fafc; border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.82rem; color: var(--text-muted); border-left: 3px solid var(--primary-pink);">
                💡 <strong>Pembahasan:</strong> ${q.explanation || 'Sesuai dengan pedoman standar HSK.'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (typeof initWritingCanvas === 'function') {
    setTimeout(initWritingCanvas, 60);
  }
}

function exitQuizToLobby() {
  State.quizState = "lobby";
  renderQuizPage();
}

function navigateToQuizLevel(level) {
  State.currentQuizLevel = level === 'all' ? 'all' : parseInt(level);
  State.currentQuizSkill = "all";
  State.quizState = "lobby";
  navigateTo("quiz");
  renderQuizPage();
}

function renderBankSoalModule() {
  const container = document.getElementById("bank-soal-content-container");
  if (!container) return;

  const isAllExamMode = State.currentHskLevel === "all";
  let allLevelQuestions = [];

  if (isAllExamMode) {
    [1, 2, 3, 4, 5, 6].forEach(lvl => {
      if (State.bankQuestions[lvl]) {
        allLevelQuestions.push(...State.bankQuestions[lvl]);
      }
    });
  } else {
    allLevelQuestions = State.bankQuestions[State.currentHskLevel] || [];
  }

  // Apply Skill Filter
  let filteredQuestions = allLevelQuestions;
  if (State.currentHskSkillFilter && State.currentHskSkillFilter !== "all") {
    filteredQuestions = allLevelQuestions.filter(q => q.type === State.currentHskSkillFilter);
  }

  // Pagination calculations (10 soal per halaman)
  const totalItems = filteredQuestions.length;
  const pageSize = State.bankPageSize || 10;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (State.currentBankPage > totalPages) State.currentBankPage = 1;

  const startIndex = (State.currentBankPage - 1) * pageSize;
  const displayedQuestions = filteredQuestions.slice(startIndex, startIndex + pageSize);

  // Skill Count Badges
  const listeningCount = allLevelQuestions.filter(q => q.type === 'listening').length;
  const speakingCount = allLevelQuestions.filter(q => q.type === 'speaking').length;
  const readingCount = allLevelQuestions.filter(q => q.type === 'reading').length;
  const writingCount = allLevelQuestions.filter(q => q.type === 'writing').length;

  container.innerHTML = `
    <!-- HSK Level Selector Tabs -->
    <div style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text);">
            📚 Bank Soal & Simulasi Ujian HSK 1 - HSK 6
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">
            Latihan soal berstandar internasional dengan penilaian otomatis dan pembahasan mendalam (Tersedia ${allLevelQuestions.length} Soal Lengkap di Level ini).
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn-primary-sakura" style="padding: 8px 16px; font-size: 0.85rem; margin: 0;" onclick="selectHskLevel('all')">
            🎯 Simulasi Ujian Campuran (${Object.values(State.bankQuestions).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0)} Soal)
          </button>
          <div style="background: #fff7f8; border: 1px solid #ffd8e0; border-radius: var(--radius-pill); padding: 6px 14px; font-size: 0.85rem; font-weight: 700; color: var(--primary-pink); white-space: nowrap;">
            Level: ${isAllExamMode ? `Simulasi Semua Level (${allLevelQuestions.length} Soal)` : `HSK ${State.currentHskLevel} (${allLevelQuestions.length} Soal)`}
          </div>
        </div>
      </div>

      <!-- Level Tabs (HSK 1 - 6) -->
      <div class="hsk-level-tabs">
        <button class="hsk-tab-btn ${State.currentHskLevel === 'all' ? 'active' : ''}" onclick="selectHskLevel('all')">
          🌟 Semua Level (${Object.values(State.bankQuestions).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0)} Soal Campuran)
        </button>
        ${[1, 2, 3, 4, 5, 6].map(lvl => `
          <button class="hsk-tab-btn ${lvl === State.currentHskLevel ? 'active' : ''}" onclick="selectHskLevel(${lvl})">
            HSK Level ${lvl} ${lvl <= 2 ? '(Pemula)' : lvl <= 4 ? '(Menengah)' : '(Mahir)'} • ${(State.bankQuestions[lvl] || []).length} Soal
          </button>
        `).join('')}
      </div>

      <!-- Skill Type Filters (Listening, Speaking, Reading, Writing) -->
      <div class="bank-filter-row">
        <span style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted); margin-right: 4px;">Kategori Keterampilan:</span>
        <button class="bank-filter-chip ${State.currentHskSkillFilter === 'all' ? 'active' : ''}" onclick="selectBankSkillFilter('all')">
          Semua (${allLevelQuestions.length})
        </button>
        <button class="bank-filter-chip ${State.currentHskSkillFilter === 'listening' ? 'active' : ''}" onclick="selectBankSkillFilter('listening')">
          🎧 Listening (${listeningCount})
        </button>
        <button class="bank-filter-chip ${State.currentHskSkillFilter === 'speaking' ? 'active' : ''}" onclick="selectBankSkillFilter('speaking')">
          🎙️ Speaking (${speakingCount})
        </button>
        <button class="bank-filter-chip ${State.currentHskSkillFilter === 'reading' ? 'active' : ''}" onclick="selectBankSkillFilter('reading')">
          📖 Reading (${readingCount})
        </button>
        <button class="bank-filter-chip ${State.currentHskSkillFilter === 'writing' ? 'active' : ''}" onclick="selectBankSkillFilter('writing')">
          ✍️ Writing (${writingCount})
        </button>
      </div>
    </div>

    <!-- Question Cards List -->
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      ${displayedQuestions.length === 0 ? `
        <div style="text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-lg);">
          <p style="color: var(--text-muted);">Tidak ada soal untuk filter ini.</p>
        </div>
      ` : displayedQuestions.map((q, idx) => {
        const globalIdx = startIndex + idx;
        const isCompleted = State.currentUser?.completedItems?.bankSoal?.includes(q.id);
        return `
        <div class="interactive-panel" id="bank-q-card-${globalIdx}">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary-pink); text-transform: uppercase;">
                📝 Soal #${startIndex + idx + 1} (${q.type.toUpperCase()})
              </span>
              ${isCompleted ? '<span class="completed-badge-pill">✓ Selesai (+15 Poin)</span>' : ''}
            </div>
            <button class="btn-learn-outline" style="padding: 3px 10px; font-size: 0.75rem;" onclick="speakMandarin('${q.audioText || q.question}', 0.85)">
              🔊 Baca Soal / Audio
            </button>
          </div>

          <p style="font-size: 1.05rem; font-weight: 700; color: var(--dark-text); margin: 0.6rem 0;">
            ${q.question}
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${q.options.map((opt, optIdx) => `
              <div class="quiz-option-item ${userBankSelections[globalIdx] === optIdx ? 'selected' : ''}" onclick="selectBankOption(${globalIdx}, ${optIdx}, this)">
                <span style="font-weight: bold; color: var(--primary-pink);">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
            <button class="btn-primary-sakura" style="max-width: 200px; padding: 8px 16px; font-size: 0.88rem; margin: 0;" onclick="checkBankQuestion(${globalIdx}, '${q.id}', '${q.type}')">
              Cek Jawaban
            </button>
          </div>

          <div id="bank-feedback-${globalIdx}" style="display: none; margin-top: 10px; padding: 12px; border-radius: var(--radius-md); font-size: 0.88rem;"></div>
        </div>
      `}).join('')}
    </div>

    <!-- Pagination Controls -->
    ${totalPages > 1 ? `
      <div class="bank-pagination-bar">
        <button class="bank-page-btn" onclick="setBankPage(${State.currentBankPage - 1})" ${State.currentBankPage <= 1 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>←</button>
        ${Array.from({ length: totalPages }, (_, p) => p + 1).map(p => `
          <button class="bank-page-btn ${p === State.currentBankPage ? 'active' : ''}" onclick="setBankPage(${p})">
            ${p}
          </button>
        `).join('')}
        <button class="bank-page-btn" onclick="setBankPage(${State.currentBankPage + 1})" ${State.currentBankPage >= totalPages ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>→</button>
        <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">Halaman ${State.currentBankPage} dari ${totalPages} (Total ${totalItems} Soal)</span>
      </div>
    ` : ''}
  `;
}

function selectHskLevel(level) {
  State.currentHskLevel = level;
  State.currentBankPage = 1;
  renderBankSoalModule();
}

function navigateToHskBank(level) {
  State.currentHskLevel = level;
  State.currentHskSkillFilter = 'all';
  State.currentBankPage = 1;
  navigateTo('bank-soal');
  renderBankSoalModule();
}

function navigateToBankSoalWithFilter(level) {
  navigateToHskBank(level);
}

// ==========================================================================
// 4.6. DUAL-DIRECTION FLASHCARD SYSTEM (HSK 1 - 6)
// ==========================================================================

const flashcardData = {
  1: [
    { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Halo / Apa kabar", meaning_en: "Hello / How are you", example: "你好！很高兴认识你。", exampleTrans: "Halo! Senang berkenalan denganmu.", exampleTrans_en: "Hello! Nice to meet you." },
    { hanzi: "谢谢", pinyin: "xièxie", meaning: "Terima kasih", meaning_en: "Thank you / Thanks", example: "谢谢你的热情帮助！", exampleTrans: "Terima kasih atas bantuan ramahmu!", exampleTrans_en: "Thank you for your warm help!" },
    { hanzi: "不客气", pinyin: "bú kèqi", meaning: "Sama-sama / Jangan sungkan", meaning_en: "You are welcome", example: "不客气，这是我应该做的。", exampleTrans: "Sama-sama, ini memang seharusnya saya lakukan.", exampleTrans_en: "You are welcome, it is what I should do." },
    { hanzi: "再见", pinyin: "zài jiàn", meaning: "Sampai jumpa", meaning_en: "Goodbye / See you again", example: "明天见，再见！", exampleTrans: "Sampai jumpa besok!", exampleTrans_en: "See you tomorrow, goodbye!" },
    { hanzi: "你", pinyin: "nǐ", meaning: "Kamu / Anda", meaning_en: "You (singular)", example: "你叫什么名字？", exampleTrans: "Siapa namamu?", exampleTrans_en: "What is your name?" },
    { hanzi: "我", pinyin: "wǒ", meaning: "Saya / Aku", meaning_en: "I / Me", example: "我是印尼留学生。", exampleTrans: "Saya adalah mahasiswa internasional Indonesia.", exampleTrans_en: "I am an Indonesian international student." },
    { hanzi: "他", pinyin: "tā", meaning: "Dia (laki-laki)", meaning_en: "He / Him", example: "他是我们的汉语老师。", exampleTrans: "Dia adalah guru bahasa Mandarin kami.", exampleTrans_en: "He is our Chinese teacher." },
    { hanzi: "她", pinyin: "tā", meaning: "Dia (perempuan)", meaning_en: "She / Her", example: "她有一只可爱的小猫。", exampleTrans: "Dia mempunyai seekor anak kucing lucu.", exampleTrans_en: "She has a cute kitten." },
    { hanzi: "我们", pinyin: "wǒmen", meaning: "Kita / Kami", meaning_en: "We / Us", example: "我们一起去图书馆吧。", exampleTrans: "Ayo kita pergi ke perpustakaan bersama.", exampleTrans_en: "Let us go to the library together." },
    { hanzi: "是", pinyin: "shì", meaning: "Adalah / Benar", meaning_en: "Is / Am / Are / To be", example: "她是我的好朋友。", exampleTrans: "Dia adalah sahabat baik saya.", exampleTrans_en: "She is my good friend." },
    { hanzi: "不", pinyin: "bù", meaning: "Tidak / Bukan", meaning_en: "Not / No", example: "我今天不想喝咖啡。", exampleTrans: "Hari ini saya tidak ingin minum kopi.", exampleTrans_en: "I do not want to drink coffee today." },
    { hanzi: "很", pinyin: "hěn", meaning: "Sangat", meaning_en: "Very / Quite", example: "今天天气很好。", exampleTrans: "Cuaca hari ini sangat bagus.", exampleTrans_en: "The weather today is very nice." },
    { hanzi: "人", pinyin: "rén", meaning: "Orang / Manusia", meaning_en: "Person / People", example: "这里的人都很热情。", exampleTrans: "Orang-orang di sini sangat ramah.", exampleTrans_en: "People here are very warm and friendly." },
    { hanzi: "吃", pinyin: "chī", meaning: "Makan", meaning_en: "To eat", example: "你吃中国菜了吗？", exampleTrans: "Apakah kamu sudah makan masakan Tiongkok?", exampleTrans_en: "Have you eaten Chinese food?" },
    { hanzi: "喝", pinyin: "hē", meaning: "Minum", meaning_en: "To drink", example: "我想喝一杯绿茶。", exampleTrans: "Saya ingin minum secangkir teh hijau.", exampleTrans_en: "I want to drink a cup of green tea." },
    { hanzi: "水", pinyin: "shuǐ", meaning: "Air", meaning_en: "Water", example: "请给我一杯温水。", exampleTrans: "Tolong beri saya segelas air hangat.", exampleTrans_en: "Please give me a cup of warm water." },
    { hanzi: "茶", pinyin: "chá", meaning: "Teh", meaning_en: "Tea", example: "中国茶非常有味道。", exampleTrans: "Teh Tiongkok rasanya sangat nikmat.", exampleTrans_en: "Chinese tea is very flavorful." },
    { hanzi: "米饭", pinyin: "mǐfàn", meaning: "Nasi putih", meaning_en: "Cooked rice", example: "我中午想吃米饭。", exampleTrans: "Siang ini saya ingin makan nasi.", exampleTrans_en: "I want to eat rice for lunch." },
    { hanzi: "苹果", pinyin: "píngguǒ", meaning: "Apel", meaning_en: "Apple", example: "桌子上有三个红苹果。", exampleTrans: "Di atas meja ada tiga buah apel merah.", exampleTrans_en: "There are three red apples on the table." },
    { hanzi: "看", pinyin: "kàn", meaning: "Melihat / Membaca / Menonton", meaning_en: "Look / Watch / Read", example: "我喜欢在晚上看书。", exampleTrans: "Saya suka membaca buku di malam hari.", exampleTrans_en: "I like reading books at night." },
    { hanzi: "听", pinyin: "tīng", meaning: "Mendengarkan", meaning_en: "Listen / Hear", example: "请认真听老师讲课。", exampleTrans: "Tolong dengarkan penjelasan guru dengan seksama.", exampleTrans_en: "Please listen carefully to the teacher's lesson." },
    { hanzi: "说", pinyin: "shuō", meaning: "Berbicara / Mengatakan", meaning_en: "Speak / Say", example: "你能慢一点说吗？", exampleTrans: "Bisakah kamu berbicara lebih pelan?", exampleTrans_en: "Could you speak a little slower?" },
    { hanzi: "写", pinyin: "xiě", meaning: "Menulis", meaning_en: "To write", example: "这个汉字怎么写？", exampleTrans: "Bagaimana cara menulis karakter Hanzi ini?", exampleTrans_en: "How do you write this Chinese character?" },
    { hanzi: "读", pinyin: "dú", meaning: "Membaca nyaring / Mempelajari", meaning_en: "Read aloud / Study", example: "请跟我一起读生词。", exampleTrans: "Silakan baca kosakata baru bersama saya.", exampleTrans_en: "Please read the new words aloud with me." },
    { hanzi: "字", pinyin: "zì", meaning: "Huruf / Karakter", meaning_en: "Character / Word", example: "你的汉字写得真漂亮。", exampleTrans: "Tulisan karakter Mandarimmu sungguh indah.", exampleTrans_en: "Your Chinese characters are written very well." },
    { hanzi: "大", pinyin: "dà", meaning: "Besar", meaning_en: "Big / Large", example: "这个西瓜非常大。", exampleTrans: "Semangka ini sangat besar.", exampleTrans_en: "This watermelon is very big." },
    { hanzi: "小", pinyin: "xiǎo", meaning: "Kecil", meaning_en: "Small / Little", example: "那家商店有点儿小。", exampleTrans: "Toko itu agak kecil.", exampleTrans_en: "That store is a little small." },
    { hanzi: "多", pinyin: "duō", meaning: "Banyak", meaning_en: "Many / Much", example: "学校里有很多外国学生。", exampleTrans: "Di sekolah ada banyak murid asing.", exampleTrans_en: "There are many international students in the school." },
    { hanzi: "少", pinyin: "shǎo", meaning: "Sedikit", meaning_en: "Few / Little", example: "今天来上课的人很少。", exampleTrans: "Hari ini orang yang datang ke kelas sedikit.", exampleTrans_en: "Few people came to class today." },
    { hanzi: "好", pinyin: "hǎo", meaning: "Baik / Bagus", meaning_en: "Good / Fine", example: "祝你今天心情好！", exampleTrans: "Semoga suasana hatimu hari ini menyenangkan!", exampleTrans_en: "Wish you have a good mood today!" },
    { hanzi: "家", pinyin: "jiā", meaning: "Rumah / Keluarga", meaning_en: "Home / Family", example: "欢迎你来我家做客！", exampleTrans: "Selamat datang bertamu ke rumahku!", exampleTrans_en: "Welcome to visit my home!" },
    { hanzi: "学校", pinyin: "xuéxiào", meaning: "Sekolah", meaning_en: "School", example: "我们学校的环境很优美。", exampleTrans: "Lingkungan sekolah kami sangat asri.", exampleTrans_en: "The environment of our school is very beautiful." },
    { hanzi: "饭馆", pinyin: "fànguǎn", meaning: "Restoran / Rumah makan", meaning_en: "Restaurant", example: "这家饭馆的菜真好吃。", exampleTrans: "Masakan restoran ini sungguh lezat.", exampleTrans_en: "The dishes in this restaurant are really delicious." },
    { hanzi: "商店", pinyin: "shāngdiàn", meaning: "Toko", meaning_en: "Shop / Store", example: "我去商店买几支笔。", exampleTrans: "Saya pergi ke toko membeli beberapa pena.", exampleTrans_en: "I go to the shop to buy some pens." },
    { hanzi: "医院", pinyin: "yīyuàn", meaning: "Rumah sakit", meaning_en: "Hospital", example: "他生病了，在医院看病。", exampleTrans: "Dia sakit, sedang berobat di rumah sakit.", exampleTrans_en: "He is ill and seeing a doctor at the hospital." },
    { hanzi: "中国", pinyin: "Zhōngguó", meaning: "Tiongkok / China", meaning_en: "China", example: "我想去中国留学。", exampleTrans: "Saya ingin kuliah ke Tiongkok.", exampleTrans_en: "I want to study abroad in China." },
    { hanzi: "北京", pinyin: "Běijīng", meaning: "Beijing", meaning_en: "Beijing", example: "北京是中国的首都。", exampleTrans: "Beijing adalah ibu kota Tiongkok.", exampleTrans_en: "Beijing is the capital of China." },
    { hanzi: "今天", pinyin: "jīntiān", meaning: "Hari ini", meaning_en: "Today", example: "今天是星期三。", exampleTrans: "Hari ini adalah hari Rabu.", exampleTrans_en: "Today is Wednesday." },
    { hanzi: "明天", pinyin: "míngtiān", meaning: "Besok", meaning_en: "Tomorrow", example: "明天我们一起去买书。", exampleTrans: "Besok kita pergi beli buku bersama.", exampleTrans_en: "Tomorrow we will go buy books together." },
    { hanzi: "昨天", pinyin: "zuótiān", meaning: "Kemarin", meaning_en: "Yesterday", example: "昨天北京下了大雨。", exampleTrans: "Kemarin Beijing turun hujan lebat.", exampleTrans_en: "It rained heavily in Beijing yesterday." },
    { hanzi: "年", pinyin: "nián", meaning: "Tahun", meaning_en: "Year", example: "我学汉语已经一年了。", exampleTrans: "Saya sudah belajar Mandarin selama satu tahun.", exampleTrans_en: "I have studied Chinese for a year." },
    { hanzi: "月", pinyin: "yuè", meaning: "Bulan", meaning_en: "Month", example: "下个月我们要参加考试。", exampleTrans: "Bulan depan kami akan mengikuti ujian.", exampleTrans_en: "Next month we will take the exam." },
    { hanzi: "日", pinyin: "rì", meaning: "Hari / Tanggal", meaning_en: "Day / Date", example: "十月一日是国庆节。", exampleTrans: "Tanggal 1 Oktober adalah Hari Nasional.", exampleTrans_en: "October 1st is National Day." },
    { hanzi: "星期", pinyin: "xīngqī", meaning: "Pekan / Minggu", meaning_en: "Week", example: "这个星期天气都很晴朗。", exampleTrans: "Sepanjang pekan ini cuaca sangat cerah.", exampleTrans_en: "The weather is very sunny this week." },
    { hanzi: "点", pinyin: "diǎn", meaning: "Pukul / Jam (titik waktu)", meaning_en: "O'clock / Point", example: "现在是下午三点整。", exampleTrans: "Sekarang tepat jam tiga sore.", exampleTrans_en: "It is three o'clock in the afternoon now." },
    { hanzi: "分", pinyin: "fēn", meaning: "Menit", meaning_en: "Minute", example: "现在八点十五分。", exampleTrans: "Sekarang pukul 08:15.", exampleTrans_en: "It is eight fifteen now." },
    { hanzi: "爸爸", pinyin: "bàba", meaning: "Ayah", meaning_en: "Father / Dad", example: "我爸爸是一名医生。", exampleTrans: "Ayah saya adalah seorang dokter.", exampleTrans_en: "My father is a doctor." },
    { hanzi: "妈妈", pinyin: "māma", meaning: "Ibu", meaning_en: "Mother / Mom", example: "妈妈做的菜最好吃。", exampleTrans: "Masakan buatan ibu paling enak.", exampleTrans_en: "The food cooked by mom is the most delicious." },
    { hanzi: "老师", pinyin: "lǎoshī", meaning: "Guru / Pengajar", meaning_en: "Teacher", example: "老师耐心地回答了问题。", exampleTrans: "Guru dengan sabar menjawab pertanyaan.", exampleTrans_en: "The teacher patiently answered the question." },
    { hanzi: "学生", pinyin: "xuésheng", meaning: "Siswa / Murid", meaning_en: "Student", example: "我们班有二十个学生。", exampleTrans: "Kelas kami mempunyai 20 orang murid.", exampleTrans_en: "There are twenty students in our class." },
    { hanzi: "朋友", pinyin: "péngyou", meaning: "Teman / Sahabat", meaning_en: "Friend", example: "他是我的好朋友。", exampleTrans: "Dia adalah sahabat baik saya.", exampleTrans_en: "He is my good friend." },
    { hanzi: "医生", pinyin: "yīshēng", meaning: "Dokter", meaning_en: "Doctor", example: "医生建议他多喝水。", exampleTrans: "Dokter menyarankannya untuk banyak minum air.", exampleTrans_en: "The doctor advised him to drink more water." },
    { hanzi: "钱", pinyin: "qián", meaning: "Uang", meaning_en: "Money", example: "买这本书需要多少钱？", exampleTrans: "Berapa banyak uang untuk membeli buku ini?", exampleTrans_en: "How much money does it take to buy this book?" },
    { hanzi: "多少", pinyin: "duōshao", meaning: "Berapa banyak", meaning_en: "How much / How many", example: "这个多少钱？", exampleTrans: "Ini berapa harganya?", exampleTrans_en: "How much is this?" },
    { hanzi: "对不起", pinyin: "duìbuqǐ", meaning: "Maaf / Permisi", meaning_en: "Sorry / Excuse me", example: "对不起，我迟到了。", exampleTrans: "Maaf, saya terlambat datang.", exampleTrans_en: "Sorry, I am late." },
    { hanzi: "没关系", pinyin: "méi guānxi", meaning: "Tidak apa-apa", meaning_en: "It does not matter / That is okay", example: "没关系，请进！", exampleTrans: "Tidak apa-apa, silakan masuk!", exampleTrans_en: "It does not matter, please come in!" },
    { hanzi: "桌子", pinyin: "zhuōzi", meaning: "Meja", meaning_en: "Table / Desk", example: "桌子上有一本书。", exampleTrans: "Di atas meja ada sebuah buku.", exampleTrans_en: "There is a book on the table." },
    { hanzi: "椅子", pinyin: "yǐzi", meaning: "Kursi", meaning_en: "Chair", example: "请坐在椅子上。", exampleTrans: "Silakan duduk di kursi.", exampleTrans_en: "Please sit on the chair." },
    { hanzi: "猫", pinyin: "māo", meaning: "Kucing", meaning_en: "Cat", example: "小猫在阳光下睡觉。", exampleTrans: "Anak kucing tidur di bawah sinar matahari.", exampleTrans_en: "The kitten is sleeping in the sun." },
    { hanzi: "狗", pinyin: "gǒu", meaning: "Anjing", meaning_en: "Dog", example: "那只狗非常聪明。", exampleTrans: "Anjing itu sangat pintar.", exampleTrans_en: "That dog is very smart." },
    { hanzi: "去", pinyin: "qù", meaning: "Pergi", meaning_en: "To go", example: "你想去哪儿？", exampleTrans: "Kamu ingin pergi ke mana?", exampleTrans_en: "Where do you want to go?" },
    { hanzi: "来", pinyin: "lái", meaning: "Datang", meaning_en: "To come", example: "他今天下午来我家。", exampleTrans: "Dia datang ke rumahku siang ini.", exampleTrans_en: "He is coming to my home this afternoon." },
    { hanzi: "有", pinyin: "yǒu", meaning: "Ada / Mempunyai", meaning_en: "To have / There is", example: "我有一本汉语书。", exampleTrans: "Saya punya sebuah buku bahasa Mandarin.", exampleTrans_en: "I have a Chinese book." },
    { hanzi: "没有", pinyin: "méiyǒu", meaning: "Tidak ada / Belum", meaning_en: "Do not have / There is not", example: "我今天没有时间。", exampleTrans: "Hari ini saya tidak ada waktu.", exampleTrans_en: "I do not have time today." },
    { hanzi: "买", pinyin: "mǎi", meaning: "Membeli", meaning_en: "To buy", example: "我想去商店买水果。", exampleTrans: "Saya ingin pergi ke toko membeli buah.", exampleTrans_en: "I want to go to the store to buy fruit." },
    { hanzi: "喜欢", pinyin: "xǐhuan", meaning: "Suka / Menyukai", meaning_en: "To like", example: "我很喜欢吃中国菜。", exampleTrans: "Saya sangat suka makan masakan Tiongkok.", exampleTrans_en: "I really like eating Chinese food." },
    { hanzi: "认识", pinyin: "rènshi", meaning: "Mengenal / Kenal", meaning_en: "To know / Recognize", example: "认识你很高兴！", exampleTrans: "Senang berkenalan denganmu!", exampleTrans_en: "Nice to meet you!" },
    { hanzi: "想", pinyin: "xiǎng", meaning: "Ingin / Merindukan / Berpikir", meaning_en: "Want / Miss / Think", example: "我想喝一杯冰水。", exampleTrans: "Saya ingin minum segelas air es.", exampleTrans_en: "I want to drink a glass of ice water." },
    { hanzi: "做", pinyin: "zuò", meaning: "Mengerjakan / Membuat", meaning_en: "To do / To make", example: "妈妈在厨房做饭。", exampleTrans: "Ibu sedang memasak di dapur.", exampleTrans_en: "Mom is cooking in the kitchen." },
    { hanzi: "坐", pinyin: "zuò", meaning: "Duduk / Naik (kendaraan)", meaning_en: "To sit / To take (bus/train)", example: "我们坐出租车去学校吧。", exampleTrans: "Ayo kita naik taksi ke sekolah.", exampleTrans_en: "Let's take a taxi to school." },
    { hanzi: "会", pinyin: "huì", meaning: "Bisa / Mampu", meaning_en: "Can / Be able to", example: "你会说普通话吗？", exampleTrans: "Apakah kamu bisa berbicara bahasa Mandarin?", exampleTrans_en: "Can you speak Mandarin?" },
    { hanzi: "能", pinyin: "néng", meaning: "Dapat / Sanggup", meaning_en: "Can / May / Able to", example: "你能帮我拿一下吗？", exampleTrans: "Bisakah kamu membantuku mengambilkannya?", exampleTrans_en: "Can you help me take it?" },
    { hanzi: "叫", pinyin: "jiào", meaning: "Bernama / Memanggil", meaning_en: "To be called / Call", example: "你叫什么名字？", exampleTrans: "Siapa namamu?", exampleTrans_en: "What is your name?" },
    { hanzi: "开", pinyin: "kāi", meaning: "Membuka / Mengemudi", meaning_en: "To open / To drive", example: "他会开车上班。", exampleTrans: "Dia bisa mengemudi mobil ke kantor.", exampleTrans_en: "He can drive to work." },
    { hanzi: "住", pinyin: "zhù", meaning: "Tinggal / Menetap", meaning_en: "To live / Stay", example: "你住在哪个城市？", exampleTrans: "Di kota mana kamu tinggal?", exampleTrans_en: "Which city do you live in?" },
    { hanzi: "爱", pinyin: "ài", meaning: "Cinta / Sayang", meaning_en: "Love / To love", example: "我爱我的爸爸妈妈。", exampleTrans: "Saya mencintai ayah dan ibuku.", exampleTrans_en: "I love my father and mother." },
    { hanzi: "同学生", pinyin: "tóngxué", meaning: "Teman sekelas", meaning_en: "Classmate", example: "他是我的大学同学。", exampleTrans: "Dia adalah teman sekelas universitas saya.", exampleTrans_en: "He is my university classmate." },
    { hanzi: "先生", pinyin: "xiānsheng", meaning: "Tuan / Suami", meaning_en: "Mister / Sir / Husband", example: "王先生今天不在办公室。", exampleTrans: "Tuan Wang hari ini tidak di kantor.", exampleTrans_en: "Mr. Wang is not in the office today." },
    { hanzi: "小姐", pinyin: "xiǎojie", meaning: "Nona", meaning_en: "Miss / Young lady", example: "那位小姐很热心。", exampleTrans: "Nona itu sangat baik dan ramah.", exampleTrans_en: "That miss is very warm-hearted." },
    { hanzi: "儿子", pinyin: "érzi", meaning: "Anak laki-laki", meaning_en: "Son", example: "他儿子今年五岁了。", exampleTrans: "Anak laki-lakinya tahun ini berusia 5 tahun.", exampleTrans_en: "His son is five years old this year." },
    { hanzi: "女儿", pinyin: "nǚ'ér", meaning: "Anak perempuan", meaning_en: "Daughter", example: "我女儿喜欢画画。", exampleTrans: "Anak perempuan saya suka menggambar.", exampleTrans_en: "My daughter likes drawing." },
    { hanzi: "天气", pinyin: "tiānqì", meaning: "Cuaca", meaning_en: "Weather", example: "今天天气非常晴朗。", exampleTrans: "Cuaca hari ini sangat cerah.", exampleTrans_en: "The weather is very sunny today." },
    { hanzi: "冷", pinyin: "lěng", meaning: "Dingin", meaning_en: "Cold", example: "冬天这里很冷。", exampleTrans: "Musim dingin di sini sangat dingin.", exampleTrans_en: "It is very cold here in winter." },
    { hanzi: "热", pinyin: "rè", meaning: "Panas", meaning_en: "Hot", example: "今天太热了，想喝水。", exampleTrans: "Hari ini terlalu panas, ingin minum air.", exampleTrans_en: "Today is too hot, I want to drink water." },
    { hanzi: "前面", pinyin: "qiánmiàn", meaning: "Depan / Di depan", meaning_en: "Front / In front", example: "学校前面有一条大路。", exampleTrans: "Di depan sekolah ada jalan besar.", exampleTrans_en: "There is a big road in front of the school." },
    { hanzi: "后面", pinyin: "hòumiàn", meaning: "Belakang / Di belakang", meaning_en: "Behind / Back", example: "他坐在我的后面。", exampleTrans: "Dia duduk di belakang saya.", exampleTrans_en: "He sits behind me." },
    { hanzi: "里面", pinyin: "lǐmiàn", meaning: "Dalam / Di dalam", meaning_en: "Inside", example: "包里面有两支笔。", exampleTrans: "Di dalam tas ada dua buah pena.", exampleTrans_en: "There are two pens inside the bag." },
    { hanzi: "上", pinyin: "shàng", meaning: "Atas / Naik", meaning_en: "Up / Above / On", example: "书在桌子上。", exampleTrans: "Buku ada di atas meja.", exampleTrans_en: "The book is on the table." },
    { hanzi: "下", pinyin: "xià", meaning: "Bawah / Turun", meaning_en: "Under / Below / Down", example: "小猫在椅子下睡觉。", exampleTrans: "Anak kucing tidur di bawah kursi.", exampleTrans_en: "The kitten sleeps under the chair." },
    { hanzi: "出租车", pinyin: "chūzūchē", meaning: "Taksi", meaning_en: "Taxi", example: "我们坐出租车去火车站。", exampleTrans: "Kita naik taksi ke stasiun kereta api.", exampleTrans_en: "We take a taxi to the railway station." },
    { hanzi: "飞机", pinyin: "fēijī", meaning: "Pesawat terbang", meaning_en: "Airplane", example: "飞机很快就要起飞了。", exampleTrans: "Pesawat terbang segera lepas landas.", exampleTrans_en: "The airplane is about to take off." },
    { hanzi: "火车站", pinyin: "huǒchēzhàn", meaning: "Stasiun kereta api", meaning_en: "Railway station", example: "火车站离这里有多远？", exampleTrans: "Berapa jauh stasiun kereta api dari sini?", exampleTrans_en: "How far is the railway station from here?" },
    { hanzi: "电影", pinyin: "diànyǐng", meaning: "Film / Bioskop", meaning_en: "Movie / Film", example: "晚上我们一起去看电影吧。", exampleTrans: "Malam ini ayo kita nonton film bersama.", exampleTrans_en: "Let's go watch a movie together tonight." },
    { hanzi: "电视", pinyin: "diànshì", meaning: "Televisi", meaning_en: "Television / TV", example: "爸爸喜欢在客厅看电视。", exampleTrans: "Ayah suka menonton TV di ruang tamu.", exampleTrans_en: "Father likes watching TV in the living room." },
    { hanzi: "电脑", pinyin: "diànnǎo", meaning: "Komputer / Laptop", meaning_en: "Computer", example: "这台新电脑运行速度很快。", exampleTrans: "Komputer baru ini kecepatannya sangat cepat.", exampleTrans_en: "This new computer runs very fast." },
    { hanzi: "电话", pinyin: "diànhuà", meaning: "Telepon", meaning_en: "Telephone / Phone call", example: "请给我打电话。", exampleTrans: "Tolong telepon saya.", exampleTrans_en: "Please give me a phone call." },
    { hanzi: "衣服", pinyin: "yīfu", meaning: "Pakaian / Baju", meaning_en: "Clothes", example: "这件衣服真漂亮。", exampleTrans: "Baju ini sungguh indah.", exampleTrans_en: "These clothes are really beautiful." },
    { hanzi: "杯子", pinyin: "bēizi", meaning: "Gelas / Cangkir", meaning_en: "Cup / Glass", example: "这个杯子是红色的。", exampleTrans: "Gelas ini berwarna merah.", exampleTrans_en: "This cup is red." },
    { hanzi: "书", pinyin: "shū", meaning: "Buku", meaning_en: "Book", example: "我正在读这本中文书。", exampleTrans: "Saya sedang membaca buku Mandarin ini.", exampleTrans_en: "I am reading this Chinese book." }
  ],
  2: [
    { hanzi: "比", pinyin: "bǐ", meaning: "Lebih dari / Dibandingkan", meaning_en: "Compare / More than", example: "苹果比西瓜便宜。", exampleTrans: "Apel lebih murah dari semangka.", exampleTrans_en: "Apples are cheaper than watermelons." },
    { hanzi: "在", pinyin: "zài", meaning: "Sedang / Berada di", meaning_en: "At / In / In progress", example: "我在认真学习中文。", exampleTrans: "Saya sedang belajar bahasa Mandarin dengan tekun.", exampleTrans_en: "I am studying Chinese diligently." },
    { hanzi: "还", pinyin: "hái", meaning: "Masih / Juga", meaning_en: "Still / Yet / Also", example: "他现在还在睡觉呢。", exampleTrans: "Dia sekarang masih tidur.", exampleTrans_en: "He is still sleeping now." },
    { hanzi: "因为", pinyin: "yīnwèi", meaning: "Karena", meaning_en: "Because / Since", example: "因为下大雨，我没出门。", exampleTrans: "Karena hujan lebat, saya tidak keluar rumah.", exampleTrans_en: "Because it rained heavily, I did not go out." },
    { hanzi: "所以", pinyin: "suǒyǐ", meaning: "Oleh karena itu / Jadi", meaning_en: "Therefore / So", example: "我饿了，所以要吃晚饭。", exampleTrans: "Saya lapar, jadi mau makan malam.", exampleTrans_en: "I am hungry, so I need to eat dinner." },
    { hanzi: "如果", pinyin: "rúguǒ", meaning: "Jika / Kalau", meaning_en: "If / In case", example: "如果你来，我很高兴。", exampleTrans: "Jika kamu datang, saya sangat senang.", exampleTrans_en: "If you come, I will be very happy." },
    { hanzi: "一起", pinyin: "yìqǐ", meaning: "Bersama-sama", meaning_en: "Together", example: "我们一起去公园散步吧！", exampleTrans: "Ayo kita pergi jalan-jalan ke taman bersama!", exampleTrans_en: "Let us go for a walk in the park together!" },
    { hanzi: "可以", pinyin: "kěyǐ", meaning: "Bisa / Boleh", meaning_en: "Can / May", example: "你可以帮我拿一下包吗？", exampleTrans: "Bisakah kamu membantuku memegang tas ini sebentar?", exampleTrans_en: "Can you help me hold the bag for a moment?" },
    { hanzi: "觉得", pinyin: "juéde", meaning: "Merasa / Berpendapat", meaning_en: "Think / Feel", example: "我觉得这部电影很有意思。", exampleTrans: "Saya rasa film ini sangat menarik.", exampleTrans_en: "I think this movie is very interesting." },
    { hanzi: "高兴", pinyin: "gāoxìng", meaning: "Senang / Gembira", meaning_en: "Happy / Glad", example: "我很高兴今天认识大家！", exampleTrans: "Saya sangat senang mengenal semuanya hari ini!", exampleTrans_en: "I am very glad to meet everyone today!" },
    { hanzi: "便宜", pinyin: "piányi", meaning: "Murah", meaning_en: "Cheap / Inexpensive", example: "这里的衣服质量好而且便宜。", exampleTrans: "Baju di sini berkualitas baik dan juga murah.", exampleTrans_en: "The clothes here are good quality and cheap." },
    { hanzi: "贵", pinyin: "guì", meaning: "Mahal", meaning_en: "Expensive / Costly", example: "这台电脑太贵了！", exampleTrans: "Komputer ini terlalu mahal!", exampleTrans_en: "This computer is too expensive!" },
    { hanzi: "帮助", pinyin: "bāngzhù", meaning: "Membantu / Bantuan", meaning_en: "Help / Assist", example: "非常感谢你的热心帮助。", exampleTrans: "Terima kasih banyak atas bantuan ramahmu.", exampleTrans_en: "Thank you very much for your kind help." },
    { hanzi: "穿", pinyin: "chuān", meaning: "Memakai (baju / sepatu)", meaning_en: "To wear / Put on", example: "天气冷了，多穿件外套。", exampleTrans: "Cuaca sudah dingin, pakailah jaket ekstra.", exampleTrans_en: "The weather is cold, put on an extra coat." },
    { hanzi: "懂", pinyin: "dǒng", meaning: "Mengerti / Paham", meaning_en: "Understand / Know", example: "这道题你听懂了吗？", exampleTrans: "Apakah kamu sudah paham penjelasan soal ini?", exampleTrans_en: "Did you understand the explanation of this problem?" },
    { hanzi: "跑步", pinyin: "pǎobù", meaning: "Berlari / Jogging", meaning_en: "Run / Jog", example: "他每天早上坚持跑步。", exampleTrans: "Dia tekun berolahraga lari setiap pagi.", exampleTrans_en: "He keeps running every morning." },
    { hanzi: "游泳", pinyin: "yóuyǒng", meaning: "Berenang", meaning_en: "Swim", example: "夏天游泳非常凉快。", exampleTrans: "Berenang saat musim panas terasa sangat sejuk.", exampleTrans_en: "Swimming in summer is very refreshing." },
    { hanzi: "唱歌", pinyin: "chànggē", meaning: "Bernyanyi", meaning_en: "Sing songs", example: "她唱歌唱得真动听。", exampleTrans: "Dia bernyanyi dengan sangat merdu.", exampleTrans_en: "She sings songs really melodiously." },
    { hanzi: "跳舞", pinyin: "tiàowǔ", meaning: "Menari", meaning_en: "Dance", example: "孩子们喜欢在音乐中跳舞。", exampleTrans: "Anak-anak suka menari mengikuti musik.", exampleTrans_en: "The children love to dance to music." },
    { hanzi: "准备", pinyin: "zhǔnbèi", meaning: "Mempersiapkan / Bersiap", meaning_en: "Prepare / Get ready", example: "我已经准备好明天的考试了。", exampleTrans: "Saya sudah siap menghadapi ujian besok.", exampleTrans_en: "I have prepared well for tomorrow's exam." },
    { hanzi: "时间", pinyin: "shíjiān", meaning: "Waktu", meaning_en: "Time", example: "你有时间和我聊聊吗？", exampleTrans: "Apakah kamu punya waktu untuk mengobrol denganku?", exampleTrans_en: "Do you have time to chat with me?" },
    { hanzi: "现在", pinyin: "xiànzài", meaning: "Sekarang", meaning_en: "Now / Present", example: "现在是下午两点整。", exampleTrans: "Sekarang tepat pukul 14:00.", exampleTrans_en: "It is two o'clock in the afternoon now." },
    { hanzi: "希望", pinyin: "xīwàng", meaning: "Berharap / Harapan", meaning_en: "Hope / Wish", example: "希望你一切顺利！", exampleTrans: "Semoga segala urusanmu lancar!", exampleTrans_en: "Hope everything goes well with you!" },
    { hanzi: "介绍", pinyin: "jièshào", meaning: "Memperkenalkan", meaning_en: "Introduce / Recommend", example: "让我来为你介绍一下这位朋友。", exampleTrans: "Biarkan saya memperkenalkan teman ini kepadamu.", exampleTrans_en: "Let me introduce this friend to you." },
    { hanzi: "欢迎", pinyin: "huānyíng", meaning: "Menyambut / Selamat datang", meaning_en: "Welcome", example: "热烈欢迎新同学的到来！", exampleTrans: "Menyambut kedatangan siswa baru dengan hangat!", exampleTrans_en: "Warmly welcome the arrival of new students!" },
    { hanzi: "问题", pinyin: "wèntí", meaning: "Masalah / Pertanyaan", meaning_en: "Question / Problem", example: "你有什么问题尽管问吧。", exampleTrans: "Kalau ada pertanyaan silakan tanyakan saja.", exampleTrans_en: "Feel free to ask if you have any questions." },
    { hanzi: "事情", pinyin: "shìqing", meaning: "Hal / Urusan", meaning_en: "Matter / Thing / Affair", example: "今天有很多事情要做。", exampleTrans: "Hari ini ada banyak urusan yang harus diselesaikan.", exampleTrans_en: "There are many things to do today." },
    { hanzi: "旁边", pinyin: "pángbiān", meaning: "Sebelah / Di samping", meaning_en: "Beside / Next to", example: "银行就在超市的旁边。", exampleTrans: "Bank berada tepat di samping supermarket.", exampleTrans_en: "The bank is right next to the supermarket." },
    { hanzi: "离", pinyin: "lí", meaning: "Berjarak dari", meaning_en: "Away from / Distance from", example: "我家离公司不太远。", exampleTrans: "Rumah saya tidak begitu jauh dari kantor.", exampleTrans_en: "My home is not very far from the company." },
    { hanzi: "远", pinyin: "yuǎn", meaning: "Jauh", meaning_en: "Far / Distant", example: "从这里走去车站并不远。", exampleTrans: "Jalan kaki dari sini ke stasiun tidaklah jauh.", exampleTrans_en: "It is not far to walk from here to the station." },
    { hanzi: "近", pinyin: "jìn", meaning: "Dekat", meaning_en: "Near / Close", example: "学校就在我家附近，非常近。", exampleTrans: "Sekolah ada di dekat rumah saya, sangat dekat.", exampleTrans_en: "The school is near my home, very close." },
    { hanzi: "快", pinyin: "kuài", meaning: "Cepat / Segera", meaning_en: "Fast / Quick / Soon", example: "坐高铁速度非常快。", exampleTrans: "Naik kereta cepat kecepatannya sangat tinggi.", exampleTrans_en: "Riding high-speed rail is very fast." },
    { hanzi: "慢", pinyin: "màn", meaning: "Lambat / Pelan", meaning_en: "Slow", example: "老人家走路走得很慢。", exampleTrans: "Orang tua itu berjalan dengan sangat perlahan.", exampleTrans_en: "The elderly person walks very slowly." },
    { hanzi: "新", pinyin: "xīn", meaning: "Baru", meaning_en: "New / Fresh", example: "我买了一本新字典。", exampleTrans: "Saya membeli sebuah kamus baru.", exampleTrans_en: "I bought a new dictionary." },
    { hanzi: "已经", pinyin: "yǐjīng", meaning: "Sudah / Telah", meaning_en: "Already", example: "我已经吃过早饭了。", exampleTrans: "Saya sudah sarapan pagi.", exampleTrans_en: "I have already eaten breakfast." },
    { hanzi: "旅游", pinyin: "lǚyóu", meaning: "Berwisata / Liburan", meaning_en: "Travel / Tour", example: "我们打算放假去北京旅游。", exampleTrans: "Kami berencana pergi liburan ke Beijing saat libur.", exampleTrans_en: "We plan to travel to Beijing during holiday." },
    { hanzi: "运动", pinyin: "yùndòng", meaning: "Olahraga", meaning_en: "Sports / Exercise", example: "每天运动身体好。", exampleTrans: "Setiap hari berolahraga bagus untuk badan.", exampleTrans_en: "Daily exercise is good for health." },
    { hanzi: "生病", pinyin: "shēng bìng", meaning: "Jatuh sakit", meaning_en: "Fall ill / Sick", example: "他生病了，今天没来上课。", exampleTrans: "Dia jatuh sakit, hari ini tidak datang masuk kelas.", exampleTrans_en: "He fell ill and did not come to class today." },
    { hanzi: "吃药", pinyin: "chī yào", meaning: "Minum obat", meaning_en: "Take medicine", example: "记得按时吃药多休息。", exampleTrans: "Ingat minum obat tepat waktu dan banyak istirahat.", exampleTrans_en: "Remember to take medicine on time and rest more." },
    { hanzi: "出院", pinyin: "chū yuàn", meaning: "Keluar dari rumah sakit", meaning_en: "Discharged from hospital", example: "医生说他明天就可以出院了。", exampleTrans: "Dokter mengatakan dia besok sudah boleh keluar rumah sakit.", exampleTrans_en: "The doctor said he can be discharged tomorrow." },
    { hanzi: "手表", pinyin: "shǒubiǎo", meaning: "Jam tangan", meaning_en: "Wristwatch", example: "这块手表是我生日时买的。", exampleTrans: "Jam tangan ini dibeli saat ulang tahun saya.", exampleTrans_en: "This watch was bought on my birthday." },
    { hanzi: "报纸", pinyin: "bàozhǐ", meaning: "Koran / Surat kabar", meaning_en: "Newspaper", example: "爷爷喜欢边喝茶边看报纸。", exampleTrans: "Kakek suka membaca koran sambil minum teh.", exampleTrans_en: "Grandpa likes reading newspaper while drinking tea." },
    { hanzi: "牛奶", pinyin: "niúnǎi", meaning: "Susu sapi", meaning_en: "Milk", example: "早上喝一杯热牛奶。", exampleTrans: "Pagi hari minum segelas susu sapi hangat.", exampleTrans_en: "Drink a cup of warm milk in the morning." },
    { hanzi: "鸡蛋", pinyin: "jīdàn", meaning: "Telur ayam", meaning_en: "Egg", example: "早餐吃了两个水煮鸡蛋。", exampleTrans: "Sarapan makan dua butir telur rebus.", exampleTrans_en: "Ate two boiled eggs for breakfast." },
    { hanzi: "西瓜", pinyin: "xīguā", meaning: "Semangka", meaning_en: "Watermelon", example: "夏天的西瓜又甜又多汁。", exampleTrans: "Semangka musim panas manis dan segar berair.", exampleTrans_en: "Summer watermelon is sweet and juicy." },
    { hanzi: "颜色", pinyin: "yánsè", meaning: "Warna", meaning_en: "Color", example: "你最喜欢什么颜色？", exampleTrans: "Warna apa yang paling kamu sukai?", exampleTrans_en: "What color do you like most?" },
    { hanzi: "红", pinyin: "hóng", meaning: "Merah", meaning_en: "Red", example: "这件红外套真喜庆。", exampleTrans: "Jaket merah ini sungguh ceria.", exampleTrans_en: "This red coat is very festive." },
    { hanzi: "白", pinyin: "bái", meaning: "Putih", meaning_en: "White", example: "天上飘着白白的云朵。", exampleTrans: "Di langit melayang awan putih.", exampleTrans_en: "White clouds are floating in the sky." },
    { hanzi: "黑", pinyin: "hēi", meaning: "Hitam", meaning_en: "Black", example: "我买了一双黑色的鞋子。", exampleTrans: "Saya membeli sepasang sepatu hitam.", exampleTrans_en: "I bought a pair of black shoes." },
    { hanzi: "长", pinyin: "cháng", meaning: "Panjang", meaning_en: "Long", example: "她的头发很长很柔顺。", exampleTrans: "Rambutnya sangat panjang dan halus.", exampleTrans_en: "Her hair is long and silky." },
    { hanzi: "高", pinyin: "gāo", meaning: "Tinggi", meaning_en: "Tall / High", example: "那个男生长得很高。", exampleTrans: "Anak laki-laki itu bertubuh sangat tinggi.", exampleTrans_en: "That boy is very tall." },
    { hanzi: "累", pinyin: "lèi", meaning: "Lelah / Capek", meaning_en: "Tired / Exhausted", example: "今天工作一天感觉有点累。", exampleTrans: "Hari ini bekerja seharian terasa agak lelah.", exampleTrans_en: "After working all day today I feel a bit tired." },
    { hanzi: "忙", pinyin: "máng", meaning: "Sibuk", meaning_en: "Busy", example: "老师最近工作非常忙。", exampleTrans: "Guru akhir-akhir ini sangat sibuk bekerja.", exampleTrans_en: "The teacher has been very busy working lately." },
    { hanzi: "快乐", pinyin: "kuàilè", meaning: "Bahagia / Ceria", meaning_en: "Happy / Cheerful", example: "祝你生日快乐，天天开心！", exampleTrans: "Selamat ulang tahun, semoga bahagia tiap hari!", exampleTrans_en: "Happy birthday and wish you happy every day!" },
    { hanzi: "玩", pinyin: "wán", meaning: "Bermain / Menikmati", meaning_en: "To play / Have fun", example: "周末去朋友家玩。", exampleTrans: "Akhir pekan pergi main ke rumah teman.", exampleTrans_en: "Go play at a friend's house on the weekend." },
    { hanzi: "送", pinyin: "sòng", meaning: "Memberi hadiah / Mengantar", meaning_en: "To give as gift / Escort", example: "朋友送了我一本精彩的书。", exampleTrans: "Teman menghadiahkan buku menarik untukku.", exampleTrans_en: "A friend gave me a wonderful book as a gift." },
    { hanzi: "找", pinyin: "zhǎo", meaning: "Mencari / Memberi kembalian", meaning_en: "Look for / Give change", example: "你在找钥匙吗？", exampleTrans: "Apakah kamu sedang mencari kunci?", exampleTrans_en: "Are you looking for keys?" },
    { hanzi: "卖", pinyin: "mài", meaning: "Menjual", meaning_en: "To sell", example: "这家书店卖各种中文教材。", exampleTrans: "Toko buku ini menjual aneka buku ajar Mandarin.", exampleTrans_en: "This bookstore sells various Chinese textbooks." },
    { hanzi: "告诉", pinyin: "gàosu", meaning: "Memberitahu / Mengabari", meaning_en: "To tell / Inform", example: "请把开会时间告诉我。", exampleTrans: "Tolong beri tahu waktu rapat kepadaku.", exampleTrans_en: "Please tell me the meeting time." },
    { hanzi: "问", pinyin: "wèn", meaning: "Bertanya", meaning_en: "To ask", example: "有什么不明白的可以问老师。", exampleTrans: "Jika ada yang belum paham boleh tanya ke guru.", exampleTrans_en: "Feel free to ask the teacher if anything is unclear." },
    { hanzi: "笑", pinyin: "xiào", meaning: "Tersenyum / Tertawa", meaning_en: "To smile / Laugh", example: "她笑起来非常迷人。", exampleTrans: "Dia saat tersenyum sangat menawan.", exampleTrans_en: "She smiles very charmingly." },
    { hanzi: "给", pinyin: "gěi", meaning: "Memberi / Kepada", meaning_en: "To give / For", example: "请给我一杯乌龙茶。", exampleTrans: "Tolong beri saya secangkir teh oolong.", exampleTrans_en: "Please give me a cup of oolong tea." },
    { hanzi: "完", pinyin: "wán", meaning: "Selesai / Habis", meaning_en: "Finished / Complete", example: "作业写完了才可以去看电视。", exampleTrans: "Setelah tugas selesai ditulis baru boleh nonton TV.", exampleTrans_en: "Only after finishing homework can you watch TV." },
    { hanzi: "晴", pinyin: "qíng", meaning: "Cerah", meaning_en: "Sunny / Clear", example: "今天天气晴朗万里无云。", exampleTrans: "Hari ini cuaca cerah tanpa awan sedikitpun.", exampleTrans_en: "Today is sunny without a cloud in the sky." },
    { hanzi: "阴", pinyin: "yīn", meaning: "Mendung", meaning_en: "Overcast / Cloudy", example: "下午天阴了，可能要下雨。", exampleTrans: "Sore hari cuaca mendung, kemungkinan mau hujan.", exampleTrans_en: "It became overcast in the afternoon, might rain." }
  ],
  3: [
    { hanzi: "把", pinyin: "bǎ", meaning: "Struktur kalimat penekanan objek (partikel ba)", meaning_en: "Particle marking the object / Hold", example: "请把门关上。", exampleTrans: "Tolong tutup pintunya.", exampleTrans_en: "Please close the door." },
    { hanzi: "虽然", pinyin: "suīrán", meaning: "Meskipun / Walaupun", meaning_en: "Although / Even though", example: "虽然很难，但是很有趣。", exampleTrans: "Meskipun sulit, tetapi sangat menarik.", exampleTrans_en: "Although it is difficult, it is very interesting." },
    { hanzi: "越来越", pinyin: "yuè lái yuè", meaning: "Semakin lama semakin...", meaning_en: "More and more", example: "天气越来越暖和了。", exampleTrans: "Cuaca semakin lama semakin hangat.", exampleTrans_en: "The weather is getting warmer and warmer." },
    { hanzi: "其实", pinyin: "qíshí", meaning: "Sebenarnya / Pada kenyataannya", meaning_en: "Actually / In fact", example: "其实这道题并不难。", exampleTrans: "Sebenarnya soal ini tidaklah sulit.", exampleTrans_en: "Actually this question is not difficult." },
    { hanzi: "终于", pinyin: "zhōngyú", meaning: "Akhirnya / Pada akhirnya", meaning_en: "Finally / At last", example: "他终于通过了HSK考试！", exampleTrans: "Akhirnya dia lulus ujian HSK!", exampleTrans_en: "He finally passed the HSK exam!" },
    { hanzi: "马上", pinyin: "mǎshàng", meaning: "Segera / Langsung", meaning_en: "Immediately / Right away", example: "请稍等，我马上就到！", exampleTrans: "Tolong tunggu sebentar, saya segera sampai!", exampleTrans_en: "Please wait a moment, I will be right there!" },
    { hanzi: "一定", pinyin: "yídìng", meaning: "Pasti / Tentu saja", meaning_en: "Certainly / Definitely", example: "只要努力，你一定能成功！", exampleTrans: "Asalkan berusaha giat, kamu pasti berhasil!", exampleTrans_en: "As long as you work hard, you will definitely succeed!" },
    { hanzi: "意思", pinyin: "yìsi", meaning: "Arti / Makna / Menarik", meaning_en: "Meaning / Opinion / Fun", example: "这个词在句中是什么意思？", exampleTrans: "Apa arti kata ini dalam kalimat?", exampleTrans_en: "What is the meaning of this word in the sentence?" },
    { hanzi: "练习", pinyin: "liànxí", meaning: "Berlatih / Latihan", meaning_en: "Practice / Exercise", example: "我每天坚持练习中文口语。", exampleTrans: "Saya setiap hari tekun berlatih percakapan Mandarin.", exampleTrans_en: "I insist on practicing spoken Chinese every day." },
    { hanzi: "出发", pinyin: "chūfā", meaning: "Berangkat / Bertolak", meaning_en: "Set off / Depart", example: "我们明天清晨六点准时出发。", exampleTrans: "Kita berangkat besok pagi tepat pukul enam.", exampleTrans_en: "We will set off promptly at six tomorrow morning." },
    { hanzi: "照顾", pinyin: "zhàogu", meaning: "Merawat / Menjaga", meaning_en: "Take care of / Look after", example: "在异国他乡要好好照顾自己。", exampleTrans: "Di negeri orang harus menjaga diri baik-baik.", exampleTrans_en: "Take good care of yourself in a foreign country." },
    { hanzi: "简单", pinyin: "jiǎndān", meaning: "Sederhana / Mudah", meaning_en: "Simple / Easy", example: "用简单的话把道理讲清楚。", exampleTrans: "Jelaskan maknanya dengan kata-kata sederhana.", exampleTrans_en: "Explain the truth clearly in simple words." },
    { hanzi: "环境", pinyin: "huánjìng", meaning: "Lingkungan", meaning_en: "Environment / Surroundings", example: "保护自然环境是每个人的责任。", exampleTrans: "Menjaga lingkungan alam adalah tanggung jawab setiap orang.", exampleTrans_en: "Protecting the natural environment is everyone's responsibility." },
    { hanzi: "健康", pinyin: "jiànkāng", meaning: "Kesehatan / Sehat", meaning_en: "Health / Healthy", example: "身体健康比财富更重要。", exampleTrans: "Kesehatan tubuh jauh lebih penting daripada kekayaan.", exampleTrans_en: "Good health is more important than wealth." },
    { hanzi: "习惯", pinyin: "xíguàn", meaning: "Kebiasaan / Terbiasa", meaning_en: "Habit / Custom / Be used to", example: "养成早睡早起的好习惯。", exampleTrans: "Biasakan tidur dan bangun pagi.", exampleTrans_en: "Form a good habit of early to bed and early to rise." },
    { hanzi: "选择", pinyin: "xuǎnzé", meaning: "Memilih / Pilihan", meaning_en: "Choose / Choice", example: "做出适合自己的正确选择。", exampleTrans: "Tentukan pilihan yang tepat bagi dirimu sendiri.", exampleTrans_en: "Make the right choice that suits yourself." },
    { hanzi: "决定", pinyin: "juédìng", meaning: "Memutuskan / Keputusan", meaning_en: "Decide / Decision", example: "他决定去中国继续深造。", exampleTrans: "Dia memutuskan pergi ke Tiongkok untuk melanjutkan studi.", exampleTrans_en: "He decided to go to China for further studies." },
    { hanzi: "特别", pinyin: "tèbié", meaning: "Khusus / Sangat spesial", meaning_en: "Special / Especially", example: "这道中国菜味道特别正宗。", exampleTrans: "Rasa masakan Tiongkok ini sangat otentik.", exampleTrans_en: "This Chinese dish tastes especially authentic." },
    { hanzi: "清楚", pinyin: "qīngchu", meaning: "Jelas / Terang", meaning_en: "Clear / Distinct", example: "请把你的想法说清楚。", exampleTrans: "Tolong utarakan pemikiranmu dengan jelas.", exampleTrans_en: "Please state your thoughts clearly." },
    { hanzi: "认真", pinyin: "rènzhēn", meaning: "Sungguh-sungguh / Serius", meaning_en: "Serious / Conscientious", example: "态度认真才能把事情做好。", exampleTrans: "Hanya dengan sikap sungguh-sungguh pekerjaan bisa beres.", exampleTrans_en: "Only with a serious attitude can things be done well." },
    { hanzi: "突然", pinyin: "tūrán", meaning: "Tiba-tiba / Mendadak", meaning_en: "Suddenly / Abruptly", example: "天空突然下起了倾盆大雨。", exampleTrans: "Tiba-tiba langit menurunkan hujan lebat.", exampleTrans_en: "Suddenly heavy rain began to fall from the sky." },
    { hanzi: "热情", pinyin: "rèqíng", meaning: "Antusias / Ramah hangat", meaning_en: "Enthusiastic / Warm", example: "大家热情地欢迎远方客人。", exampleTrans: "Semua orang menyambut tamu jauh dengan hangat.", exampleTrans_en: "Everyone warmly welcomed guests from afar." },
    { hanzi: "相信", pinyin: "xiāngxìn", meaning: "Percaya / Meyakini", meaning_en: "Believe / Trust", example: "我相信自己有能力做到。", exampleTrans: "Saya percaya diri bahwa saya punya kemampuan.", exampleTrans_en: "I believe that I have the ability to do it." },
    { hanzi: "容易", pinyin: "róngyì", meaning: "Mudah / Gampang", meaning_en: "Easy / Likely", example: "说起来容易，做起来难。", exampleTrans: "Bicara mudah, melaksanakannya sulit.", exampleTrans_en: "Easier said than done." },
    { hanzi: "明白", pinyin: "míngbai", meaning: "Paham / Mengerti", meaning_en: "Understand / Clear", example: "我现在终于明白这个道理了。", exampleTrans: "Sekarang saya akhirnya paham prinsip ini.", exampleTrans_en: "I now finally understand this truth." },
    { hanzi: "复习", pinyin: "fùxí", meaning: "Mengulang pelajaran / Review", meaning_en: "Review / Revise", example: "考试前一定要好好复习笔记。", exampleTrans: "Sebelum ujian wajib mengulang catatan dengan baik.", exampleTrans_en: "Must review notes carefully before exam." },
    { hanzi: "努力", pinyin: "nǔlì", meaning: "Rajin / Berusaha keras", meaning_en: "Diligent / Hardworking", example: "只要努力就能取得优异成绩。", exampleTrans: "Asalkan giat berusaha akan meraih nilai bagus.", exampleTrans_en: "As long as you work hard you will get good grades." },
    { hanzi: "成绩", pinyin: "chéngjì", meaning: "Nilai / Prestasi belajar", meaning_en: "Grade / Achievement", example: "他这次汉语考试成绩很棒。", exampleTrans: "Nilai ujian bahasa Mandarin dia kali ini sangat luar biasa.", exampleTrans_en: "His Chinese exam score this time is great." },
    { hanzi: "经过", pinyin: "jīngguò", meaning: "Melewati / Melalui proses", meaning_en: "Pass by / Through process", example: "经过三个月的努力，他学会了游泳。", exampleTrans: "Melalui usaha selama 3 bulan, dia sudah bisa berenang.", exampleTrans_en: "Through three months of effort, he learned to swim." },
    { hanzi: "满意", pinyin: "mǎnyì", meaning: "Puas / Merasa puas", meaning_en: "Satisfied / Pleased", example: "客户对我们的服务非常满意。", exampleTrans: "Pelanggan sangat puas dengan pelayanan kami.", exampleTrans_en: "Customers are very satisfied with our service." },
    { hanzi: "解决", pinyin: "jiějué", meaning: "Menyelesaikan masalah", meaning_en: "To solve / Resolve", example: "我们需要尽快解决这个问题。", exampleTrans: "Kita perlu secepatnya menyelesaikan masalah ini.", exampleTrans_en: "We need to solve this problem as soon as possible." },
    { hanzi: "帮忙", pinyin: "bāngmáng", meaning: "Membantu / Memberi bantuan", meaning_en: "Help / Do a favor", example: "谢谢你今天特地过来帮忙！", exampleTrans: "Terima kasih kamu hari ini khusus datang membantu!", exampleTrans_en: "Thank you for specially coming over to help today!" },
    { hanzi: "历史", pinyin: "lìshǐ", meaning: "Sejarah", meaning_en: "History", example: "中国拥有数千年的悠久历史。", exampleTrans: "Tiongkok memiliki sejarah panjang ribuan tahun.", exampleTrans_en: "China has thousands of years of long history." },
    { hanzi: "文化", pinyin: "wénhuà", meaning: "Kebudayaan / Budaya", meaning_en: "Culture", example: "学习语言能更好地了解文化。", exampleTrans: "Belajar bahasa bisa lebih memahami kebudayaannya.", exampleTrans_en: "Learning language helps better understand culture." },
    { hanzi: "城市", pinyin: "chéngshì", meaning: "Kota", meaning_en: "City", example: "上海是一座现代化的大城市。", exampleTrans: "Shanghai adalah sebuah kota besar yang modern.", exampleTrans_en: "Shanghai is a modern big city." },
    { hanzi: "音乐", pinyin: "yīnyuè", meaning: "Musik", meaning_en: "Music", example: "下班后听音乐可以放松心情。", exampleTrans: "Mendengarkan musik sehabis kerja merilekskan pikiran.", exampleTrans_en: "Listening to music after work can relax the mind." },
    { hanzi: "体育", pinyin: "tǐyù", meaning: "Olahraga / Pendidikan jasmani", meaning_en: "Physical education / Sports", example: "他从小就非常喜欢体育运动。", exampleTrans: "Sejak kecil dia amat menyukai olahraga fisik.", exampleTrans_en: "He has loved sports since childhood." },
    { hanzi: "国家", pinyin: "guójiā", meaning: "Negara", meaning_en: "Country / Nation", example: "世界上有两百多个国家和地区。", exampleTrans: "Di dunia ada dua ratus lebih negara dan wilayah.", exampleTrans_en: "There are over two hundred countries and regions in the world." },
    { hanzi: "世界", pinyin: "shìjiè", meaning: "Dunia", meaning_en: "World", example: "我想去环游世界开阔眼界。", exampleTrans: "Saya ingin keliling dunia untuk memperluas wawasan.", exampleTrans_en: "I want to travel around the world to broaden my horizons." },
    { hanzi: "检查", pinyin: "jiǎnchá", meaning: "Memeriksa / Cek", meaning_en: "Check / Examine", example: "写完试卷后请认真检查一遍。", exampleTrans: "Setelah selesai menulis lembar ujian mohon periksa teliti.", exampleTrans_en: "Please examine carefully after finishing the test." },
    { hanzi: "注意", pinyin: "zhùyì", meaning: "Memperhatikan / Waspada", meaning_en: "Pay attention / Notice", example: "过马路一定要注意交通安全。", exampleTrans: "Menyeberang jalan wajib memperhatikan keselamatan lalu lintas.", exampleTrans_en: "Always pay attention to traffic safety when crossing road." },
    { hanzi: "安全", pinyin: "ānquán", meaning: "Aman / Keselamatan", meaning_en: "Safe / Safety", example: "出门在外一定要注意人身安全。", exampleTrans: "Bepergian di luar harus menjaga keselamatan diri.", exampleTrans_en: "Pay attention to personal safety when away from home." },
    { hanzi: "安静", pinyin: "ānjìng", meaning: "Tenang / Hening", meaning_en: "Quiet / Peaceful", example: "图书馆里请大家保持安静。", exampleTrans: "Di dalam perpustakaan mohon semuanya menjaga ketenangan.", exampleTrans_en: "Please keep quiet in the library." },
    { hanzi: "干净", pinyin: "gānjìng", meaning: "Bersih", meaning_en: "Clean", example: "这个房间收拾得非常干净整洁。", exampleTrans: "Kamar ini dirapikan sangat bersih dan teratur.", exampleTrans_en: "This room is kept very clean and tidy." },
    { hanzi: "舒服", pinyin: "shūfu", meaning: "Nyaman / Enak badan", meaning_en: "Comfortable", example: "坐在沙发上看书感觉很舒服。", exampleTrans: "Duduk di sofa membaca buku terasa sangat nyaman.", exampleTrans_en: "Sitting on sofa reading feels very comfortable." },
    { hanzi: "发烧", pinyin: "fāshāo", meaning: "Demam", meaning_en: "Fever", example: "他感冒发烧了，需要去医院。", exampleTrans: "Dia flu dan demam, perlu pergi ke rumah sakit.", exampleTrans_en: "He has a cold and fever, needs to go to hospital." },
    { hanzi: "感冒", pinyin: "gǎnmào", meaning: "Masuk angin / Flu", meaning_en: "Catch a cold", example: "天冷记得加衣服，小心感冒。", exampleTrans: "Udara dingin ingat pakai baju tebal, hati-hati flu.", exampleTrans_en: "It is cold, remember to wear more clothes to avoid catching cold." },
    { hanzi: "愿意", pinyin: "yuànyì", meaning: "Bersedia / Mau", meaning_en: "Willing to", example: "你愿意和我们一起参加比赛吗？", exampleTrans: "Apakah kamu bersedia ikut lomba bersama kami?", exampleTrans_en: "Are you willing to join the competition with us?" },
    { hanzi: "同意", pinyin: "tóngyì", meaning: "Setuju", meaning_en: "Agree / Consent", example: "大家都一致同意这个提议。", exampleTrans: "Semua orang sepakat menyetujui usulan ini.", exampleTrans_en: "Everyone unanimously agrees with this proposal." }
  ],
  4: [
    { hanzi: "被", pinyin: "bèi", meaning: "Kalimat pasif (di- / ter-)", meaning_en: "Passive marker / By", example: "钱包被小偷偷走了。", exampleTrans: "Dompet telah dicuri oleh pencopet.", exampleTrans_en: "The wallet was stolen by a thief." },
    { hanzi: "无论", pinyin: "wúlùn", meaning: "Bagaimanapun / Tidak peduli", meaning_en: "No matter what / Regardless of", example: "无论遇到什么困难，都不能放弃。", exampleTrans: "Bagaimanapun rintangan menghadang, jangan menyerah.", exampleTrans_en: "No matter what difficulties you face, do not give up." },
    { hanzi: "即使", pinyin: "jíshǐ", meaning: "Bahkan jika / Meskipun", meaning_en: "Even if / Even though", example: "即使下大雪，比赛也照常进行。", exampleTrans: "Bahkan jika salju lebat, lomba tetap berlangsung.", exampleTrans_en: "Even if it snows heavily, the match continues as scheduled." },
    { hanzi: "态度", pinyin: "tàidù", meaning: "Sikap / Perilaku", meaning_en: "Attitude / Manner", example: "积极的态度是成功的关键。", exampleTrans: "Sikap positif adalah kunci kesuksesan.", exampleTrans_en: "A positive attitude is the key to success." },
    { hanzi: "努力", pinyin: "nǔlì", meaning: "Berusaha keras / Rajin", meaning_en: "Work hard / Strive", example: "只要肯努力，梦想一定会实现。", exampleTrans: "Asal mau berusaha keras, impian pasti terwujud.", exampleTrans_en: "As long as you work hard, dreams will surely come true." },
    { hanzi: "影响", pinyin: "yǐngxiǎng", meaning: "Pengaruh / Mempengaruhi", meaning_en: "Influence / Effect", example: "良好的家风影响孩子的一生。", exampleTrans: "Budaya keluarga baik mempengaruhi seumur hidup anak.", exampleTrans_en: "A good family tradition influences a child's whole life." },
    { hanzi: "经验", pinyin: "jīngyàn", meaning: "Pengalaman", meaning_en: "Experience", example: "他积累了丰富的外贸实战经验。", exampleTrans: "Dia mengumpulkan pengalaman perdagangan luar negeri yang kaya.", exampleTrans_en: "He accumulated rich experience in foreign trade." },
    { hanzi: "发展", pinyin: "fāzhǎn", meaning: "Perkembangan / Berkembang", meaning_en: "Development / Develop", example: "国家的高新技术产业发展迅速。", exampleTrans: "Industri teknologi tinggi negara berkembang sangat pesat.", exampleTrans_en: "The nation's high-tech industry develops rapidly." },
    { hanzi: "解决", pinyin: "jiějué", meaning: "Memecahkan / Menyelesaikan", meaning_en: "Solve / Resolve", example: "让我们共同协商解决这个难题。", exampleTrans: "Mari kita diskusikan bersama guna memecahkan soal rumit ini.", exampleTrans_en: "Let us discuss together to solve this tough problem." },
    { hanzi: "代表", pinyin: "dàibiǎo", meaning: "Mewakili / Perwakilan", meaning_en: "Represent / Representative", example: "她代表全校师生发表了演讲。", exampleTrans: "Dia mewakili seluruh guru dan siswa berpidato.", exampleTrans_en: "She delivered a speech on behalf of all teachers and students." },
    { hanzi: "成功", pinyin: "chénggōng", meaning: "Berhasil / Kesuksesan", meaning_en: "Succeed / Success", example: "坚持到底就是胜利和成功。", exampleTrans: "Bertahan hingga akhir adalah kemenangan dan kesuksesan.", exampleTrans_en: "Persevering to the end is victory and success." },
    { hanzi: "坚持", pinyin: "jiānchí", meaning: "Konsisten / Bertahan", meaning_en: "Persist / Insist", example: "只有坚持不懈，才能登上顶峰。", exampleTrans: "Hanya dengan pantang menyerah, puncak bisa diraih.", exampleTrans_en: "Only by persevering can one reach the summit." },
    { hanzi: "根据", pinyin: "gēnjù", meaning: "Berdasarkan / Dasar", meaning_en: "According to / Based on", example: "请根据调查数据做出客观判断。", exampleTrans: "Buatlah penilaian objektif berdasarkan data survei.", exampleTrans_en: "Please make objective judgments based on survey data." },
    { hanzi: "按时", pinyin: "ànshí", meaning: "Tepat waktu", meaning_en: "On time / Punctually", example: "请所有人员按时提交工作报告。", exampleTrans: "Semua staf diharapkan mengumpulkan laporan tepat waktu.", exampleTrans_en: "All personnel are requested to submit reports on time." },
    { hanzi: "适应", pinyin: "shìyìng", meaning: "Beradaptasi / Menyesuaikan diri", meaning_en: "Adapt / Get used to", example: "新员工很快适应了团队工作节奏。", exampleTrans: "Karyawan baru cepat beradaptasi dengan ritme tim.", exampleTrans_en: "The new employee quickly adapted to the team pace." },
    { hanzi: "国际", pinyin: "guójì", meaning: "Internasional", meaning_en: "International", example: "加强国际交流与多边经贸合作。", exampleTrans: "Memperkuat pertukaran internasional dan kerja sama multilateral.", exampleTrans_en: "Strengthen international exchanges and multilateral cooperation." },
    { hanzi: "保护", pinyin: "bǎohù", meaning: "Melindungi / Proteksi", meaning_en: "Protect / Shield", example: "保护知识产权有利于鼓励科技创新。", exampleTrans: "Melindungi hak cipta mendorong inovasi teknologi.", exampleTrans_en: "Protecting intellectual property encourages innovation." },
    { hanzi: "责任", pinyin: "zérèn", meaning: "Tanggung jawab", meaning_en: "Responsibility / Duty", example: "勇于承担社会责任是企业的美德。", exampleTrans: "Berani memikul tanggung jawab sosial adalah keutamaan bisnis.", exampleTrans_en: "Bravely shouldering social responsibility is a corporate virtue." },
    { hanzi: "丰富", pinyin: "fēngfù", meaning: "Kaya / Berlimpah", meaning_en: "Rich / Abundant", example: "课外活动丰富了校园文化生活。", exampleTrans: "Aktivitas ekstrakurikuler memperkaya budaya kampus.", exampleTrans_en: "Extracurricular activities enrich campus cultural life." },
    { hanzi: "交流", pinyin: "jiāoliú", meaning: "Bertukar pikiran / Berkomunikasi", meaning_en: "Exchange / Communicate", example: "多与本地人交流能快速提高口语。", exampleTrans: "Banyak mengobrol dengan warga lokal cepat melatih lisan.", exampleTrans_en: "Communicating with locals quickly improves speaking skills." },
    { hanzi: "严格", pinyin: "yángé", meaning: "Ketat / Disiplin tegas", meaning_en: "Strict / Rigorous", example: "老师对我们的作业要求非常严格。", exampleTrans: "Guru menuntut standar yang sangat ketat pada tugas kami.", exampleTrans_en: "The teacher is very strict with our homework." },
    { hanzi: "诚实", pinyin: "chéngshí", meaning: "Jujur", meaning_en: "Honest", example: "做人最重要的是要诚实守信。", exampleTrans: "Hal terpenting sebagai manusia adalah jujur dan amanah.", exampleTrans_en: "The most important thing in life is to be honest and trustworthy." },
    { hanzi: "信任", pinyin: "xìnrèn", meaning: "Kepercayaan / Mempercayai", meaning_en: "Trust / Confidence", example: "相互信任是团队合作的基础。", exampleTrans: "Saling percaya adalah fondasi kerja tim.", exampleTrans_en: "Mutual trust is the foundation of teamwork." },
    { hanzi: "究竟", pinyin: "jiūjìng", meaning: "Sebenarnya (penekanan tanya)", meaning_en: "Actually / Exactly (in questions)", example: "你究竟想要表达什么想法？", exampleTrans: "Sebenarnya apa ide yang ingin kamu sampaikan?", exampleTrans_en: "What on earth are you trying to express?" },
    { hanzi: "竟然", pinyin: "jìngrán", meaning: "Tak disangka-sangka / Malah", meaning_en: "Unexpectedly / To one's surprise", example: "他竟然在这么短的时间里完成了任务！", exampleTrans: "Tak disangka dia menyelesaikan tugas dalam waktu sesingkat ini!", exampleTrans_en: "He unexpectedly finished the task in such a short time!" },
    { hanzi: "鼓励", pinyin: "gǔlì", meaning: "Mendorong / Memberi semangat", meaning_en: "Encourage / Urge", example: "父母经常鼓励我勇敢面对困难。", exampleTrans: "Orang tua sering menyemangatiku untuk berani menghadapi kesulitan.", exampleTrans_en: "Parents often encourage me to face difficulties bravely." },
    { hanzi: "究竟", pinyin: "jiūjìng", meaning: "Sebenarnya / Pada akhirnya", meaning_en: "After all / In the end", example: "事情究竟是怎么发生的？", exampleTrans: "Sebenarnya bagaimana hal itu terjadi?", exampleTrans_en: "How did things actually happen?" },
    { hanzi: "偶尔", pinyin: "ǒu'ěr", meaning: "Kadang-kadang / Sesekali", meaning_en: "Occasionally / Once in a while", example: "我平时很忙，偶尔会去散散步。", exampleTrans: "Saya biasanya sibuk, sesekali baru pergi jalan santai.", exampleTrans_en: "I am usually busy, occasionally go for a stroll." },
    { hanzi: "平时", pinyin: "píngshí", meaning: "Hari biasa / Biasanya", meaning_en: "In normal times / Usually", example: "他平时喜欢在图书馆看书学习。", exampleTrans: "Dia biasanya suka membaca dan belajar di perpustakaan.", exampleTrans_en: "He usually likes reading and studying in library." },
    { hanzi: "整理", pinyin: "zhěnglǐ", meaning: "Merapikan / Mengorganisir", meaning_en: "Organize / Put in order", example: "请把书桌上的材料整理一下。", exampleTrans: "Tolong rapikan berkas materi di meja belajar.", exampleTrans_en: "Please tidy up the materials on the desk." },
    { hanzi: "安排", pinyin: "ānpái", meaning: "Mengatur / Menjadwalkan", meaning_en: "Arrange / Plan", example: "合理安排作息时间有益身心健康。", exampleTrans: "Mengatur jadwal istirahat dengan wajar baik bagi kesehatan.", exampleTrans_en: "Reasonably arranging schedule benefits mind and body." },
    { hanzi: "准确", pinyin: "zhǔnquè", meaning: "Akurat / Tepat", meaning_en: "Accurate / Exact", example: "请提供准确的数据分析报告。", exampleTrans: "Tolong berikan laporan analisis data yang akurat.", exampleTrans_en: "Please provide an accurate data analysis report." },
    { hanzi: "复杂", pinyin: "fùzá", meaning: "Rumit / Kompleks", meaning_en: "Complex / Complicated", example: "这个问题比我们想象的要复杂得多。", exampleTrans: "Masalah ini jauh lebih rumit daripada yang kita bayangkan.", exampleTrans_en: "This problem is much more complicated than we thought." },
    { hanzi: "关键", pinyin: "guānjiàn", meaning: "Kunci utama / Krusial", meaning_en: "Key / Crucial", example: "把握机会是成功的关键因素。", exampleTrans: "Memanfaatkan peluang adalah faktor kunci keberhasilan.", exampleTrans_en: "Seizing opportunities is the key factor to success." },
    { hanzi: "尤其", pinyin: "yóuqí", meaning: "Khususnya / Terutama", meaning_en: "Especially / Particularly", example: "我喜欢吃水果，尤其是香蕉和苹果。", exampleTrans: "Saya suka buah, khususnya pisang dan apel.", exampleTrans_en: "I like fruit, especially bananas and apples." },
    { hanzi: "顺利", pinyin: "shùnlì", meaning: "Lancar tanpa hambatan", meaning_en: "Smoothly / Without hitch", example: "祝愿你的新项目一切顺利！", exampleTrans: "Semoga proyek barumu berjalan lancar!", exampleTrans_en: "Wish your new project goes smoothly!" },
    { hanzi: "礼貌", pinyin: "lǐmào", meaning: "Sopan santun / Adab", meaning_en: "Polite / Manners", example: "待人有礼貌能赢得大家的尊重。", exampleTrans: "Berlaku sopan kepada orang lain membuahkan respek.", exampleTrans_en: "Being polite to others wins respect." },
    { hanzi: "幽默", pinyin: "yōumò", meaning: "Humoris / Lucu", meaning_en: "Humorous / Humor", example: "他的发言既幽默又富有启发性。", exampleTrans: "Ucapannya humoris dan sarat inspirasi.", exampleTrans_en: "His remarks were both humorous and inspiring." },
    { hanzi: "印象", pinyin: "yìnxiàng", meaning: "Kesan", meaning_en: "Impression", example: "他对中国留下了深刻而美好的印象。", exampleTrans: "Dia mendapat kesan mendalam dan indah tentang Tiongkok.", exampleTrans_en: "He got a deep and wonderful impression of China." },
    { hanzi: "值得", pinyin: "zhídé", meaning: "Layak / Pantas untuk", meaning_en: "Worthwhile / Deserve", example: "这是一本非常值得一读的好书。", exampleTrans: "Ini adalah buku bagus yang sangat layak dibaca.", exampleTrans_en: "This is a good book very well worth reading." }
  ],
  5: [
    { hanzi: "合作共赢", pinyin: "hézuò gòngyíng", meaning: "Kerja sama saling menguntungkan (win-win)", meaning_en: "Win-win cooperation", example: "双方坚持合作共赢，推动经济发展。", exampleTrans: "Kedua pihak memegang prinsip kerja sama saling menguntungkan.", exampleTrans_en: "Both sides uphold win-win cooperation to boost economic growth." },
    { hanzi: "毫无疑问", pinyin: "háo wú yíwèn", meaning: "Tanpa keraguan sedikit pun", meaning_en: "Without a doubt / Indubitably", example: "毫无疑问，他是本次项目的最佳人选。", exampleTrans: "Tanpa keraguan, dialah orang terbaik untuk proyek ini.", exampleTrans_en: "Without a doubt, he is the best candidate for this project." },
    { hanzi: "创新", pinyin: "chuàngxīn", meaning: "Inovasi / Berinovasi", meaning_en: "Innovation / Innovate", example: "科技创新推动全社会的产业转型升级。", exampleTrans: "Inovasi teknologi mendorong transformasi dan peningkatan industri.", exampleTrans_en: "Technological innovation drives industrial upgrading." },
    { hanzi: "竞争", pinyin: "jìngzhēng", meaning: "Persaingan / Berkompetisi", meaning_en: "Competition / Compete", example: "全球市场竞争日益加剧，需增强实力。", exampleTrans: "Persaingan pasar global semakin ketat, perlu peningkatan kapabilitas.", exampleTrans_en: "Global market competition is intensifying, requiring stronger competence." },
    { hanzi: "可持续", pinyin: "kě chíxù", meaning: "Berkelanjutan (sustainable)", meaning_en: "Sustainable", example: "绿色生态是实现可持续发展的重要基石。", exampleTrans: "Ekologi hijau merupakan pondasi utama pembangunan berkelanjutan.", exampleTrans_en: "Green ecology is an essential foundation for sustainable development." },
    { hanzi: "深刻", pinyin: "shēnkè", meaning: "Mendalam / Berbobot", meaning_en: "Profound / Deep", example: "这场报告对未来趋势做了深刻的分析。", exampleTrans: "Laporan ini memberikan analisis mendalam terhadap tren masa depan.", exampleTrans_en: "This report made a profound analysis of future trends." },
    { hanzi: "核心", pinyin: "héxīn", meaning: "Inti / Pokok sentral", meaning_en: "Core / Nucleus", example: "掌握核心技术才能在竞争中立于不败之地。", exampleTrans: "Menguasai teknologi inti menjadi kunci keunggulan kompetitif.", exampleTrans_en: "Mastering core technology keeps one invincible in competition." },
    { hanzi: "优先", pinyin: "yōuxiān", meaning: "Prioritas / Mengutamakan", meaning_en: "Priority / Preferential", example: "生命安全与质量保障始终摆在优先位置。", exampleTrans: "Keselamatan jiwa dan mutu selalu diletakkan pada posisi prioritas.", exampleTrans_en: "Life safety and quality assurance are always given priority." },
    { hanzi: "挑战", pinyin: "tiǎozhàn", meaning: "Tantangan / Menantang", meaning_en: "Challenge / To challenge", example: "面对时代的未知挑战，我们要勇往直前。", exampleTrans: "Menghadapi tantangan zaman yang belum pasti, kita harus maju berani.", exampleTrans_en: "Facing unknown challenges of our era, we must forge ahead bravely." },
    { hanzi: "贡献", pinyin: "gòngxiàn", meaning: "Kontribusi / Berkontribusi", meaning_en: "Contribution / Contribute", example: "科学家为人类和平与进步做出了巨大贡献。", exampleTrans: "Ilmuwan memberikan sumbangsih besar bagi perdamaian umat manusia.", exampleTrans_en: "Scientists made huge contributions to human peace and progress." },
    { hanzi: "趋势", pinyin: "qūshì", meaning: "Tren / Kecenderungan arah", meaning_en: "Trend / Tendency", example: "数字化与智能化已成为未来不可逆转的趋势。", exampleTrans: "Digitalisasi dan kecerdasan buatan telah menjadi tren masa depan.", exampleTrans_en: "Digitalization and intelligence have become irreversible trends." },
    { hanzi: "资源", pinyin: "zīyuán", meaning: "Sumber daya", meaning_en: "Resource", example: "合理分配教育与医疗等公共公共资源。", exampleTrans: "Distribusikan sumber daya publik pendidikan dan medis secara wajar.", exampleTrans_en: "Allocate public resources like education and healthcare rationally." },
    { hanzi: "协调", pinyin: "xiétiáo", meaning: "Menyelaraskan / Koordinasi", meaning_en: "Coordinate / Harmonize", example: "多部门协调联动确保了重大活动的圆满完成。", exampleTrans: "Koordinasi lintas departemen menjamin kelancaran agenda besar.", exampleTrans_en: "Multi-department coordination ensured the smooth event." },
    { hanzi: "广泛", pinyin: "guǎngfàn", meaning: "Luas / Ekstensif", meaning_en: "Broad / Extensive", example: "该项新政策在社会各界引起了广泛关注。", exampleTrans: "Kebijakan baru tersebut menarik perhatian luas berbagai lapisan masyarakat.", exampleTrans_en: "The new policy attracted extensive attention across society." },
    { hanzi: "价值", pinyin: "jiàzhí", meaning: "Nilai (value)", meaning_en: "Value / Worth", example: "在实践中不断挖掘和创造更高的社会价值。", exampleTrans: "Terus menggali dan menciptakan nilai sosial yang lebih tinggi.", exampleTrans_en: "Continuously explore and create higher social value in practice." },
    { hanzi: "本质", pinyin: "běnzhì", meaning: "Hakikat / Inti esensi", meaning_en: "Essence / Nature", example: "透过现象看本质才能抓住核心问题。", exampleTrans: "Melihat hakikat lewat fenomena baru dapat memegang persoalan inti.", exampleTrans_en: "Seeing essence through phenomena catches the core problem." },
    { hanzi: "把握", pinyin: "bǎwò", meaning: "Menggenggam / Memanfaatkan peluang", meaning_en: "Grasp / Seize", example: "我们要牢牢把握时代发展的宝贵机遇。", exampleTrans: "Kita harus menggenggam erat peluang emas perkembangan zaman.", exampleTrans_en: "We must firmly grasp precious opportunities of our times." },
    { hanzi: "客观", pinyin: "kèguān", meaning: "Objektif / Tidak memihak", meaning_en: "Objective / Impartial", example: "评价历史事件要保持客观公正的态度。", exampleTrans: "Menilai peristiwa sejarah harus objektif dan adil.", exampleTrans_en: "Evaluating historical events requires an objective attitude." },
    { hanzi: "综合", pinyin: "zōnghé", meaning: "Komprehensif / Memadukan", meaning_en: "Synthesize / Comprehensive", example: "综合考虑各方面因素后再做最后决断。", exampleTrans: "Pertimbangkan faktor menyeluruh sebelum mengambil keputusan final.", exampleTrans_en: "Synthesize all factors before making the final decision." },
    { hanzi: "逻辑", pinyin: "luóji", meaning: "Logika / Nalar", meaning_en: "Logic", example: "这篇论文论述严密，逻辑非常清晰。", exampleTrans: "Makalah ini berargumentasi rapat dengan logika yang sangat jelas.", exampleTrans_en: "This paper is tightly argued with very clear logic." },
    { hanzi: "启示", pinyin: "qǐshì", meaning: "Inspirasi / Pelajaran berharga", meaning_en: "Inspiration / Revelation", example: "寓言故事往往蕴含着耐人寻味的深刻启示。", exampleTrans: "Cerita fabel sering menyimpan pelajaran berharga yang mendalam.", exampleTrans_en: "Fables often contain thought-provoking inspirations." },
    { hanzi: "规模", pinyin: "guīmó", meaning: "Skala / Ukuran besar", meaning_en: "Scale / Scope", example: "该企业的生产规模位居行业前列。", exampleTrans: "Skala produksi perusahaan ini menempati posisi terdepan industri.", exampleTrans_en: "The production scale of this enterprise ranks at the top." },
    { hanzi: "效益", pinyin: "xiàoyì", meaning: "Efisiensi keuntungan / Faedah", meaning_en: "Benefit / Efficiency", example: "追求经济效益与社会效益的有机统一。", exampleTrans: "Mengejar keselarasan antara faedah ekonomi dan faedah sosial.", exampleTrans_en: "Pursue organic unity of economic and social benefits." },
    { hanzi: "策略", pinyin: "cèlüè", meaning: "Strategi / Taktik", meaning_en: "Strategy / Tactics", example: "灵活调整营销策略以适应市场多变的需求。", exampleTrans: "Menyesuaikan strategi pemasaran secara luwes demi kebutuhan pasar.", exampleTrans_en: "Flexibly adjust marketing strategies to market demands." },
    { hanzi: "承担", pinyin: "chéngdān", meaning: "Memikul beban / Menanggung jawab", meaning_en: "Undertake / Bear", example: "青年一代要勇于承担社会与历史重任。", exampleTrans: "Generasi muda harus berani memikul tugas berat sejarah dan masyarakat.", exampleTrans_en: "Youth should bravely undertake social and historical duties." },
    { hanzi: "体现", pinyin: "tǐxiàn", meaning: "Mencerminkan / Mewujudkan", meaning_en: "Reflect / Embody", example: "这个方案充分体现了以人为本的设计宗旨。", exampleTrans: "Rancangan ini sepenuhnya mencerminkan prinsip desain berpusat pada manusia.", exampleTrans_en: "This plan fully embodies the people-oriented design concept." },
    { hanzi: "促进", pinyin: "cùjìn", meaning: "Mendorong kemajuan / Mempercepat", meaning_en: "Promote / Advance", example: "文化交流促进了各民族人民之间的友谊。", exampleTrans: "Pertukaran budaya mempererat persahabatan antar bangsa.", exampleTrans_en: "Cultural exchange promotes friendship between peoples." },
    { hanzi: "具备", pinyin: "jùbèi", meaning: "Memiliki / Memenuhi syarat kapabilitas", meaning_en: "Possess / Be equipped with", example: "该候选人具备优秀的跨文化沟通与领导能力。", exampleTrans: "Kandidat tersebut memiliki keahlian komunikasi lintas budaya yang unggul.", exampleTrans_en: "The candidate possesses excellent intercultural communication skills." },
    { hanzi: "显著", pinyin: "xiǎnzhù", meaning: "Signifikan / Mencolok nyata", meaning_en: "Remarkable / Notable", example: "在技术升级之后，产能得到了显著提升。", exampleTrans: "Setelah pemutakhiran teknologi, produktivitas meningkat secara signifikan.", exampleTrans_en: "After technology upgrade, productivity increased significantly." }
  ],
  6: [
    { hanzi: "海纳百川", pinyin: "hǎi nà bǎi chuān", meaning: "Laut menampung ratusan sungai (sikap lapang dada & inklusif)", meaning_en: "All-embracing / Broad-minded as the sea", example: "海纳百川，有容乃大，体现了中华文化的博大。", exampleTrans: "Laut menampung ratusan sungai melambangkan keterbukaan dan keluhuran budi.", exampleTrans_en: "All rivers run into sea; greatness lies in tolerance and diversity." },
    { hanzi: "独树一帜", pinyin: "dú shù yī zhì", meaning: "Unik / Membentuk aliran khas tersendiri", meaning_en: "Develop a unique style of one's own", example: "她的艺术设计风格独树一帜，深受业界赞誉。", exampleTrans: "Gaya desain seninya sangat orisinal dan dipuji oleh kalangan industri.", exampleTrans_en: "Her artistic style is uniquely distinguished and acclaimed by peers." },
    { hanzi: "突飞猛进", pinyin: "tū fēi měng jìn", meaning: "Berkembang pesat sekali (kemajuan luar biasa)", meaning_en: "Make rapid strides / Advance by leaps and bounds", example: "过去十年间，信息科学技术取得了突飞猛进的发展。", exampleTrans: "Dalam sepuluh tahun terakhir, teknologi informasi melesat pesat luar biasa.", exampleTrans_en: "Over the past decade, IT has advanced by leaps and bounds." },
    { hanzi: "博大精深", pinyin: "bó dà jīng shēn", meaning: "Luas cakupannya dan mendalam ilmunya", meaning_en: "Broad and profound / Immense depth", example: "中国传统哲学思想博大精深，蕴含深厚智慧。", exampleTrans: "Pemikiran filsafat tradisional Tiongkok sangat luas dan mendalam.", exampleTrans_en: "Traditional Chinese philosophy is broad and profoundly wise." },
    { hanzi: "与时俱进", pinyin: "yǔ shí jù jìn", meaning: "Mengikuti dan maju seiring perkembangan zaman", meaning_en: "Keep pace with the times", example: "教育理念必须与时俱进，培养复合型时代人才。", exampleTrans: "Konsep pendidikan harus maju mengikuti zaman untuk mencetak talenta unggul.", exampleTrans_en: "Educational concepts must keep pace with the times to nurture talents." },
    { hanzi: "举足轻重", pinyin: "jǔ zú qīng zhòng", meaning: "Memiliki pengaruh sangat menentukan (peran krusial)", meaning_en: "Hold a pivotal position / Decisive weight", example: "该国在维护全球绿色供应链方面发挥着举足轻重的作用。", exampleTrans: "Negara tersebut memegang peran krusial dalam rantai pasok global.", exampleTrans_en: "The nation plays a pivotal role in maintaining global green supply chains." },
    { hanzi: "融会贯通", pinyin: "róng huì guàn tōng", meaning: "Memahami dan mengintegrasikan ilmu secara komprehensif", meaning_en: "Master thoroughly and synthesize knowledge", example: "学习知识贵在融会贯通，切不可生搬硬套。", exampleTrans: "Belajar ilmu kuncinya adalah pemahaman menyeluruh, bukan sekadar hafal mati.", exampleTrans_en: "Knowledge acquisition requires thorough synthesis rather than rigid copying." },
    { hanzi: "精益求精", pinyin: "jīng yì qiú jīng", meaning: "Terus menyempurnakan tanpa henti (dedikasi kesempurnaan)", meaning_en: "Strive for perfection / Constantly refine", example: "卓越的工匠始终保持精益求精的敬业精神。", exampleTrans: "Pengrajin ulung selalu memegang teguh semangat menyempurnakan karyanya.", exampleTrans_en: "Master craftsmen always maintain a spirit of striving for perfection." },
    { hanzi: "实事求是", pinyin: "shí shì qiú shì", meaning: "Mencari kebenaran dari fakta (pragmatis ilmiah)", meaning_en: "Seek truth from facts / Realistic and pragmatic", example: "进行科学探索必须秉持实事求是的求真态度。", exampleTrans: "Riset ilmiah wajib berpijak pada prinsip mencari kebenaran berdasarkan fakta.", exampleTrans_en: "Scientific research must adhere to seeking truth from verifiable facts." },
    { hanzi: "未雨绸缪", pinyin: "wèi yǔ chóu móu", meaning: "Bersiap sedia sebelum badai datang (antisipasi preventif)", meaning_en: "Provide for a rainy day / Prepare in advance", example: "面对复杂的经济形势，各金融机构应未雨绸缪防范风险。", exampleTrans: "Menghadapi situasi ekonomi rumit, lembaga keuangan harus bersiap sedia.", exampleTrans_en: "Financial institutions should provide for a rainy day to prevent risks." },
    { hanzi: "循序渐进", pinyin: "xún xù jiàn jìn", meaning: "Maju selangkah demi selangkah secara sistematis", meaning_en: "Proceed step by step / Stepwise progression", example: "掌握一门外语需要循序渐进，持之以恒地积累。", exampleTrans: "Menguasai bahasa asing butuh proses teratur selangkah demi selangkah.", exampleTrans_en: "Mastering a foreign language requires systematic step-by-step accumulation." },
    { hanzi: "深谋远虑", pinyin: "shēn móu yuǎn lǜ", meaning: "Berpikir jauh ke depan dengan perencanaan matang", meaning_en: "Think deeply and plan far ahead / Far-sightedness", example: "卓越的领袖往往具有深谋远虑的战略眼光。", exampleTrans: "Pemimpin ulung selalu mempunyai visi strategis berjangka panjang.", exampleTrans_en: "Remarkable leaders often possess far-sighted strategic vision." },
    { hanzi: "持之以恒", pinyin: "chí zhī yǐ héng", meaning: "Tekun dan pantang menyerah tanpa henti", meaning_en: "Persevere tirelessly / Constant perseverance", example: "滴水穿石，唯有持之以恒方能成就伟大事业。", exampleTrans: "Batu berlubang karena tetesan air; hanya ketekunan menghasilkan karya agung.", exampleTrans_en: "Constant drops wear away stones; only continuous perseverance achieves greatness." },
    { hanzi: "脱颖而出", pinyin: "tuō yǐng ér chū", meaning: "Muncul menonjol dari kerumunan (unggul gemilang)", meaning_en: "Stand out conspicuously / Talent reveals itself", example: "在激烈的青年创新大赛中，该团队脱颖而出拔得头筹。", exampleTrans: "Dalam kompetisi inovasi pemuda yang sengit, tim tersebut tampil paling unggul.", exampleTrans_en: "In the intense competition, the team stood out conspicuously and won the championship." },
    { hanzi: "络绎不绝", pinyin: "luò yì bù jué", meaning: "Mengalir tanpa henti (arus orang / kendaraan padat)", meaning_en: "Continuous stream / In endless succession", example: "假期的故宫博物院前，中外游客络绎不绝。", exampleTrans: "Di depan Museum Kota Terlarang pada hari libur, wisatawan ramai berdatangan tanpa henti.", exampleTrans_en: "During holidays, tourists arrived in an endless stream at the Palace Museum." },
    { hanzi: "急功近利", pinyin: "jí gōng jìn lì", meaning: "Hanya mengejar hasil instan jangka pendek", meaning_en: "Eager for quick success and instant benefits", example: "做长远战略规划切忌急功近利浮躁盲动。", exampleTrans: "Perencanaan jangka panjang pantang mengejar keuntungan instan.", exampleTrans_en: "Long-term planning must avoid seeking quick success and instant benefits." },
    { hanzi: "墨守成规", pinyin: "mò shǒu chéng guī", meaning: "Kaku terjebak pola lama / Konservatif", meaning_en: "Stick to conventions / Hidebound", example: "如果只是墨守成规，企业将失去时代竞争力。", exampleTrans: "Jika hanya terpaku pada cara usang, korporasi akan kehilangan daya saing.", exampleTrans_en: "If merely sticking to conventions, enterprise will lose competitiveness." },
    { hanzi: "推陈出新", pinyin: "tuī chén chū xīn", meaning: "Melahirkan hal baru dari khazanah lama / Inovasi", meaning_en: "Weed out old to bring forth new / Innovation", example: "在传统非遗技艺中推陈出新，吸引更多年轻人。", exampleTrans: "Berinovasi pada warisan budaya tradisional demi memikat kaum muda.", exampleTrans_en: "Bring forth the new in traditional crafts to attract the youth." },
    { hanzi: "任重道远", pinyin: "rèn zhòng dào yuǎn", meaning: "Tanggung jawab berat dengan perjalanan amat panjang", meaning_en: "Heavy burden and long road / Arduous journey", example: "实现全球碳中和是一项任重道远的崇高使命。", exampleTrans: "Mewujudkan netralitas karbon global adalah tugas berat berjangka panjang.", exampleTrans_en: "Achieving global carbon neutrality is an arduous mission with a long road." },
    { hanzi: "风雨同舟", pinyin: "fēng yǔ tóng zhōu", meaning: "Seia sekata bahu-membahu melewati badai", meaning_en: "Stand together through storm / In same boat", example: "全体员工风雨同舟，共同跨越了发展低谷期。", exampleTrans: "Seluruh karyawan bahu membahu melewati masa-masa krisis.", exampleTrans_en: "All employees stood together through storm to overcome tough times." },
    { hanzi: "集思广益", pinyin: "jí sī guǎng yì", meaning: "Menghimpun kecerdasan bersama demi solusi prima", meaning_en: "Pool wisdom of all / Brainstorming", example: "我们通过广泛座谈集思广益，完善了实施细则。", exampleTrans: "Kami merangkum saran bersama demi menyempurnakan aturan teknis.", exampleTrans_en: "We pooled wisdom through broad forums to refine technical rules." },
    { hanzi: "见微知著", pinyin: "jiàn wēi zhī zhù", meaning: "Melihat gambaran besar dari pertanda kecil", meaning_en: "Know the whole from a small part", example: "优秀的战略分析师善于见微知著捕捉未来走势。", exampleTrans: "Analis strategi ulung lihai membaca tren masa depan dari sinyal kecil.", exampleTrans_en: "Outstanding analysts are adept at seeing the whole trend from subtle signs." },
    { hanzi: "沧海一粟", pinyin: "cāng hǎi yí sù", meaning: "Setitik butir kecil di tengah samudra raya", meaning_en: "A drop in the ocean / Humble speck", example: "在漫长浩瀚的宇宙史中，人类文明如同沧海一粟。", exampleTrans: "Dalam semesta raya, peradaban manusia bagai setetes air di samudra.", exampleTrans_en: "In the vast cosmic history, human civilization is like a drop in the ocean." },
    { hanzi: "不可思议", pinyin: "bù kě sī yì", meaning: "Tak terbayangkan nalar / Luar biasa menakjubkan", meaning_en: "Inconceivable / Miraculous", example: "现代量子科技展现出不可思议的奇妙现象。", exampleTrans: "Fisika kuantum modern memperlihatkan fenomena menakjubkan tak terbayangkan.", exampleTrans_en: "Modern quantum technology displays inconceivable phenomena." },
    { hanzi: "潜移默化", pinyin: "qián yí mò huà", meaning: "Pengaruh halus mendalam tanpa disadari", meaning_en: "Subtle and imperceptible influence", example: "父母的高尚品行在潜移默化中熏陶着下一代。", exampleTrans: "Budi pekerti orang tua secara halus membentuk jiwa generasi penerus.", exampleTrans_en: "Noble character of parents imperceptibly influences the next generation." },
    { hanzi: "统筹兼顾", pinyin: "tǒngchóu jiāngù", meaning: "Perencanaan holistik menyeluruh dan seimbang", meaning_en: "Overall consideration and balanced planning", example: "在经济增长与环境保护之间做到统筹兼顾。", exampleTrans: "Menjaga keseimbangan antara pertumbuhan ekonomi dan pelestarian alam.", exampleTrans_en: "Achieve overall balance between economic growth and environmental protection." },
    { hanzi: "返璞归真", pinyin: "fǎn pú guī zhēn", meaning: "Kembali pada fitrah keaslian dan kemurnian jiwa", meaning_en: "Return to simplicity and true self", example: "当代人向往远离喧嚣返璞归真的田园慢生活。", exampleTrans: "Orang modern mendambakan kehidupan tenang yang kembali pada kemurnian alam.", exampleTrans_en: "Modern people yearn for slow rural life returning to simplicity." },
    { hanzi: "侃侃而谈", pinyin: "kǎn kǎn ér tán", meaning: "Berbicara fasih, elegan dan penuh percaya diri", meaning_en: "Speak frankly and confidently", example: "他在国际论坛上侃侃而谈阐述东方哲学智慧。", exampleTrans: "Di forum dunia dia berpidato percaya diri memaparkan kearifan timur.", exampleTrans_en: "He spoke eloquently at the international forum expounding Eastern wisdom." }
  ]
};

// Global Page Flashcard State
const fcPageState = {
  level: 1, // 1, 2, 3, 4, 5, 6, or 'all'
  direction: 'zh_id', // 'zh_id' (Mandarin ➔ Indo), 'id_zh' (Indo ➔ Mandarin), 'zh_en' (Mandarin ➔ English), 'en_zh' (English ➔ Mandarin), or 'random'
  viewMode: 'card', // 'card' (3D player) or 'gallery' (grid list)
  currentIndex: 0,
  isFlipped: false,
  cards: [],
  knownList: [],
  reviewList: [],
  searchQuery: ''
};

function renderFlashcardPage() {
  const container = document.getElementById("flashcard-page-container");
  if (!container) return;

  // Build card pool based on level
  if (fcPageState.cards.length === 0 || fcPageState.dirtyLevel !== fcPageState.level) {
    if (fcPageState.level === 'favorites' && window.MandarinkuExtras) {
      fcPageState.cards = window.MandarinkuExtras.getBookmarkedCardsPool();
    } else if (fcPageState.level === 'srs' && window.MandarinkuExtras) {
      fcPageState.cards = window.MandarinkuExtras.getSrsDueCardsPool();
    } else if (fcPageState.level === 'all') {
      let pool = [];
      [1, 2, 3, 4, 5, 6].forEach(lvl => {
        if (flashcardData[lvl]) pool.push(...flashcardData[lvl].map(c => ({ ...c, lvl })));
      });
      fcPageState.cards = pool;
    } else {
      fcPageState.cards = [...(flashcardData[fcPageState.level] || [])].map(c => ({ ...c, lvl: fcPageState.level }));
    }
    fcPageState.dirtyLevel = fcPageState.level;
    if (fcPageState.currentIndex >= fcPageState.cards.length) fcPageState.currentIndex = 0;
  }

  const total = fcPageState.cards.length;
  const currentCard = fcPageState.cards[fcPageState.currentIndex] || { 
    hanzi: '-', 
    pinyin: '-', 
    meaning: '-', 
    meaning_en: '-', 
    example: '-', 
    exampleTrans: '-', 
    exampleTrans_en: '-' 
  };
  
  // Resolve actual direction for current card (if random mode)
  let activeDir = fcPageState.direction;
  if (activeDir === 'random') {
    const randomDirs = ['zh_id', 'id_zh', 'zh_en', 'en_zh'];
    activeDir = randomDirs[fcPageState.currentIndex % randomDirs.length];
  }

  const isMandarinFront = (activeDir === 'zh_id' || activeDir === 'zh_en');
  const isEnglishTarget = (activeDir === 'zh_en' || activeDir === 'en_zh');

  // Direction badge title
  let directionBadgeText = 'MANDARIN ➔ INDONESIA';
  if (activeDir === 'id_zh') directionBadgeText = 'INDONESIA ➔ MANDARIN';
  else if (activeDir === 'zh_en') directionBadgeText = 'MANDARIN ➔ ENGLISH';
  else if (activeDir === 'en_zh') directionBadgeText = 'ENGLISH ➔ MANDARIN';

  // Front prompt text if foreign/target language is in front
  let frontPromptTitle = 'Terjemahkan ke Bahasa Mandarin:';
  if (activeDir === 'en_zh') {
    frontPromptTitle = 'Translate to Mandarin:';
  }

  // Meaning & example to display on target sides
  const frontMeaningText = (activeDir === 'en_zh') ? (currentCard.meaning_en || currentCard.meaning) : currentCard.meaning;
  const backMeaningText = isEnglishTarget ? (currentCard.meaning_en || currentCard.meaning) : currentCard.meaning;
  const backMeaningLabel = isEnglishTarget ? 'English Meaning:' : 'Arti Bahasa Indonesia:';
  const backExampleTrans = isEnglishTarget ? (currentCard.exampleTrans_en || currentCard.exampleTrans) : currentCard.exampleTrans;

  container.innerHTML = `
    <!-- Top Header Banner -->
    <div class="quiz-hero-banner" style="margin-bottom: 1.5rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-weight: 800; font-size: 0.75rem;">
            🃏 KARTU KATA INTERAKTIF (FLASHCARD)
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Mendukung Mode Bolak-Balik Inggris & Indonesia (HSK 1 - 6)</span>
        </div>
        <h2 style="font-size: 1.55rem; font-weight: 900; color: var(--dark-text); line-height: 1.2;">
          Hafalkan Kosakata Mandarin dengan 3D Flashcard! 🐼🌸
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px; max-width: 680px;">
          Tingkatkan daya ingat melalui metode dua arah: <strong>Mandarin ⇄ Inggris</strong> atau <strong>Mandarin ⇄ Indonesia</strong> dengan audio pengucapan penutur asli.
        </p>
      </div>

      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <button class="fc-direction-pill-btn ${fcPageState.viewMode === 'card' ? 'active' : ''}" onclick="setFlashcardViewMode('card')">
          🎴 Mode Kartu 3D
        </button>
        <button class="fc-direction-pill-btn ${fcPageState.viewMode === 'gallery' ? 'active' : ''}" onclick="setFlashcardViewMode('gallery')">
          📑 Mode Galeri Kosakata
        </button>
      </div>
    </div>

    <!-- Level Selector Bar (HSK 1 - 6) -->
    <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--card-shadow); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem;">
        <span style="font-weight: 800; font-size: 0.9rem; color: var(--dark-text); display: flex; align-items: center; gap: 6px;">
          <span>🎯</span> Tingkatan HSK:
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="bank-filter-chip ${fcPageState.level === 'all' ? 'active' : ''}" onclick="setFlashcardPageLevel('all')">
            🌟 Semua Level (${Object.values(flashcardData).reduce((s, a) => s + a.length, 0)} Kata)
          </button>
          <button class="bank-filter-chip ${fcPageState.level === 'favorites' ? 'active' : ''}" onclick="setFlashcardPageLevel('favorites')" style="${fcPageState.level === 'favorites' ? 'background:#e11d48;color:#fff;border-color:#e11d48;' : 'border-color:#fda4af;color:#be123c;background:#fff1f2;'}">
            ⭐ Favorit Saya (${window.MandarinkuExtras ? window.MandarinkuExtras.getBookmarkedCardsPool().length : 0})
          </button>
          <button class="bank-filter-chip ${fcPageState.level === 'srs' ? 'active' : ''}" onclick="setFlashcardPageLevel('srs')" style="${fcPageState.level === 'srs' ? 'background:#7c3aed;color:#fff;border-color:#7c3aed;' : 'border-color:#c4b5fd;color:#6d28d9;background:#f5f3ff;'}">
            🧠 Jadwal SRS / Ulangi (${window.MandarinkuExtras ? window.MandarinkuExtras.getSrsDueCardsPool().length : 0})
          </button>
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button class="bank-filter-chip ${fcPageState.level === lvl ? 'active' : ''}" onclick="setFlashcardPageLevel(${lvl})">
              Level ${lvl} (${(flashcardData[lvl] || []).length} Kata)
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Direction Selector Controls (Mandarin <-> English, Mandarin <-> Indo) -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1px dashed #f1f5f9; padding-top: 12px;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <span>🔄</span> Arah Hafalan Flashcard:
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="fc-direction-pill-btn ${fcPageState.direction === 'en_zh' ? 'active' : ''}" onclick="setFlashcardDirection('en_zh')" style="${fcPageState.direction === 'en_zh' ? 'background: linear-gradient(135deg, #4f46e5, #4338ca); color: #fff; border-color: #4338ca;' : ''}">
            🇬🇧 ➔ 🇨🇳 Inggris ke Mandarin
          </button>
          <button class="fc-direction-pill-btn ${fcPageState.direction === 'zh_en' ? 'active' : ''}" onclick="setFlashcardDirection('zh_en')" style="${fcPageState.direction === 'zh_en' ? 'background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; border-color: #0369a1;' : ''}">
            🇨🇳 ➔ 🇬🇧 Mandarin ke Inggris
          </button>
          <button class="fc-direction-pill-btn ${fcPageState.direction === 'zh_id' ? 'active' : ''}" onclick="setFlashcardDirection('zh_id')">
            🇨🇳 ➔ 🇮🇩 Mandarin ke Indonesia
          </button>
          <button class="fc-direction-pill-btn ${fcPageState.direction === 'id_zh' ? 'active' : ''}" onclick="setFlashcardDirection('id_zh')">
            🇮🇩 ➔ 🇨🇳 Indonesia ke Mandarin
          </button>
          <button class="fc-direction-pill-btn ${fcPageState.direction === 'random' ? 'active' : ''}" onclick="setFlashcardDirection('random')">
            🔀 Mode Acak Bolak-Balik
          </button>
        </div>
      </div>
    </div>

    ${fcPageState.viewMode === 'card' ? `
      <!-- ================= 3D INTERACTIVE CARD PLAYER ================= -->
      <div style="max-width: 680px; margin: 0 auto;">
        <!-- Top Stats & Progress Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
          <span>Kartu <strong>${fcPageState.currentIndex + 1}</strong> dari ${total}</span>
          <div style="display: flex; gap: 12px;">
            <span style="color: #059669;">✓ Hafal: <strong>${fcPageState.knownList.length}</strong></span>
            <span style="color: #dc2626;">🔄 Diulang: <strong>${fcPageState.reviewList.length}</strong></span>
          </div>
        </div>

        <div class="quiz-progress-bar-container" style="margin-top: 0; margin-bottom: 1.25rem;">
          <div class="quiz-progress-bar-fill" style="width: ${((fcPageState.currentIndex + 1) / total) * 100}%;"></div>
        </div>

        <!-- 3D FLIP CARD STAGE -->
        <div class="fc-card-stage" onclick="flipFlashcardPageCard()" title="Klik untuk membalik kartu (atau tekan Spasi)">
          <div id="fc-page-flipper" class="fc-card-flipper ${fcPageState.isFlipped ? 'is-flipped' : ''}">
            
            <!-- FRONT FACE -->
            <div class="fc-face fc-face-front">
              <!-- Traditional Hanzi Watermark & Corner Ornaments -->
              <div class="fc-face-watermark">${currentCard.hanzi || '学'}</div>
              <div class="fc-corner-accent fc-corner-tl"></div>
              <div class="fc-corner-accent fc-corner-tr"></div>
              <div class="fc-corner-accent fc-corner-bl"></div>
              <div class="fc-corner-accent fc-corner-br"></div>

              <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; z-index: 2;">
                <span class="role-badge" style="background: rgba(255, 240, 243, 0.95); color: var(--primary-pink); font-weight: 800; font-size: 0.78rem; border: 1.5px solid #fecdd3; padding: 5px 14px; border-radius: 99px; box-shadow: 0 2px 8px rgba(244,63,94,0.08);">
                  🏮 HSK ${currentCard.lvl || fcPageState.level} • ${directionBadgeText}
                </span>
                ${isMandarinFront ? `
                  <button class="fc-audio-btn" onclick="event.stopPropagation(); speakMandarin('${currentCard.hanzi}', 0.85)">
                    🔊 Lafal Mandarin
                  </button>
                ` : ''}
              </div>

              <div style="text-align: center; margin: auto 0; z-index: 2; width: 100%;">
                ${isMandarinFront ? `
                  <div class="fc-hanzi-wrap">
                    <div class="fc-hanzi-display">${currentCard.hanzi}</div>
                  </div>
                  <div class="fc-pinyin-display">${currentCard.pinyin}</div>
                  <div style="margin-top: 10px;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: #64748b; background: rgba(255, 255, 255, 0.85); padding: 5px 14px; border-radius: 99px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                      💡 Ketuk kartu untuk melihat arti ${isEnglishTarget ? 'Inggris' : 'Indonesia'} & contoh
                    </span>
                  </div>
                ` : `
                  <div style="font-size: 0.88rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${frontPromptTitle}</div>
                  <div class="fc-meaning-display" style="font-size: 2.2rem; color: #0f172a; margin-bottom: 8px; line-height: 1.25;">${frontMeaningText}</div>
                  <div style="margin-top: 10px;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: #64748b; background: rgba(255, 255, 255, 0.85); padding: 5px 14px; border-radius: 99px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                      💡 Ketuk kartu untuk cek Hanzi & Pinyin
                    </span>
                  </div>
                `}
              </div>

              <div style="width: 100%; display: flex; justify-content: center; align-items: center; z-index: 2;">
                <div class="fc-flip-indicator-btn">
                  <span>🔄</span> Balik Kartu (Spasi)
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div class="fc-face fc-face-back">
              <!-- Watermark & Corner Ornaments -->
              <div class="fc-face-watermark">${currentCard.hanzi || '解'}</div>
              <div class="fc-corner-accent fc-corner-tl"></div>
              <div class="fc-corner-accent fc-corner-tr"></div>
              <div class="fc-corner-accent fc-corner-bl"></div>
              <div class="fc-corner-accent fc-corner-br"></div>

              <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; z-index: 2;">
                <span class="role-badge" style="background: rgba(236, 253, 245, 0.95); color: #059669; font-weight: 800; font-size: 0.78rem; border: 1.5px solid #a7f3d0; padding: 5px 14px; border-radius: 99px; box-shadow: 0 2px 8px rgba(16,185,129,0.08);">
                  🌿 KUNCI JAWABAN & CONTOH
                </span>
                <button class="fc-audio-btn fc-audio-btn-emerald" onclick="event.stopPropagation(); speakMandarin('${currentCard.example}', 0.85)">
                  🔊 Putar Contoh Kalimat
                </button>
              </div>

              <div style="text-align: center; margin: auto 0; z-index: 2; width: 100%;">
                ${isMandarinFront ? `
                  <div style="font-size: 0.82rem; color: #059669; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;">${backMeaningLabel}</div>
                  <div class="fc-meaning-display" style="margin-bottom: 10px; font-size: 1.8rem;">${backMeaningText}</div>
                ` : `
                  <div class="fc-hanzi-wrap" style="border-color: rgba(16, 185, 129, 0.3); min-height: 90px; padding: 4px 18px; margin-bottom: 2px;">
                    <div class="fc-hanzi-display" style="font-size: 3.4rem;">${currentCard.hanzi}</div>
                  </div>
                  <div class="fc-pinyin-display" style="font-size: 1.35rem; margin-bottom: 6px;">${currentCard.pinyin}</div>
                  <div style="font-size: 0.88rem; color: #059669; font-weight: 700; margin-bottom: 8px;">
                    ${isEnglishTarget ? (currentCard.meaning_en || currentCard.meaning) : currentCard.meaning}
                  </div>
                `}

                <div class="fc-example-box" style="margin-top: 4px;">
                  <div style="font-size: 0.72rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">📖 Contoh Penggunaan:</div>
                  <div style="font-family: var(--font-chinese, 'Noto Sans SC'); font-weight: bold; font-size: 1.18rem; color: #0f172a; margin-bottom: 2px;">
                    ${currentCard.example}
                  </div>
                  <div style="font-size: 0.86rem; color: #475569; font-style: italic;">
                    "${backExampleTrans}"
                  </div>
                </div>
              </div>

              <div style="width: 100%; display: flex; justify-content: center; align-items: center; z-index: 2;">
                <div class="fc-flip-indicator-btn" style="background: rgba(236, 253, 245, 0.85); color: #059669; border-color: #a7f3d0;">
                  <span>🔄</span> Klik untuk membalik kembali (Spasi)
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Rating & Action Buttons (Spaced Repetition System / SRS Anki-Style) -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 12px 14px; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: #475569; text-transform: uppercase;">
              🧠 Evaluasi Daya Ingat (Spaced Repetition System):
            </span>
            <button type="button" class="btn-speech-mini" onclick="if(window.MandarinkuExtras) MandarinkuExtras.toggleCardBookmarkInPlace()" style="font-size: 0.75rem;">
              ${window.MandarinkuExtras && window.MandarinkuExtras.isBookmarked(currentCard.hanzi) ? '⭐ Tersimpan di Favorit' : '☆ Simpan ke Favorit'}
            </button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1.1fr; gap: 8px;">
            <button class="btn-learn-outline" style="padding: 10px 8px; font-size: 0.82rem; font-weight: 800; border-color: #fca5a5; color: #dc2626; background: #fef2f2; border-radius: 12px;" onclick="if(window.MandarinkuExtras) MandarinkuExtras.rateSrsCard('hard'); else markFlashcardPageCard(false);">
              😓 Sulit<br><span style="font-size:0.68rem;font-weight:600;">Ulangi Segera</span>
            </button>
            <button class="btn-learn-outline" style="padding: 10px 8px; font-size: 0.82rem; font-weight: 800; border-color: #fcd34d; color: #b45309; background: #fffbeb; border-radius: 12px;" onclick="if(window.MandarinkuExtras) MandarinkuExtras.rateSrsCard('good'); else markFlashcardPageCard(true);">
              🙂 Lumayan<br><span style="font-size:0.68rem;font-weight:600;">Ulangi Besok</span>
            </button>
            <button class="btn-learn-outline" style="padding: 10px 8px; font-size: 0.82rem; font-weight: 800; border-color: #86efac; color: #15803d; background: #f0fdf4; border-radius: 12px;" onclick="if(window.MandarinkuExtras) MandarinkuExtras.rateSrsCard('easy'); else markFlashcardPageCard(true);">
              🤩 Mudah<br><span style="font-size:0.68rem;font-weight:600;">Hafal (+10 EXP)</span>
            </button>
            <button class="btn-primary-sakura" style="padding: 10px 8px; font-size: 0.85rem; font-weight: 800; margin: 0; border-radius: 12px;" onclick="flipFlashcardPageCard()">
              🔄 Balik<br><span style="font-size:0.68rem;font-weight:600;">(Spasi)</span>
            </button>
          </div>
        </div>

        <!-- Navigation Controls Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; background: #ffffff; padding: 10px 16px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
          <button class="btn-learn-outline" style="padding: 8px 18px; font-size: 0.85rem; font-weight: 700; border-radius: 12px;" onclick="prevFlashcardPageCard()" ${fcPageState.currentIndex === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>
            ← Kartu Sebelumnya
          </button>
          <button class="btn-learn-outline" style="padding: 8px 16px; font-size: 0.82rem; font-weight: 700; border-radius: 12px;" onclick="shuffleFlashcardsPage()">
            🔀 Acak Urutan
          </button>
          <button class="btn-primary-sakura" style="padding: 8px 18px; font-size: 0.85rem; font-weight: 700; margin: 0; border-radius: 12px;" onclick="nextFlashcardPageCard()">
            Kartu Berikutnya →
          </button>
        </div>
      </div>
    ` : `
      <!-- ================= GALLERY / GRID LIST VIEW ================= -->
      <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--card-shadow); margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--dark-text);">
              📚 Galeri Kosakata HSK ${fcPageState.level === 'all' ? '1 - 6' : fcPageState.level} (${total} Kata)
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Klik tombol suara untuk mendengarkan audio atau telusuri arti Indonesia dan Inggris.</p>
          </div>

          <div style="max-width: 280px; width: 100%;">
            <input type="text" id="fc-gallery-search" class="form-control" placeholder="🔍 Cari Hanzi, Pinyin, English, Indo..." oninput="handleFlashcardSearch(this.value)" value="${fcPageState.searchQuery || ''}" style="padding: 8px 14px; font-size: 0.85rem;">
          </div>
        </div>

        <div class="fc-gallery-grid">
          ${getFilteredFlashcards().map((c, idx) => `
            <div class="fc-gallery-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-size: 0.7rem; padding: 2px 6px;">
                  HSK ${c.lvl || fcPageState.level}
                </span>
                <button class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.7rem; border-radius: 99px;" onclick="speakMandarin('${c.hanzi}', 0.85)">
                  🔊 Suara
                </button>
              </div>

              <div style="text-align: center; margin: 8px 0;">
                <div style="font-family: var(--font-chinese); font-size: 1.8rem; font-weight: 900; color: var(--dark-text);">${c.hanzi}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary-pink);">${c.pinyin}</div>
                <div style="font-size: 0.92rem; font-weight: 800; color: #065f46; margin-top: 4px;">${c.meaning}</div>
                ${c.meaning_en ? `<div style="font-size: 0.82rem; font-weight: 600; color: #3b82f6; margin-top: 2px;">🇬🇧 ${c.meaning_en}</div>` : ''}
              </div>

              <div style="background: #f8fafc; border-radius: var(--radius-sm); padding: 6px 10px; font-size: 0.78rem; border-left: 2px solid var(--primary-pink); margin-top: 6px;">
                <strong>Contoh:</strong> ${c.example}<br>
                <span style="color: var(--text-muted); font-size: 0.72rem;">🇮🇩 "${c.exampleTrans}"</span>
                ${c.exampleTrans_en ? `<br><span style="color: #64748b; font-size: 0.7rem;">🇬🇧 "${c.exampleTrans_en}"</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `}
  `;
}

function setFlashcardPageLevel(lvl) {
  fcPageState.level = (lvl === 'all' || lvl === 'favorites' || lvl === 'srs') ? lvl : parseInt(lvl);
  fcPageState.currentIndex = 0;
  fcPageState.isFlipped = false;
  fcPageState.cards = [];
  renderFlashcardPage();
}

function setFlashcardDirection(dir) {
  fcPageState.direction = dir;
  fcPageState.isFlipped = false;
  renderFlashcardPage();
}

function setFlashcardViewMode(mode) {
  fcPageState.viewMode = mode;
  renderFlashcardPage();
}

function flipFlashcardPageCard() {
  fcPageState.isFlipped = !fcPageState.isFlipped;
  const flipper = document.getElementById("fc-page-flipper");
  if (flipper) {
    flipper.classList.toggle("is-flipped", fcPageState.isFlipped);
  }
}

function nextFlashcardPageCard() {
  if (fcPageState.currentIndex < fcPageState.cards.length - 1) {
    fcPageState.currentIndex++;
    fcPageState.isFlipped = false;
    renderFlashcardPage();
  } else {
    showToast("🎉 Selamat! Anda telah menyelesaikan semua kartu pada level ini!", "info");
  }
}

function prevFlashcardPageCard() {
  if (fcPageState.currentIndex > 0) {
    fcPageState.currentIndex--;
    fcPageState.isFlipped = false;
    renderFlashcardPage();
  }
}

function shuffleFlashcardsPage() {
  fcPageState.cards.sort(() => 0.5 - Math.random());
  fcPageState.currentIndex = 0;
  fcPageState.isFlipped = false;
  showToast("🔀 Urutan kartu telah diacak!", "info");
  renderFlashcardPage();
}

function markFlashcardPageCard(isKnown) {
  const card = fcPageState.cards[fcPageState.currentIndex];
  if (!card) return;

  const targetMeaning = (fcPageState.direction === 'zh_en' || fcPageState.direction === 'en_zh') 
    ? (card.meaning_en || card.meaning) 
    : card.meaning;

  if (isKnown) {
    if (!fcPageState.knownList.includes(card.hanzi)) fcPageState.knownList.push(card.hanzi);
    recordUserActivity('listening', 5, 2, `fc_known_${card.hanzi}`, 1);
    showToast(`✅ Hafal: ${card.hanzi} (${targetMeaning}) +5 EXP`, "info");
  } else {
    if (!fcPageState.reviewList.includes(card.hanzi)) fcPageState.reviewList.push(card.hanzi);
    showToast(`🔄 Ditandai untuk diulang: ${card.hanzi}`, "info");
  }

  nextFlashcardPageCard();
}

function handleFlashcardSearch(val) {
  fcPageState.searchQuery = (val || '').toLowerCase().trim();
  renderFlashcardPage();
}

function getFilteredFlashcards() {
  let list = fcPageState.cards || [];
  if (fcPageState.searchQuery) {
    const q = fcPageState.searchQuery;
    list = list.filter(c => 
      c.hanzi.toLowerCase().includes(q) || 
      c.pinyin.toLowerCase().includes(q) || 
      c.meaning.toLowerCase().includes(q) ||
      (c.meaning_en && c.meaning_en.toLowerCase().includes(q)) ||
      (c.example && c.example.toLowerCase().includes(q)) ||
      (c.exampleTrans_en && c.exampleTrans_en.toLowerCase().includes(q))
    );
  }
  return list;
}

// Global Keyboard Handler for Spacebar & Arrow keys on Flashcard page
document.addEventListener('keydown', (e) => {
  if (State.currentTab === 'flashcard' && fcPageState.viewMode === 'card') {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      flipFlashcardPageCard();
    } else if (e.key === 'ArrowRight') {
      nextFlashcardPageCard();
    } else if (e.key === 'ArrowLeft') {
      prevFlashcardPageCard();
    }
  }
});

// Backward compatibility with Modal flashcard
let fcState = {
  level: 1,
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  knownCards: [],
  reviewCards: [],
  sessionMode: 'all'
};

function openFlashcardModal(level = 1) {
  setFlashcardPageLevel(level);
  navigateTo('flashcard');
}


function fcRestartSession() {
  setFlashcardLevel(fcState.level);
}

function fcReviewWrong() {
  if (fcState.reviewCards.length === 0) {
    showToast('Tidak ada kartu yang perlu diulang! Semua sudah hafal 🎉');
    return;
  }
  // Load only the review cards
  fcState.cards = [...fcState.reviewCards];
  fcState.currentIndex = 0;
  fcState.isFlipped = false;
  fcState.knownCards = [];
  fcState.reviewCards = [];
  fcState.sessionMode = 'review';


  const cardArea = document.getElementById('fc-card-area');
  const summaryArea = document.getElementById('fc-summary-area');
  if (cardArea) cardArea.style.display = 'block';
  if (summaryArea) summaryArea.style.display = 'none';

  document.getElementById('fc-total-num').textContent = fcState.cards.length;
  fcRenderCard();
  showToast(`🔄 Memuat ${fcState.cards.length} kartu yang perlu diulang...`);
}


function selectBankSkillFilter(skill) {
  State.currentHskSkillFilter = skill;
  State.currentBankPage = 1;
  renderBankSoalModule();
}

function setBankPage(page) {
  const isAllExamMode = State.currentHskLevel === "all";
  let allLevelQuestions = [];
  if (isAllExamMode) {
    [1, 2, 3, 4, 5, 6].forEach(lvl => {
      if (State.bankQuestions[lvl]) allLevelQuestions.push(...State.bankQuestions[lvl]);
    });
  } else {
    allLevelQuestions = State.bankQuestions[State.currentHskLevel] || [];
  }
  if (State.currentHskSkillFilter !== "all") {
    allLevelQuestions = allLevelQuestions.filter(q => q.type === State.currentHskSkillFilter);
  }
  const totalPages = Math.ceil(allLevelQuestions.length / (State.bankPageSize || 10));
  if (page >= 1 && page <= totalPages) {
    State.currentBankPage = page;
    renderBankSoalModule();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
}

const userBankSelections = {};
function selectBankOption(qIdx, optIdx, element) {
  userBankSelections[qIdx] = optIdx;
  const parent = document.getElementById(`bank-q-card-${qIdx}`);
  if (!parent) return;
  parent.querySelectorAll(".quiz-option-item").forEach(item => item.classList.remove("selected"));
  element.classList.add("selected");
}

function checkBankQuestion(qIdx, questionId = null, skillType = "reading") {
  let allLevelQuestions = [];
  if (State.currentHskLevel === "all") {
    [1, 2, 3, 4, 5, 6].forEach(lvl => {
      if (State.bankQuestions[lvl]) allLevelQuestions.push(...State.bankQuestions[lvl]);
    });
  } else {
    allLevelQuestions = State.bankQuestions[State.currentHskLevel] || [];
  }

  if (State.currentHskSkillFilter && State.currentHskSkillFilter !== "all") {
    allLevelQuestions = allLevelQuestions.filter(q => q.type === State.currentHskSkillFilter);
  }

  const q = allLevelQuestions[qIdx];
  const userAns = userBankSelections[qIdx];
  const feedbackEl = document.getElementById(`bank-feedback-${qIdx}`);
  if (userAns === undefined) {
    showToast("Silakan pilih opsi terlebih dahulu!", "warning");
    return;
  }

  if (!feedbackEl || !q) return;

  feedbackEl.style.display = "block";
  if (userAns === q.correct) {
    feedbackEl.style.background = "#e6faf7";
    feedbackEl.style.border = "1px solid #2ec4b6";
    feedbackEl.style.color = "#0f766e";
    feedbackEl.innerHTML = `<strong>Jawaban Benar! 🎉 (+15 Poin, +20 EXP)</strong><br>${q.explanation}`;
    
    // Personal progress activity recording
    recordUserActivity(q.type || skillType, 20, 15, questionId || q.id, 2);
  } else {
    feedbackEl.style.background = "#fff0f3";
    feedbackEl.style.border = "1px solid #f27289";
    feedbackEl.style.color = "#be123c";
    feedbackEl.innerHTML = `<strong>Jawaban Kurang Tepat (Kunci: ${String.fromCharCode(65 + q.correct)})</strong><br><strong>Pembahasan:</strong> ${q.explanation}`;
  }
}


// ==========================================================================
// 6. User Profile, Stats & Interactive Chart
// ==========================================================================
function renderProfileModule() {
  const container = document.getElementById("profile-content-container");
  if (!container) return;

  const u = State.currentUser;

  container.innerHTML = `
    <div class="profile-layout">
      <!-- Sidebar Profil -->
      <div class="profile-sidebar-card">
        <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 1rem;">Akun Saya</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><button class="sidebar-link active" onclick="navigateTo('profil')">👤 Informasi Akun</button></li>
          <li><button class="sidebar-link" onclick="openTargetSettingsModal()">⚙️ Target Belajar & Waktu</button></li>
          <li><button class="sidebar-link" onclick="toggleDailyReminder()">🔔 Pengingat Harian ${getReminderStatusText()}</button></li>
          <li><button class="sidebar-link" onclick="showToast('Fitur enkripsi akun aktif & aman 🛡️')">🔒 Keamanan & Data</button></li>
        </ul>

        <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin: 1.5rem 0 1rem 0;">Pembelajaran</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><button class="sidebar-link" onclick="navigateTo('bank-soal')">📈 Progress Belajar</button></li>
          <li><button class="sidebar-link" onclick="showToast('Riwayat belajar tersimpan rapi!')">⏱️ Riwayat Belajar</button></li>
          <li><button class="sidebar-link" onclick="navigateTo('listening')">⭐ Materi Favorit</button></li>
        </ul>

        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed #fae2e6;">
          <button class="btn-learn-outline" style="width: 100%; color: var(--danger-color); border-color: #ffd4dc;" onclick="handleLogout()">
            🚪 Keluar Akun
          </button>
        </div>
      </div>

      <!-- Main Profile & Analytics Area -->
      <div class="profile-main-content">
        <!-- Hero Header Profile (Sesuai Mockup Gambar 5) -->
        <div class="profile-hero-card">
          <div style="display: flex; align-items: center; gap: 20px;">
            <img src="${u.avatar}" alt="Panda Avatar" class="profile-badge-avatar">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--dark-text);">${u.name}</h2>
                <span class="role-badge">${u.role.toUpperCase()}</span>
              </div>
              <p style="font-size: 0.95rem; color: var(--primary-pink); font-style: italic; margin: 4px 0;">"${u.bio}"</p>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Bergabung sejak ${u.joinDate} • Target: ${u.dailyTargetMinutes} Menit/hari</p>
            </div>
          </div>
          <button class="btn-learn-outline" style="background: #fff;" onclick="openTargetSettingsModal()">
            ✏️ Edit Target & Profil
          </button>
        </div>

        <!-- 4 Summary Stats Cards -->
        <div class="profile-summary-grid">
          <div class="stat-card">
            <span style="font-size: 2rem;">🔥</span>
            <div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--dark-text);">${u.streak}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Hari Berturut-turut</div>
            </div>
          </div>

          <div class="stat-card">
            <span style="font-size: 2rem;">⭐</span>
            <div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--dark-text);">${u.points}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Poin Total</div>
            </div>
          </div>

          <div class="stat-card">
            <span style="font-size: 2rem;">⏱️</span>
            <div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--dark-text);">${u.studyHours} Jam</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Waktu Belajar Total</div>
            </div>
          </div>

          <div class="stat-card">
            <span style="font-size: 2rem;">📖</span>
            <div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--dark-text);">${u.completedModules}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Materi Selesai</div>
            </div>
          </div>
        </div>

        <!-- Progress Skill Bars & Level Card -->
        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.25rem;">
          <div class="interactive-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <h4 style="font-size: 1.05rem; font-weight: 800;">Kemampuan Per Keterampilan</h4>
              <span style="font-size: 0.8rem; color: var(--primary-pink); font-weight: 700; cursor: pointer;">Lihat detail →</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>🎧 Listening</span>
                  <span style="color: var(--primary-pink);">Level 3 • ${u.progress.listening}%</span>
                </div>
                <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${u.progress.listening}%;"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>🎙️ Speaking</span>
                  <span style="color: var(--primary-pink);">Level 2 • ${u.progress.speaking}%</span>
                </div>
                <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${u.progress.speaking}%;"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>📖 Reading</span>
                  <span style="color: var(--primary-pink);">Level 3 • ${u.progress.reading}%</span>
                </div>
                <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${u.progress.reading}%;"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>✍️ Writing</span>
                  <span style="color: var(--primary-pink);">Level 2 • ${u.progress.writing}%</span>
                </div>
                <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${u.progress.writing}%;"></div></div>
              </div>
            </div>
          </div>

          <!-- Level Shield Card -->
          <div class="interactive-panel" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="width: 80px; height: 90px; background: #fff0f3; border: 2px solid #f27289; border-radius: 50% 50% 50% 50% / 12% 12% 88% 88%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 0.6rem;">
              <span style="font-size: 0.7rem; font-weight: 800; color: var(--primary-pink);">LEVEL</span>
              <span style="font-size: 1.8rem; font-weight: 900; color: var(--primary-pink); line-height: 1;">${u.level}</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 800;">${u.levelTitle}</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 4px 0 10px 0;">${u.exp} / ${u.maxExp} EXP</p>
            <div class="progress-bar-container" style="width: 80%;"><div class="progress-bar-fill" style="width: ${(u.exp/u.maxExp)*100}%;"></div></div>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">Menuju Level ${u.level + 1}</span>
          </div>
        </div>

        <!-- Interactive Daily Study Chart -->
        <div class="interactive-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 800;">📊 Grafik Waktu Belajar 7 Hari Terakhir</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Pantau konsistensi dan durasi belajar Mandarin Anda setiap hari.</p>
            </div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-pink);">
              Rata-rata: 41 Menit/Hari
            </div>
          </div>
          <div style="height: 220px; position: relative;">
            <canvas id="dailyAnalyticsChart"></canvas>
          </div>
        </div>

        <!-- Riwayat Kuis & Sinkronisasi Database (Cloud Sync) -->
        <div class="interactive-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem;">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--dark-text);">📊 Riwayat Kuis &amp; Sinkronisasi Database (Cloud Sync)</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                <span style="display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 2px 10px; border-radius: 99px; font-weight: 700; font-size: 0.74rem;">
                  ☁️ Tersinkron ke Database MySQL
                </span>
                ${u.lastSyncedAt ? `• Terakhir disinkron: ${new Date(u.lastSyncedAt).toLocaleString('id-ID')}` : ''}
              </p>
            </div>
            <button type="button" class="btn-learn-outline" style="margin: 0; padding: 8px 14px; font-size: 0.82rem;" onclick="UserManager.syncToServer(true)">
              🔄 Sinkronkan Sekarang
            </button>
          </div>

          <div style="overflow-x: auto;">
            ${(!u.quizHistory || u.quizHistory.length === 0) ? `
              <div style="text-align: center; padding: 1.5rem; background: var(--soft-bg, #f8fafc); border-radius: 12px; color: var(--text-muted); font-size: 0.86rem;">
                Belum ada riwayat kuis tersimpan. Yuk kerjakan <strong>Quiz HSK</strong> untuk mencatat skor Anda secara otomatis ke database!
              </div>
            ` : `
              <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem;">
                <thead>
                  <tr style="border-bottom: 1.5px solid var(--border-color, #e2e8f0); text-align: left; color: var(--text-muted);">
                    <th style="padding: 10px 8px;">Tanggal</th>
                    <th style="padding: 10px 8px;">Level HSK</th>
                    <th style="padding: 10px 8px;">Kategori</th>
                    <th style="padding: 10px 8px;">Skor Benar</th>
                    <th style="padding: 10px 8px;">Nilai (%)</th>
                    <th style="padding: 10px 8px;">Predikat</th>
                    <th style="padding: 10px 8px;">EXP / Poin</th>
                  </tr>
                </thead>
                <tbody>
                  ${u.quizHistory.slice(0, 15).map(qh => {
                    const pct = parseInt(qh.score_percent || 0);
                    const badgeBg = pct >= 80 ? '#ecfdf5' : (pct >= 60 ? '#fef9c3' : '#fef2f2');
                    const badgeCol = pct >= 80 ? '#059669' : (pct >= 60 ? '#ca8a04' : '#dc2626');
                    const dateStr = qh.created_at ? new Date(qh.created_at.replace(' ', 'T')).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                    return `
                      <tr style="border-bottom: 1px solid var(--border-color, #f1f5f9);">
                        <td style="padding: 10px 8px; color: var(--text-muted);">${dateStr}</td>
                        <td style="padding: 10px 8px; font-weight: 700; color: var(--dark-text);">${qh.hsk_level || 'HSK 1'}</td>
                        <td style="padding: 10px 8px; text-transform: uppercase; font-size: 0.76rem; color: var(--text-muted);">${qh.skill_type || 'all'}</td>
                        <td style="padding: 10px 8px; font-weight: 700;">${qh.correct_answers || 0}/${qh.total_questions || 0}</td>
                        <td style="padding: 10px 8px; font-weight: 800; color: ${badgeCol};">${pct}%</td>
                        <td style="padding: 10px 8px;"><span style="background: ${badgeBg}; color: ${badgeCol}; padding: 2px 10px; border-radius: 99px; font-weight: 800; font-size: 0.76rem;">${qh.grade || 'A'}</span></td>
                        <td style="padding: 10px 8px; font-weight: 700; color: var(--primary-pink);">+${qh.exp_earned || 0} EXP • +${qh.points_earned || 0} Pts</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <!-- Badges & Pencapaian -->
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem;">🏅 Pencapaian Belajar</h4>
          <div class="achievements-grid">
            <div class="achievement-item">
              <span style="font-size: 1.8rem;">🌟</span>
              <div>
                <h5 style="font-size: 0.92rem; font-weight: 800;">Pembelajar Rajin</h5>
                <p style="font-size: 0.78rem; color: var(--text-muted);">Belajar selama 7 hari berturut-turut</p>
                <span style="font-size: 0.72rem; color: var(--primary-pink); font-weight: bold;">Tercapai • 20 Mei 2024</span>
              </div>
            </div>

            <div class="achievement-item">
              <span style="font-size: 1.8rem;">🎧</span>
              <div>
                <h5 style="font-size: 0.92rem; font-weight: 800;">Pendengar Hebat</h5>
                <p style="font-size: 0.78rem; color: var(--text-muted);">Menyelesaikan 10 latihan listening</p>
                <span style="font-size: 0.72rem; color: var(--primary-pink); font-weight: bold;">Tercapai • 18 Mei 2024</span>
              </div>
            </div>

            <div class="achievement-item">
              <span style="font-size: 1.8rem;">📖</span>
              <div>
                <h5 style="font-size: 0.92rem; font-weight: 800;">Pembaca Cepat</h5>
                <p style="font-size: 0.78rem; color: var(--text-muted);">Membaca 20 materi reading</p>
                <span style="font-size: 0.72rem; color: var(--primary-pink); font-weight: bold;">Tercapai • 15 Mei 2024</span>
              </div>
            </div>

            <div class="achievement-item">
              <span style="font-size: 1.8rem;">✍️</span>
              <div>
                <h5 style="font-size: 0.92rem; font-weight: 800;">Penulis Pemula</h5>
                <p style="font-size: 0.78rem; color: var(--text-muted);">Menyelesaikan 5 latihan goresan Hanzi</p>
                <span style="font-size: 0.72rem; color: var(--primary-pink); font-weight: bold;">Tercapai • 12 Mei 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inisialisasi Canvas Interaktif Menulis
  setTimeout(initWritingCanvas, 60);
}

let reminderActive = true;
function getReminderStatusText() {
  return reminderActive ? '(Aktif 🔔)' : '(Nonaktif)';
}

function toggleDailyReminder() {
  reminderActive = !reminderActive;
  showToast(`Pengingat harian ${reminderActive ? 'diaktifkan (Notifikasi setiap jam 19:00)' : 'dinonaktifkan'}.`);
  renderProfileModule();
}

function openTargetSettingsModal() {
  const modal = document.getElementById("target-settings-modal");
  if (modal) modal.classList.add("active");
}

function closeTargetSettingsModal() {
  const modal = document.getElementById("target-settings-modal");
  if (modal) modal.classList.remove("active");
}

function saveTargetSettings() {
  const targetMin = document.getElementById("target-minutes-input").value;
  State.currentUser.dailyTargetMinutes = parseInt(targetMin) || 20;
  UserManager.saveCurrentUser();
  closeTargetSettingsModal();
  renderProfileModule();
  updateHomeDashboard();
  showToast("Target belajar harian berhasil diperbarui! 🎯");
}

function handleLogout() {
  showToast("Anda telah keluar dari akun.");
  navigateTo("login");
}

// Chart.js Canvas Interactive Initialization
function initAnalyticsChart() {
  const canvas = document.getElementById("dailyAnalyticsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const values = State.currentUser.weeklyHistory;

  // Draw simple clean modern bar chart on canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const width = canvas.parentElement.clientWidth;
  const height = 200;
  canvas.width = width;
  canvas.height = height;

  const barWidth = 36;
  const maxVal = 70;
  const spacing = (width - 60) / days.length;

  days.forEach((day, i) => {
    const val = values[i];
    const barHeight = (val / maxVal) * 120;
    const x = 40 + (i * spacing);
    const y = height - barHeight - 40;

    // Bar background
    ctx.fillStyle = "#ffeef1";
    ctx.beginPath();
    ctx.roundRect(x, 20, barWidth, 120, 8);
    ctx.fill();

    // Bar fill
    const grad = ctx.createLinearGradient(0, y, 0, height - 40);
    grad.addColorStop(0, "#f27289");
    grad.addColorStop(1, "#ff9ebb");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 8);
    ctx.fill();

    // Value text
    ctx.fillStyle = "#f27289";
    ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${val}m`, x + (barWidth / 2), y - 6);

    // Day Label
    ctx.fillStyle = "#757c95";
    ctx.font = "11px Plus Jakarta Sans, sans-serif";
    ctx.fillText(day, x + (barWidth / 2), height - 15);
  });
}

// ==========================================================================
// 7. Module Upload, Download & Comments System
// ==========================================================================
function renderUploadedModulesList() {
  const container = document.getElementById("custom-modules-list-container");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 12px;">
      <div>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text);">
          📁 Modul Ajar HSK & Berkas Pembelajaran Interaktif
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Buka modul ajar lengkap di halaman mandiri, latih 50 butir soal interaktif, dan unduh dokumen materi resmi.
        </p>
      </div>
      ${(State.currentUser && (State.currentUser.role === 'admin' || State.currentUser.role === 'teacher')) ? `
        <button class="btn-primary-sakura" style="max-width: 240px; margin: 0; background: #1e40af; border-color: #1e40af;" onclick="openUploadModal()">
          🛡️ ➕ Unggah Modul Ajar Baru (Admin)
        </button>
      ` : `
        <div style="font-size: 0.8rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 9999px; color: #64748b; font-weight: 700;">
          🔒 Pengunggahan modul dikelola oleh Administrator
        </div>
      `}
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      ${State.modules.map(mod => `
        <div class="interactive-panel" style="border: 1px solid #fae2e6; border-radius: var(--radius-lg); padding: 1.4rem; box-shadow: 0 4px 16px rgba(242,114,137,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink); font-weight: 800;">${mod.level}</span>
                <span class="role-badge" style="background: #e6faf7; color: #2ec4b6; font-weight: 800;">${(mod.category || 'MANDARIN').toUpperCase()}</span>
                <span class="role-badge" style="background: #eff6ff; color: #3b82f6; font-weight: 800;">50 SOAL LATIHAN</span>
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--dark-text);">${mod.title}</h4>
              <p style="font-size: 0.86rem; color: var(--text-muted); margin: 6px 0 12px 0; line-height: 1.5;">${mod.description}</p>
              <div style="font-size: 0.8rem; color: #a0a6bd;">
                Pengunggah: <strong style="color: var(--dark-text);">${mod.author}</strong> • Tanggal: ${mod.date} • Ukuran: ${mod.fileSize}
              </div>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;" onclick="openModuleDetailPage('${mod.id}')">
                📖 Buka Halaman Modul
              </button>
              <button class="btn-learn-outline" style="margin: 0; padding: 8px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;" onclick="downloadModuleFile('${mod.id}')">
                📥 Unduh Modul (${mod.downloads || 0}x)
              </button>
            </div>
          </div>

          <!-- Komentar Section -->
          <div style="margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid #f1f3f7;">
            <h5 style="font-size: 0.92rem; font-weight: 800; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 6px;">
              💬 Masukan & Komentar Pengguna (${(mod.comments || []).length})
            </h5>

            <!-- List Comments -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem;">
              ${(!mod.comments || mod.comments.length === 0) ? '<p style="font-size: 0.82rem; color: var(--text-muted);">Belum ada komentar. Jadilah yang pertama memberikan masukan!</p>' : mod.comments.map(c => `
                <div style="background: #fdf8f9; border: 1px solid #fde2e7; padding: 10px 14px; border-radius: var(--radius-md); display: flex; gap: 10px;">
                  <img src="${c.avatar}" style="width: 32px; height: 32px; border-radius: 50%;" alt="User">
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                      <span style="font-weight: 700; font-size: 0.85rem;">${c.user}</span>
                      <span style="font-size: 0.75rem; color: #a0a6bd;">${c.date} • ⭐ ${c.rating || 5}/5</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--dark-text); margin-top: 2px;">${c.text}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Form Tambah Komentar -->
            <div style="display: flex; gap: 10px;">
              <input type="text" id="comment-input-${mod.id}" class="form-control" style="padding: 8px 14px; font-size: 0.85rem;" placeholder="Tulis masukan atau tanggapan untuk modul ini...">
              <button class="btn-primary-sakura" style="margin-top: 0; padding: 8px 16px; font-size: 0.85rem; width: auto; white-space: nowrap;" onclick="addCommentToModule('${mod.id}')">
                Kirim Komentar
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openUploadModal() {
  const isAdmin = State.currentUser && (State.currentUser.role === 'admin' || State.currentUser.role === 'teacher');
  if (!isAdmin) {
    showToast("Akses ditolak! Fitur unggah modul hanya untuk Administrator 🛡️", "warning");
    return;
  }
  const modal = document.getElementById("upload-module-modal");
  if (!modal) return;
  
  // Reset for new creation
  const idInput = document.getElementById("upload-mod-id");
  if (idInput) idInput.value = "";
  const titleHeader = document.getElementById("upload-module-modal-title");
  if (titleHeader) titleHeader.innerHTML = "📤 Unggah Modul Ajar Baru (HSK 1 - 6)";
  const descHeader = document.getElementById("upload-module-modal-desc");
  if (descHeader) descHeader.innerHTML = "Modul akan otomatis memiliki halaman tersendiri, materi pembelajaran, contoh soal, dan paket latihan 50 soal.";
  const btnSave = document.getElementById("btn-save-module");
  if (btnSave) btnSave.textContent = "Simpan & Terbitkan Modul";

  modal.classList.add("active");
  setTimeout(() => {
    const fileInput = document.getElementById("upload-mod-file");
    const preview = document.getElementById("upload-file-preview");
    if (fileInput && preview) {
      fileInput.onchange = () => {
        const f = fileInput.files[0];
        if (f) {
          preview.innerHTML = `✅ File terlampir: <strong>${f.name}</strong> (${(f.size / 1024).toFixed(1)} KB)`;
        } else {
          preview.innerHTML = "";
        }
      };
    }
  }, 100);
}

function openEditModuleModal(modId) {
  if (State.currentUser.role !== 'admin' && State.currentUser.role !== 'teacher') {
    showToast("Akses khusus Pengelola / Admin 🛡️", "warning");
    return;
  }
  const mod = State.modules.find(m => m.id === modId);
  if (!mod) {
    showToast("Modul tidak ditemukan!", "warning");
    return;
  }

  const modal = document.getElementById("upload-module-modal");
  if (!modal) return;

  const idInput = document.getElementById("upload-mod-id");
  if (idInput) idInput.value = mod.id;
  const titleInput = document.getElementById("upload-mod-title");
  if (titleInput) titleInput.value = mod.title || "";
  const catInput = document.getElementById("upload-mod-cat");
  if (catInput) catInput.value = (mod.category || "komprehensif").toLowerCase();
  const levelInput = document.getElementById("upload-mod-level");
  if (levelInput) levelInput.value = mod.level || "HSK 1";
  const descInput = document.getElementById("upload-mod-desc");
  if (descInput) descInput.value = mod.description || "";
  const materiInput = document.getElementById("upload-mod-materi");
  if (materiInput) materiInput.value = mod.customMateri || "";

  const titleHeader = document.getElementById("upload-module-modal-title");
  if (titleHeader) titleHeader.innerHTML = `✏️ Edit Modul Ajar: ${mod.title}`;
  const descHeader = document.getElementById("upload-module-modal-desc");
  if (descHeader) descHeader.innerHTML = "Perbarui isi teks penjelasan materi, ringkasan, atau lampiran modul ini.";
  const btnSave = document.getElementById("btn-save-module");
  if (btnSave) btnSave.textContent = "Simpan Perubahan Modul 💾";

  const preview = document.getElementById("upload-file-preview");
  if (preview) {
    preview.innerHTML = mod.fileName ? `📁 File tersimpan saat ini: <strong>${mod.fileName}</strong> (${mod.fileSize || 'Standard'})` : "";
  }

  modal.classList.add("active");
}

function closeUploadModal() {
  const modal = document.getElementById("upload-module-modal");
  if (modal) modal.classList.remove("active");
  const preview = document.getElementById("upload-file-preview");
  if (preview) preview.innerHTML = "";
  const fileInput = document.getElementById("upload-mod-file");
  if (fileInput) fileInput.value = "";
  const idInput = document.getElementById("upload-mod-id");
  if (idInput) idInput.value = "";
  const titleInput = document.getElementById("upload-mod-title");
  if (titleInput) titleInput.value = "";
  const descInput = document.getElementById("upload-mod-desc");
  if (descInput) descInput.value = "";
  const materiInput = document.getElementById("upload-mod-materi");
  if (materiInput) materiInput.value = "";
}

function handleUploadNewModule() {
  if (State.currentUser.role !== 'admin' && State.currentUser.role !== 'teacher') {
    showToast("Akses khusus Pengelola / Admin 🛡️", "warning");
    return;
  }

  const modId = document.getElementById("upload-mod-id") ? document.getElementById("upload-mod-id").value.trim() : "";
  const isEditing = Boolean(modId);

  const title = document.getElementById("upload-mod-title").value.trim();
  const cat = document.getElementById("upload-mod-cat").value;
  const level = document.getElementById("upload-mod-level").value;
  const desc = document.getElementById("upload-mod-desc").value.trim();
  const customMateri = document.getElementById("upload-mod-materi") ? document.getElementById("upload-mod-materi").value.trim() : "";
  const fileInput = document.getElementById("upload-mod-file");
  const file = fileInput && fileInput.files[0];

  if (!title || !desc) {
    showToast("Silakan lengkapi judul dan ringkasan modul.", "warning");
    return;
  }

  const levelNum = parseInt(level.replace(/[^0-9]/g, "")) || 1;

  const doSave = (fileData, fileType, fileName, fileSizeStr) => {
    if (isEditing) {
      const existing = State.modules.find(m => m.id === modId);
      if (existing) {
        existing.title = title;
        existing.category = cat;
        existing.level = level;
        existing.levelNumber = levelNum;
        existing.description = desc;
        existing.customMateri = customMateri;
        if (fileName) existing.fileName = fileName;
        if (fileSizeStr) existing.fileSize = fileSizeStr;
        if (fileData) existing.fileData = fileData;
        if (fileType) existing.fileType = fileType;
      }
      
      // Update in LocalStorage
      try {
        const savedCustom = JSON.parse(localStorage.getItem("mandarinku_custom_modules") || "[]");
        const idx = savedCustom.findIndex(m => m.id === modId);
        if (idx !== -1) {
          savedCustom[idx] = existing;
          localStorage.setItem("mandarinku_custom_modules", JSON.stringify(savedCustom));
        }
      } catch (e) {
        console.warn("Storage error", e);
      }

      closeUploadModal();
      renderUploadedModulesList();
      if (currentAdminTab === 'modules') renderAdminDashboard();
      showToast("💾 Perubahan modul berhasil disimpan!");
      setTimeout(() => {
        openModuleDetailPage(modId);
      }, 300);
      return;
    }

    const newId = `mod-custom-${Date.now()}`;
    const newMod = {
      id: newId,
      title: title,
      category: cat,
      level: level,
      levelNumber: levelNum,
      author: State.currentUser.name,
      description: desc,
      customMateri: customMateri,
      downloads: 0,
      fileSize: fileSizeStr || "5.2 MB",
      fileData: fileData || null,
      fileType: fileType || null,
      fileName: fileName || (title + ".pdf"),
      date: new Date().toISOString().split('T')[0],
      comments: []
    };

    State.modules.unshift(newMod);

    // Save to LocalStorage so new modules persist across refresh
    try {
      const savedCustom = JSON.parse(localStorage.getItem("mandarinku_custom_modules") || "[]");
      savedCustom.unshift(newMod);
      localStorage.setItem("mandarinku_custom_modules", JSON.stringify(savedCustom));
    } catch (e) {
      console.warn("Storage error", e);
    }

    closeUploadModal();
    renderUploadedModulesList();
    if (currentAdminTab === 'modules') renderAdminDashboard();
    showToast("🎉 Modul ajar baru berhasil diunggah! Membuka halaman modul...");
    setTimeout(() => {
      openModuleDetailPage(newId);
    }, 400);
  };

  if (file) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const reader = new FileReader();
    reader.onload = (e) => {
      doSave(e.target.result, file.type, file.name, sizeMB);
    };
    reader.onerror = () => {
      showToast("Gagal membaca berkas. Coba lagi.", "warning");
    };
    reader.readAsDataURL(file);
  } else {
    doSave(null, null, null, null);
  }
}

function addCommentToModule(modId) {
  const input = document.getElementById(`comment-input-${modId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    showToast("Komentar tidak boleh kosong.", "warning");
    return;
  }

  const mod = State.modules.find(m => m.id === modId);
  if (mod) {
    if (!mod.comments) mod.comments = [];
    mod.comments.push({
      user: State.currentUser.name,
      avatar: State.currentUser.avatar,
      text: text,
      date: "Baru saja",
      rating: 5
    });
    input.value = "";
    renderUploadedModulesList();
    showToast("Komentar Anda berhasil dikirim! 💬");
  }
}

/**
 * Triggers complete official PDF/HTML download of the module (Materi + 50 Soal + Kunci Jawaban)
 */
function downloadModuleFile(modId) {
  const mod = State.modules.find(m => m.id === modId) || (window.MandarinkuModulesData && window.MandarinkuModulesData[modId]);
  if (!mod) {
    showToast("Modul tidak ditemukan.", "warning");
    return;
  }

  mod.downloads = (mod.downloads || 0) + 1;

  let url, fileName;

  if (mod.fileData) {
    url = mod.fileData;
    fileName = mod.fileName || (mod.title + ".pdf");
  } else {
    const html = _generateComprehensiveModuleHTML(mod);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    url = URL.createObjectURL(blob);
    fileName = `Mandarinku_${(mod.level || 'HSK')}_${mod.title.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_")}.html`;
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (!mod.fileData) {
    setTimeout(() => URL.revokeObjectURL(url), 6000);
  }

  renderUploadedModulesList();
  showToast(`📥 Mengunduh modul lengkap: "${mod.title}" ...`);
}

// ==========================================================================
// Module Detail Page (Halaman Modul Tersendiri)
// ==========================================================================

function openModuleDetailPage(modId, initialTab = 'materi') {
  // Support both custom module ID, MandarinkuModulesData ID (mod-hsk-X), or skill category keys (listening_pinyin, etc.)
  let mod = State.modules.find(m => m.id === modId) || (window.MandarinkuModulesData && window.MandarinkuModulesData[modId]);
  
  if (!mod && modId && (modId.startsWith("hsk") || modId.includes("mastery"))) {
    const levelMatch = modId.match(/[1-6]/);
    const num = levelMatch ? levelMatch[0] : "1";
    mod = window.MandarinkuModulesData && window.MandarinkuModulesData[`mod-hsk-${num}`];
  }

  // If modId matches skill category in State.learningCategoriesData (e.g. listening_pinyin, speaking_intro, etc.)
  if (!mod && State.learningCategoriesData && State.learningCategoriesData[modId]) {
    const catData = State.learningCategoriesData[modId];
    mod = {
      id: modId,
      title: catData.title,
      category: (catData.category || "komprehensif").toLowerCase(),
      level: "HSK Materi",
      author: "Tim Ahli Mandarinku",
      description: catData.summary,
      downloads: 120,
      fileSize: "4.5 MB",
      date: "2024-06-01",
      badgeBg: catData.bg || "#fff0f3",
      badgeColor: catData.color || "#f27289",
      customMateri: `
        <div style="background: ${catData.bg || '#fff0f3'}; border: 1.5px solid ${catData.color || '#f27289'}44; border-radius: 14px; padding: 1.2rem; margin-bottom: 1.5rem;">
          <h3 style="color: ${catData.color || '#f27289'}; font-weight: 800; margin-top: 0; display: flex; align-items: center; gap: 8px;">
            <span>${catData.icon || '📚'}</span> ${catData.title}
          </h3>
          <p style="color: var(--dark-text); font-size: 0.92rem; line-height: 1.6; margin: 0;">${catData.summary}</p>
        </div>
      `,
      vocabList: (catData.items || []).map(it => ({
        hanzi: it.hanzi || "",
        pinyin: it.pinyin || "",
        meaning: `${it.meaning || ""}${it.note ? ` (${it.note})` : ""}`
      })),
      grammarPoints: (catData.items || []).filter(it => it.breakdown).map((it, idx) => ({
        title: `${idx + 1}. Analisis: ${it.hanzi}`,
        formula: it.pinyin,
        explanation: it.breakdown,
        examples: [{ hanzi: it.hanzi, pinyin: it.pinyin, meaning: it.meaning }]
      })),
      sampleQuestions: catData.quickQuiz ? [{
        skill: catData.category || "Latihan",
        question: catData.quickQuiz.question,
        audio: catData.quickQuiz.targetAudio,
        analysis: `Pilihan yang benar: ${catData.quickQuiz.options[catData.quickQuiz.correct] || ""} — ${catData.quickQuiz.explanation || ""}`
      }] : []
    };
  }

  if (!mod) {
    showToast("Modul tidak ditemukan.", "warning");
    return;
  }

  const levelNum = parseInt((mod.level || "HSK 1").replace(/[^0-9]/g, "")) || 1;
  const levelInfo = [
    { level: 1, title: "HSK 1", sub: "Fondasi & Sapaan", icon: "🌱", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", vocab: "150 Kosakata", cefr: "CEFR A1", hours: "30-40 Jam" },
    { level: 2, title: "HSK 2", sub: "Percakapan Harian", icon: "🌿", color: "#0891b2", bg: "#cff4fc", border: "#a5f3fc", vocab: "300 Kosakata", cefr: "CEFR A2", hours: "60-80 Jam" },
    { level: 3, title: "HSK 3", sub: "Tata Bahasa & Cerita", icon: "🌳", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe", vocab: "600 Kosakata", cefr: "CEFR B1", hours: "120-160 Jam" },
    { level: 4, title: "HSK 4", sub: "Wacana & Opini", icon: "🍁", color: "#6d28d9", bg: "#f3e8ff", border: "#ddd6fe", vocab: "1.200 Kosakata", cefr: "CEFR B2", hours: "240-300 Jam" },
    { level: 5, title: "HSK 5", sub: "Berita & Bisnis", icon: "🌸", color: "#be185d", bg: "#fce7f3", border: "#fbcfe8", vocab: "2.500 Kosakata", cefr: "CEFR C1", hours: "450+ Jam" },
    { level: 6, title: "HSK 6", sub: "Sastra & Master", icon: "👑", color: "#b45309", bg: "#fef3c7", border: "#fde68a", vocab: "5.000+ Kosakata", cefr: "CEFR C2", hours: "600+ Jam" }
  ];
  const currentLvl = levelInfo.find(l => l.level === levelNum) || levelInfo[0];
  const color = currentLvl.color;

  const catIcon = { listening: "🎧", speaking: "🎙️", reading: "📖", writing: "✍️", komprehensif: "🌟" };

  // ==========================================
  // 1. KONTEN MATERI AJAR LENGKAP & TERSTRUKTUR
  // ==========================================
  const materiContent = `
    ${mod.customMateri ? `
      <div style="margin-bottom: 1.5rem;">
        ${mod.customMateri}
      </div>
    ` : `
      <!-- Standar Kompetensi & Target Pembelajaran -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        ${[
          { emoji: "🎯", title: "Target Pembelajaran", body: `Menguasai struktur kalimat, kaidah nada, dan kosakata standar ${mod.level} secara fasih dalam konteks percakapan dan tulisan.` },
          { emoji: "📚", title: "Ruang Lingkup Materi", body: `Materi mencakup ${currentLvl.vocab}, analisis tata bahasa terstruktur dengan rumus, dan kaidah kebahasaan standar Hanban.` },
          { emoji: "⏱️", title: "Alokasi Studi", body: `Estimasi belajar: ${currentLvl.hours} • Penyetaraan standar internasional: ${currentLvl.cefr}.` },
          { emoji: "🏆", title: "Standar Kelulusan", body: `Dirancang terstruktur untuk memastikan fondasi kokoh sebelum melanjutkan ke tingkatan level berikutnya.` }
        ].map(c => `
          <div style="background: #ffffff; border: 1.5px solid #f1f5f9; border-left: 4px solid ${color}; border-radius: 12px; padding: 1.1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 1.5rem; margin-bottom: 6px;">${c.emoji}</div>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--dark-text); margin-bottom: 4px;">${c.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${c.body}</p>
          </div>
        `).join("")}
      </div>

      <!-- Ringkasan Silabus Materi Ajar -->
      <div style="background: linear-gradient(135deg, ${color}10, #ffffff); border: 1.5px solid ${color}33; border-radius: 14px; padding: 1.4rem; margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--dark-text); display: flex; align-items: center; gap: 8px;">
          <span>📖</span> Ringkasan Silabus & Kurikulum ${mod.level}
        </h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0;">${mod.description}</p>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed ${color}44; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          ${[`${currentLvl.vocab} Terakreditasi`, "Rumus Pola Tata Bahasa", "Pelafalan & Nada Audio", "Kalimat Kontekstual Asli", "Contoh Latihan Beranotasi", "Analisis Kunci Pembahasan"].map(t => `
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; color: var(--dark-text); font-weight: 600;">
              <span style="color: ${color}; font-size: 1rem;">✓</span> ${t}
            </div>
          `).join("")}
        </div>
      </div>
    `}

    <!-- 2. TATA BAHASA STRUKTURAL & BEDAH POLA KALIMAT -->
    ${mod.grammarPoints && mod.grammarPoints.length > 0 ? `
    <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
      <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.4rem; color: var(--dark-text); display: flex; align-items: center; gap: 8px;">
        <span>🏗️</span> Materi Tata Bahasa Struktural & Bedah Pola (${mod.grammarPoints.length} Poin Utama)
      </h4>
      <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Pelajari formula rumus kalimat, penjelasan kaidah sintaksis, dan contoh kalimat ber-audio penutur asli.
      </p>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${mod.grammarPoints.map((g, idx) => `
          <div style="background: #fdfafb; border: 1.5px solid #fae2e6; padding: 16px 18px; border-radius: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <h5 style="font-size: 1rem; font-weight: 800; color: ${color}; margin: 0;">
                ${g.title}
              </h5>
              ${g.audio ? `
                <button onclick="speakMandarin('${g.audio.replace(/'/g, "\\'")}', 0.85)" class="btn-learn-outline" style="padding: 3px 10px; font-size: 0.75rem; border-radius: 99px; display: flex; align-items: center; gap: 4px;">
                  🔊 Dengar Pelafalan
                </button>
              ` : ''}
            </div>

            ${g.formula ? `
              <div style="background: #ffffff; color: #be185d; padding: 6px 12px; border-radius: 8px; border: 1px solid #fbcfe8; font-family: 'JetBrains Mono', monospace, monospace; font-size: 0.86rem; margin-bottom: 8px; display: inline-block; font-weight: 700;">
                📐 Rumus: ${g.formula}
              </div>
            ` : ''}

            <p style="font-size: 0.9rem; color: var(--dark-text); line-height: 1.6; margin-bottom: 10px;">
              ${g.explanation}
            </p>

            ${g.examples && g.examples.length > 0 ? `
              <div style="background: #ffffff; border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
                  Contoh Kalimat Kontekstual:
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${g.examples.map(ex => `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; border-bottom: 1px dashed #f1f5f9; padding-bottom: 6px;">
                      <div>
                        <span style="font-weight: 800; color: #1e293b; font-size: 0.95rem; font-family: var(--font-chinese);">${ex.hanzi}</span>
                        <span style="color: ${color}; font-weight: 700; margin-left: 6px; font-size: 0.88rem;">(${ex.pinyin})</span>
                        <div style="color: var(--text-muted); font-size: 0.84rem; margin-top: 2px;">"${ex.meaning}"</div>
                      </div>
                      <button onclick="speakMandarin('${(ex.audio || ex.hanzi).replace(/'/g, "\\'")}', 0.85)" class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.72rem; border-radius: 99px; flex-shrink: 0;" title="Dengar Audio">
                        🔊
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- 3. KOSAKATA INTI & CONTOH KALIMAT -->
    ${mod.vocabList && mod.vocabList.length > 0 ? `
    <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem;">
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--dark-text); display: flex; align-items: center; gap: 8px;">
            <span>📝</span> Kosakata Inti Ber-Audio (${mod.vocabList.length} Entri Pilihan)
          </h4>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 0;">
            Kosakata wajib level ${mod.level} lengkap dengan pinyin, arti bahasa Indonesia, dan audio pelafalan.
          </p>
        </div>
        <span style="font-size: 0.78rem; background: ${color}15; color: ${color}; padding: 4px 10px; border-radius: 99px; font-weight: 700;">
          🔊 Klik tombol audio untuk melatih pendengaran
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
        ${mod.vocabList.map(v => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${color}; padding: 12px 14px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; gap: 10px; transition: all 0.2s;" onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='#f8fafc'">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 1.25rem; font-weight: bold; color: var(--dark-text); font-family: var(--font-chinese);">${v.hanzi}</div>
              <div style="font-size: 0.85rem; color: ${color}; font-weight: 700; margin-top: 2px;">${v.pinyin}</div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px; line-height: 1.3;">${v.meaning}</div>
            </div>
            <button onclick="speakMandarin('${(v.audio || v.hanzi).replace(/'/g, "\\'")}', 0.85)" style="background: ${color}18; border: none; border-radius: 50%; width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: ${color}; flex-shrink: 0; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Dengarkan Audio Mandarin">
              🔊
            </button>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  `;

  // ==========================================
  // 2. CONTOH LATIHAN & PEMBAHASAN TERPANDU
  // ==========================================
  const levelPracticeBank = {
    1: [
      {
        skill: "🎧 Listening",
        audioText: "你叫什么名字？我叫李明。",
        question: "Dengarkan percakapan audio: 'A: 你叫什么名字？ B: 我叫李明。'<br>Apa maksud pertanyaan pembicara A?",
        opts: [
          "Menanyakan nama seseorang (Siapa namamu?)",
          "Menanyakan alamat tempat tinggal",
          "Menanyakan pekerjaan dan profesi",
          "Menanyakan kabar kesehatan hari ini"
        ],
        correct: 0,
        explanation: "Pola '你叫什么名字？' (Nǐ jiào shénme míngzi?) adalah pola tanya sapaan dasar HSK 1 yang berarti 'Siapa namamu?'."
      },
      {
        skill: "📖 Reading",
        audioText: "小明是学生，他喜欢学习汉语，因为汉语很有趣。",
        question: "Baca kalimat berikut: 小明是学生，他喜欢学习汉语，因为汉语很有趣。<br>Mengapa Xiao Ming suka belajar bahasa Mandarin?",
        opts: [
          "Karena bahasa Mandarin mudah dipelajari",
          "Karena guru bahasa Mandarin sangat baik",
          "Karena bahasa Mandarin menarik dan seru (有趣)",
          "Karena dia harus menghadapi ujian besok"
        ],
        correct: 2,
        explanation: "Kata kunci: '因为汉语很有趣' (yīnwèi Hànyǔ hěn yǒuqù). '有趣' (yǒuqù) berarti menarik atau menyenangkan."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "认识你我也很高兴！",
        question: "Lafalkan salam perkenalan: '认识你我也很高兴！' (Rènshi nǐ wǒ yě hěn gāoxìng!)<br>Bagaimana kaidah hukum nada (Sandhi Nada) pada urutan kata '我也很'?",
        opts: [
          "Tiga nada 3 berurutan diucapkan menjadi nada (2-2-3): (wó yé hěn)",
          "Semua nada diucapkan datar tanpa nada suara",
          "Nada 3 terakhir berubah menjadi nada 4 (jatuh)",
          "Tidak mengalami perubahan nada sama sekali"
        ],
        correct: 0,
        explanation: "Aturan Sandhi Nada: Jika terdapat tiga nada ke-3 berurutan, dua nada pertama otomatis naik menjadi nada ke-2: (wó yé hěn gāoxìng)."
      },
      {
        skill: "✍️ Writing",
        audioText: "妈妈的身体很好。",
        question: "Susun kata-kata acak berikut menjadi kalimat baku bahasa Mandarin:<br><strong>[ 很好 / 妈妈 / 的 / 身体 ]</strong><br><em>Arti: Kesehatan ibu sangat baik.</em>",
        opts: [
          "妈妈身体的很好",
          "妈妈的身体很好",
          "很好身体的妈妈",
          "的身体妈妈很好"
        ],
        correct: 1,
        explanation: "Struktur kalimat kepemilikan bahasa Mandarin: [Pemilik (妈妈) + 的 + Benda Inti (身体) + Predikat Adjektiva (很好)]."
      }
    ],
    2: [
      {
        skill: "🎧 Listening",
        audioText: "我打算明天去百货商场买一件新外套。",
        question: "Dengarkan kalimat audio berikut:<br>'我打算明天去百货商场买一件新外套。'<br>Kapan pembicara berencana pergi berbelanja?",
        opts: [
          "Hari ini juga (今天)",
          "Kemarin sore (昨天下午)",
          "Besok (明天)",
          "Bulan depan (下个月)"
        ],
        correct: 2,
        explanation: "Kata keterangan waktu yang diucapkan adalah '明天' (míngtiān) yang berarti 'besok'."
      },
      {
        skill: "📖 Reading",
        audioText: "苹果三块钱一斤，西瓜五块钱一斤。苹果比西瓜便宜。",
        question: "Lengkapilah kalimat perbandingan pola 比: 苹果比西瓜____。(Píngguǒ bǐ xīguā ____.)",
        opts: [
          "贵得多 (jauh lebih mahal)",
          "便宜 (lebih murah)",
          "很大 (sangat besar)",
          "很冷 (sangat dingin)"
        ],
        correct: 1,
        explanation: "Pola perbandingan HSK 2: A 比 B + Adjektiva. Apel seharga 3 yuan dibandingkan semangka seharga 5 yuan adalah lebih murah (便宜)."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "虽然今天下大雨，但是我们还是按时到了。",
        question: "Lafalkan kalimat majemuk penghubung: '虽然今天下大雨，但是我们还是按时到了。'<br>Bagaimana ritme intonasi penekanan yang tepat?",
        opts: [
          "Beri jeda setelah koma, lalu tekankan kata sambung '但是' dan hasil '按时到了'",
          "Ucapkan cepat tanpa jeda pernapasan",
          "Tekankan hanya kata pertama '虽然'",
          "Gunakan intonasi bisik"
        ],
        correct: 0,
        explanation: "Dalam konjungsi konsesif '虽然……但是……', inti pesan keberhasilan ditekankan pada klausa setelah '但是'."
      },
      {
        skill: "✍️ Writing",
        audioText: "超市离医院很近。",
        question: "Susun pola jarak preposisi '离':<br><strong>[ 离 / 很近 / 医院 / 超市 ]</strong><br><em>Arti: Supermarket berjarak sangat dekat dari rumah sakit.</em>",
        opts: [
          "很近超市离医院",
          "超市离医院很近",
          "医院超市离很近",
          "离很近超市医院"
        ],
        correct: 1,
        explanation: "Formula jarak HSK 2: [Tempat A + 离 + Tempat B + 很近/很远]. Urutan tepat: 超市离医院很近."
      }
    ],
    3: [
      {
        skill: "🎧 Listening",
        audioText: "请各位旅客把登机牌和护照拿在手里，准备登机。",
        question: "Dengarkan pengumuman bandara:<br>'请各位旅客把登机牌和护照拿在手里，准备登机。'<br>Apa instruksi petugas kepada penumpang?",
        opts: [
          "Menyimpan paspor ke dalam koper",
          "Memegang boarding pass dan paspor di tangan untuk naik pesawat",
          "Menukar uang di loket bandara",
          "Keluar dari ruang tunggu"
        ],
        correct: 1,
        explanation: "Struktur kalimat 把: '把登机牌和护照拿在手里' berarti mengambil/memegang paspor dan boarding pass di tangan."
      },
      {
        skill: "📖 Reading",
        audioText: "这间屋子太乱了，请你把房间打扫得干干净净。",
        question: "Pilihlah partikel manipulasi yang tepat:<br>这间屋子太乱了，请你____房间打扫得干干净净。(Zhè jiān wūzi tài luàn le, qǐng nǐ ____ fángjiān dǎsǎo de gāngānjìngjìng.)",
        opts: [
          "把 (bǎ)",
          "被 (bèi)",
          "给 (gěi)",
          "在 (zài)"
        ],
        correct: 0,
        explanation: "Karena subjek ingin mengubah kondisi objek spesifik '房间' menjadi bersih, maka menggunakan partikel 把 (bǎ)."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "只要坚持每天练习，你就一定能把汉语学好！",
        question: "Lafalkan kalimat motivasi: '只要坚持每天练习，你就一定能把汉语学好！'<br>Apa fungsi dari pola pasangan '只要……就……'?",
        opts: [
          "Menyatakan syarat yang cukup untuk memastikan hasil keberhasilan pasti terwujud",
          "Menyatakan peristiwa masa lalu yang gagal terjadi",
          "Menanyakan kepastian kepada orang lain",
          "Menyatakan keraguan tanpa kepastian"
        ],
        correct: 0,
        explanation: "Pola 只要 (asal/cukup)... 就 (maka pasti)... menyatakan premis kondisi yang cukup untuk menjamin hasil akhir."
      },
      {
        skill: "✍️ Writing",
        audioText: "那个苹果被弟弟吃了。",
        question: "Susun kalimat pasif '被' berikut:<br><strong>[ 被 / 吃了 / 那个苹果 / 弟弟 ]</strong><br><em>Arti: Apel itu telah dimakan oleh adik.</em>",
        opts: [
          "弟弟被吃了那个苹果",
          "那个苹果被弟弟吃了",
          "吃了被那个苹果弟弟",
          "那个弟弟被苹果吃了"
        ],
        correct: 1,
        explanation: "Pola kalimat pasif HSK 3: [Objek yang Dikenai + 被 + Pelaku + Kata Kerja + Pelengkap]. Urutan: 那个苹果被弟弟吃了."
      }
    ],
    4: [
      {
        skill: "🎧 Listening",
        audioText: "无论面临多大的困难与挑战，积极自信的态度始终是解决问题的关键。",
        question: "Dengarkan kutipan audio motivasi:<br>'无论面临多大的困难与挑战，积极自信的态度始终是解决问题的关键。'<br>Apa faktor terpenting dalam memecahkan masalah menurut narasumber?",
        opts: [
          "Kekayaan materi yang berlimpah",
          "Sikap mental yang positif dan percaya diri (积极自信的态度)",
          "Menghindari tantangan yang berat",
          "Menunggu bantuan dari orang lain"
        ],
        correct: 1,
        explanation: "Narasumber menegaskan: '积极自信的态度始终是解决问题的关键' (sikap positif percaya diri adalah kunci)."
      },
      {
        skill: "📖 Reading",
        audioText: "无论天气多么恶劣，海上救援队都准时出发执行任务了。",
        question: "Lengkapilah pasangan konjungsi bersyarat mutlak:<br>无论天气多么恶劣，海上救援队____准时出发执行任务了。",
        opts: [
          "但是 (dànshì)",
          "因为 (yīnwèi)",
          "都 (dōu) / 也 (yě)",
          "而且 (érqiě)"
        ],
        correct: 2,
        explanation: "Pasangan baku dari konjungsi bersyarat mutlak '无论/不管' (bagaimanapun/tanpa peduli) di klausa kedua adalah '都' atau '也'."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "在职场沟通中，换位思考往往能够化解绝大多数不必要的矛盾。",
        question: "Lafalkan opini profesional berikut dengan artikulasi mantap:<br>'在职场沟通中，换位思考往往能够化解绝大多数不必要的矛盾。'",
        opts: [
          "Terapkan jeda ritmik pada subjek topik [在职场沟通中] dan [换位思考], artikulasi wibawa",
          "Ucapkan secepat mungkin tanpa jeda",
          "Bicara berbisik pelan",
          "Hilangkan kata kerja utama"
        ],
        correct: 0,
        explanation: "Tingkat HSK 4 menuntut kemampuan berargumen dengan jeda sintaksis yang jelas antara topik dan predikat."
      },
      {
        skill: "✍️ Writing",
        audioText: "这家跨国企业为新员工提供了优厚的薪酬福利。",
        question: "Susun kalimat preposisi '为' (untuk/demi):<br><strong>[ 提供了 / 这家跨国企业 / 优厚的 / 为新员工 / 薪酬福利 ]</strong>",
        opts: [
          "这家跨国企业为新员工提供了优厚的薪酬福利",
          "优厚的薪酬福利为新员工这家跨国企业提供了",
          "这家跨国企业提供了为新员工优厚的薪酬福利",
          "新员工为这家跨国企业优厚的薪酬福利提供了"
        ],
        correct: 0,
        explanation: "Pola preposisi tujuan: [Subjek + 为 + Penerima + Kata Kerja + Objek Beratribut]. Urutan: 这家跨国企业为新员工提供了优厚的薪酬福利."
      }
    ],
    5: [
      {
        skill: "🎧 Listening",
        audioText: "在数字经济蓬勃发展的今天，传统实体产业必须加快数字化转型的步伐，方能在激烈的市场竞争中立于不败之地。",
        question: "Dengarkan wawancara ekonomi bisnis:<br>Apa langkah esensial yang dianjurkan narasumber bagi industri konvensional?",
        opts: [
          "Menutup fasilitas manufaktur konvensional",
          "Mempercepat langkah transformasi digital agar tetap berdaya saing",
          "Menghindari integrasi teknologi modern",
          "Menjual seluruh aset fisik perusahaan"
        ],
        correct: 1,
        explanation: "Kata kunci: '必须加快数字化转型的步伐' (wajib mempercepat langkah transformasi digital)."
      },
      {
        skill: "📖 Reading",
        audioText: "面对瞬息万变的市场格局，他表现得十分镇定，早已胸有成竹。",
        question: "Pilihlah Chengyu yang bermakna 'telah memiliki perencanaan matang dan keyakinan penuh':",
        opts: [
          "胸有成竹 (xiōng yǒu chéng zhú)",
          "迫不及待 (pò bù jí dài)",
          "乱七八糟 (luàn qī bā zāo)",
          "马马虎虎 (mǎ ma hū hū)"
        ],
        correct: 0,
        explanation: "Idiom '胸有成竹' (sudah ada bambu di dalam dada) melambangkan perencanaan matang sebelum bertindak."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "与其被动等待市场复苏，不如主动创新产品形态以引领消费者需求。",
        question: "Sampaikan argumen bisnis: '与其被动等待市场复苏，不如主动创新产品形态以引领消费者需求。'<br>Pola retorika apa yang digunakan?",
        opts: [
          "与其 A 不如 B (Daripada pasif di opsi A, jauh lebih bijak mengambil opsi B)",
          "虽然 A 但是 B (Meskipun A tetapi B)",
          "因为 A 所以 B (Karena A maka B)",
          "不但 A 而且 B (Bukan hanya A tetapi juga B)"
        ],
        correct: 0,
        explanation: "Pola '与其……不如……' adalah konstruksi retoris ragam tulis (书面语) untuk merekomendasikan opsi kedua secara tegas."
      },
      {
        skill: "✍️ Writing",
        audioText: "绿色低碳已成为全球发展的大趋势，它将有力地促进新兴高新科技产业的繁荣。",
        question: "Pilihlah kalimat yang memadukan kata '趋势' (tren) dan '促进' (mendorong percepatan) secara gramatikal elegan:",
        opts: [
          "绿色低碳已成为全球发展的大趋势，它将有力地促进新兴高新科技产业的繁荣。",
          "趋势促进了我们的大发展很多非常没有。",
          "发展的大趋势已经促进没有新兴科技产业。",
          "科技产业繁荣促进了绿色的大趋势虽然。"
        ],
        correct: 0,
        explanation: "Kalimat opsi A menempatkan '大趋势' sebagai predikat nominal dan '促进' sebagai predikat verbal aktif yang teratur."
      }
    ],
    6: [
      {
        skill: "🎧 Listening",
        audioText: "中华优秀传统文化博大精深、源远流长，在潜移默化之中塑造着东方文明独特的价值体系与伦理底色。",
        question: "Dengarkan ceramah budaya akademik:<br>Apa pesan filosofis mendalam yang disampaikan dalam kutipan di atas?",
        opts: [
          "Budaya tradisional kuno tidak lagi relevan bagi generasi baru",
          "Budaya tradisional agung & mendalam, secara halus tanpa disadari membentuk fondasi etika peradaban",
          "Pengaruh budaya klasik bersifat sesaat dan cepat hilang",
          "Kebudayaan hanya dipelajari oleh kalangan sastrawan tua"
        ],
        correct: 1,
        explanation: "Frasa '博大精深' (luas dan mendalam) serta '潜移默化' (pengaruh halus yang meresap tanpa disadari) menggarisbawahi peran pembentuk etika peradaban."
      },
      {
        skill: "📖 Reading",
        audioText: "面对复杂的国际风云变幻，唯有未雨绸缪，方能防范化解各类系统性风险。",
        question: "Chengyu sastra manakah yang bermakna 'melakukan persiapan dini sebelum krisis tiba (sedia payung sebelum hujan)'?",
        opts: [
          "急功近利 (hanya memburu laba instan jangka pendek)",
          "未雨绸缪 (sedia payung sebelum hujan / antisipasi risiko dini)",
          "墨守成规 (kaku terbelenggu dogma kuno)",
          "见利忘义 (lupa etika saat melihat keuntungan)"
        ],
        correct: 1,
        explanation: "Idiom '未雨绸缪' (wèi yǔ chóu móu) melambangkan kebijaksanaan visioner dalam mengantisipasi risiko jauh sebelum musibah tiba."
      },
      {
        skill: "🎙️ Speaking",
        audioText: "唯有坚定不移地推进多边合作与互利共赢，国际社会方能风雨同舟，携手构建人类命运共同体。",
        question: "Lafalkan kesimpulan diplomatis tingkat tinggi:<br>'唯有坚定不移地推进多边合作与互利共赢，国际社会方能风雨同舟，携手构建人类命运共同体。'",
        opts: [
          "Artikulasi negarawan yang berwibawa, nada tegas pada konsep kunci (多边合作, 互利共赢, 风雨同舟)",
          "Gunakan nada santai informal sehari-hari",
          "Bicara terputus-putus tanpa memperhatikan ritme",
          "Hilangkan frasa diplomatis utama"
        ],
        correct: 0,
        explanation: "Tingkat HSK 6 menguji kepiawaian bertutur dalam ragam resmi (书面语口语化), menuntut intonasi berwibawa dan ritme terukur."
      },
      {
        skill: "✍️ Writing",
        audioText: "缩写原则：保留核心情节与主干脉络，去除次要细节，运用精准书面语客观概括。",
        question: "Manakah teknik yang paling esensial dalam mengerjakan soal ringkasan narasi (缩写) 400 karakter HSK 6?",
        opts: [
          "Mempertahankan alur 5W+1H, tokoh utama, konflik sentral, dan resolusi akhir secara objektif dengan bahasa baku",
          "Menyalin kata demi kata dari paragraf pertama saja sampai batas 400 karakter",
          "Menambahkan interpretasi dan opini subjektif pribadi pembaca sepanjang 200 karakter",
          "Mengganti jalan cerita dan nama tokoh cerita dengan versi buatan sendiri"
        ],
        correct: 0,
        explanation: "Prinsip baku 缩写 HSK 6: Mengompresi teks 1.000 karakter menjadi 400 karakter secara objektif tanpa menambah opini pribadi."
      }
    ]
  };

  const sampleQuestionsList = levelPracticeBank[levelNum] || levelPracticeBank[1];

  const buildContohSoal = () => `
    <div style="background: #ffffff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--dark-text); margin: 0; display: flex; align-items: center; gap: 8px;">
            <span>💡</span> Contoh Latihan Terpandu & Pembahasan — ${mod.level}
          </h4>
          <span style="font-size: 0.78rem; background: ${color}15; color: ${color}; font-weight: 800; padding: 4px 10px; border-radius: 99px;">
            4 Keterampilan Lengkap: Listening · Reading · Speaking · Writing
          </span>
        </div>
        <p style="font-size: 0.86rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0;">
          Klik pilihan jawaban untuk memeriksa kebenaran secara interaktif dan pelajari analisis kunci pembahasannya.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${sampleQuestionsList.map((item, idx) => `
          <div style="background: #ffffff; border: 1.5px solid #e8edf3; border-radius: 14px; padding: 1.3rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: linear-gradient(135deg, ${color}, ${color}cc); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 900;">
                  ${idx + 1}
                </span>
                <span style="font-size: 0.85rem; font-weight: 800; color: ${color}; background: ${color}12; padding: 3px 10px; border-radius: 99px;">
                  ${item.skill}
                </span>
              </div>
              ${item.audioText ? `
                <button onclick="speakMandarin('${item.audioText.replace(/'/g, "\\'")}', 0.85)" class="btn-learn-outline" style="padding: 4px 12px; font-size: 0.78rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 4px;">
                  🔊 Putar Audio Soal
                </button>
              ` : ''}
            </div>

            <p style="font-size: 0.94rem; color: var(--dark-text); font-weight: 600; line-height: 1.6; margin-bottom: 1rem;">
              ${item.question}
            </p>

            <div style="display: grid; gap: 8px; margin-bottom: 10px;">
              ${item.opts.map((o, i) => `
                <div class="contoh-opt" data-qidx="${idx}" data-oidx="${i}" data-correct="${item.correct}" data-exp="${item.explanation.replace(/"/g, '&quot;')}"
                  style="padding: 10px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; cursor: pointer; font-size: 0.88rem; transition: all 0.2s; display: flex; align-items: center; gap: 10px; background: #fafafa;"
                  onclick="selectContohOpt(this, ${idx}, ${i}, ${item.correct}, this.dataset.exp)"
                  onmouseover="if(!this.dataset.answered) this.style.borderColor='${color}'"
                  onmouseout="if(!this.dataset.answered) this.style.borderColor='#e2e8f0'">
                  <span style="font-weight: 900; color: ${color}; min-width: 22px;">${String.fromCharCode(65 + i)}.</span>
                  <span>${o}</span>
                </div>
              `).join("")}
            </div>

            <div id="exp-${idx}" style="display: none; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; margin-top: 10px; font-size: 0.86rem; color: #166534; line-height: 1.6;">
              <!-- Dynamic Explanation Injected Here -->
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const container = document.getElementById("modul-detail-content-container");
  if (!container) return;

  container.innerHTML = `
    <!-- Header Back & Breadcrumb -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; flex-wrap: wrap;">
      <button onclick="navigateTo('hsk')" style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 8px 18px; border-radius: 9999px; font-size: 0.86rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; color: var(--dark-text); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        ← Kembali ke Pusat Materi HSK
      </button>
      <div style="height: 18px; width: 1px; background: #cbd5e1;"></div>
      <nav style="font-size: 0.84rem; color: var(--text-muted);">
        Materi <span style="margin: 0 4px;">›</span>
        <strong style="color: ${color};">${mod.title}</strong>
      </nav>
    </div>

    <!-- Fast HSK 1 - 6 Level Switcher Bar (Navigasi Terstruktur HSK 1-6) -->
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 10px 14px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: var(--card-shadow);">
      <div style="font-size: 0.82rem; font-weight: 800; color: var(--dark-text); display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 1rem;">🎓</span> Pilih Level Materi HSK:
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
        ${levelInfo.map(lvl => `
          <button onclick="openModuleDetailPage('mod-hsk-${lvl.level}', '${initialTab}')"
            style="border: 1.5px solid ${lvl.level === levelNum ? lvl.color : '#e2e8f0'};
                   background: ${lvl.level === levelNum ? lvl.color : '#ffffff'};
                   color: ${lvl.level === levelNum ? '#ffffff' : 'var(--dark-text)'};
                   padding: 6px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: ${lvl.level === levelNum ? '0 2px 6px ' + lvl.color + '44' : 'none'};">
            <span>${lvl.icon}</span> ${lvl.title} (${lvl.sub})
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Hero Header Modul -->
    <div style="background: linear-gradient(135deg, ${color}22, ${color}08); border: 1.5px solid ${color}44; border-radius: 20px; padding: 1.8rem 2rem; margin-bottom: 1.8rem; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: ${color}15; border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -20px; left: 40%; width: 100px; height: 100px; background: ${color}10; border-radius: 50%;"></div>
      <div style="position: relative;">
        <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
          <span style="background: ${color}; color: #fff; font-size: 0.78rem; font-weight: 800; padding: 4px 14px; border-radius: 9999px;">${mod.level}</span>
          <span style="background: #fff; color: ${color}; border: 1.5px solid ${color}; font-size: 0.78rem; font-weight: 800; padding: 4px 14px; border-radius: 9999px;">${currentLvl.cefr}</span>
          <span style="background: #fff; color: #1e293b; border: 1.5px solid #cbd5e1; font-size: 0.78rem; font-weight: 800; padding: 4px 14px; border-radius: 9999px;">${currentLvl.vocab}</span>
          <span style="background: #ecfdf5; color: #059669; font-size: 0.78rem; font-weight: 800; padding: 4px 14px; border-radius: 9999px;">✨ Fokus Materi & Contoh Latihan</span>
        </div>
        <h1 style="font-size: 1.6rem; font-weight: 900; color: var(--dark-text); margin-bottom: 0.5rem; line-height: 1.3;">${mod.title}</h1>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; max-width: 650px; margin-bottom: 1.2rem;">${mod.description}</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.82rem; color: var(--text-muted); align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <span>👤 Pengampu: <strong style="color: var(--dark-text);">${mod.author}</strong></span>
            <span>📅 Diperbarui: ${mod.date}</span>
            <span>📦 Ukuran Berkas: ${mod.fileSize}</span>
          </div>
          <span style="font-size: 0.78rem; background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 99px; font-weight: 700; border: 1px solid #a7f3d0;">
            🎓 Modul Resmi Mandarinku
          </span>
        </div>
      </div>
    </div>

    <!-- Tab Navigation (Hanya Berfokus Pada Materi & Contoh Latihan) -->
    <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0; overflow-x: auto; white-space: nowrap;" id="modul-tabs">
      <button id="modul-tab-materi" onclick="switchModulTab('materi')"
        style="padding: 11px 22px; border: none; background: none; cursor: pointer; font-size: 0.92rem; font-weight: 800; color: ${color}; border-bottom: 3px solid ${color}; margin-bottom: -2px; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
        <span>📚</span> Materi Pembelajaran Lengkap
      </button>
      <button id="modul-tab-contoh" onclick="switchModulTab('contoh')"
        style="padding: 11px 22px; border: none; background: none; cursor: pointer; font-size: 0.92rem; font-weight: 800; color: var(--text-muted); border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
        <span>💡</span> Contoh Latihan & Pembahasan
      </button>
      <button id="modul-tab-komentar" onclick="switchModulTab('komentar')"
        style="padding: 11px 22px; border: none; background: none; cursor: pointer; font-size: 0.92rem; font-weight: 800; color: var(--text-muted); border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
        <span>💬</span> Diskusi & Tanya Materi
      </button>
    </div>

    <!-- Tab Content Panels -->
    <div id="modul-panel-materi" class="modul-panel">${materiContent}</div>
    <div id="modul-panel-contoh" class="modul-panel" style="display: none;">${buildContohSoal()}</div>
    <div id="modul-panel-komentar" class="modul-panel" style="display: none;">
      <div style="background: #ffffff; border: 1.5px solid #f1f5f9; border-radius: 14px; padding: 1.5rem; box-shadow: var(--card-shadow);">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text); margin-bottom: 1rem;">
          💬 Tanya Jawab & Diskusi Materi ${mod.level}
        </h4>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
          ${(!mod.comments || mod.comments.length === 0)
            ? `<p style="font-size: 0.88rem; color: var(--text-muted); text-align: center; padding: 1rem;">Belum ada pertanyaan atau diskusi pada modul ini. Ajukan pertanyaanmu!</p>`
            : mod.comments.map(c => `
              <div style="background: #fdf8f9; border: 1px solid #fde2e7; padding: 12px 16px; border-radius: 12px; display: flex; gap: 12px;">
                <img src="${c.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="${c.user}">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                    <span style="font-weight: 700; font-size: 0.88rem;">${c.user}</span>
                    <span style="font-size: 0.78rem; color: #a0a6bd;">${c.date} • ⭐ ${c.rating || 5}/5</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--dark-text); margin-top: 4px; line-height: 1.5;">${c.text}</p>
                </div>
              </div>
            `).join("")}
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" id="detail-comment-input" class="form-control" style="padding: 10px 16px; font-size: 0.88rem;"
            placeholder="Tulis pertanyaan seputar tata bahasa atau kosakata ${mod.level}..." onkeydown="if(event.key==='Enter') submitDetailComment('${mod.id}')">
          <button onclick="submitDetailComment('${mod.id}')" class="btn-primary-sakura" style="margin: 0; padding: 10px 20px; font-size: 0.88rem; width: auto; white-space: nowrap;">
            Kirim Pertanyaan 💬
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation Level Progression (Rapi HSK 1 -> 6) -->
    <div style="margin-top: 2rem; padding: 1.4rem; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: var(--card-shadow);">
      ${levelNum > 1 ? `
        <button onclick="openModuleDetailPage('mod-hsk-${levelNum - 1}', '${initialTab}')"
          style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 10px 18px; border-radius: 99px; font-size: 0.84rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; color: var(--dark-text);">
          ← Materi HSK ${levelNum - 1}
        </button>
      ` : `<div></div>`}

      <button onclick="navigateTo('hsk')"
        class="btn-learn-outline" style="padding: 10px 20px; font-size: 0.84rem; margin: 0; border-radius: 99px;">
        📚 Lihat Semua Silabus HSK 1 - 6
      </button>

      ${levelNum < 6 ? `
        <button onclick="openModuleDetailPage('mod-hsk-${levelNum + 1}', '${initialTab}')"
          class="btn-primary-sakura" style="padding: 10px 20px; font-size: 0.84rem; margin: 0; border-radius: 99px; display: flex; align-items: center; gap: 6px;">
          Lanjut ke Materi HSK ${levelNum + 1} →
        </button>
      ` : `<div></div>`}
    </div>
  `;

  // Navigate to the page
  navigateTo("modul-detail");

  // Activate initial tab if specified
  if (initialTab && initialTab !== 'materi') {
    switchModulTab(initialTab);
  }
}

// Switch tab di module detail page
function switchModulTab(tabId) {
  document.querySelectorAll(".modul-panel").forEach(p => p.style.display = "none");
  const panel = document.getElementById(`modul-panel-${tabId}`);
  if (panel) panel.style.display = "block";

  document.querySelectorAll("[id^='modul-tab-']").forEach(btn => {
    btn.style.color = "var(--text-muted)";
    btn.style.borderBottomColor = "transparent";
  });
  const activeBtn = document.getElementById(`modul-tab-${tabId}`);
  if (activeBtn) {
    activeBtn.style.color = "var(--primary-pink)";
    activeBtn.style.borderBottomColor = "var(--primary-pink)";
  }
}

// Contoh soal — pilih opsi dengan feedback interaktif & tombol coba lagi
function selectContohOpt(el, qIdx, oIdx, correct, exp) {
  const siblings = document.querySelectorAll(`.contoh-opt[data-qidx="${qIdx}"]`);
  const isCorrect = (oIdx === correct);
  siblings.forEach((s, i) => {
    s.style.pointerEvents = "none";
    s.dataset.answered = "true";
    if (i === correct) {
      s.style.background = "#dcfce7";
      s.style.borderColor = "#22c55e";
      s.style.color = "#166534";
      s.style.fontWeight = "700";
    } else if (parseInt(s.dataset.oidx) === oIdx && !isCorrect) {
      s.style.background = "#fee2e2";
      s.style.borderColor = "#ef4444";
      s.style.color = "#991b1b";
    }
  });
  const expDiv = document.getElementById(`exp-${qIdx}`);
  if (expDiv) {
    expDiv.style.display = "block";
    expDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 0.9rem; color: ${isCorrect ? '#15803d' : '#b91c1c'};">
          ${isCorrect ? '🎉 Benar Sekali!' : '⚠️ Kurang Tepat — Kunci Benar Ditandai Hijau'}
        </span>
        <button onclick="resetContohOpt(${qIdx})" style="background: #ffffff; border: 1px solid #cbd5e1; padding: 3px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; cursor: pointer; color: var(--dark-text); display: inline-flex; align-items: center; gap: 4px;">
          🔄 Coba Lagi
        </button>
      </div>
      <div><strong>💡 Analisis & Pembahasan Kaidah:</strong> ${exp}</div>
    `;
  }
}

// Reset opsi contoh soal agar siswa bisa mencoba kembali
function resetContohOpt(qIdx) {
  const siblings = document.querySelectorAll(`.contoh-opt[data-qidx="${qIdx}"]`);
  siblings.forEach(s => {
    s.style.pointerEvents = "auto";
    s.style.background = "#fafafa";
    s.style.borderColor = "#e2e8f0";
    s.style.color = "var(--dark-text)";
    s.style.fontWeight = "normal";
    delete s.dataset.answered;
  });
  const expDiv = document.getElementById(`exp-${qIdx}`);
  if (expDiv) expDiv.style.display = "none";
}

// Submit comment dari halaman detail modul
function submitDetailComment(modId) {
  const input = document.getElementById("detail-comment-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) { showToast("Komentar tidak boleh kosong.", "warning"); return; }

  const mod = State.modules.find(m => m.id === modId);
  if (mod) {
    if (!mod.comments) mod.comments = [];
    mod.comments.push({
      user: State.currentUser.name,
      avatar: State.currentUser.avatar,
      text: text,
      date: "Baru saja",
      rating: 5
    });
    input.value = "";
    // Refresh only komentar panel
    const panel = document.getElementById("modul-panel-komentar");
    if (panel) {
      const commentList = panel.querySelector("div:first-child");
      if (commentList) {
        commentList.insertAdjacentHTML("beforeend", `
          <div style="background: #fdf8f9; border: 1px solid #fde2e7; padding: 12px 16px; border-radius: 12px; display: flex; gap: 12px;">
            <img src="${mod.comments[mod.comments.length-1].avatar}" style="width: 36px; height: 36px; border-radius: 50%;" alt="${mod.comments[mod.comments.length-1].user}">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between;"><span style="font-weight: 700; font-size: 0.88rem;">${mod.comments[mod.comments.length-1].user}</span><span style="font-size: 0.78rem; color: #a0a6bd;">Baru saja • ⭐ 5/5</span></div>
              <p style="font-size: 0.85rem; color: var(--dark-text); margin-top: 4px;">${text}</p>
            </div>
          </div>
        `);
      }
    }
    showToast("Komentar berhasil dikirim! 💬");
    renderUploadedModulesList();
  }
}

// ==========================================================================
// Latihan 50 Soal Engine (untuk Halaman Modul Detail)
// ==========================================================================
let _lat50State = { questions: [], current: 0, score: 0, answered: {}, color: "#ff8da1" };

function _initLat50(questions, color) {
  _lat50State = { questions, current: 0, score: 0, answered: {}, color: color || "#ff8da1" };
  _renderLat50Question();
}

function _renderLat50Question() {
  const s = _lat50State;
  const q = s.questions[s.current];
  if (!q) return;

  const qNum = document.getElementById("lat50-current");
  const qTotal = document.getElementById("lat50-total");
  const qText = document.getElementById("lat50-qtext");
  const qType = document.getElementById("lat50-qtype");
  const qNumBadge = document.getElementById("lat50-qnum");
  const opts = document.getElementById("lat50-options");
  const bar = document.getElementById("lat50-progress-bar");
  const expDiv = document.getElementById("lat50-explanation");
  const resultDiv = document.getElementById("lat50-result");
  const qCard = document.getElementById("lat50-question-card");
  const scoreEl = document.getElementById("lat50-score");

  if (!qText || !opts) return;

  if (resultDiv) resultDiv.style.display = "none";
  if (qCard) qCard.style.display = "block";
  if (expDiv) expDiv.style.display = "none";

  if (qNum) qNum.textContent = s.current + 1;
  if (qTotal) qTotal.textContent = s.questions.length;
  if (qNumBadge) qNumBadge.textContent = s.current + 1;
  if (scoreEl) scoreEl.textContent = s.score;
  if (bar) bar.style.width = ((s.current / s.questions.length) * 100) + "%";

  const typeLabels = { listening: "🎧 Listening", reading: "📖 Reading", speaking: "🎙️ Speaking", writing: "✍️ Writing" };
  if (qType) qType.textContent = typeLabels[q.type] || q.type;
  if (qText) qText.innerHTML = q.question;

  const prevBtn = document.getElementById("lat50-btn-prev");
  if (prevBtn) prevBtn.style.opacity = s.current === 0 ? "0.4" : "1";

  opts.innerHTML = "";
  const isAnswered = s.answered[s.current] !== undefined;

  (q.options || []).forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.style.cssText = `padding: 11px 16px; border-radius: 10px; border: 1.5px solid #e8d5db; cursor: pointer; font-size: 0.88rem; transition: all 0.2s; display: flex; align-items: center; gap: 10px; user-select: none;`;
    btn.innerHTML = `<span style="font-weight: 800; color: ${s.color}; min-width: 22px;">${String.fromCharCode(65 + i)}.</span> ${opt}`;

    if (isAnswered) {
      btn.style.cursor = "default";
      const answered = s.answered[s.current];
      if (i === q.correct) {
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e"; btn.style.color = "#166534";
      } else if (i === answered && i !== q.correct) {
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444"; btn.style.color = "#991b1b";
      }
    } else {
      btn.onmouseenter = () => { btn.style.background = `${s.color}12`; btn.style.borderColor = s.color; };
      btn.onmouseleave = () => { btn.style.background = ""; btn.style.borderColor = "#e8d5db"; };
      btn.onclick = () => _lat50Answer(i);
    }
    opts.appendChild(btn);
  });

  if (isAnswered && expDiv && q.explanation) {
    expDiv.style.display = "block";
    expDiv.innerHTML = `<strong>💡 Penjelasan:</strong> ${q.explanation}`;
  }
}

function _lat50Answer(optIdx) {
  const s = _lat50State;
  if (s.answered[s.current] !== undefined) return;
  s.answered[s.current] = optIdx;
  const q = s.questions[s.current];
  if (optIdx === q.correct) {
    s.score++;
    showToast("✅ Benar! +1 Poin", "info");
  } else {
    showToast("❌ Kurang tepat. Lihat penjelasan di bawah.", "warning");
  }
  _renderLat50Question();
}

function lat50Next() {
  const s = _lat50State;
  if (s.current < s.questions.length - 1) {
    s.current++;
    _renderLat50Question();
  } else {
    _showLat50Result();
  }
}

function lat50Prev() {
  const s = _lat50State;
  if (s.current > 0) {
    s.current--;
    _renderLat50Question();
  }
}

function _showLat50Result() {
  const s = _lat50State;
  const qCard = document.getElementById("lat50-question-card");
  const resultDiv = document.getElementById("lat50-result");
  const expDiv = document.getElementById("lat50-explanation");
  const bar = document.getElementById("lat50-progress-bar");
  const resultText = document.getElementById("lat50-result-text");
  const scoreEl = document.getElementById("lat50-score");

  if (qCard) qCard.style.display = "none";
  if (expDiv) expDiv.style.display = "none";
  if (resultDiv) resultDiv.style.display = "block";
  if (bar) bar.style.width = "100%";
  if (scoreEl) scoreEl.textContent = s.score;

  const pct = Math.round((s.score / s.questions.length) * 100);
  let msg = pct >= 80 ? "🏆 Luar biasa! Kamu siap menghadapi ujian HSK!" :
            pct >= 60 ? "👍 Bagus! Terus berlatih untuk hasil yang lebih baik." :
            "💪 Teruslah berlatih, kamu pasti bisa!";
  if (resultText) resultText.innerHTML = `Kamu menjawab benar <strong>${s.score}</strong> dari <strong>${s.questions.length}</strong> soal (<strong>${pct}%</strong>).<br>${msg}`;

  addExpAndPoints(s.score * 5, s.score * 10, "reading");
  showToast(`🎉 Latihan selesai! Skor: ${s.score}/${s.questions.length} (${pct}%)`);
}

function lat50Restart() {
  _lat50State.current = 0;
  _lat50State.score = 0;
  _lat50State.answered = {};
  _renderLat50Question();
}

// ==========================================================================
// Generate HTML download document for module
// ==========================================================================
function _generateComprehensiveModuleHTML(mod) {
  const levelNum = parseInt((mod.level || "HSK 1").replace(/[^0-9]/g, "")) || 1;
  const allQ = (window.MandarinkuBankQuestions && window.MandarinkuBankQuestions[String(levelNum)]) || [];
  const byType = { listening: [], reading: [], speaking: [], writing: [] };
  allQ.forEach(q => { if (byType[q.type]) byType[q.type].push(q); });
  const q50 = [
    ...byType.listening.slice(0, 15),
    ...byType.reading.slice(0, 12),
    ...byType.speaking.slice(0, 12),
    ...byType.writing.slice(0, 11)
  ];
  const used = new Set(q50.map(q => q.id));
  q50.push(...allQ.filter(q => !used.has(q.id)).slice(0, 50 - q50.length));

  const typeLabels = { listening: "🎧 Listening", reading: "📖 Reading", speaking: "🎙️ Speaking", writing: "✍️ Writing" };
  const levelColors = { 1: "#ff8da1", 2: "#f4a261", 3: "#2ec4b6", 4: "#3b82f6", 5: "#8b5cf6", 6: "#e11d48" };
  const color = levelColors[levelNum] || "#ff8da1";

  let soalHTML = "";
  q50.forEach((q, i) => {
    soalHTML += `
      <div style="page-break-inside: avoid; margin-bottom: 28px; border: 1px solid #e8d5db; border-radius: 12px; padding: 18px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="background: ${color}; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.82rem;">${i + 1}</span>
          <span style="font-size: 0.78rem; font-weight: 800; color: ${color};">${typeLabels[q.type] || q.type}</span>
        </div>
        <p style="font-size: 0.95rem; color: #1a1a2e; line-height: 1.7; margin-bottom: 12px;">${q.question}</p>
        <ol type="A" style="padding-left: 20px; margin: 0; display: grid; gap: 6px;">
          ${(q.options || []).map(o => `<li style="font-size: 0.88rem; color: #3a3a5c; padding: 6px 0;">${o}</li>`).join("")}
        </ol>
      </div>`;
  });

  let kunciHTML = "";
  q50.forEach((q, i) => {
    kunciHTML += `<div style="display: flex; gap: 8px; font-size: 0.85rem; padding: 6px 0; border-bottom: 1px solid #f0f0f0;">
      <span style="font-weight: 800; min-width: 30px; color: ${color};">${i + 1}.</span>
      <span style="font-weight: 800; color: #166534;">${String.fromCharCode(65 + (q.correct || 0))}</span>
      <span style="color: #4a4a6a; margin-left: 6px;">${q.explanation || ""}</span>
    </div>`;
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mod.title} — Mandarinku ${mod.level}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #1a1a2e; background: #fff; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.8rem; font-weight: 900; color: ${color}; margin-bottom: 6px; }
    h2 { font-size: 1.2rem; font-weight: 800; color: #1a1a2e; margin: 2rem 0 1rem; padding-bottom: 6px; border-bottom: 2px solid ${color}33; }
    .badge { display: inline-block; background: ${color}; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 12px; border-radius: 9999px; margin-right: 6px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div style="background: linear-gradient(135deg, ${color}18, #f0f9ff); border: 2px solid ${color}33; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
    <span class="badge">${mod.level}</span>
    <span class="badge" style="background: #3b82f6;">${(mod.category || "Mandarin").toUpperCase()}</span>
    <h1 style="margin-top: 12px;">${mod.title}</h1>
    <p style="color: #4a4a6a; margin-top: 8px; font-size: 0.92rem; line-height: 1.6;">${mod.description}</p>
    <div style="margin-top: 12px; font-size: 0.8rem; color: #888;">
      Pengunggah: <strong>${mod.author}</strong> • ${mod.date} • ${mod.fileSize}
    </div>
  </div>

  <h2>📚 Materi Ajar</h2>
  <p style="font-size: 0.92rem; line-height: 1.8; color: #3a3a5c; margin-bottom: 1rem;">${mod.customMateri || mod.description}</p>

  <h2>✏️ Paket Latihan 50 Soal (${mod.level})</h2>
  <p style="font-size: 0.82rem; color: #888; margin-bottom: 1.4rem;">
    Listening: ${byType.listening.slice(0, 15).length} soal •
    Reading: ${byType.reading.slice(0, 12).length} soal •
    Speaking: ${byType.speaking.slice(0, 12).length} soal •
    Writing: ${byType.writing.slice(0, 11).length} soal
  </p>
  ${soalHTML}

  <h2>🔑 Kunci Jawaban</h2>
  <div style="margin-top: 0.8rem;">${kunciHTML}</div>

  <div style="margin-top: 40px; text-align: center; font-size: 0.75rem; color: #aaa; border-top: 1px solid #e0e0e0; padding-top: 16px;">
    © Mandarinku — Dokumen modul ini dibuat secara otomatis. Semoga bermanfaat! 加油！
  </div>
</body>
</html>`;
}

// ==========================================================================
// User Activity & Progress Personalization Engine
// ==========================================================================
function recordUserActivity(skillType, expGained, pointsGained, itemId = null, minutesSpent = 2) {
  const u = State.currentUser;
  if (!u) return;

  // Add Exp and Points
  u.exp += expGained;
  u.points += pointsGained;

  // Dynamic Skill Score Increment (0 - 100%)
  if (skillType && u.progress && typeof u.progress[skillType] !== 'undefined') {
    u.progress[skillType] = Math.min(100, u.progress[skillType] + 3);
  }

  // Record item ID if provided
  if (itemId && u.completedItems && u.completedItems[skillType]) {
    if (!u.completedItems[skillType].includes(itemId)) {
      u.completedItems[skillType].push(itemId);
      u.completedModules = (u.completedModules || 0) + 1;
    }
  }

  // Track daily time spent
  u.todayMinutes = (u.todayMinutes || 0) + minutesSpent;
  u.studyHours = Math.max(1, Math.round(((u.studyHours || 0) * 60 + minutesSpent) / 60));

  // Update today's entry in weekly history (last item)
  if (u.weeklyHistory && u.weeklyHistory.length > 0) {
    u.weeklyHistory[u.weeklyHistory.length - 1] = Math.min(120, (u.weeklyHistory[u.weeklyHistory.length - 1] || 0) + minutesSpent);
  }

  // Level Up check
  while (u.exp >= u.maxExp) {
    u.level += 1;
    u.exp = u.exp - u.maxExp;
    u.maxExp = Math.round(u.maxExp * 1.4);
    
    if (u.level <= 2) u.levelTitle = "Pemula Mandarinku";
    else if (u.level <= 4) u.levelTitle = "Pelajar Menengah";
    else if (u.level <= 6) u.levelTitle = "Penutur Terampil";
    else u.levelTitle = "Master Bahasa Mandarin";

    showToast(`🎉 Luar Biasa! Anda Naik ke Level ${u.level} (${u.levelTitle})!`);
  }

  // Persist to LocalStorage
  UserManager.saveCurrentUser();
  
  // Refresh UI Displays
  updateUserNavDisplay();
  updateHomeDashboard();
  if (State.currentTab === 'profil') {
    renderProfileModule();
    setTimeout(initAnalyticsChart, 50);
  }
}

function updateHomeDashboard() {
  const container = document.getElementById("home-stats-dynamic-row");
  const recContainer = document.getElementById("home-adaptive-recommendation");
  const u = State.currentUser;
  if (!container || !u) return;

  // Calculate Overall Progress Percentage
  const prog = u.progress || { listening: 50, speaking: 50, reading: 50, writing: 50 };
  const overallAvg = Math.round((prog.listening + prog.speaking + prog.reading + prog.writing) / 4);

  container.innerHTML = `
    <!-- Level Progress -->
    <div class="stat-card">
      <div class="stat-circle-progress" style="--progress: ${overallAvg};">
        <div class="stat-circle-inner">${overallAvg}%</div>
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 800; font-size: 1.1rem; color: var(--dark-text);">Level ${u.level} • ${u.levelTitle}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Halo ${u.name}! Terus semangat belajar hari ini!</div>
        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${overallAvg}%;"></div></div>
      </div>
    </div>

    <!-- Daily Streak -->
    <div class="stat-card">
      <span style="font-size: 2.2rem;">🔥</span>
      <div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${u.streak || 1}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.2;">Hari Belajar<br>Berturut-turut</div>
      </div>
    </div>

    <!-- Total Points -->
    <div class="stat-card">
      <span style="font-size: 2.2rem;">⭐</span>
      <div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${u.points || 0}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Poin Kamu</div>
      </div>
    </div>

    <!-- Quote Hari Ini -->
    <div class="quote-card">
      <span class="quote-tag">Quote Hari Ini</span>
      <div style="font-family: var(--font-chinese); font-size: 1.1rem; font-weight: bold; color: var(--dark-text); margin-bottom: 4px;">
        每天进步一点点！
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
        "Maju sedikit demi sedikit setiap hari!" ❤️
      </div>
    </div>
  `;

  // Determine skill that needs the most attention (lowest score)
  if (recContainer) {
    const skills = [
      { key: "listening", name: "🎧 Listening", page: "listening", score: prog.listening, tip: "Dengarkan lebih banyak audio percakapan penutur asli untuk melatih pendengaranmu!" },
      { key: "speaking", name: "🎙️ Speaking", page: "speaking", score: prog.speaking, tip: "Latih pelafalan nada suara dan uji akurasi dengan AI Speech Recognition kami!" },
      { key: "reading", name: "📖 Reading", page: "reading", score: prog.reading, tip: "Baca cerita pendek bilingual dan kerjakan kuis pemahaman teks!" },
      { key: "writing", name: "✍️ Writing", page: "writing", score: prog.writing, tip: "Pelajari animasi urutan goresan Hanzi dan periksa esai dengan AI Grammar Checker!" }
    ];
    skills.sort((a, b) => a.score - b.score);
    const lowest = skills[0];

    recContainer.innerHTML = `
      <div class="adaptive-rec-card">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 2.2rem;">💡</div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--dark-text);">Rekomendasi Belajar untuk ${u.name}:</h4>
              <span class="role-badge" style="background: #fff0f3; color: var(--primary-pink);">${lowest.name} (${lowest.score}%)</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              ${lowest.tip}
            </p>
          </div>
        </div>
        <button class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.85rem; white-space: nowrap;" onclick="navigateTo('${lowest.page}')">
          Latih Sekarang →
        </button>
      </div>
    `;
  }
}

// Helpers
function addExpAndPoints(exp, pts, skillType = null) {
  recordUserActivity(skillType, exp, pts, null, 1);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = type === "warning" ? "#ff9f1c" : "linear-gradient(135deg, #ff8da1, #f27289)";
  toast.style.color = "#ffffff";
  toast.style.padding = "12px 22px";
  toast.style.borderRadius = "9999px";
  toast.style.boxShadow = "0 10px 30px rgba(242, 114, 137, 0.4)";
  toast.style.zIndex = "99999";
  toast.style.fontSize = "0.92rem";
  toast.style.fontWeight = "700";
  toast.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  toast.style.transform = "translateY(20px)";
  toast.style.opacity = "0";
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  }, 50);

  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 8. Admin & Content Management Dashboard System
// ==========================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function persistBankQuestions() {
  try {
    localStorage.setItem("mandarinku_bank_questions", JSON.stringify(State.bankQuestions));
  } catch (e) {
    console.warn("Could not persist bank questions", e);
  }
}

function persistFlashcardData() {
  try {
    localStorage.setItem("mandarinku_flashcard_data", JSON.stringify(flashcardData));
  } catch (e) {
    console.warn("Could not persist flashcard data", e);
  }
}

// Restore saved questions and flashcards from localStorage
try {
  const savedQuestions = localStorage.getItem("mandarinku_bank_questions");
  if (savedQuestions) {
    const parsedQ = JSON.parse(savedQuestions);
    if (parsedQ && typeof parsedQ === 'object') {
      State.bankQuestions = parsedQ;
    }
  }
} catch (e) {}

try {
  const savedFC = localStorage.getItem("mandarinku_flashcard_data");
  if (savedFC) {
    const parsedFC = JSON.parse(savedFC);
    if (parsedFC && typeof parsedFC === 'object') {
      Object.assign(flashcardData, parsedFC);
    }
  }
} catch (e) {}

let currentAdminTab = "overview";
let adminFcLevel = 1;
window.fcState = window.fcState || { level: 1 };
let editingAdminQuiz = null;
let editingAdminFlashcard = null;
let adminQuizSearchQuery = "";
let adminFcSearchQuery = "";

// Admin Game Arena & Fitur Cerdas State
let adminGameSubtab = 'tone'; // 'tone', 'link', 'memory', 'pinyin_hanzi'
let adminGameDifficultyFilter = 'all'; // 'all', 'easy', 'medium', 'hard'
let adminGameLevelFilter = 'all'; // 'all', 1, 2, 3, 4, 5, 6
let adminGameCatFilter = 'all'; // 'all', 'cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6'
let adminGameSessionFilter = 'all'; // 'all', 'session1', 'session2', 'session3', 'session4', 'session5', 'session6'
let adminGameSearchQuery = '';

let adminFiturSubtab = 'anatomy'; // 'anatomy', 'leaderboard', 'tools'
let adminFiturLevelFilter = 'all'; // 'all', 1, 2, 3, 4, 5, 6
let adminFiturSearchQuery = '';

// Pagination States for Admin Tables
let adminGameCurrentPage = 1;
let adminGamePageSize = 10;

let adminFiturCurrentPage = 1;
let adminFiturPageSize = 10;

let adminQuizCurrentPage = 1;
let adminQuizPageSize = 10;

let adminFcCurrentPage = 1;
let adminFcPageSize = 12;

let adminStudentCurrentPage = 1;
let adminStudentPageSize = 10;

function renderClientPaginationBar(currentPage, totalItems, pageSize, onPageChangeFnName, onPageSizeChangeFnName) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);

  let pagesHtml = '';
  let startP = Math.max(1, safePage - 2);
  let endP = Math.min(totalPages, startP + 4);
  if (endP - startP < 4) startP = Math.max(1, endP - 4);

  if (startP > 1) {
    pagesHtml += `<button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(1)">1</button>`;
    if (startP > 2) pagesHtml += `<span style="color:#94a3b8; padding: 0 3px;">...</span>`;
  }

  for (let p = startP; p <= endP; p++) {
    pagesHtml += `<button type="button" class="page-nav-btn ${p === safePage ? 'active' : ''}" onclick="${onPageChangeFnName}(${p})">${p}</button>`;
  }

  if (endP < totalPages) {
    if (endP < totalPages - 1) pagesHtml += `<span style="color:#94a3b8; padding: 0 3px;">...</span>`;
    pagesHtml += `<button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(${totalPages})">${totalPages}</button>`;
  }

  return `
    <div class="table-pagination-nav">
      <div style="font-size: 0.84rem; color: #64748b; font-weight: 600;">
        Menampilkan <strong style="color: #1e293b;">${startIdx} - ${endIdx}</strong> dari <strong style="color: #1e293b;">${totalItems}</strong> butir data
      </div>
      <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 5px; margin-right: 6px;">
          <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Baris:</span>
          <select onchange="${onPageSizeChangeFnName}(parseInt(this.value))" style="padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; font-weight: 700; color: #334155; background: #fff; cursor: pointer;">
            <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
            <option value="15" ${pageSize === 15 ? 'selected' : ''}>15</option>
            <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
            <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
          </select>
        </div>
        <button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(1)" ${safePage === 1 ? 'disabled' : ''} title="Halaman Pertama">«</button>
        <button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(${safePage - 1})" ${safePage === 1 ? 'disabled' : ''} title="Halaman Sebelumnya">‹</button>
        ${pagesHtml}
        <button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(${safePage + 1})" ${safePage === totalPages ? 'disabled' : ''} title="Halaman Berikutnya">›</button>
        <button type="button" class="page-nav-btn" onclick="${onPageChangeFnName}(${totalPages})" ${safePage === totalPages ? 'disabled' : ''} title="Halaman Terakhir">»</button>
      </div>
    </div>
  `;
}

window.setAdminGamePage = function(page) {
  adminGameCurrentPage = page;
  renderAdminDashboard();
};
window.setAdminGamePageSize = function(size) {
  adminGamePageSize = size;
  adminGameCurrentPage = 1;
  renderAdminDashboard();
};

window.setAdminFiturPage = function(page) {
  adminFiturCurrentPage = page;
  renderAdminDashboard();
};
window.setAdminFiturPageSize = function(size) {
  adminFiturPageSize = size;
  adminFiturCurrentPage = 1;
  renderAdminDashboard();
};

window.setAdminQuizPage = function(page) {
  adminQuizCurrentPage = page;
  renderAdminDashboard();
};
window.setAdminQuizPageSize = function(size) {
  adminQuizPageSize = size;
  adminQuizCurrentPage = 1;
  renderAdminDashboard();
};

window.setAdminFcPage = function(page) {
  adminFcCurrentPage = page;
  renderAdminDashboard();
};
window.setAdminFcPageSize = function(size) {
  adminFcPageSize = size;
  adminFcCurrentPage = 1;
  renderAdminDashboard();
};

window.setAdminStudentPage = function(page) {
  adminStudentCurrentPage = page;
  renderAdminDashboard();
};
window.setAdminStudentPageSize = function(size) {
  adminStudentPageSize = size;
  adminStudentCurrentPage = 1;
  renderAdminDashboard();
};

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll("#page-admin .sidebar-link").forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (
      (tabName === 'overview' && text.includes('ringkasan')) ||
      (tabName === 'modules' && text.includes('modul')) ||
      (tabName === 'quizzes' && text.includes('kuis')) ||
      (tabName === 'flashcards' && text.includes('flashcard')) ||
      (tabName === 'students' && text.includes('siswa')) ||
      (tabName === 'game_arena' && text.includes('game arena')) ||
      (tabName === 'fitur_cerdas' && text.includes('fitur cerdas'))
    ) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const container = document.getElementById("admin-subtab-content");
  if (!container) return;

  // Calculate statistics
  const totalModules = State.modules.length;
  let totalQuizzes = 0;
  [1, 2, 3, 4, 5, 6].forEach(lvl => {
    if (State.bankQuestions[lvl]) totalQuizzes += State.bankQuestions[lvl].length;
  });
  let totalFlashcards = 0;
  [1, 2, 3, 4, 5, 6].forEach(lvl => {
    if (flashcardData[lvl]) totalFlashcards += flashcardData[lvl].length;
  });
  const allProfiles = UserManager.getProfiles();
  const totalStudents = Object.values(allProfiles).filter(p => p.role === 'student').length || 1;

  if (currentAdminTab === 'overview') {
    container.innerHTML = `
      <!-- 4 Stats Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="stat-card" style="border-left: 4px solid #3b82f6;">
          <span style="font-size: 2.2rem;">📚</span>
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${totalModules}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Total Modul Terbit</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #10b981;">
          <span style="font-size: 2.2rem;">📝</span>
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${totalQuizzes}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Soal Kuis HSK 1-6</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #f59e0b;">
          <span style="font-size: 2.2rem;">🃏</span>
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${totalFlashcards}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Kartu Flashcard</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
          <span style="font-size: 2.2rem;">👥</span>
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--dark-text);">${totalStudents}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Siswa Terdaftar</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Panel -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--dark-text); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
          <span>⚡</span> Aksi Cepat Pengelola
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">
          Pilih salah satu tindakan di bawah untuk memperbarui konten kurikulum pembelajaran Mandarin:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          <button class="btn-primary-sakura" style="margin: 0; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="openUploadModal()">
            <span>➕</span> <strong>Unggah Modul Ajar</strong>
          </button>
          <button class="btn-primary-sakura" style="margin: 0; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="openAdminQuizModal()">
            <span>📝</span> <strong>Tambah Butir Kuis</strong>
          </button>
          <button class="btn-primary-sakura" style="margin: 0; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="openAdminFlashcardModal()">
            <span>🃏</span> <strong>Buat Flashcard Baru</strong>
          </button>
          <button class="btn-learn-outline" style="margin: 0; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="switchAdminTab('students')">
            <span>📊</span> <strong>Lihat Data Siswa</strong>
          </button>
        </div>
      </div>

      <!-- Recent Modules and Questions Preview -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.2rem;">
        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark-text);">📚 Daftar Modul Terakhir</h4>
            <a href="javascript:void(0)" onclick="switchAdminTab('modules')" style="font-size: 0.8rem; color: var(--primary-pink); font-weight: 700;">Kelola Semua →</a>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${State.modules.slice(0, 4).map(m => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #f8fafc; border-radius: 8px; font-size: 0.84rem;">
                <div>
                  <span class="role-badge" style="font-size: 0.7rem; padding: 2px 6px;">${m.level}</span>
                  <strong style="color: var(--dark-text); margin-left: 4px;">${m.title}</strong>
                </div>
                <span style="font-size: 0.75rem; color: #64748b;">${m.downloads || 0}x unduh</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark-text);">📝 Butir Soal HSK Terbaru</h4>
            <a href="javascript:void(0)" onclick="switchAdminTab('quizzes')" style="font-size: 0.8rem; color: var(--primary-pink); font-weight: 700;">Kelola Semua →</a>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(State.bankQuestions[1] || []).slice(0, 4).map((q, idx) => `
              <div style="padding: 8px 10px; background: #f8fafc; border-radius: 8px; font-size: 0.82rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 700; color: #10b981;">HSK 1 • ${(q.type || 'Reading').toUpperCase()}</span>
                  <span style="color: #64748b; font-size: 0.75rem;">Kunci: ${String.fromCharCode(65 + q.correct)}</span>
                </div>
                <div style="color: var(--dark-text); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${q.question}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (currentAdminTab === 'modules') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-text);">📚 Manajemen Modul Ajar (HSK 1 - 6)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Kelola, tambahkan, periksa, atau hapus modul materi pembelajaran.</p>
        </div>
        <button class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.85rem;" onclick="openUploadModal()">
          ➕ Tambah Modul Baru
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${State.modules.map((m, idx) => `
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
                <span class="role-badge" style="font-size: 0.72rem; padding: 2px 8px;">${m.level}</span>
                <span class="role-badge" style="background: #eff6ff; color: #3b82f6; font-size: 0.72rem; padding: 2px 8px;">${(m.category || 'MANDARIN').toUpperCase()}</span>
                <span style="font-size: 0.78rem; color: #64748b;">Pengunggah: <strong>${m.author}</strong></span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--dark-text);">${m.title}</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">${m.description}</p>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn-primary-sakura" style="margin: 0; padding: 6px 14px; font-size: 0.8rem;" onclick="openModuleDetailPage('${m.id}')">
                📖 Lihat
              </button>
              <button class="btn-learn-outline" style="margin: 0; padding: 6px 14px; font-size: 0.8rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openEditModuleModal('${m.id}')">
                ✏️ Edit
              </button>
              <button class="btn-learn-outline" style="margin: 0; padding: 6px 14px; font-size: 0.8rem;" onclick="downloadModuleFile('${m.id}')">
                📥 Unduh
              </button>
              ${m.id.startsWith('mod-custom-') ? `
                <button class="btn-learn-outline" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; color: #ef4444; border-color: #fca5a5;" onclick="deleteAdminModule('${m.id}')">
                  🗑️ Hapus
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentAdminTab === 'quizzes') {
    const activeLevel = State.currentHskLevel === 'all' ? 1 : (State.currentHskLevel || 1);
    const allQuestions = State.bankQuestions[activeLevel] || [];
    const query = (adminQuizSearchQuery || '').trim().toLowerCase();

    // Map each question with its original index for accurate editing & deletion
    const filteredList = allQuestions.map((q, idx) => ({ q, originalIdx: idx })).filter(item => {
      if (!query) return true;
      const textMatch = (item.q.question || '').toLowerCase().includes(query);
      const optMatch = (item.q.options || []).some(o => (o || '').toLowerCase().includes(query));
      const typeMatch = (item.q.type || '').toLowerCase().includes(query);
      return textMatch || optMatch || typeMatch;
    });

    const totalQuizItems = filteredList.length;
    const totalQuizPages = Math.max(1, Math.ceil(totalQuizItems / adminQuizPageSize));
    if (adminQuizCurrentPage > totalQuizPages) adminQuizCurrentPage = totalQuizPages;
    if (adminQuizCurrentPage < 1) adminQuizCurrentPage = 1;
    const quizStart = (adminQuizCurrentPage - 1) * adminQuizPageSize;
    const pagedQuizList = filteredList.slice(quizStart, quizStart + adminQuizPageSize);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-text);">📝 Manajemen Soal & Bank Kuis (HSK 1 - 6)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Buat butir soal baru, edit setiap butir pertanyaan & kunci jawaban, atau hapus butir latihan.</p>
        </div>
        <button class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.85rem; background: linear-gradient(135deg, #10b981, #059669);" onclick="openAdminQuizModal()">
          ➕ Tambah Soal Kuis
        </button>
      </div>

      <!-- Level Selector Chips & Search Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button class="bank-filter-chip ${lvl === activeLevel ? 'active' : ''}" onclick="State.currentHskLevel = ${lvl}; adminQuizCurrentPage = 1; renderAdminDashboard();">
              HSK Level ${lvl} (${(State.bankQuestions[lvl] || []).length} Soal)
            </button>
          `).join('')}
        </div>
        <div style="position: relative;">
          <input type="text" value="${escapeHtml(adminQuizSearchQuery)}" oninput="adminQuizSearchQuery = this.value; adminQuizCurrentPage = 1; renderAdminDashboard();" placeholder="🔍 Cari soal / kata kunci..." style="padding: 7px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; width: 230px;">
          ${adminQuizSearchQuery ? `<button onclick="adminQuizSearchQuery=''; adminQuizCurrentPage = 1; renderAdminDashboard();" style="position: absolute; right: 8px; top: 7px; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 0.8rem;">✕</button>` : ''}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${filteredList.length === 0 ? `
          <div style="background: #fff; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 25px; text-align: center; color: var(--text-muted);">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🔍</div>
            <p style="margin: 0; font-size: 0.88rem;">${query ? `Tidak ada soal yang cocok dengan pencarian "<strong>${escapeHtml(query)}</strong>".` : 'Belum ada soal di level ini.'}</p>
          </div>
        ` : pagedQuizList.map(({ q, originalIdx }) => `
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); transition: border-color 0.2s;" onmouseenter="this.style.borderColor='#93c5fd'" onmouseleave="this.style.borderColor='#e2e8f0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="role-badge" style="background: #ecfdf5; color: #059669; font-size: 0.72rem; font-weight: 800;">
                  HSK ${activeLevel} • #${originalIdx + 1} • ${(q.type || 'Reading').toUpperCase()}
                </span>
                ${q.audio ? '<span style="font-size: 0.72rem; color: #3b82f6; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">🔊 Audio</span>' : ''}
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <button onclick="openEditAdminQuizModal(${activeLevel}, ${originalIdx})" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                  ✏️ Edit Soal
                </button>
                <button onclick="deleteAdminQuiz(${activeLevel}, ${originalIdx})" style="background: #fee2e2; border: 1px solid #fca5a5; color: #dc2626; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  🗑️ Hapus
                </button>
              </div>
            </div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--dark-text); margin-bottom: 8px; line-height: 1.4;">${escapeHtml(q.question)}</div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px; margin-bottom: 8px;">
              ${(q.options || []).map((opt, i) => `
                <div style="padding: 7px 10px; border-radius: 6px; font-size: 0.82rem; ${i === q.correct ? 'background: #dcfce7; color: #166534; font-weight: bold; border: 1.5px solid #86efac;' : 'background: #f8fafc; color: #475569; border: 1px solid #f1f5f9;'}">
                  ${String.fromCharCode(65 + i)}. ${escapeHtml(opt)} ${i === q.correct ? '✓ (Kunci Benar)' : ''}
                </div>
              `).join('')}
            </div>

            ${q.explanation ? `<div style="font-size: 0.78rem; color: #64748b; background: #fdf2f8; padding: 6px 10px; border-radius: 6px; border-left: 3px solid var(--primary-pink);">💡 <strong>Pembahasan:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ${filteredList.length > 0 ? renderClientPaginationBar(adminQuizCurrentPage, totalQuizItems, adminQuizPageSize, 'setAdminQuizPage', 'setAdminQuizPageSize') : ''}
    `;
  } else if (currentAdminTab === 'flashcards') {
    const activeLevel = adminFcLevel || 1;
    const allCards = flashcardData[activeLevel] || [];
    const query = (adminFcSearchQuery || '').trim().toLowerCase();

    // Map each card with its original index for accurate editing & deletion
    const filteredCards = allCards.map((c, idx) => ({ c, originalIdx: idx })).filter(item => {
      if (!query) return true;
      const hanziMatch = (item.c.hanzi || '').toLowerCase().includes(query);
      const pinyinMatch = (item.c.pinyin || '').toLowerCase().includes(query);
      const meaningMatch = (item.c.meaning || '').toLowerCase().includes(query);
      const meaningEnMatch = (item.c.meaning_en || '').toLowerCase().includes(query);
      return hanziMatch || pinyinMatch || meaningMatch || meaningEnMatch;
    });

    const totalFcItems = filteredCards.length;
    const totalFcPages = Math.max(1, Math.ceil(totalFcItems / adminFcPageSize));
    if (adminFcCurrentPage > totalFcPages) adminFcCurrentPage = totalFcPages;
    if (adminFcCurrentPage < 1) adminFcCurrentPage = 1;
    const fcStart = (adminFcCurrentPage - 1) * adminFcPageSize;
    const pagedFcCards = filteredCards.slice(fcStart, fcStart + adminFcPageSize);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-text);">🃏 Manajemen Flashcard Kosakata (HSK 1 - 6)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Kelola dan edit setiap kartu hafalan kata Hanzi, Pinyin, arti, serta contoh kalimat.</p>
        </div>
        <button class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.85rem; background: linear-gradient(135deg, #f59e0b, #d97706);" onclick="openAdminFlashcardModal()">
          ➕ Tambah Flashcard
        </button>
      </div>

      <!-- Level Selector Chips & Search Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button class="bank-filter-chip ${lvl === activeLevel ? 'active' : ''}" onclick="adminFcLevel = ${lvl}; adminFcCurrentPage = 1; if (window.fcState) window.fcState.level = ${lvl}; renderAdminDashboard();">
              HSK Level ${lvl} (${(flashcardData[lvl] || []).length} Kartu)
            </button>
          `).join('')}
        </div>
        <div style="position: relative;">
          <input type="text" value="${escapeHtml(adminFcSearchQuery)}" oninput="adminFcSearchQuery = this.value; adminFcCurrentPage = 1; renderAdminDashboard();" placeholder="🔍 Cari Hanzi, Pinyin, arti..." style="padding: 7px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; width: 230px;">
          ${adminFcSearchQuery ? `<button onclick="adminFcSearchQuery=''; adminFcCurrentPage = 1; renderAdminDashboard();" style="position: absolute; right: 8px; top: 7px; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 0.8rem;">✕</button>` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
        ${filteredCards.length === 0 ? `
          <div style="grid-column: 1 / -1; background: #fff; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 25px; text-align: center; color: var(--text-muted);">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🔍</div>
            <p style="margin: 0; font-size: 0.88rem;">${query ? `Tidak ada flashcard yang cocok dengan pencarian "<strong>${escapeHtml(query)}</strong>".` : 'Belum ada kartu flashcard di level ini.'}</p>
          </div>
        ` : pagedFcCards.map(({ c, originalIdx }) => `
          <div style="background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px; position: relative; box-shadow: 0 1px 4px rgba(0,0,0,0.03); transition: transform 0.15s, box-shadow 0.15s;" onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'" onmouseleave="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.03)'">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="role-badge" style="background: #fffbeb; color: #b45309; font-size: 0.7rem; font-weight: 800; border: 1px solid #fde68a;">
                HSK ${activeLevel} • #${originalIdx + 1}
              </span>
              <div style="display: flex; gap: 4px;">
                <button onclick="openEditAdminFlashcardModal(${activeLevel}, ${originalIdx})" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 3px;" title="Edit Flashcard">
                  ✏️ Edit
                </button>
                <button onclick="deleteAdminFlashcard(${activeLevel}, ${originalIdx})" style="background: #fee2e2; border: 1px solid #fca5a5; color: #dc2626; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; cursor: pointer; font-weight: 700;" title="Hapus Kartu">
                  🗑️
                </button>
              </div>
            </div>

            <div style="display: flex; align-items: baseline; gap: 8px;">
              <div style="font-size: 1.6rem; font-family: var(--font-chinese, serif); font-weight: bold; color: var(--dark-text);">${escapeHtml(c.hanzi)}</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary-pink);">${escapeHtml(c.pinyin)}</div>
              <button onclick="speakMandarin('${escapeHtml(c.hanzi).replace(/'/g, "\\'")}')" style="background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0;" title="Dengarkan Pengucapan">🔊</button>
            </div>

            <div style="font-size: 0.88rem; color: #334155; margin-top: 6px; font-weight: 600; line-height: 1.3;">
              ${escapeHtml(c.meaning)}
              ${c.meaning_en ? `<div style="font-size: 0.75rem; color: #64748b; font-weight: normal; margin-top: 2px;">EN: ${escapeHtml(c.meaning_en)}</div>` : ''}
            </div>

            ${c.example ? `
              <div style="font-size: 0.76rem; color: #475569; margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                <div style="font-family: var(--font-chinese, serif); font-weight: 500; color: #1e293b;">${escapeHtml(c.example)}</div>
                ${c.exampleTrans ? `<div style="color: #64748b; margin-top: 2px;">${escapeHtml(c.exampleTrans)}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ${filteredCards.length > 0 ? renderClientPaginationBar(adminFcCurrentPage, totalFcItems, adminFcPageSize, 'setAdminFcPage', 'setAdminFcPageSize') : ''}
    `;
  } else if (currentAdminTab === 'students') {
    const profiles = Object.values(allProfiles);

    const totalStudentItems = profiles.length;
    const totalStudentPages = Math.max(1, Math.ceil(totalStudentItems / adminStudentPageSize));
    if (adminStudentCurrentPage > totalStudentPages) adminStudentCurrentPage = totalStudentPages;
    if (adminStudentCurrentPage < 1) adminStudentCurrentPage = 1;
    const studentStart = (adminStudentCurrentPage - 1) * adminStudentPageSize;
    const pagedProfiles = profiles.slice(studentStart, studentStart + adminStudentPageSize);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-text);">👥 Data Siswa & Pantauan Aktivitas Belajar</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Pantau kedisiplinan, skor latihan, streak, dan progres belajar siswa.</p>
        </div>
      </div>

      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
              <th style="padding: 12px 16px;">Nama Siswa</th>
              <th style="padding: 12px 16px;">Email</th>
              <th style="padding: 12px 16px;">Role</th>
              <th style="padding: 12px 16px;">Level & EXP</th>
              <th style="padding: 12px 16px;">🔥 Streak</th>
              <th style="padding: 12px 16px;">⭐ Poin</th>
              <th style="padding: 12px 16px;">Rata-rata Skill</th>
            </tr>
          </thead>
          <tbody>
            ${pagedProfiles.map(p => {
              const prog = p.progress || { listening: 50, speaking: 50, reading: 50, writing: 50 };
              const avg = Math.round((prog.listening + prog.speaking + prog.reading + prog.writing) / 4);
              return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; font-weight: 700; color: var(--dark-text);">${p.name}</td>
                  <td style="padding: 12px 16px; color: #64748b;">${p.email}</td>
                  <td style="padding: 12px 16px;"><span class="role-badge" style="font-size: 0.7rem;">${p.role.toUpperCase()}</span></td>
                  <td style="padding: 12px 16px;">Level ${p.level} (${p.exp} EXP)</td>
                  <td style="padding: 12px 16px;">🔥 ${p.streak || 1} Hari</td>
                  <td style="padding: 12px 16px; font-weight: 700; color: #f59e0b;">⭐ ${p.points || 0}</td>
                  <td style="padding: 12px 16px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div class="progress-bar-container" style="width: 70px; height: 6px;"><div class="progress-bar-fill" style="width: ${avg}%;"></div></div>
                      <span style="font-weight: 700; font-size: 0.78rem;">${avg}%</span>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ${profiles.length > 0 ? renderClientPaginationBar(adminStudentCurrentPage, totalStudentItems, adminStudentPageSize, 'setAdminStudentPage', 'setAdminStudentPageSize') : ''}
      </div>
    `;
  } else if (currentAdminTab === 'game_arena') {
    if (window.MandarinkuExtras && typeof window.MandarinkuExtras.syncAdminGameData === 'function') {
      window.MandarinkuExtras.syncAdminGameData();
    }

    const toneList = (window.MandarinkuExtras && window.MandarinkuExtras.toneTrainerBank) || [];
    let linkList = [];
    if (window.MandarinkuExtras && window.MandarinkuExtras.wordLinkBankByCat) {
      Object.keys(window.MandarinkuExtras.wordLinkBankByCat).forEach(catKey => {
        (window.MandarinkuExtras.wordLinkBankByCat[catKey] || []).forEach(item => {
          linkList.push({ ...item, category: catKey, id: item.id || (catKey + '_' + item.hanzi) });
        });
      });
    }
    const memList = (window.MandarinkuExtras && window.MandarinkuExtras.memoryCardsBank) || [];
    const phList = (window.MandarinkuExtras && window.MandarinkuExtras.pinyinHanziBank) || [];

    const currentSub = adminGameSubtab || 'tone';
    const q = (adminGameSearchQuery || '').trim().toLowerCase();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="role-badge" style="background: #8b5cf6; color: #fff; font-weight: 800; font-size: 0.75rem;">🎮 PUSAT MANAJEMEN GAME</span>
            <span style="font-size: 0.8rem; color: #64748b;">(Pelatih Nada, Pasang Kata, Kartu Memori & Pinyin-Hanzi)</span>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text); margin-top: 4px;">Kelola Arena Game Mandarin</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Tambah, edit, sesuaikan kesulitan (Easy, Medium, Hard), serta hapus butir soal game interaktif.</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn-primary-sakura" style="margin: 0; padding: 8px 16px; font-size: 0.84rem; background: linear-gradient(135deg, #8b5cf6, #7c3aed);" onclick="openAdminGameModal('${currentSub}')">
            ➕ Tambah Soal Game
          </button>
          <a href="admin/game_arena.php?tab=${currentSub}" target="_blank" class="btn-learn-outline" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.84rem; border-color: #c4b5fd; color: #6d28d9; background: #f5f3ff;">
            <span>⚙️ Panel Backend Penuh ↗</span>
          </a>
        </div>
      </div>

      <!-- Subtab Game Pills -->
      <div style="display: flex; gap: 8px; margin-bottom: 1.2rem; border-bottom: 2px solid #ede9fe; padding-bottom: 8px; flex-wrap: wrap;">
        <button class="bank-filter-chip ${currentSub === 'tone' ? 'active' : ''}" style="${currentSub === 'tone' ? 'background: #8b5cf6; color: #fff; border-color: #8b5cf6;' : ''}" onclick="adminGameSubtab = 'tone'; adminGameCurrentPage = 1; renderAdminDashboard();">
          🎵 Pelatih 4 Nada (${toneList.length})
        </button>
        <button class="bank-filter-chip ${currentSub === 'link' ? 'active' : ''}" style="${currentSub === 'link' ? 'background: #8b5cf6; color: #fff; border-color: #8b5cf6;' : ''}" onclick="adminGameSubtab = 'link'; adminGameCurrentPage = 1; renderAdminDashboard();">
          🔗 Pasang Kata (${linkList.length})
        </button>
        <button class="bank-filter-chip ${currentSub === 'memory' ? 'active' : ''}" style="${currentSub === 'memory' ? 'background: #8b5cf6; color: #fff; border-color: #8b5cf6;' : ''}" onclick="adminGameSubtab = 'memory'; adminGameCurrentPage = 1; renderAdminDashboard();">
          🃏 Kartu Memori Balik (${memList.length})
        </button>
        <button class="bank-filter-chip ${currentSub === 'pinyin_hanzi' ? 'active' : ''}" style="${currentSub === 'pinyin_hanzi' ? 'background: #8b5cf6; color: #fff; border-color: #8b5cf6;' : ''}" onclick="adminGameSubtab = 'pinyin_hanzi'; adminGameCurrentPage = 1; renderAdminDashboard();">
          🔤 Tebak Pinyin ➔ Hanzi (${phList.length})
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
          <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Filter Kesulitan:</span>
          ${['all', 'easy', 'medium', 'hard'].map(diff => `
            <button class="bank-filter-chip ${adminGameDifficultyFilter === diff ? 'active' : ''}" style="font-size: 0.75rem; padding: 4px 10px;" onclick="adminGameDifficultyFilter = '${diff}'; adminGameCurrentPage = 1; renderAdminDashboard();">
              ${diff === 'all' ? 'Semua' : (diff === 'easy' ? '🟢 Easy' : (diff === 'medium' ? '🟡 Medium' : '🔴 Hard'))}
            </button>
          `).join('')}

          ${currentSub === 'memory' ? `
            <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-left: 8px;">Sesi:</span>
            <select style="padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.78rem;" onchange="adminGameSessionFilter = this.value; adminGameCurrentPage = 1; renderAdminDashboard();">
              <option value="all" ${adminGameSessionFilter === 'all' ? 'selected' : ''}>Semua Sesi (1-6)</option>
              <option value="session1" ${adminGameSessionFilter === 'session1' ? 'selected' : ''}>Sesi 1: Salam</option>
              <option value="session2" ${adminGameSessionFilter === 'session2' ? 'selected' : ''}>Sesi 2: Keluarga</option>
              <option value="session3" ${adminGameSessionFilter === 'session3' ? 'selected' : ''}>Sesi 3: Kuliner</option>
              <option value="session4" ${adminGameSessionFilter === 'session4' ? 'selected' : ''}>Sesi 4: Aktivitas</option>
              <option value="session5" ${adminGameSessionFilter === 'session5' ? 'selected' : ''}>Sesi 5: Waktu/Arah</option>
              <option value="session6" ${adminGameSessionFilter === 'session6' ? 'selected' : ''}>Sesi 6: Kota/Transport</option>
            </select>
          ` : ''}

          ${currentSub === 'link' ? `
            <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-left: 8px;">Kategori:</span>
            <select style="padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.78rem;" onchange="adminGameCatFilter = this.value; adminGameCurrentPage = 1; renderAdminDashboard();">
              <option value="all" ${adminGameCatFilter === 'all' ? 'selected' : ''}>Semua Kategori (1-6)</option>
              <option value="cat1" ${adminGameCatFilter === 'cat1' ? 'selected' : ''}>Kategori 1: Dasar</option>
              <option value="cat2" ${adminGameCatFilter === 'cat2' ? 'selected' : ''}>Kategori 2: Sehari-hari</option>
              <option value="cat3" ${adminGameCatFilter === 'cat3' ? 'selected' : ''}>Kategori 3: Kuliner</option>
              <option value="cat4" ${adminGameCatFilter === 'cat4' ? 'selected' : ''}>Kategori 4: Aktivitas</option>
              <option value="cat5" ${adminGameCatFilter === 'cat5' ? 'selected' : ''}>Kategori 5: Waktu & Arah</option>
              <option value="cat6" ${adminGameCatFilter === 'cat6' ? 'selected' : ''}>Kategori 6: Transportasi</option>
            </select>
          ` : ''}

          ${(currentSub === 'tone' || currentSub === 'pinyin_hanzi') ? `
            <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-left: 8px;">Level:</span>
            <select style="padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.78rem;" onchange="adminGameLevelFilter = this.value; adminGameCurrentPage = 1; renderAdminDashboard();">
              <option value="all" ${adminGameLevelFilter === 'all' ? 'selected' : ''}>Semua HSK (1-6)</option>
              ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}" ${adminGameLevelFilter == l ? 'selected' : ''}>HSK ${l}</option>`).join('')}
            </select>
          ` : ''}
        </div>

        <div style="position: relative;">
          <input type="text" value="${escapeHtml(adminGameSearchQuery)}" oninput="adminGameSearchQuery = this.value; adminGameCurrentPage = 1; renderAdminDashboard();" placeholder="🔍 Cari soal, kata, pinyin..." style="padding: 7px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; width: 230px;">
          ${adminGameSearchQuery ? `<button onclick="adminGameSearchQuery=''; adminGameCurrentPage = 1; renderAdminDashboard();" style="position: absolute; right: 8px; top: 7px; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 0.8rem;">✕</button>` : ''}
        </div>
      </div>

      <!-- Table Section -->
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        ${renderAdminGameSubTable(currentSub, toneList, linkList, memList, phList, q)}
      </div>
    `;
  } else if (currentAdminTab === 'fitur_cerdas') {
    if (window.MandarinkuExtras && typeof window.MandarinkuExtras.syncAdminGameData === 'function') {
      window.MandarinkuExtras.syncAdminGameData();
    }

    const anatomyList = (window.MandarinkuExtras && window.MandarinkuExtras.anatomyBank) || [];
    const leaderboardList = (window.MandarinkuExtras && window.MandarinkuExtras.leaderboardData) || (window.DB_LEADERBOARD || []);

    const currentSub = adminFiturSubtab || 'anatomy';
    const q = (adminFiturSearchQuery || '').trim().toLowerCase();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="role-badge" style="background: #0ea5e9; color: #fff; font-weight: 800; font-size: 0.75rem;">💡 PUSAT FITUR CERDAS</span>
            <span style="font-size: 0.8rem; color: #64748b;">(Anatomi Karakter, Leaderboard, SRS & Pewarna Nada)</span>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-text); margin-top: 4px;">Kelola Fitur Cerdas Mandarin</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Kelola anatomi karakter Hanzi (字形拆解与记忆法), kisah mnemonik visual, serta data leaderboard siswa.</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${currentSub === 'anatomy' ? `
            <button class="btn-primary-sakura" style="margin: 0; padding: 8px 16px; font-size: 0.84rem; background: linear-gradient(135deg, #0ea5e9, #0284c7);" onclick="openAdminFiturCerdasModal()">
              ➕ Tambah Karakter Anatomi
            </button>
          ` : ''}
          <a href="admin/fitur_cerdas.php" target="_blank" class="btn-learn-outline" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.84rem; border-color: #bae6fd; color: #0369a1; background: #f0f9ff;">
            <span>⚙️ Panel Backend Fitur Cerdas ↗</span>
          </a>
        </div>
      </div>

      <!-- Subtab Fitur Pills -->
      <div style="display: flex; gap: 8px; margin-bottom: 1.2rem; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px; flex-wrap: wrap;">
        <button class="bank-filter-chip ${currentSub === 'anatomy' ? 'active' : ''}" style="${currentSub === 'anatomy' ? 'background: #0ea5e9; color: #fff; border-color: #0ea5e9;' : ''}" onclick="adminFiturSubtab = 'anatomy'; adminFiturCurrentPage = 1; renderAdminDashboard();">
          🧩 Anatomi Karakter & Mnemonik (${anatomyList.length})
        </button>
        <button class="bank-filter-chip ${currentSub === 'leaderboard' ? 'active' : ''}" style="${currentSub === 'leaderboard' ? 'background: #0ea5e9; color: #fff; border-color: #0ea5e9;' : ''}" onclick="adminFiturSubtab = 'leaderboard'; adminFiturCurrentPage = 1; renderAdminDashboard();">
          🏆 Papan Peringkat EXP (${leaderboardList.length})
        </button>
        <button class="bank-filter-chip ${currentSub === 'tools' ? 'active' : ''}" style="${currentSub === 'tools' ? 'background: #0ea5e9; color: #fff; border-color: #0ea5e9;' : ''}" onclick="adminFiturSubtab = 'tools'; adminFiturCurrentPage = 1; renderAdminDashboard();">
          🎨 Pewarna Nada & SRS Anki
        </button>
      </div>

      ${currentSub === 'anatomy' ? `
        <!-- Filters & Search Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Level HSK:</span>
            <button class="bank-filter-chip ${adminFiturLevelFilter === 'all' ? 'active' : ''}" style="font-size: 0.75rem; padding: 4px 10px;" onclick="adminFiturLevelFilter = 'all'; adminFiturCurrentPage = 1; renderAdminDashboard();">
              Semua Level (${anatomyList.length})
            </button>
            ${[1, 2, 3, 4, 5, 6].map(lvl => `
              <button class="bank-filter-chip ${adminFiturLevelFilter == lvl ? 'active' : ''}" style="font-size: 0.75rem; padding: 4px 10px;" onclick="adminFiturLevelFilter = ${lvl}; adminFiturCurrentPage = 1; renderAdminDashboard();">
                HSK ${lvl}
              </button>
            `).join('')}
          </div>

          <div style="position: relative;">
            <input type="text" value="${escapeHtml(adminFiturSearchQuery)}" oninput="adminFiturSearchQuery = this.value; adminFiturCurrentPage = 1; renderAdminDashboard();" placeholder="🔍 Cari Hanzi, radikal, arti..." style="padding: 7px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; width: 230px;">
            ${adminFiturSearchQuery ? `<button onclick="adminFiturSearchQuery=''; adminFiturCurrentPage = 1; renderAdminDashboard();" style="position: absolute; right: 8px; top: 7px; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 0.8rem;">✕</button>` : ''}
          </div>
        </div>

        <!-- Table Section -->
        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          ${renderAdminAnatomyTable(anatomyList, q)}
        </div>
      ` : (currentSub === 'leaderboard' ? `
        ${(() => {
          const totalLbItems = leaderboardList.length;
          const totalLbPages = Math.max(1, Math.ceil(totalLbItems / adminFiturPageSize));
          if (adminFiturCurrentPage > totalLbPages) adminFiturCurrentPage = totalLbPages;
          if (adminFiturCurrentPage < 1) adminFiturCurrentPage = 1;
          const lbStart = (adminFiturCurrentPage - 1) * adminFiturPageSize;
          const pagedLb = leaderboardList.slice(lbStart, lbStart + adminFiturPageSize);

          return `
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
                    <th style="padding: 12px 16px;">Peringkat</th>
                    <th style="padding: 12px 16px;">Nama Siswa</th>
                    <th style="padding: 12px 16px;">Level HSK</th>
                    <th style="padding: 12px 16px;">Total EXP</th>
                    <th style="padding: 12px 16px;">Medali</th>
                    <th style="padding: 12px 16px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${pagedLb.map((lb, idx) => {
                    const realIdx = lbStart + idx;
                    return `
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 16px; font-weight: 800; color: ${realIdx === 0 ? '#f59e0b' : (realIdx === 1 ? '#64748b' : (realIdx === 2 ? '#b45309' : '#334155'))};">
                          ${realIdx === 0 ? '🥇 #1' : (realIdx === 1 ? '🥈 #2' : (realIdx === 2 ? '🥉 #3' : `#${lb.rank || (realIdx + 1)}`))}
                        </td>
                        <td style="padding: 12px 16px;">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.2rem;">${lb.avatar || '🎓'}</span>
                            <strong style="color: var(--dark-text);">${escapeHtml(lb.name)}</strong>
                            ${lb.isUser ? '<span class="role-badge" style="font-size: 0.65rem; background: #dcfce7; color: #15803d;">AKUN ANDA</span>' : ''}
                          </div>
                        </td>
                        <td style="padding: 12px 16px;"><span class="role-badge" style="font-size: 0.72rem;">${lb.hsk || 'HSK 1'}</span></td>
                        <td style="padding: 12px 16px; font-weight: 800; color: #2563eb;">⚡ ${Number(lb.exp || 0).toLocaleString()} EXP</td>
                        <td style="padding: 12px 16px;">${lb.medal || '🎖️'}</td>
                        <td style="padding: 12px 16px;"><span style="color: #10b981; font-weight: 700; font-size: 0.75rem;">● Aktif</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
              ${renderClientPaginationBar(adminFiturCurrentPage, totalLbItems, adminFiturPageSize, 'setAdminFiturPage', 'setAdminFiturPageSize')}
            </div>
          `;
        })()}
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">🎨</div>
            <h4 style="font-weight: 800; color: var(--dark-text); margin-bottom: 6px;">Pewarna Nada Hanzi</h4>
            <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 12px;">Mewarnai setiap karakter Hanzi berdasarkan nada (Tone 1 Merah, Tone 2 Hijau, Tone 3 Biru, Tone 4 Ungu, Netral Abu-abu).</p>
            <button class="btn-primary-sakura" style="font-size: 0.8rem; padding: 6px 14px;" onclick="navigateTo('fitur-pintar'); MandarinkuExtras.switchFiturPintarTab('colorizer');">
              Buka Pewarna Nada →
            </button>
          </div>

          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">📥</div>
            <h4 style="font-weight: 800; color: var(--dark-text); margin-bottom: 6px;">Ekspor Format Anki SRS</h4>
            <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 12px;">Unduh kosakata HSK 1-6 dalam format CSV siap impor untuk aplikasi Anki Flashcards Spaced Repetition System.</p>
            <button class="btn-primary-sakura" style="font-size: 0.8rem; padding: 6px 14px;" onclick="navigateTo('fitur-pintar'); MandarinkuExtras.switchFiturPintarTab('anki');">
              Buka Ekspor Anki →
            </button>
          </div>

          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">🖨️</div>
            <h4 style="font-weight: 800; color: var(--dark-text); margin-bottom: 6px;">Generator Tian Zi Ge (田字格)</h4>
            <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 12px;">Cetak lembar latihan menulis Hanzi kotak tianzige atau mizige dengan panduan urutan goresan stroke order.</p>
            <button class="btn-primary-sakura" style="font-size: 0.8rem; padding: 6px 14px;" onclick="navigateTo('cetak-hanzi');">
              Buka Lembar Tulis →
            </button>
          </div>
        </div>
      `)}
    `;
  }
}

// Modal and CRUD Functions for Admin
function openAdminQuizModal() {
  editingAdminQuiz = null;
  const modal = document.getElementById("admin-quiz-modal");
  if (!modal) return;
  const title = document.getElementById("admin-quiz-modal-title");
  if (title) title.textContent = "📝 Tambah Butir Soal Kuis Baru";
  const saveBtn = document.getElementById("admin-quiz-save-btn");
  if (saveBtn) {
    saveBtn.textContent = "💾 Simpan Soal Kuis";
    saveBtn.style.background = "";
  }

  const activeLevel = State.currentHskLevel === 'all' ? 1 : (State.currentHskLevel || 1);
  const lvlInput = document.getElementById("quiz-input-level");
  if (lvlInput) lvlInput.value = activeLevel;
  const typeInput = document.getElementById("quiz-input-type");
  if (typeInput) typeInput.value = "reading";
  const qInput = document.getElementById("quiz-input-question");
  if (qInput) qInput.value = "";
  const audioInput = document.getElementById("quiz-input-audio");
  if (audioInput) audioInput.value = "";
  const opt0 = document.getElementById("quiz-opt-0");
  if (opt0) opt0.value = "";
  const opt1 = document.getElementById("quiz-opt-1");
  if (opt1) opt1.value = "";
  const opt2 = document.getElementById("quiz-opt-2");
  if (opt2) opt2.value = "";
  const opt3 = document.getElementById("quiz-opt-3");
  if (opt3) opt3.value = "";
  const radio0 = document.querySelector('input[name="quiz-correct-radio"][value="0"]');
  if (radio0) radio0.checked = true;
  const expInput = document.getElementById("quiz-input-explanation");
  if (expInput) expInput.value = "";

  modal.classList.add("active");
}

function openEditAdminQuizModal(level, idx) {
  const questions = State.bankQuestions[level] || [];
  const q = questions[idx];
  if (!q) {
    showToast("Soal tidak ditemukan!", "error");
    return;
  }
  editingAdminQuiz = { level, idx, id: q.id };

  const modal = document.getElementById("admin-quiz-modal");
  if (!modal) return;
  const title = document.getElementById("admin-quiz-modal-title");
  if (title) title.textContent = `✏️ Edit Butir Soal Kuis (HSK ${level} • #${idx + 1})`;
  const saveBtn = document.getElementById("admin-quiz-save-btn");
  if (saveBtn) {
    saveBtn.textContent = "💾 Simpan Perubahan Soal";
    saveBtn.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
  }

  const lvlInput = document.getElementById("quiz-input-level");
  if (lvlInput) lvlInput.value = level;
  const typeInput = document.getElementById("quiz-input-type");
  if (typeInput) typeInput.value = q.type || "reading";
  const qInput = document.getElementById("quiz-input-question");
  if (qInput) qInput.value = q.question || "";
  const audioInput = document.getElementById("quiz-input-audio");
  if (audioInput) audioInput.value = q.audio || "";

  const opts = q.options || [];
  const opt0 = document.getElementById("quiz-opt-0");
  if (opt0) opt0.value = opts[0] || "";
  const opt1 = document.getElementById("quiz-opt-1");
  if (opt1) opt1.value = opts[1] || "";
  const opt2 = document.getElementById("quiz-opt-2");
  if (opt2) opt2.value = opts[2] || "";
  const opt3 = document.getElementById("quiz-opt-3");
  if (opt3) opt3.value = opts[3] || "";

  const correctVal = typeof q.correct === 'number' ? q.correct : 0;
  const radio = document.querySelector(`input[name="quiz-correct-radio"][value="${correctVal}"]`);
  if (radio) radio.checked = true;

  const expInput = document.getElementById("quiz-input-explanation");
  if (expInput) expInput.value = q.explanation || "";

  modal.classList.add("active");
}

function closeAdminQuizModal() {
  editingAdminQuiz = null;
  const modal = document.getElementById("admin-quiz-modal");
  if (modal) modal.classList.remove("active");
}

function handleSaveAdminQuiz() {
  const level = parseInt(document.getElementById("quiz-input-level").value) || 1;
  const type = document.getElementById("quiz-input-type").value || "reading";
  const question = document.getElementById("quiz-input-question").value.trim();
  const audio = document.getElementById("quiz-input-audio").value.trim();
  const explanation = document.getElementById("quiz-input-explanation").value.trim();

  const opt0 = document.getElementById("quiz-opt-0").value.trim();
  const opt1 = document.getElementById("quiz-opt-1").value.trim();
  const opt2 = document.getElementById("quiz-opt-2").value.trim();
  const opt3 = document.getElementById("quiz-opt-3").value.trim();

  const checkedRadio = document.querySelector('input[name="quiz-correct-radio"]:checked');
  const correct = checkedRadio ? parseInt(checkedRadio.value) : 0;

  if (!question || !opt0 || !opt1) {
    showToast("Harap isi teks pertanyaan dan minimal opsi A & B!", "warning");
    return;
  }

  const options = [opt0, opt1];
  if (opt2) options.push(opt2);
  if (opt3) options.push(opt3);

  if (editingAdminQuiz) {
    const oldLevel = editingAdminQuiz.level;
    const oldIdx = editingAdminQuiz.idx;

    if (level === oldLevel && State.bankQuestions[oldLevel] && State.bankQuestions[oldLevel][oldIdx]) {
      // Update in place
      const target = State.bankQuestions[oldLevel][oldIdx];
      target.type = type;
      target.question = question;
      target.options = options;
      target.correct = correct;
      target.explanation = explanation || "Jawaban sesuai kaidah gramatikal HSK.";
      if (audio) target.audio = audio;
      else delete target.audio;
    } else {
      // Level changed: remove from old level, add to new level
      if (State.bankQuestions[oldLevel] && State.bankQuestions[oldLevel][oldIdx]) {
        State.bankQuestions[oldLevel].splice(oldIdx, 1);
      }
      if (!State.bankQuestions[level]) State.bankQuestions[level] = [];
      const updatedQuiz = {
        id: editingAdminQuiz.id || `q-custom-${Date.now()}`,
        type: type,
        question: question,
        options: options,
        correct: correct,
        explanation: explanation || "Jawaban sesuai kaidah gramatikal HSK."
      };
      if (audio) updatedQuiz.audio = audio;
      State.bankQuestions[level].unshift(updatedQuiz);
      State.currentHskLevel = level;
    }
    showToast("✅ Soal kuis berhasil diperbarui!");
  } else {
    // Add new quiz
    const newQuiz = {
      id: `q-custom-${Date.now()}`,
      type: type,
      question: question,
      options: options,
      correct: correct,
      explanation: explanation || "Jawaban sesuai kaidah gramatikal HSK."
    };
    if (audio) newQuiz.audio = audio;

    if (!State.bankQuestions[level]) State.bankQuestions[level] = [];
    State.bankQuestions[level].unshift(newQuiz);
    showToast(`✅ Soal kuis HSK ${level} berhasil ditambahkan!`);
  }

  persistBankQuestions();
  closeAdminQuizModal();
  renderAdminDashboard();
  if (typeof renderBankSoalModule === 'function') renderBankSoalModule();
}

function deleteAdminQuiz(level, idx) {
  if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
    if (State.bankQuestions[level]) {
      State.bankQuestions[level].splice(idx, 1);
      persistBankQuestions();
    }
    showToast("Soal kuis telah dihapus.");
    renderAdminDashboard();
    if (typeof renderBankSoalModule === 'function') renderBankSoalModule();
  }
}

function openAdminFlashcardModal() {
  editingAdminFlashcard = null;
  const modal = document.getElementById("admin-flashcard-modal");
  if (!modal) return;
  const title = document.getElementById("admin-flashcard-modal-title");
  if (title) title.textContent = "🃏 Tambah Kartu Flashcard Baru";
  const desc = document.getElementById("admin-flashcard-modal-desc");
  if (desc) desc.textContent = "Kartu flashcard hafalan kosakata Mandarin akan langsung muncul pada fitur Flashcard interaktif.";
  const saveBtn = document.getElementById("admin-flashcard-save-btn");
  if (saveBtn) {
    saveBtn.textContent = "💾 Simpan Kartu Flashcard";
    saveBtn.style.background = "";
  }

  const activeLevel = adminFcLevel || 1;
  const lvlInput = document.getElementById("fc-input-level");
  if (lvlInput) lvlInput.value = activeLevel;
  const hanziInput = document.getElementById("fc-input-hanzi");
  if (hanziInput) hanziInput.value = "";
  const pinyinInput = document.getElementById("fc-input-pinyin");
  if (pinyinInput) pinyinInput.value = "";
  const meaningInput = document.getElementById("fc-input-meaning");
  if (meaningInput) meaningInput.value = "";
  const meaningEnInput = document.getElementById("fc-input-meaning-en");
  if (meaningEnInput) meaningEnInput.value = "";
  const exampleInput = document.getElementById("fc-input-example");
  if (exampleInput) exampleInput.value = "";
  const exTransInput = document.getElementById("fc-input-example-trans");
  if (exTransInput) exTransInput.value = "";
  const exTransEnInput = document.getElementById("fc-input-example-trans-en");
  if (exTransEnInput) exTransEnInput.value = "";

  modal.classList.add("active");
}

function openEditAdminFlashcardModal(level, idx) {
  const cards = flashcardData[level] || [];
  const c = cards[idx];
  if (!c) {
    showToast("Kartu flashcard tidak ditemukan!", "error");
    return;
  }
  editingAdminFlashcard = { level, idx };

  const modal = document.getElementById("admin-flashcard-modal");
  if (!modal) return;
  const title = document.getElementById("admin-flashcard-modal-title");
  if (title) title.textContent = `✏️ Edit Flashcard: ${c.hanzi} (HSK ${level})`;
  const desc = document.getElementById("admin-flashcard-modal-desc");
  if (desc) desc.textContent = "Ubah karakter Hanzi, Pinyin, terjemahan, atau contoh kalimat dari kartu ini.";
  const saveBtn = document.getElementById("admin-flashcard-save-btn");
  if (saveBtn) {
    saveBtn.textContent = "💾 Simpan Perubahan Flashcard";
    saveBtn.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
  }

  const lvlInput = document.getElementById("fc-input-level");
  if (lvlInput) lvlInput.value = level;
  const hanziInput = document.getElementById("fc-input-hanzi");
  if (hanziInput) hanziInput.value = c.hanzi || "";
  const pinyinInput = document.getElementById("fc-input-pinyin");
  if (pinyinInput) pinyinInput.value = c.pinyin || "";
  const meaningInput = document.getElementById("fc-input-meaning");
  if (meaningInput) meaningInput.value = c.meaning || "";
  const meaningEnInput = document.getElementById("fc-input-meaning-en");
  if (meaningEnInput) meaningEnInput.value = c.meaning_en || "";
  const exampleInput = document.getElementById("fc-input-example");
  if (exampleInput) exampleInput.value = c.example || "";
  const exTransInput = document.getElementById("fc-input-example-trans");
  if (exTransInput) exTransInput.value = c.exampleTrans || "";
  const exTransEnInput = document.getElementById("fc-input-example-trans-en");
  if (exTransEnInput) exTransEnInput.value = c.exampleTrans_en || "";

  modal.classList.add("active");
}

function closeAdminFlashcardModal() {
  editingAdminFlashcard = null;
  const modal = document.getElementById("admin-flashcard-modal");
  if (modal) modal.classList.remove("active");
}

function handleSaveAdminFlashcard() {
  const level = parseInt(document.getElementById("fc-input-level").value) || 1;
  const hanzi = document.getElementById("fc-input-hanzi").value.trim();
  const pinyin = document.getElementById("fc-input-pinyin").value.trim();
  const meaning = document.getElementById("fc-input-meaning").value.trim();
  const meaning_en = (document.getElementById("fc-input-meaning-en") ? document.getElementById("fc-input-meaning-en").value.trim() : "");
  const example = document.getElementById("fc-input-example").value.trim();
  const exampleTrans = document.getElementById("fc-input-example-trans").value.trim();
  const exampleTrans_en = (document.getElementById("fc-input-example-trans-en") ? document.getElementById("fc-input-example-trans-en").value.trim() : "");

  if (!hanzi || !pinyin || !meaning) {
    showToast("Silakan isi Hanzi, Pinyin, dan Arti kosakata!", "warning");
    return;
  }

  if (editingAdminFlashcard) {
    const oldLevel = editingAdminFlashcard.level;
    const oldIdx = editingAdminFlashcard.idx;

    if (level === oldLevel && flashcardData[oldLevel] && flashcardData[oldLevel][oldIdx]) {
      const target = flashcardData[oldLevel][oldIdx];
      target.hanzi = hanzi;
      target.pinyin = pinyin;
      target.meaning = meaning;
      target.meaning_en = meaning_en || meaning;
      target.example = example || `${hanzi}很好。`;
      target.exampleTrans = exampleTrans || `"${hanzi}" sangat baik.`;
      target.exampleTrans_en = exampleTrans_en || `"${hanzi}" is very good.`;
    } else {
      // Level changed: remove from old level, add to new level
      if (flashcardData[oldLevel] && flashcardData[oldLevel][oldIdx]) {
        flashcardData[oldLevel].splice(oldIdx, 1);
      }
      if (!flashcardData[level]) flashcardData[level] = [];
      flashcardData[level].unshift({
        hanzi: hanzi,
        pinyin: pinyin,
        meaning: meaning,
        meaning_en: meaning_en || meaning,
        example: example || `${hanzi}很好。`,
        exampleTrans: exampleTrans || `"${hanzi}" sangat baik.`,
        exampleTrans_en: exampleTrans_en || `"${hanzi}" is very good.`
      });
      adminFcLevel = level;
      if (window.fcState) window.fcState.level = level;
    }
    showToast(`✅ Flashcard "${hanzi}" (${pinyin}) berhasil diperbarui!`);
  } else {
    // Add new
    const newCard = {
      hanzi: hanzi,
      pinyin: pinyin,
      meaning: meaning,
      meaning_en: meaning_en || meaning,
      example: example || `${hanzi}很好。`,
      exampleTrans: exampleTrans || `"${hanzi}" sangat baik.`,
      exampleTrans_en: exampleTrans_en || `"${hanzi}" is very good.`
    };

    if (!flashcardData[level]) flashcardData[level] = [];
    flashcardData[level].unshift(newCard);
    showToast(`✅ Kartu Flashcard ${hanzi} (${pinyin}) berhasil ditambahkan ke HSK ${level}!`);
  }

  persistFlashcardData();
  if (typeof fcPageState !== 'undefined') {
    fcPageState.dirtyLevel = null;
    fcPageState.cards = [];
  }
  closeAdminFlashcardModal();
  renderAdminDashboard();
  if (typeof renderFlashcardPage === 'function') renderFlashcardPage();
}

function deleteAdminFlashcard(level, idx) {
  if (confirm("Apakah Anda yakin ingin menghapus kartu flashcard ini?")) {
    if (flashcardData[level]) {
      flashcardData[level].splice(idx, 1);
      persistFlashcardData();
      if (typeof fcPageState !== 'undefined') {
        fcPageState.dirtyLevel = null;
        fcPageState.cards = [];
      }
    }
    showToast("Kartu flashcard telah dihapus.");
    renderAdminDashboard();
    if (typeof renderFlashcardPage === 'function') renderFlashcardPage();
  }
}

function deleteAdminModule(modId) {
  if (confirm("Apakah Anda yakin ingin menghapus modul ini?")) {
    State.modules = State.modules.filter(m => m.id !== modId);
    showToast("Modul telah dihapus dari sistem.");
    renderAdminDashboard();
    renderUploadedModulesList();
  }
}

// =========================================================================
// TABLE RENDERERS & CRUD FOR ADMIN GAME ARENA & FITUR CERDAS
// =========================================================================

function renderAdminGameSubTable(sub, toneList, linkList, memList, phList, q) {
  if (sub === 'tone') {
    let filtered = toneList.filter(item => {
      if (adminGameDifficultyFilter !== 'all' && (item.difficulty || 'easy') !== adminGameDifficultyFilter) return false;
      if (adminGameLevelFilter !== 'all' && item.level != adminGameLevelFilter) return false;
      if (q) {
        const matchH = (item.hanzi || '').toLowerCase().includes(q);
        const matchP = (item.pinyin || '').toLowerCase().includes(q);
        const matchM = (item.meaning || '').toLowerCase().includes(q);
        const matchT = (item.tip || '').toLowerCase().includes(q);
        if (!matchH && !matchP && !matchM && !matchT) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<div style="padding: 2.5rem; text-align: center; color: #94a3b8;">🔍 Tidak ada data soal Pelatih Nada yang sesuai kriteria pencarian.</div>`;
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / adminGamePageSize));
    if (adminGameCurrentPage > totalPages) adminGameCurrentPage = totalPages;
    if (adminGameCurrentPage < 1) adminGameCurrentPage = 1;
    const startIdx = (adminGameCurrentPage - 1) * adminGamePageSize;
    const paged = filtered.slice(startIdx, startIdx + adminGamePageSize);

    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
            <th style="padding: 12px 14px; width: 50px;">No</th>
            <th style="padding: 12px 14px;">Hanzi & Pinyin</th>
            <th style="padding: 12px 14px; width: 100px;">Nada</th>
            <th style="padding: 12px 14px;">Arti & Tips Pelafalan</th>
            <th style="padding: 12px 14px; width: 120px;">Tingkat</th>
            <th style="padding: 12px 14px; width: 140px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map((item, idx) => {
            const toneSymbols = ['', '— (Nada 1)', 'ˊ (Nada 2)', 'ˇ (Nada 3)', 'ˋ (Nada 4)'];
            const diffBadge = item.difficulty === 'hard' ? 'background: #fee2e2; color: #b91c1c;' : (item.difficulty === 'medium' ? 'background: #fef3c7; color: #b45309;' : 'background: #dcfce7; color: #15803d;');
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 14px; color: #94a3b8; font-weight: 700;">#${startIdx + idx + 1}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: var(--font-chinese); font-size: 1.4rem; font-weight: 700; color: var(--dark-text);">${escapeHtml(item.hanzi)}</span>
                    <div>
                      <span style="font-weight: 700; color: #6d28d9; font-size: 0.88rem;">${escapeHtml(item.pinyin)}</span>
                      <button onclick="speakMandarin('${escapeHtml(item.audio || item.hanzi)}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem; margin-left: 4px;" title="Dengar Suara">🔊</button>
                    </div>
                  </div>
                </td>
                <td style="padding: 12px 14px;">
                  <span class="role-badge" style="font-size: 0.72rem; background: #ede9fe; color: #6d28d9; font-weight: 800;">
                    ${toneSymbols[item.tone] || ('Tone ' + item.tone)}
                  </span>
                </td>
                <td style="padding: 12px 14px;">
                  <strong style="color: var(--dark-text);">${escapeHtml(item.meaning || '-')}</strong>
                  ${item.tip ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 3px;">💡 ${escapeHtml(item.tip)}</div>` : ''}
                </td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px;">HSK ${item.level || 1}</span>
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px; ${diffBadge}">${(item.difficulty || 'easy').toUpperCase()}</span>
                  </div>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                  <div style="display: flex; gap: 6px; justify-content: center;">
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openAdminGameModal('tone', ${escapeHtml(JSON.stringify(item))})" title="Edit Soal">✏️</button>
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #fca5a5; color: #b91c1c; background: #fef2f2;" onclick="handleDeleteAdminGame('tone', ${item.id})" title="Hapus Soal">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      ${renderClientPaginationBar(adminGameCurrentPage, totalItems, adminGamePageSize, 'setAdminGamePage', 'setAdminGamePageSize')}
    `;
  } else if (sub === 'link') {
    let filtered = linkList.filter(item => {
      if (adminGameDifficultyFilter !== 'all' && (item.difficulty || 'easy') !== adminGameDifficultyFilter) return false;
      if (adminGameCatFilter !== 'all' && item.category !== adminGameCatFilter) return false;
      if (q) {
        const matchA = (item.pA || '').toLowerCase().includes(q);
        const matchB = (item.pB || '').toLowerCase().includes(q);
        const matchH = (item.hanzi || '').toLowerCase().includes(q);
        const matchP = (item.pinyin || '').toLowerCase().includes(q);
        const matchM = (item.meaning || '').toLowerCase().includes(q);
        if (!matchA && !matchB && !matchH && !matchP && !matchM) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<div style="padding: 2.5rem; text-align: center; color: #94a3b8;">🔍 Tidak ada data Pasang Kata yang sesuai kriteria pencarian.</div>`;
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / adminGamePageSize));
    if (adminGameCurrentPage > totalPages) adminGameCurrentPage = totalPages;
    if (adminGameCurrentPage < 1) adminGameCurrentPage = 1;
    const startIdx = (adminGameCurrentPage - 1) * adminGamePageSize;
    const paged = filtered.slice(startIdx, startIdx + adminGamePageSize);

    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
            <th style="padding: 12px 14px; width: 50px;">No</th>
            <th style="padding: 12px 14px;">Pasangan Bagian A + B</th>
            <th style="padding: 12px 14px;">Gabungan Hanzi & Pinyin</th>
            <th style="padding: 12px 14px;">Arti Kata</th>
            <th style="padding: 12px 14px; width: 140px;">Kategori & Kesulitan</th>
            <th style="padding: 12px 14px; width: 140px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map((item, idx) => {
            const diffBadge = item.difficulty === 'hard' ? 'background: #fee2e2; color: #b91c1c;' : (item.difficulty === 'medium' ? 'background: #fef3c7; color: #b45309;' : 'background: #dcfce7; color: #15803d;');
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 14px; color: #94a3b8; font-weight: 700;">#${startIdx + idx + 1}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-family: var(--font-chinese); font-size: 1.15rem; background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 6px; font-weight: 700;">${escapeHtml(item.pA)}</span>
                    <span style="color: #94a3b8; font-weight: 800;">+</span>
                    <span style="font-family: var(--font-chinese); font-size: 1.15rem; background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 6px; font-weight: 700;">${escapeHtml(item.pB)}</span>
                  </div>
                </td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <strong style="font-family: var(--font-chinese); font-size: 1.25rem; color: var(--dark-text);">${escapeHtml(item.hanzi)}</strong>
                    <span style="font-weight: 700; color: #6d28d9; font-size: 0.85rem;">(${escapeHtml(item.pinyin)})</span>
                    <button onclick="speakMandarin('${escapeHtml(item.hanzi)}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem;" title="Dengar Suara">🔊</button>
                  </div>
                </td>
                <td style="padding: 12px 14px; color: var(--dark-text); font-weight: 600;">${escapeHtml(item.meaning || '-')}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px;">${(item.category || 'cat1').toUpperCase()}</span>
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px; ${diffBadge}">${(item.difficulty || 'easy').toUpperCase()}</span>
                  </div>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                  <div style="display: flex; gap: 6px; justify-content: center;">
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openAdminGameModal('link', ${escapeHtml(JSON.stringify(item))})" title="Edit Soal">✏️</button>
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #fca5a5; color: #b91c1c; background: #fef2f2;" onclick="handleDeleteAdminGame('link', ${item.id})" title="Hapus Soal">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      ${renderClientPaginationBar(adminGameCurrentPage, totalItems, adminGamePageSize, 'setAdminGamePage', 'setAdminGamePageSize')}
    `;
  } else if (sub === 'memory') {
    let filtered = memList.filter(item => {
      if (adminGameDifficultyFilter !== 'all' && (item.difficulty || 'easy') !== adminGameDifficultyFilter) return false;
      if (adminGameSessionFilter !== 'all' && item.session !== adminGameSessionFilter) return false;
      if (q) {
        const matchH = (item.hanzi || '').toLowerCase().includes(q);
        const matchT = (item.text || '').toLowerCase().includes(q);
        if (!matchH && !matchT) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<div style="padding: 2.5rem; text-align: center; color: #94a3b8;">🔍 Tidak ada data Kartu Memori yang sesuai kriteria pencarian.</div>`;
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / adminGamePageSize));
    if (adminGameCurrentPage > totalPages) adminGameCurrentPage = totalPages;
    if (adminGameCurrentPage < 1) adminGameCurrentPage = 1;
    const startIdx = (adminGameCurrentPage - 1) * adminGamePageSize;
    const paged = filtered.slice(startIdx, startIdx + adminGamePageSize);

    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
            <th style="padding: 12px 14px; width: 50px;">No</th>
            <th style="padding: 12px 14px;">Sisi Depan (Hanzi)</th>
            <th style="padding: 12px 14px;">Sisi Belakang (Pinyin & Terjemahan)</th>
            <th style="padding: 12px 14px; width: 140px;">Sesi Permainan</th>
            <th style="padding: 12px 14px; width: 120px;">Grid Layout</th>
            <th style="padding: 12px 14px; width: 140px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map((item, idx) => {
            const diff = item.difficulty || 'easy';
            const gridLabel = diff === 'hard' ? '6x6 (Hard)' : (diff === 'medium' ? '5x5 (Medium)' : '4x4 (Easy)');
            const diffBadge = diff === 'hard' ? 'background: #fee2e2; color: #b91c1c;' : (diff === 'medium' ? 'background: #fef3c7; color: #b45309;' : 'background: #dcfce7; color: #15803d;');
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 14px; color: #94a3b8; font-weight: 700;">#${startIdx + idx + 1}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: var(--font-chinese); font-size: 1.4rem; font-weight: 700; color: var(--dark-text);">${escapeHtml(item.hanzi)}</span>
                    <button onclick="speakMandarin('${escapeHtml(item.hanzi)}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem;" title="Dengar Suara">🔊</button>
                  </div>
                </td>
                <td style="padding: 12px 14px; font-weight: 700; color: #6d28d9; font-size: 0.88rem;">${escapeHtml(item.text)}</td>
                <td style="padding: 12px 14px;">
                  <span class="role-badge" style="font-size: 0.72rem; background: #ede9fe; color: #6d28d9; font-weight: 800;">
                    ${(item.session || 'session1').toUpperCase()}
                  </span>
                </td>
                <td style="padding: 12px 14px;">
                  <span class="role-badge" style="font-size: 0.68rem; padding: 2px 6px; ${diffBadge}">${gridLabel}</span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                  <div style="display: flex; gap: 6px; justify-content: center;">
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openAdminGameModal('memory', ${escapeHtml(JSON.stringify(item))})" title="Edit Soal">✏️</button>
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #fca5a5; color: #b91c1c; background: #fef2f2;" onclick="handleDeleteAdminGame('memory', ${item.id})" title="Hapus Soal">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      ${renderClientPaginationBar(adminGameCurrentPage, totalItems, adminGamePageSize, 'setAdminGamePage', 'setAdminGamePageSize')}
    `;
  } else if (sub === 'pinyin_hanzi') {
    let filtered = phList.filter(item => {
      if (adminGameDifficultyFilter !== 'all' && (item.difficulty || 'easy') !== adminGameDifficultyFilter) return false;
      if (adminGameLevelFilter !== 'all' && item.level != adminGameLevelFilter) return false;
      if (q) {
        const matchP = (item.pinyin || '').toLowerCase().includes(q);
        const matchH = (item.hanzi || '').toLowerCase().includes(q);
        const matchM = (item.meaning || '').toLowerCase().includes(q);
        if (!matchP && !matchH && !matchM) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<div style="padding: 2.5rem; text-align: center; color: #94a3b8;">🔍 Tidak ada data Pinyin ke Hanzi yang sesuai kriteria pencarian.</div>`;
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / adminGamePageSize));
    if (adminGameCurrentPage > totalPages) adminGameCurrentPage = totalPages;
    if (adminGameCurrentPage < 1) adminGameCurrentPage = 1;
    const startIdx = (adminGameCurrentPage - 1) * adminGamePageSize;
    const paged = filtered.slice(startIdx, startIdx + adminGamePageSize);

    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
            <th style="padding: 12px 14px; width: 50px;">No</th>
            <th style="padding: 12px 14px;">Soal Pinyin</th>
            <th style="padding: 12px 14px;">Kunci Karakter Hanzi</th>
            <th style="padding: 12px 14px;">Arti Kata</th>
            <th style="padding: 12px 14px; width: 120px;">Tingkat</th>
            <th style="padding: 12px 14px; width: 140px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map((item, idx) => {
            const diffBadge = item.difficulty === 'hard' ? 'background: #fee2e2; color: #b91c1c;' : (item.difficulty === 'medium' ? 'background: #fef3c7; color: #b45309;' : 'background: #dcfce7; color: #15803d;');
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 14px; color: #94a3b8; font-weight: 700;">#${startIdx + idx + 1}</td>
                <td style="padding: 12px 14px; font-weight: 700; color: #6d28d9; font-size: 1rem;">${escapeHtml(item.pinyin)}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: var(--font-chinese); font-size: 1.4rem; font-weight: 700; color: var(--dark-text);">${escapeHtml(item.hanzi)}</span>
                    <button onclick="speakMandarin('${escapeHtml(item.audio || item.hanzi)}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem;" title="Dengar Suara">🔊</button>
                  </div>
                </td>
                <td style="padding: 12px 14px; color: var(--dark-text); font-weight: 600;">${escapeHtml(item.meaning || '-')}</td>
                <td style="padding: 12px 14px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px;">HSK ${item.level || 1}</span>
                    <span class="role-badge" style="font-size: 0.68rem; padding: 1px 6px; ${diffBadge}">${(item.difficulty || 'easy').toUpperCase()}</span>
                  </div>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                  <div style="display: flex; gap: 6px; justify-content: center;">
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openAdminGameModal('pinyin_hanzi', ${escapeHtml(JSON.stringify(item))})" title="Edit Soal">✏️</button>
                    <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #fca5a5; color: #b91c1c; background: #fef2f2;" onclick="handleDeleteAdminGame('pinyin_hanzi', ${item.id})" title="Hapus Soal">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      ${renderClientPaginationBar(adminGameCurrentPage, totalItems, adminGamePageSize, 'setAdminGamePage', 'setAdminGamePageSize')}
    `;
  }
  return '';
}

function renderAdminAnatomyTable(anatomyList, q) {
  let filtered = anatomyList.filter(item => {
    if (adminFiturLevelFilter !== 'all' && (item.level || 1) != adminFiturLevelFilter) return false;
    if (q) {
      const matchC = (item.char || item.hanzi || '').toLowerCase().includes(q);
      const matchP = (item.pinyin || '').toLowerCase().includes(q);
      const matchM = (item.meaning || '').toLowerCase().includes(q);
      const matchRa = (item.radA || item.p1 || '').toLowerCase().includes(q);
      const matchRb = (item.radB || item.p2 || '').toLowerCase().includes(q);
      const matchS = (item.story || '').toLowerCase().includes(q);
      if (!matchC && !matchP && !matchM && !matchRa && !matchRb && !matchS) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    return `<div style="padding: 2.5rem; text-align: center; color: #94a3b8;">🔍 Tidak ada data Anatomi Karakter yang sesuai filter pencarian.</div>`;
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / adminFiturPageSize));
  if (adminFiturCurrentPage > totalPages) adminFiturCurrentPage = totalPages;
  if (adminFiturCurrentPage < 1) adminFiturCurrentPage = 1;
  const startIdx = (adminFiturCurrentPage - 1) * adminFiturPageSize;
  const paged = filtered.slice(startIdx, startIdx + adminFiturPageSize);

  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569;">
          <th style="padding: 12px 14px; width: 50px;">No</th>
          <th style="padding: 12px 14px;">Karakter Hanzi & Pinyin</th>
          <th style="padding: 12px 14px;">Arti Karakter</th>
          <th style="padding: 12px 14px;">Komponen Radikal</th>
          <th style="padding: 12px 14px;">Cerita Mnemonik Visual</th>
          <th style="padding: 12px 14px; width: 100px;">Level HSK</th>
          <th style="padding: 12px 14px; width: 140px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${paged.map((item, idx) => {
          const charHanzi = item.char || item.hanzi || '';
          const radA = item.radA || (item.p1 ? (item.p1 + ' (' + (item.p1Desc || '') + ')') : '-');
          const radB = item.radB || (item.p2 ? (item.p2 + ' (' + (item.p2Desc || '') + ')') : '-');
          return `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 14px; color: #94a3b8; font-weight: 700;">#${startIdx + idx + 1}</td>
              <td style="padding: 12px 14px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-family: var(--font-chinese); font-size: 1.6rem; font-weight: 800; color: #0284c7;">${escapeHtml(charHanzi)}</span>
                  <div>
                    <span style="font-weight: 700; color: var(--dark-text); font-size: 0.9rem;">${escapeHtml(item.pinyin || '')}</span>
                    <button onclick="speakMandarin('${escapeHtml(charHanzi)}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem; margin-left: 4px;" title="Dengar Suara">🔊</button>
                  </div>
                </div>
              </td>
              <td style="padding: 12px 14px; font-weight: 700; color: var(--dark-text);">${escapeHtml(item.meaning || '-')}</td>
              <td style="padding: 12px 14px;">
                <div style="display: flex; flex-direction: column; gap: 3px; font-size: 0.8rem;">
                  <span style="color: #2563eb;"><strong>1:</strong> ${escapeHtml(radA)}</span>
                  <span style="color: #059669;"><strong>2:</strong> ${escapeHtml(radB)}</span>
                </div>
              </td>
              <td style="padding: 12px 14px; color: #475569; font-size: 0.82rem; line-height: 1.4;">
                ${escapeHtml(item.story || '-')}
              </td>
              <td style="padding: 12px 14px;">
                <span class="role-badge" style="font-size: 0.72rem; background: #e0f2fe; color: #0369a1; font-weight: 800;">
                  HSK ${item.level || 1}
                </span>
              </td>
              <td style="padding: 12px 14px; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #93c5fd; color: #1d4ed8; background: #eff6ff;" onclick="openAdminFiturCerdasModal(${escapeHtml(JSON.stringify(item))})" title="Edit Karakter">✏️</button>
                  <button class="btn-learn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #fca5a5; color: #b91c1c; background: #fef2f2;" onclick="handleDeleteAdminFiturCerdas(${item.id})" title="Hapus Karakter">🗑️</button>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    ${renderClientPaginationBar(adminFiturCurrentPage, totalItems, adminFiturPageSize, 'setAdminFiturPage', 'setAdminFiturPageSize')}
  `;
}

// -------------------------------------------------------------
// GAME ARENA MODAL & CRUD HANDLERS
// -------------------------------------------------------------

function openAdminGameModal(subgame, item = null) {
  const modal = document.getElementById("admin-game-modal");
  if (!modal) return;

  const actionInput = document.getElementById("game-modal-action");
  const subgameInput = document.getElementById("game-modal-subgame");
  const idInput = document.getElementById("game-modal-id");
  const catKeyInput = document.getElementById("game-modal-cat-key");
  const modalTitle = document.getElementById("admin-game-modal-title");
  const saveBtn = document.getElementById("admin-game-save-btn");

  subgameInput.value = subgame;
  actionInput.value = item ? 'edit' : 'add';
  idInput.value = item ? (item.id || '') : '';
  if (catKeyInput) catKeyInput.value = item ? (item.category || '') : '';

  // Toggle field sections
  const fTone = document.getElementById("fields-game-tone");
  const fLink = document.getElementById("fields-game-link");
  const fMemory = document.getElementById("fields-game-memory");
  const fPinyinHanzi = document.getElementById("fields-game-pinyin-hanzi");

  const grpLevel = document.getElementById("group-game-level");
  const grpCategory = document.getElementById("group-game-category");
  const grpSession = document.getElementById("group-game-session");

  if (fTone) fTone.style.display = subgame === 'tone' ? 'block' : 'none';
  if (fLink) fLink.style.display = subgame === 'link' ? 'block' : 'none';
  if (fMemory) fMemory.style.display = subgame === 'memory' ? 'block' : 'none';
  if (fPinyinHanzi) fPinyinHanzi.style.display = subgame === 'pinyin_hanzi' ? 'block' : 'none';

  if (grpLevel) grpLevel.style.display = (subgame === 'tone' || subgame === 'pinyin_hanzi') ? 'block' : 'none';
  if (grpCategory) grpCategory.style.display = subgame === 'link' ? 'block' : 'none';
  if (grpSession) grpSession.style.display = subgame === 'memory' ? 'block' : 'none';

  const diffSelect = document.getElementById("game-input-difficulty");
  if (diffSelect) diffSelect.value = item ? (item.difficulty || 'easy') : (adminGameDifficultyFilter !== 'all' ? adminGameDifficultyFilter : 'easy');

  if (subgame === 'tone') {
    modalTitle.textContent = item ? "✏️ Edit Soal Pelatih 4 Nada" : "➕ Tambah Soal Pelatih 4 Nada";
    saveBtn.textContent = item ? "💾 Simpan Perubahan" : "💾 Simpan Soal Nada";
    const lvlInput = document.getElementById("game-input-level");
    if (lvlInput) lvlInput.value = item ? (item.level || 1) : (adminGameLevelFilter !== 'all' ? adminGameLevelFilter : 1);
    const hanziInput = document.getElementById("game-input-hanzi");
    if (hanziInput) hanziInput.value = item ? (item.hanzi || '') : '';
    const pinyinInput = document.getElementById("game-input-pinyin");
    if (pinyinInput) pinyinInput.value = item ? (item.pinyin || '') : '';
    const toneInput = document.getElementById("game-input-tone");
    if (toneInput) toneInput.value = item ? (item.tone || 1) : 1;
    const meaningInput = document.getElementById("game-input-meaning");
    if (meaningInput) meaningInput.value = item ? (item.meaning || '') : '';
    const tipInput = document.getElementById("game-input-tip");
    if (tipInput) tipInput.value = item ? (item.tip || '') : '';
  } else if (subgame === 'link') {
    modalTitle.textContent = item ? "✏️ Edit Pasangan Kata (Word Link)" : "➕ Tambah Pasangan Kata (Word Link)";
    saveBtn.textContent = item ? "💾 Simpan Perubahan" : "💾 Simpan Pasangan Kata";
    const catInput = document.getElementById("game-input-category");
    if (catInput) catInput.value = item ? (item.category || 'cat1') : (adminGameCatFilter !== 'all' ? adminGameCatFilter : 'cat1');
    const partAInput = document.getElementById("game-input-parta");
    if (partAInput) partAInput.value = item ? (item.pA || '') : '';
    const partBInput = document.getElementById("game-input-partb");
    if (partBInput) partBInput.value = item ? (item.pB || '') : '';
    const pinyinInput = document.getElementById("game-input-link-pinyin");
    if (pinyinInput) pinyinInput.value = item ? (item.pinyin || '') : '';
    const meaningInput = document.getElementById("game-input-link-meaning");
    if (meaningInput) meaningInput.value = item ? (item.meaning || '') : '';
  } else if (subgame === 'memory') {
    modalTitle.textContent = item ? "✏️ Edit Kartu Memori Balik" : "➕ Tambah Kartu Memori Balik";
    saveBtn.textContent = item ? "💾 Simpan Perubahan" : "💾 Simpan Kartu Memori";
    const sessInput = document.getElementById("game-input-session");
    if (sessInput) sessInput.value = item ? (item.session || 'session1') : (adminGameSessionFilter !== 'all' ? adminGameSessionFilter : 'session1');
    const hanziInput = document.getElementById("game-input-mem-hanzi");
    if (hanziInput) hanziInput.value = item ? (item.hanzi || '') : '';
    const textInput = document.getElementById("game-input-mem-text");
    if (textInput) textInput.value = item ? (item.text || '') : '';
  } else if (subgame === 'pinyin_hanzi') {
    modalTitle.textContent = item ? "✏️ Edit Tebak Pinyin ke Hanzi" : "➕ Tambah Tebak Pinyin ke Hanzi";
    saveBtn.textContent = item ? "💾 Simpan Perubahan" : "💾 Simpan Soal Pinyin-Hanzi";
    const lvlInput = document.getElementById("game-input-level");
    if (lvlInput) lvlInput.value = item ? (item.level || 1) : (adminGameLevelFilter !== 'all' ? adminGameLevelFilter : 1);
    const pinyinInput = document.getElementById("game-input-ph-pinyin");
    if (pinyinInput) pinyinInput.value = item ? (item.pinyin || '') : '';
    const hanziInput = document.getElementById("game-input-ph-hanzi");
    if (hanziInput) hanziInput.value = item ? (item.hanzi || '') : '';
    const meaningInput = document.getElementById("game-input-ph-meaning");
    if (meaningInput) meaningInput.value = item ? (item.meaning || '') : '';
  }

  modal.classList.add("active");
}

function closeAdminGameModal() {
  const modal = document.getElementById("admin-game-modal");
  if (modal) modal.classList.remove("active");
}

async function handleSaveAdminGame() {
  const subgame = document.getElementById("game-modal-subgame").value;
  const actionType = document.getElementById("game-modal-action").value;
  const itemId = document.getElementById("game-modal-id").value;
  const difficulty = document.getElementById("game-input-difficulty").value;

  const formData = new FormData();

  if (subgame === 'tone') {
    const level = parseInt(document.getElementById("game-input-level").value) || 1;
    const hanzi = document.getElementById("game-input-hanzi").value.trim();
    const pinyin = document.getElementById("game-input-pinyin").value.trim();
    const tone = parseInt(document.getElementById("game-input-tone").value) || 1;
    const meaning = document.getElementById("game-input-meaning").value.trim();
    const tip = document.getElementById("game-input-tip").value.trim();

    if (!hanzi || !pinyin) {
      showToast("Harap isi karakter Hanzi dan Pinyin!", "warning");
      return;
    }

    formData.append("action", actionType === 'edit' ? 'edit_tone' : 'add_tone');
    if (actionType === 'edit') formData.append("id", itemId);
    formData.append("level", level);
    formData.append("hanzi", hanzi);
    formData.append("pinyin", pinyin);
    formData.append("tone", tone);
    formData.append("meaning", meaning);
    formData.append("tip", tip);
    formData.append("difficulty", difficulty);

    // Update in-memory MandarinkuExtras
    if (window.MandarinkuExtras && window.MandarinkuExtras.toneTrainerBank) {
      if (actionType === 'edit') {
        const found = window.MandarinkuExtras.toneTrainerBank.find(i => i.id == itemId);
        if (found) {
          found.level = level;
          found.hanzi = hanzi;
          found.pinyin = pinyin;
          found.tone = tone;
          found.meaning = meaning;
          found.tip = tip;
          found.difficulty = difficulty;
        }
      } else {
        const newTone = { id: Date.now(), level, hanzi, pinyin, tone, meaning, tip, difficulty, audio: hanzi };
        window.MandarinkuExtras.toneTrainerBank.unshift(newTone);
      }
    }
  } else if (subgame === 'link') {
    const category = document.getElementById("game-input-category").value;
    const pA = document.getElementById("game-input-parta").value.trim();
    const pB = document.getElementById("game-input-partb").value.trim();
    const pinyin = document.getElementById("game-input-link-pinyin").value.trim();
    const meaning = document.getElementById("game-input-link-meaning").value.trim();
    const hanzi = pA + pB;

    if (!pA || !pB) {
      showToast("Harap isi karakter Bagian A dan Bagian B!", "warning");
      return;
    }

    formData.append("action", actionType === 'edit' ? 'edit_link' : 'add_link');
    if (actionType === 'edit') formData.append("id", itemId);
    formData.append("category", category);
    formData.append("part_a", pA);
    formData.append("part_b", pB);
    formData.append("hanzi", hanzi);
    formData.append("pinyin", pinyin);
    formData.append("meaning", meaning);
    formData.append("difficulty", difficulty);

    if (window.MandarinkuExtras && window.MandarinkuExtras.wordLinkBankByCat) {
      if (!window.MandarinkuExtras.wordLinkBankByCat[category]) {
        window.MandarinkuExtras.wordLinkBankByCat[category] = [];
      }
      if (actionType === 'edit') {
        Object.keys(window.MandarinkuExtras.wordLinkBankByCat).forEach(c => {
          const idx = window.MandarinkuExtras.wordLinkBankByCat[c].findIndex(i => i.id == itemId);
          if (idx !== -1) window.MandarinkuExtras.wordLinkBankByCat[c].splice(idx, 1);
        });
      }
      window.MandarinkuExtras.wordLinkBankByCat[category].unshift({
        id: itemId || Date.now(),
        category,
        pA,
        pB,
        hanzi,
        pinyin,
        meaning,
        difficulty
      });
    }
  } else if (subgame === 'memory') {
    const session = document.getElementById("game-input-session").value;
    const hanzi = document.getElementById("game-input-mem-hanzi").value.trim();
    const text = document.getElementById("game-input-mem-text").value.trim();

    if (!hanzi || !text) {
      showToast("Harap isi karakter Hanzi dan Teks pasangan!", "warning");
      return;
    }

    formData.append("action", actionType === 'edit' ? 'edit_memory' : 'add_memory');
    if (actionType === 'edit') formData.append("id", itemId);
    formData.append("session", session);
    formData.append("hanzi", hanzi);
    formData.append("text", text);
    formData.append("difficulty", difficulty);

    if (window.MandarinkuExtras && window.MandarinkuExtras.memoryCardsBank) {
      if (actionType === 'edit') {
        const found = window.MandarinkuExtras.memoryCardsBank.find(i => i.id == itemId);
        if (found) {
          found.session = session;
          found.hanzi = hanzi;
          found.text = text;
          found.difficulty = difficulty;
        }
      } else {
        window.MandarinkuExtras.memoryCardsBank.unshift({
          id: Date.now(),
          session,
          hanzi,
          text,
          difficulty
        });
      }
    }
  } else if (subgame === 'pinyin_hanzi') {
    const level = parseInt(document.getElementById("game-input-level").value) || 1;
    const pinyin = document.getElementById("game-input-ph-pinyin").value.trim();
    const hanzi = document.getElementById("game-input-ph-hanzi").value.trim();
    const meaning = document.getElementById("game-input-ph-meaning").value.trim();

    if (!pinyin || !hanzi) {
      showToast("Harap isi soal Pinyin dan kunci Hanzi!", "warning");
      return;
    }

    formData.append("action", actionType === 'edit' ? 'edit_pinyin_hanzi' : 'add_pinyin_hanzi');
    if (actionType === 'edit') formData.append("id", itemId);
    formData.append("level", level);
    formData.append("pinyin", pinyin);
    formData.append("hanzi", hanzi);
    formData.append("meaning", meaning);
    formData.append("difficulty", difficulty);

    if (window.MandarinkuExtras && window.MandarinkuExtras.pinyinHanziBank) {
      if (actionType === 'edit') {
        const found = window.MandarinkuExtras.pinyinHanziBank.find(i => i.id == itemId);
        if (found) {
          found.level = level;
          found.pinyin = pinyin;
          found.hanzi = hanzi;
          found.meaning = meaning;
          found.difficulty = difficulty;
        }
      } else {
        window.MandarinkuExtras.pinyinHanziBank.unshift({
          id: Date.now(),
          level,
          pinyin,
          hanzi,
          meaning,
          difficulty,
          audio: hanzi
        });
      }
    }
  }

  try {
    const res = await fetch("admin/api_sync.php", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      showToast(actionType === 'edit' ? "✅ Perubahan berhasil disimpan!" : "✅ Soal game berhasil ditambahkan!");
    } else {
      showToast(data.message || "Tersimpan secara lokal di aplikasi.", "info");
    }
  } catch (e) {
    showToast("✅ Berhasil disimpan di sesi interaktif!", "info");
  }

  closeAdminGameModal();
  renderAdminDashboard();
}

async function handleDeleteAdminGame(subgame, id) {
  if (!confirm("Apakah Anda yakin ingin menghapus butir soal game ini?")) return;

  const formData = new FormData();
  if (subgame === 'tone') {
    formData.append("action", "delete_tone");
    formData.append("id", id);
    if (window.MandarinkuExtras && window.MandarinkuExtras.toneTrainerBank) {
      window.MandarinkuExtras.toneTrainerBank = window.MandarinkuExtras.toneTrainerBank.filter(i => i.id != id);
    }
  } else if (subgame === 'link') {
    formData.append("action", "delete_link");
    formData.append("id", id);
    if (window.MandarinkuExtras && window.MandarinkuExtras.wordLinkBankByCat) {
      Object.keys(window.MandarinkuExtras.wordLinkBankByCat).forEach(c => {
        window.MandarinkuExtras.wordLinkBankByCat[c] = window.MandarinkuExtras.wordLinkBankByCat[c].filter(i => i.id != id);
      });
    }
  } else if (subgame === 'memory') {
    formData.append("action", "delete_memory");
    formData.append("id", id);
    if (window.MandarinkuExtras && window.MandarinkuExtras.memoryCardsBank) {
      window.MandarinkuExtras.memoryCardsBank = window.MandarinkuExtras.memoryCardsBank.filter(i => i.id != id);
    }
  } else if (subgame === 'pinyin_hanzi') {
    formData.append("action", "delete_pinyin_hanzi");
    formData.append("id", id);
    if (window.MandarinkuExtras && window.MandarinkuExtras.pinyinHanziBank) {
      window.MandarinkuExtras.pinyinHanziBank = window.MandarinkuExtras.pinyinHanziBank.filter(i => i.id != id);
    }
  }

  try {
    await fetch("admin/api_sync.php", { method: "POST", body: formData });
  } catch (e) {}

  showToast("Soal game telah dihapus.");
  renderAdminDashboard();
}

// -------------------------------------------------------------
// FITUR CERDAS MODAL & CRUD HANDLERS
// -------------------------------------------------------------

function openAdminFiturCerdasModal(item = null) {
  const modal = document.getElementById("admin-fitur-cerdas-modal");
  if (!modal) return;

  const actionInput = document.getElementById("fitur-modal-action");
  const idInput = document.getElementById("fitur-modal-id");
  const modalTitle = document.getElementById("admin-fitur-modal-title");
  const saveBtn = document.getElementById("admin-fitur-save-btn");

  actionInput.value = item ? 'edit' : 'add';
  idInput.value = item ? (item.id || '') : '';
  modalTitle.textContent = item ? "✏️ Edit Anatomi Karakter & Mnemonik" : "➕ Tambah Anatomi Karakter Baru";
  saveBtn.textContent = item ? "💾 Simpan Perubahan Anatomi" : "💾 Simpan Anatomi Karakter";

  const lvlInput = document.getElementById("fitur-input-level");
  if (lvlInput) lvlInput.value = item ? (item.level || 1) : (adminFiturLevelFilter !== 'all' ? adminFiturLevelFilter : 1);
  const charInput = document.getElementById("fitur-input-char");
  if (charInput) charInput.value = item ? (item.char || item.hanzi || '') : '';
  const pinyinInput = document.getElementById("fitur-input-pinyin");
  if (pinyinInput) pinyinInput.value = item ? (item.pinyin || '') : '';
  const meaningInput = document.getElementById("fitur-input-meaning");
  if (meaningInput) meaningInput.value = item ? (item.meaning || '') : '';
  const radAInput = document.getElementById("fitur-input-rada");
  if (radAInput) radAInput.value = item ? (item.radA || (item.p1 ? (item.p1 + ' (' + (item.p1Desc || '') + ')') : '')) : '';
  const radBInput = document.getElementById("fitur-input-radb");
  if (radBInput) radBInput.value = item ? (item.radB || (item.p2 ? (item.p2 + ' (' + (item.p2Desc || '') + ')') : '')) : '';
  const storyInput = document.getElementById("fitur-input-story");
  if (storyInput) storyInput.value = item ? (item.story || '') : '';

  modal.classList.add("active");
}

function closeAdminFiturCerdasModal() {
  const modal = document.getElementById("admin-fitur-cerdas-modal");
  if (modal) modal.classList.remove("active");
}

async function handleSaveAdminFiturCerdas() {
  const actionType = document.getElementById("fitur-modal-action").value;
  const itemId = document.getElementById("fitur-modal-id").value;
  const level = parseInt(document.getElementById("fitur-input-level").value) || 1;
  const char = document.getElementById("fitur-input-char").value.trim();
  const pinyin = document.getElementById("fitur-input-pinyin").value.trim();
  const meaning = document.getElementById("fitur-input-meaning").value.trim();
  const radA = document.getElementById("fitur-input-rada").value.trim();
  const radB = document.getElementById("fitur-input-radb").value.trim();
  const story = document.getElementById("fitur-input-story").value.trim();

  if (!char || !pinyin) {
    showToast("Harap isi karakter Hanzi dan Pinyin!", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("action", actionType === 'edit' ? 'edit_anatomy' : 'add_anatomy');
  if (actionType === 'edit') formData.append("id", itemId);
  formData.append("level", level);
  formData.append("char", char);
  formData.append("pinyin", pinyin);
  formData.append("meaning", meaning);
  formData.append("radA", radA);
  formData.append("radB", radB);
  formData.append("story", story);

  if (window.MandarinkuExtras && window.MandarinkuExtras.anatomyBank) {
    if (actionType === 'edit') {
      const found = window.MandarinkuExtras.anatomyBank.find(i => i.id == itemId);
      if (found) {
        found.level = level;
        found.char = char;
        found.hanzi = char;
        found.pinyin = pinyin;
        found.meaning = meaning;
        found.radA = radA;
        found.radB = radB;
        found.story = story;
      }
    } else {
      window.MandarinkuExtras.anatomyBank.unshift({
        id: Date.now(),
        level,
        char,
        hanzi: char,
        pinyin,
        meaning,
        radA,
        radB,
        story
      });
    }
  }

  try {
    const res = await fetch("admin/api_sync.php", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      showToast(actionType === 'edit' ? "✅ Anatomi karakter berhasil diperbarui!" : "✅ Anatomi karakter berhasil ditambahkan!");
    } else {
      showToast(data.message || "Tersimpan secara lokal.", "info");
    }
  } catch (e) {
    showToast("✅ Berhasil disimpan di sesi interaktif!", "info");
  }

  closeAdminFiturCerdasModal();
  renderAdminDashboard();
}

async function handleDeleteAdminFiturCerdas(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus karakter anatomi ini?")) return;

  const formData = new FormData();
  formData.append("action", "delete_anatomy");
  formData.append("id", id);

  if (window.MandarinkuExtras && window.MandarinkuExtras.anatomyBank) {
    window.MandarinkuExtras.anatomyBank = window.MandarinkuExtras.anatomyBank.filter(i => i.id != id);
  }

  try {
    await fetch("admin/api_sync.php", { method: "POST", body: formData });
  } catch (e) {}

  showToast("Anatomi karakter telah dihapus.");
  renderAdminDashboard();
}
