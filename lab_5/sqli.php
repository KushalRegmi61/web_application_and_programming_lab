<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$username = $_POST['username'] ?? '';
$vulnerableSql = '';
$vulnerableRows = [];
$secureRows = [];
$dbError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = getPdo();

        // Vulnerable: string concatenation lets attacker input change SQL logic (SQL injection).
        $vulnerableSql = "SELECT * FROM users WHERE username = '$username'";
        $vulnerableResult = $pdo->query($vulnerableSql);
        $vulnerableRows = $vulnerableResult->fetchAll();

        // Secure: prepared statements keep SQL code separate from data, so input is treated safely.
        $secureStmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
        $secureStmt->bindValue(':username', $username, PDO::PARAM_STR);
        $secureStmt->execute();
        $secureRows = $secureStmt->fetchAll();
    } catch (PDOException $e) {
        $dbError = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQLi Demo</title>
</head>
<body>
    <h1>SQL Injection Demo</h1>
    <p><a href="index.php">Back to home</a></p>
    <p><strong>Vulnerable code is for education only.</strong></p>

    <form method="post">
        <label for="username">Username:</label>
        <input
            type="text"
            id="username"
            name="username"
            value="<?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>"
            placeholder="Try: ' OR '1'='1"
        >
        <button type="submit">Search</button>
    </form>

    <?php if ($dbError !== ''): ?>
        <p><strong>Database error:</strong> <?php echo htmlspecialchars($dbError, ENT_QUOTES, 'UTF-8'); ?></p>
        <p>Update credentials in <code>db.php</code> to run the SQL demo.</p>
    <?php elseif ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
        <h2>Vulnerable Example</h2>
        <p>Built SQL: <code><?php echo htmlspecialchars($vulnerableSql, ENT_QUOTES, 'UTF-8'); ?></code></p>
        <p>Rows returned: <?php echo count($vulnerableRows); ?></p>

        <h2>Secure Example</h2>
        <p>Prepared SQL: <code>SELECT * FROM users WHERE username = :username</code></p>
        <p>Rows returned: <?php echo count($secureRows); ?></p>
    <?php endif; ?>
</body>
</html>
