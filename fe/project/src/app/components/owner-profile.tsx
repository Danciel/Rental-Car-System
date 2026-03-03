import { Star, MessageCircle, Shield } from 'lucide-react';
import { Car } from '@/app/data/cars';

interface OwnerProfileProps {
  owner: Car['owner'];
}

export function OwnerProfile({ owner }: OwnerProfileProps) {
  if (!owner) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Car Owner</h2>
      
      <div className="flex items-start gap-4 mb-6">
        <img
          src={owner.avatar}
          alt={owner.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{owner.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{owner.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{owner.totalTrips} trips</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Joined in {owner.joinedYear}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{owner.totalTrips}</p>
          <p className="text-sm text-gray-500">Total Trips</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{owner.responseTime}</p>
          <p className="text-sm text-gray-500">Response Time</p>
        </div>
      </div>

      <button
        className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 border-2 flex items-center justify-center gap-2"
        style={{ 
          borderColor: '#1E40AF',
          color: '#1E40AF'
        }}
      >
        <MessageCircle className="w-5 h-5" />
        Contact Owner
      </button>
    </div>
  );
}
