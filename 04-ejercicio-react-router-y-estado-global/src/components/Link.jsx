import { Link as RRLink } from 'react-router'

export function Link( { href, children, ...props } ) {

  return (
    <RRLink to={href} {...props}>
      {children}
    </RRLink>
  )
}
