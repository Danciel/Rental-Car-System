import { useState } from 'react';
import { Navbar } from '@/app/components/navbar';
import { HeroSection } from '@/app/components/hero-section';
import { HowItWorks } from '@/app/components/how-it-works';
import { HostSection } from '@/app/components/host-section';
import { FAQSection } from '@/app/components/faq-section';
import { Footer } from '@/app/components/footer';
import { SearchPage } from '@/app/components/search-page';
import { CarDetailPage } from '@/app/components/car-detail-page';
import { CheckoutPage } from '@/app/components/checkout-page';
import { Admin } from '@/app/components/admin/admin.jsx';
import { cars, Car } from '@/app/data/cars';

type Page = 'home' | 'search' | 'car-detail' | 'checkout' | 'confirmation' | 'admin';

interface BookingData {
  carId: number;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // ADMIN
  if (currentPage === 'admin') {
    return <Admin onBackToSite={() => setCurrentPage('home')} />;
  }

  const selectedCar: Car | null =
    selectedCarId ? cars.find((car) => car.id === selectedCarId) ?? null : null;

  const handleViewCarDetail = (carId: number) => {
    setSelectedCarId(carId);
    setCurrentPage('car-detail');
  };

  const handleCheckout = (
    pickupDate: string,
    returnDate: string,
    totalDays: number,
    totalPrice: number
  ) => {
    if (!selectedCarId) return;

    setBookingData({
      carId: selectedCarId,
      pickupDate,
      returnDate,
      totalDays,
      totalPrice
    });

    setCurrentPage('checkout');
  };

  const handleConfirmBooking = () => {
    setCurrentPage('confirmation');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage as any} onNavigate={setCurrentPage as any} />

      {currentPage === 'home' ? (
        <>
          <HeroSection onSearchClick={() => setCurrentPage('search')} />
          <HowItWorks />
          <HostSection />
          <FAQSection />
          <Footer />
        </>
      ) : currentPage === 'search' ? (
        <>
          <SearchPage onViewCarDetail={handleViewCarDetail} />
          <Footer />
        </>
      ) : currentPage === 'car-detail' && selectedCar ? (
        <>
          <CarDetailPage
            car={selectedCar}
            onBack={() => setCurrentPage('search')}
            onCheckout={handleCheckout}
          />
          <Footer />
        </>
      ) : currentPage === 'checkout' && selectedCar && bookingData ? (
        <>
          <CheckoutPage
            car={selectedCar}
            pickupDate={bookingData.pickupDate}
            returnDate={bookingData.returnDate}
            totalDays={bookingData.totalDays}
            totalPrice={bookingData.totalPrice}
            onBack={() => setCurrentPage('car-detail')}
            onConfirm={handleConfirmBooking}
          />
          <Footer />
        </>
      ) : currentPage === 'confirmation' ? (
        <>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#10B981' }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your car rental has been successfully booked. You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => {
                  setBookingData(null);
                  setSelectedCarId(null);
                  setCurrentPage('home');
                }}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#1E40AF' }}
              >
                Back to Home
              </button>
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
}
