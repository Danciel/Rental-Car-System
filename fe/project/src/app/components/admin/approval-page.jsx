import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { CheckCircle, XCircle, Search, Clock, ShieldCheck, Car, Eye, CalendarClock } from 'lucide-react';
import { RejectModal, DetailViewModal } from './approval-overlay';

export function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('booking'); // Đặt tab mặc định là booking
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State quản lý Booking thật từ Backend
  const [bookingApprovals, setBookingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Data cũ của bạn (Giữ nguyên)
  const userApprovals = [
    { id: 'U1', user: 'Nguyễn Văn A', type: 'Xác minh CCCD', date: '2024-05-15', status: 'pending' },
    { id: 'U2', user: 'Lê Thị B', type: 'Bằng lái xe B2', date: '2024-05-16', status: 'pending' }
  ];

  const carApprovals = [
    { id: 'C1', user: 'Trần Minh C', carName: 'VinFast VF8', plate: '51G-123.45', date: '2024-05-14', status: 'pending' },
    { id: 'C2', user: 'Hoàng Văn D', carName: 'Toyota Camry', plate: '30H-999.99', date: '2024-05-17', status: 'pending' }
  ];

  // ==========================================
  // LOGIC GỌI API BACKEND
  // ==========================================
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await fetch('http://localhost:8080/api/bookings/manage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        // Chỉ lấy những Booking đang ở trạng thái chờ duyệt
        const pendings = json.data.filter(b => b.status === 'PENDING_APPROVAL');
        // Map lại dữ liệu cho khớp với cấu trúc bảng của bạn
        const mappedData = pendings.map(b => ({
          id: b.id,
          user: `Mã đơn: ${b.bookingCode}`, // Tạm dùng mã đơn vì Backend chưa trả User Name
          type: `Xe ID: ${b.carId} | Giá: ${b.totalPrice}$`,
          date: new Date(b.createdAt).toLocaleDateString('vi-VN'),
          status: 'pending',
          originalData: b // Lưu lại data gốc để dùng cho Modal Detail
        }));
        setBookingApprovals(mappedData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'booking') {
      fetchBookings();
    }
  }, [activeTab]);

  // Xử lý nút Duyệt
  const handleApprove = async (req) => {
    if (activeTab === 'booking') {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        // Gọi API Chủ xe phản hồi (accept=true)
        const res = await fetch(`http://localhost:8080/api/bookings/${req.id}/respond?accept=true`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          alert("Đã DUYỆT yêu cầu thuê xe thành công!");
          fetchBookings(); // Tải lại danh sách
        } else {
          const errData = await res.json();
          alert(errData.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(`Approved mock data: ${req.id}`);
    }
  };

  // Xử lý nút Từ chối
  const confirmReject = async (reason) => {
    if (activeTab === 'booking') {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        // Gọi API Chủ xe phản hồi (accept=false)
        const res = await fetch(`http://localhost:8080/api/bookings/${selectedRequest.id}/respond?accept=false`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          alert("Đã TỪ CHỐI yêu cầu thuê xe.");
          fetchBookings(); // Tải lại danh sách
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(`Rejected ${selectedRequest.id} with reason: ${reason}`);
    }
    setIsRejectModalOpen(false);
  };
  // ==========================================

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  // Quyết định xem đang hiển thị mảng dữ liệu nào
  const currentData = activeTab === 'user' ? userApprovals :
      activeTab === 'car' ? carApprovals :
          bookingApprovals;

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Center</h1>
            <p className="text-sm text-gray-600 mt-1">Review and approve system requests</p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
          <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'booking' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarClock className="w-4 h-4" /> Booking Requests
          </button>
          <button
              onClick={() => setActiveTab('user')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'user' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ShieldCheck className="w-4 h-4" /> User Verification
          </button>
          <button
              onClick={() => setActiveTab('car')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'car' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Car className="w-4 h-4" /> Car Registration
          </button>
        </div>

        {/* Table Section */}
        <Card className="rounded-2xl border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Submit Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {isLoading ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : currentData.length === 0 ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-500">Không có yêu cầu nào cần duyệt.</td></tr>
            ) : currentData.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{req.user}</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit mt-1">
                      {activeTab === 'user' ? req.type :
                          activeTab === 'car' ? req.carName : req.type}
                    </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Clock className="w-4 h-4" /> {req.date}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleViewDetail(req)} className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors" title="Quick View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRejectClick(req)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button onClick={() => handleApprove(req)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </Card>

        {/* Modals */}
        <DetailViewModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            data={selectedRequest}
            type={activeTab}
        />
        <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={confirmReject}
            title={activeTab === 'user' ? selectedRequest?.user :
                activeTab === 'car' ? selectedRequest?.carName : selectedRequest?.user}
        />
      </div>
  );
}