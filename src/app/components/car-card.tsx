import { Star, Settings, Users } from 'lucide-react';
import type { Car } from '@/app/data/cars';

interface CarCardProps {
  car: Car;
  onBook: (carId: number) => void;
}

export function CarCard({ car, onBook }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
          <span className="text-xs font-semibold" style={{ color: '#1E40AF' }}>
            {car.type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Car Name and Rating */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{car.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({car.reviews} reviews)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
            <Settings className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-sm text-gray-700">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
            <Users className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-sm text-gray-700">{car.seats} Seats</span>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-sm text-gray-700">{car.fuelType}</span>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
              <span className="text-sm text-gray-500">/day</span>
            </div>
          </div>
          <button
            onClick={() => onBook(car.id)}
            className="px-6 py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90 hover:scale-105 shadow-sm"
            style={{ backgroundColor: '#1E40AF' }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
