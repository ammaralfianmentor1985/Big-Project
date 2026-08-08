// Anthropic Messages API client. Calls go directly from the browser using
// the user's own API key (BYOK) — enabled by the
// "anthropic-dangerous-direct-browser-access" header, which is still the
// current, documented way to opt in to CORS for browser-side requests.
// https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/
const AI = (() => {
  const ENDPOINT = "https://api.anthropic.com/v1/messages";
  const ANTHROPIC_VERSION = "2023-06-01";

  async function sendMessage({ apiKey, model, messages, system, maxTokens = 1024 }) {
    if (!apiKey) throw new Error("Missing API key");

    const body = { model, max_tokens: maxTokens, messages };
    if (system) body.system = system;

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = (data && data.error && data.error.message) || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  // Pulls the plain-text reply out of a Messages API response, ignoring
  // any non-text content blocks and joining the rest.
  function textFromResponse(data) {
    if (!data || !Array.isArray(data.content)) return "";
    return data.content
      .filter((block) => block && block.type === "text")
      .map((block) => block.text)
      .join("");
  }

  return { sendMessage, textFromResponse, ENDPOINT, ANTHROPIC_VERSION };
})();

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { AI };
