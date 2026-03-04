import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentPage?: 'home' | 'search' | 'admin';
  onNavigate?: (page: 'home' | 'search' | 'admin') => void;
}

export function Navbar({ currentPage = 'home', onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (page: 'home' | 'search' | 'admin', anchor?: string) => {
    if (onNavigate) {
      onNavigate(page);
      setMobileMenuOpen(false);
      
      // If staying on home page and there's an anchor, scroll to it after a brief delay
      if (page === 'home' && anchor) {
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E40AF' }}>
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">AutoShare</span>
          </button>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-[#1E40AF]' : 'text-gray-700 hover:text-[#1E40AF]'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('search')}
              className={`transition-colors ${currentPage === 'search' ? 'text-[#1E40AF]' : 'text-gray-700 hover:text-[#1E40AF]'}`}
            >
              Search Cars
            </button>
            <button 
              onClick={() => handleNavigation('home', 'host')}
              className="text-gray-700 hover:text-[#1E40AF] transition-colors"
            >
              Become a Host
            </button>
          </div>

          {/* Right Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => handleNavigation('admin')}
              className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors"
            >
              Admin
            </button>
            <button className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors">
              Login
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1E40AF' }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleNavigation('home')}
                className={`text-left px-2 py-1 transition-colors ${currentPage === 'home' ? 'text-[#1E40AF]' : 'text-gray-700 hover:text-[#1E40AF]'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('search')}
                className={`text-left px-2 py-1 transition-colors ${currentPage === 'search' ? 'text-[#1E40AF]' : 'text-gray-700 hover:text-[#1E40AF]'}`}
              >
                Search Cars
              </button>
              <button 
                onClick={() => handleNavigation('home', 'host')}
                className="text-left px-2 py-1 text-gray-700 hover:text-[#1E40AF] transition-colors"
              >
                Become a Host
              </button>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                <button 
                  onClick={() => handleNavigation('admin')}
                  className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors text-left"
                >
                  Admin
                </button>
                <button className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors text-left">
                  Login
                </button>
                <button 
                  className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#1E40AF' }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}