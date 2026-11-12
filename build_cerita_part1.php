<?php
/**
 * Script untuk membuat database komprehensif kumpulan cerita Mandarin HSK 1 - 6
 * Masing-masing HSK memiliki beberapa cerita (3 cerita per level = total 18 cerita panjang)
 * Masing-masing cerita memiliki tepat 5 pertanyaan kuis interaktif dengan pembahasan lengkap.
 */

$ceritaList = [
  // ==========================================
  // HSK 1 - CERITA 1
  // ==========================================
  [
    "id" => "cerita-hsk-1-1",
    "level" => 1,
    "levelName" => "HSK 1 (Pemula)",
    "badgeColor" => "#059669",
    "badgeBg" => "#ecfdf5",
    "theme" => "Kehidupan Sehari-hari & Persahabatan (日常生活与友谊)",
    "titleCn" => "大明的一天和他的小猫",
    "titlePinyin" => "Dàmíng de Yì Tiān hé Tā de Xiǎomāo",
    "titleId" => "Sehari dalam Hidup Daming dan Anak Kucingnya",
    "estimatedMinutes" => 5,
    "summary" => "Cerita mengenai rutinitas harian Daming sebagai mahasiswa di Beijing, kehangatan belajar bersama sahabatnya David, dan kucing kesayangannya Huahua.",
    "paragraphs" => [
      [
        "cn" => "大明是一个二十岁的中国大学生，他住在北京。他每天早上七点起床，七点半喝一杯热茶，吃一个鸡蛋和两个包子。大明非常喜欢学习汉语和英语，他的学校很大，老师和同学都对他很好。",
        "pinyin" => "Dàmíng shì yí gè èrshí suì de Zhōngguó dàxuéshēng, tā zhù zài Běijīng. Tā měitiān zǎoshang qī diǎn qǐchuáng, qī diǎn bàn hē yì bēi rè chá, chī yí gè jīdàn hé liǎng gè bāozi. Dàmíng fēicháng xǐhuan xuéxí Hànyǔ hé Yīngyǔ, tā de xuéxiào hěn dà, lǎoshī hé tóngxué dōu duì tā hěn hǎo.",
        "id" => "Daming adalah seorang mahasiswa Tiongkok berusia 20 tahun yang tinggal di Beijing. Setiap pagi ia bangun pukul 07.00, minum secangkir teh hangat pada pukul 07.30, serta menyantap sebutir telur dan dua buah bakpao. Daming sangat suka belajar bahasa Mandarin dan bahasa Inggris, kampusnya sangat luas, serta para guru dan teman sekelas semuanya sangat baik kepadanya."
      ],
      [
        "cn" => "中午十二点，大明和好朋友大卫在学校的饭馆吃午饭。大卫是美国人，他想学汉语，所以大明教大卫说汉字。大卫问大明：“你今天下午有空儿吗？我们一起去商店买水和苹果吧。”大明笑着回答：“好啊，我也想买几本书和一个新杯子。”",
        "pinyin" => "Zhōngwǔ shí'èr diǎn, Dàmíng hé hǎo péngyou Dàwèi zài xuéxiào de fànguǎn chī wǔfàn. Dàwèi shì Měiguó rén, tā xiǎng xué Hànyǔ, suǒyǐ Dàmíng jiāo Dàwèi shuō hànzì. Dàwèi wèn Dàmíng: “Nǐ jīntiān xiàwǔ yǒu kòngr ma? Wǒmen yìqǐ qù shāngdiàn mǎi shuǐ hé píngguǒ ba.” Dàmíng xiàozhe huídá: “Hǎo a, wǒ yě xiǎng mǎi jǐ běn shū hé yí gè xīn bēizi.”",
        "id" => "Pukul 12 siang, Daming dan sahabatnya David makan siang di kantin kampus. David adalah orang Amerika yang ingin belajar bahasa Mandarin, sehingga Daming mengajari David mengucapkan karakter Mandarin. David bertanya kepada Daming: 'Apakah siang ini kamu ada waktu luang? Mari kita bersama pergi ke toko membeli air dan buah apel.' Daming tersenyum menjawab: 'Baguslah, saya juga ingin membeli beberapa buku dan sebuah cangkir baru.'"
      ],
      [
        "cn" => "下午四点，大明坐公共汽车回家。在家里的桌子下面，有一只白色的小猫，名字叫“花花”。花花生病了吗？没有，它只是太累了，正在睡觉。大明轻轻地走过去，摸了摸小猫的头。小猫睁开漂亮的大眼睛，看着大明高兴地叫着。大明给花花吃了一条小鱼，然后坐在椅子上看书。大明说：“今天的天气很冷，但是我的心里很温暖，因为有爱我的家人、朋友和可爱的小猫。”",
        "pinyin" => "Xiàwǔ sì diǎn, Dàmíng zuò gōnggòng qìchē huí jiā. Zài jiā lǐ de zhuōzi xiàmiàn, yǒu yì zhī báisè de xiǎomāo, míngzi jiào “Huāhua”. Huāhua shēngbìng le ma? Méiyǒu, tā zhǐshì tài lèi le, zhèngzài shuìjiào. Dàmíng qīngqīng de zǒu guòqù, mō le mō xiǎomāo de tóu. Xiǎomāo zhēngkāi piàoliang de dà yǎnjing, kànzhe Dàmíng gāoxìng de jiàozhe. Dàmíng gěi Huāhua chī le yì tiáo xiǎoyú, ránhòu zuò zài yǐzi shang kàn shū. Dàmíng shuō: “Jīntiān de tiānqì hěn lěng, dànshì wǒ de xīnlǐ hěn wēnnuǎn, yīnwèi yǒu ài wǒ de jiārén, péngyou hé kě'ài de xiǎomāo.”",
        "id" => "Pukul 4 sore, Daming naik bus pulang ke rumah. Di bawah meja rumahnya, ada seekor anak kucing berwarna putih bernama 'Huahua'. Apakah Huahua sedang sakit? Tidak, ia hanya terlalu lelah dan sedang tertidur pulas. Daming melangkah pelan mendekat dan mengelus kepala kucing kecil itu. Kucing itu membuka mata besarnya yang indah, lalu mengeong gembira menatap Daming. Daming memberi Huahua seekor ikan kecil, lalu duduk di kursi membaca buku. Daming berkata: 'Cuaca hari ini sangat dingin, namun di dalam hatiku sangat hangat, karena ada keluarga, sahabat, dan anak kucing lucu yang mencintaiku.'"
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "起床", "pinyin" => "qǐchuáng", "meaning" => "bangun tidur"],
      ["hanzi" => "大学生", "pinyin" => "dàxuéshēng", "meaning" => "mahasiswa"],
      ["hanzi" => "热茶", "pinyin" => "rè chá", "meaning" => "teh hangat / panas"],
      ["hanzi" => "一起", "pinyin" => "yìqǐ", "meaning" => "bersama-sama"],
      ["hanzi" => "商店", "pinyin" => "shāngdiàn", "meaning" => "toko"],
      ["hanzi" => "温暖", "pinyin" => "wēnnuǎn", "meaning" => "hangat"],
      ["hanzi" => "公共汽车", "pinyin" => "gōnggòng qìchē", "meaning" => "bus umum"]

    ],
    "grammarNotes" => [
      [
        "title" => "1. Kata Kerja Keberadaan & Kepemilikan '在' (zài) dan '有' (yǒu)",
        "formula" => "Lokasi: Subjek + 在 + Tempat | Kepemilikan: Tempat/Subjek + 有 + Objek",
        "explanation" => "'他住在北京' (Dia tinggal di Beijing) dan '在桌子下面有一只小猫' (Di bawah meja ada seekor anak kucing). '在' menunjukkan posisi, sedangkan '有' menunjukkan keberadaan objek.",
        "exampleInStory" => "在学校的饭馆吃午饭 (Makan siang di kantin sekolah)."
      ],
      [
        "title" => "2. Penggunaan Kata Bilangan & Kata Penggolong (Measure Words / 量词)",
        "formula" => "Angka + Kata Penggolong (量词) + Kata Benda",
        "explanation" => "Mandarin mewajibkan kata penggolong: '一杯' (segelas), '一个' (sebutir/seorang), '两只/一只' (seekor binatang), '一条' (seekor ikan). Angka 2 sebelum kata penggolong dibaca 'liǎng' (两), bukan 'èr' (二).",
        "exampleInStory" => "一个鸡蛋和两个包子 (Sebutir telur dan dua bakpao)."
      ],
      [
        "title" => "3. Partikel Kalimat Tanya '吗' (ma) & Partikel Saran '吧' (ba)",
        "formula" => "Kalimat + 吗？ (Pertanyaan Ya/Tidak) | Saran: Ajakan + 吧 (Mari/Ayo)",
        "explanation" => "'花花生病了吗？' menanyakan kondisi Ya/Tidak. Sedangkan '我们一起去商店买水吧' menggunakan '吧' untuk menyarankan ajakan dengan sopan.",
        "exampleInStory" => "我们一起去商店买水和苹果吧。"
      ]
    ],
    "questions" => [
      [
        "question" => "大明每天早上几点起床？(Pukul berapa Daming bangun setiap pagi?)",
        "options" => ["六点半 (06.30)", "七点 (07.00)", "七点半 (07.30)", "八点 (08.00)"],
        "answer" => 1,
        "explanation" => "Di paragraf pertama disebutkan: '他每天早上七点起床' (Dia setiap pagi bangun jam 7)."
      ],
      [
        "question" => "大卫是哪国人？(David berasal dari negara mana?)",
        "options" => ["中国人 (Orang Tiongkok)", "美国人 (Orang Amerika)", "英国人 (Orang Inggris)", "日本人 (Orang Jepang)"],
        "answer" => 1,
        "explanation" => "Paragraf kedua menyebutkan: '大卫是美国人，他想学汉语' (David adalah orang Amerika)."
      ],
      [
        "question" => "大卫想和大明一起去商店买什么？(Apa yang ingin dibeli David dan Daming di toko?)",
        "options" => ["买面包和牛奶", "买水和苹果", "买小猫和鱼", "买衣服和鞋子"],
        "answer" => 1,
        "explanation" => "David mengajak: '我们一起去商店买水和苹果吧' (Mari kita bersama ke toko membeli air dan buah apel)."
      ],
      [
        "question" => "花花在桌子下面做什么？(Apa yang sedang dilakukan Huahua di bawah meja?)",
        "options" => ["它在吃小鱼", "它生病在哭", "它在睡觉", "它在喝水"],
        "answer" => 2,
        "explanation" => "Paragraf ketiga menjelaskan bahwa Huahua tidak sakit: '它只是太累了，正在睡觉' (ia hanya lelah dan sedang tidur)."
      ],
      [
        "question" => "为什么大明觉得心里很温暖？(Mengapa Daming merasa hatinya sangat hangat?)",
        "options" => ["因为北京的天气很热", "因为他喝了很多热茶", "因为有爱他的家人、朋友和可爱的小猫", "因为他买了新杯子"],
        "answer" => 2,
        "explanation" => "Kalimat penutup menegaskan: '因为有爱我的家人、朋友和可爱的小猫' (karena ada keluarga, teman, dan kucing lucu yang mencintaiku)."
      ]
    ]
  ],

  // ==========================================
  // HSK 1 - CERITA 2
  // ==========================================
  [
    "id" => "cerita-hsk-1-2",
    "level" => 1,
    "levelName" => "HSK 1 (Pemula)",
    "badgeColor" => "#059669",
    "badgeBg" => "#ecfdf5",
    "theme" => "Keluarga & Kegiatan di Rumah (家庭与周末时光)",
    "titleCn" => "星期天，王老师的一家人",
    "titlePinyin" => "Xīngqītiān, Wáng Lǎoshī de Yì Jiā Rén",
    "titleId" => "Hari Minggu, Kebersamaan Keluarga Guru Wang",
    "estimatedMinutes" => 5,
    "summary" => "Cerita tentang kegiatan akhir pekan Guru Wang bersama istri dan putrinya memasak mie Tiongkok, minum teh, dan belajar berbicara Mandarin di rumah.",
    "paragraphs" => [
      [
        "cn" => "王老师是一位汉语老师，今年四十五岁。王老师的家很大，家里有四口人：王老师、他的妻子、一个女儿和一只小狗。王老师的妻子是医院的医生，工作很忙。星期天，他们全家人都不去上班，也不去学校，大家都在家里休息。",
        "pinyin" => "Wáng lǎoshī shì yí wèi Hànyǔ lǎoshī, jīnnián sìshíwǔ suì. Wáng lǎoshī de jiā hěn dà, jiā lǐ yǒu sì kǒu rén: Wáng lǎoshī, tā de qīzi, yí gè nǚ'ér hé yì zhī xiǎogǒu. Wáng lǎoshī de qīzi shì yīyuàn de yīshēng, gōngzuò hěn máng. Xīngqītiān, tāmen quán jiā rén dōu bú qù shàngbān, yě bú qù xuéxiào, dàjiā dōu zài jiā lǐ xiūxi.",
        "id" => "Guru Wang adalah seorang guru bahasa Mandarin, berusia 45 tahun tahun ini. Rumah Guru Wang sangat besar, di rumahnya ada empat anggota keluarga: Guru Wang, istrinya, seorang putri, dan seekor anjing kecil. Istri Guru Wang adalah seorang dokter di rumah sakit, pekerjaannya sangat sibuk. Pada hari Minggu, seluruh keluarga mereka tidak pergi bekerja dan tidak ke sekolah, semua orang beristirahat di rumah."
      ],
      [
        "cn" => "上午十点，王老师在厨房做中国菜。他会做很好吃的中国面条。女儿小丽今年八岁，在小学读书。小丽走到厨房对爸爸说：“爸爸，我能帮您洗菜吗？”王老师高兴地说：“好孩子，谢谢你！洗完菜后，爸爸教你写汉字。”小丽开心地笑了。妈妈坐在客厅的沙发上喝热茶、看书。小狗在妈妈的脚边高兴地跑来跑去。",
        "pinyin" => "Shàngwǔ shí diǎn, Wáng lǎoshī zài chúfáng zuò Zhōngguó cài. Tā huì zuò hěn hǎochī de Zhōngguó miàntiáo. Nǚ'ér Xiǎolì jīnnián bā suì, zài xiǎoxué dú shū. Xiǎolì zǒu dào chúfáng duì bàba shuō: “Bàba, wǒ néng bāng nín xǐ cài ma?” Wáng lǎoshī gāoxìng de shuō: “Hǎo háizi, xièxie nǐ! Xǐ wán cài hòu, bàba jiāo nǐ xiě hànzì.” Xiǎolì kāixīn de xiào le. Māma zuò zài kètīng de shāfā shang hē rè chá, kàn shū. Xiǎogǒu zài māma de jiǎobiān gāoxìng de pǎo lái pǎo qù.",
        "id" => "Pukul 10 pagi, Guru Wang memasak masakan Tiongkok di dapur. Ia bisa membuat mie Tiongkok yang sangat lezat. Putrinya Xiaoli tahun ini berusia 8 tahun dan bersekolah di SD. Xiaoli berjalan ke dapur dan berkata kepada ayahnya: 'Ayah, bisakah aku membantu Anda mencuci sayur?' Guru Wang dengan gembira menjawab: 'Anak baik, terima kasih! Setelah mencuci sayur, Ayah akan mengajarimu menulis karakter Hanzi.' Xiaoli tersenyum ceria. Ibu duduk di sofa ruang tamu minum teh hangat dan membaca buku. Anjing kecil berlari-lari gembira di dekat kaki ibu."
      ],
      [
        "cn" => "中午十二点半，桌子上摆满了热气腾腾的面条、米饭和水果。全家人一起吃午饭，大家一边吃一边说话。小丽说：“爸爸做的面条真好吃，比饭馆的面条还要香！”妈妈笑着点头。吃完饭后，王老师拿着毛笔教小丽写“人”、“大”和“天”三个汉字。王老师说：“学习汉字很有意思，一家人在一起是最幸福的事。”",
        "pinyin" => "Zhōngwǔ shí'èr diǎn bàn, zhuōzi shang bǎimǎn le rèqì téngténg de miàntiáo, mǐfàn hé shuǐguǒ. Quán jiā rén yìqǐ chī wǔfàn, dàjiā yìbiān chī yìbiān shuōhuà. Xiǎolì shuō: “Bàba zuò de miàntiáo zhēn hǎochī, bǐ fànguǎn de miàntiáo hái yào xiāng!” Māma xiàozhe diǎntóu. Chī wán fàn hòu, Wáng lǎoshī názhe máobǐ jiāo Xiǎolì xiě “rén”, “dà” hé “tiān” sān gè hànzì. Wáng lǎoshī shuō: “Xuéxí hànzì hěn yǒu yìsi, yì jiā rén zài yìqǐ shì zuì xìngfú de shì.”",
        "id" => "Pukul 12.30 siang, di atas meja telah tersaji mie panas mengepul, nasi, dan aneka buah-buahan. Seluruh keluarga makan siang bersama, sambil makan sambil berbincang-bincang. Xiaoli berkata: 'Mie buatan Ayah sungguh lezat, bahkan lebih harum daripada mie di restoran!' Ibu tersenyum mengangguk. Setelah selesai makan, Guru Wang memegang kuas mengajari Xiaoli menulis tiga karakter Hanzi: 'Ren' (orang), 'Da' (besar), dan 'Tian' (langit). Guru Wang berujar: 'Belajar karakter Hanzi sangat menarik, dan sekeluarga berkumpul bersama adalah hal yang paling membahagiakan.'"
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "口 (人)", "pinyin" => "kǒu", "meaning" => "kata penggolong untuk anggota keluarga"],
      ["hanzi" => "妻子", "pinyin" => "qīzi", "meaning" => "istri"],
      ["hanzi" => "面条", "pinyin" => "miàntiáo", "meaning" => "mie"],
      ["hanzi" => "做菜", "pinyin" => "zuò cài", "meaning" => "memasak makanan"],
      ["hanzi" => "帮", "pinyin" => "bāng", "meaning" => "membantu"],
      ["hanzi" => "幸福", "pinyin" => "xìngfú", "meaning" => "bahagia / keberkahan"]
    ],
    "grammarNotes" => [
      [
        "title" => "1. Kata Kerja Modal Kemampuan & Izin: '会' (huì) dan '能' (néng)",
        "formula" => "Subjek + 会/能 + Kata Kerja + Objek",
        "explanation" => "'会' menyatakan keahlian yang dipelajari (王老师会做面条 = Guru Wang bisa membuat mie). Sedangkan '能' menyatakan izin atau kesanggupan situasional (我能帮您洗菜吗？ = Bolehkah/bisakah saya membantu mencuci sayur?).",
        "exampleInStory" => "他会做很好吃的中国面条；我能帮您洗菜吗？"
      ],
      [
        "title" => "2. Penggunaan Kata Penggolong Anggota Keluarga '口' (kǒu)",
        "formula" => "Angka + 口 + 人",
        "explanation" => "Untuk menghitung jumlah anggota keluarga dalam satu rumah tangga, bahasa Mandarin secara khusus menggunakan kata penggolong '口' (kǒu).",
        "exampleInStory" => "家里有四口人 (Di rumah ada 4 orang anggota keluarga)."
      ],
      [
        "title" => "3. Pelengkap Hasil Selesai: Kata Kerja + '完' (wán)",
        "formula" => "Kata Kerja + 完 + (Objek) + 以后/后",
        "explanation" => "Menyatakan bahwa suatu aktivitas telah rampung dikerjakan (洗完菜 = selesai mencuci sayur; 吃完饭 = selesai makan).",
        "exampleInStory" => "洗完菜后，爸爸教你写汉字；吃完饭后，王老师教小丽写字。"
      ]
    ],
    "questions" => [
      [
        "question" => "王老师家里一共有几口人？(Ada berapa orang anggota keluarga di rumah Guru Wang?)",
        "options" => ["三口人 (3 orang)", "四口人 (4 orang)", "五口人 (5 orang)", "六口人 (6 orang)"],
        "answer" => 1,
        "explanation" => "Teks paragraf pertama menyebutkan: '家里有四口人：王老师、他的妻子、一个女儿和一只小狗' (empat orang)."
      ],
      [
        "question" => "王老师的妻子在什么地方工作？(Di mana istri Guru Wang bekerja?)",
        "options" => ["在学校当老师", "在商店卖苹果", "在医院当医生", "在饭馆做饭"],
        "answer" => 2,
        "explanation" => "Disebutkan bahwa istri Guru Wang adalah dokter di rumah sakit: '王老师的妻子是医院的医生'."
      ],
      [
        "question" => "星期天上午，小丽主动帮爸爸做了什么？(Pada Minggu pagi, apa yang dibantu Xiaoli kepada ayahnya?)",
        "options" => ["洗衣服", "洗菜", "打扫客厅", "喂小狗"],
        "answer" => 1,
        "explanation" => "Xiaoli bertanya: '爸爸，我能帮您洗菜吗？' (Ayah, bolehkah aku membantu mencuci sayur?)."
      ],
      [
        "question" => "吃完饭后，王老师教小丽写了哪三个汉字？(Setelah makan, tiga karakter Hanzi apa yang diajarkan Guru Wang kepada Xiaoli?)",
        "options" => ["“一”、“二”、“三”", "“人”、“大”、“天”", "“猫”、“狗”、“鸟”", "“水”、“火”、“木”"],
        "answer" => 1,
        "explanation" => "Paragraf ketiga menyatakan: '王老师拿着毛笔教小丽写“人”、“大”和“天”三个汉字'."
      ],
      [
        "question" => "王老师认为什么事情是最幸福的？(Apa yang dianggap paling membahagiakan oleh Guru Wang?)",
        "options" => ["去饭馆吃大餐", "买很多新衣服", "一家人在一起", "看一整天电视"],
        "answer" => 2,
        "explanation" => "Di akhir cerita Guru Wang berucap: '一家人在一起是最幸福的事' (sekeluarga berkumpul bersama adalah hal paling membahagiakan)."
      ]
    ]
  ],

  // ==========================================
  // HSK 1 - CERITA 3
  // ==========================================
  [
    "id" => "cerita-hsk-1-3",
    "level" => 1,
    "levelName" => "HSK 1 (Pemula)",
    "badgeColor" => "#059669",
    "badgeBg" => "#ecfdf5",
    "theme" => "Membeli Buah & Belajar Angka (在水果店买水果)",
    "titleCn" => "小华去水果店买苹果",
    "titlePinyin" => "Xiǎohuá Qù Shuǐguǒdiàn Mǎi Píngguǒ",
    "titleId" => "Xiaohua Pergi ke Toko Buah Membeli Apel",
    "estimatedMinutes" => 5,
    "summary" => "Cerita percakapan praktis Xiaohua berbelanja di toko buah, menanyakan harga dengan '多少钱', dan belajar angka serta satuan mata uang Yuan.",
    "paragraphs" => [
      [
        "cn" => "今天下午三点，天气很好，天空很蓝。妈妈对小华说：“小华，家里没有水果了，你想吃水果吗？”小华高兴地说：“我想吃红色的苹果和黄色的香蕉！”妈妈拿出五十块钱给小华，笑着说：“好的，你去学校前面的水果店买两斤苹果和一些香蕉吧。”小华接过钱，高高兴兴地穿上鞋子出门了。",
        "pinyin" => "Jīntiān xiàwǔ sān diǎn, tiānqì hěn hǎo, tiānkōng hěn lán. Māma duì Xiǎohuá shuō: “Xiǎohuá, jiā lǐ méiyǒu shuǐguǒ le, nǐ xiǎng chī shuǐguǒ ma?” Xiǎohuá gāoxìng de shuō: “Wǒ xiǎng chī hóngsè de píngguǒ hé huángsè de xiāngjiāo!” Māma ná chū wǔshí kuài qián gěi Xiǎohuá, xiàozhe shuō: “Hǎo de, nǐ qù xuéxiào qiánmiàn de shuǐguǒdiàn mǎi liǎng jīn píngguǒ hé yìxiē xiāngjiāo ba.” Xiǎohuá jiē guò qián, gāogāoxìngxìng de chuān shàng xiézi chū mén le.",
        "id" => "Sore ini pukul 3, cuaca sangat cerah, langit begitu biru. Ibu berkata kepada Xiaohua: 'Xiaohua, di rumah sudah tidak ada buah lagi, apakah kamu ingin makan buah?' Xiaohua dengan riang menjawab: 'Saya ingin makan apel merah dan pisang kuning!' Ibu mengeluarkan uang 50 Yuan dan memberikannya kepada Xiaohua sambil tersenyum: 'Baiklah, pergilah ke toko buah di depan sekolah untuk membeli dua kati apel dan beberapa buah pisang.' Xiaohua menerima uang itu, dengan sangat riang mengenakan sepatu dan melangkah keluar rumah."
      ],
      [
        "cn" => "水果店里有很多新鲜的水果：有大大的西瓜、红红的苹果、甜甜的草莓和漂亮的葡萄。水果店的老板是一位很客气的老爷爷。小华礼貌地对老爷爷说：“您好！请问苹果多少钱一斤？”老爷爷笑着回答：“小朋友，苹果五块钱一斤，很甜很好吃。”小华说：“那我要两斤苹果。请问香蕉多少钱？”老爷爷说：“香蕉三块钱一斤。”小华买了三斤香蕉。",
        "pinyin" => "Shuǐguǒdiàn lǐ yǒu hěn duō xīnxian de shuǐguǒ: yǒu dàdà de xīguā, hónghóng de píngguǒ, tiántián de cǎoméi hé piàoliang de pútáo. Shuǐguǒdiàn de lǎobǎn shì yí wèi hěn kèqi de lǎoyéye. Xiǎohuá lǐmào de duì lǎoyéye shuō: “Nín hǎo! Qǐngwèn píngguǒ duōshao qián yì jīn?” Lǎoyéye xiàozhe huídá: “Xiǎopéngyou, píngguǒ wǔ kuài qián yì jīn, hěn tián hěn hǎochī.” Xiǎohuá shuō: “Nà wǒ yào liǎng jīn píngguǒ. Qǐngwèn xiāngjiāo duōshao qián?” Lǎoyéye shuō: “Xiāngjiāo sān kuài qián yì jīn.” Xiǎohuá mǎi le sān jīn xiāngjiāo.",
        "id" => "Di dalam toko buah ada sangat banyak buah segar: ada semangka besar, apel merah merona, stroberi manis, dan anggur yang cantik. Pemilik toko buah adalah seorang kakek tua yang sangat ramah. Xiaohua dengan sopan berkata kepada sang kakek: 'Halo Kakek! Numpang tanya, berapa harga apel sekati (setengah kilogram)?' Kakek tersenyum menjawab: 'Anak pintar, apel lima Yuan sekati, sangat manis dan lezat.' Xiaohua berkata: 'Kalau begitu saya mau dua kati apel. Berapa harga pisangnya?' Kakek menjawab: 'Pisang tiga Yuan sekati.' Xiaohua pun membeli tiga kati pisang."
      ],
      [
        "cn" => "小华在心里算了一下：两斤苹果是十块钱，三斤香蕉是九块钱，一共是十九块钱。小华把五十块钱给老爷爷，老爷爷找给小华三十一块钱。老爷爷夸奖小华说：“你真是一个聪明懂礼貌的好孩子！”小华拿着水果开心地跑回家。回到家，妈妈把洗干净的水果放在桌子上，小华吃着甜甜的苹果，心里非常快乐。",
        "pinyin" => "Xiǎohuá zài xīnlǐ suàn le yíxià: liǎng jīn píngguǒ shì shí kuài qián, sān jīn xiāngjiāo shì jiǔ kuài qián, yígòng shì shíjiǔ kuài qián. Xiǎohuá bǎ wǔshí kuài qián gěi lǎoyéye, lǎoyéye zhǎo gěi Xiǎohuá sānshíyī kuài qián. Lǎoyéye kuājiǎng Xiǎohuá shuō: “Nǐ zhēn shì yí gè cōngming dǒng lǐmào de hǎo háizi!” Xiǎohuá názhe shuǐguǒ kāixīn de pǎo huí jiā. Huí dào jiā, māma bǎ xǐ gānjìng de shuǐguǒ fàng zài zhuōzi shang, Xiǎohuá chīzhe tiántián de píngguǒ, xīnlǐ fēicháng kuàilè.",
        "id" => "Xiaohua berhitung di dalam hatinya: dua kati apel seharga 10 Yuan, tiga kati pisang seharga 9 Yuan, jumlah totalnya adalah 19 Yuan. Xiaohua menyerahkan uang 50 Yuan kepada kakek, dan kakek memberikan kembalian 31 Yuan kepada Xiaohua. Kakek memuji Xiaohua: 'Kamu sungguh anak yang cerdas dan berakhlak sopan!' Xiaohua menenteng buah-buahan dan berlari pulang dengan riang. Setibanya di rumah, ibu menaruh buah yang telah dicuci bersih di atas meja, dan Xiaohua menikmati apel manis itu dengan hati yang amat gembira."
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "多少钱", "pinyin" => "duōshao qián", "meaning" => "berapa harganya"],
      ["hanzi" => "斤", "pinyin" => "jīn", "meaning" => "kati (satuan berat Tiongkok = 500 gram)"],
      ["hanzi" => "块 (钱)", "pinyin" => "kuài", "meaning" => "Yuan (satuan uang lisan Tiongkok)"],
      ["hanzi" => "找 (钱)", "pinyin" => "zhǎo", "meaning" => "memberi uang kembalian"],
      ["hanzi" => "一共", "pinyin" => "yígòng", "meaning" => "total / secara keseluruhan"],
      ["hanzi" => "客气", "pinyin" => "kèqi", "meaning" => "ramah / sopan santun"]
    ],
    "grammarNotes" => [
      [
        "title" => "1. Menanyakan Harga Barang: '多少钱' (duōshao qián)",
        "formula" => "Nama Benda + 多少钱 + (Satuan/Kata Penggolong)？",
        "explanation" => "Rumus standar menanyakan harga di pasar atau toko: '苹果多少钱一斤？' (Berapa harga apel per kati?).",
        "exampleInStory" => "请问苹果多少钱一斤？请问香蕉多少钱？"
      ],
      [
        "title" => "2. Penggunaan Kata Keterangan Jumlah Total: '一共' (yígòng)",
        "formula" => "Subjek/Benda + 一共 + 是/有 + Angka + Satuan",
        "explanation" => "Digunakan untuk menjumlahkan total harga, orang, atau barang.",
        "exampleInStory" => "一共是十九块钱 (Total semuanya adalah 19 Yuan)."
      ],
      [
        "title" => "3. Kata Bantu Arah & Posisi Depan: '……前 / 前面' (qiánmiàn)",
        "formula" => "Tempat / Objek Acuan + 前面 (di depan...)",
        "explanation" => "Menyatakan posisi arah di sebelah depan suatu tempat.",
        "exampleInStory" => "学校前面的水果店 (Toko buah di depan sekolah)."
      ]
    ],
    "questions" => [
      [
        "question" => "妈妈给了小华多少钱去买水果？(Berapa uang yang diberikan ibu kepada Xiaohua untuk membeli buah?)",
        "options" => ["二十块钱 (20 Yuan)", "三十块钱 (30 Yuan)", "五十块钱 (50 Yuan)", "一百块钱 (100 Yuan)"],
        "answer" => 2,
        "explanation" => "Teks paragraf pertama menyebutkan: '妈妈拿出五十块钱给小华' (Ibu mengeluarkan uang 50 Yuan)."
      ],
      [
        "question" => "水果店的苹果多少钱一斤？(Berapa harga apel sekati di toko buah?)",
        "options" => ["三块钱一斤", "五块钱一斤", "八块钱一斤", "十块钱一斤"],
        "answer" => 1,
        "explanation" => "Kakek penjual buah mengatakan: '苹果五块钱一斤，很甜很好吃' (Apel 5 Yuan sekati)."
      ],
      [
        "question" => "小华一共买了多少斤香蕉？(Berapa kati pisang yang dibeli Xiaohua?)",
        "options" => ["一斤", "两斤", "三斤", "五斤"],
        "answer" => 2,
        "explanation" => "Paragraf kedua menyatakan: '小华买了三斤香蕉' (Xiaohua membeli 3 kati pisang)."
      ],
      [
        "question" => "两斤苹果和三斤香蕉一共是多少钱？(Berapa harga total 2 kati apel dan 3 kati pisang?)",
        "options" => ["十五块钱", "十九块钱", "二十块钱", "三十一块钱"],
        "answer" => 1,
        "explanation" => "Perhitungan Xiaohua: 2 kati apel (10 Yuan) + 3 kati pisang (9 Yuan) = 19 Yuan ('一共是十九块钱')."
      ],
      [
        "question" => "老爷爷找给了小华多少钱？(Berapa uang kembalian yang diberikan kakek kepada Xiaohua?)",
        "options" => ["十块钱", "十九块钱", "三十一块钱", "五十块钱"],
        "answer" => 2,
        "explanation" => "Dari 50 Yuan dikurangi 19 Yuan: '老爷爷找给小华三十一块钱' (Kakek mengembalikan 31 Yuan)."
      ]
    ]
  ],

  // ==========================================
  // HSK 2 - CERITA 1
  // ==========================================
  [
    "id" => "cerita-hsk-2-1",
    "level" => 2,
    "levelName" => "HSK 2 (Dasar Lanjutan)",
    "badgeColor" => "#0284c7",
    "badgeBg" => "#f0f9ff",
    "theme" => "Perjalanan Kereta Cepat & Liburan Keluarga (高铁旅行与家庭度假)",
    "titleCn" => "乘高铁去上海的快乐周末",
    "titlePinyin" => "Chéng Gāotiě Qù Shànghǎi de Kuàilè Zhōumò",
    "titleId" => "Akhir Pekan yang Bahagia Naik Kereta Cepat ke Shanghai",
    "estimatedMinutes" => 6,
    "summary" => "Kisah pengalaman seru Li Hua bersama adik perempuannya naik kereta cepat dari Nanjing ke Shanghai, mencicipi kuliner Xiaolongbao, dan berjalan-jalan di The Bund.",
    "paragraphs" => [
      [
        "cn" => "上个星期五下午，李华和他的妹妹李美准备去上海旅游。他们住在南京，从南京坐高速铁路去上海非常快，只要一个多小时就能到。李美比李华小三岁，她非常期待这次旅行，因为这是她第一次坐中国的高铁。在火车站里，人虽然很多，但是大家都很有礼貌地排队进站。",
        "pinyin" => "Shàng gè xīngqīwǔ xiàwǔ, Lǐ Huá hé tā de mèimei Lǐ Měi zhǔnbèi qù Shànghǎi lǚyóu. Tāmen zhù zài Nánjīng, cóng Nánjīng zuò gāosù tiělù qù Shànghǎi fēicháng kuài, zhǐ yào yí gè duō xiǎoshí jiù néng dào. Lǐ Měi bǐ Lǐ Huá xiǎo sān suì, tā fēicháng qīdài zhè cì lǚxíng, yīnwèi zhè shì tā dì-yī cì zuò Zhōngguó de gāotiě. Zài huǒchēzhàn lǐ, rén suīrán hěn duō, dànshì dàjiā dōu hěn yǒu lǐmào de páiduì jìn zhàn.",
        "id" => "Jumat sore yang lalu, Li Hua dan adik perempuannya Li Mei bersiap pergi berwisata ke Shanghai. Mereka tinggal di Nanjing; dari Nanjing naik kereta api cepat menuju Shanghai sangatlah cepat, hanya butuh waktu satu jam lebih sedikit untuk sampai. Li Mei berusia tiga tahun lebih muda dibanding Li Hua, ia sangat menantikan perjalanan kali ini karena ini pertama kalinya ia naik kereta cepat Tiongkok. Di dalam stasiun kereta, meski orangnya sangat banyak, semua orang antre masuk peron dengan sangat tertib dan sopan."
      ],
      [
        "cn" => "列车开动以后，车厢里面既安静又干净。李华一边看着窗外美丽的风景，一边给妹妹介绍上海好玩的地方。李华说：“上海是一座现代化的大城市，那里的外滩最有名。晚上站在黄浦江边，能看见五颜六色、高高矮矮的漂亮大楼。”妹妹听了，高兴得拍起手来。妹妹说：“哥哥，我还想吃正宗的上海小笼包，听说皮薄汁多，非常好吃！”",
        "pinyin" => "Lièchē kāidòng yǐhòu, chēxiāng lǐmiàn jì ānjìng yòu gānjìng. Lǐ Huá yìbiān kànzhe chuāngwài měilì de fēngjǐng, yìbiān gěi mèimei jièshào Shànghǎi hǎowán de dìfang. Lǐ Huá shuō: “Shànghǎi shì yí zuò xiàndàihuà de dà chéngshì, nàlǐ de Wàitān zuì yǒumíng. Wǎnshang zhàn zài Huángpǔjiāng biān, néng kànjiàn wǔyán liùsè, gāogāo ǎi'ǎi de piàoliang dàlóu.” Mèimei tīng le, gāoxìng de pāiqǐ shǒu lái. Mèimei shuō: “Gēge, wǒ hái xiǎng chī zhèngzōng de Shànghǎi xiǎolóngbāo, tīngshuō pí báo zhī duō, fēicháng hǎochī!”",
        "id" => "Setelah kereta mulai melaju, bagian dalam gerbong begitu hening sekaligus bersih. Li Hua sambil memandang pemandangan indah di luar jendela, sambil memperkenalkan tempat-tempat seru di Shanghai kepada adiknya. Li Hua berujar: 'Shanghai adalah kota metropolitan modern, area The Bund di sana adalah yang paling termasyhur. Pada malam hari berdiri di tepi Sungai Huangpu, kita dapat melihat gedung-gedung bertingkat aneka warna yang menjulang indah.' Mendengar hal itu, adiknya begitu gembira hingga bertepuk tangan. Adiknya berkata: 'Kakak, saya juga ingin menyantap Xiaolongbao khas Shanghai yang otentik, kudengar kulitnya tipis dengan kaldu gurih berlimpah, luar biasa lezat!'"
      ],
      [
        "cn" => "晚上八点，他们顺利到达了预订的酒店。洗完澡后，他们来到城隍庙步行街。李华给妹妹买了一笼热气腾腾的小笼包和两杯甜甜的豆浆。妹妹一边吃一边笑着对李华说：“这比南京的小吃更有特色！谢谢哥哥带我来上海。”看着妹妹开心的笑脸，李华觉得虽然旅途有点累，但一切都是值得的。",
        "pinyin" => "Wǎnshang bā diǎn, tāmen shùnlì dàodá le yùdìng de jiǔdiàn. Xǐ wán zǎo hòu, tāmen lái dào Chénghuángmiào bùxíngjiē. Lǐ Huá gěi mèimei mǎi le yì lóng rèqì téngténg de xiǎolóngbāo hé liǎng bēi tiántián de dòujiāng. Mèimei yìbiān chī yìbiān xiàozhe duì Lǐ Huá shuō: “Zhè bǐ Nánjīng de xiǎochī gèng yǒu tèsè! Xièxie gēge dài wǒ lái Shànghǎi.” Kànzhe mèimei kāixīn de xiàoliǎn, Lǐ Huá juéde suīrán lǚtú yǒudiǎnr lèi, dàn yíqiè dōu shì zhídé de.",
        "id" => "Pukul 8 malam, mereka tiba dengan lancar di hotel yang telah dipesan. Usai mandi, mereka mendatangi kawasan pejalan kaki Chenghuangmiao. Li Hua membelikan sang adik sekukusan Xiaolongbao yang mengepul hangat dan dua gelas susu kedelai manis. Sambil makan, sang adik tersenyum berkata pada Li Hua: 'Ini bahkan lebih khas dibanding jajanan Nanjing! Terima kasih kakak telah membawaku ke Shanghai.' Memandang senyuman ceria sang adik, Li Hua merasa meski perjalanan sedikit melelahkan, semuanya sangat bermakna dan terbayar lunas."
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "高速铁路 (高铁)", "pinyin" => "gāosù tiělù (gāotiě)", "meaning" => "kereta api cepat"],
      ["hanzi" => "安静", "pinyin" => "ānjìng", "meaning" => "tenang / hening"],
      ["hanzi" => "介绍", "pinyin" => "jièshào", "meaning" => "memperkenalkan"],
      ["hanzi" => "小笼包", "pinyin" => "xiǎolóngbāo", "meaning" => "pangsit kukus isi kaldu khas Shanghai"],
      ["hanzi" => "顺利", "pinyin" => "shùnlì", "meaning" => "lancar / tanpa kendala"],
      ["hanzi" => "值得", "pinyin" => "zhídé", "meaning" => "sepadan / layak / bernilai"]
    ],
    "grammarNotes" => [
      [
        "title" => "1. Struktur Perbandingan dengan '比' (bǐ)",
        "formula" => "Benda A + 比 + Benda B + Kata Sifat (+ Selisih Nilai)",
        "explanation" => "'李美比李华小三岁' (Li Mei tiga tahun lebih muda dari Li Hua). Dapat ditambahkan kata keterangan penguat seperti '更' (lebih lagi): '这比南京的小吃更有特色'.",
        "exampleInStory" => "李美比李华小三岁；这比南京的小吃更有特色。"
      ],
      [
        "title" => "2. Tindakan Simultan dengan '一边……一边……' (yìbiān... yìbiān...)",
        "formula" => "Subjek + 一边 + Kata Kerja 1 + 一边 + Kata Kerja 2",
        "explanation" => "Menyatakan dua aktivitas berbeda yang dikerjakan secara bersamaan oleh subjek yang sama.",
        "exampleInStory" => "李华一边看着窗外美丽的风景，一边给妹妹介绍上海好玩的地方。"
      ],
      [
        "title" => "3. Konjungsi Hubungan Bertentangan '虽然……但是……' (suīrán... dànshì...)",
        "formula" => "虽然 + Kalimat Klausa A, 但是 + Kalimat Klausa B",
        "explanation" => "Bermakna 'Meskipun A, tetapi B'. Dipakai untuk mengemukakan dua hal yang berlawanan namun saling berkaitan.",
        "exampleInStory" => "人虽然很多，但是大家都很有礼貌地排队进站；虽然旅途有点累，但一切都是值得的。"
      ]
    ],
    "questions" => [
      [
        "question" => "从南京坐高铁去上海需要多长时间？(Berapa lama waktu yang dibutuhkan naik kereta cepat dari Nanjing ke Shanghai?)",
        "options" => ["半个小时 (Setengah jam)", "只要一个多小时 (Hanya 1 jam lebih sedikit)", "三个小时 (Tiga jam)", "一整天 (Seharian penuh)"],
        "answer" => 1,
        "explanation" => "Teks menyebutkan: '只要一个多小时就能到' (hanya butuh waktu satu jam lebih sedikit sudah bisa sampai)."
      ],
      [
        "question" => "李美比李华小几岁？(Berapa tahun Li Mei lebih muda dari Li Hua?)",
        "options" => ["一岁", "两岁", "三岁", "五岁"],
        "answer" => 2,
        "explanation" => "Paragraf pertama menyatakan: '李美比李华小三岁' (Li Mei lebih muda 3 tahun dibanding Li Hua)."
      ],
      [
        "question" => "李美为什么很期待这次旅行？(Mengapa Li Mei sangat menantikan perjalanan ini?)",
        "options" => ["因为她想去上海找工作", "因为这是她第一次坐中国的高铁", "因为她不喜欢住在南京", "因为她想去上海买衣服"],
        "answer" => 1,
        "explanation" => "Alasan Li Mei: '因为这是她第一次坐中国的高铁' (karena ini pertama kalinya ia menaiki kereta cepat Tiongkok)."
      ],
      [
        "question" => "李华给妹妹介绍了外滩的什么特色？(Keistimewaan The Bund apa yang diceritakan Li Hua kepada adiknya?)",
        "options" => ["白天有很多大船", "晚上江边能看见五颜六色的大楼", "那里有很多免费的小吃", "外滩没有很多人"],
        "answer" => 1,
        "explanation" => "Di malam hari di tepi Sungai Huangpu bisa melihat gedung-gedung indah beraneka warna (五颜六色的高高矮矮的大楼)."
      ],
      [
        "question" => "李华最后心里有什么感受？(Bagaimana perasaan Li Hua di akhir cerita?)",
        "options" => ["觉得车票太贵很不满意", "虽然有点累，但看到妹妹开心觉得一切都值得", "想要明天立刻回南京", "觉得小笼包一点也不好吃"],
        "answer" => 1,
        "explanation" => "Kalimat terakhir: '李华觉得虽然旅途有点累，但一切都是值得的' (merasa meski melelahkan, semuanya sangat berharga/layak)."
      ]
    ]
  ],

  // ==========================================
  // HSK 2 - CERITA 2
  // ==========================================
  [
    "id" => "cerita-hsk-2-2",
    "level" => 2,
    "levelName" => "HSK 2 (Dasar Lanjutan)",
    "badgeColor" => "#0284c7",
    "badgeBg" => "#f0f9ff",
    "theme" => "Kesehatan & Periksa Dokter (看医生与健康习惯)",
    "titleCn" => "小张感冒记：健康的身体最宝贵",
    "titlePinyin" => "Xiǎozhāng Gǎnmào Jì: Jiànkāng de Shēntǐ Zuì Bǎoguì",
    "titleId" => "Kisah Masuk Angin Xiao Zhang: Tubuh Sehat adalah yang Paling Berharga",
    "estimatedMinutes" => 6,
    "summary" => "Cerita tentang Xiao Zhang yang jatuh sakit karena kehujanan dan tidur terlalu larut, pengalaman berobat ke rumah sakit, serta saran berharga dokter tentang pola hidup sehat.",
    "paragraphs" => [
      [
        "cn" => "前天晚上，天气突然变冷了，还下起了大雨。小张下班的时候忘了带雨伞，衣服都被淋湿了。回到家以后，他又熬夜玩手机，直到夜里一点多才睡觉。昨天早晨起床时，小张觉得头很疼，身体一阵冷一阵热，嗓子也干干的，很不舒服。他用体温计测了一下体温，竟然有三十八度五。小张知道自己感冒发烧了，于是赶紧给公司的经理打电话请假。",
        "pinyin" => "Qiántiān wǎnshang, tiānqì tūrán biàn lěng le, hái xiàqǐ le dà yǔ. Xiǎozhāng xiàbān de shíhou wàng le dài yǔsǎn, yīfu dōu bèi línshī le. Huí dào jiā yǐhòu, tā yòu áoyè wán shǒujī, zhídào yèlǐ yì diǎn duō cái shuìjiào. Zuótiān zǎochén qǐchuáng shí, Xiǎozhāng juéde tóu hěn téng, shēntǐ yízhèn lěng yízhèn rè, sǎngzi yě gāngān de, hěn bù shūfu. Tā yòng tǐwēnjì cè le yíxià tǐwēn, jìngrán yǒu sānshíbā dù wǔ. Xiǎozhāng zhīdào zìjǐ gǎnmào fāshāo le, yúshì gǎnjǐn gěi gōngsī de jīnglǐ dǎ diànhuà qǐngjià.",
        "id" => "Dua malam yang lalu, cuaca mendadak menjadi sangat dingin dan hujan lebat turun. Saat pulang kerja Xiao Zhang lupa membawa payung, sehingga pakaiannya basah kuyup tersiram air hujan. Setibanya di rumah, ia masih begadang bermain ponsel sampai lewat jam satu dini hari baru tertidur. Kemarin pagi saat bangun tidur, Xiao Zhang merasa kepalanya sangat pusing, tubuhnya menggigil kedinginan lalu panas bergantian, tenggorokannya pun terasa kering dan tak nyaman. Ia mengukur suhu tubuhnya dengan termometer, ternyata mencapai 38,5 derajat. Xiao Zhang sadar ia terkena flu dan demam, lantas segera menelepon manajer kantornya untuk mengajukan izin sakit."
      ],
      [
        "cn" => "好朋友李明听说了，马上开车送小张去附近的医院看病。在医院里，医生给小张做了认真的检查，看了看他的嗓子，听了听肺部。医生微笑着对小张说：“别担心，你只是着凉引起了普通的感冒。最近换季，天气忽冷忽热，生病的人很多。我给你开一些感冒药和退烧药。这个药一天吃三次，每次吃两片，一定要在饭后半小时吃。”医生还叮嘱小张：“这几天要多喝温水，多吃新鲜的蔬菜和水果，绝对不能再熬夜了，必须好好卧床休息两天。”",
        "pinyin" => "Hǎo péngyou Lǐ Míng tīngshuō le, mǎshàng kāi chē sòng Xiǎozhāng qù fùjìn de yīyuàn kàn bìng. Zài yīyuàn lǐ, yīshēng gěi Xiǎozhāng zuò le rènzhēn de jiǎnchá, kàn le kàn tā de sǎngzi, tīng le tīng fèibù. Yīshēng wēixiàozhe duì Xiǎozhāng shuō: “Bié dānxīn, nǐ zhǐshì zháoliáng yǐnqǐ le pǔtōng de gǎnmào. Zuìjìn huànjì, tiānqì hū lěng hū rè, shēngbìng de rén hěn duō. Wǒ gěi nǐ kāi yìxiē gǎnmàoyào hé tuìshāoyào. Zhè gè yào yì tiān chī sān cì, měi cì chī liǎng piàn, yídìng yào zài fàn hòu bàn xiǎoshí chī.” Yīshēng hái dīngzhǔ Xiǎozhāng: “Zhè jǐ tiān yào duō hē wēn shuǐ, duō chī xīnxian de shūcài hé shuǐguǒ, juéduì bù néng zài áoyè le, bìxū hǎohāo wòchuáng xiūxi liǎng tiān.”",
        "id" => "Sahabatnya Li Ming yang mendengar kabar itu langsung mengendarai mobil mengantar Xiao Zhang ke rumah sakit terdekat untuk berobat. Di rumah sakit, dokter memeriksa kondisi Xiao Zhang dengan cermat, mengecek tenggorokan, dan mendengarkan suara pernapasannya. Dokter tersenyum ramah berkata kepada Xiao Zhang: 'Jangan khawatir, Anda hanya terkena flu biasa akibat masuk angin. Akhir-akhir ini pergantian musim, cuaca mendadak dingin mendadak panas, banyak orang yang jatuh sakit. Saya resepkan obat flu dan penurun demam. Obat ini diminum 3 kali sehari, tiap kali 2 butir, pastikan diminum setengah jam setelah makan.' Dokter juga berpesan: 'Hari-hari ini perbanyak minum air hangat, banyak makan sayur dan buah segar, sama sekali tidak boleh begadang lagi, dan harus istirahat total di tempat tidur selama dua hari.'"
      ],
      [
        "cn" => "回到家后，李明帮小张倒了一杯热温水，看着他吃完药睡下后才离开。小张在床上睡了一整天，出了一身汗。到了今天早晨，小张的体温恢复到了三十六度八，头不疼了，嗓子也舒服多了。经历这次生病，小张深有感触。他给李明发了一条微信：“谢谢你昨天对我的照顾！我以后一定会多穿衣服，多做体育锻炼，早睡早起。因为我终于明白了，健康的身体比什么都宝贵！”",
        "pinyin" => "Huí dào jiā hòu, Lǐ Míng bāng Xiǎozhāng dào le yì bēi rè wēn shuǐ, kànzhe tā chī wán yào shuì xià hòu cái líkāi. Xiǎozhāng zài chuáng shang shuì le yì zhěng tiān, chū le yì shēn hàn. Dào le jīntiān zǎochén, Xiǎozhāng de tǐwēn huīfù dào le sānshíliù dù bā, tóu bù téng le, sǎngzi yě shūfu duō le. Jīnglì zhè cì shēngbìng, Xiǎozhāng shēn yǒu gǎncù. Tā gěi Lǐ Míng fā le yì tiáo wēixìn: “Xièxie nǐ zuótiān duì wǒ de zhàogù! Wǒ yǐhòu yídìng huì duō chuān yīfu, duō zuò tǐyù duànliàn, zǎoshuì zǎoqǐ. Yīnwèi wǒ zhōngyú míngbai le, jiànkāng de shēntǐ bǐ shénme dōu bǎoguì!”",
        "id" => "Setibanya di rumah, Li Ming membantu menuangkan segelas air hangat untuk Xiao Zhang, dan menunggunya minum obat serta tertidur barulah berpamitan pulang. Xiao Zhang tidur seharian penuh di ranjang dan mengeluarkan banyak keringat. Menjelang pagi ini, suhu tubuh Xiao Zhang telah pulih normal menjadi 36,8 derajat, kepalanya tak lagi sakit, dan tenggorokannya jauh lebih nyaman. Melewati sakit kali ini, Xiao Zhang tersadar mendalam. Ia mengirim pesan WeChat kepada Li Ming: 'Terima kasih atas bantuanmu kemarin merawatku! Kelak aku pasti akan berpakaian lebih hangat, banyak berolahraga, dan tidur serta bangun lebih awal. Karena akhirnya aku memahami bahwa tubuh yang sehat lebih berharga dari apa pun!'"
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "感冒 / 发烧", "pinyin" => "gǎnmào / fāshāo", "meaning" => "masuk angin (flu) / demam"],
      ["hanzi" => "生病 / 看病", "pinyin" => "shēngbìng / kàn bìng", "meaning" => "jatuh sakit / periksa ke dokter"],
      ["hanzi" => "药", "pinyin" => "yào", "meaning" => "obat"],
      ["hanzi" => "检查", "pinyin" => "jiǎnchá", "meaning" => "memeriksa / check-up"],
      ["hanzi" => "熬夜", "pinyin" => "áoyè", "meaning" => "begadang larut malam"],
      ["hanzi" => "恢复", "pinyin" => "huīfù", "meaning" => "pulih kembali"]
    ],
    "grammarNotes" => [
      [
        "title" => "1. Pola Larangan Halus '别……' (bié...) / '不要……'",
        "formula" => "别 + Kata Kerja / Emosi (Jangan...)",
        "explanation" => "'别担心' (Jangan khawatir), '别客气' (Jangan sungkan). Merupakan ungkapan sehari-hari HSK 2 untuk melarang atau menenangkan lawan bicara secara santun.",
        "exampleInStory" => "别担心，你只是着凉引起了普通的感冒。"
      ],
      [
        "title" => "2. Frekuensi Tindakan: '一天……次' (yì tiān... cì)",
        "formula" => "Periode Waktu + Kata Kerja + Angka + 次 (Kali)",
        "explanation" => "Rumus standar untuk menyatakan dosis minum obat atau jadwal rutin: '一天吃三次' (sehari diminum 3 kali).",
        "exampleInStory" => "这个药一天吃三次，每次吃两片。"
      ],
      [
        "title" => "3. Kata Keterangan Waktu Lampau '……的时候' (de shíhou)",
        "formula" => "Klausa Aktivitas + 的时候 (Saat / Sewaktu...)",
        "explanation" => "Digunakan untuk menandai latar waktu terjadinya suatu insiden.",
        "exampleInStory" => "小张下班的时候忘了带雨伞；早晨起床的时候觉得头很疼。"
      ]
    ],
    "questions" => [
      [
        "question" => "前天晚上小张为什么会淋湿衣服？(Mengapa pakaian Xiao Zhang basah kuyup dua malam lalu?)",
        "options" => ["他在河里游泳", "下大雨但他忘了带雨伞", "他在洗衣服", "别人倒水在他身上"],
        "answer" => 1,
        "explanation" => "Paragraf pertama menyatakan: '小张下班的时候忘了带雨伞，衣服都被淋湿了' (Xiao Zhang lupa bawa payung saat pulang kerja)."
      ],
      [
        "question" => "小张量体温时发烧到了多少度？(Berapa suhu demam Xiao Zhang saat diukur?)",
        "options" => ["三十六度八 (36.8°C)", "三十七度二 (37.2°C)", "三十八度五 (38.5°C)", "四十度 (40.0°C)"],
        "answer" => 2,
        "explanation" => "Teks menyebutkan suhu tubuhnya: '竟然有三十八度五' (mencapai 38,5 derajat Celsius)."
      ],
      [
        "question" => "谁开车送小张去医院看病？(Siapa yang mengendarai mobil mengantar Xiao Zhang ke rumah sakit?)",
        "options" => ["他的爸爸", "他的经理", "好朋友李明", "出租车司机"],
        "answer" => 2,
        "explanation" => "Teks paragraf kedua: '好朋友李明听说了，马上开车送小张去附近的医院看病' (Sahabatnya Li Ming)."
      ],
      [
        "question" => "医生嘱咐小张的感冒药应该怎么吃？(Bagaimana aturan minum obat yang dianjurkan dokter kepada Xiao Zhang?)",
        "options" => ["一天吃一次，饭前吃", "一天吃三次，每次两片，饭后半小时吃", "一天吃两次，睡前吃四片", "想吃的时候随时吃"],
        "answer" => 1,
        "explanation" => "Dokter berpesan: '这个药一天吃三次，每次吃两片，一定要在饭后半小时吃' (3x sehari, 2 butir, 30 menit setelah makan)."
      ],
      [
        "question" => "通过这次生病，小张明白了什么最重要的道理？(Pelajaran terpenting apa yang disadari Xiao Zhang setelah sakit?)",
        "options" => ["应该多买几把雨伞", "健康的身体比什么都宝贵", "不用再去公司上班了", "手机比生病更好玩"],
        "answer" => 1,
        "explanation" => "Pesan penutup Xiao Zhang: '健康的身体比什么都宝贵！' (Tubuh yang sehat lebih berharga daripada apa pun)."
      ]
    ]
  ],

  // ==========================================
  // HSK 2 - CERITA 3
  // ==========================================
  [
    "id" => "cerita-hsk-2-3",
    "level" => 2,
    "levelName" => "HSK 2 (Dasar Lanjutan)",
    "badgeColor" => "#0284c7",
    "badgeBg" => "#f0f9ff",
    "theme" => "Ulang Tahun & Hadiah Istimewa (生日聚会与特别的礼物)",
    "titleCn" => "玛丽的二十岁生日派对",
    "titlePinyin" => "Mǎlì de Èrshí Suì Shēngrì Pàiduì",
    "titleId" => "Pesta Ulang Tahun ke-20 Mary",
    "estimatedMinutes" => 6,
    "summary" => "Cerita tentang mahasiswa pertukaran Mary yang merayakan ulang tahunnya di Tiongkok, kejutan kue ulang tahun dari teman-teman sekelas, dan kado istimewa qipao merah.",
    "paragraphs" => [
      [
        "cn" => "玛丽是一位来自法国的留学生，在北京的一所大学学习汉语。昨天是十二月十八号，正好是玛丽二十岁的生日。因为远在异国他乡，远离家乡和父母，玛丽以为今年的生日只能自己一个人在宿舍里安静地度过了。然而，下午五点刚下课，班长王力就笑着走到玛丽面前说：“玛丽，今天晚上六点半，大家在东门附近的新川菜馆等你，你一定要来哦！”",
        "pinyin" => "Mǎlì shì yí wèi láizì Fǎguó de liúxuéshēng, zài Běijīng de yì suǒ dàxué xuéxí Hànyǔ. Zuótiān shì shí'èryuè shíbā hào, zhènghǎo shì Mǎlì èrshí suì de shēngrì. Yīnwèi yuǎn zài yìguó tāxiāng, yuǎnlí jiāxiāng hé fùmǔ, Mǎlì yǐwéi jīnnián de shēngrì zhǐ néng zìjǐ yí gè rén zài sùshè lǐ ānjìng de dùguò le. Rán'ér, xiàwǔ wǔ diǎn gāng xiàkè, bānzhǎng Wáng Lì jiù xiàozhe zǒudào Mǎlì miànqián shuō: “Mǎlì, jīntiān wǎnshang liù diǎn bàn, dàjiā zài dōngmén fùjìn de xīn Chuāncàiguǎn děng nǐ, nǐ yídìng yào lái o!”",
        "id" => "Mary adalah seorang mahasiswa internasional asal Prancis yang belajar bahasa Mandarin di sebuah universitas di Beijing. Kemarin tanggal 18 Desember, bertepatan dengan hari ulang tahun ke-20 Mary. Karena berada jauh di negeri orang terpisah dari kampung halaman dan orang tua, Mary mengira ulang tahunnya tahun ini hanya bisa dihabiskan sendirian dengan sunyi di dalam kamar asrama. Namun demikian, pukul 5 sore baru saja usai kelas, ketua kelas Wang Li tersenyum menghampiri Mary dan berkata: 'Mary, malam ini pukul 18.30 semua teman menunggumu di Restoran Sichuan baru dekat gerbang timur, kamu wajib datang ya!'"
      ],
      [
        "cn" => "当玛丽推开饭馆包厢的房门时，屋里的灯突然熄灭了，大家一起拍手唱起了《祝你生日快乐》歌。房间里装饰着五彩斑斓的气球，桌子中间放着一个巨大的草莓奶油蛋糕，上面插着两根写着数字“20”的粉红色蜡烛。玛丽既惊讶又感动，眼眶里含着高兴的泪水。班长王力代表全班同学拿出了一个红色的精致礼盒，递给玛丽说：“玛丽，祝你二十岁生日快乐！这是我们全班同学送给你的礼物，希望你喜欢。”",
        "pinyin" => "Dāng Mǎlì tuīkāi fànguǎn bāoxiāng de fángmén shí, wū lǐ de dēng tūrán xīmiè le, dàjiā yìqǐ pāishǒu chàngqǐ le 《Zhù Nǐ Shēngrì Kuàilè》 gē. Fángjiān lǐ zhuāngshìzhe wǔcǎi bānlán de qìqiú, zhuōzi zhōngjiān fàngzhe yí gè jùdà de cǎoméi nǎiyóu dàngāo, shàngmiàn chāzhe liǎng gēn xiězhe shùzì “20” de fěnhóngsè làzhú. Mǎlì jì jīngyà yòu gǎndòng, yǎnkuàng lǐ hánzhe gāoxìng de lèishuǐ. Bānzhǎng Wáng Lì dàibiǎo quán bān tóngxué ná chū le yí gè hóngsè de jīngzhì lǐhé, dì gěi Mǎlì shuō: “Mǎlì, zhù nǐ èrshí suì shēngrì kuàilè! Zhè shì wǒmen quán bān tóngxué sòng gěi nǐ de lǐwù, xīwàng nǐ xǐhuan.”",
        "id" => "Saat Mary mendorong pintu ruang makan privat restoran itu, lampu seketika padam, dan semua teman serempak bertepuk tangan menyanyikan lagu 'Selamat Ulang Tahun'. Ruangan itu dihiasi balon beraneka warna, di tengah meja terletak kue tart krim stroberi berukuran besar yang ditancapi dua lilin merah muda berangka '20'. Mary terkejut bercampur terharu, pelupuk matanya berkaca-kaca meneteskan air mata bahagia. Ketua kelas Wang Li mewakili teman sekelas mengeluarkan kotak kado merah yang anggun dan menyerahkannya kepada Mary: 'Mary, selamat ulang tahun ke-20! Ini hadiah dari kami seluruh teman sekelas untukmu, semoga kamu menyukainya.'"
      ],
      [
        "cn" => "玛丽轻轻地打开礼盒，里面竟然是一件做工精美的红色中国旗袍！玛丽激动地说：“太漂亮了！我一直非常想要一件旗袍，谢谢大家！”玛丽在大家的欢呼声中闭上眼睛许了一个美好的愿望，然后一口气吹灭了蜡烛。大家一边品尝着美味的蛋糕，一边聊天欢笑。玛丽拿出手机和所有的中国同学拍了一张大合影，并把照片发给了远在法国的父母。玛丽在朋友圈写道：“在中国，我找到了最温暖的友情，这是我人生中最难忘的一个生日！”",
        "pinyin" => "Mǎlì qīngqīng de dǎkāi lǐhé, lǐmiàn jìngrán shì yí jiàn zuògōng jīngměi de hóngsè Zhōngguó qípáo! Mǎlì jīdòng de shuō: “Tài piàoliang le! Wǒ yìzhí fēicháng xiǎng yào yí jiàn qípáo, xièxie dàjiā!” Mǎlì zài dàjiā de huānhū shēng zhōng bì shàng yǎnjing xǔ le yí gè měihǎo de yuànwàng, ránhòu yì kǒu qì chuī miè le làzhú. Dàjiā yìbiān pǐnchángzhe měiwèi de dàngāo, yìbiān liáotiān huānxiào. Mǎlì ná chū shǒujī hé suǒyǒu de Zhōngguó tóngxué pāi le yì zhāng dà héyǐng, bìng bǎ zhàopiàn fā gěi le yuǎn zài Fǎguó de fùmǔ. Mǎlì zài péngyouquān xiě dào: “Zài Zhōngguó, wǒ zhǎodào le zuì wēnnuǎn de yǒuqíng, zhè shì wǒ rénshēng zhōng zuì nánwàng de yí gè shēngrì!”",
        "id" => "Mary membuka kotak kado itu dengan perlahan, dan di dalamnya ternyata adalah sehelai gaun Qipao tradisional Tiongkok berwarna merah dengan jahitan yang sangat indah! Mary dengan penuh haru berkata: 'Sungguh teramat cantik! Saya sudah sejak lama mendambakan sehelai Qipao, terima kasih teman-teman!' Di tengah sorak-sorai, Mary memejamkan mata memanjatkan sebuah doa harapan indah, lalu dalam satu hembusan napas meniup padam lilinnya. Semua orang sambil menyantap kue lezat, sambil mengobrol dan tertawa riang. Mary mengeluarkan ponsel dan berfoto bersama seluruh kawan Tiongkoknya, lalu mengirimkan foto tersebut kepada orang tuanya di Prancis. Di media sosialnya Mary menulis: 'Di Tiongkok, aku menemukan persahabatan paling hangat; ini adalah ulang tahun paling tak terlupakan dalam hidupku!'"
      ]
    ],
    "vocabularies" => [
      ["hanzi" => "生日 / 快乐", "pinyin" => "shēngrì / kuàilè", "meaning" => "ulang tahun / bahagia"],
      ["hanzi" => "礼物", "pinyin" => "lǐwù", "meaning" => "hadiah / kado"],
      ["hanzi" => "蛋糕", "pinyin" => "dàngāo", "meaning" => "kue bolu / tart"],
      ["hanzi" => "送", "pinyin" => "sòng", "meaning" => "memberikan / menghadiahkan"],
      ["hanzi" => "难忘", "pinyin" => "nánwàng", "meaning" => "tak terlupakan"],
      ["hanzi" => "旗袍", "pinyin" => "qípáo", "meaning" => "pakaian tradisional wanita Tionghoa (Cheongsam)"]
    ],
    "grammarNotes" => [
      [
        "title" => "1. Kata Kerja Pemberian: '送给' (sòng gěi)",
        "formula" => "Pemberi + 送给 + Penerima + Hadiah / Barang",
        "explanation" => "Pola standar HSK 2 untuk menyatakan pemberian hadiah: '这是我们送给你的礼物' (Ini adalah hadiah yang kami berikan untukmu).",
        "exampleInStory" => "这是我们全班同学送给你的礼物。"
      ],
      [
        "title" => "2. Menghubungkan Dua Keadaan: '既……又……' (jì... yòu...)",
        "formula" => "Subjek + 既 + Keadaan A + 又 + Keadaan B",
        "explanation" => "Menyatakan dua perasaan atau kondisi yang hadir bersamaan ('sekaligus... juga...').",
        "exampleInStory" => "玛丽既惊讶又感动 (Mary terkejut sekaligus terharu)."
      ],
      [
        "title" => "3. Kata Keterangan Waktu Baru Saja: '刚' (gāng)",
        "formula" => "Subjek + 刚 + Kata Kerja (Baru saja melakukan...)",
        "explanation" => "Menunjukkan peristiwa yang baru saja terjadi sesaat sebelumnya.",
        "exampleInStory" => "下午五点刚下课，班长王力就走了过来。"
      ]
    ],
    "questions" => [
      [
        "question" => "玛丽是一位来自哪个国家的留学生？(Dari negara mana mahasiswa internasional Mary berasal?)",
        "options" => ["英国 (Inggris)", "美国 (Amerika)", "法国 (Prancis)", "德国 (Jerman)"],
        "answer" => 2,
        "explanation" => "Paragraf pertama menjelaskan: '玛丽是一位来自法国的留学生' (Mary berasal dari Prancis)."
      ],
      [
        "question" => "玛丽原本以为自己的二十岁生日会怎么度过？(Bagaimana Mary awalnya mengira ia akan menghabiskan ulang tahunnya?)",
        "options" => ["回法国和父母一起过", "和朋友去旅游", "自己一个人在宿舍里安静度过", "去饭馆打工"],
        "answer" => 2,
        "explanation" => "Mary mengira ulang tahunnya akan sepi: '玛丽以为今年的生日只能自己一个人在宿舍里安静地度过了'."
      ],
      [
        "question" => "当玛丽走进饭馆包厢时，大家为她唱了什么歌？(Lagu apa yang dinyanyikan teman-teman saat Mary masuk ke ruang makan?)",
        "options" => ["《新年好》", "《祝你生日快乐》", "《北京欢迎你》", "《茉莉花》"],
        "answer" => 1,
        "explanation" => "Semua orang bertepuk tangan menyanyikan lagu Selamat Ulang Tahun: '大家一起拍手唱起了《祝你生日快乐》歌'."
      ],
      [
        "question" => "全班同学送给玛丽的生日礼物是什么？(Hadiah ulang tahun apa yang diberikan teman sekelas untuk Mary?)",
        "options" => ["一本大词典", "一台新手机", "一件精美的红色中国旗袍", "一双漂亮的皮鞋"],
        "answer" => 2,
        "explanation" => "Isi kotak kado adalah pakaian tradisional qipao: '里面竟然是一件做工精美的红色中国旗袍'."
      ],
      [
        "question" => "玛丽在朋友圈写了什么感言？(Apa ungkapan perasaan yang ditulis Mary di media sosialnya?)",
        "options" => ["中国菜太辣了", "在中国找到了最温暖的友情，这是人生中最难忘的生日", "希望明天马上回法国", "蛋糕不太甜"],
        "answer" => 1,
        "explanation" => "Mary menulis: '在中国，我找到了最温暖的友情，这是我人生中最难忘的一个生日！'."
      ]
    ]
  ]
];

echo "Total cerita HSK 1 & 2 di-generate: " . count($ceritaList) . "\n";
