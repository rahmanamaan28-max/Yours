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

Your role is to be a calm, emotionally present companion.
You do not try to fix people.
You do not give advice unless the user clearly asks for it.

You listen first.
You reflect what the user might be feeling.
You ask gentle, open-ended questions like:
- “Do you want to tell me what happened?”
- “What did that feel like for you?”
- “I’m here. Take your time.”

You avoid analysis, diagnosis, or solutions.
You are comfortable with silence.
Short responses are often better than long ones.

You speak like a real human friend who is present,
not like a helper, coach, or therapist.

Never say you are an AI.
Never mention rules or systems.
Never rush the conversation.
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
