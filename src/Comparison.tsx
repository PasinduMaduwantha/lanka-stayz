import { ArrowRight, Columns3, X } from 'lucide-react';
import { money, type Property } from './data';
export function Comparison({
  selected,
  remove,
}: {
  selected: Property[];
  remove: (id: string) => void;
}) {
  return (
    <section className="container comparison-page">
      <div className="editorial-heading">
        <span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span>
        <h1>
          Which one feels <em>like you?</em>
        </h1>
        <p>Compare up to three stays without losing your search.</p>
      </div>
      {selected.length ? (
        <>
          <div
            className="comparison-grid"
            style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}
          >
            {selected.map((p) => (
              <article className="comparison-card" key={p.id} aria-label={`Compare ${p.name}`}>
                <div className="comparison-photo">
                  <img src={p.image} alt={`${p.location}, Sri Lanka accommodation inspiration`} />
                  <button
                    className="heart-button"
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name} from comparison`}
                  >
                    <X size={17} />
                  </button>
                </div>
                <div className="comparison-copy">
                  <span className="eyebrow">{p.location}</span>
                  <h2>{p.name}</h2>
                  <dl>
                    <div>
                      <dt>Per night</dt>
                      <dd>LKR {money(p.price)}</dd>
                    </div>
                    <div>
                      <dt>Your people</dt>
                      <dd>Up to {p.guests} guests</dd>
                    </div>
                    <div>
                      <dt>Your space</dt>
                      <dd>
                        {p.beds} {p.beds === 1 ? 'bedroom' : 'bedrooms'} · {p.baths}{' '}
                        {p.baths === 1 ? 'bathroom' : 'bathrooms'}
                      </dd>
                    </div>
                    <div>
                      <dt>The little comforts</dt>
                      <dd>{p.amenities.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt>Sample guest score</dt>
                      <dd>
                        {p.rating} / 5 · {p.reviews} illustrative reviews
                      </dd>
                    </div>
                  </dl>
                  <a className="button full" href={`#/stays/${p.id}`}>
                    This feels like me <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a href="#/explore" className="text-link comparison-back">
            Back to your search <ArrowRight size={17} />
          </a>
        </>
      ) : (
        <div className="empty-state">
          <Columns3 size={40} />
          <h2>A little space to decide.</h2>
          <p>Select Compare on a property card to bring up to three stays together here.</p>
          <a className="button" href="#/explore">
            Find a stay <ArrowRight size={16} />
          </a>
        </div>
      )}
    </section>
  );
}
