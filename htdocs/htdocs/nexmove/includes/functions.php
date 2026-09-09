<?php

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$config = require __DIR__ . '/config.php';

function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_valid(?string $token): bool
{
    return is_string($token)
        && isset($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

function post_string(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

function post_int(string $key): ?int
{
    $value = $_POST[$key] ?? null;
    if ($value === null || $value === '') {
        return null;
    }
    $filtered = filter_var($value, FILTER_VALIDATE_INT);
    return $filtered === false ? null : (int)$filtered;
}

function make_booking_ref(): string
{
    return 'NEX-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
}
