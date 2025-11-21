import UploadModal from '../components/upload/UploadModal.jsx';

function Upload () {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-wide text-primary">Share knowledge</p>
        <h1 className="text-3xl font-semibold">Upload an educational short</h1>
        <p className="text-text/60">5-minute limit, focus on clarity and insights.</p>
      </header>
      <UploadModal />
    </div>
  );
}

export default Upload;
