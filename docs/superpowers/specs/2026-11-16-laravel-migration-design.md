# Desain Migrasi Penuh Aplikasi Mandarinku ke Laravel MVC

## 1. Tujuan & Latar Belakang (Intent & Why)
Memindahkan seluruh aplikasi pembelajaran bahasa Mandarin interaktif **Mandarinku** (Halaman Siswa SPA 18 modul + Panel Admin CRUD lengkap) dari PHP Native ke arsitektur **Laravel MVC** standar di direktori utama `c:\laragon\www\web`. Tujuannya adalah agar proyek memenuhi standar framework Laravel modern (Routes, Controllers, Eloquent/Query Builder, Blade Views, Migrations, `artisan`) tanpa menghilangkan satu pun fitur interaktif, data MySQL `mandarinku`, maupun tampilan Tema Gelap/Terang yang sudah dibangun.

## 2. Goals, Non-Goals, & Anti-Goals
- **Goals:**
  - Struktur proyek Laravel standar di root `c:\laragon\www\web` (`artisan`, `composer.json`, `app/`, `bootstrap/`, `config/`, `database/`, `public/`, `resources/views/`, `routes/`, `storage/`).
  - Mengonversi seluruh tampilan siswa (`includes/*.php` dan 18 `pages/*.php`) menjadi Blade templates (`resources/views/layouts/app.blade.php` dan `resources/views/pages/*.blade.php`) yang dirender melalui `StudentController@index`.
  - Mengonversi seluruh halaman Panel Admin (`admin/index.php`, `users.php`, `modules.php`, `questions.php`, `flashcards.php`, `game_arena.php`, `fitur_cerdas.php`, `login.php`, `logout.php`, `api_sync.php`, `setup_db.php`) menjadi Controller Laravel (`AdminController`, `AdminGameController`, `AdminSmartController`, `AdminApiController`) dan Blade views (`resources/views/admin/*.blade.php`).
  - Menyediakan rute Laravel bersih (`/`, `/admin`, `/admin/users`, `/admin/modules`, `/admin/questions`, `/admin/flashcards`, `/admin/game-arena`, `/admin/fitur-cerdas`, `/admin/api-sync`) sekaligus rute kompatibilitas URL `.php` lama (`/index.php`, `/admin/index.php`, `/admin/game_arena.php`, `/admin/fitur_cerdas.php`, `/admin/api_sync.php`, dll.) sehingga semua pemanggilan `fetch('admin/api_sync.php')` dan tautan di `js/app.js` / `js/features-plus.js` langsung bekerja tanpa error CSRF atau 404.
  - Mendukung eksekusi baik melalui `php artisan serve` (`http://127.0.0.1:8000`), Laragon virtual host (`http://web.test`), maupun subdirektori Laragon (`http://localhost/web/`) melalui jembatan `index.php` & `.htaccess` di root yang meneruskan request ke `public/index.php` serta akses statis ke `css/`, `js/`, `assets/`, dan `data/`.
  - Terhubung langsung ke database MySQL `mandarinku` (`127.0.0.1`, user `root`, fallback password otomatis `''` atau `'ZhuoShanYi0908'`) dan menyinkronkan data JSON (`data/game_arena_data.json` & `data/fitur_cerdas_data.json`).
- **Non-Goals:**
  - Tidak menulis ulang logika frontend JavaScript (`js/app.js`, `js/features-plus.js`, `js/cerita-app.js`) ke framework SPA lain (seperti Vue/React), karena engine interaktif Vanilla JS sudah matang dan teruji.
- **Anti-Goals:**
  - Jangan sampai ada fitur yang hilang, halaman yang error 404/419 (CSRF), aset CSS/JS/SVG yang gagal dimuat (broken path), atau perubahan tampilan Tema Gelap/Terang.

## 3. Constraints (Batasan Teknis)
- **Lingkungan Mesin:** Windows + Laragon (`PHP 8.3.33` di `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe`, Composer di `C:\laragon\bin\composer\composer.phar`).
- **Kredensial Database Lokal:** Database `mandarinku` pada MySQL lokal menggunakan user `root` dengan kemungkinan password kosong `''` atau `'ZhuoShanYi0908'`. Layanan database Laravel / helper `GameFeaturesRepository` harus menangani fallback koneksi ini dengan aman serta otomatis membuat tabel bila belum ada.
- **CSRF Protection untuk Endpoint AJAX:** Endpoint `POST /admin/api_sync.php` (dan `/admin/api-sync`) serta form admin harus dikecualikan dari pemblokiran CSRF token bila dipanggil dari `fetch()` JS existing, dan form Blade menyertakan `@csrf`.

## 4. Approaches (Pendekatan yang Dipertimbangkan)
1. **Pendekatan 1 (Dipilih oleh Pengguna): Migrasi Penuh ke Struktur Standar Laravel di Root (`c:\laragon\www\web`)**
   - Menata `c:\laragon\www\web` menjadi aplikasi Laravel MVC penuh dengan Blade views untuk halaman siswa & admin, Eloquent/PDO repositories, migrations, serta jembatan root->`public/` agar bisa diakses baik via `php artisan serve` maupun `http://localhost/web/`.
   - *Alasan dipilih:* Menghasilkan satu proyek Laravel murni di repositori utama tanpa duplikasi proyek di subfolder.
2. **Pendekatan 2 (Ditolak): Proyek Laravel Terpisah di Subfolder (`laravel_backend/`)**
   - Membiarkan PHP native di root dan membuat duplikat aplikasi di subfolder. Ditolak karena menduplikasi seluruh aset dan membingungkan struktur repositori Git.

## 5. Arsitektur & Komponen yang Akan Dibangun

### A. Struktur Direktori Laravel (`c:\laragon\www\web`)
- `app/Http/Controllers/`
  - `StudentController.php`: Merender halaman utama SPA siswa (`resources/views/student/index.blade.php`) beserta injeksi data `DB_TONE_TRAINER`, `DB_WORD_LINK`, `DB_MEMORY_MATCH`, `DB_PINYIN_HANZI`, `DB_HANZI_ANATOMY`, dan `DB_LEADERBOARD`.
  - `AdminController.php`: Menangani autentikasi admin (`login`, `logout`), Dashboard (`index`), Kelola Pengguna (`users`), Kelola Modul (`modules`), Kelola Bank Soal (`questions`), Kelola Flashcard (`flashcards`), Kelola Game Arena (`gameArena`), Kelola Fitur Cerdas (`fiturCerdas`), dan `setupDb`.
  - `AdminApiController.php`: Menangani seluruh aksi AJAX CRUD dari `admin/api_sync.php` (`add_tone`, `edit_tone`, `delete_tone`, `add_link`, `edit_link`, `delete_link`, `add_memory`, `edit_memory`, `delete_memory`, `add_pinyin`, `edit_pinyin`, `delete_pinyin`, `add_anatomy`, `edit_anatomy`, `delete_anatomy`, `import_anatomy`, `add_leaderboard`, `edit_leaderboard`, `delete_leaderboard`).
  - `MandarinkuApiController.php`: REST API controller untuk modul, bank soal, komentar, dan AI grammar checker (`/api/...`).
- `app/Services/GameFeaturesService.php`: Layanan terpusat (migrasi dari `config/game_features_db.php`) yang mengelola tabel MySQL (`users`, `modules`, `questions`, `flashcards`, `game_tone_trainer`, `game_word_link`, `game_memory_match`, `game_pinyin_hanzi`, `smart_hanzi_anatomy`, `smart_leaderboard`) sekaligus sinkronisasi otomatis ke `data/game_arena_data.json` dan `data/fitur_cerdas_data.json`.
- `app/Models/`: Model Eloquent `User`, `Module`, `Question`, `Flashcard`, `GameToneTrainer`, `GameWordLink`, `GameMemoryMatch`, `GamePinyinHanzi`, `SmartHanziAnatomy`, `SmartLeaderboard`.
- `database/migrations/`:
  - Migrasi lengkap seluruh tabel aplikasi Mandarinku (`users`, `modules`, `questions`, `flashcards`, `game_tone_trainer`, `game_word_link`, `game_memory_match`, `game_pinyin_hanzi`, `smart_hanzi_anatomy`, `smart_leaderboard`).
- `resources/views/`:
  - `layouts/app.blade.php` (Header, Navbar, Main Wrapper, Footer & Modals siswa)
  - `pages/*.blade.php` (18 modul halaman siswa: `login`, `beranda`, `listening`, `speaking`, `reading`, `writing`, `flashcard`, `quiz`, `bank-soal`, `hsk`, `profil`, `modul-detail`, `cerita`, `latihan-ekstra`, `cetak-hanzi`, `game-arena`, `fitur-pintar`, `admin`)
  - `layouts/admin.blade.php` (Header & Sidebar Panel Admin lengkap dengan toggle Dark Mode & Table Pagination)
  - `admin/*.blade.php` (`index`, `login`, `users`, `modules`, `questions`, `flashcards`, `game_arena`, `fitur_cerdas`)
- `public/`:
  - `public/index.php` (Entry point resmi Laravel)
  - `public/css/`, `public/js/`, `public/assets/`, `public/data/` (Disinkronkan/dijembatani dengan root agar path relatif `css/style.css`, `../css/style.css`, `js/app.js`, dan `assets/images/...` bekerja di semua mode server).

### B. Routing & Kompatibilitas URL (`routes/web.php` & `routes/api.php`)
- `GET /` dan `GET /index.php` ➔ `StudentController@index`
- `GET|POST /admin` dan `GET|POST /admin/index.php` ➔ `AdminController@index`
- `GET|POST /admin/login` dan `/admin/login.php` ➔ `AdminController@login`
- `GET|POST /admin/logout` dan `/admin/logout.php` ➔ `AdminController@logout`
- `GET|POST /admin/users` dan `/admin/users.php` ➔ `AdminController@users`
- `GET|POST /admin/modules` dan `/admin/modules.php` ➔ `AdminController@modules`
- `GET|POST /admin/questions` dan `/admin/questions.php` ➔ `AdminController@questions`
- `GET|POST /admin/flashcards` dan `/admin/flashcards.php` ➔ `AdminController@flashcards`
- `GET|POST /admin/game-arena` dan `/admin/game_arena.php` ➔ `AdminController@gameArena`
- `GET|POST /admin/fitur-cerdas` dan `/admin/fitur_cerdas.php` ➔ `AdminController@fiturCerdas`
- `GET|POST /admin/api-sync` dan `/admin/api_sync.php` ➔ `AdminApiController@sync`
- `GET|POST /admin/setup-db` dan `/admin/setup_db.php` ➔ `AdminController@setupDb`

## 6. What's Left to the Builder
- Penataan detail konfigurasi bootstrap Laravel dan auto-loader Composer.
- Penyusunan helper koneksi database yang otomatis memilih password MySQL lokal (`''` atau `'ZhuoShanYi0908'`) agar tidak pernah gagal konek di Laragon pengguna.
- Pembersihan file skrip sementara setelah migrasi selesai dan pengujian akhir seluruh rute dengan `php artisan route:list` serta request HTTP langsung.
