import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, Form, useLoaderData } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'

// @ts-ignore
import apiRequest from '~/common/api'
// @ts-ignore
import TitleBar, { setting } from '~/common/title'
// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import { Button, TextInput, TextInputLabel, toggleOptions, Select } from '~/common/inputs'
// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import { generateSimpleUrl, copyText } from '~/common/share'
// @ts-ignore
import { modalStyle, innerModalClassName, Banner } from '~/common/notifications'
// @ts-ignore
import { foalLayerUrlRegex, horseUrlRegex } from '~/common/regexes'
// @ts-ignore
import { dissectLayerUrl } from '~/common/layers'


const availableGenes = [
  'agouti',
  'extension',
  'rabicano',
  'roan',
]

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const payload: any = {
    genes: {},
  }

  for (const gene of availableGenes) {
    const value = params.get(gene)
    if (value) payload.genes[gene] = value
  }

  const lifenumber = params.get('share')
  if (lifenumber) {
    payload.lifenumber = Number(lifenumber)
    const data = await apiRequest('POST', '/predict-lifenumber', { json: payload })
    return {
      ...data,
      root: url.origin
    }
  }

  const breed = params.get('b')
  const sex = params.get('s')
  const layerUrls = params.getAll('layer')
  if (breed && sex && layerUrls.length >= 3) {
    payload.layer_urls = layerUrls
    payload.horse_info = {
      lifenumber: 0,
      name: params.get('n') ?? 'Foal Doe',
      breed,
      sex,
    }

    const data = await apiRequest('POST', '/predict', { json: payload })
    return {
      ...data,
      raw_breed: breed,
      raw_layer_urls: layerUrls,
      root: url.origin
    }
  }

  return null
}

export const meta: MetaFunction = () => {
  return { title: 'Realvision' }
}

const randomNumber = () => {return Math.round(Math.random() * 100000)}

function Option(props: { label: string, value?: string, placeholder?: boolean }) {
  return <option value={props.value ?? props.label} disabled={props.placeholder}>{props.label}</option>
}

function copyObject(from: any) {
  try {
    return structuredClone(from)
  } catch {
    if (from.slice) {
      return from.slice()
    } else {
      const copied = {}
      Object.assign(copied, from)
      return copied
    }
  }
}

const selectStyle = 'text-slate-500 dark:text-slate-50 bg-gray-300 dark:bg-slate-700 rounded py-1.5 px-2 w-full cursor-pointer'

export default function Vision() {
  const loaderData: Record<string, any> | null = useLoaderData()

  const [useLayersMode, setUseLayersMode] = useState(false)
  const [inputKeys, setInputKeys] = useState([randomNumber(), randomNumber(), randomNumber()])
  const [parsedDrafts, setParsedDrafts] = useState({})
  const [banner, setBanner] = useState(loaderData?.error ? loaderData : null)
  const [results, setResults] = useState(!loaderData?.error ? loaderData : null)
  const [shownShareUrl, setShownShareUrl] = useState(null)
  const [minimizeInputs, setMinimizeInputs] = useState(loaderData != null)

  const clearMostState = () => {
    setInputKeys([randomNumber(), randomNumber(), randomNumber()])
    setParsedDrafts({})
    setBanner(null)
    setResults(null)
  }

  // Resize every 500 ms to make sure the image does not go out of bounds too often
  useEffect(() => {
    const interval = setInterval(() => { resize() }, 500)
    return () => { clearInterval(interval) }
  }, [])

  return (
    <div>
      <ReactModal
        isOpen={!!shownShareUrl}
        onRequestClose={() => {setShownShareUrl(null)}}
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
              onClick={() => {setShownShareUrl(null)}}
            >
              <i className='ci-close_big' />
            </button>
          </div>
          <TextInput
            value={shownShareUrl ?? ''}  // React doesn't like the value going from undefined -> defined, or being null at all
            readOnly
          />
          <Button
            styletype='secondary'
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              copyText(shownShareUrl)
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
          onClose={() => {setBanner(null)}}
        >
          {banner.message}
        </Banner>
      )}
      <div className='w-full'>
        <TitleBar />
        <h1 className='text-5xl font-extrabold'>Realvision</h1>
        {minimizeInputs ? (
          <div className='rounded bg-gray-200 dark:bg-slate-800 px-5 py-3 mt-5 text-sm'>
            <button
              className='opacity-80 hover:opacity-100 transition-opacity'
              onClick={() => {setMinimizeInputs(false)}}
            >
              {_('ui_minimized_vision')}
            </button>
          </div>
        ) : (
          <div className='rounded bg-gray-200 dark:bg-slate-800 p-5 mt-5'>
            <Form
              onSubmit={async (e) => {
                e.preventDefault()

                const body = new FormData(e.currentTarget)

                const genes = {}
                for (const gene of availableGenes) {
                  const value = body.get(gene)
                  if (value) genes[gene] = value
                }

                let data: any = {}
                if (!useLayersMode) {
                  const match = (body.get('horse-url') as string).match(horseUrlRegex)
                  if (!match) {
                    console.error('Form submitted with invalid horse URL', String(body.get('horse-url')))
                    return
                  }
                  data = await apiRequest('POST', '/predict-lifenumber', { json: { lifenumber: Number(match[1]), genes } })
                } else {
                  const payload = {
                    layer_urls: body.getAll('layer-url'),
                    horse_info: {
                      lifenumber: 0,
                      name: 'Foal Doe',
                      breed: body.get('breed'),
                      sex: body.get('sex'),
                    },
                    genes,
                  }
                  data = await apiRequest('POST', '/predict', { json: payload })
                }

                if (data.error) {
                  setBanner(data)
                  setResults(null)
                } else {
                  if (useLayersMode) {
                    data.horse.raw_breed = body.get('breed')
                    data.horse.raw_layer_urls = body.getAll('layer-url')
                  }
                  setBanner(null)
                  setResults(data)
                  // Successful prediction - clear gene selections if the user has that setting enabled
                  if (setting('preserve-genes') !== 'true') {
                    for (const gene of availableGenes) {
                      const input: HTMLSelectElement | null = document.querySelector(`select[name="${gene}"]`)
                      if (input) input.selectedIndex = 0
                      const x = document.querySelector(`#select-clear-${input?.id}`)
                      x?.classList.add('invisible')
                    }
                  }
                }
              }}
            >
              {!useLayersMode ? (
                <>
                <div className='w-full flex'>
                  <TextInputLabel>{_('ui_horse_url')}</TextInputLabel>
                  <button
                    className='ml-auto text-slate-500 dark:text-slate-300 opacity-60 hover:underline hover:opacity-100 transition-opacity'
                    onClick={() => {setUseLayersMode(true); clearMostState()}}
                    type='button'
                  >
                    {_('ui_advanced_mode')}
                  </button>
                </div>
                <TextInput
                  placeholder='https://www.horsereality.com/horses/...'
                  pattern={horseUrlRegex.source}
                  name='horse-url'
                  required
                />
                </>
              ) : (
                <>
                <div className='w-full flex'>
                  <TextInputLabel>
                    {_('ui_layers') + ' '}
                    <TextLink to='/vision/faq?o=layer-urls#layer-urls'>
                      <i className='ci-info_circle'/>
                    </TextLink>
                  </TextInputLabel>
                  <button
                    className='ml-auto text-slate-500 dark:text-slate-300 opacity-60 hover:underline hover:opacity-100 transition-opacity'
                    onClick={() => {setUseLayersMode(false); clearMostState()}}
                    type='button'
                  >
                    {_('ui_standard_mode')}
                  </button>
                </div>
                <div className='space-y-2'>
                {inputKeys.map((key, index) => {
                  return (
                    <div className='flex' key={`draft-layer-url-${key}`}>
                      <TextInput
                        placeholder='https://www.horsereality.com/upload/.../foals/...'
                        pattern={foalLayerUrlRegex.source}
                        name='layer-url'
                        required
                        onChange={(e: Event) => {
                          // @ts-ignore
                          const val: string = e.currentTarget.value
                          if (!foalLayerUrlRegex.test(val)) {
                            const copy = copyObject(parsedDrafts)
                            copy[key] = null
                            setParsedDrafts(copy)
                            return
                          }
                          try {
                            const parsed = dissectLayerUrl(val)
                            const copy = copyObject(parsedDrafts)
                            copy[key] = parsed
                            setParsedDrafts(copy)
                          } catch {}
                        }}
                      />
                      {parsedDrafts[key] && (
                        <div className='bg-gray-300 text-slate-700 dark:bg-slate-700 dark:text-slate-50 rounded py-1.5 px-3 ml-2 my-auto min-w-fit capitalize select-none'>
                          {parsedDrafts[key].body_part}
                          {parsedDrafts[key].type === 'whites' && (' Whites')}
                        </div>
                      )}
                      {index + 1 === inputKeys.length && (
                        <button
                          className='ml-3 my-auto'
                          type='button'
                          onClick={() => {
                            if (inputKeys.length >= 6) {
                              setBanner({ message: 'Maximum of 6 layers already reached.' })
                              return
                            }
                            const copy = inputKeys.slice()
                            copy.push(randomNumber())
                            setInputKeys(copy)
                          }}
                        >
                          <i className='ci-plus_circle opacity-70 text-3xl hover:opacity-100 transition-opacity' />
                        </button>
                      )}
                      {!(inputKeys.length <= 3 && index + 1 == inputKeys.length) && (
                        <button
                          className='ml-3 my-auto'
                          type='button'
                          onClick={() => {
                            if (inputKeys.length <= 3) {
                              setBanner({ message: 'Minimum of 3 layers already reached.' })
                              return
                            }
                            setInputKeys(inputKeys.filter(val => val !== key))
                          }}
                        >
                          <i className='ci-close_big opacity-70 text-3xl hover:opacity-100 transition-opacity' />
                        </button>
                      )}
                    </div>
                  )
                })}
                </div>
                <div className='mt-2'></div>
                <TextInputLabel>{_('ui_foal')}</TextInputLabel>
                <div className='flex space-x-2'>
                  <select name='breed' className={selectStyle} defaultValue='' required>
                    <Option label={_('ui_breed')} value='' placeholder />
                    <Option label={_('breed_akhal_teke')} value='Akhal-Teke' />
                    <Option label={_('breed_arabian_horse')} value='Arabian Horse' />
                    <Option label={_('breed_brabant_horse')} value='Brabant Horse' />
                    <Option label={_('breed_brumby_horse')} value='Brumby Horse' />
                    <Option label={_('breed_camargue_horse')} value='Camargue Horse' />
                    <Option label={_('breed_cleveland_bay')} value='Cleveland Bay' />
                    <Option label={_('breed_exmoor_pony')} value='Exmoor Pony' />
                    <Option label={_('breed_finnhorse')} value='Finnhorse' />
                    <Option label={_('breed_fjord_horse')} value='Fjord Horse' />
                    <Option label={_('breed_friesian_horse')} value='Friesian Horse' />
                    <Option label={_('breed_haflinger_horse')} value='Haflinger Horse' />
                    <Option label={_('breed_icelandic_horse')} value='Icelandic Horse' />
                    <Option label={_('breed_irish_cob')} value='Irish Cob Horse' />
                    <Option label={_('breed_kladruber_horse')} value='Kladruber Horse' />
                    <Option label={_('breed_knabstrupper')} value='Knabstrupper' />
                    <Option label={_('breed_lusitano')} value='Lusitano' />
                    <Option label={_('breed_mustang_horse')} value='Mustang Horse' />
                    <Option label={_('breed_namib_desert_horse')} value='Namib Desert Horse' />
                    <Option label={_('breed_noriker_horse')} value='Noriker Horse' />
                    <Option label={_('breed_norman_cob')} value='Norman Cob' />
                    <Option label={_('breed_oldenburg_horse')} value='Oldenburg Horse' />
                    <Option label={_('breed_pura_raza_española')} value='Pura Raza Española' />
                    <Option label={_('breed_quarter_horse')} value='Quarter Horse' />
                    <Option label={_('breed_shire_horse')} value='Shire Horse' />
                    <Option label={_('breed_suffolk_punch')} value='Suffolk Punch' />
                    <Option label={_('breed_thoroughbred')} value='Thoroughbred' />
                    <Option label={_('breed_trakehner_horse')} value='Trakehner Horse' />
                    <Option label={_('breed_welsh_pony')} value='Welsh Pony' />
                  </select>
                  <select name='sex' className={selectStyle} defaultValue='' required>
                    <Option label={_('ui_sex')} value='' placeholder />
                    <Option label={_('sex_colt')} value='Stallion' />
                    <Option label={_('sex_filly')} value='Mare' />
                  </select>
                </div>
                </>
              )}
              <div className='space-x-2'>
                <Button type='submit'>{_('ui_predict')}</Button>
                <Button styletype='secondary' onClick={toggleOptions}>{_('ui_options')} <i id='options-icon' className='ci-chevron_up'/></Button>
                <Link to='/vision/faq'><Button styletype='secondary'>FAQ</Button></Link>
              </div>
              <div id='options-container' className='block'>
                <div className='rounded bg-gray-300 dark:bg-slate-700 py-3 px-4 mt-3'>
                  <div className='flex flex-wrap'>
                    <div className='mx-auto w-auto'>
                      <h2 className='font-bold'>Base color</h2>
                      <ul>
                        <li>
                          <Select
                            name='extension'
                            options={[
                              { label: 'Extension', value: '' },
                              { label: 'e/e' },
                              { label: 'E/_', value: 'E/e' },
                            ]}
                          />
                        </li>
                        <li>
                          <Select
                            name='agouti'
                            options={[
                              { label: 'Agouti', value: '' },
                              { label: 'a/a' },
                              { label: 'A/_', value: 'A/a' },
                            ]}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className='mx-auto w-auto'>
                      <h2 className='font-bold'>White patterns</h2>
                      <ul>
                        <li>
                          <Select
                            name='roan'
                            options={[
                              {label: 'Roan', value: ''},
                              {label: 'RN/n', value: 'RN'},
                            ]}
                          />
                        </li>
                        <li>
                          <Select
                            name='rabicano'
                            options={[
                              { label: 'Rabicano', value: '' },
                              { label: 'rb/rb' },
                            ]}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <TextLink
                    className='text-sky-600 decoration-sky-600 mt-2 block'
                    to='/vision/faq?o=base-color-selections#base-color-selections'
                  >
                    <i className='ci-info_circle'/> What do these do?
                  </TextLink>
                </div>
              </div>
            </Form>
          </div>
        )}

        {/* Result */}
        {results && <Results {...results} setShownShareUrl={setShownShareUrl} />}

      </div>
    </div>
  )
}

function resize() {
  const container = document.getElementById('prediction-img-container')
  if (!container) return
  if (container.children.length < 1) return

  const containerRect = container.getBoundingClientRect()
  const height = container.children[0].getBoundingClientRect().height
  const width = containerRect.width - 25

  for (const child of container.children) {
    // @ts-ignore
    child.width = width

    // @ts-ignore
    // Our 1:1 blank.png will cause some height issues so we just specify its height too
    if (child.src.indexOf('/static/blank.png') != -1) child.style.height = height + 'px'
  }
}

function Results(data: any) {
  const setShownShareUrl = data.setShownShareUrl
  const [currentTab, setTab] = useState('prediction')

  const color_info: Record<string, string> = data.color_info ?? {}
  const notes: JSX.Element[] = []
  for (const name of color_info.notes || []) {
    const text: string = _(`note_${name}`)
    if (text) notes.push(<li key={`note-${name}`}>{text}</li>)
  }

  const errors: JSX.Element[] = []
  for (const name of color_info.errors || []) {
    const text: string = _(`error_${name}`)
    if (text) errors.push(<li key={`error-${name}`}>{text}</li>)
  }

  try {
    window.onresize = resize
    window.onload = resize
  } catch {
  }

  const multiParams = new URLSearchParams()
  const predictionLayers: JSX.Element[] = []
  for (const l of data.prediction.layers) {
    const key = `${l.type}/${l.horse_type}/${l.body_part}/large/${l.id}`
    const largeUrl = `https://www.horsereality.com/upload/${key}.png`
    predictionLayers.push(<img className='absolute' src={largeUrl} key={`layer-${key}`} onLoad={resize} />)
    multiParams.append('layer', largeUrl)
  }

  return (
    <div
      id='results'
      className='rounded bg-gray-200 dark:bg-slate-800 p-5 mt-5'
    >
      {currentTab === 'prediction' ? (
        <div>
          {data.horse.lifenumber === 0 ? (
            <h2 className='text-2xl mb-3 font-bold'>Prediction</h2>
          ) : (
            <a href={`https://www.horsereality.com/horses/${data.horse.lifenumber}/`} className='hover:underline'>
              <h2 className='text-2xl mb-3 font-bold'>{data.horse.name}</h2>
            </a>
          )}
          <div className='rounded bg-gray-300 dark:bg-slate-700 p-3' id='prediction-img-container'>
            {predictionLayers}
            <img src='/static/blank.png'/>
            {/*<img className='absolute ml-auto max-w-xs max-h-xs' src='/static/horse-reality-logo-small.png' />*/}
          </div>
        </div>
      ) : currentTab === 'colors' && (
        <div id='tab-colors'>
          {
            color_info.color ? (
              <div>
                <h2 className='text-2xl font-bold'>{_('ui_phenotype')}</h2>
                <p className='text-slate-800 dark:text-slate-200 text-lg'>{color_info.color}</p>
              </div>
            ) : null
          }
          {
            color_info.dilution ? (
              <div>
                <h2 className='text-2xl font-bold'>{_('ui_genotype')}</h2>
                <p className='text-slate-800 dark:text-slate-200 text-lg'>{color_info.dilution}</p>
              </div>
            ) : null
          }
          {
            errors.length > 0 ? (
              <div>
                <h2 className='text-rose-50 text-2xl font-bold'>Errors</h2>
                <ul className='text-slate-800 dark:text-slate-200 text-lg list-disc ml-4'>{errors}</ul>
              </div>
            ) : null
          }
          {
            notes.length > 0 ? (
              <div>
                <h2 className='text-2xl font-bold'>Notes</h2>
                <ul className='text-slate-800 dark:text-slate-200 text-lg list-disc ml-4'>{notes}</ul>
              </div>
            ) : null
          }
        </div>
      )}
      <div className='space-x-2'>
        <Button styletype='secondary' onClick={() => setTab('prediction')}>Show Prediction</Button>
        <Button styletype='secondary' onClick={() => setTab('colors')}>Color Info</Button>
        <Button onClick={() => {
          if (data.horse.lifenumber === 0) {
            const url = new URL(generateSimpleUrl({ extra: {
              b: data.horse.raw_breed,
              s: data.horse.sex,
              ...data.selected_genes,
            }}))
            data.horse.raw_layer_urls.forEach((layerUrl: string) => {
              url.searchParams.append('layer', layerUrl.replace('https://www.horsereality.com/upload/', '').replace('.png', ''))
            })
            setShownShareUrl(url.toString())
          } else {
            const url = generateSimpleUrl({ extra: { share: data.horse.lifenumber } })
            setShownShareUrl(url)
          }
        }}>
          Share
        </Button>
        <Link to={`/merge/multi?${multiParams}`}><Button onClick={() => {}}>Multi</Button></Link>
      </div>
    </div>
  )
}
