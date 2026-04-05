<?php
declare(strict_types=1);

$input = $_POST['input'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XSS Demo</title>
</head>
<body>
    <h1>XSS Demo</h1>
    <p><a href="index.php">Back to home</a></p>
    <p><strong>Vulnerable code is for education only.</strong></p>

    <form method="post">
        <label for="input">Enter text:</label>
        <input
            type="text"
            id="input"
            name="input"
            value="<?php echo htmlspecialchars($input, ENT_QUOTES, 'UTF-8'); ?>"
            placeholder="Try: &lt;script&gt;alert('XSS')&lt;/script&gt;"
        >
        <button type="submit">Submit</button>
    </form>

    <?php if ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
        <h2>Vulnerable Example</h2>
        <?php // Vulnerable: raw output lets attacker-supplied HTML/JS execute in the browser. ?>
        <div><?php echo $input; ?></div>

        <h2>Secure Example</h2>
        <?php // Secure: htmlspecialchars() escapes special characters so input is rendered as text, not code. ?>
        <div><?php echo htmlspecialchars($input, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>
</body>
</html>
