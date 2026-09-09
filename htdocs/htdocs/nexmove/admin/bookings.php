<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_layout.php';
require_admin();

$status = trim((string)($_GET['status'] ?? ''));
$q = trim((string)($_GET['q'] ?? ''));
$dateFilter = trim((string)($_GET['date'] ?? ''));
$allowedStatuses = ['pending','confirmed','completed','cancelled'];

$where = [];
$params = [];
if (in_array($status, $allowedStatuses, true)) {
    $where[] = 'b.status = :status';
    $params[':status'] = $status;
}
if ($q !== '') {
    $where[] = '(b.booking_ref LIKE :q OR b.full_name LIKE :q OR b.email LIKE :q OR b.phone LIKE :q OR b.postcode LIKE :q OR b.city LIKE :q)';
    $params[':q'] = '%' . $q . '%';
}
if ($dateFilter === 'today') {
    $where[] = 'b.preferred_date = CURDATE()';
}

$sql = "SELECT b.*, s.name AS service_name, c.label AS condition_label, t.display_name AS therapist_name
FROM bookings b
JOIN services s ON s.id = b.service_id
LEFT JOIN conditions c ON c.id = b.condition_id
LEFT JOIN therapists t ON t.id = b.therapist_id";
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY CASE WHEN b.preferred_date >= CURDATE() THEN 0 ELSE 1 END, b.preferred_date ASC, b.preferred_time ASC, b.created_at DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$bookings = $stmt->fetchAll();

$countRows = $pdo->query('SELECT status,COUNT(*) AS c FROM bookings GROUP BY status')->fetchAll();
$counts = ['all'=>0,'pending'=>0,'confirmed'=>0,'completed'=>0,'cancelled'=>0];
foreach ($countRows as $r) {
    $counts[$r['status']] = (int)$r['c'];
    $counts['all'] += (int)$r['c'];
}

admin_header('Bookings', 'bookings');
?>
<div class="booking-toolbar admin-card">
    <form class="search-form" method="get">
        <?php if ($status): ?><input type="hidden" name="status" value="<?= e($status) ?>"><?php endif; ?>
        <?php if ($dateFilter): ?><input type="hidden" name="date" value="<?= e($dateFilter) ?>"><?php endif; ?>
        <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search name, reference, phone, email, postcode...">
        <button type="submit">Search</button>
        <?php if ($q !== '' || $status !== '' || $dateFilter !== ''): ?><a class="clear-link" href="bookings.php">Clear</a><?php endif; ?>
    </form>
</div>

<div class="filter-tabs">
    <a class="<?= $status==='' && $dateFilter===''?'active':'' ?>" href="bookings.php">All <b><?= $counts['all'] ?></b></a>
    <a class="<?= $status==='pending'?'active':'' ?>" href="bookings.php?status=pending">Pending <b><?= $counts['pending'] ?></b></a>
    <a class="<?= $status==='confirmed'?'active':'' ?>" href="bookings.php?status=confirmed">Confirmed <b><?= $counts['confirmed'] ?></b></a>
    <a class="<?= $status==='completed'?'active':'' ?>" href="bookings.php?status=completed">Completed <b><?= $counts['completed'] ?></b></a>
    <a class="<?= $status==='cancelled'?'active':'' ?>" href="bookings.php?status=cancelled">Cancelled <b><?= $counts['cancelled'] ?></b></a>
    <a class="<?= $dateFilter==='today'?'active':'' ?>" href="bookings.php?date=today">Today</a>
</div>

<section class="admin-card">
    <div class="card-head"><div><h2>Patient bookings</h2><p><?= count($bookings) ?> result<?= count($bookings) === 1 ? '' : 's' ?></p></div></div>
    <div class="table-wrap">
        <table class="admin-table bookings-table">
            <thead><tr><th>Reference</th><th>Patient</th><th>Service</th><th>Appointment</th><th>Location</th><th>Status</th><th></th></tr></thead>
            <tbody>
            <?php if (!$bookings): ?>
                <tr><td colspan="7" class="empty-cell">No bookings match your filters.</td></tr>
            <?php else: foreach ($bookings as $row): ?>
                <tr>
                    <td><strong><?= e($row['booking_ref']) ?></strong><small>Received <?= e(admin_format_date($row['created_at'])) ?></small></td>
                    <td><strong><?= e($row['full_name']) ?></strong><small><?= e($row['phone']) ?><br><?= e($row['email']) ?></small></td>
                    <td><?= e($row['service_name']) ?><small><?= e($row['condition_label'] ?? 'No condition selected') ?></small></td>
                    <td><strong><?= e(admin_format_date($row['preferred_date'])) ?></strong><small><?= e(admin_format_time($row['preferred_time'])) ?></small></td>
                    <td><?= e($row['city']) ?><small><?= e($row['postcode']) ?></small></td>
                    <td><span class="status <?= admin_status_class($row['status']) ?>"><?= e(ucfirst($row['status'])) ?></span></td>
                    <td><a class="view-link" href="booking.php?id=<?= (int)$row['id'] ?>">Open →</a></td>
                </tr>
            <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</section>
<?php admin_footer(); ?>
