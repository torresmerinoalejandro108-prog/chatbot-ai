const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// 🔧 RUTA BASE CORRECTA
const __dirname = path.resolve();

// 🌐 FRONTEND
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🧠 BOT SIMPLE Y SEGURO
function bot(msg = "") {
  const text = msg.toLowerCase();

  // 👋 inicio
  if (text.includes("hola") || text.includes("menu")) {
    return {
      reply: "👋 Bienvenido a Intel Bot",
      buttons: ["Gaming", "Estudio", "Programación", "Precios"]
    };
  }

  // 🎮 gaming
  if (text.includes("gaming")) {
    return {
      reply: "🎮 Gaming detectado. ¿Presupuesto?",
      buttons: ["3000", "5000", "8000"]
    };
  }

  // 📚 estudio
  if (text.includes("estudio")) {
    return {
      reply: "📚 Estudio detectado. ¿Presupuesto?",
      buttons: ["3000", "5000", "7000"]
    };
  }

  // 💻 programación
  if (text.includes("programacion") || text.includes("programar")) {
    return {
      reply: "💻 Programación detectada. ¿Presupuesto?",
      buttons: ["5000", "7000", "10000"]
    };
  }

  // 💰 precios
  if (text.includes("precio")) {
    return {
      reply: "💰 i3: 3000 | i5: 5500 | i7: 9500",
      buttons: ["Gaming", "Estudio", "Programación"]
    };
  }

  // ⚔️ fallback
  return {
    reply: "🤖 Elige una opción del menú",
    buttons: ["Gaming", "Estudio", "Programación", "Precios"]
  };
}

// 🚀 API CHAT (ROBUSTA)
app.post("/chat", (req, res) => {
  try {
    const msg = req.body.message || "";
    const result = bot(msg);

    res.json(result);
  } catch (error) {
    console.error("ERROR SERVER:", error);

    res.status(500).json({
      reply: "Error interno del servidor",
      buttons: ["Inicio"]
    });
  }
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Bot activo en puerto", PORT);
});