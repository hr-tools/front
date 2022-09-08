import React from 'react'

// @ts-ignore
import TitleBar from '~/common/title'
// @ts-ignore
import { TextLink } from '~/common/links'

export default function Index() {
  return (
    <div>
      <div className='w-full'>
        <TitleBar />
        <h1 className='text-4xl font-bold'>We don't support your browser</h1>
        <p>... unless it's one of these:</p>
        <ul>
          <li>{String.fromCodePoint(0x2022)} <TextLink to='/chrome'>Chromium (Chrome, Opera, Brave, Edge, ...)</TextLink></li>
          <li>{String.fromCodePoint(0x2022)} <TextLink to='/firefox'>Firefox</TextLink></li>
        </ul>
        <p className='mt-4'>
          Our extension does not support mobile devices or Safari.
          If you're on an iOS device, check out our {(
            <TextLink to='/shortcut'>shortcut</TextLink>
          )} (<TextLink to='/shortcut/faq'>FAQ</TextLink>)!
        </p>
      </div>
    </div>
  )
}
