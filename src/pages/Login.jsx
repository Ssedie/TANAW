import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authorization/AuthContext';
import { API_URL } from '../config/constants';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      login(data.token);
      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center 
                    bg-gradient-to-br from-[#051933] via-[#0A2A52] to-[#0F3A6E]
                    bg-[length:300%_300%] animate-bg">

      <form onSubmit={handleLogin}
        className="w-96 p-10 rounded-2xl bg-white backdrop-blur-xl shadow-2xl border border-white/20">

        {error &&
          <div className="text-red-400 mb-4 text-center font-medium">{error}</div>
        }

        <h1 className="text-3xl font-semibold text-center text-black tracking-wide mb-10">
          Login
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            id="username"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoComplete="username"
            className="peer w-full px-4 py-3 rounded-lg bg-transparent border border-black/30 
                       text-white outline-none focus:border-blue-400 transition-all"
          />

          <label htmlFor="username"
            className="absolute left-4 top-3 px-1 text-black/40 bg-white transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                       peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-300">
            Username
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-8">
          <input
            type="password"
            id="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            className="peer w-full px-4 py-3 rounded-lg bg-transparent border border-black/30 
                       text-white outline-none focus:border-blue-400 transition-all"
          />

          <label htmlFor="password"
            className="absolute left-4 top-3 px-1 text-black/40 bg-white transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                       peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-300">
            Password
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold 
                     tracking-wide shadow-lg hover:shadow-blue-500/50 transition-all duration-300 
                     active:scale-95">
          {loading ? 'Logging in...' : 'Login'}
        </button>

      </form>

      <style>{`
        @keyframes bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bg {
          animation: bg 12s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
