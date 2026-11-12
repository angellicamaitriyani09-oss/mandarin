-- Database: mandarinku
-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `mandarinku` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mandarinku`;

-- --------------------------------------------------------
-- 1. Struktur Tabel `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Struktur Tabel `modules`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `modules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `hsk_level` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `content` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Struktur Tabel `questions` (Bank Soal / Kuis)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `module_id` INT DEFAULT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` VARCHAR(255) DEFAULT NULL,
  `option_b` VARCHAR(255) DEFAULT NULL,
  `option_c` VARCHAR(255) DEFAULT NULL,
  `option_d` VARCHAR(255) DEFAULT NULL,
  `correct_answer` CHAR(1) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Data Awal (Akun Default Admin)
-- Password default: admin123 (hash BCRYPT PHP)
-- --------------------------------------------------------
INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Administrator', 'admin@mandarinku.com', '$2y$10$eACCYoNO2Z2jE9y1uT/q6OT8G1f7.W8sA9K4O3e37r1kH5/9o59Cq', 'admin');
