/**
 * Mandarinku HSK 1 - 6 Built-in Comprehensive Modules Data
 * Each module contains:
 * - Theory / Overview (Penjelasan Teori Lengkap & Standar Kompetensi)
 * - Grammar Analysis (Materi Analisis Tata Bahasa Ber-rumus & Contoh Kalimat)
 * - Essential Vocabularies (Kosakata Inti Lengkap dengan Hanzi, Pinyin, Arti & Audio)
 * - Example Questions & Explanations (Contoh Soal Pembahasan 4 Keterampilan)
 * - 50 Comprehensive Practice Questions (Listening, Speaking, Reading, Writing)
 */
window.MandarinkuModulesData = {
  "mod-hsk-1": {
    id: "mod-hsk-1",
    level: "HSK 1",
    levelNumber: 1,
    title: "HSK 1: Fondasi Mandarin Dasar, Pinyin & Percakapan Sapaan",
    author: "Laoshi Chen (Mandarinku Senior Master)",
    date: "2024-06-01",
    fileSize: "8.4 MB",
    downloads: 328,
    category: "komprehensif",
    badgeBg: "#ecfdf5",
    badgeColor: "#059669",
    borderColor: "#a7f3d0",
    description: "Modul resmi HSK 1 mencakup kaidah 4 nada pinyin, inisial & final, hukum perubahan nada (sandhi nada), analisis tata bahasa dasar (是, 的, 在, 吗, 几/多少), 150 kosakata esensial, serta paket latihan 50 soal interaktif 4 keterampilan.",
    overview: "Level HSK 1 dirancang untuk pembelajar pemula yang memulai bahasa Mandarin dari nol (A1). Fokus utama level ini adalah penguasaan sistem fonetik Pinyin standar, pelafalan 4 nada akurat, struktur kalimat S-P-O paling mendasar, ungkapan salam/perkenalan, angka, waktu, serta pengenalan 150 kata dasar untuk komunikasi sehari-hari.",
    grammarPoints: [
      {
        title: "1. Kata Kerja Penghubung Identitas '是' (shì = Adalah / To Be)",
        formula: "Subjek + 是 + Objek (Bentuk Negatif: Subjek + 不是 + Objek)",
        explanation: "Digunakan untuk menyatakan identitas, profesi, kewarganegaraan, atau relasi status. Dalam bahasa Mandarin tidak ada konjugasi kata kerja berdasarkan subjek atau waktu (tenses).",
        examples: [
          { hanzi: "我是中国人，他不是老师。", pinyin: "Wǒ shì Zhōngguó rén, tā bú shì lǎoshī.", meaning: "Saya adalah orang Tiongkok, dia bukan guru." },
          { hanzi: "这本字典是我的。", pinyin: "Zhè běn zìdiǎn shì wǒ de.", meaning: "Kamus ini adalah milik saya." },
          { hanzi: "王先生是医生吗？", pinyin: "Wáng xiānsheng shì yīshēng ma?", meaning: "Apakah Tuan Wang adalah dokter?" }
        ]
      },
      {
        title: "2. Partikel Kepemilikan & Penjelas '的' (de)",
        formula: "Pemilik / Atribut Penjelas + 的 + Kata Benda Inti",
        explanation: "Partikel '的' berfungsi menandai hubungan kepemilikan (posesif) atau menerangkan sifat/karakteristik benda yang mengikutinya. Jika hubungan kekeluargaan sangat dekat, '的' dapat dihilangkan secara opsional (misal: 我妈妈).",
        examples: [
          { hanzi: "这是我汉语老师的书。", pinyin: "Zhè shì wǒ Hànyǔ lǎoshī de shū.", meaning: "Ini adalah buku guru bahasa Mandarin saya." },
          { hanzi: "她有一只非常漂亮的小猫。", pinyin: "Tā yǒu yì zhī fēicháng piàoliang de xiǎomāo.", meaning: "Dia mempunyai seekor anak kucing yang sangat cantik." },
          { hanzi: "我们学校的图书馆很大。", pinyin: "Wǒmen xuéxiào de túshūguǎn hěn dà.", meaning: "Perpustakaan sekolah kami sangat besar." }
        ]
      },
      {
        title: "3. Predikat Kata Sifat dengan Penguat '很' (hěn)",
        formula: "Subjek + 很 / 非常 / 不 + Kata Sifat (Adjektiva)",
        explanation: "Dalam bahasa Mandarin, kata sifat berfungsi langsung sebagai predikat tanpa perlu kata kerja '是'. Penambahan kata '很' secara struktural menyeimbangkan irama kalimat meskipun maknanya sering kali netral (tidak selalu berarti 'sangat').",
        examples: [
          { hanzi: "今天天气很好，不太冷。", pinyin: "Jīntiān tiānqì hěn hǎo, bú tài lěng.", meaning: "Cuaca hari ini sangat bagus, tidak terlalu dingin." },
          { hanzi: "爸爸的工作非常忙。", pinyin: "Bàba de gōngzuò fēicháng máng.", meaning: "Pekerjaan ayah sangat sibuk." },
          { hanzi: "这家饭馆的菜真好吃！", pinyin: "Zhè jiā fànguǎn de cài zhēn hǎochī!", meaning: "Makanan di restoran ini sungguh enak!" }
        ]
      },
      {
        title: "4. Struktur Kalimat Tanya dengan '吗' & Kata Tanya Khusus",
        formula: "Kalimat Pernyataan + 吗？ / Subjek + [什么/哪儿/谁/几] + Objek？",
        explanation: "Pertanyaan Yes/No dibentuk cukup dengan meletakkan '吗' di akhir kalimat deklaratif tanpa mengubah urutan kata. Untuk pertanyaan informasi, tempatkan kata tanya (什么, 哪儿, 谁, 几) pada posisi jawaban yang diharapkan.",
        examples: [
          { hanzi: "你想喝中国绿茶吗？", pinyin: "Nǐ xiǎng hē Zhōngguó lǜchá ma?", meaning: "Apakah kamu ingin minum teh hijau Tiongkok?" },
          { hanzi: "你叫什么名字？你在哪儿工作？", pinyin: "Nǐ jiào shénme míngzi? Nǐ zài nǎr gōngzuò?", meaning: "Siapa namamu? Di mana kamu bekerja?" },
          { hanzi: "现在几点？今天星期几？", pinyin: "Xiànzài jǐ diǎn? Jīntiān xīngqī jǐ?", meaning: "Sekarang jam berapa? Hari ini hari apa?" }
        ]
      },
      {
        title: "5. Kata Kerja Keberadaan '在' & '有' (zài / yǒu)",
        formula: "Subjek + 在 + Tempat / Tempat + 有 + Objek",
        explanation: "'在' menyatakan subjek berada di suatu lokasi. '有' menyatakan keberadaan (eksistensi) suatu benda/orang di suatu tempat atau kepemilikan. Bentuk negatif '有' selalu menggunakan '没有' (bukan 不有).",
        examples: [
          { hanzi: "我妈妈现在在医院工作。", pinyin: "Wǒ māma xiànzài zài yīyuàn gōngzuò.", meaning: "Ibu saya sekarang sedang bekerja di rumah sakit." },
          { hanzi: "桌子上有一本书和一个杯子。", pinyin: "Zhuōzi shang yǒu yì běn shū hé yí gè bēizi.", meaning: "Di atas meja ada sebuah buku dan sebuah cangkir." },
          { hanzi: "我今天没有时间去看电影。", pinyin: "Wǒ jīntiān méiyǒu shíjiān qù kàn diànyǐng.", meaning: "Saya hari ini tidak punya waktu untuk pergi menonton bioskop." }
        ]
      }
    ],
    vocabList: [
      { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Halo / Apa kabar", audio: "你好" },
      { hanzi: "谢谢", pinyin: "xièxie", meaning: "Terima kasih", audio: "谢谢" },
      { hanzi: "不客气", pinyin: "bú kèqi", meaning: "Sama-sama / Jangan sungkan", audio: "不客气" },
      { hanzi: "再见", pinyin: "zàijiàn", meaning: "Sampai jumpa lagi", audio: "再见" },
      { hanzi: "学生", pinyin: "xuésheng", meaning: "Siswa / Pelajar", audio: "学生" },
      { hanzi: "老师", pinyin: "lǎoshī", meaning: "Guru / Pengajar", audio: "老师" },
      { hanzi: "朋友", pinyin: "péngyou", meaning: "Teman / Sahabat", audio: "朋友" },
      { hanzi: "医生", pinyin: "yīshēng", meaning: "Dokter", audio: "医生" },
      { hanzi: "苹果", pinyin: "píngguǒ", meaning: "Buah apel", audio: "苹果" },
      { hanzi: "喝水", pinyin: "hē shuǐ", meaning: "Minum air", audio: "喝水" },
      { hanzi: "吃饭", pinyin: "chī fàn", meaning: "Makan nasi / makan", audio: "吃饭" },
      { hanzi: "高兴", pinyin: "gāoxìng", meaning: "Senang / Gembira", audio: "高兴" },
      { hanzi: "看书", pinyin: "kàn shū", meaning: "Membaca buku", audio: "看书" },
      { hanzi: "现在", pinyin: "xiànzài", meaning: "Sekarang", audio: "现在" },
      { hanzi: "喜欢", pinyin: "xǐhuan", meaning: "Suka / Gemar", audio: "喜欢" },
      { hanzi: "学校", pinyin: "xuéxiào", meaning: "Sekolah", audio: "学校" },
      { hanzi: "饭馆", pinyin: "fànguǎn", meaning: "Restoran / Rumah makan", audio: "饭馆" },
      { hanzi: "商店", pinyin: "shāngdiàn", meaning: "Toko", audio: "商店" },
      { hanzi: "分钟", pinyin: "fēnzhōng", meaning: "Menit (durasi)", audio: "分钟" },
      { hanzi: "对不起", pinyin: "duìbuqǐ", meaning: "Maaf / Permisi", audio: "对不起" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan percakapan: 'A: 你叫什么名字？ B: 我叫李明。' Apa inti pertanyaan pembicara A?",
        audio: "你叫什么名字？我叫李明。",
        analysis: "Kalimat '你叫什么名字？' (Nǐ jiào shénme míngzi?) digunakan untuk menanyakan nama orang secara santun. Jawaban yang tepat: Pembicara A menanyakan nama lawan bicara."
      },
      {
        skill: "Reading 📖",
        question: "Pilih kata yang tepat: 我____中国人，我是印尼留学生。(Wǒ ____ Zhōngguó rén, wǒ shì Yìnní liúxuéshēng.)",
        audio: "我不是中国人，我是印尼留学生。",
        analysis: "Karena anak kalimat kedua menyatakan 'Saya mahasiswa Indonesia', maka bagian depan membutuhkan negasi identitas '不是' (bú shì = bukan)."
      },
      {
        skill: "Speaking 🎙️",
        question: "Lafalkan salam berikut dengan nada sempurna: '认识你我也很高兴！' (Rènshi nǐ wǒ yě hěn gāoxìng!)",
        audio: "认识你我也很高兴！",
        analysis: "Perhatikan perubahan sandhi nada: 'wǒ yě hěn' memiliki tiga nada 3 berurutan, sehingga dilafalkan sebagai (wó yé hěn)."
      },
      {
        skill: "Writing ✍️",
        question: "Susun kata-kata acak berikut menjadi kalimat baku: [ 很好 / 妈妈 / 的 / 身体 ]",
        audio: "妈妈的身体很好。",
        analysis: "Pola: [Subjek Pemilik + 的 + Benda Inti + Kata Penguat + Kata Sifat]. Urutan yang benar: 妈妈的身体很好 (Māma de shēntǐ hěn hǎo)."
      }
    ]
  },

  "mod-hsk-2": {
    id: "mod-hsk-2",
    level: "HSK 2",
    levelNumber: 2,
    title: "HSK 2: Komunikasi Sehari-hari, Belanja, Arah & Waktu",
    author: "Laoshi Zhang (Dosen Bahasa Mandarin)",
    date: "2024-06-03",
    fileSize: "9.2 MB",
    downloads: 274,
    category: "komprehensif",
    badgeBg: "#cff4fc",
    badgeColor: "#0891b2",
    borderColor: "#a5f3fc",
    description: "Kuasai 300 kosakata HSK 2, kata bantu aspek (了, 过, 着), pola perbandingan (比), ungkapan jarak (离), kalimat pengandaian sederhana (如果), serta 50 paket latihan soal 4 keterampilan.",
    overview: "HSK 2 membawa pembelajar pada tingkat pra-menengah (A2). Anda mampu bertransaksi belanja, memesan tiket, menanyakan rute dan jarak tempuh, membicarakan pengalaman yang pernah dialami, mendeskripsikan cuaca, serta membandingkan dua hal atau orang secara gramatikal.",
    grammarPoints: [
      {
        title: "1. Pola Perbandingan dengan '比' (bǐ = Dibandingkan)",
        formula: "Objek A + 比 + Objek B + Kata Sifat (+ 一点儿 / 多了 / Angka)",
        explanation: "Menyatakan bahwa kualitas/sifat objek A melebihi objek B. Untuk menyatakan 'tidak lebih ... dibanding' gunakan 'A 没有 B 那么/这么 + Sifat' (bukan A 不比 B).",
        examples: [
          { hanzi: "今天比昨天冷一点儿，你多穿件衣服吧。", pinyin: "Jīntiān bǐ zuótiān lěng yìdiǎnr, nǐ duō chuān jiàn yīfu ba.", meaning: "Hari ini lebih dingin sedikit daripada kemarin, pakailah baju lebih tebal." },
          { hanzi: "哥哥比我大三岁，个子也比我高多了。", pinyin: "Gēge bǐ wǒ dà sān suì, gèzi yě bǐ wǒ gāo duō le.", meaning: "Abang 3 tahun lebih tua dari saya, tubuhnya juga jauh lebih tinggi dari saya." },
          { hanzi: "坐飞机比坐火车快得多。", pinyin: "Zuò fēijī bǐ zuò huǒchē kuài de duō.", meaning: "Naik pesawat jauh lebih cepat daripada naik kereta api." }
        ]
      },
      {
        title: "2. Menunjukkan Pengalaman Masa Lalu dengan '过' (guo)",
        formula: "Subjek + Kata Kerja + 过 + (Objek) (Negatif: 没(有) + Kata Kerja + 过)",
        explanation: "Partikel aspek '过' menunjukkan bahwa suatu tindakan pernah dialami setidaknya satu kali di masa lalu. Bentuk ingkarnya selalu menggunakan '没' atau '没有'.",
        examples: [
          { hanzi: "我去过两次北京，但是没去过上海。", pinyin: "Wǒ qù guo liǎng cì Běijīng, dànshì méi qù guo Shànghǎi.", meaning: "Saya pernah pergi ke Beijing dua kali, tetapi belum pernah pergi ke Shanghai." },
          { hanzi: "你吃过中国正宗的火锅吗？", pinyin: "Nǐ chī guo Zhōngguó zhèngzōng de huǒguō ma?", meaning: "Pernahkah kamu memakan hotpot otentik Tiongkok?" },
          { hanzi: "我以前看过这部电影，很有意思。", pinyin: "Wǒ yǐqián kàn guo zhè bù diànyǐng, hěn yǒu yìsi.", meaning: "Dulu saya pernah menonton film ini, sangat menarik." }
        ]
      },
      {
        title: "3. Menyatakan Jarak & Jangkauan dengan '离' (lí)",
        formula: "Tempat A + 离 + Tempat B + 很近 / 很远 / 有 + [Jarak/Waktu]",
        explanation: "Partikel '离' digunakan untuk mengukur jarak spasial maupun temporal antara dua titik acuan.",
        examples: [
          { hanzi: "我家离公司不太远，走路十分钟就到了。", pinyin: "Wǒ jiā lí gōngsī bú tài yuǎn, zǒulù shí fēnzhōng jiù dào le.", meaning: "Rumah saya tidak begitu jauh dari kantor, jalan kaki 10 menit sudah sampai." },
          { hanzi: "新机场离市中心有三十多公里。", pinyin: "Xīn jīchǎng lí shìzhōngxīn yǒu sānshí duō gōnglǐ.", meaning: "Bandara baru berjarak 30-an kilometer lebih dari pusat kota." }
        ]
      },
      {
        title: "4. Aspek Keadaan Sedang Berlangsung '着' & '正在' (zhe / zhèngzài)",
        formula: "Subjek + 正在 + Kata Kerja / Subjek + Kata Kerja + 着 + Objek",
        explanation: "'正在' menekankan aktivitas dinamis yang sedang berlangsung saat ini. '着' menekankan status atau kondisi berkelanjutan yang menyertai suatu tindakan.",
        examples: [
          { hanzi: "老师手里拿着一本书走进教室。", pinyin: "Lǎoshī shǒulǐ ná zhe yì běn shū zǒujìn jiàoshì.", meaning: "Guru masuk ke kelas dengan memegang sebuah buku di tangannya." },
          { hanzi: "外面正在下雨，别出去了。", pinyin: "Wàimiàn zhèngzài xià yǔ, bié chūqu le.", meaning: "Di luar sedang turun hujan, jangan keluar." }
        ]
      },
      {
        title: "5. Kalimat Pengandaian & Sebab-Akibat '因为……所以……' / '虽然……但是……'",
        formula: "因为 + Alasan, 所以 + Akibat / 虽然 + Konsesi, 但是 + Fakta Sebenarnya",
        explanation: "Konektor penting untuk menghubungkan dua klausa majemuk logis dalam percakapan sehari-hari.",
        examples: [
          { hanzi: "因为今天身体不舒服，所以我没去上班。", pinyin: "Yīnwèi jīntiān shēntǐ bù shūfu, suǒyǐ wǒ méi qù shàngbān.", meaning: "Karena hari ini badan kurang sehat, maka saya tidak masuk kerja." },
          { hanzi: "虽然这件衣服有点儿贵，但是质量非常好。", pinyin: "Suīrán zhè jiàn yīfu yǒudiǎnr guì, dànshì zhìliàng fēicháng hǎo.", meaning: "Meskipun baju ini agak mahal, tetapi kualitasnya sangat bagus." }
        ]
      }
    ],
    vocabList: [
      { hanzi: "虽然", pinyin: "suīrán", meaning: "Meskipun / Walaupun", audio: "虽然" },
      { hanzi: "但是", pinyin: "dànshì", meaning: "Tetapi / Namun", audio: "但是" },
      { hanzi: "准备", pinyin: "zhǔnbèi", meaning: "Mempersiapkan / Rencana", audio: "准备" },
      { hanzi: "便宜", pinyin: "piányi", meaning: "Murah", audio: "便宜" },
      { hanzi: "运动", pinyin: "yùndòng", meaning: "Olahraga", audio: "运动" },
      { hanzi: "跑步", pinyin: "pǎobù", meaning: "Berlari / Jogging", audio: "跑步" },
      { hanzi: "时间", pinyin: "shíjiān", meaning: "Waktu", audio: "时间" },
      { hanzi: "机场", pinyin: "jīchǎng", meaning: "Bandara udara", audio: "机场" },
      { hanzi: "帮助", pinyin: "bāngzhù", meaning: "Membantu / Pertolongan", audio: "帮助" },
      { hanzi: "懂", pinyin: "dǒng", meaning: "Mengerti / Paham", audio: "懂" },
      { hanzi: "游泳", pinyin: "yóu yǒng", meaning: "Berenang", audio: "游泳" },
      { hanzi: "介绍", pinyin: "jièshào", meaning: "Memperkenalkan", audio: "介绍" },
      { hanzi: "事情", pinyin: "shìqing", meaning: "Urusan / Perkara", audio: "事情" },
      { hanzi: "希望", pinyin: "xīwàng", meaning: "Berharap / Harapan", audio: "希望" },
      { hanzi: "开始", pinyin: "kāishǐ", meaning: "Mulai / Memulai", audio: "开始" },
      { hanzi: "晴天", pinyin: "qíngtiān", meaning: "Hari cerah", audio: "晴天" },
      { hanzi: "手表", pinyin: "shǒubiǎo", meaning: "Jam tangan", audio: "手表" },
      { hanzi: "送", pinyin: "sòng", meaning: "Mengantar / Memberi hadiah", audio: "送" },
      { hanzi: "欢迎", pinyin: "huānyíng", meaning: "Menyambut / Selamat datang", audio: "欢迎" },
      { hanzi: "找", pinyin: "zhǎo", meaning: "Mencari / Memberi kembalian", audio: "找" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan: '我打算明天去百货商场买一件新外套。' Kapan pembicara akan berbelanja?",
        audio: "我打算明天去百货商场买一件新外套。",
        analysis: "Kata kuncinya adalah '明天' (míngtiān = besok). Pembicara merencanakan pembelian baju besok."
      },
      {
        skill: "Reading 📖",
        question: "Isi titik-titik: 他跑得比我____。(Tā pǎo de bǐ wǒ ____.)",
        audio: "他跑得比我快得多。",
        analysis: "Dalam struktur komparasi kata kerja dengan partikel 得 (de), kata sifat yang mendeskripsikan lari adalah 快 (kuài = cepat). Kalimat: 他跑得比我快。"
      },
      {
        skill: "Speaking 🎙️",
        question: "Lafalkan kalimat berikut: '虽然今天下大雨，但是我们还是按时到了。'",
        audio: "虽然今天下大雨，但是我们还是按时到了。",
        analysis: "Fokus pada jeda klausa pada tanda koma dan intonasi nada 4 pada 'dàyǔ', 'dànshì', 'ànshí', 'dào'."
      },
      {
        skill: "Writing ✍️",
        question: "Susun kata-kata berikut: [ 离 / 很近 / 医院 / 超市 ]",
        audio: "超市离医院很近。",
        analysis: "Pola: Tempat A + 离 + Tempat B + 很近. Susunan yang tepat: 超市离医院很近 (Supermarket sangat dekat dari rumah sakit)."
      }
    ]
  },

  "mod-hsk-3": {
    id: "mod-hsk-3",
    level: "HSK 3",
    levelNumber: 3,
    title: "HSK 3: Kehidupan Kampus, Perjalanan, Karir & Pengalaman Hidup",
    author: "Laoshi Wang (Penerjemah & Pengajar Senior HSK)",
    date: "2024-06-05",
    fileSize: "10.1 MB",
    downloads: 215,
    category: "komprehensif",
    badgeBg: "#dbeafe",
    badgeColor: "#1d4ed8",
    borderColor: "#bfdbfe",
    description: "Pelajari 600 kosakata, struktur kalimat manipulasi 把 (bǎ), kalimat pasif 被 (bèi), pelengkap arah majemuk, pelengkap kemungkinan (得/不), serta paket 50 latihan soal 4 keterampilan.",
    overview: "HSK 3 merupakan tonggak penting kemahiran mandiri (B1). Siswa mampu berkomunikasi lancar dalam studi di universitas Tiongkok, merencanakan perjalanan wisata lintas provinsi, menyelesaikan masalah transaksi perbankan dan kesehatan, serta mengekspresikan opini dan perasaannya secara terstruktur.",
    grammarPoints: [
      {
        title: "1. Struktur Kalimat Manipulasi Objek '把' (bǎ)",
        formula: "Subjek + 把 + Objek + Kata Kerja + Pelengkap Hasil / Arah (了/在/到/给/完/好)",
        explanation: "Digunakan saat pembicara ingin menekankan bahwa suatu tindakan telah mengubah kondisi, letak, atau status dari objek spesifik yang diketahui kedua pihak. Kata kerja tidak boleh berdiri sendiri tanpa pelengkap.",
        examples: [
          { hanzi: "请大家把今天的作业交给我。", pinyin: "Qǐng dàjiā bǎ jīntiān de zuòyè jiāo gěi wǒ.", meaning: "Tolong kumpulkan tugas PR hari ini kepada saya." },
          { hanzi: "弟弟把桌子上的牛奶喝光了。", pinyin: "Dìdi bǎ zhuōzi shang de niúnǎi hē guāng le.", meaning: "Adik laki-laki telah meminum habis susu di atas meja." },
          { hanzi: "你把护照放在哪里了？", pinyin: "Nǐ bǎ hùzhào fàng zài nǎlǐ le?", meaning: "Kamu meletakkan paspormu di mana?" }
        ]
      },
      {
        title: "2. Struktur Kalimat Pasif '被' (bèi)",
        formula: "Korban / Objek + 被 + (Pelaku) + Kata Kerja + Hasil / Dampak",
        explanation: "Digunakan saat objek menerima tindakan (umumnya peristiwa yang tidak diharapkan atau bernada pasif formal). Jika pelaku tidak disebutkan, kata kerja langsung mengikuti '被'.",
        examples: [
          { hanzi: "我的自行车被小偷偷走了。", pinyin: "Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.", meaning: "Sepeda saya telah dicuri oleh pencuri." },
          { hanzi: "那个蛋糕已经被大家吃完了。", pinyin: "Nàge dàngāo yǐjīng bèi dàjiā chī wán le.", meaning: "Kue tersebut sudah habis dimakan oleh semua orang." },
          { hanzi: "他的新手机不小心被摔坏了。", pinyin: "Tā de xīn shǒujī bù xiǎoxīn bèi shuāi huài le.", meaning: "Ponsel barunya tidak sengaja terjatuh dan rusak." }
        ]
      },
      {
        title: "3. Pelengkap Kemungkinan (Potential Complement: V + 得 / 不 + C)",
        formula: "Kata Kerja + 得 / 不 + Hasil/Arah (Contoh: 看得懂 / 看不懂)",
        explanation: "Menyatakan apakah seseorang mampu atau tidak mampu mencapai hasil tertentu berdasarkan kondisi fisik, waktu, atau kemampuan.",
        examples: [
          { hanzi: "这篇中文文章太难了，我看不懂。", pinyin: "Zhè piān Zhōngwén wénzhāng tài nán le, wǒ kàn bu dǒng.", meaning: "Artikel bahasa Mandarin ini terlalu sulit, saya tidak mengerti saat membaca." },
          { hanzi: "作业太多，今天晚上我做不完。", pinyin: "Zuòyè tài duō, jīntiān wǎnshang wǒ zuò bu wán.", meaning: "Tugas terlalu banyak, malam ini saya tidak sanggup menyelesaikannya." },
          { hanzi: "老师说得太快，你听得清楚吗？", pinyin: "Lǎoshī shuō de tài kuài, nǐ tīng de qīngchu ma?", meaning: "Guru berbicara terlalu cepat, bisakah kamu mendengar dengan jelas?" }
        ]
      },
      {
        title: "4. Pelengkap Arah Majemuk (Compound Directional Complements)",
        formula: "Kata Kerja + 上/下/进/出/回/过/起 + 来/去",
        explanation: "Menunjukkan arah fisik gerakan menuju (来) atau menjauhi (去) posisi sang pembicara.",
        examples: [
          { hanzi: "请大家快点儿走进来吧。", pinyin: "Qǐng dàjiā kuài diǎnr zǒu jìnlái ba.", meaning: "Tolong semuanya cepatlah berjalan masuk ke dalam (ke arah pembicara)." },
          { hanzi: "他从书包里拿出一本词典来。", pinyin: "Tā cóng shūbāo lǐ ná chū yì běn cídiǎn lái.", meaning: "Dia mengeluarkan sebuah kamus dari dalam tasnya." }
        ]
      },
      {
        title: "5. Pola Korelatif Lanjutan '越……越……' & '不但……而且……'",
        formula: "越 A 越 B (Semakin A semakin B) / 不但 A 而且 B (Bukan hanya A tetapi juga B)",
        explanation: "Mengekspresikan peningkatan proporsional atau penambahan argumen yang sejalan.",
        examples: [
          { hanzi: "中文越学越有意思。", pinyin: "Zhōngwén yuè xué yuè yǒu yìsi.", meaning: "Bahasa Mandarin semakin dipelajari semakin menarik." },
          { hanzi: "他不但会说汉语，而且说得非常流利。", pinyin: "Tā búdàn huì shuō Hànyǔ, érqiě shuō de fēicháng liúlì.", meaning: "Dia bukan hanya bisa berbahasa Mandarin, tetapi bicaranya sangat fasih." }
        ]
      }
    ],
    vocabList: [
      { hanzi: "环境", pinyin: "huánjìng", meaning: "Lingkungan sekitar", audio: "环境" },
      { hanzi: "努力", pinyin: "nǔlì", meaning: "Bekerja keras / Tekun", audio: "努力" },
      { hanzi: "解决", pinyin: "jiějué", meaning: "Menyelesaikan (masalah)", audio: "解决" },
      { hanzi: "成绩", pinyin: "chéngjì", meaning: "Nilai prestasi / Hasil ujian", audio: "成绩" },
      { hanzi: "照顾", pinyin: "zhàogù", meaning: "Merawat / Menjaga", audio: "照顾" },
      { hanzi: "打算", pinyin: "dǎsuan", meaning: "Berencana / Niat", audio: "打算" },
      { hanzi: "选择", pinyin: "xuǎnzé", meaning: "Memilih / Pilihan", audio: "选择" },
      { hanzi: "决定", pinyin: "juédìng", meaning: "Memutuskan / Keputusan", audio: "决定" },
      { hanzi: "其实", pinyin: "qíshí", meaning: "Sebenarnya / Faktanya", audio: "其实" },
      { hanzi: "同意", pinyin: "tóngyì", meaning: "Menyetujui / Setuju", audio: "同意" },
      { hanzi: "经理", pinyin: "jīnglǐ", meaning: "Manajer / Pimpinan", audio: "经理" },
      { hanzi: "遇到", pinyin: "yùdào", meaning: "Menjumpai / Menemukan", audio: "遇到" },
      { hanzi: "护照", pinyin: "hùzhào", meaning: "Paspor perjalanan", audio: "护照" },
      { hanzi: "方便", pinyin: "fāngbiàn", meaning: "Praktis / Nyaman", audio: "方便" },
      { hanzi: "影响", pinyin: "yǐngxiǎng", meaning: "Mempengaruhi / Dampak", audio: "影响" },
      { hanzi: "参加", pinyin: "cānjiā", meaning: "Mengikuti / Bergabung", audio: "参加" },
      { hanzi: "愿意", pinyin: "yuànyì", meaning: "Bersedia / Rela", audio: "愿意" },
      { hanzi: "清楚", pinyin: "qīngchu", meaning: "Jelas / Terang", audio: "清楚" },
      { hanzi: "关系", pinyin: "guānxì", meaning: "Hubungan / Relasi", audio: "关系" },
      { hanzi: "检查", pinyin: "jiǎnchá", meaning: "Memeriksa / Mengecek", audio: "检查" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan: '请各位旅客把登机牌拿在手里，准备登机。' Apa instruksi petugas kepada penumpang?",
        audio: "请各位旅客把登机牌拿在手里，准备登机。",
        analysis: "Struktur 把登机牌拿在手里 menunjukkan penumpang diminta memegang boarding pass di tangan untuk bersiap naik pesawat."
      },
      {
        skill: "Reading 📖",
        question: "Pilihlah kata yang tepat: 他____房间打扫得干干净净。(Tā ____ fángjiān dǎsǎo de gāngānjìngjìng.)",
        audio: "他把房间打扫得干干净净。",
        analysis: "Pola manipulasi objek spesifik '房间' dengan hasil '打扫得干干净净' membutuhkan partikel 把 (bǎ)."
      },
      {
        skill: "Speaking 🎙️",
        question: "Ucapkan kalimat: '只要坚持努力，你就一定能把汉语学好！'",
        audio: "只要坚持努力，你就一定能把汉语学好！",
        analysis: "Kombinasi 只要 (zhǐyào)... 就 (jiù) menuntut intonasi optimis dengan penekanan pada 'jiānchí' dan 'xuéhǎo'."
      },
      {
        skill: "Writing ✍️",
        question: "Susun kalimat pasif: [ 被 / 吃了 / 苹果 / 弟弟 / 那个 ]",
        audio: "那个苹果被弟弟吃了。",
        analysis: "Pola: [Objek + 被 + Pelaku + Kata Kerja + 了]. Urutan yang tepat: 那个苹果被弟弟吃了 (Apel itu telah dimakan adik)."
      }
    ]
  },

  "mod-hsk-4": {
    id: "mod-hsk-4",
    level: "HSK 4",
    levelNumber: 4,
    title: "HSK 4: Dunia Kerja, Bisnis, Opini Kritis & Ekspresi Menengah Atas",
    author: "Laoshi Liu (Master Sastra & Penguji Resmi HSK)",
    date: "2024-06-08",
    fileSize: "11.5 MB",
    downloads: 189,
    category: "komprehensif",
    badgeBg: "#f3e8ff",
    badgeColor: "#6d28d9",
    borderColor: "#ddd6fe",
    description: "Kuasai 1.200 kosakata lanjutan, konjungsi wacana formal (无论, 尽管, 甚至, 既然), analisis sinonim kata kerja bisnis, teknik penulisan esai 100 kata, dan 50 paket soal 4 keterampilan.",
    overview: "HSK 4 adalah pintu gerbang menuju kemahiran fasih (B2). Pembelajar dapat berdiskusi secara mendalam tentang tema ekonomi, wawancara kerja, psikologi, perbandingan budaya, membaca koran dan esai, serta menyusun paragraf formal dengan argumen yang solid dan logis.",
    grammarPoints: [
      {
        title: "1. Pola Bersyarat Mutlak '无论……都 / 也……' (wúlùn... dōu/yě...)",
        formula: "无论 / 不管 + Kondisi Pilihan / Kata Tanya (多, 什么, 谁) + 都 / 也 + Hasil Tetap",
        explanation: "Menyatakan bahwa dalam kondisi atau situasi apa pun tanpa pengecualian, hasil atau kesimpulan tidak akan pernah berubah.",
        examples: [
          { hanzi: "无论遇到多么大的困难，我们都必须坚持到底。", pinyin: "Wúlùn yùdào duōme dà de kùnnan, wǒmen dōu bìxū jiānchí dàodǐ.", meaning: "Apa pun kesulitan besar yang dihadapi, kita semua harus bertekun hingga akhir." },
          { hanzi: "无论去不去，你最好都提前通知他一声。", pinyin: "Wúlùn qù bu qù, nǐ zuìhǎo dōu tíqián tōngzhī tā yì shēng.", meaning: "Pergi atau tidak, yang terbaik adalah kamu memberi tahu dia sebelumnya." }
        ]
      },
      {
        title: "2. Pola Konsesi Formal '尽管……但是 / 却……' (jǐnguǎn... dànshì/què...)",
        formula: "尽管 + Fakta / Hambatan Nyata, 但是 / 却 / 还是 + Tindakan Tetap Dilakukan",
        explanation: "Digunakan dalam wacana formal untuk mengakui sebuah rintangan atau fakta nyata, namun tindakan atau kondisi utama tetap berlanjut.",
        examples: [
          { hanzi: "尽管外面的雨下得很大，运动员们仍然在坚持训练。", pinyin: "Jǐnguǎn wàimiàn de yǔ xià de hěn dà, yùndòngyuánmen réngrán zài jiānchí xùnliàn.", meaning: "Meskipun hujan di luar turun sangat lebat, para atlet tetap gigih berlatih." },
          { hanzi: "尽管工作很辛苦，但他却感到非常充实。", pinyin: "Jǐnguǎn gōngzuò hěn xīnkǔ, dàn tā què gǎndào fēicháng chōngshí.", meaning: "Meskipun pekerjaan sangat melelahkan, dia justru merasa sangat bermakna." }
        ]
      },
      {
        title: "3. Pola Logika Premis '既然……就……' (jìrán... jiù...)",
        formula: "既然 + Fakta / Keputusan yang Telah Pasti, 就 + Saran / Kesimpulan Logis",
        explanation: "Menarik kesimpulan wajar atau memberikan rekomendasi tindakan dari fakta yang sudah disepakati bersama.",
        examples: [
          { hanzi: "既然你已经决定了，大家就全力支持你。", pinyin: "Jìrán nǐ yǐjīng juédìng le, dàjiā jiù quánlì zhīchí nǐ.", meaning: "Karena kamu sudah memutuskannya, maka semua orang akan mendukungmu sepenuhnya." },
          { hanzi: "既然来了，就多坐一会儿吧。", pinyin: "Jìrán lái le, jiù duō zuò yíhuìr ba.", meaning: "Karena sudah terlanjur datang, duduklah lebih lama sebentar." }
        ]
      },
      {
        title: "4. Struktur Penekanan Kumulatif '连……都 / 也……' (lián... dōu/yě...)",
        formula: "连 + Objek Ekstrem + 都 / 也 + Predikat",
        explanation: "Menyoroti contoh paling ekstrem untuk menggarisbawahi kehebatan atau keparahan suatu situasi.",
        examples: [
          { hanzi: "这个问题太简单了，连小孩子都明白。", pinyin: "Zhège wèntí tài jiǎndān le, lián xiǎoháizi dōu míngbai.", meaning: "Masalah ini terlalu sederhana, bahkan anak kecil pun mengerti." },
          { hanzi: "他最近忙得连周末都没有时间休息。", pinyin: "Tā zuìjìn máng de lián zhōumò dōu méiyǒu shíjiān xiūxi.", meaning: "Akhir-akhir ini dia sangat sibuk bahkan akhir pekan pun tak ada waktu istirahat." }
        ]
      },
      {
        title: "5. Kata Penghubung Formal '从而' (cóng'ér) & '对于……来说' (duìyú... láishuō)",
        formula: "Klausa Tindakan + 从而 + Hasil Akibat / 对于 + Subjek + 来说 + Pandangan",
        explanation: "Struktur standar esai HSK 4 untuk menghubungkan sebab-akibat objektif dan mengemukakan sudut pandang suatu pihak.",
        examples: [
          { hanzi: "多阅读优秀的中文书籍，从而提高写作水平。", pinyin: "Duō yuèdú yōuxiù de Zhōngwén shūjí, cóng'ér tígāo xiězuò shuǐpíng.", meaning: "Banyak membaca buku Mandarin berkualitas, sehingga (dengan demikian) meningkatkan kemampuan menulis." },
          { hanzi: "对于初学者来说，坚持每天开口练习最为关键。", pinyin: "Duìyú chūxuézhě láishuō, jiānchí měitiān kāikǒu liànxí zuì wéi guānjiàn.", meaning: "Bagi pemula, bertekun latihan berbicara setiap hari adalah hal paling krusial." }
        ]
      }
    ],
    vocabList: [
      { hanzi: "无论", pinyin: "wúlùn", meaning: "Bagaimanapun / Apapun", audio: "无论" },
      { hanzi: "招聘", pinyin: "zhāopìn", meaning: "Merekrut tenaga kerja", audio: "招聘" },
      { hanzi: "态度", pinyin: "tàidu", meaning: "Sikap mental / Perilaku", audio: "态度" },
      { hanzi: "坚持", pinyin: "jiānchí", meaning: "Gigih berjuang / Bertahan", audio: "坚持" },
      { hanzi: "适应", pinyin: "shìyìng", meaning: "Beradaptasi / Menyesuaikan diri", audio: "适应" },
      { hanzi: "根据", pinyin: "gēnjù", meaning: "Berdasarkan / Menurut data", audio: "根据" },
      { hanzi: "丰富", pinyin: "fēngfù", meaning: "Melimpah / Berpengalaman", audio: "丰富" },
      { hanzi: "交流", pinyin: "jiāoliú", meaning: "Berkomunikasi / Bertukar pikiran", audio: "交流" },
      { hanzi: "严格", pinyin: "yángé", meaning: "Ketat / Disiplin tegas", audio: "严格" },
      { hanzi: "负责", pinyin: "fùzé", meaning: "Bertanggung jawab", audio: "负责" },
      { hanzi: "积极", pinyin: "jījí", meaning: "Positif / Proaktif", audio: "积极" },
      { hanzi: "整理", pinyin: "zhěnglǐ", meaning: "Merapikan / Menata", audio: "整理" },
      { hanzi: "保证", pinyin: "bǎozhèng", meaning: "Menjamin / Garansi", audio: "保证" },
      { hanzi: "拒绝", pinyin: "jùjué", meaning: "Menolak / Menampik", audio: "拒绝" },
      { hanzi: "不仅", pinyin: "bùjǐn", meaning: "Tidak hanya / Bukan cuma", audio: "不仅" },
      { hanzi: "按时", pinyin: "ànshí", meaning: "Tepat waktu / Sesuai jadwal", audio: "按时" },
      { hanzi: "详细", pinyin: "xiángxì", meaning: "Rinci / Mendetail", audio: "详细" },
      { hanzi: "诚实", pinyin: "chéngshí", meaning: "Jujur / Tulus", audio: "诚实" },
      { hanzi: "提供", pinyin: "tígōng", meaning: "Menyediakan / Memasok", audio: "提供" },
      { hanzi: "经验", pinyin: "jīngyàn", meaning: "Pengalaman praktis", audio: "经验" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan: '王经理，这是关于下个季度市场推广的详细方案，请您过目。' Siapakah yang sedang diajak bicara?",
        audio: "王经理，这是关于下个季度市场推广的详细方案，请您过目。",
        analysis: "Kata sapaan formal '王经理' (Wáng jīnglǐ = Manajer Wang) dan kata kerja sopan '请您过目' (silakan ditinjau) menandakan komunikasi bisnis antara staf dan manajer."
      },
      {
        skill: "Reading 📖",
        question: "Lengkapilah: 无论天气多么恶劣，救援队____准时出发了。(Wúlùn tiānqì duōme èliè, jiùyuánduì ____ zhǔnshí chūfā le.)",
        audio: "无论天气多么恶劣，救援队都准时出发了。",
        analysis: "Pasangan baku dari konjungsi bersyarat mutlak '无论' adalah '都' (dōu) atau '也' (yě)."
      },
      {
        skill: "Speaking 🎙️",
        question: "Lafalkan opini berikut: '在面试过程中，积极自信的态度往往比单纯的工作经验更重要。'",
        audio: "在面试过程中，积极自信的态度往往比单纯的工作经验更重要。",
        analysis: "Perhatikan ritme jeda: [在面试过程中]，[积极自信的态度] [往往比单纯的工作经验] [更重要]。"
      },
      {
        skill: "Writing ✍️",
        question: "Susun kalimat: [ 提供了 / 这家公司 / 优厚的 / 为新员工 / 薪酬福利 ]",
        audio: "这家公司为新员工提供了优厚的薪酬福利。",
        analysis: "Pola: [Subjek + 为 + Penerima + Kata Kerja + Objek Beratribut]. Urutan: 这家公司为新员工提供了优厚的薪酬福利。"
      }
    ]
  },

  "mod-hsk-5": {
    id: "mod-hsk-5",
    level: "HSK 5",
    levelNumber: 5,
    title: "HSK 5: Wacana Berita, Isu Sosial, Retorika & Debat Profesional",
    author: "Prof. Huang (Pakar Linguistik & Pengajar Pascasarjana)",
    date: "2024-06-10",
    fileSize: "13.0 MB",
    downloads: 162,
    category: "komprehensif",
    badgeBg: "#fce7f3",
    badgeColor: "#be185d",
    borderColor: "#fbcfe8",
    description: "Modul 2.500 kosakata profesional: analisis tajuk berita, retorika debat, idiom peribahasa Chengyu klasik, esai naratif/argumentatif 80 kata, dan 50 paket latihan soal 4 keterampilan.",
    overview: "HSK 5 ditujukan bagi pembelajar tingkat mahir (C1). Anda mampu membaca majalah dan surat kabar Tiongkok, menikmati film berbahasa Mandarin tanpa teks terjemahan, menyampaikan pidato komprehensif di depan umum, serta menulis esai analitis dengan kosakata ragam tulis (书面语) yang elegan.",
    grammarPoints: [
      {
        title: "1. Kata Sambung Formal & Progresif '甚至' (shènzhì = Bahkan)",
        formula: "Klausa A + 甚至 + (连) Klausa Puncak Ekstrem + 都 / 也",
        explanation: "Digunakan untuk menambahkan fakta luar biasa yang melampaui ekspektasi normal, memperkuat argumen sebelumnya ke tingkat yang lebih intens.",
        examples: [
          { hanzi: "由于长期超负荷工作，他甚至连周末都无法安稳入睡。", pinyin: "Yóuyú chángqī chāofùhè gōngzuò, tā shènzhì lián zhōumò dōu wúfǎ ānwěn rùshuì.", meaning: "Akibat beban kerja berlebih jangka panjang, ia bahkan sampai tak bisa tidur nyenyak di akhir pekan." },
          { hanzi: "现代科技深刻改变了人们的生活，甚至重塑了人际交往的模式。", pinyin: "Xiàndài kējì shēnkè gǎibiàn le rénmen de shēnghuó, shènzhì chóngshù le rénjì jiāowǎng de móshì.", meaning: "Teknologi modern telah mengubah hidup manusia secara mendalam, bahkan membentuk kembali pola interaksi sosial." }
        ]
      },
      {
        title: "2. Konstruksi Retoris Ragam Tulis '与其……不如……' (yǔqí... bùrú...)",
        formula: "与其 + Opsi A (Kurang Diinginkan) + 不如 + Opsi B (Jauh Lebih Baik)",
        explanation: "Membandingkan dua pilihan dan secara tegas merekomendasikan pilihan kedua sebagai langkah yang lebih bijak.",
        examples: [
          { hanzi: "与其在这里无谓地担忧，不如马上采取切实有效的行动。", pinyin: "Yǔqí zài zhèlǐ wúwèi de dānyōu, bùrú mǎshàng cǎiqǔ qièshí yǒuxiào de xíngdòng.", meaning: "Daripada khawatir tanpa guna di sini, lebih baik segera mengambil tindakan nyata yang efektif." },
          { hanzi: "与其被动等待机会，不如主动去创造机会。", pinyin: "Yǔqí bèidòng děngdài jīhuì, bùrú zhǔdòng qù chuàngzào jīhuì.", meaning: "Daripada pasif menunggu peluang datang, lebih baik proaktif menciptakan peluang." }
        ]
      },
      {
        title: "3. Preposisi Wacana Formal '鉴于' (jiànyú) & '基于' (jīyú)",
        formula: "鉴于 + Pertimbangan / Situasi Nyata, Tindakan Kebijakan / 基于 + Landasan Teori/Data",
        explanation: "Digunakan dalam dokumen resmi, riset ilmiah, atau berita formal untuk menyatakan landasan keputusan atau analisis.",
        examples: [
          { hanzi: "鉴于当前全球经济形势的变化，公司决定调整海外投资战略。", pinyin: "Jiànyú dāngqián quánqiú jīngjì xíngshì de biànhuà, gōngsī juédìng tiáozhěng hǎiwài tóuzī zhànlüè.", meaning: "Mempertimbangkan perubahan situasi ekonomi global saat ini, perusahaan memutuskan menyesuaikan strategi investasi luar negeri." },
          { hanzi: "该结论是基于大量严谨的实验数据得出的。", pinyin: "Gāi jiélùn shì jīyú dàliàng yánjǐn de shíyàn shùjù dé chū de.", meaning: "Kesimpulan tersebut ditarik berdasarkan data eksperimen ketat dalam jumlah besar." }
        ]
      },
      {
        title: "4. Penggunaan Chengyu (Peribahasa 4 Karakter) dalam Kalimat Formal",
        formula: "Subjek + Chengyu (Sebagai Predikat/Atribut/Adverbia)",
        explanation: "Penguasaan idiom Chengyu sangat esensial di HSK 5 untuk mengekspresikan gagasan mendalam secara ringkas dan bersastra tinggi.",
        examples: [
          { hanzi: "面对突如其来的变故，他表现得十分镇定，做到胸有成竹。", pinyin: "Miànduì tūrúqílái de biàngù, tā biǎoxiàn de shífēn zhèndìng, zuò dào xiōng yǒu chéng zhú.", meaning: "Menghadapi musibah tak terduga, dia tampil sangat tenang dan percaya diri karena telah memiliki rencana matang." },
          { hanzi: "学习任何语言都需要持之以恒，绝不可能一蹴而就。", pinyin: "Xuéxí rènhé yǔyán dōu xūyào chí zhī yǐ héng, jué bù kěnéng yí cù ér jiù.", meaning: "Mempelajari bahasa apa pun menuntut ketekunan berkelanjutan, mustahil berhasil dalam satu langkah sekejap." }
        ]
      },
      {
        title: "5. Partikel Ragam Tulis Penyangkal '毫无' (háowú) & '何必' (hébì)",
        formula: "毫无 + Benda Abstrak (毫无疑问 / 毫无经验) / 何必 + Tindakan yang Tidak Perlu",
        explanation: "Bentuk tertulis tinggi untuk menyatakan 'sama sekali tidak ada' dan pertanyaan retoris 'mengapa harus repot-repot'.",
        examples: [
          { hanzi: "毫无疑问，环境保护是全人类共同面临的紧迫课题。", pinyin: "Háo wú yíwèn, huánjìng bǎohù shì quán rénlèi gòngtóng miànlín de jǐnpò kètí.", meaning: "Sama sekali tak diragukan lagi, pelestarian lingkungan adalah isu mendesak bersama seluruh umat manusia." },
          { hanzi: "既然事情已经圆满解决，你又何必自寻烦恼呢？", pinyin: "Jìrán shìqing yǐjīng yuánmǎn jiějué, nǐ yòu hébì zì xún fánnǎo ne?", meaning: "Karena urusan sudah tuntas dengan baik, mengapa kamu harus mencari-cari kekhawatiran sendiri?" }
        ]
      }
    ],
    vocabList: [
      { hanzi: "趋势", pinyin: "qūshì", meaning: "Tren perkembangan / Kecenderungan arah", audio: "趋势" },
      { hanzi: "资源", pinyin: "zīyuán", meaning: "Sumber daya", audio: "资源" },
      { hanzi: "投资", pinyin: "tóuzī", meaning: "Investasi modal", audio: "投资" },
      { hanzi: "沟通", pinyin: "gōutōng", meaning: "Komunikasi dua arah / Musyawarah", audio: "沟通" },
      { hanzi: "策略", pinyin: "cèlüè", meaning: "Taktik / Strategi", audio: "策略" },
      { hanzi: "核心", pinyin: "héxīn", meaning: "Inti sari / Fokus utama", audio: "核心" },
      { hanzi: "缺乏", pinyin: "quēfá", meaning: "Kekurangan / Minim", audio: "缺乏" },
      { hanzi: "促进", pinyin: "cùjìn", meaning: "Mendorong percepatan / Memajukan", audio: "促进" },
      { hanzi: "比例", pinyin: "bǐlì", meaning: "Proporsi / Rasio persentase", audio: "比例" },
      { hanzi: "挑战", pinyin: "tiǎozhàn", meaning: "Tantangan", audio: "挑战" },
      { hanzi: "观念", pinyin: "guānniàn", meaning: "Konsep pemikiran / Paradigma", audio: "观念" },
      { hanzi: "持续", pinyin: "chíxù", meaning: "Berkelanjutan / Kontinu", audio: "持续" },
      { hanzi: "承担", pinyin: "chéngdān", meaning: "Memikul tanggung jawab / Menanggung beban", audio: "承担" },
      { hanzi: "甚至", pinyin: "shènzhì", meaning: "Bahkan sampai", audio: "甚至" },
      { hanzi: "效率", pinyin: "xiàolǜ", meaning: "Efisiensi produktivitas", audio: "效率" },
      { hanzi: "把握", pinyin: "bǎwò", meaning: "Menggenggam peluang / Kepastian", audio: "把握" },
      { hanzi: "胸有成竹", pinyin: "xiōng yǒu chéng zhú", meaning: "Memiliki rencana matang & percaya diri", audio: "胸有成竹" },
      { hanzi: "持之以恒", pinyin: "chí zhī yǐ héng", meaning: "Bertekun secara konsisten", audio: "持之以恒" },
      { hanzi: "迫不及待", pinyin: "pò bù jí dài", meaning: "Tak sabar lagi / Sangat mendesak", audio: "迫不及待" },
      { hanzi: "津津有味", pinyin: "jīn jīn yǒu wèi", meaning: "Menikmati dengan penuh selera / Asyik", audio: "津津有味" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan petikan wawancara: '在数字经济快速发展的背景下，传统制造业必须加快数字化转型的步伐。' Apa fokus anjuran narasumber?",
        audio: "在数字经济快速发展的背景下，传统制造业必须加快数字化转型的步伐。",
        analysis: "Narasumber menekankan urgensi industri manufaktur konvensional untuk mempercepat transformasi digital di era ekonomi digital."
      },
      {
        skill: "Reading 📖",
        question: "Pilihlah Chengyu yang bermakna 'tekun dan konsisten tanpa putus asa': [ 持之以恒 / 迫不及待 / 乱七八糟 / 马马虎虎 ]",
        audio: "持之以恒",
        analysis: "'持之以恒' (chí zhī yǐ héng) melambangkan komitmen tinggi dan ketekunan berkelanjutan dalam mencapai cita-cita."
      },
      {
        skill: "Speaking 🎙️",
        question: "Sampaikan argumen singkat: '与其被动等待市场复苏，不如主动创新产品形态以引领消费者需求。'",
        audio: "与其被动等待市场复苏，不如主动创新产品形态以引领消费者需求。",
        analysis: "Terapkan intonasi wibawa bisnis dengan artikulasi jelas pada 'bèidòng děngdài' dan 'zhǔdòng chuàngxīn'."
      },
      {
        skill: "Writing ✍️",
        question: "Tuliskan 1 kalimat rangkuman menggunakan kata '趋势' (qūshì) dan '促进' (cùjìn).",
        audio: "绿色低碳已成为全球发展的大趋势，它将有力地促进新兴产业的繁荣。",
        analysis: "Contoh kalimat baku: 绿色低碳已成为全球发展的大趋势，它将有力地促进新兴产业的繁荣。"
      }
    ]
  },

  "mod-hsk-6": {
    id: "mod-hsk-6",
    level: "HSK 6",
    levelNumber: 6,
    title: "HSK 6: Tingkat Mahir Tertinggi, Wacana Sastra, Filsafat & Diplomasi",
    author: "Prof. Zhao (Akademisi Sastra Klasik Beijing)",
    date: "2024-06-12",
    fileSize: "14.8 MB",
    downloads: 140,
    category: "komprehensif",
    badgeBg: "#fef3c7",
    badgeColor: "#b45309",
    borderColor: "#fde68a",
    description: "Modul puncak HSK 6 (5.000+ kosakata): analisis wacana sastra, mendeteksi cacat gramatikal kalimat (病句辨析), ringkasan narasi 400 karakter (缩写), dan 50 paket latihan soal komprehensif 4 keterampilan.",
    overview: "HSK 6 melambangkan penguasaan bahasa Mandarin setingkat penutur asli terdidik (C2). Pembelajar dapat memahami segala ragam wacana lisan dan tulisan baik konotatif, satiris, filosofis, maupun istilah teknis lintas disiplin ilmu, serta mampu menyusun karangan akademik bermutu tinggi.",
    grammarPoints: [
      {
        title: "1. Analisis & Deteksi Cacat Kalimat Gramatikal (病句辨析专项)",
        formula: "Pemeriksaan struktur: Ketidaksesuaian S-P-O, Redundansi, Logika Kontradiktif, dan Salah Tempat Adverbia",
        explanation: "Soal legendaris HSK 6 Bagian Reading yang menguji kepekaan bahasa tingkat tinggi dalam mengenali kalimat rancu dalam tulisan resmi Tiongkok.",
        examples: [
          { hanzi: "【Kalimat Salah】通过这次参观，使我的眼界开阔了。（Cacat: Hilang subjek karena preposisi ganda 通过 dan 使）。", pinyin: "Tōngguò zhè cì cānguān, shǐ wǒ de yǎnjiè kāikuò le.", meaning: "Benar: 这次参观使我的眼界开阔了。" },
          { hanzi: "【Kalimat Salah】能否取得优异的成绩，关键在于平时的刻苦努力。（Cacat: Ketidaksesuaian dua sisi 能否 [bisa/tidak] dengan satu sisi 刻苦努力）。", pinyin: "Néng fǒu qǔdé yōuyì de chéngjì, guānjiàn zàiyú píngshí de kèkǔ nǔlì.", meaning: "Benar: 取得优异的成绩，关键在于平时的刻苦努力。" }
        ]
      },
      {
        title: "2. Penanda Negasi Ganda Retoris Formal '无不' (wúbù) & '未尝不' (wèicháng bù)",
        formula: "Subjek + 无不 / 无非 / 未尝不 + Predikat Afirmatif",
        explanation: "Menggunakan dua unsur negatif untuk membentuk penegasan mutlak dengan nuansa estetis sastrawi klasik.",
        examples: [
          { hanzi: "听到这个振奋人心的喜讯，在场的每一个人无不欢欣鼓舞。", pinyin: "Tīng dào zhège zhènfèn rénxīn de xǐxùn, zài chǎng de měi yí gè rén wúbù huānxīn gǔwǔ.", meaning: "Mendengar kabar gembira yang membakar semangat ini, setiap orang yang hadir semuanya tanpa kecuali bersorak bahagia." },
          { hanzi: "他的提议虽然大胆，但仔细思索，也未尝不是一种突破困境的良策。", pinyin: "Tā de tíyì suīrán dàdǎn, dàn zǐxì sīsuǒ, yě wèicháng bú shì yì zhǒng tūpò kùnjìng de liángcè.", meaning: "Usulannya walau terkesan berani, tetapi jika dicermati mendalam, tentu bisa menjadi strategi jitu menembus kebuntuan." }
        ]
      },
      {
        title: "3. Preposisi Klasik dalam Wacana Modern '以' (yǐ) & '为……所……' (wéi... suǒ...)",
        formula: "以 + Sarana/Alasan + Predikat / 为 + Pelaku + 所 + Kata Kerja Pasif",
        explanation: "Struktur warisan tata bahasa Mandarin klasik (文言文) yang melekat erat pada teks hukum, editorial media negara, dan karya sastra.",
        examples: [
          { hanzi: "我们应当以高度的责任感对待每一项工作任务。", pinyin: "Wǒmen yīngdāng yǐ gāodù de zérèngǎn duìdài měi yí xiàng gōngzuò rènwu.", meaning: "Kita seyogianya memperlakukan setiap tugas pekerjaan dengan rasa tanggung jawab yang amat tinggi." },
          { hanzi: "他的卓越才华终究为世人所公认。", pinyin: "Tā de zhuóyuè cáihuá zhōngjiū wéi shìrén suǒ gōngrèn.", meaning: "Bakat kecemerlangannya pada akhirnya diakui secara luas oleh khalayak dunia." }
        ]
      },
      {
        title: "4. Kosa Penghubung Sintaksis Kompleks '固然……但……' & '凡是……都……'",
        formula: "固然 + Mengakui Premis Benar, 但 + Poin Kritis Utama / 凡是 + Subjek Universal + 都",
        explanation: "Digunakan dalam debat tingkat tinggi untuk merangkul kebenaran parsial lawan sebelum memaparkan antitesis yang tak terbantahkan.",
        examples: [
          { hanzi: "物质激励固然重要，但精神追求与团队使命感更能激发深层潜能。", pinyin: "Wùzhì jīlì gùrán zhòngyào, dàn jīngshén zhuīqiú yǔ tuánduì shǐmìnggǎn gèng néng jīfā shēncéng qiánnéng.", meaning: "Insentif materi tentu saja penting, tetapi aspirasi spiritual dan rasa memiliki tim jauh lebih mampu menyalakan potensi mendalam." },
          { hanzi: "凡是有利于国家繁荣和人民福祉的事业，我们都要坚定不移地推进。", pinyin: "Fánshì yǒulì yú guójiā fánróng hé rénmín fúzhǐ de shìyè, wǒmen dōu yào jiāndìng bùyí de tuījìn.", meaning: "Segala hal yang bermanfaat bagi kemakmuran bangsa dan kesejahteraan rakyat, harus kita majukan dengan teguh tak tergoyahkan." }
        ]
      }
    ],
    vocabList: [
      { hanzi: "不可思议", pinyin: "bù kě sī yì", meaning: "Sungguh luar biasa / Tak terbayangkan logika", audio: "不可思议" },
      { hanzi: "潜移默化", pinyin: "qián yí mò huà", meaning: "Pengaruh halus mendalam tanpa disadari", audio: "潜移默化" },
      { hanzi: "络绎不绝", pinyin: "luò yì bù jué", meaning: "Lalu lalang mengalir tiada putus (keramaian)", audio: "络绎不绝" },
      { hanzi: "精益求精", pinyin: "jīng yì qiú jīng", meaning: "Terus menyempurnakan keunggulan karya", audio: "精益求精" },
      { hanzi: "急功近利", pinyin: "jí gōng jìn lì", meaning: "Hanya mengejar laba instan jangka pendek", audio: "急功近利" },
      { hanzi: "未雨绸缪", pinyin: "wèi yǔ chóu móu", meaning: "Bersiap sedia payung sebelum hujan", audio: "未雨绸缪" },
      { hanzi: "举足轻重", pinyin: "jǔ zú qīng zhòng", meaning: "Memegang peranan krusial penentu nasib", audio: "举足轻重" },
      { hanzi: "循序渐进", pinyin: "xún xù jiàn jìn", meaning: "Maju secara bertahap dan sistematis", audio: "循序渐进" },
      { hanzi: "统筹兼顾", pinyin: "tǒngchóu jiāngù", meaning: "Perencanaan menyeluruh yang seimbang", audio: "统筹兼顾" },
      { hanzi: "沧海一粟", pinyin: "cāng hǎi yí sù", meaning: "Setitik butir kecil di tengah samudra luas", audio: "沧海一粟" },
      { hanzi: "深谋远虑", pinyin: "shēn móu yuǎn lǜ", meaning: "Perhitungan strategis berpandangan jauh", audio: "深谋远虑" },
      { hanzi: "推陈出新", pinyin: "tuī chén chū xīn", meaning: "Melakukan inovasi dari tradisi lama", audio: "推陈出新" },
      { hanzi: "侃侃而谈", pinyin: "kǎn kǎn ér tán", meaning: "Berbicara fasih, elegan dan percaya diri", audio: "侃侃而谈" },
      { hanzi: "任重道远", pinyin: "rèn zhòng dào yuǎn", meaning: "Tanggung jawab berat dengan perjalanan panjang", audio: "任重道远" },
      { hanzi: "见微知著", pinyin: "jiàn wēi zhī zhù", meaning: "Mampu membaca gambaran besar dari tanda kecil", audio: "见微知著" },
      { hanzi: "墨守成规", pinyin: "mò shǒu chéng guī", meaning: "Kaku terbelenggu dogma lama", audio: "墨守成规" },
      { hanzi: "风雨同舟", pinyin: "fēng yǔ tóng zhōu", meaning: "Seia sekata melewati badai bersama", audio: "风雨同舟" },
      { hanzi: "集思广益", pinyin: "jí sī guǎng yì", meaning: "Menghimpun kecerdasan bersama demi solusi terbaik", audio: "集思广益" },
      { hanzi: "返璞归真", pinyin: "fǎn pú guī zhēn", meaning: "Kembali pada kesederhanaan dan kemurnian jati diri", audio: "返璞归真" },
      { hanzi: "博大精深", pinyin: "bó dà jīng shēn", meaning: "Sangat luas, agung dan mendalam (kebudayaan/ilmu)", audio: "博大精深" }
    ],
    sampleQuestions: [
      {
        skill: "Listening 🎧",
        question: "Dengarkan ceramah budaya: '中华传统文化博大精深，在潜移默化中塑造着东方文明的伦理底色。' Apa pesan utama kalimat ini?",
        audio: "中华传统文化博大精深，在潜移默化中塑造着东方文明的伦理底色。",
        analysis: "Kalimat menegaskan bahwa kebudayaan tradisional Tiongkok sangat agung dan mendalam, secara halus tanpa disadari membentuk fondasi etika peradaban timur."
      },
      {
        skill: "Reading 📖",
        question: "Chengyu manakah yang berarti 'melakukan persiapan matang jauh hari sebelum krisis tiba'? [ 潜移默化 / 未雨绸缪 / 急功近利 / 墨守成规 ]",
        audio: "未雨绸缪",
        analysis: "'未雨绸缪' (wèi yǔ chóu móu) secara metaforis berarti sedia payung sebelum hujan atau mengantisipasi risiko sejak awal."
      },
      {
        skill: "Speaking 🎙️",
        question: "Lafalkan kesimpulan diplomatis: '唯有坚持多边主义与合作共赢，世界各国方能风雨同舟，共创繁荣未来。'",
        audio: "唯有坚持多边主义与合作共赢，世界各国方能风雨同舟，共创繁荣未来。",
        analysis: "Jaga artikulasi formal dan nada tegas pada 'duōbiān zhǔyì' (multilateralisme), 'hézuò gòngyíng' (win-win), dan 'fēngyǔ tóngzhōu'."
      },
      {
        skill: "Writing ✍️",
        question: "Ringkas narasi esai 1.000 kata menjadi esai padat 400 kata dengan mempertahankan alur 5W+1H dan perspektif orang ketiga.",
        audio: "缩写原则：保留核心情节，去除次要描写，运用精准书面语概括人物心路历程与事件结局。",
        analysis: "Teknik Writing HSK 6: Baca cepat dalam 10 menit tanpa mencatat, temukan tokoh utama, konflik sentral, titik balik (转折), dan resolusi akhir."
      }
    ]
  }
};
