@extends('layouts.admin')

@section('content')
<?php
require_once base_path('config/database.php');
// Handle Add / Edit / Delete
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'add') {
        $stmt = $pdo->prepare("INSERT INTO modules (title, category, hsk_level, description) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_POST['title'], $_POST['category'], $_POST['hsk_level'], $_POST['description']]);
        header("Location: modules.php?status=added");
        exit();
    } elseif ($_POST['action'] == 'edit') {
        $stmt = $pdo->prepare("UPDATE modules SET title = ?, category = ?, hsk_level = ?, description = ? WHERE id = ?");
        $stmt->execute([$_POST['title'], $_POST['category'], $_POST['hsk_level'], $_POST['description'], $_POST['id']]);
        header("Location: modules.php?status=updated");
        exit();
    } elseif ($_POST['action'] == 'delete') {
        $stmt = $pdo->prepare("DELETE FROM modules WHERE id = ?");
        $stmt->execute([$_POST['id']]);
        header("Location: modules.php?status=deleted");
        exit();
    }
}

$modules = $pdo->query("SELECT * FROM modules ORDER BY created_at DESC")->fetchAll();
?>

<div class="admin-card">
  <!-- Notifikasi Status Aksi -->
  <?php if(isset($_GET['status'])): ?>
    <?php if($_GET['status'] == 'added'): ?>
      <div style="background: #ecfdf5; color: #065f46; border: 1.5px solid #a7f3d0; padding: 12px 18px; border-radius: 10px; margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span>✅</span> Modul ajar baru berhasil ditambahkan!
      </div>
    <?php elseif($_GET['status'] == 'updated'): ?>
      <div style="background: #e0f2fe; color: #0369a1; border: 1.5px solid #bae6fd; padding: 12px 18px; border-radius: 10px; margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span>✨</span> Perubahan data modul berhasil disimpan!
      </div>
    <?php elseif($_GET['status'] == 'deleted'): ?>
      <div style="background: #fef2f2; color: #b91c1c; border: 1.5px solid #fecaca; padding: 12px 18px; border-radius: 10px; margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span>🗑️</span> Modul ajar telah berhasil dihapus.
      </div>
    <?php endif; ?>
  <?php endif; ?>

  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
    <div>
      <h2 style="margin: 0; color: var(--dark-text); font-size: 1.5rem;">Daftar Modul Ajar</h2>
      <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Kelola materi pelajaran, kategori keterampilan (Listening, Speaking, Reading, Writing), dan tingkat HSK.</p>
    </div>
    <button onclick="document.getElementById('addForm').style.display='block'; window.scrollTo({top: 0, behavior: 'smooth'});" style="background: var(--primary-pink); color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);">
      <span>➕</span> Tambah Modul Baru
    </button>
  </div>

  <!-- Form Tambah Modul Baru -->
  <div id="addForm" style="display:none; background: #fff0f3; border: 1.5px solid #ffccd5; padding: 22px; border-radius: 12px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <h3 style="margin: 0; color: #c9184a; font-size: 1.15rem;">➕ Formulir Tambah Modul Baru</h3>
      <button type="button" onclick="document.getElementById('addForm').style.display='none'" style="background: none; border: none; font-size: 1.3rem; color: #888; cursor: pointer;">&times;</button>
    </div>
    <form method="POST">
      <input type="hidden" name="action" value="add">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Judul Modul <span style="color:red;">*</span></label>
          <input type="text" name="title" placeholder="cth: Pengenalan Nada Dasar Mandarin" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Kategori Keterampilan <span style="color:red;">*</span></label>
          <select name="category" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background: white;">
            <option value="listening">Listening (Mendengar)</option>
            <option value="speaking">Speaking (Berbicara)</option>
            <option value="reading">Reading (Membaca)</option>
            <option value="writing">Writing (Menulis)</option>
          </select>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 18px;">
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Tingkat HSK <span style="color:red;">*</span></label>
          <select name="hsk_level" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background: white;">
            <option value="HSK 1">HSK 1</option>
            <option value="HSK 2">HSK 2</option>
            <option value="HSK 3">HSK 3</option>
            <option value="HSK 4">HSK 4</option>
            <option value="HSK 5">HSK 5</option>
            <option value="HSK 6">HSK 6</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Deskripsi Singkat</label>
          <input type="text" name="description" placeholder="Penjelasan singkat fokus materi ini..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="submit" style="background: #2ec4b6; color: white; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-weight: bold;">Simpan Modul</button>
        <button type="button" onclick="document.getElementById('addForm').style.display='none'" style="background: #94a3b8; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold;">Batal</button>
      </div>
    </form>
  </div>

  <!-- Toolbar Pencarian & Filter Terstruktur -->
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; background: #f8fafc; padding: 12px 16px; border-radius: 10px; border: 1px solid #e2e8f0;">
    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 260px;">
      <input type="text" id="moduleSearchInput" placeholder="🔍 Cari judul atau materi modul..." oninput="filterModulesTable()" style="flex: 1; padding: 9px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;">
    </div>
    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
      <select id="moduleCatFilter" onchange="filterModulesTable()" style="padding: 9px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: white; font-size: 0.85rem; font-weight: 600; color: #334155;">
        <option value="all">Semua Kategori</option>
        <option value="listening">Listening</option>
        <option value="speaking">Speaking</option>
        <option value="reading">Reading</option>
        <option value="writing">Writing</option>
      </select>
      <select id="moduleHskFilter" onchange="filterModulesTable()" style="padding: 9px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: white; font-size: 0.85rem; font-weight: 600; color: #334155;">
        <option value="all">Semua Level HSK</option>
        <option value="HSK 1">HSK 1</option>
        <option value="HSK 2">HSK 2</option>
        <option value="HSK 3">HSK 3</option>
        <option value="HSK 4">HSK 4</option>
        <option value="HSK 5">HSK 5</option>
        <option value="HSK 6">HSK 6</option>
      </select>
      <button type="button" onclick="document.getElementById('moduleSearchInput').value=''; document.getElementById('moduleCatFilter').value='all'; document.getElementById('moduleHskFilter').value='all'; filterModulesTable();" style="background: #e2e8f0; color: #475569; border: none; padding: 9px 14px; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
        Reset
      </button>
    </div>
  </div>

  <!-- Tabel Modul Terstruktur -->
  <table class="table-admin" id="modulesTable">
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th>Judul Modul</th>
        <th>Kategori</th>
        <th>Level HSK</th>
        <th>Deskripsi</th>
        <th style="width: 140px; text-align: center;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <?php if(empty($modules)): ?>
        <tr><td colspan="6" style="text-align:center; padding: 24px; color: #94a3b8;">Belum ada data modul ajar.</td></tr>
      <?php endif; ?>
      <?php foreach($modules as $mod): ?>
        <tr data-title="<?= htmlspecialchars(strtolower($mod['title'])) ?>" data-category="<?= htmlspecialchars($mod['category']) ?>" data-hsk="<?= htmlspecialchars($mod['hsk_level']) ?>" data-desc="<?= htmlspecialchars(strtolower($mod['description'] ?? '')) ?>">
          <td><strong>#<?= $mod['id'] ?></strong></td>
          <td>
            <div style="font-weight: 700; color: #0f172a;"><?= htmlspecialchars($mod['title']) ?></div>
          </td>
          <td>
            <?php
              $badgeBg = '#e6faf7'; $badgeColor = '#0f766e';
              if ($mod['category'] === 'speaking') { $badgeBg = '#fef3c7'; $badgeColor = '#b45309'; }
              elseif ($mod['category'] === 'reading') { $badgeBg = '#eff6ff'; $badgeColor = '#1d4ed8'; }
              elseif ($mod['category'] === 'writing') { $badgeBg = '#fdf2f8'; $badgeColor = '#be185d'; }
            ?>
            <span style="background: <?= $badgeBg ?>; color: <?= $badgeColor ?>; padding: 4px 10px; border-radius: 99px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase;">
              <?= htmlspecialchars($mod['category']) ?>
            </span>
          </td>
          <td>
            <span style="background: #f1f5f9; color: #334155; padding: 4px 10px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; border: 1px solid #cbd5e1;">
              <?= htmlspecialchars($mod['hsk_level']) ?>
            </span>
          </td>
          <td style="font-size: 0.85rem; color: #64748b; max-width: 260px;">
            <?= htmlspecialchars($mod['description'] ?: '-') ?>
          </td>
          <td style="text-align: center; white-space: nowrap;">
            <button type="button" onclick='openEditModuleModal(<?= json_encode($mod, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)' style="background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 700; margin-right: 4px;">
              ✏️ Edit
            </button>
            <form method="POST" style="display:inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus modul ini?');">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="id" value="<?= $mod['id'] ?>">
              <button type="submit" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">
                🗑️ Hapus
              </button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<!-- Modal Edit Modul -->
<div id="editModuleModal" style="display:none; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
  <div style="background: white; border-radius: 16px; width: 100%; max-width: 540px; padding: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); position: relative;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px;">
      <h3 style="margin: 0; color: #0284c7; font-size: 1.25rem; font-weight: 800;">✏️ Edit Data Modul Ajar</h3>
      <button type="button" onclick="closeEditModuleModal()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">&times;</button>
    </div>

    <form method="POST">
      <input type="hidden" name="action" value="edit">
      <input type="hidden" name="id" id="edit_mod_id">

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Judul Modul <span style="color:red;">*</span></label>
        <input type="text" name="title" id="edit_mod_title" required style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font-size: 0.95rem;">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Kategori Keterampilan <span style="color:red;">*</span></label>
          <select name="category" id="edit_mod_category" required style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background: white;">
            <option value="listening">Listening</option>
            <option value="speaking">Speaking</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Level HSK <span style="color:red;">*</span></label>
          <select name="hsk_level" id="edit_mod_hsk_level" required style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background: white;">
            <option value="HSK 1">HSK 1</option>
            <option value="HSK 2">HSK 2</option>
            <option value="HSK 3">HSK 3</option>
            <option value="HSK 4">HSK 4</option>
            <option value="HSK 5">HSK 5</option>
            <option value="HSK 6">HSK 6</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 5px; color: #334155;">Deskripsi Singkat</label>
        <textarea name="description" id="edit_mod_description" rows="3" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font-size: 0.9rem;"></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" onclick="closeEditModuleModal()" style="background: #94a3b8; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 700;">Batal</button>
        <button type="submit" style="background: #0284c7; color: white; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-weight: 700;">Simpan Perubahan</button>
      </div>
    </form>
  </div>
</div>

<script>
function openEditModuleModal(data) {
  document.getElementById('edit_mod_id').value = data.id || '';
  document.getElementById('edit_mod_title').value = data.title || '';
  document.getElementById('edit_mod_category').value = data.category || 'listening';
  document.getElementById('edit_mod_hsk_level').value = data.hsk_level || 'HSK 1';
  document.getElementById('edit_mod_description').value = data.description || '';
  document.getElementById('editModuleModal').style.display = 'flex';
}

function closeEditModuleModal() {
  document.getElementById('editModuleModal').style.display = 'none';
}

// Tutup modal jika klik di luar box
document.getElementById('editModuleModal').addEventListener('click', function(e) {
  if (e.target === this) closeEditModuleModal();
});

function filterModulesTable() {
  const q = (document.getElementById('moduleSearchInput').value || '').toLowerCase().trim();
  const cat = document.getElementById('moduleCatFilter').value;
  const hsk = document.getElementById('moduleHskFilter').value;
  const rows = document.querySelectorAll('#modulesTable tbody tr');

  rows.forEach(r => {
    // Lewati baris "Belum ada data" jika ada
    if (r.cells.length === 1) return;

    const title = (r.getAttribute('data-title') || '').toLowerCase();
    const desc = (r.getAttribute('data-desc') || '').toLowerCase();
    const rCat = r.getAttribute('data-category') || '';
    const rHsk = r.getAttribute('data-hsk') || '';

    const matchQ = !q || title.includes(q) || desc.includes(q);
    const matchCat = (cat === 'all' || rCat === cat);
    const matchHsk = (hsk === 'all' || rHsk === hsk);

    if (matchQ && matchCat && matchHsk) {
      r.removeAttribute('data-filter-hidden');
    } else {
      r.setAttribute('data-filter-hidden', 'true');
    }
  });

  if (typeof updateTablePagination === 'function') {
    updateTablePagination('modulesTable', 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('modulesTable', 10);
  }
});
</script>



@endsection
