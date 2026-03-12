<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';
require __DIR__ . '/PHPMailer/Exception.php';

$config = require __DIR__ . '/mail-config.php';

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Nur POST erlaubt']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Ungültige Daten']);
  exit;
}

// Spam-Schutz: Honeypot
if (!empty(trim($data['website'] ?? ''))) {
  echo json_encode(['message' => 'OK']);
  exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Ungültige Eingaben']);
  exit;
}

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = $config['host'];
  $mail->SMTPAuth = true;
  $mail->Username = $config['username'];
  $mail->Password = $config['password'];
  $mail->SMTPSecure = $config['encryption'];
  $mail->Port = $config['port'];
  $mail->CharSet = 'UTF-8';

  $mail->setFrom($config['from_email'], $config['from_name']);
  $mail->addAddress($config['to_email']);
  $mail->addReplyTo($email, $name ?: $email);

  $mail->Subject = 'Neue Nachricht vom Kontaktformular';
  $mail->Body = "Name: {$name}\nE-Mail: {$email}\n\nNachricht:\n{$message}";
  $mail->AltBody = strip_tags($mail->Body);

  $mail->send();
  echo json_encode(['message' => 'Nachricht gesendet']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
