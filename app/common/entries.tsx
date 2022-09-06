import React from 'react'
import { useState } from 'react'
// @ts-ignore
import { copyText } from '~/common/share'

// Collapsable entries. This was written for FAQ pages but
// designed to be generic.

export function Entries(props) {
  const children: JSX.Element[] = []

  const [open, setOpen] = useState(props.opened)

  for (const childProps of props.entries) {
    children.push(
      <Entry
        openState={open}
        setOpenState={setOpen}
        {...childProps}
      />
    )
  }

  return children
}

export function Entry(props) {
  const id = props.id
  const [open, setOpen] = [props.openState, props.setOpenState]
  const isOpen = open === id
  const title = props.title
  const content = props.content

  return (
    <div className={`${isOpen ? 'p-5' : 'p-3'} rounded bg-gray-200 dark:bg-slate-800 mt-5`} id={id} key={`faq-${id}`}>
      <div className='flex'>
        <div
          className='cursor-pointer mr-2'
          onClick={() => {setOpen(isOpen ? null : id)}}
        >
          <h2 className={`${isOpen ? 'text-2xl mb-3' : 'text-1xl'} font-bold`}>
            {title}
          </h2>
        </div>
        <div className={`ml-auto space-x-2 font-bold flex ${isOpen ? 'text-2xl mb-auto' : 'text-xl my-auto'}`}>
          <button onClick={() => {setOpen(isOpen ? null : id)}}>
            <i className={isOpen ? 'ci-chevron_big_up' : 'ci-chevron_big_down'} />
          </button>
          <button
            onClick={() => {
              const icon = document.querySelector(`#copy-${id}`)
              copyText(`${window.location.origin}${window.location.pathname}?o=${id}#${id}`)
              icon?.classList.add('ci-check')
              icon?.classList.remove('ci-copy')
              setTimeout(() => {
                icon?.classList.add('ci-copy')
                icon?.classList.remove('ci-check')
              }, 3000)
            }}
          >
            <i id={`copy-${id}`} className='ci-copy' />
          </button>
        </div>
      </div>
      <div className={isOpen ? 'block' : 'hidden'} id={`${id}-content`}>{content}</div>
    </div>
  )
}
