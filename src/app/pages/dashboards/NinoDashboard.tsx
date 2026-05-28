import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import DinoLettersBg from "../../components/DinoLettersBg";

const LOGROS_CONFIG = [
  { key: "cascaron", title: "¡Cascarón Roto!", icon: "🥚", oldTitles: ["¡Primera letra aprendida!"] },
  { key: "vocales", title: "Explorador de Vocales", icon: "🅰️" },
  { key: "gigante", title: "Paso de Gigante", icon: "🦕" },
  { key: "consonantes", title: "Rey de las Consonantes", icon: "🦁" },
  { key: "rex", title: "¡Rex del Abecedario!", icon: "🦖", oldTitles: ["¡Abecedario completo!"] },
  { key: "brote", title: "Brote Ortográfico", icon: "🌱", oldTitles: ["¡Nivel Fácil completado!"] },
  { key: "fuego", title: "Escritura de Fuego", icon: "🔥", oldTitles: ["¡Nivel Medio completado!"] },
  { key: "velocirraptor", title: "Velocirráptor de Palabras", icon: "⚡", oldTitles: ["¡Maestro de Ortografía!"] },
  { key: "escudo", title: "Escudo Impecable", icon: "🛡️" },
  { key: "racha_deletreo", title: "Racha de Deletreo", icon: "🎯" },
  { key: "madrugador", title: "Dino Madrugador", icon: "☀️" },
  { key: "volcanica", title: "Fuerza Volcánica", icon: "🌋" },
  { key: "corona", title: "Corona Prehistórica", icon: "👑" },
  { key: "estrellas", title: "Buscador de Estrellas", icon: "🌟" },
  { key: "diamante", title: "Dino de Diamante", icon: "💎" },
  { key: "campeon", title: "Campeón Legendario", icon: "🏆" },
];

export default function NinoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progresoPorModulo, setProgresoPorModulo] = useState<Record<string, number>>({});
  const [logrosUsuario, setLogrosUsuario] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: modulos } = await supabase.from('modulos').select('id, titulo');
      if (!modulos) return;
      const { data: progresos } = await supabase
        .from('progreso_usuarios')
        .select('modulo_id, letras_dominadas, puntuacion_total, nivel_actual')
        .eq('usuario_id', user.id);

      const nuevosProgresos: Record<string, number> = {};
      modulos.forEach((modulo) => {
        const p = progresos?.find(p => p.modulo_id === modulo.id);
        if (modulo.titulo === 'Juego de Letras') {
          nuevosProgresos[modulo.titulo] = Math.round(((p?.letras_dominadas?.length || 0) / 27) * 100);
        } else if (modulo.titulo === 'Desafíos de Ortografía') {
          const completedLevels = p?.nivel_actual ? Math.max(0, p.nivel_actual - 1) : 0;
          nuevosProgresos[modulo.titulo] = Math.min(Math.round((completedLevels / 3) * 100), 100);
        } else {
          nuevosProgresos[modulo.titulo] = 100;
        }
      });
      setProgresoPorModulo(nuevosProgresos);

      const { data: logrosData } = await supabase
        .from('logros_medallas')
        .select('nombre_logro')
        .eq('usuario_id', user.id);

      setLogrosUsuario(logrosData?.map(l => l.nombre_logro) || []);
    };
    fetchData();
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  const modules = [
    { title: "Juego de Letras",        description: "Aprende las letras jugando",  link: "/juego-letras",         gradient: "from-[#7C3AED] to-[#A855F7]", icon: "🔤" },
    { title: "Desafíos de Ortografía", description: "Practica tu escritura",        link: "/desafios-ortografia",  gradient: "from-[#16A34A] to-[#4ADE80]", icon: "✍️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
      <DinoLettersBg />

      <header className="bg-white shadow-[0_2px_12px_rgba(107,33,168,0.10)] px-3 sm:px-4 md:px-8 py-3 md:py-4 relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-2 md:gap-3">
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 no-underline shrink-0">
            <span className="text-[1.3rem] md:text-[2rem]">🦕</span>
            <span className="font-['Fredoka_One',cursive] text-[1.1rem] md:text-[1.5rem] text-[#6B21A8]">
              LETRA<span className="text-[#16A34A]">SAURIO</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
            <div className="text-right">
              <p className="font-bold text-gray-800 text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] leading-tight">Hola, {user?.name}!</p>
              <p className="text-[0.7rem] md:text-[0.85rem] text-gray-600 font-semibold leading-tight">Niño</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white border-2 border-[#6B21A8] text-[#6B21A8] font-bold px-3 md:px-4 py-1 md:py-2 text-[0.75rem] sm:text-[0.85rem] md:text-[1rem] rounded-full hover:bg-[#6B21A8] hover:text-white transition-all shrink-0 whitespace-nowrap"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-12 relative z-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] text-white rounded-[24px] md:rounded-[28px] p-6 md:p-8 mb-6 md:mb-8 shadow-[0_8px_30px_rgba(107,33,168,0.2)] relative overflow-hidden">
          <div className="absolute top-[-10px] md:top-[-20px] right-[-10px] md:right-[-20px] text-[5rem] md:text-[8rem] opacity-10 pointer-events-none select-none">🦖</div>
          <div className="relative z-10">
            <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] md:text-[2.5rem] mb-2 md:mb-3 leading-tight pr-10 md:pr-0">
              ¡Bienvenido, {user?.name}! 🌟
            </h1>
            <p className="text-[0.95rem] md:text-[1.1rem] font-semibold opacity-95 leading-relaxed">
              ¿Listo para aprender más letras hoy? ¡Elige un módulo y comencemos!
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {modules.map((module, index) => {
            const progress = progresoPorModulo[module.title] ?? 0;
            return (
              <Link
                key={index} to={module.link}
                className={`bg-gradient-to-br ${module.gradient} text-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(107,33,168,0.15)] hover:scale-105 transition-transform no-underline relative overflow-hidden`}
              >
                <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-white/10" />
                <div className="relative z-10">
                  <div className="text-[3rem] md:text-[3.5rem] mb-2 md:mb-3">{module.icon}</div>
                  <h3 className="font-['Fredoka_One',cursive] text-[1.3rem] md:text-[1.5rem] mb-1 md:mb-2">{module.title}</h3>
                  <p className="text-[0.9rem] md:text-[0.95rem] font-semibold opacity-90 mb-3 md:mb-4 leading-snug">{module.description}</p>
                  {progress < 100 && (
                    <div className="bg-white/20 rounded-full h-2 mb-1.5 md:mb-2">
                      <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  <p className="text-[0.8rem] md:text-[0.85rem] font-bold opacity-90">{progress}% completado</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Achievements board */}
        <div className="bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)] mb-6 md:mb-8">
          <h2 className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem] text-[#3B0764] mb-4 md:mb-6">🏆 Logros que puedes obtener</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {LOGROS_CONFIG.map((achievement) => {
              const unlocked = logrosUsuario.includes(achievement.title) ||
                               (achievement.oldTitles && achievement.oldTitles.some(ot => logrosUsuario.includes(ot)));
              return (
                <div
                  key={achievement.key}
                  className={`rounded-2xl p-3 md:p-4 text-center transition-all duration-300 border-2 flex flex-col items-center justify-center ${
                    unlocked
                      ? "bg-gradient-to-br from-[#FAF7F0] to-[#e9d5ff] border-purple-200 shadow-md hover:scale-105"
                      : "bg-gray-50 border-dashed border-gray-200 opacity-60"
                  }`}
                  title={achievement.title}
                >
                  <div className={`text-[2.2rem] md:text-[2.8rem] mb-1 md:mb-2 select-none transition-all ${unlocked ? "" : "filter grayscale opacity-45"}`}>
                    {achievement.icon}
                  </div>
                  <h4 className={`font-['Fredoka_One',cursive] text-[0.75rem] md:text-[0.8rem] leading-tight break-words ${unlocked ? "text-[#6B21A8]" : "text-gray-400"}`}>
                    {achievement.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Card below achievements */}
        <div className="mt-6 md:mt-8">
          <Link
            to="/mi-progreso"
            className="block bg-gradient-to-r from-[#F97316] to-[#FDE68A] text-gray-800 rounded-[20px] md:rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:scale-[1.02] transition-all no-underline relative overflow-hidden"
          >
            {/* Decorative Background Emojis */}
            <div className="absolute right-0 md:right-6 top-1/2 -translate-y-1/2 text-[4rem] md:text-[6rem] opacity-10 md:opacity-20 pointer-events-none select-none">
              🦖🏆
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4 md:gap-6 text-center md:text-left flex-col md:flex-row">
                <span className="text-[3.5rem] md:text-[4rem] filter drop-shadow-[2px_4px_6px_rgba(0,0,0,0.15)] leading-none">🏆</span>
                <div>
                  <h3 className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem] text-[#3B0764] mb-1">
                    Mi Panel de Progreso
                  </h3>
                  <p className="text-[0.95rem] md:text-[1.1rem] font-bold text-gray-700 max-w-[500px]">
                    Revisa cuántas letras has dominado, tus medallas ganadas y tu racha de días consecutivos de aprendizaje.
                  </p>
                </div>
              </div>
              <span className="bg-[#3B0764] hover:bg-[#6B21A8] text-white font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 w-full md:w-auto text-center mt-2 md:mt-0">
                Ver mi progreso →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}