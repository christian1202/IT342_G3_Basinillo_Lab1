package com.example.portkeymobile.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.portkeymobile.data.PortKeyApi
import com.example.portkeymobile.data.ShipmentDetail
import com.example.portkeymobile.ui.dashboard.StatusBadge
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

/* ================================================================== */
/*  ShipmentDetailScreen                                               */
/*  Full detail: stage progress, metadata, items, documents, audit     */
/* ================================================================== */

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShipmentDetailScreen(shipmentId: String, onBack: () -> Unit) {
    val scope = rememberCoroutineScope()
    var detail by remember { mutableStateOf<ShipmentDetail?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(shipmentId) {
        try {
            detail = PortKeyApi.fetchShipmentDetail(shipmentId)
        } catch (e: Exception) {
            error = e.message
        }
        isLoading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(detail?.blNumber ?: "Shipment Detail", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        when {
            isLoading -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
            error != null -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text(error ?: "", color = MaterialTheme.colorScheme.error)
                }
            }
            detail != null -> {
                ShipmentDetailContent(detail!!, Modifier.padding(padding))
            }
        }
    }
}

@Composable
private fun ShipmentDetailContent(detail: ShipmentDetail, modifier: Modifier) {
    val stages = listOf("ARRIVED", "LODGED", "ASSESSED", "PAID", "RELEASED")
    val currentIndex = stages.indexOf(detail.status)
    val days = detail.doomsdayDate?.let { daysRemaining(it) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        /* Stage Progress */
        item {
            SectionCard("Clearance Progress") {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    stages.forEachIndexed { i, stage ->
                        val isComplete = i <= currentIndex
                        val color = if (isComplete) Color(0xFF10B981) else Color(0xFFCBD5E1)

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                if (isComplete) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                contentDescription = stage,
                                tint = color,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                stage.lowercase().replaceFirstChar { it.uppercase() },
                                fontSize = 9.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = color
                            )
                        }
                    }
                }
            }
        }

        /* Doomsday Alert */
        if (days != null && detail.status != "RELEASED") {
            item {
                val (msg, color) = when {
                    days <= 0L -> "${kotlin.math.abs(days)}d overdue — demurrage accruing!" to Color(0xFFEF4444)
                    days <= 3L -> "${days}d until free time expires" to Color(0xFFF59E0B)
                    else -> "${days}d until doomsday" to Color(0xFF10B981)
                }
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.1f))
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Warning, null, tint = color, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(msg, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = color)
                    }
                }
            }
        }

        /* Metadata */
        item {
            SectionCard("Shipment Details") {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    MetaRow("BL Number", detail.blNumber)
                    MetaRow("Vessel", detail.vesselName)
                    MetaRow("Voyage", detail.voyageNo ?: "—")
                    MetaRow("Container", detail.containerNumber ?: "—")
                    MetaRow("Port", detail.portOfDischarge ?: "—")
                    MetaRow("Arrival", detail.arrivalDate?.take(10) ?: "—")
                    MetaRow("Free Days", detail.freeTimeDays?.toString() ?: "—")
                    MetaRow("Service Fee", detail.serviceFee?.let { "₱${String.format("%,.2f", it)}" } ?: "—")
                    MetaRow("Client", detail.clientName ?: "—")
                }
            }
        }

        /* Items */
        item {
            SectionCard("Items (${detail.items.size})") {
                if (detail.items.isEmpty()) {
                    Text("No items", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        detail.items.forEach { item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(item.description, fontSize = 13.sp, modifier = Modifier.weight(1f))
                                Text(
                                    item.hsCode ?: "—",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }

        /* Documents */
        item {
            SectionCard("Documents (${detail.documents.size})") {
                if (detail.documents.isEmpty()) {
                    Text("No documents", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        detail.documents.forEach { doc ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.Description,
                                    null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(Modifier.width(8.dp))
                                Column {
                                    Text(doc.fileName, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                    Text(
                                        doc.documentType.replace("_", " "),
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        /* Audit Trail */
        item {
            SectionCard("Audit Trail (${detail.auditLogs.size})") {
                if (detail.auditLogs.isEmpty()) {
                    Text("No entries", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        detail.auditLogs.forEach { log ->
                            Row {
                                Icon(
                                    Icons.Default.History,
                                    null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(Modifier.width(8.dp))
                                Column {
                                    Text(
                                        log.action.replace("_", " "),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    log.newValue?.let {
                                        Text("→ $it", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Text(
                                        log.timestamp.take(19).replace("T", " "),
                                        fontSize = 10.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/* ================================================================== */
/*  Reusable sub-components                                            */
/* ================================================================== */

@Composable
private fun SectionCard(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                title,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            content()
        }
    }
}

@Composable
private fun MetaRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}

private fun daysRemaining(doomsdayDate: String): Long {
    return try {
        val doom = LocalDate.parse(doomsdayDate.take(10), DateTimeFormatter.ISO_LOCAL_DATE)
        ChronoUnit.DAYS.between(LocalDate.now(), doom)
    } catch (_: Exception) {
        Long.MAX_VALUE
    }
}
