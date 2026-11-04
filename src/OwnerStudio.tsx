import { useEffect, useState, type FormEvent } from 'react';
import { Check, House, Inbox, Leaf, Plus, Upload } from 'lucide-react';
import { destinations, money, properties } from './data';
import { Dialog } from './BookingModal';
import type { DemoRequest } from './types';
type Draft = {
  id: string;
  name: string;
  location: string;
  price: number;
  guests: number;
  description: string;
  image: string;
  status: 'Listed sample' | 'Draft';
};
const seedDrafts: Draft[] = [
  {
    id: 'sample-palm',
    name: 'The Palm House',
    location: 'Galle',
    price: 42000,
    guests: 6,
    description: 'An inviting coastal escape with space to slow down.',
    image: properties[0].image,
    status: 'Listed sample',
  },
  {
    id: 'sample-cottage',
    name: 'Courtyard Cottage',
    location: 'Kandy',
    price: 24000,
    guests: 4,
    description: 'A quiet garden home in the heart of the hills.',
    image: properties[3].image,
    status: 'Draft',
  },
];
export function RequestList({
  requests,
  onStatus,
}: {
  requests: DemoRequest[];
  onStatus?: (id: string, status: DemoRequest['status']) => void;
}) {
  return requests.length ? (
    <div className="request-list">
      {requests.map((r) => {
        const p = properties.find((p) => p.id === r.propertyId);
        return (
          <article className="request-card" key={r.id}>
            <div>
              <span
                className={`studio-status ${r.status === 'Pending response' ? 'studio-status-draft' : ''}`}
              >
                {r.status}
              </span>
              <h3>{p?.name || 'Sample property'}</h3>
              <p>
                {r.checkIn} → {r.checkOut} · {r.guests} guests
              </p>
              <strong>LKR {money(r.total)} estimated total</strong>
              <small>Reference: {r.id}. Session-only demo; no real reservation.</small>
            </div>
            {onStatus && r.status === 'Pending response' && (
              <div className="request-actions">
                <button className="button" onClick={() => onStatus(r.id, 'Accepted in demo')}>
                  Accept request
                </button>
                <button
                  className="outline-button"
                  onClick={() => onStatus(r.id, 'Declined in demo')}
                >
                  Decline
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  ) : (
    <div className="studio-empty">
      <Inbox size={30} />
      <h3>Your next chapter starts with a request.</h3>
      <p>Try the booking form on a property to see the session-only request journey here.</p>
      <a className="text-link" href="#/explore">
        Explore stays
      </a>
    </div>
  );
}
export function TravellerRequests({ requests }: { requests: DemoRequest[] }) {
  return (
    <section className="container traveller-requests">
      <div className="editorial-heading">
        <span className="eyebrow">A LITTLE CLOSER TO YOUR GETAWAY</span>
        <h1>
          Your island <em>plans.</em>
        </h1>
        <p>
          Requests from this browser session. Nothing has been sent to a host or saved to a server.
        </p>
      </div>
      <RequestList requests={requests} />
    </section>
  );
}
export function OwnerStudio({
  requests,
  onStatus,
  active = true,
}: {
  requests: DemoRequest[];
  onStatus: (id: string, status: DemoRequest['status']) => void;
  active?: boolean;
}) {
  const [tab, setTab] = useState<'properties' | 'requests'>('properties');
  const [drafts, setDrafts] = useState<Draft[]>(seedDrafts);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (!active) setShowEditor(false);
  }, [active]);
  return (
    <section className="container studio-page">
      <div className="studio-disclosure">
        <Leaf size={15} />
        <span>
          Host studio preview · No account is signed in. Drafts and request changes last only for
          this session.
        </span>
      </div>
      <div className="studio-shell">
        <aside className="studio-sidebar">
          <span className="eyebrow">LANKA STAYZ / HOST STUDIO</span>
          <div className="studio-avatar">LS</div>
          <h2>Make yourself at home.</h2>
          <p>Your space, their next story.</p>
          <div role="tablist" aria-label="Host studio sections">
            <button
              role="tab"
              aria-selected={tab === 'properties'}
              aria-controls="studio-properties"
              id="studio-properties-tab"
              className={tab === 'properties' ? 'studio-tab active' : 'studio-tab'}
              onClick={() => setTab('properties')}
            >
              <House size={17} />
              My properties
            </button>
            <button
              role="tab"
              aria-selected={tab === 'requests'}
              aria-controls="studio-requests"
              id="studio-requests-tab"
              className={tab === 'requests' ? 'studio-tab active' : 'studio-tab'}
              onClick={() => setTab('requests')}
            >
              <Inbox size={17} />
              Booking requests{' '}
              <b>{requests.filter((r) => r.status === 'Pending response').length}</b>
            </button>
          </div>
          <div className="studio-google">
            <span>Owner access preview</span>
            <button
              className="outline-button"
              onClick={() =>
                setNotice(
                  'Google sign-in is not connected. This studio is a clearly labelled prototype. Secure owner access and real storage require backend configuration.',
                )
              }
            >
              <span className="google-letter" aria-hidden="true">
                G
              </span>
              Continue with Google
            </button>
            <small>Design preview · Not connected</small>
          </div>
        </aside>
        <div className="studio-content">
          <div className="studio-heading">
            <div>
              <span className="eyebrow">MAKE SOMEONE FEEL AT HOME</span>
              <h1>
                Your host <em>studio.</em>
              </h1>
            </div>
            <button
              className="button"
              onClick={() => {
                setEditing(null);
                setShowEditor(true);
              }}
            >
              <Plus size={17} />
              Add a property
            </button>
          </div>
          {notice && (
            <p className="studio-notice" role="status">
              {notice}
              <button aria-label="Dismiss studio notice" onClick={() => setNotice('')}>
                ×
              </button>
            </p>
          )}
          <div
            id="studio-properties"
            role="tabpanel"
            aria-labelledby="studio-properties-tab"
            hidden={tab !== 'properties'}
          >
            <div className="studio-welcome">
              <Leaf size={24} />
              <div>
                <strong>A thoughtful stay starts with you.</strong>
                <p>Keep your details fresh and help guests know what to look forward to.</p>
              </div>
            </div>
            <div className="studio-list">
              {drafts.map((d) => (
                <article className="studio-property" key={d.id}>
                  <img src={d.image} alt="Sample Sri Lankan property inspiration" />
                  <div>
                    <h3>{d.name}</h3>
                    <p>
                      {d.location} · LKR {money(d.price)} / night · {d.guests} guests
                    </p>
                    <span
                      className={`studio-status ${d.status === 'Draft' ? 'studio-status-draft' : ''}`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <button
                    className="outline-button"
                    aria-label={`Edit ${d.name}`}
                    onClick={() => {
                      setEditing(d);
                      setShowEditor(true);
                    }}
                  >
                    Edit listing
                  </button>
                </article>
              ))}
            </div>
            <p className="studio-footnote">
              Drafts are not published to traveller search. This separate module demonstrates the
              host workflow without claiming authentication or durable storage.
            </p>
          </div>
          <div
            id="studio-requests"
            role="tabpanel"
            aria-labelledby="studio-requests-tab"
            hidden={tab !== 'requests'}
          >
            <h2>Conversations worth having.</h2>
            <p className="studio-footnote">
              Requests are not confirmed reservations. This demo inbox mirrors the current traveller
              session.
            </p>
            <RequestList requests={requests} onStatus={onStatus} />
          </div>
        </div>
      </div>
      {showEditor && (
        <ListingEditor
          draft={editing}
          onClose={() => setShowEditor(false)}
          onSave={(draft) => {
            setDrafts((current) =>
              editing ? current.map((d) => (d.id === editing.id ? draft : d)) : [...current, draft],
            );
            setShowEditor(false);
            setTab('properties');
            setNotice('Draft saved for this session only. Nothing was uploaded or published.');
          }}
        />
      )}
    </section>
  );
}
function ListingEditor({
  draft,
  onSave,
  onClose,
}: {
  draft: Draft | null;
  onSave: (draft: Draft) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState({
    name: draft?.name || '',
    location: draft?.location || 'Galle',
    price: String(draft?.price || 18000),
    guests: String(draft?.guests || 2),
    description: draft?.description || '',
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    if (values.name.trim().length < 3) {
      setError('Give your property a name with at least 3 characters.');
      return;
    }
    if (!Number.isFinite(Number(values.price)) || Number(values.price) < 1000) {
      setError('Enter a nightly rate of at least LKR 1,000.');
      return;
    }
    if (
      !Number.isInteger(Number(values.guests)) ||
      Number(values.guests) < 1 ||
      Number(values.guests) > 20
    ) {
      setError('Choose a guest capacity between 1 and 20.');
      return;
    }
    onSave({
      id: draft?.id || crypto.randomUUID(),
      name: values.name.trim(),
      location: values.location,
      price: Number(values.price),
      guests: Number(values.guests),
      description: values.description.trim(),
      image: draft?.image || properties.find((p) => p.location === values.location)!.image,
      status: 'Draft',
    });
  }
  return (
    <Dialog onClose={onClose} className="listing-editor" label="Property listing editor">
      <span className="eyebrow">HOST STUDIO · LISTING EDITOR</span>
      <h2>{draft ? 'Polish your place.' : 'Make room for a new story.'}</h2>
      <form onSubmit={submit}>
        <label>
          Property name
          <input
            required
            maxLength={100}
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Give your place a name"
          />
        </label>
        <div className="form-row">
          <label>
            Destination
            <select
              value={values.location}
              onChange={(e) => setValues({ ...values, location: e.target.value })}
            >
              {destinations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>
            Nightly rate · LKR
            <input
              type="number"
              min="1000"
              required
              value={values.price}
              onChange={(e) => setValues({ ...values, price: e.target.value })}
            />
          </label>
        </div>
        <label>
          Maximum guests
          <input
            type="number"
            min="1"
            max="20"
            required
            value={values.guests}
            onChange={(e) => setValues({ ...values, guests: e.target.value })}
          />
        </label>
        <label>
          Describe your space
          <textarea
            maxLength={2000}
            rows={3}
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            placeholder="What will guests love about staying here?"
          />
        </label>
        <label className="studio-upload">
          <Upload size={20} />
          <span>Preview a property photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (
                !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                file.size > 5 * 1024 * 1024
              ) {
                setError('Choose a JPG, PNG or WebP smaller than 5 MB.');
                return;
              }
              setError('');
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
        {preview && (
          <img
            className="studio-upload-preview"
            src={preview}
            alt="Selected photo preview — not uploaded"
          />
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button full" type="submit">
          Save as draft <Check size={17} />
        </button>
        <p className="modal-fineprint">
          Session-only prototype. Photo previews are not uploaded or attached to saved drafts.
          Secure accounts, uploads and publication will require a backend.
        </p>
      </form>
    </Dialog>
  );
}
