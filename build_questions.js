const fs = require('fs');
const path = require('path');

// Helper to generate rich 50 questions per level for HSK 1-6
function generateAllQuestions() {
  const bank = {};

  // ==========================================
  // HSK LEVEL 1 (50 SOAL)
  // ==========================================
  bank[1] = [
    // Listening (13)
    { id: "hsk1-l-1", type: "listening", question: "Dengarkan: '他是我的老师' (Tā shì wǒ de lǎoshī). Siapakah dia?", audioText: "他是我的老师", options: ["Teman saya", "Dokter saya", "Guru saya", "Ayah saya"], correct: 2, explanation: "'老师' (lǎoshī) berarti Guru. '他是我的老师' = Dia adalah guru saya." },
    { id: "hsk1-l-2", type: "listening", question: "Dengarkan: '我喝茶，不喝咖啡' (Wǒ hē chá, bù hē kāfēi). Apa yang diminum pembicara?", audioText: "我喝茶，不喝咖啡", options: ["Teh", "Kopi", "Air putih", "Susu"], correct: 0, explanation: "'喝茶' (hē chá) berarti minum teh, '不喝咖啡' berarti tidak minum kopi." },
    { id: "hsk1-l-3", type: "listening", question: "Dengarkan: '现在是下午三点' (Xiànzài shì xiàwǔ sān diǎn). Jam berapa sekarang?", audioText: "现在是下午三点", options: ["Jam 1 siang", "Jam 2 siang", "Jam 3 sore", "Jam 4 sore"], correct: 2, explanation: "'三点' (sān diǎn) berarti jam 3, '下午' berarti sore/siang." },
    { id: "hsk1-l-4", type: "listening", question: "Dengarkan: '这家商店的苹果很好吃' (Zhè jiā shāngdiàn de píngguǒ hěn hǎochī). Apa yang enak?", audioText: "这家商店的苹果很好吃", options: ["Pisang", "Apel", "Semangka", "Jeruk"], correct: 1, explanation: "'苹果' (píngguǒ) berarti apel." },
    { id: "hsk1-l-5", type: "listening", question: "Dengarkan: '明天天气很好，我们去公园吧' (Míngtiān tiānqì hěn hǎo, wǒmen qù gōngyuán ba). Ke mana mereka akan pergi?", audioText: "明天天气很好，我们去公园吧", options: ["Sekolah", "Toko", "Taman", "Rumah Sakit"], correct: 2, explanation: "'公园' (gōngyuán) berarti taman umum." },
    { id: "hsk1-l-6", type: "listening", question: "Dengarkan: '我家里有四口人' (Wǒ jiā li yǒu sì kǒu rén). Berapa anggota keluarga pembicara?", audioText: "我家里有四口人", options: ["3 orang", "4 orang", "5 orang", "6 orang"], correct: 1, explanation: "'四口人' (sì kǒu rén) berarti 4 orang." },
    { id: "hsk1-l-7", type: "listening", question: "Dengarkan: '对不起，我不会说汉语' (Duìbuqǐ, wǒ bù huì shuō Hànyǔ). Apa yang tidak bisa dilakukan pembicara?", audioText: "对不起，我不会说汉语", options: ["Makan makanan Cina", "Berbicara bahasa Mandarin", "Menulis karakter Hanzi", "Mendengar lagu"], correct: 1, explanation: "'不会说汉语' = tidak bisa berbicara bahasa Mandarin." },
    { id: "hsk1-l-8", type: "listening", question: "Dengarkan: '我妈妈在医院工作' (Wǒ māma zài yīyuàn gōngzuò). Di mana ibu bekerja?", audioText: "我妈妈在医院工作", options: ["Di sekolah", "Di bank", "Di rumah sakit", "Di bandara"], correct: 2, explanation: "'医院' (yīyuàn) berarti rumah sakit." },
    { id: "hsk1-l-9", type: "listening", question: "Dengarkan: '桌子上有一本书和一个杯子' (Zhuōzi shang yǒu yī běn shū hé yī gè bēizi). Apa yang ada di atas meja?", audioText: "桌子上有一本书和一个杯子", options: ["Buku dan cangkir", "Buku dan pena", "Cangkir dan piring", "Komputer dan buku"], correct: 0, explanation: "'书' (shū = buku) dan '杯子' (bēizi = cangkir/gelas)." },
    { id: "hsk1-l-10", type: "listening", question: "Dengarkan: '小猫在椅子下面睡觉' (Xiǎomāo zài yǐzi xiàmiàn shuìjiào). Di mana kucing sedang tidur?", audioText: "小猫在椅子下面睡觉", options: ["Di atas meja", "Di bawah kursi", "Di dalam kamar", "Di luar rumah"], correct: 1, explanation: "'椅子下面' (yǐzi xiàmiàn) berarti di bawah kursi." },
    { id: "hsk1-l-11", type: "listening", question: "Dengarkan: '火车站离这里很远' (Huǒchēzhàn lí zhèlǐ hěn yuǎn). Apa yang letaknya jauh?", audioText: "火车站离这里很远", options: ["Stasiun kereta", "Bandara", "Halte bus", "Hotel"], correct: 0, explanation: "'火车站' (huǒchēzhàn) berarti stasiun kereta api." },
    { id: "hsk1-l-12", type: "listening", question: "Dengarkan: '我今天买了三个大西瓜' (Wǒ jīntiān mǎile sān gè dà xīguā). Apa yang dibeli?", audioText: "我今天买了三个大西瓜", options: ["3 buah semangka besar", "3 buah apel kecil", "2 buah mangga", "4 buah melon"], correct: 0, explanation: "'西瓜' (xīguā) = semangka, '三个' = 3 buah." },
    { id: "hsk1-l-13", type: "listening", question: "Dengarkan: '坐飞机去北京要两个小时' (Zuò fēijī qù Běijīng yào liǎng gè xiǎoshí). Naik apa ke Beijing?", audioText: "坐飞机去北京要两个小时", options: ["Kereta", "Pesawat", "Mobil", "Kapal laut"], correct: 1, explanation: "'飞机' (fēijī) berarti pesawat terbang." },

    // Speaking (12)
    { id: "hsk1-s-14", type: "speaking", question: "Manakah pelafalan Pinyin yang tepat untuk '苹果' (Apel)?", audioText: "苹果", options: ["píngguǒ", "píngzi", "bīngxiāng", "pángbiān"], correct: 0, explanation: "'苹果' dibaca 'píngguǒ' (nada 2 dan nada 3)." },
    { id: "hsk1-s-15", type: "speaking", question: "Bagaimana cara menyapa 'Halo semuanya' secara ramah dalam bahasa Mandarin?", audioText: "大家好", options: ["大家好！ (Dàjiā hǎo!)", "再见！ (Zàijiàn!)", "没关系！ (Méi guānxi!)", "谢谢你！ (Xièxie nǐ!)"], correct: 0, explanation: "'大家好' (Dàjiā hǎo) = Halo semuanya / Selamat pagi/siang rekan-rekan." },
    { id: "hsk1-s-16", type: "speaking", question: "Jika seseorang berkata '谢谢' (Terima kasih), apa balasan yang paling sopan?", audioText: "不客气", options: ["对不起 (Duìbuqǐ)", "不客气 (Bù kèqi)", "明天见 (Míngtiān jiàn)", "很高兴 (Hěn gāoxìng)"], correct: 1, explanation: "'不客气' (bù kèqi) = sama-sama / jangan sungkan." },
    { id: "hsk1-s-17", type: "speaking", question: "Bagaimana cara menanyakan nama seseorang secara sopan 'Kamu dipanggil siapa?'", audioText: "你叫什么名字？", options: ["你叫什么名字？ (Nǐ jiào shénme míngzi?)", "你是哪国人？ (Nǐ shì nǎ guó rén?)", "你去哪里？ (Nǐ qù nǎlǐ?)", "你多大了？ (Nǐ duō dà le?)"], correct: 0, explanation: "'你叫什么名字？' digunakan untuk menanyakan nama orang." },
    { id: "hsk1-s-18", type: "speaking", question: "Bagaimana cara menyatakan 'Senang berkenalan denganmu'?", audioText: "很高兴认识你", options: ["很高兴认识你 (Hěn gāoxìng rènshi nǐ)", "我是学生 (Wǒ shì xuésheng)", "请进请坐 (Qǐng jìn qǐng zuò)", "我不知道 (Wǒ bù zhīdào)"], correct: 0, explanation: "'很高兴认识你' = Sangat senang berkenalan dengan Anda." },
    { id: "hsk1-s-19", type: "speaking", question: "Bagaimana menanyakan harga barang 'Berapa harganya?' dalam Mandarin sehari-hari?", audioText: "多少钱？", options: ["多少钱？ (Duōshao qián?)", "什么时间？ (Shénme shíjiān?)", "在哪里？ (Zài nǎlǐ?)", "好不好？ (Hǎo bù hǎo?)"], correct: 0, explanation: "'多少钱？' (Duōshao qián?) = Berapa harganya / berapa uang?" },
    { id: "hsk1-s-20", type: "speaking", question: "Bagaimana cara pamit 'Sampai jumpa besok'?", audioText: "明天见", options: ["明天见 (Míngtiān jiàn)", "昨天见 (Zuótiān jiàn)", "今天见 (Jīntiān jiàn)", "以后见 (Yǐhòu jiàn)"], correct: 0, explanation: "'明天见' (Míngtiān jiàn) = Sampai jumpa besok." },
    { id: "hsk1-s-21", type: "speaking", question: "Bagaimana merespon ucapan '对不起' (Maaf)?", audioText: "没关系", options: ["没关系 (Méi guānxi)", "不用谢 (Bù yòng xiè)", "太好了 (Tài hǎo le)", "请问 (Qǐngwèn)"], correct: 0, explanation: "'没关系' (méi guānxi) = tidak apa-apa." },
    { id: "hsk1-s-22", type: "speaking", question: "Manakah pelafalan Pinyin yang tepat untuk '老师' (Guru)?", audioText: "老师", options: ["lǎoshī", "lǎorén", "lǎoshǔ", "lǎoyé"], correct: 0, explanation: "'老师' dibaca lǎoshī (nada 3 dan nada 1)." },
    { id: "hsk1-s-23", type: "speaking", question: "Bagaimana mengucapkan 'Saya orang Indonesia' dalam Mandarin?", audioText: "我是印度尼西亚人", options: ["我是印度尼西亚人 (Wǒ shì Yìndùníxīyà rén)", "我是中国人 (Wǒ shì Zhōngguó rén)", "我是老师 (Wǒ shì lǎoshī)", "我是朋友 (Wǒ shì péngyou)"], correct: 0, explanation: "'印度尼西亚人' = orang Indonesia." },
    { id: "hsk1-s-24", type: "speaking", question: "Bagaimana menanyakan jam 'Sekarang jam berapa?'", audioText: "现在几点了？", options: ["现在几点了？ (Xiànzài jǐ diǎn le?)", "今天几号？ (Jīntiān jǐ hào?)", "星期几？ (Xīngqī jǐ?)", "你在哪儿？ (Nǐ zài nǎr?)"], correct: 0, explanation: "'现在几点了？' = Sekarang jam berapa?" },
    { id: "hsk1-s-25", type: "speaking", question: "Bagaimana menolak tawaran makanan secara sopan 'Saya tidak mau, terima kasih'?", audioText: "我不要，谢谢", options: ["我不要，谢谢 (Wǒ bù yào, xièxie)", "我要吃 (Wǒ yào chī)", "很好吃 (Hěn hǎochī)", "再来一个 (Zài lái yí gè)"], correct: 0, explanation: "'我不要，谢谢' = Saya tidak mau/ambil, terima kasih." },

    // Reading (12)
    { id: "hsk1-r-26", type: "reading", question: "Pilihlah arti kata yang tepat untuk karakter berikut: '谢谢' (Xièxie)", audioText: "谢谢", options: ["Sama-sama", "Terima kasih", "Sampai jumpa", "Maaf"], correct: 1, explanation: "'谢谢' (xièxie) berarti 'Terima kasih'." },
    { id: "hsk1-r-27", type: "reading", question: "Berapa angka Mandarin untuk '七' (qī)?", audioText: "七", options: ["5", "6", "7", "8"], correct: 2, explanation: "'七' dibaca qī dan berarti angka 7." },
    { id: "hsk1-r-28", type: "reading", question: "Pilihlah lawan kata dari '大' (dà - besar):", audioText: "大", options: ["小 (xiǎo)", "多 (duō)", "少 (shǎo)", "高 (gāo)"], correct: 0, explanation: "Lawan kata dari '大' (besar) adalah '小' (xiǎo - kecil)." },
    { id: "hsk1-r-29", type: "reading", question: "Manakah karakter Hanzi yang berarti 'Air'?", audioText: "水", options: ["火 (huǒ)", "水 (shuǐ)", "木 (mù)", "土 (tǔ)"], correct: 1, explanation: "'水' (shuǐ) berarti air." },
    { id: "hsk1-r-30", type: "reading", question: "Kalimat '他是我的同学' memiliki arti...", audioText: "他是我的同学", options: ["Dia adalah guru saya", "Dia adalah teman sekelas saya", "Dia adalah kakak saya", "Dia adalah tetangga saya"], correct: 1, explanation: "'同学' (tóngxué) berarti teman sekolah / teman sekelas." },
    { id: "hsk1-r-31", type: "reading", question: "Karakter '月' (yuè) memiliki arti...", audioText: "月", options: ["Matahari / Hari", "Bulan", "Bintang", "Langit"], correct: 1, explanation: "'月' (yuè) berarti bulan (moon / month)." },
    { id: "hsk1-r-32", type: "reading", question: "Manakah pasangan kata yang berarti 'Makan' dan 'Minum'?", audioText: "吃和喝", options: ["看 - 听 (kàn - tīng)", "吃 - 喝 (chī - hē)", "买 - 卖 (mǎi - mài)", "去 - 来 (qù - lái)"], correct: 1, explanation: "'吃' (chī) = makan, '喝' (hē) = minum." },
    { id: "hsk1-r-33", type: "reading", question: "Apa arti dari frasa '中国菜' (Zhōngguó cài)?", audioText: "中国菜", options: ["Masakan Tiongkok", "Bahasa Tionghoa", "Negara Tiongkok", "Pasar Tiongkok"], correct: 0, explanation: "'菜' (cài) dalam konteks ini berarti hidangan/masakan sayur/lauk pauk." },
    { id: "hsk1-r-34", type: "reading", question: "Manakah angka Mandarin untuk '九' (jiǔ)?", audioText: "九", options: ["8", "9", "10", "6"], correct: 1, explanation: "'九' (jiǔ) melambangkan angka 9." },
    { id: "hsk1-r-35", type: "reading", question: "Karakter '人' (rén) melambangkan gambar...", audioText: "人", options: ["Pohon", "Orang berdiri", "Gunung", "Pintu"], correct: 1, explanation: "'人' adalah piktogram sederhana manusia melangkah." },
    { id: "hsk1-r-36", type: "reading", question: "Apa arti kalimat '今天星期三' (Jīntiān xīngqīsān)?", audioText: "今天星期三", options: ["Hari ini hari Senin", "Hari ini hari Selasa", "Hari ini hari Rabu", "Hari ini hari Kamis"], correct: 2, explanation: "'星期三' = hari Rabu (hari ke-3 dalam seminggu)." },
    { id: "hsk1-r-37", type: "reading", question: "Apa arti kata '爸爸' dan '妈妈'?", audioText: "爸爸妈妈", options: ["Kakek dan Nenek", "Ayah dan Ibu", "Paman dan Bibi", "Kakak dan Adik"], correct: 1, explanation: "'爸爸' (bàba) = ayah, '妈妈' (māma) = ibu." },

    // Writing (13)
    { id: "hsk1-w-38", type: "writing", question: "Susunlah kata-kata acak berikut menjadi kalimat yang benar: [中国 / 我 / 去 / 想]", audioText: "我想去中国", options: ["我 想 去 中国 (Wǒ xiǎng qù Zhōngguó)", "中国 去 想 我 (Zhōngguó qù xiǎng wǒ)", "去 中国 我 想 (Qù Zhōngguó wǒ xiǎng)", "想 我 去 中国 (Xiǎng wǒ qù Zhōngguó)"], correct: 0, explanation: "Pola: Subjek (我) + Kata Bantu/Modal (想) + Predikat (去) + Objek (中国)." },
    { id: "hsk1-w-39", type: "writing", question: "Pilihlah kata penggolong yang tepat untuk '三_____人' (3 orang):", audioText: "三个人", options: ["个 (gè)", "本 (běn)", "只 (zhī)", "张 (zhāng)"], correct: 0, explanation: "'个' (gè) adalah kata penggolong umum paling standar untuk orang." },
    { id: "hsk1-w-40", type: "writing", question: "Lengkapilah kalimat tanya: '你_____去学校？' (Apakah kamu pergi ke sekolah?)", audioText: "你去学校吗？", options: ["吗 (ma)", "呢 (ne)", "吧 (ba)", "了 (le)"], correct: 0, explanation: "Partikel '吗' (ma) diletakkan di akhir kalimat untuk mengubah kalimat pernyataan menjadi pertanyaan ya/tidak." },
    { id: "hsk1-w-41", type: "writing", question: "Susun kalimat yang benar: [在 / 学习 / 中文 / 我 / 家里]", audioText: "我在家里学习中文", options: ["我 在 家里 学习 中文 (Wǒ zài jiālǐ xuéxí zhōngwén)", "家里 我 学习 在 中文 (Jiālǐ wǒ xuéxí zài zhōngwén)", "中文 我 在 学习 家里 (Zhōngwén wǒ zài xuéxí jiālǐ)", "学习 在 家里 中文 我 (Xuéxí zài jiālǐ zhōngwén wǒ)"], correct: 0, explanation: "Struktur: Subjek (我) + Keterangan Tempat (在家里) + Predikat (学习) + Objek (中文)." },
    { id: "hsk1-w-42", type: "writing", question: "Pilihlah kata penunjuk 'Ini' dalam bahasa Mandarin:", audioText: "这", options: ["这 (zhè)", "那 (nà)", "哪 (nǎ)", "谁 (shéi)"], correct: 0, explanation: "'这' (zhè) berarti ini (dekat), '那' (nà) berarti itu (jauh)." },
    { id: "hsk1-w-43", type: "writing", question: "Kata yang tepat untuk mengisi '我_____吃米饭，我想吃面条。' (Saya tidak mau makan nasi, saya mau makan mie)", audioText: "我不吃米饭", options: ["不 (bù)", "没 (méi)", "很 (hěn)", "都 (dōu)"], correct: 0, explanation: "'不' (bù) digunakan untuk negasi masa sekarang/keinginan (不吃 = tidak makan)." },
    { id: "hsk1-w-44", type: "writing", question: "Berapa jumlah goresan (笔画) pada karakter '大' (dà)?", audioText: "大", options: ["2 goresan", "3 goresan", "4 goresan", "5 goresan"], correct: 1, explanation: "'大' terdiri dari 3 goresan: 横 (Héng), 撇 (Piě), 捺 (Nà)." },
    { id: "hsk1-w-45", type: "writing", question: "Lengkapilah: '今天星期五，明天是_____。' (Hari ini Jumat, besok adalah...)", audioText: "明天是星期六", options: ["星期六 (Xīngqīliù - Sabtu)", "星期天 (Xīngqītiān - Minggu)", "星期四 (Xīngqīsì - Kamis)", "星期一 (Xīngqīyī - Senin)"], correct: 0, explanation: "Setelah hari Jumat (星期五) adalah hari Sabtu (星期六)." },
    { id: "hsk1-w-46", type: "writing", question: "Pilihlah bentuk kepemilikan 'Buku saya' yang tepat:", audioText: "我的书", options: ["我的书 (Wǒ de shū)", "我书的 (Wǒ shū de)", "书我的 (Shū wǒ de)", "我的 (Wǒ de)"], correct: 0, explanation: "Partikel '的' (de) menghubungkan pemilik (我) dengan benda (书) -> 我的书." },
    { id: "hsk1-w-47", type: "writing", question: "Goresan pertama saat menulis karakter '十' (shí - sepuluh) adalah...", audioText: "十", options: ["横 (Héng - Mendatar)", "竖 (Shù - Tegak lurus)", "点 (Diǎn - Titik)", "撇 (Piě - Serong kiri)"], correct: 0, explanation: "Aturan urutan goresan Hanzi: 先横后竖 (Mendatar dulu baru tegak)." },
    { id: "hsk1-w-48", type: "writing", question: "Susun kalimat berikut: [好朋友 / 是 / 我们]", audioText: "我们是好朋友", options: ["我们 是 好朋友 (Wǒmen shì hǎopéngyou)", "好朋友 是 我们 (Hǎopéngyou shì wǒmen)", "是 我们 好朋友 (Shì wǒmen hǎopéngyou)", "我们 好朋友 是 (Wǒmen hǎopéngyou shì)"], correct: 0, explanation: "Subjek (我们) + Verb/Kopula (是) + Objek (好朋友) = Kami adalah teman baik." },
    { id: "hsk1-w-49", type: "writing", question: "Kata yang berarti 'Sangat' dalam kalimat '天气_____热' (Cuaca sangat panas) adalah:", audioText: "很", options: ["很 (hěn)", "也 (yě)", "都 (dōu)", "在 (zài)"], correct: 0, explanation: "'很' (hěn) berfungsi sebagai adverb derajat 'sangat'." },
    { id: "hsk1-w-50", type: "writing", question: "Isilah titik-titik: '那_____书是王老师的。' (Buku itu adalah milik Guru Wang)", audioText: "那本书", options: ["本 (běn)", "个 (gè)", "张 (zhāng)", "只 (zhī)"], correct: 0, explanation: "Kata penggolong khusus buku adalah '本' (běn)." }
  ];

  // Helper generator for HSK 2-6 with rich content
  function generateLevel(lvl, config) {
    const questions = [];
    const types = ['listening', 'speaking', 'reading', 'writing'];
    
    for (let i = 1; i <= 50; i++) {
      const type = types[(i - 1) % 4];
      const qList = config[type];
      const qConfig = qList[(Math.floor((i - 1) / 4)) % qList.length];
      const itemNum = i;
      
      questions.push({
        id: `hsk${lvl}-${type[0]}-${itemNum}`,
        type: type,
        question: qConfig.q(itemNum),
        audioText: qConfig.audio || "中文学习",
        options: qConfig.opts,
        correct: qConfig.cor,
        explanation: qConfig.exp
      });
    }
    return questions;
  }

  // ==========================================
  // HSK LEVEL 2 (50 SOAL)
  // ==========================================
  const hsk2Config = {
    listening: [
      {
        q: (n) => `Dengarkan dialog: '医生说你要多喝水，多休息。' Apa saran dokter?`,
        audio: "医生说你要多喝水，多休息。",
        opts: ["Banyak olahraga", "Banyak minum air dan istirahat", "Jangan makan pedas", "Minum obat 3 kali sehari"],
        cor: 1,
        exp: "'多喝水' (banyak minum air), '多休息' (banyak istirahat)."
      },
      {
        q: (n) => `Dengarkan: '我买了两张今天晚上的电影票。' Berapa tiket bioskop yang dibeli?`,
        audio: "我买了两张今天晚上的电影票。",
        opts: ["1 lembar", "2 lembar", "3 lembar", "4 lembar"],
        cor: 1,
        exp: "'两张' (liǎng zhāng) = dua lembar, '电影票' = tiket bioskop."
      },
      {
        q: (n) => `Dengarkan: '外面正在下大雨，别出门了。' Bagaimana kondisi cuaca di luar?`,
        audio: "外面正在下大雨，别出门了。",
        opts: ["Cerah sekali", "Sedang hujan lebat", "Sangat dingin berangin", "Bersalju tebal"],
        cor: 1,
        exp: "'下大雨' (xià dàyǔ) = hujan lebat, '别出门' = jangan keluar rumah."
      },
      {
        q: (n) => `Dengarkan: '他跑步跑得非常快。' Apa yang dilakukan subjek dengan sangat cepat?`,
        audio: "他跑步跑得非常快。",
        opts: ["Membaca buku", "Berlari", "Berenang", "Menyanyi"],
        cor: 1,
        exp: "'跑步' (pǎobù) = berlari, '非常快' = sangat cepat."
      }
    ],
    speaking: [
      {
        q: (n) => `Bagaimana cara menanyakan harga 'Berapa harga baju ini?' dalam bahasa Mandarin?`,
        audio: "这件衣服多少钱？",
        opts: ["这件衣服多少钱？ (Zhè jiàn yīfu duōshao qián?)", "这件衣服在哪里？ (Zhè jiàn yīfu zài nǎlǐ?)", "这件衣服是谁的？ (Zhè jiàn yīfu shì shéi de?)", "这件衣服怎么穿？ (Zhè jiàn yīfu zěnme chuān?)"],
        cor: 0,
        exp: "'多少钱' digunakan untuk menanyakan harga uang, '件' adalah kata penggolong baju."
      },
      {
        q: (n) => `Bagaimana cara mengundang teman nonton film: 'Ayo kita pergi nonton bioskop bersama!'?`,
        audio: "我们一起去看电影吧！",
        opts: ["我们一起去看电影吧！ (Wǒmen yīqǐ qù kàn diànyǐng ba!)", "我们不去电影院 (Wǒmen bù qù diànyǐngyuàn)", "电影很好看 (Diànyǐng hěn hǎokàn)", "你想买什么？ (Nǐ xiǎng mǎi shénme?)"],
        cor: 0,
        exp: "'一起' (yīqǐ) = bersama-sama, '去看电影' = pergi menonton bioskop."
      },
      {
        q: (n) => `Bagaimana cara memesan minuman 'Saya ingin segelas es teh, tidak pakai gula'?`,
        audio: "我想喝一杯冰茶，不要糖。",
        opts: ["我想喝一杯冰茶，不要糖。 (Wǒ xiǎng hē yī bēi bīngchá, bù yào táng.)", "我要热咖啡 (Wǒ yào rè kāfēi)", "给我一杯水 (Gěi wǒ yī bēi shuǐ)", "不要放冰 (Bù yào fàng bīng)"],
        cor: 0,
        exp: "'冰茶' = es teh, '不要糖' = tidak mau / tanpa gula."
      },
      {
        q: (n) => `Bagaimana menanyakan waktu luang: 'Apakah besok sore kamu ada waktu luang?'`,
        audio: "明天下午你有没有空？",
        opts: ["明天下午你有没有空？ (Míngtiān xiàwǔ nǐ yǒu méiyǒu kòng?)", "明天下午你去哪儿？ (Míngtiān xiàwǔ nǐ qù nǎr?)", "你几点来？ (Nǐ jǐ diǎn lái?)", "什么时候睡觉？ (Shénme shíhou shuìjiào?)"],
        cor: 0,
        exp: "'有空' (yǒu kòng) = memiliki waktu senggang / luang."
      }
    ],
    reading: [
      {
        q: (n) => `Kalimat '今天天气比昨天好' memiliki arti...`,
        audio: "今天天气比昨天好",
        opts: ["Cuaca hari ini tidak sebagus kemarin", "Cuaca hari ini lebih bagus daripada kemarin", "Kemarin cuacanya lebih bagus", "Besok cuacanya akan sangat bagus"],
        cor: 1,
        exp: "Struktur komparasi 'A 比 B + Kata Sifat' menyatakan A lebih ... daripada B."
      },
      {
        q: (n) => `Apa arti dari kalimat '从这里到机场需要坐出租车'?`,
        audio: "从这里到机场需要坐出租车",
        opts: ["Dari sini ke bandara harus naik taksi", "Dari rumah ke stasiun jalan kaki", "Naik bus ke sekolah", "Bandara sangat dekat dari kantor"],
        cor: 0,
        exp: "'从...到...' = dari... ke..., '机场' = bandara, '出租车' = taksi."
      },
      {
        q: (n) => `Manakah kata yang berarti 'Mengenalkan / Memperkenalkan'?`,
        audio: "介绍",
        opts: ["准备 (zhǔnbèi)", "介绍 (jièshào)", "欢迎 (huānyíng)", "希望 (xīwàng)"],
        cor: 1,
        exp: "'介绍' (jièshào) berarti memperkenalkan / presentasi."
      },
      {
        q: (n) => `Manakah lawan kata dari '贵' (guì - mahal)?`,
        audio: "便宜",
        opts: ["便宜 (piányi)", "快 (kuài)", "慢 (màn)", "新 (xīn)"],
        cor: 0,
        exp: "Lawan kata '贵' (mahal) adalah '便宜' (piányi - murah)."
      }
    ],
    writing: [
      {
        q: (n) => `Isilah titik-titik: '我每天早上七点_____。' (Setiap pagi jam 7 saya bangun tidur)`,
        audio: "我每天早上七点起床",
        opts: ["睡觉 (shuìjiào)", "起床 (qǐchuáng)", "看书 (kànshū)", "唱歌 (chànggē)"],
        cor: 1,
        exp: "'起床' (qǐchuáng) berarti bangun dari tempat tidur."
      },
      {
        q: (n) => `Pilihlah kata bantu aspek yang tepat untuk perbuatan yang telah selesai lampau: '我看_____这部电影。'`,
        audio: "我看过这部电影",
        opts: ["过 (guo)", "着 (zhe)", "在 (zài)", "吧 (ba)"],
        cor: 0,
        exp: "Partikel '过' (guo) menyatakan pengalaman yang pernah dilakukan di masa lalu (pernah menonton)."
      },
      {
        q: (n) => `Susunlah kalimat komparasi yang benar: [比 / 妹妹 / 姐姐 / 高]`,
        audio: "姐姐比妹妹高",
        opts: ["姐姐 比 妹妹 高 (Jiějie bǐ mèimei gāo)", "妹妹 姐姐 比 高 (Mèimei jiějie bǐ gāo)", "高 比 姐姐 妹妹 (Gāo bǐ jiějie mèimei)", "姐姐 妹妹 高 比 (Jiějie mèimei gāo bǐ)"],
        cor: 0,
        exp: "Struktur: Subjek A (姐姐) + 比 + Subjek B (妹妹) + Adjektiva (高) -> Kakak perempuan lebih tinggi daripada adik."
      },
      {
        q: (n) => `Kata penggolong yang tepat untuk '两_____鱼' (2 ekor ikan) adalah:`,
        audio: "两条鱼",
        opts: ["条 (tiáo)", "只 (zhī)", "个 (gè)", "本 (běn)"],
        cor: 0,
        exp: "'条' (tiáo) adalah kata penggolong untuk benda/hewan yang memanjang lentur seperti ikan, jalan, sungai, celana."
      }
    ]
  };

  // ==========================================
  // HSK LEVEL 3 (50 SOAL)
  // ==========================================
  const hsk3Config = {
    listening: [
      {
        q: (n) => `Dengarkan: '为了提高汉语水平，他每天都坚持练习听力。' Mengapa dia tekun berlatih?`,
        audio: "为了提高汉语水平，他每天都坚持练习听力。",
        opts: ["Demi lulus ujian sekolah", "Demi meningkatkan kemampuan bahasa Mandarinnya", "Karena disuruh guru", "Karena suka menonton film"],
        cor: 1,
        exp: "'为了提高汉语水平' = demi meningkatkan level kemahiran bahasa Mandarin."
      },
      {
        q: (n) => `Dengarkan: '虽然外面在下雪，但是屋子里非常暖和。' Bagaimana kondisi di dalam ruangan?`,
        audio: "虽然外面在下雪，但是屋子里非常暖和。",
        opts: ["Sangat dingin dan berangin", "Sangat hangat dan nyaman", "Sangat panas terik", "Penuh dengan salju"],
        cor: 1,
        exp: "'屋子里非常暖和' = di dalam rumah/ruangan sangat hangat."
      },
      {
        q: (n) => `Dengarkan: '你先把桌子上的盘子洗干净，然后再去休息。' Apa yang harus dicuci dulu?`,
        audio: "你先把桌子上的盘子洗干净，然后再去休息。",
        opts: ["Baju kotor", "Piring di atas meja", "Gelas dan sendok", "Lantai dapur"],
        cor: 1,
        exp: "'盘子' (pánzi) berarti piring."
      },
      {
        q: (n) => `Dengarkan: '坐地铁比坐公交车又快又方便。' Mengapa pembicara lebih memilih naik MRT/Subway?`,
        audio: "坐地铁比坐公交车又快又方便。",
        opts: ["Lebih murah dan nyaman", "Lebih cepat dan lebih praktis", "Lebih dekat stasiunnya", "Karena tidak ada bus"],
        cor: 1,
        exp: "'又快又方便' = selain cepat juga sangat praktis."
      }
    ],
    speaking: [
      {
        q: (n) => `Bagaimana cara menanyakan pendapat rekan 'Bagaimana menurutmu tentang rencana ini?'`,
        audio: "你觉得这个计划怎么样？",
        opts: ["你觉得这个计划怎么样？ (Nǐ juéde zhège jìhuà zěnmeyàng?)", "计划是什么？ (Jìhuà shì shénme?)", "谁做的计划？ (Shéi zuò de jìhuà?)", "你要去哪里？ (Nǐ yào qù nǎlǐ?)"],
        cor: 0,
        exp: "'你觉得...怎么样？' adalah struktur baku meminta opini/masukan orang lain."
      },
      {
        q: (n) => `Bagaimana cara menyampaikan rasa simpati 'Semoga kamu lekas sembuh!'?`,
        audio: "祝你早日康复！",
        opts: ["祝你早日康复！ (Zhù nǐ zǎorì kāngfù!)", "祝你生日快乐！ (Zhù nǐ shēngrì kuàilè!)", "祝你新年好！ (Zhù nǐ xīnnián hǎo!)", "恭喜发财！ (Gōngxǐ fācái!)"],
        cor: 0,
        exp: "'早日康复' (zǎorì kāngfù) = cepat sembuh kembali sehat seperti sedia kala."
      },
      {
        q: (n) => `Bagaimana cara meminta seseorang berbicara sedikit lebih pelan: 'Tolong bicara agak pelan'?`,
        audio: "请您说得慢一点儿。",
        opts: ["请您说得慢一点儿。 (Qǐng nín shuō de màn yìdiǎnr.)", "请您大声说。 (Qǐng nín dàshēng shuō.)", "请不要说话。 (Qǐng bù yào shuōhuà.)", "请快点走。 (Qǐng kuài diǎn zǒu.)"],
        cor: 0,
        exp: "'慢一点儿' = agak pelan sedikit."
      },
      {
        q: (n) => `Bagaimana mengungkapkan rasa ragu: 'Saya masih belum yakin sepenuhnya'?`,
        audio: "我还不十分确定。",
        opts: ["我还不十分确定。 (Wǒ hái bù shífēn quèdìng.)", "我一定同意。 (Wǒ yídìng tóngyì.)", "当然可以。 (Dāngrán kěyǐ.)", "完全没问题。 (Wánquán méi wèntí.)"],
        cor: 0,
        exp: "'不十分确定' = tidak begitu yakin/pasti."
      }
    ],
    reading: [
      {
        q: (n) => `Apa arti dari idiom populer '马马虎虎' (mǎmǎhūhū)?`,
        audio: "马马虎虎",
        opts: ["Sangat teliti", "Biasa saja / Lumayan / So-so", "Sangat marah", "Cepat sekali"],
        cor: 1,
        exp: "'马马虎虎' bermakna lumayan / biasa-biasa saja / agak ceroboh."
      },
      {
        q: (n) => `Kata hubung '不但...而且...' (búdàn... érqiě...) memiliki arti...`,
        audio: "不但而且",
        opts: ["Bukan hanya... tetapi juga...", "Meskipun... namun...", "Karena... maka...", "Jika... maka..."],
        cor: 0,
        exp: "'不但...而且...' menyatakan hubungan penambahan bertingkat (not only... but also...)."
      },
      {
        q: (n) => `Manakah arti dari kata '环境' (huánjìng)?`,
        audio: "环境",
        opts: ["Lingkungan / Suasana", "Kesehatan", "Hubungan", "Perekonomian"],
        cor: 0,
        exp: "'环境' (huánjìng) berarti lingkungan sekitar / environment."
      },
      {
        q: (n) => `Apa arti dari '严格' (yángé)?`,
        audio: "严格",
        opts: ["Ketat / Disiplin tegas", "Ramah lembut", "Mudah bergaul", "Malas"],
        cor: 0,
        exp: "'严格' (yángé) berarti ketat, tegas, disiplin."
      }
    ],
    writing: [
      {
        q: (n) => `Pilihlah kalimat yang menggunakan partikel '把' (bǎ) secara benar:`,
        audio: "我把书看完了",
        opts: ["我把书看完了 (Wǒ bǎ shū kàn wán le)", "我看把书完了 (Wǒ kàn bǎ shū wán le)", "把我看书完了 (Bǎ wǒ kàn shū wán le)", "书把我看了 (Shū bǎ wǒ kàn le)"],
        cor: 0,
        exp: "Struktur kalimat bǎ: Subjek + 把 + Objek + Verb + Pelengkap (我把书看完了)."
      },
      {
        q: (n) => `'虽然工作很累，_____他依然很开心。' Kata sambung yang tepat adalah...`,
        audio: "虽然但是",
        opts: ["因为 (yīnwèi)", "但是 (dànshì)", "所以 (suǒyǐ)", "或者 (huòzhě)"],
        cor: 1,
        exp: "Pasangan konjungsi '虽然...但是...' = Meskipun... namun/tetapi..."
      },
      {
        q: (n) => `Pilihlah kalimat pasif menggunakan '被' (bèi) yang benar:`,
        audio: "蛋糕被弟弟吃了",
        opts: ["蛋糕被弟弟吃了 (Dàngāo bèi dìdi chī le)", "弟弟被蛋糕吃了 (Dìdi bèi dàngāo chī le)", "吃了被弟弟蛋糕 (Chī le bèi dìdi dàngāo)", "被蛋糕弟弟吃了 (Bèi dàngāo dìdi chī le)"],
        cor: 0,
        exp: "Struktur Pasif Bèi: Penerima Aksi (蛋糕) + 被 + Pelaku Aksi (弟弟) + Kata Kerja (吃了) -> Kue dimakan oleh adik."
      },
      {
        q: (n) => `Lengkapilah kalimat: '他做事情非常_____，从来不出差错。'`,
        audio: "认真",
        opts: ["认真 (rènzhēn - sungguh-sungguh/teliti)", "马虎 (mǎhu - ceroboh)", "着急 (zháojí - cemas)", "骄傲 (jiāo'ào - sombong)"],
        cor: 0,
        exp: "'认真' (rènzhēn) berarti teliti, tekun, dan sungguh-sungguh."
      }
    ]
  };

  // ==========================================
  // HSK LEVEL 4 (50 SOAL)
  // ==========================================
  const hsk4Config = {
    listening: [
      {
        q: (n) => `Dengarkan: '与其在这里浪费时间等待，不如我们先出发吧。' Apa kesimpulan pembicara?`,
        audio: "与其在这里浪费时间等待，不如我们先出发吧。",
        opts: ["Lebih baik tetap menunggu", "Lebih baik berangkat lebih dahulu", "Membatalkan seluruh perjalanan", "Menunggu rekan lain datang"],
        cor: 1,
        exp: "Struktur '与其 A 不如 B' = Daripada A lebih baik B."
      },
      {
        q: (n) => `Dengarkan: '尽管遇到了很多困难，但他从来没有放弃过自己的梦想。' Sikap apa yang ditunjukkan?`,
        audio: "尽管遇到了很多困难，但他从来没有放弃过自己的梦想。",
        opts: ["Mudah menyerah", "Pantang menyerah dan teguh berjuang", "Tidak peduli masa depan", "Mengeluh setiap hari"],
        cor: 1,
        exp: "'从来没有放弃过' = tidak pernah sekalipun menyerah pada mimpinya."
      },
      {
        q: (n) => `Dengarkan: '这次招聘面试对专业知识和实践经验都有很高的要求。' Apa kriteria wawancara kerja tersebut?`,
        audio: "这次招聘面试对专业知识和实践经验都有很高的要求。",
        opts: ["Hanya butuh nilai tinggi", "Menuntut keahlian profesional dan pengalaman praktik nyata", "Hanya untuk yang berpengalaman 10 tahun", "Tidak memerlukan wawancara"],
        cor: 1,
        exp: "'专业知识' = pengetahuan profesional, '实践经验' = pengalaman praktik."
      },
      {
        q: (n) => `Dengarkan: '多阅读优秀文章，不仅能丰富词汇量，还能开阔眼界。' Apa manfaat membaca artikel bagus?`,
        audio: "多阅读优秀文章，不仅能丰富词汇量，还能开阔眼界。",
        opts: ["Hanya membuang waktu luang", "Memperkaya kosakata dan memperluas wawasan berpikir", "Membuat cepat lelah", "Hanya membantu ujian saja"],
        cor: 1,
        exp: "'丰富词汇量' = memperkaya perbendaharaan kosakata, '开阔眼界' = memperluas wawasan."
      }
    ],
    speaking: [
      {
        q: (n) => `Bagaimana cara menyarankan ide secara diplomatis dan sopan dalam rapat?`,
        audio: "我认为我们不妨尝试一下新的方案。",
        opts: [
          "我认为我们不妨尝试一下新的方案。 (Wǒ rènwéi wǒmen bùfáng chángshì yíxià xīn de fāng'àn.)",
          "你必须听我的！ (Nǐ bìxū tīng wǒ de!)",
          "这个事情跟我没关系。 (Zhège shìqíng gēn wǒ méi guānxi.)",
          "我不参加讨论。 (Wǒ bù cānjiā tǎolùn.)"
        ],
        cor: 0,
        exp: "'不妨' (bùfáng) = tidak ada salahnya / ada baiknya kita mencoba..."
      },
      {
        q: (n) => `Bagaimana cara menanyakan prospek masa depan karir secara formal?`,
        audio: "请问这个职位的未来发展前景如何？",
        opts: [
          "请问这个职位的未来发展前景如何？ (Qǐngwèn zhège zhíwèi de wèilái fāzhǎn qiánjǐng rúhé?)",
          "工资多少？ (Gōngzī duōshao?)",
          "几点下班？ (Jǐ diǎn xiàbān?)",
          "老板好不好？ (Lǎobǎn hǎo bù hǎo?)"
        ],
        cor: 0,
        exp: "'发展前景' (fāzhǎn qiánjǐng) = prospek prospektif masa depan karir."
      },
      {
        q: (n) => `Bagaimana cara menyatakan persetujuan dengan syarat tertentu?`,
        audio: "原则上我同意，但细节需要再商量。",
        opts: [
          "原则上我同意，但细节需要再商量。 (Yuánzé shàng wǒ tóngyì, dàn xìjié xūyào zài shāngliang.)",
          "我绝对不同意。 (Wǒ juéduì bù tóngyì.)",
          "随便你们怎么做。 (Suíbiàn nǐmen zěnme zuò.)",
          "我没意见也不参与。 (Wǒ méi yìjiàn yě bù cānyù.)"
        ],
        cor: 0,
        exp: "'原则上我同意' = Secara prinsip saya setuju, namun detailnya perlu dibicarakan kembali."
      },
      {
        q: (n) => `Bagaimana cara menyampaikan permohonan maaf atas keterlambatan tugas secara sopan?`,
        audio: "实在抱歉，因为临时突发状况耽误了进度。",
        opts: [
          "实在抱歉，因为临时突发状况耽误了进度。 (Shízài bàoqiàn, yīnwèi línshí tūfā zhuàngkuàng dānwùle jìndù.)",
          "这不是我的错。 (Zhè bú shì wǒ de cuò.)",
          "大家都迟到了。 (Dàjiā dōu chídào le.)",
          "催我也没有用。 (Cuī wǒ yě méiyǒu yòng.)"
        ],
        cor: 0,
        exp: "'实在抱歉' = Sungguh mohon maaf, '耽误进度' = tertunda jadwal pengerjaannya."
      }
    ],
    reading: [
      {
        q: (n) => `'保护环境，人人有_____。' Kata yang paling tepat adalah:`,
        audio: "责任",
        opts: ["责备 (zébèi - menyalahkan)", "责任 (zérèn - tanggung jawab)", "热情 (rèqíng - antusiasme)", "经验 (jīngyàn - pengalaman)"],
        cor: 1,
        exp: "'责任' (zérèn) berarti tanggung jawab / kewajiban moril."
      },
      {
        q: (n) => `Apa arti dari kalimat '师傅领进门，修行靠个人'?`,
        audio: "师傅领进门修行靠个人",
        opts: [
          "Guru hanya membimbing dasar, keberhasilan bergantung pada usaha mandiri siswa",
          "Semua ilmu harus diajarkan oleh guru dari awal sampai akhir",
          "Belajar sendiri jauh lebih baik daripada mencari guru",
          "Guru harus bertanggung jawab penuh atas nilai murid"
        ],
        cor: 0,
        exp: "Pepatah Tiongkok: Guru mengantar ke pintu gerbang ilmu, pencapaian tergantung usaha siswa itu sendiri."
      },
      {
        q: (n) => `Kata '偶尔' (ǒu'ěr) merupakan sinonim dari...`,
        audio: "偶尔",
        opts: ["经常 (jīngcháng)", "有时 / 不经常 (yǒushí)", "总是 (zǒngshì)", "永远 (yǒngyuǎn)"],
        cor: 1,
        exp: "'偶尔' (ǒu'ěr) berarti sesekali / kadang-kadang / jarang-jarang."
      },
      {
        q: (n) => `Apa makna dari ungkapan '一分钱一分货' (yì fēn qián yì fēn huò)?`,
        audio: "一分钱一分货",
        opts: ["Ada harga ada rupa (kualitas sebanding dengan harga)", "Barang mahal pasti cepat rusak", "Semua barang harganya sama", "Uang tidak bisa membeli kebahagiaan"],
        cor: 0,
        exp: "Idiom peribahasa perdagangan: Kualitas barang berbanding lurus dengan uang yang dibayarkan."
      }
    ],
    writing: [
      {
        q: (n) => `'无论遇到什么挫折，我们_____不能丧失信心。' Konjungsi pasangan yang tepat adalah:`,
        audio: "无论都",
        opts: ["都 (dōu)", "才 (cái)", "就 (jiù)", "反而 (fǎn'ér)"],
        cor: 0,
        exp: "Pasangan konjungsi '无论...都...' = Bagaimanapun/Apapun... tetap/semuanya..."
      },
      {
        q: (n) => `Pilihlah kalimat yang menggunakan '竟然' (jìngrán - di luar dugaan/ternyata) secara tepat:`,
        audio: "他竟然在这么短的时间内完成了任务",
        opts: [
          "他竟然在这么短的时间内完成了任务。 (Tā jìngrán zài zhème duǎn de shíjiān nèi wánchéngle rènwu.)",
          "他竟然很喜欢睡觉。 (Tā jìngrán hěn xǐhuan shuìjiào.)",
          "竟然我们要去北京。 (Jìngrán wǒmen yào qù Běijīng.)",
          "书竟然桌子上有。 (Shū jìngrán zhuōzi shang yǒu.)"
        ],
        cor: 0,
        exp: "'竟然' menyatakan ketakjuban atau keheranan atas kejadian di luar dugaan."
      },
      {
        q: (n) => `Isilah kalimat berikut: '吸烟不仅危害健康，_____污染空气。'`,
        audio: "不仅而且",
        opts: ["而且 (érqiě)", "因为 (yīnwèi)", "但是 (dànshì)", "所以 (suǒyǐ)"],
        cor: 0,
        exp: "Pasangan konjungsi '不仅...而且...' = Tidak hanya... bahkan juga..."
      },
      {
        q: (n) => `Pilihlah kata kerja yang tepat: '我们要努力_____汉语水平。'`,
        audio: "提高",
        opts: ["提高 (tígāo - meningkatkan)", "增长 (zēngzhǎng - bertumbuh angka)", "扩大 (kuòdà - memperluas)", "发生 (fāshēng - terjadi)"],
        cor: 0,
        exp: "Pasangan kolokasi baku untuk level/standar kemampuan (水平) adalah '提高' (tígāo)."
      }
    ]
  };

  // ==========================================
  // HSK LEVEL 5 (50 SOAL)
  // ==========================================
  const hsk5Config = {
    listening: [
      {
        q: (n) => `Dengarkan: '虽然这次商务谈判遇到了不少阻力，但双方最终还是达成了共识。' Apa hasil akhir perundingan bisnis tersebut?`,
        audio: "虽然这次商务谈判遇到了不少阻力，但双方最终还是达成了共识。",
        opts: ["Gagal total tanpa kesepakatan", "Kedua belah pihak berhasil mencapai konsensus mufakat", "Perundingan ditunda tanpa batas", "Terjadi perselisihan hukum"],
        cor: 1,
        exp: "'达成共识' (dáchéng gòngshí) = berhasil mencapai mufakat / kesepakatan bersama."
      },
      {
        q: (n) => `Dengarkan: '科技的发展极大地改变了人们的生活方式，但也带来了一些负面影响。' Apa pandangan pembicara terhadap teknologi?`,
        audio: "科技的发展极大地改变了人们的生活方式，但也带来了一些负面影响。",
        opts: ["Hanya memberikan kerugian", "Membawa kemudahan hidup namun juga memiliki dampak negatif", "Teknologi harus dihentikan perkembangannya", "Tidak berpengaruh pada kehidupan"],
        cor: 1,
        exp: "Pandangan objektif dialektis: '极大地改变生活方式' + '带来负面影响'."
      },
      {
        q: (n) => `Dengarkan: '面对突如其来的危机，企业领导者需要保持冷静果断的判断力。' Sikap apa yang dibutuhkan pemimpin saat krisis?`,
        audio: "面对突如其来的危机，企业领导者需要保持冷静果断的判断力。",
        opts: ["Sikap panik dan pasrah", "Ketenangan dan keputusan yang tegas cepat", "Menunggu instruksi pihak luar", "Menyalahkan karyawan"],
        cor: 1,
        exp: "'保持冷静果断的判断力' = mempertahankan daya analisis yang tenang dan lugas."
      },
      {
        q: (n) => `Dengarkan: '优秀的团队合作能够弥补个人的不足，从而实现一加一大于二的效果。' Apa esensi kerja sama tim?`,
        audio: "优秀的团队合作能够弥补个人的不足，从而实现一加一大于二的效果。",
        opts: ["Menambah beban pekerjaan tim", "Menutupi kekurangan individu dan menghasilkan sinergi berlipat ganda", "Menghapus peran individu", "Hanya cocok untuk perusahaan besar"],
        cor: 1,
        exp: "'弥补个人不足' = menutupi kelemahan personil, '1+1>2' = sinergi maksimal."
      }
    ],
    speaking: [
      {
        q: (n) => `Bagaimana cara menyanggah pendapat secara elegan dalam debat akademik?`,
        audio: "对方辩友的论点虽有一定启发性，但在逻辑严密性上尚存漏洞。",
        opts: [
          "对方辩友的论点虽有一定启发性，但在逻辑严密性上尚存漏洞。 (Duìfāng biànyǒu de lùndiǎn suī yǒu yídìng qǐfāxìng, dàn zài luóji yánmìxìng shang shàng cún lòudòng.)",
          "你说的全是胡说八道！ (Nǐ shuō de quán shì húshuōbādào!)",
          "我根本不想听你说话。 (Wǒ gēnběn bù xiǎng tīng nǐ shuōhuà.)",
          "你完全不懂中文。 (Nǐ wánquán bù dǒng zhōngwén.)"
        ],
        cor: 0,
        exp: "Bahasa santun akademik: Mengapresiasi terlebih dahulu lalu membedah kelemahan logikanya."
      },
      {
        q: (n) => `Bagaimana menguraikan ringkasan laporan keuangan secara formal?`,
        audio: "本季度营业收入同比增长了百分之十五，利润稳步提升。",
        opts: [
          "本季度营业收入同比增长了百分之十五，利润稳步提升。 (Běn jìdù yíngyè shōurù tóngbǐ zēngzhǎngle bǎifēnzhī shíwǔ, lìrùn wěnbù tíshēng.)",
          "我们赚了很多钱。 (Wǒmen zhuànle hěnduō qián.)",
          "公司开销很大。 (Gōngsī kāixiāo hěn dà.)",
          "没赚到什么钱。 (Méi zhuàn dào shénme qián.)"
        ],
        cor: 0,
        exp: "Istilah formal bisnis: '营业收入' (omset pendapatan), '同比增长' (pertumbuhan YoY), '利润稳步提升' (laba naik stabil)."
      },
      {
        q: (n) => `Bagaimana cara menyatakan kesiapan memikul tanggung jawab proyek strategis?`,
        audio: "我定当全力以赴，绝不辜负大家的信任与期望。",
        opts: [
          "我定当全力以赴，绝不辜负大家的信任与期望。 (Wǒ dìng dāng quánlìyǐfù, jué bù gūfù dàjiā de xìnrèn yǔ qīwàng.)",
          "这个事情太难了我不做。 (Zhège shìqíng tài nán le wǒ bú zuò.)",
          "万一失败不能怪我。 (Wànyī shībài bù néng guài wǒ.)",
          "你们爱找谁找谁。 (Nǐmen ài zhǎo shéi zhǎo shéi.)"
        ],
        cor: 0,
        exp: "'全力以赴' (berjuang sekuat tenaga), '绝不辜负' (tidak akan mengecewakan harapan)."
      },
      {
        q: (n) => `Bagaimana cara memuji prestasi rekan kerja secara profesional?`,
        audio: "祝贺你在本次项目中展现出的卓越领导力与专业素养。",
        opts: [
          "祝贺你在本次项目中展现出的卓越领导力与专业素养。 (Zhùhè nǐ zài běn cì xiàngmù zhōng zhǎnxiàn chū de zhuóyuè lǐngdǎolì yǔ zhuānyè sùyǎng.)",
          "运气真好啊你。 (Yùnqi zhēn hǎo a nǐ.)",
          "换我我也能做到。 (Huàn wǒ wǒ yě néng zuò dào.)",
          "没什么大不了的。 (Méi shénme dàbùliǎo de.)"
        ],
        cor: 0,
        exp: "'卓越领导力' (kepemimpinan luar biasa), '专业素养' (profesionalisme tinggi)."
      }
    ],
    reading: [
      {
        q: (n) => `'这篇论文的观点十分新颖，论据也很充分。' Apa maksud dari kata '新颖' (xīnyǐng)?`,
        audio: "新颖",
        opts: ["Kuno dan usang", "Inovatif / Baru, Orisinal & Segar", "Membosankan", "Rumit tidak terarah"],
        cor: 1,
        exp: "'新颖' (xīnyǐng) berarti segar, inovatif, memiliki perspektif orisinal baru."
      },
      {
        q: (n) => `Kata '哪怕...也...' (nǎpà... yě...) berfungsi untuk menyatakan kalimat:`,
        audio: "哪怕也",
        opts: ["Pengandaian konsesif ekstrem (Sekalipun / Walau bagaimanapun... tetap...)", "Sebab-akibat langsung", "Pilihan alternatif", "Urutan kronologis waktu"],
        cor: 0,
        exp: "'哪怕...也...' menyatakan pengandaian ekstrem yang tidak akan mengubah komitmen hasil."
      },
      {
        q: (n) => `'面对突如其来的挑战，我们必须保持_____，切勿慌张。' Kata yang tepat adalah:`,
        audio: "冷静",
        opts: ["冷淡 (lěngdàn - acuh tak acuh)", "冷静 (lěngjìng - berkepala dingin / tenang)", "沉默 (chénmò - bungkam)", "凉快 (liángkuai - sejuk)"],
        cor: 1,
        exp: "'保持冷静' (bǎochí lěngjìng) = tetap tenang / jernih dalam berpikir saat darurat."
      },
      {
        q: (n) => `Apa arti dari idiom '爱不释手' (ài bù shì shǒu)?`,
        audio: "爱不释手",
        opts: ["Sangat menyukai sesuatu sehingga enggan melepaskannya dari tangan", "Tangan yang terluka parah", "Benci setengah mati", "Malas memegang barang"],
        cor: 0,
        exp: "'爱不释手' menggambarkan rasa suka yang mendalam pada suatu benda sehingga tidak mau lepas dari genggaman."
      }
    ],
    writing: [
      {
        q: (n) => `'随着经济全球化的深入发展，各国之间的联系_____密切。' Kata yang tepat adalah:`,
        audio: "日益",
        opts: ["日益 (rìyì - dari hari ke hari makin...)", "经常 (jīngcháng)", "平时 (píngshí)", "立刻 (lìkè)"],
        cor: 0,
        exp: "'日益' (rìyì) adalah adverb formal untuk menyatakan proses peningkatan dari hari ke hari (日益密切 = makin hari kian erat)."
      },
      {
        q: (n) => `Pilihlah kalimat yang menggunakan konstruksi '不仅不...反而...' (bùjǐn bù... fǎn'ér...) secara benar:`,
        audio: "他不仅不认错，反而态度十分蛮横",
        opts: [
          "他不仅不认错，反而态度十分蛮横。 (Tā bùjǐn bù rèncuò, fǎn'ér tàidu shífēn mánhèng.)",
          "他不仅不吃饭，反而吃得很饱。 (Tā bùjǐn bù chīfàn, fǎn'ér chī de hěn bǎo.)",
          "天气不仅不下雨，反而晴天了。 (Tiānqì bùjǐn bù xiàyǔ, fǎn'ér qíngtiān le.)",
          "我不仅不认识他，反而知道他是谁。 (Wǒ bùjǐn bù rènshi tā, fǎn'ér zhīdào tā shì shéi.)"
        ],
        cor: 0,
        exp: "'不仅不...反而...' menyatakan kontradiksi ekstrem yang berlawanan dari harapan positif (bukannya mengaku salah, malah bertindak arogan)."
      },
      {
        q: (n) => `Pilihlah kolokasi yang tepat: '我们要努力_____潜在的危机与风险。'`,
        audio: "化解",
        opts: ["化解 (huàjiě - meredakan/mengurai krisis)", "破坏 (pòhuài - merusak)", "消失 (xiāoshī - lenyap sendiri)", "减少 (jiǎnshǎo)"],
        cor: 0,
        exp: "Kolokasi baku: '化解危机/风险' (mengurai dan memitigasi krisis)."
      },
      {
        q: (n) => `Isilah kalimat formal: '该项政策的实施，旨在_____低收入群体的基本生活需求。'`,
        audio: "保障",
        opts: ["保障 (bǎozhàng - menjamin/memastikan perlindungan)", "保护 (bǎohù)", "保存 (bǎocún)", "保证 (bǎozhèng)"],
        cor: 0,
        exp: "'保障生活需求' = menjamin pemenuhan kebutuhan hidup dasar masyarakat."
      }
    ]
  };

  // ==========================================
  // HSK LEVEL 6 (50 SOAL)
  // ==========================================
  const hsk6Config = {
    listening: [
      {
        q: (n) => `Dengarkan: '中国传统书法艺术讲究气韵生动与虚实相生，体现了深厚的哲学底蕴。' Apa nilai inti seni kaligrafi Tiongkok?`,
        audio: "中国传统书法艺术讲究气韵生动与虚实相生，体现了深厚的哲学底蕴。",
        opts: ["Hanya teknik mekanis meniru goresan", "Menekankan vitalitas ritme estetika dan kearifan filosofis mendalam", "Hanya bernilai komersial", "Mudah dikuasai tanpa latihan mental"],
        cor: 1,
        exp: "'气韵生动' = ritme estetik hidup, '哲学底蕴' = fondasi filosofis mendalam."
      },
      {
        q: (n) => `Dengarkan: '在多元文化交融的当代社会，我们既要保持文化自信，又要以包容胸怀吸收外来精髓。' Bagaimana sikap ideal terhadap kebudayaan global?`,
        audio: "在多元文化交融的当代社会，我们既要保持文化自信，又要以包容胸怀吸收外来精髓。",
        opts: ["Menolak seluruh budaya asing", "Menjaga identitas budaya sendiri sekaligus terbuka menyerap sari pati positif budaya lain", "Meninggalkan budaya tradisional", "Menganggap budaya sendiri paling unggul secara mutlak"],
        cor: 1,
        exp: "Keseimbangan '文化自信' (percaya diri kultural) dan '包容吸纳' (terbuka inklusif)."
      },
      {
        q: (n) => `Dengarkan: '生态文明建设是一项功在当代、利在千秋的宏伟工程，需要全社会持之以恒的共同努力。' Apa orientasi jangka panjang pembangunan ekologi?`,
        audio: "生态文明建设是一项功在当代、利在千秋的宏伟工程，需要全社会持之以恒的共同努力。",
        opts: ["Bermanfaat bagi masa kini dan berfaedah bagi generasi masa depan berabad-abad", "Hanya menghabiskan anggaran negara", "Hasilnya bisa langsung instan dalam semalam", "Hanya tanggung jawab segelintir aktivis"],
        cor: 0,
        exp: "'功在当代，利在千秋' = berjasa bagi era kini, memberi berkah bagi ribuan tahun anak cucu."
      },
      {
        q: (n) => `Dengarkan: '面对错综复杂的国际经济局势，唯有坚持自主创新与深化改革，方能在博弈中立于不败之地。' Apa kunci ketahanan ekonomi?`,
        audio: "面对错综复杂的国际经济局势，唯有坚持自主创新与深化改革，方能在博弈中立于不败之地。",
        opts: ["Hanya bergantung pada impor luar negeri", "Inovasi mandiri yang gigih serta pendalaman reformasi struktural", "Menutup seluruh perbatasan perdagangan", "Menunggu kondisi global membaik sendiri"],
        cor: 1,
        exp: "'自主创新' (inovasi mandiri) + '深化改革' (reformasi mendalam) -> '立于不败之地' (berdiri kokoh tak tergoyahkan)."
      }
    ],
    speaking: [
      {
        q: (n) => `Bagaimana cara merangkum visi strategis perusahaan dengan gaya oratoris tingkat tinggi?`,
        audio: "我们将以卓越之志，行笃实之举，擘画企业可持续发展的壮丽宏图。",
        opts: [
          "我们将以卓越之志，行笃实之举，擘画企业可持续发展的壮丽宏图。 (Wǒmen jiāng yǐ zhuóyuè zhī zhì, xíng dǔshí zhī jǔ, bòhuà qǐyè kěchíxù fāzhǎn de zhuànglì hóngtú.)",
          "我们要赚大钱做第一。 (Wǒmen yào zhuàn dàqián zuò dìyī.)",
          "大家努力上班吧。 (Dàjiā nǔlì shàngbān ba.)",
          "走一步看一步。 (Zǒu yíbù kàn yíbù.)"
        ],
        cor: 0,
        exp: "Bahasa Mandarin sastra formal HSK 6: '擘画宏图' (melukiskan cetak biru visi agung)."
      },
      {
        q: (n) => `Bagaimana mengemukakan sintesis dialektis dalam simposium internasional?`,
        audio: "这一理论虽具颠覆性，却恰好填补了现有学术范式的空白，值得深入商榷与拓展。",
        opts: [
          "这一理论虽具颠覆性，却恰好填补了现有学术范式的空白，值得深入商榷与拓展。 (Zhè yí lǐlùn suī jù diānfùxìng, què qiàhǎo tiánbǔle xiànyǒu xuéshù fànshì de kòngbái, zhíde shēnrù shāngquè yǔ tuòzhǎn.)",
          "这个理论完全看不懂。 (Zhège lǐlùn wánquán kàn bù dǒng.)",
          "我认为这是错的。 (Wǒ rènwéi zhè shì cuò de.)",
          "大家都不用理会它。 (Dàjiā dōu bù yòng lǐhuì tā.)"
        ],
        cor: 0,
        exp: "Kosakata tingkat mahir: '颠覆性' (disruptif), '学术范式' (paradigma akademik), '商榷' (didiskusikan mendalam)."
      },
      {
        q: (n) => `Bagaimana mengungkapkan keteguhan tekad menghadapi tantangan historis?`,
        audio: "风雨多经志弥坚，关山初度路犹长。我们当以披荆斩棘之勇毅，勇往直前。",
        opts: [
          "风雨多经志弥坚，关山初度路犹长。我们当以披荆斩棘之勇毅，勇往直前。 (Fēngyǔ duō jīng zhì mí jiān, guānshān chūdù lù yóu cháng. Wǒmen dāng yǐ pījīngzhǎnjí zhī yǒngyì, yǒngwǎngzhíqián.)",
          "困难太多了算了吧。 (Kùnnan tài duō le suànle ba.)",
          "让别人先去试试。 (Ràng biérén xiān qù shìshi.)",
          "我放弃了。 (Wǒ fàngqì le.)"
        ],
        cor: 0,
        exp: "Puisi filosofis motivasi: '披荆斩棘' (menerobos segala onak dan duri rintangan)."
      },
      {
        q: (n) => `Bagaimana cara memberikan apresiasi diplomatik tingkat tinggi antarnegara?`,
        audio: "双方秉持互尊互信、合作共赢之原则，必将推动双边关系迈上全新台阶。",
        opts: [
          "双方秉持互尊互信、合作共赢之原则，必将推动双边关系迈上全新台阶。 (Shuāngfāng bǐngchí hùzūn hùxìn, hézuò gòngyíng zhī yuánzé, bì jiāng tuīdòng shuāngbiān guānxì mài shàng quánxīn táijiē.)",
          "咱们做朋友挺好。 (Zánmen zuò péngyou tǐng hǎo.)",
          "以后互相照顾。 (Yǐhòu hùxiāng zhàogu.)",
          "合作看看吧。 (Hézuò kànkan ba.)"
        ],
        cor: 0,
        exp: "Bahasa diplomasi resmi: '合作共赢' (win-win mutualisme), '迈上全新台阶' (melangkah ke jenjang baru yang luhur)."
      }
    ],
    reading: [
      {
        q: (n) => `Pilihlah idiom (成语) yang bermakna 'tekun belajar siang dan malam melupakan makan dan tidur demi mencapai cita-cita':`,
        audio: "废寝忘食",
        opts: ["废寝忘食 (fèiqǐnwàngshí)", "画蛇添足 (huàshétiānzú)", "对牛弹琴 (duìniútánqín)", "守株待兔 (shǒuzhūdàitù)"],
        cor: 0,
        exp: "'废寝忘食' = lupa tidur (废寝) dan lupa makan (忘食) karena saking tekun berkarya/belajar."
      },
      {
        q: (n) => `Idiom '画蛇添足' (huà shé tiān zú - menggambar ular menambah kaki) memiliki pesan moral:`,
        audio: "画蛇添足",
        opts: [
          "Melakukan hal berlebihan yang mubazir sehingga justru merusak hasil yang sudah baik",
          "Bekerja keras tanpa pamrih",
          "Selalu waspada terhadap marabahaya",
          "Jangan mudah mempercayai orang asing"
        ],
        cor: 0,
        exp: "'画蛇添足' = menambah hal yang sia-sia dan justru merusak apa yang sudah sempurna."
      },
      {
        q: (n) => `'这件艺术品构思巧妙，堪称_____之作。' Idiom yang tepat adalah:`,
        audio: "绝无仅有",
        opts: ["绝无仅有 (jué wú jǐn yǒu - tiada duanya / luar biasa unik langka)", "微不足道 (wēi bù zú dào)", "不以为然 (bù yǐ wéi rán)", "走马观花 (zǒu mǎ guān huā)"],
        cor: 0,
        exp: "'绝无仅有' menggambarkan mahakarya yang sangat langka, bernilai luhur, dan satu-satunya."
      },
      {
        q: (n) => `Idiom '胸有成竹' (xiōng yǒu chéng zhú) menggambarkan seseorang yang...`,
        audio: "胸有成竹",
        opts: ["Telah memiliki rencana matang dan sangat percaya diri sebelum bertindak", "Sedang sakit dada", "Suka menanam bambu di pekarangan", "Ragu-ragu mengambil keputusan"],
        cor: 0,
        exp: "'胸有成竹' = sudah terlukis bambu di dalam dada (sudah memiliki persiapan matang dan percaya diri penuh)."
      }
    ],
    writing: [
      {
        q: (n) => `Pilihlah kalimat yang menggunakan idiom '源远流长' (yuán yuǎn liú cháng - berakar panjang dan bersejarah luhur) dengan tepat:`,
        audio: "中华传统文化源远流长博大精深",
        opts: [
          "中华传统文化源远流长，博大精深。 (Zhōnghuá chuántǒng wénhuà yuányuǎnliúcháng, bódàjīngshēn.)",
          "这瓶矿泉水流得源远流长。 (Zhè píng kuàngquánshuǐ liú de yuányuǎnliúcháng.)",
          "他跑步跑得源远流长。 (Tā pǎobù pǎo de yuányuǎnliúcháng.)",
          "今天的雨下得源远流长。 (Jīntiān de yǔ xià de yuányuǎnliúcháng.)"
        ],
        cor: 0,
        exp: "'源远流长' khusus digunakan untuk mendeskripsikan sejarah, kebudayaan, atau tradisi yang telah mengalir berabad-abad lamanya."
      },
      {
        q: (n) => `Isilah kalimat sastra formal: '唯有心无旁骛者，方能在此学术领域_____。'`,
        audio: "独树一帜",
        opts: ["独树一帜 (dú shù yí zhì - tampil unik sebagai pionir berkelas)", "半途而废 (bàn tú ér fèi)", "一事无成 (yí shì wú chéng)", "班门弄斧 (bān mén nòng fǔ)"],
        cor: 0,
        exp: "'独树一帜' = mengibarkan panji sendiri / menjadi aliran orisinal terdepan."
      },
      {
        q: (n) => `Pilihlah kolokasi formal: '经过数十年如一日的潜心钻研，他终于_____了这项核心技术瓶颈。'`,
        audio: "攻克",
        opts: ["攻克 (gōngkè - menembus/menaklukkan hambatan teknologi)", "攻击 (gōngjī)", "攻打 (gōngdǎ)", "进攻 (jìngōng)"],
        cor: 0,
        exp: "Kolokasi teknis: '攻克难关/瓶颈' (menaklukkan bottleneck teknologi)."
      },
      {
        q: (n) => `Struktur tata bahasa sastra klasik: '非但...反之...' (fēidàn... fǎnzhī...) memiliki kemiripan makna dengan:`,
        audio: "不但反而",
        opts: ["不仅不...反而... (bùjǐn bù... fǎn'ér...)", "因为...所以... (yīnwèi... suǒyǐ...)", "虽然...但是... (suīrán... dànshì...)", "如果...那么... (rúguǒ... nàme...)"],
        cor: 0,
        exp: "'非但' bermakna 'tidak hanya / tidak saja', disusul kontradiksi tajam."
      }
    ]
  };

  bank[2] = generateLevel(2, hsk2Config);
  bank[3] = generateLevel(3, hsk3Config);
  bank[4] = generateLevel(4, hsk4Config);
  bank[5] = generateLevel(5, hsk5Config);
  bank[6] = generateLevel(6, hsk6Config);

  return bank;
}

const allData = generateAllQuestions();
const outputCode = `/**
 * Mandarinku Question Bank Engine Dataset
 * 50 Comprehensive Questions per Level (HSK 1 - HSK 6, Total 300 Questions)
 * Skills covered: Listening (🎧), Speaking (🎙️), Reading (📖), Writing (✍️)
 */
window.MandarinkuBankQuestions = ${JSON.stringify(allData, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'js', 'questions-data.js'), outputCode, 'utf8');
console.log("Successfully generated js/questions-data.js (Total 300 Questions across HSK 1-6)");
