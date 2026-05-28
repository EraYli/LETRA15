import { Link } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";

const GAMES = [
  {
    id: "juego-letras",
    icon: "🔤",
    emoji2: "🦖",
    title: "Juego de Letras",
    tagline: "¡Descubre el mundo de los sonidos!",
    description:
      "Asocia letras con imágenes y sonidos en actividades interactivas diseñadas para facilitar el aprendizaje fonético y visual. ¡Cada letra es una nueva aventura!",
    gradient: "from-[#7C3AED] to-[#A855F7]",
    glowColor: "rgba(124,58,237,0.35)",
    badge: "Fonética",
    badgeBg: "bg-purple-100 text-purple-700",
    link: "/juego-letras",
    features: ["27 letras del alfabeto", "Sonidos y palabras", "Animaciones divertidas"],
    stars: 5,
    difficulty: "Fácil",
    difficultyColor: "text-green-600",
    age: "4–7 años",
  },
  {
    id: "desafios-ortografia",
    icon: "✍️",
    emoji2: "🐉",
    title: "Desafíos de Ortografía",
    tagline: "¡Completa palabras como un campeón!",
    description:
      "Ejercicios progresivos para completar palabras, seleccionar grafías correctas y dictados con retroalimentación inmediata. Cada desafío superado te hace más fuerte.",
    gradient: "from-[#16A34A] to-[#4ADE80]",
    glowColor: "rgba(22,163,74,0.35)",
    badge: "Ortografía",
    badgeBg: "bg-green-100 text-green-700",
    link: "/desafios-ortografia",
    features: ["Completar palabras", "Retroalimentación al instante", "Niveles progresivos"],
    stars: 4,
    difficulty: "Medio",
    difficultyColor: "text-yellow-600",
    age: "5–8 años",
  },
  {
    id: "mi-progreso",
    icon: "🏆",
    emoji2: "🌟",
    title: "Panel de Progreso",
    tagline: "¡Celebra tus logros y medallas!",
    description:
      "Tablero personalizado con letras dominadas, logros obtenidos, medallas y tu nivel actual. Visualiza cuánto has aprendido y qué más puedes conquistar.",
    gradient: "from-[#F97316] to-[#FACC15]",
    glowColor: "rgba(249,115,22,0.35)",
    badge: "Progreso",
    badgeBg: "bg-orange-100 text-orange-700",
    link: "/mi-progreso",
    features: ["Medallas y logros", "Letras dominadas", "Nivel de desempeño"],
    stars: 5,
    difficulty: "Todos",
    difficultyColor: "text-blue-600",
    age: "4–8 años",
  },
];

const TIPS = [
  { icon: "⏰", text: "Practica 15 minutos al día para mejores resultados" },
  { icon: "🌟", text: "Gana estrellas completando todas las actividades de cada letra" },
  { icon: "🎯", text: "Intenta alcanzar el 100% en cada módulo antes de pasar al siguiente" },
  { icon: "🏅", text: "Colecciona medallas por racha de días consecutivos" },
];

export default function Games() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3B0764] via-[#6B21A8] to-[#7C3AED] py-12 sm:py-20 px-4 sm:px-6 text-white">
        {/* decorative circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 w-96 h-96 rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10">
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block bg-[#FACC15] text-[#3B0764] font-extrabold text-[0.8rem] md:text-sm px-3 md:px-4 py-1 rounded-full mb-4 md:mb-5 tracking-wider uppercase">
                  🎮 Zona de Juegos
                </span>
                <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] sm:text-[2.2rem] md:text-[clamp(2.4rem,5vw,3.8rem)] leading-tight mb-3 md:mb-4">
                  ¡Elige tu<br />
                  <span className="text-[#FACC15]">aventura</span> y juega!
                </h1>
                <p className="text-[0.95rem] md:text-[1.05rem] font-semibold opacity-90 max-w-[460px] leading-relaxed mb-6 md:mb-8 mx-auto md:mx-0">
                  Tres módulos educativos diseñados especialmente para que aprender a leer y escribir sea la actividad más divertida del día.
                </p>
                <Link
                  to="/registro"
                  className="inline-flex items-center gap-2 bg-[#FACC15] text-[#3B0764] font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] px-6 md:px-8 py-3.5 md:py-4 rounded-[40px] no-underline shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-transform"
                >
                  🐾 ¡Comenzar gratis!
                </Link>
              </motion.div>
            </div>

            {/* floating dino + letters */}
            <motion.div
              className="relative flex-shrink-0 flex items-center justify-center w-[180px] h-[180px] md:w-64 md:h-64 mt-4 md:mt-0"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[7rem] md:text-[9rem] filter drop-shadow-[4px_8px_12px_rgba(0,0,0,0.25)]">🦖</span>
              {[
                { letter: "A", color: "#EF4444", top: "-10px", left: "-20px", delay: 0 },
                { letter: "B", color: "#3B82F6", top: "40px", right: "-30px", delay: 0.8 },
                { letter: "Z", color: "#F97316", bottom: "20px", left: "-40px", delay: 1.5 },
              ].map(({ letter, color, delay, ...pos }) => (
                <motion.span
                  key={letter}
                  className="absolute font-['Fredoka_One',cursive] text-[2.2rem] md:text-[2.8rem] filter drop-shadow-[2px_4px_6px_rgba(0,0,0,0.25)]"
                  style={{ color, ...pos } as React.CSSProperties}
                  animate={{ y: [0, -10, 0], rotate: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* quick stats */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { number: "3", label: "Módulos de juego" },
              { number: "27", label: "Letras del alfabeto" },
              { number: "100%", label: "Gratuito" },
              { number: "4–8", label: "Años de edad" },
            ].map(({ number, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                <span className="font-['Fredoka_One',cursive] text-[2.2rem] text-[#FACC15] block leading-none">
                  {number}
                </span>
                <span className="text-[0.82rem] font-bold opacity-85 mt-1 block">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Game Cards ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-['Fredoka_One',cursive] text-[1.6rem] sm:text-[2.2rem] text-[#3B0764] flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-[#16A34A]">✨</span> Nuestros módulos educativos <span className="text-[#16A34A]">✨</span>
            </h2>
            <p className="text-gray-600 font-semibold mt-2 text-[0.95rem] sm:text-[1rem]">
              Cada módulo está pensado para un aspecto diferente de la lectoescritura
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                onHoverStart={() => setHoveredGame(game.id)}
                onHoverEnd={() => setHoveredGame(null)}
                className="group relative"
              >
                <div
                  className="bg-white rounded-[28px] overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-current"
                  style={{
                    boxShadow:
                      hoveredGame === game.id
                        ? `0 20px 60px ${game.glowColor}, 0 4px 20px rgba(0,0,0,0.06)`
                        : "0 4px 20px rgba(107,33,168,0.08)",
                  }}
                >
                  {/* colored header */}
                  <div className={`bg-gradient-to-br ${game.gradient} p-8 relative overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[4rem] filter drop-shadow-[2px_4px_6px_rgba(0,0,0,0.2)]">
                        {game.icon}
                      </span>
                      <motion.span
                        className="text-[3rem] opacity-60"
                        animate={
                          hoveredGame === game.id
                            ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
                            : {}
                        }
                        transition={{ duration: 0.6 }}
                      >
                        {game.emoji2}
                      </motion.span>
                    </div>
                    <h3 className="font-['Fredoka_One',cursive] text-white text-[1.55rem] mt-4 leading-tight">
                      {game.title}
                    </h3>
                    <p className="text-white/80 text-[0.88rem] font-bold mt-1">{game.tagline}</p>
                  </div>

                  {/* body */}
                  <div className="p-6">
                    <p className="text-gray-600 font-semibold text-[0.93rem] leading-relaxed mb-5">
                      {game.description}
                    </p>

                    {/* feature list */}
                    <ul className="space-y-2 mb-5">
                      {game.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[0.88rem] text-gray-700 font-semibold">
                          <span className="text-[#16A34A] text-[1rem]">✓</span> {f}
                        </li>
                      ))}
                    </ul>

                    {/* meta row */}
                    <div className="flex items-center justify-between text-[0.82rem] font-bold text-gray-500 mb-6 border-t border-gray-100 pt-4">
                      <span>🎂 {game.age}</span>
                      <span className={game.difficultyColor}>● {game.difficulty}</span>
                      <span>{"⭐".repeat(game.stars)}</span>
                    </div>

                    <Link
                      to={game.link}
                      className={`block text-center bg-gradient-to-r ${game.gradient} text-white font-['Fredoka_One',cursive] text-[1rem] py-3 rounded-2xl no-underline shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-transform`}
                    >
                      ¡Jugar ahora! →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tips Section ── */}
      <section className="bg-[#3B0764] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-['Fredoka_One',cursive] text-[1.5rem] sm:text-[1.8rem] text-white text-center mb-8 sm:mb-10 flex flex-wrap justify-center">
            🦕 Consejos para aprender más rápido
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors"
              >
                <div className="text-[2.5rem] mb-3">{tip.icon}</div>
                <p className="text-white font-semibold text-[0.88rem] leading-relaxed">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Start ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#FAF7F0]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-['Fredoka_One',cursive] text-[1.6rem] sm:text-[2rem] text-[#3B0764] text-center mb-8 sm:mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            🦕 ¿Cómo empezar? 🦕
          </h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-gradient-to-b from-[#6B21A8] to-[#16A34A] rounded-full" />
            <div className="flex flex-col gap-6">
              {[
                { num: "1", title: "Crea tu cuenta gratis", text: "Regístrate como niño, tutor o docente. El sistema personaliza tu experiencia según tu rol." },
                { num: "2", title: "Elige un módulo", text: "Accede al Juego de Letras o a los Desafíos de Ortografía y aprende a tu propio ritmo." },
                { num: "3", title: "Gana medallas y logros", text: "Cada letra aprendida y ejercicio completado suma puntos y medallas a tu colección." },
                { num: "4", title: "Revisa tu progreso", text: "Padres y tutores pueden monitorear el avance desde el Panel de Progreso en cualquier momento." },
              ].map((step) => (
                <div key={step.num} className="relative flex items-start gap-6 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(107,33,168,0.07)] z-10 ml-4">
                  <div className="flex-shrink-0 w-[56px] h-[56px] bg-[#6B21A8] text-white rounded-full flex items-center justify-center font-['Fredoka_One',cursive] text-[1.6rem] shadow-[0_4px_12px_rgba(107,33,168,0.3)] -ml-11">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-['Fredoka_One',cursive] text-[1.1rem] text-[#3B0764] mb-1">{step.title}</h3>
                    <p className="text-gray-600 font-semibold text-[0.92rem] leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6B21A8] to-[#3B0764] py-12 sm:py-20 px-4 sm:px-6 text-white text-center">
        <div className="pointer-events-none absolute bottom-[-2rem] left-[-2rem] text-[12rem] opacity-5">🦕</div>
        <div className="pointer-events-none absolute top-[-1rem] right-[2rem] text-[10rem] opacity-5">🦖</div>
        <div className="relative max-w-[600px] mx-auto">
          <h2 className="font-['Fredoka_One',cursive] text-[1.5rem] sm:text-[1.8rem] md:text-[2.4rem] mb-3 md:mb-4">
            ¡La aventura de las letras te espera!
          </h2>
          <p className="text-[0.95rem] md:text-[1.05rem] font-semibold opacity-90 mb-6 md:mb-8">
            Únete a LETRASAURIO y haz que aprender a leer y escribir sea la actividad favorita de tus niños.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/registro"
              className="inline-flex items-center justify-center gap-2 bg-[#FACC15] text-[#3B0764] font-['Fredoka_One',cursive] text-[1rem] md:text-[1.15rem] px-6 md:px-8 py-3.5 md:py-4 rounded-[40px] no-underline shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-transform"
            >
              🌟 Registrarse gratis
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border-2 border-white/40 text-white font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] px-6 md:px-8 py-3.5 md:py-4 rounded-[40px] no-underline hover:bg-white/25 transition-colors"
            >
              👤 Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}