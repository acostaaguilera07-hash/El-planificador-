import { Difficulty, Grade, Subject, QuizQuestion } from "../types";

// Local generator fallbacks when server or API is offline
const generateLocalTheoryFallback = (grade: string, subject: string, topic: string): string => {
  const isLowerGrade = grade === "Primero" || grade === "Segundo";
  
  let greeting = "";
  let learning = "";
  let examples = "";
  let didYouKnow = "";
  let mission = "";
  
  if (isLowerGrade) {
    greeting = `¡Hola, pequeño gran explorador! Hoy nos embarcaremos en un viaje mágico por el asombroso mundo de las ideas. Prepárate para abrir tus ojos de detective y descubrir cosas maravillosas junto a nosotros. ¡La aventura de hoy sobre **${topic}** comienza ahora mismo!`;
    
    learning = `¿Te has preguntado alguna vez cómo funciona **${topic}**? ¡Es súper divertido! Imagina que es como un juego de magia. **${topic}** nos ayuda a entender todo lo que nos rodea en nuestra vida diaria, desde las hojas de los árboles hasta las estrellas del cielo. Es una herramienta maravillosa que nos permite comunicarnos, contar historias y resolver pequeños misterios de nuestro día a día en casa y en la escuela.`;
    
    examples = `¡Miremos algunos ejemplos fantásticos para entenderlo mejor!\n\n- **Primer ejemplo:** Imagina que tienes 3 manzanas rojas y deliciosas en una canasta y le regalas una a tu mejor amigo. ¡Eso es compartir y aprender sobre cantidades!\n- **Segundo ejemplo:** Cuando cantas tu canción favorita y sigues el ritmo con las palmas de tus manos. ¡Eso es sentir el compás de las palabras!\n- **Tercer ejemplo:** Cuando observas cómo una pequeña hormiga lleva una hojita de vuelta a su hormiguero con mucha fuerza. ¡Eso es la maravillosa naturaleza trabajando en equipo!`;
    
    didYouKnow = `¿Sabías que aprender sobre **${topic}** nos ayuda a que nuestro cerebro sea fuerte y brillante como una estrella? Cada vez que aprendes algo nuevo, se enciende una lucecita de sabiduría en tu mente. ¡Eres increíblemente inteligente!`;
    
    mission = `¡Tu misión de explorador hoy es muy sencilla y divertida!\n\nSal a tu patio o mira por la ventana con un familiar. Busca 3 cosas que se relacionen con **${topic}** o dibuja en una hoja de papel la parte que más te gustó de nuestra historia mágica de hoy. ¡Compártelo con tu docente y tus compañeros de clase!`;
  } else {
    greeting = `¡Bienvenido, explorador del conocimiento! Hoy abordaremos un tema fundamental que enriquecerá tu comprensión del mundo. Te invitamos a mantener una mente curiosa y activa durante esta clase interactiva sobre **${topic}** en la materia de **${subject}**. ¡Comencemos!`;
    
    learning = `El concepto de **${topic}** es una de las bases más interesantes de **${subject}**. Nos permite analizar, estructurar y comprender diversos fenómenos y procesos en nuestro entorno escolar, familiar y social. A través de este tema, desarrollamos habilidades críticas de razonamiento lógico, análisis de problemas y comunicación asertiva.\n\nEn la vida real, saber sobre **${topic}** nos da las herramientas necesarias para tomar mejores decisiones, argumentar nuestras ideas con base en hechos y colaborar de manera eficiente en la resolución de desafíos comunes.`;
    
    examples = `A continuación, analizaremos situaciones clave para profundizar en este conocimiento:\n\n- **Situación 1 (Aplicación Práctica):** En un mercado local, se organizan los productos por categorías para facilitar la compra. Esto demuestra el poder de la clasificación y el orden en nuestra vida diaria.\n- **Situación 2 (Análisis Crítico):** Al leer un texto informativo, identificamos la idea principal y los argumentos que la respaldan para comprender el mensaje del autor de forma precisa.\n- **Situación 3 (Resolución de Problemas):** Al realizar mediciones o estimaciones en proyectos de construcción o diseño escolar, aplicamos principios analíticos para lograr resultados exactos.`;
    
    didYouKnow = `¿Sabías que los grandes científicos, escritores e historiadores de Colombia y el mundo comenzaron haciéndose preguntas sencillas como las que nos hacemos hoy? La curiosidad es el motor del progreso científico y social de nuestro país.`;
    
    mission = `¡Tu misión de aprendizaje hoy es la siguiente!\n\nEscribe en tu cuaderno un breve resumen de tres renglones sobre lo que comprendiste acerca de **${topic}**. Luego, plantea una pregunta o duda que te haya surgido y compártela con tu profesor en la próxima sesión. ¡El aprendizaje nunca se detiene!`;
  }

  return `# 🌟 Descubriendo: ${topic} en ${subject}\n\n` +
    `## 🌟 ¡Hola Explorador!\n${greeting}\n\n` +
    `<<IMAGE: Ilustración educativa 3D estilo Pixar, colorida y detallada sobre ${topic} para el área de ${subject}>>\n\n` +
    `## 🧠 Aprendamos sobre ${topic}\n${learning}\n\n` +
    `## 📝 Ejemplos para entender mejor\n${examples}\n\n` +
    `<<IMAGE: Ilustración detallada estilo Pixar 3D mostrando un ejemplo práctico y didáctico de ${topic} en un salón de clases alegre>>\n\n` +
    `## 💡 ¿Sabías que?\n${didYouKnow}\n\n` +
    `## 🚀 Tu misión de hoy\n${mission}`;
};

const generateLocalMultigradeTheoryFallback = (grades: string[], subject: string, topic: string): string => {
  const gradesStr = grades.join(", ");
  
  let levelsContent = "";
  grades.forEach(grade => {
    const isLower = grade === "Primero" || grade === "Segundo";
    if (isLower) {
      levelsContent += `### 🎒 Para ${grade}\nEn este nivel, aprenderemos sobre **${topic}** de forma muy divertida. Nos enfocaremos en reconocer los elementos básicos, dibujar lo que vemos y jugar con ejemplos cotidianos en nuestra casa o escuela. ¡Recuerda que cada paso que das es un gran logro!\n\n`;
    } else {
      levelsContent += `### 🚀 Para ${grade}\nEn este nivel, profundizaremos en **${topic}**. Analizaremos las propiedades, las relaciones lógicas, el vocabulario técnico apropiado y resolveremos problemas más complejos aplicando nuestro razonamiento crítico. ¡Tú tienes la capacidad de liderar y guiar a tus compañeros!\n\n`;
    }
  });

  return `# 🌍 Aula Multigrado: Aprendiendo juntos sobre ${topic}\n\n` +
    `## 🤝 Introducción Común\n¡Bienvenidos estudiantes de los grados ${gradesStr}! Hoy compartiremos un espacio de aprendizaje único donde todos exploraremos el tema: **${topic}** de la materia de **${subject}**. Aunque cada uno trabajará según su nivel escolar, todos colaboraremos para descubrir nuevas ideas, apoyarnos mutuamente y crecer como un gran equipo educativo.\n\n` +
    `<<IMAGE: Ilustración estilo 3D Pixar de un aula multigrado rural y acogedora en Colombia, con niños de diferentes edades aprendiendo felices juntos con un gran tablero verde>>\n\n` +
    `## 🪜 Niveles de Aprendizaje (Diferenciación)\n${levelsContent}` +
    `## 🧩 Actividad Cooperativa Integrada\n**El Gran Reto del Trabajo en Equipo:**\nPara esta actividad, nos organizaremos en parejas o grupos mezclando estudiantes de diferentes grados. Los compañeros de grados más avanzados (ej: Tercero, Cuarto o Quinto) actuarán como tutores o guías, ayudando a explicar las instrucciones. Los compañeros de grados iniciales aportarán su gran imaginación para realizar un cartel creativo sobre **${topic}**. ¡Al final, cada grupo presentará su cartel al resto del aula!\n\n` +
    `<<IMAGE: Ilustración estilo Pixar de niños trabajando en equipo con cartulinas de colores y marcadores en una mesa de madera redonda>>\n\n` +
    `## 🚀 Misiones de Aprendizaje Diferenciadas\n` +
    grades.map(grade => {
      const isLower = grade === "Primero" || grade === "Segundo";
      return `- **Misión para ${grade}:** ${isLower ? `Dibuja en tu cuaderno una situación diaria donde uses o veas ${topic}. ¡Coloréalo muy bonito!` : `Escribe tres oraciones o un párrafo explicando cómo se aplica ${topic} para solucionar un problema en tu comunidad o escuela.`}`;
    }).join("\n");
};

const generateLocalQuizFallback = (grade: string, subject: string, topic: string, difficulty: string): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  const compList = [
    "Razonamiento Lógico",
    "Resolución de Problemas",
    "Comunicación y Lenguaje",
    "Explicación de Fenómenos",
    "Competencias Ciudadanas"
  ];
  
  const colombianScenarios = [
    { name: "Juan", place: "una hermosa finca cafetera en el Quindío" },
    { name: "María", place: "un alegre mercado de frutas en Paloquemao, Bogotá" },
    { name: "Carlos", place: "la orilla del majestuoso Río Magdalena" },
    { name: "Sofía", place: "las coloridas calles coloniales de Cartagena" },
    { name: "Santiago", place: "los verdes y extensos llanos orientales" },
    { name: "Gabriela", place: "una escuela rural rodeada de hermosas montañas de Antioquia" },
    { name: "Mateo", place: "una reserva natural del Parque Tayrona en Santa Marta" },
    { name: "Valentina", place: "un festival de música folclórica en Cali" },
    { name: "Samuel", place: "los mágicos cultivos de flores en la Sabana de Bogotá" },
    { name: "Camila", place: "las hermosas costas del Océano Pacífico colombiano" }
  ];

  for (let i = 1; i <= 10; i++) {
    const scenario = colombianScenarios[(i - 1) % colombianScenarios.length];
    const competency = compList[(i - 1) % compList.length];
    
    let questionText = "";
    let options: string[] = [];
    let correctIdx = 0;
    let explanation = "";
    let context = "";
    let imagePrompt = "";

    context = `En ${scenario.place}, ${scenario.name} está realizando un proyecto escolar muy importante sobre **${topic}** para la materia de **${subject}** en su curso de **${grade}**.`;
    imagePrompt = `Ilustración educativa 3D Pixar de ${scenario.name} en ${scenario.place} aprendiendo con alegría sobre ${topic}, colores vivos, apto para niños`;

    const subLower = subject.toLowerCase();
    if (subLower.includes("matem") || subLower.includes("math")) {
      if (i % 2 === 1) {
        questionText = `Si ${scenario.name} tiene un grupo de elementos relacionados con ${topic} y decide dividirlos en partes iguales entre sus 3 mejores compañeros de clase, ¿qué operación matemática o concepto debe aplicar principalmente?`;
        options = [
          "La división y el concepto de repartir en partes iguales.",
          "La suma simple sin considerar grupos.",
          "La resta de todo lo que tiene ahorrado.",
          "Ignorar los elementos y no realizar ninguna acción."
        ];
        correctIdx = 0;
        explanation = "Al repartir una cantidad total en grupos con la misma cantidad de elementos para cada persona, aplicamos la operación de la división o el reparto equitativo, que es fundamental en matemáticas.";
      } else {
        questionText = `Para medir y registrar adecuadamente la información recolectada sobre ${topic}, ¿cuál de los siguientes instrumentos o métodos es el más apropiado para su nivel de ${grade}?`;
        options = [
          "Una regla métrica, un calendario o un ábaco escolar dependiendo de lo que deba medir.",
          "Adivinar al azar sin ningún instrumento de apoyo.",
          "Utilizar una balanza de alta precisión industrial.",
          "Medir usando los pasos de un gigante imaginario."
        ];
        correctIdx = 0;
        explanation = "En básica primaria, utilizamos herramientas de medición cotidianas y de fácil acceso como reglas, calendarios, ábacos y tablas de conteo sencillas para registrar datos con precisión.";
      }
    } else if (subLower.includes("cienc") || subLower.includes("natural")) {
      if (i % 2 === 1) {
        questionText = `¿Cómo afecta principalmente el concepto de ${topic} al medio ambiente o a los seres vivos que habitan en la región donde vive ${scenario.name}?`;
        options = [
          "Permite mantener el equilibrio natural, la adaptación de las especies y el cuidado de los recursos.",
          "No tiene ninguna relación ni efecto con los seres vivos del planeta.",
          "Causa que las plantas dejes de crecer inmediatamente en todas las regiones.",
          "Provoca que los ríos fluyan hacia arriba en lugar de hacia abajo."
        ];
        correctIdx = 0;
        explanation = "En ciencias naturales, todos los elementos y conceptos de la naturaleza están interconectados. Comprenderlos nos ayuda a conservar la biodiversidad y proteger los hábitats locales.";
      } else {
        questionText = `Si ${scenario.name} realiza un experimento o una observación directa sobre ${topic}, ¿cuál debe ser su primer paso siguiendo el método científico escolar?`;
        options = [
          "Observar detenidamente el fenómeno y formular una pregunta curiosa sobre él.",
          "Escribir las conclusiones finales antes de mirar el experimento.",
          "Copiar las respuestas del cuaderno de su compañero.",
          "Olvidar el experimento y jugar fútbol en la cancha."
        ];
        correctIdx = 0;
        explanation = "El método científico comienza con la observación atenta de nuestro entorno, lo que despierta preguntas e hipótesis que luego investigamos y experimentamos.";
      }
    } else if (subLower.includes("lengu") || subLower.includes("españ") || subLower.includes("ingl")) {
      if (i % 2 === 1) {
        questionText = `Para explicar de forma clara el tema de ${topic} a toda la comunidad de su escuela, ¿cuál es el medio de expresión escrita más efectivo que puede utilizar?`;
        options = [
          "Un texto instructivo, un cuento corto o una cartelera con dibujos claros e informativos.",
          "Escribir una sola palabra en una hoja y no dar más explicaciones.",
          "Usar un idioma inventado que nadie en la escuela pueda comprender.",
          "Gritar el tema en el patio durante el recreo sin escribir nada."
        ];
        correctIdx = 0;
        explanation = "La comunicación escrita se enriquece con diferentes tipos de textos (narrativos, expositivos, instructivos) que se adaptan a nuestro público para transmitir un mensaje claro.";
      } else {
        questionText = `¿Qué elemento de la lengua (como sustantivos, adjetivos o verbos) ayuda mejor a describir las características especiales de ${topic}?`;
        options = [
          "Los adjetivos calificativos, porque nos dicen cómo son las cosas y nos dan detalles de sus cualidades.",
          "Los verbos únicamente, ya que solo muestran acciones rápidas del tema.",
          "Los signos de interrogación al final de cada oración.",
          "Los números telefónicos de los familiares de la escuela."
        ];
        correctIdx = 0;
        explanation = "Los adjetivos son palabras mágicas que describen cualidades, formas, colores y características de las cosas o conceptos, ayudándonos a pintar una imagen clara en la mente del lector.";
      }
    } else {
      if (i % 2 === 1) {
        questionText = `¿De qué manera el aprendizaje sobre ${topic} contribuye a la convivencia armónica y el desarrollo de la comunidad escolar de ${scenario.name}?`;
        options = [
          "Fomenta el respeto por la diversidad de ideas, el trabajo colaborativo y la toma de decisiones democráticas.",
          "Promueve que cada estudiante trabaje solo y no escuche a los demás compañeros.",
          "Genera desacuerdos e impide que los estudiantes jueguen en los descansos.",
          "No tiene ningún impacto en la forma en que convivimos en el aula escolar."
        ];
        correctIdx = 0;
        explanation = "El conocimiento y las ciencias sociales o la ética nos enseñan a valorar las diferencias, trabajar de la mano con otros y construir una convivencia de paz basada en el respeto mutuo.";
      } else {
        questionText = `¿Cuál de las siguientes acciones creativas representa mejor el concepto de ${topic} para una exposición didáctica o artística escolar?`;
        options = [
          "Crear una maqueta con materiales reciclados, un dibujo colorido o un sociodrama representativo.",
          "Presentar una hoja en blanco sin ningún tipo de contenido o explicación.",
          "Comprar un juguete prefabricado en la tienda y decir que lo hizo él mismo.",
          "Ocultar la presentación para que ningún compañero de curso pueda verla."
        ];
        correctIdx = 0;
        explanation = "La expresión artística y didáctica nos permite plasmar ideas complejas a través de la creatividad, usando materiales sencillos del medio para comunicar aprendizajes de forma interactiva.";
      }
    }

    questions.push({
      context,
      imagePrompt,
      competency,
      question: questionText,
      options,
      correctAnswerIndex: correctIdx,
      explanation
    });
  }

  return questions;
};

export const generateTheory = async (
  grade: Grade,
  subject: Subject,
  topic: string
): Promise<string> => {
  try {
    const response = await fetch("/api/theory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade, subject, topic }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.content || generateLocalTheoryFallback(grade, subject, topic);
  } catch (error) {
    console.error("Error generating theory, activating local generator:", error);
    return generateLocalTheoryFallback(grade, subject, topic);
  }
};

export const generateMultigradeTheory = async (
  grades: Grade[],
  subject: Subject,
  topic: string
): Promise<string> => {
  try {
    const response = await fetch("/api/multigrade-theory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grades, subject, topic }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.content || generateLocalMultigradeTheoryFallback(grades, subject, topic);
  } catch (error) {
    console.error("Error generating multigrade theory, activating local generator:", error);
    return generateLocalMultigradeTheoryFallback(grades, subject, topic);
  }
};

export const generateClassImage = async (
  topic: string,
  subject: string
): Promise<string | null> => {
  try {
    const response = await fetch("/api/class-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, subject }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error("Error generating image, utilizing search pattern fallback:", error);
    // Dynamic picsum fallback to maintain nice aesthetics
    return `https://picsum.photos/seed/${encodeURIComponent(topic)}/600/400`;
  }
};

export const generateQuiz = async (
  grade: Grade,
  subject: Subject,
  topic: string,
  difficulty: Difficulty
): Promise<QuizQuestion[]> => {
  try {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade, subject, topic, difficulty }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating quiz, activating local generator:", error);
    return generateLocalQuizFallback(grade, subject, topic, difficulty);
  }
};
