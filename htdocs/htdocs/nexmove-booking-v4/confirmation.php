<?php

declare(strict_types=1);
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/db.php';

start_secure_session();
$ref = clean_string($_GET['ref'] ?? '', 32);
$allowedRef = $_SESSION['last_booking_ref'] ?? '';
$booking = null;
if ($ref !== '' && hash_equals((string)$allowedRef, $ref)) {
    $stmt = $pdo->prepare('SELECT b.*, s.name AS service_name, s.duration_minutes, s.appointment_type, s.price_pence
                           FROM bookings b JOIN services s ON s.id=b.service_id
                           WHERE b.booking_ref=:ref LIMIT 1');
    $stmt->execute([':ref' => $ref]);
    $booking = $stmt->fetch();
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Booking Confirmation | NEXmove</title>
<link rel="stylesheet" href="assets/styles.css">
</head>
<body class="confirmation-page">
<div class="confirmation-card">
    <div class="confirm-tick">✓</div>
    <?php if ($booking): ?>
        <p class="eyebrow">NEXmove Physio</p>
        <h1>Booking request received</h1>
        <p>Thank you, <strong><?= e($booking['full_name']) ?></strong>. Your request has been saved successfully.</p>
        <div class="confirm-ref">Reference: <strong><?= e($booking['booking_ref']) ?></strong></div>
        <dl class="confirmation-details">
            <div><dt>Service</dt><dd><?= e($booking['service_name']) ?></dd></div>
            <div><dt>Preferred date</dt><dd><?= e(date('d M Y', strtotime($booking['preferred_date']))) ?></dd></div>
            <div><dt>Preferred time</dt><dd><?= e($booking['preferred_time']) ?></dd></div>
            <div><dt>Visit address</dt><dd><?= e($booking['address_line1']) ?>, <?= e($booking['city']) ?>, <?= e($booking['postcode']) ?></dd></div>
        </dl>
        <p class="small-note">This page confirms the request was stored in the local database. You can add email/SMS confirmation later.</p>
    <?php else: ?>
        <h1>Confirmation not available</h1>
        <p>Please return to the booking page and submit the form again.</p>
    <?php endif; ?>
    <a class="back-btn" href="index.php">← Back to booking page</a>
</div>
</body>
</html>
