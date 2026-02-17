package com.example.portkeymobile.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.portkeymobile.SupabaseClient
import com.example.portkeymobile.ui.ShipmentListScreen
import io.github.jan.supabase.gotrue.auth
import kotlinx.coroutines.launch

@Composable
fun DashboardScreen(navController: NavController) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val scope = rememberCoroutineScope()

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Shipments") },
                    label = { Text("Shipments") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                0 -> ShipmentListScreen()
                1 -> ProfileTab(onSignOut = {
                    scope.launch {
                        SupabaseClient.client.auth.signOut()
                        navController.navigate("login") {
                            popUpTo("dashboard") { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                })
            }
        }
    }
}

@Composable
fun ProfileTab(onSignOut: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Button(onClick = onSignOut) {
            Text("Sign Out")
        }
    }
}
