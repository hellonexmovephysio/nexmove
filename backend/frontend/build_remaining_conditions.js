const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const headerMatch = indexHtml.match(/<main[^>]*>/);
const footerMatch = indexHtml.match(/<\/main>/);

let headAndHeader = indexHtml.substring(0, headerMatch.index + headerMatch[0].length);
let footerAndEnd = indexHtml.substring(footerMatch.index);

// Fix asset paths
const fixPaths = (str) => {
    let s = str;
    s = s.replace(/href="style\.css"/g, 'href="../style.css"');
    s = s.replace(/src="images\//g, 'src="../images/');
    s = s.replace(/href="images\//g, 'href="../images/');
    s = s.replace(/href="#how"/g, 'href="../index.html#how"');
    s = s.replace(/href="#conditions"/g, 'href="../index.html#conditions"');
    s = s.replace(/href="#pricing"/g, 'href="../index.html#pricing"');
    s = s.replace(/href="#physios"/g, 'href="../index.html#physios"');
    s = s.replace(/href="#about"/g, 'href="../index.html#about"');
    s = s.replace(/href="#top"/g, 'href="../index.html"');
    s = s.replace(/href="booking\/index\.html"/g, 'href="../booking/index.html"');
    return s;
};

headAndHeader = fixPaths(headAndHeader);
footerAndEnd = fixPaths(footerAndEnd);

const dir = path.join(__dirname, 'conditions');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function buildPage(filename, content) {
    const finalHtml = headAndHeader + `
    <style>
        /* Shared Styles for Conditions Pages */
        .cond-hero { background: #f4f5f4; padding: 60px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; max-width: 1200px; margin: 0 auto; }
        .cond-hero-text h1 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 46px; line-height: 1.1; margin-bottom: 20px; }
        .cond-hero-text .breadcrumb { font-size: 12px; color: #666; margin-bottom: 20px; }
        .cond-hero-text .subtitle { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 15px; }
        .cond-hero-text p { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.6; }
        .cond-hero-image img { width: 100%; border-radius: 12px; object-fit: cover; }
        
        .cond-trust { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 30px; font-size: 13px; font-weight: 600; color: #444; }
        .cond-trust div { display: flex; align-items: center; gap: 8px; }
        .cond-trust svg { width: 20px; height: 20px; color: var(--navy); }
        
        .cond-section { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .cond-section-title { text-align: center; margin-bottom: 50px; }
        .cond-section-title h2 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 32px; display: inline-flex; align-items: center; gap: 15px; margin:0;}
        .cond-section-title h2::before, .cond-section-title h2::after { content: ''; width: 40px; height: 2px; background: var(--gold); }
        .cond-section-title p { color: #666; font-size: 16px; max-width: 700px; margin: 15px auto 0; }
        
        /* Two Column Layouts */
        .cond-split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
        .cond-split-img img { width: 100%; border-radius: 12px; }
        .cond-list { list-style: none; padding: 0; margin: 0; }
        .cond-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; font-size: 15px; color: #444; line-height: 1.4; }
        .cond-list svg { flex-shrink: 0; width: 22px; height: 22px; color: #2e7d32; }

        /* Journey Timeline */
        .cond-journey { display: flex; justify-content: space-between; align-items: flex-start; position: relative; padding-top: 20px; }
        .cond-journey::before { content: ''; position: absolute; top: 40px; left: 50px; right: 50px; height: 2px; background: #e0e0e0; z-index: 1; }
        .cond-step { flex: 1; text-align: center; position: relative; z-index: 2; padding: 0 10px; }
        .cond-step-num { width: 34px; height: 34px; border: 2px solid var(--gold); color: var(--gold); font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; background: #fff;}
        .cond-step-icon { width: 50px; height: 50px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f4f6fa; }
        .cond-step-icon svg { width:24px; height:24px; color: var(--navy); }
        .cond-step h4 { font-size: 14px; color: var(--navy); margin-bottom: 8px; }
        .cond-step p { font-size: 12px; color: #666; line-height: 1.4; margin:0;}

        /* Benefits Grid */
        .cond-benefits-grid { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top:40px;}
        .cond-benefit { width: 150px; text-align: center; }
        .cond-benefit .icon-wrapper { width: 56px; height: 56px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border:1px solid #eee; }
        .cond-benefit .icon-wrapper svg { width:24px; height:24px; color:var(--navy); }
        .cond-benefit h4 { font-size: 13px; color: var(--navy); margin-bottom: 8px; }
        .cond-benefit p { font-size: 11px; color: #666; }

        /* Urgent Box */
        .cond-urgent-wrap { display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin: 60px auto; max-width: 1200px;}
        .cond-urgent { background: #fee2e2; border: 1px solid #fecaca; border-radius: 12px; padding: 30px; display: flex; gap: 20px; align-items: flex-start;}
        .cond-urgent.full { grid-column: 1 / -1; max-width: 900px; margin: 60px auto; }
        .cond-urgent svg.alert { width: 40px; height: 40px; color: #dc2626; flex-shrink: 0; }
        .cond-urgent-content h3 { color: #dc2626; font-size: 20px; margin: 0 0 10px; }
        .cond-urgent-content p { color: #444; font-size: 14px; margin: 0 0 15px; }
        .cond-urgent-list { margin: 0; padding-left: 20px; color: #444; font-size: 13px; line-height: 1.5; }
        
        .cond-goal { background: #f0f4f8; border-radius: 12px; padding: 30px; display: flex; gap: 20px; align-items: flex-start; }
        .cond-goal h3 { color: var(--navy); font-size: 20px; margin: 0 0 10px; }
        .cond-goal p { color: #444; font-size: 15px; line-height: 1.5; margin:0;}

        /* Card Grids */
        .cond-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-top:40px; }
        .cond-card { background: #f8fafc; padding: 20px 15px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; }
        .cond-card img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; }
        .cond-card .icon-placeholder { width: 60px; height: 60px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; }
        .cond-card .icon-placeholder svg { width: 40px; height: 40px; color: var(--navy); }
        .cond-card h3 { font-size: 14px; color: var(--navy); margin-bottom: 8px; }
        .cond-card p { font-size: 12px; color: #666; line-height: 1.4; margin: 0; }

        /* FAQ */
        .cond-faq { max-width: 800px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid #eee; padding: 18px 0; display: flex; justify-content: space-between; cursor: pointer; color: #444; font-size: 15px; font-weight:600; }
        
        /* Footer CTA */
        .cond-cta { background: var(--navy); color: #fff; display: flex; border-radius: 20px; overflow: hidden; margin: 80px auto; max-width: 1200px; }
        .cond-cta-content { padding: 60px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .cond-cta-content h2 { font-size: 32px; font-family: 'Playfair Display', serif; margin-bottom: 15px; }
        .cond-cta-content p { font-size: 15px; color: #b3c5d6; margin-bottom: 30px; line-height: 1.6; }
        .cond-cta-image { flex: 1; background-size: cover; background-position: center; }

        @media (max-width: 900px) {
            .cond-hero, .cond-split, .cond-urgent-wrap, .cond-cta { grid-template-columns: 1fr; display: flex; flex-direction: column; }
            .cond-journey { flex-direction: column; gap: 30px; }
            .cond-journey::before { display: none; }
            .cond-step { display: flex; text-align: left; align-items: flex-start; gap: 15px; }
            .cond-step-num { margin: 0; }
            .cond-step-icon { margin: 0; }
        }
    </style>
    ` + content + footerAndEnd;
    
    fs.writeFileSync(path.join(dir, filename), finalHtml);
}

// ----------------------------------------------------
// 1. Post-Surgery Recovery
// ----------------------------------------------------
buildPage('post-surgery.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Post-Surgery Recovery</div>
            <h1>Post-Surgery Recovery<br>Physiotherapy at Home</h1>
            <div class="subtitle">Recover safely. Regain strength.<br>Get back to the life you enjoy.</div>
            <p>Our physiotherapists provide personalised, evidence-based rehabilitation after surgery, delivered in the comfort of your home. We help you rebuild strength, improve mobility, reduce pain and return to your daily activities with confidence.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home visits across your area</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg> Experienced physiotherapists</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Personalised one-to-one care</div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/post-surgery.jpg" alt="Post Surgery Physiotherapy">
        </div>
    </div>

    <div class="cond-section">
        <div class="cond-section-title">
            <h2>Surgeries We Support</h2>
            <p>We provide physiotherapy for a wide range of surgeries, helping you recover safely and confidently.</p>
        </div>
        <div class="cond-card-grid">
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                <h3>Knee Replacement</h3><p>Regain mobility, strength and independence.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg></div>
                <h3>Hip Replacement</h3><p>Improve balance, mobility and daily function.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg></div>
                <h3>Shoulder Surgery</h3><p>Restore range of movement and upper limb function.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16h12a2 2 0 0 0 2-2V8z"></path></svg></div>
                <h3>Spinal Surgery</h3><p>Improve core strength, posture and functional movement.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path></svg></div>
                <h3>Foot & Ankle</h3><p>Return to walking, sport and daily activities.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                <h3>ACL Reconstruction</h3><p>Gradual, safe return to activity and sport.</p>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div class="cond-split-img"><img src="../images/Front Page.jpeg" alt="Treatment"></div>
            <div>
                <h2>How Physiotherapy Helps After Surgery</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, progressive exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and swelling</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Restore movement and flexibility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Rebuild strength and endurance</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve balance and coordination</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support safe return to daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Prevent complications and re-injury</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background: #f8fafc;">
        <div class="cond-section-title">
            <h2>Your Recovery Journey</h2>
            <p>We follow a clear, step-by-step approach tailored to your surgery, goals and current stage of recovery.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Initial Assessment</h4><p>We assess your surgery, current abilities, pain levels and personal goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored rehabilitation programme based on your surgery type.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Techniques to reduce pain and swelling, improve mobility.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Targeted Exercises</h4><p>Progressive exercises to build strength, flexibility and function.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Return</h4><p>Ongoing support, review and advice to help you return to activities.</p></div>
        </div>
    </div>

    <div class="cond-urgent full">
        <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div class="cond-urgent-content">
            <h3>When to Contact Your Surgeon or GP</h3>
            <p>Please seek medical advice immediately if you experience:</p>
            <ul class="cond-urgent-list">
                <li>Increasing pain, swelling or redness around the surgical site</li>
                <li>Fever, chills or signs of infection</li>
                <li>Calf pain, swelling or shortness of breath (possible blood clot)</li>
                <li>Sudden loss of movement or function</li>
                <li>Any other unexpected or worrying symptoms</li>
            </ul>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title">
            <h2>Frequently Asked Questions</h2>
        </div>
        <div class="cond-faq">
            <div class="faq-item"><span>When should I start physiotherapy after surgery?</span> <span>+</span></div>
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Will it be painful?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you come to my home?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you work with my surgeon's guidelines?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Surgery to a Stronger, More Independent You</h2>
            <p>Expert physiotherapy at your home, tailored to your recovery. Book your session today and take the next step towards a safer, healthier and more active life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

// ----------------------------------------------------
// 2. Sports Injury
// ----------------------------------------------------
buildPage('sports-injury.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Sports Injury</div>
            <h1>Sports Injury Physiotherapy<br>at Home</h1>
            <div class="subtitle">Get back to your sport. Stronger than before.</div>
            <p>Whether you are a weekend runner, gym enthusiast or competitive athlete, our physiotherapists provide personalised, evidence-based treatment to help you recover from injury, improve performance and prevent future problems.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home visits</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg> Experienced physios</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Sport-specific rehab</div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/sports-injury.jpg" alt="Sports Injury Physiotherapy">
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div>
                <h2>Common Sports Injuries</h2>
                <ul class="cond-list" style="margin-top:20px;">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Muscle strains and ligament sprains</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Knee injuries (e.g., ACL, meniscus, patella)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Ankle sprains and Achilles tendinopathy</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Shoulder injuries (e.g., rotator cuff)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Tennis or golfer's elbow</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Shin splints and stress fractures</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Overuse injuries and recurring pain</li>
                </ul>
            </div>
            <div>
                <h2>How Physiotherapy Can Help</h2>
                <p style="margin:20px 0;">Our physiotherapists use a combination of hands-on treatment, movement-based exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and inflammation</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Restore strength, mobility and function</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct movement patterns and technique</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support a safe and effective return to sport</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Enhance overall performance and confidence</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background: #f8fafc;">
        <div class="cond-section-title">
            <h2>Your Treatment Journey</h2>
            <p>We follow a clear, step-by-step process tailored to your injury, goals and sport.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Detailed Assessment</h4><p>We understand your injury, sport, demands and goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored treatment plan based on your needs and sport.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Treatment & Rehab</h4><p>Hands-on therapy, specific exercises to reduce pain.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Sport-Specific Training</h4><p>Gradual return to activity with sport-specific drills.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Prevention</h4><p>Ongoing support and advice to help you perform better.</p></div>
        </div>
    </div>

    <div class="cond-urgent-wrap">
        <div class="cond-urgent" style="margin:0;">
            <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div class="cond-urgent-content">
                <h3>When to Seek Medical Advice</h3>
                <p>Please contact your GP or A&E if you experience:</p>
                <ul class="cond-urgent-list">
                    <li>Severe pain, swelling or inability to bear weight</li>
                    <li>A suspected fracture</li>
                    <li>Significant instability or locking of a joint</li>
                    <li>Numbness, tingling or loss of sensation</li>
                    <li>Any worsening symptoms or concerns</li>
                </ul>
            </div>
        </div>
        <div class="cond-goal">
            <div class="cond-urgent-content">
                <h3>Our Goal</h3>
                <p>Not just to get you back to sport, but to <strong>help you return stronger</strong>, with better movement, improved technique and the tools to prevent future injuries.</p>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>How soon can I start physiotherapy after a sports injury?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you help with return to sport programs?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help with recurring injuries?</span> <span>+</span></div>
            <div class="faq-item"><span>Do I need a GP referral?</span> <span>+</span></div>
            <div class="faq-item"><span>What should I do before my home visit?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Injury to a Stronger, More Active You</h2>
            <p>Expert physiotherapy at your home, tailored to your sport, your goals and your lifestyle. Book your session today and take the next step towards a pain-free, active life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

// ----------------------------------------------------
// 3. Stroke Rehabilitation
// ----------------------------------------------------
buildPage('stroke-rehabilitation.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Stroke Rehabilitation</div>
            <h1>Stroke Rehabilitation<br>Physiotherapy at Home</h1>
            <div class="subtitle">Regain independence. Improve mobility.<br>Live life with confidence.</div>
            <p>Our specialist physiotherapists provide personalised, evidence-based rehabilitation for stroke recovery — delivered in the comfort of your home. We focus on restoring movement, function and independence.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home visits across your area</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg> Experienced physiotherapists</div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/stroke-rehab.jpg" alt="Stroke Rehabilitation Physiotherapy">
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div class="cond-split-img"><img src="../images/Front Page.jpeg" alt="Treatment"></div>
            <div>
                <h2>How Physiotherapy Can Help After a Stroke</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, neurological rehabilitation techniques and functional exercises to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve strength, balance and coordination</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Enhance walking and mobility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Increase independence in daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Manage spasticity and muscle tone</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve upper limb function and fine motor skills</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Provide guidance and support for family members and carers</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background: #f8fafc;">
        <div class="cond-section-title">
            <h2>Your Rehabilitation Journey</h2>
            <p>We follow a structured, goal-focused approach tailored to your needs.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Initial Assessment</h4><p>We assess your movement, strength, balance and goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored rehabilitation programme based on your needs.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Neurological techniques to reduce stiffness, improve control.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Functional Exercises</h4><p>Task-specific exercises to build strength and confidence.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Review</h4><p>Ongoing support and adjustment of exercises.</p></div>
        </div>
    </div>

    <div class="cond-urgent-wrap">
        <div class="cond-goal" style="background:#fff; border:1px solid #e9ecef;">
            <div class="cond-urgent-content">
                <h3>Goals We Work Towards</h3>
                <ul class="cond-list" style="margin-top:15px;">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improved mobility and walking</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Greater independence in daily activities (e.g. dressing)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Better balance and reduced risk of falls</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improved arm and hand function</li>
                </ul>
            </div>
        </div>
        <div class="cond-urgent" style="margin:0;">
            <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div class="cond-urgent-content">
                <h3>When to Seek Urgent Medical Help</h3>
                <p>Contact your GP or A&E immediately if you experience:</p>
                <ul class="cond-urgent-list">
                    <li>Sudden weakness or numbness</li>
                    <li>Sudden loss of speech or difficulty speaking</li>
                    <li>Sudden vision problems</li>
                    <li>Severe headache</li>
                    <li>Any new or worsening neurological symptoms</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>When should physiotherapy start after a stroke?</span> <span>+</span></div>
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you support recovery at home if I cannot travel?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you work with family members or carers?</span> <span>+</span></div>
            <div class="faq-item"><span>What goals can I expect to achieve?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Recovery to a More Independent You</h2>
            <p>Specialist stroke rehabilitation physiotherapy at your home, tailored to your goals. Book your session today and take the next step towards a more active, confident life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

// ----------------------------------------------------
// 4. Knee Pain
// ----------------------------------------------------
buildPage('knee-pain.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Knee Pain</div>
            <h1>Knee Pain Physiotherapy<br>at Home</h1>
            <div class="subtitle">Move with confidence.<br>Stay active. Do what you love again.</div>
            <p>Knee pain can make everyday activities such as walking, climbing stairs, exercising or even getting out of a chair difficult. Our physiotherapists provide personalised, evidence-based treatment at your home to reduce pain, improve movement and get you back to your daily activities.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/knee-pain.jpg" alt="Knee Pain Physiotherapy">
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div class="cond-split-img"><img src="../images/Front Page.jpeg" alt="Treatment"></div>
            <div>
                <h2>How Physiotherapy Can Help Knee Pain</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, targeted exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and swelling</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve range of movement and flexibility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Build strength and stability around the knee</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct movement patterns and posture</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support a safe return to work, sport and daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Prevent recurrence and long-term problems</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background: #f8fafc;">
        <div class="cond-section-title">
            <h2>Your Treatment Journey</h2>
            <p>We follow a clear, step-by-step process tailored to your needs and goals.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Detailed Assessment</h4><p>We understand your symptoms, activity level and goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A treatment plan based on your condition and lifestyle.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Manual therapy techniques to reduce pain and improve mobility.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Targeted Exercises</h4><p>Knee-specific exercises to build strength, balance and control.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Prevention</h4><p>Ongoing support and advice to keep you active.</p></div>
        </div>
    </div>

    <div class="cond-urgent full">
        <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div class="cond-urgent-content">
            <h3>When to Seek Medical Advice</h3>
            <p>Please contact your GP or A&E if you experience:</p>
            <ul class="cond-urgent-list">
                <li>Severe pain, swelling or inability to bear weight</li>
                <li>A significant injury (e.g. fall or direct trauma)</li>
                <li>Suspected fracture</li>
                <li>Redness, warmth or fever (possible infection)</li>
                <li>Locking of the knee (unable to fully straighten or bend)</li>
                <li>Any new or worsening symptoms</li>
            </ul>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help with arthritis knee pain?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you provide post-surgical knee rehabilitation?</span> <span>+</span></div>
            <div class="faq-item"><span>When can I return to sport after a knee injury?</span> <span>+</span></div>
            <div class="faq-item"><span>What should I do before my home visit?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Pain to Stronger, More Active Knees</h2>
            <p>Expert physiotherapy at your home, tailored to your goals. Book your session today and take the next step towards pain-free movement and a more active life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

// ----------------------------------------------------
// 5. Shoulder Pain
// ----------------------------------------------------
buildPage('shoulder-pain.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Shoulder Pain</div>
            <h1>Shoulder Pain Physiotherapy<br>at Home</h1>
            <div class="subtitle">Move Freely. Feel Stronger.<br>Get Back to the Activities You Enjoy.</div>
            <p>Shoulder pain can affect your work, daily activities and quality of life. Our physiotherapists provide personalised treatment at your home to reduce pain, improve mobility and restore strength — helping you get back to doing what you love.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/shoulder-pain.jpg" alt="Shoulder Pain Physiotherapy">
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div class="cond-split-img"><img src="../images/Front Page.jpeg" alt="Treatment"></div>
            <div>
                <h2>How Physiotherapy Can Help Shoulder Pain</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, targeted exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and inflammation</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve range of movement and flexibility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Restore shoulder strength and stability</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct posture and movement patterns</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support a safe return to work, sport and daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Prevent recurrence and long-term problems</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background: #f8fafc;">
        <div class="cond-section-title">
            <h2>Your Treatment Journey</h2>
            <p>We follow a clear, step-by-step process tailored to your shoulder pain, goals and lifestyle.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Detailed Assessment</h4><p>We understand your symptoms, daily activities, work and sport goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored treatment programme based on your condition and needs.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Manual therapy techniques to reduce pain and improve movement.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Targeted Exercises</h4><p>Specific exercises to build strength, stability and control.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Prevention</h4><p>Ongoing support and advice to help you stay active.</p></div>
        </div>
    </div>

    <div class="cond-urgent full">
        <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div class="cond-urgent-content">
            <h3>When to Seek Medical Advice</h3>
            <p>Please contact your GP or A&E if you experience:</p>
            <ul class="cond-urgent-list">
                <li>Severe pain or sudden loss of movement</li>
                <li>A suspected fracture or dislocation</li>
                <li>Numbness, tingling or weakness in the arm</li>
                <li>Signs of infection (redness, warmth, fever)</li>
                <li>Any new or worsening symptoms</li>
            </ul>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>How soon can I start physiotherapy for shoulder pain?</span> <span>+</span></div>
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Will the treatment be painful?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help after shoulder surgery?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you provide exercises to do at home?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Pain to Stronger, More Active Shoulders</h2>
            <p>Expert physiotherapy at your home, tailored to your goals. Book your session today and take the next step towards pain-free movement and a better quality of life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

console.log('Successfully created all other condition pages!');
