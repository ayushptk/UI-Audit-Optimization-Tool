const BASE_URL = "https://fastapi-backend-s1rw.onrender.com/api/ai-analysis";

export async function analyzeDesignById(designId, authToken) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ design_id: designId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function getAnalyses(designId, authToken) {
  if (!designId) {
    throw new Error("designId is required for fetching analyses");
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("design_id", String(designId));

  // If caller didn't provide a token, try cookie fallback (some flows set cookie 'token')
  let tokenToUse = authToken;
  if (!tokenToUse && typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
    if (m) tokenToUse = decodeURIComponent(m[1]);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
    // include CORS mode to be explicit during dev
    mode: "cors",
  });

  // Helpful debug logs for troubleshooting missing analysis
  if (!response.ok) {
    const text = await response.text();
    // log both to console for dev and return a structured error
    const err = new Error(`HTTP ${response.status}: ${text}`);
    // attach raw body for callers that want to inspect it
    err.body = text;
    err.status = response.status;
    throw err;
  }

  const data = await response.json();

  return data;
}
