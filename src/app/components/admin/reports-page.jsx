import { 
  TrendingUp, 
  Eye, 
  Car, 
  Clock 
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@/app/components/ui/card';

export function ReportsPage() {
  // Summary Cards Data
  const summaryCards = [
    {
      title: 'Monthly Revenue',
      value: '1.250.000.000đ',
      icon: TrendingUp,
      color: 'bg-[#1E40AF]',
      change: '+12.5%'
    },
    {
      title: 'Total Page Views',
      value: '45.200',
      icon: Eye,
      color: 'bg-[#F97316]',
      change: '+8.2%'
    },
    {
      title: 'Active Rentals',
      value: '120',
      icon: Car,
      color: 'bg-emerald-500',
      change: '+5.3%'
    },
    {
      title: 'Pending Approvals',
      value: '15',
      icon: Clock,
      color: 'bg-amber-500',
      change: '-2.1%'
    }
  ];

  // Revenue Growth Data (Line Chart)
  // month keys: T1 -> Jan, T2 -> Feb, etc.
  const revenueData = [
    { month: 'Jan', revenue: 850 },
    { month: 'Feb', revenue: 920 },
    { month: 'Mar', revenue: 1050 },
    { month: 'Apr', revenue: 980 },
    { month: 'May', revenue: 1120 },
    { month: 'Jun', revenue: 1180 },
    { month: 'Jul', revenue: 1250 },
  ];

  // Car Type Distribution (Donut Chart)
  const carTypeData = [
    { name: 'SUV', value: 45, color: '#1E40AF' },
    { name: 'Sedan', value: 35, color: '#F97316' },
    { name: 'Electric', value: 20, color: '#10B981' }
  ];

  // Top 5 Cars by Revenue
  const topCars = [
    { rank: 1, name: 'VinFast VF8', bookings: 89, revenue: '178.000.000đ', rating: 4.9 },
    { rank: 2, name: 'Toyota Camry', bookings: 76, revenue: '152.000.000đ', rating: 4.8 },
    { rank: 3, name: 'Mercedes-Benz C-Class', bookings: 62, revenue: '186.000.000đ', rating: 4.9 },
    { rank: 4, name: 'Honda CR-V', bookings: 71, revenue: '142.000.000đ', rating: 4.7 },
    { rank: 5, name: 'Mazda CX-5', bookings: 58, revenue: '116.000.000đ', rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="p-6 rounded-xl border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                  <p className={`text-xs font-semibold ${
                    card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change} vs last month
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <Card className="p-6 rounded-xl border-gray-200 col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value} Million VND`, 'Revenue']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#1E40AF" 
                strokeWidth={3}
                dot={{ fill: '#1E40AF', r: 5 }}
                activeDot={{ r: 7 }}
                name="Revenue (Million VND)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Car Type Distribution */}
        <Card className="p-6 rounded-xl border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Car Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={carTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {carTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Ratio']}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top 5 Cars Table */}
      <Card className="p-6 rounded-xl border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top 5 Highest Revenue Cars</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Car Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topCars.map((car) => (
                <tr key={car.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${car.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                        car.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        car.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-600'}
                    `}>
                      {car.rank}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{car.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-700">{car.bookings} bookings</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#1E40AF]">{car.revenue}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span className="font-semibold text-gray-900">{car.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}