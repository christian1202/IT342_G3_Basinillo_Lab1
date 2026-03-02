package com.it342.basinillo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

/**
 * Service handling all file storage operations via Cloudflare R2 using the AWS S3 SDK.
 */
@Service
public class StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${r2.bucket}")
    private String bucketName;

    public StorageService(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    /**
     * Uploads a file to Cloudflare R2.
     *
     * @param file The multipart file from the frontend.
     * @param directory The conceptual folder (e.g., "shipments/123/documents")
     * @return The unique object key used to retrieve the file later.
     */
    public String uploadFile(MultipartFile file, String directory) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file.");
        }

        try {
            // Generate a unique filename to prevent overwriting
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isBlank()) {
                originalFilename = "unknown.ext";
            }
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            String objectKey = directory.endsWith("/") ? directory + uniqueFilename : directory + "/" + uniqueFilename;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .build();

            // Perform the upload
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return objectKey;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read file contents for upload.", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to Cloudflare R2.", e);
        }
    }

    /**
     * Generates a secure, temporary presigned URL for the frontend to download the file directly from R2.
     *
     * @param objectKey The exact key of the file in the bucket.
     * @return A temporary URL valid for 1 hour.
     */
    public String generatePresignedUrl(String objectKey) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(1))
                    .getObjectRequest(b -> b.bucket(bucketName).key(objectKey))
                    .build();

            return s3Presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL for file.", e);
        }
    }

    /**
     * Deletes a file from Cloudflare R2.
     *
     * @param objectKey The exact key of the file in the bucket.
     */
    public void deleteFile(String objectKey) {
        try {
            s3Client.deleteObject(b -> b.bucket(bucketName).key(objectKey));
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudflare R2.", e);
        }
    }
}
