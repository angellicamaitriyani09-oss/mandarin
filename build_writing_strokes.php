<?php
/**
 * Builder script untuk menghasilkan 120 kosakata strokeCharacters (20 kosakata x 6 level HSK)
 * dengan kaidah urutan penulisan goresan Mandarin (笔顺) resmi dan terperinci.
 */

$strokeCharacters = [];

// =========================================================================
// HSK 1 (20 Kosakata)
// =========================================================================
$strokeCharacters[] = [
    "char" => "你",
    "pinyin" => "nǐ",
    "meaning" => "Kamu (You)",
    "strokesCount" => 7,
    "hskLevel" => "HSK 1",
    "rules" => "Kiri ke Kanan (Radikal orang 亻 di kiri, lalu 尔 di kanan)",
    "strokeSteps" => [
        "1. 撇 (Piě) - Garis miring ke kiri atas radikal orang",
        "2. 竖 (Shù) - Garis lurus tegak ke bawah radikal orang",
        "3. 撇 (Piě) - Garis miring kepala atas",
        "4. 横撇 (Héngpiě) - Garis mendatar lalu tekuk miring kiri",
        "5. 竖钩 (Shùgōu) - Garis tegak lurus dengan kait ke kiri",
        "6. 撇 (Piě) - Titik miring kiri",
        "7. 点 (Diǎn) - Titik penutup kanan"
    ]
];

$strokeCharacters[] = [
    "char" => "好",
    "pinyin" => "hǎo",
    "meaning" => "Baik / Bagus (Good)",
    "strokesCount" => 6,
    "hskLevel" => "HSK 1",
    "rules" => "Kiri ke Kanan (Radikal wanita 女 di kiri, lalu anak 子 di kanan)",
    "strokeSteps" => [
        "1. 撇点 (Piědiǎn) - Miring ke kiri lalu serong ke kanan bawah",
        "2. 撇 (Piě) - Garis miring melintasi garis pertama",
        "3. 提 (Tí) - Sapuan naik sedikit dari kiri ke kanan melintang",
        "4. 横撇 (Héngpiě) - Mendatar lalu miring ke kiri bawah",
        "5. 弯钩 (Wāngōu) - Lengkung ke bawah dengan kaitan",
        "6. 横 (Héng) - Garis mendatar memotong tengah"
    ]
];

$strokeCharacters[] = [
    "char" => "我",
    "pinyin" => "wǒ",
    "meaning" => "Saya / Aku (I / Me)",
    "strokesCount" => 7,
    "hskLevel" => "HSK 1",
    "rules" => "Kiri ke Kanan, Luar ke Dalam, Atas ke Bawah",
    "strokeSteps" => [
        "1. 撇 (Piě) - Miring pendek di kiri atas",
        "2. 横 (Héng) - Garis mendatar di sebelah kiri",
        "3. 竖钩 (Shùgōu) - Garis tegak berkait ke kiri atas",
        "4. 提 (Tí) - Sapuan naik ke kanan atas",
        "5. 斜钩 (Xiégōu) - Garis miring melengkung panjang berkait ke atas",
        "6. 撇 (Piě) - Garis miring pendek",
        "7. 点 (Diǎn) - Titik penutup di kanan atas"
    ]
];

$strokeCharacters[] = [
    "char" => "是",
    "pinyin" => "shì",
    "meaning" => "Adalah / Ialah / Benar (To be / Yes)",
    "strokesCount" => 9,
    "hskLevel" => "HSK 1",
    "rules" => "Atas ke Bawah (Bagian matahari 日 di atas, lalu 疋 di bawah)",
    "strokeSteps" => [
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
];

$strokeCharacters[] = [
    "char" => "人",
    "pinyin" => "rén",
    "meaning" => "Orang / Manusia (Person / People)",
    "strokesCount" => 2,
    "hskLevel" => "HSK 1",
    "rules" => "Kiri lalu Kanan (撇 Piě mendahului 捺 Nà)",
    "strokeSteps" => [
        "1. 撇 (Piě) - Sapuan miring melengkung ke kiri bawah",
        "2. 捺 (Nà) - Sapuan memanjang ke kanan bawah bertumpu pada goresan pertama"
    ]
];

$strokeCharacters[] = [
    "char" => "中",
    "pinyin" => "zhōng",
    "meaning" => "Tengah / Tiongkok (Middle / Center)",
    "strokesCount" => 4,
    "hskLevel" => "HSK 1",
    "rules" => "Luar dulu, Dalam, Tutup, lalu Garis Tengah Vertikal Membelah",
    "strokeSteps" => [
        "1. 竖 (Shù) - Garis tegak sisi kiri kotak",
        "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk ke bawah sisi kanan",
        "3. 横 (Héng) - Garis mendatar penutup kotak",
        "4. 竖 (Shù) - Garis tegak lurus panjang menembus tengah kotak"
    ]
];

$strokeCharacters[] = [
    "char" => "学",
    "pinyin" => "xué",
    "meaning" => "Belajar (Study / Learn)",
    "strokesCount" => 8,
    "hskLevel" => "HSK 1",
    "rules" => "Atas ke Bawah (Titik atas, mahkota 冖, lalu anak 子)",
    "strokeSteps" => [
        "1. 点 (Diǎn) - Titik miring kiri atas",
        "2. 点 (Diǎn) - Titik tengah atas",
        "3. 撇 (Piě) - Sapuan miring kiri",
        "4. 点 (Diǎn) - Titik penutup kiri mahkota",
        "5. 横撇 (Héngpiě) - Garis mendatar tekuk miring kiri",
        "6. 横撇 (Héngpiě) - Tekukan kepala anak 子",
        "7. 弯钩 (Wāngōu) - Lengkungan badan berkait",
        "8. 横 (Héng) - Garis mendatar panjang memotong tengah"
    ]
];

$strokeCharacters[] = [
    "char" => "大",
    "pinyin" => "dà",
    "meaning" => "Besar (Big / Large)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Mendatar dulu, lalu Miring Kiri, diakhiri Sapuan Kanan",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar atas",
        "2. 撇 (Piě) - Garis miring kiri membelah garis mendatar",
        "3. 捺 (Nà) - Sapuan miring kanan memanjang"
    ]
];

$strokeCharacters[] = [
    "char" => "水",
    "pinyin" => "shuǐ",
    "meaning" => "Air (Water)",
    "strokesCount" => 4,
    "hskLevel" => "HSK 1",
    "rules" => "Tengah Dulu, Baru Kiri lalu Kanan (先中间后两边)",
    "strokeSteps" => [
        "1. 竖钩 (Shùgōu) - Garis tegak lurus tengah dengan kaitan ke kiri",
        "2. 横撇 (Héngpiě) - Mendatar tekuk miring di sebelah kiri",
        "3. 撇 (Piě) - Sapuan miring pendek di kanan atas",
        "4. 捺 (Nà) - Sapuan miring tebal di kanan bawah"
    ]
];

$strokeCharacters[] = [
    "char" => "门",
    "pinyin" => "mén",
    "meaning" => "Pintu / Pintu Masuk (Door / Gate)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Titik Kiri, Tegak Sisi, lalu Mendatar Tekuk Kait (点, 竖, 横折钩)",
    "strokeSteps" => [
        "1. 点 (Diǎn) - Titik di bagian kiri atas",
        "2. 竖 (Shù) - Garis tegak di bagian kiri bawah",
        "3. 横折钩 (Héngzhégōu) - Garis mendatar lalu tekuk tegak dengan kait"
    ]
];

$strokeCharacters[] = [
    "char" => "一",
    "pinyin" => "yī",
    "meaning" => "Satu (One)",
    "strokesCount" => 1,
    "hskLevel" => "HSK 1",
    "rules" => "Garis Tunggal Mendatar dari Kiri ke Kanan (从左到右)",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar lurus dari kiri ditarik mantap ke kanan"
    ]
];

$strokeCharacters[] = [
    "char" => "二",
    "pinyin" => "èr",
    "meaning" => "Dua (Two)",
    "strokesCount" => 2,
    "hskLevel" => "HSK 1",
    "rules" => "Atas ke Bawah (Garis atas lebih pendek, garis bawah lebih panjang)",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar pendek di atas",
        "2. 横 (Héng) - Garis mendatar panjang penyeimbang di bawah"
    ]
];

$strokeCharacters[] = [
    "char" => "三",
    "pinyin" => "sān",
    "meaning" => "Tiga (Three)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Atas ke Bawah (Atas sedang, tengah terpendek, bawah paling panjang)",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar atas panjang sedang",
        "2. 横 (Héng) - Garis mendatar tengah paling pendek",
        "3. 横 (Héng) - Garis mendatar bawah paling panjang sebagai pondasi"
    ]
];

$strokeCharacters[] = [
    "char" => "十",
    "pinyin" => "shí",
    "meaning" => "Sepuluh (Ten)",
    "strokesCount" => 2,
    "hskLevel" => "HSK 1",
    "rules" => "Mendatar Dulu Baru Garis Tegak (先横后竖)",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar lurus di tengah",
        "2. 竖 (Shù) - Garis tegak lurus membelah tepat di tengah"
    ]
];

$strokeCharacters[] = [
    "char" => "日",
    "pinyin" => "rì",
    "meaning" => "Matahari / Hari (Sun / Day)",
    "strokesCount" => 4,
    "hskLevel" => "HSK 1",
    "rules" => "Luar dulu, Dalam, lalu Tutup Bawah (先外后里再封口)",
    "strokeSteps" => [
        "1. 竖 (Shù) - Garis tegak sisi kiri kotak matahari",
        "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk tegak sisi kanan",
        "3. 横 (Héng) - Garis mendatar di dalam kotak",
        "4. 横 (Héng) - Garis mendatar penutup bawah kotak"
    ]
];

$strokeCharacters[] = [
    "char" => "月",
    "pinyin" => "yuè",
    "meaning" => "Bulan (Moon / Month)",
    "strokesCount" => 4,
    "hskLevel" => "HSK 1",
    "rules" => "Sisi Kiri, Bingkai Kanan Berkait, lalu Isi Mendatar",
    "strokeSteps" => [
        "1. 撇 (Piě) - Garis miring melengkung ke kiri bawah sisi kiri",
        "2. 横折钩 (Héngzhégōu) - Mendatar lalu tekuk tegak dengan kait ke kiri",
        "3. 横 (Héng) - Garis mendatar bagian dalam atas",
        "4. 横 (Héng) - Garis mendatar bagian dalam bawah"
    ]
];

$strokeCharacters[] = [
    "char" => "木",
    "pinyin" => "mù",
    "meaning" => "Kayu / Pohon (Wood / Tree)",
    "strokesCount" => 4,
    "hskLevel" => "HSK 1",
    "rules" => "Mendatar, Tegak Batang, Cabang Kiri, Cabang Kanan",
    "strokeSteps" => [
        "1. 横 (Héng) - Garis mendatar dahan",
        "2. 竖 (Shù) - Garis tegak lurus batang pohon menembus",
        "3. 撇 (Piě) - Sapuan miring ke kiri bawah akar/ranting",
        "4. 捺 (Nà) - Sapuan miring ke kanan bawah penyeimbang"
    ]
];

$strokeCharacters[] = [
    "char" => "口",
    "pinyin" => "kǒu",
    "meaning" => "Mulut / Lubang (Mouth / Opening)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Tegak Kiri, Mendatar Tekuk Kanan, Tutup Bawah (先外后里再封口)",
    "strokeSteps" => [
        "1. 竖 (Shù) - Garis tegak sisi kiri kotak",
        "2. 横折 (Héngzhé) - Garis mendatar lalu tekuk ke bawah sisi kanan",
        "3. 横 (Héng) - Garis mendatar penutup bawah kotak"
    ]
];

$strokeCharacters[] = [
    "char" => "山",
    "pinyin" => "shān",
    "meaning" => "Gunung (Mountain)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Puncak Tengah Dulu, lalu Kiri Lekuk, Kanan Tegak (先中间后两边)",
    "strokeSteps" => [
        "1. 竖 (Shù) - Puncak tegak tertinggi di tengah",
        "2. 竖折 (Shùzhé) - Garis tegak sisi kiri lalu tekuk mendatar ke kanan",
        "3. 竖 (Shù) - Garis tegak sisi kanan gunung"
    ]
];

$strokeCharacters[] = [
    "char" => "小",
    "pinyin" => "xiǎo",
    "meaning" => "Kecil (Small / Little)",
    "strokesCount" => 3,
    "hskLevel" => "HSK 1",
    "rules" => "Tengah Dulu, Baru Titik Kiri dan Kanan (先中间后两边)",
    "strokeSteps" => [
        "1. 竖钩 (Shùgōu) - Garis tegak lurus tengah dengan kaitan ke kiri",
        "2. 撇/点 (Piě) - Titik miring ke kiri atas",
        "3. 点 (Diǎn) - Titik serong ke kanan penyeimbang"
    ]
];

// =========================================================================
// HSK 2 (20 Kosakata)
// =========================================================================
$hsk2Words = [
    ["char" => "买", "pinyin" => "mǎi", "meaning" => "Membeli (Buy)", "strokesCount" => 6, "rules" => "Atas ke Bawah (Bagian kait atas 乛 lalu bagian kepala 头)", "steps" => ["1. 横折/横钩 (Héngzhégōu) - Garis mendatar dengan tekukan kait", "2. 点 (Diǎn) - Titik miring di bagian kiri", "3. 横 (Héng) - Garis mendatar di bawah", "4. 撇 (Piě) - Sapuan miring ke kiri bawah", "5. 点 (Diǎn) - Titik pendukung", "6. 点 (Diǎn) - Titik penutup di kanan bawah"]],
    ["char" => "卖", "pinyin" => "mài", "meaning" => "Menjual (Sell)", "strokesCount" => 8, "rules" => "Atas ke Bawah (Karakter Sepuluh 十 di atas, diikuti 买 mǎi di bawah)", "steps" => ["1. 横 (Héng) - Garis mendatar atas karakter 十", "2. 竖 (Shù) - Garis tegak memotong karakter 十", "3. 横钩 (Hénggōu) - Garis mendatar tekuk kait", "4. 点 (Diǎn) - Titik kiri", "5. 横 (Héng) - Garis mendatar tengah", "6. 撇 (Piě) - Sapuan miring kiri bawah", "7. 点 (Diǎn) - Titik tengah", "8. 点 (Diǎn) - Titik penutup kanan bawah"]],
    ["char" => "进", "pinyin" => "jìn", "meaning" => "Masuk / Maju (Enter / Advance)", "strokesCount" => 7, "rules" => "Dalam Dulu Baru Radikal Berjalan (先里后外: 井 ditarik dulu, baru 辶)", "steps" => ["1. 横 (Héng) - Garis mendatar atas dari 井", "2. 横 (Héng) - Garis mendatar kedua dari 井", "3. 撇 (Piě) - Garis tegak miring kiri menembus", "4. 竖 (Shù) - Garis tegak lurus kanan menembus", "5. 点 (Diǎn) - Titik kepala radikal berjalan 辶", "6. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶", "7. 捺 (Nà) - Sapuan panjang landai melandasi bagian bawah"]],
    ["char" => "出", "pinyin" => "chū", "meaning" => "Keluar (Go out / Exit)", "strokesCount" => 5, "rules" => "Tengah Dulu, Lalu Sisi Kiri dan Kanan (Gunung atas lalu gunung bawah)", "steps" => ["1. 竖折/竖 (Shùzhé) - Garis tegak lalu tekuk mendatar", "2. 竖 (Shù) - Garis tegak sisi kanan gunung atas", "3. 竖 (Shù) - Garis tegak tengah yang tinggi menembus", "4. 竖折 (Shùzhé) - Garis tegak tekuk mendatar gunung bawah", "5. 竖 (Shù) - Garis tegak penutup kanan bawah"]],
    ["char" => "等", "pinyin" => "děng", "meaning" => "Menunggu / Kelas (Wait / Equal)", "strokesCount" => 12, "rules" => "Atas ke Bawah (Radikal Bambu 竹 di atas, Kuil 寺 di bawah)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal bambu kiri", "2. 横 (Héng) - Mendatar radikal bambu kiri", "3. 点 (Diǎn) - Titik radikal bambu kiri", "4. 撇 (Piě) - Miring kiri radikal bambu kanan", "5. 横 (Héng) - Mendatar radikal bambu kanan", "6. 竖 (Shù) - Garis tegak radikal bambu kanan", "7. 横 (Héng) - Mendatar atas karakter bumi 土", "8. 竖 (Shù) - Tegak tengah karakter 土", "9. 横 (Héng) - Mendatar bawah panjang karakter 土", "10. 横 (Héng) - Mendatar karakter 寸", "11. 竖钩 (Shùgōu) - Tegak berkait karakter 寸", "12. 点 (Diǎn) - Titik penutup karakter 寸"]],
    ["char" => "高", "pinyin" => "gāo", "meaning" => "Tinggi (Tall / High)", "strokesCount" => 10, "rules" => "Atas ke Bawah, Luar dulu baru Dalam", "steps" => ["1. 点 (Diǎn) - Titik kepala atas", "2. 横 (Héng) - Garis mendatar pelindung", "3. 竖 (Shù) - Tegak kiri kotak atas", "4. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kotak atas", "5. 竖 (Shù) - Tegak kiri pintu tengah", "6. 横折 (Héngzhé) - Mendatar tekuk kanan", "7. 横 (Héng) - Mendatar penyambung", "8. 竖 (Shù) - Tegak kiri kotak bawah", "9. 横折 (Héngzhé) - Mendatar tekuk kotak bawah", "10. 横 (Héng) - Mendatar penutup kotak paling bawah"]],
    ["char" => "给", "pinyin" => "gěi", "meaning" => "Memberi / Kepada (Give / To)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Radikal Sutra 纟 di kiri, 合 di kanan)", "steps" => ["1. 撇折 (Piězhé) - Miring tekuk radikal sutra 纟", "2. 撇折 (Piězhé) - Miring tekuk kedua radikal sutra 纟", "3. 提 (Tí) - Sapuan naik ke kanan atas radikal 纟", "4. 撇 (Piě) - Miring kiri kepala 合", "5. 捺 (Nà) - Sapuan miring kanan kepala 合", "6. 一 (Héng) - Garis mendatar pembatas 合", "7. 竖 (Shù) - Tegak kotak mulut 口", "8. 横折 (Héngzhé) - Mendatar tekuk kotak 口", "9. 横 (Héng) - Mendatar penutup kotak 口"]],
    ["char" => "问", "pinyin" => "wèn", "meaning" => "Bertanya (Ask)", "strokesCount" => 6, "rules" => "Luar Dulu Baru Dalam (Bingkai pintu 门 di luar, Mulut 口 di dalam)", "steps" => ["1. 点 (Diǎn) - Titik kiri atas pintu", "2. 竖 (Shù) - Garis tegak sisi kiri pintu", "3. 横折钩 (Héngzhégōu) - Mendatar tekuk kait pintu luar", "4. 竖 (Shù) - Tegak sisi kiri mulut 口 di dalam", "5. 横折 (Héngzhé) - Mendatar tekuk sisi kanan mulut 口", "6. 横 (Héng) - Mendatar penutup bawah mulut 口"]],
    ["char" => "白", "pinyin" => "bái", "meaning" => "Putih / Jelas (White / Clear)", "strokesCount" => 5, "rules" => "Titik Atas, Bingkai Kotak, Isi, lalu Tutup Bawah", "steps" => ["1. 撇 (Piě) - Sapuan miring pendek di puncak atas", "2. 竖 (Shù) - Garis tegak sisi kiri kotak", "3. 横折 (Héngzhé) - Mendatar lalu tekuk tegak sisi kanan", "4. 横 (Héng) - Garis mendatar tengah di dalam kotak", "5. 横 (Héng) - Garis mendatar penutup bawah kotak"]],
    ["char" => "百", "pinyin" => "bǎi", "meaning" => "Ratusan (Hundred)", "strokesCount" => 6, "rules" => "Mendatar Atas Dulu, lalu Karakter Putih 白 (从上到下)", "steps" => ["1. 横 (Héng) - Garis mendatar atas panjang", "2. 撇 (Piě) - Garis miring pendek kepala 白", "3. 竖 (Shù) - Tegak kiri kotak 白", "4. 横折 (Héngzhé) - Mendatar tekuk kotak 白", "5. 横 (Héng) - Mendatar tengah dalam kotak 白", "6. 横 (Héng) - Mendatar penutup bawah kotak 白"]],
    ["char" => "千", "pinyin" => "qiān", "meaning" => "Ribuan (Thousand)", "strokesCount" => 3, "rules" => "Miring Atas, Mendatar, lalu Tegak Panjang Menembus", "steps" => ["1. 撇 (Piě) - Garis miring pendek di kiri atas", "2. 横 (Héng) - Garis mendatar panjang di tengah", "3. 竖 (Shù) - Garis tegak lurus menembus garis mendatar"]],
    ["char" => "多", "pinyin" => "duō", "meaning" => "Banyak (Many / Much)", "strokesCount" => 6, "rules" => "Atas ke Bawah (Dua karakter Senja 夕 bertumpuk vertikal)", "steps" => ["1. 撇 (Piě) - Miring kiri karakter 夕 atas", "2. 横撇 (Héngpiě) - Mendatar tekuk miring 夕 atas", "3. 点 (Diǎn) - Titik di dalam 夕 atas", "4. 撇 (Piě) - Miring kiri karakter 夕 bawah", "5. 横撇 (Héngpiě) - Mendatar tekuk miring 夕 bawah", "6. 点 (Diǎn) - Titik di dalam 夕 bawah"]],
    ["char" => "少", "pinyin" => "shǎo", "meaning" => "Sedikit / Kurang (Few / Little)", "strokesCount" => 4, "rules" => "Karakter Kecil 小 dulu, lalu Sapuan Miring Panjang Melintasi", "steps" => ["1. 竖 (Shù) - Garis tegak tengah karakter 小", "2. 点/撇 (Piě) - Titik miring di sebelah kiri", "3. 点 (Diǎn) - Titik miring di sebelah kanan", "4. 撇 (Piě) - Sapuan miring panjang melengkung ke kiri bawah"]],
    ["char" => "左", "pinyin" => "zuǒ", "meaning" => "Kiri (Left)", "strokesCount" => 5, "rules" => "Mendatar, Miring Panjang, lalu Karakter Tukang 工 di bawah", "steps" => ["1. 横 (Héng) - Garis mendatar pertama di atas", "2. 撇 (Piě) - Sapuan miring panjang ke kiri bawah", "3. 横 (Héng) - Mendatar atas karakter 工", "4. 竖 (Shù) - Tegak tengah karakter 工", "5. 横 (Héng) - Mendatar bawah penutup karakter 工"]],
    ["char" => "右", "pinyin" => "yòu", "meaning" => "Kanan (Right)", "strokesCount" => 5, "rules" => "Miring Panjang Dulu, Mendatar, lalu Kotak Mulut 口 di bawah", "steps" => ["1. 横 (Héng) - Garis mendatar atas", "2. 撇 (Piě) - Sapuan miring panjang ke kiri bawah", "3. 竖 (Shù) - Tegak kiri kotak mulut 口", "4. 横折 (Héngzhé) - Mendatar tekuk kotak mulut 口", "5. 横 (Héng) - Mendatar penutup bawah kotak mulut 口"]],
    ["char" => "手", "pinyin" => "shǒu", "meaning" => "Tangan (Hand)", "strokesCount" => 4, "rules" => "Miring Atas, Dua Mendatar, lalu Garis Lengkung Berkait Tengah", "steps" => ["1. 撇 (Piě) - Sapuan miring pendek di kiri atas", "2. 横 (Héng) - Garis mendatar pendek pertama", "3. 横 (Héng) - Garis mendatar kedua yang lebih panjang", "4. 弯钩 (Wāngōu) - Garis tegak melengkung tengah dengan kaitan ke kiri"]],
    ["char" => "足", "pinyin" => "zú", "meaning" => "Kaki / Cukup (Foot / Sufficient)", "strokesCount" => 7, "rules" => "Kotak Mulut 口 di atas, lalu Struktur Kaki 止 di bawah", "steps" => ["1. 竖 (Shù) - Tegak kiri kotak mulut 口", "2. 横折 (Héngzhé) - Mendatar tekuk kotak 口", "3. 横 (Héng) - Mendatar penutup kotak 口", "4. 竖 (Shù) - Tegak tengah batang kaki", "5. 横 (Héng) - Mendatar pendek penyangga", "6. 撇 (Piě) - Miring kiri langkah kaki", "7. 捺 (Nà) - Sapuan tebal memanjang ke kanan bawah"]],
    ["char" => "目", "pinyin" => "mù", "meaning" => "Mata / Daftar (Eye / Item)", "strokesCount" => 5, "rules" => "Kotak Vertikal Panjang, Dua Garis Tengah, Penutup Bawah", "steps" => ["1. 竖 (Shù) - Garis tegak sisi kiri kotak mata", "2. 横折 (Héngzhé) - Mendatar lalu tekuk tegak ke bawah sisi kanan", "3. 横 (Héng) - Garis mendatar pertama dalam kotak", "4. 横 (Héng) - Garis mendatar kedua dalam kotak", "5. 横 (Héng) - Garis mendatar penutup bawah kotak"]],
    ["char" => "耳", "pinyin" => "ěr", "meaning" => "Telinga (Ear)", "strokesCount" => 6, "rules" => "Mendatar Atas, Dua Tegak, Dua Mendatar Tengah, Sapuan Naik Bawah", "steps" => ["1. 横 (Héng) - Garis mendatar atas pelindung", "2. 竖 (Shù) - Garis tegak sisi kiri telinga", "3. 竖 (Shù) - Garis tegak sisi kanan yang lebih panjang ke bawah", "4. 横 (Héng) - Garis mendatar dalam pertama", "5. 横 (Héng) - Garis mendatar dalam kedua", "6. 提/横 (Tí) - Garis mendatar miring naik penutup bawah"]],
    ["char" => "生", "pinyin" => "shēng", "meaning" => "Lahir / Hidup / Mentah (Birth / Life)", "strokesCount" => 5, "rules" => "Miring Kiri Atas, Tiga Mendatar, dan Tegak Tengah Menembus", "steps" => ["1. 撇 (Piě) - Sapuan miring pendek di kiri atas", "2. 横 (Héng) - Garis mendatar atas", "3. 竖 (Shù) - Garis tegak lurus tengah menembus", "4. 横 (Héng) - Garis mendatar kedua tengah", "5. 横 (Héng) - Garis mendatar bawah paling panjang sebagai pondasi"]]
];

foreach ($hsk2Words as $w) {
    $strokeCharacters[] = [
        "char" => $w["char"],
        "pinyin" => $w["pinyin"],
        "meaning" => $w["meaning"],
        "strokesCount" => $w["strokesCount"],
        "hskLevel" => "HSK 2",
        "rules" => $w["rules"],
        "strokeSteps" => $w["steps"]
    ];
}

// =========================================================================
// HSK 3 (20 Kosakata)
// =========================================================================
$hsk3Words = [
    ["char" => "春", "pinyin" => "chūn", "meaning" => "Musim Semi (Spring)", "strokesCount" => 9, "rules" => "Atas ke Bawah (Tiga garis mendatar 三, Orang 人, lalu Matahari 日)", "steps" => ["1. 横 (Héng) - Mendatar pertama atas", "2. 横 (Héng) - Mendatar kedua tengah", "3. 横 (Héng) - Mendatar ketiga panjang", "4. 撇 (Piě) - Sapuan miring kiri panjang menembus tiga garis", "5. 捺 (Nà) - Sapuan miring kanan panjang menyeimbangkan", "6. 竖 (Shù) - Garis tegak sisi kiri kotak matahari 日", "7. 横折 (Héngzhé) - Mendatar tekuk kotak 日", "8. 横 (Héng) - Mendatar tengah dalam kotak 日", "9. 横 (Héng) - Mendatar penutup bawah kotak 日"]],
    ["char" => "信", "pinyin" => "xìn", "meaning" => "Surat / Percaya (Letter / Believe)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Radikal orang 亻 di kiri, lalu kata 言 di kanan)", "steps" => ["1. 撇 (Piě) - Sapuan miring kiri radikal orang", "2. 竖 (Shù) - Tegak lurus radikal orang", "3. 点 (Diǎn) - Titik kepala radikal kata 言", "4. 横 (Héng) - Mendatar panjang pertama", "5. 横 (Héng) - Mendatar kedua", "6. 横 (Héng) - Mendatar ketiga", "7. 竖 (Shù) - Tegak kiri kotak mulut 口", "8. 横折 (Héngzhé) - Mendatar tekuk kotak 口", "9. 横 (Héng) - Mendatar penutup kotak 口"]],
    ["char" => "班", "pinyin" => "bān", "meaning" => "Kelas / Regu / Bekerja (Class / Shift)", "strokesCount" => 10, "rules" => "Kiri ke Kanan (Giok 王 di kiri, Pisau 刀 di tengah, Giok 王 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas giok kiri", "2. 横 (Héng) - Mendatar tengah giok kiri", "3. 竖 (Shù) - Tegak lurus giok kiri", "4. 提 (Tí) - Sapuan naik giok kiri", "5. 撇 (Piě) - Sapuan miring pisau tengah", "6. 竖 (Shù) - Garis tegak membelah tengah", "7. 横 (Héng) - Mendatar atas giok kanan", "8. 横 (Héng) - Mendatar tengah giok kanan", "9. 竖 (Shù) - Tegak lurus giok kanan", "10. 横 (Héng) - Mendatar penutup bawah giok kanan"]],
    ["char" => "接", "pinyin" => "jiē", "meaning" => "Menerima / Menjemput (Receive / Pick up)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Radikal Tangan 扌 di kiri, 妾 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar radikal tangan 扌", "2. 竖钩 (Shùgōu) - Tegak berkait radikal tangan 扌", "3. 提 (Tí) - Sapuan naik radikal tangan 扌", "4. 点 (Diǎn) - Titik atas bagian 立", "5. 横 (Héng) - Mendatar atas 立", "6. 点 (Diǎn) - Titik kiri 立", "7. 撇 (Piě) - Miring kanan 立", "8. 横 (Héng) - Mendatar bawah 立", "9. 撇点 (Piědiǎn) - Miring tekuk radikal wanita 女", "10. 撇 (Piě) - Miring silang wanita 女", "11. 横 (Héng) - Mendatar panjang pemotong wanita 女"]],
    ["char" => "解", "pinyin" => "jiě", "meaning" => "Memahami / Mengurai (Understand / Untie)", "strokesCount" => 13, "rules" => "Kiri ke Kanan (Tanduk 角 di kiri, Pisau 刀 & Sapi 牛 di kanan)", "steps" => ["1. 撇 (Piě) - Miring atas tanduk 角", "2. 横撇 (Héngpiě) - Mendatar tekuk tanduk 角", "3. 撇 (Piě) - Miring kiri dalam 角", "4. 横折钩 (Héngzhégōu) - Kait bingkai 角", "5. 横 (Héng) - Mendatar dalam 角", "6. 横 (Héng) - Mendatar kedua dalam 角", "7. 竖 (Shù) - Tegak tengah 角", "8. 横折 (Héngzhé) - Mendatar tekuk pisau 刀 kanan atas", "9. 撇 (Piě) - Miring melengkung pisau 刀", "10. 撇 (Piě) - Miring atas sapi 牛", "11. 横 (Héng) - Mendatar pertama sapi 牛", "12. 横 (Héng) - Mendatar panjang kedua sapi 牛", "13. 竖 (Shù) - Tegak lurus panjang menembus sapi 牛"]],
    ["char" => "夏", "pinyin" => "xià", "meaning" => "Musim Panas (Summer)", "strokesCount" => 10, "rules" => "Atas ke Bawah (Bagian kepala 一, Kotak Mata 目 tengah, dan Langkah 夂 di bawah)", "steps" => ["1. 横 (Héng) - Garis mendatar atas", "2. 撇 (Piě) - Garis miring kiri pelindung", "3. 竖 (Shù) - Tegak kiri kotak mata", "4. 横折 (Héngzhé) - Mendatar tekuk kotak mata", "5. 横 (Héng) - Mendatar dalam mata pertama", "6. 横 (Héng) - Mendatar dalam mata kedua", "7. 横 (Héng) - Mendatar penutup kotak mata", "8. 撇 (Piě) - Miring langkah kaki 夂", "9. 横撇 (Héngpiě) - Mendatar tekuk langkah 夂", "10. 捺 (Nà) - Sapuan miring kanan tebal langkah 夂"]],
    ["char" => "秋", "pinyin" => "qiū", "meaning" => "Musim Gugur (Autumn)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Padi 禾 di sebelah kiri, Api 火 di sebelah kanan)", "steps" => ["1. 撇 (Piě) - Miring kepala bulir padi 禾", "2. 横 (Héng) - Mendatar padi 禾", "3. 竖 (Shù) - Tegak batang padi 禾", "4. 撇 (Piě) - Miring kiri akar padi 禾", "5. 点 (Diǎn) - Titik kanan akar padi 禾", "6. 点 (Diǎn) - Titik percikan kiri api 火", "7. 撇 (Piě) - Miring kanan percikan api 火", "8. 撇 (Piě) - Sapuan miring panjang lidah api 火", "9. 捺 (Nà) - Sapuan miring kanan tebal api 火"]],
    ["char" => "冬", "pinyin" => "dōng", "meaning" => "Musim Dingin (Winter)", "strokesCount" => 5, "rules" => "Atas ke Bawah (Atap Langkah 夂 di atas, Dua Titik Es di bawah)", "steps" => ["1. 撇 (Piě) - Garis miring kiri atas", "2. 横撇 (Héngpiě) - Garis mendatar tekuk miring kiri", "3. 捺 (Nà) - Sapuan miring kanan memanjang", "4. 点 (Diǎn) - Titik beku es pertama di bawah", "5. 点 (Diǎn) - Titik beku es kedua di bawah"]],
    ["char" => "现", "pinyin" => "xiàn", "meaning" => "Muncul / Sekarang (Appear / Present)", "strokesCount" => 8, "rules" => "Kiri ke Kanan (Giok 王 di kiri, Melihat 见 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas radikal giok", "2. 横 (Héng) - Mendatar kedua giok", "3. 竖 (Shù) - Tegak lurus giok", "4. 提 (Tí) - Sapuan naik giok", "5. 竖 (Shù) - Tegak kiri kotak melihat 见", "6. 横折 (Héngzhé) - Mendatar tekuk kotak 见", "7. 撇 (Piě) - Garis miring kaki kiri 见", "8. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 见"]],
    ["char" => "在", "pinyin" => "zài", "meaning" => "Berada di / Sedang (At / In / Present)", "strokesCount" => 6, "rules" => "Mendatar, Miring Panjang, Tegak, Mendatar, Tegak, Mendatar Bawah", "steps" => ["1. 横 (Héng) - Garis mendatar atas", "2. 撇 (Piě) - Garis miring panjang melengkung kiri", "3. 竖 (Shù) - Garis tegak lurus penyangga", "4. 横 (Héng) - Garis mendatar atas karakter bumi 土", "5. 竖 (Shù) - Garis tegak tengah karakter 土", "6. 横 (Héng) - Garis mendatar panjang penutup karakter 土"]],
    ["char" => "带", "pinyin" => "dài", "meaning" => "Membawa / Sabuk / Pita (Bring / Belt)", "strokesCount" => 9, "rules" => "Atas ke Bawah (Tiga titik atas, bingkai penutup, dan handuk 巾 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar pendek atas", "2. 竖 (Shù) - Tegak kiri atas", "3. 竖 (Shù) - Tegak kanan atas", "4. 撇 (Piě) - Miring pelindung kiri", "5. 点 (Diǎn) - Titik serong kanan", "6. 冖 (Mì) - Garis mendatar tekuk bingkai mahkota", "7. 竖 (Shù) - Tegak kiri kain 巾", "8. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kain 巾", "9. 竖 (Shù) - Garis tegak lurus panjang membelah tengah 巾"]],
    ["char" => "关", "pinyin" => "guān", "meaning" => "Menutup / Hubungan (Close / Relation)", "strokesCount" => 6, "rules" => "Dua Titik Atas Dulu, Dua Mendatar, lalu Kaki Miring dan Sapuan Kanan", "steps" => ["1. 点 (Diǎn) - Titik miring kiri atas", "2. 撇 (Piě) - Miring pendek kanan atas", "3. 横 (Héng) - Garis mendatar pertama", "4. 横 (Héng) - Garis mendatar kedua yang lebih panjang", "5. 撇 (Piě) - Garis miring ke kiri bawah", "6. 捺 (Nà) - Sapuan miring memanjang ke kanan bawah"]],
    ["char" => "系", "pinyin" => "xì", "meaning" => "Sistem / Menghubungkan (System / Tie)", "strokesCount" => 7, "rules" => "Miring Atas, lalu Radikal Sutra 糸 di bawah (从上到下)", "steps" => ["1. 撇 (Piě) - Sapuan miring di bagian puncak atas", "2. 撇折 (Piězhé) - Miring tekuk pertama radikal benang", "3. 撇折 (Piězhé) - Miring tekuk kedua radikal benang", "4. 点 (Diǎn) - Titik penyangga tengah", "5. 竖钩 (Shùgōu) - Garis tegak lurus berkait ke kiri", "6. 撇 (Piě) - Sapuan miring kiri bawah", "7. 点 (Diǎn) - Titik penutup di kanan bawah"]],
    ["char" => "运", "pinyin" => "yùn", "meaning" => "Mengangkut / Olahraga / Nasib (Transport / Sport)", "strokesCount" => 7, "rules" => "Dalam Dulu Baru Radikal Berjalan (云 ditarik dulu, baru 辶)", "steps" => ["1. 横 (Héng) - Mendatar atas karakter awan 云", "2. 横 (Héng) - Mendatar kedua karakter 云", "3. 撇折 (Piězhé) - Miring tekuk bagian bawah 云", "4. 点 (Diǎn) - Titik di dalam karakter 云", "5. 点 (Diǎn) - Titik kepala radikal berjalan 辶", "6. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶", "7. 捺 (Nà) - Sapuan landai panjang di bawah melandasi"]],
    ["char" => "动", "pinyin" => "dòng", "meaning" => "Bergerak / Gerak (Move / Action)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Awan 云 di kiri, Kekuatan 力 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas awan 云", "2. 横 (Héng) - Mendatar kedua 云", "3. 撇折 (Piězhé) - Miring tekuk 云", "4. 点 (Diǎn) - Titik penutup 云", "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kekuatan 力", "6. 撇 (Piě) - Sapuan miring panjang membelah kekuatan 力"]],
    ["char" => "画", "pinyin" => "huà", "meaning" => "Menggambar / Lukisan (Draw / Picture)", "strokesCount" => 8, "rules" => "Mendatar Atas, Kotak Ladang 田 di dalam, lalu Bingkai Wadah 凵 di bawah", "steps" => ["1. 横 (Héng) - Garis mendatar pelindung paling atas", "2. 竖 (Shù) - Tegak kiri ladang 田", "3. 横折 (Héngzhé) - Mendatar tekuk ladang 田", "4. 横 (Héng) - Mendatar tengah ladang 田", "5. 竖 (Shù) - Tegak tengah ladang 田", "6. 横 (Héng) - Mendatar penutup ladang 田", "7. 竖折 (Shùzhé) - Tegak lalu tekuk mendatar bingkai bawah", "8. 竖 (Shù) - Tegak sisi kanan penutup bingkai bawah"]],
    ["char" => "脸", "pinyin" => "liǎn", "meaning" => "Wajah / Muka (Face)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Radikal Daging/Bulan 月 di kiri, 佥 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal bulan 月", "2. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 月", "3. 横 (Héng) - Mendatar dalam pertama 月", "4. 横 (Héng) - Mendatar dalam kedua 月", "5. 撇 (Piě) - Miring kepala 佥", "6. 捺 (Nà) - Sapuan kanan kepala 佥", "7. 一 (Héng) - Mendatar pembatas", "8. 口 (Kǒu/3 goresan) - Kotak mulut 口 di tengah", "9. 撇 (Piě) - Miring kiri bawah", "10. 点 (Diǎn) - Titik penutup kanan bawah", "11. 横 (Héng) - Garis mendatar penyeimbang"]],
    ["char" => "脚", "pinyin" => "jiǎo", "meaning" => "Kaki / Telapak Kaki (Foot)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Bulan 月 di kiri, 去 di tengah, Radikal Segel 卩 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri bulan 月", "2. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 月", "3. 横 (Héng) - Mendatar dalam 月", "4. 横 (Héng) - Mendatar dalam kedua 月", "5. 横 (Héng) - Mendatar atas karakter pergi 去", "6. 竖 (Shù) - Tegak karakter 去", "7. 横 (Héng) - Mendatar panjang 去", "8. 撇折 (Piězhé) - Miring tekuk 去", "9. 点 (Diǎn) - Titik bawah 去", "10. 横折钩 (Héngzhégōu) - Mendatar tekuk kait segel 卩", "11. 竖 (Shù) - Tegak lurus penutup segel 卩"]],
    ["char" => "头", "pinyin" => "tóu", "meaning" => "Kepala / Pemimpin (Head / Leader)", "strokesCount" => 5, "rules" => "Dua Titik Atas, Mendatar, Miring Kiri, lalu Titik Kanan Bawah", "steps" => ["1. 点 (Diǎn) - Titik pertama kiri atas", "2. 点 (Diǎn) - Titik kedua kanan atas", "3. 横 (Héng) - Garis mendatar panjang pelindung", "4. 撇 (Piě) - Sapuan miring melengkung ke kiri bawah", "5. 点 (Diǎn) - Titik tebal penutup di kanan bawah"]],
    ["char" => "发", "pinyin" => "fā", "meaning" => "Rambut / Mengirim / Berkembang (Hair / Send)", "strokesCount" => 5, "rules" => "Miring Tekuk, Garis Miring Melengkung, Titik Kanan Atas", "steps" => ["1. 撇折 (Piězhé) - Miring tekuk pertama di kiri atas", "2. 撇 (Piě) - Sapuan miring melintasi garis pertama", "3. 横 (Héng) - Mendatar pendek", "4. 斜钩 (Xiégōu) - Garis miring melengkung panjang berkait ke atas", "5. 点 (Diǎn) - Titik penutup di kanan atas"]]
];

foreach ($hsk3Words as $w) {
    $strokeCharacters[] = [
        "char" => $w["char"],
        "pinyin" => $w["pinyin"],
        "meaning" => $w["meaning"],
        "strokesCount" => $w["strokesCount"],
        "hskLevel" => "HSK 3",
        "rules" => $w["rules"],
        "strokeSteps" => $w["steps"]
    ];
}

// =========================================================================
// HSK 4 (20 Kosakata)
// =========================================================================
$hsk4Words = [
    ["char" => "景", "pinyin" => "jǐng", "meaning" => "Pemandangan / Situasi (Scenery / View)", "strokesCount" => 12, "rules" => "Atas ke Bawah (Matahari 日 di atas, Ibukota 京 di bawah)", "steps" => ["1. 竖 (Shù) - Tegak kiri kotak 日", "2. 横折 (Héngzhé) - Mendatar tekuk kotak 日", "3. 横 (Héng) - Mendatar dalam kotak 日", "4. 横 (Héng) - Mendatar penutup kotak 日", "5. 点 (Diǎn) - Titik kepala 京", "6. 横 (Héng) - Mendatar bahu 京", "7. 竖 (Shù) - Tegak kiri kotak mulut tengah 京", "8. 横折 (Héngzhé) - Mendatar tekuk mulut tengah 京", "9. 横 (Héng) - Mendatar penutup mulut tengah 京", "10. 竖钩 (Shùgōu) - Tegak berkait tengah 京", "11. 撇 (Piě) - Miring kiri bawah", "12. 点 (Diǎn) - Titik kanan bawah"]],
    ["char" => "商", "pinyin" => "shāng", "meaning" => "Bisnis / Perdagangan (Commerce / Trade)", "strokesCount" => 11, "rules" => "Luar ke Dalam, Atas ke Bawah (Kepala 亠, Mahkota 冂, Isi, Mulut 口)", "steps" => ["1. 点 (Diǎn) - Titik kepala paling atas", "2. 横 (Héng) - Mendatar pelindung", "3. 点 (Diǎn) - Titik serong kiri", "4. 撇 (Piě) - Miring kanan serong", "5. 竖 (Shù) - Tegak kiri bingkai 冂", "6. 横折钩 (Héngzhégōu) - Mendatar tekuk kait bingkai 冂", "7. 撇 (Piě) - Miring kiri bagian dalam", "8. 点 (Diǎn) - Titik kanan bagian dalam", "9. 竖 (Shù) - Tegak kiri kotak 口 bawah", "10. 横折 (Héngzhé) - Mendatar tekuk kotak 口", "11. 横 (Héng) - Mendatar penutup kotak 口"]],
    ["char" => "精", "pinyin" => "jīng", "meaning" => "Teliti / Esensi / Energi (Precise / Essence)", "strokesCount" => 14, "rules" => "Kiri ke Kanan (Radikal Beras 米 di kiri, Biru-Hijau 青 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik kiri beras 米", "2. 撇 (Piě) - Miring kanan beras 米", "3. 横 (Héng) - Mendatar tengah beras 米", "4. 竖 (Shù) - Tegak lurus membelah beras 米", "5. 撇 (Piě) - Miring kiri bawah beras 米", "6. 点 (Diǎn) - Titik kanan bawah beras 米", "7. 横 (Héng) - Mendatar pertama atas 青", "8. 横 (Héng) - Mendatar kedua 青", "9. 竖 (Shù) - Tegak tengah 青", "10. 横 (Héng) - Mendatar panjang ketiga 青", "11. 竖 (Shù) - Tegak kiri bulan 月 di bawah", "12. 横折钩 (Héngzhégōu) - Mendatar tekuk kait bulan 月", "13. 横 (Héng) - Mendatar dalam bulan 月", "14. 横 (Héng) - Mendatar kedua dalam bulan 月"]],
    ["char" => "富", "pinyin" => "fù", "meaning" => "Kaya / Berlimpah (Rich / Wealthy)", "strokesCount" => 12, "rules" => "Atas ke Bawah (Atap 宀 di atas, Satu 一, Mulut 口, Ladang 田 di bawah)", "steps" => ["1. 点 (Diǎn) - Titik puncak atap 宀", "2. 点 (Diǎn) - Titik kiri atap 宀", "3. 横撇/横钩 (Hénggōu) - Mendatar tekuk kait atap 宀", "4. 横 (Héng) - Mendatar karakter 一", "5. 竖 (Shù) - Tegak kiri mulut 口", "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "7. 横 (Héng) - Mendatar penutup mulut 口", "8. 竖 (Shù) - Tegak kiri kotak ladang 田", "9. 横折 (Héngzhé) - Mendatar tekuk ladang 田", "10. 横 (Héng) - Mendatar tengah ladang 田", "11. 竖 (Shù) - Tegak tengah ladang 田", "12. 横 (Héng) - Mendatar penutup bawah ladang 田"]],
    ["char" => "环", "pinyin" => "huán", "meaning" => "Cincin / Lingkungan (Ring / Environment)", "strokesCount" => 8, "rules" => "Kiri ke Kanan (Radikal Giok 王 di kiri, Tak Ada 不 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas giok 王", "2. 横 (Héng) - Mendatar kedua giok 王", "3. 竖 (Shù) - Tegak lurus giok 王", "4. 提 (Tí) - Sapuan naik giok 王", "5. 横 (Héng) - Mendatar panjang atas karakter 不", "6. 撇 (Piě) - Miring kiri karakter 不", "7. 竖 (Shù) - Tegak tengah karakter 不", "8. 点 (Diǎn) - Titik kanan penutup karakter 不"]],
    ["char" => "境", "pinyin" => "jìng", "meaning" => "Perbatasan / Kondisi (Border / Condition)", "strokesCount" => 14, "rules" => "Kiri ke Kanan (Radikal Tanah 土 di kiri, Cermin 竟 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas tanah 土", "2. 竖 (Shù) - Tegak tanah 土", "3. 提 (Tí) - Sapuan naik tanah 土", "4. 点 (Diǎn) - Titik atas karakter 竟", "5. 横 (Héng) - Mendatar atas 竟", "6. 点 (Diǎn) - Titik kiri 竟", "7. 撇 (Piě) - Miring kanan 竟", "8. 横 (Héng) - Mendatar tengah 竟", "9. 口 (Kǒu/3 goresan) - Kotak tengah 日 竟", "10. 撇 (Piě) - Miring kiri kaki 竟", "11. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 竟", "12. 点 (Diǎn) - Titik aksen", "13. 横 (Héng) - Mendatar penutup", "14. 竖 (Shù) - Tegak penyeimbang"]],
    ["char" => "保", "pinyin" => "bǎo", "meaning" => "Menjaga / Melindungi (Protect / Keep)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Radikal Orang 亻 di kiri, 口 dan 木 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal orang 亻", "2. 竖 (Shù) - Tegak radikal orang 亻", "3. 竖 (Shù) - Tegak kiri kotak mulut 口", "4. 横折 (Héngzhé) - Mendatar tekuk kotak 口", "5. 横 (Héng) - Mendatar penutup kotak 口", "6. 木-横 (Héng) - Mendatar dahan kayu 木", "7. 木-竖 (Shù) - Tegak lurus batang pohon 木", "8. 木-撇 (Piě) - Miring kiri akar 木", "9. 木-捺 (Nà) - Sapuan kanan akar 木"]],
    ["char" => "护", "pinyin" => "hù", "meaning" => "Melindungi / Merawat (Shield / Guard)", "strokesCount" => 7, "rules" => "Kiri ke Kanan (Radikal Tangan 扌 di kiri, Pintu 戸 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar radikal tangan 扌", "2. 竖钩 (Shùgōu) - Tegak berkait radikal tangan 扌", "3. 提 (Tí) - Sapuan naik tangan 扌", "4. 点 (Diǎn) - Titik puncak radikal pintu 戸", "5. 横折 (Héngzhé) - Mendatar tekuk pintu 戸", "6. 横 (Héng) - Mendatar dalam pintu 戸", "7. 撇 (Piě) - Miring melengkung kiri pelindung 戸"]],
    ["char" => "积", "pinyin" => "jī", "meaning" => "Mengumpulkan / Positif (Accumulate / Positive)", "strokesCount" => 10, "rules" => "Kiri ke Kanan (Padi 禾 di kiri, Hanya 只 di kanan)", "steps" => ["1. 撇 (Piě) - Miring bulir padi 禾", "2. 横 (Héng) - Mendatar padi 禾", "3. 竖 (Shù) - Tegak padi 禾", "4. 撇 (Piě) - Miring kiri akar padi 禾", "5. 点 (Diǎn) - Titik kanan akar padi 禾", "6. 竖 (Shù) - Tegak kiri mulut 只", "7. 横折 (Héngzhé) - Mendatar tekuk mulut 只", "8. 横 (Héng) - Mendatar penutup mulut 只", "9. 撇 (Piě) - Miring kaki kiri 只", "10. 点 (Diǎn) - Titik serong kaki kanan 只"]],
    ["char" => "极", "pinyin" => "jí", "meaning" => "Sangat / Kutub (Extremely / Pole)", "strokesCount" => 7, "rules" => "Kiri ke Kanan (Pohon 木 di kiri, 及 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar kayu 木", "2. 竖 (Shù) - Tegak kayu 木", "3. 撇 (Piě) - Miring kiri kayu 木", "4. 点 (Diǎn) - Titik kanan kayu 木", "5. 撇 (Piě) - Miring karakter 及", "6. 横折折撇 (Héngzhézhépiě) - Lekuk badan karakter 及", "7. 捺 (Nà) - Sapuan tebal panjang memotong kanan 及"]],
    ["char" => "律", "pinyin" => "lǜ", "meaning" => "Hukum / Irama (Law / Rhythm)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Langkah ganda 彳 di kiri, Kuas 聿 di kanan)", "steps" => ["1. 撇 (Piě) - Miring atas radikal 彳", "2. 撇 (Piě) - Miring kedua radikal 彳", "3. 竖 (Shù) - Tegak radikal 彳", "4. 横折 (Héngzhé) - Mendatar tekuk kuas 聿", "5. 横 (Héng) - Mendatar pertama 聿", "6. 横 (Héng) - Mendatar kedua 聿", "7. 横 (Héng) - Mendatar panjang ketiga 聿", "8. 竖 (Shù) - Tegak lurus panjang menembus kuas 聿", "9. 点 (Diǎn) - Titik keseimbangan kuas 聿"]],
    ["char" => "师", "pinyin" => "shī", "meaning" => "Guru / Ahli (Teacher / Master)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Bagian 刂/阜 di kiri, Handuk 巾 di kanan)", "steps" => ["1. 竖 (Shù) - Tegak sisi kiri", "2. 撇 (Piě) - Miring pendek kiri", "3. 一 (Héng) - Mendatar atas", "4. 竖 (Shù) - Tegak kiri kain 巾", "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait kain 巾", "6. 竖 (Shù) - Tegak lurus panjang membelah tengah 巾"]],
    ["char" => "研", "pinyin" => "yán", "meaning" => "Meneliti / Menggiling (Research / Grind)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Batu 石 di kiri, Buka 开 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar batu 石", "2. 撇 (Piě) - Miring kiri batu 石", "3. 口-竖 (Shù) - Tegak kotak batu 石", "4. 口-横折 (Héngzhé) - Mendatar tekuk batu 石", "5. 口-横 (Héng) - Mendatar penutup batu 石", "6. 横 (Héng) - Mendatar pertama buka 开", "7. 横 (Héng) - Mendatar panjang kedua 开", "8. 撇 (Piě) - Miring kiri kaki 开", "9. 竖 (Shù) - Tegak lurus kaki kanan 开"]],
    ["char" => "究", "pinyin" => "jiū", "meaning" => "Mengkaji / Menyelidiki (Investigate / Study)", "strokesCount" => 7, "rules" => "Atas ke Bawah (Gua 穴 di atas, Sembilan 九 di bawah)", "steps" => ["1. 点 (Diǎn) - Titik puncak atap gua 穴", "2. 点 (Diǎn) - Titik kiri atap gua 穴", "3. 横撇/横钩 (Hénggōu) - Mendatar tekuk kait 穴", "4. 撇 (Piě) - Miring kiri dalam 穴", "5. 点 (Diǎn) - Titik kanan dalam 穴", "6. 撇 (Piě) - Miring melengkung karakter 九", "7. 横折弯钩 (Héngzhéwāngōu) - Mendatar tekuk lengkung berkait karakter 九"]],
    ["char" => "底", "pinyin" => "dǐ", "meaning" => "Dasar / Latar (Bottom / Base)", "strokesCount" => 8, "rules" => "Luar Dulu Baru Dalam (Rumah 广 di luar, 氐 di dalam)", "steps" => ["1. 点 (Diǎn) - Titik atap rumah 广", "2. 横 (Héng) - Mendatar rumah 广", "3. 撇 (Piě) - Miring pelindung rumah 广", "4. 撇 (Piě) - Miring atas bagian 氐", "5. 竖提 (Shùtí) - Tegak sapuan naik 氐", "6. 横 (Héng) - Mendatar penyambung 氐", "7. 斜钩 (Xiégōu) - Miring lengkung kait panjang 氐", "8. 点 (Diǎn) - Titik penutup di dalam 氐"]],
    ["char" => "格", "pinyin" => "gé", "meaning" => "Pola / Kotak / Standar (Pattern / Grid)", "strokesCount" => 10, "rules" => "Kiri ke Kanan (Kayu 木 di kiri, Setiap 各 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar kayu 木", "2. 竖 (Shù) - Tegak kayu 木", "3. 撇 (Piě) - Miring kiri kayu 木", "4. 点 (Diǎn) - Titik kanan kayu 木", "5. 撇 (Piě) - Miring langkah 各", "6. 横撇 (Héngpiě) - Mendatar tekuk 各", "7. 捺 (Nà) - Sapuan miring kanan 各", "8. 竖 (Shù) - Tegak mulut 各", "9. 横折 (Héngzhé) - Mendatar tekuk mulut 各", "10. 横 (Héng) - Mendatar penutup mulut 各"]],
    ["char" => "局", "pinyin" => "jú", "meaning" => "Biro / Kantor / Situasi (Bureau / Game)", "strokesCount" => 7, "rules" => "Luar Dulu Baru Dalam (Mayat 尸 di luar, Mulut 口 di dalam)", "steps" => ["1. 横折 (Héngzhé) - Mendatar tekuk radikal 尸", "2. 横 (Héng) - Mendatar kedua radikal 尸", "3. 撇 (Piě) - Miring pelindung panjang radikal 尸", "4. 横折钩 (Héngzhégōu) - Mendatar tekuk kait dalam", "5. 竖 (Shù) - Tegak kiri mulut 口", "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "7. 横 (Héng) - Mendatar penutup bawah mulut 口"]],
    ["char" => "术", "pinyin" => "shù", "meaning" => "Seni / Teknik / Metode (Art / Technique)", "strokesCount" => 5, "rules" => "Kayu 木 Dulu, lalu Titik di Kanan Atas (丶)", "steps" => ["1. 横 (Héng) - Garis mendatar dahan", "2. 竖 (Shù) - Garis tegak lurus batang pohon menembus", "3. 撇 (Piě) - Garis miring ke kiri bawah", "4. 捺 (Nà) - Sapuan miring memanjang ke kanan bawah", "5. 点 (Diǎn) - Titik penutup di kanan atas"]],
    ["char" => "互", "pinyin" => "hù", "meaning" => "Saling / Bersama (Mutual / Each other)", "strokesCount" => 4, "rules" => "Mendatar Atas, Garis Lekuk Tengah, lalu Mendatar Bawah", "steps" => ["1. 横 (Héng) - Garis mendatar atas", "2. 撇折 (Piězhé) - Garis miring tekuk mendatar", "3. 横折 (Héngzhé) - Garis mendatar tekuk tegak", "4. 横 (Héng) - Garis mendatar penutup bawah paling panjang"]],
    ["char" => "联", "pinyin" => "lián", "meaning" => "Menghubungkan / Bersatu (Connect / Ally)", "strokesCount" => 12, "rules" => "Kiri ke Kanan (Telinga 耳 di kiri, 関/关 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas telinga 耳", "2. 竖 (Shù) - Tegak kiri 耳", "3. 竖 (Shù) - Tegak kanan 耳", "4. 横 (Héng) - Mendatar dalam pertama 耳", "5. 横 (Héng) - Mendatar dalam kedua 耳", "6. 提 (Tí) - Sapuan naik bawah 耳", "7. 点 (Diǎn) - Titik kiri 关", "8. 撇 (Piě) - Miring kanan 关", "9. 横 (Héng) - Mendatar pertama 关", "10. 横 (Héng) - Mendatar kedua 关", "11. 撇 (Piě) - Miring kaki 关", "12. 捺 (Nà) - Sapuan kanan kaki 关"]]
];

foreach ($hsk4Words as $w) {
    $strokeCharacters[] = [
        "char" => $w["char"],
        "pinyin" => $w["pinyin"],
        "meaning" => $w["meaning"],
        "strokesCount" => $w["strokesCount"],
        "hskLevel" => "HSK 4",
        "rules" => $w["rules"],
        "strokeSteps" => $w["steps"]
    ];
}

// =========================================================================
// HSK 5 (20 Kosakata)
// =========================================================================
$hsk5Words = [
    ["char" => "德", "pinyin" => "dé", "meaning" => "Kebajikan / Moralitas (Virtue / Morality)", "strokesCount" => 15, "rules" => "Kiri ke Kanan (Langkah ganda 彳 di kiri, Sepuluh 十, Mata 四, Hati 心)", "steps" => ["1. 撇 (Piě) - Miring kiri pertama radikal 彳", "2. 撇 (Piě) - Miring kiri kedua radikal 彳", "3. 竖 (Shù) - Tegak lurus radikal 彳", "4. 横 (Héng) - Mendatar atas bagian 十", "5. 竖 (Shù) - Tegak lurus bagian 十", "6. 竖 (Shù) - Tegak kiri kotak mata", "7. 横折 (Héngzhé) - Mendatar tekuk kotak mata", "8. 竖 (Shù) - Garis tegak dalam mata", "9. 竖 (Shù) - Garis tegak kedua dalam mata", "10. 横 (Héng) - Mendatar penutup kotak mata", "11. 横 (Héng) - Garis mendatar pemisah", "12. 点 (Diǎn) - Titik kiri hati 心", "13. 卧钩 (Wògōu) - Lengkungan rebah berkait hati 心", "14. 点 (Diǎn) - Titik tengah hati 心", "15. 点 (Diǎn) - Titik kanan luar hati 心"]],
    ["char" => "慧", "pinyin" => "huì", "meaning" => "Kebijaksanaan / Cerdas (Wisdom / Intelligent)", "strokesCount" => 15, "rules" => "Atas ke Bawah (Bagian Sapu 彗 di atas, Hati 心 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar sapu kiri", "2. 横 (Héng) - Mendatar kedua sapu kiri", "3. 竖 (Shù) - Tegak sapu kiri", "4. 横 (Héng) - Mendatar sapu kanan", "5. 横 (Héng) - Mendatar kedua sapu kanan", "6. 竖 (Shù) - Tegak sapu kanan", "7. 横折 (Héngzhé) - Tekuk atas bagian 彐", "8. 横 (Héng) - Mendatar tengah 彐", "9. 横 (Héng) - Mendatar bawah 彐", "10. 点 (Diǎn) - Titik kiri hati 心", "11. 卧钩 (Wògōu) - Lengkung berkait rebah hati 心", "12. 点 (Diǎn) - Titik tengah hati 心", "13. 点 (Diǎn) - Titik penutup kanan hati 心", "14. 点 (Diǎn) - Titik pembantu aksen", "15. 点 (Diǎn) - Titik estetika kaligrafi"]],
    ["char" => "敏", "pinyin" => "mǐn", "meaning" => "Peka / Tangkas / Cepat (Sensitive / Agile)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Setiap 每 di kiri, Radikal Memukul 攵 di kanan)", "steps" => ["1. 撇 (Piě) - Miring atas 每", "2. 横 (Héng) - Mendatar atas 每", "3. 竖折 (Shùzhé) - Tegak tekuk 每", "4. 横折钩 (Héngzhégōu) - Mendatar kait 每", "5. 点 (Diǎn) - Titik atas dalam 每", "6. 点 (Diǎn) - Titik bawah dalam 每", "7. 横 (Héng) - Mendatar panjang menembus 每", "8. 撇 (Piě) - Miring pertama radikal 攵", "9. 横 (Héng) - Mendatar kedua radikal 攵", "10. 撇 (Piě) - Miring panjang radikal 攵", "11. 捺 (Nà) - Sapuan miring kanan radikal 攵"]],
    ["char" => "诚", "pinyin" => "chéng", "meaning" => "Tulus / Jujur (Sincere / Honest)", "strokesCount" => 8, "rules" => "Kiri ke Kanan (Radikal Kata 讠 di kiri, 成 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik radikal kata 讠", "2. 横折提 (Héngzhétí) - Mendatar tekuk sapuan naik 讠", "3. 横 (Héng) - Mendatar pertama 成", "4. 撇 (Piě) - Sapuan miring membelah 成", "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 成", "6. 斜钩 (Xiégōu) - Miring lengkung kait panjang 成", "7. 撇 (Piě) - Miring kecil 成", "8. 点 (Diǎn) - Titik penutup kanan atas 成"]],
    ["char" => "谦", "pinyin" => "qiān", "meaning" => "Rendah Hati / Sopan (Humble / Modest)", "strokesCount" => 12, "rules" => "Kiri ke Kanan (Radikal Kata 讠 di kiri, 兼 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik radikal kata 讠", "2. 横折提 (Héngzhétí) - Mendatar tekuk sapuan naik 讠", "3. 点 (Diǎn) - Titik puncak bagian 兼", "4. 撇 (Piě) - Miring pelindung 兼", "5. 横 (Héng) - Mendatar pertama 兼", "6. 竖 (Shù) - Tegak kiri 兼", "7. 竖 (Shù) - Tegak kanan 兼", "8. 横 (Héng) - Mendatar kedua 兼", "9. 撇 (Piě) - Miring kiri bawah 兼", "10. 捺 (Nà) - Sapuan kanan 兼", "11. 撇 (Piě) - Miring kaki kiri 兼", "12. 点 (Diǎn) - Titik kaki kanan 兼"]],
    ["char" => "逊", "pinyin" => "xùn", "meaning" => "Santun / Kalah Kelas (Modest / Inferior)", "strokesCount" => 9, "rules" => "Dalam Dulu Baru Radikal Berjalan (Cucu 孙 di dalam, baru 辶)", "steps" => ["1. 横撇 (Héngpiě) - Mendatar tekuk miring anak 子", "2. 弯钩 (Wāngōu) - Lengkung berkait anak 子", "3. 提 (Tí) - Sapuan naik anak 子", "4. 撇 (Piě) - Miring kiri kecil 小", "5. 竖钩 (Shùgōu) - Tegak berkait kecil 小", "6. 点 (Diǎn) - Titik penutup kecil 小", "7. 点 (Diǎn) - Titik kepala radikal berjalan 辶", "8. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶", "9. 捺 (Nà) - Sapuan landai panjang di bawah 辶"]],
    ["char" => "毅", "pinyin" => "yì", "meaning" => "Teguh / Pantang Menyerah (Persevering / Resolute)", "strokesCount" => 15, "rules" => "Kiri ke Kanan (Bagian Babi/Taring 豖 di kiri, Radikal Memukul 殳 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas bagian 豖", "2. 竖 (Shù) - Tegak tengah 豖", "3. 横 (Héng) - Mendatar kedua 豖", "4. 撇 (Piě) - Miring kiri 豖", "5. 弯钩 (Wāngōu) - Lengkung kait 豖", "6. 撇 (Piě) - Miring pendek 豖", "7. 撇 (Piě) - Miring panjang 豖", "8. 捺 (Nà) - Sapuan kanan 豖", "9. 点 (Diǎn) - Titik penutup 豖", "10. 撇 (Piě) - Miring atas radikal 殳", "11. 撇折 (Piězhé) - Miring tekuk 殳", "12. 横折弯 (Héngzhéwān) - Mendatar tekuk 殳", "13. 撇 (Piě) - Miring melengkung 殳", "14. 横 (Héng) - Mendatar 殳", "15. 捺 (Nà) - Sapuan kanan panjang penyeimbang 殳"]],
    ["char" => "恒", "pinyin" => "héng", "meaning" => "Abadi / Tekun Konsisten (Eternal / Constant)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Radikal Hati Tegak 忄 di kiri, 亘 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik kiri radikal hati 忄", "2. 点 (Diǎn) - Titik kanan radikal hati 忄", "3. 竖 (Shù) - Tegak lurus memotong tengah radikal hati 忄", "4. 一 (Héng) - Mendatar atas bagian 亘", "5. 口-竖 (Shù) - Tegak kiri kotak matahari 日", "6. 口-横折 (Héngzhé) - Mendatar tekuk matahari 日", "7. 口-横 (Héng) - Mendatar dalam matahari 日", "8. 口-横 (Héng) - Mendatar penutup matahari 日", "9. 一 (Héng) - Mendatar panjang penutup pondasi 亘"]],
    ["char" => "博", "pinyin" => "bó", "meaning" => "Luas / Berilmu Tinggi (Broad / Erudite)", "strokesCount" => 12, "rules" => "Kiri ke Kanan (Sepuluh 十 di kiri, 甫 dan Titik di kanan)", "steps" => ["1. 横 (Héng) - Mendatar radikal sepuluh 十", "2. 竖 (Shù) - Tegak lurus radikal sepuluh 十", "3. 横 (Héng) - Mendatar atas bagian kanan", "4. 竖 (Shù) - Tegak kiri bagian 甫", "5. 横折 (Héngzhé) - Mendatar tekuk bingkai 甫", "6. 横 (Héng) - Mendatar dalam bingkai 甫", "7. 竖 (Shù) - Tegak lurus tengah menembus 甫", "8. 横 (Héng) - Mendatar penutup bawah 甫", "9. 点 (Diǎn) - Titik kanan atas 甫", "10. 撇 (Piě) - Miring pendek kanan", "11. 横 (Héng) - Mendatar bawah", "12. 点 (Diǎn) - Titik penutup di kanan bawah"]],
    ["char" => "览", "pinyin" => "lǎn", "meaning" => "Memandang / Meninjau (View / Look at)", "strokesCount" => 12, "rules" => "Atas ke Bawah (Bagian 臣 dan Cakar di atas, Melihat 见 di bawah)", "steps" => ["1. 竖 (Shù) - Tegak pertama menteri 臣", "2. 横折 (Héngzhé) - Mendatar tekuk 臣", "3. 横 (Héng) - Mendatar 臣", "4. 竖 (Shù) - Tegak kedua 臣", "5. 横折 (Héngzhé) - Mendatar tekuk kedua 臣", "6. 横 (Héng) - Mendatar penutup 臣", "7. 撇 (Piě) - Miring cakar", "8. 点 (Diǎn) - Titik penyeimbang", "9. 竖 (Shù) - Tegak kiri melihat 见", "10. 横折 (Héngzhé) - Mendatar tekuk 见", "11. 撇 (Piě) - Miring kaki kiri 见", "12. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki kanan 见"]],
    ["char" => "哲", "pinyin" => "zhé", "meaning" => "Filsafat / Bijaksana (Philosophy / Wise)", "strokesCount" => 10, "rules" => "Atas ke Bawah (Patah 折 di atas, Mulut 口 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar tangan 扌", "2. 竖钩 (Shùgōu) - Tegak berkait tangan 扌", "3. 提 (Tí) - Sapuan naik tangan 扌", "4. 撇 (Piě) - Miring atas kapak 斤", "5. 撇 (Piě) - Miring panjang kapak 斤", "6. 横 (Héng) - Mendatar kapak 斤", "7. 竖 (Shù) - Tegak lurus kapak 斤", "8. 竖 (Shù) - Tegak kotak mulut 口 di bawah", "9. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "10. 横 (Héng) - Mendatar penutup bawah mulut 口"]],
    ["char" => "理", "pinyin" => "lǐ", "meaning" => "Logika / Menata (Reason / Manage)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Radikal Giok 王 di kiri, Desa 里 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas giok 王", "2. 横 (Héng) - Mendatar kedua giok 王", "3. 竖 (Shù) - Tegak lurus giok 王", "4. 提 (Tí) - Sapuan naik giok 王", "5. 竖 (Shù) - Tegak kiri ladang 田 karakter 里", "6. 横折 (Héngzhé) - Mendatar tekuk ladang 田", "7. 横 (Héng) - Mendatar tengah ladang 田", "8. 横 (Héng) - Mendatar penutup ladang 田", "9. 竖 (Shù) - Tegak panjang menembus tengah 里", "10. 横 (Héng) - Mendatar penyangga 里", "11. 横 (Héng) - Mendatar panjang penutup pondasi 里"]],
    ["char" => "创", "pinyin" => "chuàng", "meaning" => "Mencipta / Inovasi (Create / Innovate)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Gudang 仓 di kiri, Radikal Pisau Tegak 刂 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kepala gudang 仓", "2. 捺 (Nà) - Sapuan kanan kepala 仓", "3. 横折钩 (Héngzhégōu) - Mendatar tekuk kait 仓", "4. 竖弯钩 (Shùwāngōu) - Tegak lengkung kait 仓", "5. 竖 (Shù) - Tegak pendek pisau 刂", "6. 竖钩 (Shùgōu) - Tegak lurus panjang berkait pisau 刂"]],
    ["char" => "造", "pinyin" => "zào", "meaning" => "Membangun / Membuat (Build / Make)", "strokesCount" => 10, "rules" => "Dalam Dulu Baru Radikal Berjalan (Menyatakan 告 di dalam, baru 辶)", "steps" => ["1. 撇 (Piě) - Miring atas karakter 告", "2. 横 (Héng) - Mendatar atas karakter 告", "3. 竖 (Shù) - Tegak karakter 告", "4. 横 (Héng) - Mendatar panjang kedua 告", "5. 竖 (Shù) - Tegak kiri mulut 口", "6. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "7. 横 (Héng) - Mendatar penutup mulut 口", "8. 点 (Diǎn) - Titik kepala radikal berjalan 辶", "9. 横折折撇 (Héngzhézhépiě) - Lekukan badan radikal 辶", "10. 捺 (Nà) - Sapuan landai panjang di bawah melandasi 辶"]],
    ["char" => "融", "pinyin" => "róng", "meaning" => "Melebur / Harmonis / Finansial (Melt / Finance)", "strokesCount" => 16, "rules" => "Kiri ke Kanan (Panci Kaki Tiga 鬲 di kiri, Ulat 虫 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas panci 鬲", "2. 口-竖 (Shù) - Tegak mulut atas 鬲", "3. 口-横折 (Héngzhé) - Mendatar tekuk mulut 鬲", "4. 口-横 (Héng) - Mendatar penutup mulut 鬲", "5. 冂-竖 (Shù) - Tegak kiri pinggul 鬲", "6. 冂-横折 (Héngzhé) - Mendatar tekuk pinggul 鬲", "7. 横 (Héng) - Mendatar pemisah 鬲", "8. 竖 (Shù) - Tegak kaki kiri 鬲", "9. 竖 (Shù) - Tegak kaki kanan 鬲", "10. 竖 (Shù) - Tegak ulat 虫", "11. 横折 (Héngzhé) - Mendatar tekuk badan 虫", "12. 横 (Héng) - Mendatar penutup 虫", "13. 竖 (Shù) - Tegak panjang menembus 虫", "14. 提 (Tí) - Sapuan naik bawah 虫", "15. 点 (Diǎn) - Titik penutup kanan 虫", "16. 点 (Diǎn) - Titik aksen kestabilan"]],
    ["char" => "洽", "pinyin" => "qià", "meaning" => "Harmonis / Negosiasi Sepakat (Harmonious / Agree)", "strokesCount" => 9, "rules" => "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, 合 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik pertama air 氵", "2. 点 (Diǎn) - Titik kedua air 氵", "3. 提 (Tí) - Sapuan naik air 氵", "4. 撇 (Piě) - Miring kepala karakter 合", "5. 捺 (Nà) - Sapuan kanan kepala 合", "6. 横 (Héng) - Mendatar pembatas 合", "7. 竖 (Shù) - Tegak mulut 口 合", "8. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "9. 横 (Héng) - Mendatar penutup mulut 口"]],
    ["char" => "繁", "pinyin" => "fán", "meaning" => "Makmur / Rumit / Beragam (Flourishing / Complex)", "strokesCount" => 17, "rules" => "Atas ke Bawah (Setiap 每 dan Memukul 攵 di atas, Sutra 糸 di bawah)", "steps" => ["1. 撇 (Piě) - Miring atas karakter 每", "2. 横 (Héng) - Mendatar karakter 每", "3. 竖折 (Shùzhé) - Garis lekuk 每", "4. 横折钩 (Héngzhégōu) - Kait 每", "5. 点 (Diǎn) - Titik dalam 每", "6. 横 (Héng) - Garis tengah 每", "7. 撇 (Piě) - Miring pertama radikal 攵", "8. 横 (Héng) - Mendatar radikal 攵", "9. 撇 (Piě) - Miring panjang radikal 攵", "10. 捺 (Nà) - Sapuan tebal kanan radikal 攵", "11. 撇折 (Piězhé) - Miring tekuk pertama sutra 糸", "12. 撇折 (Piězhé) - Miring tekuk kedua sutra 糸", "13. 点 (Diǎn) - Titik penyeimbang sutra 糸", "14. 竖钩 (Shùgōu) - Tegak berkait tengah sutra 糸", "15. 撇 (Piě) - Miring kiri sutra 糸", "16. 点 (Diǎn) - Titik kanan sutra 糸", "17. 点 (Diǎn) - Titik aksen penutup kaligrafi"]],
    ["char" => "荣", "pinyin" => "róng", "meaning" => "Kejayaan / Kehormatan (Glory / Honor)", "strokesCount" => 9, "rules" => "Atas ke Bawah (Radikal Rumput 艹 di atas, Mahkota 冖 di tengah, Kayu 木 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar radikal rumput 艹", "2. 竖 (Shù) - Tegak kiri rumput 艹", "3. 竖 (Shù) - Tegak kanan rumput 艹", "4. 点 (Diǎn) - Titik kiri mahkota 冖", "5. 横撇/横钩 (Hénggōu) - Mendatar tekuk mahkota 冖", "6. 木-横 (Héng) - Mendatar dahan kayu 木", "7. 木-竖 (Shù) - Tegak lurus batang pohon 木", "8. 木-撇 (Piě) - Miring kiri akar 木", "9. 木-捺 (Nà) - Sapuan miring kanan akar 木"]],
    ["char" => "优", "pinyin" => "yōu", "meaning" => "Unggul / Istimewa (Excellent / Superior)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Radikal Orang 亻 di kiri, Terutama 尤 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal orang 亻", "2. 竖 (Shù) - Tegak radikal orang 亻", "3. 横 (Héng) - Mendatar atas karakter 尤", "4. 撇 (Piě) - Miring kiri melengkung 尤", "5. 弯钩 (Wāngōu) - Lengkung berkait kanan 尤", "6. 点 (Diǎn) - Titik penutup di kanan atas 尤"]],
    ["char" => "雅", "pinyin" => "yǎ", "meaning" => "Elegan / Anggun / Luhur (Elegant / Refined)", "strokesCount" => 12, "rules" => "Kiri ke Kanan (Gigi 牙 di kiri, Burung Berekor Pendek 隹 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas gigi 牙", "2. 竖折 (Shùzhé) - Tegak tekuk gigi 牙", "3. 竖钩 (Shùgōu) - Tegak berkait gigi 牙", "4. 撇 (Piě) - Miring penutup gigi 牙", "5. 撇 (Piě) - Miring atas burung 隹", "6. 竖 (Shù) - Tegak lurus burung 隹", "7. 点 (Diǎn) - Titik pelindung burung 隹", "8. 横 (Héng) - Mendatar pertama burung 隹", "9. 横 (Héng) - Mendatar kedua burung 隹", "10. 横 (Héng) - Mendatar ketiga burung 隹", "11. 竖 (Shù) - Tegak tengah burung 隹", "12. 横 (Héng) - Mendatar penutup panjang burung 隹"]]
];

foreach ($hsk5Words as $w) {
    $strokeCharacters[] = [
        "char" => $w["char"],
        "pinyin" => $w["pinyin"],
        "meaning" => $w["meaning"],
        "strokesCount" => $w["strokesCount"],
        "hskLevel" => "HSK 5",
        "rules" => $w["rules"],
        "strokeSteps" => $w["steps"]
    ];
}

// =========================================================================
// HSK 6 (20 Kosakata)
// =========================================================================
$hsk6Words = [
    ["char" => "睿", "pinyin" => "ruì", "meaning" => "Berpandangan Jauh / Bijak Bestari (Farsighted / Astute)", "strokesCount" => 14, "rules" => "Atas ke Bawah (Bagian 攴/𣦵 atas, Mata 目 di bawah)", "steps" => ["1. 点 (Diǎn) - Titik kiri atas", "2. 横撇 (Héngpiě) - Mendatar miring kiri", "3. 点 (Diǎn) - Titik tengah atas", "4. 撇 (Piě) - Miring kiri pelindung", "5. 捺 (Nà) - Sapuan tebal kanan", "6. 竖 (Shù) - Tegak kiri kotak penghubung", "7. 横折 (Héngzhé) - Mendatar tekuk", "8. 横 (Héng) - Mendatar penutup tengah", "9. 竖 (Shù) - Tegak kiri kotak mata 目", "10. 横折 (Héngzhé) - Mendatar tekuk kotak mata 目", "11. 横 (Héng) - Mendatar pertama dalam 目", "12. 横 (Héng) - Mendatar kedua dalam 目", "13. 横 (Héng) - Mendatar penutup bawah kotak 目", "14. 点 (Diǎn) - Titik kestabilan struktur"]],
    ["char" => "韬", "pinyin" => "tāo", "meaning" => "Menyembunyikan / Strategi Militer Luhur (Conceal / Strategy)", "strokesCount" => 14, "rules" => "Kiri ke Kanan (Kulit 韦 di kiri, 舀 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas kulit 韦", "2. 横 (Héng) - Mendatar kedua kulit 韦", "3. 竖 (Shù) - Tegak kulit 韦", "4. 提 (Tí) - Sapuan naik kulit 韦", "5. 撇 (Piě) - Miring cakar atas 爫", "6. 点 (Diǎn) - Titik pertama cakar 爫", "7. 点 (Diǎn) - Titik kedua cakar 爫", "8. 点 (Diǎn) - Titik ketiga cakar 爫", "9. 撇 (Piě) - Miring atas lesung 臼", "10. 竖 (Shù) - Tegak kiri lesung 臼", "11. 横折 (Héngzhé) - Mendatar tekuk lesung 臼", "12. 横 (Héng) - Mendatar dalam lesung 臼", "13. 横 (Héng) - Mendatar kedua dalam lesung 臼", "14. 横 (Héng) - Mendatar penutup bawah lesung 臼"]],
    ["char" => "略", "pinyin" => "lüè", "meaning" => "Rencana / Ringkasan / Strategi (Strategy / Brief)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Ladang 田 di kiri, Setiap 各 di kanan)", "steps" => ["1. 竖 (Shù) - Tegak kiri ladang 田", "2. 横折 (Héngzhé) - Mendatar tekuk ladang 田", "3. 横 (Héng) - Mendatar tengah ladang 田", "4. 竖 (Shù) - Tegak tengah ladang 田", "5. 横 (Héng) - Mendatar penutup ladang 田", "6. 撇 (Piě) - Miring langkah 各", "7. 横撇 (Héngpiě) - Mendatar tekuk 各", "8. 捺 (Nà) - Sapuan kanan 各", "9. 竖 (Shù) - Tegak mulut 各", "10. 横折 (Héngzhé) - Mendatar tekuk mulut 各", "11. 横 (Héng) - Mendatar penutup mulut 各"]],
    ["char" => "邃", "pinyin" => "suì", "meaning" => "Mendalam / Jauh / Misterius (Profound / Deep)", "strokesCount" => 17, "rules" => "Dalam Dulu Baru Radikal Berjalan (Gua 穴 dan Babi 豕 di dalam, baru 辶)", "steps" => ["1. 点 (Diǎn) - Titik puncak gua 穴", "2. 点 (Diǎn) - Titik kiri gua 穴", "3. 横撇/横钩 (Hénggōu) - Mendatar tekuk 穴", "4. 撇 (Piě) - Miring kiri 穴", "5. 点 (Diǎn) - Titik kanan 穴", "6. 一 (Héng) - Mendatar pembatas", "7. 撇 (Piě) - Miring badan babi 豕", "8. 弯钩 (Wāngōu) - Lengkung kait 豕", "9. 撇 (Piě) - Miring pendek 豕", "10. 撇 (Piě) - Miring kedua 豕", "11. 撇 (Piě) - Miring ketiga 豕", "12. 捺 (Nà) - Sapuan kanan 豕", "13. 点 (Diǎn) - Titik penyeimbang 豕", "14. 点 (Diǎn) - Titik kepala radikal berjalan 辶", "15. 横折折撇 (Héngzhézhépiě) - Lekuk radikal 辶", "16. 捺 (Nà) - Sapuan landai panjang penutup 辶", "17. 点 (Diǎn) - Titik kestabilan kaligrafi"]],
    ["char" => "蕴", "pinyin" => "yùn", "meaning" => "Menyimpan / Mengandung Makna Dalam (Contain / Imply)", "strokesCount" => 15, "rules" => "Atas ke Bawah (Radikal Rumput 艹 di atas, Sutra 纟 & Hangat 温 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar rumput 艹", "2. 竖 (Shù) - Tegak kiri rumput 艹", "3. 竖 (Shù) - Tegak kanan rumput 艹", "4. 撇折 (Piězhé) - Miring tekuk sutra 纟", "5. 撇折 (Piězhé) - Miring tekuk kedua sutra 纟", "6. 提 (Tí) - Sapuan naik sutra 纟", "7. 竖 (Shù) - Tegak kiri kotak matahari 日", "8. 横折 (Héngzhé) - Mendatar tekuk 日", "9. 横 (Héng) - Mendatar dalam 日", "10. 横 (Héng) - Mendatar penutup 日", "11. 皿-竖 (Shù) - Tegak kiri piring 皿", "12. 皿-横折 (Héngzhé) - Mendatar tekuk piring 皿", "13. 竖 (Shù) - Garis tegak dalam 皿", "14. 竖 (Shù) - Garis tegak kedua dalam 皿", "15. 横 (Héng) - Mendatar panjang penutup pondasi 皿"]],
    ["char" => "藉", "pinyin" => "jiè", "meaning" => "Beralaskan / Memanfaatkan Peluang (Rely on / Cushion)", "strokesCount" => 17, "rules" => "Atas ke Bawah (Rumput 艹 di atas, Bajak 耒 dan Senjata 昔 di bawah)", "steps" => ["1. 横 (Héng) - Mendatar rumput 艹", "2. 竖 (Shù) - Tegak kiri rumput 艹", "3. 竖 (Shù) - Tegak kanan rumput 艹", "4. 横 (Héng) - Mendatar bajak 耒", "5. 横 (Héng) - Mendatar kedua 耒", "6. 竖 (Shù) - Tegak lurus tengah 耒", "7. 撇 (Piě) - Miring kiri akar 耒", "8. 捺 (Nà) - Sapuan kanan akar 耒", "9. 横 (Héng) - Mendatar pertama senjata", "10. 竖 (Shù) - Tegak pertama senjata", "11. 竖 (Shù) - Tegak kedua senjata", "12. 横 (Héng) - Mendatar panjang penyambung", "13. 日-竖 (Shù) - Tegak kotak matahari 日", "14. 日-横折 (Héngzhé) - Mendatar tekuk 日", "15. 日-横 (Héng) - Mendatar dalam 日", "16. 日-横 (Héng) - Mendatar penutup 日", "17. 点 (Diǎn) - Titik aksen penutup"]],
    ["char" => "宏", "pinyin" => "hóng", "meaning" => "Megah / Agung / Luas (Grand / Magnificent)", "strokesCount" => 7, "rules" => "Atas ke Bawah (Atap 宀 di atas, 厷 di bawah)", "steps" => ["1. 点 (Diǎn) - Titik puncak atap 宀", "2. 点 (Diǎn) - Titik kiri atap 宀", "3. 横撇/横钩 (Hénggōu) - Mendatar tekuk kait atap 宀", "4. 横 (Héng) - Mendatar atas bagian 厷", "5. 撇 (Piě) - Miring melengkung kiri 厷", "6. 捺 (Nà) - Sapuan miring kanan 厷", "7. 厶 (Sī) - Miring tekuk dan titik penutup 厷"]],
    ["char" => "伟", "pinyin" => "wěi", "meaning" => "Hebat / Luhur / Perkasa (Great / Mighty)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Radikal Orang 亻 di kiri, Kulit 韦 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal orang 亻", "2. 竖 (Shù) - Tegak lurus radikal orang 亻", "3. 横 (Héng) - Mendatar atas kulit 韦", "4. 横 (Héng) - Mendatar kedua kulit 韦", "5. 竖 (Shù) - Tegak membelah kulit 韦", "6. 提/横 (Tí) - Sapuan naik bawah kulit 韦"]],
    ["char" => "魄", "pinyin" => "pò", "meaning" => "Jiwa / Keberanian / Wibawa (Spirit / Vigor)", "strokesCount" => 14, "rules" => "Kiri ke Kanan (Putih 白 di kiri, Hantu 鬼 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kepala putih 白", "2. 竖 (Shù) - Tegak kiri 白", "3. 横折 (Héngzhé) - Mendatar tekuk 白", "4. 横 (Héng) - Mendatar dalam 白", "5. 横 (Héng) - Mendatar penutup 白", "6. 撇 (Piě) - Miring atas hantu 鬼", "7. 竖 (Shù) - Tegak kiri kotak kepala 鬼", "8. 横折 (Héngzhé) - Mendatar tekuk kepala 鬼", "9. 横 (Héng) - Mendatar dalam kepala 鬼", "10. 撇 (Piě) - Miring dalam kepala 鬼", "11. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki 鬼", "12. 撇 (Piě) - Miring kaki kiri 鬼", "13. 竖 (Shù) - Tegak kaki kanan 鬼", "14. 点 (Diǎn) - Titik penutup ekor 鬼"]],
    ["char" => "力", "pinyin" => "lì", "meaning" => "Kekuatan / Daya (Power / Force)", "strokesCount" => 2, "rules" => "Mendatar Tekuk Kait Dulu, lalu Garis Miring Membelah", "steps" => ["1. 横折钩 (Héngzhégōu) - Garis mendatar lalu tekuk tegak dengan kait kuat ke kiri", "2. 撇 (Piě) - Garis sapuan miring panjang membelah garis pertama ke kiri bawah"]],
    ["char" => "卓", "pinyin" => "zhuó", "meaning" => "Istimewa / Cemerlang (Outstanding / Brilliant)", "strokesCount" => 8, "rules" => "Atas ke Bawah (Bagian Atas 卜, Matahari 日, lalu Sepuluh 十 di bawah)", "steps" => ["1. 竖 (Shù) - Tegak puncak atas", "2. 横 (Héng) - Mendatar pendek", "3. 竖 (Shù) - Tegak kiri kotak matahari 日", "4. 横折 (Héngzhé) - Mendatar tekuk kotak 日", "5. 横 (Héng) - Mendatar dalam kotak 日", "6. 横 (Héng) - Mendatar penutup bawah kotak 日", "7. 横 (Héng) - Mendatar panjang karakter 十", "8. 竖 (Shù) - Tegak lurus panjang menembus membelah bawah"]],
    ["char" => "越", "pinyin" => "yuè", "meaning" => "Melompat / Melampaui (Surpass / Exceed)", "strokesCount" => 12, "rules" => "Luar Kiri Dulu Baru Dalam Kanan (Berjalan 走 di kiri, Senjata 戉 di kanan)", "steps" => ["1. 横 (Héng) - Mendatar atas karakter berjalan 走", "2. 竖 (Shù) - Tegak karakter 走", "3. 横 (Héng) - Mendatar kedua 走", "4. 竖 (Shù) - Tegak kaki 走", "5. 横 (Héng) - Mendatar penyangga 走", "6. 撇 (Piě) - Miring langkah 走", "7. 捺 (Nà) - Sapuan landai panjang melandasi 走", "8. 横 (Héng) - Mendatar atas senjata 戉", "9. 斜钩 (Xiégōu) - Miring lengkung kait panjang 戉", "10. 撇 (Piě) - Miring dalam 戉", "11. 点 (Diǎn) - Titik kanan atas 戉", "12. 点 (Diǎn) - Titik aksen penutup"]],
    ["char" => "瞻", "pinyin" => "zhān", "meaning" => "Memandang Jauh ke Depan (Look forward / Gaze)", "strokesCount" => 18, "rules" => "Kiri ke Kanan (Mata 目 di kiri, Menghadap 詹 di kanan)", "steps" => ["1. 竖 (Shù) - Tegak kiri kotak mata 目", "2. 横折 (Héngzhé) - Mendatar tekuk mata 目", "3. 横 (Héng) - Mendatar dalam pertama 目", "4. 横 (Héng) - Mendatar dalam kedua 目", "5. 横 (Héng) - Mendatar penutup mata 目", "6. 撇 (Piě) - Miring kepala 詹", "7. 竖 (Shù) - Tegak 詹", "8. 横折 (Héngzhé) - Mendatar tekuk 詹", "9. 横 (Héng) - Mendatar 詹", "10. 撇 (Piě) - Miring panjang 詹", "11. 口-竖 (Shù) - Tegak mulut atas 詹", "12. 口-横折 (Héngzhé) - Mendatar tekuk mulut 詹", "13. 口-横 (Héng) - Mendatar penutup mulut 詹", "14. 撇 (Piě) - Miring bawah 詹", "15. 口-竖 (Shù) - Tegak mulut bawah 詹", "16. 口-横折 (Héngzhé) - Mendatar tekuk mulut bawah 詹", "17. 口-横 (Héng) - Mendatar penutup mulut bawah 詹", "18. 点 (Diǎn) - Titik kestabilan struktur"]],
    ["char" => "仰", "pinyin" => "yǎng", "meaning" => "Mendongak / Mengagumi Luhur (Look up / Admire)", "strokesCount" => 6, "rules" => "Kiri ke Kanan (Radikal Orang 亻 di kiri, 卬 di kanan)", "steps" => ["1. 撇 (Piě) - Miring kiri radikal orang 亻", "2. 竖 (Shù) - Tegak lurus radikal orang 亻", "3. 撇 (Piě) - Miring atas bagian 卬", "4. 竖提 (Shùtí) - Tegak sapuan naik 卬", "5. 横折钩 (Héngzhégōu) - Mendatar tekuk kait segel 卩", "6. 竖 (Shù) - Tegak lurus penutup segel 卩"]],
    ["char" => "巍", "pinyin" => "wēi", "meaning" => "Menjulang Tinggi Megah (Towering / Majestic)", "strokesCount" => 20, "rules" => "Atas ke Bawah (Gunung 山 di atas, Hantu 鬼 dan Ranting 委 di bawah)", "steps" => ["1. 竖 (Shù) - Tegak tengah gunung 山", "2. 竖折 (Shùzhé) - Tegak tekuk kiri gunung 山", "3. 竖 (Shù) - Tegak kanan gunung 山", "4. 撇 (Piě) - Miring atas padi 禾", "5. 横 (Héng) - Mendatar padi 禾", "6. 竖 (Shù) - Tegak padi 禾", "7. 撇 (Piě) - Miring kiri padi 禾", "8. 点 (Diǎn) - Titik kanan padi 禾", "9. 撇点 (Piědiǎn) - Miring tekuk wanita 女", "10. 撇 (Piě) - Miring silang wanita 女", "11. 横 (Héng) - Mendatar panjang wanita 女", "12. 撇 (Piě) - Miring kepala hantu 鬼", "13. 竖 (Shù) - Tegak kiri kepala 鬼", "14. 横折 (Héngzhé) - Mendatar tekuk kepala 鬼", "15. 横 (Héng) - Mendatar dalam 鬼", "16. 撇 (Piě) - Miring dalam 鬼", "17. 竖弯钩 (Shùwāngōu) - Tegak lengkung berkait kaki 鬼", "18. 撇 (Piě) - Miring kaki kiri 鬼", "19. 竖 (Shù) - Tegak kaki kanan 鬼", "20. 点 (Diǎn) - Titik penutup keagungan"]],
    ["char" => "峨", "pinyin" => "é", "meaning" => "Gunung Menjulang Kokoh (Lofty Mountain)", "strokesCount" => 10, "rules" => "Kiri ke Kanan (Gunung 山 di kiri, Saya 我 di kanan)", "steps" => ["1. 竖 (Shù) - Tegak tengah gunung 山", "2. 竖折 (Shùzhé) - Tegak tekuk kiri gunung 山", "3. 竖 (Shù) - Tegak kanan gunung 山", "4. 撇 (Piě) - Miring pendek atas saya 我", "5. 横 (Héng) - Mendatar 我", "6. 竖钩 (Shùgōu) - Tegak berkait 我", "7. 提 (Tí) - Sapuan naik 我", "8. 斜钩 (Xiégōu) - Miring lengkung kait panjang 我", "9. 撇 (Piě) - Miring kecil 我", "10. 点 (Diǎn) - Titik penutup di kanan atas 我"]],
    ["char" => "浩", "pinyin" => "hào", "meaning" => "Sangat Luas / Berkelimpahan Akbar (Vast / Grand)", "strokesCount" => 10, "rules" => "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, Memberitahu 告 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik pertama air 氵", "2. 点 (Diǎn) - Titik kedua air 氵", "3. 提 (Tí) - Sapuan naik air 氵", "4. 撇 (Piě) - Miring atas karakter 告", "5. 横 (Héng) - Mendatar atas 告", "6. 竖 (Shù) - Tegak tengah 告", "7. 横 (Héng) - Mendatar panjang kedua 告", "8. 竖 (Shù) - Tegak kiri mulut 口", "9. 横折 (Héngzhé) - Mendatar tekuk mulut 口", "10. 横 (Héng) - Mendatar penutup mulut 口"]],
    ["char" => "瀚", "pinyin" => "hàn", "meaning" => "Samudra Raya / Keluasan Semesta (Ocean / Boundless)", "strokesCount" => 19, "rules" => "Kiri ke Kanan (Air 氵 di kiri, Suku Kata 翰 di kanan)", "steps" => ["1. 点 (Diǎn) - Titik pertama air 氵", "2. 点 (Diǎn) - Titik kedua air 氵", "3. 提 (Tí) - Sapuan naik air 氵", "4. 一 (Héng) - Mendatar atas", "5. 竖 (Shù) - Tegak pertama", "6. 竖 (Shù) - Tegak kedua", "7. 日-竖 (Shù) - Tegak kotak matahari 日", "8. 日-横折 (Héngzhé) - Mendatar tekuk 日", "9. 日-横 (Héng) - Mendatar dalam 日", "10. 日-横 (Héng) - Mendatar penutup 日", "11. 十-横 (Héng) - Mendatar sepuluh", "12. 十-竖 (Shù) - Tegak sepuluh", "13. 撇 (Piě) - Miring atas bulu 羽", "14. 横折钩 (Héngzhégōu) - Mendatar kait sayap 羽", "15. 提 (Tí) - Sapuan bulu", "16. 撇 (Piě) - Miring sayap kedua 羽", "17. 横折钩 (Héngzhégōu) - Mendatar kait sayap kedua 羽", "18. 提 (Tí) - Sapuan bulu kedua", "19. 点 (Diǎn) - Titik keagungan samudera"]],
    ["char" => "渊", "pinyin" => "yuān", "meaning" => "Jurang Dalam / Berilmu Dalam (Abyss / Deep)", "strokesCount" => 11, "rules" => "Kiri ke Kanan (Tiga Titik Air 氵 di kiri, Pusaran Air di kanan)", "steps" => ["1. 点 (Diǎn) - Titik pertama air 氵", "2. 点 (Diǎn) - Titik kedua air 氵", "3. 提 (Tí) - Sapuan naik air 氵", "4. 撇 (Piě) - Miring kiri pusaran", "5. 竖 (Shù) - Tegak kiri jurang", "6. 横折 (Héngzhé) - Mendatar tekuk", "7. 撇 (Piě) - Miring dalam jurang", "8. 点 (Diǎn) - Titik pertama dalam jurang", "9. 点 (Diǎn) - Titik kedua dalam jurang", "10. 撇 (Piě) - Miring penyeimbang", "11. 竖 (Shù) - Tegak sisi kanan penutup"]],
    ["char" => "博", "pinyin" => "bó", "meaning" => "Luas Berlimpah / Museum (Erudite / Abundant)", "strokesCount" => 12, "rules" => "Kiri ke Kanan (Sepuluh 十 di kiri, 甫 dan Titik di kanan)", "steps" => ["1. 横 (Héng) - Mendatar radikal sepuluh 十", "2. 竖 (Shù) - Tegak lurus radikal sepuluh 十", "3. 横 (Héng) - Mendatar atas bagian kanan", "4. 竖 (Shù) - Tegak kiri bagian 甫", "5. 横折 (Héngzhé) - Mendatar tekuk bingkai 甫", "6. 横 (Héng) - Mendatar dalam bingkai 甫", "7. 竖 (Shù) - Tegak lurus tengah menembus 甫", "8. 横 (Héng) - Mendatar penutup bawah 甫", "9. 点 (Diǎn) - Titik kanan atas 甫", "10. 撇 (Piě) - Miring pendek kanan", "11. 横 (Héng) - Mendatar bawah", "12. 点 (Diǎn) - Titik penutup di kanan bawah"]]
];

foreach ($hsk6Words as $w) {
    $strokeCharacters[] = [
        "char" => $w["char"],
        "pinyin" => $w["pinyin"],
        "meaning" => $w["meaning"],
        "strokesCount" => $w["strokesCount"],
        "hskLevel" => "HSK 6",
        "rules" => $w["rules"],
        "strokeSteps" => $w["steps"]
    ];
}

echo "Total kosakata terdaftar: " . count($strokeCharacters) . "\n";
foreach (['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'] as $lvl) {
    $cnt = count(array_filter($strokeCharacters, fn($c) => $c['hskLevel'] === $lvl));
    echo "- {$lvl}: {$cnt} kosakata\n";
}

// Update ke app.js
$appJsPath = __DIR__ . '/js/app.js';
$appJs = file_get_contents($appJsPath);

$startMarker = "// Stroke Order Data for Writing (HSK 1 & HSK 2)";
$endMarker = "// Comprehensive Extensive Bank Soal HSK 1 - 6";

$startPos = strpos($appJs, $startMarker);
$endPos = strpos($appJs, $endMarker);

if ($startPos !== false && $endPos !== false && $endPos > $startPos) {
    $jsonStrokes = json_encode($strokeCharacters, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $replacement = "// Stroke Order Data for Writing (HSK 1 - 6: Masing-masing 20 Kosakata = Total 120 Kosakata)\n  strokeCharacters: " . $jsonStrokes . ",\n\n  ";
    
    $newAppJs = substr($appJs, 0, $startPos) . $replacement . substr($appJs, $endPos);
    file_put_contents($appJsPath, $newAppJs);
    echo "SUCCESS: Berhasil memperbarui State.strokeCharacters di js/app.js!\n";
} else {
    echo "FAILED: Marker tidak ditemukan! start: " . var_export($startPos, true) . ", end: " . var_export($endPos, true) . "\n";
}
