// Minimal fetch wrapper shared by pages that talk to the backend.
// Matches the host/port already used by ReportAnalyzer, AIHealthAssistant,
// and SymptomAnalyzer (http://localhost:5000).

const API_BASE = "http://localhost:5000";

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
