@extends('layouts.admin')

@section('content')
<?php
require_once base_path('config/database.php');
// Handle Add/Delete Users
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'add') {
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_POST['name'], $_POST['email'], $password, $_POST['role']]);
    } elseif ($_POST['action'] == 'delete') {
        // Prevent deleting oneself
        if ($_POST['id'] != $_SESSION['admin_id']) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$_POST['id']]);
        }
    }
    header("Location: users.php");
    exit();
}

$users = $pdo->query("SELECT * FROM users ORDER BY created_at DESC")->fetchAll();
?>

<div class="admin-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="margin: 0; color: var(--dark-text);">Kelola Pengguna</h2>
    <button onclick="document.getElementById('addForm').style.display='block'" style="background: var(--primary-pink); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">+ Tambah Pengguna</button>
  </div>

  <div id="addForm" style="display:none; background: #fff0f3; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top:0;">Tambah Pengguna Baru</h3>
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

  <table class="table-admin" id="usersTable">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nama</th>
        <th>Email</th>
        <th>Role</th>
        <th>Terdaftar</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach($users as $usr): ?>
        <tr>
          <td><?= $usr['id'] ?></td>
          <td><?= htmlspecialchars($usr['name']) ?></td>
          <td><?= htmlspecialchars($usr['email']) ?></td>
          <td>
            <span style="background: <?= $usr['role']=='admin' ? '#fee2e2' : '#dbeafe' ?>; color: <?= $usr['role']=='admin' ? '#ef4444' : '#1d4ed8' ?>; padding: 4px 8px; border-radius: 99px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">
              <?= $usr['role'] ?>
            </span>
          </td>
          <td><?= date('d M Y', strtotime($usr['created_at'])) ?></td>
          <td>
            <?php if($usr['id'] != $_SESSION['admin_id']): ?>
            <form method="POST" style="display:inline;" onsubmit="return confirm('Yakin ingin menghapus pengguna ini?');">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="id" value="<?= $usr['id'] ?>">
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

<script>
document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('usersTable', 10);
  }
});
</script>



@endsection
