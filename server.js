import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Ruta correcta del proyecto
const __dirname = path.resolve();

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client seguro
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🏠 Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🤖 CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No pude generar respuesta 😅";

    res.json({ reply });

  } catch (error) {
    console.error("Error OpenAI:", error);

    res.status(500).json({
      reply: "Error en el servidor o en la IA 😵"
    });
  }
});

// ❌ fallback 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Puerto Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Chatbot activo en puerto " + PORT);
});