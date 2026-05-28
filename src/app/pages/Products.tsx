import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBg from "../components/HeroBg";
import LettersBg from "../components/LettersBg";
import { Link } from "react-router";

export default function Products() {
  const modules = [
    {
      icon: "🔤",
      title: "Juego de Letras",
      description: "Actividades interactivas que asocian grafías con sonidos e imágenes para facilitar el aprendizaje fonético y visual.",
      features: [
        "Reconocimiento de letras mayúsculas y minúsculas",
        "Asociación de sonidos con grafías",
        "Ejercicios de discriminación visual",
        "Retroalimentación inmediata y motivadora"
      ],
      gradient: "from-[#7C3AED] to-[#A855F7]",
      age: "4-6 años",
      premium: false,
    },
    {
      icon: "✍️",
      title: "Desafíos de Ortografía",
      description: "Ejercicios progresivos de completar palabras, selección de grafías correctas y dictados con retroalimentación inmediata.",
      features: [
        "Completar palabras con letras faltantes",
        "Dictados adaptados al nivel del niño",
        "Corrección ortográfica paso a paso",
        "Sistema de niveles de dificultad creciente"
      ],
      gradient: "from-[#16A34A] to-[#4ADE80]",
      age: "6-8 años",
      premium: false,
    },
    {
      icon: "🏆",
      title: "Panel de Progreso",
      description: "Tablero personalizado con letras dominadas, logros obtenidos, medallas y nivel actual de desempeño del niño.",
      features: [
        "Seguimiento de letras aprendidas",
        "Sistema de medallas y logros",
        "Gráficas de progreso visuales",
        "Reportes para padres y tutores"
      ],
      gradient: "from-[#F97316] to-[#FDE68A]",
      age: "Todos",
      premium: false,
    },

  ];

  return (
    <div className="min-h-screen bg-white font-['Nunito',sans-serif]">
      <Header />

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
        <HeroBg />
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] text-[#3B0764] mb-3 sm:mb-4 md:mb-6 leading-tight">
            Productos y Servicios ✨
          </h1>
          <p className="text-[0.95rem] md:text-[1.1rem] text-gray-700 font-semibold max-w-[700px] mx-auto leading-relaxed px-2 md:px-0">
            Descubre nuestros módulos educativos diseñados para hacer del aprendizaje una aventura inolvidable.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-8 bg-white relative overflow-hidden">
        <LettersBg />
        <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8 relative z-10">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${module.gradient} ${module.premium ? "text-gray-800" : "text-white"} rounded-[20px] p-5 md:p-6 shadow-[0_6px_24px_rgba(107,33,168,0.18)] overflow-hidden relative`}
            >
              <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-white/10 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                <div className="text-[2.5rem] md:text-[3.5rem] leading-none shrink-0 flex items-center md:items-start gap-4 w-full md:w-auto">
                  {module.icon}
                  <div className="md:hidden flex-1">
                    <h2 className="font-['Fredoka_One',cursive] text-[1.2rem] leading-tight mb-1">{module.title}</h2>
                  </div>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-3">
                    <h2 className="font-['Fredoka_One',cursive] text-[1.6rem] leading-tight mr-1 hidden md:block">{module.title}</h2>
                    <span className="bg-white/20 px-2.5 md:px-3 py-0.5 rounded-full text-[0.7rem] md:text-[0.78rem] font-bold whitespace-nowrap">{module.age}</span>
                    {module.premium ? (
                      <span className="bg-yellow-400 text-gray-900 font-bold text-[0.7rem] md:text-[0.75rem] px-2.5 md:px-3 py-1 rounded-full shadow-sm ml-auto md:ml-0">👑 Premium</span>
                    ) : (
                      <span className="bg-white/30 text-white font-bold text-[0.7rem] md:text-[0.75rem] px-2.5 md:px-3 py-1 rounded-full ml-auto md:ml-0">✅ Gratis</span>
                    )}
                  </div>
                  <p className="text-[0.85rem] md:text-[0.92rem] font-semibold mb-4 md:mb-5 opacity-95 leading-relaxed">{module.description}</p>
                  <div className="bg-white/15 rounded-xl p-3.5 md:p-5 mb-4 md:mb-5">
                    <h3 className="font-['Fredoka_One',cursive] text-[0.9rem] md:text-[1rem] mb-2 md:mb-3">Características principales:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-1">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-semibold text-[0.8rem] md:text-[0.85rem]">
                          <span className="shrink-0">✓</span><span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={module.premium ? "/registro" : "/login"}
                    className={[
                      "inline-block font-['Fredoka_One',cursive] text-[0.8rem] md:text-[0.9rem] px-4 md:px-5 py-2 md:py-2.5 rounded-[30px] border-2 transition-all no-underline text-center w-full md:w-auto",
                      module.premium
                        ? "bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-300"
                        : "bg-white/25 hover:bg-white/40 text-white border-white/50"
                    ].join(" ")}
                  >
                    {module.premium ? "Suscribirme 👑" : `Acceder a ${module.title} →`}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 bg-[#FAF7F0]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-['Fredoka_One',cursive] text-[1.6rem] sm:text-[1.8rem] md:text-[2.2rem] text-[#3B0764] mb-3 sm:mb-4 md:mb-6 leading-tight">¿Listo para comenzar la aventura? 🚀</h2>
          <p className="text-gray-700 font-semibold mb-6 md:mb-8 text-[0.9rem] md:text-[1.05rem] leading-relaxed">
            Registra a tu hijo en LETRASAURIO y observa cómo el aprendizaje se convierte en su actividad favorita.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/registro" className="bg-[#6B21A8] hover:bg-[#7C3AED] text-white font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] px-6 md:px-8 py-3.5 md:py-4 rounded-[40px] shadow-[0_6px_20px_rgba(107,33,168,0.35)] transition-all no-underline w-full sm:w-auto">
              Registrarse gratis
            </Link>
            <Link to="/login" className="bg-white hover:bg-gray-50 text-[#6B21A8] border-2 border-[#6B21A8] font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] px-6 md:px-8 py-3.5 md:py-4 rounded-[40px] transition-all no-underline w-full sm:w-auto">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}