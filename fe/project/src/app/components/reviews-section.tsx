import { Star } from 'lucide-react';
import { Review } from '@/app/data/cars';

interface ReviewsSectionProps {
  carId: number;
  reviews: Review[];
  rating: number;
  totalReviews: number;
}

export function ReviewsSection({ carId, reviews, rating, totalReviews }: ReviewsSectionProps) {
  const carReviews = reviews.filter(r => r.carId === carId);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-bold text-gray-900">{rating}</span>
          <span className="text-gray-500">({totalReviews} reviews)</span>
        </div>
      </div>

      {carReviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review this car!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {carReviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalReviews > carReviews.length && carReviews.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 rounded-lg font-semibold transition-all hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
          >
            View All {totalReviews} Reviews
          </button>
        </div>
      )}
    </div>
  );
}