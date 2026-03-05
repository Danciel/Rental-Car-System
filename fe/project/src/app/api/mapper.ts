import { CarResponse } from "./api";
import { Car } from "@/app/data/cars";

export function mapCarResponseToFrontend(car: CarResponse): Car {
  const thumbnail = car.images?.find(img => img.isThumbnail)?.imageUrl
    ?? car.images?.[0]?.imageUrl
    ?? "/placeholder-car.jpg";
  const FRONTEND_URL = "http://localhost:5173";
  const resolveImageUrl = (url: string) => {
  if (!url) return "/images/placeholder.jpg";
  if (url.startsWith("http")) return url;        // external URL, use as-is
  return `${FRONTEND_URL}${url}`;                // local path, prepend base
};
  const model = car.carModelId ?? car.carModel;

  return {
    id: car.id,
    name: `${model?.brandName ?? ""} ${model?.name ?? ""}`.trim(),
    brandName: model?.brandName ?? car.brandName ?? "",
    image: resolveImageUrl(thumbnail),
    images: car.images?.map(img => resolveImageUrl(img.imageUrl)) ?? [],
    pricePerDay: car.basePricePerDay,
    location: "Hồ Chí Minh",           // not in backend yet, placeholder
    rating: 4.5,                        // not in backend yet, placeholder
    reviews: 0,                         // not in backend yet, placeholder
    transmission: model?.transmission ?? "",
    seats: model?.seats ?? 0,
    fuelType: model?.fuelType ?? "",
    type: model?.typeName ?? "",
    year: model?.year,
    description: model?.description ?? "",
    licensePlate: car.licensePlate,
    specifications: {
      brand: model?.brandName ?? "",
      model: model?.name ?? "",
      consumption: model?.capacityDisplay ?? "",
      luggage: 2,
      doors: 4,
    },
  };
}