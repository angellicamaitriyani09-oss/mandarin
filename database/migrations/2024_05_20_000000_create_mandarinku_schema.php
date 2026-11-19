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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['student', 'teacher', 'admin'])->default('student');
            $table->integer('level')->default(1);
            $table->integer('exp')->default(0);
            $table->integer('max_exp')->default(500);
            $table->integer('points')->default(0);
            $table->integer('streak')->default(1);
            $table->integer('study_hours')->default(1);
            $table->integer('completed_modules')->default(0);
            $table->text('progress_json')->nullable();
            $table->timestamps();
        });

        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category', 50)->default('komprehensif');
            $table->string('hsk_level', 30)->default('HSK 1');
            $table->text('description')->nullable();
            $table->string('author', 100)->default('Admin Mandarinku');
            $table->string('file_path')->nullable();
            $table->string('file_size', 50)->default('2.5 MB');
            $table->integer('downloads')->default(0);
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->integer('hsk_level')->default(1);
            $table->string('skill_type', 30)->default('reading');
            $table->text('question_text');
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c');
            $table->string('option_d');
            $table->string('correct_option', 5);
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        Schema::create('flashcards', function (Blueprint $table) {
            $table->id();
            $table->integer('level')->default(1);
            $table->string('hanzi', 50);
            $table->string('pinyin', 100);
            $table->text('meaning');
            $table->text('meaning_en')->nullable();
            $table->text('example')->nullable();
            $table->text('example_trans')->nullable();
            $table->timestamps();
        });

        Schema::create('game_tone_trainer', function (Blueprint $table) {
            $table->id();
            $table->integer('level')->default(1);
            $table->string('difficulty', 20)->default('easy');
            $table->string('hanzi', 50);
            $table->string('pinyin', 100);
            $table->integer('tone');
            $table->string('audio', 50);
            $table->string('meaning');
            $table->text('tip')->nullable();
            $table->timestamps();
        });

        Schema::create('game_word_link', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50);
            $table->string('difficulty', 20)->default('easy');
            $table->string('part_a', 50);
            $table->string('part_b', 50);
            $table->string('hanzi', 100);
            $table->string('pinyin', 100);
            $table->string('meaning');
            $table->timestamps();
        });

        Schema::create('game_memory_match', function (Blueprint $table) {
            $table->id();
            $table->string('session_key', 50)->default('session1');
            $table->string('difficulty', 20)->default('easy');
            $table->string('hanzi', 50);
            $table->string('text_pair', 150);
            $table->timestamps();
        });

        Schema::create('game_pinyin_hanzi', function (Blueprint $table) {
            $table->id();
            $table->integer('level')->default(1);
            $table->string('difficulty', 20)->default('easy');
            $table->string('hanzi', 50);
            $table->string('pinyin', 100);
            $table->string('meaning');
            $table->string('audio', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('smart_hanzi_anatomy', function (Blueprint $table) {
            $table->id();
            $table->integer('level')->default(1);
            $table->string('char_hanzi', 50);
            $table->string('pinyin', 100);
            $table->string('meaning');
            $table->string('rad_a', 100);
            $table->string('rad_b', 100);
            $table->text('story');
            $table->timestamps();
        });

        Schema::create('smart_leaderboard', function (Blueprint $table) {
            $table->id();
            $table->integer('rank_num');
            $table->string('name', 100);
            $table->integer('exp');
            $table->string('hsk_level', 50);
            $table->string('avatar', 50);
            $table->string('medal', 50);
            $table->boolean('is_user')->default(false);
            $table->timestamps();
        });

        Schema::create('quiz_histories', function (Blueprint $table) {
            $table->id();
            $table->string('user_email', 100);
            $table->string('user_name', 100);
            $table->string('hsk_level', 30);
            $table->string('skill_type', 50)->default('all');
            $table->string('quiz_mode', 30)->default('practice');
            $table->integer('total_questions')->default(10);
            $table->integer('correct_answers')->default(0);
            $table->integer('score_percent')->default(0);
            $table->string('grade', 10)->default('A');
            $table->integer('exp_earned')->default(0);
            $table->integer('points_earned')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_histories');
        Schema::dropIfExists('smart_leaderboard');
        Schema::dropIfExists('smart_hanzi_anatomy');
        Schema::dropIfExists('game_pinyin_hanzi');
        Schema::dropIfExists('game_memory_match');
        Schema::dropIfExists('game_word_link');
        Schema::dropIfExists('game_tone_trainer');
        Schema::dropIfExists('flashcards');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('users');
    }
};
