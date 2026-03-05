import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;

  // controlled mode (SearchPage sẽ truyền value vào)
  value?: FilterState;
}

export interface FilterState {
  carTypes: string[];
  priceRange: [number, number];
  fuelTypes: string[];
  minRating: number;
}

type OverlayKey = 'carType' | 'priceRange' | 'fuelType' | 'minRating' | null;

const DEFAULT_FILTERS: FilterState = {
  carTypes: [],
  priceRange: [0, 250],
  fuelTypes: [],
  minRating: 0
};

// Fixed lists (y như file cũ)
const CAR_TYPES = ['SUV', 'Sedan', 'Electric', 'Sports', 'Compact', 'Convertible'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

function Overlay({
  open,
  title,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel: giữa màn hình, gần phía trên, dạng ngang */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[96px] w-[min(980px,calc(100%-24px))]">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#1E40AF] text-white hover:bg-[#1a3699] transition-colors"
            >
              Done
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function FilterBar({ onFilterChange, value }: FilterBarProps) {
  const [openOverlay, setOpenOverlay] = useState<OverlayKey>(null);

  // local state (sync từ value nếu có)
  const [filters, setFilters] = useState<FilterState>(value ?? DEFAULT_FILTERS);

  useEffect(() => {
    if (value) setFilters(value);
  }, [value]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.carTypes.length > 0 ||
      filters.fuelTypes.length > 0 ||
      filters.minRating > 0 ||
      filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
      filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
    );
  }, [filters]);

  const apply = (next: FilterState) => {
    setFilters(next);
    onFilterChange(next);
  };

  const resetAll = () => {
    apply(DEFAULT_FILTERS);
    setOpenOverlay(null);
  };

  // Labels (nhìn “giống SaaS” hơn)
  const carTypeLabel = filters.carTypes.length ? `Car Type · ${filters.carTypes.length}` : 'Car Type';
  const fuelTypeLabel = filters.fuelTypes.length ? `Fuel Type · ${filters.fuelTypes.length}` : 'Fuel Type';
  const ratingLabel = filters.minRating ? `Minimum Rating · ${filters.minRating}+` : 'Minimum Rating';
  const priceLabel =
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
      ? `Price Range · $${filters.priceRange[0]} - $${filters.priceRange[1]}/day`
      : 'Price Range';

  return (
    <>
      {/* Horizontal bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => setOpenOverlay('carType')}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors"
          >
            {carTypeLabel}
          </button>

          <button
            type="button"
            onClick={() => setOpenOverlay('priceRange')}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors"
          >
            {priceLabel}
          </button>

          <button
            type="button"
            onClick={() => setOpenOverlay('fuelType')}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors"
          >
            {fuelTypeLabel}
          </button>

          <button
            type="button"
            onClick={() => setOpenOverlay('minRating')}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors"
          >
            {ratingLabel}
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={resetAll}
            disabled={!hasActiveFilters}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
              hasActiveFilters
                ? 'bg-[#F97316] text-white hover:bg-[#ea6a0a]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            )}
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Overlay 1: Car Type */}
      <Overlay
        open={openOverlay === 'carType'}
        title="Car Type"
        onClose={() => setOpenOverlay(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAR_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.carTypes.includes(type)}
                onChange={() => {
                  const nextCarTypes = filters.carTypes.includes(type)
                    ? filters.carTypes.filter((t) => t !== type)
                    : [...filters.carTypes, type];

                  apply({ ...filters, carTypes: nextCarTypes });
                }}
                className="w-4 h-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => apply({ ...filters, carTypes: [] })}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Clear
          </button>
          <div className="text-sm text-gray-500">Selected: {filters.carTypes.length}</div>
        </div>
      </Overlay>

      {/* Overlay 2: Price Range */}
      <Overlay
        open={openOverlay === 'priceRange'}
        title="Price Range"
        onClose={() => setOpenOverlay(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Min</h4>
            <label className="text-sm text-gray-600 mb-2 block">
              Min: ${filters.priceRange[0]}/day
            </label>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                const next: [number, number] = [v, Math.max(v, filters.priceRange[1])];
                apply({ ...filters, priceRange: next });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#1E40AF' }}
            />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Max</h4>
            <label className="text-sm text-gray-600 mb-2 block">
              Max: ${filters.priceRange[1]}/day
            </label>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                const next: [number, number] = [Math.min(filters.priceRange[0], v), v];
                // đảm bảo min <= max
                const fixed: [number, number] = [Math.min(next[0], next[1]), Math.max(next[0], next[1])];
                apply({ ...filters, priceRange: fixed });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#1E40AF' }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => apply({ ...filters, priceRange: DEFAULT_FILTERS.priceRange })}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Reset price
          </button>
          <div className="text-sm text-gray-500">
            Current: ${filters.priceRange[0]} - ${filters.priceRange[1]}/day
          </div>
        </div>
      </Overlay>

      {/* Overlay 3: Fuel Type */}
      <Overlay
        open={openOverlay === 'fuelType'}
        title="Fuel Type"
        onClose={() => setOpenOverlay(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FUEL_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.fuelTypes.includes(type)}
                onChange={() => {
                  const nextFuelTypes = filters.fuelTypes.includes(type)
                    ? filters.fuelTypes.filter((t) => t !== type)
                    : [...filters.fuelTypes, type];

                  apply({ ...filters, fuelTypes: nextFuelTypes });
                }}
                className="w-4 h-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => apply({ ...filters, fuelTypes: [] })}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Clear
          </button>
          <div className="text-sm text-gray-500">Selected: {filters.fuelTypes.length}</div>
        </div>
      </Overlay>

      {/* Overlay 4: Minimum Rating */}
      <Overlay
        open={openOverlay === 'minRating'}
        title="Minimum Rating"
        onClose={() => setOpenOverlay(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => apply({ ...filters, minRating: rating })}
                className="w-4 h-4 border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 group-hover:text-gray-900">{rating}+ & up</span>
              </div>
            </label>
          ))}

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === 0}
              onChange={() => apply({ ...filters, minRating: 0 })}
              className="w-4 h-4 border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
            />
            <span className="text-gray-700 group-hover:text-gray-900">All Ratings</span>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => apply({ ...filters, minRating: 0 })}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Clear
          </button>
          <div className="text-sm text-gray-500">
            Current: {filters.minRating === 0 ? 'All' : `${filters.minRating}+`}
          </div>
        </div>
      </Overlay>
    </>
  );
}

/**
 * Optional alias để không vỡ code cũ nếu chỗ khác vẫn import FilterSidebar
 * (Bạn có thể xoá alias này nếu không cần)
 */
export { FilterBar as FilterSidebar };