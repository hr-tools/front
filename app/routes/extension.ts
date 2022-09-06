import { redirect } from '@remix-run/server-runtime'

export function loader({request}) {
  const ua = request.headers.get('User-Agent')

  if (ua.indexOf('Chrome') > -1) return redirect('/chrome')  // Chromium-based
  else if (ua.indexOf('Firefox') > -1) {
    if (ua.indexOf('Android') > -1) return redirect('/extension/unsupported')
    else return redirect('/firefox')
  }
  else if (ua.indexOf('Safari') > -1) {
    if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('iPod') > -1) {
      // This will probably cause some confusion in the future
      return redirect('/shortcut')
    }
    // Either Macintosh or Windows
    return redirect('/extension/unsupported')
  }
  else return redirect('/extension/unrecognized')
}
