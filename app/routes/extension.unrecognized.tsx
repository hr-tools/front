import React from 'react'

// @ts-ignore
import TitleBar from '~/common/title'

export default function Index() {
  return (
    <div>
      <div className='w-full'>
        <TitleBar />
        <h1 className='text-4xl font-bold'>We don't know about your browser</h1>
        <p>This usually shouldn't happen unless you're a robot pretending to be a browser.</p>
      </div>
    </div>
  )
}
