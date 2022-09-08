import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://www.icloud.com/shortcuts/0d007c6b254d4adfb60c8605152cd58d')
}
