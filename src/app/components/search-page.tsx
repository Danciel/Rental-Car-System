import { useState, useMemo } from 'react';
import { SearchBar } from '@/app/components/search-bar';
import { FilterSidebar, FilterState } from '@/app/components/filter-sidebar';
import { CarCard } from '@/app/components/car-card';
import { cars } from '@/app/data/cars';

export function SearchPage() {
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    priceRange: [0, 250],
    fuelTypes: [],
    minRating: 0
  });

  const handleSearch = (location: string, start: Date | null, end: Date | null) => {
    setSearchLocation(location);
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleBookCar = (carId: number) => {
    const car = cars.find(c => c.id === carId);
    if (car) {
      alert(`Booking ${car.name}! This would navigate to the booking page.`);
    }
  };

  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Location filter
      if (searchLocation && !car.location.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }

      // Car type filter
      if (filters.carTypes.length > 0 && !filters.carTypes.includes(car.type)) {
        return false;
      }

      // Price range filter
      if (car.pricePerDay < filters.priceRange[0] || car.pricePerDay > filters.priceRange[1]) {
        return false;
      }

      // Fuel type filter
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
        return false;
      }

      // Rating filter
      if (car.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [searchLocation, filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Cars
                {searchLocation && ` in ${searchLocation}`}
              </h2>
              <p className="text-gray-600">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
              </p>
            </div>

            {/* Car Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} onBook={handleBookCar} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-xl text-gray-500">No cars found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
