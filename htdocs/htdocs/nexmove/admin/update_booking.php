<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}

if (!admin_csrf_valid($_POST['csrf_token'] ?? null)) {
    http_response_code(419);
    exit('Your admin session expired. Please go back and try again.');
}

$bookingId = filter_var($_POST['booking_id'] ?? null, FILTER_VALIDATE_INT);
$status = trim((string)($_POST['status'] ?? ''));
$therapistRaw = $_POST['therapist_id'] ?? '';
$therapistId = $therapistRaw === '' ? null : filter_var($therapistRaw, FILTER_VALIDATE_INT);
$allowed = ['pending','confirmed','completed','cancelled'];

if (!$bookingId || !in_array($status, $allowed, true)) {
    admin_flash('error', 'Invalid booking update.');
    header('Location: bookings.php');
    exit;
}

if ($therapistId !== null) {
    $check = $pdo->prepare('SELECT id FROM therapists WHERE id=? AND active=1');
    $check->execute([$therapistId]);
    if (!$check->fetch()) $therapistId = null;
}

$stmt = $pdo->prepare('UPDATE bookings SET status=:status, therapist_id=:therapist_id WHERE id=:id');
$stmt->bindValue(':status', $status, PDO::PARAM_STR);
if ($therapistId === null) {
    $stmt->bindValue(':therapist_id', null, PDO::PARAM_NULL);
} else {
    $stmt->bindValue(':therapist_id', (int)$therapistId, PDO::PARAM_INT);
}
$stmt->bindValue(':id', (int)$bookingId, PDO::PARAM_INT);
$stmt->execute();

admin_flash('success', 'Booking updated successfully.');
header('Location: booking.php?id=' . (int)$bookingId);
exit;
