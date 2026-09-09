<?php
require_once __DIR__ . '/_auth.php';
header('Location: ' . (admin_logged_in() ? 'dashboard.php' : 'login.php'));
exit;
