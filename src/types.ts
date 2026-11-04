export type Stay = { checkIn: string; checkOut: string; guests: string };
export type DemoRequest = {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'Pending response' | 'Accepted in demo' | 'Declined in demo';
};
