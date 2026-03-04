import { CarResponse } from "./api";
import { Car } from "@/app/data/cars";

export function mapCarResponseToFrontend(car: CarResponse): Car {
  const thumbnail = car.images?.find(img => img.isThumbnail)?.imageUrl
    ?? car.images?.[0]?.imageUrl
    ?? "/placeholder-car.jpg";

  return {
    id: car.id,
    name: `${car.carModel?.brandName ?? ""} ${car.carModel?.name ?? ""}`.trim(),
    image: thumbnail,
    images: car.images?.map(img => img.imageUrl) ?? [],
    pricePerDay: car.basePricePerDay,
    location: "Hồ Chí Minh",           // not in backend yet, placeholder
    rating: 4.5,                        // not in backend yet, placeholder
    reviews: 0,                         // not in backend yet, placeholder
    transmission: car.carModel?.transmission ?? "",
    seats: car.carModel?.seats ?? 0,
    fuelType: car.carModel?.fuelType ?? "",
    type: car.carModel?.typeName ?? "",
    year: car.carModel?.year,
    description: car.carModel?.description ?? "",
    licensePlate: car.licensePlate,
    specifications: {
      brand: car.carModel?.brandName ?? "",
      model: car.carModel?.name ?? "",
      consumption: car.carModel?.capacityDisplay ?? "",
      luggage: 2,
      doors: 4,
    },
  };
}