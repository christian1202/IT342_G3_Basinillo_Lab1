package com.example.portkeymobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.portkeymobile.ui.ShipmentDetailScreen
import com.example.portkeymobile.ui.dashboard.DashboardScreen

/* ================================================================== */
/*  Navigation Graph                                                   */
/*  Routes: dashboard → shipment_detail/{id}                          */
/*  No Supabase auth — Clerk session is managed by the web layer.     */
/* ================================================================== */

sealed class Screen(val route: String) {
    data object Dashboard : Screen("dashboard")
    data object ShipmentDetail : Screen("shipment_detail/{id}")
}

@Composable
fun Navigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Dashboard.route
    ) {
        composable(Screen.Dashboard.route) {
            DashboardScreen(navController = navController)
        }

        composable(Screen.ShipmentDetail.route) { backStackEntry ->
            val shipmentId = backStackEntry.arguments?.getString("id") ?: return@composable
            ShipmentDetailScreen(
                shipmentId = shipmentId,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
