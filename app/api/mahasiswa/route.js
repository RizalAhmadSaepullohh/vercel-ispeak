import { NextRequest } from "next/server";
import { json, error } from "../_utils/respond";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function boolFromGender(input) {
  // Accept "L"/"P", "laki-laki"/"perempuan", true/false
  if (typeof input === "boolean") return input;
  const s = String(input || "").trim().toLowerCase();
  if (["l", "laki", "laki-laki", "male", "m"].includes(s)) return true;
  if (["p", "perempuan", "female", "f"].includes(s)) return false;
  return undefined;
}

export async function POST(req /** @type {NextRequest} */) {
  try {
    const body = await req.json();
    const { name, program_study, age, gender, city, current_residence, campus, test_type, test_score, perception } = body || {};
    if (!name || !program_study || typeof age !== "number" || age <= 0 || !city) {
      return error("Field wajib: name, program_study, age (number > 0), gender, city", 400);
    }

    const supa = getServiceClient();
    const { data, error: dberr } = await supa
      .from("participants")
      .insert({ 
        name, 
        program_study, 
        age, 
        gender: String(gender || ""), 
        city,
        current_residence: current_residence || "",
        campus: campus || "",
        test_type: test_type || "",
        test_score: (typeof test_score === "number") ? test_score : null,
        perception: perception || ""
      })
      .select("*")
      .single();

    if (dberr) return error(dberr.message, 500);
    return json({ ok: true, mahasiswa: data }, 201);
  } catch (e) {
    return error(e?.message || "Insert participant gagal", 500);
  }
}

export async function GET(req /** @type {NextRequest} */) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  try {
    const supa = getServiceClient();
    let query = supa.from("participants").select("*");
    if (id) query = query.eq("id", Number(id)).single();
    else if (name) query = query.ilike("name", name);
    const { data, error: dberr } = await query;
    if (dberr) return error(dberr.message, 500);
    return json({ ok: true, mahasiswa: data });
  } catch (e) {
    return error(e?.message || "Query participant gagal", 500);
  }
}
