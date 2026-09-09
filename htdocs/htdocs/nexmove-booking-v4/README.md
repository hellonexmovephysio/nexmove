# NEXmove booking form — working XAMPP version

This version is designed to work without creating a MySQL user or importing a database manually.
It uses **SQLite**, and the database file is automatically created at `storage/nexmove.sqlite` on the first visit.

## XAMPP installation on Windows

1. Extract the folder and rename it to `nexmove-booking-v2` if needed.
2. Copy the entire folder to:
   `C:\xampp\htdocs\nexmove-booking-v2`
3. Start **Apache** in XAMPP Control Panel.
4. Open your browser and go to:
   `http://localhost/nexmove-booking-v2/`
5. Fill the form and click **Continue to Confirmation**.

You do **not** need MySQL for this version.

## Very important

Do not double-click `index.php` and do not open it as `file:///...`.
PHP must run through Apache, so use `http://localhost/...`.

## If you see "PDO SQLite is not enabled"

1. In XAMPP click **Config** beside Apache → `PHP (php.ini)`.
2. Search for these lines:
   `;extension=pdo_sqlite`
   `;extension=sqlite3`
3. Remove the leading semicolon `;` from both.
4. Save the file.
5. Stop and restart Apache.

## Database

The app automatically creates these tables:
- services
- conditions
- therapists
- bookings

The complete schema is in `database/sqlite_schema.sql`.

## Where bookings are stored

`storage/nexmove.sqlite`

For a production healthcare website, move the database outside the public web root, use HTTPS, authentication, audit logging, backups, and a suitable privacy/data-retention policy.

## Postcode button

The Find Address button checks the postcode using the public Postcodes.io API and can fill the city/area. Street/house address still needs to be entered manually. A full UK address-picker requires a specialist address API such as Loqate, Ideal Postcodes, or getAddress.io.

Typography update: all interface text is set to Cambria (with Times New Roman/serif fallback).
