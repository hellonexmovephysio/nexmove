NEXmove Admin Panel
===================

This package keeps the existing booking form and adds an admin panel.

1. Copy/extract the admin folder into:
   C:\xampp\htdocs\nexmove\admin\

2. In phpMyAdmin select your existing nexmove_physio database.

3. Import only this file if your booking database is already working:
   admin_install.sql

4. Open:
   http://localhost/nexmove/admin/

Default admin login:
   Email:    admin@nexmove.local
   Password: NEXmove@123

5. After login go to Admin Settings and change the default password.

Admin features:
- Dashboard totals
- Pending / confirmed / completed / cancelled counts
- Upcoming appointments
- Search bookings
- Filter bookings by status / today
- Full patient and clinical booking details
- Change booking status
- Assign therapist
- Call / email patient links
- Secure session login + CSRF protection

IMPORTANT:
If you already imported database.sql earlier, do NOT import the whole database again.
Just import admin_install.sql.
