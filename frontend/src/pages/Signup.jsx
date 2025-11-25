import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm.jsx';

function Signup () {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-wide text-blue-400">Join EduVerse</p>
        <h1 className="text-3xl font-semibold text-white">Teach and learn together</h1>
        <p className="text-slate-400">
          Publish educational shorts, get AI summaries, and grow study communities.
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
