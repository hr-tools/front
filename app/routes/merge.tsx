import { Link, Form, useLoaderData, useSubmit } from '@remix-run/react'
import { LoaderFunction } from '@remix-run/node'
import React, { useState } from 'react'
import ReactModal from 'react-modal'

// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import TitleBar, { setting } from '~/common/title'
// @ts-ignore
import { TextInput, TextInputLabel, Button, toggleOptions } from '~/common/inputs'
// @ts-ignore
import { horseUrlRegex } from '~/common/regexes'
// @ts-ignore
import apiRequest from '~/common/api'
// @ts-ignore
import { modalStyle, innerModalClassName, Banner } from '~/common/notifications'
// @ts-ignore
import { generateSimpleUrl, copyText } from '~/common/share'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const lifenumber = params.get('share')
  const fromMerge = !!params.get('realmerge')  // We still support redirects from realmerge.shay.cat for the time being
  if (!lifenumber && !fromMerge) return null
  else if (!lifenumber && fromMerge) return { fromMerge }

  const payload = {
    lifenumber: Number(lifenumber),
    use_whites: !!params.get('white-layers'),
    return_color_info: !!params.get('color-info'),
  }

  const data = await apiRequest('POST', '/merge', { json: payload })
  return { ...data, fromMerge, root: url.origin }
}

export default function Merge() {
  const loaderData = useLoaderData()
  const submit = useSubmit()

  const mergeMessage = {
    message: `
      You were just redirected from our old domain.
      Our current domain is realTOOLS.shay.cat.
      If you bookmarked or saved realMERGE.shay.cat,
      please use our current address instead.
      The old address will stop working soon.
    `.trim()
  }
  const [banner, setBanner] = useState(loaderData?.error ? loaderData : loaderData?.fromMerge ? mergeMessage : null)
  const [results, setResults] = useState(loaderData?.horse?.lifenumber ? loaderData : null)
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <div>
      <ReactModal
        isOpen={showShareModal}
        onRequestClose={() => {setShowShareModal(false)}}
        ariaHideApp={false}
        closeTimeoutMS={100}
        style={modalStyle}
      >
        <div className={innerModalClassName}>
          <div className='flex mb-2'>
            <h1 className='text-3xl font-extrabold'>{_('ui_share_vision')}</h1>
            <button
              className='ml-auto text-3xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
              title='Close Modal'
              onClick={() => {setShowShareModal(false)}}
            >
              <i className='ci-close_big' />
            </button>
          </div>
          <TextInput
            value={results
              ? generateSimpleUrl({ extra: { share: results.horse.lifenumber }, root: results.root })
              : ''
            }
            readOnly
          />
          <Button
            styletype='secondary'
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              copyText(generateSimpleUrl({ extra: { share: results.horse.lifenumber }}))
              const t = event.currentTarget
              t.innerText = _('ui_copied')
              t.classList.add('bg-green-600')
              t.classList.add('hover:bg-green-700')
              setTimeout(() => {
                t.innerText = _('ui_copy_share_url')
                t.classList.remove('bg-green-600')
                t.classList.remove('hover:bg-green-700')
              }, 3000)
            }}
          >
            {_('ui_copy_share_url')}
          </Button>
        </div>
      </ReactModal>
      {banner && (
        <Banner
          error={banner.error}
          onClose={() => {
            if (loaderData?.fromMerge) {
              // Clear the query arg so the banner does not reappear
              submit(null, { method: 'get', replace: true })
            }
            setBanner(null)
          }}
        >
          {banner.message}
        </Banner>
      )}

      <div className='w-full'>
        <TitleBar backText='Multi Mode' backTo='/merge/multi' />
        <h1 className='text-5xl font-extrabold'>Realmerge</h1>
        <div className='rounded bg-slate-300 dark:bg-slate-800 p-5 mt-5'>
          <Form
            onSubmit={async (e: any) => {
              e.preventDefault()

              const body = new FormData(e.currentTarget)
              const match = (body.get('horse-url') as string).match(horseUrlRegex)
              if (!match) {
                console.error('Form submitted with invalid horse URL', String(body.get('horse-url')))
                return
              }
              const payload = {
                lifenumber: Number(match[1]),
                use_watermark: !(setting('no-watermark') === 'true'),
                use_whites: body.get('use-white-layers') === 'on',
                return_color_info: body.get('display-color') === 'on',
              }

              const data = await apiRequest('POST', '/merge', { json: payload })
              if (data.error) {
                setBanner(data)
                setResults(null)
              } else {
                setBanner(null)
                setResults(data)
              }
            }}
          >
            <TextInputLabel>{_('ui_horse_url')}</TextInputLabel>
            <TextInput
              placeholder='https://www.horsereality.com/horses/...'
              pattern={horseUrlRegex.source}
              name='horse-url'
              required
            />
            <div className='space-x-2'>
              <Button type='submit'>Merge</Button>
              <Button styletype='secondary' onClick={toggleOptions}>{_('ui_options')} <i id='options-icon' className='ci-chevron_up'/></Button>
              <Link to='/merge/faq'><Button styletype='secondary'>FAQ</Button></Link>
            </div>
            <div id='options-container' className='block'>
              <div className='rounded bg-slate-400 dark:bg-slate-700 py-3 px-4 mt-3'>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' defaultChecked={true} name='use-white-layers'/>{' '}
                      Use white layers
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' defaultChecked={false} name='display-color'/>{' '}
                      Display color info
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </Form>
        </div>

        {/* Result */}
        {results && <Results {...results} setShowShareModal={setShowShareModal} />}
      </div>
    </div>
  )
}

function Results(data: any) {
  const setShowShareModal = data.setShowShareModal

  const url = `https://www.horsereality.com/horses/${data.horse.lifenumber}/`
  const foalUrl = data.horse.foal_lifenumber ? `https://www.horsereality.com/horses/${data.horse.foal_lifenumber}/` : null
  const hasAdult = !!data.merged.adult
  const hasFoal = !!data.merged.foal
  const hasColorInfo = !!data.color_info

  const [currentTab, setTab] = useState(hasAdult ? 'adult' : 'foal')
  const color_info = data.color_info || {}
  let ageSpecifier = ''
  if (hasAdult && hasFoal) ageSpecifier = `(${data.foal ? 'foal' : 'adult'})`

  const colorNotes: JSX.Element[] = []
  for (const name of color_info.notes || []) {
    const text = _(`note_${name}`)
    if (text) colorNotes.push(<li key={`note-${name}`}>{text}</li>)
  }

  const errors: JSX.Element[] = []
  for (const name of color_info.errors || []) {
    const text = _(`error_${name}`)
    if (text) errors.push(<li key={`error-${name}`}>{text}</li>)
  }

  return (
    <div className='rounded bg-slate-300 dark:bg-slate-800 p-5 mt-5' id='results'>
      {currentTab === 'adult' ? (
        <div>
          <a className='hover:underline underline-offset-2 decoration-slate-700 dark:decoration-slate-50' href={url} target='_blank'>
            <h2 className='text-2xl mb-3 font-bold'>{data.horse.name}</h2>
          </a>
          <img className='rounded bg-slate-400 mx-auto dark:bg-slate-700 p-3' src={data.merged.adult}/>
        </div>
      ) : currentTab === 'foal' ? (
        <div>
          <a className='hover:underline underline-offset-2 decoration-slate-700 dark:decoration-slate-50' href={foalUrl ?? url} target='_blank'>
            <h2 className='text-2xl mb-3 font-bold'>{data.horse.name}</h2>
          </a>
          <img className='rounded bg-slate-400 mx-auto dark:bg-slate-700 p-3' src={data.merged.foal}/>
        </div>
      ) : currentTab === 'colors' && (
        <div>
          <p className='text-sky-400 text-sm font-bold italic'>
            Color info for <a href={url} target='_blank' className='hover:underline underline-offset-2 decoration-slate-700 dark:decoration-slate-50'>
              <span className='text-slate-700 dark:text-slate-50'>{data.horse.name}</span>
            </a> {ageSpecifier}
          </p>
          {color_info.color && (
            <div>
              <h2 className='text-2xl font-bold'>{_('ui_phenotype')}</h2>
              <p className='text-slate-800 dark:text-slate-200 text-lg'>{color_info.color}</p>
            </div>
          )}
          {color_info.dilution && (
            <div>
              <h2 className='text-2xl font-bold'>{_('ui_genotype')}</h2>
              <p className='text-slate-800 dark:text-slate-200 text-lg'>{color_info.dilution}</p>
            </div>
          )}
          {!!errors.length && (
            <div>
              <h2 className='text-rose-50 text-2xl font-bold'>Errors</h2>
              <ul className='text-slate-800 dark:text-slate-200 text-lg list-disc ml-4'>{errors}</ul>
            </div>
          )}
          {!!colorNotes.length && (
            <div>
              <h2 className='text-2xl font-bold'>Notes</h2>
              <ul className='text-slate-800 dark:text-slate-200 text-lg list-disc ml-4'>{colorNotes}</ul>
            </div>
          )}
        </div>
      )}
      <div className='space-x-2'>
        {hasAdult && (hasFoal || hasColorInfo) ? <Button styletype='secondary' onClick={() => setTab('adult')}>Show Adult</Button> : null}
        {hasFoal && (hasAdult || hasColorInfo) ? <Button styletype='secondary' onClick={() => setTab('foal')}>Show Foal</Button> : null}
        {hasColorInfo ? <Button styletype='secondary' onClick={() => setTab('colors')}>Color Info</Button> : null}
        <Button onClick={() => setShowShareModal(true)}>Share</Button>
      </div>
    </div>
  )
}
