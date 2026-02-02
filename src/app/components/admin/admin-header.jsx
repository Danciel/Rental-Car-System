import { Search, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

export function AdminHeader({ breadcrumbs }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-inter">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <span 
              className={index === breadcrumbs.length - 1 
                ? 'text-[#1E40AF] font-semibold' 
                : 'text-gray-500'
              }
            >
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Right Section: Search + Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent
                     text-sm font-inter"
          />
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <Avatar className="w-9 h-9 bg-[#1E40AF]">
            <AvatarFallback className="bg-[#1E40AF] text-white text-sm font-semibold">
              NQT
            </AvatarFallback>
          </Avatar>
          <div className="font-inter">
            <p className="text-sm font-semibold text-gray-900">Nguyễn Quản Trị</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
