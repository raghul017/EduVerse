import { useState } from 'react';
import {
  required,
  validateEmail,
  validatePassword
} from '../../utils/validators.js';
import { useAuthStore } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const initial = {
  name: '',
  email: '',
  password: '',
  bio: '',
  interests: ''
};

function SignupForm () {
  const [form, setForm] = useState(initial);
  const [formError, setFormError] = useState(null);
  const { signup, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!required(form.name) || !validateEmail(form.email) || !validatePassword(form.password)) {
      setFormError('Fill out all required fields with valid data.');
      return;
    }
    try {
      await signup({
        ...form,
        interests: form.interests.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
      navigate('/');
    } catch {
      // handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">NAME</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">EMAIL</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">PASSWORD</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
        />
      </div>
      
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">BIO (OPTIONAL)</label>
        <input
          type="text"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
        />
      </div>
      
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">INTERESTS (COMMA SEPARATED)</label>
        <input
          type="text"
          name="interests"
          value={form.interests}
          onChange={handleChange}
          placeholder="React, Python, AI..."
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
        />
      </div>
      
      {(formError || error) && (
        <p className="text-red-400 text-[13px]">{formError || error}</p>
      )}
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full px-5 py-3 bg-[#FF6B35] hover:bg-[#ff7a4a] disabled:opacity-40 text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all mt-6"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> CREATING...</> : 'CREATE ACCOUNT'}
      </button>
    </form>
  );
}

export default SignupForm;
