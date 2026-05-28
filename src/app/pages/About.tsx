import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBg from "../components/HeroBg";
import LettersBg from "../components/LettersBg";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-['Nunito',sans-serif]">
      <Header />

      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
        <HeroBg />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] text-[#3B0764] mb-3 sm:mb-4 md:mb-6 text-center leading-tight">
            ¿Quiénes Somos? 🦕
          </h1>
          <p className="text-[0.95rem] md:text-[1.1rem] text-gray-700 font-semibold text-center max-w-[700px] mx-auto leading-relaxed px-2 md:px-0">
            Un proyecto educativo desarrollado con pasión para transformar el aprendizaje de las letras.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 bg-white relative overflow-hidden">
        <LettersBg />
        <div className="max-w-[900px] mx-auto relative z-10">
          <div className="bg-[#FAF7F0] rounded-[20px] md:rounded-[24px] p-5 sm:p-6 md:p-10 mb-6 md:mb-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
            <h2 className="font-['Fredoka_One',cursive] text-[1.2rem] sm:text-[1.4rem] md:text-[1.8rem] text-[#6B21A8] mb-3 md:mb-4 flex flex-wrap items-center gap-2 md:gap-3">
              📖 Nuestra Historia
            </h2>
            <p className="text-gray-700 text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] leading-relaxed font-semibold mb-4">
              LETRASAURIO nace como un proyecto académico de la Universidad Juárez Autónoma de Tabasco (UJAT),
              División Académica de Ciencias y Tecnologías de la Información, con el objetivo de revolucionar
              la manera en que los niños aprenden a leer y escribir.
            </p>
            <p className="text-gray-700 text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] leading-relaxed font-semibold">
              Inspirados en la curiosidad natural de los niños y su amor por los dinosaurios y la aventura,
              creamos una plataforma que transforma el aprendizaje en una experiencia lúdica e interactiva.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white rounded-[20px] md:rounded-[24px] p-5 sm:p-6 md:p-10 mb-6 md:mb-8 shadow-[0_4px_20px_rgba(107,33,168,0.15)]">
            <h2 className="font-['Fredoka_One',cursive] text-[1.2rem] sm:text-[1.4rem] md:text-[1.8rem] mb-3 md:mb-4 flex flex-wrap items-center gap-2 md:gap-3">
              🎯 Misión Pedagógica
            </h2>
            <p className="text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] leading-relaxed font-semibold mb-4">
              Facilitar el aprendizaje temprano de la lectoescritura a través de métodos innovadores,
              basados en el juego y la tecnología, promoviendo la autonomía del niño y el acompañamiento
              activo de padres, tutores y docentes.
            </p>
            <p className="text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] leading-relaxed font-semibold">
              Creemos que cada niño aprende a su propio ritmo, y nuestra plataforma se adapta a sus
              necesidades, celebrando cada logro y motivando el aprendizaje continuo.
            </p>
          </div>

          <div className="bg-[#FAF7F0] rounded-[20px] md:rounded-[24px] p-5 sm:p-6 md:p-10 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
            <h2 className="font-['Fredoka_One',cursive] text-[1.2rem] sm:text-[1.4rem] md:text-[1.8rem] text-[#16A34A] mb-3 md:mb-4 flex flex-wrap items-center gap-2 md:gap-3">
              👥 Equipo de Desarrollo
            </h2>
            <p className="text-gray-700 text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] leading-relaxed font-semibold mb-4">
              Nuestro equipo está conformado por estudiantes y docentes de la UJAT, apasionados por
              la educación y la tecnología. Trabajamos en conjunto para crear herramientas que generen
              un impacto positivo en la educación de niños en edad preescolar y primaria.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
              <div className="text-center bg-white p-4 rounded-2xl md:bg-transparent md:p-0 md:rounded-none">
                <div className="text-[2.5rem] md:text-[3rem] mb-2">👨‍💻</div>
                <h3 className="font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] text-[#6B21A8] mb-1">Desarrolladores</h3>
                <p className="text-[0.85rem] md:text-[0.9rem] text-gray-600 font-semibold">Estudiantes de Ingeniería en Sistemas</p>
              </div>
              <div className="text-center bg-white p-4 rounded-2xl md:bg-transparent md:p-0 md:rounded-none">
                <div className="text-[2.5rem] md:text-[3rem] mb-2">👩‍🏫</div>
                <h3 className="font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] text-[#6B21A8] mb-1">Pedagogos</h3>
                <p className="text-[0.85rem] md:text-[0.9rem] text-gray-600 font-semibold">Especialistas en educación infantil</p>
              </div>
              <div className="text-center bg-white p-4 rounded-2xl md:bg-transparent md:p-0 md:rounded-none sm:col-span-2 md:col-span-1">
                <div className="text-[2.5rem] md:text-[3rem] mb-2">🎨</div>
                <h3 className="font-['Fredoka_One',cursive] text-[1rem] md:text-[1.1rem] text-[#6B21A8] mb-1">Diseñadores</h3>
                <p className="text-[0.85rem] md:text-[0.9rem] text-gray-600 font-semibold">Creadores de experiencias visuales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}