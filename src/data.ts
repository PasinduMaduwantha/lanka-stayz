export type Property = {
  id: string;
  name: string;
  location: string;
  region: string;
  type: string;
  price: number;
  guests: number;
  beds: number;
  baths: number;
  rating: string;
  reviews: number;
  tag: string;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
};
const sriPhoto = (name: string) => '/images/srilanka/' + name;
export const heroImage = sriPhoto('coastal-pool-wide.jpg');
export const properties: Property[] = [
  {
    id: 'palm-house',
    name: 'The Palm House',
    location: 'Galle',
    region: 'Southern coast',
    type: 'Villa',
    price: 42000,
    guests: 6,
    beds: 3,
    baths: 3,
    rating: '4.98',
    reviews: 42,
    tag: 'Guest favourite',
    image: sriPhoto('sri-lanka-bungalow.jpg'),
    gallery: [sriPhoto('galle-villa.png'), sriPhoto('sri-lanka-bedroom.jpg')],
    description:
      'Slow mornings, salt in the air, and a pool all to yourself. Tucked into a leafy garden near the southern coast, The Palm House brings together open living spaces, natural textures and the easy rhythm of island life. Spend the day by the water, then head into Galle for a sunset stroll around the historic fort.',
    amenities: ['Wi-Fi', 'Private pool', 'Air conditioning', 'Free parking', 'Kitchen', 'Garden'],
  },
  {
    id: 'ella-hideaway',
    name: 'Ella Forest Hideaway',
    location: 'Ella',
    region: 'Hill country',
    type: 'Cabin',
    price: 18500,
    guests: 2,
    beds: 1,
    baths: 1,
    rating: '4.96',
    reviews: 28,
    tag: 'Into the green',
    image: sriPhoto('ella-resort.jpg'),
    gallery: [sriPhoto('ella-hotel.jpeg'), sriPhoto('ella-exterior.jpg')],
    description:
      'Wake up to a canopy of green and the quiet of the hills. This intimate forest cabin is a place to pause, read on the terrace and take the long way back from your morning walk. An inviting base for slow days exploring Ella.',
    amenities: [
      'Wi-Fi',
      'Mountain views',
      'Free parking',
      'Breakfast',
      'Private terrace',
      'Hot water',
    ],
  },
  {
    id: 'salt-and-sea',
    name: 'Salt & Sea Retreat',
    location: 'Mirissa',
    region: 'Southern coast',
    type: 'Boutique hotel',
    price: 28000,
    guests: 4,
    beds: 2,
    baths: 2,
    rating: '4.94',
    reviews: 36,
    tag: 'By the ocean',
    image: sriPhoto('coastal-pool.jpg'),
    gallery: [sriPhoto('coastal-garden.jpg'), sriPhoto('mirissa-coast.jpg')],
    description:
      'An ocean-inspired escape made for barefoot days. Settle into a bright, generous room, cool off in the shared pool and explore the cafés and beaches around Mirissa. This sample stay offers a relaxed introduction to the southern coast.',
    amenities: [
      'Wi-Fi',
      'Shared pool',
      'Air conditioning',
      'Free parking',
      'Breakfast',
      'Ocean views',
    ],
  },
  {
    id: 'kandy-courtyard',
    name: 'The Kandy Courtyard',
    location: 'Kandy',
    region: 'Cultural heartland',
    type: 'Holiday home',
    price: 24000,
    guests: 6,
    beds: 3,
    baths: 2,
    rating: '4.92',
    reviews: 23,
    tag: 'Room to reconnect',
    image: sriPhoto('kandy-hotel.jpg'),
    gallery: [sriPhoto('kandy-pool.jpg'), sriPhoto('kandy-garden.jpg')],
    description:
      'A welcoming family home with a secluded courtyard and generous spaces to gather. Find a little quiet among the greenery, share a home-cooked meal and use this peaceful setting as your base for discovering Kandy.',
    amenities: [
      'Wi-Fi',
      'Air conditioning',
      'Free parking',
      'Kitchen',
      'Garden',
      'Washing machine',
    ],
  },
  {
    id: 'colombo-loft',
    name: 'Colombo Skyline Loft',
    location: 'Colombo',
    region: 'City living',
    type: 'Apartment',
    price: 22000,
    guests: 3,
    beds: 2,
    baths: 1,
    rating: '4.89',
    reviews: 31,
    tag: 'A city perspective',
    image: sriPhoto('colombo-hotel.jpg'),
    gallery: [sriPhoto('colombo-pool.jpg'), sriPhoto('sri-lanka-room.jpg')],
    description:
      'A light-filled apartment for your city chapter. Comfortable interiors, a practical kitchen and space to unwind make this an easy home base for discovering Colombo’s neighbourhoods, galleries and food scene.',
    amenities: ['Wi-Fi', 'Air conditioning', 'Free parking', 'Kitchen', 'City views', 'Lift'],
  },
  {
    id: 'tea-country',
    name: 'Tea Country Cottage',
    location: 'Nuwara Eliya',
    region: 'Hill country',
    type: 'Cottage',
    price: 32000,
    guests: 4,
    beds: 2,
    baths: 2,
    rating: '4.97',
    reviews: 19,
    tag: 'A slower kind of stay',
    image: sriPhoto('nuwara-hotel.jpg'),
    gallery: [sriPhoto('nuwara-pool.jpg'), sriPhoto('nuwara-reception.jpg')],
    description:
      'Trade the coast for cool air and a cup of Ceylon tea. This characterful cottage offers cosy corners, a green garden and room for unhurried mornings in Sri Lanka’s tea country.',
    amenities: ['Wi-Fi', 'Free parking', 'Kitchen', 'Garden', 'Hot water', 'Fireplace'],
  },
];
export const destinations = ['Galle', 'Ella', 'Mirissa', 'Kandy', 'Colombo', 'Nuwara Eliya'];
export const money = (amount: number) => new Intl.NumberFormat('en-LK').format(amount);
