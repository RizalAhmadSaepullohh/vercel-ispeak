import { NextRequest } from "next/server";
import { json, error } from "../_utils/respond";
import { getServiceClient, getBucketName } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req /** @type {NextRequest} */) {
  try {
    const form = await req.formData();
    const mahasiswa_id = Number(form.get("mahasiswa_id"));
    const participant_name = form.get("name") || "participant";
    const tugas_id = Number(form.get("tugas_id"));
    const file = form.get("file");
    if (!mahasiswa_id || !tugas_id || !file) return error("Form fields: mahasiswa_id, tugas_id, file wajib", 400);

    const supa = getServiceClient();
    const bucket = getBucketName();
    const ts = Math.floor(Date.now() / 1000);
    // Remove timestamp from filename to prevent duplicates in storage for the same participant
    const safePartName = participant_name.replace(/[^\w\-_.]/g, "_");
    const safeName = `${safePartName}_FSST.wav`;
    
    // Upload with upsert: true to overwrite if exists
    const { error: uerr } = await supa.storage
      .from(bucket)
      .upload(safeName, file, { 
        contentType: file.type || "audio/wav",
        upsert: true 
      });
      
    if (uerr && uerr.message && !uerr.message.includes("The resource already exists")) {
      return error(`Storage upload failed: ${uerr.message}`, 500);
    }

    const { data: pub } = supa.storage.from(bucket).getPublicUrl(safeName);
    const audio_url = pub?.publicUrl || `${bucket}/${safeName}`;

    // Skip database insert as per user request ("ga perlu tabel rekaman")
    // We return a dummy rekaman object so the frontend state doesn't break
    return json({ 
      ok: true, 
      rekaman: { 
        id: `temp_${ts}`, // dummy id
        mahasiswa_id, 
        tugas_id, 
        audio_url 
      } 
    });
  } catch (e) {
    return error(e?.message || "Upload rekaman gagal", 500);
  }
}
