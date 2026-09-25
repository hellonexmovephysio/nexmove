require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { getDB } = require('./pool');

async function seed() {
  const sql = getDB();

  console.log('Seeding database...');

  // Seed admin (username: admin, password: admin)
  const hashedPassword = await bcrypt.hash('admin', 10);
  await sql`
    INSERT INTO admins (username, password)
    VALUES ('admin', ${hashedPassword})
    ON CONFLICT (username) DO UPDATE SET password = ${hashedPassword}
  `;

  // Seed services (from original SQLite schema)
  const services = [
    { slug: 'home-visit', name: 'Initial Home Physiotherapy Assessment', short_description: 'We come to you', duration_minutes: 60, appointment_type: 'Home Visit', price_pence: 9000, sort_order: 1 },
    { slug: 'online', name: 'Online Consultation', short_description: 'Video call session', duration_minutes: 30, appointment_type: 'Online Consultation', price_pence: 3500, sort_order: 2 },
    { slug: 'follow-up', name: 'Follow-up Session', short_description: 'Existing patients', duration_minutes: 45, appointment_type: 'Home Visit', price_pence: 7500, sort_order: 3 },
    { slug: 'package-5', name: '5 Session Package', short_description: 'Save on multiple visits', duration_minutes: 45, appointment_type: 'Home Visit', price_pence: 35000, sort_order: 4 },
  ];

  for (const s of services) {
    await sql`
      INSERT INTO services (slug, name, short_description, duration_minutes, appointment_type, price_pence, sort_order)
      VALUES (${s.slug}, ${s.name}, ${s.short_description}, ${s.duration_minutes}, ${s.appointment_type}, ${s.price_pence}, ${s.sort_order})
      ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name, 
        short_description = EXCLUDED.short_description, 
        duration_minutes = EXCLUDED.duration_minutes, 
        appointment_type = EXCLUDED.appointment_type, 
        price_pence = EXCLUDED.price_pence, 
        sort_order = EXCLUDED.sort_order
    `;
  }

  // Seed conditions
  const conditions = [
    { slug: 'back-pain', label: 'Back Pain', sort_order: 1 },
    { slug: 'neck-pain', label: 'Neck Pain', sort_order: 2 },
    { slug: 'knee-pain', label: 'Knee Pain', sort_order: 3 },
    { slug: 'shoulder-pain', label: 'Shoulder Pain', sort_order: 4 },
    { slug: 'mobility', label: 'Mobility', sort_order: 5 },
    { slug: 'post-op', label: 'Post-Op Rehab', sort_order: 6 },
    { slug: 'neurology', label: 'Neurology', sort_order: 7 },
    { slug: 'elderly-care', label: 'Elderly Care', sort_order: 8 },
    { slug: 'other', label: 'Other', sort_order: 9 },
  ];

  for (const c of conditions) {
    await sql`
      INSERT INTO conditions (slug, label, sort_order)
      VALUES (${c.slug}, ${c.label}, ${c.sort_order})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  // Seed default therapist
  await sql`
    INSERT INTO therapists (display_name, email, active)
    SELECT 'Any available physiotherapist', NULL, TRUE
    WHERE NOT EXISTS (SELECT 1 FROM therapists WHERE display_name = 'Any available physiotherapist')
  `;

  console.log('Seed complete.');
  console.log('Default admin: username=admin, password=admin');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
