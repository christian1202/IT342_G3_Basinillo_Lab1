import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// CTO NOTE: Ensure this endpoint is never statically optimized
export const dynamic = "force-dynamic";

// --- Constants (Configuration) ---
const SEED_CONFIG = {
  BATCH_SIZE: 40,
  STATUSES: ["PENDING", "IN_TRANSIT", "DELIVERED", "DELAYED", "CANCELLED"],
  CLIENTS: [
    "Toyota Cebu",
    "Ayala Land",
    "Shopee Logistics",
    "Jollibee Foods",
    "SM Prime",
    "Cebu Pacific Cargo",
  ],
  LOCATIONS: [
    "Mactan Export Zone",
    "Cebu IT Park",
    "Danao Port",
    "Naga Power Plant",
    "Oslob Whaleshark Resort",
  ],
};

/**
 * 1. Secure Client Initialization
 * Centralized function to get the Supabase Service Role client.
 * Fails gracefully if keys are missing.
 */
function getServiceRoleClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Critical Error: Missing Supabase URL or Service Role Key. Check your .env.local or Vercel settings.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * 2. Shared Seed Logic
 * Reusable function to perform the database seeding.
 * Keeps logic DRY and separate from HTTP handlers.
 */
async function executeSeed() {
  const supabase = getServiceRoleClient();

  // A. Fetch Users
  const { data: users, error: userError } = await supabase
    .from("profiles")
    .select("id");

  if (userError) throw new Error(`Profile Fetch Error: ${userError.message}`);
  if (!users || users.length === 0) {
    throw new Error(
      "No users found in 'profiles' table. Please sign up a user first.",
    );
  }

  // B. Generate Mock Data
  const shipments = Array.from({ length: SEED_CONFIG.BATCH_SIZE }).map(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStatus =
      SEED_CONFIG.STATUSES[
        Math.floor(Math.random() * SEED_CONFIG.STATUSES.length)
      ];
    const randomClient =
      SEED_CONFIG.CLIENTS[
        Math.floor(Math.random() * SEED_CONFIG.CLIENTS.length)
      ];
    const randomLocation =
      SEED_CONFIG.LOCATIONS[
        Math.floor(Math.random() * SEED_CONFIG.LOCATIONS.length)
      ];

    const randomFee = (Math.random() * (15000 - 1500) + 1500).toFixed(2);

    // Random date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    return {
      client_name: randomClient,
      service_fee: parseFloat(randomFee),
      status: randomStatus,
      origin: "Cebu Port Authority",
      destination: randomLocation,
      tracking_number: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      bl_number: `BL-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: date.toISOString(),
      user_id: randomUser.id,
    };
  });

  // C. Batch Insert
  const { data, error: insertError } = await supabase
    .from("shipments")
    .insert(shipments)
    .select();

  if (insertError) throw new Error(`Insert Error: ${insertError.message}`);

  return { count: data?.length || 0, data };
}

/**
 * 3. GET Handler
 * Allows triggering via browser for quick testing.
 */
export async function GET() {
  try {
    const result = await executeSeed();
    return NextResponse.json({
      success: true,
      message: `Seed successful via GET! Created ${result.count} shipments.`,
      data: result.data,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

/**
 * 4. POST Handler
 * Standard method for triggering state-changing operations.
 */
export async function POST() {
  try {
    const result = await executeSeed();
    return NextResponse.json({
      success: true,
      message: `Seed successful via POST! Created ${result.count} shipments.`,
      data: result.data,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
