import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { validateEmail } from '../../utils/validators.js';
import { useAuthStore } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';

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
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 rounded-xl p-6 space-y-4 border border-white/10 max-w-md mx-auto backdrop-blur-sm"
    >
      <h2 className="text-xl font-semibold text-white">Welcome back</h2>
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      {(formError || error) && (
        <p className="text-red-400 text-sm">{formError || error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </Button>
    </form>
  );
}

export default LoginForm;

