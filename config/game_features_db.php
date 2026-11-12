<?php
// config/game_features_db.php
// Dual-layer data repository: MySQL database with automated JSON synchronization

require_once __DIR__ . '/database.php';

$jsonGamePath = __DIR__ . '/../data/game_arena_data.json';
$jsonFiturPath = __DIR__ . '/../data/fitur_cerdas_data.json';

// Helper: Read JSON fallback safely
function read_json_data($filePath, $default = []) {
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return $default;
}

// Helper: Save JSON fallback safely
function write_json_data($filePath, $data) {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Inisialisasi Tabel MySQL jika database terhubung
if ($db_connected && $pdo) {
    try {
        // 1. Game Tone Trainer
        $pdo->exec("CREATE TABLE IF NOT EXISTS game_tone_trainer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            level INT DEFAULT 1,
            difficulty VARCHAR(20) DEFAULT 'easy',
            hanzi VARCHAR(50) NOT NULL,
            pinyin VARCHAR(100) NOT NULL,
            tone INT NOT NULL,
            audio VARCHAR(50) NOT NULL,
            meaning VARCHAR(255) NOT NULL,
            tip TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        try { $pdo->exec("ALTER TABLE game_tone_trainer ADD COLUMN difficulty VARCHAR(20) DEFAULT 'easy'"); } catch (\Exception $e) {}

        // 2. Game Word Link
        $pdo->exec("CREATE TABLE IF NOT EXISTS game_word_link (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(50) NOT NULL,
            difficulty VARCHAR(20) DEFAULT 'easy',
            part_a VARCHAR(50) NOT NULL,
            part_b VARCHAR(50) NOT NULL,
            hanzi VARCHAR(100) NOT NULL,
            pinyin VARCHAR(100) NOT NULL,
            meaning VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        try { $pdo->exec("ALTER TABLE game_word_link ADD COLUMN difficulty VARCHAR(20) DEFAULT 'easy'"); } catch (\Exception $e) {}

        // 3. Game Memory Match
        $pdo->exec("CREATE TABLE IF NOT EXISTS game_memory_match (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_key VARCHAR(50) DEFAULT 'session1',
            difficulty VARCHAR(20) DEFAULT 'easy',
            hanzi VARCHAR(50) NOT NULL,
            text_pair VARCHAR(150) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        try { $pdo->exec("ALTER TABLE game_memory_match ADD COLUMN session_key VARCHAR(50) DEFAULT 'session1'"); } catch (\Exception $e) {}
        try { $pdo->exec("ALTER TABLE game_memory_match ADD COLUMN difficulty VARCHAR(20) DEFAULT 'easy'"); } catch (\Exception $e) {}

        // 4. Smart Hanzi Anatomy
        $pdo->exec("CREATE TABLE IF NOT EXISTS smart_hanzi_anatomy (
            id INT AUTO_INCREMENT PRIMARY KEY,
            level INT DEFAULT 1,
            char_hanzi VARCHAR(50) NOT NULL,
            pinyin VARCHAR(100) NOT NULL,
            meaning VARCHAR(255) NOT NULL,
            rad_a VARCHAR(100) NOT NULL,
            rad_b VARCHAR(100) NOT NULL,
            story TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        try { $pdo->exec("ALTER TABLE smart_hanzi_anatomy ADD COLUMN level INT DEFAULT 1"); } catch (\Exception $e) {}

        // 5. Smart Leaderboard
        $pdo->exec("CREATE TABLE IF NOT EXISTS smart_leaderboard (
            id INT AUTO_INCREMENT PRIMARY KEY,
            rank_num INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            exp INT NOT NULL,
            hsk_level VARCHAR(50) NOT NULL,
            avatar VARCHAR(50) NOT NULL,
            medal VARCHAR(50) NOT NULL,
            is_user TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 6. Game Pinyin to Hanzi Matcher
        $pdo->exec("CREATE TABLE IF NOT EXISTS game_pinyin_hanzi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            level INT DEFAULT 1,
            difficulty VARCHAR(20) DEFAULT 'easy',
            pinyin VARCHAR(100) NOT NULL,
            hanzi VARCHAR(50) NOT NULL,
            meaning VARCHAR(255) NOT NULL,
            audio VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        try { $pdo->exec("ALTER TABLE game_pinyin_hanzi ADD COLUMN difficulty VARCHAR(20) DEFAULT 'easy'"); } catch (\Exception $e) {}

        // Seed data jika tabel kosong atau kurang dari 120 (agar 480 soal tersinkron penuh)
        $countTone = $pdo->query("SELECT COUNT(*) FROM game_tone_trainer")->fetchColumn();
        if ($countTone < 120) {
            $jsonGame = read_json_data($jsonGamePath);
            if (!empty($jsonGame['toneTrainer'])) {
                $pdo->exec("DELETE FROM game_tone_trainer");
                $stmt = $pdo->prepare("INSERT INTO game_tone_trainer (level, difficulty, hanzi, pinyin, tone, audio, meaning, tip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($jsonGame['toneTrainer'] as $q) {
                    $lvl = (int)($q['level'] ?? 1);
                    $diff = $q['difficulty'] ?? ($lvl <= 2 ? 'easy' : ($lvl <= 4 ? 'medium' : 'hard'));
                    $stmt->execute([$lvl, $diff, $q['hanzi'], $q['pinyin'], $q['tone'], $q['audio'] ?? $q['hanzi'], $q['meaning'], $q['tip'] ?? '']);
                }
            }
        }

        $countWL = $pdo->query("SELECT COUNT(*) FROM game_word_link")->fetchColumn();
        if ($countWL < 120) {
            $jsonGame = read_json_data($jsonGamePath);
            if (!empty($jsonGame['wordLink'])) {
                $pdo->exec("DELETE FROM game_word_link");
                $stmt = $pdo->prepare("INSERT INTO game_word_link (category, difficulty, part_a, part_b, hanzi, pinyin, meaning) VALUES (?, ?, ?, ?, ?, ?, ?)");
                foreach ($jsonGame['wordLink'] as $w) {
                    $cat = $w['category'] ?? 'cat1';
                    $diff = $w['difficulty'] ?? (in_array($cat, ['cat1', 'cat2']) ? 'easy' : (in_array($cat, ['cat3', 'cat4']) ? 'medium' : 'hard'));
                    $stmt->execute([$cat, $diff, $w['pA'], $w['pB'], $w['hanzi'], $w['pinyin'], $w['meaning']]);
                }
            }
        }

        $countMM = $pdo->query("SELECT COUNT(*) FROM game_memory_match")->fetchColumn();
        if ($countMM < 120) {
            $jsonGame = read_json_data($jsonGamePath);
            if (!empty($jsonGame['memoryMatch'])) {
                $pdo->exec("DELETE FROM game_memory_match");
                $stmt = $pdo->prepare("INSERT INTO game_memory_match (session_key, difficulty, hanzi, text_pair) VALUES (?, ?, ?, ?)");
                foreach ($jsonGame['memoryMatch'] as $m) {
                    $sess = $m['session'] ?? 'session1';
                    $diff = $m['difficulty'] ?? (in_array($sess, ['session1', 'session2']) ? 'easy' : (in_array($sess, ['session3', 'session4']) ? 'medium' : 'hard'));
                    $stmt->execute([$sess, $diff, $m['hanzi'], $m['text']]);
                }
            }
        }

        $countAnatomy = $pdo->query("SELECT COUNT(*) FROM smart_hanzi_anatomy")->fetchColumn();
        if ($countAnatomy == 0) {
            $jsonFitur = read_json_data($jsonFiturPath);
            if (!empty($jsonFitur['anatomy'])) {
                $stmt = $pdo->prepare("INSERT INTO smart_hanzi_anatomy (char_hanzi, pinyin, meaning, rad_a, rad_b, story) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($jsonFitur['anatomy'] as $a) {
                    $stmt->execute([$a['char'], $a['pinyin'], $a['meaning'], $a['radA'], $a['radB'], $a['story']]);
                }
            }
        }

        $countLB = $pdo->query("SELECT COUNT(*) FROM smart_leaderboard")->fetchColumn();
        if ($countLB == 0) {
            $jsonFitur = read_json_data($jsonFiturPath);
            if (!empty($jsonFitur['leaderboard'])) {
                $stmt = $pdo->prepare("INSERT INTO smart_leaderboard (rank_num, name, exp, hsk_level, avatar, medal, is_user) VALUES (?, ?, ?, ?, ?, ?, ?)");
                foreach ($jsonFitur['leaderboard'] as $l) {
                    $stmt->execute([$l['rank'], $l['name'], $l['exp'], $l['hsk'], $l['avatar'], $l['medal'], !empty($l['isUser']) ? 1 : 0]);
                }
            }
        }

        $countPH = $pdo->query("SELECT COUNT(*) FROM game_pinyin_hanzi")->fetchColumn();
        if ($countPH < 120) {
            $jsonGame = read_json_data($jsonGamePath);
            if (!empty($jsonGame['pinyinHanzi'])) {
                $pdo->exec("DELETE FROM game_pinyin_hanzi");
                $stmt = $pdo->prepare("INSERT INTO game_pinyin_hanzi (level, difficulty, pinyin, hanzi, meaning, audio) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($jsonGame['pinyinHanzi'] as $ph) {
                    $lvl = (int)($ph['level'] ?? 1);
                    $diff = $ph['difficulty'] ?? ($lvl <= 2 ? 'easy' : ($lvl <= 4 ? 'medium' : 'hard'));
                    $stmt->execute([$lvl, $diff, $ph['pinyin'], $ph['hanzi'], $ph['meaning'], $ph['audio'] ?? $ph['hanzi']]);
                }
            }
        }
    } catch (\Exception $e) {
        // Fallback silently ke JSON jika terjadi hambatan DB
    }
}

// =========================================================================
// GETTER FUNCTIONS (DB-First with JSON Fallback)
// =========================================================================

function get_all_tone_trainer() {
    global $pdo, $db_connected, $jsonGamePath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM game_tone_trainer ORDER BY level ASC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    $lvl = (int)$r['level'];
                    $diff = !empty($r['difficulty']) ? $r['difficulty'] : ($lvl <= 2 ? 'easy' : ($lvl <= 4 ? 'medium' : 'hard'));
                    return [
                        'id' => (int)$r['id'],
                        'level' => $lvl,
                        'difficulty' => $diff,
                        'hanzi' => $r['hanzi'],
                        'pinyin' => $r['pinyin'],
                        'tone' => (int)$r['tone'],
                        'audio' => $r['audio'],
                        'meaning' => $r['meaning'],
                        'tip' => $r['tip']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonGamePath);
    return $json['toneTrainer'] ?? [];
}

function get_all_word_link() {
    global $pdo, $db_connected, $jsonGamePath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM game_word_link ORDER BY category ASC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    $cat = $r['category'] ?? 'cat1';
                    $diff = !empty($r['difficulty']) ? $r['difficulty'] : (in_array($cat, ['cat1', 'cat2']) ? 'easy' : (in_array($cat, ['cat3', 'cat4']) ? 'medium' : 'hard'));
                    return [
                        'id' => (int)$r['id'],
                        'category' => $cat,
                        'difficulty' => $diff,
                        'pA' => $r['part_a'],
                        'pB' => $r['part_b'],
                        'hanzi' => $r['hanzi'],
                        'pinyin' => $r['pinyin'],
                        'meaning' => $r['meaning']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonGamePath);
    return $json['wordLink'] ?? [];
}

function get_all_memory_match() {
    global $pdo, $db_connected, $jsonGamePath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM game_memory_match ORDER BY session_key ASC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    $sess = $r['session_key'] ?? 'session1';
                    $diff = !empty($r['difficulty']) ? $r['difficulty'] : (in_array($sess, ['session1', 'session2']) ? 'easy' : (in_array($sess, ['session3', 'session4']) ? 'medium' : 'hard'));
                    return [
                        'id' => (int)$r['id'],
                        'session' => $sess,
                        'difficulty' => $diff,
                        'hanzi' => $r['hanzi'],
                        'text' => $r['text_pair']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonGamePath);
    return $json['memoryMatch'] ?? [];
}

function get_all_hanzi_anatomy() {
    global $pdo, $db_connected, $jsonFiturPath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM smart_hanzi_anatomy ORDER BY level ASC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    return [
                        'id' => (int)$r['id'],
                        'level' => (int)($r['level'] ?? 1),
                        'char' => $r['char_hanzi'],
                        'pinyin' => $r['pinyin'],
                        'meaning' => $r['meaning'],
                        'radA' => $r['rad_a'],
                        'radB' => $r['rad_b'],
                        'story' => $r['story']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonFiturPath);
    return $json['anatomy'] ?? [];
}

function get_all_leaderboard() {
    global $pdo, $db_connected, $jsonFiturPath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM smart_leaderboard ORDER BY rank_num ASC, exp DESC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    return [
                        'id' => (int)$r['id'],
                        'rank' => (int)$r['rank_num'],
                        'name' => $r['name'],
                        'exp' => (int)$r['exp'],
                        'hsk' => $r['hsk_level'],
                        'avatar' => $r['avatar'],
                        'medal' => $r['medal'],
                        'isUser' => (bool)$r['is_user']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonFiturPath);
    return $json['leaderboard'] ?? [];
}

function get_all_pinyin_hanzi() {
    global $pdo, $db_connected, $jsonGamePath;
    if ($db_connected && $pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM game_pinyin_hanzi ORDER BY level ASC, id ASC")->fetchAll();
            if (!empty($rows)) {
                return array_map(function($r) {
                    $lvl = (int)$r['level'];
                    $diff = !empty($r['difficulty']) ? $r['difficulty'] : ($lvl <= 2 ? 'easy' : ($lvl <= 4 ? 'medium' : 'hard'));
                    return [
                        'id' => (int)$r['id'],
                        'level' => $lvl,
                        'difficulty' => $diff,
                        'pinyin' => $r['pinyin'],
                        'hanzi' => $r['hanzi'],
                        'meaning' => $r['meaning'],
                        'audio' => $r['audio'] ?? $r['hanzi']
                    ];
                }, $rows);
            }
        } catch (\Exception $e) {}
    }
    $json = read_json_data($jsonGamePath);
    return $json['pinyinHanzi'] ?? [];
}

// =========================================================================
// SYNC UTILITY (Syncs Current State to JSON Fallback)
// =========================================================================

function sync_game_arena_to_json() {
    global $jsonGamePath;
    $data = [
        'toneTrainer' => get_all_tone_trainer(),
        'wordLink' => get_all_word_link(),
        'memoryMatch' => get_all_memory_match(),
        'pinyinHanzi' => get_all_pinyin_hanzi()
    ];
    write_json_data($jsonGamePath, $data);
}

function sync_fitur_cerdas_to_json() {
    global $jsonFiturPath;
    $data = [
        'anatomy' => get_all_hanzi_anatomy(),
        'leaderboard' => get_all_leaderboard()
    ];
    write_json_data($jsonFiturPath, $data);
}

