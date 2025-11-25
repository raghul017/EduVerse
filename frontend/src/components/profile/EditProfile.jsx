import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import api from '../../utils/api.js';

function EditProfile ({ profile, onUpdated }) {
  const [form, setForm] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    interests: profile?.interests?.join(', ') || ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Saving...');
    try {
      const { data } = await api.put(`/users/${profile.id}`, {
        ...form,
        interests: form.interests.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
      onUpdated(data);
      setStatus('Saved!');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
      <Input label="Name" name="name" value={form.name} onChange={handleChange} />
      <Input label="Bio" name="bio" value={form.bio} onChange={handleChange} />
      <Input
        label="Interests (comma separated)"
        name="interests"
        value={form.interests}
        onChange={handleChange}
      />
      {status && (
        <p className={`text-sm ${status.includes('Saved') ? 'text-green-400' : 'text-red-400'}`}>
          {status}
        </p>
      )}
      <Button type="submit">Save changes</Button>
    </form>
  );
}

export default EditProfile;
