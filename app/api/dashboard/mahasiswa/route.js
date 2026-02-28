import { NextRequest } from "next/server";
import { json, error } from "../../_utils/respond";
import { createClient } from "@supabase/supabase-js";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAnonServerClientWithToken(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const supa = createClient(url, anon, { auth: { persistSession: false } });
  // v2: we can pass access_token to methods like getUser
  return { supa, accessToken };
}

async function requireAuth(req /** @type {NextRequest} */) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const anon = getAnonServerClientWithToken(token);
  if (!anon) return null;
  const { supa } = anon;
  const { data, error: e } = await supa.auth.getUser(token);
  if (e || !data?.user) return null;
  return data.user;
}

export async function GET(req /** @type {NextRequest} */) {
  try {
    const user = await requireAuth(req);
    if (!user) return error("Unauthorized", 401);

    const supa = getServiceClient();
    // Fetch mahasiswa list and recording counts
    const { data: participants, error: e1 } = await supa
      .from("participants")
      .select("id, name, program_study, city, age")
      .order("id", { ascending: false });
    if (e1) return error(e1.message, 500);

    const ids = (participants || []).map((m) => m.id);
    let counts = {};
    if (ids.length) {
      const { data: recs, error: e2 } = await supa
        .from("rekaman")
        .select("mahasiswa_id")
        .in("mahasiswa_id", ids);
      if (!e2 && Array.isArray(recs)) {
        counts = recs.reduce((acc, r) => {
          const mid = r.mahasiswa_id;
          acc[mid] = (acc[mid] || 0) + 1;
          return acc;
        }, {});
      }
    }

    const out = (participants || []).map((m) => ({ 
      id: m.id,
      nama: m.name, // keep 'nama' for dashboard frontend compatibility if needed, or map it
      name: m.name,
      program_studi: m.program_study,
      kota: m.city,
      umur: m.age,
      rekaman_count: counts[m.id] || 0 
    }));
    return json({ ok: true, mahasiswa: out });
  } catch (e) {
    return error(e?.message || "Failed to list mahasiswa", 500);
  }
}
