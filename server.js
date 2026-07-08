const express = require("express");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── Your Anthropic API key lives here — never in the frontend ──
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "YOUR_ANTHROPIC_KEY_HERE";

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ status: "Family Vault AI Proxy — running" });
});

// ── Main proxy endpoint ──
app.post("/api/ai", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-6",
        max_tokens: 1000,
        system:     systemPrompt || "You are a helpful document assistant.",
        messages:   messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic error:", err);
      return res.status(response.status).json({ error: err.error?.message || "Anthropic API error" });
    }

    const data = await response.json();
    const text = data.content?.map(c => c.text).join("") || "";
    res.json({ reply: text });

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Server error — please try again" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Family Vault AI Proxy running on port ${PORT}`));
