const fs = require('fs');
const path = require('path');

const adminFilePath = path.join(__dirname, '../admin/game_arena.php');
const originalContent = fs.readFileSync(adminFilePath, 'utf8');

// Find the line where sessionNames definition ends
const marker = "$sessionNames = [\n    'session1' => 'Sesi 1: Salam & Sapaan Dasar (问候基础)',\n    'session2' => 'Sesi 2: Keluarga & Orang (家庭人物)',\n    'session3' => 'Sesi 3: Kuliner & Minuman (美食饮品)',\n    'session4' => 'Sesi 4: Aktivitas & Belajar (日常学习)',\n    'session5' => 'Sesi 5: Waktu, Cuaca & Arah (时间方位)',\n    'session6' => 'Sesi 6: Kota & Transportasi (出行交通)'\n];";

const markerIndex = originalContent.indexOf(marker);
if (markerIndex === -1) {
  console.error('Could not find sessionNames marker!');
  process.exit(1);
}

const headerPart = originalContent.substring(0, markerIndex + marker.length);

const newBody = `

// Helper function to render difficulty badges
if (!function_exists('render_game_diff_badge')) {
    function render_game_diff_badge($difficulty) {
        $d = strtolower($difficulty ?? 'easy');
        if ($d === 'hard') {
            return '<span style="background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; padding: 2px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 3px;">🔴 Hard</span>';
        } elseif ($d === 'medium') {
            return '<span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 2px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 3px;">🟡 Med</span>';
        } else {
            return '<span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 3px;">🟢 Easy</span>';
        }
    }
}
?>

<!-- Alert Feedback Status -->
<?php if (isset($_GET['status'])): ?>
  <div style="padding: 12px 18px; margin-bottom: 20px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; <?php 
    if ($_GET['status'] == 'added') echo 'background: #dcfce7; color: #166534; border: 1px solid #86efac;';
    elseif ($_GET['status'] == 'updated') echo 'background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc;';
    elseif ($_GET['status'] == 'deleted') echo 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
  ?>">
    <?php 
      if ($_GET['status'] == 'added') echo '✅ Data game berhasil ditambahkan!';
      elseif ($_GET['status'] == 'updated') echo '✨ Data game berhasil diperbarui!';
      elseif ($_GET['status'] == 'deleted') echo '🗑️ Data game berhasil dihapus!';
    ?>
  </div>
<?php endif; ?>

<!-- Header Kelola Game Arena -->
<div class="admin-card" style="border-left: 5px solid #8b5cf6;">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
    <div>
      <h1 style="color: var(--dark-text); margin: 0 0 6px 0; font-size: 1.6rem; display: flex; align-items: center; gap: 10px;">
        <span>🎮</span> Kelola Arena Game Mandarin
      </h1>
      <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem;">
        Kelola, filter, tambah, edit, dan hapus soal untuk 4 permainan dengan pemisahan tingkat <strong>Easy</strong>, <strong>Medium</strong>, dan <strong>Hard</strong>.
      </p>
    </div>
    
    <div style="display: flex; gap: 8px;">
      <a href="../index.php#page-game-arena" target="_blank" style="background: #ede9fe; color: #6d28d9; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
        👁️ Uji Game di Web ↗
      </a>
    </div>
  </div>

  <!-- Statistik Ringkasan Game per Tingkat -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-top: 20px;">
    <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 14px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #6d28d9;">🎵 PELATIH 4 NADA</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #4c1d95; margin: 2px 0;"><?= count($toneItems) ?> <span style="font-size: 0.82rem; font-weight: 700; color: #7c3aed;">soal total</span></div>
      <div style="font-size: 0.72rem; color: #6b21a8; font-weight: 700; display: flex; gap: 6px;">
        <span>🟢 Easy</span> • <span>🟡 Med</span> • <span>🔴 Hard</span>
      </div>
    </div>
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #047857;">🧩 PASANG KATA MAJEMUK</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #065f46; margin: 2px 0;"><?= count($linkItems) ?> <span style="font-size: 0.82rem; font-weight: 700; color: #059669;">pasangan</span></div>
      <div style="font-size: 0.72rem; color: #065f46; font-weight: 700; display: flex; gap: 6px;">
        <span>🟢 Bag 1-2</span> • <span>🟡 Bag 3-4</span> • <span>🔴 Bag 5-6</span>
      </div>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #b45309;">🃏 KARTU MEMORI BALIK</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #78350f; margin: 2px 0;"><?= count($memoryItems) ?> <span style="font-size: 0.82rem; font-weight: 700; color: #d97706;">pasangan kartu</span></div>
      <div style="font-size: 0.72rem; color: #92400e; font-weight: 700; display: flex; gap: 6px;">
        <span>🟢 4×4</span> • <span>🟡 5×5</span> • <span>🔴 6×6</span>
      </div>
    </div>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #1d4ed8;">🎯 COCOK PINYIN ➔ HANZI</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #1e40af; margin: 2px 0;"><?= count($pinyinHanziItems) ?> <span style="font-size: 0.82rem; font-weight: 700; color: #2563eb;">soal total</span></div>
      <div style="font-size: 0.72rem; color: #1e40af; font-weight: 700; display: flex; gap: 6px;">
        <span>🟢 HSK 1-2</span> • <span>🟡 HSK 3-4</span> • <span>🔴 HSK 5-6</span>
      </div>
    </div>
  </div>
</div>

<!-- Tabs Sub-Game Arena -->
<div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 2px; flex-wrap: wrap;">
  <a href="game_arena.php?tab=tone" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'tone' ? '#8b5cf6' : 'transparent' ?>; color: <?= $currentTab === 'tone' ? '#6d28d9' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🎵 Pelatih 4 Nada (四声) <span style="background: #ede9fe; color: #6d28d9; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($toneItems) ?></span>
  </a>
  <a href="game_arena.php?tab=link" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'link' ? '#8b5cf6' : 'transparent' ?>; color: <?= $currentTab === 'link' ? '#6d28d9' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🧩 Pasang Kata Majemuk (趣味组词) <span style="background: #ede9fe; color: #6d28d9; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($linkItems) ?></span>
  </a>
  <a href="game_arena.php?tab=memory" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'memory' ? '#8b5cf6' : 'transparent' ?>; color: <?= $currentTab === 'memory' ? '#6d28d9' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🃏 Kartu Memori Balik (4×4, 5×5, 6×6) <span style="background: #ede9fe; color: #6d28d9; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($memoryItems) ?></span>
  </a>
  <a href="game_arena.php?tab=pinyin_hanzi" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'pinyin_hanzi' ? '#8b5cf6' : 'transparent' ?>; color: <?= $currentTab === 'pinyin_hanzi' ? '#6d28d9' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🎯 Cocok Pinyin ➔ Hanzi (HSK 1–6) <span style="background: #ede9fe; color: #6d28d9; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($pinyinHanziItems) ?></span>
  </a>
</div>

<!-- =========================================================================
     TAB 1: PELATIH 4 NADA (TONE TRAINER)
     ========================================================================= -->
<?php if ($currentTab === 'tone'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="toneSearch" onkeyup="filterToneTable()" placeholder="Cari Hanzi, Pinyin, Arti..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 220px; font-size: 0.88rem;">
        
        <select id="toneDiffFilter" onchange="filterToneTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Kesulitan (All Difficulty)</option>
          <option value="easy">🟢 Easy (HSK 1-2)</option>
          <option value="medium">🟡 Medium (HSK 3-4)</option>
          <option value="hard">🔴 Hard (HSK 5-6)</option>
        </select>

        <select id="toneLevelFilter" onchange="filterToneTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Level HSK</option>
          <option value="1">HSK 1</option>
          <option value="2">HSK 2</option>
          <option value="3">HSK 3</option>
          <option value="4">HSK 4</option>
          <option value="5">HSK 5</option>
          <option value="6">HSK 6</option>
        </select>
      </div>

      <button type="button" onclick="openAddToneModal()" style="background: #8b5cf6; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
        ➕ Tambah Soal Nada Baru
      </button>
    </div>

    <!-- Modal Form Tone Trainer -->
    <div id="toneModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="toneModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🎵 Tambah Soal Nada Baru</h3>
          <button type="button" onclick="closeToneModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="toneForm">
          <input type="hidden" name="action" id="toneFormAction" value="add_tone">
          <input type="hidden" name="id" id="toneFormId" value="">

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Level HSK:</label>
              <select name="level" id="formToneLevel" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;" onchange="autoSyncToneDiff()">
                <option value="1">HSK 1</option>
                <option value="2">HSK 2</option>
                <option value="3">HSK 3</option>
                <option value="4">HSK 4</option>
                <option value="5">HSK 5</option>
                <option value="6">HSK 6</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Kesulitan:</label>
              <select name="difficulty" id="formToneDifficulty" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <option value="easy">🟢 Easy (HSK 1-2)</option>
                <option value="medium">🟡 Medium (HSK 3-4)</option>
                <option value="hard">🔴 Hard (HSK 5-6)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Nada Benar (1 - 4):</label>
              <select name="tone" id="formToneNumber" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 800;">
                <option value="1">Nada 1 (Datar - mā)</option>
                <option value="2">Nada 2 (Naik - má)</option>
                <option value="3">Nada 3 (Lengkung - mǎ)</option>
                <option value="4">Nada 4 (Jatuh - mà)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Hanzi:</label>
              <input type="text" name="hanzi" id="formToneHanzi" required placeholder="Contoh: 妈" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.2rem;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Pinyin Lengkap:</label>
              <input type="text" name="pinyin" id="formTonePinyin" required placeholder="Contoh: mā" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Arti Kata (Bahasa Indonesia):</label>
            <input type="text" name="meaning" id="formToneMeaning" required placeholder="Contoh: Ibu" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tip Nada / Penjelasan Hafalan:</label>
            <textarea name="tip" id="formToneTip" rows="2" placeholder="Contoh: Nada 1: Datar tinggi & stabil seperti menyanyi laaa" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 0.85rem;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeToneModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formToneSubmit" style="padding: 10px 22px; border: none; background: #8b5cf6; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Soal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Soal Pelatih 4 Nada -->
    <table class="table-admin" id="toneTable">
      <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th style="width: 90px;">Tingkat</th>
          <th style="width: 75px;">Level</th>
          <th style="width: 90px;">Hanzi</th>
          <th style="width: 105px;">Pinyin</th>
          <th style="width: 85px; text-align: center;">Nada</th>
          <th>Arti Kata</th>
          <th>Tip Hafalan Nada</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($toneItems as $t): 
          $diff = $t['difficulty'] ?? ($t['level'] <= 2 ? 'easy' : ($t['level'] <= 4 ? 'medium' : 'hard'));
        ?>
          <tr data-level="<?= $t['level'] ?>" data-diff="<?= htmlspecialchars($diff) ?>">
            <td><strong style="color: #64748b;">#<?= $t['id'] ?></strong></td>
            <td><?= render_game_diff_badge($diff) ?></td>
            <td>
              <span style="background: #f5f3ff; color: #6d28d9; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; border: 1px solid #ddd6fe;">
                HSK <?= $t['level'] ?>
              </span>
            </td>
            <td>
              <strong style="font-size: 1.4rem; color: #0f172a; font-family: 'Noto Serif SC', serif;"><?= htmlspecialchars($t['hanzi']) ?></strong>
            </td>
            <td style="color: #d97706; font-weight: 800;"><?= htmlspecialchars($t['pinyin']) ?></td>
            <td style="text-align: center;">
              <?php
                $toneColors = [1 => '#ef4444', 2 => '#f59e0b', 3 => '#10b981', 4 => '#3b82f6'];
                $tc = $toneColors[$t['tone']] ?? '#64748b';
              ?>
              <span style="background: <?= $tc ?>; color: #fff; font-size: 0.75rem; font-weight: 900; padding: 2px 8px; border-radius: 99px;">
                Nada <?= $t['tone'] ?>
              </span>
            </td>
            <td style="font-weight: 600; color: #334155;"><?= htmlspecialchars($t['meaning']) ?></td>
            <td style="font-size: 0.8rem; color: #64748b;"><?= htmlspecialchars($t['tip'] ?? '') ?></td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditToneModal(<?= json_encode($t, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus soal nada ini?');">
                  <input type="hidden" name="action" value="delete_tone">
                  <input type="hidden" name="id" value="<?= $t['id'] ?>">
                  <button type="submit" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                    🗑️
                  </button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<!-- =========================================================================
     TAB 2: PASANG KATA MAJEMUK (WORD LINK)
     ========================================================================= -->
<?php elseif ($currentTab === 'link'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="linkSearch" onkeyup="filterLinkTable()" placeholder="Cari Karakter, Gabungan, Arti..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 220px; font-size: 0.88rem;">
        
        <select id="linkDiffFilter" onchange="filterLinkTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Kesulitan (All Difficulty)</option>
          <option value="easy">🟢 Easy (Bagian 1-2)</option>
          <option value="medium">🟡 Medium (Bagian 3-4)</option>
          <option value="hard">🔴 Hard (Bagian 5-6)</option>
        </select>

        <select id="linkCatFilter" onchange="filterLinkTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Bagian / Kategori</option>
          <option value="cat1">Bagian 1: Sehari-hari</option>
          <option value="cat2">Bagian 2: Kuliner & Buah</option>
          <option value="cat3">Bagian 3: Bepergian & Kota</option>
          <option value="cat4">Bagian 4: Profesi & Belajar</option>
          <option value="cat5">Bagian 5: Bisnis & Sains</option>
          <option value="cat6">Bagian 6: Budaya & Sastra</option>
        </select>
      </div>

      <button type="button" onclick="openAddLinkModal()" style="background: #059669; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
        ➕ Tambah Pasang Kata Baru
      </button>
    </div>

    <!-- Modal Form Word Link -->
    <div id="linkModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="linkModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🧩 Tambah Pasang Kata Majemuk</h3>
          <button type="button" onclick="closeLinkModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="linkForm">
          <input type="hidden" name="action" id="linkFormAction" value="add_link">
          <input type="hidden" name="id" id="linkFormId" value="">

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Kategori Tematik / Bagian:</label>
              <select name="category" id="formLinkCat" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;" onchange="autoSyncLinkDiff()">
                <option value="cat1">Bagian 1: Sehari-hari (HSK 1-2)</option>
                <option value="cat2">Bagian 2: Kuliner & Buah (HSK 1-2)</option>
                <option value="cat3">Bagian 3: Bepergian & Kota (HSK 2-3)</option>
                <option value="cat4">Bagian 4: Profesi & Belajar (HSK 3-4)</option>
                <option value="cat5">Bagian 5: Bisnis & Sains (HSK 4-5)</option>
                <option value="cat6">Bagian 6: Budaya & Sastra (HSK 5-6)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tingkat Kesulitan:</label>
              <select name="difficulty" id="formLinkDifficulty" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <option value="easy">🟢 Easy (Bagian 1-2)</option>
                <option value="medium">🟡 Medium (Bagian 3-4)</option>
                <option value="hard">🔴 Hard (Bagian 5-6)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Sisi Kiri (Part A):</label>
              <input type="text" name="part_a" id="formLinkPartA" required placeholder="Contoh: 电" oninput="autoCombineHanzi()" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.2rem;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Sisi Kanan (Part B):</label>
              <input type="text" name="part_b" id="formLinkPartB" required placeholder="Contoh: 话" oninput="autoCombineHanzi()" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.2rem;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Hanzi Gabungan Penuh:</label>
              <input type="text" name="hanzi" id="formLinkHanzi" required placeholder="Contoh: 电话" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.2rem;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Pinyin Kata Majemuk:</label>
              <input type="text" name="pinyin" id="formLinkPinyin" required placeholder="Contoh: diànhuà" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Arti Kata Gabungan (Indonesia):</label>
            <input type="text" name="meaning" id="formLinkMeaning" required placeholder="Contoh: Telepon" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeLinkModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formLinkSubmit" style="padding: 10px 22px; border: none; background: #059669; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Pasangan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Pasang Kata Majemuk -->
    <table class="table-admin" id="linkTable">
      <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th style="width: 90px;">Tingkat</th>
          <th style="width: 160px;">Bagian / Kategori</th>
          <th style="width: 75px; text-align: center;">Part A</th>
          <th style="width: 75px; text-align: center;">Part B</th>
          <th style="width: 110px;">Gabungan</th>
          <th style="width: 105px;">Pinyin</th>
          <th>Arti Kata</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($linkItems as $l): 
          $diff = $l['difficulty'] ?? (in_array($l['category'], ['cat1', 'cat2']) ? 'easy' : (in_array($l['category'], ['cat3', 'cat4']) ? 'medium' : 'hard'));
        ?>
          <tr data-cat="<?= $l['category'] ?>" data-diff="<?= htmlspecialchars($diff) ?>">
            <td><strong style="color: #64748b;">#<?= $l['id'] ?></strong></td>
            <td><?= render_game_diff_badge($diff) ?></td>
            <td>
              <span style="background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; border: 1px solid #a7f3d0;">
                <?= $categoryNames[$l['category']] ?? $l['category'] ?>
              </span>
            </td>
            <td style="text-align: center;">
              <span style="background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 8px; font-size: 1.2rem; font-weight: 900; font-family: 'Noto Serif SC', serif;"><?= htmlspecialchars($l['pA']) ?></span>
            </td>
            <td style="text-align: center;">
              <span style="background: #fdf2f8; color: #be185d; padding: 4px 10px; border-radius: 8px; font-size: 1.2rem; font-weight: 900; font-family: 'Noto Serif SC', serif;"><?= htmlspecialchars($l['pB']) ?></span>
            </td>
            <td>
              <strong style="font-size: 1.3rem; color: #0f172a; font-family: 'Noto Serif SC', serif;"><?= htmlspecialchars($l['hanzi']) ?></strong>
            </td>
            <td style="color: #ea580c; font-weight: 800;"><?= htmlspecialchars($l['pinyin']) ?></td>
            <td style="font-weight: 600; color: #334155;"><?= htmlspecialchars($l['meaning']) ?></td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditLinkModal(<?= json_encode($l, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus pasangan kata ini?');">
                  <input type="hidden" name="action" value="delete_link">
                  <input type="hidden" name="id" value="<?= $l['id'] ?>">
                  <button type="submit" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                    🗑️
                  </button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<!-- =========================================================================
     TAB 3: KARTU MEMORI BALIK (MEMORY MATCH)
     ========================================================================= -->
<?php elseif ($currentTab === 'memory'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="memSearch" onkeyup="filterMemTable()" placeholder="Cari Hanzi atau Teks Pasangan..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 220px; font-size: 0.88rem;">
        
        <select id="memDiffFilter" onchange="filterMemTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Level Grid (4×4, 5×5, 6×6)</option>
          <option value="easy">🟢 Easy (Grid 4×4 / Sesi 1-2)</option>
          <option value="medium">🟡 Medium (Grid 5×5 / Sesi 3-4)</option>
          <option value="hard">🔴 Hard (Grid 6×6 / Sesi 5-6)</option>
        </select>

        <select id="memSessionFilter" onchange="filterMemTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Sesi Permainan</option>
          <option value="session1">Sesi 1: Salam & Sapaan</option>
          <option value="session2">Sesi 2: Keluarga & Orang</option>
          <option value="session3">Sesi 3: Kuliner & Minuman</option>
          <option value="session4">Sesi 4: Aktivitas & Belajar</option>
          <option value="session5">Sesi 5: Waktu & Alam</option>
          <option value="session6">Sesi 6: Kota & Transportasi</option>
        </select>
      </div>

      <button type="button" onclick="openAddMemModal()" style="background: #d97706; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
        ➕ Tambah Pasangan Kartu Baru
      </button>
    </div>

    <!-- Modal Form Memory Match -->
    <div id="memModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 540px; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="memModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🃏 Tambah Pasangan Kartu Memori</h3>
          <button type="button" onclick="closeMemModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="memForm">
          <input type="hidden" name="action" id="memFormAction" value="add_memory">
          <input type="hidden" name="id" id="memFormId" value="">

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Pilih Sesi Permainan:</label>
              <select name="session" id="formMemSession" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;" onchange="autoSyncMemDiff()">
                <option value="session1">Sesi 1: Salam & Sapaan Dasar (问候基础)</option>
                <option value="session2">Sesi 2: Keluarga & Orang (家庭人物)</option>
                <option value="session3">Sesi 3: Kuliner & Minuman (美食饮品)</option>
                <option value="session4">Sesi 4: Aktivitas & Belajar (日常学习)</option>
                <option value="session5">Sesi 5: Waktu, Cuaca & Arah (时间方位)</option>
                <option value="session6">Sesi 6: Kota & Transportasi (出行交通)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Level Grid / Kesulitan:</label>
              <select name="difficulty" id="formMemDifficulty" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <option value="easy">🟢 Easy (Grid 4×4 / Sesi 1-2)</option>
                <option value="medium">🟡 Medium (Grid 5×5 / Sesi 3-4)</option>
                <option value="hard">🔴 Hard (Grid 6×6 / Sesi 5-6)</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Hanzi (Sisi Depan Kartu 1):</label>
            <input type="text" name="hanzi" id="formMemHanzi" required placeholder="Contoh: 你好" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.3rem;">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Teks Pasangan / Pinyin & Arti (Sisi Depan Kartu 2):</label>
            <input type="text" name="text_pair" id="formMemText" required placeholder="Contoh: Nǐ hǎo (Halo)" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeMemModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formMemSubmit" style="padding: 10px 22px; border: none; background: #d97706; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Kartu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Memory Match -->
    <table class="table-admin" id="memTable">
      <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th style="width: 90px;">Level Grid</th>
          <th style="width: 190px;">Sesi Permainan</th>
          <th style="width: 140px;">Kartu 1 (Aksara Hanzi)</th>
          <th>Kartu 2 (Pasangan Pinyin & Arti)</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($memoryItems as $m): 
          $sKey = $m['session'] ?? 'session1';
          $diff = $m['difficulty'] ?? (in_array($sKey, ['session1', 'session2']) ? 'easy' : (in_array($sKey, ['session3', 'session4']) ? 'medium' : 'hard'));
        ?>
          <tr data-session="<?= htmlspecialchars($sKey) ?>" data-diff="<?= htmlspecialchars($diff) ?>">
            <td><strong style="color: #64748b;">#<?= $m['id'] ?></strong></td>
            <td><?= render_game_diff_badge($diff) ?></td>
            <td>
              <span style="background: #fffbeb; color: #b45309; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; border: 1px solid #fde68a;">
                <?= $sessionNames[$sKey] ?? $sKey ?>
              </span>
            </td>
            <td>
              <span style="background: #ffffff; color: #b45309; border: 1.5px solid #fde68a; padding: 4px 12px; border-radius: 8px; font-size: 1.3rem; font-weight: 900; font-family: 'Noto Serif SC', serif;">
                <?= htmlspecialchars($m['hanzi']) ?>
              </span>
            </td>
            <td style="font-weight: 700; font-size: 0.95rem; color: #1e293b;">
              <?= htmlspecialchars($m['text']) ?>
            </td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditMemModal(<?= json_encode($m, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus pasangan kartu ini?');">
                  <input type="hidden" name="action" value="delete_memory">
                  <input type="hidden" name="id" value="<?= $m['id'] ?>">
                  <button type="submit" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                    🗑️
                  </button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>

<!-- =========================================================================
     TAB 4: COCOK PINYIN KE HANZI (PINYIN TO HANZI MATCHER - HSK 1-6)
     ========================================================================= -->
<?php if ($currentTab === 'pinyin_hanzi'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="pinyinHanziSearch" onkeyup="filterPinyinHanziTable()" placeholder="Cari Pinyin, Hanzi, Arti..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 220px; font-size: 0.88rem;">
        
        <select id="pinyinHanziDiffFilter" onchange="filterPinyinHanziTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Kesulitan (All Difficulty)</option>
          <option value="easy">🟢 Easy (HSK 1-2)</option>
          <option value="medium">🟡 Medium (HSK 3-4)</option>
          <option value="hard">🔴 Hard (HSK 5-6)</option>
        </select>

        <select id="pinyinHanziLevelFilter" onchange="filterPinyinHanziTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Level HSK (1–6)</option>
          <option value="1">HSK 1</option>
          <option value="2">HSK 2</option>
          <option value="3">HSK 3</option>
          <option value="4">HSK 4</option>
          <option value="5">HSK 5</option>
          <option value="6">HSK 6</option>
        </select>
      </div>

      <button type="button" onclick="openAddPinyinHanziModal()" style="background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
        ➕ Tambah Soal Pinyin-Hanzi Baru
      </button>
    </div>

    <!-- Modal Form Pinyin to Hanzi -->
    <div id="pinyinHanziModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="pinyinHanziModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🎯 Tambah Soal Pinyin ➔ Hanzi</h3>
          <button type="button" onclick="closePinyinHanziModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="pinyinHanziForm">
          <input type="hidden" name="action" id="pinyinHanziFormAction" value="add_pinyin_hanzi">
          <input type="hidden" name="id" id="pinyinHanziFormId" value="">

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tingkat Level HSK:</label>
              <select name="level" id="formPHTier" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;" onchange="autoSyncPHDiff()">
                <option value="1">HSK 1 (Pemula Dasar)</option>
                <option value="2">HSK 2 (Percakapan Sehari-hari)</option>
                <option value="3">HSK 3 (Menengah Awal)</option>
                <option value="4">HSK 4 (Menengah Mandiri)</option>
                <option value="5">HSK 5 (Tingkat Mahir / Fluency)</option>
                <option value="6">HSK 6 (Tingkat Ahli / Profesional)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tingkat Kesulitan:</label>
              <select name="difficulty" id="formPHDifficulty" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <option value="easy">🟢 Easy (HSK 1-2)</option>
                <option value="medium">🟡 Medium (HSK 3-4)</option>
                <option value="hard">🔴 Hard (HSK 5-6)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Pinyin Kata:</label>
              <input type="text" name="pinyin" id="formPHPinyin" required placeholder="Contoh: nǐ hǎo" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; color: #1d4ed8;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Hanzi:</label>
              <input type="text" name="hanzi" id="formPHHanzi" required placeholder="Contoh: 你好" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.2rem; font-family: 'Noto Serif SC', serif;">
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Arti Kata (Bahasa Indonesia):</label>
            <input type="text" name="meaning" id="formPHMeaning" required placeholder="Contoh: Halo / Apa kabar" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Teks Pelafalan Audio (TTS Mandarin):</label>
            <input type="text" name="audio" id="formPHAudio" placeholder="Default sama dengan Hanzi (misal: 你好)" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            <small style="color: #64748b; font-size: 0.75rem;">Biarkan kosong atau isi sama dengan karakter Hanzi agar sistem audio membacakan suara alaminya.</small>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closePinyinHanziModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formPHSubmit" style="padding: 10px 22px; border: none; background: #2563eb; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Soal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Soal Pinyin ➔ Hanzi -->
    <table class="table-admin" id="pinyinHanziTable">
      <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th style="width: 90px;">Tingkat</th>
          <th style="width: 75px;">Level</th>
          <th style="width: 135px;">Pinyin (Kolom Kiri)</th>
          <th style="width: 125px;">Hanzi (Kolom Kanan)</th>
          <th>Arti Kata (Bahasa Indonesia)</th>
          <th style="width: 105px; text-align: center;">Uji Suara</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($pinyinHanziItems as $ph): 
          $diff = $ph['difficulty'] ?? ($ph['level'] <= 2 ? 'easy' : ($ph['level'] <= 4 ? 'medium' : 'hard'));
        ?>
          <tr data-level="<?= $ph['level'] ?>" data-diff="<?= htmlspecialchars($diff) ?>">
            <td><strong style="color: #64748b;">#<?= $ph['id'] ?></strong></td>
            <td><?= render_game_diff_badge($diff) ?></td>
            <td>
              <?php
                $hskColors = [
                  1 => ['bg' => '#dbeafe', 'text' => '#1e40af', 'border' => '#bfdbfe'],
                  2 => ['bg' => '#dcfce7', 'text' => '#166534', 'border' => '#bbf7d0'],
                  3 => ['bg' => '#fef3c7', 'text' => '#92400e', 'border' => '#fde68a'],
                  4 => ['bg' => '#ffedd5', 'text' => '#9a3412', 'border' => '#fed7aa'],
                  5 => ['bg' => '#ede9fe', 'text' => '#6b21a8', 'border' => '#ddd6fe'],
                  6 => ['bg' => '#fce7f3', 'text' => '#9d174d', 'border' => '#fbcfe8']
                ];
                $c = $hskColors[$ph['level']] ?? ['bg' => '#f1f5f9', 'text' => '#334155', 'border' => '#cbd5e1'];
              ?>
              <span style="background: <?= $c['bg'] ?>; color: <?= $c['text'] ?>; border: 1px solid <?= $c['border'] ?>; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800;">
                HSK <?= $ph['level'] ?>
              </span>
            </td>
            <td style="font-weight: 800; color: #1d4ed8; font-size: 1.05rem;">
              <?= htmlspecialchars($ph['pinyin']) ?>
            </td>
            <td>
              <strong style="font-size: 1.45rem; color: #0f172a; font-family: 'Noto Serif SC', serif;"><?= htmlspecialchars($ph['hanzi']) ?></strong>
            </td>
            <td style="font-weight: 600; color: #334155; font-size: 0.9rem;">
              <?= htmlspecialchars($ph['meaning']) ?>
            </td>
            <td style="text-align: center;">
              <button type="button" onclick="testSpeak('<?= htmlspecialchars(addslashes($ph['audio'] ?? $ph['hanzi'])) ?>')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                🔊 Bunyi
              </button>
            </td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditPinyinHanziModal(<?= json_encode($ph, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus soal cocok kata ini?');">
                  <input type="hidden" name="action" value="delete_pinyin_hanzi">
                  <input type="hidden" name="id" value="<?= $ph['id'] ?>">
                  <button type="submit" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                    🗑️
                  </button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>

<!-- =========================================================================
     MODAL JAVASCRIPT LOGIC
     ========================================================================= -->
<script>
// --- AUTO-SYNC DIFFICULTY HELPERS ---
function autoSyncToneDiff() {
  const lvl = parseInt(document.getElementById('formToneLevel').value) || 1;
  document.getElementById('formToneDifficulty').value = (lvl <= 2) ? 'easy' : ((lvl <= 4) ? 'medium' : 'hard');
}

function autoSyncLinkDiff() {
  const cat = document.getElementById('formLinkCat').value;
  document.getElementById('formLinkDifficulty').value = (cat === 'cat1' || cat === 'cat2') ? 'easy' : ((cat === 'cat3' || cat === 'cat4') ? 'medium' : 'hard');
}

function autoSyncMemDiff() {
  const s = document.getElementById('formMemSession').value;
  document.getElementById('formMemDifficulty').value = (s === 'session1' || s === 'session2') ? 'easy' : ((s === 'session3' || s === 'session4') ? 'medium' : 'hard');
}

function autoSyncPHDiff() {
  const lvl = parseInt(document.getElementById('formPHTier').value) || 1;
  document.getElementById('formPHDifficulty').value = (lvl <= 2) ? 'easy' : ((lvl <= 4) ? 'medium' : 'hard');
}

// --- TONE TRAINER SCRIPTS ---
function openAddToneModal() {
  document.getElementById('toneModalTitle').textContent = '🎵 Tambah Soal Nada Baru';
  document.getElementById('toneFormAction').value = 'add_tone';
  document.getElementById('toneFormId').value = '';
  document.getElementById('formToneLevel').value = '1';
  document.getElementById('formToneDifficulty').value = 'easy';
  document.getElementById('formToneNumber').value = '1';
  document.getElementById('formToneHanzi').value = '';
  document.getElementById('formTonePinyin').value = '';
  document.getElementById('formToneMeaning').value = '';
  document.getElementById('formToneTip').value = '';
  document.getElementById('formToneSubmit').textContent = 'Simpan Soal';
  document.getElementById('toneModal').style.display = 'flex';
}

function openEditToneModal(item) {
  document.getElementById('toneModalTitle').textContent = '✏️ Edit Soal Nada #' + item.id;
  document.getElementById('toneFormAction').value = 'edit_tone';
  document.getElementById('toneFormId').value = item.id;
  document.getElementById('formToneLevel').value = item.level;
  const defDiff = (item.level <= 2) ? 'easy' : ((item.level <= 4) ? 'medium' : 'hard');
  document.getElementById('formToneDifficulty').value = item.difficulty || defDiff;
  document.getElementById('formToneNumber').value = item.tone;
  document.getElementById('formToneHanzi').value = item.hanzi;
  document.getElementById('formTonePinyin').value = item.pinyin;
  document.getElementById('formToneMeaning').value = item.meaning;
  document.getElementById('formToneTip').value = item.tip || '';
  document.getElementById('formToneSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('toneModal').style.display = 'flex';
}

function closeToneModal() {
  document.getElementById('toneModal').style.display = 'none';
}

function filterToneTable() {
  const query = document.getElementById('toneSearch').value.toLowerCase();
  const lvl = document.getElementById('toneLevelFilter').value;
  const diff = document.getElementById('toneDiffFilter').value;
  const rows = document.querySelectorAll('#toneTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowLvl = r.getAttribute('data-level');
    const rowDiff = r.getAttribute('data-diff') || 'easy';
    const matchesSearch = text.includes(query);
    const matchesLvl = (lvl === 'all' || rowLvl === lvl);
    const matchesDiff = (diff === 'all' || rowDiff === diff);
    r.style.display = (matchesSearch && matchesLvl && matchesDiff) ? '' : 'none';
  });
}

// --- WORD LINK SCRIPTS ---
function autoCombineHanzi() {
  const a = document.getElementById('formLinkPartA').value.trim();
  const b = document.getElementById('formLinkPartB').value.trim();
  document.getElementById('formLinkHanzi').value = a + b;
}

function openAddLinkModal() {
  document.getElementById('linkModalTitle').textContent = '🧩 Tambah Pasang Kata Majemuk';
  document.getElementById('linkFormAction').value = 'add_link';
  document.getElementById('linkFormId').value = '';
  document.getElementById('formLinkCat').value = 'cat1';
  document.getElementById('formLinkDifficulty').value = 'easy';
  document.getElementById('formLinkPartA').value = '';
  document.getElementById('formLinkPartB').value = '';
  document.getElementById('formLinkHanzi').value = '';
  document.getElementById('formLinkPinyin').value = '';
  document.getElementById('formLinkMeaning').value = '';
  document.getElementById('formLinkSubmit').textContent = 'Simpan Pasangan';
  document.getElementById('linkModal').style.display = 'flex';
}

function openEditLinkModal(item) {
  document.getElementById('linkModalTitle').textContent = '✏️ Edit Pasangan Kata #' + item.id;
  document.getElementById('linkFormAction').value = 'edit_link';
  document.getElementById('linkFormId').value = item.id;
  document.getElementById('formLinkCat').value = item.category;
  const defDiff = (item.category === 'cat1' || item.category === 'cat2') ? 'easy' : ((item.category === 'cat3' || item.category === 'cat4') ? 'medium' : 'hard');
  document.getElementById('formLinkDifficulty').value = item.difficulty || defDiff;
  document.getElementById('formLinkPartA').value = item.pA;
  document.getElementById('formLinkPartB').value = item.pB;
  document.getElementById('formLinkHanzi').value = item.hanzi;
  document.getElementById('formLinkPinyin').value = item.pinyin;
  document.getElementById('formLinkMeaning').value = item.meaning;
  document.getElementById('formLinkSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('linkModal').style.display = 'flex';
}

function closeLinkModal() {
  document.getElementById('linkModal').style.display = 'none';
}

function filterLinkTable() {
  const query = document.getElementById('linkSearch').value.toLowerCase();
  const cat = document.getElementById('linkCatFilter').value;
  const diff = document.getElementById('linkDiffFilter').value;
  const rows = document.querySelectorAll('#linkTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowCat = r.getAttribute('data-cat');
    const rowDiff = r.getAttribute('data-diff') || 'easy';
    const matchesSearch = text.includes(query);
    const matchesCat = (cat === 'all' || rowCat === cat);
    const matchesDiff = (diff === 'all' || rowDiff === diff);
    r.style.display = (matchesSearch && matchesCat && matchesDiff) ? '' : 'none';
  });
}

// --- MEMORY MATCH SCRIPTS ---
function openAddMemModal() {
  document.getElementById('memModalTitle').textContent = '🃏 Tambah Pasangan Kartu Memori';
  document.getElementById('memFormAction').value = 'add_memory';
  document.getElementById('memFormId').value = '';
  document.getElementById('formMemSession').value = 'session1';
  document.getElementById('formMemDifficulty').value = 'easy';
  document.getElementById('formMemHanzi').value = '';
  document.getElementById('formMemText').value = '';
  document.getElementById('formMemSubmit').textContent = 'Simpan Kartu';
  document.getElementById('memModal').style.display = 'flex';
}

function openEditMemModal(item) {
  document.getElementById('memModalTitle').textContent = '✏️ Edit Pasangan Kartu #' + item.id;
  document.getElementById('memFormAction').value = 'edit_memory';
  document.getElementById('memFormId').value = item.id;
  const sess = item.session || 'session1';
  document.getElementById('formMemSession').value = sess;
  const defDiff = (sess === 'session1' || sess === 'session2') ? 'easy' : ((sess === 'session3' || sess === 'session4') ? 'medium' : 'hard');
  document.getElementById('formMemDifficulty').value = item.difficulty || defDiff;
  document.getElementById('formMemHanzi').value = item.hanzi;
  document.getElementById('formMemText').value = item.text;
  document.getElementById('formMemSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('memModal').style.display = 'flex';
}

function closeMemModal() {
  document.getElementById('memModal').style.display = 'none';
}

function filterMemTable() {
  const query = document.getElementById('memSearch').value.toLowerCase();
  const session = document.getElementById('memSessionFilter').value;
  const diff = document.getElementById('memDiffFilter').value;
  const rows = document.querySelectorAll('#memTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowSession = r.getAttribute('data-session') || 'session1';
    const rowDiff = r.getAttribute('data-diff') || 'easy';
    const matchesSearch = text.includes(query);
    const matchesSession = (session === 'all' || rowSession === session);
    const matchesDiff = (diff === 'all' || rowDiff === diff);
    r.style.display = (matchesSearch && matchesSession && matchesDiff) ? '' : 'none';
  });
}

// --- PINYIN TO HANZI SCRIPTS ---
function testSpeak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
}

function openAddPinyinHanziModal() {
  document.getElementById('pinyinHanziModalTitle').textContent = '🎯 Tambah Soal Pinyin ➔ Hanzi';
  document.getElementById('pinyinHanziFormAction').value = 'add_pinyin_hanzi';
  document.getElementById('pinyinHanziFormId').value = '';
  document.getElementById('formPHTier').value = '1';
  document.getElementById('formPHDifficulty').value = 'easy';
  document.getElementById('formPHPinyin').value = '';
  document.getElementById('formPHHanzi').value = '';
  document.getElementById('formPHMeaning').value = '';
  document.getElementById('formPHAudio').value = '';
  document.getElementById('formPHSubmit').textContent = 'Simpan Soal';
  document.getElementById('pinyinHanziModal').style.display = 'flex';
}

function openEditPinyinHanziModal(item) {
  document.getElementById('pinyinHanziModalTitle').textContent = '✏️ Edit Soal Cocok Pinyin-Hanzi #' + item.id;
  document.getElementById('pinyinHanziFormAction').value = 'edit_pinyin_hanzi';
  document.getElementById('pinyinHanziFormId').value = item.id;
  document.getElementById('formPHTier').value = item.level;
  const defDiff = (item.level <= 2) ? 'easy' : ((item.level <= 4) ? 'medium' : 'hard');
  document.getElementById('formPHDifficulty').value = item.difficulty || defDiff;
  document.getElementById('formPHPinyin').value = item.pinyin;
  document.getElementById('formPHHanzi').value = item.hanzi;
  document.getElementById('formPHMeaning').value = item.meaning;
  document.getElementById('formPHAudio').value = item.audio || item.hanzi;
  document.getElementById('formPHSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('pinyinHanziModal').style.display = 'flex';
}

function closePinyinHanziModal() {
  document.getElementById('pinyinHanziModal').style.display = 'none';
}

function filterPinyinHanziTable() {
  const query = document.getElementById('pinyinHanziSearch').value.toLowerCase();
  const lvl = document.getElementById('pinyinHanziLevelFilter').value;
  const diff = document.getElementById('pinyinHanziDiffFilter').value;
  const rows = document.querySelectorAll('#pinyinHanziTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowLvl = r.getAttribute('data-level');
    const rowDiff = r.getAttribute('data-diff') || 'easy';
    const matchesSearch = text.includes(query);
    const matchesLvl = (lvl === 'all' || rowLvl === lvl);
    const matchesDiff = (diff === 'all' || rowDiff === diff);
    r.style.display = (matchesSearch && matchesLvl && matchesDiff) ? '' : 'none';
  });
}
</script>

<?php include 'includes/footer.php'; ?>
`;

fs.writeFileSync(adminFilePath, headerPart + newBody, 'utf8');
console.log('Successfully updated admin/game_arena.php with difficulty features!');

