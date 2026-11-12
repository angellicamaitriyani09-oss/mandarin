# Panduan Menjalankan & Struktur Proyek Mandarinku

Aplikasi web **Mandarinku** telah dibangun secara lengkap, modern, dan presisi sesuai desain 4 mockup gambar yang Anda berikan.

---

## 1. Menjalankan Aplikasi Secara Langsung (Frontend Interaktif)

Aplikasi telah siap dijalankan di browser mana pun tanpa konfigurasi server yang rumit:
1. Buka folder `c:\Users\angelica\Documents\website mandarin`
2. Klik ganda file [index.html](file:///c:/Users/angelica/Documents/website%20mandarin/index.html) atau klik kanan lalu pilih **Open with Google Chrome / Microsoft Edge**.
3. Seluruh fitur interaktif siap digunakan:
   - **Login & Role Management**: Coba masuk dengan akun Siswa, Guru, atau Admin.
   - **Listening**: Putar audio percakapan penutur asli, sesuaikan kecepatan audio, dan kerjakan kuis pemahaman dengar.
   - **Speaking**: Uji pelafalan suara Anda dengan fitur perekam dan Web Speech Recognition instan.
   - **Reading**: Pelajari cerita pendek bilingual dengan fitur text-to-speech bahasa Mandarin.
   - **Writing**: Saksikan animasi goresan karakter Hanzi langkah demi langkah (Tian Zi Ge) dan gunakan **AI Grammar Checker** untuk memeriksa tata bahasa kalimat Anda.
   - **Bank Soal HSK 1 - 6**: Uji kemampuan dengan kuis bertingkat lengkap dengan pembahasan mendalam dan kalkulasi skor otomatis.
   - **Modul Tambahan**: Unggah modul ajar baru (khusus Guru/Admin), unduh materi, dan berikan komentar/rating.
   - **Profil & Grafik Analitik**: Pantau jam belajar, streak harian, badge pencapaian, dan grafik waktu belajar 7 hari terakhir.

---

## 2. Struktur File Proyek

```
website mandarin/
├── index.html                     # Halaman Aplikasi Web Utama (SPA Responsive)
├── css/
│   └── style.css                  # Sistem Desain CSS Tema Sakura & Maskot Panda
├── js/
│   └── app.js                     # Logika Engine: Speech, AI Grammar, Quiz, Modul, Chart
├── assets/
│   └── images/
│       ├── sakura-logo.svg        # Logo Bunga Sakura Mandarinku
│       ├── panda-mascot.svg       # Maskot Panda Utama (Hanfu & Buku)
│       ├── panda-listening.svg    # Maskot Panda Headphone
│       ├── panda-speaking.svg     # Maskot Panda Mikrofon
│       ├── panda-reading.svg      # Maskot Panda Membaca Buku
│       └── panda-writing.svg      # Maskot Panda Pensil
└── laravel_backend/               # Integrasi Backend Laravel Lengkap
    ├── database/migrations/
    │   └── 2024_05_20_000000_create_mandarinku_schema.php  # Skema Database RBAC & Modul
    └── app/Http/Controllers/
        └── MandarinkuApiController.php                     # Controller API Lengkap
```

---

## 3. Integrasi Backend Laravel (Opsional)

Jika Anda ingin menghubungkan aplikasi ke backend server Laravel murni:
1. Pasang dependensi Laravel (`composer install`)
2. Salin file skema migrasi ke direktori `database/migrations/` di proyek Laravel Anda.
3. Jalankan `php artisan migrate` untuk membuat seluruh tabel (Users, Modules, Comments, Question Banks, Progress, Speaking Submissions).
4. Tempatkan `MandarinkuApiController.php` pada folder `app/Http/Controllers/`.
