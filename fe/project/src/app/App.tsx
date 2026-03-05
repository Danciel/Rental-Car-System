// import { useEffect, useMemo, useState } from 'react';
// import { Navbar } from '@/app/components/navbar';
// import { HeroSection } from '@/app/components/hero-section';
// import { HowItWorks } from '@/app/components/how-it-works';
// import { HostSection } from '@/app/components/host-section';
// import { FAQSection } from '@/app/components/faq-section';
// import { Footer } from '@/app/components/footer';
// import { SearchPage } from '@/app/components/search-page';
// import { CarDetailPage } from '@/app/components/car-detail-page';
// import { CheckoutPage } from '@/app/components/checkout-page';
// import { Admin } from '@/app/components/admin/admin.jsx';
// import { cars, Car } from '@/app/data/cars';
// import { LoginSignup } from '@/app/components/login-signup';
// import { ListYourCar } from '@/app/components/list-your-car';
// import { MyAccount } from '@/app/components/my-account';
// import { bookingApi } from '@/app/api/api';
//
// type Page =
//   | 'home'
//   | 'search'
//   | 'car-detail'
//   | 'checkout'
//   | 'confirmation'
//   | 'admin'
//   | 'login'
//   | 'list-car'
//   | 'account';
//
// interface BookingData {
//   carId: number;
//   pickupDate: string;
//   returnDate: string;
//   totalDays: number;
//   totalPrice: number;
// }
//
// export default function App() {
//   const [currentPage, setCurrentPage] = useState<Page>('home');
//   const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
//   const [bookingData, setBookingData] = useState<BookingData | null>(null);
//
//   // Map page <-> path
//   const pageToPath = useMemo<Record<Page, string>>(
//     () => ({
//       home: '/',
//       search: '/search',
//       'car-detail': '/car',
//       checkout: '/checkout',
//       confirmation: '/confirmation',
//       admin: '/admin',
//       login: '/login',
//       'list-car': '/list-your-car',
//       account: '/account'
//     }),
//     []
//   );
//
//   const pathToPage = useMemo<Record<string, Page>>(
//     () => ({
//       '/': 'home',
//       '/search': 'search',
//       '/car': 'car-detail',
//       '/checkout': 'checkout',
//       '/confirmation': 'confirmation',
//       '/admin': 'admin',
//       '/login': 'login',
//       '/list-your-car': 'list-car',
//       '/account': 'account'
//     }),
//     []
//   );
//
//   // Navigate helper: update state + URL
//   const go = (page: Page, options?: { replace?: boolean }) => {
//     setCurrentPage(page);
//     const path = pageToPath[page] ?? '/';
//     if (typeof window !== 'undefined') {
//       if (options?.replace) window.history.replaceState({}, '', path);
//       else window.history.pushState({}, '', path);
//     }
//   };
//
//   // Init page from URL + handle browser back/forward
//   useEffect(() => {
//     const syncFromPath = (pathname: string) => {
//       const page = pathToPage[pathname];
//       if (page) {
//         setCurrentPage(page);
//       } else {
//         // fallback nếu path lạ
//         setCurrentPage('home');
//         window.history.replaceState({}, '', '/');
//       }
//     };
//
//     syncFromPath(window.location.pathname);
//
//     const onPopState = () => syncFromPath(window.location.pathname);
//     window.addEventListener('popstate', onPopState);
//
//     return () => window.removeEventListener('popstate', onPopState);
//   }, [pathToPage]);
//
//   const handleStartEarning = () => go('list-car');
//
//   // ADMIN (giữ như bạn đang làm)
//   if (currentPage === 'admin') {
//     return <Admin onBackToSite={() => go('home', { replace: true })} />;
//   }
//
//   const selectedCar: Car | null =
//     selectedCarId ? cars.find((car) => car.id === selectedCarId) ?? null : null;
//
//   const handleViewCarDetail = (carId: number) => {
//     setSelectedCarId(carId);
//     go('car-detail');
//   };
//
//   const handleCheckout = (
//     pickupDate: string,
//     returnDate: string,
//     totalDays: number,
//     totalPrice: number
//   ) => {
//     if (!selectedCarId) return;
//
//     setBookingData({
//       carId: selectedCarId,
//       pickupDate,
//       returnDate,
//       totalDays,
//       totalPrice
//     });
//
//     go('checkout');
//   };
//
//   const handleConfirmBooking = async () => {
//     if (!selectedCar || !bookingData) return;
//
//     try {
//       const email = localStorage.getItem("USER_EMAIL") ?? "";
//       const userId = JSON.parse(localStorage.getItem("user") ?? "{}").userId ?? 1;
//
//       await bookingApi.bookAndPay({
//         userId,
//         carId: selectedCar.id,
//         startTime: `${bookingData.pickupDate}T10:00:00`,
//         endTime: `${bookingData.returnDate}T10:00:00`,
//         rentalPrice: bookingData.totalPrice,
//         depositAmount: selectedCar.policies?.deposit ?? 0
//       }, email);
//
//       go('confirmation');
//     } catch (error) {
//       console.error(error);
//       alert('Đặt xe thất bại. Vui lòng thử lại.');
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar vẫn dùng cơ chế onNavigate -> go */}
//       <Navbar currentPage={currentPage as any} onNavigate={go as any} />
//
//       {currentPage === 'home' ? (
//         <>
//           <HeroSection onSearchClick={() => go('search')} />
//           <HowItWorks />
//           <HostSection onStartEarning={handleStartEarning} />
//           <FAQSection />
//           <Footer />
//         </>
//       ) : currentPage === 'search' ? (
//         <>
//           <SearchPage onViewCarDetail={handleViewCarDetail} />
//           <Footer />
//         </>
//       ) : currentPage === 'car-detail' && selectedCar ? (
//         <>
//           <CarDetailPage car={selectedCar} onBack={() => go('search')} onCheckout={handleCheckout} />
//           <Footer />
//         </>
//       ) : currentPage === 'checkout' && selectedCar && bookingData ? (
//         <>
//           <CheckoutPage
//             car={selectedCar}
//             pickupDate={bookingData.pickupDate}
//             returnDate={bookingData.returnDate}
//             totalDays={bookingData.totalDays}
//             totalPrice={bookingData.totalPrice}
//             onBack={() => go('car-detail')}
//             onConfirm={handleConfirmBooking}
//           />
//           <Footer />
//         </>
//       ) : currentPage === 'login' ? (
//         <>
//           <LoginSignup onClose={() => go('home')} />
//           <Footer />
//         </>
//       ) : currentPage === 'list-car' ? (
//         <>
//           <ListYourCar onClose={() => go('home')} />
//           <Footer />
//         </>
//       ) : currentPage === 'account' ? (
//         <>
//           <MyAccount onClose={() => go('home')} />
//           <Footer />
//         </>
//       ) : currentPage === 'confirmation' ? (
//         <>
//           <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//             <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
//               <div
//                 className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
//                 style={{ backgroundColor: '#10B981' }}
//               >
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
//               <p className="text-gray-600 mb-6">
//                 Your car rental has been successfully booked. You will receive a confirmation email shortly.
//               </p>
//               <button
//                 onClick={() => {
//                   setBookingData(null);
//                   setSelectedCarId(null);
//                   go('home');
//                 }}
//                 className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
//                 style={{ backgroundColor: '#1E40AF' }}
//               >
//                 Back to Home
//               </button>
//             </div>
//           </div>
//           <Footer />
//         </>
//       ) : (
//         <Footer />
//       )}
//     </div>
//   );
// }
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Car } from '@/app/data/cars';
import { LoginSignup } from '@/app/components/login-signup';
import { ListYourCar } from '@/app/components/list-your-car';
import { MyAccount } from '@/app/components/my-account';
import { bookingApi } from '@/app/api/api';

type Page =
    | 'home'
    | 'search'
    | 'car-detail'
    | 'checkout'
    | 'confirmation'
    | 'admin'
    | 'login'
    | 'list-car'
    | 'account';

interface BookingData {
  carId: number;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // dùng cho detail
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // lưu car detail thật để dùng cho checkout + book
  const [selectedCarDetail, setSelectedCarDetail] = useState<Car | null>(null);

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // Map page -> path (không chứa car-detail vì car-detail cần /car/:id)
  const pageToPath = useMemo<Record<Exclude<Page, 'car-detail'>, string>>(
      () => ({
        home: '/',
        search: '/search',
        checkout: '/checkout',
        confirmation: '/confirmation',
        admin: '/admin',
        login: '/login',
        'list-car': '/list-your-car',
        account: '/account',
      }),
      []
  );

  const pathToPage = useMemo<Record<string, Page>>(
      () => ({
        '/': 'home',
        '/search': 'search',
        '/checkout': 'checkout',
        '/confirmation': 'confirmation',
        '/admin': 'admin',
        '/login': 'login',
        '/list-your-car': 'list-car',
        '/account': 'account',
      }),
      []
  );

  /**
   * ✅ go() ổn định reference bằng useCallback.
   * Quan trọng: go('car-detail') luôn lấy carId từ options, không lấy từ closure selectedCarId
   * -> giúp go không đổi liên tục theo state và tránh loop với Navbar.
   */
  const go = useCallback(
      (page: Page, options?: { replace?: boolean; carId?: number }) => {
        setCurrentPage(page);

        let path = '/';

        if (page === 'car-detail') {
          const id = options?.carId; // ✅ chỉ lấy từ options
          path = id ? `/car/${id}` : '/search';
        } else {
          path = (pageToPath as any)[page] ?? '/';
        }

        if (typeof window !== 'undefined') {
          if (options?.replace) window.history.replaceState({}, '', path);
          else window.history.pushState({}, '', path);
        }
      },
      [pageToPath]
  );

  // Init page from URL + handle browser back/forward
  useEffect(() => {
    const syncFromPath = (pathname: string) => {
      // match /car/123
      const carMatch = pathname.match(/^\/car\/(\d+)$/);
      if (carMatch) {
        const id = Number(carMatch[1]);
        setSelectedCarId(id);
        setCurrentPage('car-detail');
        return;
      }

      // /car (không có id) => về search
      if (pathname === '/car') {
        setCurrentPage('search');
        window.history.replaceState({}, '', '/search');
        return;
      }

      const page = pathToPage[pathname];
      if (page) {
        setCurrentPage(page);
      } else {
        setCurrentPage('home');
        window.history.replaceState({}, '', '/');
      }
    };

    syncFromPath(window.location.pathname);

    const onPopState = () => syncFromPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, [pathToPage]);

  const handleStartEarning = useCallback(() => go('list-car'), [go]);

  // ADMIN
  if (currentPage === 'admin') {
    return <Admin onBackToSite={() => go('home', { replace: true })} />;
  }

  const handleViewCarDetail = useCallback(
      (carId: number) => {
        setSelectedCarId(carId);
        setSelectedCarDetail(null); // reset detail cache
        go('car-detail', { carId }); // ✅ luôn truyền carId vào options
      },
      [go]
  );

  const handleCheckout = useCallback(
      (pickupDate: string, returnDate: string, totalDays: number, totalPrice: number) => {
        if (!selectedCarId) return;

        setBookingData({
          carId: selectedCarId,
          pickupDate,
          returnDate,
          totalDays,
          totalPrice,
        });

        go('checkout');
      },
      [selectedCarId, go]
  );

  // ✅ callback ổn định reference, tránh loop với CarDetailPage
  const handleLoadedCar = useCallback((car: Car) => {
    setSelectedCarDetail(car);
  }, []);

  const handleConfirmBooking = useCallback(async () => {
    if (!selectedCarDetail || !bookingData) return;

    try {
      const email = localStorage.getItem('USER_EMAIL') ?? '';
      const userId = JSON.parse(localStorage.getItem('user') ?? '{}').userId ?? 1;

      await bookingApi.requestBooking(
          {
            userId,
            carId: selectedCarDetail.id,
            startTime: `${bookingData.pickupDate}T10:00:00`,
            endTime: `${bookingData.returnDate}T10:00:00`,
            rentalPrice: bookingData.totalPrice,
            depositAmount: selectedCarDetail.policies?.deposit ?? 0,
          },
          email
      );

      go('confirmation');
    } catch (error) {
      console.error(error);
      alert('Đặt xe thất bại. Vui lòng thử lại.');
    }
  }, [selectedCarDetail, bookingData, go]);

  return (
      <div className="min-h-screen bg-white">
        {/* Navbar dùng go ổn định reference */}
        <Navbar currentPage={currentPage as any} onNavigate={go as any} />

        {currentPage === 'home' ? (
            <>
              <HeroSection onSearchClick={() => go('search')} />
              <HowItWorks />
              <HostSection onStartEarning={handleStartEarning} />
              <FAQSection />
              <Footer />
            </>
        ) : currentPage === 'search' ? (
            <>
              <SearchPage onViewCarDetail={handleViewCarDetail} />
              <Footer />
            </>
        ) : currentPage === 'car-detail' && selectedCarId ? (
            <>
              <CarDetailPage
                  carId={selectedCarId}
                  onBack={() => go('search')}
                  onCheckout={handleCheckout}
                  onLoadedCar={handleLoadedCar} // ✅ ổn định
              />
              <Footer />
            </>
        ) : currentPage === 'checkout' && selectedCarDetail && bookingData ? (
            <>
              <CheckoutPage
                  car={selectedCarDetail}
                  pickupDate={bookingData.pickupDate}
                  returnDate={bookingData.returnDate}
                  totalDays={bookingData.totalDays}
                  totalPrice={bookingData.totalPrice}
                  onBack={() => go('car-detail', { carId: selectedCarDetail.id })}
                  onConfirm={handleConfirmBooking}
              />
              <Footer />
            </>
        ) : currentPage === 'login' ? (
            <>
              <LoginSignup onClose={() => go('home')} />
              <Footer />
            </>
        ) : currentPage === 'list-car' ? (
            <>
              <ListYourCar onClose={() => go('home')} />
              <Footer />
            </>
        ) : currentPage === 'account' ? (
            <>
              <MyAccount onClose={() => go('home')} />
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu đã được gửi!</h1>
                  <p className="text-gray-600 mb-6">
                    Yêu cầu thuê xe của bạn đã được gửi thành công.
                    Vui lòng chờ chủ xe xác nhận — chúng tôi sẽ thông báo khi có phản hồi.
                  </p>
                  <button
                    onClick={() => {
                      setBookingData(null);
                      setSelectedCarId(null);
                      setSelectedCarDetail(null);
                      go('home');
                    }}
                    className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#1E40AF' }}
                  >
                    Về trang chủ
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