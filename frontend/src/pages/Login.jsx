import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

function Login () {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-text/60">Sign in to continue your learning journey.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-text/60">
        New to EduVerse?{' '}
        <Link to="/signup" className="text-primary font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;
