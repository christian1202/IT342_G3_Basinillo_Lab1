package com.example.portkeymobile.data

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.android.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

/* ================================================================== */
/*  PortKeyApi — HTTP client for the Spring Boot backend               */
/*  Replaces Supabase SDK with direct REST calls.                      */
/* ================================================================== */

object PortKeyApi {

    /** Base URL for the backend — override via BuildConfig in production. */
    private const val BASE_URL = "http://10.0.2.2:8080"

    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        coerceInputValues = true
    }

    val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(json)
        }
    }

    /* ---- Shipments ---- */

    suspend fun fetchShipments(): List<Shipment> {
        return client.get("$BASE_URL/api/shipments").body()
    }

    suspend fun fetchShipmentDetail(id: String): ShipmentDetail {
        return client.get("$BASE_URL/api/shipments/$id").body()
    }

    suspend fun updateShipmentStatus(id: String, status: String): Shipment {
        return client.patch("$BASE_URL/api/shipments/$id/status") {
            contentType(ContentType.Application.Json)
            setBody(mapOf("status" to status))
        }.body()
    }

    suspend fun deleteShipment(id: String) {
        client.delete("$BASE_URL/api/shipments/$id")
    }
}
