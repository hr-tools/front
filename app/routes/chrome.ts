import { redirect } from '@remix-run/server-runtime'

export function loader() {
    return redirect('https://chrome.google.com/webstore/detail/realtools/chfbbeojlpffpcffalmhagcjfoiccjcf')
}
