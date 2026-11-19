@extends('layouts.admin')

@section('content')
<?php
require_once base_path('config/database.php');
$service = new \App\Services\GameFeaturesService();

// Handle Add/Delete Users
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'add') {
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        if ($service->isDbConnected()) {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$_POST['name'], $_POST['email'], $password, $_POST['role']]);
        }
        $service->saveUserProgress([
            'name' => $_POST['name'],
            'email' => $_POST['email'],
            'role' => $_POST['role'],
            'level' => 1,
            'exp' => 0,
            'points' => 0,
            'streak' => 1,
        ]);
    } elseif ($_POST['action'] == 'delete') {
        // Prevent deleting oneself
        if ($_POST['id'] != ($_SESSION['admin_id'] ?? 1)) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$_POST['id']]);
        }
    }
    header("Location: users.php");
    exit();
}

$users = $service->getAllUsersWithStats();
$quizHistories = $service->getQuizHistories();

// Export CSV / Excel Handler
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }
    if (!headers_sent()) {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="laporan_nilai_siswa_mandarinku_' . date('Y-m-d') . '.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');
    }

    $out = fopen('php://output', 'w');
    // UTF-8 BOM for clean Excel compatibility
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, [
        'ID',
        'Nama Lengkap',
        'Email',
        'Role',
        'Level HSK',
        'Total EXP',
        'Total Poin',
        'Streak (Hari)',
        'Jam Belajar',
        'Modul Selesai',
        'Jumlah Kuis',
        'Rata-rata Nilai Kuis (%)',
        'Predikat',
        'Tanggal Terdaftar'
    ]);

    foreach ($users as $usr) {
        $avg = (float)($usr['avg_score'] ?? 0);
        $qCount = (int)($usr['quiz_count'] ?? 0);
        $pred = $qCount === 0 ? '-' : ($avg >= 90 ? 'A+' : ($avg >= 80 ? 'A' : ($avg >= 70 ? 'B' : ($avg >= 60 ? 'C' : 'D'))));
        fputcsv($out, [
            $usr['id'] ?? '',
            $usr['name'] ?? '',
            $usr['email'] ?? '',
            strtoupper($usr['role'] ?? 'student'),
            'HSK ' . min(6, max(1, (int)($usr['level'] ?? 1))),
            (int)($usr['exp'] ?? 0),
            (int)($usr['points'] ?? 0),
            (int)($usr['streak'] ?? 1),
            (int)($usr['study_hours'] ?? 0),
            (int)($usr['completed_modules'] ?? 0),
            $qCount,
            $avg,
            $pred,
            !empty($usr['created_at']) ? date('d M Y', strtotime($usr['created_at'])) : '-'
        ]);
    }
    fclose($out);
    exit();
}

$totalQuizzesTaken = count($quizHistories);
$overallAvgScore = $totalQuizzesTaken > 0
    ? round(array_sum(array_map(fn($q) => (int)($q['score_percent'] ?? 0), $quizHistories)) / $totalQuizzesTaken, 1)
    : 0;
?>

<style>
  .print-report-header {
    display: none;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
  }
  @media print {
    .admin-sidebar,
    .no-print,
    .pagination-container,
    #addForm {
      display: none !important;
    }
    .admin-layout {
      display: block !important;
      background: #ffffff !important;
    }
    .admin-main {
      padding: 0 !important;
      margin: 0 !important;
      background: #ffffff !important;
      overflow: visible !important;
    }
    .admin-card {
      box-shadow: none !important;
      border: 1px solid #cbd5e1 !important;
      page-break-inside: avoid;
      margin-bottom: 18px !important;
      padding: 16px !important;
    }
    .print-report-header {
      display: block !important;
    }
    .col-aksi {
      display: none !important;
    }
    .table-admin tr {
      display: table-row !important;
    }
  }
</style>

<div class="print-report-header">
  <h1 style="margin: 0; font-size: 1.5rem; color: #1e293b;">🌸 Laporan Akademik &amp; Transkrip Nilai Siswa Mandarinku</h1>
  <p style="margin: 4px 0 0; font-size: 0.88rem; color: #64748b;">
    Dicetak pada: <?= date('d M Y H:i') ?> • Total Pengguna: <?= count($users) ?> • Total Kuis Selesai: <?= $totalQuizzesTaken ?> • Rata-rata Nilai: <?= $overallAvgScore ?>%
  </p>
</div>

<div class="admin-card">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
    <div>
      <h2 style="margin: 0; color: var(--dark-text);">Kelola Pengguna &amp; Laporan Progres Siswa</h2>
      <p style="margin: 4px 0 0; font-size: 0.85rem; color: var(--text-muted);">
        Pantau XP, streak harian, performa nilai kuis, serta ekspor laporan ke CSV/Excel atau cetak transkrip PDF.
      </p>
    </div>
    <div class="no-print" style="display: flex; gap: 10px; flex-wrap: wrap;">
      <a href="users.php?export=csv" style="background: #059669; color: white; text-decoration: none; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.86rem; display: inline-flex; align-items: center; gap: 6px;">
        <span>📥</span> Ekspor CSV / Excel
      </a>
      <button type="button" onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.86rem; display: inline-flex; align-items: center; gap: 6px;">
        <span>🖨️</span> Cetak Laporan Nilai (PDF)
      </button>
      <button type="button" onclick="document.getElementById('addForm').style.display='block'" style="background: var(--primary-pink); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.86rem;">
        + Tambah Pengguna
      </button>
    </div>
  </div>

  <!-- Ringkasan Statistik Cepat -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
    <div style="background: #fff0f3; border: 1px solid #fecdd3; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.78rem; color: #9f1239; font-weight: 700;">Total Pengguna</div>
      <div style="font-size: 1.5rem; font-weight: 900; color: #be123c;"><?= count($users) ?> Akun</div>
    </div>
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.78rem; color: #065f46; font-weight: 700;">Total Kuis Diselesaikan</div>
      <div style="font-size: 1.5rem; font-weight: 900; color: #059669;"><?= $totalQuizzesTaken ?> Kuis</div>
    </div>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px;">
      <div style="font-size: 0.78rem; color: #1e40af; font-weight: 700;">Rata-rata Nilai Seluruh Siswa</div>
      <div style="font-size: 1.5rem; font-weight: 900; color: #2563eb;"><?= $overallAvgScore ?>%</div>
    </div>
  </div>

  <div id="addForm" class="no-print" style="display:none; background: #fff0f3; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #ffccd5;">
    <h3 style="margin-top:0; color: #c9184a;">Tambah Pengguna Baru</h3>
    <form method="POST">
      <input type="hidden" name="action" value="add">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <input type="text" name="name" placeholder="Nama Lengkap" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
        <input type="email" name="email" placeholder="Alamat Email" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <input type="password" name="password" placeholder="Password" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
        <select name="role" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="student">Siswa (Student)</option>
            <option value="teacher">Guru (Teacher)</option>
            <option value="admin">Administrator</option>
        </select>
      </div>
      <button type="submit" style="background: #2ec4b6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">Simpan</button>
      <button type="button" onclick="document.getElementById('addForm').style.display='none'" style="background: #ccc; color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-left: 10px;">Batal</button>
    </form>
  </div>

  <div style="overflow-x: auto;">
    <table class="table-admin" id="usersTable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama &amp; Email</th>
          <th>Role</th>
          <th>Level &amp; EXP</th>
          <th>Poin &amp; Streak</th>
          <th>Performa Kuis</th>
          <th>Terdaftar</th>
          <th class="col-aksi">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach($users as $usr):
          $qCount = (int)($usr['quiz_count'] ?? 0);
          $avg = (float)($usr['avg_score'] ?? 0);
          $pred = $qCount === 0 ? '-' : ($avg >= 90 ? 'A+' : ($avg >= 80 ? 'A' : ($avg >= 70 ? 'B' : ($avg >= 60 ? 'C' : 'D'))));
          $scoreColor = $avg >= 80 ? '#059669' : ($avg >= 60 ? '#d97706' : '#dc2626');
        ?>
          <tr>
            <td><?= (int)($usr['id'] ?? 0) ?></td>
            <td>
              <div style="font-weight: 800; color: var(--dark-text);"><?= htmlspecialchars($usr['name'] ?? '') ?></div>
              <div style="font-size: 0.78rem; color: var(--text-muted);"><?= htmlspecialchars($usr['email'] ?? '') ?></div>
            </td>
            <td>
              <span style="background: <?= ($usr['role'] ?? 'student') == 'admin' ? '#fee2e2' : '#dbeafe' ?>; color: <?= ($usr['role'] ?? 'student') == 'admin' ? '#ef4444' : '#1d4ed8' ?>; padding: 4px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">
                <?= htmlspecialchars($usr['role'] ?? 'student') ?>
              </span>
            </td>
            <td>
              <div style="font-weight: 800; color: var(--primary-pink);">Lv. <?= (int)($usr['level'] ?? 1) ?></div>
              <div style="font-size: 0.78rem; color: var(--text-muted);"><?= number_format((int)($usr['exp'] ?? 0)) ?> / <?= number_format((int)($usr['max_exp'] ?? 500)) ?> EXP</div>
            </td>
            <td>
              <div style="font-weight: 700;">⭐ <?= number_format((int)($usr['points'] ?? 0)) ?> Pts</div>
              <div style="font-size: 0.78rem; color: #ea580c; font-weight: 700;">🔥 <?= (int)($usr['streak'] ?? 1) ?> hari</div>
            </td>
            <td>
              <?php if ($qCount > 0): ?>
                <div style="font-weight: 800; color: <?= $scoreColor ?>;">Rata-rata <?= $avg ?>% (<?= $pred ?>)</div>
                <div style="font-size: 0.76rem; color: var(--text-muted);"><?= $qCount ?> kuis selesai</div>
              <?php else: ?>
                <span style="color: var(--text-muted); font-size: 0.8rem;">Belum ada kuis</span>
              <?php endif; ?>
            </td>
            <td><?= !empty($usr['created_at']) ? date('d M Y', strtotime($usr['created_at'])) : '-' ?></td>
            <td class="col-aksi">
              <?php if(($usr['id'] ?? 0) != ($_SESSION['admin_id'] ?? 1)): ?>
              <form method="POST" style="display:inline;" onsubmit="return confirm('Yakin ingin menghapus pengguna ini?');">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= (int)($usr['id'] ?? 0) ?>">
                <button type="submit" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Hapus</button>
              </form>
              <?php else: ?>
                <span style="color: #999; font-size: 0.85rem;">(Anda)</span>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Kartu Baru: Riwayat & Transkrip Nilai Kuis Siswa -->
<div class="admin-card">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px;">
    <div>
      <h2 style="margin: 0; color: var(--dark-text);">📊 Riwayat &amp; Transkrip Nilai Kuis Siswa</h2>
      <p style="margin: 4px 0 0; font-size: 0.85rem; color: var(--text-muted);">
        Catatan hasil kuis yang tersinkron secara real-time dari portal belajar siswa.
      </p>
    </div>
    <input type="text" id="quizHistorySearch" class="no-print" onkeyup="filterQuizHistoryTable()" placeholder="🔍 Cari nama siswa, email, atau HSK..." style="padding: 9px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.86rem; width: 290px;">
  </div>

  <div style="overflow-x: auto;">
    <table class="table-admin" id="quizHistoryAdminTable">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Siswa</th>
          <th>Email</th>
          <th>Level HSK</th>
          <th>Keterampilan</th>
          <th>Mode</th>
          <th>Benar / Total</th>
          <th>Nilai (%)</th>
          <th>Predikat</th>
          <th>EXP / Poin</th>
          <th>Waktu Selesai</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($quizHistories)): ?>
          <tr>
            <td colspan="11" style="text-align: center; color: var(--text-muted); padding: 24px;">Belum ada riwayat kuis tercatat.</td>
          </tr>
        <?php else: ?>
          <?php foreach ($quizHistories as $idx => $qh):
            $pct = (int)($qh['score_percent'] ?? 0);
            $bg = $pct >= 80 ? '#ecfdf5' : ($pct >= 60 ? '#fef9c3' : '#fef2f2');
            $col = $pct >= 80 ? '#059669' : ($pct >= 60 ? '#ca8a04' : '#dc2626');
          ?>
            <tr>
              <td><?= $idx + 1 ?></td>
              <td style="font-weight: 800; color: var(--dark-text);"><?= htmlspecialchars($qh['user_name']) ?></td>
              <td style="font-size: 0.8rem; color: var(--text-muted);"><?= htmlspecialchars($qh['user_email']) ?></td>
              <td><span style="background: #fff0f3; color: var(--primary-pink); padding: 3px 9px; border-radius: 99px; font-weight: 800; font-size: 0.76rem;"><?= htmlspecialchars($qh['hsk_level']) ?></span></td>
              <td style="text-transform: uppercase; font-size: 0.78rem; font-weight: 700;"><?= htmlspecialchars($qh['skill_type']) ?></td>
              <td style="font-size: 0.8rem;"><?= htmlspecialchars(ucfirst($qh['quiz_mode'])) ?></td>
              <td style="font-weight: 700;"><?= (int)$qh['correct_answers'] ?> / <?= (int)$qh['total_questions'] ?></td>
              <td style="font-weight: 900; color: <?= $col ?>;"><?= $pct ?>%</td>
              <td><span style="background: <?= $bg ?>; color: <?= $col ?>; padding: 3px 10px; border-radius: 99px; font-weight: 800; font-size: 0.78rem;"><?= htmlspecialchars($qh['grade']) ?></span></td>
              <td style="font-size: 0.8rem; font-weight: 700; color: var(--primary-pink);">+<?= (int)$qh['exp_earned'] ?> EXP • +<?= (int)$qh['points_earned'] ?> Pts</td>
              <td style="font-size: 0.8rem; color: var(--text-muted);"><?= date('d M Y H:i', strtotime($qh['created_at'])) ?></td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<script>
function filterQuizHistoryTable() {
  const input = document.getElementById('quizHistorySearch');
  const filter = (input ? input.value : '').toLowerCase();
  const table = document.getElementById('quizHistoryAdminTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(tr => {
    const txt = tr.textContent.toLowerCase();
    tr.setAttribute('data-filter-hidden', txt.includes(filter) ? 'false' : 'true');
  });

  if (typeof updateTablePagination === 'function') {
    updateTablePagination('quizHistoryAdminTable', 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('usersTable', 10);
    setupTablePagination('quizHistoryAdminTable', 10);
  }
});
</script>

@endsection
