import { useState } from 'react';
import { Shield, ShieldCheck, Edit, Trash2, Plus, Search, Users, ChevronRight } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { RoleFormOverlay, DeleteRoleModal } from './roles-overlay'; // Import từ file trên

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // States cho Overlay
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const rolesData = [
    { id: 1, name: 'Admin', description: 'Toàn quyền quản trị hệ thống.', userCount: 2, permissions: ['All Access'], level: 'System', color: 'text-purple-600 bg-purple-100', isDeletable: false },
    { id: 2, name: 'Nhân viên', description: 'Vận hành và hỗ trợ khách hàng.', userCount: 5, permissions: ['Manage Cars', 'Support'], level: 'Operation', color: 'text-blue-600 bg-blue-100', isDeletable: true },
    { id: 3, name: 'Chủ xe', description: 'Quản lý xe và xem doanh thu.', userCount: 120, permissions: ['Register Car'], level: 'User', color: 'text-emerald-600 bg-emerald-100', isDeletable: true }
  ];

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const filteredRoles = rolesData.filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Roles</h1>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E40AF] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3699]">
          <Plus className="w-4 h-4" /> Create New Role
        </button>
      </div>

      <Card className="p-6 rounded-xl border-gray-200">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search roles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="flex flex-col h-full rounded-xl border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${role.color}`}><Shield className="w-6 h-6" /></div>
                  <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(role)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-[#1E40AF]"><Edit className="w-4 h-4" /></button>
                  {role.isDeletable && <button onClick={() => handleDeleteClick(role)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6 line-clamp-2 h-10 leading-relaxed">{role.description}</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {perm}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" /> <span>{role.userCount} users</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-[#1E40AF]">Details <ChevronRight className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>

      {/* Render Overlays */}
      <RoleFormOverlay 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        role={selectedRole}
        onSave={(data) => { console.log("Saved Data:", data); setIsFormOpen(false); }}
      />
      <DeleteRoleModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        roleName={selectedRole?.name}
        onConfirm={() => { console.log("Deleted ID:", selectedRole.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
}