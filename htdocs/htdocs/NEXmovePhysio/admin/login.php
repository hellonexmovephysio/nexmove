<?php
require __DIR__ . '/../config.php';

if (!empty($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];

        header('Location: dashboard.php');
        exit;
    }

    $error = 'Invalid username or password.';
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Login</title>
    <style>
        *{box-sizing:border-box}
        body{
            margin:0;
            font-family:Arial,sans-serif;
            background:#eef3f8;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
        }
        .card{
            width:100%;
            max-width:420px;
            background:#fff;
            padding:30px;
            border-radius:14px;
            box-shadow:0 10px 35px rgba(0,0,0,.1);
        }
        h1{margin-top:0;color:#0d3b66}
        label{display:block;font-weight:700;margin:15px 0 7px}
        input{
            width:100%;
            padding:12px;
            border:1px solid #d1d5db;
            border-radius:8px;
        }
        button{
            width:100%;
            margin-top:20px;
            padding:13px;
            border:0;
            border-radius:8px;
            background:#0d3b66;
            color:#fff;
            font-weight:700;
            cursor:pointer;
        }
        .error{
            background:#fee2e2;
            color:#991b1b;
            padding:10px 12px;
            border-radius:8px;
        }
        .back{margin-top:16px;text-align:center}
        a{color:#0d3b66}
    </style>
</head>
<body>
    <div class="card">
        <h1>Admin Login</h1>

        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="post">
            <label>Username</label>
            <input type="text" name="username" required autocomplete="username">

            <label>Password</label>
            <input type="password" name="password" required autocomplete="current-password">

            <button type="submit">Login</button>
        </form>

        <div class="back"><a href="../index.php">Back to booking page</a></div>
    </div>
</body>
</html>
