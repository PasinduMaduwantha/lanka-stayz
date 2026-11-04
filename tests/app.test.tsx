import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { BookingModal } from '../src/BookingModal';
import { properties } from '../src/data';

function route(path: string) {
  window.history.replaceState(null, '', `/${path}`);
}
function renderExplore() {
  route('#/explore');
  return render(<App />);
}
const future = { checkIn: '2028-12-10', checkOut: '2028-12-13', guests: '2' };
describe('Application interactions', () => {
  it('renders a complete homepage and six property cards', () => {
    render(<App />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Somewhere');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
  it('filters destination using the search control', async () => {
    renderExplore();
    await userEvent.selectOptions(screen.getByLabelText('Destination'), 'Ella');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article')).toHaveAccessibleName('Ella Forest Hideaway');
  });
  it('applies a property type checkbox and resets it', async () => {
    renderExplore();
    await userEvent.click(screen.getByLabelText('Villa', { exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Reset all', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });
  it('applies a facility filter', async () => {
    renderExplore();
    await userEvent.click(screen.getByLabelText('Private pool', { exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article')).toHaveAccessibleName('The Palm House');
  });
  it('shows a recoverable empty state for too many guests', async () => {
    renderExplore();
    await userEvent.selectOptions(screen.getByLabelText('Number of guests'), '12');
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });
  it('sorts result cards by price', async () => {
    renderExplore();
    await userEvent.selectOptions(screen.getByLabelText('Sort properties'), 'price-low');
    expect(screen.getAllByRole('article')[0]).toHaveAccessibleName('Ella Forest Hideaway');
  });
  it('saves and unsaves a property without storing guest details', async () => {
    renderExplore();
    await userEvent.click(screen.getByRole('button', { name: 'Save The Palm House', exact: true }));
    expect(JSON.parse(localStorage.getItem('lanka-saved')!)).toEqual(['palm-house']);
    expect(
      screen.getByRole('button', { name: 'Unsave The Palm House', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByLabelText('Only saved stays'));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await userEvent.click(
      screen.getByRole('button', { name: 'Unsave The Palm House', exact: true }),
    );
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
  it('recovers from corrupt local storage', () => {
    localStorage.setItem('lanka-saved', 'broken-json');
    renderExplore();
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });
  it('ignores unknown saved IDs', () => {
    localStorage.setItem('lanka-saved', '["unknown",42,"palm-house"]');
    renderExplore();
    expect(screen.getByRole('button', { name: 'Saved stays, 1 saved' })).toBeInTheDocument();
  });
  it.each(properties)('renders three gallery photographs for $name', (p) => {
    route(`#/stays/${p.id}`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(p.name);
    expect(screen.getAllByRole('button', { name: /Enlarge property photo/ })).toHaveLength(3);
  });
  it('opens and closes the photo dialog', async () => {
    route('#/stays/palm-house');
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Enlarge property photo 1' }));
    expect(screen.getByRole('dialog', { name: 'Property photograph' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('renders a safe not-found page for an invalid property ID', () => {
    route('#/stays/not-a-property');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A little off the map');
    expect(screen.queryByRole('button', { name: 'Request booking' })).not.toBeInTheDocument();
  });
  it('skip link focuses main without changing the hash route', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(location.hash).toBe('#/');
  });
  it('opens mobile navigation with an expanded state', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
  it('validates same-day search dates before navigating', async () => {
    render(<App />);
    fireEvent.input(screen.getByLabelText('Check-in', { exact: true }), {
      target: { value: '2028-12-10' },
    });
    fireEvent.input(screen.getByLabelText('Check-out', { exact: true }), {
      target: { value: '2028-12-10' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Search', exact: true }));
    expect(screen.getByRole('alert')).toHaveTextContent('Check-out must be after check-in');
    expect(location.hash).toBe('#/');
  });
});

describe('Booking form', () => {
  function booking(stay = future) {
    const onClose = vi.fn(),
      onStay = vi.fn();
    render(<BookingModal property={properties[0]} stay={stay} onClose={onClose} onStay={onStay} />);
    return { onClose, onStay };
  }
  async function guest() {
    await userEvent.type(screen.getByLabelText('Full name'), 'Demo Guest');
    await userEvent.type(screen.getByLabelText('Email address'), 'demo@example.com');
    await userEvent.type(screen.getByLabelText('Contact number'), '+94 77 123 4567');
  }
  it('requires all contact fields', () => {
    booking();
    for (const label of ['Full name', 'Email address', 'Contact number'])
      expect(screen.getByLabelText(label)).toBeRequired();
  });
  it('calculates nights and total, then confirms without persisting personal data', async () => {
    const { onStay } = booking();
    await guest();
    expect(screen.getByText('LKR 126,000')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Submit booking request' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your demo booking request is complete',
    );
    expect(screen.getByRole('status')).toHaveTextContent('LKR 126,000 estimated total');
    expect(onStay).toHaveBeenCalledWith(future);
    expect(localStorage.length).toBe(0);
  });
  it('rejects same-day dates and announces the reason', async () => {
    booking({ ...future, checkOut: future.checkIn });
    await guest();
    await userEvent.click(screen.getByRole('button', { name: 'Submit booking request' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Check-out must be after check-in');
  });
  it('rejects a malformed telephone number', async () => {
    booking();
    await guest();
    await userEvent.clear(screen.getByLabelText('Contact number'));
    await userEvent.type(screen.getByLabelText('Contact number'), 'abcdefg');
    await userEvent.click(screen.getByRole('button', { name: 'Submit booking request' }));
    expect(screen.getByRole('alert')).toHaveTextContent('valid contact number');
  });
  it('bounds the guest stepper at capacity', async () => {
    booking({ ...future, guests: '6' });
    expect(screen.getByRole('button', { name: 'Add a guest' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Remove a guest' }));
    expect(screen.getByLabelText('Booking guests')).toHaveValue(5);
  });
  it('bounds the guest stepper at one guest', () => {
    booking({ ...future, guests: '1' });
    expect(screen.getByRole('button', { name: 'Remove a guest' })).toBeDisabled();
  });
  it('closes the dialog and restores document scroll', async () => {
    const { onClose } = booking();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
