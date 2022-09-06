import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('/merge/faq?o=how-to-use#how-to-use')
}
