export default function WhySection() {
  const cards = [
    {
      icon: "🎮",
      title: "Aprendizaje lúdico",
      description: "Juegos y actividades interactivas que hacen que aprender las letras sea divertido y emocionante."
    },
    {
      icon: "📊",
      title: "Seguimiento de progreso",
      description: "Monitorea el avance de cada niño con reportes visuales y logros que motivan a seguir aprendiendo."
    },
    {
      icon: "💻",
      title: "Acceso multiplataforma",
      description: "Disponible en web y app para que aprendas desde cualquier lugar y en cualquier momento."
    }
  ];

  return (
    <section className="bg-[#FAF7F0] py-10 sm:py-12 md:py-20 relative">
      <h2 className="font-['Fredoka_One',cursive] text-[1.4rem] sm:text-[1.5rem] md:text-[2rem] text-center text-[#3B0764] mb-6 sm:mb-8 md:mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-2.5 px-3 sm:px-4 md:px-8">
        <span className="text-[#16A34A]">🌿</span> ¿Por qué elegir LETRASAURIO? <span className="text-[#16A34A]">🌿</span>
      </h2>

      <div className="max-w-[1100px] mx-auto w-full px-3 sm:px-4 md:px-8">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-5 md:p-9 flex flex-row md:flex-col items-center text-left md:text-center shadow-[0_4px_20px_rgba(107,33,168,0.08)] transition-all duration-250 border-2 border-transparent md:hover:translate-y-[-8px] md:hover:shadow-[0_12px_32px_rgba(107,33,168,0.15)] md:hover:border-[#A855F7]"
            >
              <div className="text-[2.5rem] md:text-[3.5rem] flex-shrink-0 w-[70px] md:w-auto text-center mr-2 md:mr-0 mb-0 md:mb-4">
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-['Fredoka_One',cursive] text-[1rem] md:text-[1.3rem] text-[#7C3AED] mb-1 md:mb-2.5">
                  {card.title}
                </h3>
                <p className="text-[0.8rem] md:text-[0.95rem] text-gray-600 leading-relaxed font-semibold">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}