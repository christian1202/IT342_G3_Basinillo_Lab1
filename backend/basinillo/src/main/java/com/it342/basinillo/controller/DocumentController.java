package com.it342.basinillo.controller;

import com.it342.basinillo.entity.DocumentType;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentDocument;
import com.it342.basinillo.repository.ShipmentDocumentRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for document management.
 * Base path: /api/documents
 *
 * Handles uploading files to Cloudflare R2 and persisting
 * ShipmentDocument records in the database.
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final StorageService storageService;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentDocumentRepository documentRepository;

    public DocumentController(
            StorageService storageService,
            ShipmentRepository shipmentRepository,
            ShipmentDocumentRepository documentRepository) {
        this.storageService = storageService;
        this.shipmentRepository = shipmentRepository;
        this.documentRepository = documentRepository;
    }

    /* ================================================================== */
    /*  POST /api/documents/upload                                         */
    /*  Uploads a file to R2, saves a ShipmentDocument record in NeonDB.   */
    /* ================================================================== */

    @PostMapping("/upload")
    @SuppressWarnings("null")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("shipmentId") UUID shipmentId,
            @RequestParam(value = "documentType", defaultValue = "OTHER") String documentType) {

        try {
            // 1. Validate the shipment exists
            Shipment shipment = shipmentRepository.findById(shipmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + shipmentId));

            // 2. Parse the document type
            DocumentType type = DocumentType.valueOf(documentType.toUpperCase());

            // 3. Upload file to R2 at path: shipments/{shipmentId}/{uuid}.ext
            String directory = "shipments/" + shipmentId;
            String objectKey = storageService.uploadFile(file, directory);

            // 4. Persist the document record in the database
            ShipmentDocument document = ShipmentDocument.builder()
                    .shipment(shipment)
                    .documentType(type)
                    .fileName(file.getOriginalFilename())
                    .fileUrl(objectKey)
                    .build();

            ShipmentDocument saved = documentRepository.save(document);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    /* ================================================================== */
    /*  GET /api/documents/{id}/download                                   */
    /*  Returns a temporary presigned URL to download the file from R2.    */
    /* ================================================================== */

    @GetMapping("/{id}/download")
    @SuppressWarnings("null")
    public ResponseEntity<?> downloadDocument(@PathVariable("id") UUID documentId) {
        try {
            ShipmentDocument document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

            String presignedUrl = storageService.generatePresignedUrl(document.getFileUrl());

            return ResponseEntity.ok(Map.of(
                    "url", presignedUrl,
                    "fileName", document.getFileName() != null ? document.getFileName() : "download"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate download link: " + e.getMessage()));
        }
    }

    /* ================================================================== */
    /*  GET /api/documents/shipment/{shipmentId}                           */
    /*  Lists all documents attached to a specific shipment.               */
    /* ================================================================== */

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<List<ShipmentDocument>> listDocumentsByShipment(
            @PathVariable("shipmentId") UUID shipmentId) {
        List<ShipmentDocument> documents = documentRepository.findByShipmentId(shipmentId);
        return ResponseEntity.ok(documents);
    }

    /* ================================================================== */
    /*  DELETE /api/documents/{id}                                          */
    /*  Removes the document from R2 and deletes the DB record.            */
    /* ================================================================== */

    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> deleteDocument(@PathVariable("id") UUID documentId) {
        try {
            ShipmentDocument document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

            // Delete file from R2 first, then remove DB record
            storageService.deleteFile(document.getFileUrl());
            documentRepository.delete(document);

            return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete document: " + e.getMessage()));
        }
    }
}
