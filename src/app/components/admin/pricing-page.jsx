import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, Clock, Star, Save, TrendingUp } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export function PricingPage() {
  // Platform Fee State
  const [platformFee, setPlatformFee] = useState(15);

  // Discount Codes State
  const [discountCodes, setDiscountCodes] = useState([
    {
      id: 1,
      code: 'VIVU2024',
      value: '20%',
      type: 'percentage',
      expiry: '31/12/2024',
      active: true
    },
    {
      id: 2,
      code: 'GIAM50K',
      value: '50.000đ',
      type: 'fixed',
      expiry: '28/02/2025',
      active: true
    },
    {
      id: 3,
      code: 'TETALE',
      value: '15%',
      type: 'percentage',
      expiry: '15/02/2025',
      active: false
    }
  ]);

  // New Discount Code Form State
  const [showAddCode, setShowAddCode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  // Flash Sale State
  const [flashSaleCarId, setFlashSaleCarId] = useState('');
  const [flashSaleDiscount, setFlashSaleDiscount] = useState('');
  const [flashSaleEndDate, setFlashSaleEndDate] = useState('');
  const [flashSaleEndTime, setFlashSaleEndTime] = useState('');

  // Featured Cars State
  const [featuredCars, setFeaturedCars] = useState([
    { id: 1, name: 'VinFast VF9', pinned: true },
    { id: 2, name: 'Mazda CX-5', pinned: false },
    { id: 3, name: 'Toyota Camry', pinned: true },
    { id: 4, name: 'Honda CR-V', pinned: false },
    { id: 5, name: 'Mercedes-Benz C-Class', pinned: true }
  ]);

  // Available cars for flash sale
  const availableCars = [
    { id: 1, name: 'VinFast VF9' },
    { id: 2, name: 'Mazda CX-5' },
    { id: 3, name: 'Toyota Camry' },
    { id: 4, name: 'Honda CR-V' },
    { id: 5, name: 'Mercedes-Benz C-Class' },
    { id: 6, name: 'VinFast VF8' },
    { id: 7, name: 'Toyota Vios' },
    { id: 8, name: 'Mazda 3' }
  ];

  // Toggle featured car
  const toggleFeaturedCar = (id) => {
    setFeaturedCars(featuredCars.map(car => 
      car.id === id ? { ...car, pinned: !car.pinned } : car
    ));
  };

  // Add new discount code
  const addDiscountCode = () => {
    if (newCode && newValue && newExpiry) {
      const newCodeObj = {
        id: discountCodes.length + 1,
        code: newCode.toUpperCase(),
        value: newValue,
        type: newValue.includes('%') ? 'percentage' : 'fixed',
        expiry: newExpiry,
        active: true
      };
      setDiscountCodes([...discountCodes, newCodeObj]);
      setNewCode('');
      setNewValue('');
      setNewExpiry('');
      setShowAddCode(false);
    }
  };

  // Delete discount code
  const deleteDiscountCode = (id) => {
    setDiscountCodes(discountCodes.filter(code => code.id !== id));
  };

  // Save all configuration
  const handleSaveConfiguration = () => {
    alert('Configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Promotions Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage fees, discount codes, and promotional programs</p>
        </div>
      </div>

      {/* Section 1: Platform Fee */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-[#1E40AF] bg-opacity-10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#1E40AF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">System Platform Fee</h2>
            <p className="text-sm text-gray-600">Commission percentage for each transaction</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 max-w-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Fee (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                %
              </span>
            </div>
          </div>
          <div className="pt-8">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-gray-600">Estimated Revenue</p>
              <p className="text-lg font-bold text-green-600">{platformFee}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Discount Codes */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#F97316] bg-opacity-10 rounded-lg">
              <Tag className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Discount Code Management</h2>
              <p className="text-sm text-gray-600">Create and manage promotional codes for customers</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCode(!showAddCode)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl hover:bg-[#ea6a0a] transition-colors text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Code
          </button>
        </div>

        {/* Add New Code Form */}
        {showAddCode && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Create New Discount Code</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., SUMMER2024"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value
                </label>
                <input
                  type="text"
                  placeholder="e.g., 10% or 50.000đ"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addDiscountCode}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors text-sm font-semibold"
              >
                Add Code
              </button>
              <button
                onClick={() => setShowAddCode(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Discount Codes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Value</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiry</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes.map((code) => (
                <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#1E40AF] bg-blue-50 px-3 py-1 rounded-lg text-sm">
                      {code.code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{code.value}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700 text-sm">{code.expiry}</span>
                  </td>
                  <td className="py-3 px-4">
                    {code.active ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                        <Edit className="w-4 h-4 text-gray-600 group-hover:text-[#1E40AF]" />
                      </button>
                      <button 
                        onClick={() => deleteDiscountCode(code.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section 3: Flash Sale */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-amber-500 bg-opacity-10 rounded-lg">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Flash Sale Setup</h2>
            <p className="text-sm text-gray-600">Create time-limited discount programs for vehicles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Car
            </label>
            <select
              value={flashSaleCarId}
              onChange={(e) => setFlashSaleCarId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
            >
              <option value="">-- Select Car --</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 30"
                value={flashSaleDiscount}
                onChange={(e) => setFlashSaleDiscount(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={flashSaleEndDate}
              onChange={(e) => setFlashSaleEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={flashSaleEndTime}
              onChange={(e) => setFlashSaleEndTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
            />
          </div>
        </div>

        <button
          className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors text-sm font-semibold flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Activate Flash Sale
        </button>
      </Card>

      {/* Section 4: Featured Cars */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-purple-500 bg-opacity-10 rounded-lg">
            <Star className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Featured Car Pinning</h2>
            <p className="text-sm text-gray-600">Select cars to be prominently displayed on the homepage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                car.pinned
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {car.pinned && <Star className="w-5 h-5 text-purple-600 fill-purple-600" />}
                <span className={`font-semibold ${car.pinned ? 'text-purple-900' : 'text-gray-900'}`}>
                  {car.name}
                </span>
              </div>
              
              <button
                onClick={() => toggleFeaturedCar(car.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  car.pinned ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    car.pinned ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfiguration}
          className="flex items-center gap-2 px-8 py-3 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1a3699] transition-colors font-semibold shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>
    </div>
  );
}