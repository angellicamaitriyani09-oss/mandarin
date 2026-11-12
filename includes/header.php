<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mandarinku - Modul Ajar & Belajar Bahasa Mandarin Interaktif</title>
  <meta name="description" content="Platform belajar bahasa Mandarin interaktif lengkap dengan latihan listening, speaking berteknologi AI recognition, reading, animasi goresan writing, bank soal HSK 1-6, dan analitik real-time.">
  
  <!-- Google Fonts: Plus Jakarta Sans, Nunito & Chinese KaiTi Style -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700;900&family=Nunito:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/style.css?v=<?= filemtime(__DIR__ . '/../css/style.css') ?>">
  <link rel="icon" type="image/svg+xml" href="assets/images/sakura-logo.svg">
  <script>
    (function() {
      try {
        const theme = localStorage.getItem('mandarinku_theme');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark-mode');
        }
      } catch(e) {}
    })();
  </script>
</head>
<body class="<?= (isset($_COOKIE['mandarinku_theme']) && $_COOKIE['mandarinku_theme'] === 'dark') ? 'dark-mode' : '' ?>">

  <!-- Floating Sakura Petals Background Effect -->
  <div id="sakura-bg-decor" class="sakura-bg-decor"></div>
