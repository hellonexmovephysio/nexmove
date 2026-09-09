<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';
date_default_timezone_set($config['site']['timezone'] ?? 'Europe/London');

if (!extension_loaded('pdo_sqlite')) {
    http_response_code(500);
    exit('<h2>NEXmove setup error</h2><p>PHP PDO SQLite is not enabled.</p><p>In XAMPP, open <b>php.ini</b>, enable <code>extension=pdo_sqlite</code> and <code>extension=sqlite3</code>, then restart Apache.</p>');
}

$dbPath = $config['database']['path'];
$dbDir = dirname($dbPath);
if (!is_dir($dbDir) && !mkdir($dbDir, 0775, true) && !is_dir($dbDir)) {
    throw new RuntimeException('Could not create database folder: ' . $dbDir);
}

$pdo = new PDO('sqlite:' . $dbPath, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('PRAGMA foreign_keys = ON');
$pdo->exec('PRAGMA busy_timeout = 5000');

$hasServices = (bool) $pdo->query("SELECT 1 FROM sqlite_master WHERE type='table' AND name='services'")->fetchColumn();
if (!$hasServices) {
    $schema = file_get_contents(dirname(__DIR__) . '/database/sqlite_schema.sql');
    if ($schema === false) {
        throw new RuntimeException('Database schema file is missing.');
    }
    $pdo->exec($schema);
}
