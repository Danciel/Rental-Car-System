import { useState } from 'react';
import { Star } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  carTypes: string[];
  priceRange: [number, number];
  fuelTypes: string[];
  minRating: number;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    priceRange: [0, 250],
    fuelTypes: [],
    minRating: 0
  });

  const carTypes = ['SUV', 'Sedan', 'Electric', 'Sports', 'Compact', 'Convertible'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  const handleCarTypeToggle = (type: string) => {
    const newCarTypes = filters.carTypes.includes(type)
      ? filters.carTypes.filter(t => t !== type)
      : [...filters.carTypes, type];
    
    const newFilters = { ...filters, carTypes: newCarTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFuelTypeToggle = (type: string) => {
    const newFuelTypes = filters.fuelTypes.includes(type)
      ? filters.fuelTypes.filter(t => t !== type)
      : [...filters.fuelTypes, type];
    
    const newFilters = { ...filters, fuelTypes: newFuelTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number, index: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      carTypes: [],
      priceRange: [0, 250] as [number, number],
      fuelTypes: [],
      minRating: 0
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
        <button 
          onClick={handleReset}
          className="text-sm text-[#1E40AF] hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Car Type Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Car Type</h4>
        <div className="space-y-2">
          {carTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.carTypes.includes(type)}
                onChange={() => handleCarTypeToggle(type)}
                className="w-4 h-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Min: ${filters.priceRange[0]}/day
            </label>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#1E40AF'
              }}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Max: ${filters.priceRange[1]}/day
            </label>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#1E40AF'
              }}
            />
          </div>
        </div>
      </div>

      {/* Fuel Type Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Fuel Type</h4>
        <div className="space-y-2">
          {fuelTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.fuelTypes.includes(type)}
                onChange={() => handleFuelTypeToggle(type)}
                className="w-4 h-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-2">
        <h4 className="font-semibold text-gray-900 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {rating}+ & up
                </span>
              </div>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === 0}
              onChange={() => handleRatingChange(0)}
              className="w-4 h-4 border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
            />
            <span className="text-gray-700 group-hover:text-gray-900">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  );
}
