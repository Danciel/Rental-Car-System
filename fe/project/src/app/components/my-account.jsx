import { useEffect, useState, useCallback } from "react";
import { bookingApi } from "../api/api";
import { bookingAPI } from "../api/booking"; // Thêm dòng này để import API thanh toán
import { userAPI } from "../api/user";
import {
  User,
  Calendar,
  Wallet,
  Settings,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  CreditCard,
  Briefcase,
  XCircle
} from "lucide-react";

export function MyAccount({ onClose }) {
  const [activeSection, setActiveSection] = useState("bookings");

  // --- State cho Khách Hàng (My Trips) ---
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // --- State cho Chủ Xe (Host Dashboard) ---
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [isLoadingOwner, setIsLoadingOwner] = useState(false);

  // --- State chung ---
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingUser(true);
      try {
        const res = await userAPI.getMyProfile();
        setUser(res && res.data ? res.data : res);
      } catch (err) {
        setUserError("Failed to load profile");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  const avatarSrc = (user) => {
    if (!user)
      return `https://ui-avatars.com/api/?name=User&background=1E40AF&color=fff&size=200`;
    if (user.avatarUrl) return user.avatarUrl;
    const name = user.fullName || user.email || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=1E40AF&color=fff&size=200`;
  };

  // ==========================================
  // FETCH DATA KHÁCH HÀNG (MY TRIPS)
  // ==========================================
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const data = await bookingApi.getHistory();
      const mapped = data.map((item) => ({
        id: item.id,
        car: {
          name: `Car #${item.carId}`,
          image:
              "https://images.unsplash.com/photo-1654870646430-e5b6f2c0fa93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          licensePlate: "Updating...",
        },
        startDate: new Date(item.startTime).toLocaleDateString("vi-VN"),
        endDate: new Date(item.endTime).toLocaleDateString("vi-VN"),
        duration: "",
        location: "",
        totalPrice: Number(item.totalPrice),
        status: item.status.toLowerCase(),
        hasReview: false,
      }));
      setHistory(mapped);
    } catch (err) {
      setHistoryError("Failed to load booking history");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // ==========================================
  // FETCH DATA CHỦ XE (HOST DASHBOARD)
  // ==========================================
  const fetchOwnerBookings = useCallback(async () => {
    setIsLoadingOwner(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      // GỌI API LẤY DANH SÁCH ĐƠN NGƯỜI KHÁC ĐẶT XE CỦA MÌNH
      // Giả sử API của bạn là /api/bookings/owner-requests
      const res = await fetch('http://localhost:8080/api/bookings/manage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        // Lọc ra các đơn đang chờ duyệt
        const pendings = json.data.filter(b => b.status === 'PENDING_APPROVAL');
        const mappedData = pendings.map(b => ({
          id: b.id,
          carName: `Xe ID: ${b.carId}`, // Thay bằng tên thật nếu BE có trả về
          customerName: `Mã đơn: ${b.bookingCode}`, // Thay bằng tên khách nếu BE có trả về
          startDate: new Date(b.startTime).toLocaleDateString('vi-VN'),
          endDate: new Date(b.endTime).toLocaleDateString('vi-VN'),
          totalPrice: b.totalPrice,
          status: b.status.toLowerCase()
        }));
        setOwnerBookings(mappedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingOwner(false);
    }
  }, []);

  useEffect(() => {
    if (activeSection === "bookings") fetchHistory();
    if (activeSection === "owner") fetchOwnerBookings();
  }, [activeSection, fetchHistory, fetchOwnerBookings]);

  // --- LOGIC THANH TOÁN CỦA KHÁCH HÀNG ---
  const handlePayment = async (bookingId) => {
    if (isPaying) return;
    try {
      setIsPaying(true);
      await bookingAPI.mockPayment(bookingId);
      alert("Thanh toán thành công! Hợp đồng đã được tạo và xe đã được khóa lịch.");
      fetchHistory(); // Gọi lại hàm fetch để cập nhật ngay lập tức giao diện sang Confirmed
    } catch (error) {
      console.error(error);
      alert(error.message || "Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setIsPaying(false);
    }
  };

  // --- LOGIC DUYỆT/TỪ CHỐI CỦA CHỦ XE ---
  const handleOwnerRespond = async (bookingId, isAccept) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}/respond?accept=${isAccept}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert(isAccept ? "Đã DUYỆT yêu cầu thuê xe!" : "Đã TỪ CHỐI yêu cầu thuê xe!");
        fetchOwnerBookings(); // Tải lại danh sách đơn của chủ xe
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = async (bookingId) => {
    setIsLoadingDetail(true);
    setDetailError("");
    try {
      const detail = await bookingApi.getById(bookingId);
      setSelectedBooking(detail);
    } catch (err) {
      console.error("Failed to load booking detail", err);
      setDetailError("Failed to load booking detail");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // --- CẤU HÌNH SIDEBAR (Thêm tab Owner) ---
  const sidebarItems = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "bookings", label: "My Trips", icon: Calendar },
    { id: "owner", label: "Host Dashboard", icon: Briefcase },
    { id: "wallet", label: "My Wallet", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Bổ sung thêm label cho các trạng thái mới
  // Bổ sung thêm trạng thái "rejected"
  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        label: "Completed",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      "in-progress": {
        label: "In progress",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700 border-red-200",
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-700 border-red-200",
      },
      confirmed: {
        label: "Confirmed",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      pending_approval: {
        label: "Waiting for approval",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      },
      pending_payment: {
        label: "Pending Payment",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      pending: {
        label: "Pending confirmation",
        color: "bg-gray-100 text-gray-700 border-gray-200",
      },
    };
    return badges[status] || badges.pending;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const renderBookingCard = (booking) => {
    const badge = getStatusBadge(booking.status);

    return (
        <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex gap-4">
            {/* Car Image */}
            <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                  src={booking.car.image}
                  alt={booking.car.name}
                  className="w-full h-full object-cover"
              />
            </div>

            {/* Booking Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {booking.car.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    License plate: {booking.car.licensePlate}
                  </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                >
                {badge.label}
              </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{booking.startDate} - {booking.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <span>{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                {booking.status === "pending_payment" && (
                    <button onClick={() => handlePayment(booking.id)} disabled={isPaying} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold">
                      <CreditCard className="w-4 h-4" /> {isPaying ? "Processing..." : "Pay Now"}
                    </button>
                )}
                <button onClick={() => handleViewDetails(booking.id)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
                  View details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };

  // Render Card cho Host Dashboard (Chủ xe duyệt đơn)
  const renderOwnerCard = (request) => (
      <div key={request.id} className="bg-white border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{request.carName}</h3>
            <p className="text-sm text-gray-600 font-medium">Khách hàng: <span className="text-blue-600">{request.customerName}</span></p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
          Cần bạn duyệt
        </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-gray-500 mb-1">Thời gian thuê</p>
            <p className="font-semibold text-gray-900">{request.startDate} - {request.endDate}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Dự kiến thu về</p>
            <p className="font-bold text-green-600 text-base">{formatPrice(request.totalPrice)}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
              onClick={() => handleOwnerRespond(request.id, false)}
              className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Từ chối
          </button>
          <button
              onClick={() => handleOwnerRespond(request.id, true)}
              className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl hover:bg-blue-800 transition-colors text-sm font-bold flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Chấp nhận cho thuê
          </button>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Auto<span className="text-[#1E40AF]">Share</span>
            </h1>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                                ? "bg-[#1E40AF] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                );
              })}
            </nav>
          </div>

          {/* Back Button */}
          <div className="p-6 border-t border-gray-200">
            <button
                onClick={onClose}
                className="w-full px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              ← Back to home
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                      src={avatarSrc(user)}
                      alt={user?.fullName || user?.email || "User"}
                      className="w-24 h-24 rounded-full border-4 border-[#1E40AF]/20"
                  />
                  {user?.licenseVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-[#1E40AF] text-white rounded-full p-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{isLoadingUser ? "Loading..." : user?.fullName || "Guest User"}</h2>
                  <div className="flex flex-col gap-1 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{user?.email || "-"}</span></div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{user?.phoneNumber || "-"}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            {activeSection === "bookings" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Trips
                  </h2>

                  {/* History Only */}
                  <div className="space-y-4">
                    {!isLoadingHistory && history.map(renderBookingCard)}
                    {isLoadingHistory && <div className="p-6 text-center text-gray-500">Loading trips...</div>}
                    {!isLoadingHistory && history.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                          <p className="text-gray-600">Bạn chưa có chuyến đi nào.</p>
                        </div>
                    )}
                  </div>
                </>
            )}

            {/* TAB HOST DASHBOARD (CHỦ XE) */}
            {activeSection === "owner" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Host Dashboard</h2>
                  <div className="space-y-4">
                    {!isLoadingOwner && ownerBookings.map(renderOwnerCard)}
                    {isLoadingOwner && <div className="p-6 text-center text-gray-500">Loading requests...</div>}
                    {!isLoadingOwner && ownerBookings.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có yêu cầu thuê xe</h3>
                          <p className="text-gray-600">Khi có người đặt xe của bạn, yêu cầu sẽ hiện ở đây.</p>
                        </div>
                    )}
                  </div>
                </>
            )}

          </div>
        </div>
      </div>
  );
}