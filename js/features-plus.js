/**
 * Mandarinku - Fitur Interaktif Lanjutan (Features Plus)
 * Mencakup:
 * 1. Spaced Repetition System (SRS Anki-Style) & Bookmark Kosakata Favorit
 * 2. Kamus Cepat HSK 1-6 Global & Pencarian Radikal (Popup Modal + Ctrl+K)
 * 3. Pusat Latihan Ekstra:
 *    - Menyusun Kalimat Mandarin (Sentence Scramble / 连词成句 HSK 1-6)
 *    - Latihan Dikte Audio Mandarin (听写 Tīngxiě HSK 1-6)
 *    - Generator Cetak Lembar Latihan Kotak Hanzi (PDF / Print Tian Zi Ge & Mi Zi Ge)
 * 4. Misi Harian (Daily Quests) & Gamifikasi Streak di Beranda
 * 5. e-Sertifikat Penyelesaian HSK 1-6 di Halaman Profil
 */

window.MandarinkuExtras = {
  bookmarksKey: 'mandarinku_bookmarks_v1',
  srsKey: 'mandarinku_srs_v1',
  missionsKey: 'mandarinku_daily_missions_v1',

  activeLatihanTab: 'scramble', // 'scramble', 'dictation', 'print'
  scrambleLevel: 1,
  scrambleIndex: 0,
  scramblePlacedIndices: [],
  scrambleShowPinyin: true,
  scrambleChecked: null,

  dictationLevel: 1,
  dictationIndex: 0,
  dictationInput: '',
  dictationResult: null,
  dictationShowHint: false,

  printConfig: {
    title: 'Lembar Latihan Urutan Goresan & Menulis Hanzi (田字格笔顺字帖)',
    text: '叫什么名字他她们你好我是中国人学习汉语',
    gridType: 'tianzige',
    traceCount: 12,
    colsPerRow: 12,
    emptyRowsPerChar: 1,
    bottomBlankRows: 4,
    showHeaderInfo: false
  },

  strokePathsCache: {},

  // Daftar Radikal Populer untuk Pencarian Karakter Berdasarkan Komponen
  radicalsList: [
    { rad: 'all', label: 'Semua Radikal', chars: '' },
    { rad: '氵', label: '氵 Air (Shǔi)', chars: '没洗海河湖汽汁满游温清渴汤泳浪深法活流济' },
    { rad: '扌', label: '扌 Tangan (Shǒu)', chars: '打找把拿拉拍排报推提接换搬掉擦握按择指' },
    { rad: '口', label: '口 Mulut (Kǒu)', chars: '吃喝叫吗呢吧听唱吹味响哭哥喜售咖啡吵吸' },
    { rad: '讠', label: '讠 Bahasa (Yán)', chars: '说请谢谢读认识话语谁诉试课讲讨论诚谅译' },
    { rad: '心/忄', label: '忄/心 Hati (Xīn)', chars: '忙快慢想念忘情懂急怕怪愉悦惜惭惯感愿态' },
    { rad: '女', label: '女 Wanita (Nǚ)', chars: '好她妈姐妹姓如妻始娘嫁媒嫌嫩娱' },
    { rad: '亻', label: '亻 Orang (Rén)', chars: '你他们住作休件低体但位伴信借值假停健偶' },
    { rad: '木', label: '木 Kayu/Pohon (Mù)', chars: '本机杯果树桌椅楼校林森桥检植楚极标格桶' },
    { rad: '辶', label: '辶 Jalan (Chuò)', chars: '这那远近进送还过道选迷退追适逃逛速造逢' },
    { rad: '艹', label: '艹 Tumbuhan (Cǎo)', chars: '茶花草菜苹药蓝蕉萄蔬落著藏艺节苦英茂' },
    { rad: '饣', label: '饣 Makanan (Shí)', chars: '饭饮饿饱饺饼馆馒餐馅饶' },
    { rad: '日', label: '日 Matahari/Waktu', chars: '明早晚是时昨星期晴晒暖暗景暂智暑' }
  ],

  // Bank Kalimat Lengkap untuk Latihan Menyusun Kalimat (Sentence Scramble / 连词成句) HSK 1-6 (15 Soal per Level = 90 Soal)
  scrambleBank: [
    // ==================== HSK 1 (15 Soal) ====================
    { level: 1, words: ['我', '每天', '喝', '一杯', '热茶'], pinyin: ['wǒ', 'měitiān', 'hē', 'yì bēi', 'rè chá'], meaning: 'Saya setiap hari minum secangkir teh hangat.', grammar: 'Subjek + Keterangan Waktu (每天) + Kata Kerja + Objek.' },
    { level: 1, words: ['他', '是', '我们', '学校', '的', '汉语老师'], pinyin: ['tā', 'shì', 'wǒmen', 'xuéxiào', 'de', 'Hànyǔ lǎoshī'], meaning: 'Beliau adalah guru bahasa Mandarin sekolah kami.', grammar: 'Pola kalimat kepemilikan dengan partikel 的 (de).' },
    { level: 1, words: ['请问', '去', '北京火车站', '怎么', '走'], pinyin: ['qǐngwèn', 'qù', 'Běijīng huǒchēzhàn', 'zěnme', 'zǒu'], meaning: 'Permisi, bagaimana cara pergi ke Stasiun Kereta Beijing?', grammar: '去 + Tempat + 怎么走 (Bagaimana cara menuju ke...).' },
    { level: 1, words: ['爸爸', '星期六', '在医院', '工作'], pinyin: ['bàba', 'xīngqīliù', 'zài yīyuàn', 'gōngzuò'], meaning: 'Ayah bekerja di rumah sakit pada hari Sabtu.', grammar: 'Subjek + Waktu + 在 + Tempat + Kata Kerja.' },
    { level: 1, words: ['妈妈', '想去', '商店', '买', '一些水果'], pinyin: ['māma', 'xiǎng qù', 'shāngdiàn', 'mǎi', 'yìxiē shuǐguǒ'], meaning: 'Ibu ingin pergi ke toko membeli beberapa buah-buahan.', grammar: 'Kalimat beruntun (连动句): 想去 + Tempat + 买 + Objek.' },
    { level: 1, words: ['桌子上', '有', '一本', '汉语书', '和', '三个苹果'], pinyin: ['zhuōzi shàng', 'yǒu', 'yì běn', 'Hànyǔ shū', 'hé', 'sān gè píngguǒ'], meaning: 'Di atas meja ada sebuah buku bahasa Mandarin dan tiga buah apel.', grammar: 'Kalimat keberadaan: Tempat + 有 + Kata Bilangan + Kata Bantu Bilangan + Benda.' },
    { level: 1, words: ['我的', '中国朋友', '会做', '很好吃的', '中国菜'], pinyin: ['wǒ de', 'Zhōngguó péngyou', 'huì zuò', 'hěn hǎochī de', 'Zhōngguó cài'], meaning: 'Teman Tiongkok saya bisa memasak masakan Tiongkok yang sangat lezat.', grammar: 'Kata kerja bantu 会 (huì) menyatakan keahlian yang dipelajari.' },
    { level: 1, words: ['今天', '天气', '太热了', '我', '不想', '出去'], pinyin: ['jīntiān', 'tiānqì', 'tài rè le', 'wǒ', 'bù xiǎng', 'chūqù'], meaning: 'Cuaca hari ini terlalu panas, saya tidak ingin keluar.', grammar: 'Pola 太 + Kata Sifat + 了 (Terlalu...).' },
    { level: 1, words: ['你', '明天上午', '几点', '去', '学校'], pinyin: ['nǐ', 'míngtiān shàngwǔ', 'jǐ diǎn', 'qù', 'xuéxiào'], meaning: 'Besok pagi jam berapa kamu pergi ke sekolah?', grammar: 'Urutan waktu dalam Mandarin: dari satuan besar (明天) ke satuan kecil (上午, 几点).' },
    { level: 1, words: ['那位', '小姐', '买的', '衣服', '很漂亮'], pinyin: ['nà wèi', 'xiǎojiě', 'mǎi de', 'yīfu', 'hěn piàoliang'], meaning: 'Pakaian yang dibeli nona itu sangat indah.', grammar: 'Frasa atributif dengan 的 menjelaskan kata benda 衣服.' },
    { level: 1, words: ['我们', '下午', '坐出租车', '去', '飞机场'], pinyin: ['wǒmen', 'xiàwǔ', 'zuò chūzūchē', 'qù', 'fēijīchǎng'], meaning: 'Kami sore hari naik taksi pergi ke bandara.', grammar: '坐 + Kendaraan + 去 + Tempat Tujuan.' },
    { level: 1, words: ['弟弟', '今年', '八岁', '他', '喜欢', '看电视'], pinyin: ['dìdi', 'jīnnián', 'bā suì', 'tā', 'xǐhuan', 'kàn diànshì'], meaning: 'Adik laki-laki tahun ini berusia 8 tahun, dia suka menonton televisi.', grammar: 'Menyatakan usia langsung tanpa kata kerja: Subjek + 今年 + Angka + 岁.' },
    { level: 1, words: ['喂', '请问', '王医生', '现在', '在家吗'], pinyin: ['wèi', 'qǐngwèn', 'Wáng yīshēng', 'xiànzài', 'zài jiā ma'], meaning: 'Halo (di telepon), permisi apakah Dokter Wang sekarang ada di rumah?', grammar: 'Kalimat tanya keberadaan dengan 在 + Tempat + 吗.' },
    { level: 1, words: ['这杯', '咖啡', '多少钱', '我', '想买', '两杯'], pinyin: ['zhè bēi', 'kāfēi', 'duōshao qián', 'wǒ', 'xiǎng mǎi', 'liǎng bēi'], meaning: 'Secangkir kopi ini berapa harganya? Saya ingin membeli dua cangkir.', grammar: 'Penggunaan 两 (liǎng) di depan kata bantu bilangan (杯).' },
    { level: 1, words: ['很高兴', '认识你', '请', '坐在这儿', '喝茶'], pinyin: ['hěn gāoxìng', 'rènshi nǐ', 'qǐng', 'zuò zài zhèr', 'hē chá'], meaning: 'Sangat senang mengenal Anda, silakan duduk di sini minum teh.', grammar: 'Ungkapan sopan: 请 + Kata Kerja + Tempat.' },

    // ==================== HSK 2 (15 Soal) ====================
    { level: 2, words: ['妹妹', '比', '我', '更', '喜欢', '吃小笼包'], pinyin: ['mèimei', 'bǐ', 'wǒ', 'gèng', 'xǐhuan', 'chī xiǎolóngbāo'], meaning: 'Adik perempuan lebih suka makan Xiaolongbao dibandingkan saya.', grammar: 'Kalimat perbandingan: A + 比 + B + 更 + Kata Kerja Psikologis.' },
    { level: 2, words: ['从', '南京', '坐高铁', '去上海', '非常', '快'], pinyin: ['cóng', 'Nánjīng', 'zuò gāotiě', 'qù Shànghǎi', 'fēicháng', 'kuài'], meaning: 'Dari Nanjing naik kereta cepat ke Shanghai sangatlah cepat.', grammar: '从 + Titik Awal + Kendaraan + 去 + Tujuan.' },
    { level: 2, words: ['虽然', '外面', '下雨了', '但是', '他', '还在跑步'], pinyin: ['suīrán', 'wàimiàn', 'xiàyǔ le', 'dànshì', 'tā', 'hái zài pǎobù'], meaning: 'Meskipun di luar turun hujan, tetapi dia masih sedang berlari.', grammar: 'Konjungsi kontras 虽然……但是…… (Meskipun... tetapi...).' },
    { level: 2, words: ['因为', '昨天晚上', '睡得太晚', '所以', '今天', '起不来'], pinyin: ['yīnwèi', 'zuótiān wǎnshang', 'shuì de tài wǎn', 'suǒyǐ', 'jīntiān', 'qǐ bù lái'], meaning: 'Karena tadi malam tidur terlalu larut, maka hari ini tidak sanggup bangun.', grammar: 'Sebab-akibat 因为……所以…… dan pelengkap derajat 得.' },
    { level: 2, words: ['我已经', '学了', '两年', '汉语', '了'], pinyin: ['wǒ yǐjīng', 'xué le', 'liǎng nián', 'Hànyǔ', 'le'], meaning: 'Saya sudah belajar bahasa Mandarin selama dua tahun (dan masih berlanjut).', grammar: 'Durasi waktu: Kata Kerja + 了 + Durasi + Objek + 了.' },
    { level: 2, words: ['姐姐', '唱歌唱得', '非常好听', '大家', '都很喜欢'], pinyin: ['jiějie', 'chànggē chàng de', 'fēicháng hǎotīng', 'dàjiā', 'dōu hěn xǐhuan'], meaning: 'Kakak perempuan bernyanyi dengan sangat merdu, semua orang sangat menyukainya.', grammar: 'Pelengkap derajat: Kata Kerja + Objek + Kata Kerja + 得 + Kata Sifat.' },
    { level: 2, words: ['离', '我们学校', '不远的地方', '有一家', '中国书店'], pinyin: ['lí', 'wǒmen xuéxiào', 'bù yuǎn de dìfang', 'yǒu yì jiā', 'Zhōngguó shūdiàn'], meaning: 'Di tempat yang tidak jauh dari sekolah kami, ada sebuah toko buku Tiongkok.', grammar: 'Preposisi jarak: 离 + Tempat Acuan + 远/近.' },
    { level: 2, words: ['你', '去过', '北京的', '故宫和长城', '没有'], pinyin: ['nǐ', 'qù guo', 'Běijīng de', 'Gùgōng hé Chángchéng', 'méiyǒu'], meaning: 'Apakah kamu sudah pernah pergi ke Kota Terlarang dan Tembok Besar di Beijing?', grammar: 'Pengalaman masa lalu: Kata Kerja + 过 + Objek + 没有?' },
    { level: 2, words: ['快要', '考试了', '同学们', '都在教室里', '认真准备'], pinyin: ['kuàiyào', 'kǎoshì le', 'tóngxuémen', 'dōu zài jiàoshì lǐ', 'rènzhēn zhǔnbèi'], meaning: 'Sebentar lagi akan ujian, para siswa semuanya sedang bersiap dengan serius di kelas.', grammar: 'Masa depan dekat: 快要……了 (Sebentar lagi akan...).' },
    { level: 2, words: ['这件', '红衣服', '比那件', '贵一点儿', '但是更好看'], pinyin: ['zhè jiàn', 'hóng yīfu', 'bǐ nà jiàn', 'guì yìdiǎnr', 'dànshì gèng hǎokàn'], meaning: 'Baju merah ini sedikit lebih mahal daripada baju itu, tetapi lebih bagus.', grammar: 'A + 比 + B + Kata Sifat + 一点儿 (sedikit lebih...).' },
    { level: 2, words: ['请', '大家', '不要', '在图书馆里', '大声说话'], pinyin: ['qǐng', 'dàjiā', 'búyào', 'zài túshūguǎn lǐ', 'dàshēng shuōhuà'], meaning: 'Dimohon semuanya jangan berbicara keras-keras di dalam perpustakaan.', grammar: 'Kalimat larangan sopan: 请 + 不要 + di Tempat + Kata Kerja.' },
    { level: 2, words: ['妈妈', '每天早上', '六点半', '就', '起床做早饭'], pinyin: ['māma', 'měitiān zǎoshang', 'liù diǎn bàn', 'jiù', 'qǐchuáng zuò zǎofàn'], meaning: 'Ibu setiap pagi pukul setengah tujuh sudah bangun tidur membuat sarapan.', grammar: 'Adverbia 就 (jiù) menekankan tindakan terjadi lebih awal/cepat.' },
    { level: 2, words: ['医生', '让我', '多喝热水', '并且', '好好休息'], pinyin: ['yīshēng', 'ràng wǒ', 'duō hē rè shuǐ', 'bìngqiě', 'hǎohāo xiūxi'], meaning: 'Dokter menyuruh saya banyak minum air hangat serta beristirahat dengan baik.', grammar: 'Kalimat kausatif (兼语句): A + 让 + B + Kata Kerja.' },
    { level: 2, words: ['教室的门', '开着呢', '王老师', '正在里面', '上课'], pinyin: ['jiàoshì de mén', 'kāi zhe ne', 'Wáng lǎoshī', 'zhèngzài lǐmiàn', 'shàngkè'], meaning: 'Pintu kelas sedang terbuka, Guru Wang sedang mengajar di dalam.', grammar: 'Partikel aspek 着 (zhe) menyatakan keadaan yang berlangsung.' },
    { level: 2, words: ['今天', '是我弟弟的', '生日', '我们一起', '给他买蛋糕'], pinyin: ['jīntiān', 'shì wǒ dìdi de', 'shēngrì', 'wǒmen yìqǐ', 'gěi tā mǎi dàngāo'], meaning: 'Hari ini adalah ulang tahun adik laki-laki saya, kami bersama-sama membelikannya kue.', grammar: '给 + Penerima + Kata Kerja + Objek.' },

    // ==================== HSK 3 (15 Soal) ====================
    { level: 3, words: ['请', '把', '桌子上的', '那本书', '递给我'], pinyin: ['qǐng', 'bǎ', 'zhuōzi shàng de', 'nà běn shū', 'dì gěi wǒ'], meaning: 'Tolong berikan buku yang ada di atas meja itu kepada saya.', grammar: 'Kalimat 把 (bǎ): Subjek + 把 + Objek + Kata Kerja + Pelengkap.' },
    { level: 3, words: ['哥哥', '一边', '听音乐', '一边', '打扫房间'], pinyin: ['gēge', 'yìbiān', 'tīng yīnyuè', 'yìbiān', 'dǎsǎo fángjiān'], meaning: 'Kakak laki-laki sambil mendengarkan musik sambil membersihkan kamar.', grammar: 'Tindakan simultan: 一边 + Kerja 1 + 一边 + Kerja 2.' },
    { level: 3, words: ['只要', '每天', '坚持练习', '汉语水平', '就会', '提高'], pinyin: ['zhǐyào', 'měitiān', 'jiānchí liànxí', 'Hànyǔ shuǐpíng', 'jiù huì', 'tígāo'], meaning: 'Asalkan setiap hari tekun berlatih, kemampuan Mandarin pasti akan meningkat.', grammar: 'Kalimat syarat cukup: 只要……就…… (Asalkan... maka...).' },
    { level: 3, words: ['他', '不但', '会说汉语', '而且', '写汉字也写得很好'], pinyin: ['tā', 'búdàn', 'huì shuō Hànyǔ', 'érqiě', 'xiě Hànzì yě xiě de hěn hǎo'], meaning: 'Dia tidak hanya bisa berbicara Mandarin, tetapi juga menulis Hanzi dengan sangat baik.', grammar: 'Konjungsi progresif: 不但……而且…… (Tidak hanya... tetapi juga...).' },
    { level: 3, words: ['我', '先把作业', '做完', '然后再去', '公园散步'], pinyin: ['wǒ', 'xiān bǎ zuòyè', 'zuò wán', 'ránhòu zài qù', 'gōngyuán sànbù'], meaning: 'Saya menyelesaikan PR terlebih dahulu, baru kemudian pergi berjalan-jalan ke taman.', grammar: 'Urutan tindakan: 先 + 把 + Objek + Kerja, 然后再 + Kerja 2.' },
    { level: 3, words: ['天气', '越来越冷了', '出门的时候', '别忘了', '多穿衣服'], pinyin: ['tiānqì', 'yuèláiyuè lěng le', 'chūmén de shíhou', 'bié wàng le', 'duō chuān yīfu'], meaning: 'Cuaca semakin lama semakin dingin, saat keluar rumah jangan lupa memakai lebih banyak baju.', grammar: 'Perubahan bertahap: 越来越 + Kata Sifat.' },
    { level: 3, words: ['除了', '汉语以外', '她还会说', '流利的', '英语和法语'], pinyin: ['chúle', 'Hànyǔ yǐwài', 'tā hái huì shuō', 'liúlì de', 'Yīngyǔ hé Fǎyǔ'], meaning: 'Selain bahasa Mandarin, dia juga bisa berbicara bahasa Inggris dan Prancis yang fasih.', grammar: 'Pola inklusif: 除了……以外，还…… (Selain... juga...).' },
    { level: 3, words: ['关于', '这次旅行的安排', '我们已经', '跟校长', '商量好了'], pinyin: ['guānyú', 'zhè cì lǚxíng de ānpái', 'wǒmen yǐjīng', 'gēn xiàozhǎng', 'shāngliang hǎo le'], meaning: 'Mengenai pengaturan perjalanan kali ini, kami sudah selesai berdiskusi dengan kepala sekolah.', grammar: 'Preposisi topik: 关于 + Topik, Subjek + 跟 + Objek + Kata Kerja.' },
    { level: 3, words: ['只有', '努力学习', '才能', '考上', '理想的大学'], pinyin: ['zhǐyǒu', 'nǔlì xuéxí', 'cáinéng', 'kǎoshàng', 'lǐxiǎng de dàxué'], meaning: 'Hanya dengan belajar giat, barulah bisa lulus masuk ke universitas impian.', grammar: 'Kalimat syarat mutlak: 只有……才…… (Hanya jika... barulah...).' },
    { level: 3, words: ['那个', '穿蓝衬衫的', '年轻人', '看起来', '像我哥哥'], pinyin: ['nàge', 'chuān lán chènshān de', 'niánqīngrén', 'kàn qǐlái', 'xiàng wǒ gēge'], meaning: 'Anak muda yang memakai kemeja biru itu kelihatannya mirip kakak laki-laki saya.', grammar: 'Pelengkap arah kiasan: 看起来 (kelihatannya / tampaknya).' },
    { level: 3, words: ['由于', '航班延误', '他们只好', '在机场', '等了三个小时'], pinyin: ['yóuyú', 'hángbān yánwù', 'tāmen zhǐhǎo', 'zài jīchǎng', 'děng le sān gè xiǎoshí'], meaning: 'Dikarenakan penerbangan tertunda, mereka terpaksa menunggu tiga jam di bandara.', grammar: '由于 (karena) + 只好 (terpaksa / tidak punya pilihan lain selain).' },
    { level: 3, words: ['我的照相机', '被弟弟', '不小心', '摔坏了'], pinyin: ['wǒ de zhàoxiàngjī', 'bèi dìdi', 'bù xiǎoxīn', 'shuāi huài le'], meaning: 'Kamera saya tidak sengaja dijatuhkan hingga rusak oleh adik laki-laki.', grammar: 'Kalimat pasif: Subjek + 被 + Pelaku + Kata Kerja + Pelengkap Hasil (坏了).' },
    { level: 3, words: ['你', '越着急', '事情', '就越容易', '出错'], pinyin: ['nǐ', 'yuè zháojí', 'shìqing', 'jiù yuè róngyì', 'chūcuò'], meaning: 'Semakin kamu cemas/terburu-buru, urusan justru semakin mudah salah.', grammar: 'Korelasi bertingkat: 越 A 越 B (Semakin A, semakin B).' },
    { level: 3, words: ['我对', '中国传统文化', '和历史故事', '特别', '感兴趣'], pinyin: ['wǒ duì', 'Zhōngguó chuántǒng wénhuà', 'hé lìshǐ gùshi', 'tèbié', 'gǎn xìngqù'], meaning: 'Saya sangat tertarik terhadap budaya tradisional Tiongkok dan kisah sejarah.', grammar: 'Pola ketertarikan: A + 对 + B + 感兴趣.' },
    { level: 3, words: ['离开教室以前', '请一定', '把所有的灯', '和空调', '关掉'], pinyin: ['líkāi jiàoshì yǐqián', 'qǐng yídìng', 'bǎ suǒyǒu de dēng', 'hé kōngtiáo', 'guāndiào'], meaning: 'Sebelum meninggalkan ruang kelas, mohon pastikan mematikan semua lampu dan AC.', grammar: 'Kalimat 把 + Kata Kerja + 掉 (menyatakan penghilangan/pemadaman).' },

    // ==================== HSK 4 (15 Soal) ====================
    { level: 4, words: ['无论', '遇到', '多大的困难', '我们', '都不能', '放弃'], pinyin: ['wúlùn', 'yùdào', 'duō dà de kùnnan', 'wǒmen', 'dōu bù néng', 'fàngqì'], meaning: 'Tak peduli menghadapi kesulitan sebesar apa pun, kita tidak boleh menyerah.', grammar: 'Pola tanpa syarat: 无论……都…… (Tak peduli... tetap...).' },
    { level: 4, words: ['那篇', '精彩的', '文章', '被老师', '翻译成了', '中文'], pinyin: ['nà piān', 'jīngcǎi de', 'wénzhāng', 'bèi lǎoshī', 'fānyì chéng le', 'Zhōngwén'], meaning: 'Artikel yang luar biasa itu telah diterjemahkan ke bahasa Mandarin oleh guru.', grammar: 'Kalimat pasif: Objek + 被 + Pelaku + Kata Kerja + 成 + Hasil.' },
    { level: 4, words: ['不管', '明天的天气', '怎么样', '比赛', '都会', '按时举行'], pinyin: ['bùguǎn', 'míngtiān de tiānqì', 'zěnmeyàng', 'bǐsài', 'dōu huì', 'ànshí jǔxíng'], meaning: 'Tak peduli bagaimana cuaca besok, pertandingan akan tetap diselenggarakan tepat waktu.', grammar: '不管……都…… (Tak peduli... semuanya/tetap...).' },
    { level: 4, words: ['既然', '你已经', '答应了大家', '就应该', '遵守诺言'], pinyin: ['jìrán', 'nǐ yǐjīng', 'dāying le dàjiā', 'jiù yīnggāi', 'zūnshǒu nuòyán'], meaning: 'Berhubung kamu sudah berjanji kepada semua orang, maka sudah seharusnya menepati janji.', grammar: 'Penalaran logis: 既然……就…… (Berhubung/karena sudah... maka...).' },
    { level: 4, words: ['即使', '取得了', '优异的成绩', '我们也', '不能骄傲'], pinyin: ['jíshǐ', 'qǔdé le', 'yōuyì de chéngjì', 'wǒmen yě', 'bù néng jiāo\'ào'], meaning: 'Sekalipun telah meraih prestasi yang gemilang, kita tetap tidak boleh sombong.', grammar: 'Pengandaian konsesif: 即使……也…… (Sekalipun/walaupun... tetap...).' },
    { level: 4, words: ['通过', '这学期的努力', '他的口语表达', '有了', '明显的进步'], pinyin: ['tōngguò', 'zhè xuéqī de nǔlì', 'tā de kǒuyǔ biǎodá', 'yǒu le', 'míngxiǎn de jìnbù'], meaning: 'Melalui kerja keras semester ini, ungkapan lisan Mandarinnya mengalami kemajuan nyata.', grammar: 'Preposisi cara/sarana: 通过 + Nomina/Proses, Subjek + Hasil.' },
    { level: 4, words: ['真正的朋友', '不仅会在你成功时', '祝贺你', '更会在困难时', '支持你'], pinyin: ['zhēnzhèng de péngyou', 'bùjǐn huì zài nǐ chénggōng shí', 'zhùhè nǐ', 'gèng huì zài kùnnan shí', 'zhīchí nǐ'], meaning: 'Sahabat sejati tidak hanya memberi selamat saat kamu sukses, terlebih lagi mendukungmu saat sulit.', grammar: '不仅……更…… (Tidak hanya... bahkan lebih...).' },
    { level: 4, words: ['养成', '每天阅读的好习惯', '对我们的成长', '非常有好处'], pinyin: ['yǎngchéng', 'měitiān yuèdú de hǎo xíguàn', 'duì wǒmen de chéngzhǎng', 'fēicháng yǒu hǎochù'], meaning: 'Membentuk kebiasaan baik membaca setiap hari sangat bermanfaat bagi perkembangan kita.', grammar: '对 + Objek + 有好处 (Bermanfaat bagi...).' },
    { level: 4, words: ['他在中国', '生活了十年', '因此', '对当地的风俗', '十分熟悉'], pinyin: ['tā zài Zhōngguó', 'shēnghuó le shí nián', 'yīncǐ', 'duì dāngdì de fēngsú', 'shífēn shúxī'], meaning: 'Dia telah tinggal di Tiongkok selama 10 tahun, oleh karena itu sangat akrab dengan adat setempat.', grammar: 'Konjungsi konklusif formal: 因此 (oleh karena itu).' },
    { level: 4, words: ['为了', '保护自然环境', '政府鼓励市民', '尽量', '乘坐公共交通'], pinyin: ['wèile', 'bǎohù zìrán huánjìng', 'zhèngfǔ gǔlì shìmín', 'jìnliàng', 'chéngzuò gōnggòng jiāotōng'], meaning: 'Demi melindungi lingkungan alam, pemerintah mendorong warga sebisa mungkin naik transportasi umum.', grammar: 'Tujuan di awal kalimat: 为了 + Tujuan, Subjek + Tindakan.' },
    { level: 4, words: ['这本小说', '内容十分丰富', '值得一读', '你千万', '不要错过'], pinyin: ['zhè běn xiǎoshuō', 'nèiróng shífēn fēngfù', 'zhídé yì dú', 'nǐ qiānwàn', 'búyào cuòguò'], meaning: 'Novel ini isinya sangat kaya dan layak dibaca, kamu jangan sampai melewatkannya.', grammar: 'Penekanan peringatan: 千万 + 不要 (Jangan sampai / pastikan jangan).' },
    { level: 4, words: ['看来', '光靠背单词', '是不够的', '还必须', '多跟中国人交流'], pinyin: ['kànlái', 'guāng kào bèi dāncí', 'shì búgòu de', 'hái bìxū', 'duō gēn Zhōngguórén jiāoliú'], meaning: 'Tampaknya hanya mengandalkan hafalan kosakata saja tidaklah cukup, masih harus banyak berkomunikasi dengan orang Tiongkok.', grammar: '光靠……是不够的，还必须…… (Hanya mengandalkan... tidak cukup, masih harus...).' },
    { level: 4, words: ['当别人', '给你提出批评时', '你应该', '耐心地听完', '并表示感谢'], pinyin: ['dāng biérén', 'gěi nǐ tíchū pīpíng shí', 'nǐ yīnggāi', 'nàixīn de tīng wán', 'bìng biǎoshì gǎnxiè'], meaning: 'Ketika orang lain memberikan kritik kepadamu, kamu sebaiknya mendengarkan dengan sabar dan mengucapkan terima kasih.', grammar: 'Klausa waktu: 当……时 (Ketika / pada saat...).' },
    { level: 4, words: ['这家餐厅的菜', '味道不仅地道', '而且价格', '也相当实惠'], pinyin: ['zhè jiā cāntīng de cài', 'wèidào bùjǐn dìdao', 'érqiě jiàgé', 'yě xiāngdāng shíhuì'], meaning: 'Hidangan restoran ini rasanya tidak hanya otentik, tetapi harganya juga cukup terjangkau.', grammar: '不仅……而且…… dengan adverbia derajat 相当 (cukup/sangat).' },
    { level: 4, words: ['凡是', '参加这次比赛的学生', '都能获得', '一份精美的', '纪念品'], pinyin: ['fánshì', 'cānjiā zhè cì bǐsài de xuésheng', 'dōu néng huòdé', 'yí fèn jīngměi de', 'jìniànpǐn'], meaning: 'Setiap siswa yang mengikuti perlombaan kali ini semuanya dapat memperoleh suvenir indah.', grammar: 'Pola cakupan menyeluruh: 凡是……都…… (Semua/setiap yang... pasti...).' },

    // ==================== HSK 5 (15 Soal) ====================
    { level: 5, words: ['随着', '科技的发展', '人们的', '生活方式', '发生了', '巨大变化'], pinyin: ['suízhe', 'kējì de fāzhǎn', 'rénmen de', 'shēnghuó fāngshì', 'fāshēng le', 'jùdà biànhuà'], meaning: 'Seiring perkembangan teknologi, gaya hidup masyarakat mengalami perubahan besar.', grammar: '随着 + Frasa Benda, Subjek + 发生 + Perubahan.' },
    { level: 5, words: ['与其', '在家里', '抱怨', '不如', '出去', '寻找机会'], pinyin: ['yǔqí', 'zài jiālǐ', 'bàoyuàn', 'bùrú', 'chūqù', 'xúnzhǎo jīhuì'], meaning: 'Daripada mengeluh di rumah, lebih baik keluar mencari peluang.', grammar: 'Pilihan preferensi: 与其 A，不如 B (Daripada A, lebih baik B).' },
    { level: 5, words: ['除非', '亲眼所见', '否则', '我绝对不会', '相信这件事'], pinyin: ['chúfēi', 'qīnyǎn suǒ jiàn', 'fǒuzé', 'wǒ juéduì bú huì', 'xiāngxìn zhè jiàn shì'], meaning: 'Kecuali melihat dengan mata kepala sendiri, jika tidak saya sama sekali tidak akan mempercayai hal ini.', grammar: 'Pengecualian bersyarat: 除非……否则…… (Kecuali... jika tidak maka...).' },
    { level: 5, words: ['他之所以', '能在比赛中获胜', '是因为', '平时付出了', '十倍的汗水'], pinyin: ['tā zhīsuǒyǐ', 'néng zài bǐsài zhōng huòshèng', 'shì yīnwèi', 'píngshí fùchū le', 'shí bèi de hànshuǐ'], meaning: 'Alasan mengapa dia bisa menang dalam kompetisi adalah karena sehari-hari mencurahkan keringat sepuluh kali lipat.', grammar: 'Penjelasan alasan: 之所以……是因为…… (Alasan mengapa... adalah karena...).' },
    { level: 5, words: ['非但', '没有解决问题', '反而', '使矛盾', '变得更加复杂'], pinyin: ['fēidàn', 'méiyǒu jiějué wèntí', 'fǎn\'ér', 'shǐ máodùn', 'biàn de gèngjiā fùzá'], meaning: 'Alih-alih menyelesaikan masalah, justru membuat pertentangan menjadi semakin rumit.', grammar: 'Kebalikan ekspektasi: 非但（没）……反而…… (Bukannya... malah justru...).' },
    { level: 5, words: ['在跨文化交流中', '我们应当', '彼此尊重', '以实现', '合作共赢'], pinyin: ['zài kuà wénhuà jiāoliú zhōng', 'wǒmen yīngdāng', 'bǐcǐ zūnzhòng', 'yǐ shíxiàn', 'hézuò gòngyíng'], meaning: 'Dalam komunikasi lintas budaya, kita sudah sepatutnya saling menghormati guna mewujudkan kerja sama yang saling menguntungkan.', grammar: 'Preposisi tujuan formal: 以 + Kata Kerja (guna / untuk).' },
    { level: 5, words: ['尽管', '面临着', '重重挑战', '科研团队', '依然没有退缩'], pinyin: ['jǐnguǎn', 'miànlín zhe', 'chóngchóng tiǎozhàn', 'kēyán tuánduì', 'yīrán méiyǒu tuìsuō'], meaning: 'Meskipun tengah menghadapi berlapis-lapis tantangan, tim peneliti tetap tidak mundur sedikit pun.', grammar: 'Konsesif formal: 尽管……依然…… (Meskipun... tetap saja...).' },
    { level: 5, words: ['这部纪录片', '生动地展现了', '古代丝绸之路的', '繁荣景象'], pinyin: ['zhè bù jìlùpiàn', 'shēngdòng de zhǎnxiàn le', 'gǔdài Sīchóu zhī Lù de', 'fánróng jǐngxiàng'], meaning: 'Film dokumenter ini dengan hidup menampilkan pemandangan kejayaan Jalur Sutra kuno.', grammar: 'Adverbia + 地 + Kata Kerja Transitif + 了 + Objek.' },
    { level: 5, words: ['良好的沟通', '有助于', '消除误解', '并增进', '人与人之间的信任'], pinyin: ['liánghǎo de gōutōng', 'yǒuzhùyú', 'xiāochú wùjiě', 'bìng zēngjìn', 'rén yǔ rén zhījiān de xìnrèn'], meaning: 'Komunikasi yang baik membantu menghilangkan kesalahpahaman serta mempererat kepercayaan antarmanusia.', grammar: 'Frasa verbal formal: 有助于 + Objek Kerja (membantu / berkontribusi pada).' },
    { level: 5, words: ['一旦', '养成了拖延的习惯', '工作效率', '就会', '大打折扣'], pinyin: ['yídàn', 'yǎngchéng le tuōyán de xíguàn', 'gōngzuò xiàolǜ', 'jiù huì', 'dàdǎzhékòu'], meaning: 'Begitu terbentuk kebiasaan menunda-nunda, efisiensi kerja pasti akan sangat menurun drastis.', grammar: 'Kondisional waktu: 一旦……就…… (Begitu/sekali... maka...).' },
    { level: 5, words: ['面对', '突如其来的变化', '保持冷静的头脑', '显得', '尤为重要'], pinyin: ['miànduì', 'tūrúqílái de biànhuà', 'bǎochí lěngjìng de tóunǎo', 'xiǎnde', 'yóuwéi zhòngyào'], meaning: 'Menghadapi perubahan yang datang tiba-tiba, menjaga kepala tetap tenang tampak menjadi sangat penting.', grammar: '显得 + 尤为 + Kata Sifat (tampak/terlihat sangat...).' },
    { level: 5, words: ['阅读经典名著', '不仅能开阔眼界', '更能陶冶', '我们的情操'], pinyin: ['yuèdú jīngdiǎn míngzhù', 'bùjǐn néng kāikuò yǎnjiè', 'gèng néng táoyě', 'wǒmen de qíngcāo'], meaning: 'Membaca karya klasik terkenal tidak hanya memperluas wawasan, tetapi juga memperhalus budi pekerti kita.', grammar: 'Kolokasi sastra HSK 5: 开阔眼界 (memperluas wawasan) & 陶冶情操 (memperhalus budi pekerti).' },
    { level: 5, words: ['这项新政策', '旨在', '减轻中小企业的负担', '促进经济复苏'], pinyin: ['zhè xiàng xīn zhèngcè', 'zhǐzài', 'jiǎnqīng zhōngxiǎo qǐyè de fùdān', 'cùjìn jīngjì fùsū'], meaning: 'Kebijakan baru ini bertujuan meringankan beban usaha kecil menengah dan mendorong pemulihan ekonomi.', grammar: 'Kata kerja formal: 旨在 (bertujuan untuk).' },
    { level: 5, words: ['他宁可', '自己承担损失', '也不愿意', '违背当初的承诺'], pinyin: ['tā nìngkě', 'zìjǐ chéngdān sǔnshī', 'yě bú yuànyì', 'wéibèi dāngchū de chéngnuò'], meaning: 'Dia lebih memilih menanggung kerugian sendiri daripada melanggar janji awalnya.', grammar: 'Pilihan tegas: 宁可……也不…… (Lebih memilih... daripada...).' },
    { level: 5, words: ['幸亏', '消防员及时赶到', '才避免了一场', '严重的火灾'], pinyin: ['xìngkuī', 'xiāofángyuán jíshí gǎndào', 'cái bìmiǎn le yì chǎng', 'yánzhòng de huǒzāi'], meaning: 'Untung saja petugas pemadam kebakaran tiba tepat waktu, barulah terhindar dari bencana kebakaran hebat.', grammar: '幸亏……才…… (Untung saja... barulah...).' },

    // ==================== HSK 6 (15 Soal) ====================
    { level: 6, words: ['塞翁失马', '焉知非福', '教导我们', '要用辩证的眼光', '看待得失'], pinyin: ['sàiwēngshīmǎ', 'yānzhīfēifú', 'jiàodǎo wǒmen', 'yào yòng biànzhèng de yǎnguāng', 'kàndài déshī'], meaning: 'Pepatah "Kakek perbatasan kehilangan kuda, siapa tahu membawa berkah" mengajarkan kita memandang untung-rugi secara bijaksana.', grammar: 'Penggunaan idiom klasik (成语) sebagai subjek kalimat filosofis.' },
    { level: 6, words: ['唯有', '脚踏实地', '久久为功', '方能', '实现', '远大理想'], pinyin: ['wéiyǒu', 'jiǎotàshídì', 'jiǔjiǔwéigōng', 'fāngnéng', 'shíxiàn', 'yuǎndà lǐxiǎng'], meaning: 'Hanya dengan berpijak pada kenyataan dan berusaha tekun, barulah cita-cita luhur dapat terwujud.', grammar: 'Struktur sastra formal HSK 6: 唯有……方能…… (Hanya dengan... barulah dapat...).' },
    { level: 6, words: ['画蛇添足的故事', '讽刺了那些', '做了多余的事', '反而不讨好的人'], pinyin: ['huàshétiānzú de gùshi', 'fěngcì le nàxiē', 'zuò le duōyú de shì', 'fǎn\'ér bù tǎohǎo de rén'], meaning: 'Kisah "Menggambar ular ditambah kaki" menyindir orang yang melakukan hal berlebihan namun justru merusak hasil.', grammar: 'Idiom Chengyu 画蛇添足 sebagai inti subjek wacana.' },
    { level: 6, words: ['倘若', '缺乏独立思考的能力', '人们便极易', '随波逐流'], pinyin: ['tǎngruò', 'quēfá dúlì sīkǎo de nénglì', 'rénmen biàn jí yì', 'suíbōzhúliú'], meaning: 'Seandainya kekurangan kemampuan berpikir mandiri, manusia akan sangat mudah terbawa arus.', grammar: 'Pengandaian sastra: 倘若……便…… (Seandainya/jika... maka akan...).' },
    { level: 6, words: ['工欲善其事', '必先利其器', '强调了', '赛前准备的重要性'], pinyin: ['gōng yù shàn qí shì', 'bì xiān lì qí qì', 'qiángdiào le', 'sàiqián zhǔnbèi de zhòngyàoxìng'], meaning: 'Pepatah "Pekerja yang ingin menyempurnakan karyanya harus menajamkan alatnya dulu" menekankan pentingnya persiapan.', grammar: 'Kutipan peribahasa klasik Konfusius sebagai subjek kalimat.' },
    { level: 6, words: ['这篇社论', '高屋建瓴地', '剖析了', '全球数字经济的', '发展趋势'], pinyin: ['zhè piān shèlùn', 'gāowūjiànlíng de', 'pōuxī le', 'quánqiú shùzì jīngjì de', 'fāzhǎn qūshì'], meaning: 'Editorial ini secara komprehensif dan berpandangan jauh mengupas tren perkembangan ekonomi digital global.', grammar: 'Idiom 高屋建瓴 digunakan sebagai keterangan cara (+ 地 + 剖析).' },
    { level: 6, words: ['面对网络上', '纷繁复杂的信息', '我们切忌', '人云亦云'], pinyin: ['miànduì wǎngluò shàng', 'fēnfán fùzá de xìnxī', 'wǒmen qièjì', 'rényúnyìyún'], meaning: 'Menghadapi informasi yang simpang siur di internet, kita pantang sekadar ikut-ikutan ucapan orang lain.', grammar: 'Larangan keras formal: 切忌 + Idiom 人云亦云.' },
    { level: 6, words: ['科技创新', '绝非一朝一夕之功', '而是需要', '持之以恒的投入'], pinyin: ['kējì chuàngxīn', 'juéfēi yìzhāo-yìxī zhī gōng', 'érshì xūyào', 'chízhīyǐhéng de tóurù'], meaning: 'Inovasi teknologi sama sekali bukanlah hasil kerja semalam, melainkan membutuhkan dedikasi yang tekun.', grammar: 'Kontras formal: 绝非……而是…… (Sama sekali bukan... melainkan...).' },
    { level: 6, words: ['与其临渊羡鱼', '不如退而结网', '激励年轻人', '付诸实际行动'], pinyin: ['yǔqí línyuānxiànyú', 'bùrú tuì ér jiéwǎng', 'jīlì niánqīngrén', 'fùzhū shíjì xíngdòng'], meaning: 'Pepatah "Daripada berdiri di tepi lubuk mengagumi ikan, lebih baik mundur merajut jala" memotivasi pemuda bertindak nyata.', grammar: 'Idiom klasik paralel 与其临渊羡鱼，不如退而结网.' },
    { level: 6, words: ['故宫博物院的', '奇珍异宝', '令来自世界各地的游客', '叹为观止'], pinyin: ['Gùgōng Bówùyuàn de', 'qízhēn-yìbǎo', 'lìng láizì shìjiè gèdì de yóukè', 'tànwéiguānzhǐ'], meaning: 'Harta pusaka langka di Museum Istana membuat wisatawan dari seluruh penjuru dunia berdecak kagum luar biasa.', grammar: 'Kausatif sastra: 令 + Objek + Idiom 叹为观止.' },
    { level: 6, words: ['保护非物质文化遗产', '需要全社会', '群策群力', '共同参与'], pinyin: ['bǎohù fēiwùzhì wénhuà yíchǎn', 'xūyào quán shèhuì', 'qúncè-qúnlì', 'gòngtóng cānyù'], meaning: 'Melindungi warisan budaya takbenda membutuhkan seluruh lapisan masyarakat menyatukan pikiran dan tenaga untuk berpartisipasi bersama.', grammar: 'Idiom 群策群力 (menyatukan seluruh gagasan dan kekuatan).' },
    { level: 6, words: ['他虽然', '年逾古稀', '却依然精神矍铄', '活跃在讲台上'], pinyin: ['tā suīrán', 'niányúgǔxī', 'què yīrán jīngshén juéshuò', 'huóyuè zài jiǎngtái shàng'], meaning: 'Meskipun usianya telah melampaui tujuh puluh tahun, beliau tetap bersemangat bugar dan aktif di atas podium mengajar.', grammar: 'Kosakata sastra HSK 6: 年逾古稀 (>70 tahun) & 精神矍铄 (tua namun bugar bersemangat).' },
    { level: 6, words: ['任何伟大的成就', '都离不开', '日积月累的沉淀', '与坚持'], pinyin: ['rènhé wěidà de chéngjiù', 'dōu líbukāi', 'rìjī-yuèlěi de chéndiàn', 'yǔ jiānchí'], meaning: 'Pencapaian agung apa pun tidak pernah terlepas dari akumulasi proses hari demi hari serta ketekunan.', grammar: 'Pola 任何……都离不开…… (Apa pun... tidak terlepas dari...).' },
    { level: 6, words: ['在谈判陷入僵局时', '他巧妙的建议', '起到了', '举足轻重的作用'], pinyin: ['zài tánpàn xiànrù jiāngjú shí', 'tā qiǎomiào de jiànyì', 'qǐdào le', 'jǔzúqīngzhòng de zuòyòng'], meaning: 'Saat perundingan mengalami jalan buntu, sarannya yangerdik memainkan peranan yang sangat menentukan.', grammar: 'Kolokasi 起到 + 举足轻重的作用 (memainkan peranan krusial/menentukan).' },
    { level: 6, words: ['欲速则不达', '提醒我们在求学道路上', '切勿急功近利'], pinyin: ['yùsùzébudá', 'tíxǐng wǒmen zài qiúxué dàolù shàng', 'qièwù jígōngjìnlì'], meaning: 'Ungkapan "Terlalu bernafsu cepat justru tak sampai tujuan" mengingatkan kita agar jangan mengejar hasil instan dalam menuntut ilmu.', grammar: 'Idiom 欲速则不达 & 切勿急功近利.' }
  ],

  init() {
    this.injectBookmarksIntoFlashcardData();
    this.createQuickDictModal();
    this.bindKeyboardShortcuts();
    this.renderDailyMissionsPanel();
    this.renderCertificatesInProfile();
  },

  // =========================================================================
  // 1. BOOKMARK FAVORIT & SPACED REPETITION SYSTEM (SRS ANKI-STYLE)
  // =========================================================================
  getBookmarks() {
    try {
      const raw = localStorage.getItem(this.bookmarksKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveBookmarks(list) {
    try {
      localStorage.setItem(this.bookmarksKey, JSON.stringify(list));
    } catch (e) {}
  },

  isBookmarked(hanzi) {
    if (!hanzi) return false;
    const clean = hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
    return this.getBookmarks().some(item => item.hanzi === clean || item.hanzi === hanzi);
  },

  addBookmarkWord(wordObj) {
    if (!wordObj || !wordObj.hanzi) return;
    const cleanHanzi = wordObj.hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
    const list = this.getBookmarks();
    const existingIdx = list.findIndex(x => x.hanzi === cleanHanzi);

    const entry = {
      hanzi: cleanHanzi,
      pinyin: wordObj.pinyin || '-',
      meaning: wordObj.meaning || '-',
      meaning_en: wordObj.meaning_en || wordObj.meaning || '-',
      example: wordObj.example || `${cleanHanzi} (${wordObj.pinyin || ''})`,
      exampleTrans: wordObj.exampleTrans || wordObj.meaning || '-',
      exampleTrans_en: wordObj.exampleTrans_en || wordObj.meaning || '-',
      lvl: parseInt(wordObj.lvl) || 1,
      savedAt: new Date().toISOString()
    };

    if (existingIdx === -1) {
      list.unshift(entry);
      this.saveBookmarks(list);
      this.injectSingleWordToFlashcardData(entry);
      if (typeof showToast === 'function') {
        showToast(`⭐ "${cleanHanzi}" berhasil disimpan ke Flashcard Favorit!`, 'success');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(`📌 "${cleanHanzi}" sudah ada di daftar Favorit Anda.`, 'info');
      }
    }
  },


  toggleBookmarkWord(wordObj) {
    if (!wordObj || !wordObj.hanzi) return false;
    const cleanHanzi = wordObj.hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
    let list = this.getBookmarks();
    if (this.isBookmarked(cleanHanzi)) {
      list = list.filter(x => x.hanzi !== cleanHanzi);
      this.saveBookmarks(list);
      if (typeof showToast === 'function') {
        showToast(`Dihapus dari Favorit: ${cleanHanzi}`, 'info');
      }
      return false;
    } else {
      this.addBookmarkWord(wordObj);
      return true;
    }
  },

  toggleCardBookmarkInPlace() {
    if (typeof fcPageState === 'undefined' || !fcPageState.cards.length) return;
    const card = fcPageState.cards[fcPageState.currentIndex];
    if (!card) return;
    this.toggleBookmarkWord(card);
    if (typeof renderFlashcardPage === 'function') renderFlashcardPage();
  },

  injectSingleWordToFlashcardData(entry) {
    if (typeof flashcardData !== 'object' || !flashcardData) return;
    const lvl = entry.lvl || 1;
    if (!flashcardData[lvl]) flashcardData[lvl] = [];
    const exists = flashcardData[lvl].some(c => c.hanzi === entry.hanzi);
    if (!exists) {
      flashcardData[lvl].unshift(entry);
    }
  },

  injectBookmarksIntoFlashcardData() {
    const list = this.getBookmarks();
    list.forEach(item => this.injectSingleWordToFlashcardData(item));
  },

  getBookmarkedCardsPool() {
    const list = this.getBookmarks();
    if (list.length > 0) return list;
    // Fallback sample if user hasn't bookmarked any yet
    if (typeof flashcardData === 'object' && flashcardData[1]) {
      return flashcardData[1].slice(0, 5).map(c => ({ ...c, lvl: 1 }));
    }
    return [];
  },

  getSrsMap() {
    try {
      const raw = localStorage.getItem(this.srsKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  saveSrsMap(map) {
    try {
      localStorage.setItem(this.srsKey, JSON.stringify(map));
    } catch (e) {}
  },

  getSrsDueCardsPool() {
    const srsMap = this.getSrsMap();
    const now = Date.now();
    const allCards = this.getAllDictionaryEntries();
    const due = [];

    // First include cards explicitly marked 'hard' or due in srsMap
    allCards.forEach(c => {
      const rec = srsMap[c.hanzi];
      if (rec && rec.nextReview <= now) {
        due.push({ ...c, srsInterval: rec.intervalLabel });
      }
    });

    // If fewer than 10 cards are due, add unreviewed cards from HSK 1-2 so SRS deck is always ready
    if (due.length < 10) {
      for (const c of allCards) {
        if (!srsMap[c.hanzi] && !due.some(d => d.hanzi === c.hanzi)) {
          due.push(c);
          if (due.length >= 15) break;
        }
      }
    }
    return due;
  },

  rateSrsCard(rating) {
    if (typeof fcPageState === 'undefined' || !fcPageState.cards.length) return;
    const card = fcPageState.cards[fcPageState.currentIndex];
    if (!card) return;

    const srsMap = this.getSrsMap();
    const now = Date.now();

    if (rating === 'hard') {
      // Ulangi segera (< 1 menit) & masukkan kembali ke antrean belakang dek saat ini
      srsMap[card.hanzi] = { rating: 'hard', nextReview: now + 30 * 1000, intervalLabel: 'Segera' };
      if (!fcPageState.reviewList.includes(card.hanzi)) fcPageState.reviewList.push(card.hanzi);
      fcPageState.cards.push({ ...card });
      if (typeof showToast === 'function') {
        showToast(`😓 Sulit: "${card.hanzi}" dijadwalkan untuk diulang kembali di akhir sesi ini.`, 'info');
      }
    } else if (rating === 'good') {
      // Ulangi besok (24 jam)
      srsMap[card.hanzi] = { rating: 'good', nextReview: now + 24 * 3600 * 1000, intervalLabel: '1 Hari' };
      if (!fcPageState.knownList.includes(card.hanzi)) fcPageState.knownList.push(card.hanzi);
      this.recordMissionProgress('srs_review', 1);
      if (typeof recordUserActivity === 'function') recordUserActivity('reading', 5, 2, `srs_good_${card.hanzi}`, 1);
      if (typeof showToast === 'function') {
        showToast(`🙂 Lumayan: "${card.hanzi}" dijadwalkan ulang besok (+5 EXP)`, 'info');
      }
    } else if (rating === 'easy') {
      // Mudah / Hafal (4 hari)
      srsMap[card.hanzi] = { rating: 'easy', nextReview: now + 4 * 24 * 3600 * 1000, intervalLabel: '4 Hari' };
      if (!fcPageState.knownList.includes(card.hanzi)) fcPageState.knownList.push(card.hanzi);
      this.recordMissionProgress('srs_review', 1);
      if (typeof recordUserActivity === 'function') recordUserActivity('reading', 10, 3, `srs_easy_${card.hanzi}`, 1);
      if (typeof showToast === 'function') {
        showToast(`🤩 Mudah! "${card.hanzi}" dikuasai (+10 EXP)`, 'success');
      }
    }

    this.saveSrsMap(srsMap);
    if (typeof nextFlashcardPageCard === 'function') nextFlashcardPageCard();
  },

  // =========================================================================
  // 2. KAMUS CEPAT GLOBAL HSK 1-6 & PENCARIAN RADIKAL (MODAL POPUP)
  // =========================================================================
  stripTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  },

  getAllDictionaryEntries() {
    const map = new Map();

    // 1. Ambil dari flashcardData HSK 1-6
    if (typeof flashcardData === 'object' && flashcardData) {
      [1, 2, 3, 4, 5, 6].forEach(lvl => {
        (flashcardData[lvl] || []).forEach(c => {
          if (c && c.hanzi && !map.has(c.hanzi)) {
            map.set(c.hanzi, {
              hanzi: c.hanzi,
              pinyin: c.pinyin || '',
              meaning: c.meaning || '',
              meaning_en: c.meaning_en || '',
              example: c.example || '',
              exampleTrans: c.exampleTrans || '',
              lvl: lvl,
              source: `HSK ${lvl}`
            });
          }
        });
      });
    }

    // 2. Ambil dari kosakata Cerita HSK 1-6
    const stories = window.MandarinkuCeritaData || [];
    stories.forEach(st => {
      (st.vocabularies || []).forEach(v => {
        const cleanHanzi = v.hanzi.replace(/\s*\(.*?\)\s*/g, '').trim();
        if (cleanHanzi && !map.has(cleanHanzi)) {
          map.set(cleanHanzi, {
            hanzi: cleanHanzi,
            pinyin: v.pinyin || '',
            meaning: v.meaning || '',
            meaning_en: '',
            example: st.titleCn,
            exampleTrans: `Cerita: ${st.titleId}`,
            lvl: st.level || 1,
            source: `Cerita HSK ${st.level}`
          });
        }
      });
    });

    return Array.from(map.values());
  },

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openQuickDictModal();
      }
    });
  },

  createQuickDictModal() {
    if (document.getElementById('quick-dict-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'quick-dict-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 780px; width: 95%; max-height: 88vh; display: flex; flex-direction: column; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.6rem;">🔍</span>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0;">
                Kamus Cepat HSK 1–6 & Pencarian Radikal
              </h3>
              <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">
                Ketik Hanzi (吃), Pinyin tanpa nada (gaotie / chi), Bahasa Indonesia, atau filter berdasarkan komponen Radikal.
              </p>
            </div>
          </div>
          <button type="button" onclick="MandarinkuExtras.closeQuickDictModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">✕</button>
        </div>

        <!-- Bar Input Pencarian & Filter Level -->
        <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
          <input type="text" id="quick-dict-search-input" class="form-control" style="flex: 1; min-width: 220px; font-size: 0.95rem; padding: 10px 16px;" placeholder="🔍 Ketik kata Mandarin, Pinyin (mis: xuexi), atau arti Indonesia..." oninput="MandarinkuExtras.filterQuickDict()">
          <select id="quick-dict-level-select" class="form-control" style="width: auto; min-width: 140px; padding: 8px 12px;" onchange="MandarinkuExtras.filterQuickDict()">
            <option value="all">🌟 Semua Level</option>
            <option value="1">🌱 HSK 1</option>
            <option value="2">🌿 HSK 2</option>
            <option value="3">🌳 HSK 3</option>
            <option value="4">🍁 HSK 4</option>
            <option value="5">🌸 HSK 5</option>
            <option value="6">👑 HSK 6</option>
          </select>
        </div>

        <!-- Bar Filter Radikal Populer -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.74rem; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
            🧩 Cari Berdasarkan Radikal / Komponen Karakter:
          </div>
          <div id="quick-dict-radicals-bar" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px;">
            ${this.radicalsList.map((r, idx) => `
              <button type="button" data-rad="${r.rad}" class="cerita-filter-pill ${idx === 0 ? 'active' : ''}" style="font-size: 0.74rem; padding: 4px 10px; white-space: nowrap;" onclick="MandarinkuExtras.selectQuickDictRadical('${r.rad}', this)">
                ${r.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Daftar Hasil Pencarian Kamus -->
        <div id="quick-dict-results" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; max-height: 440px;">
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  activeRadical: 'all',

  openQuickDictModal(initialQuery = '') {
    this.createQuickDictModal();
    const modal = document.getElementById('quick-dict-modal');
    if (modal) modal.classList.add('active');
    const inp = document.getElementById('quick-dict-search-input');
    if (inp) {
      inp.value = initialQuery;
      setTimeout(() => inp.focus(), 80);
    }
    this.filterQuickDict();
  },

  closeQuickDictModal() {
    const modal = document.getElementById('quick-dict-modal');
    if (modal) modal.classList.remove('active');
  },

  selectQuickDictRadical(rad, btnEl) {
    this.activeRadical = rad;
    document.querySelectorAll('#quick-dict-radicals-bar .cerita-filter-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.filterQuickDict();
  },

  filterQuickDict() {
    const resContainer = document.getElementById('quick-dict-results');
    if (!resContainer) return;

    const qRaw = (document.getElementById('quick-dict-search-input')?.value || '').trim();
    const qLower = qRaw.toLowerCase();
    const qNoTone = this.stripTones(qRaw);
    const lvlFilter = document.getElementById('quick-dict-level-select')?.value || 'all';
    const radObj = this.radicalsList.find(r => r.rad === this.activeRadical);

    let entries = this.getAllDictionaryEntries();

    if (lvlFilter !== 'all') {
      entries = entries.filter(e => e.lvl === parseInt(lvlFilter));
    }

    if (radObj && radObj.rad !== 'all') {
      entries = entries.filter(e => {
        for (const ch of e.hanzi) {
          if (radObj.chars.includes(ch) || radObj.rad.includes(ch)) return true;
        }
        return false;
      });
    }

    if (qRaw) {
      entries = entries.filter(e => {
        const matchHanzi = e.hanzi.includes(qRaw);
        const matchPinyin = e.pinyin.toLowerCase().includes(qLower) || this.stripTones(e.pinyin).includes(qNoTone);
        const matchMeaning = e.meaning.toLowerCase().includes(qLower) || (e.meaning_en && e.meaning_en.toLowerCase().includes(qLower));
        return matchHanzi || matchPinyin || matchMeaning;
      });
    }

    const shown = entries.slice(0, 40);
    if (shown.length === 0) {
      resContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 20px; color: #64748b;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🐼</div>
          <div style="font-weight: 800; color: #334155;">Tidak ditemukan kosakata yang cocok.</div>
          <div style="font-size: 0.82rem; margin-top: 4px;">Coba gunakan kata kunci Bahasa Indonesia, Pinyin tanpa nada, atau pilih Semua Radikal.</div>
        </div>
      `;
      return;
    }

    resContainer.innerHTML = shown.map(item => {
      const saved = this.isBookmarked(item.hanzi);
      return `
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 220px;">
            <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
              <span style="font-family: var(--font-chinese, serif); font-size: 1.65rem; font-weight: 900; color: #0f172a;">
                ${item.hanzi}
              </span>
              <span style="font-size: 0.95rem; font-weight: 800; color: #ea580c;">
                [${item.pinyin}]
              </span>
              <span style="font-size: 0.7rem; font-weight: 800; background: #fff0f3; color: var(--primary-pink); padding: 2px 8px; border-radius: 99px; border: 1px solid #fecdd3;">
                ${item.source}
              </span>
            </div>
            <div style="font-size: 0.9rem; font-weight: 800; color: #065f46; margin-top: 3px;">
              🇮🇩 ${item.meaning} ${item.meaning_en ? `<span style="color:#64748b;font-weight:600;font-size:0.8rem;">• 🇬🇧 ${item.meaning_en}</span>` : ''}
            </div>
            ${item.example ? `
              <div style="font-size: 0.78rem; color: #475569; margin-top: 4px;">
                <strong>Contoh:</strong> <span style="font-family: var(--font-chinese, serif);">${item.example}</span> — <em>${item.exampleTrans}</em>
              </div>
            ` : ''}
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button type="button" class="btn-speech-mini" onclick="if(typeof speakMandarin==='function') speakMandarin('${item.hanzi.replace(/'/g, "\\'")}', 0.85)">
              🔊 Suara
            </button>
            <button type="button" class="btn-speech-mini" style="${saved ? 'background:#ecfdf5;color:#059669;border-color:#a7f3d0;' : 'background:#fff0f3;color:#e11d48;border-color:#fbcfe8;'}" onclick="MandarinkuExtras.addBookmarkWord({hanzi:'${item.hanzi.replace(/'/g, "\\'")}', pinyin:'${item.pinyin.replace(/'/g, "\\'")}', meaning:'${item.meaning.replace(/'/g, "\\'")}', lvl:${item.lvl}}); MandarinkuExtras.filterQuickDict();">
              ${saved ? '✅ Favorit' : '⭐ + Flashcard'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // =========================================================================
  // 3. PUSAT LATIHAN EKSTRA: SUSUN KALIMAT & DIKTE AUDIO (TANPA CETAK HANZI)
  // =========================================================================
  openLatihanTab(tabName) {
    if (tabName === 'print') {
      if (typeof navigateTo === 'function') {
        navigateTo('cetak-hanzi');
      } else {
        this.renderCetakHanziPage();
      }
      return;
    }
    this.activeLatihanTab = tabName || 'scramble';
    if (typeof navigateTo === 'function') {
      navigateTo('latihan-ekstra');
    } else {
      this.renderLatihanEkstraPage();
    }
  },

  renderLatihanEkstraPage() {
    const container = document.getElementById('latihan-ekstra-container');
    if (!container) return;

    if (this.activeLatihanTab === 'print') {
      this.activeLatihanTab = 'scramble';
    }

    container.innerHTML = `
      <!-- Header Banner Pusat Latihan Interaktif (Susun Kalimat & Dikte Audio) -->
      <div class="quiz-hero-banner" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 1.5px solid #fed7aa;">
        <div>
          <span class="role-badge" style="background: #ea580c; color: #ffffff; font-weight: 800; font-size: 0.75rem;">
            🧩 PUSAT LATIHAN MANDARIN INTERAKTIF (HSK 1 - 6)
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #7c2d12; margin-top: 6px;">
            Susun Kalimat (连词成句) & Dikte Audio (听写)
          </h2>
          <p style="font-size: 0.88rem; color: #9a3412; margin-top: 4px; max-width: 720px;">
            Asah struktur tata bahasa kalimat Mandarin HSK 1–6 serta uji kepekaan pendengaran lewat latihan dikte ketik Hanzi dan Pinyin.
          </p>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="cerita-filter-pill ${this.activeLatihanTab === 'scramble' ? 'active' : ''}" onclick="MandarinkuExtras.switchLatihanTab('scramble')">
            🧩 Susun Kalimat (连词成句)
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeLatihanTab === 'dictation' ? 'active' : ''}" onclick="MandarinkuExtras.switchLatihanTab('dictation')">
            🎧 Dikte Audio (听写 Tīngxiě)
          </button>
        </div>
      </div>

      <div id="latihan-ekstra-body"></div>
    `;

    this.renderLatihanTabBody();
  },

  switchLatihanTab(tabName) {
    this.activeLatihanTab = tabName;
    this.renderLatihanEkstraPage();
  },

  renderLatihanTabBody() {
    const body = document.getElementById('latihan-ekstra-body');
    if (!body) return;

    if (this.activeLatihanTab === 'scramble') {
      this.renderScrambleSection(body);
    } else if (this.activeLatihanTab === 'dictation') {
      this.renderDictationSection(body);
    }
  },

  // Render halaman tersendiri khusus Cetak Kotak Hanzi (PDF)
  renderCetakHanziPage() {
    const container = document.getElementById('cetak-hanzi-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Header Banner Halaman Cetak Kotak Hanzi -->
      <div class="quiz-hero-banner" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%); border: 1.5px solid #fecaca;">
        <div>
          <span class="role-badge" style="background: #dc2626; color: #ffffff; font-weight: 800; font-size: 0.75rem;">
            🖨️ GENERATOR LEMBAR LATIHAN MENULIS HANZI (田字格笔顺字帖)
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #7f1d1d; margin-top: 6px;">
            Cetak Lembar Latihan Kotak Hanzi & Panduan Urutan Goresan (PDF)
          </h2>
          <p style="font-size: 0.88rem; color: #991b1b; margin-top: 4px; max-width: 760px;">
            Pilih kosakata HSK 1–6, daftar Favorit Anda, atau ketik karakter Hanzi sendiri untuk dicetak lengkap dengan <strong>Urutan Goresan (笔顺), Kaidah Arah Penulisan, dan Kisi Kotak Tian Zi Ge</strong>.
          </p>
        </div>
        <div>
          <button type="button" class="btn-primary-sakura" style="margin: 0; background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 10px 22px; font-size: 0.88rem;" onclick="MandarinkuExtras.printHanziSheet()">
            🖨️ Cetak / Simpan PDF Sekarang
          </button>
        </div>
      </div>

      <div id="cetak-hanzi-body"></div>
    `;

    this.refreshPrintSheetView();
  },

  refreshPrintSheetView(onlyPreview = false) {
    if (onlyPreview) {
      const previewEl = document.getElementById('tianzige-printable-area');
      if (previewEl) {
        previewEl.innerHTML = this.renderPrintSheetPreviewInner();
        return;
      }
    }
    const cetakBody = document.getElementById('cetak-hanzi-body');
    if (cetakBody) {
      this.renderPrintSheetSection(cetakBody);
    }
  },

  // --- SUB-FITUR 3A: SUSUN KALIMAT (SENTENCE SCRAMBLE / 连词成句) ---
  getScrambleItemsByLevel() {
    const items = this.scrambleBank.filter(x => this.scrambleLevel === 'all' || x.level === parseInt(this.scrambleLevel));
    return items.length ? items : this.scrambleBank;
  },

  initScrambleRound() {
    const items = this.getScrambleItemsByLevel();
    if (this.scrambleIndex >= items.length) this.scrambleIndex = 0;
    const current = items[this.scrambleIndex];
    // Buat urutan indeks acak yang tidak sama persis dengan urutan asli
    const indices = current.words.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    if (indices.every((v, idx) => v === idx) && indices.length > 1) {
      indices.reverse();
    }
    this.scrambleShuffledOrder = indices;
    this.scramblePlacedIndices = [];
    this.scrambleChecked = null;
  },

  getScrambleSolvedSet() {
    try {
      const raw = localStorage.getItem('mandarinku_scramble_solved_v1');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  },

  markScrambleSolved(sentenceKey) {
    try {
      const s = this.getScrambleSolvedSet();
      s.add(sentenceKey);
      localStorage.setItem('mandarinku_scramble_solved_v1', JSON.stringify(Array.from(s)));
    } catch (e) {}
  },

  renderScrambleSection(container) {
    const items = this.getScrambleItemsByLevel();
    if (this.scrambleIndex >= items.length) this.scrambleIndex = 0;
    const item = items[this.scrambleIndex];
    const solvedSet = this.getScrambleSolvedSet();

    if (!this.scrambleShuffledOrder || this.scrambleShuffledOrder.length !== item.words.length) {
      this.initScrambleRound();
    }

    const availableIndices = this.scrambleShuffledOrder.filter(idx => !this.scramblePlacedIndices.includes(idx));
    const solvedCountInLevel = items.filter(it => solvedSet.has(it.words.join(''))).length;

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <!-- Toolbar Level & Bantuan Pinyin -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; border-bottom: 2px solid #f1f5f9; padding-bottom: 14px;">
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 0.85rem; color: #475569;">Pilih Level:</span>
            <button class="cerita-filter-pill ${this.scrambleLevel === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setScrambleLevel('all')" style="padding: 4px 12px; font-size: 0.78rem;">
              Semua (${this.scrambleBank.length} Soal)
            </button>
            ${[1, 2, 3, 4, 5, 6].map(lvl => {
              const cnt = this.scrambleBank.filter(x => x.level === lvl).length;
              return `
                <button class="cerita-filter-pill ${this.scrambleLevel === lvl ? 'active' : ''}" onclick="MandarinkuExtras.setScrambleLevel(${lvl})" style="padding: 4px 12px; font-size: 0.78rem;">
                  HSK ${lvl} (${cnt} Soal)
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 99px;">
              ✓ Terjawab: ${solvedCountInLevel} / ${items.length}
            </span>
            <button type="button" class="cerita-control-btn ${this.scrambleShowPinyin ? 'active' : ''}" onclick="MandarinkuExtras.toggleScramblePinyin()">
              🔤 ${this.scrambleShowPinyin ? 'Tutup Pinyin Kata' : 'Tampilkan Pinyin Kata'}
            </button>
            <span style="font-size: 0.82rem; font-weight: 800; color: #ea580c;">
              Soal ${this.scrambleIndex + 1} / ${items.length}
            </span>
          </div>
        </div>

        <!-- Bar Lompat Nomor Soal Cepat -->
        <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-bottom: 18px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #64748b; margin-right: 4px;">Nomor Soal:</span>
          ${items.map((qItem, idx) => {
            const isCurr = idx === this.scrambleIndex;
            const isDone = solvedSet.has(qItem.words.join(''));
            return `
              <button type="button" onclick="MandarinkuExtras.jumpToScrambleQuestion(${idx})" style="min-width: 32px; height: 30px; padding: 0 6px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.15s; border: 1.5px solid ${isCurr ? '#ea580c' : (isDone ? '#6ee7b7' : '#cbd5e1')}; background: ${isCurr ? '#ea580c' : (isDone ? '#ecfdf5' : '#f8fafc')}; color: ${isCurr ? '#ffffff' : (isDone ? '#059669' : '#475569')};" title="Soal ${idx + 1}: ${qItem.meaning}">
                ${idx + 1}${isDone && !isCurr ? '✓' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Arti Kalimat Target -->
        <div style="background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size: 0.74rem; font-weight: 800; color: #c2410c; text-transform: uppercase;">
              🎯 HSK ${item.level} • Susun Kata Berikut Agar Sesuai Dengan Arti:
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 2px;">
              "${item.meaning}"
            </div>
          </div>
          <button type="button" class="btn-speech-mini" onclick="if(typeof speakMandarin==='function') speakMandarin('${item.words.join('').replace(/'/g, "\\'")}', 0.8)">
            🔊 Dengar Petunjuk Audio
          </button>
        </div>

        <!-- Area Kotak Jawaban Kalimat yang Disusun -->
        <div style="margin-bottom: 18px;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #64748b; margin-bottom: 8px;">
            ✍️ Kalimat Jawaban Anda (Klik kata untuk melepas):
          </div>
          <div style="min-height: 76px; background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 16px; padding: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            ${this.scramblePlacedIndices.length === 0 ? `
              <span style="color: #94a3b8; font-size: 0.88rem; font-weight: 600;">Klik potongan kata Mandarin di bawah untuk menyusun kalimat...</span>
            ` : this.scramblePlacedIndices.map((wordIdx, pos) => `
              <button type="button" class="scramble-word-tile placed" onclick="MandarinkuExtras.removeScrambleTile(${pos})">
                ${this.scrambleShowPinyin ? `<span style="font-size: 0.72rem; font-family: 'Nunito', sans-serif; color: #ea580c; font-weight: 700;">${item.pinyin[wordIdx]}</span>` : ''}
                <span>${item.words[wordIdx]}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Area Pilihan Kata Acak -->
        <div style="margin-bottom: 22px;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #64748b; margin-bottom: 8px;">
            🧩 Pilihan Potongan Kata Acak:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; min-height: 60px;">
            ${availableIndices.map(wordIdx => `
              <button type="button" class="scramble-word-tile" onclick="MandarinkuExtras.placeScrambleTile(${wordIdx})">
                ${this.scrambleShowPinyin ? `<span style="font-size: 0.72rem; font-family: 'Nunito', sans-serif; color: #ea580c; font-weight: 700;">${item.pinyin[wordIdx]}</span>` : ''}
                <span>${item.words[wordIdx]}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Feedback Validasi -->
        ${this.scrambleChecked !== null ? `
          <div style="margin-bottom: 20px; padding: 14px 18px; border-radius: 14px; background: ${this.scrambleChecked ? '#ecfdf5' : '#fef2f2'}; border: 1.5px solid ${this.scrambleChecked ? '#6ee7b7' : '#fecaca'}; color: ${this.scrambleChecked ? '#065f46' : '#991b1b'};">
            <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">
              ${this.scrambleChecked ? '🎉 Susunan Kalimat Tepat Sekali! (+15 EXP)' : '❌ Urutan kalimat belum tepat.'}
            </div>
            <div style="font-size: 0.88rem;">
              <strong>Kalimat Benar:</strong> <span style="font-family: var(--font-chinese, serif); font-size: 1.1rem; font-weight: 800;">${item.words.join('')}。</span> (${item.pinyin.join(' ')})
            </div>
            <div style="font-size: 0.82rem; margin-top: 4px;">
              📐 <strong>Catatan Tata Bahasa:</strong> ${item.grammar}
            </div>
          </div>
        ` : ''}

        <!-- Tombol Aksi -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-learn-outline" style="padding: 8px 16px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.prevScrambleRound()">
              ← Sebelumnya
            </button>
            <button type="button" class="btn-learn-outline" style="padding: 8px 16px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.initScrambleRound(); MandarinkuExtras.renderLatihanTabBody();">
              🔄 Acak Ulang Kata
            </button>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn-primary-sakura" style="padding: 9px 22px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.checkScrambleAnswer()">
              ✅ Periksa Susunan Kalimat
            </button>
            <button type="button" class="btn-learn-outline" style="padding: 9px 18px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.nextScrambleRound()">
              Soal Berikutnya →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  jumpToScrambleQuestion(idx) {
    this.scrambleIndex = idx;
    this.initScrambleRound();
    this.renderLatihanTabBody();
  },

  prevScrambleRound() {
    const items = this.getScrambleItemsByLevel();
    this.scrambleIndex = (this.scrambleIndex - 1 + items.length) % items.length;
    this.initScrambleRound();
    this.renderLatihanTabBody();
  },

  setScrambleLevel(lvl) {
    this.scrambleLevel = lvl;
    this.scrambleIndex = 0;
    this.initScrambleRound();
    this.renderLatihanTabBody();
  },

  toggleScramblePinyin() {
    this.scrambleShowPinyin = !this.scrambleShowPinyin;
    this.renderLatihanTabBody();
  },

  placeScrambleTile(wordIdx) {
    this.scramblePlacedIndices.push(wordIdx);
    this.scrambleChecked = null;
    this.renderLatihanTabBody();
  },

  removeScrambleTile(pos) {
    this.scramblePlacedIndices.splice(pos, 1);
    this.scrambleChecked = null;
    this.renderLatihanTabBody();
  },

  checkScrambleAnswer() {
    const items = this.getScrambleItemsByLevel();
    const item = items[this.scrambleIndex];
    const userSentence = this.scramblePlacedIndices.map(i => item.words[i]).join('');
    const targetSentence = item.words.join('');
    this.scrambleChecked = (userSentence === targetSentence);

    if (this.scrambleChecked) {
      this.markScrambleSolved(targetSentence);
      this.recordMissionProgress('practice_extra', 1);
      if (typeof recordUserActivity === 'function') recordUserActivity('writing', 15, 3, `scramble_${targetSentence}`, 1);
      if (typeof speakMandarin === 'function') speakMandarin(targetSentence, 0.85);
    }
    this.renderLatihanTabBody();
  },

  nextScrambleRound() {
    const items = this.getScrambleItemsByLevel();
    this.scrambleIndex = (this.scrambleIndex + 1) % items.length;
    this.initScrambleRound();
    this.renderLatihanTabBody();
  },

  // --- SUB-FITUR 3B: LATIHAN DIKTE AUDIO (听写 - TĪNGXIĚ) ---
  getDictationPool() {
    const all = this.getAllDictionaryEntries();
    const filtered = all.filter(x => this.dictationLevel === 'all' || x.lvl === parseInt(this.dictationLevel));
    return filtered.length ? filtered : all;
  },

  renderDictationSection(container) {
    const pool = this.getDictationPool();
    if (this.dictationIndex >= pool.length) this.dictationIndex = 0;
    const current = pool[this.dictationIndex];

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 14px;">
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 0.85rem; color: #475569;">Level Dikte:</span>
            ${[1, 2, 3, 4, 5, 6].map(lvl => `
              <button class="cerita-filter-pill ${this.dictationLevel === lvl ? 'active' : ''}" onclick="MandarinkuExtras.setDictationLevel(${lvl})" style="padding: 4px 12px; font-size: 0.78rem;">HSK ${lvl}</button>
            `).join('')}
          </div>
          <span style="font-size: 0.82rem; font-weight: 800; color: #ea580c;">
            Kata ${this.dictationIndex + 1} / ${pool.length}
          </span>
        </div>

        <div style="text-align: center; max-width: 540px; margin: 0 auto; padding: 16px 0;">
          <div style="font-size: 0.82rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 10px;">
            🎧 Putar Suara Lalu Ketik Karakter Hanzi atau Pinyin-nya:
          </div>

          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap;">
            <button type="button" class="btn-primary-sakura" style="padding: 12px 24px; font-size: 0.95rem; margin: 0; background: linear-gradient(135deg, #ea580c, #c2410c);" onclick="if(typeof speakMandarin==='function') speakMandarin('${current.hanzi.replace(/'/g, "\\'")}', 0.85)">
              🔊 Putar Audio Normal (0.85x)
            </button>
            <button type="button" class="btn-learn-outline" style="padding: 12px 20px; font-size: 0.88rem; margin: 0;" onclick="if(typeof speakMandarin==='function') speakMandarin('${current.hanzi.replace(/'/g, "\\'")}', 0.45)">
              🐢 Putar Lambat (0.45x)
            </button>
          </div>

          ${this.dictationShowHint ? `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px 14px; margin-bottom: 14px; font-size: 0.85rem; color: #1e40af; font-weight: 700;">
              💡 Petunjuk Arti: <strong>${current.meaning}</strong> (${current.hanzi.length} Karakter Hanzi)
            </div>
          ` : ''}

          <div style="display: flex; gap: 10px; margin-bottom: 14px;">
            <input type="text" id="dictation-answer-input" class="form-control" style="text-align: center; font-size: 1.25rem; font-weight: 800; padding: 12px;" placeholder="Ketik Hanzi (mis: ${current.hanzi[0]}...) atau Pinyin..." value="${this.dictationInput}" oninput="MandarinkuExtras.dictationInput = this.value" onkeydown="if(event.key==='Enter') MandarinkuExtras.checkDictationAnswer()">
          </div>

          ${this.dictationResult !== null ? `
            <div style="padding: 14px 18px; border-radius: 14px; margin-bottom: 16px; text-align: left; background: ${this.dictationResult ? '#ecfdf5' : '#fef2f2'}; border: 1.5px solid ${this.dictationResult ? '#6ee7b7' : '#fecaca'}; color: ${this.dictationResult ? '#065f46' : '#991b1b'};">
              <div style="font-weight: 800; font-size: 0.95rem;">
                ${this.dictationResult ? '✅ Benar Sekali! Pendengaran & Penulisan Anda Tepat (+15 EXP)' : '❌ Belum tepat. Perhatikan penulisan yang benar:'}
              </div>
              <div style="margin-top: 6px; font-size: 1.05rem;">
                <strong style="font-family: var(--font-chinese, serif); font-size: 1.5rem;">${current.hanzi}</strong>
                <span style="color: #ea580c; font-weight: 800; margin-left: 8px;">[${current.pinyin}]</span>
                — <strong>${current.meaning}</strong>
              </div>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn-learn-outline" style="padding: 9px 16px; font-size: 0.84rem; margin: 0;" onclick="MandarinkuExtras.dictationShowHint = !MandarinkuExtras.dictationShowHint; MandarinkuExtras.renderLatihanTabBody();">
              💡 ${this.dictationShowHint ? 'Sembunyikan Petunjuk' : 'Beri Petunjuk Arti'}
            </button>
            <button type="button" class="btn-primary-sakura" style="padding: 9px 24px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.checkDictationAnswer()">
              ✅ Cek Jawaban Dikte
            </button>
            <button type="button" class="btn-learn-outline" style="padding: 9px 18px; font-size: 0.84rem; margin: 0;" onclick="MandarinkuExtras.nextDictationWord()">
              Kata Berikutnya →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  setDictationLevel(lvl) {
    this.dictationLevel = lvl;
    this.dictationIndex = 0;
    this.dictationInput = '';
    this.dictationResult = null;
    this.dictationShowHint = false;
    this.renderLatihanTabBody();
  },

  checkDictationAnswer() {
    const pool = this.getDictationPool();
    const current = pool[this.dictationIndex];
    const ans = (this.dictationInput || '').trim();
    if (!ans) return;

    const matchHanzi = ans === current.hanzi;
    const matchPinyin = this.stripTones(ans).replace(/\s+/g, '') === this.stripTones(current.pinyin).replace(/\s+/g, '');

    this.dictationResult = (matchHanzi || matchPinyin);
    if (this.dictationResult) {
      this.recordMissionProgress('practice_extra', 1);
      if (typeof recordUserActivity === 'function') recordUserActivity('listening', 15, 2, `dict_${current.hanzi}`, 1);
    }
    this.renderLatihanTabBody();
  },

  nextDictationWord() {
    const pool = this.getDictationPool();
    this.dictationIndex = (this.dictationIndex + 1) % pool.length;
    this.dictationInput = '';
    this.dictationResult = null;
    this.dictationShowHint = false;
    this.renderLatihanTabBody();
    const nextItem = pool[this.dictationIndex];
    if (nextItem && typeof speakMandarin === 'function') {
      setTimeout(() => speakMandarin(nextItem.hanzi, 0.85), 150);
    }
  },

  // --- SUB-FITUR 3C: GENERATOR CETAK LEMBAR LATIHAN KOTAK HANZI (TIAN ZI GE PDF) ---
  extractUniqueHanziChars(str) {
    const chars = [];
    for (const ch of (str || '')) {
      if (/[\u4e00-\u9fff]/.test(ch) && !chars.includes(ch)) {
        chars.push(ch);
      }
    }
    return chars;
  },

  // Mengambil detail urutan goresan (strokeSteps), kaidah penulisan (rules), pinyin & arti per karakter
  getCharacterStrokeDetails(ch) {
    // 1. Cek dari database 120 karakter utama di State.strokeCharacters
    if (typeof State === 'object' && Array.isArray(State.strokeCharacters)) {
      const exact = State.strokeCharacters.find(item => item.char === ch);
      if (exact) {
        return {
          char: ch,
          pinyin: exact.pinyin || '-',
          meaning: exact.meaning || '-',
          strokesCount: exact.strokesCount || (exact.strokeSteps ? exact.strokeSteps.length : 6),
          hskLevel: exact.hskLevel || 'HSK',
          rules: exact.rules || 'Atas ke Bawah, Kiri ke Kanan, Luar Dulu Baru Dalam',
          strokeSteps: Array.isArray(exact.strokeSteps) && exact.strokeSteps.length > 0
            ? exact.strokeSteps
            : ['1. 横 (Héng) - Tarik mendatar dari kiri ke kanan', '2. 竖 (Shù) - Tarik tegak lurus dari atas ke bawah']
        };
      }
    }

    // 2. Cari Pinyin & Arti dari kamus gabungan (Flashcard HSK 1-6 + Kosakata Cerita)
    const allDict = this.getAllDictionaryEntries();
    let foundPinyin = '';
    let foundMeaning = '';
    let foundLevel = 'HSK';

    const exactWord = allDict.find(d => d.hanzi === ch);
    if (exactWord) {
      foundPinyin = exactWord.pinyin;
      foundMeaning = exactWord.meaning;
      foundLevel = `HSK ${exactWord.lvl}`;
    } else {
      const partialWord = allDict.find(d => d.hanzi && d.hanzi.includes(ch));
      if (partialWord) {
        const idx = partialWord.hanzi.indexOf(ch);
        const pyParts = (partialWord.pinyin || '').trim().split(/\s+/);
        foundPinyin = pyParts[idx] || partialWord.pinyin;
        foundMeaning = `Bagian dari kata "${partialWord.hanzi}" (${partialWord.meaning})`;
        foundLevel = `HSK ${partialWord.lvl}`;
      }
    }

    // 3. Deteksi komponen radikal untuk memberikan kaidah & langkah goresan spesifik
    let rules = 'Tulis dari Atas ke Bawah, Kiri ke Kanan, Mendatar (横) mendahului Tegak (竖)';
    let steps = [
      '1. Tulis komponen bagian kiri/atas terlebih dahulu secara berurutan',
      '2. Tarik goresan mendatar (横 Héng →) sebelum goresan tegak (竖 Shù ↓)',
      '3. Tarik goresan miring kiri (撇 Piě ↙) sebelum sapuan kanan (捺 Nà ↘)',
      '4. Selesaikan bagian dalam/bawah dan tutup dengan titik/garis terakhir'
    ];
    let estStrokes = 7;

    const radGuideMap = [
      { chars: '没洗海河湖汽汁满游温清渴汤泳浪深法活流济', rules: 'Kiri ke Kanan: Tulis radikal 3 titik air (氵) di kiri dulu, baru komponen kanan', steps: ['1. 点 (Diǎn ↘) - Titik air pertama di kiri atas', '2. 点 (Diǎn ↘) - Titik air kedua di kiri tengah', '3. 提 (Tí ↗) - Sapuan miring naik dari kiri bawah', '4. 横/撇 (→/↙) - Mulai goresan atas komponen kanan', '5. 竖/折 (↓/┐) - Lanjutkan badan tengah komponen kanan', '6. 横/捺 (→/↘) - Goresan penutup bawah kanan'] },
      { chars: '你他们住作休件低体但位伴信借值假停健偶', rules: 'Kiri ke Kanan: Tulis radikal orang berdiri (亻) di sisi kiri dulu, lalu komponen kanan', steps: ['1. 撇 (Piě ↙) - Garis miring kiri atas untuk radikal orang (亻)', '2. 竖 (Shù ↓) - Garis tegak lurus ke bawah untuk radikal orang (亻)', '3. 横/撇 (→/↙) - Goresan bagian atas komponen sebelah kanan', '4. 竖/折 (↓/┐) - Goresan tengah komponen sebelah kanan', '5. 横/捺 (→/↘) - Goresan penutup bawah sebelah kanan'] },
      { chars: '说请谢谢读认识话语谁诉试课讲讨论诚谅译', rules: 'Kiri ke Kanan: Tulis radikal bahasa/ucapan (讠) di kiri dulu, lalu komponen kanan', steps: ['1. 点 (Diǎn ↘) - Titik atas radikal bahasa (讠)', '2. 横折提 (Héngzhétí →↓↗) - Mendatar, tegak ke bawah, lalu angkat naik ke kanan', '3. 横/撇 (→/↙) - Goresan pembuka komponen kanan atas', '4. 竖/横折 (↓/┐) - Goresan badan tengah komponen kanan', '5. 横/捺 (→/↘) - Goresan penutup bawah komponen kanan'] },
      { chars: '打找把拿拉拍排报推提接换搬掉擦握按择指', rules: 'Kiri ke Kanan: Tulis radikal tangan (扌) di sisi kiri dulu, lalu komponen kanan', steps: ['1. 横 (Héng →) - Garis mendatar pendek radikal tangan (扌)', '2. 竖钩 (Shùgōu ↓↖) - Garis tegak lurus berkait di tengah radikal tangan', '3. 提 (Tí ↗) - Sapuan miring naik memotong garis tegak', '4. 横/撇 (→/↙) - Goresan awal komponen sebelah kanan', '5. 竖/捺 (↓/↘) - Goresan akhir penutup komponen kanan'] },
      { chars: '吃喝叫吗呢吧听唱吹味响哭哥喜售咖啡吵吸', rules: 'Kiri ke Kanan: Tulis radikal mulut (口) di kiri dulu (Tegak, Mendatar-Tekuk, Tutup Bawah)', steps: ['1. 竖 (Shù ↓) - Garis tegak sisi kiri kotak mulut (口)', '2. 横折 (Héngzhé →↓) - Garis mendatar atas lalu tekuk ke bawah', '3. 横 (Héng →) - Garis mendatar penutup bawah kotak mulut', '4. 撇/横 (↙/→) - Goresan bagian atas komponen kanan', '5. 竖/捺 (↓/↘) - Goresan penutup komponen kanan'] },
      { chars: '好她妈姐妹姓如妻始娘嫁媒嫌嫩娱', rules: 'Kiri ke Kanan: Tulis radikal wanita (女) di sisi kiri dulu, baru komponen kanan', steps: ['1. 撇点 (Piědiǎn ↙↘) - Miring ke kiri lalu tekuk serong ke kanan bawah', '2. 撇 (Piě ↙) - Garis miring dari kanan atas ke kiri bawah', '3. 提 (Tí ↗) - Garis angkatan mendatar naik dari kiri ke kanan', '4. 横/竖 (→/↓) - Goresan pembuka komponen kanan', '5. 横/捺 (→/↘) - Goresan penutup komponen kanan'] },
      { chars: '这那远近进送还过道选迷退追适逃逛速造逢', rules: 'Dalam Dulu Baru Luar: Tulis komponen utama di bagian dalam dulu, terakhir radikal jalan (辶) di kiri-bawah', steps: ['1. 横/撇 (→/↙) - Tulis bagian atas komponen dalam terlebih dahulu', '2. 竖/横 (↓/→) - Selesaikan seluruh bagian tengah komponen dalam', '3. 点 (Diǎn ↘) - Titik atas radikal jalan (辶) di sisi kiri', '4. 横折折撇 (→↙→↙) - Garis berliku radikal jalan di kiri bawah', '5. 平捺 (Píngnà ↘) - Sapuan mendatar memanjang ke kanan bawah sebagai alas'] },
      { chars: '茶花草菜苹药蓝蕉萄蔬落著藏艺节苦英茂', rules: 'Atas ke Bawah: Tulis radikal rumput/tumbuhan (艹) di paling atas dulu, baru bagian bawah', steps: ['1. 横 (Héng →) - Garis mendatar panjang radikal rumput (艹) di atas', '2. 竖 (Shù ↓) - Garis tegak pendek kiri memotong garis mendatar', '3. 竖 (Shù ↓) - Garis tegak pendek kanan memotong garis mendatar', '4. 撇/横 (↙/→) - Goresan tengah di bawah radikal rumput', '5. 竖/捺 (↓/↘) - Goresan penutup bagian paling bawah'] }
    ];

    for (const rg of radGuideMap) {
      if (rg.chars.includes(ch)) {
        rules = rg.rules;
        steps = rg.steps;
        estStrokes = rg.steps.length + 2;
        break;
      }
    }

    return {
      char: ch,
      pinyin: foundPinyin || '-',
      meaning: foundMeaning || 'Karakter Hanzi Mandarin',
      strokesCount: estStrokes,
      hskLevel: foundLevel,
      rules: rules,
      strokeSteps: steps
    };
  },

  // Mengekstrak simbol visual goresan singkat + panah arah untuk ditampilkan di kotak langkah
  formatStrokeBadgeSymbol(stepText) {
    if (stepText.includes('横折')) return '𠃍 Héngzhé (→↓)';
    if (stepText.includes('横撇')) return ' Héngpiě (→↙)';
    if (stepText.includes('竖钩')) return '亅 Shùgōu (↓↖)';
    if (stepText.includes('弯钩') || stepText.includes('斜钩')) return '㇂ Gōu (↘↖)';
    if (stepText.includes('撇点')) return '𡿨 Piědiǎn (↙↘)';
    if (stepText.includes('平捺') || stepText.includes('捺')) return '㇏ Nà (↘)';
    if (stepText.includes('撇')) return '丿 Piě (↙)';
    if (stepText.includes('竖')) return '丨 Shù (↓)';
    if (stepText.includes('横')) return '一 Héng (→)';
    if (stepText.includes('点')) return '丶 Diǎn (↘)';
    if (stepText.includes('提')) return '㇀ Tí (↗)';
    return '✍️ Langkah';
  },

  // Vektor goresan bertahap bawaan (offline fallback) dalam koordinat 0..100
  builtinCenterlineStrokes: {
    '叫': [
      'M 18 28 L 18 66',
      'M 18 30 L 40 28 L 38 62',
      'M 18 63 L 39 62',
      'M 56 24 L 56 64 L 84 56',
      'M 76 14 L 76 90'
    ],
    '什': [
      'M 36 16 Q 26 38 12 56',
      'M 27 36 L 27 88',
      'M 44 47 L 88 45',
      'M 66 14 L 66 88'
    ],
    '么': [
      'M 48 16 Q 35 32 22 44',
      'M 58 28 Q 38 56 24 74 L 74 68',
      'M 66 54 Q 76 66 82 78'
    ],
    '名': [
      'M 46 14 Q 34 28 20 40',
      'M 44 22 L 68 20 Q 52 46 16 64',
      'M 36 34 Q 44 40 48 46',
      'M 32 62 L 35 88',
      'M 33 64 L 72 61 L 68 85',
      'M 35 86 L 69 85'
    ],
    '字': [
      'M 48 11 Q 52 17 53 23',
      'M 22 24 Q 20 34 17 40',
      'M 22 26 L 78 23 Q 82 23 74 35',
      'M 34 42 L 64 39 Q 56 48 49 54',
      'M 49 54 Q 54 72 49 87 Q 46 92 38 84',
      'M 18 63 L 84 60'
    ],
    '他': [
      'M 33 16 Q 24 38 11 55',
      'M 25 36 L 25 88',
      'M 38 48 L 78 38 Q 84 37 78 56 Q 75 63 69 57',
      'M 59 18 L 59 70',
      'M 45 32 L 45 76 Q 45 86 68 86 L 84 85 Q 90 84 88 70'
    ],
    '她': [
      'M 28 18 Q 22 44 16 60 Q 28 66 39 76',
      'M 40 36 Q 32 62 14 82',
      'M 11 49 L 44 42',
      'M 48 48 L 82 38 Q 87 37 81 56 Q 78 63 73 57',
      'M 64 18 L 64 70',
      'M 52 32 L 52 76 Q 52 86 72 86 L 85 85 Q 90 84 88 70'
    ],
    '们': [
      'M 32 16 Q 23 38 11 55',
      'M 24 36 L 24 88',
      'M 43 20 Q 48 26 50 32',
      'M 42 38 L 42 86',
      'M 56 24 L 82 21 L 82 84 Q 82 90 72 82'
    ],
    '你': [
      'M 32 16 Q 23 38 11 55',
      'M 24 36 L 24 88',
      'M 54 16 Q 45 32 36 44',
      'M 48 28 L 82 25 Q 86 25 76 38',
      'M 62 38 L 62 84 Q 62 90 53 82',
      'M 46 52 Q 39 64 33 74',
      'M 75 52 Q 83 63 88 74'
    ],
    '好': [
      'M 29 18 Q 22 44 16 60 Q 28 66 40 76',
      'M 41 36 Q 33 62 14 82',
      'M 11 49 L 45 42',
      'M 52 24 L 80 21 Q 72 34 64 44',
      'M 64 44 Q 70 68 64 86 Q 61 91 52 82',
      'M 46 54 L 90 51'
    ],
    '我': [
      'M 43 18 Q 31 25 18 30',
      'M 14 46 L 86 41',
      'M 33 27 L 33 84 Q 33 90 24 82',
      'M 14 70 L 46 54',
      'M 56 14 Q 60 56 84 86 Q 89 90 88 74',
      'M 80 50 Q 67 66 48 80',
      'M 71 18 Q 78 24 82 30'
    ],
    '是': [
      'M 31 16 L 34 44',
      'M 31 17 L 69 15 L 66 42',
      'M 33 29 L 67 28',
      'M 34 42 L 66 41',
      'M 16 54 L 84 51',
      'M 50 53 L 50 76',
      'M 50 65 L 74 64',
      'M 32 62 Q 25 76 15 86',
      'M 29 71 Q 56 82 86 88'
    ],
    '中': [
      'M 24 32 L 28 62',
      'M 24 34 L 76 31 L 72 59',
      'M 28 60 L 72 58',
      'M 50 12 L 50 90'
    ],
    '国': [
      'M 20 16 L 20 88',
      'M 20 18 L 80 16 L 80 88',
      'M 32 32 L 68 30',
      'M 50 32 L 50 68',
      'M 34 49 L 66 48',
      'M 62 54 Q 68 59 71 64',
      'M 29 70 L 71 68',
      'M 20 86 L 80 85'
    ],
    '人': [
      'M 52 16 Q 40 56 14 84',
      'M 46 38 Q 66 66 88 84'
    ],
    '学': [
      'M 28 14 Q 33 21 35 26',
      'M 48 12 Q 52 19 54 25',
      'M 72 12 Q 66 21 60 27',
      'M 20 28 Q 18 38 15 44',
      'M 20 30 L 80 27 Q 84 27 76 39',
      'M 35 44 L 64 41 Q 56 49 50 55',
      'M 50 55 Q 55 72 50 87 Q 47 92 38 84',
      'M 16 64 L 84 61'
    ],
    '习': [
      'M 24 22 L 76 19 L 74 82 Q 74 90 62 80',
      'M 34 40 Q 44 47 48 53',
      'M 24 72 L 58 54'
    ],
    '汉': [
      'M 18 22 Q 25 27 28 32',
      'M 14 44 Q 21 49 25 54',
      'M 16 82 L 30 58',
      'M 42 28 L 78 24 Q 66 62 36 84',
      'M 44 38 Q 64 66 86 84'
    ],
    '语': [
      'M 22 18 Q 29 25 32 31',
      'M 12 38 L 28 36 L 28 76 L 38 64',
      'M 46 20 L 82 18',
      'M 62 21 L 56 48',
      'M 44 35 L 76 33 L 73 48',
      'M 40 50 L 88 48',
      'M 48 62 L 50 86',
      'M 48 64 L 78 62 L 75 84',
      'M 50 84 L 76 83'
    ]
  },

  initStrokeCacheFromStorage() {
    if (this._strokeCacheLoaded) return;
    this._strokeCacheLoaded = true;
    try {
      const raw = localStorage.getItem('mandarinku_stroke_svg_cache_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.strokePathsCache = Object.assign({}, parsed, this.strokePathsCache);
        }
      }
    } catch (e) {}
  },

  ensureStrokePathsLoaded(chars) {
    this.initStrokeCacheFromStorage();
    if (!this._fetchingStrokeChars) this._fetchingStrokeChars = new Set();

    const missing = (chars || []).filter(ch => !this.strokePathsCache[ch] && !this._fetchingStrokeChars.has(ch));
    if (missing.length === 0) return;

    missing.forEach(ch => {
      this._fetchingStrokeChars.add(ch);
      fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(ch)}.json`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && Array.isArray(data.strokes) && data.strokes.length > 0) {
            this.strokePathsCache[ch] = data.strokes;
            try {
              localStorage.setItem('mandarinku_stroke_svg_cache_v1', JSON.stringify(this.strokePathsCache));
            } catch (e) {}
            this.refreshPrintSheetView(true);
          }
        })
        .catch(() => {})
        .finally(() => {
          this._fetchingStrokeChars.delete(ch);
        });
    });
  },

  // Menghasilkan array path goresan untuk karakter apa pun (dari CDN MakeMeAHanzi, kamus bawaan, atau sintesis langkah goresan)
  getCharacterStrokeVectorInfo(ch, info) {
    this.initStrokeCacheFromStorage();
    if (Array.isArray(this.strokePathsCache[ch]) && this.strokePathsCache[ch].length > 0) {
      return {
        mode: 'makemeahanzi',
        strokes: this.strokePathsCache[ch]
      };
    }
    if (Array.isArray(this.builtinCenterlineStrokes[ch])) {
      return {
        mode: 'centerline',
        strokes: this.builtinCenterlineStrokes[ch]
      };
    }

    // Sintesis otomatis dari info.strokeSteps bila sedang offline & karakter di luar daftar bawaan
    const steps = (info && Array.isArray(info.strokeSteps) && info.strokeSteps.length > 0)
      ? info.strokeSteps
      : ['横', '竖', '撇', '捺'];
    const total = steps.length;
    const synth = steps.map((st, idx) => {
      const ratio = total > 1 ? idx / (total - 1) : 0.5;
      const yBase = Math.round(20 + ratio * 60);
      const xBase = Math.round(22 + ratio * 52);
      if (st.includes('横折')) return `M 24 ${yBase} L 74 ${yBase - 2} L 71 ${Math.min(86, yBase + 26)}`;
      if (st.includes('横撇')) return `M 26 ${yBase} L 70 ${yBase - 2} Q 54 ${Math.min(86, yBase + 28)} 24 ${Math.min(88, yBase + 34)}`;
      if (st.includes('竖钩')) return `M ${xBase} 18 L ${xBase} 82 Q ${xBase} 88 ${xBase - 10} 80`;
      if (st.includes('弯钩') || st.includes('斜钩')) return `M ${xBase - 6} 18 Q ${xBase + 8} 54 ${xBase} 84 Q ${xBase - 4} 89 ${xBase - 12} 80`;
      if (st.includes('撇点')) return `M 38 18 Q 28 46 22 60 Q 38 68 54 80`;
      if (st.includes('捺')) return `M 32 ${Math.max(20, yBase - 16)} Q 56 ${yBase + 6} 84 ${Math.min(88, yBase + 22)}`;
      if (st.includes('撇')) return `M ${Math.min(76, xBase + 14)} ${Math.max(16, yBase - 14)} Q ${xBase} ${yBase + 6} ${Math.max(14, xBase - 20)} ${Math.min(86, yBase + 22)}`;
      if (st.includes('竖')) return `M ${xBase} 18 L ${xBase} 84`;
      if (st.includes('点')) return `M ${xBase - 4} ${yBase - 5} Q ${xBase + 3} ${yBase + 2} ${xBase + 6} ${yBase + 8}`;
      if (st.includes('提')) return `M 18 ${Math.min(84, yBase + 10)} L 46 ${Math.max(22, yBase - 8)}`;
      return `M 20 ${yBase} L 80 ${yBase - 2}`;
    });

    return {
      mode: 'centerline',
      strokes: synth
    };
  },

  // Merender isi di dalam 1 kotak Tian Zi Ge (Goresan penuh hitam, Goresan bertahap abu-abu 1..k, atau Jejak penuh abu-abu)
  renderStrokeInsideTianZiGeBox(ch, uptoStepCount, color, info) {
    const vec = this.getCharacterStrokeVectorInfo(ch, info);
    const total = vec.strokes.length;
    const count = Math.max(1, Math.min(total, uptoStepCount));
    const slice = vec.strokes.slice(0, count);

    if (vec.mode === 'makemeahanzi') {
      return `
        <svg viewBox="0 0 1024 1024" style="width: 84%; height: 84%; position: relative; z-index: 2; display: block; pointer-events: none;">
          <g transform="scale(1, -1) translate(0, -900)">
            ${slice.map(d => `<path d="${d}" fill="${color}"></path>`).join('')}
          </g>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 100 100" style="width: 82%; height: 82%; position: relative; z-index: 2; display: block; pointer-events: none;">
        ${slice.map(d => `<path d="${d}" fill="none" stroke="${color}" stroke-width="6.8" stroke-linecap="round" stroke-linejoin="round"></path>`).join('')}
      </svg>
    `;
  },

  loadPresetToPrintSheet(presetType) {
    if (presetType === 'favorites') {
      const favs = this.getBookmarkedCardsPool();
      this.printConfig.text = favs.map(f => f.hanzi).join('');
      this.printConfig.title = 'Lembar Latihan Kosakata Favorit Saya';
    } else if (presetType === 'strokes_hsk') {
      this.printConfig.text = '叫什么名字他她们你好我是中国人学习汉语';
      this.printConfig.title = 'Lembar Latihan Urutan Goresan Baku (田字格笔顺字帖)';
    } else {
      const lvl = parseInt(presetType) || 1;
      let charStr = '';
      if (typeof State === 'object' && Array.isArray(State.strokeCharacters)) {
        const strokeMatches = State.strokeCharacters.filter(c => c.hskLevel === `HSK ${lvl}`);
        if (strokeMatches.length > 0) {
          charStr = strokeMatches.slice(0, 12).map(c => c.char).join('');
        }
      }
      if (!charStr) {
        const list = (typeof flashcardData === 'object' && flashcardData[lvl]) ? flashcardData[lvl].slice(0, 12) : [];
        charStr = list.map(c => c.hanzi).join('');
      }
      this.printConfig.text = charStr;
      this.printConfig.title = `Lembar Latihan Menulis & Urutan Goresan HSK ${lvl} (田字格字帖)`;
    }
    this.refreshPrintSheetView(false);
  },

  renderPrintSheetPreviewInner() {
    const chars = this.extractUniqueHanziChars(this.printConfig.text).slice(0, 20);
    this.ensureStrokePathsLoaded(chars);

    const cols = parseInt(this.printConfig.colsPerRow) || 12;
    const traceCount = parseInt(this.printConfig.traceCount) || 12;
    const emptyRowsPerChar = this.printConfig.emptyRowsPerChar !== undefined ? parseInt(this.printConfig.emptyRowsPerChar) : 1;
    const bottomBlankRows = this.printConfig.bottomBlankRows !== undefined ? parseInt(this.printConfig.bottomBlankRows) : 4;
    const showHeaderInfo = !!this.printConfig.showHeaderInfo;

    const renderBlankTianZiGeRow = (withTopBorder = false) => `
      <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); ${withTopBorder ? 'border-top: 1.5px solid #1e293b;' : ''} border-left: 1.5px solid #1e293b; background: #ffffff;">
        ${Array.from({ length: cols }).map(() => `
          <div style="aspect-ratio: 1 / 1; min-width: 44px; border-right: 1.5px solid #1e293b; border-bottom: 1.5px solid #1e293b; position: relative; display: flex; align-items: center; justify-content: center; background: #ffffff; user-select: none;">
            <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
          </div>
        `).join('')}
      </div>
    `;

    return `
      <div style="text-align: center; margin-bottom: 14px; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
        <h3 style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin: 0;">${this.printConfig.title}</h3>
        <div style="font-size: 0.76rem; color: #475569; margin-top: 4px;">
          Mandarinku Worksheet (田字格笔顺字帖 — Urutan Goresan, Menebalkan & Kotak Kosong Menulis Mandiri) • Nama: ____________________ • Tanggal: ____/____/2026
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
        ${chars.map(ch => {
          const info = this.getCharacterStrokeDetails(ch);
          const vec = this.getCharacterStrokeVectorInfo(ch, info);
          const totalStrokes = vec.strokes.length;
          const maxStepBoxes = cols - 1; // Kotak 1..11 di baris pertama untuk urutan goresan bertahap

          return `
            <div style="width: 100%; max-width: 780px; page-break-inside: avoid;">
              ${showHeaderInfo ? `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; padding: 4px 8px; background: #f8fafc; border: 1.5px solid #1e293b; border-bottom: none; font-size: 0.74rem;">
                  <div>
                    <strong style="color: #0f172a; font-size: 0.85rem;">${ch}</strong>
                    <span style="color: #ea580c; font-weight: 800; margin-left: 4px;">[${info.pinyin}]</span>
                    <span style="color: #334155; font-weight: 700; margin-left: 6px;">— ${info.meaning}</span>
                    <span style="color: #64748b; margin-left: 6px;">(${totalStrokes} Goresan • ${info.hskLevel})</span>
                  </div>
                  <div style="color: #1e40af; font-weight: 700;">📜 ${info.rules}</div>
                </div>
              ` : ''}

              <!-- Baris 1: Kotak 1 Karakter Utuh Hitam + Kotak 2..N Urutan Goresan Bertahap di Dalam Kotak Tian Zi Ge + Sisa Kotak Kosong -->
              <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); border-top: 1.5px solid #1e293b; border-left: 1.5px solid #1e293b; background: #ffffff;">
                ${Array.from({ length: cols }).map((_, colIdx) => {
                  let cellContent = '';
                  if (colIdx === 0) {
                    // Kotak pertama: Karakter contoh utuh warna hitam pekat
                    cellContent = this.renderStrokeInsideTianZiGeBox(ch, totalStrokes, '#0f172a', info);
                  } else {
                    // Kotak ke-2 dst: Urutan goresan demi goresan (Stroke 1, Stroke 1..2, Stroke 1..3, ... sampai selesai)
                    const stepIndex = totalStrokes <= maxStepBoxes
                      ? colIdx
                      : Math.ceil((colIdx / maxStepBoxes) * totalStrokes);
                    if (colIdx <= totalStrokes && colIdx <= maxStepBoxes) {
                      cellContent = this.renderStrokeInsideTianZiGeBox(ch, stepIndex, '#9ca3af', info);
                    }
                  }

                  return `
                    <div style="aspect-ratio: 1 / 1; min-width: 44px; border-right: 1.5px solid #1e293b; border-bottom: 1.5px solid #1e293b; position: relative; display: flex; align-items: center; justify-content: center; background: #ffffff; user-select: none;">
                      <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
                      <div style="position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
                      ${cellContent}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Baris 2: Baris Menebalkan Karakter Utuh (Tracing) di Dalam Kotak Tian Zi Ge -->
              <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); border-left: 1.5px solid #1e293b; background: #ffffff;">
                ${Array.from({ length: cols }).map((_, colIdx) => {
                  const isTrace = colIdx < traceCount;
                  const cellContent = isTrace
                    ? this.renderStrokeInsideTianZiGeBox(ch, totalStrokes, '#9ca3af', info)
                    : '';

                  return `
                    <div style="aspect-ratio: 1 / 1; min-width: 44px; border-right: 1.5px solid #1e293b; border-bottom: 1.5px solid #1e293b; position: relative; display: flex; align-items: center; justify-content: center; background: #ffffff; user-select: none;">
                      <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
                      <div style="position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed #cbd5e1; pointer-events: none; z-index: 1;"></div>
                      ${cellContent}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Baris 3 dst (Di Bawah Baris Menebalkan): Baris Kotak Kosong Baru untuk Menulis Hanzi Mandiri Tanpa Bayangan -->
              ${Array.from({ length: emptyRowsPerChar }).map(() => renderBlankTianZiGeRow(false)).join('')}
            </div>
          `;
        }).join('')}

        ${bottomBlankRows > 0 ? `
          <!-- Bagian Bawah Lembar Cetak: Kisi Kotak Tian Zi Ge Kosong Baru untuk Latihan Menulis Bebas / Mandiri -->
          <div style="width: 100%; max-width: 780px; margin-top: 8px; page-break-inside: avoid;">
            <div style="font-size: 0.76rem; font-weight: 800; color: #334155; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span>✍️ Area Kotak Kosong Latihan Menulis Hanzi Mandiri (自由书写练习区):</span>
              <span style="font-size: 0.7rem; color: #64748b; font-weight: 600;">Tuliskan kembali huruf atau rangkai kalimat Mandarin di kotak kosong bawah ini</span>
            </div>
            ${Array.from({ length: bottomBlankRows }).map((_, rIdx) => renderBlankTianZiGeRow(rIdx === 0)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  renderPrintSheetSection(container) {
    const traceCount = parseInt(this.printConfig.traceCount) || 12;
    const emptyRowsPerChar = this.printConfig.emptyRowsPerChar !== undefined ? parseInt(this.printConfig.emptyRowsPerChar) : 1;
    const bottomBlankRows = this.printConfig.bottomBlankRows !== undefined ? parseInt(this.printConfig.bottomBlankRows) : 4;
    const showHeaderInfo = !!this.printConfig.showHeaderInfo;

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 800; color: #334155; display: block; margin-bottom: 6px;">
              📝 Karakter Hanzi yang Ingin Dicetak:
            </label>
            <textarea class="writing-textarea" style="height: 82px; font-family: var(--font-chinese, serif); font-size: 1.2rem;" oninput="MandarinkuExtras.printConfig.text = this.value; MandarinkuExtras.refreshPrintSheetView(true);">${this.printConfig.text}</textarea>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
              <button type="button" class="cerita-filter-pill" style="font-size: 0.72rem; padding: 4px 10px;" onclick="MandarinkuExtras.loadPresetToPrintSheet('strokes_hsk')">✍️ Contoh Buku Kotak (叫什么名字...)</button>
              <button type="button" class="cerita-filter-pill" style="font-size: 0.72rem; padding: 4px 10px;" onclick="MandarinkuExtras.loadPresetToPrintSheet('favorites')">⭐ Favorit Saya</button>
              ${[1, 2, 3, 4, 5, 6].map(l => `
                <button type="button" class="cerita-filter-pill" style="font-size: 0.72rem; padding: 4px 10px;" onclick="MandarinkuExtras.loadPresetToPrintSheet(${l})">HSK ${l}</button>
              `).join('')}
            </div>
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 800; color: #334155; display: block; margin-bottom: 6px;">
              ⚙️ Pengaturan Kisi Kotak Tian Zi Ge, Goresan & Kotak Kosong:
            </label>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <input type="text" class="form-control" value="${this.printConfig.title}" placeholder="Judul Lembar Latihan" oninput="MandarinkuExtras.printConfig.title = this.value; MandarinkuExtras.refreshPrintSheetView(true);">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px;">
                <select class="form-control" style="font-size: 0.78rem;" onchange="MandarinkuExtras.printConfig.traceCount = parseInt(this.value); MandarinkuExtras.refreshPrintSheetView(true);" title="Jumlah kotak bayangan untuk ditebalkan">
                  <option value="12" ${traceCount === 12 ? 'selected' : ''}>Menebalkan: 12 Kotak Penuh</option>
                  <option value="6" ${traceCount === 6 ? 'selected' : ''}>Menebalkan: 6 Bayangan + 6 Kosong</option>
                  <option value="4" ${traceCount === 4 ? 'selected' : ''}>Menebalkan: 4 Bayangan + 8 Kosong</option>
                </select>
                <select class="form-control" style="font-size: 0.78rem;" onchange="MandarinkuExtras.printConfig.emptyRowsPerChar = parseInt(this.value); MandarinkuExtras.refreshPrintSheetView(true);" title="Baris kotak kosong di bawah setiap huruf">
                  <option value="1" ${emptyRowsPerChar === 1 ? 'selected' : ''}>+1 Baris Kotak Kosong / Huruf</option>
                  <option value="2" ${emptyRowsPerChar === 2 ? 'selected' : ''}>+2 Baris Kotak Kosong / Huruf</option>
                  <option value="0" ${emptyRowsPerChar === 0 ? 'selected' : ''}>0 Baris Kosong per Huruf</option>
                </select>
                <select class="form-control" style="font-size: 0.78rem;" onchange="MandarinkuExtras.printConfig.bottomBlankRows = parseInt(this.value); MandarinkuExtras.refreshPrintSheetView(true);" title="Tambahan baris kotak kosong di bagian paling bawah lembar">
                  <option value="4" ${bottomBlankRows === 4 ? 'selected' : ''}>Bawah Lembar: +4 Baris Kosong</option>
                  <option value="6" ${bottomBlankRows === 6 ? 'selected' : ''}>Bawah Lembar: +6 Baris Kosong</option>
                  <option value="8" ${bottomBlankRows === 8 ? 'selected' : ''}>Bawah Lembar: +8 Baris Kosong</option>
                  <option value="2" ${bottomBlankRows === 2 ? 'selected' : ''}>Bawah Lembar: +2 Baris Kosong</option>
                  <option value="0" ${bottomBlankRows === 0 ? 'selected' : ''}>Tanpa Kotak Kosong Bawah</option>
                </select>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: #0f172a; cursor: pointer;">
                  <input type="checkbox" ${showHeaderInfo ? 'checked' : ''} onchange="MandarinkuExtras.printConfig.showHeaderInfo = this.checked; MandarinkuExtras.refreshPrintSheetView(true);" style="accent-color: #ea580c; width: 16px; height: 16px;">
                  <span>Tampilkan juga keterangan Pinyin & Arti di atas kotak</span>
                </label>
                <button type="button" class="btn-primary-sakura" style="margin: 0; white-space: nowrap; padding: 10px 20px;" onclick="MandarinkuExtras.printHanziSheet()">
                  🖨️ Cetak / Simpan PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pratinjau Lembar Kisi Tian Zi Ge dengan Urutan Goresan di Dalam Kotak & Kotak Kosong Baru di Bawahnya -->
        <div id="tianzige-printable-area" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 24px; overflow-x: auto;">
          ${this.renderPrintSheetPreviewInner()}
        </div>
      </div>
    `;
  },

  printHanziSheet(customText = null, customTitle = null) {
    if (customText) this.printConfig.text = customText;
    if (customTitle) this.printConfig.title = `Lembar Latihan Menulis: ${customTitle}`;

    const chars = this.extractUniqueHanziChars(this.printConfig.text).slice(0, 24);
    this.ensureStrokePathsLoaded(chars);

    const win = window.open('', '_blank', 'width=980,height=860');
    if (!win) {
      if (typeof showPage === 'function') showPage('cetak-hanzi');
      return;
    }

    const previewHtml = this.renderPrintSheetPreviewInner();

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${this.printConfig.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Plus Jakarta Sans', 'Noto Serif SC', sans-serif; padding: 16px 24px; color: #0f172a; margin: 0; background: #ffffff; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 8px 12px; }
            svg, div { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px; background:#f8fafc; padding:10px 16px; border-radius:10px; border:1px solid #cbd5e1;">
          <span style="font-size:13px; font-weight:700; color:#334155;">💡 Goresan demi goresan (笔顺) telah ditempatkan langsung di dalam kotak <em>Tian Zi Ge</em> seperti buku latihan menulis Mandarin.</span>
          <button onclick="window.print()" style="padding: 8px 18px; background: #ea580c; color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">🖨️ Cetak / Simpan sebagai PDF</button>
        </div>
        ${previewHtml}
        <script>setTimeout(() => window.print(), 450);<\/script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // =========================================================================
  // 4. GAMIFIKASI: DAILY MISSIONS (MISI HARIAN) & STREAK DI BERANDA
  // =========================================================================
  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  getDailyMissionsState() {
    const today = this.getTodayKey();
    try {
      const raw = localStorage.getItem(this.missionsKey);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.date === today) return parsed;
    } catch (e) {}

    const fresh = {
      date: today,
      checkinClaimed: false,
      read_story: 0,
      srs_review: 0,
      practice_extra: 0
    };
    localStorage.setItem(this.missionsKey, JSON.stringify(fresh));
    return fresh;
  },

  recordMissionProgress(key, amount = 1) {
    const state = this.getDailyMissionsState();
    state[key] = (state[key] || 0) + amount;
    localStorage.setItem(this.missionsKey, JSON.stringify(state));
    this.renderDailyMissionsPanel();
  },

  claimDailyCheckin() {
    const state = this.getDailyMissionsState();
    if (state.checkinClaimed) return;
    state.checkinClaimed = true;
    localStorage.setItem(this.missionsKey, JSON.stringify(state));

    if (typeof State === 'object' && State.currentUser) {
      State.currentUser.streak = (State.currentUser.streak || 7) + 1;
      State.currentUser.points = (State.currentUser.points || 0) + 25;
      State.currentUser.exp = Math.min(State.currentUser.maxExp || 500, (State.currentUser.exp || 0) + 25);
      if (typeof updateHomeDashboard === 'function') updateHomeDashboard();
    }
    if (typeof showToast === 'function') {
      showToast('🔥 Check-In Harian Berhasil! Streak +1 Hari & +25 EXP!', 'success');
    }
    this.renderDailyMissionsPanel();
  },

  renderDailyMissionsPanel() {
    const container = document.getElementById('beranda-daily-missions-panel');
    if (!container) return;

    const st = this.getDailyMissionsState();
    const missions = [
      {
        title: '📖 Baca & Selesaikan 1 Cerita HSK',
        current: Math.min(1, st.read_story || 0),
        target: 1,
        reward: '+20 EXP',
        actionLabel: 'Buka Cerita →',
        onClick: "navigateTo('cerita')"
      },
      {
        title: '🧠 Evaluasi 5 Kartu Flashcard SRS',
        current: Math.min(5, st.srs_review || 0),
        target: 5,
        reward: '+25 EXP',
        actionLabel: 'Latihan SRS →',
        onClick: "navigateTo('flashcard'); setFlashcardPageLevel('srs');"
      },
      {
        title: '🧩 Selesaikan 2 Soal Susun Kalimat / Dikte',
        current: Math.min(2, st.practice_extra || 0),
        target: 2,
        reward: '+30 EXP',
        actionLabel: 'Mulai Latihan →',
        onClick: "MandarinkuExtras.openLatihanTab('scramble')"
      }
    ];

    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #ffffff 0%, #fff0f3 100%); border: 1.5px solid #fecdd3; border-radius: 18px; padding: 20px 24px; box-shadow: 0 6px 20px rgba(244, 63, 94, 0.06);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
          <div>
            <span class="role-badge" style="background: #e11d48; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 10px;">
              🎯 MISI HARIAN & STREAK BELAJAR
            </span>
            <h3 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 4px 0 0 0;">
              Target Belajar Harian Anda (${st.date})
            </h3>
          </div>
          <button type="button" class="btn-primary-sakura" style="margin: 0; padding: 8px 18px; font-size: 0.82rem; background: ${st.checkinClaimed ? '#10b981' : 'linear-gradient(135deg, #ea580c, #c2410c)'};" onclick="MandarinkuExtras.claimDailyCheckin()" ${st.checkinClaimed ? 'disabled' : ''}>
            ${st.checkinClaimed ? '✅ Check-In Hari Ini Selesai (+25 EXP)' : '🔥 Klaim Check-In Belajar Hari Ini (+25 EXP)'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
          ${missions.map(m => {
            const done = m.current >= m.target;
            const pct = Math.round((m.current / m.target) * 100);
            return `
              <div style="background: #ffffff; border: 1.5px solid ${done ? '#6ee7b7' : '#e2e8f0'}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">${m.title}</span>
                    <span style="font-size: 0.72rem; font-weight: 800; color: ${done ? '#059669' : '#ea580c'}; background: ${done ? '#ecfdf5' : '#fff7ed'}; padding: 2px 8px; border-radius: 99px;">
                      ${done ? '✅ Selesai' : m.reward}
                    </span>
                  </div>
                  <div class="progress-bar-container" style="height: 8px; margin: 6px 0;">
                    <div class="progress-bar-fill" style="width: ${pct}%; background: ${done ? '#10b981' : 'var(--primary-pink)'};"></div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.76rem; font-weight: 700; color: #64748b;">Progres: ${m.current}/${m.target}</span>
                  <button type="button" class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.75rem; margin: 0;" onclick="${m.onClick}">
                    ${m.actionLabel}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 5. E-SERTIFIKAT PENYELESAIAN LEVEL HSK 1-6 DI HALAMAN PROFIL
  // =========================================================================
  renderCertificatesInProfile() {
    const profileMain = document.querySelector('#profile-content-container .profile-main-content');
    if (!profileMain || document.getElementById('profile-hsk-certificates-box')) return;

    const certBox = document.createElement('div');
    certBox.id = 'profile-hsk-certificates-box';
    certBox.className = 'interactive-panel';
    certBox.style.marginTop = '1.25rem';
    certBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">
            🎓 Koleksi e-Sertifikat Pencapaian HSK 1 – 6
          </h4>
          <p style="font-size: 0.8rem; color: #64748b; margin: 2px 0 0 0;">
            Unduh atau cetak e-Sertifikat resmi penyelesaian modul dan evaluasi bahasa Mandarin Anda.
          </p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px;">
        ${[
          { lvl: 1, title: 'HSK 1 • Dasar Pemula', color: '#059669', bg: '#ecfdf5' },
          { lvl: 2, title: 'HSK 2 • Komunikasi', color: '#0284c7', bg: '#f0f9ff' },
          { lvl: 3, title: 'HSK 3 • Menengah', color: '#4f46e5', bg: '#eef2ff' },
          { lvl: 4, title: 'HSK 4 • Lanjutan', color: '#9333ea', bg: '#faf5ff' },
          { lvl: 5, title: 'HSK 5 • Mahir / Bisnis', color: '#e11d48', bg: '#fff1f2' },
          { lvl: 6, title: 'HSK 6 • Master Sastra', color: '#d97706', bg: '#fffbeb' }
        ].map(c => `
          <div style="background: ${c.bg}; border: 1.5px solid ${c.color}40; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
            <div>
              <span style="font-size: 0.72rem; font-weight: 800; color: ${c.color}; text-transform: uppercase;">Sertifikat Kompetensi</span>
              <h5 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 4px 0;">${c.title}</h5>
            </div>
            <button type="button" class="btn-learn-outline" style="background: #fff; border-color: ${c.color}; color: ${c.color}; padding: 6px 12px; font-size: 0.78rem; margin: 0; font-weight: 800;" onclick="MandarinkuExtras.openCertificatePrint(${c.lvl}, '${c.title}')">
              📜 Cetak e-Sertifikat
            </button>
          </div>
        `).join('')}
      </div>
    `;
    profileMain.appendChild(certBox);
  },

  openCertificatePrint(level, levelTitle) {
    const userName = (typeof State === 'object' && State.currentUser && State.currentUser.name) ? State.currentUser.name : 'Learner Panda';
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const certId = `MK-HSK${level}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const win = window.open('', '_blank', 'width=960,height=700');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>e-Sertifikat ${levelTitle} - ${userName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; padding: 24px; display: flex; flex-direction: column; align-items: center; }
          .cert-card { width: 840px; padding: 48px 56px; background: #fffdf9; border: 8px double #b45309; border-radius: 16px; position: relative; text-align: center; box-shadow: 0 12px 35px rgba(0,0,0,0.08); }
          .seal { width: 88px; height: 88px; border: 3px solid #dc2626; color: #dc2626; font-family: 'Noto Serif SC', serif; font-weight: 900; font-size: 16px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transform: rotate(-10deg); margin: 0 auto; line-height: 1.25; }
          @media print { body { background: #fff; padding: 0; } .no-print { display: none; } .cert-card { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px;">
          <button onclick="window.print()" style="padding: 10px 22px; background: #ea580c; color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">🖨️ Cetak / Unduh PDF e-Sertifikat</button>
        </div>
        <div class="cert-card">
          <div style="font-size: 13px; font-weight: 800; color: #b45309; letter-spacing: 2px; text-transform: uppercase;">MANDARINKU ACADEMY • 汉语水平学习证书</div>
          <h1 style="font-family: 'Noto Serif SC', serif; font-size: 34px; color: #0f172a; margin: 12px 0 6px 0;">SERTIFIKAT PENCAPAIAN BAHASA MANDARIN</h1>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 24px 0;">Diberikan sebagai penghargaan atas ketekunan dan penyelesaian materi pembelajaran kepada:</p>
          <div style="font-size: 32px; font-weight: 800; color: #be123c; border-bottom: 2px solid #fde68a; display: inline-block; padding: 0 32px 8px 32px; margin-bottom: 20px;">
            ${userName}
          </div>
          <p style="font-size: 15px; color: #334155; max-width: 620px; margin: 0 auto 24px auto; line-height: 1.6;">
            Telah menyelesaikan rangkaian modul pembelajaran, latihan kosakata, pemahaman bacaan cerita Mandarin, serta evaluasi kompetensi pada tingkat:
          </p>
          <div style="font-size: 22px; font-weight: 800; color: #0f172a; background: #fef3c7; border: 1.5px solid #f59e0b; display: inline-block; padding: 8px 26px; border-radius: 99px; margin-bottom: 30px;">
            🏆 ${levelTitle} (HSK Level ${level})
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
            <div style="text-align: left;">
              <strong>ID Sertifikat:</strong> ${certId}<br>
              <strong>Tanggal Terbit:</strong> ${dateStr}
            </div>
            <div class="seal">汉语水平<br>认证印章</div>
            <div style="text-align: right;">
              <strong>Mandarinku Interactive Learning</strong><br>
              <span>Platform Belajar Mandarin HSK 1–6</span>
            </div>
          </div>
        </div>
        <script>setTimeout(() => window.print(), 450);<\/script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // =========================================================================
  // 5. GAME ARENA MANDARIN (TONE TRAINER, WORD LINK, MEMORY MATCH)
  // =========================================================================
  activeGameTab: 'tone', // 'tone', 'link', 'memory'
  toneTrainerDifficulty: 'all', // 'all', 'easy', 'medium', 'hard'
  toneTrainerLevel: 'all', // 'all', 1, 2, 3, 4, 5, 6
  toneTrainerIndex: 0,
  toneTrainerScore: 0,
  toneTrainerStreak: 0,
  toneTrainerChecked: null,

  // Bank Soal Pelatih 4 Nada Mandarin Lengkap HSK 1 - 6 (15 Soal per Level = 90 Soal)
  toneTrainerBank: [
    // --- HSK 1 (15 Soal) ---
    { level: 1, hanzi: '妈', pinyin: 'mā', tone: 1, audio: '妈', meaning: 'Ibu', tip: 'Nada 1: Datar tinggi & stabil seperti menyanyi "laaa"' },
    { level: 1, hanzi: '八', pinyin: 'bā', tone: 1, audio: '八', meaning: 'Delapan (8)', tip: 'Nada 1: Suara datar tinggi tanpa turun' },
    { level: 1, hanzi: '喝', pinyin: 'hē', tone: 1, audio: '喝', meaning: 'Minum', tip: 'Nada 1: Suara konstan di nada tinggi' },
    { level: 1, hanzi: '国', pinyin: 'guó', tone: 2, audio: '国', meaning: 'Negara', tip: 'Nada 2: Menanjak naik seperti intonasi bertanya' },
    { level: 1, hanzi: '来', pinyin: 'lái', tone: 2, audio: '来', meaning: 'Datang', tip: 'Nada 2: Meluncur naik dari sedang ke tinggi' },
    { level: 1, hanzi: '谁', pinyin: 'shéi', tone: 2, audio: '谁', meaning: 'Siapa', tip: 'Nada 2: Intonasi bertanya "hah?"' },
    { level: 1, hanzi: '好', pinyin: 'hǎo', tone: 3, audio: '好', meaning: 'Baik / Bagus', tip: 'Nada 3: Turun ke nada terendah lalu naik sedikit' },
    { level: 1, hanzi: '米', pinyin: 'mǐ', tone: 3, audio: '米', meaning: 'Beras / Nasi', tip: 'Nada 3: Lengkungan rendah berayun' },
    { level: 1, hanzi: '水', pinyin: 'shuǐ', tone: 3, audio: '水', meaning: 'Air', tip: 'Nada 3: Tekan ke nada bawah' },
    { level: 1, hanzi: '你', pinyin: 'nǐ', tone: 3, audio: '你', meaning: 'Kamu', tip: 'Nada 3: Rendah di tenggorokan' },
    { level: 1, hanzi: '去', pinyin: 'qù', tone: 4, audio: '去', meaning: 'Pergi', tip: 'Nada 4: Turun tajam dan tegas seperti membentak' },
    { level: 1, hanzi: '是', pinyin: 'shì', tone: 4, audio: '是', meaning: 'Adalah / Benar', tip: 'Nada 4: Menukik cepat dari puncak ke dasar' },
    { level: 1, hanzi: '不', pinyin: 'bù', tone: 4, audio: '不', meaning: 'Tidak / Bukan', tip: 'Nada 4: Hentakan pendek dan tegas' },
    { level: 1, hanzi: '大', pinyin: 'dà', tone: 4, audio: '大', meaning: 'Besar', tip: 'Nada 4: Cepat jatuh ke bawah' },
    { level: 1, hanzi: '叫', pinyin: 'jiào', tone: 4, audio: '叫', meaning: 'Bernama / Memanggil', tip: 'Nada 4: Jatuh tegas' },

    // --- HSK 2 (15 Soal) ---
    { level: 2, hanzi: '哥', pinyin: 'gē', tone: 1, audio: '哥', meaning: 'Kakak Laki-laki', tip: 'Nada 1: Datar tinggi stabil' },
    { level: 2, hanzi: '新', pinyin: 'xīn', tone: 1, audio: '新', meaning: 'Baru', tip: 'Nada 1: Nada tinggi rata' },
    { level: 2, hanzi: '穿', pinyin: 'chuān', tone: 1, audio: '穿', meaning: 'Memakai (pakaian)', tip: 'Nada 1: Panjang dan tinggi' },
    { level: 2, hanzi: '白', pinyin: 'bái', tone: 2, audio: '白', meaning: 'Putih', tip: 'Nada 2: Naik tajam dari tengah' },
    { level: 2, hanzi: '鱼', pinyin: 'yú', tone: 2, audio: '鱼', meaning: 'Ikan', tip: 'Nada 2: Seperti bertanya kaget' },
    { level: 2, hanzi: '羊', pinyin: 'yáng', tone: 2, audio: '羊', meaning: 'Kambing / Domba', tip: 'Nada 2: Mengalun ke atas' },
    { level: 2, hanzi: '手', pinyin: 'shǒu', tone: 3, audio: '手', meaning: 'Tangan', tip: 'Nada 3: Turun dalam lalu mengayun' },
    { level: 2, hanzi: '懂', pinyin: 'dǒng', tone: 3, audio: '懂', meaning: 'Mengerti / Paham', tip: 'Nada 3: Rendah di dada' },
    { level: 2, hanzi: '跑', pinyin: 'pǎo', tone: 3, audio: '跑', meaning: 'Berlari', tip: 'Nada 3: Ayunan nada rendah' },
    { level: 2, hanzi: '远', pinyin: 'yuǎn', tone: 3, audio: '远', meaning: 'Jauh', tip: 'Nada 3: Mengayun panjang' },
    { level: 2, hanzi: '慢', pinyin: 'màn', tone: 4, audio: '慢', meaning: 'Lambat', tip: 'Nada 4: Jatuh menghentak' },
    { level: 2, hanzi: '贵', pinyin: 'guì', tone: 4, audio: '贵', meaning: 'Mahal', tip: 'Nada 4: Menukik tegas ke bawah' },
    { level: 2, hanzi: '问', pinyin: 'wèn', tone: 4, audio: '问', meaning: 'Bertanya', tip: 'Nada 4: Cepat dan tegas' },
    { level: 2, hanzi: '错', pinyin: 'cuò', tone: 4, audio: '错', meaning: 'Salah / Keliru', tip: 'Nada 4: Menghentak pendek' },
    { level: 2, hanzi: '进', pinyin: 'jìn', tone: 4, audio: '进', meaning: 'Masuk', tip: 'Nada 4: Tegas meluncur turun' },

    // --- HSK 3 (15 Soal) ---
    { level: 3, hanzi: '春', pinyin: 'chūn', tone: 1, audio: '春', meaning: 'Musim Semi', tip: 'Nada 1: Datar tinggi' },
    { level: 3, hanzi: '香', pinyin: 'xiāng', tone: 1, audio: '香', meaning: 'Wangi / Harum', tip: 'Nada 1: Bernada tinggi cerah' },
    { level: 3, hanzi: '双', pinyin: 'shuāng', tone: 1, audio: '双', meaning: 'Sepasang / Ganda', tip: 'Nada 1: Panjang stabil' },
    { level: 3, hanzi: '难', pinyin: 'nán', tone: 2, audio: '难', meaning: 'Sulit / Sukar', tip: 'Nada 2: Meluncur naik' },
    { level: 3, hanzi: '甜', pinyin: 'tián', tone: 2, audio: '甜', meaning: 'Manis', tip: 'Nada 2: Nada naik manis' },
    { level: 3, hanzi: '骑', pinyin: 'qí', tone: 2, audio: '骑', meaning: 'Mengendarai / Menunggang', tip: 'Nada 2: Nada menanjak' },
    { level: 3, hanzi: '矮', pinyin: 'ǎi', tone: 3, audio: '矮', meaning: 'Pendek (tinggi badan)', tip: 'Nada 3: Turun dalam' },
    { level: 3, hanzi: '满', pinyin: 'mǎn', tone: 3, audio: '满', meaning: 'Penuh', tip: 'Nada 3: Rendah di tenggorokan' },
    { level: 3, hanzi: '渴', pinyin: 'kě', tone: 3, audio: '渴', meaning: 'Haus', tip: 'Nada 3: Ayunan nada rendah' },
    { level: 3, hanzi: '嘴', pinyin: 'zuǐ', tone: 3, audio: '嘴', meaning: 'Mulut', tip: 'Nada 3: Menukik rendah lalu naik' },
    { level: 3, hanzi: '极', pinyin: 'jí', tone: 2, audio: '极', meaning: 'Sangat / Ekstrem', tip: 'Nada 2: Meluncur naik cepat' },
    { level: 3, hanzi: '饿', pinyin: 'è', tone: 4, audio: '饿', meaning: 'Lapar', tip: 'Nada 4: Jatuh tajam' },
    { level: 3, hanzi: '变', pinyin: 'biàn', tone: 4, audio: '变', meaning: 'Berubah', tip: 'Nada 4: Menghentak tegas' },
    { level: 3, hanzi: '照', pinyin: 'zhào', tone: 4, audio: '照', meaning: 'Memotret / Menyinari', tip: 'Nada 4: Turun tegas' },
    { level: 3, hanzi: '练', pinyin: 'liàn', tone: 4, audio: '练', meaning: 'Berlatih', tip: 'Nada 4: Jatuh kuat' },

    // --- HSK 4 (15 Soal) ---
    { level: 4, hanzi: '篇', pinyin: 'piān', tone: 1, audio: '篇', meaning: 'Lembar / Artikel', tip: 'Nada 1: Datar tinggi stabil' },
    { level: 4, hanzi: '推', pinyin: 'tuī', tone: 1, audio: '推', meaning: 'Mendorong', tip: 'Nada 1: Suara tinggi rata' },
    { level: 4, hanzi: '孤', pinyin: 'gū', tone: 1, audio: '孤', meaning: 'Sendirian / Terisolasi', tip: 'Nada 1: Panjang stabil' },
    { level: 4, hanzi: '赢', pinyin: 'yíng', tone: 2, audio: '赢', meaning: 'Menang', tip: 'Nada 2: Meluncur naik penuh semangat' },
    { level: 4, hanzi: '盐', pinyin: 'yán', tone: 2, audio: '盐', meaning: 'Garam', tip: 'Nada 2: Menanjak naik' },
    { level: 4, hanzi: '诚', pinyin: 'chéng', tone: 2, audio: '诚', meaning: 'Jujur / Tulus', tip: 'Nada 2: Nada naik stabil' },
    { level: 4, hanzi: '准', pinyin: 'zhǔn', tone: 3, audio: '准', meaning: 'Tepat / Standar', tip: 'Nada 3: Lengkung dalam' },
    { level: 4, hanzi: '浅', pinyin: 'qiǎn', tone: 3, audio: '浅', meaning: 'Dangkal / Terang (warna)', tip: 'Nada 3: Ayunan rendah' },
    { level: 4, hanzi: '懒', pinyin: 'lǎn', tone: 3, audio: '懒', meaning: 'Malas', tip: 'Nada 3: Turun dalam di tenggorokan' },
    { level: 4, hanzi: '赏', pinyin: 'shǎng', tone: 3, audio: '赏', meaning: 'Mengagumi / Menghadiahi', tip: 'Nada 3: Rendah berayun' },
    { level: 4, hanzi: '辣', pinyin: 'là', tone: 4, audio: '辣', meaning: 'Pedas', tip: 'Nada 4: Jatuh tajam membakar' },
    { level: 4, hanzi: '笨', pinyin: 'bèn', tone: 4, audio: '笨', meaning: 'Bodoh / Canggung', tip: 'Nada 4: Cepat dan tegas' },
    { level: 4, hanzi: '祝', pinyin: 'zhù', tone: 4, audio: '祝', meaning: 'Berdoa / Mengucapkan Selamat', tip: 'Nada 4: Menukik tegas' },
    { level: 4, hanzi: '破', pinyin: 'pò', tone: 4, audio: '破', meaning: 'Pecah / Rusak', tip: 'Nada 4: Menghentak pendek' },
    { level: 4, hanzi: '拒', pinyin: 'jù', tone: 4, audio: '拒', meaning: 'Menolak', tip: 'Nada 4: Turun tegas tanpa ragu' },

    // --- HSK 5 (15 Soal) ---
    { level: 5, hanzi: '催', pinyin: 'cuī', tone: 1, audio: '催', meaning: 'Mendesak / Mempercepat', tip: 'Nada 1: Datar tinggi stabil' },
    { level: 5, hanzi: '操', pinyin: 'cāo', tone: 1, audio: '操', meaning: 'Mengoperasikan / Senam', tip: 'Nada 1: Rata dan tinggi' },
    { level: 5, hanzi: '歪', pinyin: 'wāi', tone: 1, audio: '歪', meaning: 'Miring / Asimetris', tip: 'Nada 1: Nada tinggi bersih' },
    { level: 5, hanzi: '逃', pinyin: 'táo', tone: 2, audio: '逃', meaning: 'Kabur / Melarikan Diri', tip: 'Nada 2: Meluncur naik cepat' },
    { level: 5, hanzi: '潮', pinyin: 'cháo', tone: 2, audio: '潮', meaning: 'Lembap / Pasang Surut', tip: 'Nada 2: Nada menanjak' },
    { level: 5, hanzi: '详', pinyin: 'xiáng', tone: 2, audio: '详', meaning: 'Rinci / Teliti', tip: 'Nada 2: Naik perlahan' },
    { level: 5, hanzi: '爽', pinyin: 'shuǎng', tone: 3, audio: '爽', meaning: 'Segar / Nyaman / Lega', tip: 'Nada 3: Lengkungan rendah berayun' },
    { level: 5, hanzi: '甩', pinyin: 'shuǎi', tone: 3, audio: '甩', meaning: 'Mengayunkan / Mengibaskan', tip: 'Nada 3: Turun dalam' },
    { level: 5, hanzi: '闯', pinyin: 'chuǎng', tone: 3, audio: '闯', meaning: 'Menerobos / Bertualang', tip: 'Nada 3: Menukik rendah lalu naik' },
    { level: 5, hanzi: '敏', pinyin: 'mǐn', tone: 3, audio: '敏', meaning: 'Cekatan / Peka', tip: 'Nada 3: Rendah di tenggorokan' },
    { level: 5, hanzi: '恨', pinyin: 'hèn', tone: 4, audio: '恨', meaning: 'Membenci', tip: 'Nada 4: Jatuh tajam dan tegas' },
    { level: 5, hanzi: '润', pinyin: 'rùn', tone: 4, audio: '润', meaning: 'Lembap / Menghaluskan', tip: 'Nada 4: Menghentak turun' },
    { level: 5, hanzi: '漏', pinyin: 'lòu', tone: 4, audio: '漏', meaning: 'Bocor / Luput', tip: 'Nada 4: Menukik tajam' },
    { level: 5, hanzi: '顿', pinyin: 'dùn', tone: 4, audio: '顿', meaning: 'Jeda / Hentakan', tip: 'Nada 4: Pendek dan tegas' },
    { level: 5, hanzi: '赚', pinyin: 'zhuàn', tone: 4, audio: '赚', meaning: 'Menghasilkan Untung', tip: 'Nada 4: Meluncur turun kuat' },

    // --- HSK 6 (15 Soal) ---
    { level: 6, hanzi: '兜', pinyin: 'dōu', tone: 1, audio: '兜', meaning: 'Saku / Berputar', tip: 'Nada 1: Datar tinggi stabil' },
    { level: 6, hanzi: '衰', pinyin: 'shuāi', tone: 1, audio: '衰', meaning: 'Merosot / Menua', tip: 'Nada 1: Bernada tinggi datar' },
    { level: 6, hanzi: '斟', pinyin: 'zhēn', tone: 1, audio: '斟', meaning: 'Menuangkan Minuman', tip: 'Nada 1: Halus di nada tinggi' },
    { level: 6, hanzi: '竭', pinyin: 'jié', tone: 2, audio: '竭', meaning: 'Habis / Menguras Tenaga', tip: 'Nada 2: Meluncur naik tajam' },
    { level: 6, hanzi: '蓬', pinyin: 'péng', tone: 2, audio: '蓬', meaning: 'Rimbun / Mengembang', tip: 'Nada 2: Nada menanjak' },
    { level: 6, hanzi: '僚', pinyin: 'liáo', tone: 2, audio: '僚', meaning: 'Rekan Birokrat / Pejabat', tip: 'Nada 2: Naik mengalun' },
    { level: 6, hanzi: '冗', pinyin: 'rǒng', tone: 3, audio: '冗', meaning: 'Bertele-tele / Mubazir', tip: 'Nada 3: Turun dalam di tenggorokan' },
    { level: 6, hanzi: '阻', pinyin: 'zǔ', tone: 3, audio: '阻', meaning: 'Menghalangi / Merintangi', tip: 'Nada 3: Ayunan nada rendah' },
    { level: 6, hanzi: '耸', pinyin: 'sǒng', tone: 3, audio: '耸', meaning: 'Menjulang Tinggi', tip: 'Nada 3: Lengkung nada bawah' },
    { level: 6, hanzi: '泯', pinyin: 'mǐn', tone: 3, audio: '泯', meaning: 'Lenyap / Sirna', tip: 'Nada 3: Rendah dan dalam' },
    { level: 6, hanzi: '魄', pinyin: 'pò', tone: 4, audio: '魄', meaning: 'Jiwa / Keberanian Jiwa', tip: 'Nada 4: Jatuh tajam perkasa' },
    { level: 6, hanzi: '撼', pinyin: 'hàn', tone: 4, audio: '撼', meaning: 'Mengguncang', tip: 'Nada 4: Menghentak kuat' },
    { level: 6, hanzi: '馈', pinyin: 'kuì', tone: 4, audio: '馈', meaning: 'Memberi Hadiah / Umpan Balik', tip: 'Nada 4: Turun tegas' },
    { level: 6, hanzi: '滞', pinyin: 'zhì', tone: 4, audio: '滞', meaning: 'Macet / Tersendat', tip: 'Nada 4: Menukik cepat ke bawah' },
    { level: 6, hanzi: '酷', pinyin: 'kù', tone: 4, audio: '酷', meaning: 'Keren / Sangat Keras', tip: 'Nada 4: Jatuh tegas memotong' }
  ],

  // Kategori & Bagian untuk Game Pasang Kata Majemuk (趣味组词 - 6 Bagian x 15 Kata = 90 Kata)
  wordLinkCategories: [
    { id: 'cat1', name: 'Bagian 1: Sehari-hari', hsk: 'HSK 1-2', desc: 'Benda & perabot dalam kehidupan sehari-hari', icon: '🏠' },
    { id: 'cat2', name: 'Bagian 2: Kuliner & Buah', hsk: 'HSK 1-2', desc: 'Makanan, minuman, buah & hidangan lezat', icon: '🍜' },
    { id: 'cat3', name: 'Bagian 3: Bepergian & Kota', hsk: 'HSK 2-3', desc: 'Tempat umum, stasiun, jalan & transportasi', icon: '🚗' },
    { id: 'cat4', name: 'Bagian 4: Profesi & Belajar', hsk: 'HSK 3-4', desc: 'Pekerjaan, kampus, pertemanan & relasi', icon: '🎓' },
    { id: 'cat5', name: 'Bagian 5: Bisnis & Sains', hsk: 'HSK 4-5', desc: 'Ekonomi, teknologi, internet & lingkungan', icon: '💻' },
    { id: 'cat6', name: 'Bagian 6: Budaya & Sastra', hsk: 'HSK 5-6', desc: 'Seni, sejarah, filsafat & kiasan sastra', icon: '🏮' }
  ],

  wordLinkDifficulty: 'all', // 'all', 'easy', 'medium', 'hard'
  wordLinkActiveCat: 'cat1',
  wordLinkCatRound: 0, // 0, 1, 2 (masing-masing ronde 5 kata)
  wordLinkScore: 0,
  wordLinkSelectedA: null,
  wordLinkMatched: [],
  wordLinkActiveSet: null,

  // Bank Soal Kata Majemuk Terbagi Rapi dalam 6 Bagian (15 Kata per Bagian = 90 Kata)
  wordLinkBankByCat: {
    cat1: [
      // Ronde 1
      { pA: '苹', pB: '果', hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Buah Apel' },
      { pA: '电', pB: '脑', hanzi: '电脑', pinyin: 'diànnǎo', meaning: 'Komputer' },
      { pA: '飞', pB: '机', hanzi: '飞机', pinyin: 'fēijī', meaning: 'Pesawat Terbang' },
      { pA: '手', pB: '机', hanzi: '手机', pinyin: 'shǒujī', meaning: 'Ponsel / Handphone' },
      { pA: '汉', pB: '字', hanzi: '汉字', pinyin: 'hànzì', meaning: 'Aksara / Huruf Hanzi' },
      // Ronde 2
      { pA: '衣', pB: '服', hanzi: '衣服', pinyin: 'yīfu', meaning: 'Pakaian / Baju' },
      { pA: '眼', pB: '睛', hanzi: '眼睛', pinyin: 'yǎnjing', meaning: 'Mata' },
      { pA: '桌', pB: '子', hanzi: '桌子', pinyin: 'zhuōzi', meaning: 'Meja' },
      { pA: '椅', pB: '子', hanzi: '椅子', pinyin: 'yǐzi', meaning: 'Kursi' },
      { pA: '钱', pB: '包', hanzi: '钱包', pinyin: 'qiánbāo', meaning: 'Dompet' },
      // Ronde 3
      { pA: '钟', pB: '表', hanzi: '钟表', pinyin: 'zhōngbiǎo', meaning: 'Jam Dinding / Arloji' },
      { pA: '纸', pB: '巾', hanzi: '纸巾', pinyin: 'zhǐjīn', meaning: 'Kertas Tisu' },
      { pA: '雨', pB: '伞', hanzi: '雨伞', pinyin: 'yǔsǎn', meaning: 'Payung Hujan' },
      { pA: '钥', pB: '匙', hanzi: '钥匙', pinyin: 'yàoshi', meaning: 'Kunci' },
      { pA: '礼', pB: '物', hanzi: '礼物', pinyin: 'lǐwù', meaning: 'Hadiah / Bingkisan' }
    ],
    cat2: [
      // Ronde 1
      { pA: '咖', pB: '啡', hanzi: '咖啡', pinyin: 'kāfēi', meaning: 'Kopi' },
      { pA: '葡', pB: '萄', hanzi: '葡萄', pinyin: 'pútao', meaning: 'Buah Anggur' },
      { pA: '面', pB: '条', hanzi: '面条', pinyin: 'miàntiáo', meaning: 'Mie' },
      { pA: '牛', pB: '奶', hanzi: '牛奶', pinyin: 'niúnǎi', meaning: 'Susu Sapi' },
      { pA: '水', pB: '饺', hanzi: '水饺', pinyin: 'shuǐjiǎo', meaning: 'Pangsit Kuah' },
      // Ronde 2
      { pA: '绿', pB: '茶', hanzi: '绿茶', pinyin: 'lǜchá', meaning: 'Teh Hijau' },
      { pA: '米', pB: '饭', hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'Nasi Putih' },
      { pA: '西', pB: '瓜', hanzi: '西瓜', pinyin: 'xīguā', meaning: 'Semangka' },
      { pA: '面', pB: '包', hanzi: '面包', pinyin: 'miànbāo', meaning: 'Roti' },
      { pA: '鸡', pB: '蛋', hanzi: '鸡蛋', pinyin: 'jīdàn', meaning: 'Telur Ayam' },
      // Ronde 3
      { pA: '冰', pB: '淇淋', hanzi: '冰淇淋', pinyin: 'bīngqílín', meaning: 'Es Krim' },
      { pA: '蛋', pB: '糕', hanzi: '蛋糕', pinyin: 'dàngāo', meaning: 'Kue Tart / Bolu' },
      { pA: '果', pB: '汁', hanzi: '果汁', pinyin: 'guǒzhī', meaning: 'Jus Buah' },
      { pA: '豆', pB: '腐', hanzi: '豆腐', pinyin: 'dòufu', meaning: 'Tahu' },
      { pA: '烤', pB: '鸭', hanzi: '烤鸭', pinyin: 'kǎoyā', meaning: 'Bebek Panggang' }
    ],
    cat3: [
      // Ronde 1
      { pA: '车', pB: '站', hanzi: '车站', pinyin: 'chēzhàn', meaning: 'Stasiun / Halte' },
      { pA: '机', pB: '场', hanzi: '机场', pinyin: 'jīchǎng', meaning: 'Bandara Udara' },
      { pA: '饭', pB: '店', hanzi: '饭店', pinyin: 'fàndiàn', meaning: 'Restoran / Hotel' },
      { pA: '银', pB: '行', hanzi: '银行', pinyin: 'yínháng', meaning: 'Bank' },
      { pA: '医', pB: '院', hanzi: '医院', pinyin: 'yīyuàn', meaning: 'Rumah Sakit' },
      // Ronde 2
      { pA: '学', pB: '校', hanzi: '学校', pinyin: 'xuéxiào', meaning: 'Sekolah' },
      { pA: '超', pB: '市', hanzi: '超市', pinyin: 'chāoshì', meaning: 'Supermarket' },
      { pA: '地', pB: '铁', hanzi: '地铁', pinyin: 'dìtiě', meaning: 'Kereta Bawah Tanah (MRT)' },
      { pA: '出', pB: '租车', hanzi: '出租车', pinyin: 'chūzūchē', meaning: 'Mobil Taksi' },
      { pA: '公', pB: '园', hanzi: '公园', pinyin: 'gōngyuán', meaning: 'Taman Publik' },
      // Ronde 3
      { pA: '宾', pB: '馆', hanzi: '宾馆', pinyin: 'bīnguǎn', meaning: 'Penginapan / Wisma' },
      { pA: '邮', pB: '局', hanzi: '邮局', pinyin: 'yóujú', meaning: 'Kantor Pos' },
      { pA: '图', pB: '书馆', hanzi: '图书馆', pinyin: 'túshūguǎn', meaning: 'Perpustakaan' },
      { pA: '电', pB: '影院', hanzi: '电影院', pinyin: 'diànyǐngyuàn', meaning: 'Bioskop' },
      { pA: '博', pB: '物馆', hanzi: '博物馆', pinyin: 'bówùguǎn', meaning: 'Museum' }
    ],
    cat4: [
      // Ronde 1
      { pA: '老', pB: '师', hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Guru / Pengajar' },
      { pA: '医', pB: '生', hanzi: '医生', pinyin: 'yīshēng', meaning: 'Dokter' },
      { pA: '朋', pB: '友', hanzi: '朋友', pinyin: 'péngyou', meaning: 'Sahabat / Teman' },
      { pA: '同', pB: '学', hanzi: '同学', pinyin: 'tóngxué', meaning: 'Teman Sekelas' },
      { pA: '经', pB: '理', hanzi: '经理', pinyin: 'jīnglǐ', meaning: 'Manajer' },
      // Ronde 2
      { pA: '司', pB: '机', hanzi: '司机', pinyin: 'sījī', meaning: 'Sopir / Pengemudi' },
      { pA: '护', pB: '士', hanzi: '护士', pinyin: 'hùshi', meaning: 'Perawat' },
      { pA: '记', pB: '者', hanzi: '记者', pinyin: 'jìzhě', meaning: 'Wartawan / Reporter' },
      { pA: '律', pB: '师', hanzi: '律师', pinyin: 'lǜshī', meaning: 'Pengacara' },
      { pA: '邻', pB: '居', hanzi: '邻居', pinyin: 'línjū', meaning: 'Tetangga' },
      // Ronde 3
      { pA: '教', pB: '授', hanzi: '教授', pinyin: 'jiàoshòu', meaning: 'Profesor' },
      { pA: '作', pB: '家', hanzi: '作家', pinyin: 'zuòjiā', meaning: 'Penulis Sastra' },
      { pA: '亲', pB: '戚', hanzi: '亲戚', pinyin: 'qīnqi', meaning: 'Kerabat / Sanak Saudara' },
      { pA: '同', pB: '事', hanzi: '同事', pinyin: 'tóngshì', meaning: 'Rekan Kerja' },
      { pA: '导', pB: '游', hanzi: '导游', pinyin: 'dǎoyóu', meaning: 'Pemandu Wisata' }
    ],
    cat5: [
      // Ronde 1
      { pA: '网', pB: '络', hanzi: '网络', pinyin: 'wǎngluò', meaning: 'Jaringan / Internet' },
      { pA: '投', pB: '资', hanzi: '投资', pinyin: 'tóuzī', meaning: 'Investasi Modal' },
      { pA: '合', pB: '作', hanzi: '合作', pinyin: 'hézuò', meaning: 'Kerja Sama' },
      { pA: '市', pB: '场', hanzi: '市场', pinyin: 'shìchǎng', meaning: 'Pasar Bisnis' },
      { pA: '广', pB: '告', hanzi: '广告', pinyin: 'guǎnggào', meaning: 'Iklan Promosi' },
      // Ronde 2
      { pA: '经', pB: '济', hanzi: '经济', pinyin: 'jīngjì', meaning: 'Perekonomian' },
      { pA: '贸', pB: '易', hanzi: '贸易', pinyin: 'màoyì', meaning: 'Perdagangan Dagang' },
      { pA: '智', pB: '能', hanzi: '智能', pinyin: 'zhìnéng', meaning: 'Kecerdasan Pintar / AI' },
      { pA: '数', pB: '据', hanzi: '数据', pinyin: 'shùjù', meaning: 'Data Informasi' },
      { pA: '软', pB: '件', hanzi: '软件', pinyin: 'ruǎnjiàn', meaning: 'Perangkat Lunak (Software)' },
      // Ronde 3
      { pA: '汇', pB: '率', hanzi: '汇率', pinyin: 'huìlǜ', meaning: 'Kurs Mata Uang' },
      { pA: '能', pB: '源', hanzi: '能源', pinyin: 'néngyuán', meaning: 'Energi / Sumber Daya' },
      { pA: '环', pB: '保', hanzi: '环保', pinyin: 'huánbǎo', meaning: 'Ramah Lingkungan' },
      { pA: '效', pB: '率', hanzi: '效率', pinyin: 'xiàolǜ', meaning: 'Efisiensi Produktivitas' },
      { pA: '专', pB: '利', hanzi: '专利', pinyin: 'zhuānlì', meaning: 'Hak Paten' }
    ],
    cat6: [
      // Ronde 1
      { pA: '传', pB: '统', hanzi: '传统', pinyin: 'chuántǒng', meaning: 'Tradisi Warisan' },
      { pA: '哲', pB: '学', hanzi: '哲学', pinyin: 'zhéxué', meaning: 'Filsafat' },
      { pA: '历', pB: '史', hanzi: '历史', pinyin: 'lìshǐ', meaning: 'Sejarah' },
      { pA: '智', pB: '慧', hanzi: '智慧', pinyin: 'zhìhuì', meaning: 'Kebijaksanaan' },
      { pA: '书', pB: '法', hanzi: '书法', pinyin: 'shūfǎ', meaning: 'Seni Kaligrafi' },
      // Ronde 2
      { pA: '戏', pB: '剧', hanzi: '戏剧', pinyin: 'xìjù', meaning: 'Opera / Drama Teater' },
      { pA: '丝', pB: '绸', hanzi: '丝绸', pinyin: 'sīchóu', meaning: 'Kain Sutra' },
      { pA: '茶', pB: '道', hanzi: '茶道', pinyin: 'chádào', meaning: 'Seni Upacara Minum Teh' },
      { pA: '武', pB: '术', hanzi: '武术', pinyin: 'wǔshù', meaning: 'Seni Bela Diri Wushu' },
      { pA: '礼', pB: '节', hanzi: '礼节', pinyin: 'lǐjié', meaning: 'Etika Tata Krama' },
      // Ronde 3
      { pA: '诗', pB: '歌', hanzi: '诗歌', pinyin: 'shīgē', meaning: 'Syair Puisi' },
      { pA: '典', pB: '故', hanzi: '典故', pinyin: 'diǎngù', meaning: 'Kiasan Klasik / Alusi' },
      { pA: '境', pB: '界', hanzi: '境界', pinyin: 'jìngjiè', meaning: 'Taraf Alam Spiritual' },
      { pA: '渊', pB: '源', hanzi: '渊源', pinyin: 'yuānyuán', meaning: 'Asal Muasal / Akar Sejarah' },
      { pA: '魅', pB: '力', hanzi: '魅力', pinyin: 'mèilì', meaning: 'Daya Pikat / Karisma' }
    ]
  },

  // Data Game Memory Match Card (Dengan Dukungan 6 Sesi Permainan)
  memorySessions: [
    { id: 'session1', name: 'Sesi 1: Salam & Dasar', hsk: 'HSK 1', icon: '🌟', desc: 'Sapaan hangat, angka & ungkapan sopan sehari-hari' },
    { id: 'session2', name: 'Sesi 2: Keluarga & Orang', hsk: 'HSK 1-2', icon: '👨‍👩‍👧', desc: 'Panggilan anggota keluarga & orang di sekitar' },
    { id: 'session3', name: 'Sesi 3: Kuliner & Minuman', hsk: 'HSK 1-2', icon: '🍜', desc: 'Makanan lezat, minuman segar & buah-buahan' },
    { id: 'session4', name: 'Sesi 4: Aktivitas & Belajar', hsk: 'HSK 2-3', icon: '📖', desc: 'Kata kerja rutinitas harian & kegiatan belajar' },
    { id: 'session5', name: 'Sesi 5: Waktu, Cuaca & Arah', hsk: 'HSK 2-3', icon: '☀️', desc: 'Keterangan waktu, suhu cuaca & arah posisi' },
    { id: 'session6', name: 'Sesi 6: Kota & Transportasi', hsk: 'HSK 2-4', icon: '🚗', desc: 'Tempat umum, kendaraan & sarana perjalanan' }
  ],
  memoryActiveSession: 'session1',
  memoryDifficulty: 'easy', // 'easy' (4x4, 8 pairs), 'medium' (5x5, 12 pairs + 1 bonus), 'hard' (6x6, 18 pairs)
  memoryTargetPairs: 8,
  memoryCards: [],
  memoryFlipped: [],
  memoryMatched: [],
  memoryMoves: 0,
  memoryGameStarted: false,

  // Bank Soal Kartu Memori Balik (6 Sesi x 10 Pasangan = 60 Pasang Kartu)
  memoryCardsBank: [
    // Sesi 1: Salam & Sapaan Dasar (10 Pasangan)
    { id: 1, session: 'session1', hanzi: '你好', text: 'Nǐ hǎo (Halo)' },
    { id: 2, session: 'session1', hanzi: '谢谢', text: 'Xièxie (Terima Kasih)' },
    { id: 3, session: 'session1', hanzi: '再见', text: 'Zàijiàn (Sampai Jumpa)' },
    { id: 4, session: 'session1', hanzi: '对不起', text: 'Duìbuqǐ (Minta Maaf)' },
    { id: 5, session: 'session1', hanzi: '没关系', text: 'Méi guānxi (Tidak Apa-apa)' },
    { id: 6, session: 'session1', hanzi: '请', text: 'Qǐng (Silakan / Tolong)' },
    { id: 7, session: 'session1', hanzi: '朋友', text: 'Péngyou (Teman / Sahabat)' },
    { id: 8, session: 'session1', hanzi: '高兴', text: 'Gāoxìng (Senang / Gembira)' },
    { id: 9, session: 'session1', hanzi: '名字', text: 'Míngzi (Nama)' },
    { id: 10, session: 'session1', hanzi: '中国', text: 'Zhōngguó (Tiongkok)' },

    // Sesi 2: Keluarga & Orang Sekitar (10 Pasangan)
    { id: 11, session: 'session2', hanzi: '爸爸', text: 'Bàba (Ayah / Papa)' },
    { id: 12, session: 'session2', hanzi: '妈妈', text: 'Māma (Ibu / Mama)' },
    { id: 13, session: 'session2', hanzi: '哥哥', text: 'Gēge (Kakak Laki-laki)' },
    { id: 14, session: 'session2', hanzi: '姐姐', text: 'Jiějie (Kakak Perempuan)' },
    { id: 15, session: 'session2', hanzi: '弟弟', text: 'Dìdi (Adik Laki-laki)' },
    { id: 16, session: 'session2', hanzi: '妹妹', text: 'Mèimei (Adik Perempuan)' },
    { id: 17, session: 'session2', hanzi: '老师', text: 'Lǎoshī (Guru / Pengajar)' },
    { id: 18, session: 'session2', hanzi: '学生', text: 'Xuésheng (Murid / Siswa)' },
    { id: 19, session: 'session2', hanzi: '医生', text: 'Yīshēng (Dokter)' },
    { id: 20, session: 'session2', hanzi: '孩子', text: 'Háizi (Anak / Anak-anak)' },

    // Sesi 3: Kuliner, Makanan & Minuman (10 Pasangan)
    { id: 21, session: 'session3', hanzi: '米饭', text: 'Mǐfàn (Nasi Putih)' },
    { id: 22, session: 'session3', hanzi: '面条', text: 'Miàntiáo (Mie)' },
    { id: 23, session: 'session3', hanzi: '水', text: 'Shuǐ (Air Mineral)' },
    { id: 24, session: 'session3', hanzi: '茶', text: 'Chá (Teh)' },
    { id: 25, session: 'session3', hanzi: '咖啡', text: 'Kāfēi (Kopi)' },
    { id: 26, session: 'session3', hanzi: '牛奶', text: 'Niúnǎi (Susu Sapi)' },
    { id: 27, session: 'session3', hanzi: '鸡蛋', text: 'Jīdàn (Telur Ayam)' },
    { id: 28, session: 'session3', hanzi: '苹果', text: 'Píngguǒ (Apel)' },
    { id: 29, session: 'session3', hanzi: '西瓜', text: 'Xīguā (Semangka)' },
    { id: 30, session: 'session3', hanzi: '面包', text: 'Miànbāo (Roti)' },

    // Sesi 4: Aktivitas Harian & Belajar (10 Pasangan)
    { id: 31, session: 'session4', hanzi: '吃', text: 'Chī (Makan)' },
    { id: 32, session: 'session4', hanzi: '喝', text: 'Hē (Minum)' },
    { id: 33, session: 'session4', hanzi: '看', text: 'Kàn (Melihat / Menonton)' },
    { id: 34, session: 'session4', hanzi: '听', text: 'Tīng (Mendengar)' },
    { id: 35, session: 'session4', hanzi: '写', text: 'Xiě (Menulis)' },
    { id: 36, session: 'session4', hanzi: '说话', text: 'Shuōhuà (Berbicara)' },
    { id: 37, session: 'session4', hanzi: '睡觉', text: 'Shuìjiào (Tidur)' },
    { id: 38, session: 'session4', hanzi: '学习', text: 'Xuéxí (Belajar)' },
    { id: 39, session: 'session4', hanzi: '买', text: 'Mǎi (Membeli)' },
    { id: 40, session: 'session4', hanzi: '去', text: 'Qù (Pergi)' },

    // Sesi 5: Waktu, Cuaca & Arah Posisi (10 Pasangan)
    { id: 41, session: 'session5', hanzi: '今天', text: 'Jīntiān (Hari Ini)' },
    { id: 42, session: 'session5', hanzi: '明天', text: 'Míngtiān (Besok)' },
    { id: 43, session: 'session5', hanzi: '昨天', text: 'Zuótiān (Kemarin)' },
    { id: 44, session: 'session5', hanzi: '现在', text: 'Xiànzài (Sekarang)' },
    { id: 45, session: 'session5', hanzi: '天气', text: 'Tiānqì (Cuaca)' },
    { id: 46, session: 'session5', hanzi: '冷', text: 'Lěng (Dingin)' },
    { id: 47, session: 'session5', hanzi: '热', text: 'Rè (Panas)' },
    { id: 48, session: 'session5', hanzi: '上', text: 'Shàng (Atas)' },
    { id: 49, session: 'session5', hanzi: '下', text: 'Xià (Bawah)' },
    { id: 50, session: 'session5', hanzi: '左', text: 'Zuǒ (Kiri)' },

    // Sesi 6: Kota, Tempat & Transportasi (10 Pasangan)
    { id: 51, session: 'session6', hanzi: '学校', text: 'Xuéxiào (Sekolah)' },
    { id: 52, session: 'session6', hanzi: '医院', text: 'Yīyuàn (Rumah Sakit)' },
    { id: 53, session: 'session6', hanzi: '商店', text: 'Shāngdiàn (Toko)' },
    { id: 54, session: 'session6', hanzi: '车站', text: 'Chēzhàn (Stasiun / Halte)' },
    { id: 55, session: 'session6', hanzi: '机场', text: 'Jīchǎng (Bandara Udara)' },
    { id: 56, session: 'session6', hanzi: '出租车', text: 'Chūzūchē (Taksi)' },
    { id: 57, session: 'session6', hanzi: '飞机', text: 'Fēijī (Pesawat Terbang)' },
    { id: 58, session: 'session6', hanzi: '北京', text: 'Běijīng (Beijing)' },
    { id: 59, session: 'session6', hanzi: '家', text: 'Jiā (Rumah)' },
    { id: 60, session: 'session6', hanzi: '路', text: 'Lù (Jalan Raya)' }
  ],

  syncAdminGameData() {
    if (window.DB_TONE_TRAINER && Array.isArray(window.DB_TONE_TRAINER) && window.DB_TONE_TRAINER.length > 0) {
      this.toneTrainerBank = window.DB_TONE_TRAINER;
    }
    if (window.DB_WORD_LINK && Array.isArray(window.DB_WORD_LINK) && window.DB_WORD_LINK.length > 0) {
      const grouped = { cat1: [], cat2: [], cat3: [], cat4: [], cat5: [], cat6: [] };
      window.DB_WORD_LINK.forEach(w => {
        const cat = w.category || 'cat1';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
          pA: w.pA,
          pB: w.pB,
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          meaning: w.meaning
        });
      });
      this.wordLinkBankByCat = grouped;
    }
    if (window.DB_MEMORY_MATCH && Array.isArray(window.DB_MEMORY_MATCH) && window.DB_MEMORY_MATCH.length > 0) {
      this.memoryCardsBank = window.DB_MEMORY_MATCH;
    }
    if (window.DB_PINYIN_HANZI && Array.isArray(window.DB_PINYIN_HANZI) && window.DB_PINYIN_HANZI.length > 0) {
      this.pinyinHanziBank = window.DB_PINYIN_HANZI;
    }
  },

  renderGameArenaPage() {
    this.syncAdminGameData();
    const container = document.getElementById('game-arena-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Header Banner Game Arena -->
      <div class="quiz-hero-banner" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1.5px solid #ddd6fe;">
        <div>
          <span class="role-badge" style="background: #8b5cf6; color: #ffffff; font-weight: 800; font-size: 0.75rem;">
            🎮 ARENA GAME MANDARIN (游戏中心)
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #4c1d95; margin-top: 6px;">
            Belajar Sambil Bermain: Nada, Karakter & Kata Mandarin
          </h2>
          <p style="font-size: 0.88rem; color: #6d28d9; margin-top: 4px; max-width: 760px;">
            Asah kepekaan 4 nada Mandarin (四声) dari level HSK 1–6, hubungkan kata majemuk tematik, uji daya ingat kartu memori 6 sesi, dan cocokkan Pinyin ke Hanzi secara acak!
          </p>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="cerita-filter-pill ${this.activeGameTab === 'tone' ? 'active' : ''}" onclick="MandarinkuExtras.switchGameTab('tone')">
            🎵 Pelatih 4 Nada (四声 HSK 1–6)
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeGameTab === 'link' ? 'active' : ''}" onclick="MandarinkuExtras.switchGameTab('link')">
            🧩 Pasang Kata (趣味组词 6 Bagian)
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeGameTab === 'memory' ? 'active' : ''}" onclick="MandarinkuExtras.switchGameTab('memory')">
            🃏 Kartu Memori Balik (4x4, 5x5, 6x6)
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeGameTab === 'pinyin_hanzi' ? 'active' : ''}" onclick="MandarinkuExtras.switchGameTab('pinyin_hanzi')">
            🎯 Cocok Pinyin ➔ Hanzi (HSK 1–6 Acak)
          </button>
          <a href="admin/game_arena.php" target="_blank" style="background: #7c3aed; color: #ffffff; text-decoration: none; padding: 7px 14px; border-radius: 99px; font-weight: 800; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.25);">
            ⚙️ Panel Admin Game (Edit/Tambah Soal) ↗
          </a>
        </div>
      </div>

      <div id="game-arena-body"></div>
    `;

    this.renderGameTabBody();
  },

  switchGameTab(tab) {
    this.activeGameTab = tab;
    this.renderGameArenaPage();
  },

  renderGameTabBody() {
    const body = document.getElementById('game-arena-body');
    if (!body) return;

    if (this.activeGameTab === 'tone') {
      this.renderToneTrainerSection(body);
    } else if (this.activeGameTab === 'link') {
      this.renderWordLinkSection(body);
    } else if (this.activeGameTab === 'memory') {
      this.renderMemoryMatchSection(body);
    } else if (this.activeGameTab === 'pinyin_hanzi') {
      this.renderPinyinHanziSection(body);
    }
  },

  // --- SUB-GAME 1: TONE TRAINER (PELATIH 4 NADA MANDARIN HSK 1 - 6) ---
  getFilteredToneTrainerQuestions() {
    let list = this.toneTrainerBank || [];
    if (this.toneTrainerDifficulty && this.toneTrainerDifficulty !== 'all') {
      list = list.filter(q => {
        const diff = q.difficulty || (q.level <= 2 ? 'easy' : (q.level <= 4 ? 'medium' : 'hard'));
        return diff === this.toneTrainerDifficulty;
      });
    }
    if (this.toneTrainerLevel !== 'all') {
      const lvl = parseInt(this.toneTrainerLevel) || 1;
      list = list.filter(q => q.level === lvl);
    }
    return list;
  },

  setToneTrainerDifficulty(diff) {
    this.toneTrainerDifficulty = diff;
    this.toneTrainerLevel = 'all';
    this.toneTrainerIndex = 0;
    this.toneTrainerChecked = null;
    this.renderGameTabBody();
    const list = this.getFilteredToneTrainerQuestions();
    if (list[0] && typeof speakMandarin === 'function') {
      setTimeout(() => speakMandarin(list[0].audio, 0.85), 250);
    }
  },

  setToneTrainerLevel(lvl) {
    this.toneTrainerLevel = lvl;
    this.toneTrainerIndex = 0;
    this.toneTrainerChecked = null;
    this.renderGameTabBody();
    const list = this.getFilteredToneTrainerQuestions();
    if (list[0] && typeof speakMandarin === 'function') {
      setTimeout(() => speakMandarin(list[0].audio, 0.85), 250);
    }
  },

  jumpToToneTrainerQuestion(idx) {
    const list = this.getFilteredToneTrainerQuestions();
    if (idx >= 0 && idx < list.length) {
      this.toneTrainerIndex = idx;
      this.toneTrainerChecked = null;
      this.renderGameTabBody();
      if (typeof speakMandarin === 'function') {
        setTimeout(() => speakMandarin(list[idx].audio, 0.85), 200);
      }
    }
  },

  renderToneTrainerSection(container) {
    const pool = this.getFilteredToneTrainerQuestions();
    if (this.toneTrainerIndex >= pool.length) {
      this.toneTrainerIndex = 0;
    }
    const current = pool[this.toneTrainerIndex] || pool[0];

    container.innerHTML = `
      <div class="modern-feature-card" style="background: #ffffff; border-radius: 24px; border: 1px solid rgba(0,0,0,0.04); padding: 28px; box-shadow: 0 6px 24px rgba(0,0,0,0.03); max-width: 760px; margin: 0 auto;">
        
        <!-- Toolbar Filter Tingkat Kesulitan Easy / Medium / Hard -->
        <div style="margin-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 0.82rem; color: #475569;">PILIH TINGKAT KESULITAN:</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.75rem; font-weight: 800; background: #fdf2f8; color: #db2777; padding: 3px 12px; border-radius: 9999px;">
                🔥 Streak: ${this.toneTrainerStreak}x
              </span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #8b5cf6;">
                🏆 ${this.toneTrainerScore} Poin
              </span>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="cerita-filter-pill ${this.toneTrainerDifficulty === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setToneTrainerDifficulty('all')" style="padding: 5px 12px; font-size: 0.78rem;">
              🌟 Semua Level (${this.toneTrainerBank.length} Soal)
            </button>
            <button class="cerita-filter-pill ${this.toneTrainerDifficulty === 'easy' ? 'active' : ''}" 
                    style="${this.toneTrainerDifficulty === 'easy' ? 'background: #059669; border-color: #047857; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setToneTrainerDifficulty('easy')">
              🟢 Easy (HSK 1–2 • 40 Soal)
            </button>
            <button class="cerita-filter-pill ${this.toneTrainerDifficulty === 'medium' ? 'active' : ''}" 
                    style="${this.toneTrainerDifficulty === 'medium' ? 'background: #d97706; border-color: #b45309; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setToneTrainerDifficulty('medium')">
              🟡 Medium (HSK 3–4 • 40 Soal)
            </button>
            <button class="cerita-filter-pill ${this.toneTrainerDifficulty === 'hard' ? 'active' : ''}" 
                    style="${this.toneTrainerDifficulty === 'hard' ? 'background: #dc2626; border-color: #b91c1c; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setToneTrainerDifficulty('hard')">
              🔴 Hard (HSK 5–6 • 40 Soal)
            </button>
          </div>
        </div>

        <!-- Filter Sub-Level HSK Spesifik -->
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;">
          <span style="font-weight: 800; font-size: 0.76rem; color: #64748b;">Filter HSK:</span>
          <button class="cerita-filter-pill ${this.toneTrainerLevel === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setToneTrainerLevel('all')" style="padding: 3px 8px; font-size: 0.74rem;">
            Semua HSK
          </button>
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button class="cerita-filter-pill ${this.toneTrainerLevel === lvl ? 'active' : ''}" onclick="MandarinkuExtras.setToneTrainerLevel(${lvl})" style="padding: 3px 8px; font-size: 0.74rem;">
              HSK ${lvl} (20)
            </button>
          `).join('')}
        </div>

        <!-- Bar Lompat Nomor Soal Cepat -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; align-items: center; margin-bottom: 20px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #64748b; margin-right: 4px;">Pilih Soal:</span>
          ${pool.map((q, idx) => {
            const isCurr = (idx === this.toneTrainerIndex);
            return `
              <button type="button" onclick="MandarinkuExtras.jumpToToneTrainerQuestion(${idx})" style="min-width: 32px; height: 30px; padding: 0 6px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.15s; border: none; background: ${isCurr ? '#ea580c' : 'rgba(0,0,0,0.04)'}; color: ${isCurr ? '#ffffff' : '#475569'};" title="Soal ${idx + 1}: Karakter '${q.hanzi}' (${q.meaning})">
                ${idx + 1}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Audio Player Hero Box -->
        <div style="text-align: center; padding: 24px 16px; background: #f5f3ff; border-radius: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; max-width: 500px; margin: 0 auto 10px auto;">
            <span style="font-size: 0.74rem; font-weight: 800; background: #ede9fe; color: #6d28d9; padding: 2px 10px; border-radius: 9999px;">
              HSK Level ${current.level} • Soal ${this.toneTrainerIndex + 1} / ${pool.length}
            </span>
            <span style="font-size: 0.76rem; color: #6d28d9; font-weight: 700;">
              Klik tombol untuk putar suara
            </span>
          </div>
          
          <button type="button" class="btn-primary-sakura" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 14px 28px; font-size: 1.1rem; border-radius: 9999px; margin: 0 auto; box-shadow: 0 6px 20px rgba(139,92,246,0.25);" onclick="if(typeof speakMandarin==='function') speakMandarin('${current.audio}', 0.85)">
            🔊 Putar Suara Pelafalan
          </button>
          
          <div style="margin-top: 14px; font-size: 0.88rem; color: #475569;">
            Karakter Target: <strong style="font-family: var(--font-chinese, serif); font-size: 1.6rem; color: #0f172a; margin-left: 4px; vertical-align: middle;">${current.hanzi}</strong>
            <span style="color: #64748b; margin-left: 8px;">(Arti: <strong>${current.meaning}</strong>)</span>
          </div>
        </div>

        <!-- 4 Tombol Pilihan Nada Mandarin -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <!-- Nada 1 -->
          <button type="button" class="modern-course-card" onclick="MandarinkuExtras.checkToneTrainerAnswer(1)" style="padding: 16px 20px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.1rem; font-weight: 900; color: #ef4444;">1. 一声 (Nada 1)</span>
              <span style="font-size: 1.6rem; font-weight: 900; color: #ef4444;">—</span>
            </div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">Datar Tinggi (Yīnpíng 55)</div>
          </button>

          <!-- Nada 2 -->
          <button type="button" class="modern-course-card" onclick="MandarinkuExtras.checkToneTrainerAnswer(2)" style="padding: 16px 20px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.1rem; font-weight: 900; color: #f59e0b;">2. 二声 (Nada 2)</span>
              <span style="font-size: 1.6rem; font-weight: 900; color: #f59e0b;">/</span>
            </div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">Menanjak Naik (Yángpíng 35)</div>
          </button>

          <!-- Nada 3 -->
          <button type="button" class="modern-course-card" onclick="MandarinkuExtras.checkToneTrainerAnswer(3)" style="padding: 16px 20px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.1rem; font-weight: 900; color: #10b981;">3. 三声 (Nada 3)</span>
              <span style="font-size: 1.6rem; font-weight: 900; color: #10b981;">V</span>
            </div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">Turun-Naik Rendah (Shǎngshēng 214)</div>
          </button>

          <!-- Nada 4 -->
          <button type="button" class="modern-course-card" onclick="MandarinkuExtras.checkToneTrainerAnswer(4)" style="padding: 16px 20px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.1rem; font-weight: 900; color: #3b82f6;">4. 四声 (Nada 4)</span>
              <span style="font-size: 1.6rem; font-weight: 900; color: #3b82f6;">\\</span>
            </div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">Turun Cepat & Tegas (Qùshēng 51)</div>
          </button>
        </div>

        <!-- Feedback Result Box -->
        ${this.toneTrainerChecked !== null ? `
          <div style="padding: 14px 18px; border-radius: 14px; margin-bottom: 16px; background: ${this.toneTrainerChecked.isCorrect ? '#ecfdf5' : '#fef2f2'}; border: 1.5px solid ${this.toneTrainerChecked.isCorrect ? '#6ee7b7' : '#fecaca'}; color: ${this.toneTrainerChecked.isCorrect ? '#065f46' : '#991b1b'};">
            <div style="font-weight: 800; font-size: 0.95rem;">
              ${this.toneTrainerChecked.isCorrect ? '🎉 Benar Sekali! Telinga Anda Sangat Peka (+15 EXP)' : '❌ Kurang tepat!'}
            </div>
            <div style="margin-top: 6px; font-size: 0.9rem;">
              Karakter <strong>${current.hanzi}</strong> dibaca: <strong style="color: #ea580c; font-size: 1.15rem;">${current.pinyin}</strong> (Nada ${current.tone} • HSK ${current.level}).
            </div>
            <div style="margin-top: 4px; font-size: 0.82rem; opacity: 0.95;">
              💡 ${current.tip}
            </div>
          </div>
          <div style="text-align: center;">
            <button type="button" class="btn-primary-sakura" style="padding: 10px 24px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.nextToneTrainerQuestion()">
              Soal Berikutnya ➔
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  checkToneTrainerAnswer(toneNum) {
    if (this.toneTrainerChecked !== null) return;
    const pool = this.getFilteredToneTrainerQuestions();
    const current = pool[this.toneTrainerIndex] || pool[0];
    const isCorrect = (toneNum === current.tone);

    if (isCorrect) {
      this.toneTrainerScore += 10;
      this.toneTrainerStreak += 1;
      if (typeof recordUserActivity === 'function') {
        recordUserActivity('listening', 15, 5, `tone_trainer_${current.hanzi}`, 1);
      }
    } else {
      this.toneTrainerStreak = 0;
    }

    this.toneTrainerChecked = { isCorrect, selected: toneNum };
    this.renderGameTabBody();
  },

  nextToneTrainerQuestion() {
    const pool = this.getFilteredToneTrainerQuestions();
    this.toneTrainerIndex = (this.toneTrainerIndex + 1) % pool.length;
    this.toneTrainerChecked = null;
    this.renderGameTabBody();
    const nextItem = pool[this.toneTrainerIndex];
    if (nextItem && typeof speakMandarin === 'function') {
      setTimeout(() => speakMandarin(nextItem.audio, 0.85), 200);
    }
  },

  // --- SUB-GAME 2: WORD LINK (PASANG KATA MAJEMUK / 趣味组词 6 BAGIAN TEMATIK) ---
  setWordLinkDifficulty(diff) {
    this.wordLinkDifficulty = diff;
    if (diff === 'easy') {
      this.wordLinkActiveCat = 'cat1';
    } else if (diff === 'medium') {
      this.wordLinkActiveCat = 'cat3';
    } else if (diff === 'hard') {
      this.wordLinkActiveCat = 'cat5';
    }
    this.wordLinkCatRound = 0;
    this.wordLinkActiveSet = null;
    this.initWordLinkRound();
    this.renderGameTabBody();
  },

  selectWordLinkCategory(catId) {
    this.wordLinkActiveCat = catId;
    this.wordLinkCatRound = 0;
    this.initWordLinkRound();
    this.renderGameTabBody();
  },

  selectWordLinkRound(roundIdx) {
    this.wordLinkCatRound = roundIdx;
    this.initWordLinkRound();
    this.renderGameTabBody();
  },

  initWordLinkRound() {
    const catWords = this.wordLinkBankByCat[this.wordLinkActiveCat] || this.wordLinkBankByCat['cat1'];
    const startIdx = (this.wordLinkCatRound * 5) % catWords.length;
    let slice = catWords.slice(startIdx, startIdx + 5);
    if (slice.length < 5) slice = catWords.slice(0, 5);

    // Acak kolom B agar posisinya tidak sejajar dengan kolom A
    const colB = slice.map((item, idx) => ({ char: item.pB, wordIndex: idx }));
    for (let i = colB.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colB[i], colB[j]] = [colB[j], colB[i]];
    }

    this.wordLinkActiveSet = {
      items: slice,
      colA: slice.map((item, idx) => ({ char: item.pA, wordIndex: idx })),
      colB: colB
    };
    this.wordLinkSelectedA = null;
    this.wordLinkMatched = [];
  },

  renderWordLinkSection(container) {
    if (!this.wordLinkActiveSet) {
      this.initWordLinkRound();
    }
    const state = this.wordLinkActiveSet;
    const catInfo = this.wordLinkCategories.find(c => c.id === this.wordLinkActiveCat) || this.wordLinkCategories[0];
    const catWords = this.wordLinkBankByCat[this.wordLinkActiveCat] || [];
    const totalRounds = Math.ceil(catWords.length / 5);
    const allDoneInRound = (this.wordLinkMatched.length === state.items.length);

    const availableCats = (this.wordLinkDifficulty === 'all') 
      ? this.wordLinkCategories 
      : this.wordLinkCategories.filter(c => {
          if (this.wordLinkDifficulty === 'easy') return ['cat1', 'cat2'].includes(c.id);
          if (this.wordLinkDifficulty === 'medium') return ['cat3', 'cat4'].includes(c.id);
          if (this.wordLinkDifficulty === 'hard') return ['cat5', 'cat6'].includes(c.id);
          return true;
        });

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 26px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 780px; margin: 0 auto;">
        
        <!-- Toolbar Filter Tingkat Kesulitan Easy / Medium / Hard -->
        <div style="margin-bottom: 16px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 0.82rem; color: #475569;">PILIH TINGKAT KESULITAN:</span>
            <div style="font-size: 0.82rem; font-weight: 800; color: #8b5cf6;">
              🏆 Skor: ${this.wordLinkScore} Poin
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="cerita-filter-pill ${this.wordLinkDifficulty === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setWordLinkDifficulty('all')" style="padding: 5px 12px; font-size: 0.78rem;">
              🌟 Semua Level (120 Pasang)
            </button>
            <button class="cerita-filter-pill ${this.wordLinkDifficulty === 'easy' ? 'active' : ''}" 
                    style="${this.wordLinkDifficulty === 'easy' ? 'background: #059669; border-color: #047857; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setWordLinkDifficulty('easy')">
              🟢 Easy (Dasar • 40 Pasang)
            </button>
            <button class="cerita-filter-pill ${this.wordLinkDifficulty === 'medium' ? 'active' : ''}" 
                    style="${this.wordLinkDifficulty === 'medium' ? 'background: #d97706; border-color: #b45309; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setWordLinkDifficulty('medium')">
              🟡 Medium (Menengah • 40 Pasang)
            </button>
            <button class="cerita-filter-pill ${this.wordLinkDifficulty === 'hard' ? 'active' : ''}" 
                    style="${this.wordLinkDifficulty === 'hard' ? 'background: #dc2626; border-color: #b91c1c; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setWordLinkDifficulty('hard')">
              🔴 Hard (Mahir • 40 Pasang)
            </button>
          </div>
        </div>

        <!-- Pilihan Bagian / Kategori Tematik -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #475569; margin-bottom: 8px;">
            📚 Pilih Bagian Kategori Kosakata:
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
            ${availableCats.map(cat => {
              const isActive = (this.wordLinkActiveCat === cat.id);
              return `
                <button type="button" onclick="MandarinkuExtras.selectWordLinkCategory('${cat.id}')" style="padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${isActive ? '#8b5cf6' : '#cbd5e1'}; background: ${isActive ? '#f5f3ff' : '#ffffff'}; text-align: left; cursor: pointer; transition: all 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 800; font-size: 0.82rem; color: ${isActive ? '#6d28d9' : '#0f172a'};">
                      ${cat.icon} ${cat.name}
                    </span>
                    <span style="font-size: 0.68rem; font-weight: 800; background: ${isActive ? '#8b5cf6' : '#e2e8f0'}; color: ${isActive ? '#fff' : '#475569'}; padding: 1px 6px; border-radius: 99px;">
                      ${cat.hsk}
                    </span>
                  </div>
                  <div style="font-size: 0.7rem; color: #64748b; margin-top: 3px; line-height: 1.2;">
                    ${cat.desc}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Sub-Navigasi Ronde di dalam Bagian yang dipilih -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; background: #f8fafc; padding: 12px 16px; border-radius: 14px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #334155;">Pilih Ronde Paket:</span>
            ${Array.from({ length: totalRounds }).map((_, rIdx) => {
              const isCurr = (this.wordLinkCatRound === rIdx);
              return `
                <button type="button" onclick="MandarinkuExtras.selectWordLinkRound(${rIdx})" style="padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 800; cursor: pointer; border: 1.5px solid ${isCurr ? '#ea580c' : '#cbd5e1'}; background: ${isCurr ? '#ea580c' : '#ffffff'}; color: ${isCurr ? '#ffffff' : '#475569'};">
                  Ronde ${rIdx + 1} (5 Kata)
                </button>
              `;
            }).join('')}
          </div>

          <div style="font-size: 0.82rem; font-weight: 800; color: #8b5cf6;">
            🏆 Terpasang: ${this.wordLinkMatched.length} / 5 Kata
          </div>
        </div>

        <!-- Area Kotak Pasang Kata: Kolom A vs Kolom B -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <!-- Kolom A (Karakter Depan) -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #475569; text-align: center; background: #f1f5f9; padding: 4px 8px; border-radius: 8px;">
              ① Karakter Depan
            </div>
            ${state.colA.map((item, idx) => {
              const isMatched = this.wordLinkMatched.includes(item.wordIndex);
              const isSelected = (this.wordLinkSelectedA === item.wordIndex);
              return `
                <button type="button" class="wordlink-card-btn ${isMatched ? 'matched' : (isSelected ? 'selected' : '')}" onclick="MandarinkuExtras.selectWordLinkA(${item.wordIndex})" ${isMatched ? 'disabled' : ''}>
                  ${item.char} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Kolom B (Karakter Belakang) -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #475569; text-align: center; background: rgba(0,0,0,0.03); padding: 6px 12px; border-radius: 10px;">
              ② Karakter Belakang
            </div>
            ${state.colB.map((item, idx) => {
              const isMatched = this.wordLinkMatched.includes(item.wordIndex);
              return `
                <button type="button" class="wordlink-card-btn ${isMatched ? 'matched' : ''}" onclick="MandarinkuExtras.selectWordLinkB(${item.wordIndex})" ${isMatched ? 'disabled' : ''}>
                  ${item.char} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Daftar Kata yang Berhasil Dirangkai -->
        ${this.wordLinkMatched.length > 0 ? `
          <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #475569; margin-bottom: 8px;">✨ Kata Majemuk yang Berhasil Terbentuk:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${this.wordLinkMatched.map(wIdx => {
                const w = state.items[wIdx];
                return `
                  <span style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 8px; font-size: 0.82rem;">
                    <strong style="font-family: var(--font-chinese, serif); font-size: 1.15rem; color: #059669;">${w.hanzi}</strong>
                    <span style="color: #ea580c; font-weight: 700;">[${w.pinyin}]</span>
                    <span>= ${w.meaning}</span>
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${allDoneInRound ? `
          <div style="text-align: center; background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 14px; padding: 18px;">
            <div style="font-size: 1.05rem; font-weight: 900; color: #065f46; margin-bottom: 4px;">
              🎉 Hebat Sekali! Semua 5 Kata di Ronde Ini Berhasil Dipasangkan (+25 EXP)
            </div>
            <p style="font-size: 0.8rem; color: #047857; margin-bottom: 12px;">
              ${this.wordLinkCatRound < totalRounds - 1 ? 'Lanjutkan ke ronde berikutnya di kategori ini atau pilih kategori lain.' : 'Selamat! Anda telah menyelesaikan seluruh ronde di bagian ini.'}
            </p>
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
              ${this.wordLinkCatRound < totalRounds - 1 ? `
                <button type="button" class="btn-primary-sakura" style="padding: 9px 22px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.nextWordLinkRound()">
                  Ronde Berikutnya (Ronde ${this.wordLinkCatRound + 2}) ➔
                </button>
              ` : `
                <button type="button" class="btn-primary-sakura" style="padding: 9px 22px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.nextWordLinkCategory()">
                  Pindah ke Bagian Berikutnya ➔
                </button>
              `}
              <button type="button" class="btn-learn-outline" style="padding: 9px 18px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.initWordLinkRound(); MandarinkuExtras.renderGameTabBody();">
                Ulangi Ronde Ini ↺
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  selectWordLinkA(wordIndex) {
    this.wordLinkSelectedA = wordIndex;
    this.renderGameTabBody();
  },

  selectWordLinkB(wordIndex) {
    if (this.wordLinkSelectedA === null) {
      if (typeof showToast === 'function') showToast('Pilih dulu karakter di Kolom Kiri! 👆', 'warning');
      return;
    }

    if (this.wordLinkSelectedA === wordIndex) {
      // Cocok!
      this.wordLinkMatched.push(wordIndex);
      const w = this.wordLinkActiveSet.items[wordIndex];
      this.wordLinkSelectedA = null;
      if (typeof speakMandarin === 'function') speakMandarin(w.hanzi, 0.85);
      if (typeof showToast === 'function') showToast(`✅ Tepat! ${w.hanzi} (${w.pinyin}) = ${w.meaning}`);
      if (typeof recordUserActivity === 'function') recordUserActivity('reading', 10, 2, `wordlink_${w.hanzi}`, 1);
    } else {
      if (typeof showToast === 'function') showToast('❌ Pasangan karakter belum tepat, coba cari karakter lain!', 'warning');
      this.wordLinkSelectedA = null;
    }
    this.renderGameTabBody();
  },

  nextWordLinkRound() {
    const catWords = this.wordLinkBankByCat[this.wordLinkActiveCat] || [];
    const totalRounds = Math.ceil(catWords.length / 5);
    this.wordLinkCatRound = (this.wordLinkCatRound + 1) % totalRounds;
    this.initWordLinkRound();
    this.renderGameTabBody();
  },

  nextWordLinkCategory() {
    const cats = this.wordLinkCategories;
    const currIdx = cats.findIndex(c => c.id === this.wordLinkActiveCat);
    const nextIdx = (currIdx + 1) % cats.length;
    this.selectWordLinkCategory(cats[nextIdx].id);
  },

  selectMemorySession(sessionId) {
    this.memoryActiveSession = sessionId;
    this.initMemoryMatchGame();
    this.renderGameTabBody();
  },

  nextMemorySession() {
    const sessions = this.memorySessions;
    const currIdx = sessions.findIndex(s => s.id === this.memoryActiveSession);
    const nextIdx = (currIdx + 1) % sessions.length;
    this.selectMemorySession(sessions[nextIdx].id);
  },

  setMemoryDifficulty(diff) {
    if (['easy', 'medium', 'hard'].includes(diff)) {
      this.memoryDifficulty = diff;
      this.initMemoryMatchGame();
      this.renderGameTabBody();
    }
  },

  // --- SUB-GAME 3: MEMORY MATCH CARD (KARTU MEMORI BALIK: EASY 4x4, MEDIUM 5x5, HARD 6x6) ---
  initMemoryMatchGame() {
    this.syncAdminGameData();
    const bank = (this.memoryCardsBank && this.memoryCardsBank.length > 0) ? this.memoryCardsBank : [];
    
    // Tentukan jumlah pasangan berdasarkan tingkat kesulitan:
    // - Easy (4x4) = 8 pasang (16 kartu)
    // - Medium (5x5) = 12 pasang (24 kartu) + 1 Kartu Bonus di tengah = 25 kartu
    // - Hard (6x6) = 18 pasang (36 kartu)
    let targetPairsCount = 8;
    if (this.memoryDifficulty === 'medium') {
      targetPairsCount = 12;
    } else if (this.memoryDifficulty === 'hard') {
      targetPairsCount = 18;
    }

    let sessionPairs = [];
    if (this.memoryActiveSession === 'all') {
      sessionPairs = [...bank];
    } else {
      sessionPairs = bank.filter(p => (p.session || 'session1') === this.memoryActiveSession);
    }

    // Ambil pasangan acak dari sesi yang dipilih
    let shuffledPairs = [...sessionPairs].sort(() => Math.random() - 0.5).slice(0, targetPairsCount);
    
    // Jika pasangan pada sesi tersebut kurang dari target (misal sesi ada 10 pasang, tapi butuh 12 atau 18 pasang),
    // lengkapi dari bank soal sesi lainnya agar jumlah kartu selalu pas
    if (shuffledPairs.length < targetPairsCount && bank.length >= targetPairsCount) {
      const remainingBank = bank.filter(p => !shuffledPairs.some(sp => sp.id === p.id)).sort(() => Math.random() - 0.5);
      shuffledPairs = shuffledPairs.concat(remainingBank.slice(0, targetPairsCount - shuffledPairs.length));
    }
    this.memoryTargetPairs = shuffledPairs.length;

    const cards = [];
    shuffledPairs.forEach(p => {
      cards.push({ cardId: `h_${p.id}`, pairId: p.id, type: 'hanzi', content: p.hanzi, audio: p.hanzi });
      cards.push({ cardId: `p_${p.id}`, pairId: p.id, type: 'pinyin', content: p.text, audio: p.hanzi });
    });

    // Shuffle kartu pasangan
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Khusus Grid 5x5 (Medium): Sisipkan 1 Kartu Bonus Keberuntungan 🧧 di posisi tengah (index 12, baris 3 kolom 3)
    if (this.memoryDifficulty === 'medium') {
      cards.splice(12, 0, {
        cardId: 'bonus_center',
        pairId: 'bonus_center',
        type: 'bonus',
        content: '福',
        text: 'Fú (Berkah)',
        audio: '福',
        isBonus: true
      });
    }

    this.memoryCards = cards;
    this.memoryFlipped = [];
    this.memoryMatched = [];
    this.memoryMoves = 0;
    this.memoryGameStarted = true;
  },

  renderMemoryMatchSection(container) {
    if (!this.memoryGameStarted || this.memoryCards.length === 0) {
      this.initMemoryMatchGame();
    }
    const currentSession = this.memorySessions.find(s => s.id === this.memoryActiveSession) || {
      id: 'all',
      name: 'Semua Sesi (Campuran)',
      hsk: 'HSK 1-4',
      icon: '🌟',
      desc: 'Kosakata Mandarin gabungan dari seluruh tema dan tingkatan'
    };
    
    const matchedPairsCount = this.memoryMatched.filter(id => id !== 'bonus_center').length;
    const isFinished = (matchedPairsCount >= (this.memoryTargetPairs || 8));

    // Konfigurasi Grid & Layout berdasarkan Level
    const diff = this.memoryDifficulty || 'easy';
    let cols = 4;
    let maxW = '700px';
    let gap = 'clamp(6px, 1.6vw, 12px)';
    let hanziSize = 'clamp(1.3rem, 3.5vw, 1.85rem)';
    let pinyinSize = 'clamp(0.72rem, 2vw, 0.88rem)';
    let lanternSize = 'clamp(1.4rem, 3.8vw, 1.8rem)';
    let cardPadding = 'clamp(6px, 1.5vw, 10px)';
    let expReward = 30;
    let diffName = '🟢 Easy (4 × 4)';

    if (diff === 'medium') {
      cols = 5;
      maxW = '760px';
      gap = 'clamp(5px, 1.2vw, 10px)';
      hanziSize = 'clamp(1.1rem, 2.7vw, 1.5rem)';
      pinyinSize = 'clamp(0.65rem, 1.6vw, 0.78rem)';
      lanternSize = 'clamp(1.2rem, 3vw, 1.5rem)';
      cardPadding = 'clamp(4px, 1vw, 8px)';
      expReward = 50;
      diffName = '🟡 Medium (5 × 5)';
    } else if (diff === 'hard') {
      cols = 6;
      maxW = '840px';
      gap = 'clamp(4px, 0.9vw, 8px)';
      hanziSize = 'clamp(0.95rem, 2.2vw, 1.25rem)';
      pinyinSize = 'clamp(0.55rem, 1.3vw, 0.68rem)';
      lanternSize = 'clamp(0.95rem, 2.4vw, 1.25rem)';
      cardPadding = 'clamp(3px, 0.8vw, 6px)';
      expReward = 80;
      diffName = '🔴 Hard (6 × 6)';
    }

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 26px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: ${maxW}; margin: 0 auto; transition: max-width 0.3s;">
        
        <!-- Pilihan Tingkat Kesulitan & Grid Size -->
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <span style="font-weight: 800; font-size: 0.82rem; color: #475569;">PILIH TINGKAT KESULITAN & UKURAN GRID:</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; padding: 2px 10px; border-radius: 99px;">
              ${diffName}
            </span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="cerita-filter-pill ${diff === 'easy' ? 'active' : ''}" 
                    style="${diff === 'easy' ? 'background: #059669; border-color: #047857; color: #fff; font-weight: 800;' : ''}"
                    onclick="MandarinkuExtras.setMemoryDifficulty('easy')">
              🟢 Easy (Grid 4 × 4 • 16 Kartu)
            </button>
            <button type="button" class="cerita-filter-pill ${diff === 'medium' ? 'active' : ''}" 
                    style="${diff === 'medium' ? 'background: #d97706; border-color: #b45309; color: #fff; font-weight: 800;' : ''}"
                    onclick="MandarinkuExtras.setMemoryDifficulty('medium')">
              🟡 Medium (Grid 5 × 5 • 25 Kartu)
            </button>
            <button type="button" class="cerita-filter-pill ${diff === 'hard' ? 'active' : ''}" 
                    style="${diff === 'hard' ? 'background: #dc2626; border-color: #b91c1c; color: #fff; font-weight: 800;' : ''}"
                    onclick="MandarinkuExtras.setMemoryDifficulty('hard')">
              🔴 Hard (Grid 6 × 6 • 36 Kartu)
            </button>
          </div>
        </div>

        <!-- Pilihan Tema Sesi Kosakata -->
        <div style="margin-bottom: 18px;">
          <div style="font-weight: 800; font-size: 0.82rem; color: #475569; margin-bottom: 8px;">
            PILIH TEMA KOSAKATA MANDARIN:
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="cerita-filter-pill ${this.memoryActiveSession === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.selectMemorySession('all')">
              🌟 Semua Sesi (Campuran)
            </button>
            ${this.memorySessions.map(s => `
              <button type="button" class="cerita-filter-pill ${this.memoryActiveSession === s.id ? 'active' : ''}" onclick="MandarinkuExtras.selectMemorySession('${s.id}')">
                ${s.icon} ${s.name.split(':')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Banner Info Sesi Aktif & Statistik Langkah -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 14px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 900; font-size: 0.98rem; color: #78350f; display: flex; align-items: center; gap: 6px;">
              <span>${currentSession.icon}</span> ${currentSession.name}
            </div>
            <div style="font-size: 0.76rem; color: #92400e; margin-top: 2px;">
              ${diffName} • ${this.memoryTargetPairs} Pasangan ${diff === 'medium' ? '+ 1 Kartu Bonus 🧧' : ''}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #b45309;">LANGKAH</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #78350f;">${this.memoryMoves}</div>
            </div>
            <div style="text-align: right; border-left: 1.5px solid #fde68a; padding-left: 12px;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #047857;">COCOK</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #065f46;">${matchedPairsCount} / ${this.memoryTargetPairs || 8}</div>
            </div>
            <button type="button" class="btn-learn-outline" style="border-color: #d97706; color: #b45309; padding: 6px 12px; font-size: 0.76rem; margin: 0; background: #fff;" onclick="MandarinkuExtras.initMemoryMatchGame(); MandarinkuExtras.renderGameTabBody();">
              🔄 Acak Kartu
            </button>
          </div>
        </div>

        <!-- Grid Kartu Memori Dinamis (4x4, 5x5, atau 6x6) -->
        <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}; margin-bottom: 22px;">
          ${this.memoryCards.map((card, idx) => {
            const isFlipped = this.memoryFlipped.includes(idx);
            const isMatched = this.memoryMatched.includes(card.pairId);
            const showFace = (isFlipped || isMatched);
            const isBonus = !!card.isBonus;

            // Warna kartu
            let borderColor = isMatched ? '#10b981' : (showFace ? '#f59e0b' : '#cbd5e1');
            let bgColor = isMatched ? '#ecfdf5' : (showFace ? '#ffffff' : 'linear-gradient(135deg, #fffbeb, #fef3c7)');
            let textColor = isMatched ? '#059669' : '#0f172a';

            if (isBonus) {
              borderColor = isMatched ? '#e11d48' : (showFace ? '#f43f5e' : '#fda4af');
              bgColor = isMatched ? '#fff1f2' : (showFace ? '#ffffff' : 'linear-gradient(135deg, #ffe4e6, #fecdd3)');
              textColor = '#be123c';
            }

            return `
              <div onclick="MandarinkuExtras.flipMemoryCard(${idx})" class="memory-card-tile ${isMatched ? 'matched' : (showFace ? 'flipped' : '')}" style="aspect-ratio: 1 / 1; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: ${isMatched ? 'default' : 'pointer'}; user-select: none; transition: transform 0.25s, box-shadow 0.2s; border: 2px solid ${borderColor}; background: ${bgColor}; text-align: center; padding: ${cardPadding}; box-shadow: ${showFace ? '0 4px 12px rgba(245,158,11,0.15)' : '0 2px 6px rgba(0,0,0,0.04)'}; position: relative;">
                ${showFace ? `
                  <div style="width: 100%; overflow-wrap: break-word; word-break: break-word;">
                    ${isBonus ? `
                      <div style="font-size: 0.65rem; font-weight: 800; color: #e11d48; margin-bottom: 2px;">🧧 BONUS</div>
                      <div class="memory-card-content" style="font-family: var(--font-chinese, serif); font-size: ${hanziSize}; font-weight: 900; color: #be123c; line-height: 1.15;">
                        ${card.content}
                      </div>
                      <div style="font-size: ${pinyinSize}; color: #9f1239; font-weight: 700; margin-top: 2px;">
                        ${card.text}
                      </div>
                    ` : `
                      <div class="memory-card-content" data-type="${card.type}" style="font-family: var(--font-chinese, serif); font-size: ${card.type === 'hanzi' ? hanziSize : pinyinSize}; font-weight: 900; color: ${textColor}; line-height: 1.25;">
                        ${card.content}
                      </div>
                    `}
                  </div>
                ` : `
                  ${isBonus ? `
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <span style="font-size: ${lanternSize};">🧧</span>
                      <span style="font-size: 0.6rem; font-weight: 800; color: #be123c; margin-top: 2px;">BONUS</span>
                    </div>
                  ` : `
                    <span style="font-size: ${lanternSize};">🏮</span>
                  `}
                `}
              </div>
            `;
          }).join('')}
        </div>

        ${isFinished ? `
          <div style="text-align: center; background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 16px; padding: 22px; box-shadow: 0 4px 14px rgba(16,185,129,0.1);">
            <div style="font-size: 1.25rem; font-weight: 900; color: #065f46; margin-bottom: 4px;">
              🎉 Luar Biasa! Papan ${diffName} Berhasil Dicocokkan (+${expReward} EXP)
            </div>
            <div style="font-size: 0.85rem; color: #047857; margin-bottom: 16px;">
              Anda menaklukkannya dalam <strong>${this.memoryMoves} langkah</strong> dengan daya ingat luar biasa!
            </div>
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-learn-outline" style="border-color: #059669; color: #059669; padding: 9px 20px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.initMemoryMatchGame(); MandarinkuExtras.renderGameTabBody();">
                🔄 Mainkan Lagi
              </button>
              ${diff === 'easy' ? `
                <button type="button" class="btn-primary-sakura" style="background: linear-gradient(135deg, #d97706, #b45309); padding: 9px 24px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.setMemoryDifficulty('medium');">
                  Tantang Level Medium (5 × 5) ➔
                </button>
              ` : (diff === 'medium' ? `
                <button type="button" class="btn-primary-sakura" style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 9px 24px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.setMemoryDifficulty('hard');">
                  Tantang Level Hard (6 × 6) ➔
                </button>
              ` : `
                <button type="button" class="btn-primary-sakura" style="background: linear-gradient(135deg, #059669, #047857); padding: 9px 24px; font-size: 0.88rem; margin: 0;" onclick="MandarinkuExtras.nextMemorySession();">
                  Lanjut ke Sesi Lain ➔
                </button>
              `)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  flipMemoryCard(index) {
    if (this.memoryFlipped.length >= 2) return;
    if (this.memoryFlipped.includes(index)) return;
    const card = this.memoryCards[index];
    if (this.memoryMatched.includes(card.pairId)) return;

    // Jika mengklik kartu bonus di tengah pada level 5x5
    if (card.isBonus) {
      if (!this.memoryMatched.includes('bonus_center')) {
        this.memoryMatched.push('bonus_center');
        if (typeof speakMandarin === 'function') speakMandarin(card.audio || '福', 0.85);
        if (typeof showToast === 'function') {
          showToast('🧧 Kartu Keberuntungan Terbuka! Bonus +10 EXP', 'success');
        }
        this.renderGameTabBody();
      }
      return;
    }

    this.memoryFlipped.push(index);
    this.renderGameTabBody();

    if (this.memoryFlipped.length === 2) {
      this.memoryMoves++;
      const [idx1, idx2] = this.memoryFlipped;
      const c1 = this.memoryCards[idx1];
      const c2 = this.memoryCards[idx2];

      if (c1.pairId === c2.pairId) {
        // Match!
        this.memoryMatched.push(c1.pairId);
        this.memoryFlipped = [];
        if (typeof speakMandarin === 'function') {
          const hanziContent = c1.type === 'hanzi' ? c1.content : c2.content;
          speakMandarin(hanziContent, 0.85);
        }
        const expGained = this.memoryDifficulty === 'hard' ? 25 : (this.memoryDifficulty === 'medium' ? 20 : 15);
        if (typeof recordUserActivity === 'function') recordUserActivity('reading', expGained, 3, 'memory_match', 1);

        // Jika semua pasangan utama sudah cocok dan ini level 5x5 tapi bonus belum dibuka, auto-buka kartu bonus
        const matchedPairs = this.memoryMatched.filter(id => id !== 'bonus_center').length;
        if (this.memoryDifficulty === 'medium' && matchedPairs >= this.memoryTargetPairs && !this.memoryMatched.includes('bonus_center')) {
          this.memoryMatched.push('bonus_center');
        }

        setTimeout(() => this.renderGameTabBody(), 300);
      } else {
        // Not match
        setTimeout(() => {
          this.memoryFlipped = [];
          this.renderGameTabBody();
        }, 900);
      }
    }
  },

  // --- SUB-GAME 4: COCOK PINYIN KE HANZI (PINYIN TO HANZI MATCHER - HSK 1-6 ACAK) ---
  pinyinHanziDifficulty: 'all', // 'all', 'easy', 'medium', 'hard'
  pinyinHanziLevel: 'all', // 'all', 1, 2, 3, 4, 5, 6
  pinyinHanziSelectedPinyin: null, // item id
  pinyinHanziMatchedIds: [],
  pinyinHanziScore: 0,
  pinyinHanziStreak: 0,
  pinyinHanziShuffledPinyin: [],
  pinyinHanziShuffledHanzi: [],
  pinyinHanziRoundActive: false,
  pinyinHanziMismatchId: null,

  // Bank Soal Pinyin ke Hanzi Lengkap HSK 1 - 6 (90 Soal)
  pinyinHanziBank: [
    // HSK 1 (15 Soal)
    { id: 1, level: 1, pinyin: 'nǐ hǎo', hanzi: '你好', meaning: 'Halo / Apa kabar', audio: '你好' },
    { id: 2, level: 1, pinyin: 'xièxie', hanzi: '谢谢', meaning: 'Terima kasih', audio: '谢谢' },
    { id: 3, level: 1, pinyin: 'zàijiàn', hanzi: '再见', meaning: 'Sampai jumpa', audio: '再见' },
    { id: 4, level: 1, pinyin: 'shì', hanzi: '是', meaning: 'Adalah / Benar', audio: '是' },
    { id: 5, level: 1, pinyin: 'bù', hanzi: '不', meaning: 'Tidak / Bukan', audio: '不' },
    { id: 6, level: 1, pinyin: 'wǒ', hanzi: '我', meaning: 'Saya / Aku', audio: '我' },
    { id: 7, level: 1, pinyin: 'nǐ', hanzi: '你', meaning: 'Kamu / Anda', audio: '你' },
    { id: 8, level: 1, pinyin: 'tā', hanzi: '他', meaning: 'Dia (Laki-laki)', audio: '他' },
    { id: 9, level: 1, pinyin: 'chī', hanzi: '吃', meaning: 'Makan', audio: '吃' },
    { id: 10, level: 1, pinyin: 'hē', hanzi: '喝', meaning: 'Minum', audio: '喝' },
    { id: 11, level: 1, pinyin: 'shuǐ', hanzi: '水', meaning: 'Air', audio: '水' },
    { id: 12, level: 1, pinyin: 'chá', hanzi: '茶', meaning: 'Teh', audio: '茶' },
    { id: 13, level: 1, pinyin: 'mǐfàn', hanzi: '米饭', meaning: 'Nasi Putih', audio: '米饭' },
    { id: 14, level: 1, pinyin: 'píngguǒ', hanzi: '苹果', meaning: 'Apel', audio: '苹果' },
    { id: 15, level: 1, pinyin: 'xuéxiào', hanzi: '学校', meaning: 'Sekolah', audio: '学校' },

    // HSK 2 (15 Soal)
    { id: 16, level: 2, pinyin: 'zhǔnbèi', hanzi: '准备', meaning: 'Bersiap-siap / Menyiapkan', audio: '准备' },
    { id: 17, level: 2, pinyin: 'kāishǐ', hanzi: '开始', meaning: 'Mulai', audio: '开始' },
    { id: 18, level: 2, pinyin: 'bāngzhù', hanzi: '帮助', meaning: 'Membantu / Pertolongan', audio: '帮助' },
    { id: 19, level: 2, pinyin: 'jièshào', hanzi: '介绍', meaning: 'Memperkenalkan', audio: '介绍' },
    { id: 20, level: 2, pinyin: 'yánsè', hanzi: '颜色', meaning: 'Warna', audio: '颜色' },
    { id: 21, level: 2, pinyin: 'piàoliang', hanzi: '漂亮', meaning: 'Cantik / Indah', audio: '漂亮' },
    { id: 22, level: 2, pinyin: 'shíjiān', hanzi: '时间', meaning: 'Waktu / Jam', audio: '时间' },
    { id: 23, level: 2, pinyin: 'shēntǐ', hanzi: '身体', meaning: 'Tubuh / Kesehatan', audio: '身体' },
    { id: 24, level: 2, pinyin: 'chūzūchē', hanzi: '出租车', meaning: 'Mobil Taksi', audio: '出租车' },
    { id: 25, level: 2, pinyin: 'fēijī', hanzi: '飞机', meaning: 'Pesawat Terbang', audio: '飞机' },
    { id: 26, level: 2, pinyin: 'gōngzuò', hanzi: '工作', meaning: 'Bekerja / Pekerjaan', audio: '工作' },
    { id: 27, level: 2, pinyin: 'kùzi', hanzi: '裤子', meaning: 'Celana', audio: '裤子' },
    { id: 28, level: 2, pinyin: 'yǎnjing', hanzi: '眼睛', meaning: 'Mata', audio: '眼睛' },
    { id: 29, level: 2, pinyin: 'xīngqī', hanzi: '星期', meaning: 'Minggu / Hari Pekan', audio: '星期' },
    { id: 30, level: 2, pinyin: 'kuàilè', hanzi: '快乐', meaning: 'Bahagia / Senang', audio: '快乐' },

    // HSK 3 (15 Soal)
    { id: 31, level: 3, pinyin: 'fāngbiàn', hanzi: '方便', meaning: 'Praktis / Mudah', audio: '方便' },
    { id: 32, level: 3, pinyin: 'jiějué', hanzi: '解决', meaning: 'Menyelesaikan Masalah', audio: '解决' },
    { id: 33, level: 3, pinyin: 'kǎolǜ', hanzi: '考虑', meaning: 'Mempertimbangkan', audio: '考虑' },
    { id: 34, level: 3, pinyin: 'liǎojiě', hanzi: '了解', meaning: 'Memahami Mendalam', audio: '了解' },
    { id: 35, level: 3, pinyin: 'nǔlì', hanzi: '努力', meaning: 'Bekerja Keras / Tekun', audio: '努力' },
    { id: 36, level: 3, pinyin: 'rèqíng', hanzi: '热情', meaning: 'Hangat & Ramah', audio: '热情' },
    { id: 37, level: 3, pinyin: 'fāxiàn', hanzi: '发现', meaning: 'Menemukan / Menyadari', audio: '发现' },
    { id: 38, level: 3, pinyin: 'huánjìng', hanzi: '环境', meaning: 'Lingkungan Sekitar', audio: '环境' },
    { id: 39, level: 3, pinyin: 'jīhuì', hanzi: '机会', meaning: 'Kesempatan / Peluang', audio: '机会' },
    { id: 40, level: 3, pinyin: 'jīngcháng', hanzi: '经常', meaning: 'Seringkali / Kerap', audio: '经常' },
    { id: 41, level: 3, pinyin: 'mǎnyì', hanzi: '满意', meaning: 'Puas / Berpuas Hati', audio: '满意' },
    { id: 42, level: 3, pinyin: 'qíguài', hanzi: '奇怪', meaning: 'Aneh / Ganjil', audio: '奇怪' },
    { id: 43, level: 3, pinyin: 'tóngshí', hanzi: '同时', meaning: 'Pada Saat yang Sama', audio: '同时' },
    { id: 44, level: 3, pinyin: 'wánquán', hanzi: '完全', meaning: 'Sama Sekali / Sepenuhnya', audio: '完全' },
    { id: 45, level: 3, pinyin: 'zhùyì', hanzi: '注意', meaning: 'Memperhatikan / Waspada', audio: '注意' },

    // HSK 4 (15 Soal)
    { id: 46, level: 4, pinyin: 'ānquán', hanzi: '安全', meaning: 'Aman / Keamanan', audio: '安全' },
    { id: 47, level: 4, pinyin: 'bǎozhèng', hanzi: '保证', meaning: 'Menjamin / Garansi', audio: '保证' },
    { id: 48, level: 4, pinyin: 'chénggōng', hanzi: '成功', meaning: 'Berhasil / Sukses', audio: '成功' },
    { id: 49, level: 4, pinyin: 'fēngfù', hanzi: '丰富', meaning: 'Melimpah / Kaya Variasi', audio: '丰富' },
    { id: 50, level: 4, pinyin: 'fùzé', hanzi: '负责', meaning: 'Bertanggung Jawab', audio: '负责' },
    { id: 51, level: 4, pinyin: 'gǎndòng', hanzi: '感动', meaning: 'Terharu / Tersentuh Hati', audio: '感动' },
    { id: 52, level: 4, pinyin: 'hùxiāng', hanzi: '互相', meaning: 'Saling / Satu Sama Lain', audio: '互相' },
    { id: 53, level: 4, pinyin: 'jījí', hanzi: '积极', meaning: 'Positif & Bersemangat', audio: '积极' },
    { id: 54, level: 4, pinyin: 'jīngyàn', hanzi: '经验', meaning: 'Pengalaman Hidup/Kerja', audio: '经验' },
    { id: 55, level: 4, pinyin: 'lǐmào', hanzi: '礼貌', meaning: 'Sopan Santun / Etika', audio: '礼貌' },
    { id: 56, level: 4, pinyin: 'pínghéng', hanzi: '平衡', meaning: 'Keseimbangan', audio: '平衡' },
    { id: 57, level: 4, pinyin: 'shēnqǐng', hanzi: '申请', meaning: 'Mengajukan Permohonan', audio: '申请' },
    { id: 58, level: 4, pinyin: 'tàidu', hanzi: '态度', meaning: 'Sikap / Pendirian', audio: '态度' },
    { id: 59, level: 4, pinyin: 'wēixiǎn', hanzi: '危险', meaning: 'Berbahaya', audio: '危险' },
    { id: 60, level: 4, pinyin: 'xìnxīn', hanzi: '信心', meaning: 'Keyakinan Diri', audio: '信心' },

    // HSK 5 (15 Soal)
    { id: 61, level: 5, pinyin: 'bǎochí', hanzi: '保持', meaning: 'Mempertahankan / Menjaga', audio: '保持' },
    { id: 62, level: 5, pinyin: 'cǎiqǔ', hanzi: '采取', meaning: 'Mengambil Tindakan/Langkah', audio: '采取' },
    { id: 63, level: 5, pinyin: 'chōngfèn', hanzi: '充分', meaning: 'Memadai / Sepenuhnya', audio: '充分' },
    { id: 64, level: 5, pinyin: 'dànrèn', hanzi: '担任', meaning: 'Menjabat / Mengemban Tugas', audio: '担任' },
    { id: 65, level: 5, pinyin: 'fányróng', hanzi: '繁荣', meaning: 'Makmur / Sejahtera', audio: '繁荣' },
    { id: 66, level: 5, pinyin: 'gòngxiàn', hanzi: '贡献', meaning: 'Kontribusi / Pengabdian', audio: '贡献' },
    { id: 67, level: 5, pinyin: 'héxīn', hanzi: '核心', meaning: 'Inti Pokok / Pusat', audio: '核心' },
    { id: 68, level: 5, pinyin: 'jiéjù', hanzi: '结局', meaning: 'Akhir Cerita / Kesudahan', audio: '结局' },
    { id: 69, level: 5, pinyin: 'kuòdà', hanzi: '扩大', meaning: 'Memperluas / Menambah Skala', audio: '扩大' },
    { id: 70, level: 5, pinyin: 'mǐnruì', hanzi: '敏锐', meaning: 'Tajam / Peka Tanggap', audio: '敏锐' },
    { id: 71, level: 5, pinyin: 'píngjià', hanzi: '评价', meaning: 'Mengevaluasi / Menilai', audio: '评价' },
    { id: 72, level: 5, pinyin: 'quánmiàn', hanzi: '全面', meaning: 'Menyeluruh / Komprehensif', audio: '全面' },
    { id: 73, level: 5, pinyin: 'shèbèi', hanzi: '设备', meaning: 'Peralatan / Perlengkapan', audio: '设备' },
    { id: 74, level: 5, pinyin: 'tōngcháng', hanzi: '通常', meaning: 'Biasanya / Lazimnya', audio: '通常' },
    { id: 75, level: 5, pinyin: 'zhìxù', hanzi: '秩序', meaning: 'Ketertiban / Keteraturan', audio: '秩序' },

    // HSK 6 (15 Soal)
    { id: 76, level: 6, pinyin: 'chāngshèng', hanzi: '昌盛', meaning: 'Maju Pesat & Makmur', audio: '昌盛' },
    { id: 77, level: 6, pinyin: 'dǐyù', hanzi: '抵御', meaning: 'Menolak / Membentengi Diri', audio: '抵御' },
    { id: 78, level: 6, pinyin: 'fánzhí', hanzi: '繁殖', meaning: 'Berkembang Biak', audio: '繁殖' },
    { id: 79, level: 6, pinyin: 'gānglǐng', hanzi: '纲领', meaning: 'Garis Panduan / Asas Program', audio: '纲领' },
    { id: 80, level: 6, pinyin: 'hàohàn', hanzi: '浩瀚', meaning: 'Luas Tak Bertepi / Mahaluas', audio: '浩瀚' },
    { id: 81, level: 6, pinyin: 'jiāndìng', hanzi: '坚定', meaning: 'Kukuh / Teguh Pendirian', audio: '坚定' },
    { id: 82, level: 6, pinyin: 'kāngkǎi', hanzi: '慷慨', meaning: 'Dermawan / Murah Hati', audio: '慷慨' },
    { id: 83, level: 6, pinyin: 'límíng', hanzi: '黎明', meaning: 'Fajar Menyingsing', audio: '黎明' },
    { id: 84, level: 6, pinyin: 'mófàn', hanzi: '模范', meaning: 'Teladan / Panutan Luhur', audio: '模范' },
    { id: 85, level: 6, pinyin: 'nìjìng', hanzi: '逆境', meaning: 'Masa Sukar / Kesulitan Hidup', audio: '逆境' },
    { id: 86, level: 6, pinyin: 'pánxuán', hanzi: '盘旋', meaning: 'Berputar Melayang-layang', audio: '盘旋' },
    { id: 87, level: 6, pinyin: 'qiānxùn', hanzi: '谦逊', meaning: 'Rendah Hati / Santun', audio: '谦逊' },
    { id: 88, level: 6, pinyin: 'shūyuǎn', hanzi: '疏远', meaning: 'Merenggang Hubungan', audio: '疏远' },
    { id: 89, level: 6, pinyin: 'túnbīng', hanzi: '屯兵', meaning: 'Menghimpun Pasukan Militer', audio: '屯兵' },
    { id: 90, level: 6, pinyin: 'zhuóyuè', hanzi: '卓越', meaning: 'Luar Biasa / Unggul Cemerlang', audio: '卓越' }
  ],

  setPinyinHanziDifficulty(diff) {
    this.pinyinHanziDifficulty = diff;
    this.pinyinHanziLevel = 'all';
    this.initPinyinHanziRound();
    this.renderGameTabBody();
  },

  setPinyinHanziLevel(lvl) {
    this.pinyinHanziLevel = lvl;
    this.initPinyinHanziRound();
    this.renderGameTabBody();
  },

  initPinyinHanziRound() {
    this.syncAdminGameData();
    const bank = (this.pinyinHanziBank && this.pinyinHanziBank.length > 0) ? this.pinyinHanziBank : [];
    let pool = bank;
    if (this.pinyinHanziDifficulty && this.pinyinHanziDifficulty !== 'all') {
      pool = pool.filter(q => {
        const diff = q.difficulty || (q.level <= 2 ? 'easy' : (q.level <= 4 ? 'medium' : 'hard'));
        return diff === this.pinyinHanziDifficulty;
      });
    }
    if (this.pinyinHanziLevel !== 'all') {
      const lvl = parseInt(this.pinyinHanziLevel) || 1;
      pool = pool.filter(q => q.level === lvl);
    }
    if (pool.length === 0) pool = bank;

    // Ambil 5 kosakata acak dari pool
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);

    // Acak urutan pinyin (kolom kiri) dan acak urutan hanzi (kolom kanan) secara independen
    this.pinyinHanziShuffledPinyin = [...selected].sort(() => Math.random() - 0.5);
    this.pinyinHanziShuffledHanzi = [...selected].sort(() => Math.random() - 0.5);

    this.pinyinHanziSelectedPinyin = null;
    this.pinyinHanziMatchedIds = [];
    this.pinyinHanziMismatchId = null;
    this.pinyinHanziRoundActive = true;
  },

  selectPinyinForMatch(id) {
    if (this.pinyinHanziMatchedIds.includes(id)) return;
    this.pinyinHanziSelectedPinyin = id;
    this.pinyinHanziMismatchId = null;

    const item = (this.pinyinHanziBank || []).find(x => x.id === id);
    if (item && typeof speakMandarin === 'function') {
      speakMandarin(item.audio || item.hanzi, 0.85);
    }
    this.renderGameTabBody();
  },

  selectHanziForMatch(id) {
    if (this.pinyinHanziMatchedIds.includes(id)) return;
    if (!this.pinyinHanziSelectedPinyin) {
      if (typeof showToast === 'function') {
        showToast('Pilih kartu Pinyin di sisi kiri terlebih dahulu!', 'info');
      }
      return;
    }

    if (this.pinyinHanziSelectedPinyin === id) {
      // Benar! Cocokkan
      this.pinyinHanziMatchedIds.push(id);
      this.pinyinHanziScore += 10;
      this.pinyinHanziStreak++;
      this.pinyinHanziSelectedPinyin = null;
      this.pinyinHanziMismatchId = null;

      const item = (this.pinyinHanziBank || []).find(x => x.id === id);
      if (item && typeof speakMandarin === 'function') {
        speakMandarin(item.audio || item.hanzi, 0.85);
      }
      if (typeof recordUserActivity === 'function') recordUserActivity('reading', 15, 3, 'pinyin_match', 1);
      this.renderGameTabBody();
    } else {
      // Salah! Beri feedback visual
      this.pinyinHanziStreak = 0;
      this.pinyinHanziMismatchId = id;
      this.renderGameTabBody();
      setTimeout(() => {
        this.pinyinHanziMismatchId = null;
        this.pinyinHanziSelectedPinyin = null;
        this.renderGameTabBody();
      }, 700);
    }
  },

  nextPinyinHanziRound() {
    this.initPinyinHanziRound();
    this.renderGameTabBody();
  },

  renderPinyinHanziSection(container) {
    if (!this.pinyinHanziRoundActive || this.pinyinHanziShuffledPinyin.length === 0) {
      this.initPinyinHanziRound();
    }
    const isFinished = (this.pinyinHanziMatchedIds.length >= this.pinyinHanziShuffledPinyin.length);

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 800px; margin: 0 auto;">
        
        <!-- Toolbar Filter Tingkat Kesulitan Easy / Medium / Hard -->
        <div style="margin-bottom: 14px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 0.82rem; color: #475569;">PILIH TINGKAT KESULITAN:</span>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="background: #fef3c7; color: #b45309; padding: 4px 12px; border-radius: 99px; font-weight: 800; font-size: 0.82rem; border: 1px solid #fde68a;">
                ⭐ Skor: ${this.pinyinHanziScore}
              </span>
              <span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 99px; font-weight: 800; font-size: 0.82rem; border: 1px solid #bfdbfe;">
                🔥 Streak: ${this.pinyinHanziStreak}x
              </span>
              <button type="button" class="btn-learn-outline" style="border-color: #8b5cf6; color: #7c3aed; padding: 5px 12px; font-size: 0.78rem; margin: 0; background: #fff;" onclick="MandarinkuExtras.nextPinyinHanziRound();">
                🎲 Acak Ronde
              </button>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="cerita-filter-pill ${this.pinyinHanziDifficulty === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setPinyinHanziDifficulty('all')" style="padding: 5px 12px; font-size: 0.78rem;">
              🌟 Semua Level (${this.pinyinHanziBank.length} Soal)
            </button>
            <button type="button" class="cerita-filter-pill ${this.pinyinHanziDifficulty === 'easy' ? 'active' : ''}" 
                    style="${this.pinyinHanziDifficulty === 'easy' ? 'background: #059669; border-color: #047857; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setPinyinHanziDifficulty('easy')">
              🟢 Easy (HSK 1–2 • 40 Soal)
            </button>
            <button type="button" class="cerita-filter-pill ${this.pinyinHanziDifficulty === 'medium' ? 'active' : ''}" 
                    style="${this.pinyinHanziDifficulty === 'medium' ? 'background: #d97706; border-color: #b45309; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setPinyinHanziDifficulty('medium')">
              🟡 Medium (HSK 3–4 • 40 Soal)
            </button>
            <button type="button" class="cerita-filter-pill ${this.pinyinHanziDifficulty === 'hard' ? 'active' : ''}" 
                    style="${this.pinyinHanziDifficulty === 'hard' ? 'background: #dc2626; border-color: #b91c1c; color: #fff; font-weight: 800;' : ''} padding: 5px 12px; font-size: 0.78rem;"
                    onclick="MandarinkuExtras.setPinyinHanziDifficulty('hard')">
              🔴 Hard (HSK 5–6 • 40 Soal)
            </button>
          </div>
        </div>

        <!-- Filter Sub-Level HSK Spesifik -->
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
          <span style="font-weight: 800; font-size: 0.76rem; color: #64748b;">Filter HSK:</span>
          <button type="button" class="cerita-filter-pill ${this.pinyinHanziLevel === 'all' ? 'active' : ''}" onclick="MandarinkuExtras.setPinyinHanziLevel('all')" style="padding: 3px 8px; font-size: 0.74rem;">
            Semua HSK
          </button>
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button type="button" class="cerita-filter-pill ${this.pinyinHanziLevel === lvl ? 'active' : ''}" onclick="MandarinkuExtras.setPinyinHanziLevel(${lvl})" style="padding: 3px 8px; font-size: 0.74rem;">
              HSK ${lvl} (20)
            </button>
          `).join('')}
        </div>

        <!-- Petunjuk Singkat -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 22px; display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.3rem;">💡</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.4;">
            <strong>Cara Bermain:</strong> Klik kartu <strong>Pinyin</strong> di kolom kiri untuk mendengarkan lafal pengucapannya, lalu klik aksara <strong>Hanzi</strong> yang cocok di kolom kanan. Soal diacak secara otomatis setiap ronde!
          </div>
        </div>

        <!-- Kolom Pencocokan Pinyin (Kiri) ke Hanzi (Kanan) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          
          <!-- SISI KIRI: PINYIN (ACAK) -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 2px;">
              🗣️ Pinyin & Arti Kosakata:
            </div>
            ${this.pinyinHanziShuffledPinyin.map(item => {
              const isMatched = this.pinyinHanziMatchedIds.includes(item.id);
              const isSelected = this.pinyinHanziSelectedPinyin === item.id;

              return `
                <div onclick="MandarinkuExtras.selectPinyinForMatch(${item.id})" class="match-card-pinyin ${isMatched ? 'matched' : (isSelected ? 'selected' : '')}">
                  <div>
                    <div class="match-pinyin-title">
                      ${item.pinyin}
                    </div>
                    <div class="match-pinyin-sub">
                      ${item.meaning}
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="match-level-badge">HSK ${item.level}</span>
                    <button type="button" class="btn-match-audio" onclick="event.stopPropagation(); if(typeof speakMandarin==='function') speakMandarin('${item.audio || item.hanzi}', 0.85);">🔊</button>
                    ${isMatched ? '<span class="match-check-icon">✓</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- SISI KANAN: HANZI (ACAK) -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #dc2626; text-transform: uppercase; margin-bottom: 2px;">
              ✍️ Aksara Hanzi (Pasangan):
            </div>
            ${this.pinyinHanziShuffledHanzi.map(item => {
              const isMatched = this.pinyinHanziMatchedIds.includes(item.id);
              const isMismatch = this.pinyinHanziMismatchId === item.id;

              return `
                <div onclick="MandarinkuExtras.selectHanziForMatch(${item.id})" class="match-card-hanzi ${isMatched ? 'matched' : (isMismatch ? 'mismatched' : '')}">
                  <span class="match-hanzi-char">
                    ${item.hanzi}
                  </span>
                  <div>
                    ${isMatched ? '<span class="match-badge-success">Cocok ✓</span>' : (isMismatch ? '<span class="match-badge-error">Belum tepat ✗</span>' : '<span class="match-badge-hint">Klik pasangan</span>')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>

        <!-- Banner Kemenangan & Tombol Ronde Berikutnya -->
        ${isFinished ? `
          <div style="text-align: center; background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 16px; padding: 22px; box-shadow: 0 4px 14px rgba(16,185,129,0.1); margin-top: 10px;">
            <div style="font-size: 1.25rem; font-weight: 900; color: #065f46; margin-bottom: 4px;">
              🎉 Luar Biasa! Semua 5 Kosakata Acak Berhasil Terhubung (+30 EXP)
            </div>
            <div style="font-size: 0.85rem; color: #047857; margin-bottom: 16px;">
              Kecepatan dan ketepatan Anda mengenali aksara Hanzi dari Pinyin semakin terasah!
            </div>
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-primary-sakura" style="background: linear-gradient(135deg, #059669, #047857); padding: 10px 26px; font-size: 0.9rem; margin: 0;" onclick="MandarinkuExtras.nextPinyinHanziRound();">
                🎲 Ronde Acak Berikutnya ➔
              </button>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  // =========================================================================
  // 6. FITUR PINTAR & ALAT BANTU (COLORIZER, ANATOMI, EKSPOR ANKI, LEADERBOARD)
  // =========================================================================
  activeFiturPintarTab: 'colorizer', // 'colorizer', 'anatomy', 'anki', 'leaderboard'

  colorizerInputText: '你好！欢迎来到中国学习汉语。祝你每天进步！',
  colorizerOutputHtml: null,

  syncAdminFiturData() {
    if (window.DB_HANZI_ANATOMY && Array.isArray(window.DB_HANZI_ANATOMY) && window.DB_HANZI_ANATOMY.length > 0) {
      this.anatomyBank = window.DB_HANZI_ANATOMY;
    }
  },

  renderFiturPintarPage() {
    this.syncAdminFiturData();
    const container = document.getElementById('fitur-pintar-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Header Banner Fitur Pintar -->
      <div class="quiz-hero-banner" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #bae6fd;">
        <div>
          <span class="role-badge" style="background: #0284c7; color: #ffffff; font-weight: 800; font-size: 0.75rem;">
            💡 FITUR PINTAR & ALAT BANTU MANDARIN
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #0369a1; margin-top: 6px;">
            Alat Cerdas Belajar Bahasa Mandarin
          </h2>
          <p style="font-size: 0.88rem; color: #0284c7; margin-top: 4px; max-width: 760px;">
            Pewarna Nada otomatis untuk teks bebas, Pembongkar Anatomi Karakter Hanzi, Ekspor Kosakata ke Anki (.csv), dan Papan Peringkat Mingguan.
          </p>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button type="button" class="cerita-filter-pill ${this.activeFiturPintarTab === 'colorizer' ? 'active' : ''}" onclick="MandarinkuExtras.switchFiturPintarTab('colorizer')">
            🎨 Pewarna 4 Nada Teks
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeFiturPintarTab === 'anatomy' ? 'active' : ''}" onclick="MandarinkuExtras.switchFiturPintarTab('anatomy')">
            🧩 Anatomi Karakter
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeFiturPintarTab === 'anki' ? 'active' : ''}" onclick="MandarinkuExtras.switchFiturPintarTab('anki')">
            📦 Ekspor ke Anki (CSV)
          </button>
          <button type="button" class="cerita-filter-pill ${this.activeFiturPintarTab === 'leaderboard' ? 'active' : ''}" onclick="MandarinkuExtras.switchFiturPintarTab('leaderboard')">
            🏆 Papan Peringkat
          </button>
          <a href="admin/fitur_cerdas.php" target="_blank" style="background: #0284c7; color: #ffffff; text-decoration: none; padding: 7px 14px; border-radius: 99px; font-weight: 800; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);">
            ⚙️ Panel Admin Fitur Cerdas (Edit/Tambah) ↗
          </a>
        </div>
      </div>

      <div id="fitur-pintar-body"></div>
    `;

    this.renderFiturPintarBody();
  },

  switchFiturPintarTab(tab) {
    this.activeFiturPintarTab = tab;
    this.renderFiturPintarPage();
  },

  renderFiturPintarBody() {
    const body = document.getElementById('fitur-pintar-body');
    if (!body) return;

    if (this.activeFiturPintarTab === 'colorizer') {
      this.renderToneColorizerSection(body);
    } else if (this.activeFiturPintarTab === 'anatomy') {
      this.renderHanziAnatomySection(body);
    } else if (this.activeFiturPintarTab === 'anki') {
      this.renderAnkiExportSection(body);
    } else if (this.activeFiturPintarTab === 'leaderboard') {
      this.renderLeaderboardSection(body);
    }
  },

  // --- ALAT 1: PINYIN & TONE COLORIZER (PEWARNA 4 NADA TEKS BEBAS) ---
  processToneColorizer() {
    const text = this.colorizerInputText || '';
    const allDict = this.getAllDictionaryEntries();

    // Map sederhana karakter ke pinyin & nada
    let html = '';
    for (const ch of text) {
      if (/[\u4e00-\u9fff]/.test(ch)) {
        const found = allDict.find(d => d.hanzi === ch) || allDict.find(d => d.hanzi && d.hanzi.includes(ch));
        let pinyin = found ? found.pinyin.split(' ')[0] : '';
        let toneClass = 'tone-0';
        let toneColor = '#64748b'; // netral

        // Deteksi nada
        if (/[āēīōūǖ]/.test(pinyin)) { toneClass = 'tone-1'; toneColor = '#ef4444'; }
        else if (/[áéíóúǘ]/.test(pinyin)) { toneClass = 'tone-2'; toneColor = '#f59e0b'; }
        else if (/[ǎěǐǒǔǚ]/.test(pinyin)) { toneClass = 'tone-3'; toneColor = '#10b981'; }
        else if (/[àèìòùǜ]/.test(pinyin)) { toneClass = 'tone-4'; toneColor = '#3b82f6'; }

        html += `
          <ruby class="colorizer-ruby colorizer-${toneClass}">
            ${ch}
            <rt>${pinyin || '·'}</rt>
          </ruby>
        `;
      } else {
        html += `<span class="colorizer-non-cjk">${ch === '\n' ? '<br>' : ch}</span>`;
      }
    }

    this.colorizerOutputHtml = html;
  },

  renderToneColorizerSection(container) {
    if (!this.colorizerOutputHtml) {
      this.processToneColorizer();
    }

    container.innerHTML = `
      <div class="modern-feature-card" style="background: #ffffff; border-radius: 24px; border: 1px solid rgba(0,0,0,0.04); padding: 28px; box-shadow: 0 6px 24px rgba(0,0,0,0.03);">
        <div style="max-width: 720px; margin: 0 auto;">
          <h3 style="font-size: 1.25rem; font-weight: 900; color: #0369a1; margin: 0 0 6px 0;">
            🎨 Pewarna 4 Nada Teks Bebas (Pinyin Tone Colorizer)
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px;">
            Tempel atau ketik teks Mandarin apa saja di bawah ini. Sistem akan otomatis mewarnai setiap karakter sesuai 4 nada resminya dan menampilkan bacaan Pinyin di atasnya.
          </p>

          <!-- Input Textarea -->
          <div style="margin-bottom: 14px;">
            <textarea class="writing-textarea" style="height: 90px; font-size: 1.1rem; font-family: var(--font-chinese, serif);" oninput="MandarinkuExtras.colorizerInputText = this.value; MandarinkuExtras.processToneColorizer(); MandarinkuExtras.renderFiturPintarBody();">${this.colorizerInputText}</textarea>
          </div>

          <!-- Petunjuk Warna Nada (Legend Guide) -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; background: rgba(0,0,0,0.02); padding: 10px 14px; border-radius: 12px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: #475569;">Pedoman Nada:</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #ef4444;">● Nada 1 (Mā - Datar)</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #f59e0b;">● Nada 2 (Má - Naik)</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #10b981;">● Nada 3 (Mǎ - Lengkung)</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #3b82f6;">● Nada 4 (Mà - Menukik)</span>
            <span style="font-size: 0.76rem; font-weight: 800; color: #64748b;">● Netral (Ringan)</span>
          </div>

          <!-- Kotak Hasil Pewarnaan Teks -->
          <div class="tone-colorizer-output-box" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 22px; line-height: 2.2; min-height: 120px; margin-bottom: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
            ${this.colorizerOutputHtml}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn-primary-sakura" style="background: #0284c7; padding: 10px 22px; font-size: 0.85rem; margin: 0; border-radius: 9999px;" onclick="if(typeof speakMandarin==='function') speakMandarin('${(this.colorizerInputText || '').replace(/'/g, "\\'")}', 0.85)">
              🔊 Dengarkan Bacaan Teks
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // --- ALAT 3: ANATOMI KARAKTER & CERITA MNEMONIK (HANZI DECONSTRUCTOR) ---
  anatomySubTab: 'type', // 'type', 'upload', 'catalog'
  anatomyTypeQuery: '休',
  anatomyUploadResults: [],
  anatomyUploadFileName: '',
  anatomyUploadStats: { total: 0, unique: 0, matched: 0 },
  anatomyUploadLevelFilter: 'all',
  anatomyUploadPage: 1,
  anatomyUploadPageSize: 10,
  anatomyCatalogQuery: '',
  anatomyCatalogPage: 1,
  anatomyCatalogPageSize: 10,

  // Kamus radikal Mandarin untuk analisis dekonstruksi komponen karakter
  commonRadicals: {
    '亻': 'Orang (人/亻)',
    '人': 'Manusia / Orang',
    '木': 'Pohon / Kayu',
    '日': 'Matahari / Siang',
    '月': 'Bulan / Bagian Tubuh (肉)',
    '女': 'Wanita / Kelembutan',
    '子': 'Anak / Keturunan',
    '手': 'Tangan',
    '扌': 'Tangan (Bentuk Samping)',
    '目': 'Mata / Penglihatan',
    '田': 'Sawah / Ladang',
    '力': 'Tenaga / Kekuatan',
    '心': 'Hati / Perasaan',
    '忄': 'Hati (Bentuk Samping)',
    '水': 'Air',
    '氵': 'Tiga Tetes Air',
    '火': 'Api / Semangat',
    '灬': 'Empat Titik Api Panas',
    '土': 'Tanah / Bumi',
    '金': 'Logam / Emas',
    '钅': 'Logam (Bentuk Samping)',
    '口': 'Mulut / Ucapan',
    '言': 'Tutur Kata / Bahasa',
    '讠': 'Tutur Kata (Bentuk Samping)',
    '艹': 'Rumput / Tumbuhan',
    '门': 'Pintu / Gerbang',
    '宀': 'Atap Rumah',
    '辶': 'Gerak Melangkah / Berjalan',
    '纟': 'Benang / Tali Sutra',
    '虫': 'Serangga / Hewan Kecil',
    '⺮': 'Bambu',
    '雨': 'Hujan / Cuaca',
    '饣': 'Makanan / Santapan',
    '走': 'Berjalan / Berlari',
    '足': 'Kaki',
    '车': 'Kereta / Kendaraan',
    '鸟': 'Burung',
    '鱼': 'Ikan',
    '大': 'Besar',
    '小': 'Kecil',
    '山': 'Gunung',
    '石': 'Batu'
  },

  // Basis Pengetahuan Anatomi & Mnemonik Bawaan
  hanziDecompDict: {
    '休': { radA: '亻 (Orang)', radB: '木 (Pohon)', story: 'Seseorang yang sedang bersandar santai di pohon rindang untuk melepas lelah setelah seharian bekerja.', pinyin: 'xiū', meaning: 'Istirahat / Rehat', level: 1, strokes: 6 },
    '明': { radA: '日 (Matahari)', radB: '月 (Bulan)', story: 'Matahari di siang hari dan bulan di malam hari, bersatu memancarkan terang semesta.', pinyin: 'míng', meaning: 'Terang / Jelas', level: 1, strokes: 8 },
    '好': { radA: '女 (Wanita / Ibu)', radB: '子 (Anak)', story: 'Seorang ibu yang menggendong buah hatinya dengan penuh kasih melambangkan kebaikan sempurna.', pinyin: 'hǎo', meaning: 'Baik / Bagus', level: 1, strokes: 6 },
    '看': { radA: '手 (Tangan)', radB: '目 (Mata)', story: 'Meletakkan tangan di atas mata untuk memayungi pandangan dan melihat kejauhan.', pinyin: 'kàn', meaning: 'Melihat / Memandang', level: 1, strokes: 9 },
    '男': { radA: '田 (Sawah)', radB: '力 (Tenaga / Kekuatan)', story: 'Seseorang yang mengerahkan tenaga dan kekuatannya untuk mencangkul di sawah.', pinyin: 'nán', meaning: 'Pria / Laki-laki', level: 1, strokes: 7 },
    '你': { radA: '亻 (Orang)', radB: '尔 (Kamu)', story: 'Sosok orang lain di hadapanmu yang sedang kamu ajak bicara langsung.', pinyin: 'nǐ', meaning: 'Kamu / Anda', level: 1, strokes: 7 },
    '他': { radA: '亻 (Orang)', radB: '也 (Juga)', story: 'Sosok orang lain di luar percakapan (pihak ketiga laki-laki).', pinyin: 'tā', meaning: 'Dia (Laki-laki)', level: 1, strokes: 5 },
    '她': { radA: '女 (Wanita)', radB: '也 (Juga)', story: 'Sosok perempuan lain di luar percakapan (pihak ketiga perempuan).', pinyin: 'tā', meaning: 'Dia (Perempuan)', level: 1, strokes: 6 },
    '们': { radA: '亻 (Orang)', radB: '门 (Pintu)', story: 'Sekumpulan orang berkumpul bersama di ambang pintu menandakan bentuk jamak.', pinyin: 'men', meaning: 'Akhiran Jamak (Kita/Mereka)', level: 1, strokes: 5 },
    '朋': { radA: '月 (Raga / Tubuh)', radB: '月 (Raga / Jiwa)', story: 'Dua orang sahabat sejati yang berdampingan bahu-membahu dalam suka dan duka.', pinyin: 'péng', meaning: 'Teman / Kawan', level: 1, strokes: 8 },
    '友': { radA: '𠂇 (Tangan Kiri)', radB: '又 (Tangan Kanan)', story: 'Dua tangan kawan karib yang saling berjabatan erat melambangkan persahabatan abadi.', pinyin: 'yǒu', meaning: 'Sahabat / Sahabat Karib', level: 1, strokes: 4 },
    '学': { radA: '𦥑 (Dua Tangan Menuntun)', radB: '子 (Anak)', story: 'Menuntun dan membimbing seorang anak di bawah atap sekolah untuk menimba ilmu.', pinyin: 'xué', meaning: 'Belajar / Menuntut Ilmu', level: 1, strokes: 8 },
    '习': { radA: '羽 (Sayap Burung)', radB: '勹 (Gerakan Latihan)', story: 'Anak burung yang berulang kali mengepakkan sayapnya untuk berlatih terbang mandiri.', pinyin: 'xí', meaning: 'Berlatih / Membiasakan', level: 1, strokes: 3 },
    '谢': { radA: '讠 (Tutur Kata)', radB: '射 (Melontarkan)', story: 'Mengucapkan kata-kata tulus dari dalam lubuk hati untuk menyatakan rasa terima kasih.', pinyin: 'xiè', meaning: 'Terima Kasih / Bersyukur', level: 1, strokes: 12 },
    '吃': { radA: '口 (Mulut)', radB: '乞 (Meminta / Memasukkan)', story: 'Menggerakkan mulut untuk menyantap dan menikmati makanan bergizi.', pinyin: 'chī', meaning: 'Makan', level: 1, strokes: 6 },
    '喝': { radA: '口 (Mulut)', radB: '曷 (Tenggorokan Kering)', story: 'Membuka mulut untuk meneguk cairan pelepas dahaga saat tenggorokan kering.', pinyin: 'hē', meaning: 'Minum', level: 1, strokes: 12 },
    '想': { radA: '相 (Memandang / Mengamati)', radB: '心 (Hati / Pikiran)', story: 'Mengamati dan merenungkan seseorang atau impian jauh di dalam lubuk hati.', pinyin: 'xiǎng', meaning: 'Berpikir / Rindu / Ingin', level: 1, strokes: 13 },
    '爱': { radA: '爫 (Cakar Kasih)', radB: '心 (Hati) + 友 (Kawan)', story: 'Memberikan pelukan hangat dengan ketulusan hati sejati kepada orang tercinta.', pinyin: 'ài', meaning: 'Cinta / Mengasihi', level: 1, strokes: 10 },
    '家': { radA: '宀 (Atap Rumah)', radB: '豕 (Ternak / Babi)', story: 'Pada zaman kuno, rumah yang makmur ditandai dengan atap pelindung kokoh dan hewan ternak di bawahnya.', pinyin: 'jiā', meaning: 'Rumah / Keluarga', level: 1, strokes: 10 },
    '众': { radA: '人 (Orang)', radB: '从 (Dua orang)', story: 'Tiga orang berkumpul di satu tempat melambangkan khalayak ramai / masyarakat.', pinyin: 'zhòng', meaning: 'Orang banyak / Khalayak', level: 2, strokes: 6 },
    '森': { radA: '木 (Pohon)', radB: '林 (Dua pohon)', story: 'Tiga pohon yang berdiri berdampingan melambangkan hutan rimba yang rimbun.', pinyin: 'sēn', meaning: 'Hutan belantara', level: 1, strokes: 12 },
    '语': { radA: '讠 (Kata / Bicara)', radB: '吾 (Saya)', story: 'Tutur kata yang keluar dari dalam diri seseorang untuk berkomunikasi.', pinyin: 'yǔ', meaning: 'Bahasa / Tutur kata', level: 1, strokes: 9 },
    '雷': { radA: '雨 (Hujan)', radB: '田 (Sawah)', story: 'Hujan deras lebat di atas sawah yang diiringi suara petir menggelegar.', pinyin: 'léi', meaning: 'Guntur / Petir', level: 2, strokes: 13 },
    '林': { radA: '木 (Pohon)', radB: '木 (Pohon)', story: 'Dua batang pohon yang tumbuh berdampingan membentuk pepohonan atau hutan kecil.', pinyin: 'lín', meaning: 'Hutan Kecil / Pepohonan', level: 1, strokes: 8 },
    '从': { radA: '人 (Orang)', radB: '人 (Orang)', story: 'Seseorang yang berjalan beriringan melangkah mengikuti orang di depannya.', pinyin: 'cóng', meaning: 'Mengikuti / Dari', level: 1, strokes: 4 },
    '早': { radA: '日 (Matahari)', radB: '十 (Pagi / Awal)', story: 'Matahari pertama yang baru menyingsing di pagi hari di atas ufuk timur.', pinyin: 'zǎo', meaning: 'Pagi Hari / Awal', level: 1, strokes: 6 },
    '星': { radA: '日 (Benda Langit)', radB: '生 (Lahir)', story: 'Benda langit yang terlahir dan memancarkan kerlap-kerlip gemintang di malam hari.', pinyin: 'xīng', meaning: 'Bintang', level: 1, strokes: 9 },
    '问': { radA: '门 (Pintu)', radB: '口 (Mulut)', story: 'Mengetuk pintu dan membuka mulut untuk menanyakan arah jalan atau berita.', pinyin: 'wèn', meaning: 'Bertanya', level: 1, strokes: 6 },
    '间': { radA: '门 (Pintu)', radB: '日 (Matahari)', story: 'Berkas sinar mentari yang menyusup masuk melalui celah pintu ruangan.', pinyin: 'jiān', meaning: 'Ruangan / Di Antara', level: 1, strokes: 7 },
    '信': { radA: '亻 (Orang)', radB: '言 (Tutur Kata)', story: 'Tutur kata seseorang yang jujur dan dapat dipercaya menjadi dasar sebuah amanah.', pinyin: 'xìn', meaning: 'Percaya / Surat', level: 2, strokes: 9 },
    '安': { radA: '宀 (Atap Rumah)', radB: '女 (Wanita)', story: 'Seorang wanita yang berada aman dan tenteram terlindung di dalam rumah yang tenang.', pinyin: 'ān', meaning: 'Aman / Damai / Tenang', level: 2, strokes: 6 },
    '字': { radA: '宀 (Atap Rumah)', radB: '子 (Anak)', story: 'Anak yang diajarkan merangkai dan menulis aksara di dalam rumah tempat belajar.', pinyin: 'zì', meaning: 'Karakter / Huruf Aksara', level: 1, strokes: 6 }
  },

  anatomyBank: [
    { char: '休', pinyin: 'xiū', meaning: 'Istirahat / Rehat', radA: '亻 (Orang)', radB: '木 (Pohon)', story: 'Seseorang bersandar di pohon yang rindang untuk melepas lelah setelah seharian bekerja.' },
    { char: '明', pinyin: 'míng', meaning: 'Terang / Jelas', radA: '日 (Matahari)', radB: '月 (Bulan)', story: 'Matahari di siang hari dan bulan di malam hari, bersatu memancarkan terang semesta.' },
    { char: '好', pinyin: 'hǎo', meaning: 'Baik / Bagus', radA: '女 (Wanita / Ibu)', radB: '子 (Anak)', story: 'Seorang ibu yang menggendong buah hatinya dengan penuh kasih melambangkan kebaikan sempurna.' },
    { char: '看', pinyin: 'kàn', meaning: 'Melihat / Memandang', radA: '手 (Tangan)', radB: '目 (Mata)', story: 'Meletakkan tangan di atas mata untuk memayungi pandangan dan melihat kejauhan.' },
    { char: '男', pinyin: 'nán', meaning: 'Pria / Laki-laki', radA: '田 (Sawah)', radB: '力 (Tenaga / Kekuatan)', story: 'Seseorang yang mengerahkan tenaga dan kekuatannya untuk mencangkul di sawah.' },
    { char: '众', pinyin: 'zhòng', meaning: 'Orang banyak / Khalayak', radA: '人 (Orang)', radB: '从 (Dua orang)', story: 'Tiga orang berkumpul di satu tempat melambangkan khalayak ramai / masyarakat.' },
    { char: '森', pinyin: 'sēn', meaning: 'Hutan belantara', radA: '木 (Pohon)', radB: '林 (Dua pohon)', story: 'Tiga pohon yang berdiri berdampingan melambangkan hutan rimba yang rimbun.' },
    { char: '家', pinyin: 'jiā', meaning: 'Rumah / Keluarga', radA: '宀 (Atap Rumah)', radB: '豕 (Babi Ternak)', story: 'Pada zaman Tiongkok kuno, rumah yang makmur ditandai dengan adanya atap pelindung dan ternak di bawahnya.' },
    { char: '语', pinyin: 'yǔ', meaning: 'Bahasa / Tutur kata', radA: '讠 (Kata / Bicara)', radB: '吾 (Saya)', story: 'Tutur kata yang keluar dari dalam diri seseorang untuk berkomunikasi.' },
    { char: '雷', pinyin: 'léi', meaning: 'Guntur / Petir', radA: '雨 (Hujan)', radB: '田 (Sawah)', story: 'Hujan deras lebat di atas sawah yang diiringi suara petir menggelegar.' }
  ],

  // Dekonstruksi Karakter Tunggal
  decomposeSingleChar(ch) {
    if (!ch || typeof ch !== 'string') return null;
    ch = ch.trim();

    // 1. Cek bank anatomi aktif (dari MySQL / JSON sync)
    const fromBank = (this.anatomyBank || []).find(i => (i.char === ch || i.char_hanzi === ch));
    if (fromBank) {
      const fallbackStroke = this.hanziDecompDict[ch] ? this.hanziDecompDict[ch].strokes : 6;
      return {
        char: fromBank.char || fromBank.char_hanzi,
        pinyin: fromBank.pinyin,
        meaning: fromBank.meaning,
        radA: fromBank.radA || fromBank.rad_a || '-',
        radB: fromBank.radB || fromBank.rad_b || '-',
        story: fromBank.story || '',
        level: fromBank.level || 1,
        strokes: fromBank.strokes || fallbackStroke,
        source: 'Bank Utama'
      };
    }

    // 2. Cek basis kamus anatomi bawaan
    if (this.hanziDecompDict[ch]) {
      const d = this.hanziDecompDict[ch];
      return {
        char: ch,
        pinyin: d.pinyin,
        meaning: d.meaning,
        radA: d.radA,
        radB: d.radB,
        story: d.story,
        level: d.level || 1,
        strokes: d.strokes || 6,
        source: 'Kamus Anatomi'
      };
    }

    // 3. Fallback: Lookup kamus flashcard untuk makna & pinyin, lalu ekstrak radikal
    const allDict = this.getAllDictionaryEntries();
    const entry = allDict.find(d => d.hanzi === ch) || allDict.find(d => d.hanzi && d.hanzi.includes(ch));

    // Deteksi radikal yang terkandung dalam karakter
    let detectedRad = '-';
    for (const [radKey, radName] of Object.entries(this.commonRadicals)) {
      if (ch.includes(radKey) && ch !== radKey) {
        detectedRad = `${radKey} (${radName})`;
        break;
      }
    }

    return {
      char: ch,
      pinyin: entry ? entry.pinyin : 'pīnyīn',
      meaning: entry ? entry.meaning : 'Karakter Aksara Hanzi',
      radA: detectedRad !== '-' ? detectedRad : 'Radikal Aksara Utama',
      radB: 'Komponen Fonetik / Semantik Tambahan',
      story: entry ? `Karakter '${ch}' (${entry.pinyin} - ${entry.meaning}) merupakan kesatuan komponen visual yang merepresentasikan gagasan secara piktografis.` : `Karakter '${ch}' tersusun dari perpaduan guratan visual radikal Mandarin.`,
      level: entry ? (entry.lvl || 1) : 1,
      strokes: 6,
      source: 'Kamus Mandarinku'
    };
  },

  // Dekonstruksi Input Pengguna (bisa kata, karakter, pinyin, atau arti)
  decomposeHanziInput(query) {
    if (!query) return [];
    query = query.trim();

    // Jika mengandung karakter Mandarin: ekstrak per karakter unik
    const hanziMatches = query.match(/[\u4e00-\u9fff]/g);
    if (hanziMatches && hanziMatches.length > 0) {
      const uniqueChars = Array.from(new Set(hanziMatches));
      return uniqueChars.map(ch => this.decomposeSingleChar(ch)).filter(Boolean);
    }

    // Jika bukan Hanzi: cari berdasarkan Pinyin atau Arti
    const qLower = query.toLowerCase();
    const results = [];
    const seenChars = new Set();

    // Cek bank anatomi
    (this.anatomyBank || []).forEach(item => {
      const pMatch = (item.pinyin || '').toLowerCase().includes(qLower);
      const mMatch = (item.meaning || '').toLowerCase().includes(qLower);
      const ch = item.char || item.char_hanzi;
      if ((pMatch || mMatch) && !seenChars.has(ch)) {
        seenChars.add(ch);
        results.push(this.decomposeSingleChar(ch));
      }
    });

    // Cek kamus dekonstruksi
    Object.entries(this.hanziDecompDict).forEach(([ch, item]) => {
      if (!seenChars.has(ch)) {
        const pMatch = (item.pinyin || '').toLowerCase().includes(qLower);
        const mMatch = (item.meaning || '').toLowerCase().includes(qLower);
        if (pMatch || mMatch) {
          seenChars.add(ch);
          results.push(this.decomposeSingleChar(ch));
        }
      }
    });

    // Cek dictionary flashcard
    if (results.length < 5) {
      const allDict = this.getAllDictionaryEntries();
      allDict.forEach(entry => {
        const pMatch = (entry.pinyin || '').toLowerCase().includes(qLower);
        const mMatch = (entry.meaning || '').toLowerCase().includes(qLower);
        if (pMatch || mMatch) {
          const chars = (entry.hanzi || '').match(/[\u4e00-\u9fff]/g) || [];
          chars.forEach(ch => {
            if (!seenChars.has(ch) && results.length < 12) {
              seenChars.add(ch);
              results.push(this.decomposeSingleChar(ch));
            }
          });
        }
      });
    }

    return results;
  },

  // Handler Unggahan File (.txt, .csv, .json, .docx)
  handleAnatomyFileSelect(file) {
    if (!file) return;
    this.anatomyUploadFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || '';
      this.analyzeTextAnatomy(text, file.name);
    };
    reader.readAsText(file, 'UTF-8');
  },

  // Analisis Teks untuk Anatomi
  analyzeTextAnatomy(text, sourceName = 'Teks Dokumen') {
    if (!text || typeof text !== 'string') return;
    const matches = text.match(/[\u4e00-\u9fff]/g) || [];
    if (matches.length === 0) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Tidak ditemukan karakter Hanzi dalam file/teks yang diunggah.', 'warning');
      }
      return;
    }

    const uniqueChars = Array.from(new Set(matches));
    const results = [];
    uniqueChars.forEach(ch => {
      const decomp = this.decomposeSingleChar(ch);
      if (decomp) results.push(decomp);
    });

    this.anatomyUploadResults = results;
    this.anatomyUploadStats = {
      total: matches.length,
      unique: uniqueChars.length,
      matched: results.length
    };
    this.anatomySubTab = 'upload';

    if (typeof showToast === 'function') {
      showToast(`✅ Berhasil membongkar anatomi ${uniqueChars.length} kosakata Hanzi dari ${sourceName}!`);
    }
    this.renderFiturPintarBody();
  },

  // Ekspor Hasil Analisis Anatomi ke File CSV
  exportAnatomyResults(list, filename = 'anatomi_kosakata_mandarin.csv') {
    if (!list || list.length === 0) {
      if (typeof showToast === 'function') showToast('Tidak ada data anatomi untuk diekspor!', 'warning');
      return;
    }

    let csv = '\uFEFF"Hanzi","Pinyin","Arti (ID)","Radikal A","Radikal B","Kisah Mnemonik","Level"\r\n';
    list.forEach(item => {
      const hz = (item.char || '').replace(/"/g, '""');
      const py = (item.pinyin || '').replace(/"/g, '""');
      const mn = (item.meaning || '').replace(/"/g, '""');
      const ra = (item.radA || '').replace(/"/g, '""');
      const rb = (item.radB || '').replace(/"/g, '""');
      const st = (item.story || '').replace(/"/g, '""');
      const lv = item.level || 1;
      csv += `"${hz}","${py}","${mn}","${ra}","${rb}","${st}","HSK ${lv}"\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') showToast(`✅ File CSV (${list.length} item) berhasil diunduh!`);
  },

  // RENDER SEKSI ANATOMI KARAKTER DENGAN 3 SUB-TAB TERSTRUKTUR
  renderHanziAnatomySection(container) {
    if (!this.selectedAnatomyLevel) this.selectedAnatomyLevel = 'all';
    const subTab = this.anatomySubTab || 'type';

    // Bank data lengkap untuk tab katalog
    const allBank = this.anatomyBank || [];
    const qCatalog = (this.anatomyCatalogQuery || '').toLowerCase().trim();
    const filteredCatalog = allBank.filter(i => {
      const matchLvl = (this.selectedAnatomyLevel === 'all' || (i.level || 1) == this.selectedAnatomyLevel);
      if (!matchLvl) return false;
      if (qCatalog) {
        const text = `${i.char} ${i.pinyin} ${i.meaning} ${i.radA} ${i.radB} ${i.story}`.toLowerCase();
        return text.includes(qCatalog);
      }
      return true;
    });

    // Pagination untuk katalog
    const totalCatalog = filteredCatalog.length;
    const pageSize = this.anatomyCatalogPageSize || 10;
    const totalPages = Math.max(1, Math.ceil(totalCatalog / pageSize));
    if (this.anatomyCatalogPage > totalPages) this.anatomyCatalogPage = totalPages;
    if (this.anatomyCatalogPage < 1) this.anatomyCatalogPage = 1;
    const startIdx = (this.anatomyCatalogPage - 1) * pageSize;
    const pagedCatalog = filteredCatalog.slice(startIdx, startIdx + pageSize);

    // Filter & Pagination untuk Hasil Unggahan Dokumen
    const uploadLvl = this.anatomyUploadLevelFilter || 'all';
    const filteredUpload = (this.anatomyUploadResults || []).filter(item => {
      if (uploadLvl === 'all') return true;
      return (item.level || 1) == uploadLvl;
    });
    const totalUpload = filteredUpload.length;
    const uploadPageSize = this.anatomyUploadPageSize || 10;
    const totalUploadPages = Math.max(1, Math.ceil(totalUpload / uploadPageSize));
    if (this.anatomyUploadPage > totalUploadPages) this.anatomyUploadPage = totalUploadPages;
    if (this.anatomyUploadPage < 1) this.anatomyUploadPage = 1;
    const uploadStartIdx = (this.anatomyUploadPage - 1) * uploadPageSize;
    const pagedUpload = filteredUpload.slice(uploadStartIdx, uploadStartIdx + uploadPageSize);

    // Hasil Dekonstruksi Pencarian / Pengetikan
    const typedQuery = (this.anatomyTypeQuery || '休').trim();
    const typeResults = this.decomposeHanziInput(typedQuery);

    container.innerHTML = `
      <div class="modern-feature-card" style="background: #ffffff; border-radius: 24px; border: 1px solid rgba(0,0,0,0.04); padding: 28px; box-shadow: 0 6px 24px rgba(0,0,0,0.03);">
        <div style="max-width: 900px; margin: 0 auto;">

          <!-- Header Anatomi -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #0284c7; color: #fff; font-size: 0.75rem; font-weight: 800; padding: 3px 12px; border-radius: 9999px;">
                  🧩 PEMBONGKAR ANATOMI KARAKTER
                </span>
                <span style="font-size: 0.8rem; color: #64748b;">字形拆解与记忆法</span>
              </div>
              <h3 style="font-size: 1.45rem; font-weight: 900; color: #0369a1; margin: 6px 0 4px 0;">
                Bongkar Radikal & Cerita Filosofis Hanzi
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5;">
                Ketik kata atau unggah file dokumen untuk memecah karakter Mandarin menjadi radikal pembentuknya dan temukan cerita mnemonik visualnya secara terstruktur.
              </p>
            </div>

            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-learn-outline" style="font-size: 0.8rem; padding: 6px 14px; margin: 0; border-radius: 9999px; border: none; color: #0284c7; background: #f0f9ff;" onclick="MandarinkuExtras.exportAnatomyResults(MandarinkuExtras.anatomyBank, 'bank_anatomi_mandarinku.csv')">
                📥 Unduh Semua Anatomi (.CSV)
              </button>
            </div>
          </div>

          <!-- Navigasi Sub-Tab Terstruktur: 1. Ketik & Cari, 2. Upload File, 3. Bank Katalog -->
          <div style="display: flex; gap: 10px; margin-bottom: 24px; border-bottom: 1px solid rgba(2, 132, 199, 0.12); padding-bottom: 12px; flex-wrap: wrap;">
            <button type="button" class="bank-filter-chip ${subTab === 'type' ? 'active' : ''}" style="${subTab === 'type' ? 'background: #0284c7; color: #ffffff; border-color: #0284c7; font-weight: 800;' : 'font-weight: 700;'}" onclick="MandarinkuExtras.anatomySubTab = 'type'; MandarinkuExtras.renderFiturPintarBody();">
              ⌨️ Ketik & Cari Kosakata (Live Deconstructor)
            </button>
            <button type="button" class="bank-filter-chip ${subTab === 'upload' ? 'active' : ''}" style="${subTab === 'upload' ? 'background: #0284c7; color: #ffffff; border-color: #0284c7; font-weight: 800;' : 'font-weight: 700;'}" onclick="MandarinkuExtras.anatomySubTab = 'upload'; MandarinkuExtras.renderFiturPintarBody();">
              📤 Upload File Dokumen (.txt, .csv, .json) ${this.anatomyUploadResults.length > 0 ? `(${this.anatomyUploadResults.length})` : ''}
            </button>
            <button type="button" class="bank-filter-chip ${subTab === 'catalog' ? 'active' : ''}" style="${subTab === 'catalog' ? 'background: #0284c7; color: #ffffff; border-color: #0284c7; font-weight: 800;' : 'font-weight: 700;'}" onclick="MandarinkuExtras.anatomySubTab = 'catalog'; MandarinkuExtras.renderFiturPintarBody();">
              📚 Katalog Bank Anatomi Lengkap (${allBank.length})
            </button>
          </div>

          <!-- ===============================================================
               SUB-TAB 1: KETIK & CARI KOSAKATA (LIVE DECONSTRUCTOR)
               =============================================================== -->
          ${subTab === 'type' ? `
            <div style="margin-bottom: 24px;">
              <!-- Input Search Box -->
              <div style="position: relative; margin-bottom: 12px;">
                <input type="text" id="anatomyTypeInput" value="${escapeHtml(this.anatomyTypeQuery)}" oninput="MandarinkuExtras.anatomyTypeQuery = this.value; MandarinkuExtras.renderFiturPintarBody();" placeholder="Ketik karakter Hanzi (cth: 休, 明, 朋友, 学习, 男, 家), Pinyin (xiū), atau arti (istirahat)..." style="width: 100%; padding: 14px 45px 14px 44px; border: 2px solid #38bdf8; border-radius: 14px; font-size: 1.05rem; box-sizing: border-box; font-weight: 600; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.15); transition: border-color 0.2s;">
                <span style="position: absolute; left: 16px; top: 15px; font-size: 1.2rem; color: #0284c7;">🔍</span>
                ${this.anatomyTypeQuery ? `
                  <button type="button" onclick="MandarinkuExtras.anatomyTypeQuery = ''; MandarinkuExtras.renderFiturPintarBody();" style="position: absolute; right: 14px; top: 14px; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8;">&times;</button>
                ` : ''}
              </div>

              <!-- Quick Click Sample Chips -->
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #64748b;">Contoh Cepat:</span>
                ${['休 (Istirahat)', '明 (Terang)', '好 (Baik)', '看 (Melihat)', '男 (Pria)', '家 (Rumah)', '朋 (Teman)', '友 (Sahabat)', '学习 (Belajar)', '谢谢 (Terima Kasih)', '爱 (Cinta)', '想 (Ingin)', '语 (Bahasa)'].map(chip => {
                  const pureChar = chip.split(' ')[0];
                  return `
                    <button type="button" class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-color: #bae6fd; color: #0369a1; background: #f0f9ff; margin: 0;" onclick="MandarinkuExtras.anatomyTypeQuery = '${pureChar}'; MandarinkuExtras.renderFiturPintarBody();">
                      ${chip}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Hasil Dekonstruksi Terstruktur -->
              ${typeResults.length > 0 ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                    <span>✨</span> Hasil Anatomi Terstruktur (${typeResults.length} Karakter Terurai):
                  </h4>
                  <button type="button" class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.75rem; margin: 0;" onclick="MandarinkuExtras.exportAnatomyResults(MandarinkuExtras.decomposeHanziInput('${typedQuery.replace(/'/g, "\\'")}'), 'hasil_anatomi_${typedQuery}.csv')">
                    📥 Ekspor Hasil Ini (.CSV)
                  </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px;">
                  ${typeResults.map(item => `
                    <div class="modern-course-card" style="border-radius: 20px; padding: 22px; background: #ffffff; border: 1px solid rgba(2, 132, 199, 0.12); box-shadow: 0 4px 18px rgba(2, 132, 199, 0.05); transition: transform 0.2s;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 14px;">
                        <!-- Karakter & Pengucapan -->
                        <div style="display: flex; align-items: center; gap: 16px;">
                          <div style="width: 74px; height: 74px; background: #f0f9ff; border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08);">
                            <span style="font-family: var(--font-chinese, serif); font-size: 3rem; font-weight: 900; color: #dc2626; line-height: 1;">${item.char}</span>
                          </div>
                          <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <span style="font-size: 1.35rem; font-weight: 800; color: #0284c7;">${item.pinyin}</span>
                              <button type="button" class="btn-primary-sakura" style="padding: 4px 12px; font-size: 0.78rem; margin: 0; background: #0284c7; border-radius: 9999px;" onclick="if(typeof speakMandarin==='function') speakMandarin('${item.char}', 0.85)">
                                🔊 Lafal
                              </button>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
                              ${item.meaning}
                            </div>
                          </div>
                        </div>

                        <!-- Badge Tingkat & Sumber -->
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                          <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end;">
                            <span style="background: #e0f2fe; color: #0369a1; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 9999px;">
                              HSK Level ${item.level || 1}
                            </span>
                            <span style="background: #fef3c7; color: #b45309; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 9999px;">
                              ✍️ ${item.strokes || 6} Goresan
                            </span>
                          </div>
                          <span style="font-size: 0.72rem; color: #64748b;">${item.source || 'Terverifikasi'}</span>
                        </div>
                      </div>

                      <!-- Formula Pembongkaran Radikal Komponen -->
                      <div style="background: rgba(0,0,0,0.02); border-radius: 14px; padding: 12px 18px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="font-size: 0.8rem; font-weight: 800; color: #64748b;">Formula Radikal:</span>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                          <span style="background: #eff6ff; color: #1d4ed8; font-size: 0.95rem; font-weight: 800; padding: 5px 14px; border-radius: 10px;">
                            ${item.radA}
                          </span>
                          <span style="font-size: 1.1rem; font-weight: 900; color: #94a3b8;">+</span>
                          <span style="background: #ecfdf5; color: #047857; font-size: 0.95rem; font-weight: 800; padding: 5px 14px; border-radius: 10px;">
                            ${item.radB}
                          </span>
                          <span style="font-size: 1.1rem; font-weight: 900; color: #94a3b8;">➔</span>
                          <span style="background: #fef2f2; color: #b91c1c; font-size: 1.15rem; font-weight: 900; padding: 5px 16px; border-radius: 10px; font-family: var(--font-chinese, serif);">
                            ${item.char}
                          </span>
                        </div>
                      </div>

                      <!-- Cerita Filosofis & Mnemonik Asosiasi -->
                      <div style="background: #f0f9ff; border-radius: 14px; padding: 14px 18px; font-size: 0.88rem; color: #0369a1; line-height: 1.6;">
                        💡 <strong style="color: #0284c7;">Kisah Mnemonik & Asosiasi Visual:</strong> ${item.story}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="text-align: center; padding: 40px 20px; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 16px; color: #64748b;">
                  <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
                  <div style="font-weight: 800; font-size: 1.05rem; color: #1e293b; margin-bottom: 4px;">Tidak menemukan kecocokan untuk "${escapeHtml(typedQuery)}"</div>
                  <p style="font-size: 0.85rem; margin: 0;">Silakan coba ketik karakter Hanzi tunggal (seperti 休, 明, 男, 好) atau kata dalam Bahasa Indonesia.</p>
                </div>
              `}
            </div>
          ` : ''}

          <!-- ===============================================================
               SUB-TAB 2: UPLOAD FILE DOKUMEN KOSAKATA (BATCH FILE EXTRACTOR)
               =============================================================== -->
          ${subTab === 'upload' ? `
            <div style="margin-bottom: 24px;">
              <!-- Drag & Drop Zone File Upload -->
              <div style="border: 2px dashed rgba(2, 132, 199, 0.35); border-radius: 22px; padding: 36px 20px; text-align: center; background: #f0f9ff; margin-bottom: 20px; transition: all 0.2s;" ondragover="event.preventDefault(); this.style.background='#e0f2fe';" ondragleave="this.style.background='#f0f9ff';" ondrop="event.preventDefault(); this.style.background='#f0f9ff'; MandarinkuExtras.handleAnatomyFileSelect(event.dataTransfer.files[0]);">
                <div style="font-size: 3rem; margin-bottom: 8px;">📁</div>
                <h4 style="margin: 0 0 6px 0; font-size: 1.15rem; font-weight: 900; color: #0369a1;">
                  Unggah File Dokumen Kosakata (.TXT, .CSV, .JSON, .DOCX)
                </h4>
                <p style="font-size: 0.85rem; color: #64748b; max-width: 580px; margin: 0 auto 16px auto; line-height: 1.5;">
                  Tarik & lepas file Anda ke sini, atau klik tombol di bawah untuk memilih file dari komputer. Sistem akan otomatis memindai dan membongkar anatomi setiap karakter Hanzi yang ada di dalam dokumen.
                </p>

                <input type="file" id="anatomyFileInput" accept=".txt,.csv,.json,.docx,.tsv" style="display: none;" onchange="MandarinkuExtras.handleAnatomyFileSelect(this.files[0])">
                <button type="button" class="btn-primary-sakura" style="background: #0284c7; padding: 10px 24px; font-size: 0.9rem; margin: 0; border-radius: 9999px;" onclick="document.getElementById('anatomyFileInput').click();">
                  📂 Pilih File Dokumen Kosakata
                </button>
              </div>

              <!-- Alternatif: Tempel Teks Kosakata Langsung -->
              <div style="background: rgba(0,0,0,0.02); border-radius: 18px; padding: 20px; margin-bottom: 24px;">
                <label style="display: block; font-weight: 800; font-size: 0.88rem; color: #334155; margin-bottom: 8px;">
                  📋 Atau Tempel / Ketik Teks Mandarin Bebas di Bawah Ini:
                </label>
                <textarea id="anatomyPasteText" rows="3" placeholder="Contoh: 你好！欢迎来到中国学习汉语。明天我们一起看书吃苹果。" style="width: 100%; padding: 12px 14px; border: 1.5px solid rgba(2, 132, 199, 0.2); border-radius: 12px; font-family: var(--font-chinese, serif); font-size: 1rem; box-sizing: border-box;"></textarea>
                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                  <button type="button" class="btn-primary-sakura" style="background: #059669; padding: 8px 20px; font-size: 0.85rem; margin: 0; border-radius: 9999px;" onclick="MandarinkuExtras.analyzeTextAnatomy(document.getElementById('anatomyPasteText').value, 'Teks Ditempel')">
                    🚀 Proses & Bongkar Anatomi Teks
                  </button>
                </div>
              </div>

              <!-- Hasil Ekstraksi File Unggahan -->
              ${this.anatomyUploadResults.length > 0 ? `
                <div style="background: #ecfdf5; border-radius: 18px; padding: 16px 22px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <strong style="color: #065f46; font-size: 0.95rem;">📊 Dokumen: ${escapeHtml(this.anatomyUploadFileName || 'Teks Unggahan')}</strong>
                    <div style="font-size: 0.8rem; color: #047857; margin-top: 2px;">
                      Ditemukan <strong>${this.anatomyUploadStats.total}</strong> kemunculan karakter Hanzi • <strong>${this.anatomyUploadStats.unique}</strong> kosakata unik terurai.
                    </div>
                  </div>
                  <button type="button" class="btn-primary-sakura" style="background: #059669; padding: 7px 18px; font-size: 0.8rem; margin: 0; border-radius: 9999px;" onclick="MandarinkuExtras.exportAnatomyResults(MandarinkuExtras.anatomyUploadResults, 'hasil_ekstrak_${escapeHtml(MandarinkuExtras.anatomyUploadFileName || 'kosakata')}.csv')">
                    📥 Unduh Semua Hasil (.CSV)
                  </button>
                </div>

                <!-- Filter Bar Level HSK untuk Hasil Ekstraksi -->
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span style="font-size: 0.78rem; font-weight: 800; color: #64748b;">Filter Level:</span>
                    <button type="button" class="btn-learn-outline" style="padding: 4px 12px; font-size: 0.75rem; font-weight: 800; margin: 0; border-radius: 9999px; ${uploadLvl === 'all' ? 'background: #0284c7; color: #fff; border-color: #0284c7;' : ''}" onclick="MandarinkuExtras.anatomyUploadLevelFilter = 'all'; MandarinkuExtras.anatomyUploadPage = 1; MandarinkuExtras.renderFiturPintarBody();">
                      Semua (${this.anatomyUploadResults.length})
                    </button>
                    ${[1, 2, 3, 4, 5, 6].map(lvl => {
                      const countLvl = this.anatomyUploadResults.filter(i => (i.level || 1) == lvl).length;
                      return `
                        <button type="button" class="btn-learn-outline" style="padding: 4px 12px; font-size: 0.75rem; font-weight: 800; margin: 0; border-radius: 9999px; ${uploadLvl == lvl ? 'background: #0284c7; color: #fff; border-color: #0284c7;' : ''}" onclick="MandarinkuExtras.anatomyUploadLevelFilter = '${lvl}'; MandarinkuExtras.anatomyUploadPage = 1; MandarinkuExtras.renderFiturPintarBody();">
                          HSK ${lvl} (${countLvl})
                        </button>
                      `;
                    }).join('')}
                  </div>
                  <div style="font-size: 0.78rem; color: #64748b; font-weight: 600;">
                    Total Sesuai Filter: <strong style="color: #0284c7;">${totalUpload}</strong> karakter
                  </div>
                </div>

                ${pagedUpload.length > 0 ? `
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; margin-bottom: 20px;">
                    ${pagedUpload.map(item => `
                      <div class="modern-course-card" style="border: 1px solid rgba(0,0,0,0.04); border-radius: 18px; padding: 18px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(0,0,0,0.02);">
                        <div>
                          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <div style="display: flex; align-items: baseline; gap: 8px;">
                              <span style="font-family: var(--font-chinese, serif); font-size: 2.2rem; font-weight: 900; color: #dc2626; line-height: 1;">${item.char}</span>
                              <span style="font-size: 1rem; font-weight: 800; color: #ea580c;">[${item.pinyin}]</span>
                              <span style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">${item.meaning}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end;">
                              <span style="background: #e0f2fe; color: #0369a1; font-size: 0.7rem; font-weight: 800; padding: 3px 8px; border-radius: 9999px;">HSK ${item.level || 1}</span>
                              <span style="background: #fef3c7; color: #b45309; font-size: 0.7rem; font-weight: 800; padding: 3px 8px; border-radius: 9999px;">✍️ ${item.strokes || 6} Goresan</span>
                              <button type="button" class="btn-learn-outline" style="padding: 2px 8px; font-size: 0.72rem; margin: 0; border-radius: 9999px;" onclick="if(typeof speakMandarin==='function') speakMandarin('${item.char}', 0.85)">🔊</button>
                            </div>
                          </div>

                          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 800; color: #475569; margin-bottom: 8px; background: rgba(0,0,0,0.02); padding: 8px 12px; border-radius: 12px;">
                            <span style="color: #0284c7;">${item.radA}</span>
                            <span style="color: #94a3b8;">+</span>
                            <span style="color: #10b981;">${item.radB}</span>
                            <span style="color: #94a3b8;">=</span>
                            <strong style="color: #dc2626; font-size: 0.9rem;">${item.char}</strong>
                          </div>

                          <div style="font-size: 0.82rem; color: #0369a1; line-height: 1.5; background: #f0f9ff; padding: 10px 12px; border-radius: 10px;">
                            💡 <strong>Kisah Asosiasi:</strong> ${item.story}
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Pagination Bar untuk Hasil Unggahan -->
                  <div class="table-pagination-nav" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 0.84rem; color: #64748b; font-weight: 600;">
                      Menampilkan <strong style="color: #1e293b;">${uploadStartIdx + 1} - ${Math.min(uploadStartIdx + uploadPageSize, totalUpload)}</strong> dari <strong style="color: #1e293b;">${totalUpload}</strong> karakter
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                      <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyUploadPage = 1; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyUploadPage === 1 ? 'disabled' : ''} title="Halaman Pertama">«</button>
                      <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyUploadPage = ${this.anatomyUploadPage - 1}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyUploadPage === 1 ? 'disabled' : ''} title="Halaman Sebelumnya">‹</button>
                      ${Array.from({ length: totalUploadPages }, (_, i) => i + 1).map(p => `
                        <button type="button" class="page-nav-btn ${p === this.anatomyUploadPage ? 'active' : ''}" onclick="MandarinkuExtras.anatomyUploadPage = ${p}; MandarinkuExtras.renderFiturPintarBody();">${p}</button>
                      `).join('')}
                      <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyUploadPage = ${this.anatomyUploadPage + 1}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyUploadPage === totalUploadPages ? 'disabled' : ''} title="Halaman Berikutnya">›</button>
                      <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyUploadPage = ${totalUploadPages}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyUploadPage === totalUploadPages ? 'disabled' : ''} title="Halaman Terakhir">»</button>
                    </div>
                  </div>
                ` : `
                  <div style="text-align: center; padding: 24px; background: #fafafa; border-radius: 12px; color: #64748b; font-size: 0.88rem;">
                    🔍 Tidak ada karakter pada dokumen ini dengan tingkat HSK ${uploadLvl}. Coba pilih filter level yang lain.
                  </div>
                `}
              ` : `
                <div style="text-align: center; padding: 30px 20px; background: #fafafa; border-radius: 12px; color: #94a3b8; font-size: 0.85rem;">
                  Belum ada dokumen yang diunggah. Unggah file .txt/.csv/.json atau tempel teks Mandarin di atas untuk memulai.
                </div>
              `}
            </div>
          ` : ''}

          <!-- ===============================================================
               SUB-TAB 3: KATALOG BANK ANATOMI LENGKAP (HSK 1-6 DENGAN PAGINATION)
               =============================================================== -->
          ${subTab === 'catalog' ? `
            <div>
              <!-- Filter Bar & Search -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="btn-learn-outline" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 800; margin: 0; ${this.selectedAnatomyLevel === 'all' ? 'background: #0284c7; color: #fff; border-color: #0284c7;' : ''}" onclick="MandarinkuExtras.selectedAnatomyLevel = 'all'; MandarinkuExtras.anatomyCatalogPage = 1; MandarinkuExtras.renderFiturPintarBody();">
                    Semua (${allBank.length})
                  </button>
                  ${[1, 2, 3, 4, 5, 6].map(lvl => `
                    <button type="button" class="btn-learn-outline" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 800; margin: 0; ${this.selectedAnatomyLevel == lvl ? 'background: #0284c7; color: #fff; border-color: #0284c7;' : ''}" onclick="MandarinkuExtras.selectedAnatomyLevel = '${lvl}'; MandarinkuExtras.anatomyCatalogPage = 1; MandarinkuExtras.renderFiturPintarBody();">
                      HSK ${lvl}
                    </button>
                  `).join('')}
                </div>

                <div style="position: relative;">
                  <input type="text" value="${escapeHtml(this.anatomyCatalogQuery)}" oninput="MandarinkuExtras.anatomyCatalogQuery = this.value; MandarinkuExtras.anatomyCatalogPage = 1; MandarinkuExtras.renderFiturPintarBody();" placeholder="🔍 Cari di bank karakter..." style="padding: 7px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; width: 220px;">
                </div>
              </div>

              <!-- Grid Kartu Bank Anatomi -->
              ${pagedCatalog.length > 0 ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; margin-bottom: 20px;">
                  ${pagedCatalog.map(item => `
                    <div style="border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 16px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                      <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                          <div style="display: flex; align-items: baseline; gap: 8px;">
                            <span style="font-family: var(--font-chinese, serif); font-size: 2rem; font-weight: 900; color: #dc2626; line-height: 1;">${item.char || item.char_hanzi}</span>
                            <span style="font-size: 1rem; font-weight: 800; color: #ea580c;">[${item.pinyin}]</span>
                            <span style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">${item.meaning}</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end;">
                            <span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">HSK ${item.level || 1}</span>
                            <span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">✍️ ${item.strokes || (this.hanziDecompDict[item.char || item.char_hanzi] ? this.hanziDecompDict[item.char || item.char_hanzi].strokes : 6)} Goresan</span>
                            <button type="button" class="btn-learn-outline" style="padding: 2px 6px; font-size: 0.72rem; margin: 0;" onclick="if(typeof speakMandarin==='function') speakMandarin('${item.char || item.char_hanzi}', 0.85)">🔊</button>
                          </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 800; color: #475569; margin-bottom: 8px; background: #f8fafc; padding: 6px 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                          <span style="color: #0284c7;">${item.radA || item.rad_a}</span>
                          <span style="color: #94a3b8;">+</span>
                          <span style="color: #10b981;">${item.radB || item.rad_b}</span>
                          <span style="color: #94a3b8;">=</span>
                          <strong style="color: #dc2626; font-size: 0.9rem;">${item.char || item.char_hanzi}</strong>
                        </div>

                        <div style="font-size: 0.8rem; color: #334155; line-height: 1.45;">
                          💡 <strong>Kisah Asosiasi:</strong> ${item.story}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Pagination Bar untuk Katalog -->
                <div class="table-pagination-nav" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 0.84rem; color: #64748b; font-weight: 600;">
                    Menampilkan <strong style="color: #1e293b;">${startIdx + 1} - ${Math.min(startIdx + pageSize, totalCatalog)}</strong> dari <strong style="color: #1e293b;">${totalCatalog}</strong> karakter
                  </div>
                  <div style="display: flex; align-items: center; gap: 5px;">
                    <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyCatalogPage = 1; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyCatalogPage === 1 ? 'disabled' : ''} title="Halaman Pertama">«</button>
                    <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyCatalogPage = ${this.anatomyCatalogPage - 1}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyCatalogPage === 1 ? 'disabled' : ''} title="Halaman Sebelumnya">‹</button>
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
                      <button type="button" class="page-nav-btn ${p === this.anatomyCatalogPage ? 'active' : ''}" onclick="MandarinkuExtras.anatomyCatalogPage = ${p}; MandarinkuExtras.renderFiturPintarBody();">${p}</button>
                    `).join('')}
                    <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyCatalogPage = ${this.anatomyCatalogPage + 1}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyCatalogPage === totalPages ? 'disabled' : ''} title="Halaman Berikutnya">›</button>
                    <button type="button" class="page-nav-btn" onclick="MandarinkuExtras.anatomyCatalogPage = ${totalPages}; MandarinkuExtras.renderFiturPintarBody();" ${this.anatomyCatalogPage === totalPages ? 'disabled' : ''} title="Halaman Terakhir">»</button>
                  </div>
                </div>
              ` : `
                <div style="text-align: center; padding: 30px; background: #fafafa; border-radius: 12px; color: #64748b;">
                  🔍 Tidak ada data karakter yang cocok dengan filter atau kata kunci pencarian.
                </div>
              `}
            </div>
          ` : ''}

        </div>
      </div>
    `;
  },

  // --- ALAT 4: EKSPOR KOSAKATA KE ANKI / CSV (.CSV) ---
  downloadAnkiCsv(level) {
    let list = [];
    if (level === 'favorites') {
      list = this.getBookmarkedCardsPool();
    } else {
      const lvl = parseInt(level) || 1;
      list = (typeof flashcardData === 'object' && flashcardData[lvl]) ? flashcardData[lvl] : [];
    }

    if (!list || list.length === 0) {
      if (typeof showToast === 'function') showToast('Tidak ada data kosakata untuk diekspor!', 'warning');
      return;
    }

    // Header CSV
    let csvContent = '\uFEFF"Hanzi","Pinyin","Arti (ID)","Contoh Kalimat","Terjemahan Contoh","Level"\r\n';
    list.forEach(item => {
      const hz = (item.hanzi || '').replace(/"/g, '""');
      const py = (item.pinyin || '').replace(/"/g, '""');
      const mn = (item.meaning || '').replace(/"/g, '""');
      const ex = (item.example || '').replace(/"/g, '""');
      const et = (item.exampleTrans || '').replace(/"/g, '""');
      const lv = item.lvl || level;
      csvContent += `"${hz}","${py}","${mn}","${ex}","${et}","HSK ${lv}"\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mandarinku_kosakata_${level}_anki.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') showToast(`✅ Berhasil mengunduh file CSV (${list.length} kosakata)!`);
  },

  renderAnkiExportSection(container) {
    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 720px; margin: 0 auto;">
        <h3 style="font-size: 1.25rem; font-weight: 900; color: #0369a1; margin: 0 0 6px 0;">
          📦 Ekspor Kosakata ke Anki / Quizlet (.CSV)
        </h3>
        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px;">
          Unduh kumpulan kartu kosakata HSK 1–6 atau daftar Favorit Anda ke format file CSV standar (UTF-8) yang dapat langsung diimpor ke aplikasi Spaced Repetition seperti Anki, Quizlet, atau dibuka di Microsoft Excel.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px;">
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <div style="border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; background: #f8fafc;">
              <div style="font-weight: 800; font-size: 1rem; color: #0f172a; margin-bottom: 4px;">HSK Level ${lvl}</div>
              <div style="font-size: 0.76rem; color: #64748b; margin-bottom: 12px;">Format Anki / Quizlet CSV</div>
              <button type="button" class="btn-primary-sakura" style="padding: 7px 16px; font-size: 0.8rem; margin: 0; width: 100%; background: #0284c7;" onclick="MandarinkuExtras.downloadAnkiCsv(${lvl})">
                📥 Unduh CSV
              </button>
            </div>
          `).join('')}

          <div style="border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px; text-align: center; background: #fff7ed;">
            <div style="font-weight: 800; font-size: 1rem; color: #ea580c; margin-bottom: 4px;">⭐ Kosakata Favorit</div>
            <div style="font-size: 0.76rem; color: #9a3412; margin-bottom: 12px;">Kartu yang Anda Bintang</div>
            <button type="button" class="btn-primary-sakura" style="padding: 7px 16px; font-size: 0.8rem; margin: 0; width: 100%; background: #ea580c;" onclick="MandarinkuExtras.downloadAnkiCsv('favorites')">
              📥 Unduh Favorit
            </button>
          </div>
        </div>

        <div style="background: #f1f5f9; border-radius: 10px; padding: 12px 16px; font-size: 0.78rem; color: #475569;">
          💡 <strong>Cara Impor ke Anki:</strong> Buka aplikasi Anki di PC/HP ➔ Klik menu <em>File > Import</em> ➔ Pilih file CSV yang diunduh ➔ Kolom 1 adalah Karakter Hanzi (Front), Kolom 2 & 3 adalah Pinyin & Arti (Back).
        </div>
      </div>
    `;
  },

  // --- ALAT 5: PAPAN PERINGKAT & LEADERBOARD MINGGUAN (每周排行榜) ---
  renderLeaderboardSection(container) {
    const userExp = (typeof State === 'object' && State.currentUser && State.currentUser.exp) ? State.currentUser.exp : 250;
    const userName = (typeof State === 'object' && State.currentUser && State.currentUser.name) ? State.currentUser.name : 'Learner Panda';

    let topRankers = [
      { rank: 1, name: 'Budi Santoso', exp: 1420, hsk: 'HSK 5', avatar: '🦁', medal: '🥇', color: '#f59e0b' },
      { rank: 2, name: 'Siti Rahma', exp: 1280, hsk: 'HSK 4', avatar: '🌸', medal: '🥈', color: '#94a3b8' },
      { rank: 3, name: 'Kevin Wijaya', exp: 1150, hsk: 'HSK 4', avatar: '🚀', medal: '🥉', color: '#b45309' },
      { rank: 4, name: 'Dewi Lestari', exp: 890, hsk: 'HSK 3', avatar: '🦊', medal: '#4', color: '#64748b' },
      { rank: 5, name: 'Rian Pratama', exp: 740, hsk: 'HSK 3', avatar: '🐼', medal: '#5', color: '#64748b' },
      { rank: 6, name: userName, exp: userExp, hsk: 'HSK 2', avatar: '🐼', medal: '#6', color: '#ea580c', isUser: true },
      { rank: 7, name: 'Amanda Putri', exp: 210, hsk: 'HSK 2', avatar: '🐰', medal: '#7', color: '#64748b' },
      { rank: 8, name: 'Farhan Maulana', exp: 180, hsk: 'HSK 1', avatar: '🐯', medal: '#8', color: '#64748b' }
    ];

    if (window.DB_LEADERBOARD && Array.isArray(window.DB_LEADERBOARD) && window.DB_LEADERBOARD.length > 0) {
      topRankers = window.DB_LEADERBOARD.map(item => ({
        rank: item.rank,
        name: item.isUser ? userName : item.name,
        exp: item.isUser ? userExp : item.exp,
        hsk: item.hsk,
        avatar: item.avatar || '🐼',
        medal: item.medal || (`#${item.rank}`),
        color: item.rank === 1 ? '#f59e0b' : (item.rank === 2 ? '#94a3b8' : (item.rank === 3 ? '#b45309' : (item.isUser ? '#ea580c' : '#64748b'))),
        isUser: !!item.isUser
      }));
    }

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 740px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h3 style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 0;">
            🏆 Papan Peringkat Mingguan Pelajar Mandarinku (每周排行榜)
          </h3>
          <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
            Raih EXP dengan membaca cerita, menyelesaikan dikte, latihan kuas Hanzi, dan kuis HSK untuk naik ke podium teratas!
          </p>
        </div>

        <!-- Podium Top 3 -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-items: end; margin-bottom: 28px; text-align: center;">
          <!-- Juara 2 -->
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 1.8rem;">🥈</div>
            <div style="font-size: 1.4rem; margin: 4px 0;">${topRankers[1].avatar}</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">${topRankers[1].name}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${topRankers[1].exp} EXP</div>
          </div>

          <!-- Juara 1 -->
          <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px solid #f59e0b; border-radius: 16px; padding: 18px 14px; box-shadow: 0 6px 18px rgba(245,158,11,0.2); transform: translateY(-8px);">
            <div style="font-size: 2.2rem;">👑 🥇</div>
            <div style="font-size: 1.6rem; margin: 4px 0;">${topRankers[0].avatar}</div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #78350f;">${topRankers[0].name}</div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #b45309;">${topRankers[0].exp} EXP</div>
          </div>

          <!-- Juara 3 -->
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 1.8rem;">🥉</div>
            <div style="font-size: 1.4rem; margin: 4px 0;">${topRankers[2].avatar}</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">${topRankers[2].name}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${topRankers[2].exp} EXP</div>
          </div>
        </div>

        <!-- Tabel Peringkat Lengkap -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${topRankers.map(r => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 10px; border: 1.5px solid ${r.isUser ? '#ea580c' : '#e2e8f0'}; background: ${r.isUser ? '#fff7ed' : '#ffffff'};">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: 900; font-size: 0.95rem; min-width: 28px; text-align: center; color: ${r.color};">${r.medal}</span>
                <span style="font-size: 1.3rem;">${r.avatar}</span>
                <div>
                  <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${r.name} ${r.isUser ? '<span style="font-size: 0.7rem; color: #ea580c; background: #fee2e2; padding: 1px 6px; border-radius: 99px; margin-left: 4px;">Anda</span>' : ''}</div>
                  <div style="font-size: 0.7rem; color: #64748b;">${r.hsk}</div>
                </div>
              </div>
              <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a;">
                ${r.exp} <span style="font-size: 0.72rem; color: #64748b;">EXP</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 7. SIMULASI PERCAKAPAN SITUASIONAL (ROLEPLAY DIALOG INTERAKTIF)
  // =========================================================================
  roleplayScenarioId: 'resto',
  roleplayStep: 0,

  roleplayScenarios: {
    resto: {
      title: '点餐 Di Restoran & Kafe',
      desc: 'Berlatih memesan hidangan khas, menanyakan menu rekomendasi, dan meminta bon tagihan.',
      avatar: '👨‍🍳',
      partnerName: 'Pelayan Restoran (服务员)',
      steps: [
        {
          partnerSaid: '您好！欢迎光临，请问几位？',
          partnerPinyin: 'Nǐn hǎo! Huānyíng guānglín, qǐngwèn jǐ wèi?',
          partnerMeaning: 'Halo! Selamat datang, untuk berapa orang?',
          options: [
            { text: '两位，请给我们一个靠窗的位子。', pinyin: 'Liǎng wèi, qǐng gěi wǒmen yí gè kào chuāng de wèizi.', meaning: 'Dua orang, tolong beri kami meja dekat jendela.' },
            { text: '就我一个人，有空位吗？', pinyin: 'Jiù wǒ yí gè rén, yǒu kòngwèi ma?', meaning: 'Hanya saya sendiri, apakah ada meja kosong?' }
          ]
        },
        {
          partnerSaid: '好的，请这边坐。这是菜单，您想先喝点什么？',
          partnerPinyin: 'Hǎo de, qǐng zhèbiān zuò. Zhè shì càidān, nín xiǎng xiān hē diǎn shénme?',
          partnerMeaning: 'Baik, silakan duduk di sini. Ini menunya, Anda ingin minum apa terlebih dahulu?',
          options: [
            { text: '来一壶热茉莉花茶，谢谢。', pinyin: 'Lái yì hú rè mòlìhuā chá, xièxie.', meaning: 'Tolong satu poci teh melati hangat, terima kasih.' },
            { text: '请给我一杯冰水，谢谢。', pinyin: 'Qǐng gěi wǒ yì bēi bīng shuǐ, xièxie.', meaning: 'Tolong beri saya segelas air es, terima kasih.' }
          ]
        },
        {
          partnerSaid: '没问题。今天我们的宫保鸡丁和水饺非常受欢迎，您要尝试一下吗？',
          partnerPinyin: 'Méi wèntí. Jīntiān wǒmen de gōngbǎojīdīng hé shuǐjiǎo fēicháng shòuhuānyíng, nín yào chángshì yíxià ma?',
          partnerMeaning: 'Tidak masalah. Hari ini Ayam Gongbao dan pangsit kuah kami sangat populer, apakah ingin mencoba?',
          options: [
            { text: '太好了，来一份宫保鸡丁，不要太辣。', pinyin: 'Tài hǎo le, lái yí fèn gōngbǎojīdīng, bú yào tài là.', meaning: 'Bagus sekali, tolong satu porsi Ayam Gongbao, jangan terlalu pedas.' },
            { text: '我想要一份牛肉拉面，另外再加一份水饺。', pinyin: 'Wǒ xiǎng yào yí fèn niúròu lāmiàn, lìngwài zài jiā yí fèn shuǐjiǎo.', meaning: 'Saya ingin satu porsi mie tarik daging sapi, ditambah satu porsi pangsit kuah.' }
          ]
        },
        {
          partnerSaid: '菜都上齐了，请慢用！如果需要什么请随时叫我。',
          partnerPinyin: 'Cài dōu shàng qí le, qǐng màn yòng! Rúguǒ xūyào shénme qǐng suíshí jiào wǒ.',
          partnerMeaning: 'Semua hidangan sudah lengkap, selamat menikmati! Panggil saya kapan saja bila butuh sesuatu.',
          options: [
            { text: '服务员，买单！可以微信支付吗？', pinyin: 'Fúwùyuán, mǎidān! Kěyǐ Wēixìn zhīfù ma?', meaning: 'Pelayan, bayar! Apakah bisa bayar lewat WeChat Pay?' },
            { text: '味道好极了，请问洗手间在哪里？', pinyin: 'Wèidào hǎo jí le, qǐngwèn xǐshǒujiān zài nǎlǐ?', meaning: 'Rasanya luar biasa enak, permisi di mana letak toiletnya?' }
          ]
        }
      ]
    },
    direction: {
      title: '问路 Bertanya Arah Jalan',
      desc: 'Mencari stasiun MRT terdekat, bertanya jarak dan belokan jalan.',
      avatar: '👮‍♂️',
      partnerName: 'Polisi / Warga Lokal (路人)',
      steps: [
        {
          partnerSaid: '您好，需要帮助吗？',
          partnerPinyin: 'Nǐn hǎo, xūyào bāngzhù ma?',
          partnerMeaning: 'Halo, apakah ada yang bisa dibantu?',
          options: [
            { text: '打扰一下，请问最近的地铁站在哪里？', pinyin: 'Dǎrǎo yíxià, qǐngwèn zuì jìn de dìtiězhan zài nǎlǐ?', meaning: 'Permisi mengganggu, di manakah stasiun MRT terdekat?' },
            { text: '您好，请问去故宫博物院怎么走？', pinyin: 'Nǐn hǎo, qǐngwèn qù Gùgōng Bówùyuàn zěnme zǒu?', meaning: 'Halo, permisi bagaimana jalan menuju Museum Kota Terlarang?' }
          ]
        },
        {
          partnerSaid: '您顺着这条路往前走大约两百米，看到红绿灯往右转就是了。',
          partnerPinyin: 'Nín shùnzhe zhè tiáo lù wǎng qián zǒu dàyuē liǎngbǎi mǐ, kàndào hónglǜdēng wǎng yòu zhuǎn jiù shì le.',
          partnerMeaning: 'Anda jalan lurus ikuti jalan ini sekitar 200 meter, saat melihat lampu lalu lintas belok kanan.',
          options: [
            { text: '走路过去大约需要几分钟？', pinyin: 'Zǒulù guòqu dàyuē xūyào jǐ fēnzhōng?', meaning: 'Kira-kira butuh berapa menit jalan kaki ke sana?' },
            { text: '谢谢您，右转之后就能看到入口吗？', pinyin: 'Xièxie nín, yòu zhuǎn zhīhòu jiù néng kàndào rùkǒu ma?', meaning: 'Terima kasih, setelah belok kanan langsung terlihat pintu masuknya?' }
          ]
        }
      ]
    },
    shop: {
      title: '买东西 Belanja & Tawar Menawar',
      desc: 'Menanyakan harga suvenir, menawar dengan sopan, dan membayar.',
      avatar: '🛍️',
      partnerName: 'Penjual Toko (售货员)',
      steps: [
        {
          partnerSaid: '看看这件传统丝绸围巾，质量非常好！',
          partnerPinyin: 'Kànkan zhè jiàn chuántǒng sīchóu wéijīn, zhìliàng fēicháng hǎo!',
          partnerMeaning: 'Lihatlah syal sutra tradisional ini, kualitasnya sangat bagus!',
          options: [
            { text: '请问这件围巾多少钱一条？', pinyin: 'Qǐngwèn zhè jiàn wéijīn duōshao qián yì tiáo?', meaning: 'Permisi, berapa harga satu helai syal ini?' },
            { text: '有没有其他颜色的？', pinyin: 'Yǒu méiyǒu qítā yánsè de?', meaning: 'Apakah ada warna lain?' }
          ]
        },
        {
          partnerSaid: '原价一百八十块，今天给您优惠，一百五怎么样？',
          partnerPinyin: 'Yuánjià yībǎibāshí kuài, jīntiān gěi nín yōuhuì, yībǎiwǔ zěnmeyàng?',
          partnerMeaning: 'Harga aslinya 180 yuan, hari ini diskon untuk Anda, 150 yuan bagaimana?',
          options: [
            { text: '一百二十块可以吗？可以的话我就买两条。', pinyin: 'Yībǎirshí kuài kěyǐ ma? Kěyǐ de huà wǒ jiù mǎi liǎng tiáo.', meaning: 'Apakah boleh 120 yuan? Kalau boleh saya beli dua helai.' },
            { text: '太贵了，便宜一点吧，一百块行不行？', pinyin: 'Tài guì le, piányi yìdiǎn ba, yībǎi kuài xíng bu xíng?', meaning: 'Terlalu mahal, lebih murah sedikit ya, 100 yuan boleh tidak?' }
          ]
        }
      ]
    },
    hotel: {
      title: '酒店入住 Check-in Hotel',
      desc: 'Menunjukkan paspor, mengonfirmasi sarapan, dan meminta password WiFi.',
      avatar: '🏨',
      partnerName: 'Resepsionis Hotel (前台接待)',
      steps: [
        {
          partnerSaid: '您好，欢迎来到北京饭店！请问有预订吗？',
          partnerPinyin: 'Nǐn hǎo, huānyíng lái dào Běijīng Fàndiàn! Qǐngwèn yǒu yùdìng ma?',
          partnerMeaning: 'Halo, selamat datang di Hotel Beijing! Apakah ada reservasi?',
          options: [
            { text: '您好，我网上预订了一个大床房，名字叫张伟。', pinyin: 'Nǐn hǎo, wǒ wǎngshang yùdìng le yí gè dàchuángfáng, míngzi jiào Zhāng Wěi.', meaning: 'Halo, saya memesan kamar double bed secara online atas nama Zhang Wei.' },
            { text: '这是我的护照和预订确认单，请查一下。', pinyin: 'Zhè shì wǒ de hùzhào hé yùdìng quèrèndān, qǐng chá yíxià.', meaning: 'Ini paspor dan konfirmasi reservasi saya, tolong dicek.' }
          ]
        },
        {
          partnerSaid: '找到了，房间在八楼808。这是房卡，早餐时间是早上七点到九点半。',
          partnerPinyin: 'Zhǎodào le, fángjiān zài bālóu bābālíngbā. Zhè shì fángkǎ, zǎocān shíjiān shì zǎoshang qīdiǎn dào jiǔdiǎnbàn.',
          partnerMeaning: 'Sudah ditemukan, kamar di lantai 8 nomor 808. Ini kartu kuncinya, sarapan pukul 07.00 - 09.30.',
          options: [
            { text: '好的，请问房间里有免费无线网络 (Wi-Fi) 吗？', pinyin: 'Hǎo de, qǐngwèn fángjiān lǐ yǒu miǎnfèi wúxiàn wǎngluò (Wi-Fi) ma?', meaning: 'Baik, permisi apakah di kamar tersedia Wi-Fi gratis?' },
            { text: '非常感谢！请问电梯在哪里？', pinyin: 'Fēicháng gǎnxiè! Qǐngwèn diàntī zài nǎlǐ?', meaning: 'Terima kasih banyak! Permisi di mana letak liftnya?' }
          ]
        }
      ]
    }
  },

  renderSpeakingRoleplay(container) {
    const scId = this.roleplayScenarioId || 'resto';
    const scenario = this.roleplayScenarios[scId] || this.roleplayScenarios['resto'];
    const currentStep = scenario.steps[this.roleplayStep] || scenario.steps[0];
    const isFinished = (this.roleplayStep >= scenario.steps.length);

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #d1fae5; padding: 24px; box-shadow: var(--card-shadow); max-width: 780px; margin: 0 auto;">
        <!-- Top Scenario Selector -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 14px;">
          <div>
            <span class="role-badge" style="background: #e6faf7; color: #0d9488; font-weight: 800; font-size: 0.72rem;">SIMULASI ROLEPLAY PERCAKAPAN</span>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">${scenario.title}</h3>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${Object.keys(this.roleplayScenarios).map(k => `
              <button type="button" class="cerita-filter-pill ${scId === k ? 'active' : ''}" style="font-size: 0.74rem; padding: 4px 10px;" onclick="MandarinkuExtras.selectRoleplayScenario('${k}')">
                ${this.roleplayScenarios[k].title.split(' ')[0]} ${this.roleplayScenarios[k].title.split(' ')[1]}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Chat Dialogue Bubble Container -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; min-height: 220px;">
          ${!isFinished ? `
            <!-- NPC Partner Bubble -->
            <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #ffffff; border: 2px solid #2ec4b6; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                ${scenario.avatar}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 0.76rem; font-weight: 800; color: #0d9488; margin-bottom: 4px;">
                  ${scenario.partnerName}
                </div>
                <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 0 16px 16px 16px; padding: 14px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                  <div style="font-family: var(--font-chinese, serif); font-size: 1.35rem; font-weight: 900; color: #0f172a;">
                    ${currentStep.partnerSaid}
                  </div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: #ea580c; margin-top: 4px;">
                    ${currentStep.partnerPinyin}
                  </div>
                  <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
                    "${currentStep.partnerMeaning}"
                  </div>
                  <button type="button" class="btn-learn-outline" style="padding: 3px 10px; font-size: 0.72rem; margin-top: 8px; border-color: #2ec4b6; color: #0d9488;" onclick="if(typeof speakMandarin==='function') speakMandarin('${currentStep.partnerSaid.replace(/'/g, "\\'")}', 0.85)">
                    🔊 Putar Suara Lawan Bicara
                  </button>
                </div>
              </div>
            </div>

            <!-- User Response Options -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #475569; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <span>🗣️</span> <span>Pilih Jawaban / Respon Anda:</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${currentStep.options.map((opt, oIdx) => `
                  <button type="button" onclick="MandarinkuExtras.chooseRoleplayOption(${oIdx})" style="text-align: left; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #cbd5e1; background: #ffffff; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#2ec4b6'; this.style.background='#f0fdf9';" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#ffffff';">
                    <div style="font-family: var(--font-chinese, serif); font-size: 1.15rem; font-weight: 800; color: #0f172a;">
                      ${opt.text}
                    </div>
                    <div style="font-size: 0.82rem; font-weight: 700; color: #ea580c; margin-top: 2px;">
                      ${opt.pinyin}
                    </div>
                    <div style="font-size: 0.76rem; color: #64748b; margin-top: 2px;">
                      = ${opt.meaning}
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <!-- Skenario Selesai -->
            <div style="text-align: center; padding: 24px 16px;">
              <div style="font-size: 2.8rem; margin-bottom: 8px;">🎉 🏆</div>
              <h4 style="font-size: 1.25rem; font-weight: 900; color: #065f46; margin: 0 0 6px 0;">
                Selamat! Anda Telah Menyelesaikan Skenario ${scenario.title} (+30 EXP)
              </h4>
              <p style="font-size: 0.85rem; color: #047857; margin-bottom: 16px;">
                Percakapan berlangsung lancar dan natural seperti di dunia nyata!
              </p>
              <div style="display: flex; justify-content: center; gap: 10px;">
                <button type="button" class="btn-primary-sakura" style="background: #0d9488; padding: 10px 22px; font-size: 0.85rem; margin: 0;" onclick="MandarinkuExtras.resetRoleplayScenario()">
                  🔄 Ulangi Skenario Ini
                </button>
              </div>
            </div>
          `}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #64748b;">
          <span>Langkah Percakapan: ${Math.min(this.roleplayStep + 1, scenario.steps.length)} / ${scenario.steps.length}</span>
          <button type="button" style="background: none; border: none; color: #ea580c; font-weight: 800; cursor: pointer;" onclick="MandarinkuExtras.resetRoleplayScenario()">
            Mulai dari Awal ↺
          </button>
        </div>
      </div>
    `;

    // Auto play audio of NPC dialogue
    if (!isFinished && typeof speakMandarin === 'function') {
      setTimeout(() => speakMandarin(currentStep.partnerSaid, 0.85), 300);
    }
  },

  selectRoleplayScenario(id) {
    this.roleplayScenarioId = id;
    this.roleplayStep = 0;
    const container = document.getElementById('speaking-content-container');
    if (container) this.renderSpeakingRoleplay(container);
  },

  chooseRoleplayOption(optIndex) {
    const scId = this.roleplayScenarioId || 'resto';
    const scenario = this.roleplayScenarios[scId];
    const step = scenario.steps[this.roleplayStep];
    const chosen = step.options[optIndex];

    if (chosen && typeof speakMandarin === 'function') {
      speakMandarin(chosen.text, 0.85);
    }
    if (typeof recordUserActivity === 'function') {
      recordUserActivity('speaking', 10, 2, `roleplay_${scId}_${this.roleplayStep}`, 1);
    }

    this.roleplayStep++;
    const container = document.getElementById('speaking-content-container');
    if (container) {
      setTimeout(() => this.renderSpeakingRoleplay(container), 800);
    }
  },

  resetRoleplayScenario() {
    this.roleplayStep = 0;
    const container = document.getElementById('speaking-content-container');
    if (container) this.renderSpeakingRoleplay(container);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.MandarinkuExtras) {
    window.MandarinkuExtras.init();
  }
});

