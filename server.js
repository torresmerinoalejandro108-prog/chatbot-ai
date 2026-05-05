function bot(msg) {
  const text = msg.toLowerCase();

  const money = extractBudget(text);

  // 👋 inicio / menú principal
  if (text.includes("menu") || text.includes("inicio") || text === "hola") {
    return {
      reply: `
👋 Bienvenido a Intel Store

Elige una opción:
      `,
      buttons: ["🎮 Gaming", "📚 Estudio", "💻 Programación", "💰 Precios", "⚔️ Comparar"]
    };
  }

  // 🎮 gaming
  if (text.includes("gaming")) {
    session.intent = "gaming";
    return {
      reply: `
🎮 Gaming detectado

¿Cuál es tu presupuesto?
      `,
      buttons: ["3000", "5000", "8000", "10000"]
    };
  }

  // 📚 estudio
  if (text.includes("estudio")) {
    session.intent = "estudio";
    return {
      reply: `
📚 Modo estudio

¿Cuánto quieres invertir?
      `,
      buttons: ["3000", "5000", "7000"]
    };
  }

  // 💻 programación
  if (text.includes("programacion") || text.includes("programar")) {
    session.intent = "programacion";
    return {
      reply: `
💻 Programación detectada

Elige presupuesto:
      `,
      buttons: ["5000", "7000", "10000"]
    };
  }

  // 💰 precios / info
  if (text.includes("precio") || text.includes("precios")) {
    return {
      reply: `
💰 Intel precios:

i3 → $3000 (básico)
i5 → $5500 (equilibrado)
i7 → $9500 (potente)

¿Qué quieres hacer?
      `,
      buttons: ["Comparar", "Recomendar", "Inicio"]
    };
  }

  // ⚔️ comparar
  if (text.includes("comparar")) {
    return {
      reply: `
⚔️ Comparación Intel:

i3 → básico  
i5 → equilibrio  
i7 → alto rendimiento  

¿Qué quieres hacer?
      `,
      buttons: ["Gaming", "Estudio", "Programación", "Precios"]
    };
  }

  // 💸 presupuesto numérico
  if (money) {
    session.budget = money;

    return {
      reply: `
💰 Presupuesto detectado: $${money}

👉 i5 recomendado para balance
👉 i7 si quieres potencia

¿Quieres otra recomendación?
      `,
      buttons: ["Comparar", "Gaming", "Inicio"]
    };
  }

  // 🔁 fallback
  return {
    reply: `
🤖 Elige una opción para empezar
    `,
    buttons: ["🎮 Gaming", "📚 Estudio", "💻 Programación", "💰 Precios"]
  };
}