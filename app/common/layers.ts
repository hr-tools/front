// @ts-ignore
import { layerUrlRegex } from '~/common/regexes'

export function dissectLayerUrl(layerUrl: string) {
  const match = layerUrl.match(layerUrlRegex as RegExp)
  const layer_attrs_list = (match ?? [])[2].split('/')

  return {
    type: layer_attrs_list[2],  // colours, whites
    horse_type: layer_attrs_list[3],  // mares, stallions, foals
    body_part: layer_attrs_list[4],  // body, mane, tail
    size: layer_attrs_list[5],  // small, medium, large
    id: layer_attrs_list[6].replace('.png', ''),  // These are not unique
  }
}

export function constructLayerUrl(layer: any, size: string = 'large') {
  return `https://www.horsereality.com/upload/${layer.type}/${layer.horse_type}/${layer.body_part}/${size}/${layer.id}.png`
}
