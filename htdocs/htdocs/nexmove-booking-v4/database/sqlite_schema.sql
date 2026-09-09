PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT,
    duration_minutes INTEGER NOT NULL,
    appointment_type TEXT NOT NULL,
    price_pence INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS therapists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    email TEXT,
    active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_ref TEXT NOT NULL UNIQUE,
    service_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    postcode TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    city TEXT NOT NULL,
    access_details TEXT,
    condition_id INTEGER,
    issue_duration TEXT,
    pain_level INTEGER CHECK (pain_level IS NULL OR pain_level BETWEEN 0 AND 10),
    symptoms TEXT,
    mobility_aid INTEGER NOT NULL DEFAULT 0,
    fall_risk INTEGER NOT NULL DEFAULT 0,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    therapist_id INTEGER,
    consent_privacy INTEGER NOT NULL DEFAULT 0,
    consent_updates INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE SET NULL,
    FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);

INSERT OR IGNORE INTO services (id, slug, name, short_description, duration_minutes, appointment_type, price_pence, active, sort_order) VALUES
(1, 'home-visit', 'Initial Home Physiotherapy Assessment', 'We come to you', 60, 'Home Visit', 11000, 1, 1),
(2, 'online', 'Online Consultation', 'Video call session', 45, 'Online Consultation', 7500, 1, 2),
(3, 'follow-up', 'Follow-up Session', 'Existing patients', 45, 'Home Visit', 8500, 1, 3);

INSERT OR IGNORE INTO conditions (id, slug, label, active, sort_order) VALUES
(1,'back-pain','Back Pain',1,1),
(2,'neck-pain','Neck Pain',1,2),
(3,'knee-pain','Knee Pain',1,3),
(4,'shoulder-pain','Shoulder Pain',1,4),
(5,'mobility','Mobility',1,5),
(6,'post-op','Post-Op Rehab',1,6),
(7,'neurology','Neurology',1,7),
(8,'elderly-care','Elderly Care',1,8),
(9,'other','Other',1,9);

INSERT OR IGNORE INTO therapists (id, display_name, email, active) VALUES
(1, 'Any available physiotherapist', NULL, 1);
