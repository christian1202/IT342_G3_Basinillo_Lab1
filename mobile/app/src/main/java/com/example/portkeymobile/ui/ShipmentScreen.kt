package com.example.portkeymobile.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.portkeymobile.SupabaseClient
import com.example.portkeymobile.data.Shipment
import io.github.jan.supabase.postgrest.from

@Composable
fun ShipmentListScreen() {
    // State to hold the list of shipments
    var shipments by remember { mutableStateOf<List<Shipment>>(emptyList()) }
    // State for error handling (improves UX, optional but good practice)
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Fetch data when the Composable enters the composition
    LaunchedEffect(Unit) {
        try {
            val fetchedShipments = SupabaseClient.client
                .from("shipments")
                .select()
                .decodeList<Shipment>()
            shipments = fetchedShipments
        } catch (e: Exception) {
            errorMessage = "Failed to load shipments: ${e.message}"
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "My Shipments",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        if (errorMessage != null) {
            Text(text = errorMessage!!, color = MaterialTheme.colorScheme.error)
        }

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(shipments) { shipment ->
                ShipmentItem(shipment)
            }
        }
    }
}

@Composable
fun ShipmentItem(shipment: Shipment) {
    Card(
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // BL Number with Bold styling
            Text(
                text = "BL: ${shipment.bl_number}",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            // Origin -> Destination
            Text(
                text = "${shipment.origin} ➝ ${shipment.destination}",
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Status with dynamic color logic
            val statusColor = when (shipment.status) {
                "DELIVERED" -> Color(0xFF4CAF50) // Green
                "IN_TRANSIT" -> Color(0xFF2196F3) // Blue
                "PENDING" -> Color(0xFFFF9800) // Orange
                else -> Color.Gray
            }
            
            Text(
                text = shipment.status,
                style = MaterialTheme.typography.labelLarge,
                color = statusColor,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
