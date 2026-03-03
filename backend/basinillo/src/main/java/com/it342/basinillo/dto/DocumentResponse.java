package com.it342.basinillo.dto;

import com.it342.basinillo.entity.DocumentType;
import com.it342.basinillo.entity.OcrStatus;
import com.it342.basinillo.entity.ShipmentDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO returned when listing or viewing a ShipmentDocument.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {

    private UUID id;
    private UUID shipmentId;
    private DocumentType documentType;
    private String fileName;
    private String fileUrl;
    private UUID uploadedBy;
    private OcrStatus ocrStatus;
    private LocalDateTime createdAt;

    public static DocumentResponse fromEntity(ShipmentDocument doc) {
        if (doc == null) return null;
        return DocumentResponse.builder()
                .id(doc.getId())
                .shipmentId(doc.getShipmentId())
                .documentType(doc.getDocumentType())
                .fileName(doc.getFileName())
                .fileUrl(doc.getFileUrl())
                .uploadedBy(doc.getUploadedBy())
                .ocrStatus(doc.getOcrStatus())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
