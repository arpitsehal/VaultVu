import { apiConfig } from './apiConfig';

const { baseURL } = apiConfig;

// Calls backend proxy: POST /api/gemini/chat
export async function geminiChat(message, history = [], options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 15000;
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${baseURL}/api/gemini/chat`;
    // Debug: surface where we're calling and brief payload size
    console.log('[Gemini] POST', url, { historyLen: Array.isArray(history) ? history.length : 0 });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[Gemini] HTTP error', res.status, errText);
      throw new Error(`Gemini proxy error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const text = (data && data.text) || '';
    console.log('[Gemini] OK, chars:', text.length);
    return text;
  } catch (e) {
    console.error('[Gemini] fetch failed:', e?.message || e);
    clearTimeout(id);
    throw e;
  }
}
