<?php

declare(strict_types=1);

require_once __DIR__ . '/_auth.php';

unset($_SESSION['admin_user_id'], $_SESSION['admin_csrf_token'], $_SESSION['admin_flash']);
session_regenerate_id(true);
header('Location: login.php');
exit;
