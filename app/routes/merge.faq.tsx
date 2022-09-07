import React from 'react'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'

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
        <TitleBar backTo='/merge/multi' backText='Back to Multi' />
        <h1 className='text-5xl font-extrabold'>Realmerge FAQ</h1>
        <Entries
          opened={loaderData.opened}
          entries={[
            {
              id: 'how-to-use',
              title: 'How do I use Realmerge?',
              content: <div>
                <p>
                  Currently, Realmerge is only available in our {(
                    <TextLink to='/extension'>browser extension for desktop computers</TextLink>
                  )}.
                  After you have installed the extension, navigate to any horse
                  page and click "Merge" at the bottom of the white info box.
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
  