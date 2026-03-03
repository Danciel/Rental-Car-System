export interface BookCarAndPayRequest {
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  rentalPrice: number;
  depositAmount: number;
  paymentMethod: string;
  preInspectionNote?: string | null;
}

export interface BookCarAndPayResponse {
  bookingId: number;
  bookingCode: string;
  rentalContractId: number;
  carInspectReportId: number;
  paymentTransactionId: number;
  bookingStatus: string;
  rentalContractStatus: string;
  paymentStatus: string;
}

const BASE_URL =
  import.meta.env.VITE_BOOKING_API_BASE_URL ?? 'http://localhost:8080';

function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function toLocalDateTimeString(date: Date | null): string | null {
  if (!date) return null;
  return formatLocalDateTime(date);
}

export async function bookCarAndPay(
  payload: BookCarAndPayRequest,
): Promise<BookCarAndPayResponse> {
  const response = await fetch(`${BASE_URL}/api/bookings/book-and-pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Booking failed with status ${response.status}: ${text || response.statusText}`,
    );
  }

  return (await response.json()) as BookCarAndPayResponse;
}

