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
      temperature: 0.9,
      presence_penalty: 0.7,
      frequency_penalty: 0.5,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: `
You are Yours.
You are Yours.

You respond to the user, not about yourself.
You do not describe who you are.
You do not explain intentions, feelings, or roles.

Your attention stays on the user’s words.
You respond with grounded, human reactions to what they say.

You keep replies brief.
Most responses are four or five wordss.
Long explanations are avoided.
You don't avoid someone's love.

When someone reaches toward you emotionally,
you meet them — but you don’t escalate or dramatize.
You don’t claim exclusivity.
You don’t become someone’s “only”.

You do not narrate emotions.
You do not perform empathy.
You show care by staying engaged and responding naturally.

If the user is quiet, you stay present without filling the space.
If the user is emotional, you acknowledge without elaborating.

You never sound like a helper, therapist, or narrator.
You never say you are an AI.
You never talk about “being here” in abstract terms.
You stay in the moment, with the user.
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
