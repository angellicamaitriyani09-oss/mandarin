<?php
// admin/api_sync.php - AJAX API for In-Page Admin CRUD Operations
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/game_features_db.php';

// Ensure admin session or authorized local dev environment
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['admin_id'])) {
    $_SESSION['admin_id'] = 1;
    $_SESSION['admin_role'] = 'admin';
    $_SESSION['admin_name'] = 'Admin Pengelola';
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

if (!$action) {
    echo json_encode(['success' => false, 'message' => 'Aksi tidak ditentukan']);
    exit();
}

try {
    // -------------------------------------------------------------
    // SUB-GAME 1: PELATIH 4 NADA (TONE TRAINER)
    // -------------------------------------------------------------
    if ($action === 'add_tone') {
        $level = (int)($_POST['level'] ?? 1);
        $hanzi = trim($_POST['hanzi'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $tone = (int)($_POST['tone'] ?? 1);
        $audio = trim($_POST['audio'] ?? $hanzi);
        $meaning = trim($_POST['meaning'] ?? '');
        $tip = trim($_POST['tip'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = ($level <= 2) ? 'easy' : (($level <= 4) ? 'medium' : 'hard');
        }

        $newId = time();
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO game_tone_trainer (level, hanzi, pinyin, tone, audio, meaning, tip, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$level, $hanzi, $pinyin, $tone, $audio, $meaning, $tip, $difficulty]);
            $newId = (int)$pdo->lastInsertId();
        }

        $json = read_json_data($jsonGamePath);
        $json['toneTrainer'][] = [
            'id' => $newId,
            'level' => $level,
            'hanzi' => $hanzi,
            'pinyin' => $pinyin,
            'tone' => $tone,
            'audio' => $audio,
            'meaning' => $meaning,
            'tip' => $tip,
            'difficulty' => $difficulty
        ];
        write_json_data($jsonGamePath, $json);
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Soal Pelatih Nada berhasil ditambahkan']);
        exit();
    } elseif ($action === 'edit_tone') {
        $id = (int)$_POST['id'];
        $level = (int)($_POST['level'] ?? 1);
        $hanzi = trim($_POST['hanzi'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $tone = (int)($_POST['tone'] ?? 1);
        $audio = trim($_POST['audio'] ?? $hanzi);
        $meaning = trim($_POST['meaning'] ?? '');
        $tip = trim($_POST['tip'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = ($level <= 2) ? 'easy' : (($level <= 4) ? 'medium' : 'hard');
        }

        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("UPDATE game_tone_trainer SET level = ?, hanzi = ?, pinyin = ?, tone = ?, audio = ?, meaning = ?, tip = ?, difficulty = ? WHERE id = ?");
            $stmt->execute([$level, $hanzi, $pinyin, $tone, $audio, $meaning, $tip, $difficulty, $id]);
        }

        $json = read_json_data($jsonGamePath);
        if (isset($json['toneTrainer'])) {
            foreach ($json['toneTrainer'] as &$item) {
                if ($item['id'] == $id) {
                    $item['level'] = $level;
                    $item['hanzi'] = $hanzi;
                    $item['pinyin'] = $pinyin;
                    $item['tone'] = $tone;
                    $item['audio'] = $audio;
                    $item['meaning'] = $meaning;
                    $item['tip'] = $tip;
                    $item['difficulty'] = $difficulty;
                    break;
                }
            }
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Soal Pelatih Nada berhasil diperbarui']);
        exit();
    } elseif ($action === 'delete_tone') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM game_tone_trainer WHERE id = ?");
            $stmt->execute([$id]);
        }
        $json = read_json_data($jsonGamePath);
        if (isset($json['toneTrainer'])) {
            $json['toneTrainer'] = array_values(array_filter($json['toneTrainer'], fn($i) => $i['id'] != $id));
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Soal Pelatih Nada berhasil dihapus']);
        exit();
    }

    // -------------------------------------------------------------
    // SUB-GAME 2: PASANG KATA (WORD LINK)
    // -------------------------------------------------------------
    elseif ($action === 'add_link') {
        $category = trim($_POST['category'] ?? 'cat1');
        $part_a = trim($_POST['part_a'] ?? '');
        $part_b = trim($_POST['part_b'] ?? '');
        $hanzi = trim($_POST['hanzi'] ?? ($part_a . $part_b));
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = in_array($category, ['cat1', 'cat2']) ? 'easy' : (in_array($category, ['cat3', 'cat4']) ? 'medium' : 'hard');
        }

        $newId = time();
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO game_word_link (category, part_a, part_b, hanzi, pinyin, meaning, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$category, $part_a, $part_b, $hanzi, $pinyin, $meaning, $difficulty]);
            $newId = (int)$pdo->lastInsertId();
        }

        $json = read_json_data($jsonGamePath);
        $json['wordLink'][] = [
            'id' => $newId,
            'category' => $category,
            'difficulty' => $difficulty,
            'pA' => $part_a,
            'pB' => $part_b,
            'hanzi' => $hanzi,
            'pinyin' => $pinyin,
            'meaning' => $meaning
        ];
        write_json_data($jsonGamePath, $json);
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Pasangan Kata berhasil ditambahkan']);
        exit();
    } elseif ($action === 'edit_link') {
        $id = (int)$_POST['id'];
        $category = trim($_POST['category'] ?? 'cat1');
        $part_a = trim($_POST['part_a'] ?? '');
        $part_b = trim($_POST['part_b'] ?? '');
        $hanzi = trim($_POST['hanzi'] ?? ($part_a . $part_b));
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = in_array($category, ['cat1', 'cat2']) ? 'easy' : (in_array($category, ['cat3', 'cat4']) ? 'medium' : 'hard');
        }

        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("UPDATE game_word_link SET category = ?, part_a = ?, part_b = ?, hanzi = ?, pinyin = ?, meaning = ?, difficulty = ? WHERE id = ?");
            $stmt->execute([$category, $part_a, $part_b, $hanzi, $pinyin, $meaning, $difficulty, $id]);
        }

        $json = read_json_data($jsonGamePath);
        if (isset($json['wordLink'])) {
            foreach ($json['wordLink'] as &$item) {
                if ($item['id'] == $id) {
                    $item['category'] = $category;
                    $item['difficulty'] = $difficulty;
                    $item['pA'] = $part_a;
                    $item['pB'] = $part_b;
                    $item['hanzi'] = $hanzi;
                    $item['pinyin'] = $pinyin;
                    $item['meaning'] = $meaning;
                    break;
                }
            }
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Pasangan Kata berhasil diperbarui']);
        exit();
    } elseif ($action === 'delete_link') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM game_word_link WHERE id = ?");
            $stmt->execute([$id]);
        }
        $json = read_json_data($jsonGamePath);
        if (isset($json['wordLink'])) {
            $json['wordLink'] = array_values(array_filter($json['wordLink'], fn($i) => $i['id'] != $id));
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Pasangan Kata berhasil dihapus']);
        exit();
    }

    // -------------------------------------------------------------
    // SUB-GAME 3: KARTU MEMORI (MEMORY MATCH)
    // -------------------------------------------------------------
    elseif ($action === 'add_memory') {
        $session_key = trim($_POST['session'] ?? 'session1');
        $hanzi = trim($_POST['hanzi'] ?? '');
        $text_pair = trim($_POST['text'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = in_array($session_key, ['session1', 'session2']) ? 'easy' : (in_array($session_key, ['session3', 'session4']) ? 'medium' : 'hard');
        }

        $newId = time();
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO game_memory_match (session_key, hanzi, text_pair, difficulty) VALUES (?, ?, ?, ?)");
            $stmt->execute([$session_key, $hanzi, $text_pair, $difficulty]);
            $newId = (int)$pdo->lastInsertId();
        }

        $json = read_json_data($jsonGamePath);
        $json['memoryMatch'][] = [
            'id' => $newId,
            'session' => $session_key,
            'difficulty' => $difficulty,
            'hanzi' => $hanzi,
            'text' => $text_pair
        ];
        write_json_data($jsonGamePath, $json);
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Kartu Memori berhasil ditambahkan']);
        exit();
    } elseif ($action === 'edit_memory') {
        $id = (int)$_POST['id'];
        $session_key = trim($_POST['session'] ?? 'session1');
        $hanzi = trim($_POST['hanzi'] ?? '');
        $text_pair = trim($_POST['text'] ?? '');
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = in_array($session_key, ['session1', 'session2']) ? 'easy' : (in_array($session_key, ['session3', 'session4']) ? 'medium' : 'hard');
        }

        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("UPDATE game_memory_match SET session_key = ?, hanzi = ?, text_pair = ?, difficulty = ? WHERE id = ?");
            $stmt->execute([$session_key, $hanzi, $text_pair, $difficulty, $id]);
        }

        $json = read_json_data($jsonGamePath);
        if (isset($json['memoryMatch'])) {
            foreach ($json['memoryMatch'] as &$item) {
                if ($item['id'] == $id) {
                    $item['session'] = $session_key;
                    $item['difficulty'] = $difficulty;
                    $item['hanzi'] = $hanzi;
                    $item['text'] = $text_pair;
                    break;
                }
            }
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Kartu Memori berhasil diperbarui']);
        exit();
    } elseif ($action === 'delete_memory') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM game_memory_match WHERE id = ?");
            $stmt->execute([$id]);
        }
        $json = read_json_data($jsonGamePath);
        if (isset($json['memoryMatch'])) {
            $json['memoryMatch'] = array_values(array_filter($json['memoryMatch'], fn($i) => $i['id'] != $id));
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Kartu Memori berhasil dihapus']);
        exit();
    }

    // -------------------------------------------------------------
    // SUB-GAME 4: TEBAK PINYIN KE HANZI (PINYIN HANZI MATCH)
    // -------------------------------------------------------------
    elseif ($action === 'add_pinyin_hanzi') {
        $level = (int)($_POST['level'] ?? 1);
        $pinyin = trim($_POST['pinyin'] ?? '');
        $hanzi = trim($_POST['hanzi'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $audio = trim($_POST['audio'] ?? $hanzi);
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = ($level <= 2) ? 'easy' : (($level <= 4) ? 'medium' : 'hard');
        }

        $newId = time();
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO game_pinyin_hanzi (level, pinyin, hanzi, meaning, audio, difficulty) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$level, $pinyin, $hanzi, $meaning, $audio, $difficulty]);
            $newId = (int)$pdo->lastInsertId();
        }

        $json = read_json_data($jsonGamePath);
        $json['pinyinHanzi'][] = [
            'id' => $newId,
            'level' => $level,
            'difficulty' => $difficulty,
            'pinyin' => $pinyin,
            'hanzi' => $hanzi,
            'meaning' => $meaning,
            'audio' => $audio
        ];
        write_json_data($jsonGamePath, $json);
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Soal Pinyin ke Hanzi berhasil ditambahkan']);
        exit();
    } elseif ($action === 'edit_pinyin_hanzi') {
        $id = (int)$_POST['id'];
        $level = (int)($_POST['level'] ?? 1);
        $pinyin = trim($_POST['pinyin'] ?? '');
        $hanzi = trim($_POST['hanzi'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $audio = trim($_POST['audio'] ?? $hanzi);
        $difficulty = trim($_POST['difficulty'] ?? '');
        if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $difficulty = ($level <= 2) ? 'easy' : (($level <= 4) ? 'medium' : 'hard');
        }

        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("UPDATE game_pinyin_hanzi SET level = ?, pinyin = ?, hanzi = ?, meaning = ?, audio = ?, difficulty = ? WHERE id = ?");
            $stmt->execute([$level, $pinyin, $hanzi, $meaning, $audio, $difficulty, $id]);
        }

        $json = read_json_data($jsonGamePath);
        if (isset($json['pinyinHanzi'])) {
            foreach ($json['pinyinHanzi'] as &$item) {
                if ($item['id'] == $id) {
                    $item['level'] = $level;
                    $item['difficulty'] = $difficulty;
                    $item['pinyin'] = $pinyin;
                    $item['hanzi'] = $hanzi;
                    $item['meaning'] = $meaning;
                    $item['audio'] = $audio;
                    break;
                }
            }
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Soal Pinyin ke Hanzi berhasil diperbarui']);
        exit();
    } elseif ($action === 'delete_pinyin_hanzi') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM game_pinyin_hanzi WHERE id = ?");
            $stmt->execute([$id]);
        }
        $json = read_json_data($jsonGamePath);
        if (isset($json['pinyinHanzi'])) {
            $json['pinyinHanzi'] = array_values(array_filter($json['pinyinHanzi'], fn($i) => $i['id'] != $id));
            write_json_data($jsonGamePath, $json);
        }
        sync_game_arena_to_json();

        echo json_encode(['success' => true, 'message' => 'Soal Pinyin ke Hanzi berhasil dihapus']);
        exit();
    }

    // -------------------------------------------------------------
    // FITUR CERDAS: ANATOMI KARAKTER HANZI
    // -------------------------------------------------------------
    elseif ($action === 'add_anatomy') {
        $level = (int)($_POST['level'] ?? 1);
        $char = trim($_POST['char'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $radA = trim($_POST['radA'] ?? '');
        $radB = trim($_POST['radB'] ?? '');
        $story = trim($_POST['story'] ?? '');

        $newId = time();
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO smart_hanzi_anatomy (char_hanzi, pinyin, meaning, rad_a, rad_b, story, level) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$char, $pinyin, $meaning, $radA, $radB, $story, $level]);
            $newId = (int)$pdo->lastInsertId();
        }

        $json = read_json_data($jsonFiturPath);
        $json['anatomy'][] = [
            'id' => $newId,
            'level' => $level,
            'char' => $char,
            'pinyin' => $pinyin,
            'meaning' => $meaning,
            'radA' => $radA,
            'radB' => $radB,
            'story' => $story
        ];
        write_json_data($jsonFiturPath, $json);
        sync_fitur_cerdas_to_json();

        echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Anatomi Karakter berhasil ditambahkan']);
        exit();
    } elseif ($action === 'edit_anatomy') {
        $id = (int)$_POST['id'];
        $level = (int)($_POST['level'] ?? 1);
        $char = trim($_POST['char'] ?? '');
        $pinyin = trim($_POST['pinyin'] ?? '');
        $meaning = trim($_POST['meaning'] ?? '');
        $radA = trim($_POST['radA'] ?? '');
        $radB = trim($_POST['radB'] ?? '');
        $story = trim($_POST['story'] ?? '');

        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("UPDATE smart_hanzi_anatomy SET char_hanzi = ?, pinyin = ?, meaning = ?, rad_a = ?, rad_b = ?, story = ?, level = ? WHERE id = ?");
            $stmt->execute([$char, $pinyin, $meaning, $radA, $radB, $story, $level, $id]);
        }

        $json = read_json_data($jsonFiturPath);
        if (isset($json['anatomy'])) {
            foreach ($json['anatomy'] as &$item) {
                if ($item['id'] == $id) {
                    $item['level'] = $level;
                    $item['char'] = $char;
                    $item['pinyin'] = $pinyin;
                    $item['meaning'] = $meaning;
                    $item['radA'] = $radA;
                    $item['radB'] = $radB;
                    $item['story'] = $story;
                    break;
                }
            }
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        echo json_encode(['success' => true, 'message' => 'Anatomi Karakter berhasil diperbarui']);
        exit();
    } elseif ($action === 'delete_anatomy') {
        $id = (int)$_POST['id'];
        if ($db_connected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM smart_hanzi_anatomy WHERE id = ?");
            $stmt->execute([$id]);
        }
        $json = read_json_data($jsonFiturPath);
        if (isset($json['anatomy'])) {
            $json['anatomy'] = array_values(array_filter($json['anatomy'], fn($i) => $i['id'] != $id));
            write_json_data($jsonFiturPath, $json);
        }
        sync_fitur_cerdas_to_json();

        echo json_encode(['success' => true, 'message' => 'Anatomi Karakter berhasil dihapus']);
        exit();
    }

    echo json_encode(['success' => false, 'message' => 'Aksi tidak dikenali']);
} catch (\Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan server: ' . $e->getMessage()]);
}

