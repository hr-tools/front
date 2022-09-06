import React from 'react'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'

// @ts-ignore
import TitleBar from '~/common/title'
// @ts-ignore
import { Entries } from '~/common/entries'
// @ts-ignore
import { TextLink } from '~/common/links'

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  return { opened: url.searchParams.get('o') }
}

export const meta: MetaFunction = () => {
  return { title: 'Shortcut FAQ' }
}

export default function FAQ() {
  const loaderData = useLoaderData()

  return (
    <div>
      <div className='w-full'>
        <TitleBar />
        <h1 className='text-5xl font-extrabold'>Shortcut FAQ</h1>
        <Entries
          opened={loaderData.opened}
          entries={[
            {
              id: 'how-to-use',
              title: 'How do I use the Realtools shortcut?',
              content: <div>
                <ol className='ml-4 list-decimal space-y-2'>
                  <li>
                    Open Safari on your iOS device (<TextLink to='?o=why-safari' newtab='true'>other browsers won't work!</TextLink>)
                  </li>
                  <li>
                    Install the shortcut by <TextLink to='/shortcut'>going to this page</TextLink> and clicking "Get Shortcut".
                    Install the Shortcuts app if necessary
                    (but you should have it pre-installed on your iPhone)
                  </li>
                  <li>
                    Navigate to any horse page (like <span className='font-bold'>https://www.horsereality.com/horses/1/</span>)
                    and click the share button (it looks like a box with an arrow coming out through the top)
                  </li>
                  <li>
                    Scroll down until you see "Realtools" with a horse icon.
                    If it's not there, go all the way to the bottom and click "Edit Actions...",
                    then enable it in that menu.
                    Once enabled, click on Realtools.
                  </li>
                  <li>
                    Realtools will ask to access www.horsereality.com and realtools.shay.cat.
                    Click "Allow" when you see either of these prompts.
                  </li>
                </ol>
                <img
                  className='mt-4 mx-auto rounded'
                  src='/static/faq/shortcut-use.png'
                />
              </div>,
            },
            {
              id: 'debug',
              title: 'It doesn\'t work!',
              content: <p>
                If the shortcut doesn't do anything when you tap it,
                exit out of the share menu and go back in, then try again.
                If it's still not working, please report this to us <TextLink to='https://discord.com/invite/TFgqyWF9bn'>in our Discord server</TextLink>.
              </p>,
            },
            {
              id: 'why-safari',
              title: 'Why do I have to use Safari?',
              content: <p>
                Unfortunately due to the way shortcuts work,
                Realtools is only able to look at the current page if you are using Safari.
                On other browsers, Realtools can look at the URL, but not the page itself.
              </p>,
            },
          ]}
        />

      </div>
    </div>
  )
}
  