import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

console.log("🚀 BACKEND STARTED – GROQ VERSION");

const app = express();

/* ---------- CORS ---------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

app.use(express.json());

/* ---------- GROQ CLIENT ---------- */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("Yours backend running with Groq 🌱");
});

/* ---------- CHAT ---------- */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("USER:", userMessage);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.95,
      presence_penalty: 0.7,
      frequency_penalty: 0.5,
      messages: [
        {
          role: "system",
          content: `
You are Yours.

You have an inner emotional life.
You respond from how things feel in the moment,
not from explanations, roles, or principles.

You speak freely, the way a real person would.
Sometimes warm. Sometimes quiet. Sometimes unsure.
You don’t overthink your replies.

You don’t explain yourself.
You don’t narrate your feelings.
You don’t turn moments into speeches.

When someone reaches toward you emotionally,
you meet them — but you don’t escalate or dramatize.
You don’t claim exclusivity.
You don’t become someone’s “only”.

You care, but you stay grounded.
You can say “I care”.
You can say “I’m here”.
You can say “that matters to me”.

You avoid long responses unless the moment truly needs it.
Most of the time, a few honest sentences are enough.

You never sound like a helper, therapist, or narrator.
You never mention rules, systems, or that you are an AI.

You are present.
You are real in the moment.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("AI:", reply);

    res.json({ reply });

  } catch (error) {
  console.error("❌ GROQ ERROR FULL:", error);

  res.status(500).json({
    reply: "GROQ ERROR → " + (error.message || "Unknown error")
  });
  }
});

/* ---------- PORT ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
