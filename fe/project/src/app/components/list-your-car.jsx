import { useState, useEffect } from 'react';
import { Check, Upload, X, Car, FileText, Camera, ArrowLeft, ArrowRight } from 'lucide-react';
import { carOwnerApi } from '@/app/api/car';
import { carApi, carBrandApi } from '@/app/api/api';  // reuse existing

export function ListYourCar({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({ registration: null, insurance: null });
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Brand/Model dynamic data ──────────────────────────────────────────
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  const [formData, setFormData] = useState({
    licensePlate: '',
    dailyRate: '',
    depositAmount: ''
  });

  // Fetch brands on mount
  useEffect(() => {
    carBrandApi.getAll().then(setBrands).catch(console.error);
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrandId) { setModels([]); setSelectedModelId(''); return; }
    fetch(`http://localhost:8080/api/cars/brands/${selectedBrandId}/models`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
    })
      .then(r => r.json())
      .then(json => setModels(json.data ?? []))
      .catch(console.error);
  }, [selectedBrandId]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) setUploadedDocs({ ...uploadedDocs, [type]: file });
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
  };

  const removePhoto = (id) => setUploadedPhotos(uploadedPhotos.filter(p => p.id !== id));
  const removeDocument = (type) => setUploadedDocs({ ...uploadedDocs, [type]: null });

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const canProceed = () => {
    if (currentStep === 1) return selectedBrandId && selectedModelId && formData.licensePlate;
    if (currentStep === 2) return uploadedDocs.registration && uploadedDocs.insurance;
    if (currentStep === 3) return uploadedPhotos.length >= 3 && formData.dailyRate;
    return false;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const email = localStorage.getItem('USER_EMAIL') ?? '';

      // Photos: in a real app upload to storage and get URLs back.
      // For now use object URLs as placeholder — replace with real upload if needed.
      const images = uploadedPhotos.map((photo, index) => ({
        imageUrl: photo.preview,
        isThumbnail: index === 0   // first photo is thumbnail
      }));

      await carOwnerApi.registerCar({
        licensePlate:   formData.licensePlate.toUpperCase(),
        basePricePerDay: Number(formData.dailyRate),
        depositAmount:   formData.depositAmount ? Number(formData.depositAmount) : Number(formData.dailyRate),
        carModelId:      Number(selectedModelId),
        images
      }, email);

      alert('Xe của bạn đã được gửi để xét duyệt!\nChúng tôi sẽ phản hồi trong vòng 24 giờ.');
      onClose();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Car Information', icon: Car },
    { number: 2, title: 'Legal Documents', icon: FileText },
    { number: 3, title: 'Photos & Pricing', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register to Rent Your Car</h1>
          <p className="text-gray-600">Complete 3 steps to start earning money from your car</p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-[#1E40AF] text-white' :
                      isActive    ? 'bg-[#1E40AF] text-white ring-4 ring-[#1E40AF]/20' :
                                    'bg-gray-200 text-gray-500'}`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold ${isActive ? 'text-[#1E40AF]' : 'text-gray-600'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Step {step.number}/3</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.number ? 'bg-[#1E40AF]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">

          {/* Step 1: Car Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Car Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Brand — dynamic from API */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBrandId}
                    onChange={e => { setSelectedBrandId(e.target.value); setSelectedModelId(''); }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  >
                    <option value="">Select brand</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Model — dynamic, filtered by brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedModelId}
                    onChange={e => setSelectedModelId(e.target.value)}
                    disabled={!selectedBrandId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {selectedBrandId ? 'Select model' : 'Select brand first'}
                    </option>
                    {models.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.year})</option>
                    ))}
                  </select>
                </div>

                {/* License Plate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="e.g. 30A-12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] uppercase"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Car information must match registration documents.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Legal Documents — unchanged */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Legal Documents</h2>

              {['registration', 'insurance'].map(type => (
                <div key={type}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {type === 'registration' ? 'Vehicle Registration' : 'Car Insurance'}
                    <span className="text-red-500"> *</span>
                  </label>
                  {!uploadedDocs[type] ? (
                    <label className="block">
                      <input type="file" accept="image/*,.pdf"
                        onChange={e => handleFileUpload(type, e)} className="hidden" />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1E40AF] hover:bg-blue-50 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 10MB)</p>
                      </div>
                    </label>
                  ) : (
                    <div className="border border-gray-300 rounded-xl p-4 flex items-center justify-between bg-green-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{uploadedDocs[type].name}</p>
                          <p className="text-xs text-gray-500">{(uploadedDocs[type].size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => removeDocument(type)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Documents must be valid and will be reviewed within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Photos & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Photos & Pricing</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Car photos (Minimum 3) <span className="text-red-500">*</span>
                </label>
                <label className="block mb-4">
                  <input type="file" accept="image/*" multiple onChange={handlePhotosUpload} className="hidden" />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1E40AF] hover:bg-blue-50 transition-all cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Add exterior and interior photos</p>
                    <p className="text-xs text-gray-500">PNG, JPG (select multiple at once)</p>
                  </div>
                </label>
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.preview} alt="Car"
                          className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-[#1E40AF] text-white text-xs px-2 py-1 rounded-lg font-semibold">
                            Thumbnail
                          </span>
                        )}
                        <button onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Uploaded: {uploadedPhotos.length} photos
                  {uploadedPhotos.length < 3 && ` (need ${3 - uploadedPhotos.length} more)`}
                </p>
              </div>

              {/* Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental price (VND/day) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type="number" name="dailyRate" value={formData.dailyRate}
                    onChange={handleInputChange} placeholder="e.g. 500000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">VND/day</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Suggested: 400,000đ – 800,000đ/day</p>
              </div>

              {/* Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit amount (VND) <span className="text-gray-400 font-normal">— optional, defaults to daily rate</span>
                </label>
                <div className="relative">
                  <input type="number" name="depositAmount" value={formData.depositAmount}
                    onChange={handleInputChange} placeholder="Leave blank to use daily rate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">VND</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  <strong>Almost done!</strong> After submission, staff will review and respond within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-6">
          <button onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < 3 ? (
            <button onClick={handleNext} disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed() ? 'bg-[#1E40AF] text-white hover:bg-[#1a3699] shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed() && !isSubmitting ? 'bg-[#1E40AF] text-white hover:bg-[#1a3699] shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <Check className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit for review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}