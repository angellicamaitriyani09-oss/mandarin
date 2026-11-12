<?php
require_once '../config/database.php';
include 'includes/header.php';

// Jika admin sudah login, langsung alihkan ke index.php
if (isset($_SESSION['admin_id']) && !empty($_SESSION['admin_role']) && $_SESSION['admin_role'] === 'admin') {
    header("Location: index.php");
    exit();
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = "Email dan password wajib diisi!";
    } elseif (!$pdo) {
        // Fallback login jika MySQL di server lokal belum dinyalakan
        if ($email === 'admin@mandarinku.com' && $password === 'admin123') {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = 1;
            $_SESSION['admin_name'] = 'Administrator';
            $_SESSION['admin_email'] = $email;
            $_SESSION['admin_role'] = 'admin';
            $_SESSION['last_activity'] = time();

            header("Location: index.php");
            exit();
        } else {
            $error = "Koneksi database belum aktif. Gunakan akun default: admin@mandarinku.com / admin123.";
        }
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Hindari Session Fixation dengan regenerasi Session ID
            session_regenerate_id(true);

            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_name'] = $user['name'];
            $_SESSION['admin_email'] = $user['email'];
            $_SESSION['admin_role'] = $user['role'];
            $_SESSION['last_activity'] = time();

            header("Location: index.php");
            exit();
        } else {
            $error = "Email atau password salah, atau akun Anda bukan Admin.";
        }
    }
}
?>
<div style="flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, #fff0f3, #f8f9fa); min-height: 100vh; padding: 20px;">
  <div class="admin-card" style="width: 100%; max-width: 440px; padding: 35px 30px; border-radius: 20px; box-shadow: 0 15px 35px rgba(217, 83, 109, 0.12); border: 1.5px solid #fae2e6;">
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="font-size: 2.8rem; margin-bottom: 8px;">🛡️</div>
      <h2 style="margin: 0; color: #1e3a8a; font-weight: 800; font-size: 1.5rem;">Login Administrator</h2>
      <p style="margin-top: 6px; color: var(--text-muted); font-size: 0.88rem;">Panel Khusus Pengelola Konten & Sistem Mandarinku</p>
    </div>

    <?php if($error): ?>
      <div style="background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-size: 0.88rem; display: flex; align-items: center; gap: 8px;">
        <span>⚠️</span>
        <span><?= htmlspecialchars($error) ?></span>
      </div>
    <?php endif; ?>

    <form method="POST" autocomplete="off">
      <div style="margin-bottom: 18px;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; color: var(--dark-text); margin-bottom: 6px;">Email Admin</label>
        <input type="email" name="email" required placeholder="admin@mandarinku.com" value="<?= htmlspecialchars($_POST['email'] ?? 'admin@mandarinku.com') ?>" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-pink)'" onblur="this.style.borderColor='#e2e8f0'">
      </div>

      <div style="margin-bottom: 22px;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; color: var(--dark-text); margin-bottom: 6px;">Password</label>
        <input type="password" name="password" required placeholder="••••••••" value="admin123" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-pink)'" onblur="this.style.borderColor='#e2e8f0'">
      </div>

      <button type="submit" style="width: 100%; background: linear-gradient(135deg, #ff758c 0%, #ff5e79 100%); color: white; border: none; padding: 13px; border-radius: 10px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 14px rgba(255, 94, 121, 0.35); transition: transform 0.1s, opacity 0.2s;">
        Masuk ke Admin Panel →
      </button>
    </form>

    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #fae2e6; text-align: center;">
      <a href="../index.php" style="color: var(--primary-pink); text-decoration: none; font-size: 0.85rem; font-weight: 700;">
        ← Kembali ke Halaman Utama Siswa
      </a>
    </div>
  </div>
</div>
<?php include 'includes/footer.php'; ?>
