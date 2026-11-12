const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/fitur_cerdas_data.json');
const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const expandedAnatomy = [
  // --- HSK 1 (Dasar) ---
  {
    id: 1,
    level: 1,
    char: "休",
    pinyin: "xiū",
    meaning: "Istirahat / Rehat",
    radA: "亻 (Orang)",
    radB: "木 (Pohon)",
    story: "Seseorang yang sedang bersandar santai di pohon rindang untuk melepas lelah setelah seharian bekerja."
  },
  {
    id: 2,
    level: 1,
    char: "明",
    pinyin: "míng",
    meaning: "Terang / Jelas",
    radA: "日 (Matahari)",
    radB: "月 (Bulan)",
    story: "Matahari di siang hari dan bulan di malam hari, bersatu memancarkan terang ke seluruh semesta."
  },
  {
    id: 3,
    level: 1,
    char: "好",
    pinyin: "hǎo",
    meaning: "Baik / Bagus",
    radA: "女 (Wanita / Ibu)",
    radB: "子 (Anak)",
    story: "Seorang ibu yang menggendong buah hatinya dengan penuh kasih melambangkan kebaikan sempurna."
  },
  {
    id: 4,
    level: 1,
    char: "看",
    pinyin: "kàn",
    meaning: "Melihat / Memandang",
    radA: "手 (Tangan)",
    radB: "目 (Mata)",
    story: "Meletakkan tangan di atas mata untuk memayungi pandangan dan melihat kejauhan."
  },
  {
    id: 5,
    level: 1,
    char: "男",
    pinyin: "nán",
    meaning: "Pria / Laki-laki",
    radA: "田 (Sawah)",
    radB: "力 (Tenaga / Kekuatan)",
    story: "Seseorang yang mengerahkan seluruh tenaga dan kekuatannya untuk mencangkul di sawah."
  },
  {
    id: 6,
    level: 1,
    char: "坐",
    pinyin: "zuò",
    meaning: "Duduk",
    radA: "从 (Dua orang)",
    radB: "土 (Tanah / Bumi)",
    story: "Dua orang sahabat duduk berdampingan di atas tanah untuk berbincang-bincang hangat."
  },

  // --- HSK 2 (Percakapan Sehari-hari) ---
  {
    id: 7,
    level: 2,
    char: "众",
    pinyin: "zhòng",
    meaning: "Orang banyak / Khalayak",
    radA: "人 (Orang)",
    radB: "从 (Dua orang)",
    story: "Tiga orang berkumpul bersama di satu tempat melambangkan khalayak ramai / masyarakat luas."
  },
  {
    id: 8,
    level: 2,
    char: "森",
    pinyin: "sēn",
    meaning: "Hutan belantara rimbun",
    radA: "木 (Pohon)",
    radB: "林 (Dua pohon)",
    story: "Tiga pohon yang berdiri berdampingan melambangkan hutan rimba yang sangat rimbun dan lebat."
  },
  {
    id: 9,
    level: 2,
    char: "家",
    pinyin: "jiā",
    meaning: "Rumah / Keluarga",
    radA: "宀 (Atap Rumah)",
    radB: "豕 (Babi Ternak)",
    story: "Zaman Tiongkok kuno, rumah yang makmur ditandai dengan adanya atap pelindung dan ternak di bawahnya."
  },
  {
    id: 10,
    level: 2,
    char: "问",
    pinyin: "wèn",
    meaning: "Bertanya / Mencari tahu",
    radA: "门 (Pintu gerbang)",
    radB: "口 (Mulut)",
    story: "Seseorang yang berdiri di depan pintu gerbang membuka mulutnya untuk menanyakan alamat."
  },
  {
    id: 11,
    level: 2,
    char: "间",
    pinyin: "jiān",
    meaning: "Ruangan / Sela waktu",
    radA: "门 (Pintu gerbang)",
    radB: "日 (Matahari)",
    story: "Sinar matahari menerobos masuk melalui celah sela-sela pintu gerbang rumah."
  },
  {
    id: 12,
    level: 2,
    char: "泪",
    pinyin: "lèi",
    meaning: "Air mata",
    radA: "氵 (Tetesan air)",
    radB: "目 (Mata)",
    story: "Tetesan air bening yang mengalir keluar dari kelopak mata saat terharu atau sedih."
  },

  // --- HSK 3 (Menengah Awal) ---
  {
    id: 13,
    level: 3,
    char: "语",
    pinyin: "yǔ",
    meaning: "Bahasa / Tutur kata",
    radA: "讠 (Kata / Ucapan)",
    radB: "吾 (Saya / Diri)",
    story: "Tutur kata yang keluar dari lubuk hati terdalam diri seseorang untuk berkomunikasi."
  },
  {
    id: 14,
    level: 3,
    char: "雷",
    pinyin: "léi",
    meaning: "Guntur / Petir",
    radA: "雨 (Hujan)",
    radB: "田 (Sawah)",
    story: "Hujan deras lebat di atas hamparan persawahan yang diiringi kilat dan petir menggelegar."
  },
  {
    id: 15,
    level: 3,
    char: "尖",
    pinyin: "jiān",
    meaning: "Runcing / Ujung tajam",
    radA: "小 (Kecil)",
    radB: "大 (Besar)",
    story: "Benda yang bagian bawahnya besar namun semakin mengecil ke bagian ujung atasnya (membentuk runcing)."
  },
  {
    id: 16,
    level: 3,
    char: "尘",
    pinyin: "chén",
    meaning: "Debu / Abu halus",
    radA: "小 (Kecil)",
    radB: "土 (Tanah)",
    story: "Partikel tanah berukuran sangat kecil yang melayang-layang tertiup angin di udara."
  },
  {
    id: 17,
    level: 3,
    char: "鸣",
    pinyin: "míng",
    meaning: "Kicau burung / Bersuara",
    radA: "口 (Mulut)",
    radB: "鸟 (Burung)",
    story: "Suara nyanyian kicauan merdu yang keluar dari paruh burung di pagi hari."
  },
  {
    id: 18,
    level: 3,
    char: "鲜",
    pinyin: "xiān",
    meaning: "Segar / Lezat",
    radA: "鱼 (Ikan)",
    radB: "羊 (Kambing)",
    story: "Perpaduan kuliner boga bahari ikan segar dan daging kambing menghasilkan rasa sedap tiada tara."
  },

  // --- HSK 4 (Menengah Mandiri) ---
  {
    id: 19,
    level: 4,
    char: "灾",
    pinyin: "zāi",
    meaning: "Bencana / Musibah",
    radA: "宀 (Atap Rumah)",
    radB: "火 (Api)",
    story: "Kobaran api yang membakar atap rumah menciptakan bencana kebakaran yang mengerikan."
  },
  {
    id: 20,
    level: 4,
    char: "苗",
    pinyin: "miáo",
    meaning: "Bibit / Tunas tanaman",
    radA: "艹 (Tumbuhan / Rumput)",
    radB: "田 (Sawah)",
    story: "Tumbuhan hijau muda yang baru saja bersemi dan bertunas di atas tanah persawahan."
  },
  {
    id: 21,
    level: 4,
    char: "困",
    pinyin: "kùn",
    meaning: "Terjebak / Mengantuk",
    radA: "囗 (Pagar kurungan)",
    radB: "木 (Pohon)",
    story: "Batang pohon yang terkurung di dalam pagar sempit membuat pertumbuhannya terhambat dan terjebak."
  },
  {
    id: 22,
    level: 4,
    char: "闪",
    pinyin: "shǎn",
    meaning: "Berkilap / Kilat cepat",
    radA: "门 (Pintu gerbang)",
    radB: "人 (Orang)",
    story: "Seseorang yang melintas sangat cepat di sela pintu hingga hanya terlihat sekilas secepat kilat."
  },
  {
    id: 23,
    level: 4,
    char: "歪",
    pinyin: "wāi",
    meaning: "Miring / Bengkok",
    radA: "不 (Tidak)",
    radB: "正 (Lurus / Benar)",
    story: "Suatu posisi atau sikap yang tidak lurus tegak, sehingga menjadi miring atau bengkok."
  },
  {
    id: 24,
    level: 4,
    char: "掰",
    pinyin: "bāi",
    meaning: "Membelah dengan dua tangan",
    radA: "手 (Tangan)",
    radB: "分 (Membagi)",
    story: "Dua tangan yang memegang satu benda lalu membaginya menjadi dua belahan bagian."
  },

  // --- HSK 5 (Tingkat Mahir) ---
  {
    id: 25,
    level: 5,
    char: "劣",
    pinyin: "liè",
    meaning: "Rendah mutu / Inferior",
    radA: "少 (Sedikit)",
    radB: "力 (Tenaga)",
    story: "Hanya mengerahkan sedikit tenaga dan upaya akan menghasilkan pekerjaan dengan mutu yang rendah."
  },
  {
    id: 26,
    level: 5,
    char: "旦",
    pinyin: "dàn",
    meaning: "Fajar / Awal hari",
    radA: "日 (Matahari)",
    radB: "一 (Garis ufuk)",
    story: "Matahari bulat yang baru saja menyingsing tepat di atas garis cakrawala ufuk timur."
  },
  {
    id: 27,
    level: 5,
    char: "卡",
    pinyin: "kǎ",
    meaning: "Tersangkut / Kartu",
    radA: "上 (Atas)",
    radB: "下 (Bawah)",
    story: "Terjepit di tengah-tengah antara posisi atas dan posisi bawah, tidak bisa bergerak."
  },
  {
    id: 28,
    level: 5,
    char: "伴",
    pinyin: "bàn",
    meaning: "Teman pendamping",
    radA: "亻 (Orang)",
    radB: "半 (Setengah)",
    story: "Belahan jiwa atau orang yang menjadi separuh diri kita untuk saling mendampingi perjalanan."
  },
  {
    id: 29,
    level: 5,
    char: "信",
    pinyin: "xìn",
    meaning: "Percaya / Surat / Amanah",
    radA: "亻 (Orang)",
    radB: "言 (Kata / Janji)",
    story: "Kata-kata dan ucapan seseorang yang senantiasa ditepati sehingga mendatangkan kepercayaan."
  },
  {
    id: 30,
    level: 5,
    char: "盟",
    pinyin: "méng",
    meaning: "Aliansi / Ikrar sumpah",
    radA: "日月 (Matahari & Bulan)",
    radB: "皿 (Bejana ritual)",
    story: "Bersumpah setia di bawah kesaksian matahari dan bulan dengan mempersembahkan darah di bejana ritual."
  },

  // --- HSK 6 (Tingkat Ahli / Sastra) ---
  {
    id: 31,
    level: 6,
    char: "伐",
    pinyin: "fá",
    meaning: "Menebang / Menyerang",
    radA: "亻 (Prajurit)",
    radB: "戈 (Senjata kapak tombak)",
    story: "Seorang prajurit memegang kapak tombak untuk menebang pohon hutan atau menyerang musuh."
  },
  {
    id: 32,
    level: 6,
    char: "涉",
    pinyin: "shè",
    meaning: "Menyeberang air / Terlibat",
    radA: "氵 (Aliran air)",
    radB: "步 (Langkah kaki)",
    story: "Langkah kaki yang berani mencebur dan menyeberangi aliran sungai air yang dangkal."
  },
  {
    id: 33,
    level: 6,
    char: "采",
    pinyin: "cǎi",
    meaning: "Memetik / Mengumpulkan",
    radA: "爫 (Cakar / Jari tangan)",
    radB: "木 (Dahan pohon)",
    story: "Jari-jemari tangan yang terulur ke dahan pohon untuk memetik buah dan daun teh segar."
  },
  {
    id: 34,
    level: 6,
    char: "笔",
    pinyin: "bǐ",
    meaning: "Pena / Kuas kaligrafi",
    radA: "竹 (Batang bambu)",
    radB: "毛 (Bulu halus)",
    story: "Batang bambu kering berongga yang dipasangi bulu musang halus di ujungnya sebagai alat tulis kaligrafi."
  },
  {
    id: 35,
    level: 6,
    char: "吠",
    pinyin: "fèi",
    meaning: "Menggonggong",
    radA: "口 (Mulut)",
    radB: "犬 (Anjing)",
    story: "Suara gonggongan keras yang melolong keluar dari mulut seekor anjing penjaga."
  },
  {
    id: 36,
    level: 6,
    char: "牢",
    pinyin: "láo",
    meaning: "Penjara kokoh / Kandang",
    radA: "宀 (Atap naungan)",
    radB: "牛 (Lembu / Sapi)",
    story: "Bangunan beratap kukuh dan tertutup rapat untuk mengurung ternak lembu agar aman dari serigala."
  }
];

currentData.anatomy = expandedAnatomy;
fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Successfully expanded Anatomi Hanzi to ' + expandedAnatomy.length + ' items!');

