import { useState } from 'react';
import { Search, ArrowRight, Shield, User, Car, DollarSign, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample transaction data (Mock data kept as requested)
  const transactionsData = [
    {
      id: '1',
      code: 'GD-8821',
      amount: 3000000,
      type: 'deposit',
      status: 'holding',
      customerName: 'Nguyễn Văn An',
      hostName: 'Trần Thị Bình',
      carName: 'VinFast VF9',
      date: '28/01/2025',
      escrowStatus: 'holding'
    },
    {
      id: '2',
      code: 'GD-8822',
      amount: 5000000,
      type: 'payment',
      status: 'completed',
      customerName: 'Lê Minh Tuấn',
      hostName: 'Phạm Văn Cường',
      carName: 'Mazda CX-5',
      date: '27/01/2025',
      escrowStatus: 'released'
    },
    {
      id: '3',
      code: 'GD-8823',
      amount: 2000000,
      type: 'deposit',
      status: 'refunded',
      customerName: 'Hoàng Thị Lan',
      hostName: 'Đỗ Văn Hùng',
      carName: 'Toyota Camry',
      date: '26/01/2025',
      escrowStatus: 'refunded'
    },
    {
      id: '4',
      code: 'GD-8824',
      amount: 4500000,
      type: 'payment',
      status: 'holding',
      customerName: 'Vũ Đức Anh',
      hostName: 'Ngô Thị Mai',
      carName: 'Honda CR-V',
      date: '25/01/2025',
      escrowStatus: 'holding'
    },
    {
      id: '5',
      code: 'GD-8825',
      amount: 1500000,
      type: 'deposit',
      status: 'cancelled',
      customerName: 'Bùi Văn Sơn',
      hostName: 'Lý Thị Hoa',
      carName: 'Mercedes C-Class',
      date: '24/01/2025',
      escrowStatus: 'refunded'
    },
    {
      id: '6',
      code: 'GD-8826',
      amount: 6000000,
      type: 'payment',
      status: 'completed',
      customerName: 'Đặng Minh Quân',
      hostName: 'Phan Văn Long',
      carName: 'VinFast VF8',
      date: '23/01/2025',
      escrowStatus: 'released'
    },
    {
      id: '7',
      code: 'GD-8827',
      amount: 2500000,
      type: 'deposit',
      status: 'holding',
      customerName: 'Trương Thị Nga',
      hostName: 'Hồ Văn Tâm',
      carName: 'Toyota Vios',
      date: '22/01/2025',
      escrowStatus: 'holding'
    },
    {
      id: '8',
      code: 'GD-8828',
      amount: 3500000,
      type: 'payment',
      status: 'completed',
      customerName: 'Mai Văn Đức',
      hostName: 'Võ Thị Thanh',
      carName: 'Mazda 3',
      date: '21/01/2025',
      escrowStatus: 'released'
    }
  ];

  // Filter transactions
  const filteredTransactions = transactionsData.filter(transaction => {
    const matchesSearch = transaction.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  // Get type badge
  const getTypeBadge = (type) => {
    if (type === 'deposit') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          Deposit
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          Payment
        </span>
      );
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'holding':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F97316] text-white shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            Holding
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-white shadow-sm">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate statistics
  const totalHolding = transactionsData
    .filter(t => t.status === 'holding')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCompleted = transactionsData
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage escrow cash flow</p>
        </div>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-orange-50 to-white border-l-4 border-l-[#F97316]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Held in Escrow</p>
              <p className="text-2xl font-bold text-[#F97316]">{formatCurrency(totalHolding)}</p>
            </div>
            <Clock className="w-10 h-10 text-[#F97316] opacity-20" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-green-50 to-white border-l-4 border-l-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Completed</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl border-gray-200 bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-[#1E40AF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-[#1E40AF]">{transactionsData.length}</p>
            </div>
            <Shield className="w-10 h-10 text-[#1E40AF] opacity-20" />
          </div>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction code, customer or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="holding">Holding</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600 pt-2">
            Showing <span className="font-semibold text-gray-900">{filteredTransactions.length}</span> transactions
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="rounded-xl border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Code</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Customer / Host</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Car</th>
                <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Transaction Code */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-[#1E40AF] text-sm">
                        {transaction.code}
                      </span>
                    </td>

                    {/* Customer / Host Names */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">{transaction.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">{transaction.hostName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Car Name */}
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-900">{transaction.carName}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-lg text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6">
                      {getTypeBadge(transaction.type)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(transaction.status)}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-600">No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}