import { statusVariant } from '../../utils/helpers'

const Badge = ({ status, variant, children, className = '', ...rest }) => (
  <span className={`badge badge-${variant || statusVariant(status)} ${className}`.trim()} {...rest}>
    {children ?? status}
  </span>
)

export default Badge
