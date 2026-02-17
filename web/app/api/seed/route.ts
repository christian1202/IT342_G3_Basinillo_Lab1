import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// 1. Load keys from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use the God Key

// 2. Create client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST() {
  // Get real users
  const { data: users, error: userError } = await supabase
    .from("profiles")
    .select("id");

  if (userError || !users || users.length === 0) {
    return NextResponse.json(
      { error: "No users found. Create a user first!" },
      { status: 400 },
    );
  }

  const statuses = [
    "PENDING",
    "IN_TRANSIT",
    "DELIVERED",
    "DELAYED",
    "CANCELLED",
  ];
  const clients = [
    "Toyota Cebu",
    "Ayala Land",
    "Shopee Logistics",
    "Jollibee Foods",
    "SM Prime",
    "Cebu Pacific Cargo",
  ];
  const locations = [
    "Mactan Export Zone",
    "Cebu IT Park",
    "Danao Port",
    "Naga Power Plant",
    "Oslob Whaleshark Resort",
  ];

  const shipments = [];

  // Generate 40 Shipments
  for (let i = 0; i < 40; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const randomFee = (Math.random() * (15000 - 1500) + 1500).toFixed(2);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    shipments.push({
      client_name: randomClient,
      service_fee: parseFloat(randomFee),
      status: randomStatus,
      origin: "Cebu Port Authority",
      destination: randomLocation,
      tracking_number: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,

      // ✅ ADDED THIS LINE TO FIX THE ERROR
      bl_number: `BL-${Math.floor(100000 + Math.random() * 900000)}`,

      created_at: date.toISOString(),
      user_id: randomUser.id,
    });
  }

  // Insert
  const { data, error } = await supabase
    .from("shipments")
    .insert(shipments)
    .select();

  if (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Successfully created ${data.length} shipments!`,
    data,
  });
}
