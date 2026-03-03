package com.example.portkeymobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.portkeymobile.ui.navigation.Navigation
import com.example.portkeymobile.ui.theme.PortkeyMobileTheme

/* ================================================================== */
/*  MainActivity                                                       */
/*  Entry point — renders Navigation composable inside the app theme.  */
/* ================================================================== */

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PortkeyMobileTheme {
                Navigation()
            }
        }
    }
}