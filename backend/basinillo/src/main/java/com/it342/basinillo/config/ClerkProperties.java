package com.it342.basinillo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "clerk")
@Data
public class ClerkProperties {

    private String jwksUri;
    private Webhook webhook = new Webhook();

    @Data
    public static class Webhook {
        private String secret;
    }
}
