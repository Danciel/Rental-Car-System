import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

export function LoginSignup({ onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(activeTab === 'login' ? 'Login successful!' : 'Sign up successful!');
  };

  return (
    // Use viewport height; avoid page scroll
    <div className="h-dvh w-full overflow-hidden flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative h-dvh">
        <img
          src="https://images.unsplash.com/photo-1763995222578-19d1d8160ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjBjYXIlMjByb2FkJTIwdHJpcCUyMGhpZ2h3YXklMjBzdW5zZXR8ZW58MXx8fHwxNzcyNjA5NDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Scenic road trip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-4xl font-bold mb-3">Start your journey</h2>
          <p className="text-lg text-white/90">
            Experience seamless car sharing with AutoShare
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-dvh overflow-hidden flex items-center justify-center bg-gray-50">
        {/* Constrain container height */}
        <div className="w-full max-w-md h-full flex flex-col justify-center px-6 py-6">
          {/* Logo (compact) */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Auto<span className="text-[#1E40AF]">Share</span>
            </h1>
            <p className="text-gray-600 mt-1">The leading car-sharing platform</p>
          </div>

          {/* Card: fixed max height + internal scroll */}
          <div className="bg-white rounded-2xl shadow-lg px-6 py-5 flex flex-col min-h-0 max-h-[72dvh]">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 shrink-0">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 pb-3 text-center font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 pb-3 text-center font-semibold transition-all ${
                  activeTab === 'signup'
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Scrollable content area INSIDE card (so page never scrolls) */}
            <div className="min-h-0 flex-1 overflow-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sign Up Only - Name */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                        required={activeTab === 'signup'}
                      />
                    </div>
                  </div>
                )}

                {/* Email/Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email or phone number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com or 0912345678"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Sign Up Only - Phone */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0912345678"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                        required={activeTab === 'signup'}
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password - Login Only */}
                {activeTab === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-[#1E40AF] hover:text-[#1a3699] font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms - Sign Up Only */}
                {activeTab === 'signup' && (
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 text-[#1E40AF] border-gray-300 rounded focus:ring-[#1E40AF]"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-[#1E40AF] hover:text-[#1a3699] font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#1E40AF] hover:text-[#1a3699] font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#1E40AF] text-white py-2.5 rounded-xl font-semibold hover:bg-[#1a3699] transition-colors shadow-lg hover:shadow-xl"
                >
                  {activeTab === 'login' ? 'Log in' : 'Sign up'}
                </button>
              </form>

              {/* Divider + Social */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-600">
                  Want to become a car owner?{' '}
                  <button
                    type="button"
                    className="text-[#F97316] hover:text-[#ea6a0a] font-semibold"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Link (kept outside card, still no page scroll) */}
          {onClose && (
            <div className="mt-4 text-center">
              <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}