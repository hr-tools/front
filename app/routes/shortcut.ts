import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://www.icloud.com/shortcuts/b0ec5433119c402b80551b5557d6a888')
}
