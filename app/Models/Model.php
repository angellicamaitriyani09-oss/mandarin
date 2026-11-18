<?php

namespace App\Models;

use App\Services\GameFeaturesService;

abstract class Model
{
    protected static string $table = '';

    protected static function pdo(): mixed
    {
        return (new GameFeaturesService())->getPdo();
    }

    public static function getTable(): string
    {
        return static::$table;
    }

    public static function all(string $orderBy = 'id DESC'): array
    {
        $pdo = self::pdo();
        if (!$pdo) {
            return [];
        }
        $table = static::getTable();
        return $pdo->query("SELECT * FROM `{$table}` ORDER BY {$orderBy}")->fetchAll(\PDO::FETCH_ASSOC);
    }

    public static function where(string $column, mixed $value, string $orderBy = 'id DESC'): array
    {
        $pdo = self::pdo();
        if (!$pdo) {
            return [];
        }
        $table = static::getTable();
        $stmt = $pdo->prepare("SELECT * FROM `{$table}` WHERE `{$column}` = ? ORDER BY {$orderBy}");
        $stmt->execute([$value]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public static function find(int|string $id): ?array
    {
        $pdo = self::pdo();
        if (!$pdo) {
            return null;
        }
        $table = static::getTable();
        $stmt = $pdo->prepare("SELECT * FROM `{$table}` WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public static function count(): int
    {
        $pdo = self::pdo();
        if (!$pdo) {
            return 0;
        }
        $table = static::getTable();
        try {
            return (int)$pdo->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn();
        } catch (\Throwable $e) {
            return 0;
        }
    }

    public static function create(array $attributes): int
    {
        $pdo = self::pdo();
        if (!$pdo || empty($attributes)) {
            return 0;
        }
        $table = static::getTable();
        $cols = array_keys($attributes);
        $colNames = implode(', ', array_map(fn($c) => "`{$c}`", $cols));
        $placeholders = implode(', ', array_fill(0, count($cols), '?'));
        $stmt = $pdo->prepare("INSERT INTO `{$table}` ({$colNames}) VALUES ({$placeholders})");
        $stmt->execute(array_values($attributes));
        return (int)$pdo->lastInsertId();
    }

    public static function updateById(int|string $id, array $attributes): bool
    {
        $pdo = self::pdo();
        if (!$pdo || empty($attributes)) {
            return false;
        }
        $table = static::getTable();
        $sets = implode(', ', array_map(fn($c) => "`{$c}` = ?", array_keys($attributes)));
        $values = array_values($attributes);
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE `{$table}` SET {$sets} WHERE id = ?");
        return $stmt->execute($values);
    }

    public static function destroy(int|string $id): bool
    {
        $pdo = self::pdo();
        if (!$pdo) {
            return false;
        }
        $table = static::getTable();
        $stmt = $pdo->prepare("DELETE FROM `{$table}` WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
