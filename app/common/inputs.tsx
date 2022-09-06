import { useTransition } from '@remix-run/react'
import React from 'react'

export function TextInput(props: any) {
  const className = `bg-gray-300 placeholder:text-slate-500 text-slate-700 dark:bg-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500 rounded w-full py-1.5 px-2 ${props.className ?? ''}`
  return (
    <input
      {...props}
      className={className}
    />
  )
}

export function TextInputLabel(props: any) {
  return (
    <p
      className='text-slate-500 dark:text-slate-300 cursor-default'
      {...props}
    />
  )
}

export function Button(props: any) {
  const transition = useTransition()

  let bg = 'bg-cyan-600 hover:bg-cyan-700'
  if (props.styletype == 'secondary') {
    bg = 'bg-slate-500 hover:bg-slate-600'
  }
  return (
    <button
      type='button'
      className={
        `${bg} transition-colors rounded px-3 py-1 font-bold text-slate-50 mx-auto mt-3 disabled:bg-gray-500 disabled:cursor-not-allowed`
      }
      disabled={transition.state === 'submitting' || transition.state === 'loading'}
      {...props}
    />
  )
}

export function Select(props: any) {
  const options: JSX.Element[] = []
  for (const d of props.options) {
    const value = d.value || d.label
    options.push(
      <option
        className='text-xs'
        value={value}
        key={`select-option-${value}`}
        disabled={d.value === ''}
      >
        {d.label}
      </option>
    )
  }

  const id = props.id || props.name
  return (
    <div>
      <select
        className='text-slate-700 dark:text-slate-50 bg-gray-200 dark:bg-slate-800 rounded text-sm'
        id={id}
        name={props.name}
        defaultValue={props.options[0].value || props.options[0].label}
        onChange={() => {
          // @ts-ignore
          document.getElementById(`select-clear-${id}`).classList.remove('invisible')}
        }
      >
        {
          // @ts-ignore
          options[0].disabled ? <option value='' key='empty'></option> : null
        }
        {options}
      </select>
      <i id={`select-clear-${id}`} className='ci-close_big cursor-pointer invisible' onClick={(event) => {
        // @ts-ignore
        document.getElementById(id).selectedIndex = 0
        // @ts-ignore
        event.target.classList.add('invisible')
      }}/>
    </div>
  )
}

export function toggleOptions() {
  const icon = document.getElementById('options-icon')

  const open = 'ci-chevron_up'
  const closed = 'ci-chevron_down'

  // @ts-ignore
  const expanded = icon.classList.contains(open)
  // @ts-ignore
  icon.classList = expanded ? closed : open
  // @ts-ignore
  document.getElementById('options-container').className = (expanded ? 'hidden' : 'block')
}
