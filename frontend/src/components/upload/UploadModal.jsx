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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Upload a video first.');
      return;
    }
    if (!form.title.trim()) {
      setMessage('Title is required.');
      return;
    }
    
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'tags' && value) {
        payload.append(key, value);
      }
    });
    if (form.tags) {
      payload.append(
        'tags',
        JSON.stringify(form.tags.split(',').map((tag) => tag.trim()).filter(Boolean))
      );
    }
    payload.append('video', file);

    setLoading(true);
    setMessage(null);
    setUploadProgress(0);
    try {
      console.log('[Upload] Starting upload:', { title: form.title, fileSize: file.size, fileName: file.name });
      const response = await api.post('/posts', payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout for large video uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            console.log('[Upload] Progress:', percentCompleted + '%');
          }
        }
      });
      console.log('[Upload] Success:', response.data);
      setMessage('Upload successful! Redirecting...');
      setForm(defaultForm);
      setFile(null);
      // Redirect to videos page after 2 seconds
      setTimeout(() => {
        window.location.href = '/videos';
      }, 2000);
    } catch (error) {
      console.error('[Upload] Error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Upload failed. Please check your connection and try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card border border-border  p-4"
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
            className="bg-card border border-border  px-3 py-2 text-textPrimary focus:outline-none focus:border-accent"
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
      {loading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-textSecondary">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      {message && (
        <p className={`text-sm ${message.includes('successful') ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? (uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Uploading...') : 'Publish lesson'}
      </Button>
    </form>
  );
}

export default UploadModal;
