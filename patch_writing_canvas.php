<?php
$appJsPath = __DIR__ . '/js/app.js';
$c = file_get_contents($appJsPath);

// Target content yang dicari:
$target = '      <!-- Tian Zi Ge Canvas Frame -->
      <div class="hanzi-canvas-frame tian-zi-ge" id="hanzi-target-box" style="margin: 0 auto 1rem auto;">
        <div id="hanzi-large-display" style="font-family: var(--font-chinese); font-size: 130px; color: #2d3142; line-height: 1; user-select: none; transition: all 0.3s ease;">
          ${charData.char}
        </div>
      </div>';

$replacement = '      <!-- Tian Zi Ge Canvas Frame & Interactive Practice Board -->
      <div style="position: relative; max-width: 300px; margin: 0 auto 1.2rem auto;">
        <!-- Canvas Frame Tian Zi Ge dengan Layer Hanzi Panduan + Canvas Melukis Interaktif -->
        <div class="hanzi-canvas-frame tian-zi-ge" id="hanzi-target-box" style="margin: 0 auto; width: 280px; height: 280px; position: relative; border: 2.5px solid #fbcfe8; border-radius: 18px; box-shadow: inset 0 0 12px rgba(244, 114, 182, 0.08), 0 4px 20px rgba(0,0,0,0.04); overflow: hidden; background: #fffdfd;">
          <!-- Teks Hanzi Panduan Latar Belakang (Transparan / Template Jejak) -->
          <div id="hanzi-large-display" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--font-chinese, serif); font-size: 190px; color: #cbd5e1; opacity: 0.35; line-height: 1; user-select: none; pointer-events: none; transition: all 0.3s ease; z-index: 1;">
            ${charData.char}
          </div>

          <!-- Canvas Interaktif HTML5 Tempat Pengguna Menulis Goresan -->
          <canvas id="hanzi-interactive-canvas" width="280" height="280" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; cursor: crosshair; touch-action: none;"></canvas>
        </div>

        <!-- Toolbar Kontrol Papan Tulis Interaktif -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; background: #fdf2f8; padding: 8px 12px; border-radius: 12px; border: 1px solid #fce7f3; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn-learn-outline" id="btn-toggle-guide" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 9999px; margin: 0; background: #ffffff;" onclick="toggleHanziGuide()" title="Sembunyikan/Tampilkan cetakan panduan karakter">
              👁️ Panduan: ON
            </button>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #831843; font-weight: 700;">
              <span>Tinta:</span>
              <button onclick="setWritingInk(\'#0f172a\')" style="width: 18px; height: 18px; border-radius: 50%; background: #0f172a; border: 2px solid #ffffff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" title="Tinta Hitam Tradisional"></button>
              <button onclick="setWritingInk(\'#dc2626\')" style="width: 18px; height: 18px; border-radius: 50%; background: #dc2626; border: 2px solid #ffffff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" title="Tinta Merah Kaligrafi"></button>
              <button onclick="setWritingInk(\'#2563eb\')" style="width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 2px solid #ffffff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" title="Tinta Biru"></button>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn-learn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 9999px; margin: 0; color: #dc2626; border-color: #fecaca; background: #ffffff;" onclick="clearWritingCanvas()" title="Hapus tulisan saya di papan">
              🗑️ Hapus
            </button>
            <button class="btn-primary-sakura" style="padding: 4px 12px; font-size: 0.75rem; border-radius: 9999px; margin: 0; background: #db2777;" onclick="submitWritingPractice()" title="Periksa dan simpan hasil latihan menulis">
              ✅ Selesai Menulis
            </button>
          </div>
        </div>
      </div>';

$pos = strpos($c, '<div class="hanzi-canvas-frame tian-zi-ge" id="hanzi-target-box"');
if ($pos !== false) {
    // Cari batas sebelum komentar <!-- Tian Zi Ge Canvas Frame -->
    $startComment = strrpos(substr($c, 0, $pos), '<!-- Tian Zi Ge Canvas Frame -->');
    $endDiv = strpos($c, '</div>', $pos);
    $endDiv = strpos($c, '</div>', $endDiv + 6); // penutup div luar
    $endDiv += 6;
    
    $c = substr($c, 0, $startComment) . $replacement . substr($c, $endDiv);
    file_put_contents($appJsPath, $c);
    echo "SUCCESS: Replaced canvas frame successfully!\n";
} else {
    echo "FAILED: Target not found!\n";
}
