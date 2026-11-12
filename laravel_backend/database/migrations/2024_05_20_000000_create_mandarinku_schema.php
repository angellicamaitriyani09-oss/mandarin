<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for Mandarinku application schema.
     */
    public function up(): void
    {
        // 1. Users Table with Role-Based Access Control
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['student', 'teacher', 'admin'])->default('student');
            $table->integer('level')->default(1);
            $table->integer('exp')->default(0);
            $table->integer('points')->default(0);
            $table->integer('streak_days')->default(0);
            $table->integer('study_minutes_target')->default(20);
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Modul Ajar (Learning Modules & Materials)
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Teacher / Admin Owner
            $table->string('title');
            $table->enum('category', ['listening', 'speaking', 'reading', 'writing']);
            $table->string('hsk_level', 10); // HSK 1, HSK 2, ..., HSK 6
            $table->text('description');
            $table->string('file_path')->nullable(); // PDF / Resource file
            $table->string('audio_path')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });

        // 3. Modul Comments & Reviews
        Schema::create('module_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('comment');
            $table->tinyInteger('rating')->default(5);
            $table->timestamps();
        });

        // 4. Bank Soal & Quizzes (HSK 1 - 6)
        Schema::create('question_banks', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('hsk_level'); // 1 - 6
            $table->enum('skill_type', ['listening', 'speaking', 'reading', 'writing']);
            $table->text('question');
            $table->text('pinyin')->nullable();
            $table->string('audio_url')->nullable();
            $table->json('options'); // ['A' => '...', 'B' => '...']
            $table->string('correct_answer');
            $table->text('explanation');
            $table->timestamps();
        });

        // 5. User Progress & Daily Study Tracking
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('study_date');
            $table->integer('minutes_spent')->default(0);
            $table->integer('listening_score')->default(0);
            $table->integer('speaking_score')->default(0);
            $table->integer('reading_score')->default(0);
            $table->integer('writing_score')->default(0);
            $table->timestamps();
        });

        // 6. Speaking Recordings & Pronunciation Feedback
        Schema::create('speaking_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('target_text');
            $table->string('recording_url')->nullable();
            $table->integer('accuracy_percentage')->default(0);
            $table->text('ai_feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speaking_submissions');
        Schema::dropIfExists('user_progress');
        Schema::dropIfExists('question_banks');
        Schema::dropIfExists('module_comments');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('users');
    }
};
