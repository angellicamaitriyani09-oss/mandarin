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

        self::$initialized = true;
    }

    public function getPdo(): mixed
    {
        $this->bootDatabase();
        return self::$pdoInstance;
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
                points INT DEFAULT 0,
                streak INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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

            $pdo->exec("CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                hsk_level INT DEFAULT 1,
                skill_type VARCHAR(30) DEFAULT 'reading',
                question_text TEXT NOT NULL,
                option_a VARCHAR(255) NOT NULL,
                option_b VARCHAR(255) NOT NULL,
                option_c VARCHAR(255) NOT NULL,
                option_d VARCHAR(255) NOT NULL,
                correct_option VARCHAR(5) NOT NULL,
                explanation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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
        } catch (\Throwable $e) {
            // Ignore table init errors if non-fatal
        }
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
