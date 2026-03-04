import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/app/components/search-bar';
import { FilterSidebar, FilterState } from '@/app/components/filter-sidebar';
import { CarCard } from '@/app/components/car-card';
//import { cars } from '@/app/data/cars';
import { carApi, CarResponse } from '@/app/api/api';
import { mapCarResponseToFrontend } from '@/app/api/mapper';
import { Car } from '@/app/data/cars';

interface SearchPageProps {
  onViewCarDetail: (carId: number) => void;
}

export function SearchPage({ onViewCarDetail }: SearchPageProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    priceRange: [0, 99999999],
    fuelTypes: [],
    minRating: 0
  });

  // ── Fetch cars from backend on mount ───────────────────────────────────────
  useEffect(() => {

    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await carApi.getAll();
        //console.log("Raw API response:", data);
        setCars(data.map(mapCarResponseToFrontend));

      } catch (err) {
        setError("Không thể tải danh sách xe. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSearch = (location: string, start: Date | null, end: Date | null) => {
    setSearchLocation(location);
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleBookCar = (carId: number) => {
    onViewCarDetail(carId);
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
  }, [cars, searchLocation, filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Cars</h2>
              <p className="text-gray-600">{filteredCars.length} cars available</p>
            </div>
             {/* Loading state */}
            {loading && (
              <div className="text-center py-12 text-gray-500">Đang tải danh sách xe...</div>
            )}
             {/* Error state */}
            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}
             {/* Car Grid — same as before */}
            {!loading && !error && (
              filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={handleBookCar} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <p className="text-xl text-gray-500">No cars found.</p>
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}