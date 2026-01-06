import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies(); // Yahan 'await' zaroori hai

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, // Key ka naam check karein
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component mein set ignore kar sakte hain agar middleware hai
          }
        },
      },
    }
  );
};