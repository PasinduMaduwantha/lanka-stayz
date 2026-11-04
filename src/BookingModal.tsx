import React, { useEffect, useRef, useState } from 'react';
import { X, Check, ArrowRight, ArrowUpRight, Minus, Plus } from 'lucide-react';
import { money, type Property } from './data';
import { todayISO, nightsBetween, validateStay, validateGuest } from './booking.mjs';
import type { Stay, DemoRequest } from './types';
export function Dialog({
  children,
  onClose,
  className = '',
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current!;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label || (className === 'lightbox' ? 'Property photograph' : 'Booking request')}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <button className="dialog-close" onClick={onClose} aria-label="Close dialog">
        <X size={21} />
      </button>
      {children}
    </dialog>
  );
}
export function BookingModal({
  property,
  stay,
  onClose,
  onStay,
  onRequest,
}: {
  property: Property;
  stay: Stay;
  onClose: () => void;
  onStay: (s: Stay) => void;
  onRequest?: (request: DemoRequest) => void;
}) {
  const [values, setValues] = useState({ ...stay, name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);
  const update = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const problem =
      validateGuest(values.name, values.email, values.phone) ||
      validateStay(values.checkIn, values.checkOut, values.guests, property.guests);
    if (problem) {
      setError(problem);
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    onStay({ checkIn: values.checkIn, checkOut: values.checkOut, guests: values.guests });
    const id = `LS-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setReference(id);
    onRequest?.({
      id,
      propertyId: property.id,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: Number(values.guests),
      total: nightsBetween(values.checkIn, values.checkOut) * property.price,
      status: 'Pending response',
    });
  };
  return (
    <Dialog onClose={onClose} className="booking-modal">
      {reference ? (
        <div className="confirmation" role="status">
          <div className="success-icon">
            <Check size={30} />
          </div>
          <div className="eyebrow">YOUR ISLAND DAYDREAM, ONE STEP CLOSER</div>
          <h2>
            Looking forward
            <br />
            to <em>somewhere.</em>
          </h2>
          <p>Thank you, {values.name.trim()}. Your demo booking request is complete.</p>
          <div className="confirmation-details">
            <strong>{property.name}</strong>
            <span>
              {values.checkIn} → {values.checkOut}
            </span>
            <span>
              {values.guests} guests · {nightsBetween(values.checkIn, values.checkOut)} nights
            </span>
            <strong>
              LKR {money(nightsBetween(values.checkIn, values.checkOut) * property.price)} estimated
              total
            </strong>
            <small>Demo reference: {reference}</small>
          </div>
          <p className="muted">
            This is a sample confirmation. Nothing was sent to a host or saved to a server, no email
            will be delivered, and no reservation has been made.
          </p>
          <button className="button full" onClick={onClose}>
            Keep exploring <ArrowRight size={17} />
          </button>
          {onRequest && (
            <a className="confirmation-request-link" href="#/requests" onClick={onClose}>
              View my session requests <ArrowRight size={15} />
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="eyebrow">A LITTLE CLOSER TO YOUR GETAWAY</div>
          <h2>
            Make it <em>a plan.</em>
          </h2>
          <div className="modal-property">
            <img src={property.image} alt="" />
            <div>
              <strong>{property.name}</strong>
              <span>
                {property.location} · Up to {property.guests} guests
              </span>
              <small>LKR {money(property.price)} / night</small>
            </div>
          </div>
          <form onSubmit={submit}>
            <label>
              Full name
              <input
                autoComplete="name"
                name="name"
                required
                maxLength={100}
                value={values.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your full name"
              />
            </label>
            <div className="form-row">
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  name="email"
                  required
                  maxLength={254}
                  value={values.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Contact number
                <input
                  type="tel"
                  autoComplete="tel"
                  name="phone"
                  required
                  maxLength={25}
                  value={values.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+94 77 123 4567"
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Check-in
                <input
                  type="date"
                  name="checkIn"
                  required
                  min={todayISO()}
                  value={values.checkIn}
                  onInput={(e) => update('checkIn', e.currentTarget.value)}
                />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  name="checkOut"
                  required
                  min={values.checkIn || todayISO()}
                  value={values.checkOut}
                  onInput={(e) => update('checkOut', e.currentTarget.value)}
                />
              </label>
            </div>
            <label>
              Number of guests
              <div className="guest-stepper">
                <button
                  type="button"
                  aria-label="Remove a guest"
                  disabled={Number(values.guests) <= 1}
                  onClick={() => update('guests', String(Number(values.guests) - 1))}
                >
                  <Minus size={16} />
                </button>
                <input
                  aria-label="Booking guests"
                  type="number"
                  min="1"
                  max={property.guests}
                  required
                  value={values.guests}
                  onChange={(e) => update('guests', e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Add a guest"
                  disabled={Number(values.guests) >= property.guests}
                  onClick={() => update('guests', String(Number(values.guests) + 1))}
                >
                  <Plus size={16} />
                </button>
                <span>Maximum {property.guests} guests</span>
              </div>
            </label>
            {nightsBetween(values.checkIn, values.checkOut) > 0 && (
              <div className="price-total">
                <span>
                  {nightsBetween(values.checkIn, values.checkOut)} nights · Estimated total
                </span>
                <strong>
                  LKR {money(nightsBetween(values.checkIn, values.checkOut) * property.price)}
                </strong>
              </div>
            )}
            {error && (
              <p ref={errorRef} tabIndex={-1} role="alert" className="form-error">
                {error}
              </p>
            )}
            <button type="submit" className="button full">
              Submit booking request <ArrowUpRight size={18} />
            </button>
            <p className="modal-fineprint">
              Demo only. Your details stay in memory until this form is closed. No payment, email or
              real reservation.
            </p>
          </form>
        </>
      )}
    </Dialog>
  );
}
