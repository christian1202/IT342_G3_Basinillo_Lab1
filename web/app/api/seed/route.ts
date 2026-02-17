import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  // 1. Get a list of real users from your database so we can assign shipments to them
  const { data: users, error: userError } = await supabase
    .from("profiles")
    .select("id");

  if (userError || !users || users.length === 0) {
    return NextResponse.json(
      { error: "No users found in profiles table. Create a user first!" },
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

  // 2. Generate 30 Realistic Shipments
  for (let i = 0; i < 30; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)]; // Pick a random real user

    // Random price between 1,500 and 15,000
    const randomFee = (Math.random() * (15000 - 1500) + 1500).toFixed(2);

    // Random date in the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    shipments.push({
      client_name: randomClient,
      service_fee: parseFloat(randomFee),
      status: randomStatus,
      origin: "Cebu Port Authority",
      destination: randomLocation,
      tracking_number: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: date.toISOString(),
      user_id: randomUser.id, // This assigns it to a real person!
    });
  }

  // 3. Insert into Database
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
