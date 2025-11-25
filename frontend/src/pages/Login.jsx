import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

function Login () {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="text-slate-400">Sign in to continue your learning journey.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-400">
        New to EduVerse?{' '}
        <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;
