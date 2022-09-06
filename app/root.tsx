import React from 'react'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  Link,
  useLoaderData,
} from '@remix-run/react'

// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import styles from '~/styles/coolicons.css'

export const links = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: '/tailwindcss' },
  ]
}

export function meta() {
  return {
    title: 'Realtools',
    description: 'A collection of Horse Reality webtools',
    'theme-color': '#38bdf8',
    'og:image': 'https://realtools.shay.cat/static/logo_128.png',
  }
}

export async function loader() {
  return json({
    env: {
      API_BASE: process.env.NODE_ENV === 'development' ? process.env.DEV_API_BASE ?? process.env.API_BASE : process.env.API_BASE,
      NODE_ENV: process.env.NODE_ENV,
      LANGS: JSON.parse(process.env.LANGS ?? ''),
    }
  })
}

export default function App() {
  const data = useLoaderData()
  const env = data?.env ?? {}

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-slate-50 text-slate-700 max-w-xl mx-auto p-3 dark:bg-slate-900 dark:text-slate-50'>
        <Outlet />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.env = ${JSON.stringify(env)}
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            }
          `
        }} />
        <ScrollRestoration />
        <Scripts />
        {env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-slate-50 text-slate-700 max-w-xl mx-auto p-3 dark:bg-slate-900 dark:text-slate-50'>
        <h1 className='text-2xl font-bold italic'>
          Uh oh, you found a {caught.status}.
          Try again later or just <TextLink to='/'>head back home</TextLink>.
        </h1>
        <img
          src={`https://http.cat/${caught.status}.jpg`}
          className='w-full rounded-lg mt-4'
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            }
          `.trim()
        }} />
        <Scripts />
      </body>
    </html>
  );
}
