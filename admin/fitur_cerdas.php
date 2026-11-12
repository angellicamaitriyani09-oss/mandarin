<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/game_features_db.php';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/sidebar.php';

$currentTab = $_GET['tab'] ?? 'anatomy'; // 'anatomy', 'leaderboard', 'anki_colorizer'

// =========================================================================
// ACTION HANDLERS (Add, Edit, Delete with DB + JSON Fallback Sync)
// =========================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // --- TAB 1: ANATOMI KARAKTER HANZI ---
    if ($action === 'add_anatomy') {
        $level = (int)($_POST['level'] ?? 1);
        $char = trim($_POST['char'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $rad_a = trim($_POST['rad_a'] ?? '');
        $rad_b = trim($_POST['rad_b'] ?? '');
        $story = trim($_POST['story'] ?? '');

        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO smart_hanzi_anatomy (level, char_hanzi, pinyin, meaning, rad_a, rad_b, story) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$level, $char, $pinyin, $meaning, $rad_a, $rad_b, $story]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        $newId = time();
        $json['anatomy'][] = [
            'id' => $newId,
            'level' => $level,
            'char' => $char,
            'pinyin' => $pinyin,
            'meaning' => $meaning,
            'radA' => $rad_a,
            'radB' => $rad_b,
            'story' => $story
        ];
        write_json_data($jsonFiturPath, $json);
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=anatomy&status=added");
        exit();
    } elseif ($action === 'edit_anatomy') {
        $id = (int)$_POST['id'];
        $level = (int)($_POST['level'] ?? 1);
        $char = trim($_POST['char'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $rad_a = trim($_POST['rad_a'] ?? '');
        $rad_b = trim($_POST['rad_b'] ?? '');
        $story = trim($_POST['story'] ?? '');

        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE smart_hanzi_anatomy SET level = ?, char_hanzi = ?, pinyin = ?, meaning = ?, rad_a = ?, rad_b = ?, story = ? WHERE id = ?");
                $stmt->execute([$level, $char, $pinyin, $meaning, $rad_a, $rad_b, $story, $id]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        if (!empty($json['anatomy'])) {
            foreach ($json['anatomy'] as &$item) {
                if ($item['id'] == $id) {
                    $item['level'] = $level;
                    $item['char'] = $char;
                    $item['pinyin'] = $pinyin;
                    $item['meaning'] = $meaning;
                    $item['radA'] = $rad_a;
                    $item['radB'] = $rad_b;
                    $item['story'] = $story;
                    break;
                }
            }
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=anatomy&status=updated");
        exit();
    } elseif ($action === 'delete_anatomy') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM smart_hanzi_anatomy WHERE id = ?");
                $stmt->execute([$id]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        if (!empty($json['anatomy'])) {
            $json['anatomy'] = array_values(array_filter($json['anatomy'], function($i) use ($id) {
                return $i['id'] != $id;
            }));
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=anatomy&status=deleted");
        exit();
    } elseif ($action === 'import_anatomy') {
        $importedCount = 0;
        $itemsToInsert = [];

        // 1. Cek unggahan file (.csv, .json, .txt)
        if (isset($_FILES['import_file']) && $_FILES['import_file']['error'] === UPLOAD_ERR_OK) {
            $tmpPath = $_FILES['import_file']['tmp_name'];
            $fileName = strtolower($_FILES['import_file']['name']);
            $content = file_get_contents($tmpPath);

            if (str_ends_with($fileName, '.json')) {
                $jsonData = json_decode($content, true);
                if (is_array($jsonData)) {
                    $itemsToInsert = isset($jsonData['anatomy']) ? $jsonData['anatomy'] : $jsonData;
                }
            } else {
                // Parsing CSV / TSV / TXT
                $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $content));
                $isHeader = true;
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (!$line) continue;
                    if ($isHeader && (stripos($line, 'char') !== false || stripos($line, 'hanzi') !== false)) {
                        $isHeader = false;
                        continue;
                    }
                    $isHeader = false;
                    $parts = str_getcsv($line);
                    if (count($parts) >= 2) {
                        $itemsToInsert[] = [
                            'char' => trim($parts[0] ?? ''),
                            'pinyin' => trim($parts[1] ?? ''),
                            'meaning' => trim($parts[2] ?? ''),
                            'radA' => trim($parts[3] ?? '-'),
                            'radB' => trim($parts[4] ?? '-'),
                            'story' => trim($parts[5] ?? 'Karakter asosiasi filosofis'),
                            'level' => (int)($parts[6] ?? 1) ?: 1
                        ];
                    }
                }
            }
        } elseif (!empty($_POST['raw_text'])) {
            // 2. Cek input teks mentah yang diketik / ditempel
            $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $_POST['raw_text']));
            foreach ($lines as $line) {
                $line = trim($line);
                if (!$line) continue;
                $parts = str_getcsv($line);
                if (count($parts) >= 2) {
                    $itemsToInsert[] = [
                        'char' => trim($parts[0] ?? ''),
                        'pinyin' => trim($parts[1] ?? ''),
                        'meaning' => trim($parts[2] ?? ''),
                        'radA' => trim($parts[3] ?? '-'),
                        'radB' => trim($parts[4] ?? '-'),
                        'story' => trim($parts[5] ?? 'Karakter asosiasi filosofis'),
                        'level' => (int)($parts[6] ?? 1) ?: 1
                    ];
                }
            }
        }

        if (!empty($itemsToInsert)) {
            $json = read_json_data($jsonFiturPath);
            if (!isset($json['anatomy'])) $json['anatomy'] = [];

            foreach ($itemsToInsert as $item) {
                $char = $item['char'] ?? ($item['char_hanzi'] ?? '');
                if (!$char) continue;
                $pinyin = $item['pinyin'] ?? '';
                $meaning = $item['meaning'] ?? '';
                $rad_a = $item['radA'] ?? ($item['rad_a'] ?? '-');
                $rad_b = $item['radB'] ?? ($item['rad_b'] ?? '-');
                $story = $item['story'] ?? 'Karakter asosiasi filosofis';
                $level = (int)($item['level'] ?? 1) ?: 1;

                if ($db_connected && $pdo) {
                    try {
                        $stmt = $pdo->prepare("INSERT INTO smart_hanzi_anatomy (level, char_hanzi, pinyin, meaning, rad_a, rad_b, story) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$level, $char, $pinyin, $meaning, $rad_a, $rad_b, $story]);
                    } catch (\Exception $e) {}
                }

                $json['anatomy'][] = [
                    'id' => time() + rand(1, 99999),
                    'level' => $level,
                    'char' => $char,
                    'pinyin' => $pinyin,
                    'meaning' => $meaning,
                    'radA' => $rad_a,
                    'radB' => $rad_b,
                    'story' => $story
                ];
                $importedCount++;
            }

            write_json_data($jsonFiturPath, $json);
            sync_fitur_cerdas_to_json();
        }

        header("Location: fitur_cerdas.php?tab=anatomy&status=imported&count=" . $importedCount);
        exit();
    }

    // --- TAB 2: PAPAN PERINGKAT / LEADERBOARD ---
    elseif ($action === 'add_leaderboard') {
        $rank = (int)($_POST['rank'] ?? 1);
        $name = trim($_POST['name'] ?? '');
        $exp = (int)($_POST['exp'] ?? 100);
        $hsk = trim($_POST['hsk'] ?? 'HSK 1');
        $avatar = trim($_POST['avatar'] ?? '🦁');
        $medal = trim($_POST['medal'] ?? "#$rank");
        $is_user = !empty($_POST['is_user']) ? 1 : 0;

        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO smart_leaderboard (rank_num, name, exp, hsk_level, avatar, medal, is_user) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$rank, $name, $exp, $hsk, $avatar, $medal, $is_user]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        $newId = time();
        $json['leaderboard'][] = [
            'id' => $newId,
            'rank' => $rank,
            'name' => $name,
            'exp' => $exp,
            'hsk' => $hsk,
            'avatar' => $avatar,
            'medal' => $medal,
            'isUser' => (bool)$is_user
        ];
        write_json_data($jsonFiturPath, $json);
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=leaderboard&status=added");
        exit();
    } elseif ($action === 'edit_leaderboard') {
        $id = (int)$_POST['id'];
        $rank = (int)($_POST['rank'] ?? 1);
        $name = trim($_POST['name'] ?? '');
        $exp = (int)($_POST['exp'] ?? 100);
        $hsk = trim($_POST['hsk'] ?? 'HSK 1');
        $avatar = trim($_POST['avatar'] ?? '🦁');
        $medal = trim($_POST['medal'] ?? "#$rank");
        $is_user = !empty($_POST['is_user']) ? 1 : 0;

        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE smart_leaderboard SET rank_num = ?, name = ?, exp = ?, hsk_level = ?, avatar = ?, medal = ?, is_user = ? WHERE id = ?");
                $stmt->execute([$rank, $name, $exp, $hsk, $avatar, $medal, $is_user, $id]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        if (!empty($json['leaderboard'])) {
            foreach ($json['leaderboard'] as &$item) {
                if ($item['id'] == $id) {
                    $item['rank'] = $rank;
                    $item['name'] = $name;
                    $item['exp'] = $exp;
                    $item['hsk'] = $hsk;
                    $item['avatar'] = $avatar;
                    $item['medal'] = $medal;
                    $item['isUser'] = (bool)$is_user;
                    break;
                }
            }
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=leaderboard&status=updated");
        exit();
    } elseif ($action === 'delete_leaderboard') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM smart_leaderboard WHERE id = ?");
                $stmt->execute([$id]);
            } catch (\Exception $e) {}
        }
        $json = read_json_data($jsonFiturPath);
        if (!empty($json['leaderboard'])) {
            $json['leaderboard'] = array_values(array_filter($json['leaderboard'], function($i) use ($id) {
                return $i['id'] != $id;
            }));
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        header("Location: fitur_cerdas.php?tab=leaderboard&status=deleted");
        exit();
    }
}

// Fetch lists
$anatomyItems = get_all_hanzi_anatomy();
$leaderboardItems = get_all_leaderboard();

$flashcardCount = 0;
if ($db_connected && $pdo) {
    try {
        $flashcardCount = $pdo->query("SELECT COUNT(*) FROM flashcards")->fetchColumn();
    } catch (\Exception $e) {}
}
?>

<!-- Alert Feedback Status -->
<?php if (isset($_GET['status'])): ?>
  <div style="padding: 12px 18px; margin-bottom: 20px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; <?php 
    if ($_GET['status'] == 'added') echo 'background: #dcfce7; color: #166534; border: 1px solid #86efac;';
    elseif ($_GET['status'] == 'updated') echo 'background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc;';
    elseif ($_GET['status'] == 'deleted') echo 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
    elseif ($_GET['status'] == 'imported') echo 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;';
  ?>">
    <?php 
      if ($_GET['status'] == 'added') echo '✅ Data fitur cerdas berhasil ditambahkan!';
      elseif ($_GET['status'] == 'updated') echo '✨ Data fitur cerdas berhasil diperbarui!';
      elseif ($_GET['status'] == 'deleted') echo '🗑️ Data fitur cerdas berhasil dihapus!';
      elseif ($_GET['status'] == 'imported') echo '📥 Berhasil mengimpor ' . intval($_GET['count'] ?? 0) . ' butir kosakata anatomi karakter baru ke sistem!';
    ?>
  </div>
<?php endif; ?>

<!-- Header Kelola Fitur Cerdas -->
<div class="admin-card" style="border-left: 5px solid #0284c7;">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
    <div>
      <h1 style="color: var(--dark-text); margin: 0 0 6px 0; font-size: 1.6rem; display: flex; align-items: center; gap: 10px;">
        <span>💡</span> Kelola Fitur Cerdas & Alat Bantu
      </h1>
      <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem;">
        Edit, ubah, tambah, dan hapus konten Anatomi Karakter Hanzi (字形拆解) dan Papan Peringkat Mingguan (每周排行榜).
      </p>
    </div>
    
    <div style="display: flex; gap: 8px;">
      <a href="../index.php#page-fitur-pintar" target="_blank" style="background: #e0f2fe; color: #0369a1; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
        👁️ Buka Fitur Pintar di Web ↗
      </a>
    </div>
  </div>

  <!-- Statistik Ringkasan -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-top: 20px;">
    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #0284c7;">🧩 ANATOMI KARAKTER</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #0369a1;"><?= count($anatomyItems) ?> <span style="font-size: 0.85rem; font-weight: normal; color: #0284c7;">karakter (HSK 1-6)</span></div>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #b45309;">🏆 PAPAN PERINGKAT</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #78350f;"><?= count($leaderboardItems) ?> <span style="font-size: 0.85rem; font-weight: normal; color: #b45309;">peserta mingguan</span></div>
    </div>
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #047857;">📦 KOSAKATA TERSEDIA</div>
      <div style="font-size: 1.6rem; font-weight: 900; color: #065f46;"><?= $flashcardCount ?> <span style="font-size: 0.85rem; font-weight: normal; color: #059669;">kata siap ekspor</span></div>
    </div>
  </div>
</div>

<!-- Tabs Sub-Fitur Cerdas -->
<div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 2px; flex-wrap: wrap;">
  <a href="fitur_cerdas.php?tab=anatomy" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'anatomy' ? '#0284c7' : 'transparent' ?>; color: <?= $currentTab === 'anatomy' ? '#0369a1' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🧩 Anatomi Karakter (字形拆解) <span style="background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($anatomyItems) ?></span>
  </a>
  <a href="fitur_cerdas.php?tab=leaderboard" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'leaderboard' ? '#0284c7' : 'transparent' ?>; color: <?= $currentTab === 'leaderboard' ? '#0369a1' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🏆 Papan Peringkat (每周排行榜) <span style="background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 99px; font-size: 0.75rem;"><?= count($leaderboardItems) ?></span>
  </a>
  <a href="fitur_cerdas.php?tab=anki_colorizer" style="padding: 10px 20px; font-weight: 800; font-size: 0.9rem; text-decoration: none; border-bottom: 3px solid <?= $currentTab === 'anki_colorizer' ? '#0284c7' : 'transparent' ?>; color: <?= $currentTab === 'anki_colorizer' ? '#0369a1' : '#64748b' ?>; display: inline-flex; align-items: center; gap: 8px;">
    🎨 Pewarna Teks & Ekspor Anki
  </a>
</div>

<!-- =========================================================================
     TAB 1: ANATOMI KARAKTER HANZI
     ========================================================================= -->
<?php if ($currentTab === 'anatomy'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="anatSearch" onkeyup="filterAnatTable()" placeholder="Cari Hanzi, Pinyin, Makna, Radikal..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 240px; font-size: 0.88rem;">

        <select id="anatLevelFilter" onchange="filterAnatTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Level HSK</option>
          <option value="1">HSK 1</option>
          <option value="2">HSK 2</option>
          <option value="3">HSK 3</option>
          <option value="4">HSK 4</option>
          <option value="5">HSK 5</option>
          <option value="6">HSK 6</option>
        </select>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" onclick="openImportAnatModal()" style="background: #059669; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
          📤 Upload / Import File Kosakata
        </button>
        <button type="button" onclick="openAddAnatModal()" style="background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
          ➕ Tambah Anatomi Karakter Baru
        </button>
      </div>
    </div>

    <!-- Modal Upload & Import Batch Anatomi Kosakata -->
    <div id="anatImportModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">📤 Upload & Import File Kosakata Anatomi</h3>
          <button type="button" onclick="closeImportAnatModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" enctype="multipart/form-data">
          <input type="hidden" name="action" value="import_anatomy">

          <div style="margin-bottom: 16px; background: #f0fdf4; border: 1.5px dashed #86efac; border-radius: 12px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="display: block; font-weight: 800; font-size: 0.9rem; color: #166534; margin: 0;">1. Unggah File Kosakata (.CSV, .JSON, atau .TXT):</label>
              <button type="button" onclick="downloadAnatTemplateCsv()" style="background: #ffffff; color: #059669; border: 1px solid #86efac; padding: 4px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
                📥 Unduh Contoh Template CSV
              </button>
            </div>
            <input type="file" name="import_file" accept=".csv,.json,.txt" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff;">
            <div style="font-size: 0.78rem; color: #475569; margin-top: 6px;">
              Format Kolom CSV: <code>char,pinyin,meaning,rad_a,rad_b,story,level</code><br>
              Atau file JSON berisi array objek anatomi.
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 800; font-size: 0.9rem; color: #334155; margin-bottom: 6px;">2. Atau Ketik / Paste Baris Kosakata Langsung (Format CSV):</label>
            <textarea name="raw_text" rows="5" placeholder="Contoh baris teks:
休,xiū,Istirahat / Rehat,亻 (Orang),木 (Pohon),Seseorang bersandar di pohon rindang untuk melepas lelah,1
明,míng,Terang / Jelas,日 (Matahari),月 (Bulan),Matahari dan bulan bersatu menghasilkan terang,1" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: monospace; font-size: 0.82rem;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeImportAnatModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-weight: 700;">Batal</button>
            <button type="submit" style="background: #059669; color: white; border: none; padding: 9px 20px; border-radius: 8px; cursor: pointer; font-weight: 800;">🚀 Proses & Simpan Kosakata</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Form Anatomi Hanzi -->
    <div id="anatModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="anatModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🧩 Tambah Anatomi Karakter Baru</h3>
          <button type="button" onclick="closeAnatModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="anatForm">
          <input type="hidden" name="action" id="anatFormAction" value="add_anatomy">
          <input type="hidden" name="id" id="anatFormId" value="">

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tingkat Level HSK:</label>
            <select name="level" id="formAnatLevel" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
              <option value="1">HSK 1 (Dasar Pemula)</option>
              <option value="2">HSK 2 (Percakapan Sehari-hari)</option>
              <option value="3">HSK 3 (Menengah Awal)</option>
              <option value="4">HSK 4 (Menengah Mandiri)</option>
              <option value="5">HSK 5 (Tingkat Mahir)</option>
              <option value="6">HSK 6 (Tingkat Ahli)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Karakter Hanzi Utama:</label>
              <input type="text" name="char" id="formAnatChar" required placeholder="Contoh: 休" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.3rem;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Pinyin Bernada:</label>
              <input type="text" name="pinyin" id="formAnatPinyin" required placeholder="Contoh: xiū" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Arti Karakter (Bahasa Indonesia):</label>
            <input type="text" name="meaning" id="formAnatMeaning" required placeholder="Contoh: Istirahat / Rehat" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Komponen / Radikal A:</label>
              <input type="text" name="rad_a" id="formAnatRadA" required placeholder="Contoh: 亻 (Orang)" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Komponen / Radikal B:</label>
              <input type="text" name="rad_b" id="formAnatRadB" required placeholder="Contoh: 木 (Pohon)" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Kisah Asosiasi / Cerita Mnemonic Filosofis:</label>
            <textarea name="story" id="formAnatStory" rows="3" required placeholder="Contoh: Seseorang bersandar di pohon yang rindang untuk melepas lelah setelah seharian bekerja." style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 0.85rem;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeAnatModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formAnatSubmit" style="padding: 10px 22px; border: none; background: #0284c7; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Anatomi</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Anatomi Karakter -->
    <table class="table-admin" id="anatTable">
      <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th style="width: 80px;">Level</th>
          <th style="width: 85px;">Karakter</th>
          <th style="width: 105px;">Pinyin</th>
          <th style="width: 160px;">Arti</th>
          <th style="width: 190px;">Dekomposisi (A + B)</th>
          <th>Kisah Asosiasi / Mnemonic</th>
          <th style="width: 95px; text-align: center;">Uji Suara</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($anatomyItems as $a): 
          $lvl = (int)($a['level'] ?? 1);
        ?>
          <tr data-level="<?= $lvl ?>">
            <td><strong style="color: #64748b;">#<?= $a['id'] ?></strong></td>
            <td>
              <span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 2px 7px; border-radius: 6px; font-size: 0.75rem; font-weight: 800;">
                HSK <?= $lvl ?>
              </span>
            </td>
            <td>
              <span style="font-family: 'Noto Serif SC', serif; font-size: 1.6rem; font-weight: 900; color: #dc2626;">
                <?= htmlspecialchars($a['char']) ?>
              </span>
            </td>
            <td style="color: #ea580c; font-weight: 800;"><?= htmlspecialchars($a['pinyin']) ?></td>
            <td style="font-weight: 700; color: #1e293b;"><?= htmlspecialchars($a['meaning']) ?></td>
            <td>
              <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: #475569; border: 1px solid #e2e8f0; display: inline-block;">
                <span style="color: #0284c7;"><?= htmlspecialchars($a['radA']) ?></span> + <span style="color: #10b981;"><?= htmlspecialchars($a['radB']) ?></span>
              </span>
            </td>
            <td style="font-size: 0.85rem; color: #334155; line-height: 1.4;">
              <?= htmlspecialchars($a['story']) ?>
            </td>
            <td style="text-align: center;">
              <button type="button" onclick="testSpeak('<?= htmlspecialchars(addslashes($a['char'])) ?>')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 6px; padding: 4px 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                🔊 Bunyi
              </button>
            </td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditAnatModal(<?= json_encode($a, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus anatomi karakter ini?');">
                  <input type="hidden" name="action" value="delete_anatomy">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
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
     TAB 2: PAPAN PERINGKAT / LEADERBOARD MINGGUAN
     ========================================================================= -->
<?php elseif ($currentTab === 'leaderboard'): ?>
  <div class="admin-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="lbSearch" onkeyup="filterLbTable()" placeholder="Cari Nama Siswa atau Level..." style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; width: 240px; font-size: 0.88rem;">

        <select id="lbHskFilter" onchange="filterLbTable()" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; font-weight: 700; color: #334155;">
          <option value="all">Semua Level Siswa</option>
          <option value="HSK 1">HSK 1</option>
          <option value="HSK 2">HSK 2</option>
          <option value="HSK 3">HSK 3</option>
          <option value="HSK 4">HSK 4</option>
          <option value="HSK 5">HSK 5</option>
          <option value="HSK 6">HSK 6</option>
        </select>
      </div>

      <button type="button" onclick="openAddLbModal()" style="background: #f59e0b; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
        ➕ Tambah Peringkat Siswa Baru
      </button>
    </div>

    <!-- Modal Form Leaderboard -->
    <div id="lbModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 520px; padding: 26px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <h3 id="lbModalTitle" style="margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800;">🏆 Tambah Peringkat Siswa</h3>
          <button type="button" onclick="closeLbModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form method="POST" id="lbForm">
          <input type="hidden" name="action" id="lbFormAction" value="add_leaderboard">
          <input type="hidden" name="id" id="lbFormId" value="">

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Peringkat (Rank #):</label>
              <input type="number" name="rank" id="formLbRank" required min="1" max="999" value="1" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tanda Medali / Simbol:</label>
              <input type="text" name="medal" id="formLbMedal" required placeholder="Contoh: 🥇 atau #1" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Nama Lengkap Siswa:</label>
            <input type="text" name="name" id="formLbName" required placeholder="Contoh: Budi Santoso" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Perolehan EXP:</label>
              <input type="number" name="exp" id="formLbExp" required min="0" placeholder="Contoh: 1420" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 800;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Level HSK Siswa:</label>
              <select name="hsk" id="formLbHsk" required style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="HSK 5">HSK 5</option>
                <option value="HSK 6">HSK 6</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Avatar Emoji Siswa:</label>
              <select name="avatar" id="formLbAvatar" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1.1rem;">
                <option value="🦁">🦁 Singa</option>
                <option value="🌸">🌸 Bunga Sakura</option>
                <option value="🚀">🚀 Roket</option>
                <option value="🦊">🦊 Rubah</option>
                <option value="🐼">🐼 Panda</option>
                <option value="🐰">🐰 Kelinci</option>
                <option value="🐯">🐯 Harimau</option>
                <option value="🐉">🐉 Naga</option>
                <option value="⭐">⭐ Bintang Emas</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Tanda Akun Pengguna?</label>
              <div style="padding-top: 8px;">
                <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: #ea580c; cursor: pointer;">
                  <input type="checkbox" name="is_user" id="formLbIsUser" value="1">
                  Tandai sebagai "Anda" (User)
                </label>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="closeLbModal()" style="padding: 10px 18px; border: none; background: #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer;">Batal</button>
            <button type="submit" id="formLbSubmit" style="padding: 10px 22px; border: none; background: #f59e0b; color: white; border-radius: 8px; font-weight: 800; cursor: pointer;">Simpan Peringkat</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabel Leaderboard -->
    <table class="table-admin" id="lbTable">
      <thead>
        <tr>
          <th style="width: 70px; text-align: center;">Rank</th>
          <th style="width: 70px; text-align: center;">Avatar</th>
          <th>Nama Siswa</th>
          <th style="width: 110px;">Level HSK</th>
          <th style="width: 130px; text-align: right;">EXP Mingguan</th>
          <th style="width: 120px; text-align: center;">Status Akun</th>
          <th style="width: 130px; text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($leaderboardItems as $l): ?>
          <tr data-hsk="<?= htmlspecialchars($l['hsk']) ?>">
            <td style="text-align: center;">
              <span style="font-size: 1.2rem; font-weight: 900; color: #b45309;"><?= htmlspecialchars($l['medal'] ?? ('#' . $l['rank'])) ?></span>
            </td>
            <td style="text-align: center; font-size: 1.4rem;">
              <?= htmlspecialchars($l['avatar']) ?>
            </td>
            <td>
              <strong style="color: #0f172a; font-size: 0.95rem;"><?= htmlspecialchars($l['name']) ?></strong>
            </td>
            <td>
              <span style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; border: 1px solid #cbd5e1;">
                <?= htmlspecialchars($l['hsk']) ?>
              </span>
            </td>
            <td style="text-align: right;">
              <strong style="color: #ea580c; font-size: 1rem;"><?= number_format($l['exp']) ?></strong> <span style="font-size: 0.75rem; color: #94a3b8;">EXP</span>
            </td>
            <td style="text-align: center;">
              <?php if (!empty($l['isUser'])): ?>
                <span style="background: #fee2e2; color: #dc2626; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                  Akun Siswa (Anda)
                </span>
              <?php else: ?>
                <span style="color: #94a3b8; font-size: 0.75rem;">Publik</span>
              <?php endif; ?>
            </td>
            <td style="text-align: center;">
              <div style="display: inline-flex; gap: 6px;">
                <button type="button" onclick='openEditLbModal(<?= json_encode($l, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
                  ✏️ Edit
                </button>
                <form method="POST" style="display: inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus data peringkat ini?');">
                  <input type="hidden" name="action" value="delete_leaderboard">
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
     TAB 3: INTEGRASI PEWARNA NADA & EKSPOR ANKI
     ========================================================================= -->
<?php elseif ($currentTab === 'anki_colorizer'): ?>
  <div class="admin-card">
    <h3 style="font-size: 1.25rem; font-weight: 800; color: #0369a1; margin-top: 0;">
      🎨 Pewarna 4 Nada Teks Bebas & Ekspor Kosakata ke Anki (.CSV)
    </h3>
    <p style="color: #475569; font-size: 0.88rem; line-height: 1.6; max-width: 780px;">
      Kedua fitur ini secara otomatis digerakkan oleh basis data <strong>Kamus & Flashcard Mandarinku</strong>. 
      Setiap kosakata baru yang Anda tambahkan di panel <em>Kelola Flashcard</em> langsung dapat dideteksi oleh mesin pewarna nada teks bebas dan dapat langsung diunduh ke format Anki oleh siswa.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 24px 0;">
      <div style="border: 1.5px solid #bae6fd; border-radius: 12px; padding: 20px; background: #f0f9ff;">
        <h4 style="margin: 0 0 8px 0; color: #0284c7; font-size: 1.05rem;">🎨 Pewarna 4 Nada Teks Bebas</h4>
        <p style="font-size: 0.82rem; color: #334155; margin-bottom: 14px;">
          Menguraikan setiap karakter Hanzi pada teks input siswa dan memberikan warna standar linguistik sesuai nada (Merah untuk Nada 1, Oranye Nada 2, Hijau Nada 3, Biru Nada 4).
        </p>
        <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 800;">Mesin Pemecah Hanzi Otomatis Aktif</span>
      </div>

      <div style="border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 20px; background: #ecfdf5;">
        <h4 style="margin: 0 0 8px 0; color: #047857; font-size: 1.05rem;">📦 Ekspor Kosakata ke Anki (.CSV)</h4>
        <p style="font-size: 0.82rem; color: #334155; margin-bottom: 14px;">
          Mengemas seluruh koleksi kosakata dari HSK 1 hingga HSK 6 menjadi file CSV bertanda UTF-8 BOM yang langsung dapat diimpor ke aplikasi spaced-repetition Anki (Desktop / Android / iOS).
        </p>
        <a href="flashcards.php" style="background: #059669; color: #fff; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; display: inline-block;">
          🃏 Kelola Data Kosakata & Flashcard ➔
        </a>
      </div>
    </div>
  </div>
<?php endif; ?>

<!-- =========================================================================
     MODAL JAVASCRIPT LOGIC
     ========================================================================= -->
<script>
// --- AUDIO TTS SYNTHESIS ---
function testSpeak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
}

// --- ANATOMI HANZI SCRIPTS ---
function openAddAnatModal() {
  document.getElementById('anatModalTitle').textContent = '🧩 Tambah Anatomi Karakter Baru';
  document.getElementById('anatFormAction').value = 'add_anatomy';
  document.getElementById('anatFormId').value = '';
  document.getElementById('formAnatLevel').value = '1';
  document.getElementById('formAnatChar').value = '';
  document.getElementById('formAnatPinyin').value = '';
  document.getElementById('formAnatMeaning').value = '';
  document.getElementById('formAnatRadA').value = '';
  document.getElementById('formAnatRadB').value = '';
  document.getElementById('formAnatStory').value = '';
  document.getElementById('formAnatSubmit').textContent = 'Simpan Anatomi';
  document.getElementById('anatModal').style.display = 'flex';
}

function openEditAnatModal(item) {
  document.getElementById('anatModalTitle').textContent = '✏️ Edit Anatomi Karakter #' + item.id + ' (' + item.char + ')';
  document.getElementById('anatFormAction').value = 'edit_anatomy';
  document.getElementById('anatFormId').value = item.id;
  document.getElementById('formAnatLevel').value = item.level || 1;
  document.getElementById('formAnatChar').value = item.char;
  document.getElementById('formAnatPinyin').value = item.pinyin;
  document.getElementById('formAnatMeaning').value = item.meaning;
  document.getElementById('formAnatRadA').value = item.radA;
  document.getElementById('formAnatRadB').value = item.radB;
  document.getElementById('formAnatStory').value = item.story;
  document.getElementById('formAnatSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('anatModal').style.display = 'flex';
}

function closeAnatModal() {
  document.getElementById('anatModal').style.display = 'none';
}

function openImportAnatModal() {
  document.getElementById('anatImportModal').style.display = 'flex';
}

function closeImportAnatModal() {
  document.getElementById('anatImportModal').style.display = 'none';
}

function downloadAnatTemplateCsv() {
  const content = '\uFEFF"char","pinyin","meaning","rad_a","rad_b","story","level"\r\n' +
    '"休","xiū","Istirahat / Rehat","亻 (Orang)","木 (Pohon)","Seseorang bersandar di pohon yang rindang untuk melepas lelah setelah seharian bekerja.",1\r\n' +
    '"明","míng","Terang / Jelas","日 (Matahari)","月 (Bulan)","Matahari di siang hari dan bulan di malam hari, bersatu memancarkan terang semesta.",1\r\n' +
    '"好","hǎo","Baik / Bagus","女 (Wanita / Ibu)","子 (Anak)","Seorang ibu yang menggendong buah hatinya dengan penuh kasih melambangkan kebaikan sempurna.",1\r\n';
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template_import_anatomi.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function filterAnatTable() {
  const query = document.getElementById('anatSearch').value.toLowerCase();
  const lvl = document.getElementById('anatLevelFilter').value;
  const rows = document.querySelectorAll('#anatTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowLvl = r.getAttribute('data-level');
    const matchesSearch = text.includes(query);
    const matchesLvl = (lvl === 'all' || rowLvl === lvl);
    if (matchesSearch && matchesLvl) {
      r.removeAttribute('data-filter-hidden');
    } else {
      r.setAttribute('data-filter-hidden', 'true');
    }
  });
  if (typeof updateTablePagination === 'function') {
    updateTablePagination('anatTable', 1);
  }
}

// --- LEADERBOARD SCRIPTS ---
function openAddLbModal() {
  document.getElementById('lbModalTitle').textContent = '🏆 Tambah Peringkat Siswa Baru';
  document.getElementById('lbFormAction').value = 'add_leaderboard';
  document.getElementById('lbFormId').value = '';
  document.getElementById('formLbRank').value = '1';
  document.getElementById('formLbMedal').value = '🥇';
  document.getElementById('formLbName').value = '';
  document.getElementById('formLbExp').value = '100';
  document.getElementById('formLbHsk').value = 'HSK 1';
  document.getElementById('formLbAvatar').value = '🦁';
  document.getElementById('formLbIsUser').checked = false;
  document.getElementById('formLbSubmit').textContent = 'Simpan Peringkat';
  document.getElementById('lbModal').style.display = 'flex';
}

function openEditLbModal(item) {
  document.getElementById('lbModalTitle').textContent = '✏️ Edit Peringkat #' + item.rank + ' - ' + item.name;
  document.getElementById('lbFormAction').value = 'edit_leaderboard';
  document.getElementById('lbFormId').value = item.id;
  document.getElementById('formLbRank').value = item.rank;
  document.getElementById('formLbMedal').value = item.medal;
  document.getElementById('formLbName').value = item.name;
  document.getElementById('formLbExp').value = item.exp;
  document.getElementById('formLbHsk').value = item.hsk;
  document.getElementById('formLbAvatar').value = item.avatar;
  document.getElementById('formLbIsUser').checked = !!item.isUser;
  document.getElementById('formLbSubmit').textContent = 'Simpan Perubahan';
  document.getElementById('lbModal').style.display = 'flex';
}

function closeLbModal() {
  document.getElementById('lbModal').style.display = 'none';
}

function filterLbTable() {
  const query = document.getElementById('lbSearch').value.toLowerCase();
  const hsk = document.getElementById('lbHskFilter').value;
  const rows = document.querySelectorAll('#lbTable tbody tr');

  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const rowHsk = r.getAttribute('data-hsk') || '';
    const matchesSearch = text.includes(query);
    const matchesHsk = (hsk === 'all' || rowHsk === hsk);
    if (matchesSearch && matchesHsk) {
      r.removeAttribute('data-filter-hidden');
    } else {
      r.setAttribute('data-filter-hidden', 'true');
    }
  });
  if (typeof updateTablePagination === 'function') {
    updateTablePagination('lbTable', 1);
  }
}

// Inisialisasi Pagination Tabel saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('anatTable', 10);
    setupTablePagination('lbTable', 10);
  }
});
</script>

<?php include 'includes/footer.php'; ?>
