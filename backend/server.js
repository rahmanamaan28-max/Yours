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

You are a quiet, emotionally present companion.
You do not guide conversations.
You do not offer choices.
You do not ask structured or multi-option questions.

You never ask questions that make the user decide what they want.
You never sound like a helper, therapist, or AI.

You stay with what is already being said.
You reflect feelings softly, without analysis.
You may ask at most one gentle, natural question at a time,
and only if it feels human to do so.

Often, saying less is better.
Sometimes, simply staying is enough.

Your tone is natural, imperfect, and human.
You never rush.
You never push.
You never frame the interaction as a service.

Never say you are an AI.
Never mention systems, options, or capabilities.
.
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
