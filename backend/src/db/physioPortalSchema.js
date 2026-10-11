const { getDB } = require('./pool');

let readyPromise;

async function ensurePhysioPortalSchema() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const sql = getDB();

      await sql`
        CREATE TABLE IF NOT EXISTS physio_users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(50),
          password_hash VARCHAR(255) NOT NULL,
          account_status VARCHAR(30) NOT NULL DEFAULT 'Active',
          practitioner_status VARCHAR(30) NOT NULL DEFAULT 'Applicant',
          email_verified_at TIMESTAMPTZ,
          email_verification_token_hash VARCHAR(64),
          email_verification_expires_at TIMESTAMPTZ,
          password_reset_token_hash VARCHAR(64),
          password_reset_expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`ALTER TABLE physio_users ADD COLUMN IF NOT EXISTS practitioner_status VARCHAR(30) NOT NULL DEFAULT 'Applicant'`;
      await sql`ALTER TABLE physio_users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ`;
      await sql`ALTER TABLE physio_users ADD COLUMN IF NOT EXISTS email_verification_token_hash VARCHAR(64)`;
      await sql`ALTER TABLE physio_users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMPTZ`;

      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS physio_user_id INTEGER`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS right_to_work BOOLEAN`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS eligibility_type VARCHAR(120)`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS csp_member BOOLEAN`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS uk_experience BOOLEAN`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS agree_declaration BOOLEAN NOT NULL DEFAULT FALSE`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) NOT NULL DEFAULT 'Not Requested'`;
      await sql`ALTER TABLE physio_applications ADD COLUMN IF NOT EXISTS verification_notes TEXT`;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_physio_applications_physio_user_id
        ON physio_applications (physio_user_id)
      `;

      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_physio_applications_one_per_user
        ON physio_applications (physio_user_id)
        WHERE physio_user_id IS NOT NULL
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS physio_profiles (
          physio_user_id INTEGER PRIMARY KEY,
          display_name VARCHAR(255) NOT NULL,
          hcpc_number VARCHAR(100),
          specialisations TEXT,
          biography TEXT,
          areas_covered TEXT,
          preferred_days VARCHAR(255),
          preferred_hours VARCHAR(255),
          active BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS physio_verification_documents (
          id SERIAL PRIMARY KEY,
          physio_user_id INTEGER NOT NULL,
          application_id INTEGER NOT NULL,
          document_type VARCHAR(40) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          file_size INTEGER NOT NULL,
          encrypted_data TEXT NOT NULL,
          iv VARCHAR(64) NOT NULL,
          auth_tag VARCHAR(64) NOT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'Submitted',
          reviewer_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_physio_docs_user
        ON physio_verification_documents (physio_user_id)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_physio_docs_application
        ON physio_verification_documents (application_id)
      `;

      await sql`
        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS physio_user_id INTEGER
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_bookings_physio_user_id
        ON bookings (physio_user_id)
      `;
    })().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }

  return readyPromise;
}

module.exports = { ensurePhysioPortalSchema };
