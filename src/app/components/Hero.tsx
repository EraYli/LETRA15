import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { Link } from "react-router";
import dinoImg from "@/assets/dinos-baby.png";
import HeroBg from "./HeroBg";

function FloatingLetter({ letter, color, delay, duration, style }: {
  letter: string; color: string; delay: number; duration: number; style: React.CSSProperties;
}) {
  return (
    <motion.span
      className="font-['Fredoka_One',cursive] font-black absolute select-none"
      style={{ fontSize: "3.8rem", color, filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.22))", ...style }}
      animate={{ y: [0, -20, -10, 0], rotate: [-10, 8, -6, -10], scale: [1, 1.15, 0.92, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {letter}
    </motion.span>
  );
}

function RoarRing({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ border: `2.5px solid ${color}`, bottom: 20, left: "50%", marginLeft: -25 }}
      animate={{ width: [50, 260], height: [50, 260], opacity: [0.6, 0], marginLeft: [-25, -130], marginBottom: [0, -105] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

function Star({ emoji, style, delay }: { emoji: string; style: React.CSSProperties; delay: number }) {
  return (
    <motion.span
      className="absolute select-none pointer-events-none"
      style={{ fontSize: "1.6rem", ...style }}
      animate={{ scale: [0.7, 1.4, 0.7], rotate: [0, 180, 360], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {emoji}
    </motion.span>
  );
}

export default function Hero() {
  const controls = useAnimation();

  useEffect(() => {
    const handleHighlight = () => {
      controls.start({
        scale: [1, 1.15, 1, 1.15, 1, 1.15, 1],
        boxShadow: [
          "0 6px 20px rgba(107,33,168,0.35)",
          "0 0 30px rgba(107,33,168,0.8)",
          "0 6px 20px rgba(107,33,168,0.35)",
          "0 0 30px rgba(107,33,168,0.8)",
          "0 6px 20px rgba(107,33,168,0.35)",
          "0 0 30px rgba(107,33,168,0.8)",
          "0 6px 20px rgba(107,33,168,0.35)",
        ],
        transition: { duration: 1.5, ease: "easeInOut" }
      });
    };
    window.addEventListener('highlight-register', handleHighlight);
    return () => window.removeEventListener('highlight-register', handleHighlight);
  }, [controls]);

  const letters = [
    { letter: "A", color: "#EF4444", delay: 0,   duration: 3.8, style: { top: 10,  right: 10  } },
    { letter: "B", color: "#3B82F6", delay: 0.7, duration: 3.2, style: { top: 120, right: -15 } },
    { letter: "C", color: "#F97316", delay: 1.4, duration: 4.1, style: { top: -15, right: 120 } },
    { letter: "D", color: "#8B5CF6", delay: 0.3, duration: 3.6, style: { top: 60,  left: -10  } },
    { letter: "E", color: "#10B981", delay: 1.1, duration: 4.3, style: { top: 170, left: -15  } },
    { letter: "F", color: "#F43F5E", delay: 1.8, duration: 3.5, style: { top: 280, right: 5   } },
  ];

  return (
    <section className="bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] min-h-[520px] flex items-center px-4 md:px-8 pt-8 md:pt-12 pb-0 relative overflow-hidden">

      <HeroBg />

      {/* Contenido principal */}
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full relative z-10 text-center md:text-left">

        {/* Texto */}
        <div className="flex-1 pb-4 md:pb-12 mt-4 md:mt-0">
          <h1 className="font-['Fredoka_One',cursive] text-[2rem] sm:text-[2.5rem] md:text-[clamp(1.8rem,8vw,3.8rem)] leading-[1.1] text-[#3B0764] mb-3 md:mb-4 [text-shadow:2px_3px_0_rgba(107,33,168,0.12)]">
            Aprende jugando<br />
            <em className="text-[#16A34A] not-italic">con las letras</em> 🌟
          </h1>
          <p className="text-[1rem] md:text-[1.05rem] text-gray-600 font-bold max-w-[420px] mb-6 md:mb-8 leading-relaxed mx-auto md:mx-0">
            LETRASAURIO convierte el aprendizaje en una aventura divertida e interactiva para niñas y niños.
          </p>
          <Link to="/registro">
            <motion.button
              animate={controls}
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-[#6B21A8] text-white font-['Fredoka_One',cursive] text-[1.05rem] md:text-[1.15rem] px-6 md:px-8 py-3.5 rounded-[40px] shadow-[0_6px_20px_rgba(107,33,168,0.35)] tracking-wide border-none cursor-pointer"
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(107,33,168,0.45)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              🐾 ¡Comenzar aventura!
            </motion.button>
          </Link>
        </div>

        {/* Área del dino */}
        <div className="relative flex-shrink-0 origin-top transform scale-75 md:scale-100 -mt-8 md:-mt-0 -mb-8 md:-mb-0 w-[300px] h-[300px] md:w-[420px] md:h-[420px]">

          <RoarRing delay={0}    color="rgba(107,33,168,0.22)" />
          <RoarRing delay={0.85} color="rgba(59,130,246,0.18)" />
          <RoarRing delay={1.7}  color="rgba(16,185,129,0.14)" />

          {/* Sombra suelo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ bottom: 0, left: "50%", width: 220, height: 20, background: "rgba(107,33,168,0.12)", marginLeft: -110 }}
            animate={{ scaleX: [1, 0.75, 1], opacity: [0.12, 0.06, 0.12] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Estrellas */}
          <Star emoji="✨" style={{ top: 25,  left: 60  }} delay={0}   />
          <Star emoji="⭐" style={{ top: 200, right: 15 }} delay={0.9} />
          <Star emoji="✦"  style={{ top: 80,  left: 130, fontSize: "1.1rem" }} delay={1.7} />
          <Star emoji="✨" style={{ top: 290, left: 20,  fontSize: "1rem" }} delay={0.45} />
          <Star emoji="🌟" style={{ top: 320, right: 30, fontSize: "1.2rem" }} delay={1.3} />

          {/* Letras flotantes */}
          {letters.map((l) => <FloatingLetter key={l.letter} {...l} />)}

          {/* Imagen */}
          <motion.img
            src={dinoImg}
            alt="Dinosaurios bebé LETRASAURIO"
            className="absolute bottom-[10px] left-1/2 -ml-[140px] md:-ml-[185px] w-[280px] md:w-[370px] h-auto"
            style={{
              filter: "drop-shadow(0 8px 20px rgba(107,33,168,0.18))",
            }}
            animate={{ rotate: [-2, 2, -1.5, 1.5, -2], scale: [1, 1.03, 1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}