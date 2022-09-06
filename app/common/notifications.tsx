import React from 'react'

export function ModalContainer(props) {
  return (
    <div
      id='modal-container'
      className={
        'fixed bg-gray-900/75 w-screen h-screen left-0 top-0 p-3 flex motion-safe:transition-transform motion-safe:duration-700 motion-reduce:transition-none z-10'
        + (props.hidden ? ' -translate-y-full bg-transparent' : '')
      }
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const t = event.currentTarget
          // This background was clicked, not the modal
          t.classList.add('-translate-y-full')
          t.classList.add('bg-transparent')
        }
      }}
    >
      {props.children}
    </div>
  )
}

export function Modal(props) {
  return (
    <div className='m-auto w-full max-w-lg rounded bg-slate-300 dark:bg-slate-800 p-5'>
      <div className='flex mb-2'>
        <h1 className='text-3xl font-extrabold'>{props.title}</h1>
        <button
          className='ml-auto text-3xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
          title='Close Modal'
          onClick={(event) => {
            // @ts-ignore
            event.currentTarget.parentNode.parentNode.parentNode.click()
          }}
        >
          <i className='ci-close_big'/>
        </button>
      </div>
      {props.children}
    </div>
  )
}

export const modalStyle = {
  overlay: {
    zIndex: 11,
    backgroundColor: 'rgb(17 24 39 / 0.75)',
  },
  content: {
    zIndex: 11,
    padding: 0,
    background: 'none',  // Individual modals use tw classes for theming
    border: 'none',
    borderRadius: '0.25rem',
    maxWidth: '32rem',
    height: 'fit-content',
    margin: 'auto',
  }
}

export const innerModalClassName = 'bg-gray-200 dark:bg-slate-800 p-5'

export function Banner(props) {
  return (
    <div
      id='banner'
      className={`rounded-bl rounded-br ${props.error ? 'bg-red-300 dark:bg-red-500' : 'bg-gray-200 dark:bg-slate-700'} py-3 px-4 -mt-4 mb-3 flex`}
    >
      <div className='text-sm my-auto'>
        {props.children}
      </div>
      <button onClick={props.onClose} className='ml-auto pl-2 my-auto opacity-60 hover:opacity-90 transition-opacity'>
        <i className='text-lg ci-close_big' />
      </button>
    </div>
  )
}
