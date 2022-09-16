import { Form, Link, useLoaderData } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'

// @ts-ignore
import apiRequest from '~/common/api'
// @ts-ignore
import { Button, TextInput, TextInputLabel } from '~/common/inputs'
// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import TitleBar, { setting } from '~/common/title'
// @ts-ignore
import { layerUrlRegex } from '~/common/regexes'
// @ts-ignore
import { dissectLayerUrl, constructLayerUrl } from '~/common/layers'
// @ts-ignore
import { modalStyle, innerModalClassName, Banner } from '~/common/notifications'
// @ts-ignore
import { copyText } from '~/common/share'


const randomNumber = () => {return Math.round(Math.random() * 100000)}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const isDiscordRequest = request.headers.get('user-agent')?.indexOf('DiscordBot') != -1
  if (isDiscordRequest && params.get('share')) {
    // Do not return any metadata for Discord crawler requests to share pages
    return new Response(null, { status: 204 })
  }

  if (params.get('share')) {
    // Advanced share
    const data = await apiRequest('GET', `/multi-share/${params.get('share')}`)
    if (data.error) return null
    return { _action: 'add_many', ...data }
  } else if (params.get('layer')) {
    // Vision's "import to multi" option
    const data: { _action: string, layers: Record<string, any>[] } = { _action: 'add_layers', layers: [] }
    for (const layerUrl of params.getAll('layer')) {
      try {
        const layerData = dissectLayerUrl(layerUrl)
        data.layers.push({
          ...layerData,
          key_id: `${randomNumber()}-${layerData.id}`,
        })
      } catch {}
    }
    return data
  }
  return null
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

export const meta: MetaFunction = () => {
  return { title: 'Realmerge Multi' }
}

export default function Multi() {
  const loaderData = useLoaderData()

  const [shareData, setShareData] = useState(null)
  const [shareShown, setShareShown] = useState(false)
  const [grouped, setGrouped] = useState({ individual: { lifenumber: null, name: 'Individual Layers', layers: [] }})
  let [enabled, setEnabled] = useState([])

  if (loaderData) {
    switch (loaderData._action) {
      case 'add_layers':
        grouped.individual.layers.push.apply(grouped.individual.layers, loaderData.layers)
        setGrouped(copyObject(grouped))

        enabled.push.apply(enabled, loaderData.layers)
        setEnabled(copyObject(enabled))
        break
      case 'add_many':
        Object.assign(grouped, loaderData.layers)
        setGrouped(copyObject(grouped))
        setEnabled(loaderData.enabled)
        break
      default:
        break
    }
    delete loaderData._action
  }

  const [result, setResult] = useState(null)
  const [banner, setBanner] = useState(loaderData?.error ? loaderData : null)

  return (
    <div>
      <ReactModal
        isOpen={shareData !== null && shareShown}
        onRequestClose={() => {setShareShown(false)}}
        ariaHideApp={false}
        closeTimeoutMS={100}
        style={modalStyle}
      >
        <div className={innerModalClassName}>
          <div className='flex mb-2'>
            <h1 className='text-3xl font-extrabold'>Share Result</h1>
            <button
              className='ml-auto text-3xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
              title='Close Modal'
              onClick={() => {setShareShown(false)}}
            >
              <i className='ci-close_big' />
            </button>
          </div>
          <TextInput
            value={(shareData as any)?.url ?? ''}  // React doesn't like the value going from undefined -> defined, or being null at all
            readOnly
          />
          <p className='italic text-slate-500'>Expires at: {shareData ? new Date((shareData as any).expires * 1000).toLocaleString() : ''}</p>
          <Button
            styletype='secondary'
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              // @ts-ignore
              copyText(shareData.url)
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
            setBanner(null)
          }}
        >
          {banner.message}
        </Banner>
      )}
      <div className='w-full'>
        <TitleBar />
        <h1 className='text-5xl font-extrabold'>Multi</h1>

        <div className='rounded bg-gray-200 dark:bg-slate-800 p-5 mt-5'>
          <Form
            onSubmit={async (e) => {
              e.preventDefault()

              const body = new FormData(e.currentTarget)

              setBanner(null)
              const data: Record<string, string> = dissectLayerUrl(body.get('url'))
              data.key_id = `${randomNumber()}-${data.id}`

              // @ts-ignore
              const groupName: string | null = body.get('group-name')
              if (groupName) {
                grouped[groupName] = grouped[groupName] ?? {
                  name: groupName,
                  layers: [],
                }
                grouped[groupName].layers.push(data)
              } else {
                // @ts-ignore
                grouped.individual.layers.push(data)
              }

              setGrouped(copyObject(grouped))
            }}
          >
            <TextInputLabel>{_('ui_layer_url')}</TextInputLabel>
            <TextInput
              placeholder='https://www.horsereality.com/upload/...'
              pattern={layerUrlRegex.source}
              name='url'
              required
            />
            <div className='mt-2' />
            <TextInputLabel>{_('ui_group_name')}</TextInputLabel>
            <TextInput
              placeholder='Foal Doe 12345'
              name='group-name'
            />
            <div className='space-x-2'>
              <Button type='submit'>{_('ui_add_layer')}</Button>
              <Link to='/merge/faq?o=multi-mode#multi-mode'><Button styletype='secondary'>FAQ</Button></Link>
            </div>
          </Form>
        </div>

        {/* Layers */}
        {Object.keys(grouped).filter(id => !!grouped[id].layers.length).map(id => {
          const horse: Record<string, any> = grouped[id]
          return (
            <div
              key={`horse-layers-${id}`}
              className='rounded mt-5 bg-gray-200 dark:bg-slate-800 p-5 pt-4'
            >
              <div className='flex'>
                {horse.lifenumber ? (
                  <h1 className='text-2xl font-bold'>
                    <a className='hover:underline' href={`https://www.horsereality.com/horses/${horse.lifenumber}/`} target='_blank'>
                      {horse.name}
                    </a>
                  </h1>
                ) : (
                  <h1 className='text-2xl font-bold'>{horse.name}</h1>
                )}
                <button
                  className='ml-auto text-2xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500 group'
                  disabled={enabled.filter((item: any) => horse.layers.map(layer => layer.key_id).indexOf(item.key_id) != -1).length < 1}
                  title='Deselect Layers'
                  onClick={() => {
                    setEnabled(enabled.filter((item: any) => horse.layers.map(layer => layer.key_id).indexOf(item.key_id) == -1))

                    for (const layerCheckboxElement of document.getElementsByClassName(`${id}-layer`)) {
                      // @ts-ignore
                      layerCheckboxElement.checked = false
                    }

                    setShareData(null)  // Data changed, clear the share modal
                  }}
                >
                  {
                    enabled.filter((item: any) => horse.layers.map(layer => layer.key_id).indexOf(item.key_id) != -1).length < 1
                    ? <i className='ci-trash_empty'/>
                    : <i className='ci-trash_full'/>
                  }
                </button>
                <button
                  className='ml-2 text-2xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
                  title='Close Group'
                  onClick={() => {
                    setEnabled(enabled.filter(item => horse.layers.indexOf(item) == -1))

                    if (id !== 'individual') delete grouped[id]
                    else grouped.individual.layers = []

                    setShareData(null)  // Data changed, clear the share modal
                  }}
                >
                  <i className='ci-close_big'/>
                </button>
              </div>
              <div className='overflow-x-auto'>
                <div className='mt-3 w-max flex space-x-2 pb-3'>
                  {horse.layers.map(layer => (
                    <label>
                      <input
                        type='checkbox'
                        className={`peer ${id}-layer`}
                        defaultChecked={
                          // Using filter() is not necessary normally but it
                          // is when loading from a share link
                          enabled.filter((item: any) => item.key_id == layer.key_id).length > 0
                        }
                        onChange={(event) => {
                          event.target.checked
                          // @ts-ignore
                          ? setEnabled([...enabled, layer])
                          : setEnabled(enabled.filter((item: any) => item.key_id != layer.key_id))

                          setShareData(null)  // Data changed, clear the share modal
                        }}
                        hidden
                      />
                      <img
                        src={constructLayerUrl(layer, 'small')}
                        className='h-16 p-0.5 rounded cursor-pointer bg-gray-300 peer-checked:bg-gray-400 dark:bg-slate-700 dark:peer-checked:bg-slate-600'
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {/* Preview */}
        {enabled.length > 0 && (
          <Preview
            grouped={grouped}
            enabled={enabled}
            shareDataReferences={[shareData, setShareData]}
            shareShownReferences={[shareShown, setShareShown]}
            resultReferences={[result, setResult]}
            bannerReferences={[banner, setBanner]}
          />
        )}

        {/* Result */}
        {result && (
          <Result
            data={result}
            closeResult={() => {setResult(null)}}
          />
        )}
      </div>
    </div>
  )
}

function Preview(props) {
  function resize() {
    const container = document.getElementById('preview-img-container')
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

      // We make it invisible when loading to avoid flashing
      child.classList.remove('invisible')
    }
  }

  try {
    window.onresize = resize
    window.onload = resize
  } catch (e) {
    if (e instanceof ReferenceError) {
      useEffect(() => {
        window.onresize = resize
        window.onload = resize
      })
    } else {
      throw e
    }
  }

  const previewLayers: JSX.Element[] = []
  for (const l of props.enabled) {
    const key = `${l.type}/${l.horse_type}/${l.body_part}/large/${l.id}`
    const largeUrl = `https://www.horsereality.com/upload/${key}.png`
    previewLayers.push(<img className='absolute invisible' src={largeUrl} key={`layer-${l.key_id}`} onLoad={resize}/>)
  }

  const [shareData, setShareData] = props.shareDataReferences
  const [shareShown, setShareShown] = props.shareShownReferences
  const [result, setResult] = props.resultReferences
  const [banner, setBanner] = props.bannerReferences

  return (
    <div className='rounded bg-gray-200 dark:bg-slate-800 p-5 mt-5'>
      <div className='block'>
        <h2 className='text-2xl mb-3 font-bold'>Preview</h2>
        <div className='rounded bg-gray-300 dark:bg-slate-700 p-3' id='preview-img-container'>
          {previewLayers}
          <img src='/static/blank.png'/>
        </div>
      </div>
      <div className='space-x-2'>
        <Button onClick={async () => {
          if (shareData) {
            // Don't make a new identical share URL if no data changed
            setShareShown(true)
            return
          }
          const data = await apiRequest('POST', '/multi-share', { json: { layers: props.grouped, enabled: props.enabled } })
          setShareData(data)
          setShareShown(true)
        }}>
          Share
        </Button>
        <Button
          onClick={async () => {
            const data = await apiRequest('POST', '/merge/multiple', { json: {
              urls: props.enabled.map(l => constructLayerUrl(l)),
              use_watermark: !(setting('no-watermark', 'false') === 'true')
            }})
            if (data.error) { setBanner(data) }
            else { setResult(data) }
          }}
          disabled={props.enabled.length < 2}
          title={props.enabled.length < 2 ? 'You cannot merge with only one layer enabled.' : ''}
        >
          Merge
        </Button>
      </div>
    </div>
  )
}

function Result(props: any) {
  return (
    <div className='rounded bg-gray-200 dark:bg-slate-800 p-5 mt-5'>
      <div className='flex'>
        <h2 className='text-2xl my-auto font-bold'>Result</h2>
        <button
          className='ml-auto my-auto text-2xl text-slate-400 hover:text-slate-500 dark:text-slate-600 hover:dark:text-slate-500'
          title='Close Result'
          onClick={props.closeResult}
        >
          <i className='ci-close_big'/>
        </button>
      </div>
      <img
        className='rounded bg-gray-300 mt-3 mx-auto dark:bg-slate-700 p-3'
        src={props.data.merged}
      />
    </div>
  )
}
