<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_layout.php';
require_admin();

$stats = $pdo->query("SELECT
    COUNT(*) AS total,
    SUM(status='pending') AS pending,
    SUM(status='confirmed') AS confirmed,
    SUM(status='completed') AS completed,
    SUM(status='cancelled') AS cancelled,
    SUM(preferred_date = CURDATE() AND status <> 'cancelled') AS today
FROM bookings")->fetch();

$upcoming = $pdo->query("SELECT b.id,b.booking_ref,b.full_name,b.phone,b.preferred_date,b.preferred_time,b.status,s.name AS service_name
FROM bookings b
JOIN services s ON s.id=b.service_id
WHERE b.preferred_date >= CURDATE() AND b.status <> 'cancelled'
ORDER BY b.preferred_date ASC,b.preferred_time ASC,b.id DESC
LIMIT 8")->fetchAll();

$recent = $pdo->query("SELECT b.id,b.booking_ref,b.full_name,b.created_at,b.status,s.name AS service_name
FROM bookings b
JOIN services s ON s.id=b.service_id
ORDER BY b.created_at DESC,b.id DESC
LIMIT 6")->fetchAll();

admin_header('Dashboard', 'dashboard');
?>
<div class="stat-grid">
    <a class="stat-card" href="bookings.php"><span class="stat-icon">▣</span><div><small>Total Bookings</small><strong><?= (int)($stats['total'] ?? 0) ?></strong></div></a>
    <a class="stat-card pending" href="bookings.php?status=pending"><span class="stat-icon">◷</span><div><small>Pending</small><strong><?= (int)($stats['pending'] ?? 0) ?></strong></div></a>
    <a class="stat-card confirmed" href="bookings.php?status=confirmed"><span class="stat-icon">✓</span><div><small>Confirmed</small><strong><?= (int)($stats['confirmed'] ?? 0) ?></strong></div></a>
    <a class="stat-card today" href="bookings.php?date=today"><span class="stat-icon">◫</span><div><small>Appointments Today</small><strong><?= (int)($stats['today'] ?? 0) ?></strong></div></a>
</div>

<div class="dashboard-grid">
    <section class="admin-card">
        <div class="card-head"><div><h2>Upcoming appointments</h2><p>Next scheduled patient requests</p></div><a href="bookings.php">View all</a></div>
        <div class="table-wrap">
            <table class="admin-table">
                <thead><tr><th>Patient</th><th>Service</th><th>Date & time</th><th>Status</th><th></th></tr></thead>
                <tbody>
                <?php if (!$upcoming): ?>
                    <tr><td colspan="5" class="empty-cell">No upcoming appointments yet.</td></tr>
                <?php else: foreach ($upcoming as $row): ?>
                    <tr>
                        <td><strong><?= e($row['full_name']) ?></strong><small><?= e($row['booking_ref']) ?></small></td>
                        <td><?= e($row['service_name']) ?></td>
                        <td><?= e(admin_format_date($row['preferred_date'])) ?><small><?= e(admin_format_time($row['preferred_time'])) ?></small></td>
                        <td><span class="status <?= admin_status_class($row['status']) ?>"><?= e(ucfirst($row['status'])) ?></span></td>
                        <td><a class="view-link" href="booking.php?id=<?= (int)$row['id'] ?>">View</a></td>
                    </tr>
                <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
    </section>

    <section class="admin-card recent-card">
        <div class="card-head"><div><h2>Recent requests</h2><p>Latest submitted bookings</p></div></div>
        <div class="recent-list">
            <?php if (!$recent): ?><div class="empty-state">No bookings received yet.</div><?php endif; ?>
            <?php foreach ($recent as $row): ?>
                <a href="booking.php?id=<?= (int)$row['id'] ?>">
                    <span class="patient-dot"><?= e(strtoupper(substr($row['full_name'],0,1))) ?></span>
                    <span><strong><?= e($row['full_name']) ?></strong><small><?= e($row['booking_ref']) ?> · <?= e(admin_format_date($row['created_at'])) ?></small></span>
                    <span class="status <?= admin_status_class($row['status']) ?>"><?= e(ucfirst($row['status'])) ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
</div>
<?php admin_footer(); ?>
