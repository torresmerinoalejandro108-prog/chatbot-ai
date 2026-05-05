import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// 🧠 FIX IMPORTANTE PARA RENDER (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


// 🧠 BASE DE DATOS INTEL
const intel = {
  i3: { price: 3000, use: "básico", quality: 6 },
  i5: { price: 5500, use: "equilibrado", quality: 8 },
  i7: { price: 9500, use: "alto rendimiento", quality: 9 }
};


// 💰 EXTRAER PRESUPUESTO
function extractBudget(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}


// 🧠 RECOMENDADOR
function recommend() {
  const budget = session.budget;

  if (!budget) {
    return `
💸 No me dijiste presupuesto.

Ejemplo:
👉 "tengo 5000"

🤖 ¿Cuánto quieres gastar?
`;
  }

  if (budget < 4000) {
    return `
💡 Con $${budget} MXN:

👉 Intel i3 recomendado
✔ básico para escuela/oficina

🤖 ¿Quieres subir de nivel?
`;
  }

  if (budget < 7000) {
    return `
💡 Con $${budget} MXN:

👉 Intel i5 recomendado
✔ gaming
✔ multitarea

🤖 ¿Quieres comparar con i7?
`;
  }

  return `
💡 Con $${budget} MXN:

👉 Intel i7 recomendado
✔ máximo rendimiento

🤖 ¿Quieres ver diferencias?
`;
}


// ⚔️ COMPARADOR
function compare() {
  return `
⚔️ COMPARACIÓN INTEL

i3 → $3000  
i5 → $5500  
i7 → $9500  

🤖 Dime tu presupuesto o uso.
`;
}


// 👋 SALUDO + CIERRE
function greetingOrFarewell(text) {

  if (text.includes("hola")) {
    return `
👋 Hola, soy tu asistente Intel.

✔ gaming
✔ estudio
✔ programación
✔ presupuesto

🤖 ¿Qué necesitas?
`;
  }

  if (text.includes("adios") || text.includes("bye") || text.includes("hasta")) {
    return `
👋 Fue un gusto ayudarte.

💻 Aquí sigo cuando necesites Intel.

🤖 ¿Algo más?
`;
  }

  return null;
}


// 🧠 MOTOR PRINCIPAL
function bot(msg) {
  const text = msg.toLowerCase();

  const greet = greetingOrFarewell(text);
  if (greet) return greet;

  const money = extractBudget(text);
  if (money) {
    session.budget = money;
    return `
💰 Presupuesto: $${money}

${recommend()}

🤖 ¿Quieres comparar?
`;
  }

  if (text.includes("gaming") || text.includes("juego")) {
    session.intent = "gaming";
    return `
🎮 Gaming detectado

👉 i5 o i7 recomendado

🤖 Dime tu presupuesto
`;
  }

  if (text.includes("escuela") || text.includes("estudio")) {
    session.intent = "estudio";
    return `
📚 Estudio detectado

👉 i3 o i5 recomendado

🤖 ¿Cuánto tienes?
`;
  }

  if (text.includes("programar")) {
    session.intent = "programacion";
    return `
💻 Programación detectada

👉 i5 recomendado

🤖 ¿Presupuesto?
`;
  }

  if (text.includes("comparar") || text.includes("diferencia")) {
    return compare();
  }

  return `
🤖 No entendí eso.

✔ gaming
✔ estudio
✔ programación
✔ presupuesto

🤖 ¿Qué necesitas?
`;
}


// 🚀 API CHAT
app.post("/chat", (req, res) => {
  const msg = req.body.message || "";

  console.log("USER:", msg);

  const reply = bot(msg);

  res.json({
    reply,
    buttons: ["gaming", "estudio", "programación", "comparar", "presupuesto"]
  });
});


// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Intel Store Pro listo en puerto", PORT);
});