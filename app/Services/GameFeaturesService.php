<?php

namespace App\Services;

class GameFeaturesService
{
    protected static mixed $pdoInstance = null;
    protected static bool $initialized = false;

    public function __construct()
    {
        $this->bootDatabase();
    }

    public function bootDatabase(): void
    {
        if (self::$initialized) {
            return;
        }

        global $pdo, $db_connected, $db_error, $jsonGamePath, $jsonFiturPath;

        require_once base_path('config/game_features_db.php');

        if ($pdo) {
            self::$pdoInstance = $pdo;
            if ($db_connected && $pdo instanceof \PDO) {
                $this->ensureCoreTablesExist($pdo);
            }
        }

        $this->ensureDefaultJsonStores();

        self::$initialized = true;
    }

    public function getPdo(): mixed
    {
        $this->bootDatabase();
        return self::$pdoInstance;
    }

    public function isDbConnected(): bool
    {
        $this->bootDatabase();
        return self::$pdoInstance instanceof \PDO;
    }

    protected function getUserProgressJsonPath(): string
    {
        return base_path('data/user_progress.json');
    }

    protected function getQuizHistoryJsonPath(): string
    {
        return base_path('data/quiz_histories.json');
    }

    protected function readJsonStore(string $path, array $default = []): array
    {
        if (file_exists($path)) {
            $raw = @file_get_contents($path);
            if ($raw !== false) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        }
        return $default;
    }

    protected function writeJsonStore(string $path, array $data): void
    {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    protected function getDefaultSeedUsers(): array
    {
        return [
            [
                'name' => 'Learner Panda',
                'email' => 'learner@mandarinku.com',
                'role' => 'student',
                'level' => 2,
                'exp' => 250,
                'max_exp' => 500,
                'points' => 120,
                'streak' => 7,
                'study_hours' => 18,
                'completed_modules' => 14,
                'progress' => ['listening' => 60, 'speaking' => 40, 'reading' => 70, 'writing' => 50],
                'created_at' => '2024-05-20 08:00:00',
            ],
            [
                'name' => 'Mei Ling',
                'email' => 'mei.ling@mandarinku.com',
                'role' => 'student',
                'level' => 5,
                'exp' => 420,
                'max_exp' => 980,
                'points' => 640,
                'streak' => 21,
                'study_hours' => 42,
                'completed_modules' => 28,
                'progress' => ['listening' => 88, 'speaking' => 82, 'reading' => 90, 'writing' => 79],
                'created_at' => '2024-06-12 09:30:00',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@mandarinku.com',
                'role' => 'student',
                'level' => 3,
                'exp' => 180,
                'max_exp' => 700,
                'points' => 310,
                'streak' => 11,
                'study_hours' => 24,
                'completed_modules' => 19,
                'progress' => ['listening' => 72, 'speaking' => 65, 'reading' => 78, 'writing' => 60],
                'created_at' => '2024-07-04 14:15:00',
            ],
            [
                'name' => 'Kevin Wijaya',
                'email' => 'kevin.wijaya@mandarinku.com',
                'role' => 'student',
                'level' => 4,
                'exp' => 310,
                'max_exp' => 840,
                'points' => 495,
                'streak' => 14,
                'study_hours' => 31,
                'completed_modules' => 22,
                'progress' => ['listening' => 80, 'speaking' => 74, 'reading' => 84, 'writing' => 70],
                'created_at' => '2024-08-19 10:45:00',
            ],
        ];
    }

    protected function getDefaultSeedQuizHistories(): array
    {
        return [
            [
                'id' => 1,
                'user_email' => 'learner@mandarinku.com',
                'user_name' => 'Learner Panda',
                'hsk_level' => 'HSK 2',
                'skill_type' => 'reading',
                'quiz_mode' => 'practice',
                'total_questions' => 10,
                'correct_answers' => 8,
                'score_percent' => 80,
                'grade' => 'A',
                'exp_earned' => 150,
                'points_earned' => 100,
                'created_at' => date('Y-m-d H:i:s', strtotime('-2 days')),
            ],
            [
                'id' => 2,
                'user_email' => 'learner@mandarinku.com',
                'user_name' => 'Learner Panda',
                'hsk_level' => 'HSK 1',
                'skill_type' => 'listening',
                'quiz_mode' => 'timed',
                'total_questions' => 10,
                'correct_answers' => 9,
                'score_percent' => 90,
                'grade' => 'A+',
                'exp_earned' => 165,
                'points_earned' => 110,
                'created_at' => date('Y-m-d H:i:s', strtotime('-1 days')),
            ],
            [
                'id' => 3,
                'user_email' => 'mei.ling@mandarinku.com',
                'user_name' => 'Mei Ling',
                'hsk_level' => 'HSK 5',
                'skill_type' => 'all',
                'quiz_mode' => 'timed',
                'total_questions' => 20,
                'correct_answers' => 19,
                'score_percent' => 95,
                'grade' => 'A+',
                'exp_earned' => 315,
                'points_earned' => 210,
                'created_at' => date('Y-m-d H:i:s', strtotime('-12 hours')),
            ],
            [
                'id' => 4,
                'user_email' => 'budi.santoso@mandarinku.com',
                'user_name' => 'Budi Santoso',
                'hsk_level' => 'HSK 3',
                'skill_type' => 'reading',
                'quiz_mode' => 'practice',
                'total_questions' => 15,
                'correct_answers' => 11,
                'score_percent' => 73,
                'grade' => 'B',
                'exp_earned' => 175,
                'points_earned' => 115,
                'created_at' => date('Y-m-d H:i:s', strtotime('-6 hours')),
            ],
            [
                'id' => 5,
                'user_email' => 'kevin.wijaya@mandarinku.com',
                'user_name' => 'Kevin Wijaya',
                'hsk_level' => 'HSK 4',
                'skill_type' => 'writing',
                'quiz_mode' => 'timed',
                'total_questions' => 15,
                'correct_answers' => 13,
                'score_percent' => 87,
                'grade' => 'A',
                'exp_earned' => 225,
                'points_earned' => 150,
                'created_at' => date('Y-m-d H:i:s', strtotime('-3 hours')),
            ],
        ];
    }

    protected function ensureDefaultJsonStores(): void
    {
        $userPath = $this->getUserProgressJsonPath();
        $usersMap = $this->readJsonStore($userPath, []);
        if (empty($usersMap)) {
            $seedMap = [];
            foreach ($this->getDefaultSeedUsers() as $idx => $u) {
                $u['id'] = $idx + 1;
                $seedMap[$u['email']] = $u;
            }
            $this->writeJsonStore($userPath, $seedMap);
        }

        $histPath = $this->getQuizHistoryJsonPath();
        $histories = $this->readJsonStore($histPath, []);
        if (empty($histories)) {
            $this->writeJsonStore($histPath, $this->getDefaultSeedQuizHistories());
        }
    }

    protected function ensureCoreTablesExist(\PDO $pdo): void
    {
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(30) DEFAULT 'student',
                level INT DEFAULT 1,
                exp INT DEFAULT 0,
                max_exp INT DEFAULT 500,
                points INT DEFAULT 0,
                streak INT DEFAULT 1,
                study_hours INT DEFAULT 1,
                completed_modules INT DEFAULT 0,
                progress_json TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $userAlterStatements = [
                "ALTER TABLE users ADD COLUMN role VARCHAR(30) DEFAULT 'student'",
                "ALTER TABLE users ADD COLUMN level INT DEFAULT 1",
                "ALTER TABLE users ADD COLUMN exp INT DEFAULT 0",
                "ALTER TABLE users ADD COLUMN max_exp INT DEFAULT 500",
                "ALTER TABLE users ADD COLUMN points INT DEFAULT 0",
                "ALTER TABLE users ADD COLUMN streak INT DEFAULT 1",
                "ALTER TABLE users ADD COLUMN study_hours INT DEFAULT 1",
                "ALTER TABLE users ADD COLUMN completed_modules INT DEFAULT 0",
                "ALTER TABLE users ADD COLUMN progress_json TEXT DEFAULT NULL",
            ];
            foreach ($userAlterStatements as $sql) {
                try {
                    $pdo->exec($sql);
                } catch (\Throwable $e) {
                }
            }

            $pdo->exec("CREATE TABLE IF NOT EXISTS modules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(50) DEFAULT 'komprehensif',
                hsk_level VARCHAR(30) DEFAULT 'HSK 1',
                description TEXT,
                author VARCHAR(100) DEFAULT 'Admin Mandarinku',
                file_path VARCHAR(255) DEFAULT NULL,
                file_size VARCHAR(50) DEFAULT '2.5 MB',
                downloads INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            foreach ([
                "ALTER TABLE modules ADD COLUMN author VARCHAR(100) DEFAULT 'Admin Mandarinku'",
                "ALTER TABLE modules ADD COLUMN file_path VARCHAR(255) DEFAULT NULL",
                "ALTER TABLE modules ADD COLUMN file_size VARCHAR(50) DEFAULT '2.5 MB'",
                "ALTER TABLE modules ADD COLUMN downloads INT DEFAULT 0",
            ] as $sql) {
                try {
                    $pdo->exec($sql);
                } catch (\Throwable $e) {
                }
            }

            $pdo->exec("CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                module_id INT DEFAULT NULL,
                hsk_level INT DEFAULT 1,
                skill_type VARCHAR(30) DEFAULT 'reading',
                question_text TEXT NOT NULL,
                option_a VARCHAR(255) NOT NULL,
                option_b VARCHAR(255) NOT NULL,
                option_c VARCHAR(255) NOT NULL,
                option_d VARCHAR(255) NOT NULL,
                correct_option VARCHAR(5) DEFAULT 'A',
                correct_answer CHAR(1) DEFAULT 'A',
                explanation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            foreach ([
                "ALTER TABLE questions ADD COLUMN module_id INT DEFAULT NULL",
                "ALTER TABLE questions ADD COLUMN hsk_level INT DEFAULT 1",
                "ALTER TABLE questions ADD COLUMN skill_type VARCHAR(30) DEFAULT 'reading'",
                "ALTER TABLE questions ADD COLUMN correct_option VARCHAR(5) DEFAULT 'A'",
                "ALTER TABLE questions ADD COLUMN correct_answer CHAR(1) DEFAULT 'A'",
                "ALTER TABLE questions ADD COLUMN explanation TEXT",
            ] as $sql) {
                try {
                    $pdo->exec($sql);
                } catch (\Throwable $e) {
                }
            }

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

            $pdo->exec("CREATE TABLE IF NOT EXISTS quiz_histories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(100) NOT NULL,
                user_name VARCHAR(100) NOT NULL,
                hsk_level VARCHAR(30) NOT NULL,
                skill_type VARCHAR(50) DEFAULT 'all',
                quiz_mode VARCHAR(30) DEFAULT 'practice',
                total_questions INT DEFAULT 10,
                correct_answers INT DEFAULT 0,
                score_percent INT DEFAULT 0,
                grade VARCHAR(10) DEFAULT 'A',
                exp_earned INT DEFAULT 0,
                points_earned INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $this->seedCoreTablesIfNeeded($pdo);
        } catch (\Throwable $e) {
            // Ignore non-fatal table initialization errors
        }
    }

    protected function seedCoreTablesIfNeeded(\PDO $pdo): void
    {
        try {
            $defaultPass = password_hash('PandaBelajar2024!', PASSWORD_DEFAULT);
            $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
            $insertUser = $pdo->prepare("INSERT INTO users (name, email, password, role, level, exp, max_exp, points, streak, study_hours, completed_modules, progress_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            foreach ($this->getDefaultSeedUsers() as $u) {
                $checkStmt->execute([$u['email']]);
                if (!$checkStmt->fetch()) {
                    $insertUser->execute([
                        $u['name'],
                        $u['email'],
                        $defaultPass,
                        $u['role'],
                        $u['level'],
                        $u['exp'],
                        $u['max_exp'],
                        $u['points'],
                        $u['streak'],
                        $u['study_hours'],
                        $u['completed_modules'],
                        json_encode($u['progress']),
                    ]);
                }
            }

            $qhCount = (int)$pdo->query("SELECT COUNT(*) FROM quiz_histories")->fetchColumn();
            if ($qhCount === 0) {
                $insertQh = $pdo->prepare("INSERT INTO quiz_histories (user_email, user_name, hsk_level, skill_type, quiz_mode, total_questions, correct_answers, score_percent, grade, exp_earned, points_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($this->getDefaultSeedQuizHistories() as $h) {
                    $insertQh->execute([
                        $h['user_email'],
                        $h['user_name'],
                        $h['hsk_level'],
                        $h['skill_type'],
                        $h['quiz_mode'],
                        $h['total_questions'],
                        $h['correct_answers'],
                        $h['score_percent'],
                        $h['grade'],
                        $h['exp_earned'],
                        $h['points_earned'],
                        $h['created_at'],
                    ]);
                }
            }

            $modCount = (int)$pdo->query("SELECT COUNT(*) FROM modules")->fetchColumn();
            if ($modCount < 6) {
                $seedModules = [
                    ['Pengenalan Nada & Pinyin Praktis (HSK 1)', 'listening', 'HSK 1', 'Panduan lengkap membedakan 4 nada dasar Mandarin + 150 kosakata percakapan awal.'],
                    ['Tata Bahasa Komparasi 比 & Arah Jalan (HSK 2)', 'reading', 'HSK 2', 'Kuasai perbandingan kalimat dengan 比 (bǐ), durasi waktu, serta dialog navigasi kota.'],
                    ['Struktur Kalimat 把 (bǎ) & 被 (bèi) Lengkap (HSK 3)', 'writing', 'HSK 3', 'Penjelasan mendalam kalimat manipulasi objek dan kalimat pasif beserta latihan terstruktur.'],
                    ['Ekspresi Opini & Wawancara Kerja Profesional (HSK 4)', 'speaking', 'HSK 4', 'Kumpulan pola kalimat formal untuk presentasi bisnis, opini diskusi, dan wawancara kerja.'],
                    ['Esai Argumentatif & Wacana Budaya Tiongkok (HSK 5)', 'reading', 'HSK 5', 'Bedah struktur kalimat sastra formal (随着, 之所以, 非但...反而) untuk pemahaman wacana panjang.'],
                    ['Master Idiom Chengyu & Retorika Klasik (HSK 6)', 'komprehensif', 'HSK 6', 'Analisis mendalam peribahasa 成语 paling sering diujikan di HSK 6 dan maknanya dalam konteks modern.'],
                ];
                $checkMod = $pdo->prepare("SELECT id FROM modules WHERE title = ? LIMIT 1");
                $insMod = $pdo->prepare("INSERT INTO modules (title, category, hsk_level, description) VALUES (?, ?, ?, ?)");
                foreach ($seedModules as $m) {
                    $checkMod->execute([$m[0]]);
                    if (!$checkMod->fetch()) {
                        $insMod->execute($m);
                    }
                }
            }

            $qCount = (int)$pdo->query("SELECT COUNT(*) FROM questions")->fetchColumn();
            if ($qCount < 6) {
                $seedQuestions = [
                    [1, 'reading', 'Apa arti ungkapan Mandarin "很高兴认识你" (Hěn gāoxìng rènshi nǐ)?', 'Sampai jumpa besok', 'Senang berkenalan denganmu', 'Terima kasih banyak', 'Mohon maaf mengganggu', 'B', '很高兴 berarti sangat senang, dan 认识你 berarti mengenal kamu.'],
                    [2, 'reading', 'Lengkapi kalimat: 今天 _____ 昨天冷很多。(Hari ini jauh lebih dingin dari kemarin.)', '比 (bǐ)', '跟 (gēn)', '在 (zài)', '给 (gěi)', 'A', 'Partikel komparasi dalam Mandarin menggunakan 比 (A + 比 + B + Kata Sifat).'],
                    [3, 'writing', 'Urutan yang tepat untuk kalimat 把: 请 ___ 书 ___ 桌子上。', '被 ... 放在', '把 ... 放在', '对 ... 放在', '给 ... 放在', 'B', 'Struktur 把 memindahkan objek sebelum kata kerja yang memiliki hasil/lokasi: 把 + Objek + 放在 + Tempat.'],
                    [4, 'reading', 'Pasangan konjungsi yang tepat: _____ 遇到什么困难，我们 _____ 不能放弃。', '虽然...但是', '因为...所以', '无论...都', '不但...而且', 'C', '无论...都 berarti "Tidak peduli (apa pun)... tetap semuanya...".'],
                    [5, 'reading', 'Makna kata "之所以...是因为..." dalam teks HSK 5 adalah...', 'Meskipun... tetap', 'Alasan mengapa... adalah karena', 'Seandainya... maka', 'Alih-alih... justru', 'B', 'Pola formal untuk menekankan akibat di depan dan alasan di belakang.'],
                    [6, 'reading', 'Idiom "塞翁失马，焉知非福" mengajarkan sikap...', 'Selalu tergesa-gesa mengejar hasil', 'Memandang musibah dan berkah secara bijaksana dan optimis', 'Meniru orang lain tanpa berpikir', 'Menambah hal yang tidak diperlukan', 'B', 'Kejadian buruk belum tentu berakhir buruk; tetap optimis dan bijaksana menghadapi perubahan nasib.'],
                ];
                $checkQ = $pdo->prepare("SELECT id FROM questions WHERE question_text = ? LIMIT 1");
                $insQ = $pdo->prepare("INSERT INTO questions (hsk_level, skill_type, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($seedQuestions as $sq) {
                    $checkQ->execute([$sq[2]]);
                    if (!$checkQ->fetch()) {
                        $insQ->execute([$sq[0], $sq[1], $sq[2], $sq[3], $sq[4], $sq[5], $sq[6], $sq[7], $sq[7], $sq[8]]);
                    }
                }
            }
        } catch (\Throwable $e) {
            // Keep silent if seeding encounters permission/schema quirk
        }
    }

    public function getUserProgress(string $email): array
    {
        $this->bootDatabase();
        $cleanEmail = strtolower(trim($email)) ?: 'learner@mandarinku.com';

        $defaultProgress = ['listening' => 60, 'speaking' => 40, 'reading' => 70, 'writing' => 50];
        $row = null;

        if ($this->isDbConnected()) {
            try {
                $stmt = self::$pdoInstance->prepare("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1");
                $stmt->execute([$cleanEmail]);
                $dbRow = $stmt->fetch(\PDO::FETCH_ASSOC);
                if ($dbRow) {
                    $progDecoded = !empty($dbRow['progress_json']) ? json_decode($dbRow['progress_json'], true) : null;
                    $row = [
                        'id' => (int)$dbRow['id'],
                        'name' => $dbRow['name'],
                        'email' => strtolower($dbRow['email']),
                        'role' => $dbRow['role'] ?? 'student',
                        'level' => (int)($dbRow['level'] ?? 1),
                        'exp' => (int)($dbRow['exp'] ?? 0),
                        'max_exp' => (int)($dbRow['max_exp'] ?? 500),
                        'points' => (int)($dbRow['points'] ?? 0),
                        'streak' => (int)($dbRow['streak'] ?? 1),
                        'study_hours' => (int)($dbRow['study_hours'] ?? 1),
                        'completed_modules' => (int)($dbRow['completed_modules'] ?? 0),
                        'progress' => is_array($progDecoded) ? $progDecoded : $defaultProgress,
                        'created_at' => $dbRow['created_at'] ?? date('Y-m-d H:i:s'),
                    ];
                }
            } catch (\Throwable $e) {
            }
        }

        $jsonMap = $this->readJsonStore($this->getUserProgressJsonPath(), []);
        if (!$row && isset($jsonMap[$cleanEmail])) {
            $row = $jsonMap[$cleanEmail];
        }

        if (!$row) {
            $namePart = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $cleanEmail)[0] ?: 'Siswa Mandarinku'));
            $row = [
                'id' => count($jsonMap) + 1,
                'name' => $cleanEmail === 'learner@mandarinku.com' ? 'Learner Panda' : $namePart,
                'email' => $cleanEmail,
                'role' => 'student',
                'level' => $cleanEmail === 'learner@mandarinku.com' ? 2 : 1,
                'exp' => $cleanEmail === 'learner@mandarinku.com' ? 250 : 0,
                'max_exp' => 500,
                'points' => $cleanEmail === 'learner@mandarinku.com' ? 120 : 0,
                'streak' => $cleanEmail === 'learner@mandarinku.com' ? 7 : 1,
                'study_hours' => $cleanEmail === 'learner@mandarinku.com' ? 18 : 1,
                'completed_modules' => $cleanEmail === 'learner@mandarinku.com' ? 14 : 0,
                'progress' => $cleanEmail === 'learner@mandarinku.com' ? $defaultProgress : ['listening' => 0, 'speaking' => 0, 'reading' => 0, 'writing' => 0],
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }

        return $row;
    }

    public function saveUserProgress(array $payload): array
    {
        $this->bootDatabase();
        $cleanEmail = strtolower(trim((string)($payload['email'] ?? ''))) ?: 'learner@mandarinku.com';
        $existing = $this->getUserProgress($cleanEmail);

        $progress = $payload['progress'] ?? $existing['progress'] ?? ['listening' => 0, 'speaking' => 0, 'reading' => 0, 'writing' => 0];
        if (!is_array($progress)) {
            $decoded = json_decode((string)$progress, true);
            $progress = is_array($decoded) ? $decoded : $existing['progress'];
        }

        $record = [
            'id' => $existing['id'] ?? 1,
            'name' => trim((string)($payload['name'] ?? $existing['name'] ?? 'Siswa Mandarinku')) ?: 'Siswa Mandarinku',
            'email' => $cleanEmail,
            'role' => trim((string)($payload['role'] ?? $existing['role'] ?? 'student')) ?: 'student',
            'level' => max(1, (int)($payload['level'] ?? $existing['level'] ?? 1)),
            'exp' => max(0, (int)($payload['exp'] ?? $existing['exp'] ?? 0)),
            'max_exp' => max(100, (int)($payload['max_exp'] ?? $payload['maxExp'] ?? $existing['max_exp'] ?? 500)),
            'points' => max(0, (int)($payload['points'] ?? $existing['points'] ?? 0)),
            'streak' => max(1, (int)($payload['streak'] ?? $existing['streak'] ?? 1)),
            'study_hours' => max(0, (int)($payload['study_hours'] ?? $payload['studyHours'] ?? $existing['study_hours'] ?? 1)),
            'completed_modules' => max(0, (int)($payload['completed_modules'] ?? $payload['completedModules'] ?? $existing['completed_modules'] ?? 0)),
            'progress' => $progress,
            'created_at' => $existing['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if ($this->isDbConnected()) {
            try {
                $pdo = self::$pdoInstance;
                $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1");
                $stmt->execute([$cleanEmail]);
                $foundId = $stmt->fetchColumn();

                if ($foundId) {
                    $upd = $pdo->prepare("UPDATE users SET name = ?, role = ?, level = ?, exp = ?, max_exp = ?, points = ?, streak = ?, study_hours = ?, completed_modules = ?, progress_json = ? WHERE id = ?");
                    $upd->execute([
                        $record['name'],
                        $record['role'],
                        $record['level'],
                        $record['exp'],
                        $record['max_exp'],
                        $record['points'],
                        $record['streak'],
                        $record['study_hours'],
                        $record['completed_modules'],
                        json_encode($record['progress']),
                        $foundId,
                    ]);
                    $record['id'] = (int)$foundId;
                } else {
                    $ins = $pdo->prepare("INSERT INTO users (name, email, password, role, level, exp, max_exp, points, streak, study_hours, completed_modules, progress_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $ins->execute([
                        $record['name'],
                        $record['email'],
                        password_hash('PandaBelajar2024!', PASSWORD_DEFAULT),
                        $record['role'],
                        $record['level'],
                        $record['exp'],
                        $record['max_exp'],
                        $record['points'],
                        $record['streak'],
                        $record['study_hours'],
                        $record['completed_modules'],
                        json_encode($record['progress']),
                    ]);
                    $record['id'] = (int)$pdo->lastInsertId();
                }

                $this->syncStudentToLeaderboard($record);
            } catch (\Throwable $e) {
            }
        }

        $jsonMap = $this->readJsonStore($this->getUserProgressJsonPath(), []);
        $jsonMap[$cleanEmail] = $record;
        $this->writeJsonStore($this->getUserProgressJsonPath(), $jsonMap);

        return $record;
    }

    protected function syncStudentToLeaderboard(array $record): void
    {
        if (!$this->isDbConnected()) {
            return;
        }
        try {
            $pdo = self::$pdoInstance;
            $totalExp = ($record['level'] - 1) * 500 + $record['exp'];
            $hskLabel = 'HSK ' . min(6, max(1, (int)$record['level']));

            if ($record['email'] === 'learner@mandarinku.com') {
                $stmt = $pdo->prepare("UPDATE smart_leaderboard SET name = ?, exp = ?, hsk_level = ? WHERE is_user = 1");
                $stmt->execute([$record['name'], $totalExp, $hskLabel]);
            } else {
                $stmt = $pdo->prepare("SELECT id FROM smart_leaderboard WHERE LOWER(name) = LOWER(?) LIMIT 1");
                $stmt->execute([$record['name']]);
                $lbId = $stmt->fetchColumn();
                if ($lbId) {
                    $upd = $pdo->prepare("UPDATE smart_leaderboard SET exp = ?, hsk_level = ? WHERE id = ?");
                    $upd->execute([$totalExp, $hskLabel, $lbId]);
                }
            }

            // Recompute rank_num ordered by exp DESC
            $rows = $pdo->query("SELECT id FROM smart_leaderboard ORDER BY exp DESC, id ASC")->fetchAll(\PDO::FETCH_COLUMN);
            $rankStmt = $pdo->prepare("UPDATE smart_leaderboard SET rank_num = ?, medal = ? WHERE id = ?");
            foreach ($rows as $idx => $id) {
                $rank = $idx + 1;
                $medal = $rank === 1 ? '🥇' : ($rank === 2 ? '🥈' : ($rank === 3 ? '🥉' : '🎖️'));
                $rankStmt->execute([$rank, $medal, $id]);
            }

            sync_fitur_cerdas_to_json();
        } catch (\Throwable $e) {
        }
    }

    public function recordQuizHistory(array $payload): array
    {
        $this->bootDatabase();

        $email = strtolower(trim((string)($payload['user_email'] ?? $payload['email'] ?? 'learner@mandarinku.com'))) ?: 'learner@mandarinku.com';
        $user = $this->getUserProgress($email);

        $totalQ = max(1, (int)($payload['total_questions'] ?? 10));
        $correctAns = max(0, min($totalQ, (int)($payload['correct_answers'] ?? 0)));
        $scorePercent = isset($payload['score_percent'])
            ? max(0, min(100, (int)$payload['score_percent']))
            : (int)round(($correctAns / $totalQ) * 100);

        $grade = trim((string)($payload['grade'] ?? ''));
        if ($grade === '') {
            $grade = $scorePercent >= 90 ? 'A+' : ($scorePercent >= 80 ? 'A' : ($scorePercent >= 70 ? 'B' : ($scorePercent >= 60 ? 'C' : 'D')));
        }

        $expEarned = max(0, (int)($payload['exp_earned'] ?? (($correctAns * 15) + ($scorePercent >= 80 ? 30 : 10))));
        $pointsEarned = max(0, (int)($payload['points_earned'] ?? (($correctAns * 10) + ($scorePercent >= 80 ? 20 : 5))));

        $record = [
            'user_email' => $email,
            'user_name' => trim((string)($payload['user_name'] ?? $user['name'] ?? 'Siswa Mandarinku')) ?: 'Siswa Mandarinku',
            'hsk_level' => trim((string)($payload['hsk_level'] ?? 'HSK 1')) ?: 'HSK 1',
            'skill_type' => trim((string)($payload['skill_type'] ?? 'all')) ?: 'all',
            'quiz_mode' => trim((string)($payload['quiz_mode'] ?? 'practice')) ?: 'practice',
            'total_questions' => $totalQ,
            'correct_answers' => $correctAns,
            'score_percent' => $scorePercent,
            'grade' => $grade,
            'exp_earned' => $expEarned,
            'points_earned' => $pointsEarned,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $insertedId = 0;
        if ($this->isDbConnected()) {
            try {
                $pdo = self::$pdoInstance;
                $stmt = $pdo->prepare("INSERT INTO quiz_histories (user_email, user_name, hsk_level, skill_type, quiz_mode, total_questions, correct_answers, score_percent, grade, exp_earned, points_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $record['user_email'],
                    $record['user_name'],
                    $record['hsk_level'],
                    $record['skill_type'],
                    $record['quiz_mode'],
                    $record['total_questions'],
                    $record['correct_answers'],
                    $record['score_percent'],
                    $record['grade'],
                    $record['exp_earned'],
                    $record['points_earned'],
                    $record['created_at'],
                ]);
                $insertedId = (int)$pdo->lastInsertId();
            } catch (\Throwable $e) {
            }
        }

        $histList = $this->readJsonStore($this->getQuizHistoryJsonPath(), []);
        if ($insertedId === 0) {
            $maxId = 0;
            foreach ($histList as $item) {
                $maxId = max($maxId, (int)($item['id'] ?? 0));
            }
            $insertedId = $maxId + 1;
        }
        $record['id'] = $insertedId;
        array_unshift($histList, $record);
        $this->writeJsonStore($this->getQuizHistoryJsonPath(), array_slice($histList, 0, 250));

        // Increment user XP & points unless frontend already persisted authoritative totals
        if (empty($payload['skip_user_increment'])) {
            $newExp = (int)$user['exp'] + $expEarned;
            $newMaxExp = max(100, (int)($user['max_exp'] ?? 500));
            $newLevel = max(1, (int)($user['level'] ?? 1));
            while ($newExp >= $newMaxExp) {
                $newLevel++;
                $newExp -= $newMaxExp;
                $newMaxExp = (int)round($newMaxExp * 1.4);
            }
            $user['level'] = $newLevel;
            $user['exp'] = $newExp;
            $user['max_exp'] = $newMaxExp;
            $user['points'] = (int)$user['points'] + $pointsEarned;
            $this->saveUserProgress($user);
        }

        return $record;
    }

    public function getQuizHistories(?string $email = null): array
    {
        $this->bootDatabase();
        $rows = [];

        if ($this->isDbConnected()) {
            try {
                $pdo = self::$pdoInstance;
                if ($email !== null && trim($email) !== '') {
                    $stmt = $pdo->prepare("SELECT * FROM quiz_histories WHERE LOWER(user_email) = LOWER(?) ORDER BY created_at DESC, id DESC");
                    $stmt->execute([trim($email)]);
                    $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                } else {
                    $rows = $pdo->query("SELECT * FROM quiz_histories ORDER BY created_at DESC, id DESC")->fetchAll(\PDO::FETCH_ASSOC);
                }
            } catch (\Throwable $e) {
                $rows = [];
            }
        }

        if (empty($rows)) {
            $allJson = $this->readJsonStore($this->getQuizHistoryJsonPath(), []);
            if ($email !== null && trim($email) !== '') {
                $target = strtolower(trim($email));
                $rows = array_values(array_filter($allJson, fn($r) => strtolower((string)($r['user_email'] ?? '')) === $target));
            } else {
                $rows = $allJson;
            }
        }

        return array_map(function ($r) {
            return [
                'id' => (int)($r['id'] ?? 0),
                'user_email' => strtolower((string)($r['user_email'] ?? '')),
                'user_name' => (string)($r['user_name'] ?? 'Siswa'),
                'hsk_level' => (string)($r['hsk_level'] ?? 'HSK 1'),
                'skill_type' => (string)($r['skill_type'] ?? 'all'),
                'quiz_mode' => (string)($r['quiz_mode'] ?? 'practice'),
                'total_questions' => (int)($r['total_questions'] ?? 0),
                'correct_answers' => (int)($r['correct_answers'] ?? 0),
                'score_percent' => (int)($r['score_percent'] ?? 0),
                'grade' => (string)($r['grade'] ?? 'B'),
                'exp_earned' => (int)($r['exp_earned'] ?? 0),
                'points_earned' => (int)($r['points_earned'] ?? 0),
                'created_at' => (string)($r['created_at'] ?? date('Y-m-d H:i:s')),
            ];
        }, $rows);
    }

    public function getAllUsersWithStats(): array
    {
        $this->bootDatabase();
        $users = [];

        if ($this->isDbConnected()) {
            try {
                $dbRows = self::$pdoInstance->query("SELECT * FROM users ORDER BY created_at DESC, id ASC")->fetchAll(\PDO::FETCH_ASSOC);
                foreach ($dbRows as $r) {
                    $email = strtolower((string)$r['email']);
                    $prog = !empty($r['progress_json']) ? json_decode($r['progress_json'], true) : null;
                    $users[$email] = [
                        'id' => (int)$r['id'],
                        'name' => $r['name'],
                        'email' => $email,
                        'role' => $r['role'] ?? 'student',
                        'level' => (int)($r['level'] ?? 1),
                        'exp' => (int)($r['exp'] ?? 0),
                        'max_exp' => (int)($r['max_exp'] ?? 500),
                        'points' => (int)($r['points'] ?? 0),
                        'streak' => (int)($r['streak'] ?? 1),
                        'study_hours' => (int)($r['study_hours'] ?? 1),
                        'completed_modules' => (int)($r['completed_modules'] ?? 0),
                        'progress' => is_array($prog) ? $prog : ['listening' => 0, 'speaking' => 0, 'reading' => 0, 'writing' => 0],
                        'created_at' => $r['created_at'] ?? date('Y-m-d H:i:s'),
                    ];
                }
            } catch (\Throwable $e) {
            }
        }

        if (empty($users)) {
            $jsonUsers = $this->readJsonStore($this->getUserProgressJsonPath(), []);
            foreach ($jsonUsers as $email => $u) {
                $users[strtolower($email)] = $u;
            }
        }

        $histories = $this->getQuizHistories();
        $statsByEmail = [];
        foreach ($histories as $h) {
            $em = strtolower($h['user_email']);
            if (!isset($statsByEmail[$em])) {
                $statsByEmail[$em] = ['count' => 0, 'sum_score' => 0, 'best_score' => 0, 'last_quiz_at' => null];
            }
            $statsByEmail[$em]['count']++;
            $statsByEmail[$em]['sum_score'] += (int)$h['score_percent'];
            $statsByEmail[$em]['best_score'] = max($statsByEmail[$em]['best_score'], (int)$h['score_percent']);
            if ($statsByEmail[$em]['last_quiz_at'] === null || $h['created_at'] > $statsByEmail[$em]['last_quiz_at']) {
                $statsByEmail[$em]['last_quiz_at'] = $h['created_at'];
            }
        }

        $result = [];
        foreach ($users as $email => $u) {
            $st = $statsByEmail[$email] ?? ['count' => 0, 'sum_score' => 0, 'best_score' => 0, 'last_quiz_at' => null];
            $avgScore = $st['count'] > 0 ? round($st['sum_score'] / $st['count'], 1) : 0;
            $u['quiz_count'] = $st['count'];
            $u['avg_score'] = $avgScore;
            $u['best_score'] = $st['best_score'];
            $u['last_quiz_at'] = $st['last_quiz_at'];
            $result[] = $u;
        }

        return $result;
    }

    public function getAllToneTrainer(): array
    {
        $this->bootDatabase();
        return get_all_tone_trainer();
    }

    public function getAllWordLink(): array
    {
        $this->bootDatabase();
        return get_all_word_link();
    }

    public function getAllMemoryMatch(): array
    {
        $this->bootDatabase();
        return get_all_memory_match();
    }

    public function getAllPinyinHanzi(): array
    {
        $this->bootDatabase();
        return get_all_pinyin_hanzi();
    }

    public function getAllHanziAnatomy(): array
    {
        $this->bootDatabase();
        return get_all_hanzi_anatomy();
    }

    public function getAllLeaderboard(): array
    {
        $this->bootDatabase();
        return get_all_leaderboard();
    }

    public function syncGameArenaToJson(): void
    {
        $this->bootDatabase();
        sync_game_arena_to_json();
    }

    public function syncFiturCerdasToJson(): void
    {
        $this->bootDatabase();
        sync_fitur_cerdas_to_json();
    }
}
