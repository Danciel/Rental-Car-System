import { useState } from 'react';
import { Search, Edit, Trash2, User, Plus } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { UserFormOverlay, DeleteUserModal } from './users-overlay';

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Overlay States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock Data
  const usersData = [
    { id: 1, name: 'Lê Văn Nam', email: 'levannam@example.com', role: 'Chủ xe', joinDate: '15/03/2024', status: 'active' },
    { id: 2, name: 'Nguyễn Thị Mai', email: 'nguyenthimai@example.com', role: 'Khách thuê', joinDate: '22/04/2024', status: 'active' },
    { id: 3, name: 'Trần Hoàng Anh', email: 'tranhoanganh@example.com', role: 'Nhân viên', joinDate: '10/01/2024', status: 'active' },
    { id: 4, name: 'Phạm Minh Tuấn', email: 'phamminhtuan@example.com', role: 'Admin', joinDate: '05/01/2024', status: 'active' },
    { id: 6, name: 'Vũ Quang Hải', email: 'vuquanghai@example.com', role: 'Chủ xe', joinDate: '28/02/2024', status: 'blocked' },
  ];

  const handleCreate = () => {
    setCurrentUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (user) => {
    setCurrentUser(user);
    setIsDeleteOpen(true);
  };

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Nhân viên': return 'bg-blue-100 text-blue-700';
      case 'Chủ xe': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage system accounts and access levels</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm bg-white"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Nhân viên">Staff</option>
              <option value="Chủ xe">Car Owner</option>
              <option value="Khách thuê">Renter</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 'active' ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-50 rounded-lg group" title="Edit User"><Edit className="w-4 h-4 text-gray-400 group-hover:text-[#1E40AF]" /></button>
                      <button onClick={() => handleDeleteRequest(user)} className="p-2 hover:bg-red-50 rounded-lg group" title="Delete User"><Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Overlays */}
      <UserFormOverlay 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        user={currentUser}
        onSave={(data) => { console.log("Form Saved:", data); setIsFormOpen(false); }}
      />
      <DeleteUserModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        userName={currentUser?.name}
        onConfirm={() => { console.log("User Deleted ID:", currentUser.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
}