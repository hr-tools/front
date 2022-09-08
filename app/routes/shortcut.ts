import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://www.icloud.com/shortcuts/1ebdf49191a644acbcf3786e3ae68310')
}
