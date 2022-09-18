import React from 'react'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'

// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import { Entries } from '~/common/entries'
// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import TitleBar from '~/common/title'

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  return { opened: url.searchParams.get('o') }
}

export const meta: MetaFunction = () => {
  return { title: 'Realmerge FAQ' }
}

export default function FAQ() {
  const loaderData = useLoaderData()

  return (
    <div>
      <div className='w-full'>
        <TitleBar backTo='/merge' backText='Back to Merge' />
        <h1 className='text-5xl font-extrabold'>{_('ui_faq_realmerge')}</h1>
        <Entries
          opened={loaderData.opened}
          entries={[
            {
              id: 'how-to-use',
              title: 'How do I use Realmerge?',
              content: <div>
                <p>
                  First and foremost, Realmerge is available <TextLink to='/merge'>on this website</TextLink>,
                  in our <TextLink to='/extension'>desktop/Android browser extension</TextLink>,
                  and in our <TextLink to='/shortcut/faq'>iOS shortcut</TextLink>.
                </p>
                <p className='font-bold mt-2'>This site</p>
                <p>
                  To use the website version of Realmerge, simply put any horse page URL (like <span className='font-bold'>https://www.horsereality.com/horses/1/</span>)
                  in the box that says "{_('ui_horse_url')}" and click the "Merge" button.
                </p>
                <p className='font-bold mt-2'>Browser extension</p>
                <p>
                  After you have installed the extension, navigate to any <TextLink to='https://www.horsereality.com/horses/1/' newtab='true'>horse
                  page</TextLink> and click "Merge" at the bottom of the white info box.
                </p>
                <img
                  className='mt-4 mx-auto rounded'
                  src='/static/faq/realmerge-click-merge.png'
                />
              </div>,
            },
            {
              id: 'what-does-this-tool-do',
              title: 'What does this tool do?',
              content: <p>
                Realmerge layers the images that make up your horse to avoid
                having to do this manually in an art program.
                If you just want the image of a horse with no adjustments,
                Realmerge Multi is not necessary.
                Optionally, Realmerge can remove any white layers from your
                horse when merging to help with creating art, color guides,
                etc.
              </p>,
            },
            {
              id: 'multi-mode',
              title: 'Realmerge Multi',
              content: <p>
                Multi Mode allows you to add individual layer URLs to build a horse and even merge it.
                Use the <i className='ci-trash_full' /> to clear the layers you're using from that box,
                and the <i className='ci-close_big' /> to remove the box and all of its layers from the preview.
              </p>,
            },
          ]}
        />

      </div>
    </div>
  )
}
  