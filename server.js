const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// 📁 ruta segura
const __dirname = path.resolve();

// 🌐 frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🧠 bot simple estable
function bot(msg = "") {
  const text = String(msg).toLowerCase();

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
      reply: "🎮 Gaming detectado",
      buttons: ["3000", "5000", "8000"]
    };
  }

  // 📚 estudio
  if (text.includes("estudio")) {
    return {
      reply: "📚 Estudio detectado",
      buttons: ["3000", "5000", "7000"]
    };
  }

  // 💻 programación
  if (text.includes("programacion") || text.includes("programar")) {
    return {
      reply: "💻 Programación detectada",
      buttons: ["5000", "7000", "10000"]
    };
  }

  // 💰 precios
  if (text.includes("precio")) {
    return {
      reply: "💰 i3: $3000 | i5: $5500 | i7: $9500",
      buttons: ["Gaming", "Estudio", "Programación"]
    };
  }

  // 🔁 fallback seguro
  return {
    reply: "🤖 Usa el menú",
    buttons: ["Gaming", "Estudio", "Programación", "Precios"]
  };
}

// 🚀 API
app.post("/chat", (req, res) => {
  try {
    const msg = req.body?.message || "";
    const result = bot(msg);

    res.json(result);
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      reply: "Error interno",
      buttons: ["Inicio"]
    });
  }
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Intel Bot activo en puerto", PORT);
});