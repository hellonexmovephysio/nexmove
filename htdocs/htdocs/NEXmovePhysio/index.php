<?php
// ============================================================
// NEXmove Physio - COMPLETE RESPONSIVE PHP WEBSITE
// Single-file version: PHP + HTML + CSS + JavaScript
// ============================================================

$siteName     = "NEXmove Physio";
$phoneDisplay = "+44 7393 107245";
$phoneLink    = "+447393107245";
$whatsapp     = "447393107245";
$email        = "hello@nexmovephysio.co.uk";
$currentYear  = date("Y");

$featureCards = [
    ["icon"=>"hand",     "title"=>"Affordable Care",   "text"=>"High-quality physiotherapy without the high costs.", "accent"=>"green"],
    ["icon"=>"timer",    "title"=>"Fast Recovery",     "text"=>"Targeted treatments to help you heal faster and get back to what you love.", "accent"=>"sage"],
    ["icon"=>"calendar", "title"=>"Flexible Booking",  "text"=>"Appointments that fit your schedule. Book online in seconds.", "accent"=>"navy"],
    ["icon"=>"user",     "title"=>"Personalized Care", "text"=>"Individual treatment plans designed around your goals and lifestyle.", "accent"=>"gold"],
];

$whyBenefits = [
    ["icon"=>"shield","title"=>"Trusted & Experienced","text"=>"Qualified physiotherapists you can rely on."],
    ["icon"=>"people","title"=>"One-to-One Care","text"=>"Personal attention at every step."],
    ["icon"=>"home","title"=>"Home-Based Therapy","text"=>"Comfort of your own home."],
    ["icon"=>"heart","title"=>"Better Outcomes","text"=>"Focused care for faster, lasting results."],
];

$howSteps = [
    ["icon"=>"calendar","num"=>"1","title"=>"Book Online","text"=>"Choose a time that works for you."],
    ["icon"=>"home","num"=>"2","title"=>"We Come to You","text"=>"Our expert physio visits your home."],
    ["icon"=>"hand","num"=>"3","title"=>"Personalized Treatment","text"=>"Tailored care to help you move better."],
    ["icon"=>"person","num"=>"4","title"=>"Feel the Difference","text"=>"Better movement. Better life."],
];

$specialisations = [
    ["icon"=>"🦴","title"=>"Musculoskeletal","count"=>"31 Specialists","items"=>["Back pain & sciatica","Neck pain","Joint pain","Arthritis management"]],
    ["icon"=>"🏃","title"=>"Sports Physio","count"=>"24 Specialists","items"=>["Sports injuries","Running injuries","Injury prevention","Return-to-sport rehab"]],
    ["icon"=>"🧠","title"=>"Neuro Physio","count"=>"18 Specialists","items"=>["Stroke rehabilitation","Parkinson's disease","Multiple sclerosis","Brain injuries"]],
    ["icon"=>"🫁","title"=>"Respiratory Physio","count"=>"15 Specialists","items"=>["COPD","Asthma","Post-COVID recovery","Breathing rehabilitation"]],
    ["icon"=>"👶","title"=>"Paediatric Physio","count"=>"12 Specialists","items"=>["Developmental delay","Cerebral palsy","Paediatric injuries","Neurological conditions"]],
    ["icon"=>"🧓","title"=>"Geriatric Care","count"=>"16 Specialists","items"=>["Falls prevention","Balance training","Mobility improvement","Age-related weakness"]],
    ["icon"=>"❤️","title"=>"Women's Health","count"=>"14 Specialists","items"=>["Pregnancy-related pain","Postnatal recovery","Pelvic floor","Diastasis recti"]],
    ["icon"=>"🩺","title"=>"Post-Surgical Rehab","count"=>"19 Specialists","items"=>["Hip & knee replacement","ACL reconstruction","Spinal surgery","Shoulder surgery"]],
];

$pricing = [
    ["label"=>"FOLLOW-UP SESSION","title"=>"Follow-up Home Visit","price"=>"£75","small"=>"/ session","time"=>"45 minute session","popular"=>false,"items"=>["Progress review","Hands-on treatment","Exercise progression","Updated recovery plan"]],
    ["label"=>"HOME VISIT","title"=>"Initial Assessment","price"=>"£90","small"=>"/ session","time"=>"60 minute home visit","popular"=>true,"items"=>["Full assessment","Treatment at your doorstep","Personalised exercises","DBS-checked physiotherapist"]],
    ["label"=>"VIDEO CALL","title"=>"Online Consultation","price"=>"£35","small"=>"/ session","time"=>"30 minute video session","popular"=>false,"items"=>["Video assessment & advice","Exercise prescription","Self-management guidance","Follow-up plan"]],
    ["label"=>"BEST VALUE","title"=>"5-Session Package","price"=>"£350","small"=>"/ package","time"=>"Save compared with individual visits","popular"=>false,"items"=>["£70 per session","Same physio every visit","Ongoing progress tracking","Priority availability"]],
];

$cities = ["London","Birmingham","Edinburgh","Glasgow"];

$conditions = [
    "Back Pain","Post-Surgery Recovery","Stroke Rehabilitation","Sports Injury",
    "Knee Pain","Shoulder Pain","Neck Pain","Sciatica"
];

$vetting = [
    ["num"=>"01","icon"=>"shield","title"=>"HCPC & CSP Registration","text"=>"We verify professional registration before a physiotherapist joins the network."],
    ["num"=>"02","icon"=>"search","title"=>"Enhanced DBS Check","text"=>"Home-visit physiotherapists must hold the appropriate current background checks."],
    ["num"=>"03","icon"=>"calendar","title"=>"Insurance Verified","text"=>"Professional indemnity insurance is checked and must remain current."],
    ["num"=>"04","icon"=>"star","title"=>"Qualifications Review","text"=>"Degrees, specialisations, experience and CPD records are reviewed."],
];

$etiquette = [
    ["icon"=>"clock","title"=>"Arrival Time","text"=>"Your physiotherapist arrives at the agreed appointment time."],
    ["icon"=>"person","title"=>"Professional Conduct","text"=>"Clear identification, respectful communication and professional behaviour."],
    ["icon"=>"home","title"=>"Respect for Your Home","text"=>"Treatment is delivered with care for your space, comfort and preferences."],
    ["icon"=>"shield","title"=>"Clean Equipment","text"=>"Appropriate equipment and hygiene standards are maintained for each visit."],
    ["icon"=>"heart","title"=>"Privacy & Dignity","text"=>"Your privacy, comfort and dignity remain central throughout treatment."],
    ["icon"=>"hand","title"=>"Personalised Advice","text"=>"You receive exercises and practical guidance tailored to your goals."],
];

$testimonials = [
    ["name"=>"Claire M.","place"=>"Richmond","initials"=>"CM","text"=>"After my knee surgery, the rehabilitation programme helped me return to activity sooner than expected. The home visit option was incredibly convenient."],
    ["name"=>"Andrew P.","place"=>"Islington","initials"=>"AP","text"=>"Finding a neuro physiotherapist was easy. The home sessions made a real difference for my father and gave our family more confidence."],
    ["name"=>"Rachel P.","place"=>"Kensington","initials"=>"RP","text"=>"Booking online was simple and the physiotherapist was professional, knowledgeable and very focused on my goals."],
];

$faqs = [
    ["q"=>"How does a home visit work?","a"=>"Once you book, your physiotherapist arrives at your home at the scheduled time, completes an assessment, provides appropriate treatment and creates a personalised exercise plan."],
    ["q"=>"Are all physiotherapists verified?","a"=>"Physiotherapists on the platform are checked for professional registration and relevant documentation before offering services."],
    ["q"=>"Is physiotherapy covered by private health insurance?","a"=>"Some practitioners may accept private health insurance. Check your individual policy and insurer requirements before booking."],
    ["q"=>"How quickly can I get an appointment?","a"=>"Availability depends on your location and practitioner. Same-day or next-day appointments may be available in some areas."],
    ["q"=>"What should I prepare for a home visit?","a"=>"A clear space of roughly 2m × 2m is usually enough. Wear comfortable clothing and keep referral letters or scan results available if relevant."],
    ["q"=>"Can I cancel or reschedule?","a"=>"Cancellation and rescheduling rules depend on the booking terms shown when you arrange your appointment."],
];

// Basic form handling
$formMessage = "";
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["booking_submit"])) {
    $name      = trim($_POST["name"] ?? "");
    $userPhone = trim($_POST["phone"] ?? "");
    $userEmail = trim($_POST["email"] ?? "");
    $condition = trim($_POST["condition"] ?? "");
    $city      = trim($_POST["city"] ?? "");
    $date      = trim($_POST["preferred_date"] ?? "");

    if ($name && $userPhone && $userEmail && $condition && $city) {
        $formMessage = "Thank you, " . htmlspecialchars($name) . "! Your booking request has been received.";
    } else {
        $formMessage = "Please fill in all required fields.";
    }
}

function iconSvg(string $name): string {
    $icons = [
        "hand" => '<svg viewBox="0 0 48 48"><path d="M12 24c2.5-3 6-4.5 9-3l5 2c1.8.7 2.5 2.8 1.5 4.3-.8 1.2-2.4 1.7-3.7 1.2L19 26.8"/><path d="M11 24 6 28l10 11c1 1.1 2.4 1.6 3.8 1.2l13.7-4.1c1.5-.5 2.5-1.8 2.5-3.4 0-2.3-2.2-3.9-4.4-3.2l-7 2.3"/></svg>',
        "timer" => '<svg viewBox="0 0 48 48"><circle cx="25" cy="27" r="13"/><path d="M25 14V9M19 8h12M25 27v-8M25 27l7 4M9 20H4M11 14l-4-4"/></svg>',
        "calendar" => '<svg viewBox="0 0 48 48"><rect x="8" y="11" width="32" height="29" rx="3"/><path d="M15 7v9M33 7v9M8 20h32"/><path d="M15 26h4M23 26h4M31 26h4M15 32h4M23 32h4M31 32h4"/></svg>',
        "user" => '<svg viewBox="0 0 48 48"><circle cx="24" cy="16" r="8"/><path d="M10 40c1-10 6-15 14-15s13 5 14 15"/></svg>',
        "shield" => '<svg viewBox="0 0 48 48"><path d="M24 5 38 11v10c0 9-5.4 16-14 21C15.4 37 10 30 10 21V11L24 5z"/><path d="m18 24 4 4 8-9"/></svg>',
        "people" => '<svg viewBox="0 0 48 48"><circle cx="17" cy="17" r="6"/><circle cx="32" cy="17" r="6"/><path d="M5 39c1-9 5-13 12-13s11 4 12 13M22 39c1-8 4-12 10-12s10 4 11 12"/></svg>',
        "home" => '<svg viewBox="0 0 48 48"><path d="m6 22 18-15 18 15"/><path d="M10 20v21h28V20M19 41V28h10v13"/></svg>',
        "heart" => '<svg viewBox="0 0 48 48"><path d="M24 41S7 31 7 18c0-6 4-10 9-10 4 0 7 2 8 6 1-4 4-6 8-6 5 0 9 4 9 10 0 13-17 23-17 23z"/><path d="M13 25h7l3-6 5 12 3-6h5"/></svg>',
        "person" => '<svg viewBox="0 0 48 48"><circle cx="24" cy="12" r="5"/><path d="M24 17v11M24 21 15 30M24 21l9 9M24 28l-6 12M24 28l7 12"/></svg>',
        "search" => '<svg viewBox="0 0 48 48"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg>',
        "star" => '<svg viewBox="0 0 48 48"><path d="m24 5 5.7 11.5 12.7 1.8-9.2 9 2.2 12.7L24 34l-11.4 6 2.2-12.7-9.2-9 12.7-1.8L24 5z"/></svg>',
        "clock" => '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17"/><path d="M24 14v11l8 5"/></svg>',
    ];
    return $icons[$name] ?? "";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="NEXmove Physio - professional home physiotherapy, personalised treatment and flexible booking.">
<title><?= htmlspecialchars($siteName) ?> | Move Better. Live Better.</title>

<style>
:root{
    --cream:#f8f4ec;
    --cream2:#fdfbf7;
    --white:#fff;
    --navy:#102d45;
    --navy2:#173b56;
    --green:#315d50;
    --green2:#496f61;
    --sage:#e2e9df;
    --gold:#b69049;
    --text:#26343d;
    --muted:#667178;
    --line:#e3dccf;
    --soft:#f1eee7;
    --shadow:0 16px 42px rgba(27,48,56,.08);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:110px}
body{font-family:Arial,Helvetica,sans-serif;background:var(--cream);color:var(--text);line-height:1.55;overflow-x:hidden}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
button,input,select,textarea{font:inherit}
button{cursor:pointer}
.container{width:min(1180px,calc(100% - 40px));margin:0 auto}
.section{padding:clamp(58px,7vw,90px) 0}
.soft{background:#f2eee7}
.eyebrow{display:block;color:var(--gold);font-size:10px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:12px}
.section-head{text-align:center;max-width:760px;margin:0 auto 36px}
.section-head h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(31px,4vw,46px);line-height:1.08;color:var(--navy);font-weight:500}
.section-head h2 em{font-weight:400;color:#61786e}
.section-head p{margin-top:12px;color:var(--muted);font-size:15px}
.btn{min-height:50px;padding:0 24px;border-radius:999px;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;gap:11px;font-weight:800;transition:.2s ease}
.btn:hover{transform:translateY(-2px)}
.btn-primary{background:var(--navy);color:#fff!important}
.btn-green{background:var(--green);color:#fff!important}
.btn-outline{border-color:#c7b998;background:rgba(255,255,255,.35);color:var(--navy)}
.btn-white{background:#fff;color:var(--navy)}
.icon-circle svg,.feature-icon svg,.benefit-icon svg,.step-icon svg,.vet-icon svg,.etiquette-icon svg,.evidence-icon svg{fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}

/* HEADER */
.site-header{position:sticky;top:0;z-index:9999;background:rgba(248,244,236,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(16,45,69,.07)}
.header-row{min-height:104px;display:flex;align-items:center;gap:28px}
.brand{display:flex;align-items:center;gap:15px;flex:0 0 auto}
.logo{width:72px;height:72px;border:1px solid #aab5ad;border-radius:50%;display:grid;place-items:center;background:#fffdf8}
.logo svg{width:53px;height:53px}
.brand-name{font-family:Georgia,"Times New Roman",serif;font-size:31px;line-height:1;color:var(--navy)}
.brand-name span{color:#5f776d}
.brand-sub{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:9px;
    font-size:9px;
    letter-spacing:6px;
    font-weight:800;
    color:var(--navy);
    margin-top:7px;
    width:100%;
}
.brand-sub::before,
.brand-sub::after{
    content:"";
    display:block;
    height:2px;
    background:var(--gold);
    border-radius:999px;
    flex:1 1 auto;
    min-width:18px;
    max-width:36px;
}
.brand-tag{font-size:8px;letter-spacing:2px;color:#8a8d86;margin-top:7px}
.desktop-nav{display:flex;align-items:center;gap:32px;margin-left:auto}
.desktop-nav>a{font-size:14px;font-weight:700;white-space:nowrap}
.desktop-nav>a:hover{color:var(--green)}
.phone-btn{background:var(--navy);color:#fff!important;padding:14px 20px;border-radius:999px}
.menu-btn{display:none;margin-left:auto;width:45px;height:45px;border:0;background:transparent}
.menu-btn span{display:block;height:2px;background:var(--navy);margin:7px 0}
.mobile-nav{display:none;background:var(--cream);border-top:1px solid var(--line);padding:8px 20px 18px}
.mobile-nav.active{display:block}
.mobile-nav a{display:block;padding:12px 0;border-bottom:1px solid var(--line);font-weight:700}

/* HERO */
.hero{background:var(--cream);position:relative}
.hero-grid{display:grid;grid-template-columns:44% 56%;min-height:490px}
.hero-copy{padding:56px 45px 58px 35px;display:flex;flex-direction:column;justify-content:center}
.hero-title{font-family:Georgia,"Times New Roman",serif;font-size:clamp(52px,5.4vw,76px);line-height:.96;font-weight:500;letter-spacing:-2px;color:var(--navy)}
.hero-title span{color:#527167}
.gold-line{width:47px;height:3px;background:var(--gold);margin:22px 0 18px}
.hero-text{max-width:480px;font-size:16px;color:#38464e}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:26px}
.rating-row{display:flex;align-items:center;gap:16px;margin-top:28px}
.avatars{display:flex}
.avatar{width:42px;height:42px;border-radius:50%;border:3px solid var(--cream);margin-left:-8px;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:800}
.avatar:first-child{margin-left:0}.avatar:nth-child(1){background:#315f69}.avatar:nth-child(2){background:#ad7662}.avatar:nth-child(3){background:#344f60}.avatar:nth-child(4){background:#81574d}
.stars{color:var(--gold);letter-spacing:2px}.rating-copy{font-size:13px;color:#44515a}
.hero-media{min-height:490px;position:relative;overflow:hidden;border-top-left-radius:95px}
.hero-media img{width:100%;height:100%;object-fit:cover;object-position:center}
.evidence-card{position:absolute;right:26px;bottom:52px;width:305px;padding:20px;border-radius:18px;background:rgba(48,90,75,.95);color:#fff;display:flex;align-items:center;gap:15px;box-shadow:0 16px 35px rgba(0,0,0,.17)}
.evidence-icon{width:58px;height:58px;border:2px solid #c7a45e;border-radius:50%;display:grid;place-items:center;flex:0 0 auto}
.evidence-icon svg{width:29px;height:29px}
.evidence-card strong{display:block;font-size:15px;margin-bottom:4px}.evidence-card p{font-size:12.5px;color:#edf3ef}
.wave{height:94px;margin-top:-44px;position:relative;z-index:2;overflow:hidden}
.wave:before{content:"";position:absolute;left:-4%;right:-4%;top:25px;height:120px;background:var(--green);border-radius:50% 50% 0 0/40% 40% 0 0;transform:rotate(-2deg)}
.wave:after{content:"";position:absolute;left:-5%;right:-5%;top:53px;height:100px;background:var(--cream);border-radius:50% 50% 0 0/48% 48% 0 0;transform:rotate(1deg)}

/* TOP FEATURE AREA */
.simplified{padding:10px 0 20px}
.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.feature-card{min-height:205px;background:#fbfaf6;border:1px solid rgba(20,45,69,.06);border-radius:16px;padding:22px 24px 18px;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(28,50,54,.04);position:relative}
.feature-card:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:0 0 16px 16px;background:var(--green)}
.feature-card.sage:after{background:#6b887c}.feature-card.navy:after{background:var(--navy)}.feature-card.gold:after{background:var(--gold)}
.feature-icon{width:50px;height:50px;border-radius:50%;background:#e7eae0;color:var(--green);display:grid;place-items:center;margin-bottom:13px}
.feature-icon svg{width:28px;height:28px}.feature-card.gold .feature-icon{background:#f0e7d7;color:#9c7437}
.feature-card h3{font-family:Georgia,"Times New Roman",serif;font-size:19px;color:var(--navy);margin-bottom:7px}
.feature-card p{font-size:13px;color:#4f5a61}.feature-arrow{margin-top:auto;padding-top:10px;font-size:27px;color:var(--green)}

.info-grid{display:grid;grid-template-columns:36% 64%;gap:18px;margin-top:18px}
.why-panel{background:var(--navy);color:#fff;border-radius:16px;padding:24px 28px;min-height:335px}
.benefit-list{display:grid;gap:18px}
.benefit-item{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center}
.benefit-icon{width:44px;height:44px;border-radius:50%;background:#6d897e;display:grid;place-items:center}
.benefit-icon svg{width:25px;height:25px}.benefit-item strong{display:block;font-size:13px}.benefit-item span{display:block;font-size:11.5px;color:#dfe8e4}
.process-panel{background:#fbf8f2;border:1px solid rgba(20,45,69,.05);border-radius:16px;padding:24px 26px 18px}
.steps-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.step{text-align:center;position:relative}
.step:not(:last-child):after{content:"";position:absolute;top:29px;right:-16%;width:32%;border-top:2px dotted #71897c}
.step-icon{width:60px;height:60px;border-radius:50%;background:#dfe8df;color:var(--green);display:grid;place-items:center;margin:0 auto 9px;position:relative}
.step:last-child .step-icon{background:var(--navy);color:#fff}.step-icon svg{width:31px;height:31px}
.step-num{position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;font-size:10px;font-weight:800;border:2px solid #fbf8f2}
.step h4{font-size:12.5px;color:var(--navy);margin:8px 0 4px}.step p{font-size:10.8px;color:#657078}
.quote-card{margin-top:18px;background:#f7f2e9;border-radius:12px;padding:16px 18px;display:grid;grid-template-columns:28px 1fr;gap:13px;align-items:center}
.quote-mark{font-family:Georgia,serif;color:var(--gold);font-size:42px}.quote-card p{font-size:11.5px}.quote-card small{display:block;margin-top:8px;font-weight:700}

/* GENERAL CARDS */
.card-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.basic-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:var(--shadow)}
.basic-card h3{color:var(--navy);font-size:18px;margin-bottom:10px}.basic-card p{font-size:14px;color:var(--muted)}
.basic-card ul{list-style:none;display:grid;gap:8px;margin:14px 0 18px}.basic-card li{font-size:13px;color:#536069}
.basic-card li:before{content:"✓";color:var(--green);font-weight:900;margin-right:8px}

/* SPECIALISATIONS */
.special-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.special-card{background:#fff;border-radius:18px;padding:23px;border:1px solid var(--line);box-shadow:0 8px 25px rgba(28,50,54,.04)}
.special-icon{font-size:28px}.special-head{margin:10px 0}.special-head h3{color:var(--navy);font-size:17px}.special-head span{font-size:12px;color:var(--gold);font-weight:700}
.special-card ul{list-style:none;display:grid;gap:7px;margin:15px 0}.special-card li{font-size:13px;color:#5a656c}.special-card li:before{content:"•";color:var(--green);margin-right:8px}
.special-card a{font-size:13px;font-weight:800;color:var(--green)}

/* ABOUT */
.split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(34px,6vw,70px);align-items:center}
.split-image{position:relative}.split-image img{width:100%;border-radius:24px;min-height:430px;object-fit:cover}
.image-badge{position:absolute;left:24px;bottom:24px;background:var(--navy);color:#fff;border-radius:16px;padding:16px 20px}.image-badge strong{display:block;font-size:28px}.image-badge span{font-size:12px}
.split-copy h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(32px,4vw,48px);line-height:1.08;color:var(--navy);margin-bottom:16px}
.split-copy>p{color:var(--muted);margin-bottom:20px}
.check-list{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:22px 0}
.check-item{display:flex;gap:10px}.check-dot{width:25px;height:25px;border-radius:50%;background:#e3ece7;color:var(--green);display:grid;place-items:center;flex:0 0 auto;font-weight:900}.check-item p{font-size:13px;color:#5b666e}.check-item strong{color:var(--navy)}

/* PRICING */
.pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;align-items:stretch}
.price-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;position:relative;display:flex;flex-direction:column;box-shadow:0 8px 25px rgba(28,50,54,.04)}
.price-card.popular{border:2px solid var(--green);transform:translateY(-8px)}
.popular-tag{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;border-radius:999px;padding:6px 14px;font-size:10px;font-weight:800;white-space:nowrap}
.price-label{font-size:10px;color:var(--gold);font-weight:800;letter-spacing:1.3px}.price-card h3{font-family:Georgia,serif;color:var(--navy);font-size:20px;margin:8px 0 12px}
.price{font-size:36px;color:var(--navy);font-weight:800}.price small{font-size:12px;color:var(--muted);font-weight:400}.price-time{font-size:12px;color:var(--muted);margin-bottom:15px}
.price-card ul{list-style:none;display:grid;gap:8px;margin-bottom:22px}.price-card li{font-size:12.5px}.price-card .btn{margin-top:auto;width:100%}

/* CITIES + CONDITIONS */
.link-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.link-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:17px 18px;display:flex;justify-content:space-between;gap:10px;align-items:center;font-weight:700;color:var(--navy)}
.link-card:hover{border-color:#9cad9f;transform:translateY(-2px)}
.link-card span:last-child{color:var(--gold);font-size:20px}

/* VETTING */
.vet-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.vet-card{background:#fff;border-radius:18px;border:1px solid var(--line);padding:23px}
.vet-number{font-size:11px;color:var(--gold);font-weight:800}.vet-icon{width:46px;height:46px;border-radius:50%;background:#e2ebe6;color:var(--green);display:grid;place-items:center;margin:14px 0}.vet-icon svg{width:25px;height:25px}.vet-card h3{font-size:16px;color:var(--navy);margin-bottom:8px}.vet-card p{font-size:13px;color:var(--muted)}
.verified-line{margin-top:22px;text-align:center;background:#e4ede8;color:var(--green);padding:14px;border-radius:12px;font-weight:800;font-size:13px}

/* ETIQUETTE */
.etiquette-section{background:var(--navy);color:#fff}
.etiquette-section .section-head h2{color:#fff}.etiquette-section .section-head p{color:#d4e0dc}
.etiquette-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.etiquette-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px}
.etiquette-icon{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;color:#e1c27f;margin-bottom:12px}.etiquette-icon svg{width:24px;height:24px}
.etiquette-card h3{font-size:15px;margin-bottom:5px}.etiquette-card p{font-size:12px;color:#d6e0dc}

/* TESTIMONIALS */
.testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.testimonial{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px}
.quote{font-family:Georgia,serif;color:var(--gold);font-size:48px;line-height:.7}.testimonial>p{font-size:13px;color:#59656d;min-height:90px;margin:10px 0 18px}
.patient{display:flex;align-items:center;gap:11px}.patient-avatar{width:42px;height:42px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800}.patient strong{display:block;font-size:13px}.patient small{font-size:11px;color:var(--muted)}

/* PHYSIOS */
.physio-cta{background:linear-gradient(135deg,var(--green),#274f44);color:#fff}
.physio-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:50px;align-items:center}
.physio-grid h2{font-family:Georgia,serif;font-size:clamp(32px,4vw,48px);line-height:1.08;margin-bottom:14px}.physio-grid p{color:#e0ebe6;margin-bottom:22px}
.physio-benefits{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.physio-benefit{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);padding:17px;border-radius:14px}.physio-benefit span{font-size:23px}.physio-benefit strong{display:block;margin-top:7px;font-size:13px}.physio-benefit small{color:#dce7e2}

/* FAQ */
.faq-grid{display:grid;grid-template-columns:.75fr 1.25fr;gap:60px;align-items:start}
.faq-intro h2{font-family:Georgia,serif;font-size:clamp(32px,4vw,46px);line-height:1.08;color:var(--navy);margin-bottom:14px}.faq-intro p{color:var(--muted);margin-bottom:20px}
.faq-list{display:grid;gap:10px}.faq-list details{background:#fff;border:1px solid var(--line);border-radius:14px;padding:0 18px}.faq-list summary{padding:17px 0;cursor:pointer;font-weight:800;color:var(--navy);display:flex;justify-content:space-between;gap:12px}.faq-list summary::-webkit-details-marker{display:none}.faq-list details p{padding:0 0 17px;color:var(--muted);font-size:13px}

/* BOOKING */
.booking{background:#f0ece4}
.booking-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:50px;align-items:start}
.booking-copy h2{font-family:Georgia,serif;font-size:clamp(33px,4vw,48px);line-height:1.08;color:var(--navy);margin-bottom:14px}.booking-copy p{color:var(--muted);margin-bottom:20px}
.contact-card{background:var(--navy);color:#fff;border-radius:18px;padding:20px;margin-top:20px}.contact-card a{display:block;margin-top:8px;color:#fff;font-weight:700}
.booking-form{background:#fff;border-radius:20px;padding:28px;box-shadow:var(--shadow)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.field{display:flex;flex-direction:column;gap:7px}.field.full{grid-column:1/-1}.field label{font-size:12px;font-weight:800;color:var(--navy)}
.field input,.field select,.field textarea{width:100%;border:1px solid #d7d0c4;border-radius:11px;padding:13px 14px;background:#fff;outline:none}.field textarea{min-height:110px;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(49,93,80,.08)}
.form-actions{grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap}.form-message{grid-column:1/-1;border-radius:10px;padding:11px 13px;background:#edf4ef;color:var(--green);font-size:13px;font-weight:700}

/* FOOTER */
.footer{background:#0d2639;color:#d9e2e6;padding:54px 0 22px}
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:42px}.footer h4{color:#fff;margin-bottom:14px}.footer a{display:block;font-size:13px;margin:8px 0;color:#ced8dc}.footer p{font-size:13px;color:#c8d3d7}
.footer-brand-name{font-family:Georgia,serif;font-size:27px;color:#fff;margin-bottom:12px}.footer-brand-name span{color:#90a89e}
.socials{display:flex;gap:8px;margin-top:15px}.socials a{width:35px;height:35px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;margin:0}
.footer-bottom{margin-top:35px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font-size:12px}.footer-bottom div{display:flex;gap:18px}.footer-bottom a{margin:0}

/* CTA STRIP */
.cta{padding:0 0 36px}.cta-bar{min-height:84px;border-radius:18px;background:linear-gradient(90deg,#456b5d,#537c69);color:#fff;padding:18px 34px;display:flex;align-items:center;gap:18px}.cta-icon{width:45px;height:45px;border-radius:50%;background:#fff;color:var(--gold);display:grid;place-items:center}.cta-copy h3{font-family:Georgia,serif;font-size:21px;font-weight:500}.cta-copy p{font-size:12px;color:#e5eeea}.cta .btn{margin-left:auto;min-width:225px}

/* RESPONSIVE */
@media(max-width:1150px){
    .desktop-nav{gap:19px}.desktop-nav>a{font-size:13px}
    .special-grid{grid-template-columns:repeat(3,1fr)}
    .pricing-grid{grid-template-columns:repeat(2,1fr)}
    .vet-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:960px){
    .desktop-nav{display:none}.menu-btn{display:block}.header-row{min-height:88px}
    .logo{width:58px;height:58px}.logo svg{width:42px;height:42px}.brand-name{font-size:24px}.brand-tag{display:none}
    .hero-grid{grid-template-columns:1fr}.hero-copy{padding:48px 14px 38px}.hero-media{min-height:430px;border-radius:70px 20px 20px 20px}
    .feature-grid{grid-template-columns:repeat(2,1fr)}.info-grid{grid-template-columns:1fr}
    .special-grid{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}.link-grid{grid-template-columns:repeat(2,1fr)}
    .etiquette-grid{grid-template-columns:repeat(2,1fr)}.testimonial-grid{grid-template-columns:1fr}
    .physio-grid{grid-template-columns:1fr}.faq-grid{grid-template-columns:1fr}.booking-grid{grid-template-columns:1fr}
    .footer-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:680px){
    .container{width:calc(100% - 28px)}.section{padding:50px 0}
    .hero-title{font-size:48px}.hero-text{font-size:15px}.hero-actions .btn{width:100%}.rating-row{align-items:flex-start;flex-direction:column}
    .hero-media{min-height:350px}.evidence-card{width:calc(100% - 28px);right:14px;bottom:16px;padding:15px}.evidence-icon{width:48px;height:48px}
    .wave{margin-top:-25px}
    .feature-grid,.special-grid,.pricing-grid,.vet-grid,.etiquette-grid{grid-template-columns:1fr}
    .steps-row{grid-template-columns:repeat(2,1fr);row-gap:24px}.step:after{display:none}
    .check-list{grid-template-columns:1fr}.link-grid{grid-template-columns:repeat(2,1fr)}
    .physio-benefits{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}
    .form-grid{grid-template-columns:1fr}.field.full,.form-actions,.form-message{grid-column:auto}.form-actions .btn{width:100%}
    .cta-bar{flex-direction:column;align-items:flex-start}.cta .btn{margin-left:0;width:100%;min-width:0}
    .price-card.popular{transform:none}
}
@media(max-width:430px){
    .container{width:calc(100% - 20px)}.header-row{min-height:78px}.logo{width:50px;height:50px}.logo svg{width:36px;height:36px}.brand-name{font-size:21px}.brand-sub{font-size:7px;letter-spacing:3px;gap:6px}.brand-sub::before,.brand-sub::after{min-width:12px;max-width:22px;height:1.5px}
    .hero-title{font-size:42px}.hero-copy{padding-top:38px}.hero-media{min-height:300px}.evidence-card{position:relative;right:auto;bottom:auto;margin:12px 14px 14px;width:calc(100% - 28px)}
    .steps-row,.link-grid{grid-template-columns:1fr}.section-head h2{font-size:30px}.booking-form{padding:20px}
}
.physio-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 28px;
            margin: 10px 0;
        }

        .physio-line {
            height: 4px;
            width: 170px;
            background-color: #C99A5B; /* Golden colour */
            border-radius: 2px;
        }

        .physio-text {
            font-family: Cambria, Georgia, serif;
            font-size: 55px;
            font-weight: 600;
            letter-spacing: 18px;
            color: #061D3A;
            line-height: 1;
            white-space: nowrap;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .physio-row {
                gap: 15px;
            }

            .physio-line {
                width: 80px;
                height: 3px;
            }

            .physio-text {
                font-size: 35px;
                letter-spacing: 10px;
            }
        }

        @media (max-width: 480px) {
            .physio-row {
                gap: 10px;
            }

            .physio-line {
                flex: 1;
                max-width: 55px;
                height: 2px;
            }

            .physio-text {
                font-size: 25px;
                letter-spacing: 7px;
            }
        }
.socials{
    display:flex;
    gap:12px;
    margin-top:15px;
}

.socials a{
    width:42px;
    height:42px;

    display:grid;
    place-items:center;

    background:#ffffff;
    border-radius:50%;

    color:#315d50;

    border:1px solid rgba(49,93,80,.15);

    box-shadow:0 4px 12px rgba(0,0,0,.08);

    transition:.25s ease;
}

.socials a svg{
    width:21px;
    height:21px;

    fill:none;
    stroke:currentColor;
    stroke-width:1.8;
    stroke-linecap:round;
    stroke-linejoin:round;
}

.socials a:hover{
    background:#315d50;
    color:#ffffff;
    transform:translateY(-3px);
}
</style>
</head>
<body id="top">

<header class="site-header">
    <div class="container header-row">
        <a class="brand" href="#top" aria-label="NEXmove Physio home">
            <div class="logo">
                <img src="images/nexmove-logo.png" alt="NEXmove Physio logo" class="main-logo-img">
            </div>
            
            <div>
                <div class="brand-name">NEX<span>move</span></div>
                <div class="brand-sub">PHYSIO</div>
                <div class="brand-tag">MOVE BETTER. LIVE BETTER.</div>
            </div>
        </a>

        <nav class="desktop-nav">
            <a href="#how">How It Works</a>
            <a href="#conditions">Conditions</a>
            <a href="#pricing">Pricing</a>
            <a href="#physios">For Physios</a>
            <a href="#about">About Us</a>
            <a class="phone-btn" href="tel:<?= htmlspecialchars($phoneLink) ?>">☎ <?= htmlspecialchars($phoneDisplay) ?></a>
            <a class="phone-btn" href="book.php">BOOK NOW</a>
            
        </nav>
<div class="socials">

    <a href="https://instagram.com/@nexmovephysio"
       target="_blank"
       aria-label="Instagram">

        <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="5"></rect>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="17.5" cy="6.5" r="1"></circle>
        </svg>
    </a>

    <a href="https://wa.me/447393107245"
       target="_blank"
       aria-label="WhatsApp">

        <svg viewBox="0 0 24 24">
            <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5z"></path>
            <path d="M8.4 7.8c.3-.4.6-.4.8-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.7.9c-.2.2-.2.4 0 .7.6 1.1 1."></path>
        </svg>
        <button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </div>

    <nav class="mobile-nav" id="mobileNav">
        <a href="#how">How It Works</a>
        <a href="#conditions">Conditions</a>
        <a href="#pricing">Pricing</a>
        <a href="#physios">For Physios</a>
        <a href="#about">About Us</a>
        <a href="book.php">Book a Session</a>
        <a href="tel:<?= htmlspecialchars($phoneLink) ?>">☎ <?= htmlspecialchars($phoneDisplay) ?></a>
    </nav>
</header>

<main>

<!-- HERO -->
<section class="hero">
    <div class="container hero-grid">
        <div class="hero-copy">
            <span class="eyebrow">Expert care. Personalized for you.</span>
            <h1 class="hero-title">sefjwe <span>aesfj.</span><br>Lesgwvrve <span>Bdfge.</span></h1>
            <div class="gold-line"></div>
            <p class="hero-text">Evidence-based physiotherapy tailored to your goals. Affordable, flexible, and focused on lasting results.</p>

            <div class="hero-actions">
                <a href="book.php" class="btn btn-primary">Book Your Session <span>→</span></a>
                <a href="#how" class="btn btn-outline">How It Works <span>▷</span></a>
            </div>

            <div class="rating-row">
                <div class="avatars">
                    <span class="avatar">JM</span><span class="avatar">SA</span><span class="avatar">AK</span><span class="avatar">RP</span>
                </div>
                <div>
                    <div class="stars">★★★★★</div>
                    <div class="rating-copy">4.9/5 from 500+ patients</div>
                </div>
            </div>
        </div>

        <div class="hero-media">
            <img src="images/Front Page.jpeg" alt="Physiotherapist helping a patient">
            <div class="evidence-card">
                <div class="evidence-icon"><?= iconSvg("shield") ?></div>
                <div>
                    <strong>Evidence-Based Care</strong>
                    <p>Treatment that's backed by research and focused on lasting results.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="wave"></div>

<!-- SCREENSHOT STYLE FEATURE AREA -->
<section class="simplified" id="how">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Care that fits your life</span>
            <h2>Physiotherapy, <em>Simplified</em></h2>
        </div>

        <div class="feature-grid">
            <?php foreach($featureCards as $card): ?>
                <article class="feature-card <?= htmlspecialchars($card["accent"]) ?>">
                    <div class="feature-icon"><?= iconSvg($card["icon"]) ?></div>
                    <h3><?= htmlspecialchars($card["title"]) ?></h3>
                    <p><?= htmlspecialchars($card["text"]) ?></p>
                    <a href="book.php" class="feature-arrow">→</a>
                </article>
            <?php endforeach; ?>
        </div>

        <div class="info-grid">
            <aside class="why-panel">
                <span class="eyebrow">Why choose NEXmove Physio?</span>
                <div class="benefit-list">
                    <?php foreach($whyBenefits as $item): ?>
                        <div class="benefit-item">
                            <div class="benefit-icon"><?= iconSvg($item["icon"]) ?></div>
                            <div><strong><?= htmlspecialchars($item["title"]) ?></strong><span><?= htmlspecialchars($item["text"]) ?></span></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </aside>

            <section class="process-panel">
                <span class="eyebrow">How it works</span>
                <div class="steps-row">
                    <?php foreach($howSteps as $step): ?>
                        <div class="step">
                            <div class="step-icon"><?= iconSvg($step["icon"]) ?><span class="step-num"><?= $step["num"] ?></span></div>
                            <h4><?= htmlspecialchars($step["title"]) ?></h4>
                            <p><?= htmlspecialchars($step["text"]) ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="quote-card">
                    <div class="quote-mark">“</div>
                    <div>
                        <p>“The physiotherapist was professional, knowledgeable, and made a huge difference in my recovery.”</p>
                        <small>– James T.</small>
                    </div>
                </div>
            </section>
        </div>
    </div>
</section>

<!-- SPECIALISATIONS -->
<section class="section soft" id="specialisations">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Find your specialist</span>
            <h2>Browse by Specialisation</h2>
            <p>Find the right physiotherapist for your specific needs.</p>
        </div>
        <div class="special-grid">
            <?php foreach($specialisations as $s): ?>
                <article class="special-card">
                    <div class="special-icon"><?= $s["icon"] ?></div>
                    <div class="special-head"><h3><?= htmlspecialchars($s["title"]) ?></h3><span><?= htmlspecialchars($s["count"]) ?></span></div>
                    <ul><?php foreach($s["items"] as $item): ?><li><?= htmlspecialchars($item) ?></li><?php endforeach; ?></ul>
                    <a href="book.php">Find a Specialist →</a>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ABOUT -->
<section class="section" id="about">
    <div class="container split">
        <div class="split-image">
            <img src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85" alt="Physiotherapist helping a patient at home">
            <div class="image-badge"><strong>170+</strong><span>Verified Physios</span></div>
        </div>
        <div class="split-copy">
            <span class="eyebrow">Why NEXmove Physio?</span>
            <h2>Expert care, without the clinic journey.</h2>
            <p>We make physiotherapy easier to access by bringing qualified professionals directly to your home. No crowded waiting rooms and no difficult clinic journey.</p>
            <div class="check-list">
                <div class="check-item"><span class="check-dot">✓</span><p><strong>HCPC & CSP Registered</strong><br>Professional registration is verified.</p></div>
                <div class="check-item"><span class="check-dot">✓</span><p><strong>DBS Checked</strong><br>Appropriate checks for home visits.</p></div>
                <div class="check-item"><span class="check-dot">✓</span><p><strong>Fully Insured</strong><br>Professional indemnity documentation checked.</p></div>
                <div class="check-item"><span class="check-dot">✓</span><p><strong>Personalised Plans</strong><br>Treatment built around your goals.</p></div>
            </div>
            <a href="book.php" class="btn btn-green">Book Home Physio</a>
        </div>
    </div>
</section>

<!-- PRICING -->
<section class="section soft" id="pricing">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Simple pricing</span>
            <h2>Transparent Pricing</h2>
            <p>No hidden fees. Choose the appointment that fits your needs.</p>
        </div>
        <div class="pricing-grid">
            <?php foreach($pricing as $p): ?>
                <article class="price-card <?= $p["popular"] ? "popular" : "" ?>">
                    <?php if($p["popular"]): ?><div class="popular-tag">FIRST CONSULTATION</div><?php endif; ?>
                    <span class="price-label"><?= htmlspecialchars($p["label"]) ?></span>
                    <h3><?= htmlspecialchars($p["title"]) ?></h3>
                    <div class="price"><?= htmlspecialchars($p["price"]) ?> <small><?= htmlspecialchars($p["small"]) ?></small></div>
                    <div class="price-time"><?= htmlspecialchars($p["time"]) ?></div>
                    <ul><?php foreach($p["items"] as $item): ?><li>✓ <?= htmlspecialchars($item) ?></li><?php endforeach; ?></ul>
                    <a href="book.php" class="btn <?= $p["popular"] ? "btn-green" : "btn-outline" ?>">Book Now</a>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CITIES -->
<section class="section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">UK-wide coverage</span>
            <h2>Home Physio in Your City</h2>
            <p>Professional physiotherapy across major UK cities.</p>
        </div>
        <div class="link-grid">
            <?php foreach($cities as $city): ?><a class="link-card" href="book.php"><span><?= htmlspecialchars($city) ?></span><span>→</span></a><?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CONDITIONS -->
<section class="section soft" id="conditions">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">What we treat</span>
            <h2>Conditions We Treat at Home</h2>
            <p>Evidence-based physiotherapy delivered without you leaving home.</p>
        </div>
        <div class="link-grid">
            <?php foreach($conditions as $c): ?><a class="link-card" href="book.php"><span><?= htmlspecialchars($c) ?></span><span>→</span></a><?php endforeach; ?>
        </div>
    </div>
</section>

<!-- VETTING -->
<section class="section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Safety first</span>
            <h2>How We Vet Our Physios</h2>
            <p>Every physiotherapist goes through a structured verification process.</p>
        </div>
        <div class="vet-grid">
            <?php foreach($vetting as $v): ?>
                <article class="vet-card">
                    <span class="vet-number"><?= $v["num"] ?></span>
                    <div class="vet-icon"><?= iconSvg($v["icon"]) ?></div>
                    <h3><?= htmlspecialchars($v["title"]) ?></h3>
                    <p><?= htmlspecialchars($v["text"]) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
        <div class="verified-line">✓ Physiotherapists must complete all verification steps before joining the platform.</div>
    </div>
</section>

<!-- HOME VISIT ETIQUETTE -->
<section class="section etiquette-section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Home visit etiquette</span>
            <h2>What to Expect During a Home Visit</h2>
            <p>Professional, respectful care delivered in the comfort of your own home.</p>
        </div>
        <div class="etiquette-grid">
            <?php foreach($etiquette as $e): ?>
                <article class="etiquette-card">
                    <div class="etiquette-icon"><?= iconSvg($e["icon"]) ?></div>
                    <h3><?= htmlspecialchars($e["title"]) ?></h3>
                    <p><?= htmlspecialchars($e["text"]) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- TESTIMONIALS -->
<section class="section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Patient stories</span>
            <h2>What Our Patients Say</h2>
            <p>Experiences from people using home physiotherapy.</p>
        </div>
        <div class="testimonial-grid">
            <?php foreach($testimonials as $t): ?>
                <article class="testimonial">
                    <div class="quote">“</div>
                    <p><?= htmlspecialchars($t["text"]) ?></p>
                    <div class="patient">
                        <div class="patient-avatar"><?= htmlspecialchars($t["initials"]) ?></div>
                        <div><strong><?= htmlspecialchars($t["name"]) ?></strong><small><?= htmlspecialchars($t["place"]) ?> · Verified Patient</small></div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- FOR PHYSIOS -->
<section class="section physio-cta" id="physios">
    <div class="container physio-grid">
        <div>
            <span class="eyebrow">For physiotherapists</span>
            <h2>Are You a Physiotherapist?</h2>
            <p>Join our growing network. Set your own availability, manage bookings and connect with patients who need care at home.</p>
            <a href="#" class="btn btn-white">Join as a Physio</a>
        </div>
        <div class="physio-benefits">
            <div class="physio-benefit"><span>📅</span><strong>Flexible Schedule</strong><small>Choose your working hours.</small></div>
            <div class="physio-benefit"><span>💷</span><strong>Fair Pay</strong><small>Clear and transparent earnings.</small></div>
            <div class="physio-benefit"><span>📱</span><strong>Easy Management</strong><small>Simple booking workflow.</small></div>
            <div class="physio-benefit"><span>🌍</span><strong>Grow Your Reach</strong><small>Connect with more local patients.</small></div>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="section soft">
    <div class="container faq-grid">
        <div class="faq-intro">
            <span class="eyebrow">Need to know</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about home physiotherapy.</p>
            <a href="book.php" class="btn btn-green">Book a Physio</a>
        </div>
        <div class="faq-list">
            <?php foreach($faqs as $i=>$faq): ?>
                <details <?= $i===0 ? "open" : "" ?>>
                    <summary><?= htmlspecialchars($faq["q"]) ?><span>+</span></summary>
                    <p><?= htmlspecialchars($faq["a"]) ?></p>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- BOOKING -->
<section class="section booking" id="booking">
    <div class="container booking-grid">
        <div class="booking-copy">
            <span class="eyebrow">Book your session</span>
            <h2>Ready to Move Better?</h2>
            <p>Tell us what support you need and choose your preferred appointment date. You can submit a request or send the same details directly through WhatsApp.</p>
            <div class="contact-card">
                <strong>Contact NEXmove Physio</strong>
                <a href="tel:<?= htmlspecialchars($phoneLink) ?>">☎ <?= htmlspecialchars($phoneDisplay) ?></a>
                <a href="mailto:<?= htmlspecialchars($email) ?>">✉ <?= htmlspecialchars($email) ?></a>
            </div>
        </div>

        <form class="booking-form" method="post" id="bookingForm">
            <div class="form-grid">
                <?php if($formMessage): ?><div class="form-message"><?= $formMessage ?></div><?php endif; ?>

                <div class="field"><label for="name">Full Name *</label><input id="name" name="name" required></div>
                <div class="field"><label for="phone">Phone *</label><input id="phone" name="phone" type="tel" required></div>
                <div class="field"><label for="email">Email *</label><input id="email" name="email" type="email" required></div>
                <div class="field"><label for="city">City *</label>
                    <select id="city" name="city" required>
                        <option value="">Select city</option>
                        <?php foreach($cities as $city): ?><option><?= htmlspecialchars($city) ?></option><?php endforeach; ?>
                    </select>
                </div>
                <div class="field"><label for="condition">Condition / Service *</label>
                    <select id="condition" name="condition" required>
                        <option value="">Select condition</option>
                        <?php foreach($conditions as $c): ?><option><?= htmlspecialchars($c) ?></option><?php endforeach; ?>
                    </select>
                </div>
                <div class="field"><label for="preferred_date">Preferred Date</label><input id="preferred_date" name="preferred_date" type="date"></div>
                <div class="field full"><label for="notes">Additional Notes</label><textarea id="notes" name="notes" placeholder="Tell us briefly about your symptoms or rehabilitation needs..."></textarea></div>

                <div class="form-actions">
                    <button class="btn btn-primary" type="submit" name="booking_submit">Send Booking Request</button>
                    <button class="btn btn-green" type="button" onclick="bookWhatsApp()">Book via WhatsApp</button>
                </div>
            </div>
        </form>
    </div>
</section>

<!-- FINAL CTA -->
<section class="cta">
    <div class="container">
        <div class="cta-bar">
            <div class="cta-icon">☎</div>
            <div class="cta-copy"><h3>Ready to Move Better?</h3><p>We're here to help you live a more active life.</p></div>
            <a href="book.php" class="btn btn-white">Book Your Session Today <span>→</span></a>
        </div>
    </div>
</section>

</main>

<footer class="footer">
    <div class="container footer-grid">
        <div>
            <div class="footer-brand-name">NEX<span>move</span> Physio</div>
            <p>Professional physiotherapy at your doorstep. Flexible home visits and personalised rehabilitation support.</p>
            <div class="socials"><a href="#">f</a><a href="#">in</a><a href="#">◎</a></div>
        </div>
        <div>
            <h4>Services</h4>
            <a href="#specialisations">Musculoskeletal</a>
            <a href="#specialisations">Sports Physio</a>
            <a href="#specialisations">Neuro Physio</a>
            <a href="#specialisations">Post-Surgical Rehab</a>
            <a href="#specialisations">Elderly Physio</a>
        </div>
        <div>
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#how">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#physios">For Physios</a>
            <a href="#conditions">Conditions</a>
            
        </div>
        <div>
            <h4>Get in Touch</h4>
            <a href="tel:<?= htmlspecialchars($phoneLink) ?>">☎ <?= htmlspecialchars($phoneDisplay) ?></a>
            <a href="mailto:<?= htmlspecialchars($email) ?>">✉ <?= htmlspecialchars($email) ?></a>
            <p>📍 UK-wide home visits</p>
        </div>
    </div>
    <div class="container footer-bottom">
        <span>© <?= $currentYear ?> NEXmove Physio. All rights reserved.</span>
        <div><a href="#">Privacy Policy</a><a href="#">Terms & Conditions</a></div>
    </div>
</footer>

<script>
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn.addEventListener("click", function(){
    const open = mobileNav.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

document.querySelectorAll("#mobileNav a").forEach(function(link){
    link.addEventListener("click", function(){
        mobileNav.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
    });
});

document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        mobileNav.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
    }
});

const dateInput = document.getElementById("preferred_date");
if(dateInput){
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    dateInput.min = local.toISOString().split("T")[0];
}

function bookWhatsApp(){
    const form = document.getElementById("bookingForm");
    if(!form.checkValidity()){
        form.reportValidity();
        return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value;
    const condition = document.getElementById("condition").value;
    const date = document.getElementById("preferred_date").value || "Not specified";
    const notes = document.getElementById("notes").value.trim() || "Not provided";

    const message =
`Hello NEXmove Physio,

I would like to book a physiotherapy appointment.

Name: ${name}
Phone: ${phone}
Email: ${email}
City: ${city}
Condition / Service: ${condition}
Preferred Date: ${date}
Notes: ${notes}

Please confirm availability.`;

    window.open("https://wa.me/<?= $whatsapp ?>?text=" + encodeURIComponent(message), "_blank");
}
</script>

</body>
</html>
