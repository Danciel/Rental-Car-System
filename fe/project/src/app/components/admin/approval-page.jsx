import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { RejectModal, DetailViewModal } from "./approval-overlay";
import { carAdminApi } from "@/app/api/car";

export function ApprovalsPage() {

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // =============================
  // Fetch pending cars
  // =============================

  const fetchPendingCars = async () => {
    setIsLoading(true);

    try {

      const list = await carAdminApi.getPendingReview();

      const mapped = list.map((car) => ({
        id: car.id,
        user: `Chủ xe ID: ${car.ownerId}`,
        carName: car.carModelId?.name ?? `Xe #${car.id}`,
        brand: car.brandName ?? "",
        plate: car.licensePlate,
        pricePerDay: car.basePricePerDay,
        originalData: car
      }));

      setCars(mapped);

    } catch (err) {
      console.error("Lỗi khi lấy danh sách xe chờ duyệt:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCars();
  }, []);

  // =============================
  // Approve car
  // =============================

  const handleApprove = async (car) => {

    const email = localStorage.getItem("USER_EMAIL") ?? "";

    try {

      await carAdminApi.reviewCar(car.id, "APPROVED", email);

      alert("Đã DUYỆT đăng ký xe.");
      fetchPendingCars();

    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  // =============================
  // Reject car
  // =============================

  const handleRejectClick = (car) => {
    setSelectedCar(car);
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {

    const email = localStorage.getItem("USER_EMAIL") ?? "";

    try {

      await carAdminApi.reviewCar(selectedCar.id, "REJECTED", email);

      alert("Đã TỪ CHỐI đăng ký xe.");
      fetchPendingCars();

    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    }

    setIsRejectModalOpen(false);
  };

  // =============================
  // View details
  // =============================

  const handleViewDetail = (car) => {
    setSelectedCar(car);
    setIsDetailOpen(true);
  };

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Approval Center
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          Review and approve car registrations
        </p>
      </div>

      <Card className="rounded-2xl border-gray-200 overflow-hidden shadow-sm">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase">
                Owner
              </th>

              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase">
                Car
              </th>

              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase">
                License Plate
              </th>

              <th className="text-center py-4 px-6 text-xs font-bold text-gray-400 uppercase">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {isLoading ? (

              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>

            ) : cars.length === 0 ? (

              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Không có xe nào cần duyệt
                </td>
              </tr>

            ) : (

              cars.map((car) => (

                <tr key={car.id} className="hover:bg-gray-50">

                  <td className="py-5 px-6 font-semibold text-gray-900">
                    {car.user}
                  </td>

                  <td className="py-5 px-6 text-sm text-blue-600 font-medium">
                    {car.carName}
                    {car.brand ? ` · ${car.brand}` : ""}
                  </td>

                  <td className="py-5 px-6">

                    <span className="font-mono bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      {car.plate}
                    </span>

                  </td>

                  <td className="py-5 px-6">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleViewDetail(car)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Eye className="w-4 h-4"/>
                      </button>

                      <button
                        onClick={() => handleRejectClick(car)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                      >
                        <XCircle className="w-4 h-4"/> Reject
                      </button>

                      <button
                        onClick={() => handleApprove(car)}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold"
                      >
                        <CheckCircle className="w-4 h-4"/> Approve
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </Card>

      <DetailViewModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={selectedCar}
        type="car"
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
        title={selectedCar?.carName}
      />

    </div>
  );
}