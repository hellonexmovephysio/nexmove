<?php
require __DIR__ . '/auth.php';

$statusFilter = trim($_GET['status'] ?? '');

if ($statusFilter !== '' && in_array($statusFilter, ['Pending', 'Confirmed', 'Completed', 'Cancelled'], true)) {
    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE status = ? ORDER BY appointment_date ASC, appointment_time ASC");
    $stmt->execute([$statusFilter]);
    $appointments = $stmt->fetchAll();
} else {
    $appointments = $pdo->query(
        "SELECT * FROM appointments ORDER BY appointment_date ASC, appointment_time ASC"
    )->fetchAll();
}

$countStmt = $pdo->query(
    "SELECT
        COUNT(*) AS total,
        SUM(status='Pending') AS pending,
        SUM(status='Confirmed') AS confirmed,
        SUM(status='Completed') AS completed,
        SUM(status='Cancelled') AS cancelled
     FROM appointments"
);
$counts = $countStmt->fetch();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Dashboard</title>
    <style>
        *{box-sizing:border-box}
        body{margin:0;font-family:Arial,sans-serif;background:#f3f6fa;color:#1f2937}
        .topbar{
            background:#0d3b66;
            color:#fff;
            padding:18px 26px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:16px;
        }
        .topbar h1{margin:0;font-size:24px}
        .topbar a{color:#fff;text-decoration:none;font-weight:700}
        .container{max-width:1300px;margin:28px auto;padding:0 18px}
        .stats{
            display:grid;
            grid-template-columns:repeat(5,1fr);
            gap:14px;
            margin-bottom:24px;
        }
        .stat{
            background:#fff;
            border-radius:12px;
            padding:18px;
            box-shadow:0 5px 18px rgba(0,0,0,.06);
        }
        .stat .number{font-size:28px;font-weight:800;color:#0d3b66}
        .filters{margin:0 0 18px;display:flex;gap:8px;flex-wrap:wrap}
        .filters a{
            display:inline-block;
            text-decoration:none;
            padding:8px 12px;
            border-radius:7px;
            background:#fff;
            color:#0d3b66;
            border:1px solid #dbe4ee;
        }
        .table-wrap{
            background:#fff;
            border-radius:12px;
            overflow:auto;
            box-shadow:0 5px 18px rgba(0,0,0,.06);
        }
        table{width:100%;border-collapse:collapse;min-width:1050px}
        th,td{padding:13px 12px;text-align:left;border-bottom:1px solid #e5e7eb;vertical-align:top}
        th{background:#eaf1f8;color:#0d3b66}
        .badge{
            display:inline-block;
            padding:5px 9px;
            border-radius:999px;
            font-size:12px;
            font-weight:700;
            background:#eef2f7;
        }
        .actions{display:flex;gap:6px;flex-wrap:wrap}
        .btn{
            display:inline-block;
            text-decoration:none;
            padding:7px 9px;
            border-radius:6px;
            font-size:12px;
            font-weight:700;
            color:#fff;
        }
        .edit{background:#2563eb}
        .delete{background:#dc2626}
        .empty{padding:30px;text-align:center;color:#64748b}
        @media(max-width:900px){.stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:520px){.stats{grid-template-columns:1fr}.topbar{align-items:flex-start;flex-direction:column}}
    </style>
</head>
<body>
    <div class="topbar">
        <div>
            <h1>Appointment Admin Panel</h1>
            <div>Welcome, <?= htmlspecialchars($_SESSION['admin_username']) ?></div>
        </div>
        <a href="logout.php">Logout</a>
    </div>

    <div class="container">
        <div class="stats">
            <div class="stat"><div>Total</div><div class="number"><?= (int)$counts['total'] ?></div></div>
            <div class="stat"><div>Pending</div><div class="number"><?= (int)$counts['pending'] ?></div></div>
            <div class="stat"><div>Confirmed</div><div class="number"><?= (int)$counts['confirmed'] ?></div></div>
            <div class="stat"><div>Completed</div><div class="number"><?= (int)$counts['completed'] ?></div></div>
            <div class="stat"><div>Cancelled</div><div class="number"><?= (int)$counts['cancelled'] ?></div></div>
        </div>

        <div class="filters">
            <a href="dashboard.php">All</a>
            <a href="?status=Pending">Pending</a>
            <a href="?status=Confirmed">Confirmed</a>
            <a href="?status=Completed">Completed</a>
            <a href="?status=Cancelled">Cancelled</a>
        </div>

        <div class="table-wrap">
            <?php if (!$appointments): ?>
                <div class="empty">No appointments found.</div>
            <?php else: ?>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Service</th>
                        <th>Date / Time</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Booked At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($appointments as $row): ?>
                        <tr>
                            <td><?= (int)$row['id'] ?></td>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td>
                                <?= htmlspecialchars($row['email']) ?><br>
                                <?= htmlspecialchars($row['phone']) ?>
                            </td>
                            <td><?= htmlspecialchars($row['service']) ?></td>
                            <td>
                                <?= htmlspecialchars(date('d M Y', strtotime($row['appointment_date']))) ?><br>
                                <?= htmlspecialchars(date('h:i A', strtotime($row['appointment_time']))) ?>
                            </td>
                            <td><?= nl2br(htmlspecialchars($row['message'] ?: '-')) ?></td>
                            <td><span class="badge"><?= htmlspecialchars($row['status']) ?></span></td>
                            <td><?= htmlspecialchars(date('d M Y h:i A', strtotime($row['created_at']))) ?></td>
                            <td>
                                <div class="actions">
                                    <a class="btn edit" href="edit.php?id=<?= (int)$row['id'] ?>">Edit</a>
                                    <a class="btn delete"
                                       href="delete.php?id=<?= (int)$row['id'] ?>"
                                       onclick="return confirm('Delete this appointment?')">Delete</a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
