<?php

declare(strict_types=1);

function admin_header(string $title, string $active = ''): void
{
    global $pdo;
    $user = admin_user($pdo);
    $flash = admin_get_flash();
    $currentTitle = e($title);
    ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title><?= $currentTitle ?> | NEXmove Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <aside class="sidebar" id="sidebar">
        <a class="admin-brand" href="dashboard.php">
            <span class="brand-mark">N</span>
            <span><strong>NEX<span>move</span></strong><small>ADMIN PANEL</small></span>
        </a>

        <nav class="side-nav">
            <a class="<?= $active === 'dashboard' ? 'active' : '' ?>" href="dashboard.php"><span>⌂</span> Dashboard</a>
            <a class="<?= $active === 'bookings' ? 'active' : '' ?>" href="bookings.php"><span>▣</span> Bookings</a>
            <a class="<?= $active === 'settings' ? 'active' : '' ?>" href="settings.php"><span>⚙</span> Settings</a>
            <a href="../booking.php" target="_blank"><span>↗</span> Open Booking Page</a>
        </nav>

        <div class="sidebar-bottom">
            <div class="admin-profile">
                <div class="avatar"><?= e(strtoupper(substr($user['full_name'] ?? 'A', 0, 1))) ?></div>
                <div><strong><?= e($user['full_name'] ?? 'Administrator') ?></strong><small><?= e($user['email'] ?? '') ?></small></div>
            </div>
            <a class="logout-link" href="logout.php">Sign out</a>
        </div>
    </aside>

    <main class="admin-main">
        <header class="topbar">
            <button class="menu-button" type="button" id="menuButton" aria-label="Toggle menu">☰</button>
            <div><h1><?= $currentTitle ?></h1><p>NEXmove Physio administration</p></div>
            <a class="top-booking" href="../booking.php" target="_blank">+ New Booking</a>
        </header>

        <section class="admin-content">
            <?php if ($flash): ?>
                <div class="flash <?= e($flash['type']) ?>"><?= e($flash['message']) ?></div>
            <?php endif; ?>
<?php
}

function admin_footer(): void
{
    ?>
        </section>
    </main>
</div>
<script>
(function(){
    const btn = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) btn.addEventListener('click', () => sidebar.classList.toggle('open'));
})();
</script>
</body>
</html>
<?php
}
