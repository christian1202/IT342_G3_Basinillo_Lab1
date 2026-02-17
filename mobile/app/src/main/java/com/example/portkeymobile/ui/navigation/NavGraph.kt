package com.example.portkeymobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.portkeymobile.SupabaseClient
import com.example.portkeymobile.ui.auth.LoginScreen
import com.example.portkeymobile.ui.auth.RegisterScreen
import com.example.portkeymobile.ui.dashboard.DashboardScreen
import io.github.jan.supabase.gotrue.auth

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Dashboard : Screen("dashboard")
}

@Composable
fun Navigation() {
    val navController = rememberNavController()
    // Determine start destination based on session: Auto-login if session exists
    val session = SupabaseClient.client.auth.currentSessionOrNull()
    val startDestination = if (session != null) Screen.Dashboard.route else Screen.Login.route

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        // Clear back stack so user can't go back to login
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                }
                // Note: If registration auto-logs in, you might navigate to Dashboard here
            )
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(navController = navController)
        }
    }
}
