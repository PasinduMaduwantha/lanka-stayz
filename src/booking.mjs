// Pure domain rules shared by the UI and Node tests. No guest data is persisted.
export function todayISO() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (type) => parts.find(part => part.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function nightsBetween(checkIn, checkOut) {
  return Math.round((Date.parse(checkOut + 'T00:00:00Z') - Date.parse(checkIn + 'T00:00:00Z')) / 86400000);
}
export function validateStay(checkIn, checkOut, guests, capacity = 12, today = todayISO()) {
  if (!checkIn || !checkOut) return 'Please choose both check-in and check-out dates.';
  if (!Number.isFinite(Date.parse(checkIn)) || !Number.isFinite(Date.parse(checkOut))) return 'Please choose valid dates.';
  if (checkIn < today) return 'Check-in cannot be in the past.';
  if (nightsBetween(checkIn, checkOut) < 1) return 'Check-out must be after check-in.';
  if (!Number.isInteger(Number(guests)) || Number(guests) < 1 || Number(guests) > capacity) return `Please choose between 1 and ${capacity} guests.`;
  return '';
}
export function validateGuest(name, email, phone) {
  if (name.trim().length < 2) return 'Please enter your full name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
  if (!/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15) return 'Please enter a valid contact number (7–15 digits).';
  return '';
}
