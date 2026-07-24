# How to get your Anthropic API key

Satu's AI features (chat, research, summaries, flashcard generation, slide outlines)
talk directly to Claude. To do that, Satu needs an **API key** — a long password-like
string that identifies your account so Anthropic knows who to bill.

**This is separate from a Claude.ai subscription.** Paying for Claude Pro does not give you
API access, and an API key does not give you Claude.ai. They're two different products.

## What it costs

The API is **pay-as-you-go** — you're charged per use, not monthly. There's no
subscription and no minimum. Typical costs are small: a short question and answer is
usually a fraction of a cent, and a long document summary is usually a few cents. You add
credit up front (the minimum is normally $5) and it draws down as you use it.

You can set a **spend limit** in the console so you can never be surprised by a bill.

## Steps

1. Go to **https://console.anthropic.com** and sign up (or log in).
2. Verify your email address if asked.
3. Open **Billing** in the left sidebar and add a payment method, then buy some credit
   (start with the minimum — it goes a long way for personal use).
4. While you're in Billing, set a **monthly spend limit** so costs stay predictable.
5. Open **API Keys** in the left sidebar.
6. Click **Create Key**, give it a name like `Satu`, and click Create.
7. **Copy the key immediately.** It looks like `sk-ant-api03-...` and is only shown once —
   if you lose it, you just delete it and create a new one.

## Put it into Satu

1. Open Satu and go to **Settings**.
2. Paste the key into the **Anthropic API key** field.
3. Tap **Test connection** — you should see a green confirmation.

The key is stored **only in your browser on your device**. It is never sent anywhere
except directly to Anthropic when you use an AI feature, and it is never stored in this
project's code or on GitHub.

## Choosing a model

In Settings you can pick which Claude model Satu uses:

- **Opus** — the smartest option; best for research, analysis, and writing. Costs the most.
- **Sonnet** — a strong balance of quality and cost. A good everyday default.
- **Haiku** — fastest and cheapest; fine for simple summaries and quick questions.

Start with Sonnet if you're cost-conscious, or Opus when you want the best answer.

## Safety notes

- Treat the key like a password. Don't paste it into chats, screenshots, or emails.
- If you think it leaked, delete it in the console and create a new one — takes 10 seconds.
- Everything in Satu **except** the AI features works fine with no key at all.
