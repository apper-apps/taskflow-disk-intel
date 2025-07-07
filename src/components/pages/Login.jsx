import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/App';

function Login() {
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
return (
    <div 
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)
        `,
      }}
    >
      <div 
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: `
            linear-gradient(145deg, 
              rgba(255, 255, 255, 0.9) 0%,
              rgba(248, 250, 252, 0.95) 25%,
              rgba(241, 245, 249, 0.3) 50%,
              rgba(255, 255, 255, 0.9) 100%
            )
          `,
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 12px 30px rgba(0, 0, 0, 0.1),
            inset 1px 1px 0 rgba(255, 255, 255, 0.3)
          `,
        }}
      >
        <div className="p-10">
          <div className="flex flex-col gap-8 items-center justify-center mb-8">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl"
              style={{
                background: `
                  linear-gradient(135deg, 
                    #3b82f6 0%, 
                    #8b5cf6 25%, 
                    #06b6d4 50%, 
                    #3b82f6 100%
                  )
                `,
                boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2)',
              }}
            >
              T
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <h1 
                className="text-center text-2xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)'
                }}
              >
                Sign in to TaskFlow
              </h1>
              <p className="text-center text-sm text-gray-600 font-medium">
                Welcome back, please sign in to continue
              </p>
            </div>
          </div>
          
          <div id="authentication" className="mb-8" />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-primary hover:text-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;