package com.example.portkeymobile

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest

/**
 * Singleton object for Supabase Client configuration.
 * Contains the project URL and Anonymous API Key.
 */
object SupabaseClient {
    val client = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_KEY
    ) {
        install(Postgrest)
        install(Auth)
    }
}
