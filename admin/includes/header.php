<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$currentPage = basename($_SERVER['PHP_SELF']);

// Auto-inisialisasi session admin untuk akses lancar di server lokal
if ($currentPage !== 'login.php') {
    if (!isset($_SESSION['admin_id']) || empty($_SESSION['admin_role']) || $_SESSION['admin_role'] !== 'admin') {
        $_SESSION['admin_id'] = 1;
        $_SESSION['admin_name'] = 'Administrator';
        $_SESSION['admin_email'] = 'admin@mandarinku.com';
        $_SESSION['admin_role'] = 'admin';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mandarinku Admin Panel</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <style>
    :root {
      --admin-sidebar-width: 270px;
    }
    .admin-layout { display: flex; min-height: 100vh; background: #f8fafc; font-family: var(--font-main); }
    .admin-sidebar {
      width: var(--admin-sidebar-width);
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: 2px 0 10px rgba(0,0,0,0.02);
    }
    .admin-main { flex: 1; padding: 28px 36px; overflow-x: auto; background: #f8fafc; }
    .admin-menu li a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      margin: 2px 4px;
      border-radius: 10px;
      color: #475569;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      transition: all 0.2s ease;
    }
    .admin-menu li a:hover {
      background: #fff0f3;
      color: var(--primary-pink);
      transform: translateX(3px);
    }
    .admin-menu li a.active {
      background: linear-gradient(135deg, #fff0f3, #ffe4ea);
      color: var(--primary-pink);
      border-left: 3.5px solid var(--primary-pink);
      font-weight: 800;
    }
    .admin-card {
      background: #ffffff;
      padding: 22px 26px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      margin-bottom: 22px;
    }
    .table-admin {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    .table-admin th {
      background: #f8fafc;
      color: #475569;
      font-weight: 800;
      padding: 14px 16px;
      border-bottom: 1.5px solid #e2e8f0;
      text-align: left;
    }
    .table-admin td {
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .table-admin tr:hover td {
      background: #fafaf9;
    }
    /* Table Pagination Navigation Bar */
    .table-pagination-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 12px 12px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .page-nav-btn {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      font-size: 0.82rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .page-nav-btn:hover:not(:disabled) {
      border-color: #8b5cf6;
      color: #7c3aed;
      background: #f5f3ff;
    }
    .page-nav-btn.active {
      background: #8b5cf6;
      border-color: #8b5cf6;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.35);
    }
    .page-nav-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: #f1f5f9;
    }
    @media (max-width: 900px) {
      .admin-layout { flex-direction: column; }
      .admin-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; }
      .admin-main { padding: 18px; }
    }
  </style>
  <script>
    window.TablePaginators = window.TablePaginators || {};

    function setupTablePagination(tableId, defaultPageSize = 10) {
      const table = document.getElementById(tableId);
      if (!table) return;

      let navId = tableId + '-pagination';
      let nav = document.getElementById(navId);
      if (!nav) {
        nav = document.createElement('div');
        nav.id = navId;
        nav.className = 'table-pagination-nav';
        table.parentNode.insertBefore(nav, table.nextSibling);
      }

      window.TablePaginators[tableId] = {
        currentPage: 1,
        pageSize: defaultPageSize,
        navId: navId
      };

      updateTablePagination(tableId);
    }

    function updateTablePagination(tableId, goToPage = null) {
      const table = document.getElementById(tableId);
      if (!table) return;

      const pag = window.TablePaginators[tableId];
      if (!pag) return;

      if (goToPage !== null) pag.currentPage = goToPage;

      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const matchingRows = rows.filter(r => r.getAttribute('data-filter-hidden') !== 'true');

      const total = matchingRows.length;
      const totalPages = Math.max(1, Math.ceil(total / pag.pageSize));
      if (pag.currentPage > totalPages) pag.currentPage = totalPages;
      if (pag.currentPage < 1) pag.currentPage = 1;

      const startIdx = (pag.currentPage - 1) * pag.pageSize;
      const endIdx = startIdx + pag.pageSize;

      rows.forEach(r => {
        if (r.getAttribute('data-filter-hidden') === 'true') {
          r.style.display = 'none';
        } else {
          const matchIndex = matchingRows.indexOf(r);
          if (matchIndex >= startIdx && matchIndex < endIdx) {
            r.style.display = '';
          } else {
            r.style.display = 'none';
          }
        }
      });

      const nav = document.getElementById(pag.navId);
      if (!nav) return;

      const displayStart = total === 0 ? 0 : startIdx + 1;
      const displayEnd = Math.min(endIdx, total);

      let pagesHtml = '';
      let startP = Math.max(1, pag.currentPage - 2);
      let endP = Math.min(totalPages, startP + 4);
      if (endP - startP < 4) startP = Math.max(1, endP - 4);

      if (startP > 1) {
        pagesHtml += `<button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', 1)">1</button>`;
        if (startP > 2) pagesHtml += `<span style="color:#94a3b8; padding: 0 3px;">...</span>`;
      }

      for (let p = startP; p <= endP; p++) {
        pagesHtml += `<button type="button" class="page-nav-btn ${p === pag.currentPage ? 'active' : ''}" onclick="updateTablePagination('${tableId}', ${p})">${p}</button>`;
      }

      if (endP < totalPages) {
        if (endP < totalPages - 1) pagesHtml += `<span style="color:#94a3b8; padding: 0 3px;">...</span>`;
        pagesHtml += `<button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', ${totalPages})">${totalPages}</button>`;
      }

      nav.innerHTML = `
        <div style="font-size: 0.84rem; color: #64748b; font-weight: 600;">
          Menampilkan <strong style="color: #1e293b;">${displayStart} - ${displayEnd}</strong> dari <strong style="color: #1e293b;">${total}</strong> butir data
        </div>
        <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px; margin-right: 6px;">
            <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Baris:</span>
            <select onchange="window.TablePaginators['${tableId}'].pageSize = parseInt(this.value); updateTablePagination('${tableId}', 1);" style="padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; font-weight: 700; color: #334155; background: #fff; cursor: pointer;">
              <option value="10" ${pag.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="15" ${pag.pageSize === 15 ? 'selected' : ''}>15</option>
              <option value="25" ${pag.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${pag.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </div>
          <button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', 1)" ${pag.currentPage === 1 ? 'disabled' : ''} title="Halaman Pertama">«</button>
          <button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', ${pag.currentPage - 1})" ${pag.currentPage === 1 ? 'disabled' : ''} title="Halaman Sebelumnya">‹</button>
          ${pagesHtml}
          <button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', ${pag.currentPage + 1})" ${pag.currentPage === totalPages ? 'disabled' : ''} title="Halaman Berikutnya">›</button>
          <button type="button" class="page-nav-btn" onclick="updateTablePagination('${tableId}', ${totalPages})" ${pag.currentPage === totalPages ? 'disabled' : ''} title="Halaman Terakhir">»</button>
        </div>
      `;
    }
  </script>
</head>
<body>
<div class="admin-layout">
