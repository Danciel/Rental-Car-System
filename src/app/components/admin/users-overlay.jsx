import { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Save, Trash2, AlertCircle } from 'lucide-react';

export function UserFormOverlay({ isOpen, onClose, user = null, onSave }) {
  const isEdit = !!user;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Khách thuê', // Mock Data Value
    status: 'active'
  });

  // Mock Data Values for roles
  const roles = ['Admin', 'Nhân viên', 'Chủ xe', 'Khách thuê'];

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else if (!isEdit) {
      setFormData({ name: '', email: '', role: 'Khách thuê', status: 'active' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEdit ? 'bg-amber-50' : 'bg-blue-50'}`}>
              <User className={`w-5 h-5 ${isEdit ? 'text-amber-600' : 'text-[#1E40AF]'}`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Update User' : 'Create New User'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]" 
                placeholder="Enter full name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]" 
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none"
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setFormData({...formData, status: 'active'})}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.status === 'active' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setFormData({...formData, status: 'blocked'})}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.status === 'blocked' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Blocked
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-colors">
            <Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteUserModal({ isOpen, onClose, userName, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900">Delete User?</h3>
        <p className="mt-3 text-sm text-center text-gray-500 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-gray-800">{userName}</span>? This action cannot be undone.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <button onClick={onConfirm} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-100 transition-colors">Confirm Delete</button>
          <button onClick={onClose} className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}