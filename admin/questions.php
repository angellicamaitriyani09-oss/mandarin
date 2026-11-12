<?php
require_once '../config/database.php';
include 'includes/header.php';
include 'includes/sidebar.php';

// Handle Add / Edit / Delete
$msg = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'add') {
        $module_id = !empty($_POST['module_id']) ? $_POST['module_id'] : null;
        $stmt = $pdo->prepare("INSERT INTO questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $module_id,
            $_POST['question_text'],
            $_POST['option_a'],
            $_POST['option_b'],
            $_POST['option_c'],
            $_POST['option_d'],
            $_POST['correct_answer']
        ]);
        header("Location: questions.php?status=added");
        exit();
    } elseif ($_POST['action'] == 'edit') {
        $module_id = !empty($_POST['module_id']) ? $_POST['module_id'] : null;
        $stmt = $pdo->prepare("UPDATE questions SET module_id = ?, question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? WHERE id = ?");
        $stmt->execute([
            $module_id,
            $_POST['question_text'],
            $_POST['option_a'],
            $_POST['option_b'],
            $_POST['option_c'],
            $_POST['option_d'],
            $_POST['correct_answer'],
            $_POST['id']
        ]);
        header("Location: questions.php?status=updated");
        exit();
    } elseif ($_POST['action'] == 'delete') {
        $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->execute([$_POST['id']]);
        header("Location: questions.php?status=deleted");
        exit();
    }
}

// Fetch modules for dropdown
$modules = $pdo->query("SELECT id, title FROM modules ORDER BY title ASC")->fetchAll();

// Fetch questions with module title
$questions = $pdo->query("
    SELECT q.*, m.title AS module_title 
    FROM questions q 
    LEFT JOIN modules m ON q.module_id = m.id 
    ORDER BY q.created_at DESC
")->fetchAll();
?>

<?php if (isset($_GET['status'])): ?>
  <div style="padding: 12px 18px; margin-bottom: 20px; border-radius: 8px; font-weight: 600; <?php 
    if ($_GET['status'] == 'added') echo 'background: #dcfce7; color: #166534; border: 1px solid #86efac;';
    elseif ($_GET['status'] == 'updated') echo 'background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;';
    elseif ($_GET['status'] == 'deleted') echo 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
  ?>">
    <?php 
      if ($_GET['status'] == 'added') echo '✅ Soal baru berhasil ditambahkan!';
      elseif ($_GET['status'] == 'updated') echo '✏️ Data soal berhasil diperbarui!';
      elseif ($_GET['status'] == 'deleted') echo '🗑️ Soal berhasil dihapus!';
    ?>
  </div>
<?php endif; ?>

<div class="admin-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
    <div>
      <h2 style="margin: 0; color: var(--dark-text);">Kelola Bank Soal & Kuis</h2>
      <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.85rem;">Buat, perbarui, atau sesuaikan setiap butir soal dan kunci jawabannya.</p>
    </div>
    <button onclick="openAddQuestionModal()" style="background: var(--primary-pink); color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
      <span>➕</span> Tambah Soal Baru
    </button>
  </div>

  <!-- Search Filter -->
  <div style="margin-bottom: 20px;">
    <input type="text" id="questionSearchInput" onkeyup="filterQuestionsTable()" placeholder="🔍 Cari pertanyaan, opsi, atau modul..." style="width: 100%; max-width: 400px; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">
  </div>

  <!-- Add / Edit Modal Overlay -->
  <div id="questionModal" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
    <div style="background: #ffffff; border-radius: 12px; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
        <h3 id="modalTitle" style="margin: 0; color: var(--dark-text); font-size: 1.25rem;">Tambah Soal Baru</h3>
        <button type="button" onclick="closeQuestionModal()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">✕</button>
      </div>

      <form method="POST" id="questionForm">
        <input type="hidden" name="action" id="formAction" value="add">
        <input type="hidden" name="id" id="questionId" value="">

        <div style="margin-bottom: 15px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Modul Terkait (Opsional):</label>
          <select name="module_id" id="formModuleId" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="">-- Tanpa Modul Khusus (Umum) --</option>
            <?php foreach ($modules as $m): ?>
              <option value="<?= $m['id'] ?>"><?= htmlspecialchars($m['title']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Pertanyaan / Kalimat Soal:</label>
          <textarea name="question_text" id="formQuestionText" required placeholder="Contoh: Apa arti dari perkataan 你好 (Nǐ hǎo)?" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; height: 80px; box-sizing: border-box;"></textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Pilihan A:</label>
            <input type="text" name="option_a" id="formOptionA" required placeholder="Jawaban A" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Pilihan B:</label>
            <input type="text" name="option_b" id="formOptionB" required placeholder="Jawaban B" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Pilihan C:</label>
            <input type="text" name="option_c" id="formOptionC" required placeholder="Jawaban C" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 0.85rem; color: #334155;">Pilihan D:</label>
            <input type="text" name="option_d" id="formOptionD" required placeholder="Jawaban D" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display:block; margin-bottom: 5px; font-weight: 600; font-size: 0.88rem;">Kunci Jawaban yang Benar:</label>
          <select name="correct_answer" id="formCorrectAnswer" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="A">Pilihan A</option>
            <option value="B">Pilihan B</option>
            <option value="C">Pilihan C</option>
            <option value="D">Pilihan D</option>
          </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" onclick="closeQuestionModal()" style="background: #e2e8f0; color: #475569; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: 600;">Batal</button>
          <button type="submit" id="submitBtn" style="background: #2ec4b6; color: white; border: none; padding: 10px 22px; border-radius: 6px; cursor: pointer; font-weight: bold;">Simpan Soal</button>
        </div>
      </form>
    </div>
  </div>

  <table class="table-admin" id="questionsTable">
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th style="width: 140px;">Modul</th>
        <th>Pertanyaan</th>
        <th>Pilihan Jawaban</th>
        <th style="width: 60px;">Kunci</th>
        <th style="width: 140px; text-align: center;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <?php if (empty($questions)): ?>
        <tr id="noDataRow"><td colspan="6" style="text-align:center; padding: 25px; color: #94a3b8;">Belum ada soal di bank soal.</td></tr>
      <?php endif; ?>
      <?php foreach ($questions as $q): ?>
        <tr>
          <td><strong style="color: #64748b;">#<?= $q['id'] ?></strong></td>
          <td>
            <span style="background: #eff6ff; color: #1e40af; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: bold; border: 1px solid #bfdbfe;">
              <?= htmlspecialchars($q['module_title'] ?? 'Umum') ?>
            </span>
          </td>
          <td style="max-width: 250px; font-weight: 600; color: var(--dark-text);"><?= htmlspecialchars($q['question_text']) ?></td>
          <td style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
            <div><strong>A:</strong> <?= htmlspecialchars($q['option_a']) ?></div>
            <div><strong>B:</strong> <?= htmlspecialchars($q['option_b']) ?></div>
            <div><strong>C:</strong> <?= htmlspecialchars($q['option_c']) ?></div>
            <div><strong>D:</strong> <?= htmlspecialchars($q['option_d']) ?></div>
          </td>
          <td>
            <span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 99px; font-weight: 800; font-size: 0.85rem; border: 1px solid #86efac; display: inline-block;">
              <?= htmlspecialchars($q['correct_answer']) ?>
            </span>
          </td>
          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 6px;">
              <button type="button" 
                      onclick='openEditQuestionModal(<?= json_encode($q, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?>)'
                      style="background: #eff6ff; color: #1d4ed8; border: 1px solid #93c5fd; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                ✏️ Edit
              </button>
              <form method="POST" style="display:inline; margin: 0;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus soal ini?');">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= $q['id'] ?>">
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
function openAddQuestionModal() {
  document.getElementById('modalTitle').textContent = '📝 Tambah Soal Baru';
  document.getElementById('formAction').value = 'add';
  document.getElementById('questionId').value = '';
  document.getElementById('formModuleId').value = '';
  document.getElementById('formQuestionText').value = '';
  document.getElementById('formOptionA').value = '';
  document.getElementById('formOptionB').value = '';
  document.getElementById('formOptionC').value = '';
  document.getElementById('formOptionD').value = '';
  document.getElementById('formCorrectAnswer').value = 'A';
  document.getElementById('submitBtn').textContent = '💾 Simpan Soal';
  document.getElementById('submitBtn').style.background = '#2ec4b6';
  
  const modal = document.getElementById('questionModal');
  modal.style.display = 'flex';
}

function openEditQuestionModal(data) {
  document.getElementById('modalTitle').textContent = '✏️ Edit Soal #' + data.id;
  document.getElementById('formAction').value = 'edit';
  document.getElementById('questionId').value = data.id;
  document.getElementById('formModuleId').value = data.module_id || '';
  document.getElementById('formQuestionText').value = data.question_text || '';
  document.getElementById('formOptionA').value = data.option_a || '';
  document.getElementById('formOptionB').value = data.option_b || '';
  document.getElementById('formOptionC').value = data.option_c || '';
  document.getElementById('formOptionD').value = data.option_d || '';
  document.getElementById('formCorrectAnswer').value = data.correct_answer || 'A';
  document.getElementById('submitBtn').textContent = '💾 Simpan Perubahan';
  document.getElementById('submitBtn').style.background = '#2563eb';
  
  const modal = document.getElementById('questionModal');
  modal.style.display = 'flex';
}

function closeQuestionModal() {
  document.getElementById('questionModal').style.display = 'none';
}

// Close when clicking outside of modal box
window.onclick = function(event) {
  const modal = document.getElementById('questionModal');
  if (event.target === modal) {
    closeQuestionModal();
  }
};

function filterQuestionsTable() {
  const query = document.getElementById('questionSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#questionsTable tbody tr');
  rows.forEach(row => {
    if (row.id === 'noDataRow') return;
    const text = row.textContent.toLowerCase();
    if (text.includes(query)) {
      row.removeAttribute('data-filter-hidden');
    } else {
      row.setAttribute('data-filter-hidden', 'true');
    }
  });
  if (typeof updateTablePagination === 'function') {
    updateTablePagination('questionsTable', 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof setupTablePagination === 'function') {
    setupTablePagination('questionsTable', 10);
  }
});
</script>

<?php include 'includes/footer.php'; ?>
