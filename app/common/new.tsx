import React from 'react'

export default function New(props: { exclamation?: string }) {
  return (
    <div className='text-xs my-auto rounded-lg px-2 py-1 bg-red-500 text-white inline'>
      NEW{props.exclamation ?? '!'}
    </div>
  )
}
