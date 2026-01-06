import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. VERIFICATION: Meta check karta hai ki aapka server real hai ya nahi
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // "YOUR_VERIFY_TOKEN" wahi hona chahiye jo aap Meta Dashboard mein dalenge
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "my_secret_token_123";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Verification Failed", { status: 403 });
}

// 2. RECEIVING DATA: Jab koi lead form fill karega
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    // TESTING ONLY: Agar body mein 'is_test' ho, toh seedha data insert karo
    if (body.is_test) {
      const { error } = await supabase.from("leads").insert([body.test_data]);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: "Test Lead Saved!" });
    }

    // Meta Lead ID nikalna
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const leadgenId = changes?.value?.leadgen_id;

    if (!leadgenId) {
      return NextResponse.json({ error: "No lead ID found" }, { status: 400 });
    }

    // Meta Graph API se lead ki puri details fetch karna
    // Iske liye aapko Meta Access Token (System User) chahiye hoga
    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${process.env.META_ACCESS_TOKEN}`
    );
    
    const leadDetails = await metaResponse.json();

    if (leadDetails.error) {
      console.error("Meta API Error:", leadDetails.error);
      return NextResponse.json({ error: "Meta API Error" }, { status: 500 });
    }

    // Meta ke field_data array se values extract karne ka helper function
    const findField = (name: string) => 
      leadDetails.field_data?.find((f: any) => f.name === name)?.values?.[0] || "";

    // Apne database ke hisaab se data map karein
    const newLead = {
      meta_lead_id: leadgenId,
      full_name: findField("full_name") || findField("name"),
      email: findField("email"),
      phone: findField("phone_number"),
      city: findField("city"),
      postal_code: findField("zip_code") || findField("zip"),
      raw_data: leadDetails, // Safety ke liye pura response save kar rahe hain
    };

    // Database mein insert karein
    // Note: SQL Trigger automatically `is_filtered` set kar dega
    const { error } = await supabase
      .from("leads")
      .insert([newLead]);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "DB Insert Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("Webhook Internal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

//   if (mode === "subscribe" && token === VERIFY_TOKEN) {
//     return new NextResponse(challenge, { status: 200 });
//   }
//   return new NextResponse("Forbidden", { status: 403 });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const supabase = await createClient();

//     // 1. Validation check
//     const leadgenId = body.entry?.[0]?.changes?.[0]?.value?.leadgen_id;
//     if (!leadgenId) return NextResponse.json({ skip: "Not a leadgen event" });

//     // 2. Fetch Data from Graph API
//     const metaResponse = await fetch(
//       `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${process.env.META_ACCESS_TOKEN}`
//     );
//     const leadDetails = await metaResponse.json();

//     if (leadDetails.error) {
//       console.error("Meta API Error:", leadDetails.error);
//       return NextResponse.json({ error: "Meta API Fail" }, { status: 500 });
//     }

//     // 3. Robust Mapping
//     const findField = (names: string[]) => {
//       const field = leadDetails.field_data?.find((f: any) => names.includes(f.name.toLowerCase()));
//       return field?.values?.[0] || "";
//     };

//     const newLead = {
//       meta_lead_id: leadgenId,
//       full_name: findField(["full_name", "full name", "name", "first_name"]),
//       email: findField(["email", "e-mail"]),
//       phone: findField(["phone_number", "phone", "mobile"]),
//       city: findField(["city", "town"]),
//       postal_code: findField(["zip_code", "zip", "postal_code", "pincode"]),
//       raw_data: leadDetails,
//       // Convert Meta's ISO string to DB compatible format
//       created_at: leadDetails.created_time || new Date().toISOString(),
//     };

//     // 4. Insert into Supabase
//     const { error } = await supabase.from("leads").insert([newLead]);

//     if (error) throw error;

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error("Webhook Error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }