import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm.jsx';

function Signup () {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            [ JOIN EDUVERSE ]
          </div>
          <h1 className="text-[32px] font-bold text-white mb-2">Create an account</h1>
          <p className="text-[#666] text-[14px]">Start your learning journey today</p>
        </div>
        
        {/* Form Container */}
        <div className="bg-[#111] border border-[#2a2a2a] p-6">
          <SignupForm />
        </div>
        
        <p className="text-center text-[13px] text-[#666] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF6B35] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
