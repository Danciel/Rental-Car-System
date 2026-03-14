import { useState, useEffect } from "react";
import { Search, Edit, Trash2, User, Plus, Loader2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { UserFormOverlay, DeleteUserModal } from "./users-overlay";
import { userAPI } from "../../api/user";
import { CustomFilter } from "../ui/filter";

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Overlay States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch data từ API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      if (response && response.data) {
        setUsersData(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const roleOptions = [
    { label: "All Roles", value: "all" },
    { label: "Admin", value: "ROLE_ADMIN" },
    { label: "Car Owner", value: "ROLE_OWNER" },
    { label: "Customer", value: "ROLE_CUSTOMER" },
  ];

  // Logic lọc dữ liệu
  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // Kiểm tra xem user có chứa role được chọn hay không (vì roles là mảng)
    const matchesRole =
      selectedRole === "all" || user.roles?.includes(selectedRole);

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "bg-purple-100 text-purple-700";
      case "ROLE_STAFF":
        return "bg-blue-100 text-blue-700";
      case "ROLE_OWNER":
        return "bg-emerald-100 text-emerald-700";
      case "ROLE_CUSTOMER":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "BANNED":
        return "bg-red-100 text-red-700";
      case "INACTIVE":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system accounts and access levels
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Search & Filter */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm"
            />
          </div>
          {/* Dùng CustomFilter thay cho Select */}
          <div className="min-w-[200px]">
            <CustomFilter
              value={selectedRole}
              options={roleOptions}
              onChange={(val) => setSelectedRole(val)}
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            {" "}
            {/* Thêm table-fixed để kiểm soát width tuyệt đối */}
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                {/* Cột 1: 30% */}
                <th className="w-[30%] py-4 px-6 text-sm font-bold text-gray-700">
                  User Info
                </th>
                {/* Cột 2: 20% */}
                <th className="w-[20%] py-4 px-6 text-sm font-bold text-gray-700">
                  Phone
                </th>
                {/* Cột 3: 25% */}
                <th className="w-[25%] py-4 px-6 text-sm font-bold text-gray-700">
                  Roles
                </th>
                {/* Cột 4: 10% */}
                <th className="w-[10%] py-4 px-6 text-sm font-bold text-gray-700">
                  Status
                </th>
                {/* Cột 5: 15% */}
                <th className="w-[15%] py-4 px-6 text-sm font-bold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <span className="text-gray-500 text-sm">
                      Loading users...
                    </span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm font-medium">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadgeColor(role)}`}
                          >
                            {role.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(user.status)}`}
                      >
                        {user.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-blue-50 rounded-lg group"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-400 group-hover:text-[#1E40AF]" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(user)}
                          className="p-2 hover:bg-red-50 rounded-lg group"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Overlays */}
      <UserFormOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={currentUser}
        onSave={() => {
          fetchUsers();
          setIsFormOpen(false);
        }}
      />
      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        userName={currentUser?.fullName}
        onConfirm={() => {
          /* Logic xóa ở đây */ setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}
