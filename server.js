const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const __dirname = path.resolve();

// 🌐 FRONTEND
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🧠 MEMORIA SIMPLE
let session = {
  intent: null,
  budget: null
};

// 💰 EXTRAER NÚMEROS
function extractBudget(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// 🧠 BOT CENTRAL (SIEMPRE DEVUELVE MISMO FORMATO)
function bot(msg) {
  const text = msg.toLowerCase();

  const money = extractBudget(text);

  // 👋 inicio
  if (text.includes("hola") || text.includes("menu") || text === "inicio") {
    return {
      reply: "👋 Bienvenido a Intel Store. Elige una opción:",
      buttons: ["Gaming", "Estudio", "Programación", "Precios", "Comparar"]
    };
  }

  // 🎮 gaming
  if (text.includes("gaming")) {
    session.intent = "gaming";
    return {
      reply: "🎮 Gaming detectado. ¿Cuál es tu presupuesto?",
      buttons: ["3000", "5000", "8000", "10000"]
    };
  }

  // 📚 estudio
  if (text.includes("estudio")) {
    session.intent = "estudio";
    return {
      reply: "📚 Modo estudio. ¿Cuánto quieres invertir?",
      buttons: ["3000", "5000", "7000"]
    };
  }

  // 💻 programación
  if (text.includes("programacion") || text.includes("programar")) {
    session.intent = "programacion";
    return {
      reply: "💻 Programación detectada. Elige presupuesto:",
      buttons: ["5000", "7000", "10000"]
    };
  }

  // 💰 precios
  if (text.includes("precio")) {
    return {
      reply: "💰 i3: $3000 | i5: $5500 | i7: $9500",
      buttons: ["Gaming", "Estudio", "Programación", "Comparar"]
    };
  }

  // ⚔️ comparar
  if (text.includes("comparar")) {
    return {
      reply: "⚔️ i3 básico | i5 equilibrado | i7 potente",
      buttons: ["Gaming", "Estudio", "Programación", "Precios"]
    };
  }

  // 💸 presupuesto numérico
  if (money) {
    session.budget = money;

    let recomendacion = "";

    if (money < 4000) recomendacion = "👉 i3 recomendado";
    else if (money < 7000) recomendacion = "👉 i5 recomendado";
    else recomendacion = "👉 i7 recomendado";

    return {
      reply: `💰 Presupuesto: $${money}\n${recomendacion}`,
      buttons: ["Comparar", "Inicio", "Gaming"]
    };
  }

  // 🔁 fallback
  return {
    reply: "🤖 Elige una opción del menú",
    buttons: ["Gaming", "Estudio", "Programación", "Precios"]
  };
}

// 🚀 API
app.post("/chat", (req, res) => {
  const msg = req.body.message || "";

  try {
    const result = bot(msg);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Error interno del servidor",
      buttons: ["Inicio"]
    });
  }
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Intel bot activo en puerto", PORT);
});