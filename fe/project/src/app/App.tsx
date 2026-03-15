import {useCallback, useEffect, useMemo, useState} from 'react';
import {Navbar} from '@/app/components/navbar';
import {HeroSection} from '@/app/components/hero-section';
import {HowItWorks} from '@/app/components/how-it-works';
import {HostSection} from '@/app/components/host-section';
import {FAQSection} from '@/app/components/faq-section';
import {Footer} from '@/app/components/footer';
import {SearchPage} from '@/app/components/search-page';
import {CarDetailPage} from '@/app/components/car-detail-page';
import {CheckoutPage} from '@/app/components/checkout-page';
import {Admin} from '@/app/components/admin/admin.jsx';
import {Car} from '@/app/data/cars';
import {LoginSignup} from '@/app/components/login-signup';
import {ListYourCar} from '@/app/components/list-your-car';
import {MyAccount} from '@/app/components/my-account';
import {bookingApi} from '@/app/api/api';
import { VerifyEmailPage } from './components/verify-email';
import { UnauthorizedPage } from './components/unauthorized-page';

type Page =
    | 'home'
    | 'search'
    | 'car-detail'
    | 'checkout'
    | 'confirmation'
    | 'admin'
    | 'login'
    | 'list-car'
    | 'account'
    | 'verify-email'
    | 'unauthorized';

interface BookingData {
    carId: number;
    pickupDate: string;
    returnDate: string;
    totalDays: number;
    totalPrice: number;
}

const checkAccess = (allowedRoles: string[]): boolean => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('ACCESS_TOKEN');

    if (!token) {
        console.log("🛑 RBAC: Chưa đăng nhập (Không tìm thấy Token)!");
        return false;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        const userRoles = decodedToken.roles || decodedToken.role || decodedToken.authorities || '';

        let hasAccess = false;
        if (typeof userRoles === 'string') {
            const rolesArray = userRoles.split(',');
            hasAccess = rolesArray.some(r =>
                allowedRoles.includes(r.trim()) || allowedRoles.includes('ROLE_' + r.trim())
            );
        } else if (Array.isArray(userRoles)) {
            hasAccess = userRoles.some((r: string) =>
                allowedRoles.includes(r) || allowedRoles.includes('ROLE_' + r)
            );
        }

        console.log(`🛡️ RBAC: Đã bóc Token! Quyền hiện tại: [${userRoles}]. Yêu cầu: [${allowedRoles.join(', ')}] -> ${hasAccess ? '✅ CHO QUA' : '❌ CHẶN'}`);
        return hasAccess;

    } catch (error) {
        console.error("🛑 RBAC: Token bị lỗi định dạng hoặc không thể giải mã!", error);
        return false;
    }
};

export default function App() {
    const [currentPage, setCurrentPage] = useState<Page>('home');

    // dùng cho detail
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

    // lưu car detail thật để dùng cho checkout + book
    const [selectedCarDetail, setSelectedCarDetail] = useState<Car | null>(null);

    const [bookingData, setBookingData] = useState<BookingData | null>(null);

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
            'verify-email': '/verify-email',
            unauthorized: '/unauthorized',
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
            '/verify-email': 'verify-email',
            '/unauthorized': 'unauthorized',
        }),
        []
    );

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


    const handleViewCarDetail = useCallback(
        (carId: number) => {
            setSelectedCarId(carId);
            setSelectedCarDetail(null); // reset detail cache
            go('car-detail', {carId}); // ✅ luôn truyền carId vào options
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
        go('confirmation');
    }, [selectedCarDetail, bookingData, go]);

    // ADMIN
    if (currentPage === 'admin') {
        if (!checkAccess(['ROLE_ADMIN'])) {
            return <UnauthorizedPage onHome={() => go('home', { replace: true })} />;
        }
        return <Admin onBackToSite={() => go('home', {replace: true})}/>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar dùng go ổn định reference */}
            <Navbar currentPage={currentPage as any} onNavigate={go as any}/>

            {currentPage === 'home' ? (
                <>
                    <HeroSection onSearchClick={() => go('search')}/>
                    <HowItWorks/>
                    <HostSection onStartEarning={handleStartEarning}/>
                    <FAQSection/>
                    <Footer/>
                </>
            ) : currentPage === 'search' ? (
                <>
                    <SearchPage onViewCarDetail={handleViewCarDetail}/>
                    <Footer/>
                </>
            ) : currentPage === 'car-detail' && selectedCarId ? (
                <>
                    <CarDetailPage
                        carId={selectedCarId}
                        onBack={() => go('search')}
                        onCheckout={handleCheckout}
                        onLoadedCar={handleLoadedCar} // ✅ ổn định
                    />
                    <Footer/>
                </>
            ) : currentPage === 'checkout' && selectedCarDetail && bookingData ? (
                checkAccess(['ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN']) ? (
                    <>
                        <CheckoutPage
                            car={selectedCarDetail}
                            pickupDate={bookingData.pickupDate}
                            returnDate={bookingData.returnDate}
                            totalDays={bookingData.totalDays}
                            totalPrice={bookingData.totalPrice}
                            onBack={() => go('car-detail', {carId: selectedCarDetail.id})}
                            onConfirm={handleConfirmBooking}
                        />
                        <Footer/>
                    </>
                ) : (
                    <LoginSignup onClose={() => go('home')}/>
                )
            ) : currentPage === 'login' ? (
                <>
                    <LoginSignup onClose={() => go('home')}/>
                    <Footer/>
                </>
            ) : currentPage === 'list-car' ? (
                checkAccess(['ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN']) ? (
                    <>
                        <ListYourCar onClose={() => go('home')}/>
                        <Footer/>
                    </>
                ) : (
                    <LoginSignup onClose={() => go('home')}/>
                )
            ) : currentPage === 'account' ? (
                checkAccess(['ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN']) ? (
                    <>
                        <MyAccount onClose={() => go('home')}/>
                        <Footer/>
                    </>
                ) : (
                    <LoginSignup onClose={() => go('home')}/>
                )
            ) : currentPage === 'verify-email' ? (
                <>
                    <VerifyEmailPage onNavigate={() => go('account')} />
                    <Footer />
                </>
            ) : currentPage === 'unauthorized' ? (
                <>
                    <UnauthorizedPage onHome={() => go('home')} />
                    <Footer />
                </>
            ) : currentPage === 'confirmation' ? (
                <>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{backgroundColor: '#10B981'}}
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5 13l4 4L19 7"/>
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
                                style={{backgroundColor: '#1E40AF'}}
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                    <Footer/>
                </>
            ) : (
                <Footer/>
            )}
        </div>
    );
}