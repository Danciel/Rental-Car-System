import { Car, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { userAPI } from '../api/user';

interface NavbarProps {
  currentPage?: 'home' | 'search' | 'admin' | 'login' | 'list-car' | 'account';
  onNavigate?: (page: 'home' | 'search' | 'admin' | 'login' | 'list-car' | 'account') => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  // Bạn có thể mở rộng thêm avatarUrl, roles... nếu cần
}

export function Navbar({ currentPage = 'home', onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Tự động kiểm tra Token và lấy Profile khi Navbar được render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
          const res = await userAPI.getMyProfile();
          // Backend trả về chuẩn ApiResponse.success(data) nên profile sẽ nằm trong res.data
          setUser(res.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        // Nếu token hết hạn hoặc sai, hệ thống tự dọn dẹp
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER_EMAIL");
      }
    };
    fetchProfile();
  }, []);

  const handleNavigation = (page: 'home' | 'search' | 'admin' | 'login' | 'list-car' | 'account', anchor?: string) => {
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

  const handleLogout = () => {
    // Xóa Token, reset state và điều hướng về trang chủ (không reload toàn bộ trang)
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_EMAIL");
    setUser(null);
    handleNavigation('home');
    window.location.reload();
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

              {/* ĐOẠN KIỂM TRA ĐĂNG NHẬP */}
              {user ? (
                  <div className="flex items-center gap-4 pl-2 border-l border-gray-200 ml-2">
                    <button
                        onClick={() => handleNavigation('account')}
                        className="flex items-center gap-2 font-medium text-[#1E40AF] hover:text-[#1a3699] transition-colors"
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="truncate max-w-[150px]">{user.fullName}</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Log out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
              ) : (
                  <>
                    <button
                        onClick={() => handleNavigation('login')}
                        className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors"
                    >
                      Login
                    </button>
                    <button
                        onClick={() => handleNavigation('login')}
                        className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#1E40AF' }}
                    >
                      Sign Up
                    </button>
                  </>
              )}
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

                    {/* ĐOẠN KIỂM TRA ĐĂNG NHẬP CHO MOBILE */}
                    {user ? (
                        <>
                          <button
                              onClick={() => handleNavigation('account')}
                              className="flex items-center gap-2 px-4 py-2 font-medium text-[#1E40AF] hover:bg-gray-50 transition-colors text-left"
                          >
                            <UserCircle className="w-5 h-5" />
                            {user.fullName}
                          </button>
                          <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-5 h-5" />
                            Logout
                          </button>
                        </>
                    ) : (
                        <>
                          <button
                              onClick={() => handleNavigation('login')}
                              className="px-4 py-2 text-gray-700 hover:text-[#1E40AF] transition-colors text-left"
                          >
                            Login
                          </button>
                          <button
                              onClick={() => handleNavigation('login')}
                              className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                              style={{ backgroundColor: '#1E40AF' }}
                          >
                            Sign Up
                          </button>
                        </>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}