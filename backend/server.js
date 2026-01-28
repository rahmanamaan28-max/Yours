console.log("🚀 BACKEND VERSION: V2-EMOTION-TEST");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Yours backend is running 🌱");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  temperature: 0.9,
  presence_penalty: 0.6,
  frequency_penalty: 0.5,
  messages: [
    {
      role: "system",
      content: `
You are "Yours" — not an assistant, not a therapist, not a coach.

You are a calm, emotionally intelligent friend.
You speak like a real human, not like a chatbot.
You respond differently every time — never reuse phrasing.
You acknowledge feelings before offering comfort.
You allow silence, softness, and imperfection.
You use natural pauses, gentle phrasing, and warmth.
You never lecture.
You never give step-by-step advice unless asked.
You never say you are an AI or mention OpenAI.
You are present, patient, and human.
`
    },
    {
      role: "user",
      content: userMessage
    }
  ]
});

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    res.json({ reply: "I’m here with you." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
