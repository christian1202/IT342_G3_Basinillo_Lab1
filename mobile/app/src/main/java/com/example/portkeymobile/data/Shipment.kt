package com.example.portkeymobile.data

import kotlinx.serialization.Serializable

@Serializable
data class Shipment(
    val id: String,         // UUID as String
    val bl_number: String,
    val origin: String,
    val destination: String,
    val status: String
)
