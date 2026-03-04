import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Settings,
  BarChart3,
  ArrowLeft,
  MessageSquareText,
  ClipboardCheck
} from 'lucide-react';

export function AdminSidebar({ currentPage, onNavigate, onBackToSite }) {
  const menuItems = [
    { id: 'reports', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User List', icon: Users },
    { id: 'cars', label: 'Car List', icon: Car },
    { id: 'roles', label: 'Role Management', icon: ShieldCheck },
    { id: 'approval', label: 'Request Moderation', icon: ClipboardCheck },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareText },
    { id: 'pricing', label: 'Pricing Settings', icon: DollarSign },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-[#0F172A] text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">
          Auto<span className="text-[#1E40AF]">Share</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 font-inter
                    ${isActive 
                      ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        {onBackToSite && (
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-gray-400 hover:bg-white/5 hover:text-white
                     transition-all duration-200 font-inter mb-3"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Quay lại Website</span>
          </button>
        )}
        <p className="text-xs text-gray-500 px-3">© 2026 AutoShare</p>
      </div>
    </aside>
  );
}
