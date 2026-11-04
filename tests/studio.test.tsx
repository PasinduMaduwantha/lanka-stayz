import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { OwnerStudio, TravellerRequests } from '../src/OwnerStudio';
import { BookingModal } from '../src/BookingModal';
import { properties } from '../src/data';
import type { DemoRequest } from '../src/types';
const sample: DemoRequest = {
  id: 'LS-TEST-ONE',
  propertyId: 'palm-house',
  checkIn: '2028-12-10',
  checkOut: '2028-12-13',
  guests: 2,
  total: 126000,
  status: 'Pending response',
};
function explore() {
  window.history.replaceState(null, '', '/#/explore');
  render(<App />);
}
describe('Property comparison', () => {
  it('adds and removes a property from comparison', async () => {
    explore();
    const card = screen.getByRole('article', { name: 'The Palm House' });
    await userEvent.click(within(card).getByLabelText('Compare this stay'));
    expect(within(card).getByLabelText('Compare this stay')).toBeChecked();
    await userEvent.click(screen.getByRole('link', { name: 'Compare side by side' }));
    expect(
      await screen.findByRole('article', { name: 'Compare The Palm House' }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove The Palm House from comparison' }),
    );
    expect(screen.getByText('A little space to decide.')).toBeInTheDocument();
  });
  it('limits comparison to three unique stays', async () => {
    explore();
    const cards = screen.getAllByRole('article');
    for (const card of cards.slice(0, 4))
      await userEvent.click(within(card).getByLabelText('Compare this stay'));
    expect(screen.getByRole('alert')).toHaveTextContent('Compare up to three stays');
    expect(within(cards[3]).getByLabelText('Compare this stay')).not.toBeChecked();
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(3);
  });
  it('renders a recoverable empty comparison route', () => {
    window.history.replaceState(null, '', '/#/compare');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Which one feels');
    expect(screen.getByRole('link', { name: 'Find a stay' })).toHaveAttribute('href', '#/explore');
  });
});
describe('Separate owner studio prototype', () => {
  function studio(requests: DemoRequest[] = []) {
    const onStatus = vi.fn();
    render(<OwnerStudio requests={requests} onStatus={onStatus} />);
    return { onStatus };
  }
  it('explicitly discloses that Google sign-in is not connected', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
    expect(screen.getByRole('status')).toHaveTextContent('Google sign-in is not connected');
  });
  it('adds a session-only property draft', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    const dialog = screen.getByRole('dialog', { name: 'Property listing editor' });
    await userEvent.type(within(dialog).getByLabelText('Property name'), 'Tropical Test Villa');
    await userEvent.selectOptions(within(dialog).getByLabelText('Destination'), 'Ella');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save as draft' }));
    expect(screen.getByRole('heading', { name: 'Tropical Test Villa' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Nothing was uploaded or published');
    expect(localStorage.length).toBe(0);
  });
  it('edits an existing draft without adding another', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Edit Courtyard Cottage' }));
    const field = screen.getByLabelText('Property name');
    await userEvent.clear(field);
    await userEvent.type(field, 'Courtyard Retreat');
    await userEvent.click(screen.getByRole('button', { name: 'Save as draft' }));
    expect(screen.queryByRole('heading', { name: 'Courtyard Cottage' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Courtyard Retreat' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
  it('rejects a name that is too short', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    await userEvent.type(screen.getByLabelText('Property name'), 'A');
    await userEvent.click(screen.getByRole('button', { name: 'Save as draft' }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 3 characters');
  });
  it('cancels an editor without adding a listing', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
  it('previews a supported photo locally and releases its temporary URL on close', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    fireEvent.change(screen.getByLabelText('Preview a property photo'), {
      target: { files: [new File(['sample'], 'photo.jpg', { type: 'image/jpeg' })] },
    });
    expect(
      screen.getByRole('img', { name: 'Selected photo preview — not uploaded' }),
    ).toHaveAttribute('src', 'blob:sample-photo');
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:sample-photo');
  });
  it('rejects unsupported photo types', async () => {
    studio();
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    fireEvent.change(screen.getByLabelText('Preview a property photo'), {
      target: { files: [new File(['unsafe'], 'document.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a JPG, PNG or WebP');
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
  it('accepts a sample request through the status callback', async () => {
    const { onStatus } = studio([sample]);
    await userEvent.click(screen.getByRole('tab', { name: /Booking requests/ }));
    expect(screen.getByText('Pending response')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Accept request' }));
    expect(onStatus).toHaveBeenCalledWith(sample.id, 'Accepted in demo');
  });
  it('declines a sample request through the status callback', async () => {
    const { onStatus } = studio([sample]);
    await userEvent.click(screen.getByRole('tab', { name: /Booking requests/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Decline', exact: true }));
    expect(onStatus).toHaveBeenCalledWith(sample.id, 'Declined in demo');
  });
  it('does not offer to accept a request that is already handled', async () => {
    studio([{ ...sample, status: 'Accepted in demo' }]);
    await userEvent.click(screen.getByRole('tab', { name: /Booking requests/ }));
    expect(screen.queryByRole('button', { name: 'Accept request' })).not.toBeInTheDocument();
  });
  it('shows the traveller request status and estimate without contact details', () => {
    render(<TravellerRequests requests={[sample]} />);
    expect(screen.getByText('Pending response')).toBeInTheDocument();
    expect(screen.getByText('LKR 126,000 estimated total')).toBeInTheDocument();
    expect(screen.getByText(/Nothing has been sent/)).toBeInTheDocument();
  });
  it('emits only non-contact request data after valid booking submission', async () => {
    const onRequest = vi.fn();
    render(
      <BookingModal
        property={properties[0]}
        stay={{ checkIn: sample.checkIn, checkOut: sample.checkOut, guests: '2' }}
        onStay={vi.fn()}
        onClose={vi.fn()}
        onRequest={onRequest}
      />,
    );
    await userEvent.type(screen.getByLabelText('Full name'), 'Private Guest');
    await userEvent.type(screen.getByLabelText('Email address'), 'private@example.com');
    await userEvent.type(screen.getByLabelText('Contact number'), '0771234567');
    await userEvent.click(screen.getByRole('button', { name: 'Submit booking request' }));
    expect(onRequest).toHaveBeenCalledOnce();
    expect(onRequest.mock.calls[0][0]).toMatchObject({
      propertyId: 'palm-house',
      status: 'Pending response',
      total: 126000,
    });
    expect(onRequest.mock.calls[0][0]).not.toHaveProperty('email');
    expect(onRequest.mock.calls[0][0]).not.toHaveProperty('name');
    expect(onRequest.mock.calls[0][0]).not.toHaveProperty('phone');
    expect(screen.getByRole('link', { name: 'View my session requests' })).toHaveAttribute(
      'href',
      '#/requests',
    );
  });
  it('keeps owner drafts when navigating away and back in the same app session', async () => {
    window.history.replaceState(null, '', '/#/owner');
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    await userEvent.type(screen.getByLabelText('Property name'), 'Session Garden Villa');
    await userEvent.click(screen.getByRole('button', { name: 'Save as draft' }));
    await userEvent.click(screen.getByRole('link', { name: 'Home', exact: true }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Somewhere'),
    );
    await userEvent.click(screen.getByRole('link', { name: 'Host your space' }));
    expect(
      await screen.findByRole('heading', { name: 'Session Garden Villa' }),
    ).toBeInTheDocument();
  });
  it('closes the listing editor if browser navigation leaves the studio', async () => {
    window.history.replaceState(null, '', '/#/owner');
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Add a property' }));
    window.history.replaceState(null, '', '/#/');
    fireEvent(window, new HashChangeEvent('hashchange'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
