<?php
require_once '../config/database.php';

try {
    // Create Users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create Modules table
    $pdo->exec("CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        hsk_level VARCHAR(50) NOT NULL,
        description TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create Questions table (Bank Soal)
    $pdo->exec("CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module_id INT,
        question_text TEXT NOT NULL,
        option_a VARCHAR(255),
        option_b VARCHAR(255),
        option_c VARCHAR(255),
        option_d VARCHAR(255),
        correct_answer CHAR(1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )");

    // Insert a default admin user (password: admin123)
    $password = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (name, email, password, role) VALUES ('Administrator', 'admin@mandarinku.com', ?, 'admin')");
    $stmt->execute([$password]);

    echo "<h3>Database tables created successfully!</h3>";
    echo "<p>Default Admin Account:<br>Email: <b>admin@mandarinku.com</b><br>Password: <b>admin123</b></p>";
    echo "<a href='login.php'>Go to Admin Login</a>";

} catch (PDOException $e) {
    die("Error creating database: " . $e->getMessage());
}
?>
