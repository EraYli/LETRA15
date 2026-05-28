import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import DinoLettersBg from "../../components/DinoLettersBg";

interface Nino {
  id: string;
  nombre_completo: string;
  fecha_registro: string;
  progresoGeneral: number;
  letrasLearned: number;
  nivelDesafios: number;
  puntuacion: number;
  racha: number;
}

export default function TutorDashboard() {
  const { user, logout, registerNino } = useAuth();
  const navigate = useNavigate();
  const [ninos, setNinos] = useState<Nino[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const handleLogout = () => { logout(); navigate("/"); };

  const loadNinosAndProgreso = async () => {
    if (!user) return;
    try {
      const { data: ninosData, error: ninosError } = await supabase
        .from('perfiles')
        .select('id, nombre_completo, fecha_registro')
        .eq('tutor_id', user.id)
        .eq('tipo_usuario', 'niño');

      if (ninosError) throw ninosError;
      if (!ninosData || ninosData.length === 0) {
        setNinos([]);
        return;
      }

      const { data: modulosData } = await supabase
        .from('modulos')
        .select('id, titulo');

      const desafiosModulo = modulosData?.find(m => m.titulo === "Desafíos de Ortografía");

      const ninoIds = ninosData.map(n => n.id);
      console.log("TutorDashboard: consultando progreso para ninoIds:", ninoIds);
      const { data: progresoData, error: progresoError } = await supabase
        .from('progreso_usuarios')
        .select('usuario_id, modulo_id, letras_dominadas, nivel_actual, puntuacion_total, racha_dias')
        .in('usuario_id', ninoIds);
      
      console.log("TutorDashboard: progresoData recibido:", progresoData, "error:", progresoError);

      const ninosConProgreso = ninosData.map((nino): Nino => {
        const ninoProgresos = progresoData?.filter(p => p.usuario_id === nino.id) || [];
        
        const learnedLetters = [...new Set(ninoProgresos.flatMap(p => p.letras_dominadas || []))];
        const puntuacionTotal = ninoProgresos.reduce((sum, p) => sum + (p.puntuacion_total || 0), 0);
        const rachaMax = Math.max(...ninoProgresos.map(p => p.racha_dias || 0), 0);
        
        const progDesafios = ninoProgresos.find(p => p.modulo_id === desafiosModulo?.id);
        const nivelDesafios = progDesafios?.nivel_actual || 1;
        const completedLevelsDesafios = Math.max(0, nivelDesafios - 1);
        const porcentajeDesafios = Math.min(Math.round((completedLevelsDesafios / 3) * 100), 100);
        
        const progresoGeneral = Math.round(((learnedLetters.length / 27) * 100 + porcentajeDesafios) / 2);

        return {
          id: nino.id,
          nombre_completo: nino.nombre_completo,
          fecha_registro: nino.fecha_registro,
          progresoGeneral,
          letrasLearned: learnedLetters.length,
          nivelDesafios,
          puntuacion: puntuacionTotal,
          racha: rachaMax
        };
      });

      setNinos(ninosConProgreso);
    } catch (err) {
      console.error("Error al obtener los niños y su progreso:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadNinosAndProgreso().finally(() => setLoading(false));

    // Suscribirse a cambios en tiempo real en la base de datos
    const channel = supabase
      .channel('tutor-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progreso_usuarios'
        },
        () => {
          loadNinosAndProgreso();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'perfiles'
        },
        () => {
          loadNinosAndProgreso();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAddNino = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!formName || !formEmail || !formPassword) { setFormError('Completa todos los campos'); return; }
    if (formPassword.length < 6) { setFormError('La contraseña debe tener al menos 6 caracteres'); return; }
    setFormLoading(true);
    try {
      await registerNino(formName, formEmail, formPassword);
      setFormSuccess(`¡${formName} fue registrado exitosamente!`);
      setFormName(''); setFormEmail(''); setFormPassword('');
      await loadNinosAndProgreso();
    } catch (err: any) {
      if (err.message?.includes('already registered')) setFormError('Ese correo ya está registrado.');
      else setFormError(err.message || 'Error al registrar el niño');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
      <DinoLettersBg />

      {/* Header */}
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
              <p className="font-bold text-gray-800 text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] leading-tight">Panel Tutor 👨‍👩‍👧</p>
              <p className="text-[0.7rem] md:text-[0.85rem] text-gray-600 font-semibold leading-tight">{user?.name}</p>
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
        <div className="bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)] mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem] text-[#3B0764] text-center sm:text-left">🧒 Mis estudiantes</h2>
            <button
              onClick={() => { setShowModal(true); setFormSuccess(''); setFormError(''); }}
              className="bg-[#6B21A8] hover:bg-[#7C3AED] text-white font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-xl transition-all w-full sm:w-auto text-[0.95rem] md:text-[1rem]"
            >
              + Agregar niño
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-8 text-[0.9rem] md:text-[1rem]">Cargando...</p>
          ) : ninos.length === 0 ? (
            <div className="text-center py-10 md:py-12">
              <p className="text-[2.5rem] md:text-[3rem] mb-3 md:mb-4">👶</p>
              <p className="font-bold text-gray-600 text-[1rem] md:text-[1.1rem]">Aún no tienes estudiantes registrados</p>
              <p className="text-gray-500 mt-1 md:mt-2 text-[0.9rem] md:text-[1rem]">Haz clic en "Agregar niño" para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {ninos.map((nino) => (
                <div key={nino.id} className="bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <div className="text-[2rem] md:text-[2.5rem]">🧒</div>
                      <div className="bg-white/20 text-white text-[0.7rem] md:text-[0.8rem] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        🔥 Racha: {nino.racha} d
                      </div>
                    </div>
                    
                    <h3 className="font-['Fredoka_One',cursive] text-[1.2rem] md:text-[1.4rem] mb-1 leading-tight">{nino.nombre_completo}</h3>
                    <p className="text-[0.75rem] md:text-[0.8rem] opacity-75 mb-3 md:mb-4">
                      Registrado: {new Date(nino.fecha_registro).toLocaleDateString('es-MX')}
                    </p>

                    {/* Progreso general con barra */}
                    <div className="mb-4 bg-white/10 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between text-[0.7rem] md:text-xs font-bold mb-1 opacity-90">
                        <span>Progreso General</span>
                        <span>{nino.progresoGeneral}%</span>
                      </div>
                      <div className="w-full bg-white/25 rounded-full h-1.5 md:h-2">
                        <div 
                          className="bg-[#16A34A] h-1.5 md:h-2 rounded-full transition-all" 
                          style={{ width: `${nino.progresoGeneral}%` }}
                        />
                      </div>
                    </div>

                    {/* Mini estadísticas en grid */}
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2 text-center text-[0.7rem] md:text-xs font-semibold mb-5 md:mb-6">
                      <div className="bg-white/10 rounded-lg p-1.5">
                        <span className="block text-[0.9rem] md:text-[1rem]">🔤</span>
                        <span className="block font-bold">{nino.letrasLearned}/27</span>
                        <span className="text-[0.6rem] md:text-[0.65rem] opacity-75">Letras</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-1.5">
                        <span className="block text-[0.9rem] md:text-[1rem]">✍️</span>
                        <span className="block font-bold">{nino.nivelDesafios - 1}/3</span>
                        <span className="text-[0.6rem] md:text-[0.65rem] opacity-75">Niveles</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-1.5">
                        <span className="block text-[0.9rem] md:text-[1rem]">⭐</span>
                        <span className="block font-bold">{nino.puntuacion}</span>
                        <span className="text-[0.6rem] md:text-[0.65rem] opacity-75">Puntos</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/progreso-alumno/${nino.id}`}
                    className="block text-center bg-white hover:bg-[#FAF7F0] text-[#6B21A8] font-bold py-2 md:py-2.5 rounded-xl transition-all no-underline shadow-sm text-[0.9rem] md:text-[1rem]"
                  >
                    Ver reporte detallado →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal agregar niño */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-4">
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-5 sm:p-8 w-full max-w-md shadow-2xl">
            <h3 className="font-['Fredoka_One',cursive] text-[1.8rem] text-[#3B0764] mb-6 text-center">
              Registrar nuevo niño 🧒
            </h3>
            {formSuccess ? (
              <div className="text-center py-4">
                <p className="text-[3rem] mb-4">🎉</p>
                <p className="font-bold text-green-700 text-[1.1rem] mb-6">{formSuccess}</p>
                <button onClick={() => setShowModal(false)} className="bg-[#6B21A8] text-white font-bold px-8 py-3 rounded-xl">
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddNino} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-xl font-semibold text-[0.9rem]">
                    ⚠️ {formError}
                  </div>
                )}
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Nombre del niño</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold"
                    placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Correo electrónico</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold"
                    placeholder="correo@gmail.com" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Contraseña</label>
                  <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold"
                    placeholder="••••••••" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" disabled={formLoading}
                    className="flex-1 bg-[#6B21A8] hover:bg-[#7C3AED] disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-all">
                    {formLoading ? 'Registrando...' : 'Registrar niño 🚀'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}