<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_layout.php';
require_admin();

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    http_response_code(404);
    exit('Booking not found.');
}

$stmt = $pdo->prepare("SELECT b.*, s.name AS service_name, s.duration_minutes, s.appointment_type, s.price_pence,
    c.label AS condition_label, t.display_name AS therapist_name
FROM bookings b
JOIN services s ON s.id=b.service_id
LEFT JOIN conditions c ON c.id=b.condition_id
LEFT JOIN therapists t ON t.id=b.therapist_id
WHERE b.id=? LIMIT 1");
$stmt->execute([$id]);
$booking = $stmt->fetch();
if (!$booking) {
    http_response_code(404);
    exit('Booking not found.');
}

$therapists = $pdo->query('SELECT id,display_name FROM therapists WHERE active=1 ORDER BY display_name')->fetchAll();

admin_header('Booking ' . $booking['booking_ref'], 'bookings');
?>
<div class="detail-top">
    <a class="back-link" href="bookings.php">← Back to bookings</a>
    <span class="status large <?= admin_status_class($booking['status']) ?>"><?= e(ucfirst($booking['status'])) ?></span>
</div>

<div class="detail-grid">
    <div class="detail-main">
        <section class="admin-card detail-card">
            <div class="card-head"><div><h2>Patient details</h2><p>Booking received <?= e(admin_format_date($booking['created_at'])) ?></p></div></div>
            <div class="info-grid">
                <div><small>Full name</small><strong><?= e($booking['full_name']) ?></strong></div>
                <div><small>Date of birth</small><strong><?= e(admin_format_date($booking['date_of_birth'])) ?></strong></div>
                <div><small>Email</small><strong><a href="mailto:<?= e($booking['email']) ?>"><?= e($booking['email']) ?></a></strong></div>
                <div><small>Phone</small><strong><a href="tel:<?= e($booking['phone']) ?>"><?= e($booking['phone']) ?></a></strong></div>
            </div>
        </section>

        <section class="admin-card detail-card">
            <div class="card-head"><div><h2>Visit address</h2></div></div>
            <div class="info-grid">
                <div><small>Address</small><strong><?= e($booking['address_line1']) ?></strong></div>
                <div><small>City / town</small><strong><?= e($booking['city']) ?></strong></div>
                <div><small>Postcode</small><strong><?= e($booking['postcode']) ?></strong></div>
                <div><small>Access details</small><strong><?= e($booking['access_details'] ?: 'None provided') ?></strong></div>
            </div>
        </section>

        <section class="admin-card detail-card">
            <div class="card-head"><div><h2>Clinical information</h2></div></div>
            <div class="info-grid">
                <div><small>Condition</small><strong><?= e($booking['condition_label'] ?: 'Not selected') ?></strong></div>
                <div><small>Issue duration</small><strong><?= e($booking['issue_duration'] ?: 'Not provided') ?></strong></div>
                <div><small>Pain level</small><strong><?= $booking['pain_level'] !== null ? (int)$booking['pain_level'] . ' / 10' : 'Not provided' ?></strong></div>
                <div><small>Mobility aid</small><strong><?= (int)$booking['mobility_aid'] ? 'Yes' : 'No' ?></strong></div>
                <div><small>Falls risk</small><strong><?= (int)$booking['fall_risk'] ? 'Yes' : 'No' ?></strong></div>
                <div class="span2"><small>Symptoms</small><strong><?= nl2br(e($booking['symptoms'] ?: 'Not provided')) ?></strong></div>
            </div>
        </section>
    </div>

    <aside class="detail-side">
        <section class="admin-card summary-admin">
            <h2>Appointment</h2>
            <dl>
                <dt>Reference</dt><dd><?= e($booking['booking_ref']) ?></dd>
                <dt>Service</dt><dd><?= e($booking['service_name']) ?></dd>
                <dt>Type</dt><dd><?= e($booking['appointment_type']) ?></dd>
                <dt>Duration</dt><dd><?= (int)$booking['duration_minutes'] ?> minutes</dd>
                <dt>Price</dt><dd>£<?= number_format(((int)$booking['price_pence'])/100, 2) ?></dd>
                <dt>Date</dt><dd><?= e(admin_format_date($booking['preferred_date'])) ?></dd>
                <dt>Time</dt><dd><?= e(admin_format_time($booking['preferred_time'])) ?></dd>
                <dt>Therapist</dt><dd><?= e($booking['therapist_name'] ?: 'No preference') ?></dd>
            </dl>
        </section>

        <section class="admin-card action-card">
            <h2>Manage booking</h2>
            <form action="update_booking.php" method="post">
                <input type="hidden" name="csrf_token" value="<?= e(admin_csrf_token()) ?>">
                <input type="hidden" name="booking_id" value="<?= (int)$booking['id'] ?>">

                <label>Status
                    <select name="status">
                        <?php foreach (['pending','confirmed','completed','cancelled'] as $s): ?>
                            <option value="<?= e($s) ?>" <?= $booking['status']===$s?'selected':'' ?>><?= e(ucfirst($s)) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>

                <label>Assign therapist
                    <select name="therapist_id">
                        <option value="">No preference / unassigned</option>
                        <?php foreach ($therapists as $therapist): ?>
                            <?php if ((int)$therapist['id'] === 1) continue; ?>
                            <option value="<?= (int)$therapist['id'] ?>" <?= (int)$booking['therapist_id']===(int)$therapist['id']?'selected':'' ?>><?= e($therapist['display_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>

                <button type="submit">Save Changes</button>
            </form>
        </section>

        <section class="admin-card contact-card-admin">
            <h2>Contact patient</h2>
            <a href="tel:<?= e($booking['phone']) ?>">☎ Call patient</a>
            <a href="mailto:<?= e($booking['email']) ?>">✉ Email patient</a>
        </section>
    </aside>
</div>
<?php admin_footer(); ?>
