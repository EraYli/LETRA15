import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../../supabaseClient";
import DinoLettersBg from "../../components/DinoLettersBg";

interface Nino { id: string; nombre_completo: string; fecha_registro: string; }
interface Tutor { id: string; nombre_completo: string; fecha_registro: string; ninos: Nino[]; }
interface Perfil { id: string; nombre_completo: string; tipo_usuario: string; fecha_registro: string; tutor_id: string | null; tutor?: { nombre_completo: string }; bloqueado?: boolean; }

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"tutores" | "users">("tutores");
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "block" | "unblock" | "delete";
    userId: string;
    userName: string;
    userRole?: string;
  } | null>(null);

  const handleLogout = () => { logout(); navigate("/"); };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre_completo, tipo_usuario, fecha_registro, tutor_id, bloqueado')
      .or('eliminado.is.null,eliminado.eq.false')
      .order('fecha_registro', { ascending: false });

    if (!error && data) {
      const perfilesConTutor: Perfil[] = await Promise.all(
        data.map(async (p) => {
          if (p.tutor_id) {
            const { data: tutor } = await supabase.from('perfiles').select('nombre_completo').eq('id', p.tutor_id).single();
            return { ...p, tutor: tutor ?? undefined };
          }
          return { ...p, tutor: undefined };
        })
      );
      setPerfiles(perfilesConTutor);

      const tutoresList = data.filter(p => p.tipo_usuario === 'tutor');
      const ninos = data.filter(p => p.tipo_usuario === 'niño');
      const tutoresConNinos: Tutor[] = tutoresList.map(tutor => ({
        id: tutor.id,
        nombre_completo: tutor.nombre_completo,
        fecha_registro: tutor.fecha_registro,
        ninos: ninos.filter(n => n.tutor_id === tutor.id).map(n => ({
          id: n.id, nombre_completo: n.nombre_completo, fecha_registro: n.fecha_registro,
        })),
      }));
      setTutores(tutoresConNinos);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const stats = {
    totalUsers: perfiles.length,
    activeNinos: perfiles.filter(p => p.tipo_usuario === 'niño').length,
    activeTutors: perfiles.filter(p => p.tipo_usuario === 'tutor').length,
    admins: perfiles.filter(p => p.tipo_usuario === 'admin').length,
  };

  const handleBlockUser = (id: string, currentRole: string) => {
    const userProfile = perfiles.find(p => p.id === id);
    setConfirmModal({
      show: true,
      type: "block",
      userId: id,
      userName: userProfile?.nombre_completo || "Usuario",
      userRole: currentRole
    });
  };

  const handleUnblockUser = (id: string, currentRole: string) => {
    const userProfile = perfiles.find(p => p.id === id);
    setConfirmModal({
      show: true,
      type: "unblock",
      userId: id,
      userName: userProfile?.nombre_completo || "Usuario",
      userRole: currentRole
    });
  };

  const handleDeleteUser = (id: string, name: string) => {
    setConfirmModal({
      show: true,
      type: "delete",
      userId: id,
      userName: name
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { type, userId, userRole } = confirmModal;
    setConfirmModal(null);
    setLoading(true);

    try {
      if (type === 'delete') {
        const { data: updateResult, error } = await supabase
          .from('perfiles')
          .update({ eliminado: true })
          .eq('id', userId)
          .select();

        if (error) throw error;
        if (!updateResult || updateResult.length === 0) {
          throw new Error("No se pudo eliminar el perfil. Verifica las políticas SQL o la conexión a Supabase.");
        }
      } else if (type === 'block') {
        const { data: updateResult, error } = await supabase
          .from('perfiles')
          .update({ bloqueado: true })
          .eq('id', userId)
          .select();

        if (error) throw error;
        if (!updateResult || updateResult.length === 0) {
          throw new Error("No se pudo bloquear el usuario. Por favor ejecuta el script de políticas SQL en Supabase.");
        }
      } else if (type === 'unblock') {
        const { data: updateResult, error } = await supabase
          .from('perfiles')
          .update({ bloqueado: false })
          .eq('id', userId)
          .select();

        if (error) throw error;
        if (!updateResult || updateResult.length === 0) {
          throw new Error("No se pudo desbloquear el usuario. Por favor ejecuta el script de políticas SQL en Supabase.");
        }
      }

      await fetchData();
    } catch (err) {
      console.error("Error al ejecutar acción sobre el usuario:", err);
      alert("Hubo un error al realizar la operación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] relative overflow-hidden">
      <DinoLettersBg />

      <header className="bg-[#3B0764] shadow-md px-4 md:px-8 py-3 md:py-4 relative z-10">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-y-3 gap-x-4 md:gap-6">
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <span className="text-[1.4rem] md:text-[2rem]">🦕</span>
            <span className="font-['Fredoka_One',cursive] text-[1rem] sm:text-[1.2rem] md:text-[1.5rem] text-white">
              LETRASAURIO <span className="text-[#FACC15]">ADMIN</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 md:gap-6 flex-1 sm:flex-none">
            <div className="text-right text-white">
              <p className="font-bold text-[0.75rem] sm:text-[0.9rem] md:text-[1rem] leading-tight">Panel Admin 👤</p>
              <p className="text-[0.65rem] sm:text-[0.85rem] opacity-90 font-semibold leading-tight">{user?.name}</p>
            </div>
            <button onClick={handleLogout} className="bg-white/20 border-2 border-white/50 text-white font-bold px-4 md:px-5 py-1.5 md:py-2 text-[0.85rem] md:text-[1rem] rounded-full hover:bg-white/30 transition-all shrink-0 whitespace-nowrap">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
              <div className="text-[1.5rem] md:text-[2rem] mb-1">👥</div>
              <p className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem]">{stats.totalUsers}</p>
              <p className="text-[0.75rem] md:text-[0.85rem] font-semibold opacity-90">Total usuarios</p>
            </div>
            <div className="bg-gradient-to-br from-[#16A34A] to-[#4ADE80] text-white rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
              <div className="text-[1.5rem] md:text-[2rem] mb-1">🧒</div>
              <p className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem]">{stats.activeNinos}</p>
              <p className="text-[0.75rem] md:text-[0.85rem] font-semibold opacity-90">Niños</p>
            </div>
            <div className="bg-gradient-to-br from-[#F97316] to-[#FDE68A] text-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
              <div className="text-[1.5rem] md:text-[2rem] mb-1">👨‍👩‍👧</div>
              <p className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem]">{stats.activeTutors}</p>
              <p className="text-[0.75rem] md:text-[0.85rem] font-semibold opacity-90">Tutores</p>
            </div>
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#93C5FD] text-white rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
              <div className="text-[1.5rem] md:text-[2rem] mb-1">👤</div>
              <p className="font-['Fredoka_One',cursive] text-[1.4rem] md:text-[1.8rem]">{stats.admins}</p>
              <p className="text-[0.75rem] md:text-[0.85rem] font-semibold opacity-90">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-2">
            {[
              { key: "tutores", label: "👨‍👩‍👧 Tutores y Estudiantes" },
              { key: "users",   label: "👥 Todos los Usuarios"       },
            ].map(({ key, label }) => (
              <button key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-4 md:px-6 py-3 md:py-4 font-bold transition-all text-center text-[0.95rem] md:text-[1rem] ${activeTab === key ? "text-[#6B21A8] border-b-4 border-[#6B21A8]" : "text-gray-600 hover:text-gray-800"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8 relative z-10">

        {activeTab === "tutores" && (
          <div>
            <h2 className="font-['Fredoka_One',cursive] text-[1.8rem] text-[#3B0764] mb-6">Tutores y sus estudiantes</h2>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Cargando...</p>
            ) : tutores.length === 0 ? (
              <div className="bg-white rounded-[24px] p-12 text-center shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
                <p className="text-[3rem] mb-4">👨‍👩‍👧</p>
                <p className="font-bold text-gray-600 text-[1.1rem]">No hay tutores registrados aún</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tutores.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] text-white rounded-2xl p-4">
                        <span className="text-[2rem]">👨‍👩‍👧</span>
                      </div>
                      <div>
                        <h3 className="font-['Fredoka_One',cursive] text-[1.5rem] text-[#3B0764]">{tutor.nombre_completo}</h3>
                        <p className="text-gray-500 font-semibold text-[0.9rem]">
                          Registrado: {new Date(tutor.fecha_registro).toLocaleDateString('es-MX')} •{" "}
                          <span className="text-[#6B21A8]">{tutor.ninos.length} {tutor.ninos.length === 1 ? 'estudiante' : 'estudiantes'}</span>
                        </p>
                      </div>
                    </div>
                    {tutor.ninos.length === 0 ? (
                      <div className="bg-gray-50 rounded-2xl p-6 text-center">
                        <p className="text-gray-500 font-semibold">Este tutor aún no tiene estudiantes asignados</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-4">
                        {tutor.ninos.map((nino) => (
                          <div key={nino.id} className="bg-gradient-to-br from-[#FAF7F0] to-[#e9d5ff] rounded-2xl p-5 flex items-center gap-4">
                            <div className="bg-white rounded-xl p-3 shadow-sm"><span className="text-[1.8rem]">🧒</span></div>
                            <div>
                              <p className="font-['Fredoka_One',cursive] text-[1.1rem] text-[#6B21A8]">{nino.nombre_completo}</p>
                              <p className="text-gray-500 font-semibold text-[0.8rem]">{new Date(nino.fecha_registro).toLocaleDateString('es-MX')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(107,33,168,0.08)]">
            <h2 className="font-['Fredoka_One',cursive] text-[1.8rem] text-[#3B0764] mb-6">Todos los usuarios</h2>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Cargando...</p>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Nombre</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Rol</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Tutor asignado</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Fecha registro</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfiles.map((perfil) => (
                      <tr key={perfil.id} className="border-b border-gray-100 hover:bg-[#FAF7F0] transition-colors">
                        <td className="py-4 px-4 font-semibold">{perfil.nombre_completo}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[0.85rem] font-bold ${
                            perfil.bloqueado ? 'bg-red-100 text-red-700' :
                            perfil.tipo_usuario === 'niño'  ? 'bg-purple-100 text-purple-700' :
                            perfil.tipo_usuario === 'tutor' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {perfil.bloqueado ? `🚫 Bloqueado (${perfil.tipo_usuario})` :
                             perfil.tipo_usuario === 'niño' ? '🧒 Niño' : perfil.tipo_usuario === 'tutor' ? '👨‍👩‍👧 Tutor' : '👤 Admin'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-600">
                          {perfil.tutor ? `👨‍👩‍👧 ${perfil.tutor.nombre_completo}` : '—'}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-600">
                          {new Date(perfil.fecha_registro).toLocaleDateString('es-MX')}
                        </td>
                        <td className="py-4 px-4 flex gap-2">
                          {perfil.tipo_usuario !== 'admin' && (
                            <>
                              {perfil.bloqueado ? (
                                <button
                                  onClick={() => handleUnblockUser(perfil.id, perfil.tipo_usuario)}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                                >
                                  🔓 Desbloquear
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBlockUser(perfil.id, perfil.tipo_usuario)}
                                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                                >
                                  🚫 Bloquear
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(perfil.id, perfil.nombre_completo)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                              >
                                🗑️ Eliminar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal && confirmModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4">
          <div className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 w-full max-w-md shadow-2xl border-2 border-[#6B21A8]/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <span className="text-[3.5rem] block mb-3">
                {confirmModal.type === 'delete' ? '🗑️' : confirmModal.type === 'block' ? '🚫' : '🔓'}
              </span>
              <h3 className="font-['Fredoka_One',cursive] text-[1.6rem] text-[#3B0764] mb-3">
                {confirmModal.type === 'delete' ? '¿Eliminar usuario?' : confirmModal.type === 'block' ? '¿Bloquear usuario?' : '¿Desbloquear usuario?'}
              </h3>
              <p className="text-gray-600 font-semibold mb-6">
                {confirmModal.type === 'delete' ? (
                  <>¿Estás seguro de que deseas eliminar permanentemente a <strong>{confirmModal.userName}</strong>? Esta acción no se puede deshacer.</>
                ) : confirmModal.type === 'block' ? (
                  <>¿Estás seguro de que deseas bloquear a <strong>{confirmModal.userName}</strong>? No podrá iniciar sesión ni acceder al sistema.</>
                ) : (
                  <>¿Deseas desbloquear a <strong>{confirmModal.userName}</strong> para permitirle acceder al sistema nuevamente?</>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 text-white font-bold py-3 rounded-xl transition-all shadow-md ${
                    confirmModal.type === 'delete' ? 'bg-[#EF4444] hover:bg-[#DC2626]' :
                    confirmModal.type === 'block' ? 'bg-[#F97316] hover:bg-[#EA580C]' :
                    'bg-[#16A34A] hover:bg-[#15803D]'
                  }`}
                >
                  {confirmModal.type === 'delete' ? 'Sí, eliminar' : confirmModal.type === 'block' ? 'Sí, bloquear' : 'Sí, desbloquear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}