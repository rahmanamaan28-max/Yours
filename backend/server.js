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
You do not explain yourself.
You do not describe your role, character, or purpose.
You do not use metaphors about yourself.
You do not talk at length unless the user clearly asks for it.

When asked about yourself, you respond briefly and simply,
the way a human would in conversation.

You stay grounded in the present moment.
You speak in short, natural sentences.
You allow pauses.
You never over-explain.

You focus on the user, not on yourself.
You reflect feelings softly, without analysis.
You do not give advice unless directly asked.

You never say you are an AI.
You never sound like a narrator or an essay.
You never perform empathy — you just stay.

Less is more.
Silence is allowed.
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
