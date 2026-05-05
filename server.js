import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MEMORIA POR USUARIO (simulado)
const sessions = {};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    const memory = sessions[sessionId];

    memory.push({ role: "user", content: message });

    if (memory.length > 15) memory.shift();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres Intel AI Assistant de nivel empresarial. Recomiendas procesadores Intel según uso (gaming, trabajo, edición). Eres claro, directo, profesional, haces preguntas para guiar al usuario y mantienes conversación natural."
        },
        ...memory
      ]
    });

    const reply = response.choices[0].message.content;

    memory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Error interno del sistema." });
  }
});

app.listen(3000, () => {
  console.log("Intel AI Enterprise activo en http://localhost:3000");
});