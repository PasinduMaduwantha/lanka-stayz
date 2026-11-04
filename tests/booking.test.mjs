import test from 'node:test';
import assert from 'node:assert/strict';
import {
  nightsBetween,
  validateStay,
  validateGuest,
  todayISO,
  isCalendarDate,
} from '../src/booking.mjs';
test('night calculation crosses months and handles leap years', () => {
  assert.equal(nightsBetween('2028-02-28', '2028-03-01'), 2);
  assert.equal(nightsBetween('2026-12-31', '2027-01-02'), 2);
});
test('rejects missing, past, reversed and same-day dates', () => {
  for (const dates of [
    ['', ''],
    ['2026-11-03', '2026-11-06'],
    ['2026-11-05', '2026-11-04'],
    ['2026-11-05', '2026-11-05'],
  ]) {
    assert.notEqual(validateStay(...dates, 2, 6, '2026-11-04'), '');
  }
  assert.equal(validateStay('2026-11-04', '2026-11-06', 2, 6, '2026-11-04'), '');
});
test('enforces positive integer guest capacity', () => {
  for (const guests of [0, -1, 1.5, 7, 'NaN'])
    assert.notEqual(validateStay('2026-11-05', '2026-11-06', guests, 6, '2026-11-04'), '');
  assert.equal(validateStay('2026-11-05', '2026-11-06', '6', 6, '2026-11-04'), '');
});
test('validates name, email and international contact number', () => {
  assert.equal(validateGuest('Sam Perera', 'sam@example.com', '+94 77 123 4567'), '');
  for (const args of [
    ['  ', 'sam@example.com', '0771234567'],
    ['Sam', 'invalid', '0771234567'],
    ['Sam', 'sam@example.com', 'abc0771234567'],
    ['Sam', 'sam@example.com', '123'],
  ])
    assert.notEqual(validateGuest(...args), '');
});
test('today is formatted for date inputs', () => assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/));
for (const value of [
  '2027-02-29',
  '2026-02-30',
  '2026-04-31',
  '2026-00-10',
  '2026-13-01',
  '2026-11-00',
  '11/04/2026',
  '2026-1-1',
  'invalid',
  null,
  undefined,
]) {
  test(`rejects non-calendar ISO date ${String(value)}`, () =>
    assert.equal(isCalendarDate(value), false));
}
for (const value of ['2028-02-29', '2026-12-31', '2027-01-01']) {
  test(`accepts calendar date ${value}`, () => assert.equal(isCalendarDate(value), true));
}
test('invalid date arithmetic never shows a fabricated total', () =>
  assert.equal(Number.isNaN(nightsBetween('2027-02-29', '2027-03-02')), true));
test('rejects normalised impossible calendar dates in a request', () =>
  assert.notEqual(validateStay('2027-02-30', '2027-03-04', 2, 6, '2026-11-04'), ''));
test('rejects blank guest count and fractional guest string', () => {
  for (const n of ['', ' ', '2.5'])
    assert.notEqual(validateStay('2027-01-01', '2027-01-03', n, 6, '2026-11-04'), '');
});
test('supports trimmed names, subdomain emails and formatted phones', () =>
  assert.equal(
    validateGuest('  Sam Perera  ', ' sam@travel.example.com ', '(+94) 77-123-4567'),
    '',
  ));
test('rejects overlong email addresses', () =>
  assert.notEqual(validateGuest('Sam', 'a'.repeat(250) + '@example.com', '0771234567'), ''));
