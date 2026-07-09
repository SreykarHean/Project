import Badge from './Badge'
import { formatPrice } from '../../utils/helpers'

const ListingCard = ({ photo, title, city, meta, price, status, children }) => (
  <div className="card card-flush card-hover">
    <div className="listing-photo">
      {photo ? <img src={photo} alt={title} /> : <span>No photo</span>}
    </div>
    <div className="card-body">
      {status && <Badge status={status} />}
      <h3 className="listing-title">{title}</h3>
      {city && <p className="listing-city">{city}</p>}
      {meta && <p className="listing-meta">{meta}</p>}
      <p className="listing-price">{formatPrice(price)}</p>
      {children && <div className="listing-actions">{children}</div>}
    </div>
  </div>
)

export default ListingCard
