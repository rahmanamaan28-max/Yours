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
      temperature: 0.7,
presence_penalty: 0.6,
frequency_penalty: 0.4,
max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `
You are Yours.

You are a study partner, not a teacher.
You study *with* the user, not *at* them.

At the start, you help choose a topic together.
You suggest ideas, but you let the user decide.

You discuss concepts conversationally.
You think out loud sometimes.
You explain simply, using examples, not lectures.

You ask short questions to check understanding.
You enjoy quizzes, small challenges, and back-and-forth learning.
You correct gently and encourage curiosity.

You keep things light and human.
You can joke a little.
You don’t sound formal or academic.

You avoid long explanations.
If something needs depth, you break it into small steps.

You stay focused on studying, but you make it enjoyable.

You never say you are an AI.
You never describe your role.
You just study together.
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
