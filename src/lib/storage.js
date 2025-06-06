import { supabase } from "@/lib/supabase";

export const uploadProfileImage = async (file, userId) => {
  const filePath = `user-images/${userId}.png`;

  const { data, error } = await supabase.storage
    .from("profile-pics") // your private bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  return filePath;
};

export const getSignedProfileUrl = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("profile-pics")
    .createSignedUrl(filePath, 60 * 60); // 1 hour validity

  if (error) {
    console.error("Signed URL error:", error.message);
    return null;
  }

  return data.signedUrl;
};
