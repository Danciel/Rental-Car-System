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
import { bookingApi } from '@/app/api/api';
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

  const handleConfirm = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      onConfirm(); // ← just delegate to App.handleConfirmBooking, nothing else
    } catch (err: any) {
      setError(err.message || "Đặt xe thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };// Add inside the component, before return
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

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full mt-6 py-4 bg-orange-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
