package com.it342.basinillo.service;

import com.it342.basinillo.entity.DemurrageUrgency;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Email notification service powered by the Resend HTTP API.
 *
 * Sends transactional emails for:
 *   - Demurrage warnings (WARNING urgency, ≤3 days)
 *   - Demurrage critical alerts (CRITICAL, ≤0 days)
 *   - Shipment stage changes
 *
 * Uses the Resend REST API directly (no SDK needed) to keep
 * dependencies minimal. Falls back to logging if API key is absent.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key:}")
    private String apiKey;

    @Value("${resend.from-email:noreply@portkey.ph}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    /* ================================================================== */
    /*  Demurrage Alert                                                    */
    /* ================================================================== */

    public void sendDemurrageAlert(String toEmail, String blNumber,
                                   long daysRemaining, DemurrageUrgency urgency) {
        String subject = buildDemurrageSubject(blNumber, urgency);
        String body = buildDemurrageBody(blNumber, daysRemaining, urgency);
        sendEmail(toEmail, subject, body);
    }

    /* ================================================================== */
    /*  Stage Change                                                       */
    /* ================================================================== */

    public void sendStageChangeNotification(String toEmail, String blNumber,
                                            String oldStatus, String newStatus) {
        String subject = String.format("[PortKey] Shipment %s — Status: %s", blNumber, newStatus);
        String body = String.format(
                """
                <h2>Shipment Status Update</h2>
                <p>Shipment <strong>%s</strong> has moved from <strong>%s</strong> to <strong>%s</strong>.</p>
                <p>Log in to PortKey for full details.</p>
                <br>
                <p style="color:#888;font-size:12px;">— PortKey Customs Clearance Platform</p>
                """,
                blNumber, oldStatus, newStatus);
        sendEmail(toEmail, subject, body);
    }

    /* ================================================================== */
    /*  Core send method — Resend HTTP API                                 */
    /* ================================================================== */

    private void sendEmail(String toEmail, String subject, String htmlBody) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Resend API key not configured. Email NOT sent to {} | Subject: {}", toEmail, subject);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", List.of(toEmail),
                    "subject", subject,
                    "html", htmlBody
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent to {} | Subject: {}", toEmail, subject);
            } else {
                log.error("Resend API returned {}: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {} | Subject: {} | Error: {}", toEmail, subject, e.getMessage());
        }
    }

    /* ================================================================== */
    /*  Template helpers                                                   */
    /* ================================================================== */

    private String buildDemurrageSubject(String blNumber, DemurrageUrgency urgency) {
        String emoji = urgency == DemurrageUrgency.CRITICAL ? "🚨" : "⚠️";
        return String.format("%s [PortKey] Demurrage %s — %s", emoji, urgency.name(), blNumber);
    }

    private String buildDemurrageBody(String blNumber, long daysRemaining, DemurrageUrgency urgency) {
        String color = urgency == DemurrageUrgency.CRITICAL ? "#dc2626" : "#f59e0b";
        String message = daysRemaining <= 0
                ? String.format("Shipment <strong>%s</strong> is <strong>%d day(s) overdue</strong>. Demurrage charges are accumulating.", blNumber, Math.abs(daysRemaining))
                : String.format("Shipment <strong>%s</strong> has <strong>%d day(s)</strong> remaining before demurrage fees begin.", blNumber, daysRemaining);

        return String.format(
                """
                <div style="font-family:sans-serif;max-width:600px;">
                    <h2 style="color:%s;">Demurrage %s</h2>
                    <p>%s</p>
                    <p>Log in to <a href="https://portkey.ph/dashboard">PortKey</a> for full details and to take action.</p>
                    <br>
                    <p style="color:#888;font-size:12px;">— PortKey Customs Clearance Platform</p>
                </div>
                """,
                color, urgency.name(), message);
    }
}
