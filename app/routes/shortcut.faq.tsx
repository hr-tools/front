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
                    Open Safari on your iOS device (<TextLink to='?o=why-safari#why-safari' newtab='true'>other browsers won't work!</TextLink>)
                  </li>
                  <li>
                    Install the shortcut by <TextLink to='/shortcut'>going to this page</TextLink> and clicking "Get Shortcut".
                    Install the Shortcuts app from the App Store if necessary.
                  </li>
                  <li>
                    Navigate to any horse page (like <span className='font-bold'>https://www.horsereality.com/horses/1/</span>)
                    and click the share button (it looks like a box with an arrow coming out through the top)
                  </li>
                  <li>
                    Scroll down until you see "Realtools" with a horse icon.
                    <ul className='list-disc ml-4 space-y-1'>
                      <li>
                        If it's not there, go all the way to the bottom and
                        click "Edit Actions...", then enable it in that menu.
                      </li>
                      <li>
                        <span className='font-bold'>If it's not in that menu or you still can't see it</span>, try{' '}
                        <TextLink to='https://support.apple.com/en-us/HT201559' newtab='true'>restarting your phone</TextLink>.
                      </li>
                      <li>
                        Once enabled, click on Realtools.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <TextLink to='?o=scripting#scripting' newtab='true'>Click here if you're seeing an error about running JavaScript.</TextLink>
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
              id: 'scripting',
              title: 'I\'m seeing "Could not run Run JavaScript on Web Page"',
              content: <div>
                <p>
                  Realtools needs JavaScript in order to read info from pages
                  and merge or predict your horses.
                  Follow the steps below to fix this error:
                </p>
                <ol className='ml-4 list-decimal space-y-2'>
                  <li>Open the "Settings" app on your iPhone or iPad</li>
                  <li>Search for "Shortcuts" at the top and scroll down until you see "Shortcuts" with the dark icon</li>
                  <li>Go into the tab that says "Advanced" and enable "Allow Running Scripts"</li>
                  <li>Go back to Safari and try again</li>
                </ol>
                <img
                  className='mt-4 mx-auto rounded'
                  src='/static/faq/shortcut-scripting.jpg'
                />
              </div>,
            },
            {
              id: 'device-support',
              title: 'Does the Realtools shortcut support my device?',
              content: <div>
                <p>
                  If your device supports the latest version of Shortcuts, you should be fine.
                  You can also simply <TextLink to='?o=how-to-use#how-to-use' newtab='true'>try it for yourself</TextLink>, it's free!
                </p>
                {/*
                <p className='mt-2'>
                  Our shortcut has been confirmed to work on the following devices:
                </p>
                <ul className='list-disc ml-4'>
                  <li>iPhone SE (1st Generation), iOS 15.6.1</li>
                  <li>iPhone 11, iOS 15.1, iOS 15.6.1</li>
                </ul>
                <p>
                  Feel free to let us know if your device works with our shortcut,
                  especially if it is particularly old, and we'll add it to the above list.
                </p>
                <p className='mt-2'>
                  Our shortcut <span className='font-bold'>does not work</span> on the following
                  devices as they are too old to support the latest Shortcuts versions:
                </p>
                <ul className='list-disc ml-4'>
                  <li>iPhone 5S, iOS 12</li>
                </ul>
                */}
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
                Realtools is only able to read pages if you are using Safari.
                On other browsers, Realtools can look at the URL, but not the page itself.
              </p>,
            },
          ]}
        />

      </div>
    </div>
  )
}
  