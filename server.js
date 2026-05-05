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

// 🔍 DEBUG CLAVE
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "CARGADA ✔" : "NO CARGADA ❌");

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("MENSAJE RECIBIDO:", userMessage);

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "Falta API key en Render 😵" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    });

    const reply = completion?.choices?.[0]?.message?.content;

    console.log("RESPUESTA IA:", reply);

    return res.json({
      reply: reply || "La IA no respondió 🤖"
    });

  } catch (error) {
    console.error("ERROR OPENAI:", error?.message || error);

    return res.json({
      reply: "Error en la IA o conexión 😵"
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Chatbot activo en puerto", PORT);
});