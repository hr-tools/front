import type { LoaderFunction } from '@remix-run/server-runtime'
import { serveTailwindCss } from 'remix-tailwind'

export const loader: LoaderFunction = () => serveTailwindCss('app/tailwind.css')
