-- Database Schema untuk Mandarinku
-- Simpan file ini jika sewaktu-waktu ingin mengimpor database baru atau backup

CREATE DATABASE IF NOT EXISTS `mandarinku` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mandarinku`;

-- Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Modules
CREATE TABLE IF NOT EXISTS `modules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `hsk_level` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `content` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Questions
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `module_id` INT NULL,
    `question_text` TEXT NOT NULL,
    `option_a` VARCHAR(255),
    `option_b` VARCHAR(255),
    `option_c` VARCHAR(255),
    `option_d` VARCHAR(255),
    `correct_answer` CHAR(1),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal: Akun Administrator
-- Email: admin@mandarinku.com
-- Password Default: admin123
INSERT INTO `users` (`name`, `email`, `password`, `role`) 
VALUES ('Administrator', 'admin@mandarinku.com', '$2y$10$o6jQ0d3Ue.fGz2f5E45Wb.Gv3hYyF7o1K/2R5vM0bF7uWbXl7zWaq', 'admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Data Contoh: Modul
INSERT INTO `modules` (`title`, `category`, `hsk_level`, `description`) VALUES
('Dasar HSK 1 - Kosakata Sehari-hari', 'reading', 'HSK 1', 'Mempelajari kata sapaan dan angka dasar dalam bahasa Mandarin.'),
('Dasar HSK 2 - Percakapan Restoran', 'speaking', 'HSK 2', 'Mempelajari kalimat pemesanan makanan dan menanyakan harga.')
ON DUPLICATE KEY UPDATE `id`=`id`;
