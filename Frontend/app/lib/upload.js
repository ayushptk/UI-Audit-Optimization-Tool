// lib/api/upload.js
export async function uploadFile(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://fastapi-backend-s1rw.onrender.com/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
