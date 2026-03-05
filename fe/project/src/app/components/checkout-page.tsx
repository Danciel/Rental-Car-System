import {
  ArrowLeft,
  Star,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Navigation,
  Wind,
  Baby,
  Usb
} from 'lucide-react';
import { Car, reviews as allReviews } from '@/app/data/cars';
import { OwnerProfile } from '@/app/components/owner-profile';
import { ReviewsSection } from '@/app/components/reviews-section';
// IMPORT ĐÚNG FILE API BẠN VỪA TẠO Ở BƯỚC TRƯỚC
import { bookingAPI } from '../api/booking';
import { useState } from 'react';

interface CheckoutPageProps {
  car: Car;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  onBack: () => void;
  onConfirm: () => void;
}

export function CheckoutPage({ car, pickupDate, returnDate, totalDays, totalPrice, onBack, onConfirm }: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm chuyển đổi ngày giờ an toàn (Giữ nguyên giờ Local của trình duyệt, không bị lệch sang UTC)
  const formatLocalISO = (dateStr: string, isEnd: boolean = false) => {
    const d = new Date(dateStr);

    // Nếu dateStr chỉ có ngày mà không có giờ, set giờ mặc định:
    // Nhận xe (start) lúc 08:00 sáng, Trả xe (end) lúc 20:00 tối
    if (d.getHours() === 0) {
      if (isEnd) d.setHours(20, 0, 0);
      else d.setHours(8, 0, 0);
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleConfirm = async () => {
    if (loading) return;

    let isSuccess = false; // Biến cờ hiệu theo dõi trạng thái

    // 1. CHỈ TRY-CATCH CHO VIỆC GỌI API
    try {
      setLoading(true);
      setError(null);

      await bookingAPI.requestBooking({
        carId: Number(car.id),
        startTime: formatLocalISO(pickupDate, false),
        endTime: formatLocalISO(returnDate, true),
        rentalPrice: totalPrice,
        depositAmount: totalPrice
      });

      isSuccess = true; // API chạy thành công thì bật cờ lên

    } catch (err: any) {
      console.error("Lỗi gọi API Booking:", err);
      setError(err.message || "Đặt xe thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }

    // 2. NẾU THÀNH CÔNG MỚI CHẠY UI VÀ CHUYỂN TRANG (Nằm ngoài try-catch)
    if (isSuccess) {
      alert("Đã gửi yêu cầu thuê xe thành công! Vui lòng chờ chủ xe duyệt.");

      // Bọc try-catch riêng cho onConfirm để debug xem lỗi do đâu
      try {
        if (onConfirm) onConfirm();
      } catch (uiError) {
        console.error("Lỗi khi chuyển trang (onConfirm):", uiError);
      }
    }
  };

  const images = car.images || [car.image];

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-96">
                <img src={images[0]} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h1 className="text-3xl font-bold">{car.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <MapPin className="w-4 h-4" /> {car.location}
                <Star className="w-4 h-4 text-yellow-400" /> {car.rating}
              </div>
            </div>

            <OwnerProfile owner={car.owner} />

            <ReviewsSection
                carId={car.id}
                reviews={allReviews}
                rating={car.rating}
                totalReviews={car.reviews}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
            <div className="text-3xl font-bold mb-4">
              ${car.pricePerDay}
              <span className="text-base text-gray-500"> / day</span>
            </div>

            <div className="space-y-4">
              <div className="w-full border p-3 rounded-lg bg-gray-50">{pickupDate}</div>
              <div className="w-full border p-3 rounded-lg bg-gray-50">{returnDate}</div>
            </div>

            {totalDays > 0 && (
                <div className="mt-4 text-lg font-semibold">Total: ${totalPrice}</div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
            )}

            <button
                onClick={handleConfirm}
                disabled={loading}
                className={`w-full mt-6 py-4 text-white rounded-lg font-bold transition-colors ${
                    loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
              {loading ? "Đang xử lý..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
  );
}