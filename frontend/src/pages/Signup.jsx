import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm.jsx';

function Signup () {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#A1FF62] mb-4 tracking-[0.15em] font-mono px-4 py-2 rounded-full" style={{ backgroundColor: '#201D1D' }}>
            <span className="w-2 h-2 bg-[#A1FF62] rounded-full animate-pulse"></span>
            [ JOIN EDUVERSE ]
          </div>
          <h1 className="text-[32px] font-bold text-[#201D1D] mb-2">Create an account</h1>
          <p className="text-[#666] text-[14px]">Start your learning journey today</p>
        </div>
        
        {/* Form Container - Dark Pod */}
        <div className="p-8 rounded-[32px]" style={{ backgroundColor: '#201D1D' }}>
          <SignupForm />
        </div>
        
        <p className="text-center text-[13px] text-[#666] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#A1FF62] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
