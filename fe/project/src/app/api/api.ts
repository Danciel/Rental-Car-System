const CAR_SERVICE_URL = "http://localhost:8080/api";
const BOOKING_SERVICE_URL = "http://localhost:8080/api";

// ── TYPES matching your backend DTOs ─────────────────────────────────────────

export interface CarImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  carId: number;
}

export interface CarModelResponse {
  id: number;
  name: string;
  description: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  brandId: number;
  brandName: string;
  typeId: number;
  typeName: string;
  capacityDisplay: string;
  approvalStatus: string;
}

export interface CarResponse {
  id: number;
  licensePlate: string;
  basePricePerDay: number;
  depositAmount: number;
  status: string;
  ownerId: number;
  brandId: number;
  brandName: string;
  carModel: CarModelResponse;
  carModelId?: CarModelResponse;
  images: CarImage[];
}

export interface CarTypeResponse {
id: number;
typeName: string;
}

export interface CarBrandResponse {
id: number;
name: string;
logoUrl: string;
}

export interface BookCarRequest {
  userId: number;
  carId: number;
  startTime: string;   // ISO format: "2026-03-10T08:00:00"
  endTime: string;
  rentalPrice: number;
  depositAmount: number;
}

export interface BookCarResponse {
  bookingId: number;
  bookingCode: string;
  contractId: number;
  bookingStatus: string;
  contractStatus: string;
}

// ── API WRAPPER ───────────────────────────────────────────────────────────────

async function get<T>(url: string, withAuth: boolean = false): Promise<T> {
  const headers: Record<string, string> = {};

  if (withAuth) {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data as T;
}

async function post<T>(url: string, body: unknown, email?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Send token for authentication
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Send email header for gateway to extract user identity
  if (email) headers["X-User-Email"] = email;

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data as T;
}

// ── CAR ENDPOINTS ─────────────────────────────────────────────────────────────

export const carApi = {
  getAll: () =>
    get<CarResponse[]>(`${CAR_SERVICE_URL}/cars`),

  getById: (id: number) =>
    get<CarResponse>(`${CAR_SERVICE_URL}/cars/${id}`),

  getByBrand: (brandId: number) =>
    get<CarResponse[]>(`${CAR_SERVICE_URL}/cars?brandId=${brandId}`),

  getByStatus: (status: string) =>
    get<CarResponse[]>(`${CAR_SERVICE_URL}/cars?status=${status}`),
};

export const carTypeApi = {
  getAll: () => get<CarTypeResponse[]>(`${CAR_SERVICE_URL}/cars/types`),
};

export const carBrandApi = {
  getAll: () => get<CarBrandResponse[]>(`${CAR_SERVICE_URL}/cars/brands`),
};

// ── BOOKING ENDPOINTS ─────────────────────────────────────────────────────────

export const bookingApi = {
  bookAndPay: (request: BookCarRequest, email: string) =>
    post<BookCarResponse>(`${BOOKING_SERVICE_URL}/bookings/book-and-pay`, request, email),

  getHistory: () =>
    get<BookingHistoryItemResponse[]>(`${BOOKING_SERVICE_URL}/bookings/history`, true),

  getById: (id: number) =>
    get<BookingDetailResponse>(`${BOOKING_SERVICE_URL}/bookings/${id}`, true),
};

export interface BookingHistoryItemResponse {
  id: number;
  bookingCode: string;
  carId: number;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
}

export interface BookingDetailResponse {
  id: number;
  bookingCode: string;
  carId: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
  createdAt: string;
}