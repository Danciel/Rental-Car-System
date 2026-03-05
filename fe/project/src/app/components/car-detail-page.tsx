// src/app/components/car-detail-page.tsx
import { useEffect, useMemo, useState } from "react";
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
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";

import { carApi, CarResponse } from "@/app/api/api";
import { Car, reviews as allReviews } from "@/app/data/cars";
import { OwnerProfile } from "@/app/components/owner-profile";
import { ReviewsSection } from "@/app/components/reviews-section";

interface CarDetailPageProps {
  carId: number;
  onBack: () => void;
  onCheckout?: (
      pickupDate: string,
      returnDate: string,
      totalDays: number,
      totalPrice: number
  ) => void;
  // onLoadedCar?: (car: Car) => void; // optional for App checkout usage
}

// ---------- helpers ----------
const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

const formatStatus = (status?: string) => {
  const s = (status || "").toUpperCase();
  if (s === "AVAILABLE")
    return { label: "Available", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (s === "STOPPED")
    return { label: "Stopped", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  if (s === "RENTED")
    return { label: "Rented", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: status || "Unknown", cls: "bg-gray-50 text-gray-700 border-gray-200" };
};

function safeJoin(parts: Array<string | number | null | undefined>) {
  return parts
      .filter((x) => x !== null && x !== undefined && String(x).trim() !== "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
}

// Map backend -> frontend Car (dựa đúng response bạn gửi)
function mapCarResponseToDetailCar(raw: CarResponse): Car {
  const model = raw.carModelId; // ✅ IMPORTANT: backend trả carModelId

  const images = (raw.images || [])
      .map((x) => x.imageUrl)
      .filter(Boolean);

  // isThumbnail có thể null, nên chỉ ưu tiên true nếu có
  const thumb =
      raw.images?.find((x) => x.isThumbnail === true)?.imageUrl || images[0] || "";

  const name = safeJoin([raw.brandName, model?.name, model?.year]);

  const mapped: Car = {
    id: raw.id,
    name: name || `Car #${raw.id}`,
    image: thumb || "",
    images: images.length ? images : thumb ? [thumb] : [],

    pricePerDay: Number(raw.basePricePerDay || 0),
    licensePlate: raw.licensePlate,
    year: model?.year,
    transmission: model?.transmission || "AUTOMATIC",
    seats: model?.seats || 4,
    fuelType: model?.fuelType || "GASOLINE",
    description: model?.description || "",
    type: model?.typeName || "CAR",

    // Backend chưa có các field này => fallback để UI đẹp và không vỡ
    location: "TP.HCM",
    rating: 4.8,
    reviews: 12,

    features: [],
    additionalInfo: undefined,
    specifications: {
      brand: raw.brandName || model?.brandName || "",
      model: model?.name || "",
      consumption: model?.capacityDisplay || "",
      luggage: 2,
      doors: 4,
    },
    policies: {
      cancellation: "Theo chính sách của chủ xe",
      deposit: Number(raw.depositAmount || 0),
      additionalDriver: 0,
      overtime: 0,
    },
    owner: undefined,
  } as Car;

  return mapped;
}

// ---------- UI components ----------
function Skeleton() {
  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-96 bg-gray-200 animate-pulse" />
                <div className="p-4 flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export function CarDetailPage({
                                carId,
                                onBack,
                                onCheckout,
                                onLoadedCar,
                              }: CarDetailPageProps) {
  const [car, setCar] = useState<Car | null>(null);
  const [rawStatus, setRawStatus] = useState<string>("");
  const [rawDeposit, setRawDeposit] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    if (!carId) {
      setError("Car ID không hợp lệ.");
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setCar(null);
        setCurrentImageIndex(0);

        const data = await carApi.getById(carId); // ✅ api.ts đã return json.data
        const mapped = mapCarResponseToDetailCar(data);

        if (!mounted) return;
        setCar(mapped);
        setRawStatus(data.status || "");
        setRawDeposit(Number(data.depositAmount || 0));

        onLoadedCar?.(mapped);
      } catch (e) {
        console.error("Failed to load car detail:", e);
        if (mounted) setError("Không thể tải chi tiết xe. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [carId, onLoadedCar]);

  const images = useMemo(() => {
    if (!car) return [];
    const imgs = car.images && car.images.length > 0 ? car.images : [];
    return imgs;
  }, [car]);

  const nextImage = () => {
    if (images.length < 2) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length < 2) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const totalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return 0;
    const rawDays = Math.ceil(diffMs / (1000 * 3600 * 24));
    return rawDays === 0 ? 1 : rawDays;
  }, [pickupDate, returnDate]);

  const totalPrice = (car?.pricePerDay || 0) * totalDays;

  // -------- states ----------
  if (loading) return <Skeleton />;

  if (error || !car) {
    return (
        <div className="min-h-screen bg-gray-50">
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

          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7 text-rose-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Không thể tải chi tiết xe
              </h2>
              <p className="text-gray-600 mb-6">{error || "Vui lòng thử lại."}</p>
              <button
                  onClick={onBack}
                  className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
    );
  }

  const badge = formatStatus(rawStatus);

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to search</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}>
            {badge.label}
          </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-[420px] bg-gray-900">
                  {images.length > 0 ? (
                      <img
                          src={images[currentImageIndex]}
                          alt={`${car.name} - Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No image
                      </div>
                  )}

                  {images.length > 1 && (
                      <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            aria-label="Previous"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            aria-label="Next"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                      </>
                  )}

                  {images.length > 0 && (
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                  )}
                </div>

                {/* thumbnails */}
                {images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {images.map((img, idx) => (
                          <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                  idx === currentImageIndex
                                      ? "border-blue-600 ring-2 ring-blue-200"
                                      : "border-gray-200 hover:border-gray-300"
                              }`}
                              aria-label={`Thumbnail ${idx + 1}`}
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

              {/* Title card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 truncate">
                      {car.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{car.location}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm">Biển số: {car.licensePlate}</span>
                      {car.year && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm">{car.year}</span>
                          </>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">{car.transmission}</span>
                    </span>
                      <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">{car.seats} chỗ</span>
                    </span>
                      <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <Fuel className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">{car.fuelType}</span>
                    </span>
                      <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                      <BadgeCheck className="w-4 h-4 text-blue-700" />
                      <span className="font-semibold text-blue-800">{car.type}</span>
                    </span>
                    </div>
                  </div>

                  {/* rating box */}
                  <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-4 text-right shadow-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-gray-900">{car.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">({car.reviews} reviews)</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Mô tả
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{car.description}</p>
                  </div>
              )}

              {/* Policies highlight */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-blue-700" />
                  <h2 className="text-xl font-bold text-gray-900">Chính sách</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Đặt cọc</p>
                    <p className="font-bold text-gray-900">{formatVND(rawDeposit)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Huỷ chuyến</p>
                    <p className="font-semibold text-gray-900">Theo chủ xe</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Xác nhận</p>
                    <p className="font-semibold text-gray-900">Tức thì</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Xe đúng mô tả, hình ảnh rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Hỗ trợ khách hàng trong giờ hành chính</span>
                  </div>
                </div>
              </div>

              {/* Owner + Reviews (giữ nguyên component bạn có) */}
              {car.owner && <OwnerProfile owner={car.owner} />}

              <ReviewsSection
                  carId={car.id}
                  reviews={allReviews}
                  rating={car.rating}
                  totalReviews={car.reviews}
              />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {formatVND(car.pricePerDay)}
                  </span>
                    <span className="text-gray-500 font-medium">/ngày</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Giá đã bao gồm phí dịch vụ cơ bản
                  </p>
                </div>

                {/* Date Inputs */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày nhận xe
                    </label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày trả xe
                    </label>
                    <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={pickupDate || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Breakdown */}
                {totalDays > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex justify-between text-gray-700">
                    <span>
                      {formatVND(car.pricePerDay)} × {totalDays} ngày
                    </span>
                        <span className="font-semibold">{formatVND(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Đặt cọc</span>
                        <span className="font-semibold">{formatVND(rawDeposit)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-900">Tổng</span>
                        <span className="font-extrabold text-gray-900 text-xl">
                      {formatVND(totalPrice)}
                    </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        (Đặt cọc sẽ được hoàn theo điều kiện hợp đồng)
                      </p>
                    </div>
                )}

                {/* CTA */}
                <button
                    disabled={!pickupDate || !returnDate || totalDays <= 0 || rawStatus.toUpperCase() !== "AVAILABLE"}
                    className="w-full py-4 rounded-xl text-white font-extrabold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    style={{ backgroundColor: "#F97316" }}
                    onClick={() =>
                        onCheckout && onCheckout(pickupDate, returnDate, totalDays, totalPrice)
                    }
                >
                  {rawStatus.toUpperCase() === "AVAILABLE"
                      ? totalDays > 0
                          ? "Chọn xe"
                          : "Chọn ngày"
                      : "Xe không khả dụng"}
                </button>

                {/* trust */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Huỷ miễn phí theo chính sách</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Xác nhận nhanh</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Hỗ trợ thanh toán an toàn</span>
                  </div>
                </div>
              </div>
            </div>
            {/* END RIGHT */}
          </div>
        </div>
      </div>
  );
}