import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Car, Users as UsersIcon, FileSpreadsheet, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ReportsPage() {
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [carPage, setCarPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) throw new Error("Please login again!");

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [carsRes, usersRes] = await Promise.all([
          fetch('http://localhost:8080/api/cars', { headers }),
          fetch('http://localhost:8080/api/users', { headers })
        ]);

        if (!carsRes.ok || !usersRes.ok) throw new Error("Error fetching data. Ensure you have Admin privileges.");

        const carsData = await carsRes.json();
        const usersData = await usersRes.json();

        setCars(carsData.data || []);
        setUsers(usersData.data || []);
      } catch (err) {
        console.error("Fetch report data error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  // EXPORT LOGIC (EXCEL & PDF)
  // ═════════════════════════════════════════════════════════════════════════

  const exportExcel = (type) => {
    const isCar = type === 'cars';
    const data = isCar ? cars : users;
    const fileName = isCar ? 'Car_List_Report.xlsx' : 'User_List_Report.xlsx';

    // 1. Prepare JSON Data based on actual Spring Boot DTOs
    const exportData = data.map(item => isCar ? {
      "ID": item.id,
      "Car Name": `${item.brandName || ''} ${item.carModelId?.name || ''}`.trim() || 'N/A',
      "License Plate": item.licensePlate || 'N/A',
      "Status": item.status || 'N/A',
      "Price/Day": item.basePricePerDay || 0,
      "Deposit": item.depositAmount || 0
    } : {
      "ID": item.id,
      "Full Name": item.fullName || 'N/A',
      "Email": item.email || 'N/A',
      "Roles": item.roles && item.roles.length > 0 ? item.roles.join(', ') : 'N/A',
      "Wallet Balance": item.walletBalance || 0,
      "Status": item.status || 'ACTIVE'
    });

    // 2. Create Sheet and Export
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, isCar ? "Cars" : "Users");
    XLSX.writeFile(workbook, fileName);
  };

    const exportPDF = async (type) => {
        const isCar = type === 'cars';
        const data = isCar ? cars : users;
        const doc = new jsPDF();

        // =========================================================
        // ĐÃ FIX: Dùng CDN siêu ổn định của Cloudflare (cdnjs)
        // =========================================================
        try {
            const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf');

            if (!response.ok) {
                throw new Error("Lỗi mạng khi tải Font từ CDN");
            }

            const blob = await response.blob();
            const base64Font = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });

            doc.addFileToVFS("Roboto-Regular.ttf", base64Font);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");
        } catch (error) {
            console.error("Lỗi tải font tiếng Việt:", error);
        }
        // =========================================================

        const title = isCar ? 'CAR LIST REPORT' : 'USER LIST REPORT';
        doc.text(title, 14, 15);

        const tableColumn = isCar
            ? ["ID", "Car Name", "License Plate", "Status", "Price/Day"]
            : ["ID", "Full Name", "Email", "Roles", "Status"];

        const tableRows = data.map(item => isCar ? [
            item.id,
            `${item.brandName || ''} ${item.carModelId?.name || ''}`.trim() || 'N/A',
            item.licensePlate || 'N/A',
            item.status || 'N/A',
            item.basePricePerDay || 0
        ] : [
            item.id,
            item.fullName || 'N/A',
            item.email || 'N/A',
            item.roles && item.roles.length > 0 ? item.roles.join(', ') : 'N/A',
            item.status || 'ACTIVE'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { font: 'Roboto' },
            headStyles: { font: 'Roboto', fontStyle: 'bold' }
        });

        doc.save(isCar ? 'Car_Report.pdf' : 'User_Report.pdf');
    };
  // ═════════════════════════════════════════════════════════════════════════
  // PAGINATION LOGIC
  // ═════════════════════════════════════════════════════════════════════════

  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderPagination = (dataLength, currentPage, setPage) => {
    const totalPages = Math.ceil(dataLength / ITEMS_PER_PAGE) || 1;
    return (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
        <span className="text-sm text-gray-500">
          Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of {totalPages}
          {' '}(Total: {dataLength})
        </span>
          <div className="flex gap-2">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
    );
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Compiling report data...</p>
      </div>
  );

  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">Error: {error}</div>;

  return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm">Manage and export system data to PDF / Excel</p>
        </div>

        {/* 1. CAR REPORT SECTION */}
        <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Car size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Car List</h3>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => exportExcel('cars')} disabled={cars.length===0} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-all disabled:opacity-50">
                <FileSpreadsheet size={16} /> Export Excel
              </button>
              <button onClick={() => exportPDF('cars')} disabled={cars.length===0} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-medium transition-all disabled:opacity-50">
                <FileText size={16} /> Export PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Car Name</th>
                <th className="px-6 py-4 font-semibold">License Plate</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
              </thead>
              <tbody>
              {getPaginatedData(cars, carPage).map((car) => (
                  <tr key={car.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{car.id}</td>
                    {/* Using brandName and carModelId.name based on CarResponse.java */}
                    <td className="px-6 py-4 text-gray-900 font-medium">{`${car.brandName || ''} ${car.carModelId?.name || ''}`.trim() || 'N/A'}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 px-2.5 py-1 rounded font-mono text-xs border border-gray-200">{car.licensePlate || 'N/A'}</span></td>
                    <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        car.status === 'RENTED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {car.status || 'N/A'}
                    </span>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            {cars.length === 0 && <div className="p-6 text-center text-gray-500">No cars found.</div>}
          </div>
          {cars.length > 0 && renderPagination(cars.length, carPage, setCarPage)}
        </Card>

        {/* 2. USER REPORT SECTION */}
        <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <UsersIcon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">User List</h3>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => exportExcel('users')} disabled={users.length===0} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-all disabled:opacity-50">
                <FileSpreadsheet size={16} /> Export Excel
              </button>
              <button onClick={() => exportPDF('users')} disabled={users.length===0} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-medium transition-all disabled:opacity-50">
                <FileText size={16} /> Export PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Full Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Roles</th>
              </tr>
              </thead>
              <tbody>
              {getPaginatedData(users, userPage).map((user) => (
                  <tr key={user.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{user.id}</td>
                    {/* Using fullName based on UserProfileResponse.java */}
                    <td className="px-6 py-4 text-gray-900 font-medium">{user.fullName || 'N/A'}</td>
                    <td className="px-6 py-4">{user.email || 'N/A'}</td>
                    {/* Extracting Set<String> roles */}
                    <td className="px-6 py-4">
                      {user.roles && user.roles.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map(role => (
                                <span key={role} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold border border-purple-100">
                            {role.replace('ROLE_', '')}
                          </span>
                            ))}
                          </div>
                      ) : (
                          <span className="text-gray-400 text-xs">NO ROLE</span>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="p-6 text-center text-gray-500">No users found.</div>}
          </div>
          {users.length > 0 && renderPagination(users.length, userPage, setUserPage)}
        </Card>

      </div>
  );
}