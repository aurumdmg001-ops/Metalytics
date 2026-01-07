import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    // 1. Validation check
    const leadgenId = body.entry?.[0]?.changes?.[0]?.value?.leadgen_id;
    if (!leadgenId) return NextResponse.json({ skip: "Not a leadgen event" });

    // 2. Fetch Data from Graph API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${process.env.META_ACCESS_TOKEN}`
    );
    const leadDetails = await metaResponse.json();

    if (leadDetails.error) {
      console.error("Meta API Error:", leadDetails.error);
      return NextResponse.json({ error: "Meta API Fail" }, { status: 500 });
    }

    // 3. Robust Mapping
    const findField = (names: string[]) => {
      const field = leadDetails.field_data?.find((f: any) => names.includes(f.name.toLowerCase()));
      return field?.values?.[0] || "";
    };

    const newLead = {
      meta_lead_id: leadgenId,
      full_name: findField(["full_name", "full name", "name", "first_name"]),
      email: findField(["email", "e-mail"]),
      phone: findField(["phone_number", "phone", "mobile"]),
      city: findField(["city", "town"]),
      postal_code: findField(["zip_code", "zip", "postal_code", "pincode"]),
      raw_data: leadDetails,
      // Convert Meta's ISO string to DB compatible format
      created_at: leadDetails.created_time || new Date().toISOString(),
    };

    // 4. Insert into Supabase
    const { error } = await supabase.from("leads").insert([newLead]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}