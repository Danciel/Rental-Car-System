import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/app/components/search-bar';
import { FilterSidebar, FilterBar, FilterState } from '@/app/components/filter-sidebar'; // dùng FilterBar
import { CarCard } from '@/app/components/car-card';
import { mapCarResponseToFrontend } from '@/app/api/mapper';
import { Car } from '@/app/data/cars';
import { ArrowUp } from 'lucide-react';

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    brandName: [],
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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (location: string, start: Date | null, end: Date | null) => {
    setSearchLocation(location);
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookCar = (carId: number) => {
    onViewCarDetail(carId);
  };

  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (searchLocation && !car.location.toLowerCase().includes(searchLocation.toLowerCase())) return false;
      if ((filters.carTypes ?? []).length > 0 && !filters.carTypes.includes(car.type)) return false;
      if ((filters.brandNames ?? []).length > 0 && !filters.brandNames.includes(car.brandName ?? "")) return false;
      if (car.pricePerDay < filters.priceRange[0] || car.pricePerDay > filters.priceRange[1]) return false;
      if ((filters.fuelTypes ?? []).length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
      if (car.rating < filters.minRating) return false;
      return true;
    });
  }, [cars, searchLocation, filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
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
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full text-white shadow-lg z-50 transition-all hover:opacity-90 hover:scale-110"
          style={{ backgroundColor: '#1E40AF' }}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}