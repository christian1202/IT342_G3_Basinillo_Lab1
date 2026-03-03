package com.example.portkeymobile.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.portkeymobile.data.PortKeyApi
import com.example.portkeymobile.data.Shipment
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

/* ================================================================== */
/*  DashboardScreen                                                    */
/*  Shows metric cards + list of active shipments sorted by urgency.   */
/* ================================================================== */

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var shipments by remember { mutableStateOf<List<Shipment>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    fun loadData() {
        scope.launch {
            isLoading = true
            error = null
            try {
                shipments = PortKeyApi.fetchShipments()
            } catch (e: Exception) {
                error = e.message ?: "Failed to load shipments"
            }
            isLoading = false
        }
    }

    LaunchedEffect(Unit) { loadData() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("PortKey", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Text(
                            "Customs Clearance Dashboard",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { loadData() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            /* Metric Cards */
            item {
                MetricRow(shipments)
            }

            /* Section Title */
            item {
                Text(
                    "Active Shipments",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            if (isLoading) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().padding(32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
            } else if (error != null) {
                item {
                    Text(
                        error ?: "",
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            } else {
                val active = shipments
                    .filter { it.status != "RELEASED" }
                    .sortedBy { it.doomsdayDate }

                if (active.isEmpty()) {
                    item {
                        Text(
                            "No active shipments. All clear! 🎉",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(32.dp)
                        )
                    }
                } else {
                    items(active) { shipment ->
                        ShipmentListCard(
                            shipment = shipment,
                            onClick = {
                                navController.navigate("shipment_detail/${shipment.id}")
                            }
                        )
                    }
                }
            }
        }
    }
}

/* ================================================================== */
/*  Metric Cards Row                                                   */
/* ================================================================== */

@Composable
private fun MetricRow(shipments: List<Shipment>) {
    val active = shipments.count { it.status in listOf("ARRIVED", "LODGED", "ASSESSED", "PAID") }
    val released = shipments.count { it.status == "RELEASED" }
    val risk = shipments.count { s ->
        s.doomsdayDate != null && s.status != "RELEASED" && daysRemaining(s.doomsdayDate) <= 3
    }

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        MetricCard("Total", shipments.size, Color(0xFF3B82F6), Modifier.weight(1f))
        MetricCard("Active", active, Color(0xFFF59E0B), Modifier.weight(1f))
        MetricCard("Released", released, Color(0xFF10B981), Modifier.weight(1f))
        MetricCard("Risk", risk, Color(0xFFEF4444), Modifier.weight(1f))
    }
}

@Composable
private fun MetricCard(label: String, value: Int, color: Color, modifier: Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.1f))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                color = color
            )
            Text(
                value.toString(),
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

/* ================================================================== */
/*  Shipment Card                                                      */
/* ================================================================== */

@Composable
private fun ShipmentListCard(shipment: Shipment, onClick: () -> Unit) {
    val days = shipment.doomsdayDate?.let { daysRemaining(it) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            /* Row 1: BL + Status */
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    shipment.blNumber,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                StatusBadge(shipment.status)
            }

            Spacer(Modifier.height(8.dp))

            /* Row 2: Vessel + Container */
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                DetailChip(Icons.Default.DirectionsBoat, shipment.vesselName)
                shipment.containerNumber?.let {
                    DetailChip(Icons.Default.Inventory2, it)
                }
            }

            /* Doomsday countdown */
            if (days != null && shipment.status != "RELEASED") {
                Spacer(Modifier.height(8.dp))
                val (label, color) = when {
                    days <= 0 -> "${kotlin.math.abs(days)}d overdue" to Color(0xFFEF4444)
                    days <= 3 -> "${days}d left" to Color(0xFFF59E0B)
                    else -> "${days}d left" to Color(0xFF10B981)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Warning,
                        contentDescription = null,
                        tint = color,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = color)
                }
            }

            /* Row 3: Client + counts */
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    shipment.clientName ?: "No client",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    "${shipment.itemCount} items · ${shipment.documentCount} docs",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

/* ================================================================== */
/*  Shared UI helpers                                                  */
/* ================================================================== */

@Composable
fun StatusBadge(status: String) {
    val (label, color) = when (status) {
        "ARRIVED"  -> "Arrived" to Color(0xFF06B6D4)
        "LODGED"   -> "Lodged" to Color(0xFF6366F1)
        "ASSESSED" -> "Assessed" to Color(0xFFF59E0B)
        "PAID"     -> "Paid" to Color(0xFF8B5CF6)
        "RELEASED" -> "Released" to Color(0xFF10B981)
        else       -> status to Color(0xFF94A3B8)
    }

    Surface(
        shape = RoundedCornerShape(50),
        color = color.copy(alpha = 0.12f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(color)
            )
            Text(label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = color)
        }
    }
}

@Composable
private fun DetailChip(icon: androidx.compose.ui.graphics.vector.ImageVector, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(14.dp)
        )
        Spacer(Modifier.width(4.dp))
        Text(
            text,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

/* ---- Date helper ---- */
private fun daysRemaining(doomsdayDate: String): Long {
    return try {
        val doom = LocalDate.parse(doomsdayDate.take(10), DateTimeFormatter.ISO_LOCAL_DATE)
        ChronoUnit.DAYS.between(LocalDate.now(), doom)
    } catch (_: Exception) {
        Long.MAX_VALUE
    }
}
