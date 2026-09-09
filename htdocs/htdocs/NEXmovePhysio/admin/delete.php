<?php
require __DIR__ . '/auth.php';

$id = (int)($_GET['id'] ?? 0);

if ($id > 0) {
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = ?");
    $stmt->execute([$id]);
}

header('Location: dashboard.php');
exit;
?>
