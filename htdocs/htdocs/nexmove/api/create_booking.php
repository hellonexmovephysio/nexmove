<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}

if (!csrf_valid($_POST['csrf_token'] ?? null)) {
    http_response_code(419);
    exit('Your form session expired. Please go back, refresh the booking page and try again.');
}

$serviceId      = post_int('service_id');
$fullName       = post_string('full_name');
$email          = post_string('email');
$phone          = post_string('phone');
$dateOfBirth    = post_string('date_of_birth');
$postcode       = strtoupper(post_string('postcode'));
$addressLine1   = post_string('address_line1');
$city           = post_string('city');
$accessDetails  = post_string('access_details');
$conditionId    = post_int('condition_id');
$issueDuration  = post_string('issue_duration');
$painLevel      = post_int('pain_level');
$symptoms       = post_string('symptoms');
$mobilityAid    = isset($_POST['mobility_aid']) ? 1 : 0;
$fallRisk       = isset($_POST['fall_risk']) ? 1 : 0;
$preferredDate  = post_string('preferred_date');
$preferredSlot  = post_string('preferred_time');
$therapistId    = post_int('therapist_id');
$consentPrivacy = isset($_POST['consent_privacy']) ? 1 : 0;
$consentUpdates = isset($_POST['consent_updates']) ? 1 : 0;

$errors = [];

if (!$serviceId) $errors[] = 'Please choose a service.';
if ($fullName === '') $errors[] = 'Full name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
if ($phone === '') $errors[] = 'Phone number is required.';
if ($dateOfBirth === '') $errors[] = 'Date of birth is required.';
if ($postcode === '') $errors[] = 'Postcode is required.';
if ($addressLine1 === '') $errors[] = 'Address is required.';
if ($city === '') $errors[] = 'City / town is required.';
if ($preferredDate === '') $errors[] = 'Preferred date is required.';
if (!$consentPrivacy) $errors[] = 'You must agree to the Privacy Policy and Terms & Conditions.';

$today = date('Y-m-d');
if ($preferredDate !== '' && $preferredDate < $today) {
    $errors[] = 'Preferred appointment date cannot be in the past.';
}

if ($painLevel !== null && ($painLevel < 0 || $painLevel > 10)) {
    $errors[] = 'Pain level must be between 0 and 10.';
}

$slotTimes = [
    'Morning (9am–12pm)' => '09:00:00',
    'Afternoon (12pm–5pm)' => '12:00:00',
    'Evening (5pm–8pm)' => '17:00:00',
];

if (!isset($slotTimes[$preferredSlot])) {
    $errors[] = 'Please choose a preferred time.';
}

if ($serviceId) {
    $stmt = $pdo->prepare('SELECT id FROM services WHERE id = ? AND active = 1');
    $stmt->execute([$serviceId]);
    if (!$stmt->fetch()) $errors[] = 'Selected service is not available.';
}

if ($conditionId !== null) {
    $stmt = $pdo->prepare('SELECT id FROM conditions WHERE id = ? AND active = 1');
    $stmt->execute([$conditionId]);
    if (!$stmt->fetch()) $conditionId = null;
}

if ($therapistId !== null) {
    $stmt = $pdo->prepare('SELECT id FROM therapists WHERE id = ? AND active = 1');
    $stmt->execute([$therapistId]);
    if (!$stmt->fetch()) $therapistId = null;
}

if ($errors) {
    http_response_code(422);
    echo '<!doctype html><html><head><meta charset="utf-8"><title>Booking Error</title>';
    echo '<style>body{font-family:Cambria,Georgia,serif;background:#f5f7fa;color:#12263a;padding:40px}.box{max-width:700px;margin:auto;background:#fff;padding:30px;border-radius:18px;box-shadow:0 12px 35px rgba(0,0,0,.08)}a{color:#0f4c81}</style></head><body><div class="box">';
    echo '<h1>Please check your booking</h1><ul>';
    foreach ($errors as $error) echo '<li>' . e($error) . '</li>';
    echo '</ul><p><a href="../booking.php">← Return to booking form</a></p></div></body></html>';
    exit;
}

$bookingRef = make_booking_ref();

$sql = 'INSERT INTO bookings (
    booking_ref, service_id, full_name, email, phone, date_of_birth,
    postcode, address_line1, city, access_details, condition_id,
    issue_duration, pain_level, symptoms, mobility_aid, fall_risk,
    preferred_date, preferred_time, therapist_id, consent_privacy,
    consent_updates, status
) VALUES (
    :booking_ref, :service_id, :full_name, :email, :phone, :date_of_birth,
    :postcode, :address_line1, :city, :access_details, :condition_id,
    :issue_duration, :pain_level, :symptoms, :mobility_aid, :fall_risk,
    :preferred_date, :preferred_time, :therapist_id, :consent_privacy,
    :consent_updates, "pending"
)';

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':booking_ref' => $bookingRef,
    ':service_id' => $serviceId,
    ':full_name' => $fullName,
    ':email' => $email,
    ':phone' => $phone,
    ':date_of_birth' => $dateOfBirth,
    ':postcode' => $postcode,
    ':address_line1' => $addressLine1,
    ':city' => $city,
    ':access_details' => $accessDetails !== '' ? $accessDetails : null,
    ':condition_id' => $conditionId,
    ':issue_duration' => $issueDuration !== '' ? $issueDuration : null,
    ':pain_level' => $painLevel,
    ':symptoms' => $symptoms !== '' ? $symptoms : null,
    ':mobility_aid' => $mobilityAid,
    ':fall_risk' => $fallRisk,
    ':preferred_date' => $preferredDate,
    ':preferred_time' => $slotTimes[$preferredSlot],
    ':therapist_id' => $therapistId,
    ':consent_privacy' => $consentPrivacy,
    ':consent_updates' => $consentUpdates,
]);

// Rotate CSRF token after successful submission.
unset($_SESSION['csrf_token']);
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Booking Received | NEXmove Physio</title>
<style>
body{margin:0;font-family:Cambria,Georgia,serif;background:#f4f7fb;color:#13283c;padding:40px 18px}.card{max-width:720px;margin:50px auto;background:#fff;padding:38px;border-radius:22px;box-shadow:0 18px 55px rgba(15,45,73,.12);text-align:center}.tick{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;margin:0 auto 20px;background:#e9f5ef;font-size:36px}.ref{display:inline-block;background:#f3efe6;border-radius:10px;padding:10px 15px;font-weight:700;margin:12px 0 22px}.btn{display:inline-block;padding:12px 20px;border-radius:10px;background:#0f2d49;color:#fff;text-decoration:none;font-weight:700}</style>
</head>
<body>
<div class="card">
    <div class="tick">✓</div>
    <h1>Booking request received</h1>
    <p>Thank you, <?= e($fullName) ?>. Your NEXmove Physio appointment request has been saved successfully.</p>
    <div class="ref">Reference: <?= e($bookingRef) ?></div>
    <p>Our team can contact you using the details you provided to confirm the appointment.</p>
    <a class="btn" href="../booking.php">Make another booking</a>
</div>
</body>
</html>
