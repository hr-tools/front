import React from 'react'
import ReactModal from 'react-modal'
import { useState } from 'react'

// @ts-ignore
import { modalStyle, innerModalClassName } from '~/common/notifications'
// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import { TextInputLabel } from '~/common/inputs'
// @ts-ignore
import _ from '~/common/strings'

export function setting(item: string, defaultValue?: string) {try {window.localStorage} catch {return} return localStorage.getItem(item) ?? defaultValue}

function updateHtmlTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const hrUserLink = (id: number, name: string) => {return <TextLink to={`https://v2.horsereality.com/user/${id}`}>{name}</TextLink>}

export function CreditsItems() {
  return (
    <>
    <li>{_('credits_deloryan')} &copy; <TextLink to='https://www.deloryan.com'>Deloryan B.V.</TextLink></li>
    <li>Realtools &copy; <TextLink to='https://shay.cat'>shay</TextLink></li>
    {/*<li>Translations by: {hrUserLink(136244, 'Linn (German)')}</li>*/}
    <li>Realvision data by <TextLink to='/vision/credits'>various contributors</TextLink></li>
    <li>{_('credits_coolicons')} <TextLink to='https://coolicons.cool'>coolicons</TextLink></li>
    </>
  )
}

export default function TitleBar(props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
    <ReactModal
      id='settings-modal'
      isOpen={modalOpen}
      onRequestClose={() => {setModalOpen(false)}}
      ariaHideApp={false}
      closeTimeoutMS={100}
      style={modalStyle}
    >
      <div className={innerModalClassName}>
        <div className='flex mb-2'>
          <h1 className='text-3xl font-extrabold'>{_('settings_title')}</h1>
          <button
            className='ml-auto text-3xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
            title='Close Modal'
            onClick={() => {setModalOpen(false)}}
          >
            <i className='ci-close_big' />
          </button>
        </div>
        <ul className='space-y-1'>
          <li>
            <label>
              <input
                type='checkbox'
                defaultChecked={!(setting('no-watermark', 'false') === 'true')}
                onChange={(e) => {
                  const newVal = !e.currentTarget.checked
                  localStorage.setItem('no-watermark', newVal.toString())
                }}
              />
              {' '}{_('settings_use_watermark')}
            </label>
          </li>
          <li>
            <label>
              <input
                type='checkbox'
                defaultChecked={!(setting('preserve-genes', 'false') === 'true')}
                onChange={(e) => {
                  const newVal = !e.currentTarget.checked
                  localStorage.setItem('preserve-genes', newVal.toString())
                }}
              />
              {' '}{_('settings_clear_genes')}
            </label>
          </li>
          {/*<li>
            <TextInputLabel>{_('settings_site_locale')}</TextInputLabel>
            <select
              className='text-slate-500 dark:text-slate-50 bg-gray-300 dark:bg-slate-700 rounded py-1.5 px-2 w-full cursor-pointer'
              defaultValue={setting('locale', 'en')}
              onChange={(e) => {
                const newVal = e.currentTarget.selectedOptions[0].value
                localStorage.setItem('locale', newVal)
              }}
            >
              <option value='en'>English</option>
              <option value='nl'>Dutch (incomplete)</option>
              <option value='de'>German</option>
            </select>
          </li>*/}
          <li>
            <TextInputLabel>{_('settings_site_theme')}</TextInputLabel>
            <select
              className='text-slate-500 dark:text-slate-50 bg-gray-300 dark:bg-slate-700 rounded py-1.5 px-2 w-full cursor-pointer'
              defaultValue={setting('theme', 'system')}
              onChange={(e) => {
                const newVal = e.currentTarget.selectedOptions[0].value
                if (newVal === 'system') {
                  localStorage.removeItem('theme')
                } else {
                  localStorage.setItem('theme', newVal)
                }
                updateHtmlTheme()
              }}
            >
              <option value='system'>{_('settings_theme_system')}</option>
              <option value='light'>{_('settings_theme_light')}</option>
              <option value='dark'>{_('settings_theme_dark')}</option>
            </select>
          </li>
        </ul>
        <h1 className='text-xl font-extrabold mt-4'>{_('credits_title')}</h1>
        <ul className='text-sm'><CreditsItems /></ul>
      </div>
    </ReactModal>
    <div className='text-lg flex -mb-5'>
      <button
        className='mx-auto opacity-50 hover:opacity-100 transition-opacity leading-[0] z-10'
        onClick={() => {setModalOpen(true)}}
      >
        <i className='ci-settings_filled' />
      </button>
    </div>
    <h1 className='text-sm font-bold flex'>
      <TextLink to='/' className='flex z-10'>
        <img
          className='w-3 h-3 my-auto mr-2'
          src='/static/logo_128.png'
        />
        Realtools
      </TextLink>
      {props.backTo && props.backText && (
        <TextLink to={props.backTo} className='mr-0 ml-auto'>
          {props.backText}
        </TextLink>
      )}
    </h1>
    </>
  )
}
