const test = require("node:test");
const assert = require("node:assert/strict");

function mockFetch({ ok = true, status = 200, json }) {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok,
      status,
      json: async () => json,
    };
  };
  return calls;
}

const { AI } = require("../web/js/ai.js");

test("sendMessage rejects when no API key is given", async () => {
  await assert.rejects(
    () => AI.sendMessage({ apiKey: "", model: "claude-sonnet-5", messages: [] }),
    /Missing API key/
  );
});

test("sendMessage posts to the Messages endpoint with the browser-access header", async () => {
  const calls = mockFetch({ json: { content: [{ type: "text", text: "hi" }] } });

  await AI.sendMessage({
    apiKey: "sk-ant-test",
    model: "claude-sonnet-5",
    messages: [{ role: "user", content: "hello" }],
  });

  assert.equal(calls.length, 1);
  const { url, options } = calls[0];
  assert.equal(url, AI.ENDPOINT);
  assert.equal(options.method, "POST");
  assert.equal(options.headers["x-api-key"], "sk-ant-test");
  assert.equal(options.headers["anthropic-version"], AI.ANTHROPIC_VERSION);
  assert.equal(options.headers["anthropic-dangerous-direct-browser-access"], "true");
  assert.equal(options.headers["content-type"], "application/json");

  const body = JSON.parse(options.body);
  assert.equal(body.model, "claude-sonnet-5");
  assert.equal(body.max_tokens, 1024);
  assert.deepEqual(body.messages, [{ role: "user", content: "hello" }]);
  assert.equal("system" in body, false);
});

test("sendMessage includes system and maxTokens when provided", async () => {
  const calls = mockFetch({ json: { content: [] } });

  await AI.sendMessage({
    apiKey: "sk-ant-test",
    model: "claude-opus-5",
    messages: [{ role: "user", content: "hello" }],
    system: "Be concise.",
    maxTokens: 256,
  });

  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.system, "Be concise.");
  assert.equal(body.max_tokens, 256);
});

test("sendMessage returns the parsed response on success", async () => {
  mockFetch({ json: { id: "msg_1", content: [{ type: "text", text: "hi there" }] } });

  const data = await AI.sendMessage({
    apiKey: "sk-ant-test",
    model: "claude-sonnet-5",
    messages: [{ role: "user", content: "hello" }],
  });

  assert.equal(data.id, "msg_1");
});

test("sendMessage throws the API's error message on a non-ok response", async () => {
  mockFetch({ ok: false, status: 401, json: { error: { message: "invalid x-api-key" } } });

  await assert.rejects(
    () => AI.sendMessage({ apiKey: "bad-key", model: "claude-sonnet-5", messages: [] }),
    /invalid x-api-key/
  );
});

test("sendMessage falls back to a generic error when the response has no error body", async () => {
  mockFetch({ ok: false, status: 500, json: null });

  await assert.rejects(
    () => AI.sendMessage({ apiKey: "sk-ant-test", model: "claude-sonnet-5", messages: [] }),
    /Request failed \(500\)/
  );
});

test("textFromResponse joins text blocks and ignores other block types", () => {
  const data = {
    content: [
      { type: "text", text: "Hello, " },
      { type: "tool_use", id: "t1", name: "lookup" },
      { type: "text", text: "world!" },
    ],
  };
  assert.equal(AI.textFromResponse(data), "Hello, world!");
});

test("textFromResponse handles missing or malformed data", () => {
  assert.equal(AI.textFromResponse(null), "");
  assert.equal(AI.textFromResponse({}), "");
  assert.equal(AI.textFromResponse({ content: "not an array" }), "");
});
