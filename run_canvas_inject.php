<?php
$appJsPath = __DIR__ . '/js/app.js';
$c = file_get_contents($appJsPath);

$targetAfter = "function selectStrokeChar(index) {\r\n  currentStrokeIndex = index;\r\n  renderWritingModule();\r\n}";
if (strpos($c, $targetAfter) === false) {
    $targetAfter = "function selectStrokeChar(index) {\n  currentStrokeIndex = index;\n  renderWritingModule();\n}";
}

echo "Found target: " . (strpos($c, $targetAfter) !== false ? "YES" : "NO") . "\n";

$callHook = "      </div>\n    </div>\n  `;\n}";
$callHookWith = "      </div>\n    </div>\n  `;\n\n  // Inisialisasi Canvas Interaktif Menulis\n  setTimeout(initWritingCanvas, 60);\n}";

if (strpos($c, $callHook) === false) {
    $callHook = "      </div>\r\n    </div>\r\n  `;\r\n}";
    $callHookWith = "      </div>\r\n    </div>\r\n  `;\r\n\r\n  // Inisialisasi Canvas Interaktif Menulis\r\n  setTimeout(initWritingCanvas, 60);\r\n}";
}

$c = str_replace($callHook, $callHookWith, $c);

$jsFunctions = "\n\n" . <<<'EOD'
// ==========================================================================
// Papan Tulis Interaktif Menulis Karakter & Goresan Hanzi (Canvas Engine)
// ==========================================================================
let writingCanvas = null;
let writingCtx = null;
let isWritingDrawing = false;
let currentWritingInk = '#0f172a';
let showWritingGuide = true;
let writingStrokesCount = 0;

function initWritingCanvas() {
  writingCanvas = document.getElementById('hanzi-interactive-canvas');
  if (!writingCanvas) return;
  writingCtx = writingCanvas.getContext('2d');
  if (!writingCtx) return;

  writingStrokesCount = 0;
  
  // Set default canvas context
  writingCtx.lineCap = 'round';
  writingCtx.lineJoin = 'round';
  writingCtx.lineWidth = 14; // Kuas kaligrafi standar tebal
  writingCtx.strokeStyle = currentWritingInk;

  // Clear canvas
  writingCtx.clearRect(0, 0, writingCanvas.width, writingCanvas.height);

  // Mouse Events
  writingCanvas.onmousedown = (e) => {
    isWritingDrawing = true;
    const rect = writingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    writingCtx.beginPath();
    writingCtx.moveTo(x, y);
    writingStrokesCount++;
  };

  writingCanvas.onmousemove = (e) => {
    if (!isWritingDrawing) return;
    const rect = writingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    writingCtx.lineTo(x, y);
    writingCtx.stroke();
  };

  window.onmouseup = () => {
    if (isWritingDrawing) {
      isWritingDrawing = false;
      writingCtx.closePath();
    }
  };

  // Touch Events untuk Smartphone / Tablet / Layar Sentuh
  writingCanvas.ontouchstart = (e) => {
    e.preventDefault();
    isWritingDrawing = true;
    const rect = writingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    writingCtx.beginPath();
    writingCtx.moveTo(x, y);
    writingStrokesCount++;
  };

  writingCanvas.ontouchmove = (e) => {
    e.preventDefault();
    if (!isWritingDrawing) return;
    const rect = writingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    writingCtx.lineTo(x, y);
    writingCtx.stroke();
  };

  writingCanvas.ontouchend = (e) => {
    e.preventDefault();
    if (isWritingDrawing) {
      isWritingDrawing = false;
      writingCtx.closePath();
    }
  };
}

function clearWritingCanvas() {
  if (writingCanvas && writingCtx) {
    writingCtx.clearRect(0, 0, writingCanvas.width, writingCanvas.height);
    writingStrokesCount = 0;
    showToast("Papan latihan menulis telah dibersihkan.");
  }
}

function setWritingInk(color) {
  currentWritingInk = color;
  if (writingCtx) {
    writingCtx.strokeStyle = currentWritingInk;
  }
  showToast("Warna tinta kuas diubah.");
}

function toggleHanziGuide() {
  const guideEl = document.getElementById('hanzi-large-display');
  const btn = document.getElementById('btn-toggle-guide');
  showWritingGuide = !showWritingGuide;
  if (guideEl) {
    guideEl.style.display = showWritingGuide ? 'flex' : 'none';
  }
  if (btn) {
    btn.innerHTML = showWritingGuide ? '👁️ Panduan: ON' : '👁️ Panduan: OFF';
  }
  showToast(showWritingGuide ? 'Panduan jejak karakter ditampilkan.' : 'Mode tantangan bebas: Panduan disembunyikan!');
}

function submitWritingPractice() {
  if (writingStrokesCount === 0) {
    showToast("Silakan goreskan kuas Anda di kotak Tian Zi Ge terlebih dahulu! ✍️", "warning");
    return;
  }

  const filteredChars = State.strokeCharacters.filter(c => {
    if (currentStrokeHskTab === "all") return true;
    return c.hskLevel === currentStrokeHskTab;
  });
  const charData = filteredChars[currentStrokeIndex] || State.strokeCharacters[0];

  showToast(`🎉 Bagus sekali! Anda telah menyelesaikan latihan penulisan Hanzi "${charData.char}" (+15 EXP, +10 Poin) ✍️`);
  recordUserActivity('writing', 15, 10, `write_practice_${charData.char}`, 2);
}
EOD;

$c = str_replace($targetAfter, $targetAfter . $jsFunctions, $c);

file_put_contents($appJsPath, $c);
echo "SUCCESS: Injected canvas code!\n";
