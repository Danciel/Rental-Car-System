import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { SignaturePad } from "@/app/components/SignaturePad";
import { ImageUploader } from "@/app/components/ImageUploader";
import { Calendar, Clock, Car, Hash, Palette, Settings } from "lucide-react";

const CAR_PARTS = [
  "Front Bumper",
  "Rear Bumper",
  "Hood",
  "Trunk/Tailgate",
  "Front Left Door",
  "Front Right Door",
  "Rear Left Door",
  "Rear Right Door",
  "Front Left Fender",
  "Front Right Fender",
  "Rear Left Fender",
  "Rear Right Fender",
  "Windshield",
  "Rear Window",
  "Side Mirrors",
  "Headlights",
  "Taillights",
  "Roof",
  "Front Left Tire",
  "Front Right Tire",
  "Rear Left Tire",
  "Rear Right Tire",
  "Wheel Rims",
  "Interior Dashboard",
  "Seats",
  "Steering Wheel",
];

export function DamageInspectionReport() {
  const [inspectionType, setInspectionType] = useState<"pre-rental" | "post-rental">("pre-rental");
  const [damagedParts, setDamagedParts] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [hostSignature, setHostSignature] = useState<string>("");
  const [renterSignature, setRenterSignature] = useState<string>("");

  const toggleDamage = (part: string) => {
    setDamagedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inspection Report:", {
      inspectionType,
      damagedParts,
      images,
      hostSignature,
      renterSignature,
    });
    alert("Inspection report saved successfully!");
  };

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Vehicle Damage Inspection Report
          </h1>
          <p className="text-gray-600">
            Document vehicle condition {inspectionType === "pre-rental" ? "before" : "after"} rental period
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Inspection Type */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Inspection Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="pre-rental"
                  checked={inspectionType === "pre-rental"}
                  onChange={(e) => setInspectionType(e.target.value as "pre-rental")}
                  className="w-4 h-4 text-[#4A56D5] focus:ring-[#4A56D5]"
                />
                <span className="text-sm font-medium">Pre-Rental (Before Handover)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="post-rental"
                  checked={inspectionType === "post-rental"}
                  onChange={(e) => setInspectionType(e.target.value as "post-rental")}
                  className="w-4 h-4 text-[#4A56D5] focus:ring-[#4A56D5]"
                />
                <span className="text-sm font-medium">Post-Rental (After Return)</span>
              </label>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Inspection Date
              </Label>
              <Input
                type="text"
                value={currentDate}
                readOnly
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Inspection Time
              </Label>
              <Input
                type="text"
                value={currentTime}
                readOnly
                className="bg-gray-50 border-gray-300"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-gray-700">Make</Label>
                <Input
                  id="make"
                  placeholder="e.g., Toyota"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-gray-700">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Camry"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-gray-700">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2023"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license" className="text-gray-700 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  License Plate
                </Label>
                <Input
                  id="license"
                  placeholder="e.g., ABC-1234"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-gray-700 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color
                </Label>
                <Input
                  id="color"
                  placeholder="e.g., Silver"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-gray-700 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Current Mileage (km)
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 45000"
                  className="bg-gray-50 border-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Damage Checklist */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Damage Checklist
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Check all parts that have visible damage, scratches, dents, or defects
            </p>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAR_PARTS.map((part) => (
                  <div key={part} className="flex items-start space-x-3">
                    <Checkbox
                      id={part}
                      checked={damagedParts.includes(part)}
                      onCheckedChange={() => toggleDamage(part)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={part}
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {part}
                    </label>
                  </div>
                ))}
              </div>
              {damagedParts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-sm font-medium text-red-600">
                    {damagedParts.length} damaged part(s) identified
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Vehicle Photos
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload photos from multiple angles (front, rear, sides, interior, damaged areas)
            </p>
            <ImageUploader onImagesChange={setImages} maxImages={15} />
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Signatures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hostName" className="text-gray-700">Host Name</Label>
                  <Input
                    id="hostName"
                    placeholder="Enter host name"
                    className="bg-gray-50 border-gray-300"
                    required
                  />
                </div>
                <SignaturePad
                  label="Host Signature"
                  onSave={setHostSignature}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="renterName" className="text-gray-700">Renter Name</Label>
                  <Input
                    id="renterName"
                    placeholder="Enter renter name"
                    className="bg-gray-50 border-gray-300"
                    required
                  />
                </div>
                <SignaturePad
                  label="Renter Signature"
                  onSave={setRenterSignature}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700">Additional Notes</Label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Any additional observations or comments..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A56D5] focus:border-transparent resize-none"
            />
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>Legal Notice:</strong> By signing this inspection report, both parties acknowledge 
              that they have inspected the vehicle together and agree on its current condition. This 
              document serves as legal evidence of the vehicle's state at the time of inspection and 
              may be used in court proceedings if disputes arise regarding vehicle damage.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-[#4A56D5] hover:bg-[#3A46C5] text-white"
            >
              Save Inspection Report
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
