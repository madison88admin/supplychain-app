import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import darkLogo from '../images/darklogo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  // Demo users for testing (you can keep these for development)
  const demoUsers = [
    {
      email: 'admin@madison88.com',
      password: 'admin123',
      user: {
        id: 'admin-1',
        name: 'Sample Admin User',
        email: 'admin@madison88.com',
        role: 'Admin' as const,
        department: 'IT',
        avatar: ''
      }
    },
    {
      email: 'production@madison88.com',
      password: 'demo123',
      user: {
        id: 'production-1',
        name: 'Sample Production Manager',
        email: 'production@madison88.com',
        role: 'Production' as const,
        department: 'Production',
        avatar: ''
      }
    },
    {
      email: 'qa@madison88.com',
      password: 'demo123',
      user: {
        id: 'qa-1',
        name: 'Sample QA Specialist',
        email: 'qa@madison88.com',
        role: 'QA' as const,
        department: 'Quality Assurance',
        avatar: ''
      }
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      // Handle specific Supabase errors
      if (err.message) {
        setError(err.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #2C5A7A 0%, #3D75A3 100%)'
    }}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={darkLogo}
              alt="Madison 88 Logo"
              className="h-20 w-auto"
            />
          </div>
          <p className="text-sm text-gray-600">
            Supply Chain Management System
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="relative">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
            {/* Forgot Password Link */}
            <div className="absolute -bottom-6 right-0">
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                Forgot Password?
              </a>
            </div>
          </div>
        </form>

        {/* Demo Login Buttons */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">
                Demo Accounts
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleDemoLogin('admin@madison88.com', 'admin123')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Admin Login (Full Access)
            </button>
            <button
              onClick={() => handleDemoLogin('production@madison88.com', 'demo123')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Production Login (No Techpack Edit)
            </button>
            <button
              onClick={() => handleDemoLogin('qa@madison88.com', 'demo123')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              QA Login (Techpack Access)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
          <p>Demo credentials for testing purposes</p>
          <p className="mt-1">Admin: admin@madison88.com / admin123 (Full Access)</p>
          <p className="mt-1">Production: production@madison88.com / demo123 (No Techpack Edit)</p>
          <p className="mt-1">QA: qa@madison88.com / demo123 (Techpack Access)</p>
          <p className="mt-3">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 