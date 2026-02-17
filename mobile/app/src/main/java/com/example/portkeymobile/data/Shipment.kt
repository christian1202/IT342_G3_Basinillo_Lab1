package com.example.portkeymobile.data

import kotlinx.serialization.Serializable

@Serializable
data class Shipment(
    val id: String,
    val bl_number: String,
    val origin: String? = null,       // <--- Safe! (Nullable)
    val destination: String? = null,  // <--- Safe! (Nullable)
    val status: String
)