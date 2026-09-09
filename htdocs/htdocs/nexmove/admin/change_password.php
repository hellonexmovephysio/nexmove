<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}

if (!admin_csrf_valid($_POST['csrf_token'] ?? null)) {
    http_response_code(419);
    exit('Your admin session expired.');
}

$current = (string)($_POST['current_password'] ?? '');
$new = (string)($_POST['new_password'] ?? '');
$confirm = (string)($_POST['confirm_password'] ?? '');
$userId = (int)$_SESSION['admin_user_id'];

$stmt = $pdo->prepare('SELECT password_hash FROM admin_users WHERE id=?');
$stmt->execute([$userId]);
$row = $stmt->fetch();

if (!$row || !password_verify($current, $row['password_hash'])) {
    admin_flash('error', 'Current password is incorrect.');
} elseif (strlen($new) < 10) {
    admin_flash('error', 'New password must be at least 10 characters.');
} elseif ($new !== $confirm) {
    admin_flash('error', 'New passwords do not match.');
} else {
    $hash = password_hash($new, PASSWORD_DEFAULT);
    $pdo->prepare('UPDATE admin_users SET password_hash=? WHERE id=?')->execute([$hash,$userId]);
    admin_flash('success', 'Admin password changed successfully.');
}

header('Location: settings.php');
exit;
