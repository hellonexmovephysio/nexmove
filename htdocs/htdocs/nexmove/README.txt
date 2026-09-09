NEXmove Physio - XAMPP Setup
============================

1. Copy the entire "nexmove" folder to:
   C:\xampp\htdocs\nexmove\

2. Start Apache and MySQL in XAMPP.

3. In phpMyAdmin create a database named:
   nexmove_physio

4. Import:
   C:\xampp\htdocs\nexmove\database.sql

5. Check database settings in:
   C:\xampp\htdocs\nexmove\includes\config.php

   Default XAMPP settings used:
   host: 127.0.0.1
   database: nexmove_physio
   username: root
   password: blank

6. Test Apache first:
   http://localhost/nexmove/test.php

7. Open booking page:
   http://localhost/nexmove/
   or
   http://localhost/nexmove/booking.php

IMPORTANT:
Do not open the PHP file by double-clicking it in Windows Explorer.
Always use http://localhost/...
