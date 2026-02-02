import { useState } from 'react';
import { Card } from '@/app/components/ui/card'; 
import { Star, MessageSquareText, AlertTriangle, User, Calendar, Tag, Shield, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

export function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'disputes'

  // --- Mock Data for Reviews & Ratings (Tiếng Việt như yêu cầu) ---
  const reviewsData = [
    {
      id: 'REV-001',
      user: 'Nguyễn Văn A',
      car: 'VinFast VF8',
      rating: 5,
      comment: 'Xe rất mới và sạch sẽ, chủ xe nhiệt tình. Sẽ thuê lại lần sau!',
      date: '2024-05-20'
    },
    {
      id: 'REV-002',
      user: 'Lê Thị B',
      car: 'Toyota Camry',
      rating: 3,
      comment: 'Xe hơi cũ so với hình ảnh, nhưng vẫn chạy ổn. Chủ xe phản hồi hơi chậm.',
      date: '2024-05-18'
    },
    {
      id: 'REV-003',
      user: 'Trần Minh C',
      car: 'Hyundai Accent',
      rating: 1,
      comment: 'Ghế ngồi bị rách, xe có mùi khó chịu. Trải nghiệm rất tệ!',
      date: '2024-05-17'
    }
  ];

  // --- Mock Data for Disputes & Reports (Tiếng Việt như yêu cầu) ---
  const disputesData = [
    {
      id: 'DIS-001',
      reporter: 'Hoàng Văn D',
      target: 'Chủ xe: Nguyễn E',
      car: 'Kia Seltos - 51F-678.90',
      issue: 'Chủ xe từ chối giao xe dù đã xác nhận. Yêu cầu hoàn cọc.',
      evidence: true,
      date: '2024-05-21',
      priority: 'High',
      status: 'pending' // pending, resolved, rejected
    },
    {
      id: 'DIS-002',
      reporter: 'Phạm Thị G',
      target: 'Xe: VinFast Lux A - 29A-123.45',
      car: 'VinFast Lux A - 29A-123.45',
      issue: 'Xe bị trầy xước nhẹ ở cửa sau khi nhận, nhưng chủ xe không ghi nhận.',
      evidence: true,
      date: '2024-05-19',
      priority: 'Medium',
      status: 'resolved'
    }
  ];

  const getStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleResolveDispute = (id) => {
    console.log(`Resolving dispute: ${id}`);
    // Logic to update status to 'resolved' in your actual data
  };

  const handleRejectDispute = (id) => {
    console.log(`Rejecting dispute: ${id}`);
    // Logic to open a modal for rejection reason, then update status
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback & Disputes</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user reviews, ratings and resolve disputes</p>
        </div>
      </div>

      {/* Tabs for Reviews and Disputes */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Star className="w-4 h-4" /> Reviews & Ratings
        </button>
        <button 
          onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'disputes' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <AlertTriangle className="w-4 h-4" /> Disputes & Reports
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsData.map(review => (
            <Card key={review.id} className="p-5 border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-900">{review.user}</span>
                </div>
                <div className="flex items-center">{getStarRating(review.rating)}</div>
              </div>
              <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 flex-1">"{review.comment}"</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-4 h-4 text-[#1E40AF]" />
                  <span className="text-[#1E40AF] font-semibold">{review.car}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{review.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 gap-4">
          {disputesData.map(dispute => (
            <Card key={dispute.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Status & Meta */}
                <div className="md:w-48 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dispute.id}</span>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit uppercase mt-1 ${
                    dispute.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {dispute.priority} Priority
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit uppercase ${
                    dispute.status === 'pending' ? 'bg-amber-100 text-amber-700' : dispute.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {dispute.status}
                  </div>
                </div>

                {/* Middle: Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{dispute.reporter} <span className="font-normal text-gray-500">reported</span> {dispute.target}</h3>
                    <p className="text-xs text-[#1E40AF] font-medium mt-0.5">{dispute.car}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                    "{dispute.issue}"
                  </p>

                  {dispute.evidence && (
                    <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                      <ImageIcon className="w-4 h-4" />
                      View Evidence Photos
                    </button>
                  )}
                </div>

                {/* Right Side: Actions */}
                <div className="flex md:flex-col justify-end gap-2">
                  <button onClick={() => handleResolveDispute(dispute.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Resolve
                  </button>
                  <button onClick={() => handleRejectDispute(dispute.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}