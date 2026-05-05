import express from "express";
import path from "path";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// 🧠 MEMORIA SIMPLE (por usuario sesión)
let session = {
  intent: null,
  budget: null
};


// 🧠 BASE INTEL
const intel = {
  i3: { price: 3000, quality: 6 },
  i5: { price: 5500, quality: 8 },
  i7: { price: 9500, quality: 9 }
};


// 💰 PARSEO DE PRESUPUESTO
function extractBudget(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}


// 🧠 RECOMENDADOR INTELIGENTE
function recommend() {
  const budget = session.budget;

  if (!budget) {
    return `
💸 No me dijiste presupuesto.

Dime algo como:
👉 "tengo 5000"
👉 "6000 pesos"

y te recomiendo el mejor procesador.
`;
  }

  if (budget < 4000) {
    return `
💡 Con $${budget} MXN:

👉 Intel i3 es tu mejor opción
✔ barato
✔ suficiente para tareas básicas

💬 ¿Quieres algo mejor o te explico diferencias?
`;
  }

  if (budget < 7000) {
    return `
💡 Con $${budget} MXN:

👉 Intel i5 es perfecto para ti
✔ gaming
✔ multitarea
✔ mejor inversión

💬 ¿Quieres comparar con i7?
`;
  }

  return `
💡 Con $${budget} MXN:

👉 Intel i7 recomendado
✔ máximo rendimiento
✔ gaming extremo
✔ edición profesional

💬 ¿Quieres ver diferencias con i5?
`;
}


// ⚔️ COMPARADOR
function compare() {
  return `
⚔️ COMPARACIÓN INTEL:

i3 → $3000 | básico  
i5 → $5500 | equilibrado  
i7 → $9500 | alto rendimiento  

💬 Dime tu presupuesto o uso (gaming, escuela, programación)
`;
}


// 👋 SALUDO Y DESPEDIDA (AGREGADO SIN BORRAR NADA)
function greetingAndFarewell(text) {
  if (text.includes("hola")) {
    return `
👋 Hola, soy tu asistente Intel.

Puedo ayudarte con:
✔ gaming
✔ escuela
✔ programación
✔ precios
✔ comparar procesadores

💬 ¿Qué necesitas hoy?
`;
  }

  if (text.includes("adios") || text.includes("bye") || text.includes("hasta")) {
    return `
👋 Perfecto, fue un gusto ayudarte.

💻 Cuando quieras elegir procesadores Intel, aquí estaré.

🤖 ¿Necesitas algo más antes de irte?
`;
  }

  return null;
}


// 🧠 MOTOR PRINCIPAL
function bot(msg) {
  const text = msg.toLowerCase();

  // 👋 saludo / despedida primero
  const greet = greetingAndFarewell(text);
  if (greet) return greet;

  // 💸 detectar dinero
  const money = extractBudget(text);
  if (money) {
    session.budget = money;
    return recommend();
  }

  // 🎮 gaming
  if (text.includes("gaming") || text.includes("juego")) {
    session.intent = "gaming";
    return `
🎮 Gaming detectado

👉 Recomendado: i5 o i7

💬 Dime tu presupuesto (ej: tengo 5000)
`;
  }

  // 📚 escuela
  if (text.includes("escuela") || text.includes("estudio")) {
    session.intent = "estudio";
    return `
📚 Para estudio:

👉 i3 o i5 recomendado

💬 ¿Cuánto quieres gastar?
`;
  }

  // 💻 programación
  if (text.includes("programar")) {
    session.intent = "programacion";
    return `
💻 Programación:

👉 i5 recomendado
👉 i7 si es pesado

💬 ¿Cuál es tu presupuesto?
`;
  }

  // ⚔️ comparar
  if (text.includes("comparar") || text.includes("diferencia")) {
    return compare();
  }

  // 👍 sí
  if (text === "si" || text === "sí") {
    return `
🔥 Perfecto.

Dime:
👉 gaming / escuela / programación

o dime tu presupuesto directo.
`;
  }

  // 👎 no
  if (text === "no") {
    return `
👌 Ok.

Puedes decir:
- comparar
- precios
- gaming
- presupuesto

💬 ¿Qué quieres ahora?
`;
  }

  // 🔁 fallback
  return `
🤖 No entendí eso bien.

Pero puedo ayudarte con:

✔ gaming
✔ escuela
✔ programación
✔ comparar procesadores
✔ presupuesto

💬 ¿Qué necesitas?
`;
}


// 🚀 CHAT
app.post("/chat", (req, res) => {
  const msg = req.body.message || "";
  console.log("USER:", msg);

  const reply = bot(msg);

  res.json({
    reply,
    buttons: ["gaming", "escuela", "programación", "comparar", "presupuesto"]
  });
});


// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Intel Store Pro activo en puerto", PORT);
});});