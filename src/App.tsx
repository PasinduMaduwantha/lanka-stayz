import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  Compass,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import { destinations, heroImage, money, properties, type Property } from './data';
import { todayISO, validateStay, nightsBetween } from './booking.mjs';
import { selectProperties } from './catalogue';
import { BookingModal, Dialog } from './BookingModal';
import type { Stay } from './types';
import './styles.css';

const initialStay: Stay = { checkIn: '', checkOut: '', guests: '2' };
const allTypes = [...new Set(properties.map((p) => p.type))];
const toggle = (items: string[], item: string) =>
  items.includes(item) ? items.filter((x) => x !== item) : [...items, item];
function Brand() {
  return (
    <a className="brand" href="#/" aria-label="Lanka Stayz home">
      <img src="/logo.svg" width="43" height="43" alt="" />
      <span>
        Lanka<span>Stayz</span>
        <small>YOUR ISLAND, YOUR STAY.</small>
      </span>
    </a>
  );
}

export function SearchForm({
  destination,
  setDestination,
  stay,
  setStay,
  onSearch,
}: {
  destination: string;
  setDestination: (value: string) => void;
  stay: Stay;
  setStay: (value: Stay) => void;
  onSearch: () => void;
}) {
  const [error, setError] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    const issue =
      stay.checkIn || stay.checkOut ? validateStay(stay.checkIn, stay.checkOut, stay.guests) : '';
    setError(issue);
    if (!issue) onSearch();
  }
  return (
    <form className="search-panel" onSubmit={submit} aria-label="Search accommodation">
      <label className="destination-input">
        <MapPin size={22} />
        <span>
          <b>Where are you going?</b>
          <select
            aria-label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Anywhere in Sri Lanka</option>
            {destinations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </span>
      </label>
      <label>
        <CalendarDays size={21} />
        <span>
          <b>Check-in</b>
          <input
            type="date"
            aria-label="Check-in"
            min={todayISO()}
            value={stay.checkIn}
            onInput={(e) => setStay({ ...stay, checkIn: e.currentTarget.value })}
          />
        </span>
      </label>
      <label>
        <CalendarDays size={21} />
        <span>
          <b>Check-out</b>
          <input
            type="date"
            aria-label="Check-out"
            min={stay.checkIn || todayISO()}
            value={stay.checkOut}
            onInput={(e) => setStay({ ...stay, checkOut: e.currentTarget.value })}
          />
        </span>
      </label>
      <label>
        <Users size={21} />
        <span>
          <b>Who’s coming?</b>
          <select
            aria-label="Number of guests"
            value={stay.guests}
            onChange={(e) => setStay({ ...stay, guests: e.target.value })}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button className="button search-button" type="submit">
        <Search size={20} /> Search
      </button>
      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function PropertyCard({
  property: p,
  saved,
  onSave,
  list = false,
}: {
  property: Property;
  saved: boolean;
  onSave: () => void;
  list?: boolean;
}) {
  return (
    <article className={`property-card ${list ? 'list-card' : ''}`} aria-label={p.name}>
      <div className="card-photo">
        <a href={`#/stays/${p.id}`} aria-label={`View ${p.name}`}>
          <img
            src={p.image}
            alt={`${p.type} accommodation inspiration in ${p.location}, Sri Lanka`}
            loading="lazy"
          />
        </a>
        <button
          className={`heart-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${p.name}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {!list && <span className="card-tag">{p.tag}</span>}
      </div>
      <div className="card-info">
        <div className="card-location">
          {p.type} <span>·</span> {p.region}
        </div>
        <h3>
          <a href={`#/stays/${p.id}`}>{p.name}</a>
        </h3>
        <a className="location-link" href={`#/stays/${p.id}`}>
          <MapPin size={13} />
          {p.location}, Sri Lanka
        </a>
        {list && <p className="result-description">{p.description.split('. ')[0]}.</p>}
        <p className="card-specs">
          <Users size={13} />
          {p.guests} guests <span>·</span>
          {p.beds} {p.beds === 1 ? 'bedroom' : 'bedrooms'} <span>·</span>
          {p.baths} {p.baths === 1 ? 'bathroom' : 'bathrooms'}
        </p>
        {list && (
          <div className="result-amenities">
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a}>
                <Check size={13} />
                {a}
              </span>
            ))}
          </div>
        )}
        <div className="review">
          <span className="review-score">{(Number(p.rating) * 2).toFixed(1)}</span>
          <strong>Exceptional</strong>
          <small>{p.reviews} sample reviews</small>
        </div>
      </div>
      <div className="card-price">
        <span className="price-label">From, per night</span>
        <strong>LKR {money(p.price)}</strong>
        <small>Sample nightly rate</small>
        <a
          href={`#/stays/${p.id}`}
          className={list ? 'button' : 'card-detail-link'}
          aria-label={`View details of ${p.name}`}
        >
          View details <ArrowRight size={16} />
        </a>
        {list && <small className="availability-note">Request only · no live availability</small>}
      </div>
    </article>
  );
}

function Filters({
  types,
  setTypes,
  maxPrice,
  setMaxPrice,
  amenities,
  setAmenities,
  savedOnly,
  setSavedOnly,
  reset,
}: {
  types: string[];
  setTypes: (s: string[]) => void;
  maxPrice: number;
  setMaxPrice: (n: number) => void;
  amenities: string[];
  setAmenities: (s: string[]) => void;
  savedOnly: boolean;
  setSavedOnly: (v: boolean) => void;
  reset: () => void;
}) {
  return (
    <aside className="filters" aria-label="Property filters">
      <div className="filter-title">
        <h2>Filter by</h2>
        <button className="link-button" onClick={reset}>
          Reset all
        </button>
      </div>
      <fieldset>
        <legend>Your budget (per night)</legend>
        <div className="budget-value">LKR 0 – {money(maxPrice)}</div>
        <input
          type="range"
          aria-label="Maximum price per night"
          min="15000"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <div className="range-labels">
          <span>LKR 15,000</span>
          <span>LKR 50,000</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Property type</legend>
        {allTypes.map((t) => (
          <label key={t}>
            <input
              type="checkbox"
              checked={types.includes(t)}
              onChange={() => setTypes(toggle(types, t))}
            />
            {t}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Popular facilities</legend>
        {['Wi-Fi', 'Free parking', 'Air conditioning', 'Kitchen', 'Private pool'].map((a) => (
          <label key={a}>
            <input
              type="checkbox"
              checked={amenities.includes(a)}
              onChange={() => setAmenities(toggle(amenities, a))}
            />
            {a}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Your collection</legend>
        <label>
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(e) => setSavedOnly(e.target.checked)}
          />
          Only saved stays
        </label>
      </fieldset>
      <div className="filter-help">
        <ShieldCheck size={23} />
        <strong>Explore with confidence</strong>
        <p>Transparent sample pricing. No payments or account needed.</p>
      </div>
    </aside>
  );
}

export default function App() {
  const [route, setRoute] = useState(location.hash || '#/');
  const [menu, setMenu] = useState(false);
  const [destination, setDestination] = useState('');
  const [stay, setStay] = useState<Stay>(initialStay);
  const [types, setTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState('recommended');
  const [savedOnly, setSavedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const data = JSON.parse(localStorage.getItem('lanka-saved') || '[]');
      return Array.isArray(data)
        ? data.filter((x) => typeof x === 'string' && properties.some((p) => p.id === x))
        : [];
    } catch {
      return [];
    }
  });
  const [booking, setBooking] = useState<Property | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const home = route === '#/';
  const explore = route === '#/explore';
  const property = route.startsWith('#/stays/')
    ? properties.find((p) => p.id === route.slice(8))
    : undefined;
  useEffect(() => {
    function change() {
      setRoute(location.hash || '#/');
      setMenu(false);
      setBooking(null);
      setLightbox(null);
      window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('lanka-saved', JSON.stringify(saved));
    } catch {
      /* Optional preference storage can be unavailable. */
    }
  }, [saved]);
  useEffect(() => {
    document.title = `${property?.name || (explore ? 'Explore stays' : home ? 'Find your perfect stay in Sri Lanka' : route === '#/about' ? 'About us' : route === '#/contact' ? 'Contact' : 'Page not found')} | Lanka Stayz`;
  }, [route, property, explore, home]);
  const onSave = (id: string) => setSaved((old) => toggle(old, id));
  const reset = () => {
    setTypes([]);
    setMaxPrice(50000);
    setAmenities([]);
    setSavedOnly(false);
  };
  const discover = (d: string) => {
    setDestination(d);
    reset();
    setStay(initialStay);
    location.hash = '/explore';
  };
  const filtered = selectProperties(properties, {
    destination,
    guests: stay.guests,
    types,
    maxPrice,
    amenities,
    savedOnly,
    saved,
    sort,
  });
  const searchProps = {
    destination,
    setDestination,
    stay,
    setStay,
    onSearch: () => {
      location.hash = '/explore';
    },
  };
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="topbar">
        <span>Ayubowan! Your Sri Lankan escape starts here.</span>
        <span>
          LKR <span className="flag">🇱🇰</span> English
        </span>
      </div>
      <header>
        <div className="container header-inner">
          <Brand />
          <div className="header-actions">
            <span className="currency">LKR · Sri Lanka</span>
            <button
              className="saved-nav"
              onClick={() => {
                setSavedOnly((v) => !v);
                setDestination('');
                setTypes([]);
                setAmenities([]);
                setMaxPrice(50000);
                setStay(initialStay);
                location.hash = '/explore';
              }}
              aria-label={`Saved stays, ${saved.length} saved`}
            >
              <Heart size={19} />
              <span>Saved stays</span>
              {saved.length > 0 && <b>{saved.length}</b>}
            </button>
            <a className="header-help" href="#/contact">
              Need a hand? <ArrowUpRight size={15} />
            </a>
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="container nav-container">
          <nav aria-label="Main navigation" className={menu ? 'nav-open' : ''}>
            {[
              ['Home', '#/'],
              ['Explore Stays', '#/explore'],
              ['About Us', '#/about'],
              ['Contact', '#/contact'],
            ].map(([label, href]) => (
              <a key={href} href={href} aria-current={route === href ? 'page' : undefined}>
                {label === 'Explore Stays' && <BedDouble size={17} />}
                {label}
              </a>
            ))}
          </nav>
          <span className="nav-note">
            <ShieldCheck size={14} /> No account. Just your next adventure.
          </span>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {home && (
          <>
            <section className="hero">
              <img
                src={heroImage}
                className="hero-image"
                alt="Sri Lankan accommodation and tropical landscape inspiration"
                fetchPriority="high"
              />
              <div className="hero-shade" />
              <div className="container hero-content">
                <span className="eyebrow light">
                  ONE BEAUTIFUL ISLAND. COUNTLESS POSSIBILITIES.
                </span>
                <h1>
                  Find your perfect stay
                  <br />
                  in <em>Sri Lanka.</em>
                </h1>
                <p>
                  Beachside mornings, misty hills and a place that feels like you.
                  <br />
                  Discover villas, homes and hideaways across the island.
                </p>
                <a href="#/explore" className="hero-link">
                  Let’s find your somewhere <ArrowRight size={18} />
                </a>
              </div>
              <span className="hero-photo-note">Sri Lanka, waiting to be explored.</span>
            </section>
            <div className="container search-wrap">
              <SearchForm {...searchProps} />
            </div>
            <div className="container trust-strip">
              <span>
                <Check />
                Six distinctive sample stays
              </span>
              <span>
                <ShieldCheck />
                No booking fees in this demo
              </span>
              <span>
                <Heart />
                Save the places you love
              </span>
            </div>
            <section className="container section destination-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">A DIFFERENT SIDE OF THE ISLAND</span>
                  <h2>Where would you rather be?</h2>
                  <p>Find a destination that matches your kind of getaway.</p>
                </div>
                <a href="#/explore" className="text-link">
                  Explore Sri Lanka <ArrowRight size={17} />
                </a>
              </div>
              <div className="destination-grid">
                {destinations.map((d, i) => (
                  <a
                    href="#/explore"
                    className={`destination-card destination-${i}`}
                    key={d}
                    onClick={() => discover(d)}
                  >
                    <img
                      src={properties[i].image}
                      alt={`Accommodation and scenery in ${d}, Sri Lanka`}
                      loading="lazy"
                    />
                    <div className="destination-shade" />
                    <div>
                      <h3>
                        {d} <span>🇱🇰</span>
                      </h3>
                      <p>
                        {
                          [
                            'Heritage, sunshine & the sea',
                            'Mountain air & green escapes',
                            'Barefoot days on the coast',
                            'Culture in the heart of the hills',
                            'Your next city chapter',
                            'Tea country & cosy mornings',
                          ][i]
                        }
                      </p>
                    </div>
                    <span className="destination-arrow">
                      <ArrowUpRight size={22} />
                    </span>
                  </a>
                ))}
              </div>
            </section>
            <section className="container section featured-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MAKE YOURSELF AT HOME</span>
                  <h2>Stays worth planning a trip around</h2>
                  <p>Six handpicked concepts. One unforgettable island.</p>
                </div>
                <a href="#/explore" className="text-link">
                  View all stays <ArrowRight size={17} />
                </a>
              </div>
              <div className="property-grid">
                {properties.map((p) => (
                  <PropertyCard
                    property={p}
                    key={p.id}
                    saved={saved.includes(p.id)}
                    onSave={() => onSave(p.id)}
                  />
                ))}
              </div>
            </section>
            <section className="container benefits-section">
              <div>
                <div className="benefit-icon">
                  <Compass />
                </div>
                <h3>Your island, your way</h3>
                <p>
                  From Galle’s coastal charm to Ella’s green hills, discover a stay that fits your
                  plans.
                </p>
              </div>
              <div>
                <div className="benefit-icon">
                  <Heart />
                </div>
                <h3>Keep a little wish list</h3>
                <p>
                  Save your favourites as you explore. They’ll be here when inspiration strikes
                  again.
                </p>
              </div>
              <div>
                <div className="benefit-icon">
                  <ShieldCheck />
                </div>
                <h3>Simple from the start</h3>
                <p>
                  Clear prices, useful details and an easy demo request. No account or payment
                  needed.
                </p>
              </div>
            </section>
            <section className="container island-banner">
              <div>
                <span className="eyebrow">MORE THAN A PLACE TO SLEEP</span>
                <h2>
                  A small island.
                  <br />A world of experiences.
                </h2>
                <p>
                  Slow down, take the scenic route, and stay a little closer to the Sri Lanka you
                  came to discover.
                </p>
                <a className="button" href="#/about">
                  Get to know Lanka Stayz <ArrowRight size={17} />
                </a>
              </div>
              <img
                src={properties[1].image}
                alt="Sri Lankan hill country accommodation and scenery"
                loading="lazy"
              />
            </section>
          </>
        )}
        {explore && (
          <>
            <section className="search-band">
              <div className="container">
                <div className="breadcrumb">
                  <a href="#/">Home</a> / <span>Stays in Sri Lanka</span>
                </div>
                <SearchForm {...searchProps} />
                <p className="availability-disclaimer">
                  <ShieldCheck size={14} /> A thoughtfully built demo. Dates help plan your request;
                  live availability is not checked.
                </p>
              </div>
            </section>
            <div className="container explore-layout">
              <div className={showFilters ? 'filter-column filters-visible' : 'filter-column'}>
                <button className="filter-done-button" onClick={() => setShowFilters(false)}>
                  Done <X size={16} />
                </button>
                <Filters
                  {...{
                    types,
                    setTypes,
                    maxPrice,
                    setMaxPrice,
                    amenities,
                    setAmenities,
                    savedOnly,
                    setSavedOnly,
                    reset,
                  }}
                />
              </div>
              <section className="results-section" aria-label="Accommodation results">
                <div className="results-heading">
                  <div>
                    <h1>
                      {savedOnly ? 'Your saved stays' : destination || 'Sri Lanka'}
                      <span>
                        : {filtered.length} {filtered.length === 1 ? 'stay' : 'stays'} found
                      </span>
                    </h1>
                    <p>Find a little space for your next big memory.</p>
                  </div>
                  <button
                    className="filter-mobile-button"
                    onClick={() => setShowFilters(!showFilters)}
                    aria-expanded={showFilters}
                  >
                    <SlidersHorizontal size={16} /> Filters
                  </button>
                </div>
                <div className="results-toolbar">
                  <label>
                    Sort by:{' '}
                    <select
                      aria-label="Sort properties"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="recommended">Our top picks</option>
                      <option value="price-low">Price: lowest first</option>
                      <option value="price-high">Price: highest first</option>
                      <option value="rating">Guest rating</option>
                    </select>
                  </label>
                  <span>
                    {stay.guests} {stay.guests === '1' ? 'guest' : 'guests'} · LKR
                  </span>
                </div>
                <div className="active-filters">
                  {destination && (
                    <button onClick={() => setDestination('')}>
                      {destination}
                      <X size={12} />
                    </button>
                  )}
                  {types.map((t) => (
                    <button key={t} onClick={() => setTypes(toggle(types, t))}>
                      {t}
                      <X size={12} />
                    </button>
                  ))}
                  {savedOnly && (
                    <button onClick={() => setSavedOnly(false)}>
                      Saved stays
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div id="results" className="result-status" role="status" aria-live="polite">
                  {filtered.length} matching {filtered.length === 1 ? 'property' : 'properties'}
                </div>
                <div className="results-list">
                  {filtered.map((p) => (
                    <PropertyCard
                      property={p}
                      key={p.id}
                      saved={saved.includes(p.id)}
                      onSave={() => onSave(p.id)}
                      list
                    />
                  ))}
                </div>
                {!filtered.length && (
                  <div className="empty-state">
                    <Compass size={40} />
                    <h2>Let’s try a different direction</h2>
                    <p>
                      No sample stays match your choices. Adjust your budget, destination, guest
                      count or facilities.
                    </p>
                    <button
                      className="button"
                      onClick={() => {
                        reset();
                        setDestination('');
                        setStay(initialStay);
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
                <p className="results-fineprint">
                  All properties, ratings and prices are fictional assessment examples. Photos show
                  Sri Lankan accommodation or destination inspiration. No affiliation with
                  photographed properties is implied.
                </p>
              </section>
            </div>
          </>
        )}
        {property && (
          <PropertyDetails
            property={property}
            stay={stay}
            setStay={setStay}
            saved={saved.includes(property.id)}
            onSave={() => onSave(property.id)}
            onBook={() => setBooking(property)}
            onPhoto={(src, alt) => setLightbox({ src, alt })}
          />
        )}
        {route === '#/about' && (
          <section className="container information-page">
            <div className="eyebrow">AYUBOWAN. WE’RE LANKA STAYZ.</div>
            <h1>
              One island.
              <br />
              <em>A thousand ways to stay.</em>
            </h1>
            <div className="information-grid">
              <img src={heroImage} alt="Sri Lankan landscape and accommodation inspiration" />
              <div>
                <h2>Rooted in Sri Lanka.</h2>
                <p>
                  Coastal villas, hill-country hideaways and city apartments. Lanka Stayz is a
                  concept that helps curious travellers find their own way to experience Sri Lanka.
                </p>
                <p>
                  We bring the useful details together: clear prices, guest capacity, facilities and
                  a simple path from an idea to a booking request.
                </p>
                <p>
                  This is an individual technical assessment prototype. Properties, prices and
                  reviews are fictional examples, and photographs are inspiration rather than
                  verified listings.
                </p>
                <a className="button" href="#/explore">
                  Explore the collection <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </section>
        )}
        {route === '#/contact' && (
          <section className="container information-page">
            <span className="eyebrow">A WARM WELCOME STARTS HERE</span>
            <h1>
              Let’s talk <em>island plans.</em>
            </h1>
            <div className="contact-grid">
              <div>
                <h2>Say ayubowan.</h2>
                <p>
                  Have a question about this concept or a sample stay? Here’s where the conversation
                  starts.
                </p>
                <a className="contact-link" href="mailto:hello@lankastayz.example">
                  hello@lankastayz.example <ArrowUpRight size={19} />
                </a>
                <p className="muted">Demonstration address only. It does not receive messages.</p>
                <p>
                  <MapPin size={17} /> Colombo, Sri Lanka
                </p>
              </div>
              <div className="contact-faq">
                <h2>Good to know</h2>
                {[
                  [
                    'Can I make a real reservation?',
                    'This prototype validates your sample request and displays a confirmation. Nothing is sent or reserved.',
                  ],
                  [
                    'Are the properties real?',
                    'Names, pricing and reviews are fictional. The imagery provides Sri Lankan destination and accommodation inspiration.',
                  ],
                  [
                    'Do I need an account or payment?',
                    'No. Explore every page and try the booking form without signing in or providing payment details.',
                  ],
                ].map(([q, a]) => (
                  <details key={q}>
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
        {!home && !explore && !property && !['#/about', '#/contact'].includes(route) && (
          <section className="container empty-state">
            <Compass size={45} />
            <h1>A little off the map.</h1>
            <p>That page couldn’t be found. Your next escape is still waiting.</p>
            <a className="button" href="#/explore">
              Explore stays <ArrowRight size={17} />
            </a>
          </section>
        )}
      </main>
      <footer>
        <div className="container footer-main">
          <div>
            <Brand />
            <p>
              Your island, your stay.
              <br />
              Find a little somewhere in Sri Lanka.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight size={12} />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                Facebook <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
          <div>
            <h3>Discover</h3>
            <a href="#/explore">Explore stays</a>
            <a href="#/about">About Lanka Stayz</a>
            <a href="#/contact">Contact us</a>
            <a href="/images/srilanka/credits.html" target="_blank" rel="noreferrer">
              Photo credits
            </a>
          </div>
          <div>
            <h3>Explore the island</h3>
            {destinations.slice(0, 4).map((d) => (
              <a href="#/explore" key={d} onClick={() => discover(d)}>
                {d}
              </a>
            ))}
          </div>
          <div>
            <h3>We’re here for you</h3>
            <a href="mailto:hello@lankastayz.example">hello@lankastayz.example</a>
            <p>Colombo, Sri Lanka</p>
            <small>Sample contact · Not monitored</small>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Lanka Stayz. An island of possibilities.</span>
          <span>Assessment demo · No real reservations · Prices in LKR</span>
        </div>
      </footer>
      {booking && (
        <BookingModal
          property={booking}
          stay={stay}
          onStay={setStay}
          onClose={() => setBooking(null)}
        />
      )}
      {lightbox && (
        <Dialog onClose={() => setLightbox(null)} className="lightbox">
          <img src={lightbox.src} alt={lightbox.alt} />
          <p>{lightbox.alt}</p>
        </Dialog>
      )}
    </>
  );
}

function PropertyDetails({
  property: p,
  stay,
  setStay,
  saved,
  onSave,
  onBook,
  onPhoto,
}: {
  property: Property;
  stay: Stay;
  setStay: (s: Stay) => void;
  saved: boolean;
  onSave: () => void;
  onBook: () => void;
  onPhoto: (src: string, alt: string) => void;
}) {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  return (
    <section className="container detail-page">
      <a className="back-link" href="#/explore">
        <ChevronLeft size={16} />
        Back to search results
      </a>
      <div className="detail-title">
        <div>
          <span className="eyebrow">
            {p.type} · {p.region}
          </span>
          <h1>{p.name}</h1>
          <p>
            <MapPin size={16} />
            {p.location}, Sri Lanka <span>·</span>
            <span className="review-score">
              {(Number(p.rating) * 2).toFixed(1)}
            </span>Exceptional <small>({p.reviews} sample reviews)</small>
          </p>
        </div>
        <button className="outline-button" onClick={onSave}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save stay'}
        </button>
      </div>
      <div className="gallery">
        {[p.image, ...p.gallery].map((src, i) => (
          <button
            key={`${src}-${i}`}
            aria-label={`Enlarge property photo ${i + 1}`}
            onClick={() => onPhoto(src, `${p.name}: Sri Lankan inspiration photo ${i + 1}`)}
          >
            <img
              src={src}
              alt={`${p.location}, Sri Lanka: accommodation and destination inspiration ${i + 1}`}
            />
            {i === 2 && (
              <span>
                View photo <ArrowUpRight size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="detail-layout">
        <div>
          <div className="detail-summary">
            <h2>A little place to call your own.</h2>
            <div>
              <span>
                <Users size={18} />
                {p.guests} guests
              </span>
              <span>
                <BedDouble size={18} />
                {p.beds} {p.beds === 1 ? 'bedroom' : 'bedrooms'}
              </span>
              <span>
                <Bath size={18} />
                {p.baths} {p.baths === 1 ? 'bathroom' : 'bathrooms'}
              </span>
            </div>
          </div>
          <section className="detail-block">
            <h3>About this stay</h3>
            <p>{p.description}</p>
            <p className="muted">
              Fictional assessment property. Photos show Sri Lankan accommodation or destination
              inspiration; they are not a verified gallery of this sample listing.
            </p>
          </section>
          <section className="detail-block">
            <h3>Most popular facilities</h3>
            <div className="amenities">
              {p.amenities.map((a) => (
                <span key={a}>
                  <Check size={19} />
                  {a}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-block">
            <h3>House rules</h3>
            <p>Check-in from 2:00 PM · Check-out by 11:00 AM</p>
            <p>Maximum {p.guests} guests · No parties or events</p>
            <p className="muted">
              Sample policies. A live service would confirm availability and cancellation terms with
              the host.
            </p>
          </section>
        </div>
        <aside className="booking-card">
          <span className="eyebrow">YOUR NEXT STAY STARTS HERE</span>
          <p className="booking-price">
            <strong>LKR {money(p.price)}</strong>
            <span> / night</span>
          </p>
          <div className="booking-fields">
            <label>
              Check-in
              <input
                type="date"
                aria-label="Property check-in"
                value={stay.checkIn}
                min={todayISO()}
                onInput={(e) => setStay({ ...stay, checkIn: e.currentTarget.value })}
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                aria-label="Property check-out"
                value={stay.checkOut}
                min={stay.checkIn || todayISO()}
                onInput={(e) => setStay({ ...stay, checkOut: e.currentTarget.value })}
              />
            </label>
          </div>
          <label className="booking-guests">
            Guests
            <select
              aria-label="Property guests"
              value={stay.guests}
              onChange={(e) => setStay({ ...stay, guests: e.target.value })}
            >
              {Array.from({ length: p.guests }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i ? 'guests' : 'guest'}
                </option>
              ))}
              {Number(stay.guests) > p.guests && (
                <option value={stay.guests} disabled>
                  Choose up to {p.guests} guests
                </option>
              )}
            </select>
          </label>
          {nights > 0 && (
            <div className="price-total">
              <span>
                {nights} nights × LKR {money(p.price)}
              </span>
              <strong>LKR {money(nights * p.price)}</strong>
            </div>
          )}
          <button className="button full" onClick={onBook}>
            Request booking <ArrowRight size={18} />
          </button>
          <p className="booking-note">
            <ShieldCheck size={15} /> No payment required
          </p>
          <div className="booking-disclaimer">
            Demo request only. Live availability is not checked and no reservation will be made.
          </div>
        </aside>
      </div>
    </section>
  );
}
