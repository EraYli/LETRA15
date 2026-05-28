import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import DinoLettersBg from "../components/DinoLettersBg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Por favor completa todos los campos"); return; }
    setLoading(true);
    try {
      await login(email, password, null);
      const savedUser = JSON.parse(localStorage.getItem('letrasaurio_user') || '{}');
      const role = savedUser.role;
      switch (role) {
        case "niño":    navigate("/dashboard/nino");  break;
        case "tutor":   navigate("/dashboard/tutor"); break;
        case "admin":   navigate("/dashboard/admin"); break;
        default:        navigate("/");
      }
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f2a4] via-[#bae6fd] to-[#e9d5ff] flex items-center justify-center px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12 relative overflow-hidden">
      <DinoLettersBg />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-1.5 md:gap-2 mb-6 md:mb-8 no-underline">
          <span className="text-[2.5rem] md:text-[3rem]">🦕</span>
          <span className="font-['Fredoka_One',cursive] text-[1.6rem] md:text-[2rem] text-[#6B21A8]">
            LETRA<span className="text-[#16A34A]">SAURIO</span>
          </span>
        </Link>

        <div className="bg-white rounded-[20px] md:rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgba(107,33,168,0.15)]">
          <h1 className="font-['Fredoka_One',cursive] text-[1.6rem] md:text-[2rem] text-[#3B0764] mb-1.5 md:mb-2 text-center">
            Iniciar sesión 👋
          </h1>
          <p className="text-gray-600 font-semibold text-center mb-5 md:mb-6 text-[0.9rem] md:text-[1rem]">
            ¡Bienvenido de nuevo a la aventura!
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-xl mb-4 font-semibold text-[0.9rem]">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold transition-colors"
                placeholder="tu@letrasaurio.com"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">Contraseña</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#6B21A8] hover:bg-[#7C3AED] disabled:bg-gray-400 text-white font-['Fredoka_One',cursive] text-[1rem] sm:text-[1.1rem] py-3.5 sm:py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(107,33,168,0.3)]"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión 🚀"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/registro" className="text-[#6B21A8] font-bold hover:text-[#7C3AED] transition-colors">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-600 font-semibold text-[0.9rem] hover:text-gray-800 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}