// src/app/components/car-detail-page.tsx
import { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Settings, 
  Users, 
  Fuel, 
  Calendar, 
  Shield, 
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

interface CarDetailPageProps {
  car: Car;
  onBack: () => void;
  onCheckout?: (pickupDate: string, returnDate: string, totalDays: number, totalPrice: number) => void;
}

export function CarDetailPage({ car, onBack, onCheckout }: CarDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const images = car.images || [car.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // ✅ FIX: cùng ngày vẫn tính 1 day để không bị disabled và gọi được onCheckout
  const calculateTotalDays = () => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffMs = end.getTime() - start.getTime();

      if (diffMs < 0) return 0;

      const rawDays = Math.ceil(diffMs / (1000 * 3600 * 24));
      return rawDays === 0 ? 1 : rawDays; // 👈 cùng ngày => 1
    }
    return 0;
  };

  const totalDays = calculateTotalDays();
  const totalPrice = totalDays * car.pricePerDay;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to search</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-96 bg-gray-900">
                <img
                  src={images[currentImageIndex]}
                  alt={`${car.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-blue-600 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{car.location}</span>
                    </div>
                    {car.year && (
                      <span className="text-gray-400">•</span>
                    )}
                    {car.year && (
                      <span>{car.year}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">{car.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({car.reviews} reviews)</span>
                </div>
              </div>
              
              {/* Quick Specs */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{car.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <Fuel className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{car.fuelType}</span>
                </div>
                <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#1E40AF' }}>
                  <span className="text-sm font-semibold text-white">{car.type}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About this car</h2>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {car.additionalInfo && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.additionalInfo.gps && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Navigation className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">GPS Navigation</span>
                    </div>
                  )}
                  {car.additionalInfo.bluetooth && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Wifi className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Bluetooth</span>
                    </div>
                  )}
                  {car.additionalInfo.airConditioning && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Wind className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Air Conditioning</span>
                    </div>
                  )}
                  {car.additionalInfo.childSeat && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Baby className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Child Seat</span>
                    </div>
                  )}
                  {car.additionalInfo.usbPort && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Usb className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">USB Ports</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specifications */}
            {car.specifications && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Brand</p>
                    <p className="font-semibold text-gray-900">{car.specifications.brand}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Model</p>
                    <p className="font-semibold text-gray-900">{car.specifications.model}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Fuel Consumption</p>
                    <p className="font-semibold text-gray-900">{car.specifications.consumption}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Luggage</p>
                    <p className="font-semibold text-gray-900">{car.specifications.luggage} bags</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Doors</p>
                    <p className="font-semibold text-gray-900">{car.specifications.doors} doors</p>
                  </div>
                  {car.licensePlate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">License Plate</p>
                      <p className="font-semibold text-gray-900">{car.licensePlate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rental Policies */}
            {car.policies && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6" style={{ color: '#1E40AF' }} />
                  <h2 className="text-xl font-bold text-gray-900">Rental Policies</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Cancellation Policy</p>
                      <p className="text-gray-600">{car.policies.cancellation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                      <p className="font-semibold text-gray-900">${car.policies.deposit}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Additional Driver</p>
                      <p className="font-semibold text-gray-900">${car.policies.additionalDriver}/day</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Overtime Fee</p>
                      <p className="font-semibold text-gray-900">${car.policies.overtime}/hour</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Owner Profile */}
            {car.owner && <OwnerProfile owner={car.owner} />}

            {/* Reviews Section */}
            <ReviewsSection 
              carId={car.id}
              reviews={allReviews}
              rating={car.rating}
              totalReviews={car.reviews}
            />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">${car.pricePerDay}</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <p className="text-sm text-gray-500">Best price guarantee</p>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              {totalDays > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>${car.pricePerDay} × {totalDays} days</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-xl">${totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                disabled={!pickupDate || !returnDate || totalDays <= 0}
                className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#F97316' }}
                onClick={() => onCheckout && onCheckout(pickupDate, returnDate, totalDays, totalPrice)}
              >
                {totalDays > 0 ? 'Select Car' : 'Select Dates'}
              </button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant confirmation</span>
                </div>
                {car.additionalInfo?.delivery && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Delivery available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
