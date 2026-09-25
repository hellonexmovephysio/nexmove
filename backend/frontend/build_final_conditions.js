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
        
        .cond-goal { background: #f0f4f8; border-radius: 12px; padding: 30px; display: flex; flex-direction: column; justify-content: center;}
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
// 1. Neck Pain
// ----------------------------------------------------
buildPage('neck-pain.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Neck Pain</div>
            <h1>Neck Pain Physiotherapy<br>at Home</h1>
            <div class="subtitle">Less Pain. Better Movement.<br>A More Comfortable You.</div>
            <p>Neck pain can affect your daily activities, work, sleep and overall quality of life. Our physiotherapists provide personalised, evidence-based treatment at your home to reduce pain, improve mobility and help you get back to doing what you enjoy.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home visits across your area</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg> Experienced physiotherapists</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Personalised care</div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/neck-pain.jpg" alt="Neck Pain Physiotherapy">
        </div>
    </div>

    <div class="cond-section">
        <div class="cond-section-title">
            <h2>Common Neck Conditions We Treat</h2>
            <p>Neck pain can be caused by different conditions. We assess your symptoms and provide targeted treatment.</p>
        </div>
        <div class="cond-card-grid">
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                <h3>Muscle Strain</h3><p>Due to poor posture, sudden movement or overuse.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg></div>
                <h3>Cervical Spondylosis</h3><p>Age-related wear and tear causing stiffness and pain.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg></div>
                <h3>Whiplash Injury</h3><p>Common after road traffic accidents or sudden force.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg></div>
                <h3>Nerve Compression</h3><p>Pain, numbness or tingling into the shoulder or arm.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg></div>
                <h3>Postural Neck Pain</h3><p>Related to prolonged sitting, desk work or screen use.</p>
            </div>
            <div class="cond-card">
                <div class="icon-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></div>
                <h3>Tension Headaches</h3><p>Due to tight neck and shoulder muscles.</p>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-split">
            <div class="cond-split-img"><img src="../images/Front Page.jpeg" alt="Treatment"></div>
            <div>
                <h2>How Physiotherapy Can Help Neck Pain</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, targeted exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and muscle stiffness</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve neck mobility and flexibility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct posture and movement patterns</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Relieve tension in neck and shoulder muscles</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce headache frequency and intensity (where related)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support return to work, driving and daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Prevent recurrence with tailored advice and exercises</li>
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
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Detailed Assessment</h4><p>We assess your symptoms, posture, movement and daily activities.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored treatment programme based on your condition and goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Manual therapy to reduce tension and improve mobility.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Targeted Exercises</h4><p>Posture correction and specific exercises to build strength.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Prevention</h4><p>Ongoing support and advice to help you stay pain-free.</p></div>
        </div>
    </div>

    <div class="cond-urgent-wrap">
        <div class="cond-goal" style="background:#fff; border:1px solid #e9ecef;">
            <div class="cond-urgent-content">
                <h3>Who Can Benefit?</h3>
                <ul class="cond-list" style="margin-top:15px;">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> People with acute or chronic neck pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Those with tension headaches</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Individuals with posture-related pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> People recovering from whiplash injuries</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Office workers and remote workers</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Older adults with age-related changes</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Anyone experiencing reduced neck mobility</li>
                </ul>
            </div>
        </div>
        <div class="cond-urgent" style="margin:0;">
            <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div class="cond-urgent-content">
                <h3>When to Seek Medical Advice</h3>
                <p>Please contact your GP or A&E if you experience:</p>
                <ul class="cond-urgent-list">
                    <li>Severe or worsening neck pain after a serious injury</li>
                    <li>Numbness, tingling or weakness in the arms or hands</li>
                    <li>Loss of balance or difficulty walking</li>
                    <li>Severe headache with neck stiffness and fever</li>
                    <li>Loss of bladder or bowel control</li>
                    <li>Any new or concerning neurological symptoms</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>How soon can I start physiotherapy for neck pain?</span> <span>+</span></div>
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help with tension headaches related to neck pain?</span> <span>+</span></div>
            <div class="faq-item"><span>Will the treatment be painful?</span> <span>+</span></div>
            <div class="faq-item"><span>What exercises will I need to do at home?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Neck Pain to a More Comfortable, Active You</h2>
            <p>Expert physiotherapy at your home, tailored to your goals. Book your session today and take the next step towards less pain, better movement and a better quality of life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

// ----------------------------------------------------
// 2. Sciatica
// ----------------------------------------------------
buildPage('sciatica.html', `
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Sciatica</div>
            <h1>Sciatica Physiotherapy<br>at Home</h1>
            <div class="subtitle">Relieve Nerve Pain. Improve Mobility.<br>Get Back to What You Love.</div>
            <p>Sciatica can cause pain, tingling or numbness that travels from your lower back down to the leg. Our physiotherapists provide personalised, evidence-based treatment at your home to reduce pain, improve movement and help you return to your daily activities comfortably.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home visits</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg> Experienced physios</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Personalised care</div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/sciatica.jpg" alt="Sciatica Physiotherapy">
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title">
            <h2>Understanding Sciatica</h2>
            <p>Sciatica occurs when the sciatic nerve is irritated or compressed, usually in the lower back. This can cause pain that travels from the back, through the buttock and down one or both legs.</p>
        </div>
        <div class="cond-split">
            <div class="cond-split-img">
                <img src="../images/conditions/sciatica-anatomy.jpg" alt="Anatomy of Sciatica" style="object-fit:contain;">
            </div>
            <div>
                <h2>Common Symptoms</h2>
                <ul class="cond-list" style="margin-top:20px;">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Lower back pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Buttock pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Pain down the leg</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Tingling or numbness</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Muscle weakness</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Worse with sitting, coughing or bending</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#f8fafc;">
        <div class="cond-split">
            <div>
                <h2>How Physiotherapy Can Help Sciatica</h2>
                <p style="margin-bottom:20px;">Our physiotherapists use a combination of hands-on treatment, movement-based exercises and education to help you:</p>
                <ul class="cond-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce nerve pain and inflammation</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve flexibility and mobility</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct posture and movement patterns</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Strengthen core and hip muscles</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Relieve pressure on the sciatic nerve</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support a safe return to work and daily activities</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Prevent future episodes with tailored advice</li>
                </ul>
            </div>
            <div class="cond-split-img">
                <img src="../images/Front Page.jpeg" alt="Physiotherapy treatment">
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title">
            <h2>Your Treatment Journey</h2>
            <p>We follow a clear, step-by-step process tailored to your needs and goals.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step"><div class="cond-step-num">01</div><h4>Detailed Assessment</h4><p>We understand your symptoms, daily activities and goals.</p></div>
            <div class="cond-step"><div class="cond-step-num">02</div><h4>Personalised Plan</h4><p>A tailored treatment plan based on your condition.</p></div>
            <div class="cond-step"><div class="cond-step-num">03</div><h4>Hands-on Treatment</h4><p>Manual therapy and nerve-friendly techniques to reduce pain.</p></div>
            <div class="cond-step"><div class="cond-step-num">04</div><h4>Targeted Exercises</h4><p>Specific exercises to improve strength, mobility and nerve sliding.</p></div>
            <div class="cond-step"><div class="cond-step-num">05</div><h4>Progress & Prevention</h4><p>Ongoing support and advice to keep you active and prevent recurrence.</p></div>
        </div>
    </div>

    <div class="cond-urgent-wrap">
        <div class="cond-goal" style="background:#fff; border:1px solid #e9ecef;">
            <div class="cond-urgent-content">
                <h3>Who Can Benefit?</h3>
                <ul class="cond-list" style="margin-top:15px;">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Individuals with sciatica or nerve-related leg pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> People with disc-related back pain</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Those whose symptoms are worse with sitting</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> People recovering from flare-ups</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Anyone wanting to prevent future episodes</li>
                </ul>
            </div>
        </div>
        <div class="cond-urgent" style="margin:0;">
            <svg class="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div class="cond-urgent-content">
                <h3>When to Seek Medical Advice</h3>
                <p>Contact your GP or A&E immediately if you experience:</p>
                <ul class="cond-urgent-list">
                    <li>Severe or worsening pain</li>
                    <li>Loss of bladder or bowel control</li>
                    <li>Progressive weakness in the leg</li>
                    <li>Numbness in the groin or inner thigh (saddle area)</li>
                    <li>Fever or unexplained weight loss</li>
                    <li>Any new or worsening neurological symptoms</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="cond-section" style="background:#fff;">
        <div class="cond-section-title"><h2>Frequently Asked Questions</h2></div>
        <div class="cond-faq">
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help if my sciatica keeps coming back?</span> <span>+</span></div>
            <div class="faq-item"><span>Will the treatment be painful?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help with work-related or posture-related sciatica?</span> <span>+</span></div>
            <div class="faq-item"><span>When can I return to exercise or sport?</span> <span>+</span></div>
        </div>
    </div>

    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>From Sciatica Pain to a More Active, Comfortable You</h2>
            <p>Expert physiotherapy at your home, tailored to your goals. Book your session today and take the next step towards less pain, better movement and a better quality of life.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image" style="background-image: url('../images/Front Page.jpeg');"></div>
    </div>
`);

console.log('Successfully created neck pain and sciatica pages!');
