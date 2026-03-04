import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Save,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from "lucide-react";

// --- Centered Form Modal (Create & Update) ---
export function RoleFormOverlay({
  isOpen,
  onClose,
  role = null,
  onSave,
}) {
  const isEdit = !!role;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "User",
    permissions: [],
  });

  const permissionCategories = [
    {
      group: "Users",
      items: ["View Users", "Edit Users", "Block Users"],
    },
    {
      group: "Vehicles",
      items: ["Approve Car", "Edit Car", "Delete Car"],
    },
    {
      group: "System",
      items: ["Settings", "View Logs", "Financials"],
    },
  ];

  useEffect(() => {
    if (role && isOpen) {
      setFormData({
        name: role.name,
        description: role.description,
        level: role.level,
        permissions: role.permissions || [],
      });
    } else if (!isEdit) {
      setFormData({
        name: "",
        description: "",
        level: "User",
        permissions: [],
      });
    }
  }, [role, isOpen]);

  const togglePermission = (perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with Close Button */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isEdit ? "bg-amber-50" : "bg-blue-50"}`}
            >
              <Shield
                className={`w-5 h-5 ${isEdit ? "text-amber-600" : "text-[#1E40AF]"}`}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "Update Role" : "Create New Role"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]"
                placeholder="Enter role name..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none"
                placeholder="Brief description of this role..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Permissions
              Scope
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {permissionCategories.map((cat) => (
                <div
                  key={cat.group}
                  className="p-4 border border-gray-100 rounded-xl bg-gray-50/50"
                >
                  <h4 className="text-sm font-bold text-gray-800 mb-3">
                    {cat.group}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => togglePermission(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          formData.permissions.includes(item)
                            ? "bg-[#1E40AF] border-[#1E40AF] text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1a3699] shadow-lg shadow-blue-100 transition-colors"
          >
            <Save className="w-4 h-4" />{" "}
            {isEdit ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Centered Delete Modal ---
export function DeleteRoleModal({
  isOpen,
  onClose,
  roleName,
  onConfirm,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button Header (X) */}
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900">
            Delete Role?
          </h3>
          <p className="mt-3 text-sm text-center text-gray-500 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-800">
              "{roleName}"
            </span>
            ? Users assigned to this role will lose their
            specific permissions immediately.
          </p>

          <div className="mt-8 flex flex-col gap-2">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-100 transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Keep Role
            </button>
          </div>
        </div>

        <div className="bg-amber-50 px-6 py-3 flex items-center justify-center gap-2 border-t border-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
            This action cannot be undone
          </span>
        </div>
      </div>
    </div>
  );
}