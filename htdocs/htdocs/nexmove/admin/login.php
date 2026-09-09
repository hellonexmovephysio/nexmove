<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';

if (admin_logged_in() && admin_user($pdo)) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');

    if (!admin_csrf_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your login session expired. Please try again.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        $error = 'Enter your email address and password.';
    } else {
        $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, active FROM admin_users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if ($admin && (int)$admin['active'] === 1 && password_verify($password, $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_user_id'] = (int)$admin['id'];
            $_SESSION['admin_csrf_token'] = bin2hex(random_bytes(32));

            $pdo->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([(int)$admin['id']]);

            $next = (string)($_GET['next'] ?? $_POST['next'] ?? 'dashboard.php');
            if ($next === '' || str_contains($next, '://') || str_starts_with($next, '//')) {
                $next = 'dashboard.php';
            }
            header('Location: ' . $next);
            exit;
        }

        $error = 'Incorrect email or password.';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Login | NEXmove Physio</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body class="login-page">
<div class="login-wrap">
    <div class="login-brand">
        <span class="brand-mark">N</span>
        <div><strong>NEX<span>move</span></strong><small>PHYSIO ADMIN</small></div>
    </div>
    <div class="login-card">
        <span class="login-kicker">SECURE ADMIN ACCESS</span>
        <h1>Welcome back</h1>
        <p>Sign in to manage patient booking requests.</p>

        <?php if ($error): ?><div class="login-error"><?= e($error) ?></div><?php endif; ?>

        <form method="post" autocomplete="on">
            <input type="hidden" name="csrf_token" value="<?= e(admin_csrf_token()) ?>">
            <input type="hidden" name="next" value="<?= e((string)($_GET['next'] ?? 'dashboard.php')) ?>">
            <label>Email address<input type="email" name="email" value="<?= e($email) ?>" autocomplete="username" required></label>
            <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
            <button type="submit">Sign in to Admin Panel</button>
        </form>
        <div class="login-help">Default first login: <b>admin@nexmove.local</b> / <b>NEXmove@123</b><br>Change this password before using the site publicly.</div>
    </div>
    <a class="back-site" href="../booking.php">← Back to booking page</a>
</div>
</body>
</html>
