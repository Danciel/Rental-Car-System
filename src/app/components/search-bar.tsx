import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface SearchBarProps {
  onSearch: (location: string, startDate: Date | null, endDate: Date | null) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSearch = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    onSearch(location, start, end);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter city or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pick-up Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Return Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 hover:scale-105 shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1E40AF' }}
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
