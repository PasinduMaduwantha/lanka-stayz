import { describe, expect, it } from 'vitest';
import { properties } from '../src/data';
import { selectProperties, type Filters } from '../src/catalogue';
const base: Filters = {
  destination: '',
  guests: '2',
  types: [],
  maxPrice: 50000,
  amenities: [],
  savedOnly: false,
  saved: [],
  sort: 'recommended',
};
const select = (changes: Partial<Filters>) => selectProperties(properties, { ...base, ...changes });
describe('Accommodation search rules', () => {
  it('returns all six properties with default filters', () => expect(select({})).toHaveLength(6));
  it.each(['Galle', 'Ella', 'Mirissa', 'Kandy', 'Colombo', 'Nuwara Eliya'])(
    'filters by destination %s',
    (destination) => {
      const found = select({ destination });
      expect(found).toHaveLength(1);
      expect(found[0].location).toBe(destination);
    },
  );
  it('accepts an exact guest capacity and rejects properties below it', () =>
    expect(select({ guests: '6' }).map((p) => p.id)).toEqual(['palm-house', 'kandy-courtyard']));
  it('returns empty results for an oversized party', () =>
    expect(select({ guests: '12' })).toEqual([]));
  it('combines selected property types with OR', () =>
    expect(select({ types: ['Villa', 'Cabin'] })).toHaveLength(2));
  it('combines destination and property type with AND', () =>
    expect(select({ destination: 'Galle', types: ['Cabin'] })).toHaveLength(0));
  it('includes the exact budget boundary', () =>
    expect(select({ maxPrice: 22000 }).map((p) => p.id)).toEqual([
      'ella-hideaway',
      'colombo-loft',
    ]));
  it('requires all selected amenities', () =>
    expect(select({ amenities: ['Private pool', 'Air conditioning'] }).map((p) => p.id)).toEqual([
      'palm-house',
    ]));
  it('filters saved properties only when requested', () => {
    expect(select({ saved: ['palm-house'] })).toHaveLength(6);
    expect(select({ savedOnly: true, saved: ['palm-house'] }).map((p) => p.id)).toEqual([
      'palm-house',
    ]);
  });
  it('handles an empty saved collection', () =>
    expect(select({ savedOnly: true })).toHaveLength(0));
  it('sorts by increasing nightly price', () =>
    expect(select({ sort: 'price-low' }).map((p) => p.price)).toEqual([
      18500, 22000, 24000, 28000, 32000, 42000,
    ]));
  it('sorts by decreasing nightly price', () =>
    expect(select({ sort: 'price-high' })[0].id).toBe('palm-house'));
  it('sorts by rating', () => expect(select({ sort: 'rating' })[0].id).toBe('palm-house'));
  it('does not mutate the shared catalogue when sorting', () => {
    const before = properties.map((p) => p.id);
    select({ sort: 'price-low' });
    expect(properties.map((p) => p.id)).toEqual(before);
  });
});
