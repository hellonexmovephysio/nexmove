<?php
require __DIR__ . '/auth.php';

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);

$stmt = $pdo->prepare("SELECT * FROM appointments WHERE id = ?");
$stmt->execute([$id]);
$appointment = $stmt->fetch();

if (!$appointment) {
    exit('Appointment not found.');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $status = $_POST['status'] ?? '';

    if (!in_array($status, ['Pending', 'Confirmed', 'Completed', 'Cancelled'], true)) {
        $error = 'Invalid status.';
    } else {
        $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        header('Location: dashboard.php');
        exit;
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edit Appointment</title>
    <style>
        body{font-family:Arial,sans-serif;background:#f3f6fa;margin:0;padding:30px}
        .card{max-width:600px;margin:auto;background:white;padding:25px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,.08)}
        h1{color:#0d3b66}
        .row{margin:10px 0}
        .label{font-weight:bold}
        select{width:100%;padding:12px;margin-top:8px;border:1px solid #ccc;border-radius:7px}
        button{margin-top:15px;background:#0d3b66;color:white;border:0;padding:12px 18px;border-radius:7px;cursor:pointer}
        a{color:#0d3b66}
        .error{background:#fee2e2;color:#991b1b;padding:10px}
    </style>
</head>
<body>
<div class="card">
    <h1>Edit Appointment</h1>

    <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <div class="row"><span class="label">Customer:</span> <?= htmlspecialchars($appointment['name']) ?></div>
    <div class="row"><span class="label">Service:</span> <?= htmlspecialchars($appointment['service']) ?></div>
    <div class="row">
        <span class="label">Appointment:</span>
        <?= htmlspecialchars($appointment['appointment_date']) ?>
        <?= htmlspecialchars($appointment['appointment_time']) ?>
    </div>

    <form method="post">
        <input type="hidden" name="id" value="<?= (int)$appointment['id'] ?>">

        <label class="label">Status</label>
        <select name="status">
            <?php foreach (['Pending','Confirmed','Completed','Cancelled'] as $status): ?>
                <option value="<?= $status ?>" <?= $appointment['status'] === $status ? 'selected' : '' ?>>
                    <?= $status ?>
                </option>
            <?php endforeach; ?>
        </select>

        <button type="submit">Save Changes</button>
    </form>

    <p><a href="dashboard.php">← Back to dashboard</a></p>
</div>
</body>
</html>
