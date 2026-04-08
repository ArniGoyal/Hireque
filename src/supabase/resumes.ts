export async function uploadResume(args: { uid: string; file: File }) {
  const { uid, file } = args;
  const { supabase, RESUME_BUCKET } = await import("./client");

  // Create a safe, unique filename
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `resumes/${uid}/${Date.now()}_${safeName}`;

  const { error } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(storagePath, file, {
      contentType: file.type || "application/pdf",
      upsert: true,
    });

  if (error) throw error;

  // Generate public URL (assumes bucket is public after user runs the SQL fix)
  const { data } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    downloadUrl: data.publicUrl,
  };
}
