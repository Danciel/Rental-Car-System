import { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

export function CustomFilter({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lấy nhãn hiển thị của option đang chọn
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative flex-1 min-w-[160px]">
      {/* Nút bấm trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Đóng khi click ra ngoài
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border rounded-xl transition-all duration-200
          ${isOpen ? "border-blue-500 ring-4 ring-blue-500/10 bg-white" : "border-gray-200 hover:border-gray-300"}`}
      >
        <div className="flex items-center gap-2.5">
          <Filter className={`w-4 h-4 ${isOpen ? "text-blue-500" : "text-gray-400"}`} />
          <span className="text-sm font-medium text-gray-700">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Danh sách Options tùy chỉnh (Phần bạn muốn chỉnh CSS) */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <ul className="py-1">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                  ${value === opt.value 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:bg-gray-50"}`}
              >
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}