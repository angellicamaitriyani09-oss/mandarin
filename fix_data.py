# -*- coding: utf-8 -*-
import sys

with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Original line count:', len(lines))

proper_replacement = [
    '      question: "Apa yang sebaiknya dibawa menurut prakiraan cuaca?",\n',
    '      options: [\n',
    '        { id: "A", text: "外套 (Jaket)" },\n',
    '        { id: "B", text: "伞 (Payung)" },\n',
    '        { id: "C", text: "帽子 (Topi)" },\n',
    '        { id: "D", text: "围巾 (Syal)" }\n',
    '      ],\n',
    '      correctAnswer: "B",\n',
    '      explanation: "Penyiar mengingatkan \'请带伞出门\' (silakan bawa payung saat keluar)."\n',
    '    },\n',
    '    {\n',
    '      title: "Di Hotel (在宾馆)",\n',
    '      subtitle: "Mendengar percakapan check-in hotel",\n',
    '      duration: "0:30",\n',
    '      level: "Sedang",\n',
    '      hskLevel: "HSK 3",\n',
    '      audioText: "前台：您好，请问您有预订吗？客人：有的，我预订了一间单人房，住三晚。前台：好的，您的房间在五楼，这是您的房卡。",\n',
    '      dialogue: [\n',
    '        { speaker: "Resepsionis", hanzi: "您好，请问您有预订吗？", pinyin: "Nín hǎo, qǐngwèn nín yǒu yùdìng ma?", indonesian: "Halo, apakah Anda sudah pesan sebelumnya?" },\n',
    '        { speaker: "Tamu", hanzi: "有的，我预订了一间单人房，住三晚。", pinyin: "Yǒude, wǒ yùdìng le yī jiān dānrén fáng, zhù sān wǎn.", indonesian: "Sudah, saya pesan kamar single, menginap 3 malam." },\n',
    '        { speaker: "Resepsionis", hanzi: "好的，您的房间在五楼，这是您的房卡。", pinyin: "Hǎo de, nín de fángjiān zài wǔ lóu, zhè shì nín de fángkǎ.", indonesian: "Baik, kamar Anda di lantai 5, ini kartu kamar Anda." }\n',
    '      ],\n',
    '      question: "Kamar tamu ada di lantai berapa?",\n',
    '      options: [\n',
    '        { id: "A", text: "三楼 (Lantai 3)" },\n',
    '        { id: "B", text: "四楼 (Lantai 4)" },\n',
    '        { id: "C", text: "五楼 (Lantai 5)" },\n',
    '        { id: "D", text: "六楼 (Lantai 6)" }\n',
    '      ],\n',
    '      correctAnswer: "C",\n',
    '      explanation: "Resepsionis mengatakan \'您的房间在五楼\' (kamar di lantai 5)."\n',
    '    },\n',
    '    {\n',
    '      title: "Naik Taksi (坐出租车)",\n',
    '      subtitle: "Mendengar percakapan penumpang dan sopir taksi",\n',
    '      duration: "0:26",\n',
    '      level: "Menengah",\n',
    '      hskLevel: "HSK 4",\n',
    '      audioText: "乘客：师傅，请去人民路一百号。司机：好的，大概二十分钟到。乘客：好，麻烦走快一点，我快迟到了。",\n',
    '      dialogue: [\n',
    '        { speaker: "Penumpang", hanzi: "师傅，请去人民路一百号。", pinyin: "Shīfu, qǐng qù Rénmín Lù yībǎi hào.", indonesian: "Pak sopir, tolong ke Jalan Renmin nomor 100." },\n',
    '        { speaker: "Sopir", hanzi: "好的，大概二十分钟到。", pinyin: "Hǎo de, dàgài èrshí fēnzhōng dào.", indonesian: "Baik, sekitar 20 menit sampai." },
    '        { speaker: "Penumpang", hanzi: "好，麻烦走快一点，我快迟到了。", pinyin: "Hǎo, máfan zǒu kuài yīdiǎn, wǒ kuài chídào le.", indonesian: "Baik, tolong agak cepat, saya hampir terlambat." }\n',
    '      ],\n',
    '      question: "Berapa lama perkiraan perjalanan?",\n',
    '      options: [\n',
    '        { id: "A", text: "十分钟 (10 menit)" },\n',
    '        { id: "B", text: "十五分钟 (15 menit)" },\n',
    '        { id: "C", text: "二十分钟 (20 menit)" },\n'
]

# Check if lines match expectations
if 'Speaking Exercises' in lines[839] and '20 menit' in lines[937]:
    new_lines = lines[:839] + proper_replacement + lines[938:]
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print('Replacement succeeded! New line count:', len(new_lines))
else:
    print('Line pattern check failed, not modifying.')
