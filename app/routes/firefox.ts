import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://addons.mozilla.org/en-US/firefox/addon/realtools')
}
