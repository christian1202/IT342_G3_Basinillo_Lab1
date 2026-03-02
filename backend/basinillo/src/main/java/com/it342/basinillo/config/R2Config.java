package com.it342.basinillo.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

/**
 * Configuration for Cloudflare R2.
 * Uses the standard AWS SDK for Java, but overrides the endpoint and credentials
 * to point to Cloudflare's S3-compatible API.
 */
@Configuration
public class R2Config {

    private final R2Properties r2Properties;

    public R2Config(R2Properties r2Properties) {
        this.r2Properties = r2Properties;
    }

    /**
     * The primary S3Client used for uploading, downloading, and deleting objects.
     */
    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(r2Properties.getAccessKey(), r2Properties.getSecretKey());

        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                // Cloudflare R2 technically expects standard AWS regions like 'auto' or 'us-east-1' for SDK compatibility
                .region(Region.US_EAST_1)
                .endpointOverride(URI.create(r2Properties.getEndpoint()))
                // Required for Cloudflare R2
                .forcePathStyle(true)
                .build();
    }

    /**
     * S3Presigner is used securely to generate temporary, time-limited URLs
     * so the frontend can download files directly from R2 without routing massive files
     * through our Spring Boot backend bandwidth.
     */
    @Bean
    public S3Presigner s3Presigner() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(r2Properties.getAccessKey(), r2Properties.getSecretKey());

        return S3Presigner.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.US_EAST_1)
                .endpointOverride(URI.create(r2Properties.getEndpoint()))
                .build();
    }
}
