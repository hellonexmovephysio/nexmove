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
          password_reset_token_hash VARCHAR(64),
          password_reset_expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS physio_user_id INTEGER
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS right_to_work BOOLEAN
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS eligibility_type VARCHAR(120)
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS csp_member BOOLEAN
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS uk_experience BOOLEAN
      `;

      await sql`
        ALTER TABLE physio_applications
        ADD COLUMN IF NOT EXISTS agree_declaration BOOLEAN NOT NULL DEFAULT FALSE
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_physio_applications_physio_user_id
        ON physio_applications (physio_user_id)
      `;

      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_physio_applications_one_per_user
        ON physio_applications (physio_user_id)
        WHERE physio_user_id IS NOT NULL
      `;
    })().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }

  return readyPromise;
}

module.exports = { ensurePhysioPortalSchema };
