<?php
/**
 * ═══════════════════════════════════════════════════════════════
 * AeroVista — contact.php
 * PHP Mail Handler for x10 Hosting (Native PHP mail() function)
 * ═══════════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS FOR x10 HOSTING:
 * 1. Upload this file to the same directory as index.html
 * 2. Update $config below with your actual email addresses
 * 3. Ensure PHP mail() is enabled in your x10 hosting panel
 *    (cPanel → PHP Configuration → mail() enabled)
 * 4. The contact form in index.html already posts to this file
 *
 * SECURITY NOTES:
 * - All inputs are sanitized to prevent header injection
 * - Rate limiting via session (1 submission per 60 seconds)
 * - CSRF-safe: only accepts POST from same domain
 */

// ─── CONFIGURATION ───────────────────────────────────────────────
$config = [
    // Change these to your actual email addresses:
    'recipient_email' => 'reservations@aerovista.ph',  // Where contact forms are sent
    'sender_email'    => 'noreply@aerovista.ph',       // From address (must match your domain)
    'company_name'    => 'AeroVista Travel Services',
    'site_url'        => 'https://www.aerovista.ph',

    // Anti-spam: minimum seconds between submissions per session
    'rate_limit_secs' => 60,
];

// ─── INIT ────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Start session for rate limiting
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ─── RATE LIMITING ───────────────────────────────────────────────
if (isset($_SESSION['last_contact_submit'])) {
    $elapsed = time() - $_SESSION['last_contact_submit'];
    if ($elapsed < $config['rate_limit_secs']) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Please wait ' . ($config['rate_limit_secs'] - $elapsed) . ' seconds before submitting again.'
        ]);
        exit;
    }
}

// ─── SANITIZE INPUT ──────────────────────────────────────────────
/**
 * Sanitize a string to prevent email header injection and XSS.
 * Strips newlines and extra whitespace.
 */
function sanitize_field(string $input): string {
    // Remove any newline characters (prevents header injection)
    $input = str_replace(["\r", "\n", "%0A", "%0D"], '', $input);
    // Strip HTML tags
    $input = strip_tags($input);
    // Trim whitespace
    return trim($input);
}

// Collect and sanitize form fields
$name      = sanitize_field($_POST['name']      ?? '');
$email     = sanitize_field($_POST['email']     ?? '');
$reference = sanitize_field($_POST['reference'] ?? '');
$subject   = sanitize_field($_POST['subject']   ?? '');
$message   = strip_tags(trim($_POST['message']  ?? ''));

// ─── VALIDATE INPUTS ─────────────────────────────────────────────
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($message) || mb_strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Map subject value to human-readable label
$subject_labels = [
    'booking'   => 'New Booking Inquiry',
    'change'    => 'Flight Change / Reschedule',
    'refund'    => 'Refund Request',
    'insurance' => 'Travel Insurance',
    'corporate' => 'Corporate Travel',
    'other'     => 'General Inquiry',
];
$subject_label = $subject_labels[$subject] ?? 'General Inquiry';

// ─── BUILD EMAIL ─────────────────────────────────────────────────
$email_subject = "[{$config['company_name']}] {$subject_label} from {$name}";

// Plain-text body (fallback)
$plain_body = <<<TEXT
New contact form submission from {$config['company_name']} website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SENDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:              {$name}
Email:             {$email}
Topic:             {$subject_label}
Booking Reference: {$reference}
Submitted:         {$_SERVER['REQUEST_TIME']}
IP Address:        {$_SERVER['REMOTE_ADDR']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{$message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This message was sent via the contact form on {$config['site_url']}
TEXT;

// HTML email body
$html_body = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0a1628,#0f2044);padding:32px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">✈ AeroVista Travel</h1>
            <p style="margin:6px 0 0;color:#8aa3cc;font-size:13px;">Contact Form Submission</p>
          </td>
        </tr>

        <!-- Topic Badge -->
        <tr>
          <td style="padding:28px 40px 0;">
            <span style="background:#e8f4ff;color:#1e90e8;font-size:12px;font-weight:700;padding:6px 16px;border-radius:100px;text-transform:uppercase;letter-spacing:0.08em;">{$subject_label}</span>
          </td>
        </tr>

        <!-- Sender Details -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                  <span style="font-size:12px;color:#8aa3cc;text-transform:uppercase;letter-spacing:0.08em;">Full Name</span><br/>
                  <strong style="font-size:15px;color:#0a1628;">{$name}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                  <span style="font-size:12px;color:#8aa3cc;text-transform:uppercase;letter-spacing:0.08em;">Email Address</span><br/>
                  <a href="mailto:{$email}" style="font-size:15px;color:#1e90e8;text-decoration:none;">{$email}</a>
                </td>
              </tr>
              HTML;

if (!empty($reference)) {
    $html_body .= <<<HTML
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                  <span style="font-size:12px;color:#8aa3cc;text-transform:uppercase;letter-spacing:0.08em;">Booking Reference</span><br/>
                  <strong style="font-size:15px;color:#0a1628;font-family:monospace;">{$reference}</strong>
                </td>
              </tr>
    HTML;
}

$html_body .= <<<HTML
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="background:#f7faff;border-left:3px solid #1e90e8;padding:20px;border-radius:0 8px 8px 0;">
              <p style="margin:0 0 8px;font-size:12px;color:#8aa3cc;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
              <p style="margin:0;font-size:14px;color:#2d3748;line-height:1.7;">{$message}</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7faff;padding:20px 40px;border-top:1px solid #e8f0f8;">
            <p style="margin:0;font-size:11px;color:#8aa3cc;text-align:center;">
              Sent via contact form on <a href="{$config['site_url']}" style="color:#1e90e8;">{$config['site_url']}</a> &bull; {$_SERVER['REMOTE_ADDR']}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;

// ─── SEND EMAIL ──────────────────────────────────────────────────
// Build MIME headers for HTML + plain-text multipart email
$boundary = md5(time());

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
$headers .= "From: {$config['company_name']} <{$config['sender_email']}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 3\r\n";

$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
$body .= quoted_printable_encode($plain_body) . "\r\n\r\n";
$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
$body .= quoted_printable_encode($html_body) . "\r\n\r\n";
$body .= "--{$boundary}--";

// Attempt to send via PHP mail()
$sent = mail(
    $config['recipient_email'],
    $email_subject,
    $body,
    $headers
);

// ─── AUTO-REPLY TO SENDER ────────────────────────────────────────
if ($sent) {
    // Update rate limit session timestamp
    $_SESSION['last_contact_submit'] = time();

    // Send auto-reply confirmation to the user
    $reply_subject = "We received your message — {$config['company_name']}";
    $reply_headers  = "MIME-Version: 1.0\r\n";
    $reply_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $reply_headers .= "From: {$config['company_name']} <{$config['sender_email']}>\r\n";
    $reply_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    $reply_body = <<<HTML
    <html><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;padding:40px 20px;">
    <table width="560" align="center" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">
      <tr><td style="background:linear-gradient(135deg,#0a1628,#0f2044);padding:28px 36px;">
        <h2 style="margin:0;color:#fff;font-size:20px;">✈ AeroVista Travel Services</h2>
      </td></tr>
      <tr><td style="padding:32px 36px;">
        <p style="color:#0a1628;font-size:15px;">Dear <strong>{$name}</strong>,</p>
        <p style="color:#4a5568;font-size:14px;line-height:1.7;">Thank you for contacting <strong>AeroVista Travel Services</strong>. We have received your message and our team will respond within <strong>24 business hours</strong>.</p>
        <p style="color:#4a5568;font-size:14px;line-height:1.7;">For urgent travel assistance, please call us at <strong>+63 (2) 8888-AERO</strong> or toll-free <strong>1800-100-AERO</strong>.</p>
        <div style="background:#f7faff;border-radius:10px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 6px;font-size:12px;color:#8aa3cc;text-transform:uppercase;letter-spacing:0.08em;">Your Reference</p>
          <p style="margin:0;font-size:13px;color:#2d3748;font-family:monospace;">{$subject_label} · Received: " . date('M d, Y H:i') . " PHT</p>
        </div>
        <p style="color:#8aa3cc;font-size:12px;margin-top:24px;">This is an automated message. Please do not reply directly to this email.</p>
      </td></tr>
    </table>
    </body></html>
    HTML;

    // Suppress errors on auto-reply (non-critical)
    @mail($email, $reply_subject, $reply_body, $reply_headers);

    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully. We will respond within 24 hours.']);

} else {
    // mail() failed — log the error (optional: write to a log file)
    error_log("AeroVista contact form: mail() failed for {$email} at " . date('Y-m-d H:i:s'));

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'There was a problem sending your message. Please try again or contact us directly by phone.'
    ]);
}
