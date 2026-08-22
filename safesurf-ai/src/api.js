// Minimal fetch wrapper shared by every page that talks to the backend.
//
// The base URL lives here alone - import API_BASE rather than writing the
// host out again, so changing the port is a one-line change.
//
// Default is 5050, not 5000: macOS runs AirPlay Receiver on port 5000,
// which answers requests without CORS headers and surfaces in the browser
// as a generic "Network error".
//
// Override for a different port or a deployed backend by creating
// safesurf-ai/.env with:  VITE_API_URL=http://localhost:5051

export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:5050";

/**
 * @param {string} path - e.g. '/api/contact'
 * @param {{ method?: string, body?: object, headers?: object }} [options]
 * @returns {Promise<{ ok: boolean, status: number, data: any }>}
 */
export async function api(path, { method = "GET", body, headers = {} } = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      // No/invalid JSON body — fall back to an empty object.
    }

    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { success: false, message: "Network error. Please try again." },
    };
  }
}
