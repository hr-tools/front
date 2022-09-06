// @ts-ignore
import getString from '~/common/strings'

export default async function apiRequest(method: string, path: string, props: any) {
  let base = null
  // Server & client both use this function
  try {
    // @ts-ignore
    base = window.env.API_BASE
  } catch {
    // @ts-ignore
    base = process.env.API_BASE
  }

  const url = `${base}${path}`
  const send_data: { method: string, body?: any, headers?: any } = {
    method: method,
  }

  if (props && typeof props.json != 'undefined') {
    send_data.body = JSON.stringify(props.json)
    send_data.headers = { 'Content-Type': 'application/json' }
  } else if (props && typeof props.form != 'undefined') {
    send_data.body = props.form
  }

  const response = await fetch(url, send_data)
  const data = await response.json()

  if (!response.ok) {
    if (data.name) {
      data.message = getString(`error_${data.name}`) ?? data.message
    }
    return { error: true, ...data }
  }
  return data
}
