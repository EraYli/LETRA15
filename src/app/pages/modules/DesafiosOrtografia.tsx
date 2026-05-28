import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../../supabaseClient";
import DinoLettersBg from "../../components/DinoLettersBg";

type Nivel = "facil" | "medio" | "dificil";

interface PreguntaFacil {
  word: string;
  image: string;
  options: string[];
  correct: string;
  hint: string;
}

interface Hueco {
  options: string[];
  correct: string;
}
interface PreguntaMedio {
  template: string;
  blanks: Hueco[];
  image: string;
  hint: string;
  fullWord: string;
}

interface PreguntaDificil {
  word: string;
  image: string;
  hint: string;
}

const nivelesFacil: PreguntaFacil[] = [
  { word: "_asa",   image: "🏠", options: ["C", "S", "Z"], correct: "C", hint: "Es donde vives" },
  { word: "_ato",   image: "🐈", options: ["G", "J", "C"], correct: "G", hint: "Animal que hace miau" },
  { word: "_erro",  image: "🐕", options: ["P", "B", "D"], correct: "P", hint: "Animal que ladra" },
  { word: "_ol",    image: "☀️", options: ["S", "C", "Z"], correct: "S", hint: "Brilla de día" },
  { word: "_anana", image: "🍌", options: ["B", "V", "P"], correct: "B", hint: "Fruta amarilla" },
  { word: "_osa",   image: "🌹", options: ["R", "L", "S"], correct: "R", hint: "Flor con espinas" },
  { word: "_ez",    image: "🐟", options: ["P", "B", "F"], correct: "P", hint: "Animal del agua" },
  { word: "_oca",   image: "👄", options: ["B", "V", "P"], correct: "B", hint: "Con ella hablas" },
];

const nivelesMedio: PreguntaMedio[] = [
  {
    fullWord: "MARIPOSA", image: "🦋", hint: "Insecto colorido que vuela",
    template: "??ARI??OSA",
    blanks: [
      { options: ["M", "N", "B"], correct: "M" },
      { options: ["P", "B", "V"], correct: "P" },
    ],
  },
  {
    fullWord: "ELEFANTE", image: "🐘", hint: "Animal grande con trompa",
    template: "??L??FANTE",
    blanks: [
      { options: ["E", "A", "I"], correct: "E" },
      { options: ["E", "I", "A"], correct: "E" },
    ],
  },
  {
    fullWord: "TORTUGA", image: "🐢", hint: "Animal lento con caparazón",
    template: "TOR??U??A",
    blanks: [
      { options: ["T", "D", "P"], correct: "T" },
      { options: ["G", "J", "H"], correct: "G" },
    ],
  },
  {
    fullWord: "CABALLO", image: "🐴", hint: "Animal que galopa",
    template: "CA??A??LO",
    blanks: [
      { options: ["B", "V", "W"], correct: "B" },
      { options: ["L", "V", "W"], correct: "L" },
    ],
  },
  {
    fullWord: "DINOSAURIO", image: "🦕", hint: "Animal prehistórico",
    template: "??INO??AURIO",
    blanks: [
      { options: ["D", "B", "T"], correct: "D" },
      { options: ["S", "C", "Z"], correct: "S" },
    ],
  },
  {
    fullWord: "BALLENA", image: "🐋", hint: "Animal marino gigante",
    template: "??A??ENA",
    blanks: [
      { options: ["B", "V", "W"], correct: "B" },
      { options: ["LL", "Y", "L"], correct: "LL" },
    ],
  },
  {
    fullWord: "JIRAFA", image: "🦒", hint: "Animal de cuello largo",
    template: "??IRA??A",
    blanks: [
      { options: ["J", "G", "H"], correct: "J" },
      { options: ["F", "V", "B"], correct: "F" },
    ],
  },
  {
    fullWord: "ESTRELLA", image: "⭐", hint: "Brilla en el cielo de noche",
    template: "??STRE??A",
    blanks: [
      { options: ["E", "A", "I"], correct: "E" },
      { options: ["LL", "Y", "L"], correct: "LL" },
    ],
  },
];

const nivelesDificil: PreguntaDificil[] = [
  { word: "CASA",       image: "🏠", hint: "" },
  { word: "GATO",       image: "🐈", hint: "" },
  { word: "PERRO",      image: "🐕", hint: "" },
  { word: "TORTUGA",    image: "🐢", hint: "" },
  { word: "MARIPOSA",   image: "🦋", hint: "" },
  { word: "ELEFANTE",   image: "🐘", hint: "" },
  { word: "DINOSAURIO", image: "🦕", hint: "" },
  { word: "ESTRELLA",   image: "⭐", hint: "" },
];

const shuffleArr = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

function renderTemplate(template: string, filled: (string | null)[]): React.ReactElement {
  const parts = template.split("??");
  const result: React.ReactElement[] = [];
  parts.forEach((part, i) => {
    if (part) result.push(<span key={`p${i}`}>{part}</span>);
    if (i < parts.length - 1) {
      const val = filled[i];
      result.push(
        <span
          key={`h${i}`}
          className={`inline-block min-w-[2.5rem] border-b-4 text-center mx-1 ${
            val ? "border-[#6B21A8] text-[#6B21A8]" : "border-gray-400 text-transparent"
          }`}
        >
          {val ?? "_"}
        </span>
      );
    }
  });
  return <>{result}</>;
}

const nivelConfig = {
  facil:   { label: "Fácil",   emoji: "🌱", color: "from-[#16A34A] to-[#4ADE80]", descripcion: "Completa 1 letra de la palabra" },
  medio:   { label: "Medio",   emoji: "🔥", color: "from-[#F97316] to-[#FDE68A]", descripcion: "Completa 2 o 3 letras de la palabra" },
  dificil: { label: "Difícil", emoji: "⚡", color: "from-[#7C3AED] to-[#A855F7]", descripcion: "Ordena las letras para formar la palabra" },
};

export default function DesafiosOrtografia() {
  const { user } = useAuth();
  const [vista, setVista] = useState<"menu" | "jugando" | "resultado">("menu");
  const [nivelActual, setNivelActual] = useState<Nivel>("facil");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [moduloId, setModuloId] = useState<string | null>(null);
  const [nivelesCompletados, setNivelesCompletados] = useState<Nivel[]>([]);

  const [opcionesBarajadas, setOpcionesBarajadas] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);

  const [huecoActual, setHuecoActual] = useState(0);
  const [respuestasMedio, setRespuestasMedio] = useState<(string | null)[]>([]);
  const [opcionesMedioBarajadas, setOpcionesMedioBarajadas] = useState<string[]>([]);
  const [medioError, setMedioError] = useState(false);
  const [medioCorrectoParcial, setMedioCorrectoParcial] = useState(false);

  const [letrasDisponibles, setLetrasDisponibles] = useState<{ letra: string; id: number }[]>([]);
  const [letrasColocadas, setLetrasColocadas] = useState<{ letra: string; id: number }[]>([]);
  const [dificilResult, setDificilResult] = useState<"idle" | "correcto" | "incorrecto">("idle");
  const [palabraIncorrecta, setPalabraIncorrecta] = useState("");

  const [erroresEnNivel, setErroresEnNivel] = useState(0);
  const [rachaDeletreo, setRachaDeletreo] = useState(0);
  const [erroresEnPalabra, setErroresEnPalabra] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: modulo } = await supabase
        .from("modulos").select("id")
        .eq("titulo", "Desafíos de Ortografía").maybeSingle();
      if (!modulo) return;
      setModuloId(modulo.id);
      const { data: progreso } = await supabase
        .from("progreso_usuarios").select("puntuacion_total, nivel_actual")
        .eq("usuario_id", user.id).eq("modulo_id", modulo.id).maybeSingle();
      if (progreso) {
        setScore(progreso.puntuacion_total || 0);
        const n = progreso.nivel_actual || 1;
        const c: Nivel[] = [];
        if (n >= 2) c.push("facil");
        if (n >= 3) c.push("medio");
        if (n >= 4) c.push("dificil");
        setNivelesCompletados(c);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (vista !== "jugando") return;
    if (nivelActual === "facil") {
      const q = nivelesFacil[currentQuestion];
      setOpcionesBarajadas(shuffleArr(q.options));
      setSelectedAnswer(null); setShowResult(false); setEsCorrecta(false);
    }
    if (nivelActual === "medio") {
      const q = nivelesMedio[currentQuestion];
      setRespuestasMedio(new Array(q.blanks.length).fill(null));
      setHuecoActual(0);
      setOpcionesMedioBarajadas(shuffleArr(q.blanks[0].options));
      setMedioError(false); setMedioCorrectoParcial(false);
    }
    if (nivelActual === "dificil") {
      const q = nivelesDificil[currentQuestion];
      const letras = shuffleArr(q.word.split("").map((l, i) => ({ letra: l, id: i })));
      setLetrasDisponibles(letras);
      setLetrasColocadas([]);
      setDificilResult("idle");
    }
  }, [currentQuestion, nivelActual, vista]);

  // ✅ CAMBIO 1: nivel fácil se reintenta automático igual que medio
  useEffect(() => {
    if (showResult && !esCorrecta) {
      const timer = setTimeout(() => {
        const q = nivelesFacil[currentQuestion];
        setOpcionesBarajadas(shuffleArr(q.options));
        setSelectedAnswer(null);
        setShowResult(false);
        setEsCorrecta(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showResult, esCorrecta, currentQuestion]);

  const totalPreguntas = nivelActual === "facil" ? nivelesFacil.length
    : nivelActual === "medio" ? nivelesMedio.length : nivelesDificil.length;

  const iniciarNivel = (nivel: Nivel) => {
    setNivelActual(nivel);
    setCurrentQuestion(0);
    setPreguntasCorrectas(0);
    setErroresEnNivel(0);
    setErroresEnPalabra(0);
    setVista("jugando");
  };

  const guardarProgreso = async (correctas: number, nuevoScore: number, completadosActualizados: Nivel[]) => {
    if (!user || !moduloId) return;
    // ✅ CAMBIO 3: solo 3 niveles, dificil = nivel 3 completado
    const nivelNum = completadosActualizados.includes("dificil") ? 4
      : completadosActualizados.includes("medio") ? 3
      : completadosActualizados.includes("facil") ? 2 : 1;

    const { data: existing } = await supabase
      .from("progreso_usuarios").select("id, puntuacion_total, nivel_actual")
      .eq("usuario_id", user.id).eq("modulo_id", moduloId).maybeSingle();

    if (existing) {
      await supabase.from("progreso_usuarios").update({
        puntuacion_total: Math.max(existing.puntuacion_total || 0, nuevoScore),
        nivel_actual: Math.max(existing.nivel_actual || 1, nivelNum),
        ultima_conexion: new Date().toISOString(),
      }).eq("id", existing.id);
    } else {
      await supabase.from("progreso_usuarios").insert([{
        usuario_id: user.id, modulo_id: moduloId,
        puntuacion_total: nuevoScore, nivel_actual: nivelNum,
        ultima_conexion: new Date().toISOString(),
      }]);
    }

    if (!nivelesCompletados.includes(nivelActual)) {
      const logros: Record<Nivel, [string, string]> = {
        facil:   ["Brote Ortográfico",  "🌱"],
        medio:   ["Escritura de Fuego",   "🔥"],
        dificil: ["Velocirráptor de Palabras",    "⚡"],
      };
      const [nombre, icono] = logros[nivelActual];
      await otorgarLogro(nombre, icono);
    }

    if (erroresEnNivel === 0) {
      await otorgarLogro("Escudo Impecable", "🛡️");
    }

    await verificarLogrosGenerales(nuevoScore);
  };

  const verificarLogrosGenerales = async (puntosActuales: number) => {
    if (!user) return;
    if (puntosActuales >= 100) await otorgarLogro('Buscador de Estrellas', '🌟');
    if (puntosActuales >= 500) await otorgarLogro('Dino de Diamante', '💎');
    if (puntosActuales >= 1000) await otorgarLogro('Campeón Legendario', '🏆');

    const { data: progresos } = await supabase
      .from('progreso_usuarios')
      .select('racha_dias')
      .eq('usuario_id', user.id);

    if (progresos && progresos.length > 0) {
      const maxRacha = Math.max(...progresos.map(p => p.racha_dias || 0));
      if (maxRacha >= 2) await otorgarLogro('Dino Madrugador', '☀️');
      if (maxRacha >= 5) await otorgarLogro('Fuerza Volcánica', '🌋');
      if (maxRacha >= 10) await otorgarLogro('Corona Prehistórica', '👑');
    }
  };

  const otorgarLogro = async (nombre: string, icono: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from('logros_medallas')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('nombre_logro', nombre)
      .maybeSingle();

    if (!existing) {
      await supabase.from('logros_medallas').insert([{
        usuario_id: user.id,
        nombre_logro: nombre,
        icono,
        fecha_ganado: new Date().toISOString(),
      }]);
    }
  };

  // ✅ CAMBIO 3: avanzarOTerminar con completadosActualizados correcto
  const avanzarOTerminar = async (nuevasCorrectas: number, nuevoScore: number) => {
    const esUltima = currentQuestion === totalPreguntas - 1;
    if (esUltima) {
      const completadosActualizados = nivelesCompletados.includes(nivelActual)
        ? nivelesCompletados
        : [...nivelesCompletados, nivelActual];
      setNivelesCompletados(completadosActualizados);
      await guardarProgreso(nuevasCorrectas, nuevoScore, completadosActualizados);
      setVista("resultado");
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleAnswerFacil = (answer: string) => {
    if (showResult) return;
    const q = nivelesFacil[currentQuestion];
    setSelectedAnswer(answer);
    setShowResult(true);
    const correcto = answer === q.correct;
    setEsCorrecta(correcto);
    if (correcto) {
      const nuevoScore = score + 25;
      setScore(nuevoScore);
      const nuevasCorrectas = preguntasCorrectas + 1;
      setPreguntasCorrectas(nuevasCorrectas);

      let nuevaRacha = rachaDeletreo;
      if (erroresEnPalabra === 0) {
        nuevaRacha = rachaDeletreo + 1;
        setRachaDeletreo(nuevaRacha);
        if (nuevaRacha >= 5) otorgarLogro("Racha de Deletreo", "🎯");
      }
      setErroresEnPalabra(0);

      setTimeout(() => avanzarOTerminar(nuevasCorrectas, nuevoScore), 1500);
    } else {
      setErroresEnNivel(prev => prev + 1);
      setErroresEnPalabra(prev => prev + 1);
      setRachaDeletreo(0);
    }
  };

  const handleAnswerMedio = (letra: string) => {
    const q = nivelesMedio[currentQuestion];
    const hueco = q.blanks[huecoActual];
    const correcto = letra === hueco.correct;

    if (correcto) {
      const nuevasRespuestas = [...respuestasMedio];
      nuevasRespuestas[huecoActual] = letra;
      setRespuestasMedio(nuevasRespuestas);
      setMedioCorrectoParcial(true);
      setMedioError(false);

      setTimeout(() => {
        setMedioCorrectoParcial(false);
        const siguiente = huecoActual + 1;
        if (siguiente >= q.blanks.length) {
          const nuevoScore = score + 25;
          setScore(nuevoScore);
          const nuevasCorrectas = preguntasCorrectas + 1;
          setPreguntasCorrectas(nuevasCorrectas);

          let nuevaRacha = rachaDeletreo;
          if (erroresEnPalabra === 0) {
            nuevaRacha = rachaDeletreo + 1;
            setRachaDeletreo(nuevaRacha);
            if (nuevaRacha >= 5) otorgarLogro("Racha de Deletreo", "🎯");
          }
          setErroresEnPalabra(0);

          setTimeout(() => avanzarOTerminar(nuevasCorrectas, nuevoScore), 1000);
        } else {
          setHuecoActual(siguiente);
          setOpcionesMedioBarajadas(shuffleArr(q.blanks[siguiente].options));
        }
      }, 800);
    } else {
      // ✅ CAMBIO 2: mensaje dura más y baraja al desaparecer
      setMedioError(true);
      setErroresEnNivel(prev => prev + 1);
      setErroresEnPalabra(prev => prev + 1);
      setRachaDeletreo(0);

      setTimeout(() => {
        setMedioError(false);
        setOpcionesMedioBarajadas(shuffleArr(q.blanks[huecoActual].options));
      }, 1500);
    }
  };

  const handleColocarLetra = (item: { letra: string; id: number }) => {
    setLetrasDisponibles(prev => prev.filter(l => l.id !== item.id));
    setLetrasColocadas(prev => [...prev, item]);
  };

  const handleQuitarLetra = (item: { letra: string; id: number }) => {
    setLetrasColocadas(prev => prev.filter(l => l.id !== item.id));
    setLetrasDisponibles(prev => [...prev, item]);
  };

  const handleVerificarDificil = () => {
    const q = nivelesDificil[currentQuestion];
    const formada = letrasColocadas.map(l => l.letra).join("");
    const correcto = formada === q.word;
    setDificilResult(correcto ? "correcto" : "incorrecto");
    if (!correcto) {
      setPalabraIncorrecta(formada);
      setErroresEnNivel(prev => prev + 1);
      setErroresEnPalabra(prev => prev + 1);
      setRachaDeletreo(0);
    }
    if (correcto) {
      const nuevoScore = score + 25;
      setScore(nuevoScore);
      const nuevasCorrectas = preguntasCorrectas + 1;
      setPreguntasCorrectas(nuevasCorrectas);

      let nuevaRacha = rachaDeletreo;
      if (erroresEnPalabra === 0) {
        nuevaRacha = rachaDeletreo + 1;
        setRachaDeletreo(nuevaRacha);
        if (nuevaRacha >= 5) otorgarLogro("Racha de Deletreo", "🎯");
      }
      setErroresEnPalabra(0);

      setTimeout(() => avanzarOTerminar(nuevasCorrectas, nuevoScore), 1500);
    }
  };

  const handleReintentarDificil = () => {
    const q = nivelesDificil[currentQuestion];
    setLetrasDisponibles(shuffleArr(q.word.split("").map((l, i) => ({ letra: l, id: i }))));
    setLetrasColocadas([]);
    setDificilResult("idle");
    setPalabraIncorrecta("");
  };

  const nivelDesbloqueado = (nivel: Nivel) => {
    if (nivel === "facil") return true;
    if (nivel === "medio") return nivelesCompletados.includes("facil");
    if (nivel === "dificil") return nivelesCompletados.includes("medio");
    return false;
  };

  const siguienteNivel = (): Nivel | null => {
    if (nivelActual === "facil") return "medio";
    if (nivelActual === "medio") return "dificil";
    return null;
  };
  const sigNivel = siguienteNivel();

  const renderFacil = () => {
    const q = nivelesFacil[currentQuestion];
    return (
      <motion.div key={currentQuestion} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[28px] p-8 shadow-[0_8px_30px_rgba(107,33,168,0.15)]">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-[4.5rem] md:text-[6rem] mb-2 md:mb-4">{q.image}</div>
          <h2 className="font-['Fredoka_One',cursive] text-[2.2rem] md:text-[3rem] text-[#6B21A8] mb-1 md:mb-2 leading-tight">{q.word}</h2>
          <p className="text-gray-600 font-semibold text-[1rem] md:text-[1.1rem]">💡 Pista: {q.hint}</p>
        </div>
        <div className={`grid grid-cols-3 gap-4 mb-6 ${showResult && !esCorrecta ? "animate-bounce" : ""}`}>
          {opcionesBarajadas.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === q.correct;
            return (
              <motion.button key={option} onClick={() => handleAnswerFacil(option)} disabled={showResult}
                className={`py-6 md:py-8 rounded-2xl font-['Fredoka_One',cursive] text-[2.5rem] md:text-[3rem] transition-all ${
                  showResult && isSelected
                    ? isCorrect ? "bg-[#16A34A] text-white shadow-lg" : "bg-[#EF4444] text-white"
                    : showResult && isCorrect ? "bg-[#16A34A] text-white"
                    : "bg-[#FAF7F0] text-[#6B21A8] hover:bg-[#e9d5ff]"
                }`}
                whileHover={{ scale: showResult ? 1 : 1.05 }} whileTap={{ scale: showResult ? 1 : 0.95 }}>
                {option}
              </motion.button>
            );
          })}
        </div>
        {/* ✅ CAMBIO 1: sin botón, solo mensaje, reintento automático */}
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl text-center ${esCorrecta ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}>
            <p className={`font-['Fredoka_One',cursive] text-[1.5rem] ${esCorrecta ? "text-green-700" : "text-red-700"}`}>
              {esCorrecta ? `✓ ¡Correcto! Es la letra ${q.correct}` : "✗ ¡Casi! Inténtalo de nuevo 💪"}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderMedio = () => {
    const q = nivelesMedio[currentQuestion];
    return (
      <motion.div key={currentQuestion} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[28px] p-8 shadow-[0_8px_30px_rgba(107,33,168,0.15)]">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-[4.5rem] md:text-[6rem] mb-2 md:mb-4">{q.image}</div>
          <h2 className="font-['Fredoka_One',cursive] text-[1.8rem] md:text-[2.5rem] text-[#6B21A8] mb-2 leading-tight">
            {renderTemplate(q.template, respuestasMedio)}
          </h2>
          <p className="text-gray-600 font-semibold text-[1rem] md:text-[1.1rem]">💡 Pista: {q.hint}</p>
          <p className="text-[#F97316] font-bold mt-1 text-[0.9rem] md:text-[1rem]">
            Completa la letra {huecoActual + 1} de {q.blanks.length}
          </p>
        </div>
        <div className={`grid grid-cols-3 gap-4 mb-6 transition-all ${medioError ? "animate-bounce" : ""}`}>
          {opcionesMedioBarajadas.map((option) => (
            <motion.button key={option} onClick={() => handleAnswerMedio(option)}
              disabled={medioCorrectoParcial || medioError}
              className={`py-6 md:py-8 rounded-2xl font-['Fredoka_One',cursive] text-[2.5rem] md:text-[3rem] transition-all ${
                medioCorrectoParcial ? "bg-[#FAF7F0] text-[#6B21A8]"
                : medioError ? "bg-red-50 text-[#6B21A8]"
                : "bg-[#FAF7F0] text-[#6B21A8] hover:bg-[#e9d5ff]"
              }`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {option}
            </motion.button>
          ))}
        </div>
        {medioError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-2xl text-center bg-red-50 border-2 border-red-300">
            <p className="font-['Fredoka_One',cursive] text-[1.3rem] text-red-700">✗ Esa no es. ¡Intenta otra! 💪</p>
          </motion.div>
        )}
        {medioCorrectoParcial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-2xl text-center bg-green-50 border-2 border-green-300">
            <p className="font-['Fredoka_One',cursive] text-[1.3rem] text-green-700">✓ ¡Bien! Siguiente letra…</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderDificil = () => {
    const q = nivelesDificil[currentQuestion];
    const formada = letrasColocadas.map(l => l.letra).join("");
    return (
      <motion.div key={currentQuestion} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[28px] p-8 shadow-[0_8px_30px_rgba(107,33,168,0.15)]">
        <div className="text-center mb-5 md:mb-6">
          <div className="text-[5rem] md:text-[7rem] mb-1 md:mb-2">{q.image}</div>
          <p className="text-gray-500 font-semibold text-[0.95rem] md:text-[1rem]">¿Cómo se llama? Ordena las letras</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 min-h-[5rem] mb-6 p-4 bg-[#FAF7F0] rounded-2xl border-2 border-dashed border-[#c4b5fd]">
          {letrasColocadas.length === 0 && (
            <p className="text-gray-400 font-semibold self-center">Toca las letras de abajo para colocarlas aquí</p>
          )}
          {letrasColocadas.map((item) => (
            <motion.button key={item.id} onClick={() => handleQuitarLetra(item)}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-14 h-14 rounded-xl bg-[#6B21A8] text-white font-['Fredoka_One',cursive] text-[1.8rem] shadow-md">
              {item.letra}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {letrasDisponibles.map((item) => (
            <motion.button key={item.id} onClick={() => handleColocarLetra(item)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-xl bg-[#e9d5ff] text-[#6B21A8] font-['Fredoka_One',cursive] text-[1.8rem] shadow">
              {item.letra}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button onClick={handleReintentarDificil} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-['Fredoka_One',cursive] text-[1rem] px-6 py-3 rounded-xl">
            🔄 Limpiar
          </motion.button>
          <motion.button onClick={handleVerificarDificil}
            disabled={formada.length !== q.word.length || dificilResult === "correcto"}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`w-full sm:w-auto font-['Fredoka_One',cursive] text-[1rem] px-8 py-3 rounded-xl transition-all ${
              formada.length === q.word.length && dificilResult === "idle"
                ? "bg-[#6B21A8] hover:bg-[#7C3AED] text-white shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            ✓ Verificar
          </motion.button>
        </div>
        {dificilResult !== "idle" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-6 rounded-2xl text-center ${
              dificilResult === "correcto" ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"
            }`}>
            <p className={`font-['Fredoka_One',cursive] text-[1.5rem] ${
              dificilResult === "correcto" ? "text-green-700" : "text-red-700"
            }`}>
              {dificilResult === "correcto"
                ? `✓ ¡Correcto! La palabra es ${q.word} 🎉`
                : `✗ Casi… la palabra formada es "${palabraIncorrecta}". ¡Inténtalo de nuevo! 💪`}
            </p>
            {dificilResult === "incorrecto" && (
              <motion.button onClick={handleReintentarDificil} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="mt-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Fredoka_One',cursive] text-[1.1rem] px-8 py-3 rounded-xl">
                🔄 Intentar de nuevo
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
      <DinoLettersBg />
      <header className="bg-white shadow-[0_2px_12px_rgba(107,33,168,0.10)] px-2 sm:px-4 md:px-8 py-3 md:py-4 relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-y-2 gap-x-2 md:gap-3">
          <Link to="/dashboard/nino" className="flex items-center gap-1 md:gap-2 no-underline shrink-0">
            <span className="text-[1.3rem] md:text-[2rem]">🦕</span>
            <span className="font-['Fredoka_One',cursive] text-[1.1rem] md:text-[1.5rem] text-[#6B21A8] tracking-tight md:tracking-normal">
              LETRA<span className="text-[#16A34A]">SAURIO</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 shrink-0">
            <div className="bg-[#FACC15] px-3 md:px-6 py-1 md:py-2 rounded-full flex items-center gap-1">
              <span className="font-['Fredoka_One',cursive] text-[0.85rem] md:text-[1.2rem] text-[#3B0764]">⭐ {score} pts</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {vista !== "menu" && (
                <button onClick={() => setVista("menu")} className="flex items-center justify-center bg-white border-2 border-[#6B21A8] text-[#6B21A8] font-bold hover:bg-[#6B21A8] hover:text-white transition-colors text-[0.75rem] md:text-[0.9rem] px-3 py-1 md:px-4 md:py-1.5 rounded-full">
                  ← Niveles
                </button>
              )}
              <Link to="/dashboard/nino" className="flex items-center justify-center bg-white border-2 border-[#6B21A8] text-[#6B21A8] font-bold hover:bg-[#6B21A8] hover:text-white transition-colors no-underline text-[0.75rem] md:text-[0.9rem] px-3 py-1 md:px-4 md:py-1.5 rounded-full">
                Inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-12 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] md:text-[2.5rem] text-[#3B0764] mb-2 md:mb-3">✍️ Desafíos de Ortografía</h1>
          <p className="text-[1rem] md:text-[1.1rem] text-gray-700 font-semibold px-2">Completa las palabras con la letra correcta</p>
        </div>

        <AnimatePresence mode="wait">
          {vista === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {(Object.keys(nivelConfig) as Nivel[]).map((nivel) => {
                  const info = nivelConfig[nivel];
                  const desbloqueado = nivelDesbloqueado(nivel);
                  const completado = nivelesCompletados.includes(nivel);
                  return (
                    <motion.button key={nivel} onClick={() => desbloqueado && iniciarNivel(nivel)}
                      disabled={!desbloqueado} whileHover={{ scale: desbloqueado ? 1.05 : 1 }}
                      whileTap={{ scale: desbloqueado ? 0.95 : 1 }}
                      className={`relative rounded-[20px] md:rounded-[24px] p-6 md:p-8 text-center shadow-[0_4px_20px_rgba(107,33,168,0.15)] transition-all flex flex-col md:block items-center sm:flex-row sm:text-left md:text-center ${
                        desbloqueado ? `bg-gradient-to-br ${info.color} text-white cursor-pointer` : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}>
                      {completado && <div className="absolute top-3 right-3 bg-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[0.8rem] md:text-[1rem]">✅</div>}
                      {!desbloqueado && <div className="absolute top-3 right-3 text-[1.2rem] md:text-[1.5rem]">🔒</div>}
                      <div className="text-[3.5rem] md:text-[4rem] mb-2 md:mb-3 shrink-0 sm:mr-4 md:mr-0">{info.emoji}</div>
                      <div>
                        <h3 className="font-['Fredoka_One',cursive] text-[1.5rem] md:text-[1.8rem] mb-1 md:mb-2">{info.label}</h3>
                        <p className={`text-[0.85rem] md:text-[0.9rem] font-semibold mb-2 md:mb-3 leading-tight ${desbloqueado ? "opacity-90" : "text-gray-400"}`}>{info.descripcion}</p>
                        {!desbloqueado && <p className="text-[0.75rem] md:text-[0.8rem] font-bold text-gray-500 mt-1 md:mt-2">Completa el nivel anterior</p>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {nivelesCompletados.length > 0 && (
                <div className="mt-6 md:mt-8 bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
                  <h3 className="font-['Fredoka_One',cursive] text-[1.1rem] md:text-[1.3rem] text-[#6B21A8] mb-2 md:mb-3 text-center">Tu progreso</h3>
                  <div className="bg-gray-200 rounded-full h-3 md:h-4">
                    <div className="bg-gradient-to-r from-[#16A34A] to-[#4ADE80] rounded-full h-3 md:h-4 transition-all duration-500"
                      style={{ width: `${(nivelesCompletados.length / 3) * 100}%` }} />
                  </div>
                  <p className="text-center text-gray-600 font-semibold mt-2 text-[0.85rem] md:text-[1rem]">{nivelesCompletados.length} de 3 niveles completados</p>
                </div>
              )}
            </motion.div>
          )}

          {vista === "jugando" && (
            <motion.div key="jugando" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shadow-[0_2px_12px_rgba(107,33,168,0.06)]">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-1 text-center sm:text-left">
                  <span className="font-bold text-gray-700 text-[0.8rem] md:text-[1rem]">
                    {nivelConfig[nivelActual].emoji} Nivel {nivelConfig[nivelActual].label} — Pregunta {currentQuestion + 1} de {totalPreguntas}
                  </span>
                  <span className="font-bold text-[#6B21A8] text-[0.85rem] md:text-[1rem]">{Math.round(((currentQuestion + 1) / totalPreguntas) * 100)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 md:h-3">
                  <motion.div className={`bg-gradient-to-r ${nivelConfig[nivelActual].color} rounded-full h-2 md:h-3`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / totalPreguntas) * 100}%` }}
                    transition={{ duration: 0.5 }} />
                </div>
              </div>
              {nivelActual === "facil"   && renderFacil()}
              {nivelActual === "medio"   && renderMedio()}
              {nivelActual === "dificil" && renderDificil()}
            </motion.div>
          )}

          {vista === "resultado" && (
            <motion.div key="resultado" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className={`bg-gradient-to-br ${nivelConfig[nivelActual].color} text-white rounded-[24px] md:rounded-[28px] p-6 md:p-12 shadow-[0_8px_30px_rgba(22,163,74,0.3)] text-center`}>
              <div className="text-[4.5rem] md:text-[6rem] mb-3 md:mb-4 leading-none">
                {preguntasCorrectas === totalPreguntas ? "🏆" : preguntasCorrectas >= totalPreguntas * 0.7 ? "🌟" : "💪"}
              </div>
              <h2 className="font-['Fredoka_One',cursive] text-[1.8rem] md:text-[2.5rem] mb-2 md:mb-4">
                {preguntasCorrectas === totalPreguntas ? "¡Perfecto!" : "¡Nivel completado!"}
              </h2>
              <p className="text-[1.1rem] md:text-[1.5rem] font-bold mb-1 md:mb-2 leading-tight">{preguntasCorrectas} de {totalPreguntas} respuestas correctas</p>
              <p className="text-[0.95rem] md:text-[1.2rem] font-semibold mb-6 md:mb-8 opacity-90 leading-tight px-2">
                {preguntasCorrectas === totalPreguntas ? "🌟 ¡Dominaste todas las palabras!"
                  : preguntasCorrectas >= totalPreguntas * 0.7 ? "👍 ¡Muy bien! Sigue practicando"
                  : "💪 Buen intento. ¡Puedes mejorar!"}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center">
                <button onClick={() => iniciarNivel(nivelActual)}
                  className="w-full sm:w-auto bg-white/25 hover:bg-white/40 text-white font-['Fredoka_One',cursive] text-[0.95rem] md:text-[1.1rem] px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-white/50">
                  🔄 Reintentar
                </button>
                {sigNivel && (
                  <button onClick={() => iniciarNivel(sigNivel)}
                    className="w-full sm:w-auto bg-white text-[#6B21A8] hover:bg-gray-100 font-['Fredoka_One',cursive] text-[0.95rem] md:text-[1.1rem] px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg">
                    ➡️ Sig. nivel: {nivelConfig[sigNivel].label}
                  </button>
                )}
                <Link to="/dashboard/nino"
                  className="w-full sm:w-auto bg-white/25 hover:bg-white/40 text-white font-['Fredoka_One',cursive] text-[0.95rem] md:text-[1.1rem] px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-white/50 no-underline inline-block">
                  🏠 Inicio
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}