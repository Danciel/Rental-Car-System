import { useState, useEffect } from 'react';
import { Search, ArrowRight, Shield, User, CheckCircle, XCircle, Clock, Info, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Card } from '../ui/card'; 
import { paymentAPI } from '../../api/payment'; 
import { CustomFilter } from "../ui/filter"; // Import your custom filter

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Deposit", value: "DEPOSIT" },
    { label: "Payment", value: "PAYMENT" },
    { label: "Refund", value: "REFUND" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Success", value: "SUCCESS" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
  ];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: 10,
        type: selectedType,
        status: selectedStatus,
        sort: "createdAt,desc",
      };
      const response = await paymentAPI.getAllTransactions(params);
      
      if (response && response.data) {
        setTransactionsData(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactionsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, selectedType, selectedStatus]);

  const filteredTransactions = transactionsData.filter(transaction => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.transactionCode?.toLowerCase().includes(searchLower) ||
      transaction.description?.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type) => {
    const t = type?.toUpperCase();
    switch (t) {
      case 'DEPOSIT': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Deposit</span>;
      case 'PAYMENT': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Payment</span>;
      case 'REFUND': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Refund</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" /> Success
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F97316] text-white shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
        <p className="text-sm text-gray-600 mt-1">System-wide transaction history</p>
      </div>

      {/* Financial Statistics
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-orange-50 to-white border-l-4 border-l-[#F97316]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Held in Escrow</p>
              <p className="text-2xl font-bold text-[#F97316]"></p>
            </div>
            <Clock className="w-10 h-10 text-[#F97316] opacity-20" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-green-50 to-white border-l-4 border-l-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Completed</p>
              <p className="text-2xl font-bold text-green-600"></p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-[#1E40AF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-[#1E40AF]"></p>
            </div>
            <Shield className="w-10 h-10 text-[#1E40AF] opacity-20" />
          </div>
        </Card>
      </div> */}

      {/* Filters Section with CustomFilter */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex flex-col gap-4">

          <div className="flex gap-4">
            <CustomFilter
              value={selectedType}
              options={typeOptions}
              onChange={(val) => {
                setSelectedType(val);
                setPage(0);
              }}
            />

            <CustomFilter
              value={selectedStatus}
              options={statusOptions}
              onChange={(val) => {
                setSelectedStatus(val);
                setPage(0);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table Section (Kept Original UI) */}
      <Card className="rounded-xl border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50 text-left">
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Transaction Code</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Sender / Receiver</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Description</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700 text-right">Amount</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Type</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : transactionsData.length > 0 ? (
                transactionsData.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-[#1E40AF] text-sm">{t.transactionCode}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">{t.senderName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{t.receiverName || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-[200px]">
                      <span className="text-sm text-gray-700 truncate block" title={t.description}>
                        {t.description}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-4 px-6">{getTypeBadge(t.type)}</td>
                    <td className="py-4 px-6">{getStatusBadge(t.status)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
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
      </Card>
    </div>
  );
}