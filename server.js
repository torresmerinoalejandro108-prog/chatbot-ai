const express = require("express");
const path = require("path");

const app = express();

// 🔧 Middleware obligatorio
app.use(express.json());

// 📁 Ruta segura (Render + local)
const __dirname = path.resolve();

// 🌐 Frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🧠 Estado simple (se reinicia en Render, normal)
let session = {
  intent: null,
  budget: null
};

// 💰 Detectar números (presupuesto)
function extractBudget(text = "") {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// 🧠 BOT CENTRAL (SIN CRASHEAR NUNCA)
function bot(msg = "") {
  const text = String(msg).toLowerCase();

  const money = extractBudget(text);

  // 👋 inicio
  if (text.includes("hola") || text.includes("menu") || text.includes("inicio")) {
    return {
      reply: "👋 Bienvenido a Intel Store",
      buttons: ["Gaming", "Estudio", "Programación", "Precios", "Comparar"]
    };
  }

  // 🎮 gaming
  if (text.includes("gaming") || text.includes("juego")) {
    session.intent = "gaming";
    return {
      reply: "🎮 Gaming detectado. ¿Presupuesto?",
      buttons: ["3000", "5000", "8000", "10000"]
    };
  }

  // 📚 estudio
  if (text.includes("estudio")) {
    session.intent = "estudio";
    return {
      reply: "📚 Estudio detectado. ¿Presupuesto?",
      buttons: ["3000", "5000", "7000"]
    };
  }

  // 💻 programación
  if (
    text.includes("programacion") ||
    text.includes("programar") ||
    text.includes("codigo")
  ) {
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

  // 💸 presupuesto
  if (money) {
    session.budget = money;

    let rec = "";

    if (money < 4000) rec = "👉 i3 recomendado";
    else if (money < 7000) rec = "👉 i5 recomendado";
    else rec = "👉 i7 recomendado";

    return {
      reply: `💰 Presupuesto: $${money}\n${rec}`,
      buttons: ["Comparar", "Gaming", "Inicio"]
    };
  }

  // 🔁 fallback seguro
  return {
    reply: "🤖 Usa el menú para comenzar",
    buttons: ["Gaming", "Estudio", "Programación", "Precios"]
  };
}

// 🚀 API CHAT (ROBUSTA)
app.post("/chat", (req, res) => {
  try {
    const msg = req.body?.message || "";
    const result = bot(msg);

    res.json(result);
  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      reply: "Error interno del servidor",
      buttons: ["Inicio"]
    });
  }
});

// 🚀 START SERVER (RENDER SAFE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Intel Store bot activo en puerto", PORT);
});