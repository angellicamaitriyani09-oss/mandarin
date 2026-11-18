@extends('layouts.admin')

@section('content')
<?php
require_once base_path('config/database.php');
// Auto-create table if not exists
$pdo->exec("CREATE TABLE IF NOT EXISTS flashcards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level INT DEFAULT 1,
    hanzi VARCHAR(50) NOT NULL,
    pinyin VARCHAR(100) NOT NULL,
    meaning TEXT NOT NULL,
    meaning_en TEXT,
    example TEXT,
    example_trans TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Seed basic flashcards if table empty
$fcCount = $pdo->query("SELECT COUNT(*) FROM flashcards")->fetchColumn();
if ($fcCount == 0) {
    $seedCards = [
        [1, '你好', 'nǐ hǎo', 'Halo / Apa kabar', 'Hello / How are you', '你好！很高兴认识你。', 'Halo! Senang berkenalan denganmu.'],
        [1, '谢谢', 'xièxie', 'Terima kasih', 'Thank you', '谢谢你的热情帮助！', 'Terima kasih atas bantuan ramahmu!'],
        [1, '再见', 'zài jiàn', 'Sampai jumpa', 'Goodbye', '明天见，再见！', 'Sampai jumpa besok!'],
        [1, '吃', 'chī', 'Makan', 'To eat', '你吃中国菜了吗？', 'Apakah kamu sudah makan masakan Tiongkok?'],
        [1, '喝', 'hē', 'Minum', 'To drink', '我想喝一杯绿茶。', 'Saya ingin minum secangkir teh hijau.'],
        [2, '准备', 'zhǔnbèi', 'Mempersiapkan / Bersiap', 'To prepare', '我已经准备好考试了。', 'Saya sudah bersiap-siap untuk ujian.']
    ];
    $stmt = $pdo->prepare("INSERT INTO flashcards (level, hanzi, pinyin, meaning, meaning_en, example, example_trans) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($seedCards as $c) {
        $stmt->execute($c);
    }
}

// Handle Add / Edit / Delete
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'add') {
        $stmt = $pdo->prepare("INSERT INTO flashcards (level, hanzi, pinyin, meaning, meaning_en, example, example_trans) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['level'] ?? 1,
            $_POST['hanzi'],
            $_POST['pinyin'],
            $_POST['meaning'],
            $_POST['meaning_en'] ?? '',
            $_POST['example'] ?? '',
            $_POST['example_trans'] ?? ''
        ]);
        header("Location: flashcards.php?status=added");
        exit();
    } elseif ($_POST['action'] == 'edit') {
        $stmt = $pdo->prepare("UPDATE flashcards SET level = ?, hanzi = ?, pinyin = ?, meaning = ?, meaning_en = ?, example = ?, example_trans = ? WHERE id = ?");
        $stmt->execute([
            $_POST['level'] ?? 1,
            $_POST['hanzi'],
            $_POST['pinyin'],
            $_POST['meaning'],
            $_POST['meaning_en'] ?? '',
            $_POST['example'] ?? '',
            $_POST['example_trans'] ?? '',
            $_POST['id']
        ]);
        header("Location: flashcards.php?status=updated");
        exit();
    } elseif ($_POST['action'] == 'delete') {
        $stmt = $pdo->prepare("DELETE FROM flashcards WHERE id = ?");
        $stmt->execute([$_POST['id']]);
        header("Location: flashcards.php?status=deleted");
        exit();
    }
}

// Filter level if requested
$filterLevel = isset($_GET['level']) ? intval($_GET['level']) : 0;
if ($filterLevel > 0) {
    $stmt = $pdo->prepare("SELECT * FROM flashcards WHERE level = ? ORDER BY id DESC");
    $stmt->execute([$filterLevel]);
    $cards = $stmt->fetchAll();
} else {
    $cards = $pdo->query("SELECT * FROM flashcards ORDER BY level ASC, id DESC")->fetchAll();
}
?>

<?php if (isset($_GET['status'])): ?>
  <div style="padding: 12px 18px; margin-bottom: 20px; border-radius: 8px; font-weight: 600; <?php 
    if ($_GET['status'] == 'added') echo 'background: #dcfce7; color: #166534; border: 1px solid #86efac;';
    elseif ($_GET['status'] == 'updated') echo 'background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;';
    elseif ($_GET['status'] == 'deleted') echo 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
  ?>">
    <?php 
      if ($_GET['status'] == 'added') echo '✅ Kartu flashcard baru berhasil ditambahkan!';
      elseif ($_GET['status'] == 'updated') echo '✏️ Kartu flashcard berhasil diperbarui!';
      elseif ($_GET['status'] == 'deleted') echo '🗑️ Kartu flashcard berhasil dihapus!';
    ?>
  </div>
<?php endif; ?>

<div class="admin-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
    <div>
      <h2 style="margin: 0; color: var(--dark-text);">🃏 Kelola Flashcard Kosakata (HSK 1 - 6)</h2>
      <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.85rem;">Kelola dan edit setiap kartu hafalan kata Hanzi, Pinyin, arti, serta contoh kalimat.</p>
    </div>
    <button onclick="openAddFlashcardModal()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
      <span>➕</span> Buat Flashcard Baru
    </button>
  </div>

  <!-- Level Filter Chips & Search -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <a href="flashcards.php" style="padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; text-decoration: none; <?= $filterLevel == 0 ? 'background: #f59e0b; color: white;' : 'background: #f1f5f9; color: #475569;' ?>">
        Semua Level
      </a>
      <?php for ($l = 1; $l <= 6; $l++): ?>
        <a href="flashcards.php?level=<?= $l ?>" style="padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; text-decoration: none; <?= $filterLevel == $l ? 'background: #f59e0b; color: white;' : 'background: #f1f5f9; color: #475569;' ?>">
          HSK <?= $l ?>
        </a>
      <?php endfor; ?>
    </div>
    <input type="text" id="fcSearchInput" onkeyup="filterFlashcardsTable()" placeholder="🔍 Cari Hanzi, Pinyin, atau Arti..." style="padding: 8px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; width: 260px;">
  </div>

  <!-- Add / Edit Modal Overlay -->
  <div id="flashcardModal" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
    <div style="background: #ffffff; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
        <h3 id="fcModalTitle" style="margin: 0; color: var(--dark-text); font-size: 1.25rem;">🃏 Tambah Flashcard Baru</h3>
        <button type="button" onclick="closeFlashcardModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">✕</button>
      </div>

      <form method="POST" id="flashcardForm">
        <input type="hidden" name="action" id="fcFormAction" value="add">
        <input type="hidden" name="id" id="fcId" value="">

        <div style="margin-bottom: 15px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Tingkat Level HSK:</label>
          <select name="level" id="fcFormLevel" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="1">🌱 HSK 1</option>
            <option value="2">🌿 HSK 2</option>
            <option value="3">🌳 HSK 3</option>
            <option value="4">🍁 HSK 4</option>
            <option value="5">🌸 HSK 5</option>
            <option value="6">👑 HSK 6</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Karakter Hanzi:</label>
            <input type="text" name="hanzi" id="fcFormHanzi" required placeholder="Contoh: 学习" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 1.2rem;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Pinyin Bernada:</label>
            <input type="text" name="pinyin" id="fcFormPinyin" required placeholder="Contoh: xuéxí" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Arti Bahasa Indonesia:</label>
            <input type="text" name="meaning" id="fcFormMeaning" required placeholder="Contoh: Belajar / Mempelajari" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Arti Bahasa Inggris (Opsional):</label>
            <input type="text" name="meaning_en" id="fcFormMeaningEn" placeholder="Contoh: Study / Learn" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Contoh Kalimat Mandarin:</label>
          <input type="text" name="example" id="fcFormExample" placeholder="Contoh: 我每天努力学习汉语。" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Terjemahan Contoh Kalimat:</label>
          <input type="text" name="example_trans" id="fcFormExampleTrans" placeholder="Contoh: Saya setiap hari giat belajar bahasa Mandarin." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" onclick="closeFlashcardModal()" style="background: #e2e8f0; color: #475569; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: 600;">Batal</button>
          <button type="submit" id="fcSubmitBtn" style="background: #f59e0b; color: white; border: none; padding: 10px 22px; border-radius: 6px; cursor: pointer; font-weight: bold;">Simpan Flashcard</button>
        </div>
      </form>
    </div>
  </div>

  <table class="table-admin" id="flashcardsTable">
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th style="width: 90px;">Level</th>
        <th style="width: 120px;">Hanzi</th>
        <th style="width: 120px;">Pinyin</th>
        <th>Arti</th>
        <th>Contoh Kalimat</th>
        <th style="width: 140px; text-align: center;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <?php if (empty($cards)): ?>
        <tr id="fcNoDataRow"><td colspan="7" style="text-align:center; padding: 25px; color: #94a3b8;">Belum ada kartu flashcard.</td></tr>
      <?php endif; ?>
      <?php foreach ($cards as $c): ?>
        <tr>
          <td><strong style="color: #64748b;">#<?= $c['id'] ?></strong></td>
          <td>
            <span style="background: #fffbeb; color: #b45309; padding: 3px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 800; border: 1px solid #fde68a;">
              HSK <?= $c['level'] ?>
            </span>
          </td>
          <td><strong style="font-size: 1.3rem; color: var(--dark-text); font-family: var(--font-chinese, serif);"><?= htmlspecialchars($c['hanzi']) ?></strong></td>
          <td style="color: var(--primary-pink); font-weight: 700;"><?= htmlspecialchars($c['pinyin']) ?></td>
          <td style="font-weight: 600; color: #334155;">
            <div><?= htmlspecialchars($c['meaning']) ?></div>
            <?php if (!empty($c['meaning_en'])): ?>
              <small style="color: #64748b; font-weight: normal;">(<?= htmlspecialchars($c['meaning_en']) ?>)</small>
            <?php endif; ?>
          </td>
          <td style="font-size: 0.85rem; color: #475569;">
            <div style="font-family: var(--font-chinese, serif);"><?= htmlspecialchars($c['example'] ?? '') ?></div>
            <div style="color: #64748b; font-size: 0.78rem;"><?= htmlspecialchars($c['example_trans'] ?? '') ?></div>
          </td>
          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 6px;">
              <button type="button" 
                      onclick='openEditFlashcardModal(<?= json_encode($c, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)'
                      style="background: #eff6ff; color: #1d4ed8; border: 1px solid #93c5fd; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                ✏️ Edit
              </button>
              <form method="POST" style="display:inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus flashcard ini?');">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= $c['id'] ?>">
                <button type="submit" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
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

<script>
function openAddFlashcardModal() {
  document.getElementById('fcModalTitle').textContent = '🃏 Tambah Flashcard Baru';
  document.getElementById('fcFormAction').value = 'add';
  document.getElementById('fcId').value = '';
  document.getElementById('fcFormLevel').value = '<?= $filterLevel > 0 ? $filterLevel : 1 ?>';
  document.getElementById('fcFormHanzi').value = '';
  document.getElementById('fcFormPinyin').value = '';
  document.getElementById('fcFormMeaning').value = '';
  document.getElementById('fcFormMeaningEn').value = '';
  document.getElementById('fcFormExample').value = '';
  document.getElementById('fcFormExampleTrans').value = '';
  document.getElementById('fcSubmitBtn').textContent = '💾 Simpan Flashcard';
  document.getElementById('fcSubmitBtn').style.background = '#f59e0b';
  
  document.getElementById('flashcardModal').style.display = 'flex';
}

function openEditFlashcardModal(data) {
  document.getElementById('fcModalTitle').textContent = '✏️ Edit Flashcard: ' + data.hanzi + ' (HSK ' + data.level + ')';
  document.getElementById('fcFormAction').value = 'edit';
  document.getElementById('fcId').value = data.id;
  document.getElementById('fcFormLevel').value = data.level || 1;
  document.getElementById('fcFormHanzi').value = data.hanzi || '';
  document.getElementById('fcFormPinyin').value = data.pinyin || '';
  document.getElementById('fcFormMeaning').value = data.meaning || '';
  document.getElementById('fcFormMeaningEn').value = data.meaning_en || '';
  document.getElementById('fcFormExample').value = data.example || '';
  document.getElementById('fcFormExampleTrans').value = data.example_trans || '';
  document.getElementById('fcSubmitBtn').textContent = '💾 Simpan Perubahan';
  document.getElementById('fcSubmitBtn').style.background = '#2563eb';
  
  document.getElementById('flashcardModal').style.display = 'flex';
}

function closeFlashcardModal() {
  document.getElementById('flashcardModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('flashcardModal');
  if (event.target === modal) {
    closeFlashcardModal();
  }
};

function filterFlashcardsTable() {
  const query = document.getElementById('fcSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#flashcardsTable tbody tr');
  rows.forEach(row => {
    if (row.id === 'fcNoDataRow') return;
    const text = row.textContent.toLowerCase();
    if (text.includes(query)) {
      row.removeAttribute('data-filter-hidden');
    } else {
      row.setAttribute('data-filter-hidden', 'true');
    }
  });
  if (typeof updateTablePagination === 'function') {
    updateTablePagination('flashcardsTable', 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('flashcardsTable', 10);
  }
});
</script>



@endsection
