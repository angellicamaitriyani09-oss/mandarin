with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Locate index where line 840 begins
marker1 = '      dialogue: [\n        { speaker: "Penyiar", hanzi: "今天白天多云转晴，最高温度三十二度。", pinyin: "Jīntiān báitiān duōyún zhuǎn qíng, zuìgāo wēndù sānshí\'èr dù.", indonesian: "Hari ini siang berawan lalu cerah, suhu tertinggi 32 derajat." },\n        { speaker: "Penyiar", hanzi: "晚上有可能下雨，请带伞出门。", pinyin: "Wǎnshang yǒu kěnéng xiàyǔ, qǐng dài sǎn chūmén.", indonesian: "Malam mungkin hujan, silakan bawa payung saat keluar." }\n      ],\n'
marker2 = '        { id: "D", text: "三十分钟 (30 menit)" }\n      ],\n      correctAnswer: "C",\n      explanation: "Sopir mengatakan \'大概二十分钟到\' (sekitar 20 menit sampai)."\n    },\n'

idx1 = text.find(marker1)
idx2 = text.find(marker2)

print("idx1:", idx1, "idx2:", idx2)

replacement_snippet = """      question: "Apa yang sebaiknya dibawa menurut prakiraan cuaca?",
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
"""

if idx1 != -1 and idx2 != -1:
    cut_start = idx1 + len(marker1)
    cut_end = idx2
    new_text = text[:cut_start] + replacement_snippet + text[cut_end:]
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Success!")
else:
    print("Markers not found")
