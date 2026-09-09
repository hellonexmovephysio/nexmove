<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_layout.php';
require_admin();

admin_header('Admin Settings', 'settings');
?>
<section class="admin-card settings-card">
    <div class="card-head"><div><h2>Change password</h2><p>Use a strong password before publishing your site online.</p></div></div>
    <form action="change_password.php" method="post" class="settings-form">
        <input type="hidden" name="csrf_token" value="<?= e(admin_csrf_token()) ?>">
        <label>Current password<input type="password" name="current_password" required></label>
        <label>New password<input type="password" name="new_password" minlength="10" required></label>
        <label>Confirm new password<input type="password" name="confirm_password" minlength="10" required></label>
        <button type="submit">Change Password</button>
    </form>
</section>
<?php admin_footer(); ?>
