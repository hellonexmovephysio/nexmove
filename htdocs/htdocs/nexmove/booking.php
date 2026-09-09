<?php

declare(strict_types=1);
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/db.php';

$services = $pdo->query('SELECT * FROM services WHERE active=1 ORDER BY sort_order,id')->fetchAll();
$conditions = $pdo->query('SELECT * FROM conditions WHERE active=1 ORDER BY sort_order,id')->fetchAll();
$therapists = $pdo->query('SELECT * FROM therapists WHERE active=1 ORDER BY display_name')->fetchAll();
$defaultService = $services[0] ?? null;
$csrf = csrf_token();
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0f2d49">
<title>Book Your Home Physiotherapy Session | NEXmove Physio</title>
<link rel="stylesheet" href="assets/styles.css">

<style>
/* ============================================================
   FONT SIZE / READABILITY OVERRIDES
   Keeps the existing layout and colours, but makes all text
   comfortably readable on desktop, tablet and mobile.
   ============================================================ */

html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
}

body,
button,
input,
select,
textarea {
    font-family: Cambria, Georgia, "Times New Roman", serif;
}

body {
    font-size: 16px;
    line-height: 1.5;
}

/* Header / navigation */
.desktop-nav a,
.phone-pill,
.trustbar,
.steps {
    font-size: 15px;
}

.brand-copy strong {
    font-size: 24px;
}

.brand-copy small {
    font-size: 12px;
}

.brand-copy em {
    font-size: 11px;
}

/* Page heading */
.content-area > h1 {
    font-size: clamp(34px, 2.5vw, 44px);
    line-height: 1.12;
    margin-bottom: 6px;
}

.subtitle {
    font-size: 18px;
    line-height: 1.45;
}

.urgent-note {
    font-size: 15px;
    line-height: 1.5;
}

.urgent-note b {
    font-size: 17px;
}

/* Section headings */
.panel h2 {
    font-size: 20px;
    line-height: 1.25;
}

.panel h2 span {
    font-size: 18px;
}

/* Standard field labels */
.field-grid > label,
.address-grid > label,
.clinical-grid > label,
.appointment-grid > label,
.field-label {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
}

/* Inputs / selects / textarea */
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input:not([type]),
select,
textarea,
.postcode-row input,
.field-grid input,
.address-grid input,
.appointment-grid input {
    font-size: 16px;
    line-height: 1.35;
}

input::placeholder,
textarea::placeholder {
    font-size: 15px;
    opacity: .78;
}

select {
    font-size: 15.5px;
}

.postcode-row button,
#findAddress {
    font-size: 14px;
    font-weight: 700;
}

/* Service cards */
.service-text b {
    font-size: 16px;
    line-height: 1.25;
}

.service-text small {
    font-size: 13px;
    line-height: 1.35;
}

.service-icon {
    font-size: 24px;
}

.selected-dot {
    font-size: 12px;
}

/* Condition chips */
.condition-chip,
.condition-chip span {
    font-size: 14px;
    line-height: 1.3;
}

/* Clinical area */
.range-row output {
    font-size: 15px;
    font-weight: 700;
}

.toggle-line {
    font-size: 14px !important;
}

/* Appointment time cards */
.time-card b {
    font-size: 14px;
    line-height: 1.25;
}

.time-card small {
    font-size: 12.5px;
    line-height: 1.3;
}

/* Consent */
.check-line,
.check-line span {
    font-size: 14px;
    line-height: 1.5;
}

.check-line a {
    font-size: inherit;
}

/* Booking summary */
.summary-card > h2 {
    font-size: 27px;
    line-height: 1.2;
}

.summary-list dt {
    font-size: 14px;
    line-height: 1.35;
}

.summary-list dd {
    font-size: 16px;
    line-height: 1.4;
}

.summary-list .price {
    font-size: 40px;
    line-height: 1.05;
}

.summary-card h3 {
    font-size: 21px;
    line-height: 1.25;
}

.included li {
    font-size: 14.5px;
    line-height: 1.5;
}

.help-box small {
    font-size: 15px;
    line-height: 1.35;
}

.help-box a {
    font-size: 16px;
    line-height: 1.4;
}

.continue-btn {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.25;
}

.secure-note {
    font-size: 12.5px;
    line-height: 1.4;
}

.hint,
.form-message {
    font-size: 14px;
    line-height: 1.45;
}

/* Keep the larger text practical on smaller screens */
@media (max-width: 1100px) {
    .content-area > h1 {
        font-size: 34px;
    }

    .panel h2 {
        font-size: 18px;
    }

    .summary-card > h2 {
        font-size: 24px;
    }
}

@media (max-width: 700px) {
    body {
        font-size: 15px;
    }

    .content-area > h1 {
        font-size: 30px;
    }

    .subtitle {
        font-size: 16px;
    }

    .urgent-note {
        font-size: 14px;
    }

    .panel h2 {
        font-size: 18px;
    }

    .field-grid > label,
    .address-grid > label,
    .clinical-grid > label,
    .appointment-grid > label,
    .field-label,
    .condition-chip,
    .condition-chip span,
    .check-line,
    .check-line span {
        font-size: 14px;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="date"],
    input:not([type]),
    select,
    textarea,
    .postcode-row input,
    .field-grid input,
    .address-grid input,
    .appointment-grid input {
        font-size: 16px; /* prevents iPhone input zoom */
    }

    .summary-card > h2 {
        font-size: 24px;
    }

    .summary-list dd {
        font-size: 15px;
    }

    .summary-list .price {
        font-size: 36px;
    }

    .included li {
        font-size: 14px;
    }

    .continue-btn {
        font-size: 16px;
    }
}
</style>
</head>
<body>
<header class="site-header">
    <div class="nav-wrap">
        <a class="brand" href="#"><span class="brand-symbol">N</span><span class="brand-copy"><strong>NEX<span>move</span></strong><small>PHYSIO</small><em>MOVE BETTER. LIVE BETTER.</em></span></a>
        <nav class="desktop-nav"><a href="#">How It Works</a><a href="#conditions">Conditions⌄</a><a href="#">Pricing</a><a href="#">For Physios</a><a href="#">About Us</a></nav>
        <a class="phone-pill" href="tel:<?= e($config['site']['support_phone_e164']) ?>">☎ <span><?= e($config['site']['support_phone_display']) ?></span></a>
    </div>
    <div class="trustbar"><span>◉ HCPC Registered</span><span>◉ DBS Checked</span><span>♢ Fully Insured</span><span>♢ GDPR Secure</span><span>⌖ Home Visits Across the UK</span></div>
</header>


<main class="page-shell">
<section class="content-area">
    <div class="steps"><span><b>1</b> Service</span><i></i><span class="active"><b>2</b> Your Details</span><i></i><span><b>3</b> Confirm</span></div>
    <h1>Book Your Home Physiotherapy Session</h1>
    <p class="subtitle">Simple booking for professional physiotherapy at home.</p>
    <div class="urgent-note"><b>ⓘ</b> If you are experiencing severe or urgent symptoms, please contact NHS 111 or call 999 in an emergency.</div>

    <form id="bookingForm" action="api/create_booking.php" method="post">
        <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>">
        <div class="form-grid">
            <section class="panel service-panel">
                <h2><span>♙</span>A. Choose Your Service</h2>
                <div class="service-grid">
                <?php foreach ($services as $i => $service): ?>
                    <label class="service-card <?= $i===0?'selected':'' ?>">
                        <input type="radio" name="service_id" value="<?= (int)$service['id'] ?>" <?= $i===0?'checked':'' ?>
                               data-name="<?= e($service['name']) ?>"
                               data-duration="<?= (int)$service['duration_minutes'] ?>"
                               data-type="<?= e($service['appointment_type']) ?>"
                               data-price="<?= number_format($service['price_pence']/100,2,'.','') ?>">
                        <span class="service-icon"><?= $service['slug']==='home-visit'?'⌂':($service['slug']==='online'?'▣':'◌') ?></span>
                        <span class="service-text"><b><?= e($service['slug']==='home-visit'?'Home Visit':$service['name']) ?></b><small><?= e($service['short_description']) ?></small></span>
                        <span class="selected-dot">●</span>
                    </label>
                <?php endforeach; ?>
                </div>
            </section>

            <section class="panel details-panel">
                <h2><span>♙</span>B. Your Details</h2>
                <div class="field-grid">
                    <label>Full Name<input name="full_name" autocomplete="name" placeholder="e.g. John Smith" required></label>
                    <label>Email Address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>
                    <label>Phone Number<input name="phone" autocomplete="tel" placeholder="07XXX XXXXX" required></label>
                    <label>Date of Birth<input name="date_of_birth" type="date" required></label>
                </div>
            </section>

            <section class="panel address-panel">
                <h2><span>⌖</span>C. Visit Address</h2>
                <div class="address-grid">
                    <label>Postcode<div class="postcode-row"><input name="postcode" autocomplete="postal-code" placeholder="SW1A 1AA" required><button type="button" id="findAddress">Find Address</button></div></label>
                    <label>Address<input name="address_line1" autocomplete="street-address" placeholder="10 Downing Street" required></label>
                    <label>City / Town<input name="city" autocomplete="address-level2" placeholder="London" required></label>
                    <label>Access Details (e.g. buzzer, parking)<input name="access_details" placeholder="Ring bell at main entrance"></label>
                </div>
                <p id="addressHint" class="hint" aria-live="polite"></p>
            </section>

            <section class="panel condition-panel" id="conditions">
                <h2><span>◇</span>D. What Do You Need Help With?</h2>
                <div class="condition-grid">
                    <?php foreach ($conditions as $condition): ?>
                    <label class="condition-chip"><input type="radio" name="condition_id" value="<?= (int)$condition['id'] ?>"><span><?= e($condition['label']) ?></span></label>
                    <?php endforeach; ?>
                </div>
            </section>

            <section class="panel clinical-panel">
                <h2><span>▯</span>E. Quick Clinical Information</h2>
                <div class="clinical-grid">
                    <label>How long have you had this issue?<select name="issue_duration"><option>Less than 1 week</option><option>1–2 weeks</option><option selected>2–6 weeks</option><option>6–12 weeks</option><option>3–6 months</option><option>More than 6 months</option></select></label>
                    <label>Pain level (0–10)<div class="range-row"><output id="painValue">4</output><input id="painRange" name="pain_level" type="range" min="0" max="10" value="4"></div></label>
                    <label class="span2">Describe your symptoms<textarea name="symptoms" rows="2" placeholder="e.g. Dull ache in lower back, worse in the morning..."></textarea></label>
                    <label class="toggle-line">Do you use a mobility aid?<input class="toggle" type="checkbox" name="mobility_aid"></label>
                    <label class="toggle-line">Are you at risk of falls?<input class="toggle" type="checkbox" name="fall_risk"></label>
                </div>
            </section>

            <section class="panel appointment-panel">
                <h2><span>▣</span>F. Preferred Appointment</h2>
                <div class="appointment-grid">
                    <label class="span3">Preferred Date<input name="preferred_date" id="preferredDate" type="date" required></label>
                    <span class="field-label span3">Preferred Time</span>
                    <label class="time-card selected"><input type="radio" name="preferred_time" value="Morning (9am–12pm)" checked><b>▣ Morning</b><small>9am – 12pm</small></label>
                    <label class="time-card"><input type="radio" name="preferred_time" value="Afternoon (12pm–5pm)"><b>◷ Afternoon</b><small>12pm – 5pm</small></label>
                    <label class="time-card"><input type="radio" name="preferred_time" value="Evening (5pm–8pm)"><b>◐ Evening</b><small>5pm – 8pm</small></label>
                    <label class="span3">Therapist Preference<select name="therapist_id"><option value="">No preference – any available therapist</option><?php foreach ($therapists as $therapist): if ((int)$therapist['id']===1) continue; ?><option value="<?= (int)$therapist['id'] ?>"><?= e($therapist['display_name']) ?></option><?php endforeach; ?></select></label>
                </div>
            </section>

            <section class="panel consent-panel">
                <h2><span>♢</span>G. Consent</h2>
                <label class="check-line"><input type="checkbox" name="consent_privacy" required><span>I have read and agree to the <a href="#">Privacy Policy</a> and <a href="#">Terms &amp; Conditions</a>.</span></label>
                <label class="check-line"><input type="checkbox" name="consent_updates"><span>I agree to receive appointment updates and occasional health tips via email or SMS.</span></label>
            </section>
        </div>
        <div id="formMessage" class="form-message" aria-live="polite"></div>
    </form>
</section>

<aside class="summary-card">
    <h2>Your Booking Summary</h2>
    <div class="gold-line"></div>
    <dl class="summary-list">
        <dt>Service</dt><dd id="sumService"><?= e($defaultService['name'] ?? '') ?></dd>
        <dt>Duration</dt><dd><span id="sumDuration"><?= (int)($defaultService['duration_minutes'] ?? 0) ?></span> mins</dd>
        <dt>Appointment Type</dt><dd id="sumType"><?= e($defaultService['appointment_type'] ?? '') ?></dd>
        <dt>Price</dt><dd class="price">£<span id="sumPrice"><?= number_format(($defaultService['price_pence'] ?? 0)/100,0) ?></span></dd>
    </dl>
    <hr>
    <h3>What’s Included</h3>
    <ul class="included"><li>Comprehensive in-home assessment</li><li>Personalised treatment plan</li><li>Hands-on treatment at home</li><li>Home exercise programme</li><li>Follow-up advice and support</li></ul>
    <div class="help-box"><small>Need Help? We’re Here.</small><a href="tel:<?= e($config['site']['support_phone_e164']) ?>">☎ <?= e($config['site']['support_phone_display']) ?></a><a href="https://wa.me/<?= e($config['site']['whatsapp_e164']) ?>" target="_blank" rel="noopener">◉ WhatsApp Us</a></div>
    <button class="continue-btn" type="submit" form="bookingForm">Continue to Confirmation <span>→</span></button>
    <p class="secure-note">♙ Your information is secure and encrypted</p>
</aside>
</main>
<script src="assets/app.js"></script>
</body>
</html>
