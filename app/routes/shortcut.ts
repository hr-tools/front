import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://www.icloud.com/shortcuts/3a7d93c13ef444eca387fd1fda7a79e5')
}
