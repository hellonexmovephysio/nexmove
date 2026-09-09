<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/db.php';

function admin_logged_in(): bool
{
    return !empty($_SESSION['admin_user_id']);
}

function require_admin(): void
{
    if (!admin_logged_in()) {
        $next = urlencode($_SERVER['REQUEST_URI'] ?? 'dashboard.php');
        header('Location: login.php?next=' . $next);
        exit;
    }
}

function admin_user(PDO $pdo): ?array
{
    if (!admin_logged_in()) {
        return null;
    }

    static $user = null;
    if ($user !== null) {
        return $user;
    }

    $stmt = $pdo->prepare('SELECT id, full_name, email, active FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$_SESSION['admin_user_id']]);
    $user = $stmt->fetch() ?: null;

    if (!$user || !(int)$user['active']) {
        unset($_SESSION['admin_user_id']);
        return null;
    }

    return $user;
}

function admin_csrf_token(): string
{
    if (empty($_SESSION['admin_csrf_token'])) {
        $_SESSION['admin_csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['admin_csrf_token'];
}

function admin_csrf_valid(?string $token): bool
{
    return is_string($token)
        && isset($_SESSION['admin_csrf_token'])
        && hash_equals($_SESSION['admin_csrf_token'], $token);
}

function admin_flash(string $type, string $message): void
{
    $_SESSION['admin_flash'] = ['type' => $type, 'message' => $message];
}

function admin_get_flash(): ?array
{
    $flash = $_SESSION['admin_flash'] ?? null;
    unset($_SESSION['admin_flash']);
    return is_array($flash) ? $flash : null;
}

function admin_status_class(string $status): string
{
    return match ($status) {
        'confirmed' => 'status-confirmed',
        'completed' => 'status-completed',
        'cancelled' => 'status-cancelled',
        default => 'status-pending',
    };
}

function admin_format_date(?string $date): string
{
    if (!$date) return '—';
    $ts = strtotime($date);
    return $ts ? date('d M Y', $ts) : $date;
}

function admin_format_time(?string $time): string
{
    if (!$time) return '—';
    $ts = strtotime($time);
    return $ts ? date('g:i A', $ts) : $time;
}
