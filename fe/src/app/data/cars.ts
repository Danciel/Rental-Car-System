export interface Car {
  id: number;
  name: string;
  type: 'SUV' | 'Sedan' | 'Electric' | 'Sports' | 'Compact' | 'Convertible';
  image: string;
  rating: number;
  reviews: number;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  pricePerDay: number;
  location: string;
}

export const cars: Car[] = [
  {
    id: 1,
    name: 'Range Rover Sport',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1747414632749-6c8b14ba30fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjBjYXJ8ZW58MXx8fHwxNzY4MjE1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 128,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Diesel',
    pricePerDay: 120,
    location: 'Los Angeles'
  },
  {
    id: 2,
    name: 'BMW 5 Series',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjgyMzMwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 215,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Petrol',
    pricePerDay: 95,
    location: 'San Francisco'
  },
  {
    id: 3,
    name: 'Tesla Model 3',
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1719772692993-933047b8ea4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMHRlc2xhfGVufDF8fHx8MTc2ODMwMDI2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5.0,
    reviews: 342,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Electric',
    pricePerDay: 89,
    location: 'Seattle'
  },
  {
    id: 4,
    name: 'Porsche 911',
    type: 'Sports',
    image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzY4MjYzMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviews: 89,
    transmission: 'Manual',
    seats: 4,
    fuelType: 'Petrol',
    pricePerDay: 199,
    location: 'Miami'
  },
  {
    id: 5,
    name: 'Honda Civic',
    type: 'Compact',
    image: 'https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyfGVufDF8fHx8MTc2ODI4Njg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    reviews: 178,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Petrol',
    pricePerDay: 45,
    location: 'New York'
  },
  {
    id: 6,
    name: 'Mercedes Convertible',
    type: 'Convertible',
    image: 'https://images.unsplash.com/photo-1656011475851-23f591606c0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJ0aWJsZSUyMGNhcnxlbnwxfHx8fDE3NjgyMzExOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 156,
    transmission: 'Automatic',
    seats: 4,
    fuelType: 'Petrol',
    pricePerDay: 145,
    location: 'Los Angeles'
  },
  {
    id: 7,
    name: 'Audi Q7',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1747414632749-6c8b14ba30fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjBjYXJ8ZW58MXx8fHwxNzY4MjE1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviews: 203,
    transmission: 'Automatic',
    seats: 7,
    fuelType: 'Diesel',
    pricePerDay: 135,
    location: 'Chicago'
  },
  {
    id: 8,
    name: 'Toyota Camry',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjgyMzMwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    reviews: 267,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Hybrid',
    pricePerDay: 65,
    location: 'Boston'
  },
  {
    id: 9,
    name: 'Tesla Model Y',
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1719772692993-933047b8ea4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMHRlc2xhfGVufDF8fHx8MTc2ODMwMDI2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 298,
    transmission: 'Automatic',
    seats: 7,
    fuelType: 'Electric',
    pricePerDay: 105,
    location: 'Austin'
  },
  {
    id: 10,
    name: 'Ford Mustang',
    type: 'Sports',
    image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzY4MjYzMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    reviews: 145,
    transmission: 'Manual',
    seats: 4,
    fuelType: 'Petrol',
    pricePerDay: 110,
    location: 'Dallas'
  },
  {
    id: 11,
    name: 'Mini Cooper',
    type: 'Compact',
    image: 'https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyfGVufDF8fHx8MTc2ODI4Njg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
    reviews: 92,
    transmission: 'Automatic',
    seats: 4,
    fuelType: 'Petrol',
    pricePerDay: 55,
    location: 'Portland'
  },
  {
    id: 12,
    name: 'BMW Z4 Roadster',
    type: 'Convertible',
    image: 'https://images.unsplash.com/photo-1656011475851-23f591606c0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJ0aWJsZSUyMGNhcnxlbnwxfHx8fDE3NjgyMzExOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviews: 134,
    transmission: 'Automatic',
    seats: 2,
    fuelType: 'Petrol',
    pricePerDay: 125,
    location: 'San Diego'
  }
];
