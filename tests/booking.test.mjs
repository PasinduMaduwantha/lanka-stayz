import test from 'node:test';
import assert from 'node:assert/strict';
import { nightsBetween, validateStay, validateGuest, todayISO } from '../src/booking.mjs';
test('night calculation crosses months and handles leap years', () => {
  assert.equal(nightsBetween('2028-02-28','2028-03-01'),2);
  assert.equal(nightsBetween('2026-12-31','2027-01-02'),2);
});
test('rejects missing, past, reversed and same-day dates', () => {
  for (const dates of [['',''],['2026-11-03','2026-11-06'],['2026-11-05','2026-11-04'],['2026-11-05','2026-11-05']]) {
    assert.notEqual(validateStay(...dates,2,6,'2026-11-04'),'');
  }
  assert.equal(validateStay('2026-11-04','2026-11-06',2,6,'2026-11-04'),'');
});
test('enforces positive integer guest capacity', () => {
  for (const guests of [0,-1,1.5,7,'NaN']) assert.notEqual(validateStay('2026-11-05','2026-11-06',guests,6,'2026-11-04'),'');
  assert.equal(validateStay('2026-11-05','2026-11-06','6',6,'2026-11-04'),'');
});
test('validates name, email and international contact number', () => {
  assert.equal(validateGuest('Sam Perera','sam@example.com','+94 77 123 4567'),'');
  for (const args of [['  ','sam@example.com','0771234567'],['Sam','invalid','0771234567'],['Sam','sam@example.com','abc0771234567'],['Sam','sam@example.com','123']]) assert.notEqual(validateGuest(...args),'');
});
test('today is formatted for date inputs', () => assert.match(todayISO(),/^\d{4}-\d{2}-\d{2}$/));
