export function generateSimpleUrl({ extra, root }) {
  try {
    root = document.location.origin + document.location.pathname
  } catch {}

  const url = new URL(root)
  if (extra) {
    Object.keys(extra).forEach(key => {url.searchParams.append(key, extra[key])})
  }
  return url.toString()
}

export function copyText(text: string) {
  const input = document.createElement('textarea')

  input.value = text

  input.style.position = 'fixed'
  input.style.opacity = '0'

  const root = document.body
  root.append(input)

  input.focus()
  input.select()

  document.execCommand('copy')

  input.remove()
}
