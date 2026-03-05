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
  CreditCard // Thêm icon CreditCard
} from "lucide-react";

export function MyAccount({ onClose }) {
  const [activeSection, setActiveSection] = useState("bookings");

  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  // State mới cho nút thanh toán
  const [isPaying, setIsPaying] = useState(false);

  // --- User profile state (fetch from backend) ---
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingUser(true);
      setUserError("");
      try {
        const res = await userAPI.getMyProfile();
        // userAPI.getMyProfile returns the full response object; API shape is { data: { ... } }
        const profile = res && res.data ? res.data : res;
        setUser(profile);
      } catch (err) {
        console.error("Failed to load profile", err);
        setUserError("Failed to load profile");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  // If backend doesn't provide avatarUrl, fallback to a generated avatar with user's name
  const avatarSrc = (user) => {
    if (!user)
      return `https://ui-avatars.com/api/?name=User&background=1E40AF&color=fff&size=200`;
    if (user.avatarUrl) return user.avatarUrl;
    const name = user.fullName || user.email || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=1E40AF&color=fff&size=200`;
  };

  // Tách hàm fetchHistory ra bằng useCallback để có thể gọi lại sau khi thanh toán xong
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setHistoryError("");
    try {
      const data = await bookingApi.getHistory();
      // Map backend history items into UI booking card format
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
        status: item.status.toLowerCase(), // status từ DB sẽ thành pending_approval, pending_payment...
        hasReview: false,
      }));
      setHistory(mapped);
    } catch (err) {
      console.error("Failed to load booking history", err);
      setHistoryError("Failed to load booking history");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // --- THÊM HÀM XỬ LÝ THANH TOÁN ---
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

  const sidebarItems = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "bookings", label: "My Trips", icon: Calendar },
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
                  <span>
                  {booking.startDate} - {booking.endDate}
                </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{booking.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{booking.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <span>{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {booking.status === "completed" && !booking.hasReview && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl hover:bg-[#ea6a0a] transition-colors text-sm font-semibold">
                      <Star className="w-4 h-4" />
                      Write a review
                    </button>
                )}
                {booking.status === "in-progress" && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors text-sm font-semibold">
                      Contact the host
                    </button>
                )}

                {/* --- NÚT PAY NOW HIỆN RA KHI ĐANG Ở TRẠNG THÁI CHỜ THANH TOÁN --- */}
                {booking.status === "pending_payment" && (
                    <button
                        onClick={() => handlePayment(booking.id)}
                        disabled={isPaying}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      {isPaying ? "Processing..." : "Pay Now"}
                    </button>
                )}

                <button
                    onClick={() => handleViewDetails(booking.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                >
                  View details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };

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
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isLoadingUser
                          ? "Loading..."
                          : user?.fullName || "Guest User"}
                    </h2>
                    {user?.licenseVerified && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <Shield className="w-4 h-4" />
                      Verified
                    </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user?.phoneNumber || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden lg:flex gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {history.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {user?.walletBalance
                          ? new Intl.NumberFormat("vi-VN").format(
                          user.walletBalance
                      ) + "đ"
                          : "0đ"}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        Wallet
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userError && <div className="mt-4 text-red-600">{userError}</div>}
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

                    {isLoadingHistory && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-600">
                          Loading booking history...
                        </div>
                    )}

                    {historyError && (
                        <div className="bg-white border border-red-200 rounded-xl p-6 text-center text-red-600">
                          {historyError}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoadingHistory && history.length === 0 && !historyError && (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No trips yet
                          </h3>
                          <p className="text-gray-600 mb-6">
                            You don't have any trip history yet
                          </p>
                          <button onClick={onClose} className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors font-semibold">
                            Search cars now
                          </button>
                        </div>
                    )}
                  </div>
                </>
            )}

            {/* Other Sections Placeholder */}
            {activeSection !== "bookings" && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeSection === "info" && (
                        <User className="w-8 h-8 text-gray-400" />
                    )}
                    {activeSection === "wallet" && (
                        <Wallet className="w-8 h-8 text-gray-400" />
                    )}
                    {activeSection === "settings" && (
                        <Settings className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeSection === "info" && "Personal Information"}
                    {activeSection === "wallet" && "My Wallet"}
                    {activeSection === "settings" && "Settings"}
                  </h3>
                  <p className="text-gray-600">This feature is under development</p>
                </div>
            )}
          </div>
        </div>

        {selectedBooking && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Booking details
                </h3>

                {isLoadingDetail ? (
                    <p className="text-gray-600">Loading...</p>
                ) : detailError ? (
                    <p className="text-red-600">{detailError}</p>
                ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Booking code:</span>{" "}
                        {selectedBooking.bookingCode}
                      </p>
                      <p>
                        <span className="font-semibold">Car ID:</span>{" "}
                        {selectedBooking.carId}
                      </p>
                      <p>
                        <span className="font-semibold">Start:</span>{" "}
                        {new Date(selectedBooking.startTime).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-semibold">End:</span>{" "}
                        {new Date(selectedBooking.endTime).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-semibold">Total price:</span>{" "}
                        {formatPrice(selectedBooking.totalPrice)}
                      </p>
                      <p>
                        <span className="font-semibold">Deposit:</span>{" "}
                        {formatPrice(selectedBooking.depositAmount)}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {selectedBooking.status}
                      </p>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}