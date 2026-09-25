const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract head, header, and footer from index.html
const headerMatch = indexHtml.match(/<main[^>]*>/);
const footerMatch = indexHtml.match(/<\/main>/);

let headAndHeader = indexHtml.substring(0, headerMatch.index + headerMatch[0].length);
let footerAndEnd = indexHtml.substring(footerMatch.index);

// Fix asset paths for a nested directory
headAndHeader = headAndHeader.replace(/href="style\.css"/g, 'href="../style.css"');
headAndHeader = headAndHeader.replace(/src="images\//g, 'src="../images/');
headAndHeader = headAndHeader.replace(/href="images\//g, 'href="../images/');
headAndHeader = headAndHeader.replace(/href="#how"/g, 'href="../index.html#how"');
headAndHeader = headAndHeader.replace(/href="#conditions"/g, 'href="../index.html#conditions"');
headAndHeader = headAndHeader.replace(/href="#pricing"/g, 'href="../index.html#pricing"');
headAndHeader = headAndHeader.replace(/href="#physios"/g, 'href="../index.html#physios"');
headAndHeader = headAndHeader.replace(/href="#about"/g, 'href="../index.html#about"');
headAndHeader = headAndHeader.replace(/href="#top"/g, 'href="../index.html"');
headAndHeader = headAndHeader.replace(/href="booking\/index\.html"/g, 'href="../booking/index.html"');

footerAndEnd = footerAndEnd.replace(/src="images\//g, 'src="../images/');
footerAndEnd = footerAndEnd.replace(/href="images\//g, 'href="../images/');
footerAndEnd = footerAndEnd.replace(/href="#top"/g, 'href="../index.html"');
footerAndEnd = footerAndEnd.replace(/href="booking\/index\.html"/g, 'href="../booking/index.html"');

// Create the template for the Back Pain page based on the mockup
const backPainHtml = `
    <!-- Custom Styles for Conditions -->
    <style>
        .cond-hero { background: #f4f5f4; padding: 60px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; max-width: 1200px; margin: 0 auto; }
        .cond-hero-text h1 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 52px; line-height: 1.1; margin-bottom: 20px; }
        .cond-hero-text .breadcrumb { font-size: 12px; color: #666; margin-bottom: 20px; }
        .cond-hero-text .subtitle { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 15px; }
        .cond-hero-text p { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.6; }
        .cond-hero-image img { width: 100%; border-radius: 12px; object-fit: cover; }
        .cond-trust { display: flex; gap: 30px; margin-top: 30px; font-size: 14px; font-weight: 600; color: #444; }
        .cond-trust div { display: flex; align-items: center; gap: 10px; }
        .cond-trust svg { width: 24px; height: 24px; color: var(--gold); }
        
        .cond-section { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .cond-section-title { text-align: center; margin-bottom: 50px; }
        .cond-section-title h2 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 36px; display: inline-flex; align-items: center; gap: 15px; }
        .cond-section-title h2::before, .cond-section-title h2::after { content: ''; width: 60px; height: 2px; background: var(--gold); }
        .cond-section-title p { color: #666; font-size: 16px; max-width: 600px; margin: 15px auto 0; }

        .cond-types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
        .cond-type-card { background: #f4f6fa; padding: 25px 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e9ecef; }
        .cond-type-card .icon-placeholder { width: 80px; height: 80px; margin: 0 auto 15px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden;}
        .cond-type-card h3 { font-size: 16px; color: var(--navy); margin-bottom: 10px; }
        .cond-type-card p { font-size: 12px; color: #666; line-height: 1.5; margin: 0; }

        .cond-help-split { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; }
        .cond-help-img img { width: 100%; border-radius: 12px; }
        .cond-help-list { list-style: none; padding: 0; }
        .cond-help-list li { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 16px; color: #444; }
        .cond-help-list svg { flex-shrink: 0; width: 24px; height: 24px; color: #2e7d32; }

        .cond-sym-cause { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .cond-box { background: #f4f6fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 40px; }
        .cond-box-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
        .cond-box-header h3 { font-size: 24px; color: var(--navy); margin: 0; }
        .cond-box-header .icon-wrapper { width: 48px; height: 48px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .cond-box-list { list-style: none; padding: 0; margin: 0; }
        .cond-box-list li { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; font-size: 15px; color: #555; }
        .cond-box-list svg { color: #2e7d32; width: 20px; height: 20px; }

        .cond-journey { display: flex; justify-content: space-between; align-items: flex-start; position: relative; padding-top: 20px; }
        .cond-journey::before { content: ''; position: absolute; top: 40px; left: 50px; right: 50px; height: 2px; background: #e0e0e0; z-index: 1; }
        .cond-step { flex: 1; text-align: center; position: relative; z-index: 2; padding: 0 10px; }
        .cond-step-num { width: 40px; height: 40px; background: #fdfaf5; border: 2px solid var(--gold); color: var(--gold); font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; background: #fff;}
        .cond-step-icon { width: 60px; height: 60px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f4f6fa; }
        .cond-step h4 { font-size: 15px; color: var(--navy); margin-bottom: 8px; }
        .cond-step p { font-size: 12px; color: #666; line-height: 1.4; }
        
        .cond-benefits { background: #f4f6fa; padding: 60px 20px; text-align: center; margin-top: 40px; }
        .cond-benefits-grid { display: flex; justify-content: center; gap: 40px; max-width: 1200px; margin: 40px auto 0; flex-wrap: wrap; }
        .cond-benefit { width: 160px; }
        .cond-benefit .icon-wrapper { width: 64px; height: 64px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .cond-benefit h4 { font-size: 14px; color: var(--navy); margin-bottom: 8px; }
        .cond-benefit p { font-size: 12px; color: #666; }
        
        .cond-urgent { background: #fee2e2; border: 1px solid #fecaca; border-radius: 12px; padding: 30px; display: flex; gap: 25px; align-items: flex-start; max-width: 1000px; margin: 60px auto; }
        .cond-urgent svg { width: 48px; height: 48px; color: #dc2626; flex-shrink: 0; }
        .cond-urgent-content h3 { color: #dc2626; font-size: 22px; margin: 0 0 10px; }
        .cond-urgent-content p { color: #444; font-size: 15px; margin: 0 0 15px; }
        .cond-urgent-list { margin: 0; padding-left: 20px; color: #444; font-size: 14px; line-height: 1.6; }
        
        .cond-faq { max-width: 800px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid #eee; padding: 20px 0; display: flex; justify-content: space-between; cursor: pointer; color: #444; font-size: 16px; }
        .faq-item:hover { color: var(--navy); }
        
        .cond-cta { background: var(--navy); color: #fff; display: flex; border-radius: 20px; overflow: hidden; margin: 80px auto; max-width: 1200px; }
        .cond-cta-content { padding: 60px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .cond-cta-content h2 { font-size: 36px; font-family: 'Playfair Display', serif; margin-bottom: 15px; }
        .cond-cta-content p { font-size: 16px; color: #b3c5d6; margin-bottom: 30px; line-height: 1.6; }
        .cond-cta-image { flex: 1; background-image: url('../images/Front Page.jpeg'); background-size: cover; background-position: center; }

        @media (max-width: 900px) {
            .cond-hero, .cond-help-split, .cond-sym-cause, .cond-cta { grid-template-columns: 1fr; display: flex; flex-direction: column; }
            .cond-journey { flex-direction: column; gap: 30px; }
            .cond-journey::before { display: none; }
            .cond-step { display: flex; text-align: left; align-items: flex-start; gap: 15px; }
            .cond-step-num { margin: 0; }
        }
    </style>

    <!-- 1. Hero Section -->
    <div class="cond-hero">
        <div class="cond-hero-text">
            <div class="breadcrumb">Home > Conditions > Back Pain</div>
            <h1>Back Pain Physiotherapy<br>at Home</h1>
            <div class="subtitle">Move with confidence.<br>Feel stronger. Get back to what you enjoy.</div>
            <p>Personalised, evidence-based physiotherapy to reduce pain, improve movement and prevent future episodes — all in the comfort of your home.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="display:inline-block; padding: 15px 30px; font-size: 16px;">Book a Session &rarr;</a>
            <div class="cond-trust">
                <div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Home visits<br>across your area
                </div>
                <div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                    Experienced<br>physiotherapists
                </div>
                <div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    Personalised<br>one-to-one care
                </div>
            </div>
        </div>
        <div class="cond-hero-image">
            <img src="../images/conditions/back-pain.jpg" alt="Woman experiencing back pain">
        </div>
    </div>

    <!-- 2. Types of Back Pain -->
    <div class="cond-section">
        <div class="cond-section-title">
            <h2>Types of Back Pain We Help With</h2>
            <p>Back pain can affect anyone and may be caused by many different factors. We assess your individual needs and tailor treatment accordingly.</p>
        </div>
        <div class="cond-types-grid">
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                <h3>Lower Back Pain</h3>
                <p>Common and can affect daily activities.</p>
            </div>
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg></div>
                <h3>Upper & Mid Back Pain</h3>
                <p>Related to posture, work or muscle strain.</p>
            </div>
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                <h3>Sciatica</h3>
                <p>Pain, tingling or numbness radiating to the legs.</p>
            </div>
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>
                <h3>Muscle Strain</h3>
                <p>Caused by lifting, sudden movements or overuse.</p>
            </div>
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                <h3>Postural Back Pain</h3>
                <p>Linked to prolonged sitting or poor ergonomics.</p>
            </div>
            <div class="cond-type-card">
                <div class="icon-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg></div>
                <h3>Work-Related Back Pain</h3>
                <p>Due to work postures or repetitive tasks.</p>
            </div>
        </div>
    </div>

    <!-- 3. How Physiotherapy Can Help -->
    <div class="cond-section" style="background: #fff;">
        <div class="cond-help-split">
            <div class="cond-help-img">
                <img src="../images/Front Page.jpeg" alt="Physiotherapy treatment">
            </div>
            <div>
                <div class="cond-section-title" style="text-align: left;">
                    <h2>How Physiotherapy Can Help</h2>
                </div>
                <p style="font-size: 16px; margin-bottom: 25px; color: #555;">Our physiotherapists use a combination of hands-on treatment, movement-based exercises and education to:</p>
                <ul class="cond-help-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduce pain and muscle tension</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Improve flexibility, strength and posture</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Restore normal movement and function</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Address the root cause, not just the symptoms</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Provide strategies to prevent recurrence</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 4. Symptoms and Causes -->
    <div class="cond-section">
        <div class="cond-sym-cause">
            <!-- Symptoms -->
            <div class="cond-box">
                <div class="cond-box-header">
                    <div class="icon-wrapper"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></div>
                    <h3>Common Symptoms</h3>
                </div>
                <ul class="cond-box-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Pain or stiffness in the lower, mid or upper back</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Muscle tightness or spasms</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Difficulty with standing, walking or sitting</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Pain that radiates to the legs (sciatica)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Reduced flexibility and movement</li>
                </ul>
            </div>
            <!-- Causes -->
            <div class="cond-box">
                <div class="cond-box-header">
                    <div class="icon-wrapper"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
                    <h3>Common Causes</h3>
                </div>
                <ul class="cond-box-list">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Poor posture (e.g., prolonged sitting)</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Muscle strain or overuse</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Sedentary lifestyle</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Incorrect lifting techniques</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Sports or work-related injuries</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Age-related changes (e.g., disc degeneration)</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 5. Treatment Journey -->
    <div class="cond-section" style="background: #fff;">
        <div class="cond-section-title">
            <h2>Your Back Pain Treatment Journey</h2>
            <p>We follow a clear, step-by-step process to help you get the best results.</p>
        </div>
        <div class="cond-journey">
            <div class="cond-step">
                <div class="cond-step-num">01</div>
                <div class="cond-step-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                <h4>Detailed Assessment</h4>
                <p>We understand your symptoms, lifestyle and goals.</p>
            </div>
            <div class="cond-step">
                <div class="cond-step-num">02</div>
                <div class="cond-step-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></div>
                <h4>Personalised Plan</h4>
                <p>A tailored treatment plan to suit your needs and condition.</p>
            </div>
            <div class="cond-step">
                <div class="cond-step-num">03</div>
                <div class="cond-step-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
                <h4>Hands-on Treatment</h4>
                <p>Techniques to reduce pain and improve mobility.</p>
            </div>
            <div class="cond-step">
                <div class="cond-step-num">04</div>
                <div class="cond-step-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line></svg></div>
                <h4>Targeted Exercises</h4>
                <p>Specific exercises to build strength, flexibility and control.</p>
            </div>
            <div class="cond-step">
                <div class="cond-step-num">05</div>
                <div class="cond-step-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                <h4>Progress & Prevention</h4>
                <p>Ongoing support and advice to keep you moving well.</p>
            </div>
        </div>
    </div>

    <!-- 6. Benefits -->
    <div class="cond-benefits">
        <div class="cond-section-title" style="margin-bottom: 20px;">
            <h2>Benefits of Home Physiotherapy</h2>
            <p>Receive expert care in a comfortable and familiar environment.</p>
        </div>
        <div class="cond-benefits-grid">
            <div class="cond-benefit">
                <div class="icon-wrapper"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>
                <h4>Convenient and flexible</h4>
            </div>
            <div class="cond-benefit">
                <div class="icon-wrapper"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg></div>
                <h4>No travel required</h4>
            </div>
            <div class="cond-benefit">
                <div class="icon-wrapper"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                <h4>Treatment tailored to you</h4>
            </div>
            <div class="cond-benefit">
                <div class="icon-wrapper"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
                <h4>Personalised one-to-one care</h4>
            </div>
            <div class="cond-benefit">
                <div class="icon-wrapper"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                <h4>Practical advice</h4>
            </div>
        </div>
    </div>

    <!-- 7. Urgent Help -->
    <div class="cond-urgent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div class="cond-urgent-content">
            <h3>When to Seek Urgent Medical Help</h3>
            <p>Please contact your GP or A&E immediately if you experience:</p>
            <ul class="cond-urgent-list">
                <li>New problems with bladder or bowel control</li>
                <li>Numbness around the groin or inner thighs (saddle area)</li>
                <li>Sudden or rapidly worsening weakness in the legs</li>
                <li>Severe pain after a significant injury (e.g. fall or accident)</li>
                <li>Unexplained weight loss, fever or night pain</li>
            </ul>
        </div>
    </div>

    <!-- 8. FAQ -->
    <div class="cond-section" style="background: #fff;">
        <div class="cond-section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions about back pain physiotherapy.</p>
        </div>
        <div class="cond-faq">
            <div class="faq-item"><span>How many sessions will I need?</span> <span>+</span></div>
            <div class="faq-item"><span>Do you treat sciatica?</span> <span>+</span></div>
            <div class="faq-item"><span>Can you help with long-term (persistent) back pain?</span> <span>+</span></div>
            <div class="faq-item"><span>What should I do before my home visit?</span> <span>+</span></div>
            <div class="faq-item"><span>Is back pain always due to a disc problem?</span> <span>+</span></div>
        </div>
    </div>

    <!-- 9. CTA -->
    <div class="cond-cta">
        <div class="cond-cta-content">
            <h2>Ready to Move with Less Pain?</h2>
            <p>Expert physiotherapy at your home, tailored to you. Book your session today and take the first step towards a stronger, healthier back.</p>
            <a href="../booking/index.html" class="btn btn-primary" style="align-self: flex-start; padding: 15px 30px; font-size: 16px; background: #fff; color: var(--navy);">Book a Session &rarr;</a>
        </div>
        <div class="cond-cta-image"></div>
    </div>
`;

const finalHtml = headAndHeader + backPainHtml + footerAndEnd;

const dir = path.join(__dirname, 'conditions');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'back-pain.html'), finalHtml);
console.log('Successfully created conditions/back-pain.html');
