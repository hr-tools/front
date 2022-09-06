import React from 'react'
import { Link } from '@remix-run/react'

export const TextLink = (props: { to: string, newtab: string, children: any, className?: string }) => {
  const external = props.to.startsWith('http')
  const newTab = props.newtab === 'true'

  const className = `text-sky-500 decoration-sky-500 dark:text-sky-400 dark:decoration-sky-400 hover:underline underline-offset-2 ${props.className}`
  return (external || newTab ? (
    <a
      {...props}
      target={newTab ? '_blank' : '_self'}
      href={props.to}
      className={className}
    >
      {props.children}
    </a>
  ) : (
    <Link
      {...props}
      className={className}
    >
      {props.children}
    </Link>
  ))
}
