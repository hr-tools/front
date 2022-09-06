import React from 'react'
import type { MetaFunction } from '@remix-run/server-runtime'

// @ts-ignore
import New from '~/common/new'
// @ts-ignore
import TitleBar from '~/common/title'
// @ts-ignore
import { TextLink } from '~/common/links'

const users = {
  86694: { name: 'aBREEviate' },
  70318: { name: 'Aca' },
  104787: { name: 'Allendria' },
  104991: { name: 'ArufaurufuChan' },
  2743: { name: 'Casper' },
  30403: { name: 'Dark-Cornelius' },
  49048: { name: 'Dreepy' },
  45061: { name: '--Equestrian--' },
  18825: { name: 'Falida' },
  12669: { name: 'Foam' },
  38272: { name: 'JessaB' },
  8740: { name: 'Karmaleon' },
  66435: { name: 'Kit-Kat' },
  136244: { name: 'Linn' },
  131121: { name: 'LunaSommer' },
  219647: { name: 'LynxVagabond' },
  39129: { name: 'Nagapie' },
  20072: { name: 'Reysies' },
  90984: { name: 'Ruttis' },
  150678: { name: 'Sarah_The_Candle' },
  125690: { name: 'silfurskin' },
  53147: { name: 'thanksbutnah' },
  18159: { name: 'Tieria' },
  115389: { name: 'Villy' },
  56657: { name: 'yolonayo' },
  100782: { name: 'Yumy' },
}

const dataByBreed = {
  'Akhal-Teke': { userIds: [86694, 136244] },
  'Arabian': { userIds: [12669, 136244, 39129] },
  'Brabant': { userIds: [45061] },
  'Brumby': { userIds: [2743, 53147, 100782] },
  'Camargue': { userIds: [30403, 12669, 125690] },
  'Cleveland Bay': { userIds: [30403] },
  'Exmoor Pony': { userIds: [12669] },
  'Finnhorse': { userIds: [39129, 150678] },
  'Fjord': { userIds: [30403, 12669] },
  'Friesian': { userIds: [219647] },
  'Haflinger': { userIds: [12669] },
  'Icelandic': { userIds: [104991, 12669] },
  'Irish Cob': { userIds: [104787, 136244] },
  'Kladruber': { userIds: [125690] },
  'Knabstrupper': { userIds: [86694, 131121] },
  'Lusitano': { userIds: [49048, 53147, 115389] },
  'Mustang': { userIds: [30403] },
  'Namib': { userIds: [136244, 39129, 56657], new: true },
  'Noriker': { userIds: [38272, 20072, 18159] },
  'Norman Cob': { userIds: [12669, 125690] },
  'Oldenburg': { userIds: [18825, 12669] },
  'PRE': { userIds: [86694, 45061, 12669, 8740] },
  'Quarter Horse': { userIds: [38272] },
  'Shire': { userIds: [12669, 219647] },
  'Suffolk Punch': { userIds: [30403] },
  'Thoroughbred': { userIds: [70318, 30403, 45061, 12669, 38272, 66435, 219647, 90984] },
  'Trakehner': { userIds: [104991] },
  'Welsh Pony': { userIds: [12669] },
}

export const meta: MetaFunction = () => {
  return {
    title: 'Realvision Contributors',
    description: `Realvision has been helped out greatly by ${Object.keys(users).length} contributors and guide makers`,
  }
}

export default function Index() {
  return (
    <div>
      <div className='w-full'>
        <TitleBar backTo='/vision' backText='Back to Realvision' />
        <h1 className='text-4xl font-bold'>Realvision Contributors</h1>
        <p>Realvision has been helped out greatly by {Object.keys(users).length} contributors and guide makers.</p>
        {Object.keys(dataByBreed).map(breed => {
          const data = dataByBreed[breed]
          const userIds: number[] = data.userIds
          return (
            <div key={breed} id={breed}>
              <h1 className='text-2xl font-bold mt-4 flex'>
                <span className='mr-2'>{breed}</span>
                {data.new && (<New/>)}
              </h1>
              <p>
                {userIds.map((userId, index, array) => {
                  return (
                    <span key={String(userId)}>
                      <TextLink to={`https://v2.horsereality.com/user/${userId}`} newtab='true'>
                        {users[userId].name}
                      </TextLink>
                      {index < array.length - 1 && (', ')}
                    </span>
                  )
                })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
