import type { Property } from './data';
export type Filters = {
  destination: string;
  guests: string;
  types: string[];
  maxPrice: number;
  amenities: string[];
  savedOnly: boolean;
  saved: string[];
  sort: string;
};
export function selectProperties(catalogue: Property[], filters: Filters): Property[] {
  return catalogue
    .filter(
      (p) =>
        (!filters.destination || p.location === filters.destination) &&
        p.guests >= Number(filters.guests) &&
        (!filters.types.length || filters.types.includes(p.type)) &&
        p.price <= filters.maxPrice &&
        filters.amenities.every((a) => p.amenities.includes(a)) &&
        (!filters.savedOnly || filters.saved.includes(p.id)),
    )
    .sort((a, b) =>
      filters.sort === 'price-low'
        ? a.price - b.price
        : filters.sort === 'price-high'
          ? b.price - a.price
          : filters.sort === 'rating'
            ? Number(b.rating) - Number(a.rating)
            : 0,
    );
}
