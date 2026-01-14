import { useState } from 'react';
import { validateEmail } from '../../utils/validators.js';
import { useAuthStore } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function LoginForm () {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(form.email) || !form.password) {
      setFormError('Enter a valid email and password.');
      return;
    }
    try {
      await login(form);
      navigate('/');
    } catch {
      // handled via store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">EMAIL</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#A1FF62]"
        />
      </div>
      
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">PASSWORD</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#A1FF62]"
        />
      </div>
      
      {(formError || error) && (
        <p className="text-red-400 text-[13px]">{formError || error}</p>
      )}
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full px-5 py-3 bg-[#A1FF62] hover:bg-[#b8ff8a] disabled:opacity-40 text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all mt-6"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> SIGNING IN...</> : 'LOGIN'}
      </button>
    </form>
  );
}

export default LoginForm;
