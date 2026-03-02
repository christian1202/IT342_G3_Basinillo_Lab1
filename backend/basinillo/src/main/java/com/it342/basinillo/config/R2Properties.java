package com.it342.basinillo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "r2")
@Data
public class R2Properties {

    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String bucket;

}
