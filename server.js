import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const __dirname = path.resolve();

// Frontend
app.use(express.static(path.join(__dirname, "public")));

// OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Debug útil
console.log("🔑 API KEY:", process.env.OPENAI_API_KEY ? "CARGADA ✔" : "FALTA ❌");

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// CHAT
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "No me mandaste nada 😅" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.json({ reply: "❌ Falta la API key en Render" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;

    return res.json({
      reply: reply || "No hubo respuesta de la IA 🤖"
    });

  } catch (error) {
    console.error("💀 ERROR OPENAI:", error?.message || error);

    return res.json({
      reply: "Error con la IA 😵 revisa logs en Render"
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Chatbot activo en puerto", PORT);
});