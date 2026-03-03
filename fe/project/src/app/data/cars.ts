export interface Car {
  id: number;
  name: string;
  type: 'SUV' | 'Sedan' | 'Electric' | 'Sports' | 'Compact' | 'Convertible';
  image: string;
  images?: string[]; // Additional images for gallery
  rating: number;
  reviews: number;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  pricePerDay: number;
  location: string;
  // Detailed information
  year?: number;
  licensePlate?: string;
  description?: string;
  features?: string[];
  owner?: {
    name: string;
    avatar: string;
    rating: number;
    totalTrips: number;
    responseTime: string;
    joinedYear: number;
  };
  specifications?: {
    brand: string;
    model: string;
    consumption: string;
    luggage: number;
    doors: number;
  };
  policies?: {
    cancellation: string;
    deposit: number;
    additionalDriver: number;
    overtime: number;
  };
  additionalInfo?: {
    delivery: boolean;
    gps: boolean;
    bluetooth: boolean;
    airConditioning: boolean;
    childSeat: boolean;
    usbPort: boolean;
  };
}

export interface Review {
  id: number;
  carId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    carId: 1,
    userName: 'John Smith',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 5,
    date: '2026-01-15',
    comment: 'Amazing car! The Range Rover was in perfect condition and Michael was very responsive. Highly recommend!'
  },
  {
    id: 2,
    carId: 1,
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 5,
    date: '2026-01-10',
    comment: 'Perfect for our family trip. Very comfortable and smooth ride. Owner was professional and helpful.'
  },
  {
    id: 3,
    carId: 1,
    userName: 'David Lee',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 4,
    date: '2026-01-05',
    comment: 'Great experience overall. The car is luxurious and well-maintained. Would rent again!'
  },
  {
    id: 4,
    carId: 2,
    userName: 'Lisa Anderson',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 5,
    date: '2026-01-20',
    comment: 'The BMW was absolutely perfect! Sarah was very accommodating and the car was spotless.'
  },
  {
    id: 5,
    carId: 2,
    userName: 'Robert Taylor',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 5,
    date: '2026-01-18',
    comment: 'Excellent car for business meetings. Very comfortable and professional. Highly recommended!'
  }
];

export const cars: Car[] = [
  {
    id: 1,
    name: 'Range Rover Sport',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1747414632749-6c8b14ba30fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjBjYXJ8ZW58MXx8fHwxNzY4MjE1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1747414632749-6c8b14ba30fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjBjYXJ8ZW58MXx8fHwxNzY4MjE1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    rating: 4.8,
    reviews: 128,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Diesel',
    pricePerDay: 120,
    location: 'Los Angeles',
    year: 2023,
    licensePlate: 'LA-9876',
    description: 'Experience luxury and power with the Range Rover Sport. Perfect for city drives and weekend getaways. This premium SUV offers exceptional comfort, advanced safety features, and impressive performance.',
    features: ['Leather Seats', 'Panoramic Sunroof', 'Premium Sound System', 'Parking Sensors', 'Cruise Control', 'Backup Camera', 'Lane Assist', 'Heated Seats'],
    owner: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.9,
      totalTrips: 245,
      responseTime: '1 hour',
      joinedYear: 2020
    },
    specifications: {
      brand: 'Land Rover',
      model: 'Range Rover Sport',
      consumption: '8.5L/100km',
      luggage: 3,
      doors: 5
    },
    policies: {
      cancellation: 'Free cancellation up to 24 hours before pickup',
      deposit: 500,
      additionalDriver: 15,
      overtime: 25
    },
    additionalInfo: {
      delivery: true,
      gps: true,
      bluetooth: true,
      airConditioning: true,
      childSeat: true,
      usbPort: true
    }
  },
  {
    id: 2,
    name: 'BMW 5 Series',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjgyMzMwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjgyMzMwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    rating: 4.9,
    reviews: 215,
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Petrol',
    pricePerDay: 95,
    location: 'San Francisco',
    year: 2022,
    licensePlate: 'SF-5421',
    description: 'Elegant and powerful BMW 5 Series, perfect for business trips or special occasions. Enjoy the ultimate driving machine with cutting-edge technology and premium comfort.',
    features: ['Premium Sound System', 'Navigation System', 'Adaptive Cruise Control', 'Parking Assistant', 'Wireless Charging', 'Sport Seats', 'Digital Cockpit', 'Ambient Lighting'],
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 5.0,
      totalTrips: 312,
      responseTime: '30 min',
      joinedYear: 2019
    },
    specifications: {
      brand: 'BMW',
      model: '5 Series',
      consumption: '7.2L/100km',
      luggage: 2,
      doors: 4
    },
    policies: {
      cancellation: 'Free cancellation up to 48 hours before pickup',
      deposit: 400,
      additionalDriver: 12,
      overtime: 20
    },
    additionalInfo: {
      delivery: true,
      gps: true,
      bluetooth: true,
      airConditioning: true,
      childSeat: false,
      usbPort: true
    }
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
