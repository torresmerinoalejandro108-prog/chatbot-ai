const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const __dirname = __dirname || path.resolve();

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
✔ económico
✔ básico para escuela/oficina

🤖 ¿Quieres subir de nivel o comparar opciones?
`;
  }

  if (budget < 7000) {
    return `
💡 Con $${budget} MXN:

👉 Intel i5 recomendado
✔ gaming
✔ multitarea
✔ mejor inversión

🤖 ¿Quieres compararlo con i7?
`;
  }

  return `
💡 Con $${budget} MXN:

👉 Intel i7 recomendado
✔ máximo rendimiento
✔ gaming extremo
✔ edición profesional

🤖 ¿Quieres ver diferencias con i5?
`;
}


// ⚔️ COMPARADOR
function compare() {
  return `
⚔️ COMPARACIÓN INTEL

i3 → $3000 | básico  
i5 → $5500 | equilibrado  
i7 → $9500 | alto rendimiento  

🤖 Dime tu presupuesto o uso (gaming, estudio, programación)
`;
}


// 👋 SALUDO + CIERRE INTELIGENTE
function greetingOrFarewell(text) {

  if (text.includes("hola")) {
    return `
👋 Hola, soy tu asistente Intel.

Te ayudo a elegir el mejor procesador según:
✔ gaming
✔ estudio
✔ programación
✔ presupuesto

🤖 ¿Qué necesitas hoy?
`;
  }

  if (text.includes("adios") || text.includes("bye") || text.includes("hasta")) {
    return `
👋 Perfecto, fue un gusto ayudarte.

💻 Cuando quieras elegir un Intel, aquí estaré.

🤖 ¿Necesitas algo más?
`;
  }

  return null;
}


// 🧠 MOTOR PRINCIPAL
function bot(msg) {
  const text = msg.toLowerCase();

  // 👋 saludo / despedida
  const greet = greetingOrFarewell(text);
  if (greet) return greet;

  // 💸 presupuesto
  const money = extractBudget(text);
  if (money) {
    session.budget = money;
    return `
💰 Presupuesto detectado: $${money}

${recommend()}

🤖 ¿Quieres comparar o elegir otra opción?
`;
  }

  // 🎮 gaming
  if (text.includes("gaming") || text.includes("juego")) {
    session.intent = "gaming";
    return `
🎮 Gaming detectado

👉 Recomendado: i5 o i7

🤖 Dime tu presupuesto (ej: tengo 5000)
`;
  }

  // 📚 escuela
  if (text.includes("escuela") || text.includes("estudio")) {
    session.intent = "estudio";
    return `
📚 Estudio detectado

👉 i3 o i5 recomendado

🤖 ¿Cuánto quieres gastar?
`;
  }

  // 💻 programación
  if (text.includes("programar")) {
    session.intent = "programacion";
    return `
💻 Programación detectada

👉 i5 recomendado
👉 i7 si es pesado

🤖 ¿Cuál es tu presupuesto?
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
👉 gaming / estudio / programación

🤖 o tu presupuesto directo.
`;
  }

  // 👎 no
  if (text === "no") {
    return `
👌 Entendido.

Puedes preguntarme:
✔ precios
✔ comparar
✔ gaming
✔ presupuesto

🤖 ¿Qué quieres ahora?
`;
  }

  // 🔁 fallback
  return `
🤖 No entendí eso bien.

Pero puedo ayudarte con:
✔ gaming
✔ estudio
✔ programación
✔ comparar
✔ precios

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