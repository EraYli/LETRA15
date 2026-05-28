import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../../supabaseClient";
import DinoLettersBg from "../../components/DinoLettersBg";

interface LetraData {
  letter: string;
  sound: string;
  palabras: { word: string; image: string }[];
}

const letrasData: LetraData[] = [
  { letter: "A", sound: "/A/", palabras: [{ word: "Araña", image: "🕷️" }, { word: "Avión", image: "✈️" }, { word: "Árbol", image: "🌳" }, { word: "Abeja", image: "🐝" }, { word: "Agua", image: "💧" }] },
  { letter: "B", sound: "/BE/", palabras: [{ word: "Burro", image: "🫏" }, { word: "Bote", image: "⛵" }, { word: "Boca", image: "👄" }, { word: "Bebé", image: "👶" }, { word: "Ballena", image: "🐋" }] },
  { letter: "C", sound: "/CE/", palabras: [{ word: "Casa", image: "🏠" }, { word: "Carro", image: "🚗" }, { word: "Conejo", image: "🐰" }, { word: "Camello", image: "🐪" }, { word: "Cangrejo", image: "🦀" }] },
  { letter: "D", sound: "/DE/", palabras: [{ word: "Diente", image: "🦷" }, { word: "Delfín", image: "🐬" }, { word: "Dinosaurio", image: "🦕" }, { word: "Dado", image: "🎲" }, { word: "Durazno", image: "🍑" }] },
  { letter: "E", sound: "/E/", palabras: [{ word: "Elefante", image: "🐘" }, { word: "Estrella", image: "⭐" }, { word: "Escalera", image: "🪜" }, { word: "Escuela", image: "🏫" }, { word: "Espejo", image: "🪞" }] },
  { letter: "F", sound: "/EFE/", palabras: [{ word: "Flor", image: "🌸" }, { word: "Fresa", image: "🍓" }, { word: "Foca", image: "🦭" }, { word: "Fuego", image: "🔥" }, { word: "Fantasma", image: "👻" }] },
  { letter: "G", sound: "/GE/", palabras: [{ word: "Gato", image: "🐱" }, { word: "Gallina", image: "🐔" }, { word: "Globo", image: "🎈" }, { word: "Gorila", image: "🦍" }, { word: "Guitarra", image: "🎸" }] },
  { letter: "H", sound: "HACHE", palabras: [{ word: "Helado", image: "🍦" }, { word: "Hormiga", image: "🐜" }, { word: "Hoja", image: "🍃" }, { word: "Huevo", image: "🥚" }, { word: "Hamster", image: "🐹" }] },
  { letter: "I", sound: "/I/", palabras: [{ word: "Isla", image: "🏝️" }, { word: "Iguana", image: "🦎" }, { word: "Iglú", image: "🏠" }, { word: "Imán", image: "🧲" }, { word: "Insecto", image: "🐛" }] },
  { letter: "J", sound: "/JOTA/", palabras: [{ word: "Jirafa", image: "🦒" }, { word: "Jaguar", image: "🐆" }, { word: "Jamón", image: "🍖" }, { word: "Jardín", image: "🌻" }, { word: "Jugo", image: "🧃" }] },
  { letter: "K", sound: "/KA/", palabras: [{ word: "Kiwi", image: "🥝" }, { word: "Koala", image: "🐨" }, { word: "Kayak", image: "🛶" }, { word: "Kimono", image: "👘" }, { word: "Karate", image: "🥋" }] },
  { letter: "L", sound: "/ELE/", palabras: [{ word: "León", image: "🦁" }, { word: "Luna", image: "🌙" }, { word: "Libro", image: "📚" }, { word: "Llave", image: "🔑" }, { word: "Limón", image: "🍋" }] },
  { letter: "M", sound: "/EME/", palabras: [{ word: "Mariposa", image: "🦋" }, { word: "Mono", image: "🐒" }, { word: "Manzana", image: "🍎" }, { word: "Música", image: "🎵" }, { word: "Montaña", image: "⛰️" }] },
  { letter: "N", sound: "/ENE/", palabras: [{ word: "Nube", image: "☁️" }, { word: "Naranja", image: "🍊" }, { word: "Nave", image: "🚀" }, { word: "Niño", image: "🧒" }, { word: "Nido", image: "🪺" }] },
  { letter: "Ñ", sound: "/EÑE/", palabras: [{ word: "Ñoño", image: "😊" }, { word: "Ñame", image: "🌿" }, { word: "Ñandú", image: "🦜" }, { word: "Ñoqui", image: "🍝" }, { word: "Ñu", image: "🐃" }] },
  { letter: "O", sound: "/O/", palabras: [{ word: "Oso", image: "🐻" }, { word: "Oveja", image: "🐑" }, { word: "Orca", image: "🐋" }, { word: "Ojo", image: "👁️" }, { word: "Oruga", image: "🐛" }] },
  { letter: "P", sound: "/PE/", palabras: [{ word: "Pato", image: "🦆" }, { word: "Perro", image: "🐶" }, { word: "Pingüino", image: "🐧" }, { word: "Pizza", image: "🍕" }, { word: "Pulpo", image: "🐙" }] },
  { letter: "Q", sound: "/CU/", palabras: [{ word: "Queso", image: "🧀" }, { word: "Quetzal", image: "🦜" }, { word: "Queque", image: "🎂" }, { word: "Quilate", image: "💎" }, { word: "Quinua", image: "🌾" }] },
  { letter: "R", sound: "/ERRE/", palabras: [{ word: "Rana", image: "🐸" }, { word: "Ratón", image: "🐭" }, { word: "Robot", image: "🤖" }, { word: "Rosa", image: "🌹" }, { word: "Rayo", image: "⚡" }] },
  { letter: "S", sound: "/ESE/", palabras: [{ word: "Sol", image: "☀️" }, { word: "Serpiente", image: "🐍" }, { word: "Sandía", image: "🍉" }, { word: "Silla", image: "🪑" }, { word: "Sapo", image: "🐸" }] },
  { letter: "T", sound: "/TE/", palabras: [{ word: "Tigre", image: "🐯" }, { word: "Tren", image: "🚂" }, { word: "Tortuga", image: "🐢" }, { word: "Tomate", image: "🍅" }, { word: "Tulipán", image: "🌷" }] },
  { letter: "U", sound: "/U/", palabras: [{ word: "Uva", image: "🍇" }, { word: "Unicornio", image: "🦄" }, { word: "Urraca", image: "🐦" }, { word: "Uniforme", image: "👕" }, { word: "Urso", image: "🐻" }] },
  { letter: "V", sound: "/UVE/", palabras: [{ word: "Vaca", image: "🐄" }, { word: "Volcán", image: "🌋" }, { word: "Violín", image: "🎻" }, { word: "Ventana", image: "🪟" }, { word: "Venado", image: "🦌" }] },
  { letter: "W", sound: "/DOBLE U/", palabras: [{ word: "Waffle", image: "🧇" }, { word: "Wifi", image: "📶" }, { word: "Wombat", image: "🐾" }, { word: "Water", image: "💧" }, { word: "Windsurf", image: "🏄" }] },
  { letter: "X", sound: "/EQUIS/", palabras: [{ word: "Xilófono", image: "🎼" }, { word: "Xenón", image: "✨" }, { word: "Xoloitzcuintle", image: "🐕" }, { word: "Xavier", image: "👦" }, { word: "Xochitl", image: "🌸" }] },
  { letter: "Y", sound: "/YE/", palabras: [{ word: "Yoyo", image: "🪀" }, { word: "Yate", image: "⛵" }, { word: "Yogurt", image: "🥛" }, { word: "Yegua", image: "🐴" }, { word: "Yerba", image: "🌿" }] },
  { letter: "Z", sound: "/ZETA/", palabras: [{ word: "Zorro", image: "🦊" }, { word: "Zapato", image: "👟" }, { word: "Zebra", image: "🦓" }, { word: "Zanahoria", image: "🥕" }, { word: "Zopilote", image: "🦅" }] },
];

export default function JuegoLetras() {
  const { user } = useAuth();
  const [selectedLetter, setSelectedLetter] = useState<LetraData | null>(null);
  const [selectedPalabra, setSelectedPalabra] = useState<{ word: string; image: string } | null>(null);
  const [letrasAprendidas, setLetrasAprendidas] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moduloId, setModuloId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProgreso = async () => {
      const { data: modulo } = await supabase
        .from('modulos')
        .select('id')
        .eq('titulo', 'Juego de Letras')
        .single();

      if (modulo) {
        setModuloId(modulo.id);
        const { data: progreso } = await supabase
          .from('progreso_usuarios')
          .select('letras_dominadas, puntuacion_total')
          .eq('usuario_id', user.id)
          .eq('modulo_id', modulo.id)
          .single();

        if (progreso) {
          setLetrasAprendidas(progreso.letras_dominadas || []);
          setScore(progreso.puntuacion_total || 0);
        }
      }
    };
    fetchProgreso();
  }, [user]);

  const hablar = (texto: string): Promise<void> => {
    return new Promise((resolve) => {
      // Timeout de seguridad por si falla la API de voz
      const safetyTimeout = setTimeout(() => {
        resolve();
      }, 2500);

      const finish = () => {
        clearTimeout(safetyTimeout);
        resolve();
      };

      const rv = (window as any).responsiveVoice;
      if (rv && rv.voiceSupport()) {
        rv.cancel();
        rv.speak(texto, "Spanish Latin American Female", {
          rate: 0.9,
          pitch: 1.1,
          onend: finish,
          onerror: finish
        });
      } else {
        window.speechSynthesis?.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = "es-MX";
        u.rate = 0.9;
        u.pitch = 1.1;
        u.onend = finish;
        u.onerror = finish;
        window.speechSynthesis?.speak(u);
      }
    });
  };

  const handleLetterClick = async (letra: LetraData) => {
    if (isAudioPlaying) return;

    setIsAudioPlaying(true);

    if (selectedLetter?.letter !== letra.letter) {
      // Ocultar tarjeta actual si existe para dar paso a la nueva
      setSelectedLetter(null);
      setSelectedPalabra(null);

      // Esperar a que se escuche el sonido de la letra
      await hablar(letra.letter);

      // Aparecer la tarjeta después del sonido
      setSelectedLetter(letra);
      setSelectedPalabra(letra.palabras[0]);
    } else {
      // Si ya es la letra actual, solo repetimos el sonido
      await hablar(letra.letter);
    }

    setIsAudioPlaying(false);
  };

  const handlePalabraClick = async (palabra: { word: string; image: string }) => {
    if (isAudioPlaying) return;
    setIsAudioPlaying(true);
    setSelectedPalabra(palabra);
    await hablar(palabra.word);
    setIsAudioPlaying(false);
  };

  const handleLetraAprendida = async () => {
    if (!selectedLetter || !user || !moduloId) return;
    if (letrasAprendidas.includes(selectedLetter.letter)) return;

    const nuevasLetras = [...letrasAprendidas, selectedLetter.letter];
    const nuevoScore = score + 10;

    setLetrasAprendidas(nuevasLetras);
    setScore(nuevoScore);
    hablar(`¡Muy bien! Aprendiste la letra ${selectedLetter.letter}`);

    const { data: existing } = await supabase
      .from('progreso_usuarios')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('modulo_id', moduloId)
      .single();

    if (existing) {
      await supabase
        .from('progreso_usuarios')
        .update({
          letras_dominadas: nuevasLetras,
          puntuacion_total: nuevoScore,
          ultima_conexion: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('progreso_usuarios')
        .insert([{
          usuario_id: user.id,
          modulo_id: moduloId,
          letras_dominadas: nuevasLetras,
          puntuacion_total: nuevoScore,
          ultima_conexion: new Date().toISOString(),
        }]);
    }

    if (nuevasLetras.length === 1) {
      await otorgarLogro('¡Cascarón Roto!', '🥚');
    }
    const vocales = ["A", "E", "I", "O", "U"];
    const tieneVocales = vocales.every(v => nuevasLetras.includes(v));
    if (tieneVocales) {
      await otorgarLogro('Explorador de Vocales', '🅰️');
    }
    if (nuevasLetras.length >= 14) {
      await otorgarLogro('Paso de Gigante', '🦕');
    }
    const consonantes = nuevasLetras.filter(l => !vocales.includes(l));
    if (consonantes.length >= 10) {
      await otorgarLogro('Rey de las Consonantes', '🦁');
    }
    if (nuevasLetras.length === 27) {
      await otorgarLogro('¡Rex del Abecedario!', '🦖');
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

  const yaAprendida = selectedLetter ? letrasAprendidas.includes(selectedLetter.letter) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
      <DinoLettersBg />

      {/* Header */}
      <header className="bg-white shadow-[0_2px_12px_rgba(107,33,168,0.10)] px-1.5 sm:px-4 md:px-8 py-2 md:py-4 relative z-10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-1 md:gap-3">
          <Link to="/dashboard/nino" className="flex items-center gap-0.5 sm:gap-1 md:gap-2 no-underline shrink-0">
            <span className="text-[1.1rem] sm:text-[1.3rem] md:text-[2rem]">🦕</span>
            <span className="font-['Fredoka_One',cursive] text-[0.85rem] sm:text-[1.1rem] md:text-[1.5rem] text-[#6B21A8] tracking-tighter sm:tracking-tight md:tracking-normal">
              LETRA<span className="text-[#16A34A]">SAURIO</span>
            </span>
          </Link>
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4 shrink-0">
            <div className="bg-[#FACC15] px-1.5 sm:px-3 md:px-6 py-0.5 sm:py-1 md:py-2 rounded-full flex items-center gap-0.5 sm:gap-1">
              <span className="font-['Fredoka_One',cursive] text-[0.7rem] sm:text-[0.85rem] md:text-[1.2rem] text-[#3B0764]">⭐ {score} pts</span>
            </div>
            <Link to="/dashboard/nino" className="flex items-center justify-center bg-white border sm:border-2 border-[#6B21A8] text-[#6B21A8] font-bold hover:bg-[#6B21A8] hover:text-white transition-colors no-underline text-[0.65rem] sm:text-[0.75rem] md:text-[0.9rem] px-1.5 sm:px-3 py-0.5 sm:py-1 md:px-4 md:py-1.5 rounded-full whitespace-nowrap">
              ← Inicio
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-12 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-['Fredoka_One',cursive] text-[2rem] md:text-[2.5rem] text-[#3B0764] mb-2 md:mb-3">
            🔤 Juego de Letras
          </h1>
          <p className="text-[1rem] md:text-[1.1rem] text-gray-700 font-semibold px-2">
            Haz clic en una letra para aprender su sonido y palabras
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Grid de letras */}
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
            <h2 className="font-['Fredoka_One',cursive] text-[1.3rem] md:text-[1.5rem] text-[#6B21A8] mb-4 text-center">
              Selecciona una letra
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {letrasData.map((item) => {
                const aprendida = letrasAprendidas.includes(item.letter);
                return (
                  <motion.button
                    key={item.letter}
                    onClick={() => handleLetterClick(item)}
                    disabled={isAudioPlaying}
                    className={`aspect-square rounded-xl md:rounded-2xl font-['Fredoka_One',cursive] text-[1.2rem] md:text-[1.5rem] transition-all flex items-center justify-center ${selectedLetter?.letter === item.letter
                      ? "bg-[#6B21A8] text-white shadow-lg"
                      : aprendida
                        ? "bg-[#16A34A] text-white"
                        : "bg-[#FAF7F0] text-[#6B21A8] hover:bg-[#e9d5ff]"
                      } ${isAudioPlaying ? 'opacity-70 cursor-not-allowed' : ''}`}
                    whileHover={!isAudioPlaying ? { scale: 1.05 } : {}}
                    whileTap={!isAudioPlaying ? { scale: 0.95 } : {}}
                  >
                    {item.letter}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-center text-gray-500 font-semibold mt-4 text-[0.8rem] md:text-[0.85rem]">
              🟢 Verde = letra aprendida
            </p>
          </div>

          {/* Detalle de letra */}
          <div>
            <AnimatePresence mode="wait">
              {selectedLetter ? (
                <motion.div
                  key={selectedLetter.letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(107,33,168,0.2)]"
                >
                  <div className="text-center mb-5 md:mb-6">
                    <div className="font-['Fredoka_One',cursive] text-[5rem] md:text-[7rem] leading-none mb-1 md:mb-2">
                      {selectedLetter.letter}
                    </div>
                    {selectedLetter.sound && (
                      <p className="text-[1rem] md:text-[1.2rem] font-bold opacity-90">
                        Sonido: {selectedLetter.sound}
                      </p>
                    )}
                  </div>

                  <p className="text-center text-white/80 font-semibold text-[0.85rem] md:text-[0.95rem] mb-3 md:mb-4">
                    👆 Toca una imagen para escuchar la palabra
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5 md:mb-6">
                    {selectedLetter.palabras.map((p) => (
                      <motion.button
                        key={p.word}
                        onClick={() => handlePalabraClick(p)}
                        disabled={isAudioPlaying}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all ${selectedPalabra?.word === p.word
                          ? "bg-white/40 scale-105"
                          : "bg-white/15 hover:bg-white/30"
                          } ${isAudioPlaying ? 'cursor-not-allowed opacity-80' : ''}`}
                        whileTap={!isAudioPlaying ? { scale: 0.95 } : {}}
                      >
                        <span className="text-[1.8rem] md:text-[2rem] leading-tight">{p.image}</span>
                        <span className="text-[0.65rem] md:text-[0.7rem] font-bold mt-1 text-center w-full truncate">{p.word}</span>
                      </motion.button>
                    ))}
                  </div>

                  {selectedPalabra && (
                    <div className="bg-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 mb-5 md:mb-6 text-center">
                      <p className="font-['Fredoka_One',cursive] text-[1.2rem] md:text-[1.5rem] flex items-center justify-center gap-2">
                        <span>{selectedPalabra.image}</span> <span>{selectedPalabra.word}</span>
                      </p>
                      <p className="font-semibold opacity-90 mt-1 text-[0.85rem] md:text-[1rem]">
                        comienza con la letra <strong>{selectedLetter.letter}</strong>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleLetraAprendida}
                      disabled={yaAprendida}
                      className={`w-full font-['Fredoka_One',cursive] py-3 rounded-xl transition-all text-[0.95rem] md:text-[1rem] ${yaAprendida
                        ? "bg-[#16A34A] text-white cursor-default"
                        : "bg-[#FACC15] hover:bg-[#FDE68A] text-[#3B0764]"
                        }`}
                    >
                      {yaAprendida ? "✅ Aprendida" : "✓ Letra aprendida"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)] h-full min-h-[300px] flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-[4rem] md:text-[6rem] mb-3 md:mb-4">🦖</div>
                    <p className="text-gray-600 font-bold text-[1rem] md:text-[1.2rem]">
                      Selecciona una letra para comenzar
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-6 md:mt-8 bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3 md:mb-4 gap-2 text-center sm:text-left">
            <h3 className="font-['Fredoka_One',cursive] text-[1.1rem] md:text-[1.3rem] text-[#6B21A8]">
              Tu progreso
            </h3>
            <span className="font-bold text-gray-700 text-[0.9rem] md:text-[1rem]">
              {letrasAprendidas.length} / {letrasData.length} letras aprendidas
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 md:h-4">
            <div
              className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full h-3 md:h-4 transition-all duration-500"
              style={{ width: `${(letrasAprendidas.length / letrasData.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}