import { initialsOf } from '../../utils/helpers'

const Avatar = ({ name, src, className = '' }) => (
  <div className={`avatar ${className}`.trim()}>
    {src ? <img src={src} alt={name || 'Avatar'} /> : initialsOf(name)}
  </div>
)

export default Avatar
