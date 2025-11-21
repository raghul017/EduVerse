import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import {
  required,
  validateEmail,
  validatePassword
} from '../../utils/validators.js';
import { useAuthStore } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';

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
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl p-6 space-y-4 border border-white/5 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold">Create your learning profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="At least 8 characters"
      />
      <Input
        label="Bio"
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Tell learners who you are"
      />
      <Input
        label="Interests (comma separated)"
        name="interests"
        value={form.interests}
        onChange={handleChange}
      />
      {(formError || error) && (
        <p className="text-error text-sm">{formError || error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}

export default SignupForm;

