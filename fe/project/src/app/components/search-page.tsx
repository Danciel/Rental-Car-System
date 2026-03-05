import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/app/components/search-bar';
import { FilterBar, FilterState } from '@/app/components/filter-sidebar'; // dùng FilterBar
import { CarCard } from '@/app/components/car-card';
import { carApi } from '@/app/api/api';
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
    priceRange: [0, 250],
    fuelTypes: [],
    minRating: 0
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await carApi.getAll();
        setCars(data.map(mapCarResponseToFrontend));
      } catch (err) {
        setError('Không thể tải danh sách xe. Vui lòng thử lại.');
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

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (searchLocation && !car.location.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }
      if (filters.carTypes.length > 0 && !filters.carTypes.includes(car.type)) {
        return false;
      }
      if (car.pricePerDay < filters.priceRange[0] || car.pricePerDay > filters.priceRange[1]) {
        return false;
      }
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
        return false;
      }
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

        {/* NEW: Filter bar nằm ngang dưới search */}
        <div className="mt-4">
          <FilterBar value={filters} onFilterChange={handleFilterChange} />
        </div>

        <main className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Cars</h2>
            <p className="text-gray-600">{filteredCars.length} cars available</p>
          </div>

          {loading && (
            <div className="text-center py-12 text-gray-500">Đang tải danh sách xe...</div>
          )}

          {error && <div className="text-center py-12 text-red-500">{error}</div>}

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
  );
}