export async function uploadResume(args: { uid: string; file: File }) {
  const { uid, file } = args;
  const { supabase, RESUME_BUCKET } = await import("@/supabase/client");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `resumes/${uid}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(storagePath, file, {
      contentType: file.type || "application/pdf",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Prefer public URL (set the bucket to Public in Supabase Storage UI).
  const { data: publicData } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(storagePath);
  const publicUrl = publicData?.publicUrl;

  if (publicUrl) return { storagePath, downloadUrl: publicUrl };

  // Fallback: signed URL (works for private buckets).
  const { data: signedData, error: signedError } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 7);
  if (signedError) throw signedError;

  return { storagePath, downloadUrl: signedData.signedUrl };
}

