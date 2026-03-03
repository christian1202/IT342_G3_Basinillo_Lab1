package com.example.portkeymobile.data

import kotlinx.serialization.Serializable

/* ================================================================== */
/*  Shipment — mirrors Spring Boot ShipmentResponse DTO               */
/*  Uses camelCase to match the backend JSON exactly.                  */
/* ================================================================== */

@Serializable
data class Shipment(
    val id: String,
    val blNumber: String,
    val vesselName: String,
    val voyageNo: String? = null,
    val containerNumber: String? = null,
    val portOfDischarge: String? = null,
    val status: String,
    val laneStatus: String = "PENDING",
    val entryNumber: String? = null,
    val arrivalDate: String? = null,
    val freeTimeDays: Int? = null,
    val doomsdayDate: String? = null,
    val serviceFee: Double? = null,
    val clientName: String? = null,
    val itemCount: Int = 0,
    val documentCount: Int = 0,
)

/* ================================================================== */
/*  ShipmentDetail — mirrors ShipmentDetailResponse DTO               */
/* ================================================================== */

@Serializable
data class ShipmentDetail(
    val id: String,
    val blNumber: String,
    val vesselName: String,
    val voyageNo: String? = null,
    val containerNumber: String? = null,
    val portOfDischarge: String? = null,
    val status: String,
    val laneStatus: String = "PENDING",
    val entryNumber: String? = null,
    val arrivalDate: String? = null,
    val freeTimeDays: Int? = null,
    val doomsdayDate: String? = null,
    val serviceFee: Double? = null,
    val clientName: String? = null,
    val itemCount: Int = 0,
    val documentCount: Int = 0,
    val orgId: String = "",
    val assignedBrokerId: String? = null,
    val createdAt: String = "",
    val updatedAt: String = "",
    val items: List<ShipmentItem> = emptyList(),
    val documents: List<ShipmentDocument> = emptyList(),
    val auditLogs: List<AuditLog> = emptyList(),
)

@Serializable
data class ShipmentItem(
    val id: String,
    val shipmentId: String,
    val description: String,
    val quantity: Int? = null,
    val unit: String? = null,
    val unitValue: Double? = null,
    val currency: String = "PHP",
    val hsCode: String? = null,
    val dutyRate: Double? = null,
    val vatRate: Double? = null,
    val estimatedDuty: Double? = null,
    val aiConfidenceScore: Double? = null,
    val isVerified: Boolean = false,
)

@Serializable
data class ShipmentDocument(
    val id: String,
    val shipmentId: String,
    val documentType: String,
    val fileName: String,
    val fileUrl: String,
    val uploadedBy: String? = null,
    val ocrStatus: String = "PENDING",
    val createdAt: String = "",
)

@Serializable
data class AuditLog(
    val id: String,
    val shipmentId: String,
    val userId: String,
    val action: String,
    val entityType: String,
    val oldValue: String? = null,
    val newValue: String? = null,
    val timestamp: String,
)