import { apiConfig } from './apiConfig';

const { baseURL } = apiConfig;

// Calls backend proxy: POST /api/gemini/chat
export async function geminiChat(message, history = [], options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 15000;
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseURL}/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `Gemini error ${res.status}`);
    }
    const data = await res.json();
    return data?.text || '';
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}
