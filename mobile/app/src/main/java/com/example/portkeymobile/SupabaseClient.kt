package com.example.portkeymobile

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest

/**
 * Singleton object for Supabase Client configuration.
 * Contains the project URL and Anonymous API Key.
 */
object SupabaseClient {
    // TODO: Replace with your actual Supabase Project URL and Anon Key
    private const val SUPABASE_URL = "YOUR_SUPABASE_URL"
    private const val SUPABASE_KEY = "YOUR_ANON_KEY"

    val client = createSupabaseClient(
        supabaseUrl = SUPABASE_URL,
        supabaseKey = SUPABASE_KEY
    ) {
        install(Postgrest)
    }
}
