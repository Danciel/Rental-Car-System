import { useState } from 'react';
import { Search, Edit, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export function CarsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Sample car data (Mock data remains unchanged)
  const carsData = [
    {
      id: 1,
      name: 'VinFast VF9',
      licensePlate: '30A-888.88',
      brand: 'VinFast',
      type: 'SUV',
      pricePerDay: 1500000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1758217209786-95458c5d30a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjB3aGl0ZXxlbnwxfHx8fDE3Njk2NzkyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 2,
      name: 'Mazda CX-5',
      licensePlate: '51G-123.45',
      brand: 'Mazda',
      type: 'SUV',
      pricePerDay: 1200000,
      status: 'rented',
      image: 'https://images.unsplash.com/photo-1767949374180-e5895daa1990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjcm9zc292ZXIlMjBTVVZ8ZW58MXx8fHwxNzY5Njc5Mjc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 3,
      name: 'Toyota Camry',
      licensePlate: '29B-567.89',
      brand: 'Toyota',
      type: 'Sedan',
      pricePerDay: 1000000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1624578571415-09e9b1991929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDYW1yeSUyMHNlZGFufGVufDF8fHx8MTc2OTYzMDQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 4,
      name: 'Honda CR-V',
      licensePlate: '43C-234.56',
      brand: 'Honda',
      type: 'SUV',
      pricePerDay: 1100000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1695950682652-86b73812a9b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMENSLVYlMjBzaWx2ZXJ8ZW58MXx8fHwxNzY5Njc5MjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 5,
      name: 'Mercedes-Benz C-Class',
      licensePlate: '30H-999.99',
      brand: 'Mercedes',
      type: 'Sedan',
      pricePerDay: 2000000,
      status: 'maintenance',
      image: 'https://images.unsplash.com/photo-1636127739824-37cb465c66e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZXJjZWRlcyUyMEMtQ2xhc3MlMjBibGFja3xlbnwxfHx8fDE3Njk2NjMwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 6,
      name: 'VinFast VF8',
      licensePlate: '51F-111.22',
      brand: 'VinFast',
      type: 'SUV',
      pricePerDay: 1400000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1758217209786-95458c5d30a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjB3aGl0ZXxlbnwxfHx8fDE3Njk2NzkyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: false
    },
    {
      id: 7,
      name: 'Toyota Vios',
      licensePlate: '29A-345.67',
      brand: 'Toyota',
      type: 'Sedan',
      pricePerDay: 700000,
      status: 'rented',
      image: 'https://images.unsplash.com/photo-1749058982892-b6239fec4ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBWaW9zJTIwY29tcGFjdHxlbnwxfHx8fDE3Njk2NzkyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 8,
      name: 'Mazda 3',
      licensePlate: '43B-789.01',
      brand: 'Mazda',
      type: 'Sedan',
      pricePerDay: 900000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1677482360316-857984cb7034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYXpkYSUyMDMlMjBzZWRhbnxlbnwxfHx8fDE3Njk2NzkyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    },
    {
      id: 9,
      name: 'Honda Accord',
      licensePlate: '51H-456.78',
      brand: 'Honda',
      type: 'Sedan',
      pricePerDay: 1100000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1760243874929-e724632621d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwc2VkYW4lMjBjYXJ8ZW58MXx8fHwxNzY5NTcxNjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      visible: true
    }
  ];

  // Filter cars based on all criteria
  const filteredCars = carsData.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    const matchesType = selectedType === 'all' || car.type === selectedType;
    
    let matchesPrice = true;
    if (selectedPriceRange === 'under1m') {
      matchesPrice = car.pricePerDay < 1000000;
    } else if (selectedPriceRange === '1m-1.5m') {
      matchesPrice = car.pricePerDay >= 1000000 && car.pricePerDay <= 1500000;
    } else if (selectedPriceRange === 'over1.5m') {
      matchesPrice = car.pricePerDay > 1500000;
    }
    
    return matchesSearch && matchesBrand && matchesType && matchesPrice;
  });

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('en-US') + ' VND';
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Available
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Rented
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Maintenance
          </span>
        );
    }
  };

  // Get brand badge color
  const getBrandColor = (brand) => {
    switch (brand) {
      case 'VinFast': return 'text-[#1E40AF]';
      case 'Toyota': return 'text-red-600';
      case 'Mazda': return 'text-gray-700';
      case 'Honda': return 'text-blue-600';
      case 'Mercedes': return 'text-gray-900';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
      </div>

      {/* Filters Section */}
      <Card className="p-6 rounded-xl border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by car name or license plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Brands</option>
                <option value="VinFast">VinFast</option>
                <option value="Toyota">Toyota</option>
                <option value="Mazda">Mazda</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes">Mercedes</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Prices</option>
                <option value="under1m">Under 1,000,000 VND</option>
                <option value="1m-1.5m">1,000,000 - 1,500,000 VND</option>
                <option value="over1.5m">Over 1,500,000 VND</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600 pt-2">
            Showing <span className="font-semibold text-gray-900">{filteredCars.length}</span> cars
          </div>
        </div>
      </Card>

      {/* Cars Table */}
      <Card className="rounded-xl border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Car</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">License Plate</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Brand</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Daily Rate</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{car.name}</p>
                          <p className="text-xs text-gray-500">{car.type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        {car.licensePlate}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`font-semibold ${getBrandColor(car.brand)}`}>
                        {car.brand}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-[#F97316]">
                        {formatPrice(car.pricePerDay)}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(car.status)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-gray-600 group-hover:text-[#1E40AF]" />
                        </button>
                        <button 
                          className={`p-2 rounded-lg transition-colors group ${
                            car.visible ? 'hover:bg-amber-50' : 'hover:bg-green-50'
                          }`}
                          title={car.visible ? 'Hide Car' : 'Show Car'}
                        >
                          {car.visible ? (
                            <Eye className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-600">No cars found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Statistics Footer */}
      <Card className="p-4 rounded-xl border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div className="text-gray-600">
            Total Cars: <span className="font-semibold text-gray-900">{carsData.length}</span>
          </div>
          <div className="text-gray-600">
            Available: <span className="font-semibold text-green-600">
              {carsData.filter(c => c.status === 'available').length}
            </span>
          </div>
          <div className="text-gray-600">
            Rented: <span className="font-semibold text-blue-600">
              {carsData.filter(c => c.status === 'rented').length}
            </span>
          </div>
          <div className="text-gray-600">
            Maintenance: <span className="font-semibold text-amber-600">
              {carsData.filter(c => c.status === 'maintenance').length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}