import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Eye, FileText, MapPin, Calendar, Info } from 'lucide-react';

// --- Rejection Reason Modal ---
export function RejectModal({ isOpen, onClose, onConfirm, title }) {
  const [reason, setReason] = useState('');
  
  const commonReasons = ["Ảnh bị mờ", "Tài liệu hết hạn", "Thông tin không khớp", "Thiếu bảo hiểm"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Request</h3>
        <p className="text-sm text-gray-500 mb-4 font-medium italic">"{title}"</p>
        
        <label className="block text-sm font-bold text-gray-700 mb-2">Reason for rejection</label>
        <textarea 
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none mb-4 text-sm"
          placeholder="Type the reason why this request was rejected..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2 mb-6">
          {commonReasons.map(r => (
            <button 
              key={r} 
              onClick={() => setReason(r)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-[11px] font-bold text-gray-600 transition-colors"
            >
              + {r}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold">Cancel</button>
          <button 
            disabled={!reason}
            onClick={() => { onConfirm(reason); setReason(''); }}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            Send & Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Detail View Modal ---
export function DetailViewModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Review Request Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Info className="w-4 h-4" /> Info</h4>
              <p className="text-sm font-bold text-gray-800">Submitter: <span className="font-normal">{data.user}</span></p>
              <p className="text-sm font-bold text-gray-800">Date: <span className="font-normal">{data.date}</span></p>
              {type === 'car' && (
                <>
                  <p className="text-sm font-bold text-gray-800">Car model: <span className="font-normal text-blue-600">{data.carName}</span></p>
                  <p className="text-sm font-bold text-gray-800">License plate: <span className="font-normal">{data.plate}</span></p>
                </>
              )}
            </div>
            {/* Documents placeholder */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><FileText className="w-4 h-4" /> Documents</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold border-2 border-dashed border-gray-300">IMAGE_FRONT</div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold border-2 border-dashed border-gray-300">IMAGE_BACK</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold">Close</button>
        </div>
      </div>
    </div>
  );
}