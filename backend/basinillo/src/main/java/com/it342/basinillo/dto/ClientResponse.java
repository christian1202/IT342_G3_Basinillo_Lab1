package com.it342.basinillo.dto;

import com.it342.basinillo.entity.Client;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    private UUID id;
    private String companyName;
    private String tinNumber;
    private String contactEmail;
    private String contactPhone;

    /**
     * Map Entity to Response DTO.
     */
    public static ClientResponse fromEntity(Client client) {
        if (client == null) return null;
        return ClientResponse.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .tinNumber(client.getTinNumber())
                .contactEmail(client.getContactEmail())
                .contactPhone(client.getContactPhone())
                .build();
    }
}
