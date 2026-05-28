import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth, UserRole } from "../contexts/AuthContext";
import DinoLettersBg from "../components/DinoLettersBg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) { setError("Por favor completa todos los campos"); return false; }
    if (name.length < 3) { setError("El nombre debe tener al menos 3 caracteres"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Ingresa un correo electrónico válido"); return false; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return false; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(name, email, password, "tutor");
      navigate("/dashboard/tutor");
    } catch (err: any) {
      console.error("Error en registro:", err);
      if (err.message?.includes('User already registered')) setError("Este correo ya está registrado. Intenta iniciar sesión.");
      else if (err.message?.includes('Password should be')) setError("La contraseña debe tener al menos 6 caracteres.");
      else if (err.message?.includes('Invalid email')) setError("El correo electrónico no es válido.");
      else setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
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
            Crear cuenta 🌟
          </h1>
          <p className="text-gray-600 font-semibold text-center mb-5 md:mb-6 text-[0.9rem] md:text-[1rem]">
            ¡Únete a la aventura de aprender!
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-xl mb-4 font-semibold text-[0.9rem]">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Nombre completo</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold transition-colors"
                placeholder="Tu nombre"
              />
            </div>
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
            <div>
              <label className="block font-bold text-gray-700 mb-2">Confirmar contraseña</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#6B21A8] focus:outline-none font-semibold transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 font-semibold text-[0.9rem] text-center">
                👨‍👩‍👧 Registro exclusivo para <strong>Tutores</strong>
              </p>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#6B21A8] hover:bg-[#7C3AED] disabled:bg-gray-400 text-white font-['Fredoka_One',cursive] text-[1rem] sm:text-[1.1rem] py-3.5 sm:py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(107,33,168,0.3)]"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta 🚀"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-[#6B21A8] font-bold hover:text-[#7C3AED] transition-colors">
              ¿Ya tienes cuenta? Inicia sesión
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