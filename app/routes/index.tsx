import React from 'react'
import { Link } from '@remix-run/react'

// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import { CreditsItems } from '~/common/title'

function ToolBtn(props: { link: string, name: string }) {
  return (
    <Link to={props.link} className='bg-slate-300 dark:text-slate-800 rounded px-3 py-1 font-bold mt-2 mr-2'>
      {props.name}
    </Link>
  )
}

export default function Index() {
  return (
    <div>
      <div className='flex'>
        <div className='w-full'>
          <h1 className='text-5xl font-black'>Realtools</h1>
          <p className='text-lg'>
            This is the hub page for Realtools - a collection of Horse Reality webtools.
            Click on a tool's name below to see it in action.
          </p>
        </div>
        <div className='max-w-xs pl-4 hidden sm:block'>
          <img src='/static/logo_128.png' />
        </div>
      </div>
      <div className='flex flex-wrap mt-6'>
        {ToolBtn({ name: 'Realmerge', link: '/merge' })}
        {ToolBtn({ name: 'Realmerge Multi', link: '/merge/multi' })}
        {ToolBtn({ name: 'Realvision', link: '/vision' })}
        {ToolBtn({ name: 'Extension', link: '/extension' })}
        {ToolBtn({ name: 'iOS Shortcut', link: '/shortcut' })}
      </div>
      <h1 className='text-4xl font-bold mt-8'>Contact us</h1>
      <p className='text-base'>
        Feel free to <TextLink to='https://www.horsereality.com/forum/topic_41112/'>use our forum thread</TextLink> or
        {' '}<TextLink to='https://discord.com/invite/TFgqyWF9bn'>join our Discord server</TextLink> if you need to contact us.
        If you have an issue with predicting foals on Realvision, be sure to check out #unpredictables first.
      </p>
      <h1 className='text-4xl font-bold mt-8'>{_('credits_title')}</h1>
      <ul className='text-base'><CreditsItems /></ul>
    </div>
  )
}
