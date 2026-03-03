import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';

export function AdminLayout({ currentPage, onNavigate, breadcrumbs, children, onBackToSite }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      <AdminSidebar currentPage={currentPage} onNavigate={onNavigate} onBackToSite={onBackToSite} />
      
      <div className="ml-[260px]">
        <AdminHeader breadcrumbs={breadcrumbs} />
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
