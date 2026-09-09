<?php

declare(strict_types=1);

if (!isset($config)) {
    $config = require __DIR__ . '/config.php';
}

$db = $config['db'];
$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
    $db['host'],
    $db['port'],
    $db['name'],
    $db['charset']
);

try {
    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    exit(
        '<h2>Database connection failed</h2>' .
        '<p>Please create/import the <strong>nexmove_physio</strong> database and check <code>includes/config.php</code>.</p>'
    );
}
