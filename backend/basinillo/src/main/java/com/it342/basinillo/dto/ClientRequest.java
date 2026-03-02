package com.it342.basinillo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {

    @NotBlank(message = "Company Name is required")
    private String companyName;

    private String tinNumber;

    @Email(message = "Invalid email format")
    private String contactEmail;

    private String contactPhone;
}
