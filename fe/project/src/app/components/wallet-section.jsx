import { useState, useEffect } from "react";
import {
  Eye,
  X,
  Copy,
  Calendar,
  CreditCard,
  User,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { paymentAPI } from "../api/payment";
import { CustomFilter } from "./ui/filter";

export function WalletSection({ userId, currentBalance }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Deposit", value: "DEPOSIT" },
    { label: "Withdraw", value: "WITHDRAW" },
    { label: "Payment", value: "PAYMENT" },
    { label: "Refund", value: "REFUND" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Success", value: "SUCCESS" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
  ];

  const [selectedTx, setSelectedTx] = useState(null); // Lưu transaction đang xem chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetail = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: 5,
        type: type || "",
        status: status || "",
        sort: "createdAt,desc",
      };

      const response = await paymentAPI.getTransactions(userId, params);

      // Truy xuất vào cấu trúc ApiResponse -> Page
      if (response && response.data) {
        setTransactions(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, type, status, userId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-[#1E40AF] rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">
            Available Balance
          </p>
          <h2 className="text-4xl font-bold">
            {formatCurrency(currentBalance || 0)}
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all backdrop-blur-sm">
            Top Up
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 min-w-[320px]">
          {/* Filter Type sử dụng CustomFilter */}
          <CustomFilter
            value={type}
            options={typeOptions}
            onChange={(val) => {
              setType(val);
              setPage(0);
            }}
          />

          {/* Filter Status sử dụng CustomFilter */}
          <CustomFilter
            value={status}
            options={statusOptions}
            onChange={(val) => {
              setStatus(val);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse table-fixed"> {/* table-fixed là bắt buộc để các cột bằng/đúng tỉ lệ */}
  <thead>
    <tr className="bg-gray-50 border-b border-gray-200">
      {/* Cột Transaction căn trái - chiếm không gian lớn nhất */}
      <th className="w-[30%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
        Transaction
      </th>
      {/* Cột Type căn giữa */}
      <th className="w-[15%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
        Type
      </th>
      {/* Cột Amount căn phải */}
      <th className="w-[15%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
        Amount
      </th>
      {/* Cột Date căn phải */}
      <th className="w-[15%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
        Date
      </th>
      {/* Cột Status căn giữa */}
      <th className="w-[15%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
        Status
      </th>
      {/* Cột Action căn giữa */}
      <th className="w-[10%] px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
        Action
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100 bg-white">
    {loading ? (
      <tr>
        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading...</td>
      </tr>
    ) : transactions.length === 0 ? (
      <tr>
        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No transactions found.</td>
      </tr>
    ) : (
      transactions.map((tx) => (
        <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
          {/* Transaction: Căn trái + Truncate Description */}
          <td className="px-6 py-4 text-left overflow-hidden">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {tx.transactionCode}
            </p>
            <p className="text-xs text-gray-400 truncate w-full" title={tx.description}>
              {tx.description || "No description"}
            </p>
          </td>

          {/* Type: Căn giữa */}
          <td className="px-6 py-4 text-center">
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {tx.type}
            </span>
          </td>

          {/* Amount: Căn phải */}
          <td className="px-6 py-4 text-right font-bold text-sm whitespace-nowrap">
            {(() => {
              const isSender = tx.senderId === userId;
              const isReceiver = tx.receiverId === userId;
              const isPositive = isSender ? false : (isReceiver || tx.type === "DEPOSIT");
              return (
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {isPositive ? "+" : "-"} {formatCurrency(tx.amount)}
                </span>
              );
            })()}
          </td>

          {/* Date: Căn phải */}
          <td className="px-6 py-4 text-right text-sm text-gray-500 whitespace-nowrap">
            {new Date(tx.createdAt).toLocaleDateString("en-US")}
          </td>

          {/* Status: Căn giữa */}
          <td className="px-6 py-4 text-center">
            <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold ${
              tx.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}>
              {tx.status}
            </span>
          </td>

          {/* Action: Căn giữa */}
          <td className="px-6 py-4 text-center">
            <button
              onClick={() => openDetail(tx)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Eye className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {page + 1} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Overlay */}
      {isModalOpen && selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Transaction Details
              </h3>
            </div>

            <div className="p-8 space-y-6">
              {(() => {
                const isSender = selectedTx.senderId === userId;
                const isReceiver = selectedTx.receiverId === userId;

                let isPositive = false;
                if (isSender) isPositive = false;
                else if (isReceiver || selectedTx.type === "DEPOSIT")
                  isPositive = true;

                return (
                  <>
                    {/* Amount Header with Icon Logic */}
                    <div className="text-center pb-6 border-b border-dashed border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <h2
                        className={`text-4xl font-black ${isPositive ? "text-green-600" : "text-red-600"}`}
                      >
                        {isPositive ? "+" : "-"}
                        {formatCurrency(selectedTx.amount)}
                      </h2>
                      <div className="mt-4 flex justify-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            selectedTx.status === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedTx.status}
                        </span>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="space-y-4">
                      <DetailRow
                        icon={Calendar}
                        label="Date"
                        value={new Date(selectedTx.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      />
                      <DetailRow
                        icon={CreditCard}
                        label="Transaction ID"
                        value={selectedTx.transactionCode}
                        isCopy
                      />
                      <DetailRow
                        icon={Filter}
                        label="Type"
                        value={selectedTx.type}
                      />
                      <DetailRow
                        icon={User}
                        label="Sender"
                        value={selectedTx.senderName || "System / External"}
                      />
                      <DetailRow
                        icon={User}
                        label="Receiver"
                        value={selectedTx.receiverName || "System / External"}
                      />

                      <div className="pt-4">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                          Description
                        </p>
                        <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-600 italic leading-relaxed">
                          "{selectedTx.description || "No description provided"}
                          "
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DetailRow = ({ icon: Icon, label, value, isCopy = false }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3 text-gray-500">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      {isCopy && (
        <Copy className="w-3 h-3 text-gray-300 cursor-pointer hover:text-blue-500" />
      )}
    </div>
  </div>
);
