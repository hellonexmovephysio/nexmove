<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Method not allowed.'], 405);
}

if (!verify_csrf($_POST['csrf_token'] ?? null)) {
    json_response(['ok' => false, 'message' => 'Your session expired. Refresh the page and try again.'], 419);
}

$serviceId = filter_var($_POST['service_id'] ?? null, FILTER_VALIDATE_INT);
$conditionRaw = $_POST['condition_id'] ?? '';
$conditionId = $conditionRaw === '' ? null : filter_var($conditionRaw, FILTER_VALIDATE_INT);
$therapistRaw = $_POST['therapist_id'] ?? '';
$therapistId = $therapistRaw === '' ? null : filter_var($therapistRaw, FILTER_VALIDATE_INT);

$fullName = clean_string($_POST['full_name'] ?? '', 120);
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = clean_string($_POST['phone'] ?? '', 40);
$dob = clean_string($_POST['date_of_birth'] ?? '', 10);
$postcode = strtoupper(clean_string($_POST['postcode'] ?? '', 16));
$address = clean_string($_POST['address_line1'] ?? '', 190);
$city = clean_string($_POST['city'] ?? '', 100);
$access = clean_string($_POST['access_details'] ?? '', 255);
$issueDuration = clean_string($_POST['issue_duration'] ?? '', 50);
$painLevel = filter_var($_POST['pain_level'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 10]]);
$symptomsRaw = trim((string)($_POST['symptoms'] ?? ''));
$symptoms = function_exists('mb_substr') ? mb_substr($symptomsRaw, 0, 2000) : substr($symptomsRaw, 0, 2000);
$mobilityAid = isset($_POST['mobility_aid']) ? 1 : 0;
$fallRisk = isset($_POST['fall_risk']) ? 1 : 0;
$preferredDate = clean_string($_POST['preferred_date'] ?? '', 10);
$preferredTime = clean_string($_POST['preferred_time'] ?? '', 40);
$consentPrivacy = isset($_POST['consent_privacy']) ? 1 : 0;
$consentUpdates = isset($_POST['consent_updates']) ? 1 : 0;

$errors = [];
if (!$serviceId) $errors[] = 'Choose a service.';
if ($fullName === '') $errors[] = 'Enter your full name.';
if (!$email) $errors[] = 'Enter a valid email address.';
if ($phone === '') $errors[] = 'Enter your phone number.';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dob)) $errors[] = 'Enter a valid date of birth.';
if ($postcode === '' || $address === '' || $city === '') $errors[] = 'Complete your visit address.';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $preferredDate)) $errors[] = 'Choose a preferred appointment date.';
if ($preferredTime === '') $errors[] = 'Choose a preferred time.';
if (!$consentPrivacy) $errors[] = 'Privacy consent is required.';

if ($preferredDate !== '') {
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $preferredDate);
    $today = new DateTimeImmutable('today');
    if (!$date || $date < $today) $errors[] = 'Preferred date cannot be in the past.';
}

if ($errors) {
    json_response(['ok' => false, 'message' => 'Please correct the form.', 'errors' => $errors], 422);
}

$serviceStmt = $pdo->prepare('SELECT id FROM services WHERE id = :id AND active = 1');
$serviceStmt->execute([':id' => $serviceId]);
if (!$serviceStmt->fetch()) {
    json_response(['ok' => false, 'message' => 'The selected service is not available.'], 422);
}

try {
    $pdo->beginTransaction();
    $reference = booking_reference();
    $stmt = $pdo->prepare('INSERT INTO bookings (
        booking_ref, service_id, full_name, email, phone, date_of_birth,
        postcode, address_line1, city, access_details, condition_id,
        issue_duration, pain_level, symptoms, mobility_aid, fall_risk,
        preferred_date, preferred_time, therapist_id, consent_privacy, consent_updates
    ) VALUES (
        :booking_ref, :service_id, :full_name, :email, :phone, :date_of_birth,
        :postcode, :address_line1, :city, :access_details, :condition_id,
        :issue_duration, :pain_level, :symptoms, :mobility_aid, :fall_risk,
        :preferred_date, :preferred_time, :therapist_id, :consent_privacy, :consent_updates
    )');

    $stmt->execute([
        ':booking_ref' => $reference,
        ':service_id' => $serviceId,
        ':full_name' => $fullName,
        ':email' => $email,
        ':phone' => $phone,
        ':date_of_birth' => $dob,
        ':postcode' => $postcode,
        ':address_line1' => $address,
        ':city' => $city,
        ':access_details' => $access !== '' ? $access : null,
        ':condition_id' => $conditionId ?: null,
        ':issue_duration' => $issueDuration !== '' ? $issueDuration : null,
        ':pain_level' => $painLevel === false ? null : $painLevel,
        ':symptoms' => $symptoms !== '' ? $symptoms : null,
        ':mobility_aid' => $mobilityAid,
        ':fall_risk' => $fallRisk,
        ':preferred_date' => $preferredDate,
        ':preferred_time' => $preferredTime,
        ':therapist_id' => $therapistId ?: null,
        ':consent_privacy' => $consentPrivacy,
        ':consent_updates' => $consentUpdates,
    ]);

    $pdo->commit();
    start_secure_session();
    $_SESSION['last_booking_ref'] = $reference;

    json_response([
        'ok' => true,
        'reference' => $reference,
        'redirect' => '../confirmation.php?ref=' . rawurlencode($reference),
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('NEXmove booking error: ' . $e->getMessage());
    json_response(['ok' => false, 'message' => 'We could not save your booking. Please try again.'], 500);
}
