import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm.jsx';

function Signup () {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Join EduVerse</p>
        <h1 className="text-3xl font-semibold">Teach and learn together</h1>
        <p className="text-text/60">
          Publish educational shorts, get AI summaries, and grow study communities.
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-text/60">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
