import { renderToString } from 'react-dom/server'
import { RemixServer } from 'remix'
import 'dotenv/config'
import { readFileSync } from 'fs'

const readAsJson = (path) => {return JSON.parse(readFileSync(path, { flag: 'r', encoding: 'utf8' }))}

process.env.LANGS = JSON.stringify({
  en: {
    ...readAsJson('app/locales/en/site.json'),
    ...readAsJson('app/locales/en/realvision.json'),
    ...readAsJson('app/locales/en/multi.json'),
  },
  //nl: {
  //  ...readAsJson('app/locales/nl/site.json'),
  //  ...readAsJson('app/locales/nl/realvision.json'),
  //},
  de: {
    ...readAsJson('app/locales/de/site.json'),
    ...readAsJson('app/locales/de/realvision.json'),
    ...readAsJson('app/locales/de/multi.json'),
  },
})

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}
