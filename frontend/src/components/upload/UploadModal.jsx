import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import VideoUploader from './VideoUploader.jsx';
import api from '../../utils/api.js';

const defaultForm = {
  title: '',
  description: '',
  subject: 'Science',
  tags: '',
  thumbnail_url: ''
};

function UploadModal () {
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Upload a video first.');
      return;
    }
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'tags') {
        payload.append(key, value);
      }
    });
    payload.append(
      'tags',
      JSON.stringify(form.tags.split(',').map((tag) => tag.trim()).filter(Boolean))
    );
    payload.append('video', file);

    setLoading(true);
    setMessage(null);
    try {
      await api.post('/posts', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Upload successful! Pending review.');
      setForm(defaultForm);
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card border border-border rounded-xl p-4"
    >
      <VideoUploader onFileSelect={setFile} file={file} />
      <Input label="Title" name="title" value={form.title} onChange={handleChange} />
      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <Input
        label="Thumbnail URL (optional)"
        name="thumbnail_url"
        value={form.thumbnail_url}
        onChange={handleChange}
        placeholder="https://images..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-textSecondary">
          Subject
          <select
            name="subject"
            className="bg-card border border-border rounded-xl px-3 py-2 text-textPrimary focus:outline-none focus:border-accent"
            value={form.subject}
            onChange={handleChange}
          >
            {['Math', 'Science', 'Coding', 'Languages', 'Business'].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Tags (comma separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />
      </div>
      {message && (
        <p className={`text-sm ${message.includes('successful') ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Publish lesson'}
      </Button>
    </form>
  );
}

export default UploadModal;
