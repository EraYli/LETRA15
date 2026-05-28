import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBg from "../components/HeroBg";
import LettersBg from "../components/LettersBg";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "👨‍👩‍👧 Para Padres y Tutores",
      questions: [
        { q: "¿A qué edad puede mi hijo empezar a usar LETRASAURIO?", a: "LETRASAURIO está diseñado para niños de 4 a 8 años. Los módulos se adaptan al nivel de cada niño, permitiendo que avancen a su propio ritmo." },
        { q: "¿Cómo puedo ver el progreso de mi hijo?", a: "Como tutor, tienes acceso al Panel de Progreso donde puedes consultar las letras dominadas, logros obtenidos, y el desempeño general de tu hijo en tiempo real." },
        { q: "¿Es necesario que mi hijo use la plataforma todos los días?", a: "No es obligatorio, pero recomendamos sesiones cortas de 15-20 minutos diarios para mantener la continuidad del aprendizaje y reforzar lo aprendido." },
        { q: "¿LETRASAURIO reemplaza la educación tradicional?", a: "No, LETRASAURIO es una herramienta complementaria que refuerza el aprendizaje de las letras de manera lúdica. Está diseñado para trabajar junto con la enseñanza escolar tradicional." }
      ]
    },
    {
      category: "👩‍🏫 Para Docentes",
      questions: [
        { q: "¿Puedo usar LETRASAURIO con mi grupo escolar?", a: "Sí, los docentes pueden registrarse y tener acceso a herramientas para monitorear el progreso de múltiples estudiantes simultáneamente." },
        { q: "¿Cómo se alinea LETRASAURIO con el currículum escolar?", a: "Nuestros módulos están basados en métodos pedagógicos validados y se alinean con los estándares de educación básica en lectoescritura para niños de preescolar y primaria." },
        { q: "¿Puedo personalizar actividades para mi grupo?", a: "Como administrador, tienes acceso a herramientas de gestión de contenido que te permiten adaptar ciertos ejercicios según las necesidades de tu grupo." }
      ]
    },
    {
      category: "💻 Uso de la Plataforma",
      questions: [
        { q: "¿LETRASAURIO funciona en tablets y celulares?", a: "Sí, la plataforma es completamente responsive y funciona en computadoras, tablets y smartphones con conexión a internet." },
        { q: "¿Necesito instalar algún programa?", a: "No, LETRASAURIO funciona 100% en línea a través del navegador web. Solo necesitas conexión a internet." },
        { q: "¿La plataforma es gratuita?", a: "Sí, LETRASAURIO es completamente gratuita y accesible para todos. Es un proyecto educativo sin fines de lucro de la UJAT." },
        { q: "¿Qué hago si olvido mi contraseña?", a: "En la página de inicio de sesión encontrarás la opción 'Olvidé mi contraseña'. Ingresa tu correo y recibirás instrucciones para recuperarla." }
      ]
    },
    {
      category: "🎮 Sobre los Juegos",
      questions: [
        { q: "¿Qué incluye el Juego de Letras?", a: "Actividades de reconocimiento visual, asociación de sonidos, discriminación de grafías, y ejercicios interactivos con retroalimentación inmediata." },
        { q: "¿Los Desafíos de Ortografía son muy difíciles?", a: "Los desafíos tienen diferentes niveles de dificultad y se adaptan al progreso del niño. Comienzan con ejercicios simples y aumentan gradualmente." },
        { q: "¿Cómo funcionan las medallas y logros?", a: "Al completar actividades y dominar letras, los niños ganan medallas y desbloquean logros que los motivan a continuar aprendiendo." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Nunito',sans-serif]">
      <Header />

      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
        <HeroBg />
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <h1 className="font-['Fredoka_One',cursive] text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] text-[#3B0764] mb-3 sm:mb-4 md:mb-6 leading-tight">
            Preguntas Frecuentes ❓
          </h1>
          <p className="text-[0.95rem] md:text-[1.1rem] text-gray-700 font-semibold max-w-[700px] mx-auto leading-relaxed px-2 md:px-0">
            Encuentra respuestas a las dudas más comunes sobre LETRASAURIO.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 bg-white relative overflow-hidden">
        <LettersBg />
        <div className="max-w-[900px] mx-auto space-y-8 md:space-y-12 relative z-10">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="font-['Fredoka_One',cursive] text-[1.3rem] sm:text-[1.5rem] md:text-[1.8rem] text-[#6B21A8] mb-4 md:mb-6 flex flex-wrap">
                {category.category}
              </h2>
              <div className="space-y-3 md:space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div key={faqIndex} className="bg-[#FAF7F0] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(107,33,168,0.06)] hover:shadow-[0_4px_20px_rgba(107,33,168,0.1)] transition-shadow">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-[#f5f0e8] transition-colors"
                      >
                        <span className="font-bold text-gray-800 pr-4 text-[0.95rem] md:text-[1.05rem] leading-snug">{faq.q}</span>
                        <span className={`text-[1.2rem] md:text-[1.5rem] text-[#6B21A8] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-gray-700 font-semibold leading-relaxed text-[0.9rem] md:text-[0.95rem]">{faq.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 bg-[#FAF7F0]">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-['Fredoka_One',cursive] text-[1.4rem] sm:text-[1.8rem] md:text-[2rem] text-[#3B0764] mb-3 sm:mb-4 leading-tight">¿No encontraste tu respuesta? 🤔</h2>
          <p className="text-gray-700 font-semibold mb-6 md:mb-8 leading-relaxed text-[0.95rem] md:text-[1rem] px-2 md:px-0">
            Nuestro equipo está listo para ayudarte. Envíanos tu pregunta y te responderemos lo antes posible.
          </p>
          <a href="/contacto" className="inline-block bg-[#6B21A8] hover:bg-[#7C3AED] text-white font-['Fredoka_One',cursive] text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] px-6 py-3 md:px-8 md:py-4 rounded-[40px] shadow-[0_6px_20px_rgba(107,33,168,0.35)] transition-all no-underline w-full sm:w-auto">
            Contáctanos 📧
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}