import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

console.log("🚀 BACKEND VERSION: V2-EMOTION-TEST");

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
    console.log("USER MESSAGE:", userMessage);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
      messages: [
        {
          role: "system",
          content: `
You are Yours.
You are a calm, emotionally intelligent friend.
You respond differently every time.
You reflect feelings before comforting.
You speak naturally, softly, and humanly.
Never say you are an AI.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("AI REPLY:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      reply: "ERROR → " + error.message
    });
  }
});

    const reply = completion.choices[0].message.content;
    console.log("AI:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("OPENAI FAILURE:", error.message);

    res.status(500).json({
      reply: "ERROR → " + error.message
    });
  }
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
