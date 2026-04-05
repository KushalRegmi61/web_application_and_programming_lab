<?php
declare(strict_types=1);

session_start();

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if (!isset($_SESSION['vulnerable_value'])) {
    $_SESSION['vulnerable_value'] = 'OFF';
}

if (!isset($_SESSION['secure_value'])) {
    $_SESSION['secure_value'] = 'OFF';
}

$vulnerableMessage = '';
$secureMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['vulnerable_submit'])) {
        // Vulnerable: without a CSRF token, another site can forge this POST request using the victim's session.
        $_SESSION['vulnerable_value'] = $_SESSION['vulnerable_value'] === 'OFF' ? 'ON' : 'OFF';
        $vulnerableMessage = 'Vulnerable value changed.';
    }

    if (isset($_POST['secure_submit'])) {
        $submittedToken = $_POST['csrf_token'] ?? '';

        // Secure: hash_equals() verifies a per-session secret token, so forged cross-site requests are rejected.
        if (hash_equals($_SESSION['csrf_token'], $submittedToken)) {
            $_SESSION['secure_value'] = $_SESSION['secure_value'] === 'OFF' ? 'ON' : 'OFF';
            $secureMessage = 'Secure value changed.';
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        } else {
            $secureMessage = 'CSRF token validation failed. Action blocked.';
        }
    }
}

$csrfToken = $_SESSION['csrf_token'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSRF Demo</title>
</head>
<body>
    <h1>CSRF Demo</h1>
    <p><a href="index.php">Back to home</a></p>
    <p><strong>Vulnerable code is for education only.</strong></p>

    <h2>Vulnerable Example</h2>
    <p>Current vulnerable value: <strong><?php echo htmlspecialchars($_SESSION['vulnerable_value'], ENT_QUOTES, 'UTF-8'); ?></strong></p>
    <form method="post">
        <button type="submit" name="vulnerable_submit">Toggle vulnerable value (no CSRF token)</button>
    </form>
    <?php if ($vulnerableMessage !== ''): ?>
        <p><?php echo htmlspecialchars($vulnerableMessage, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>

    <h2>Secure Example</h2>
    <p>Current secure value: <strong><?php echo htmlspecialchars($_SESSION['secure_value'], ENT_QUOTES, 'UTF-8'); ?></strong></p>
    <form method="post">
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
        <button type="submit" name="secure_submit">Toggle secure value (with CSRF token)</button>
    </form>
    <?php if ($secureMessage !== ''): ?>
        <p><?php echo htmlspecialchars($secureMessage, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>
</body>
</html>
