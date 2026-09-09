<?php
require __DIR__ . '/../config.php';

if (empty($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}
?>
