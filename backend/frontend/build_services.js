const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const headerMatch = indexHtml.match(/<main[^>]*>/);
const footerMatch = indexHtml.match(/<\/main>/);

const headAndHeader = indexHtml.substring(0, headerMatch.index + headerMatch[0].length);
const footerAndEnd = indexHtml.substring(footerMatch.index);

const defaultBlurbs = [
    { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your home' },
    { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Experienced<br>Physiotherapists', desc: 'HCPC registered' },
    { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Personalised<br>Treatment', desc: 'Tailored to your goals' },
    { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Evidence-Based<br>Care', desc: 'Proven results' }
];

const defaultSteps = [
    { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Discuss', desc: 'We\'ll talk about your symptoms, medical history and daily activities.' },
    { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>', title: 'Assess', desc: 'A thorough physical assessment to understand your movement and function.' },
    { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Treat', desc: 'Personalised exercises, hands-on techniques and expert advice.' },
    { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Get Back to Life', desc: 'Support to return safely to the activities you love.' }
];

const defaultConditionsCards = [
            { icon: '../images/conditions/Musculoskeletal/Back_and_Lower_Back_Pain.png', title: 'Back & Lower<br>Back Pain', desc: 'Relieve pain, improve posture and restore movement.' },
            { icon: '../images/conditions/Musculoskeletal/Neck_Pain_and_Stiffness.png', title: 'Neck Pain<br>and Stiffness', desc: 'Reduce pain and tension, improve mobility and prevent recurrence.' },
            { icon: '../images/conditions/Musculoskeletal/Shoulder_Pain.png', title: 'Shoulder<br>Pain', desc: 'Targeted treatment for rotator cuff injuries, frozen shoulder and other shoulder problems.' },
            { icon: '../images/conditions/Musculoskeletal/Knee_Hip_and_Ankle_Problems.png', title: 'Knee, Hip and<br>Ankle Problems', desc: 'Support for pain, injuries and post-surgical rehabilitation.' },
            { icon: '../images/conditions/Musculoskeletal/Muscle_Strains_and_Ligament_Sprains.png', title: 'Muscle Strains<br>and Ligament Sprains', desc: 'Speed up recovery and prevent future injuries.' },
            { icon: '../images/conditions/Musculoskeletal/Tendon_Problems.png', title: 'Tendon<br>Problems', desc: 'Treatment for tendinopathy and long-term tendon issues.' },
            { icon: '../images/conditions/Musculoskeletal/Sciatica.png', title: 'Sciatica', desc: 'Relieve nerve pain, improve mobility and support long-term management.' },
            { icon: '../images/conditions/Musculoskeletal/Arthritis_and_Joint_Pain.png', title: 'Arthritis and<br>Joint Pain', desc: 'Manage pain, improve function and maintain independence.' }
        ];

const services = [
    { 
        id: 'sports-physio', 
        title: 'Sports Physiotherapy', 
        subtitle: 'Recover faster. Perform stronger.<br>Get back to peak performance.',
        desc: 'Expert assessment, rehabilitation, and injury prevention for athletes, runners, and active individuals — delivered directly to your home or training ground so you can return to the sport you love.',
        image: 'sports-hero.jpg',
        heroTheme: 'light',
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home & Field<br>Visits', desc: 'Convenient rehab<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Elite Sports<br>Physios', desc: 'HCPC registered<br>performance specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Sport-Specific<br>Rehab', desc: 'Tailored programs<br>for your discipline' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Evidence-Based<br>Performance', desc: 'Proven strategies<br>to minimize injury' }
        ],
        heroOverlay: {
            text: 'ELITE<br>RECOVERY<br>HIGHER<br>PERFORMANCE<br>UNLIMITED<br>POTENTIAL',
            handwriting: 'Helping you<br>reach your peak<br>performance.'
        },
        conditionsTitle: 'Common Sports Injuries We Help With',
        conditionsCards: [
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Runner\'s Knee' },
            { icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', title: 'ACL Rehab' },
            { icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', title: 'Ankle Sprains' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', title: 'Hamstring<br>Strains' },
            { icon: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path>', title: 'Shoulder<br>Impingement' },
            { icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', title: 'Achilles<br>Tendinopathy' },
            { icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', title: 'Tennis Elbow' },
            { icon: '<path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>', title: 'Shin Splints' },
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', title: 'Groin Strains' },
            { icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>', title: 'Post-Surgical' }
        ],
        quoteBox: {
            quote: 'Train smarter.<br>Recover faster.<br>Perform at your<br>highest level.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Performance Audit', desc: 'We\'ll discuss your symptoms, medical history and training goals.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Sport-Specific<br>Assessment', desc: 'A thorough physical assessment to understand your sport-specific movement and function.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Progressive Rehab', desc: 'Personalised exercise programs, hands-on techniques and expert advice.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Return to Play', desc: 'Support to safely return to your sport and peak performance.' }
        ],
        ctaTitle: 'Elite Sports Physiotherapy in the<br>Comfort of Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized performance expertise directly to your environment.'
    },
    { 
        id: 'neuro-physio', 
        title: 'Neurological Physiotherapy', 
        subtitle: 'Rebuild movement. Regain independence.<br>Expert neuro-rehabilitation at home.',
        desc: 'Expert in-home assessment and targeted therapy for individuals with conditions affecting the brain and spinal cord, focused on restoring mobility, function, and quality of life.',
        image: 'Front Page.jpeg',
        heroTheme: 'dark',
        heroOverlay: {
            text: 'REGain your<br>independence<br>and progress.',
            handwriting: 'REGain movement.<br>gait confidence.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient rehab<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Neuro Experts', desc: 'HCPC registered<br>neuro specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Targeted Therapy', desc: 'Tailored programs<br>for your condition' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Evidence-Based', desc: 'Proven strategies<br>for independence' }
        ],
        conditionsTitle: 'Common Neuro Conditions We Help With',
        conditionsCards: [
            { icon: '../images/conditions/Neurological/Stroke_Recovery.png', title: 'Stroke<br>Recovery', desc: 'Rehabilitation to improve movement, strength, balance and independence after stroke.' },
            { icon: '../images/conditions/Neurological/Parkinsons_Disease.png', title: 'Parkinson\'s<br>Disease', desc: 'Targeted exercises to improve mobility, balance, posture and daily function.' },
            { icon: '../images/conditions/Neurological/Multiple_Sclerosis.png', title: 'Multiple<br>Sclerosis', desc: 'Personalised rehabilitation to manage symptoms, maintain function and improve quality of life.' },
            { icon: '../images/conditions/Neurological/Brain_Injury.png', title: 'Brain<br>Injury', desc: 'Specialist rehab to regain skills, improve cognitive and physical function and support daily living.' },
            { icon: '../images/conditions/Neurological/Balance_Disorders.png', title: 'Balance<br>Disorders', desc: 'Assessment and balance training to reduce falls and improve confidence.' },
            { icon: '../images/conditions/Neurological/Motor_Neurone_Disease.png', title: 'Motor Neurone<br>Disease', desc: 'Tailored physiotherapy to maintain mobility, comfort and independence for as long as possible.' },
            { icon: '../images/conditions/Neurological/Peripheral_Neuropathy.png', title: 'Peripheral<br>Neuropathy', desc: 'Support to improve strength, balance, sensation and walking ability.' },
            { icon: '../images/conditions/Neurological/Spinal_Cord_Conditions.png', title: 'Spinal Cord<br>Conditions', desc: 'Rehabilitation to improve mobility, strength, bladder and bowel function and overall independence.' },
            { icon: '../images/conditions/Neurological/Spasticity_Management.png', title: 'Spasticity<br>Management', desc: 'Evidence-based techniques to reduce spasticity, improve movement and ease daily function.' },
            { icon: '../images/conditions/Neurological/Mobility_Retraining.png', title: 'Mobility<br>Retraining', desc: 'Task-specific training to improve mobility, coordination and functional independence.' }
        ],
        quoteBox: {
            quote: 'Regain movement.<br>Rebuild confidence.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Consult', desc: 'Initial history & goals.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Neuro Assessment', desc: 'Comprehensive balance & function.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Tailored Neuro Rehab', desc: 'Evidence-based movement therapy.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Long-term Progression', desc: 'Ongoing support for independence.' }
        ],
        ctaTitle: 'Specialist Neurological Physiotherapy<br>in the Comfort of Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized neuro-rehabilitation expertise directly to your environment.'
    },
    { 
        id: 'musculoskeletal', 
        title: 'Musculoskeletal Physiotherapy', 
        subtitle: 'Move better. Feel stronger.<br>Get back to what you love.',
        desc: 'Expert assessment and treatment for back pain, neck pain, joint pain, arthritis and other musculoskeletal conditions — so you can get back to doing what you love.',
        image: 'musculoskeletal.jpg',
        heroTheme: 'light',
        heroOverlay: {
            text: 'STRONGER<br>MOVEMENT<br>HEALTHIER<br>HAPPIER<br>YOU',
            handwriting: 'Helping you<br>move towards<br>a pain-free life'
        },
        conditionsTitle: 'Common Musculoskeletal Conditions We Help With',
        quoteBox: {
            quote: 'Less pain.<br>More movement.<br>A healthier you.',
            author: 'NEXmove Physio'
        },
        ctaTitle: 'Physiotherapy in the<br>Comfort of Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists come to you, allowing your assessment and rehabilitation to take place in your own environment.'
    },
    { 
        id: 'respiratory-physio', 
        title: 'Respiratory Physiotherapy', 
        subtitle: 'Breathe easier. Improve lung function.<br>Regain control of your health at home.',
        desc: 'Expert home-based respiratory assessment and targeted chest therapy for individuals with chronic breathing conditions, post-operative recovery, and asthma management, focused on restoring lung capacity, reducing shortness of breath, and enhancing overall function and quality of life.',
        image: 'Front Page.jpeg', 
        heroTheme: 'light',
        heroOverlay: {
            text: 'IMPROVED<br>BREATHING.<br>RESTORED<br>CAPACITY.',
            handwriting: 'Helping you find<br>your breath again.<br>Expert care.<br>Proven results.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Respiratory Experts', desc: 'HCPC registered<br>specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Lung Function Focus', desc: 'Tailored programs for<br>breathing efficiency' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Evidence-Based Techniques', desc: 'Proven strategies<br>for chest clearance' }
        ],
        conditionsTitle: 'Common Respiratory Conditions We Help With',
        conditionsCards: [
            { icon: '../images/conditions/Respiratory/COPD.png', title: 'COPD', desc: 'Breathing exercises, airway clearance techniques and rehabilitation to improve breathlessness and quality of life.' },
            { icon: '../images/conditions/Respiratory/Asthma_Management.png', title: 'Asthma<br>Management', desc: 'Personalised breathing techniques and exercise programmes to reduce symptoms and improve control.' },
            { icon: '../images/conditions/Respiratory/Bronchiectasis.png', title: 'Bronchiectasis', desc: 'Airway clearance, breathing retraining and exercise to reduce infections and improve lung function.' },
            { icon: '../images/conditions/Respiratory/Post_Operative_Recovery.png', title: 'Post-Operative<br>Recovery', desc: 'Breathing exercises and chest physiotherapy to support recovery after surgery and prevent complications.' },
            { icon: '../images/conditions/Respiratory/Pneumonia_Recovery.png', title: 'Pneumonia<br>Recovery', desc: 'Chest clearance techniques, breathing exercises and graded activity to restore lung function and reduce recurrence.' },
            { icon: '../images/conditions/Respiratory/Chronic_Bronchitis.png', title: 'Chronic<br>Bronchitis', desc: 'Breathing control, airway clearance and exercise to reduce symptoms and improve stamina.' },
            { icon: '../images/conditions/Respiratory/Long_COVID_Rehab.png', title: 'Long COVID<br>Rehab', desc: 'Individualised rehabilitation to improve breathing, reduce fatigue and help you return to daily activities.' },
            { icon: '../images/conditions/Respiratory/Breathing_Pattern_Disorders.png', title: 'Breathing Pattern<br>Disorders', desc: 'Assessment and retraining to improve breathing technique, reduce breathlessness and restore normal breathing patterns.' },
            { icon: '../images/conditions/Respiratory/Lung_Capacity_Building.png', title: 'Lung Capacity<br>Building', desc: 'Targeted breathing exercises and progressive training to improve lung capacity, endurance and overall fitness.' },
            { icon: '../images/conditions/Respiratory/Airway_Clearance_Techniques.png', title: 'Airway Clearance<br>Techniques', desc: 'Specialised techniques to help clear mucus, improve airway function and make breathing easier.' }
        ],
        quoteBox: {
            quote: 'Regain breath.<br>Rebuild vitality.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Consult', desc: 'Initial history & symptoms.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Respiratory Assessment', desc: 'Comprehensive lung function & capacity.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Chest & Breathing Therapy', desc: 'Evidence-based techniques.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Self-Management Plan', desc: 'Ongoing support for lung health.' }
        ],
        ctaTitle: 'Specialist Respiratory Physiotherapy<br>in the Comfort of Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized respiratory expertise directly to your environment.'
    },
    { 
        id: 'paediatric-physio', 
        title: 'Paediatric Physiotherapy', 
        subtitle: 'Helping children move, play, and thrive.<br>Specialist paediatric care at home.',
        desc: 'Specialist in-home physiotherapy for infants, children, and adolescents, focusing on development, mobility, and play to help your child reach their full potential in a comfortable and familiar environment.',
        image: 'Front Page.jpeg', 
        heroTheme: 'dark',
        heroOverlay: {
            text: 'STRONGER<br>MILESTONES.<br>CONFIDENT<br>STEPS.',
            handwriting: 'Helping your<br>little ones thrive.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Specialist<br>Paediatric Physios', desc: 'HCPC registered<br>specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Fun & Play-Based<br>Therapy', desc: 'Tailored programs for<br>children\'s engagement' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Developmental<br>Milestones', desc: 'Focus on motor<br>skills & growth' }
        ],
        conditionsTitle: 'Common Paediatric Conditions We Treat',
        conditionsCards: [
            { icon: '../images/conditions/Paediatric/Developmental_Delay.png', title: 'Developmental<br>Delay', desc: 'Support to achieve movement, play and developmental milestones.' },
            { icon: '../images/conditions/Paediatric/Torticollis_and_Placquiredocephaly.png', title: 'Torticollis &<br>Plagiocephaly', desc: 'Targeted therapy to improve neck movement, head shape and posture.' },
            { icon: '../images/conditions/Paediatric/Cerebral_Palsy.png', title: 'Cerebral<br>Palsy', desc: 'Individualised therapy to improve mobility, strength, function and independence.' },
            { icon: '../images/conditions/Paediatric/Toe_Walking.png', title: 'Toe<br>Walking', desc: 'Assessment and treatment to improve walking pattern, balance and posture.' },
            { icon: '../images/conditions/Paediatric/Hypermobility_and_Low_Tone.png', title: 'Hypermobility<br>& Low Tone', desc: 'Build strength, stability and motor control to support daily activities.' },
            { icon: '../images/conditions/Paediatric/Down_Syndrome.png', title: 'Down<br>Syndrome', desc: 'Support for motor development, strength, balance and independence.' },
            { icon: '../images/conditions/Paediatric/Coordination_and_Dyspraxia.png', title: 'Coordination<br>& Dyspraxia', desc: 'Targeted exercises to improve coordination, motor planning and confidence.' },
            { icon: '../images/conditions/Paediatric/Postural_and_Gait_Issues.png', title: 'Postural &<br>Gait Issues', desc: 'Assessment and treatment to improve posture, alignment and walking patterns.' },
            { icon: '../images/conditions/Paediatric/Congenital_Conditions.png', title: 'Congenital<br>Conditions', desc: 'Specialist rehabilitation to support movement, strength and functional skills.' },
            { icon: '../images/conditions/Paediatric/Juvenile_Arthritis.png', title: 'Juvenile<br>Arthritis', desc: 'Pain management, mobility exercises and activity support to keep children active.' }
        ],
        quoteBox: {
            quote: 'Every step is a<br>milestone.<br>Growing stronger<br>every day.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Discover', desc: 'Initial chat & family goals.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Playful Assessment', desc: 'Comprehensive child developmental review.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Play-Based Therapy', desc: 'Engaging, game-focused exercises.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Empower Family', desc: 'Long-term guidance & support.' }
        ],
        ctaTitle: 'Specialist Paediatric Physiotherapy<br>in the Comfort of Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized paediatric care directly to your child\'s environment.',
        trustBar: [
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', text: 'Personalised care<br>for children' },
            { icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', text: 'HCPC Registered' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', text: 'Trusted by parents &<br>paediatricians' },
            { icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', text: 'Real results<br>for little ones' }
        ]
    },
    { 
        id: 'geriatric-care', 
        title: 'Geriatric Physiotherapy', 
        subtitle: 'Maintain independence. Prevent falls.<br>Move safely at home.',
        desc: 'Gentle, compassionate in-home physiotherapy tailored for seniors and older adults. We focus on enhancing balance, preserving joint mobility, strengthening muscles, and restoring confidence in everyday movements without clinic travel.',
        image: 'Front Page.jpeg', 
        heroTheme: 'dark',
        heroOverlay: {
            text: 'GREATER<br>CONFIDENCE.<br>SAFE<br>MOBILITY.<br>ACTIVE<br>LIVING.',
            handwriting: 'Supporting you<br>every step of the way.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Elderly Care<br>Experts', desc: 'HCPC registered<br>specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Falls<br>Prevention', desc: 'Tailored programs for<br>fall prevention' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Daily<br>Independence', desc: 'Focus on mobility<br>& function' }
        ],
        conditionsTitle: 'Common Senior Mobility Conditions We Treat',
        conditionsCards: [
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>', title: 'Balance &<br>Falls' },
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', title: 'Osteoarthritis' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Post-Hospital<br>Care' },
            { icon: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path>', title: 'Joint<br>Replacement' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', title: 'General<br>Weakness' },
            { icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', title: 'Osteoporosis' },
            { icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>', title: 'Chair<br>Transfers' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Reduced<br>Mobility' },
            { icon: '<path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>', title: 'Parkinson\'s<br>Care' },
            { icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>', title: 'Stair<br>Confidence' }
        ],
        quoteBox: {
            quote: 'Stay active.<br>Stay safe.<br>Stay independent<br>at home.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Consult', desc: 'Initial chat & family goals.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Assess', desc: 'Comprehensive physical & mobility review.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Rehabilitate', desc: 'Engaging, supportive exercises.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Sustain Independence', desc: 'Long-term guidance & support.' }
        ],
        ctaTitle: 'Compassionate Elderly Care<br>Physiotherapy in Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized elderly care directly to your environment.'
    },
    { 
        id: 'womens-health', 
        title: 'Women\'s Health Physiotherapy', 
        subtitle: 'Empowering women through every stage of life.<br>Specialist pelvic health & postnatal care at home.',
        desc: 'Expert, discreet in-home physiotherapy for pelvic floor dysfunction, pregnancy-related pain, and postnatal recovery, providing personalized care to help you feel strong and confident.',
        image: 'Front Page.jpeg', 
        heroTheme: 'dark',
        heroOverlay: {
            text: 'RESTORE<br>STRENGTH.<br>RECLAIM<br>COMFORT.',
            handwriting: 'Empowering your<br>wellness journey.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Women\'s Health<br>Specialists', desc: 'HCPC registered<br>specialists' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', title: 'Prenatal &<br>Postnatal Care', desc: 'Tailored programs for<br>pregnancy & recovery' },
            { icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', title: 'Evidence-Based<br>Pelvic Health', desc: 'Proven strategies to<br>minimize discomfort' }
        ],
        conditionsTitle: 'Common Women\'s Health Conditions We Treat',
        conditionsCards: [
            { icon: '../images/conditions/Womens_Health/Pelvic_Floor_Dysfunction.png', title: 'Pelvic Floor<br>Dysfunction', desc: 'Assessment and treatment to improve pelvic floor strength, control and confidence.' },
            { icon: '../images/conditions/Womens_Health/Pregnancy_Back_and_Pelvic_Pain.png', title: 'Pregnancy Back<br>& Pelvic Pain', desc: 'Specialist support to relieve pain, improve posture and keep you active during pregnancy.' },
            { icon: '../images/conditions/Womens_Health/Diastasis_Recti.png', title: 'Diastasis<br>Recti', desc: 'Targeted exercises and rehabilitation to restore core strength and abdominal function.' },
            { icon: '../images/conditions/Womens_Health/Postnatal_Recovery.png', title: 'Postnatal<br>Recovery', desc: 'Personalised rehabilitation to regain strength, mobility and confidence after birth.' },
            { icon: '../images/conditions/Womens_Health/Urinary_Incontinence.png', title: 'Urinary<br>Incontinence', desc: 'Evidence-based treatment to improve bladder control and pelvic health.' },
            { icon: '../images/conditions/Womens_Health/Prolapse_Support.png', title: 'Prolapse<br>Support', desc: 'Specialist assessment and management to support pelvic organ prolapse and improve quality of life.' },
            { icon: '../images/conditions/Womens_Health/Scar_Management.png', title: 'Scar<br>Management', desc: 'Treatment to improve mobility, reduce tension and optimise healing after surgery.' },
            { icon: '../images/conditions/Womens_Health/Sacroiliac_Joint_Dysfunction.png', title: 'Sacroiliac Joint<br>Dysfunction', desc: 'Hands-on treatment and exercise to reduce pain and improve stability and function.' },
            { icon: '../images/conditions/Womens_Health/Bowel_Health.png', title: 'Bowel<br>Health', desc: 'Support for bowel function, constipation and pelvic floor coordination.' },
            { icon: '../images/conditions/Womens_Health/Menopause_Related_Bone_Health.png', title: 'Menopause-Related<br>Bone Health', desc: 'Exercise and lifestyle support to maintain bone strength, mobility and overall wellbeing.' }
        ],
        quoteBox: {
            quote: 'Restore strength.<br>Reclaim comfort.<br>Thrive in every<br>stage.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Consult', desc: 'Initial chat & symptoms.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Assess', desc: 'Comprehensive physical & pelvic review.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Treat', desc: 'Engaging & supportive exercises.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Empower', desc: 'Long-term guidance & support.' }
        ],
        ctaTitle: 'Specialist Women\'s Health<br>Physiotherapy in Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized women\'s health expertise directly to your environment.',
        trustBar: [
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', text: 'Personalised care' },
            { icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', text: 'HCPC Registered' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', text: 'Trusted by women\'s<br>health specialists' },
            { icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', text: 'Real results' }
        ]
    },
    { 
        id: 'post-surgical-rehab', 
        title: 'Post-Surgical Rehabilitation', 
        subtitle: 'Safe recovery. Restored mobility.<br>Expert post-operative care at home.',
        desc: 'Expert in-home assessment and tailored rehabilitation for individuals recovering from joint replacements (knee, hip, shoulder), ACL repairs, spinal surgery, and major trauma — delivered directly to your home so you can safely and confidently regain mobility, strength, and function.',
        image: 'Front Page.jpeg', 
        heroTheme: 'dark',
        heroOverlay: {
            text: 'SAFE RECOVERY.<br>RESTORED<br>STRENGTH.<br>CONFIDENT STEPS.',
            handwriting: 'Your path to a<br>full recovery.'
        },
        blurbs: [
            { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', title: 'Home Visits', desc: 'Convenient care<br>at your location' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>', title: 'Post-Surgical<br>Specialists', desc: 'HCPC registered<br>specialists' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Protocol-Driven<br>Care', desc: 'Tailored programs for<br>every procedure' },
            { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', title: 'Safe Progression', desc: 'Proven strategies to<br>minimize discomfort' }
        ],
        conditionsTitle: 'Common Post-Surgical Conditions We Treat',
        conditionsCards: [
            { icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', title: 'Knee<br>Replacement' },
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', title: 'Hip<br>Replacement' },
            { icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', title: 'ACL & Ligament<br>Repair' },
            { icon: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path>', title: 'Shoulder &<br>Rotator Cuff' },
            { icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', title: 'Spinal & Disc<br>Surgery' },
            { icon: '<path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>', title: 'Fracture &<br>Trauma Fixation' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>', title: 'Joint<br>Arthroscopy' },
            { icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>', title: 'Foot & Ankle<br>Surgery' },
            { icon: '<path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 5 0v-15A2.5 2.5 0 0 0 14.5 2z"></path>', title: 'Scar & Swelling<br>Management' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Mobility & Stairs<br>Confidence' }
        ],
        quoteBox: {
            quote: 'Safe recovery.<br>Restored mobility.<br>Back to<br>independence.',
            author: 'NEXmove Physio'
        },
        processSteps: [
            { icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', title: 'Consult', desc: 'Initial chat & surgical history.' },
            { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', title: 'Assess', desc: 'Comprehensive physical review.' },
            { icon: '<line x1="6" y1="5" x2="6" y2="19"></line><line x1="18" y1="5" x2="18" y2="19"></line><line x1="6" y1="12" x2="18" y2="12"></line>', title: 'Treat', desc: 'Safe, protocol-driven exercises.' },
            { icon: '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5"></path><path d="M19 20H5"></path>', title: 'Empower', desc: 'Long-term guidance & support.' }
        ],
        ctaTitle: 'Specialist Post-Surgical<br>Rehabilitation in Your Home',
        ctaDesc: 'You don\'t need to travel to a clinic. Our physiotherapists bring specialized post-operative expertise directly to your environment.',
        trustBar: [
            { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', text: 'Personalised care' },
            { icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', text: 'HCPC Registered' },
            { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', text: 'Trusted by surgeons<br>& consultants' },
            { icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', text: 'Real results' }
        ]
    }
];

services.forEach(service => {
    
    // Resolve defaults
    const isDark = service.heroTheme === 'dark';
    const hBg = isDark ? '#111d33' : 'var(--cream)';
    const hTextMain = isDark ? 'white' : 'var(--navy)';
    const hTextSub = isDark ? 'rgba(255,255,255,0.8)' : 'var(--text)';
    const hTextMuted = isDark ? 'rgba(255,255,255,0.6)' : 'var(--muted)';
    const hBtnBg = isDark ? '#5a7667' : 'var(--navy)';
    const hBtnBorder = isDark ? 'rgba(255,255,255,0.3)' : 'var(--navy)';
    const hBtnText = isDark ? 'white' : 'var(--navy)';
    const overlayTextSize = isDark ? '24px' : '16px';
    const overlayTextWeight = isDark ? '400' : '700';
    const overlayFont = isDark ? "'Playfair Display', serif; font-style: italic" : "sans-serif";
    const overlayHandwritingColor = isDark ? '#111d33' : 'var(--navy)';

    const blurbs = service.blurbs || defaultBlurbs;
    const heroOverlay = service.heroOverlay || {
        text: 'STRONGER<br>MOVEMENT<br>HEALTHIER<br>HAPPIER<br>YOU',
        handwriting: 'Helping you<br>move towards<br>a pain-free life'
    };
    const conditionsTitle = service.conditionsTitle || ('Common ' + service.title.replace(' Physiotherapy', '') + ' Conditions We Help With');
    const conditionsCards = service.conditionsCards || defaultConditionsCards;
    const quoteBox = service.quoteBox || {
        quote: 'Less pain.<br>More movement.<br>A healthier you.',
        author: 'NEXmove Physio'
    };
    const processSteps = service.processSteps || defaultSteps;
    const ctaTitle = service.ctaTitle || 'Physiotherapy in the<br>Comfort of Your Home';
    const ctaDesc = service.ctaDesc || 'You don\'t need to travel to a clinic. Our physiotherapists come to you, allowing your assessment and rehabilitation to take place in your own environment.';
    
    const trustBarItems = service.trustBar || [
        { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', text: 'Personalised care' },
        { icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', text: 'HCPC registered' },
        { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', text: 'Trusted by 500+ patients' },
        { icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', text: 'Real results' }
    ];

    const conditionsHTML = conditionsCards.map(c => `
        <div style="background: #fdfefd; border-radius: 12px; padding: 25px 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; height: 100%;">
            ${c.icon.endsWith('.png') || c.icon.endsWith('.jpg') ? 
                `<img src="${c.icon}" alt="${c.title.replace('<br>', ' ')}" style="width: 50px; height: 50px; margin-bottom: 15px; margin-inline: auto; display: block; object-fit: contain;">` : 
                `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="1.2" style="margin-bottom: 15px; margin-inline: auto;">${c.icon}</svg>`
            }
            <h4 style="font-size: 15px; font-weight: 700; color: var(--navy); line-height: 1.3; margin-bottom: 10px; font-family: 'Playfair Display', serif;">${c.title}</h4>
            ${c.desc ? `<p style="font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 20px; flex-grow: 1;">${c.desc}</p>` : '<div style="flex-grow: 1;"></div>'}
            <a href="#" style="font-size: 13px; font-weight: 600; color: var(--navy); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">Learn more <span style="background: #eaf1ed; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: var(--green);">&rarr;</span></a>
        </div>
    `).join('');
    
    const blurbsHTML = blurbs.map(b => `
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${hTextMain}" stroke-width="1.5">${b.icon}</svg>
            <h4 style="font-size: 12px; font-weight: 700; color: ${hTextMain}; margin: 8px 0 4px; line-height: 1.2;">${b.title}</h4>
            <p style="font-size: 11px; color: ${hTextMuted}; line-height: 1.3;">${b.desc}</p>
        </div>
    `).join('');
    
    const stepsHTML = processSteps.map((s, idx) => `
        <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span style="background: #5a7667; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">${idx+1}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="1.5">${s.icon}</svg>
            </div>
            <h4 style="font-size: 15px; color: var(--navy); margin-bottom: 8px; line-height: 1.2;">${s.title}</h4>
            <p style="font-size: 13px; color: var(--muted); line-height: 1.5;">${s.desc}</p>
        </div>
    `).join('');
    
    const trustBarHTML = trustBarItems.map(t => `
        <span style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${t.icon}</svg> 
            <span>${t.text}</span>
        </span>
    `).join('');

    const html = `
        <main style="background: var(--cream);">
            
            <div style="background: ${hBg};">
                <div class="container breadcrumb" style="padding: 20px 0; font-size: 11px; color: ${hTextMuted}; font-weight: 500;">
                    Home &gt; Our Services &gt; ${service.title}
                </div>

                <!-- Hero -->
                <section class="service-hero" style="padding-bottom: 40px; overflow: hidden;">
                    <div class="container">
                        <div class="hero-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: stretch; min-height: unset;">
                            
                            <div class="hero-copy" style="padding: 20px 0 40px; justify-content: flex-start;">
                                <span class="eyebrow" style="justify-content: flex-start; margin-bottom: 20px; color: ${hTextMuted}; border-color: ${isDark ? 'rgba(255,255,255,0.2)' : 'var(--navy)'};">OUR SERVICES</span>
                                <h1 style="font-family: 'Playfair Display', serif; font-size: 56px; color: ${hTextMain}; line-height: 1.1; margin-bottom: 20px;">${service.title}</h1>
                                <h3 style="font-size: 22px; color: ${isDark ? 'white' : 'var(--green)'}; margin-bottom: 15px; font-weight: 400; line-height: 1.3;">${service.subtitle}</h3>
                                <p style="color: ${hTextSub}; font-size: 16px; margin-bottom: 40px; max-width: 480px; line-height: 1.6;">${service.desc}</p>
                                
                                <div class="hero-actions" style="display: flex; gap: 16px; margin-bottom: 60px;">
                                    <a href="../booking/index.html" class="btn btn-primary" style="background: ${hBtnBg}; color: white; border-radius: 99px; padding: 0 32px; min-height: 54px; font-size: 14px; text-transform: uppercase;">Book Your Consultation</a>
                                    <a href="tel:+447436059680" class="btn btn-outline" style="border: 1px solid ${hBtnBorder}; color: ${hBtnText}; border-radius: 99px; padding: 0 24px; min-height: 54px; font-size: 15px; background: transparent;">&#9742; +44 7436 059680</a>
                                </div>
                                
                                <!-- Blurbs -->
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                                    ${blurbsHTML}
                                </div>
                            </div>

                            <!-- Image Right -->
                            <div class="hero-media" style="position: relative; border-radius: 0; min-height: unset; margin: -50px 0 0 0; overflow: visible; z-index: 2;">
                                <img src="../images/${service.image}" style="width: 100%; height: 100%; object-fit: cover; border-bottom-left-radius: 120px; border-top-left-radius: ${isDark ? '300px' : '0'};" alt="${service.title}">
                                
                                <div style="position: absolute; top: 40px; right: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); padding: 25px; border-radius: 12px; box-shadow: var(--shadow);">
                                    <p style="font-family: ${overlayFont}; font-size: ${overlayTextSize}; font-weight: ${overlayTextWeight}; color: ${overlayHandwritingColor}; line-height: 1.4; letter-spacing: ${isDark ? '0' : '1px'};">${heroOverlay.text}</p>
                                    <div style="width: 20px; height: 2px; background: var(--green); margin-top: 15px;"></div>
                                </div>

                                <div style="position: absolute; bottom: 80px; right: -20px; transform: rotate(-5deg); font-family: 'Playfair Display', serif; font-style: italic; font-size: 24px; color: ${overlayHandwritingColor}; line-height: 1.2;">
                                    ${heroOverlay.handwriting}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Conditions Grid -->
            <section class="section" style="padding: 60px 0; background: var(--cream2);">
                <div class="container">
                    <div class="section-head" style="margin-bottom: 40px;">
                        <span class="eyebrow">CONDITIONS WE CAN HELP WITH</span>
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 38px; color: var(--navy);">${conditionsTitle}</h2>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
                        ${conditionsHTML}
                        
                        <!-- Green Quote Box spans remaining space -->
                        <div style="grid-column: span 1; background: #5a7667; border-radius: 16px; padding: 30px 25px; color: white; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 30px rgba(90, 118, 103, 0.2);">
                            <span style="font-size: 60px; font-family: Georgia, serif; line-height: 0.6; opacity: 0.5; margin-bottom: 20px;">&ldquo;</span>
                            <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; line-height: 1.3; font-weight: 400; margin-bottom: 30px;">${quoteBox.quote}</h3>
                            <div style="width: 30px; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 10px;"></div>
                            <p style="font-size: 13px; opacity: 0.9;">${quoteBox.author}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- What to Expect -->
            <section class="section" style="padding: 80px 0; background: var(--cream);">
                <div class="container" style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 60px; align-items: center; border-top: 1px solid var(--line); padding-top: 80px;">
                    <div>
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; color: var(--navy); margin-bottom: 15px; line-height: 1.1;">What to Expect?</h2>
                        <p style="color: var(--muted); font-size: 15px;">A simple, supportive process focused on your goals.</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                        ${stepsHTML}
                    </div>
                </div>
            </section>

            <!-- CTA & Trust -->
            <section class="section" style="padding: 0 0 80px 0; background: var(--cream);">
                <div class="container">
                    
                    <!-- Dark blue CTA Banner -->
                    <div style="background: #111d33; color: white; border-radius: 30px; padding: 50px 60px; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden;">
                        
                        <!-- Decorative Leaf BG -->
                        <div style="position: absolute; bottom: -40px; left: -20px; opacity: 0.3;">
                            <svg width="200" height="150" viewBox="0 0 100 100" fill="#4c6a56">
                                <path d="M0 100 C 0 50, 50 0, 100 0 C 100 50, 50 100, 0 100 Z"/>
                            </svg>
                        </div>
                        
                        <div style="max-width: 380px; z-index: 2; position: relative;">
                            <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; line-height: 1.2; margin: 0;">${ctaTitle}</h2>
                        </div>
                        
                        <div style="max-width: 320px; border-left: 1px solid rgba(255,255,255,0.2); padding-left: 30px; z-index: 2; position: relative;">
                            <p style="font-size: 13px; line-height: 1.6; color: #d0d7de; margin: 0;">${ctaDesc}</p>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; z-index: 2; position: relative; min-width: 250px;">
                            <a href="../booking/index.html" class="btn btn-white" style="background: white; color: var(--navy); border-radius: 99px; padding: 0 25px; min-height: 50px; font-weight: 700; font-size: 14px; text-align: center; line-height: 50px;">Book Your Assessment &rarr;</a>
                            <a href="tel:+447436059680" style="color: white; font-weight: 600; font-size: 15px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                +44 7436 059680
                            </a>
                        </div>
                    </div>
                    
                    <!-- Trust Bar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 40px 10px 0;">
                        <div style="display: flex; gap: 40px; color: var(--navy); font-size: 13px; font-weight: 600; align-items: flex-start;">
                            ${trustBarHTML}
                        </div>
                        <div style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 26px; color: #3b5066; font-weight: 500;">
                            Move Better<br>Live Better
                        </div>
                    </div>

                </div>
            </section>
            
        </main>
    `;

    let h = headAndHeader.replace(/(href|src)="(?!\/|http|#)([^"]+)"/g, '$1="../$2"');
    h = h.replace(/href="#/g, 'href="../index.html#');
    
    let f = footerAndEnd.replace(/(href|src)="(?!\/|http|#)([^"]+)"/g, '$1="../$2"');
    f = f.replace(/href="#/g, 'href="../index.html#');
    
    fs.writeFileSync(path.join(__dirname, 'services', service.id + '.html'), h + html + f);
});

console.log('Successfully generated service pages with specific content!');
