import React from 'react'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'

// @ts-ignore
import _ from '~/common/strings'
// @ts-ignore
import TitleBar from '~/common/title'
// @ts-ignore
import { TextLink } from '~/common/links'
// @ts-ignore
import { Entries } from '~/common/entries'

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  return { opened: url.searchParams.get('o') }
}

export default function FAQ() {
  const loaderData = useLoaderData()

  return (
    <div>
      <div className='w-full'>
        <TitleBar backTo='/vision' backText='Back to Realvision' />
        <h1 className='text-5xl font-extrabold'>{_('ui_faq_realvision')}</h1>
        <Entries
          opened={loaderData.opened}
          entries={[
            {
              id: 'base-color-selections',
              title: 'What are the base color selection boxes for? Do I need to use them?',
              content: <p>
                Ever noticed how heavily diluted colors on different bases tend to look the same?
                This is usually because they are. As demonstrated by these two gray (homozygous cream) Lusitano mares,
                {' '} <TextLink to='https://www.horsereality.com/horses/4558345/'>4558345</TextLink> and
                {' '} <TextLink to='https://www.horsereality.com/horses/2779175/'>2779175</TextLink>,
                both horses are using the exact same images (body layer 5d3ac4fc1) for two different colors. 
                <br/><br/>
                To avoid making new art or uploading duplicate images with different names,
                Horse Reality simply uses the same images for colors where the horse is so diluted,
                you wouldn't even be able to tell the difference anyway.
                However, this presents some challenges when trying to automatically name a color solely through its art.
                Realvision cannot tell the difference between a gray smoky cream or a gray perlino or cremello horse
                because it relies completely on the images used on the page, and never scans in-game gene tests.
                <br/><br/>
                Say you knew your horse was black-based and wanted the correct
                color name to appear on your prediction. You would use the base
                color selection boxes to choose <strong>E/e</strong>
                {' '} and <strong>a/a</strong>, making Realvision
                use the base appropriate name for that color: Gray on Smoky Cream.
                As a quick how-to, <strong>E_ aa</strong> is black-based,
                {' '} <strong>E_ A_</strong> is bay-based, and
                {' '} <strong>ee __</strong> is chestnut-based, where
                {' '} <strong>_</strong> is any allele.
                <br/><br/>
                <u>Please note that these selections are only taken into account
                when the tool finds duplicate entries for the same foal layers.</u>
                {' '} Meaning most predictions with few or no dilutes will be
                predicted the same way as they would if you hadn't selected a
                base color - so no, in most cases, you do not need to use them.
                But feel free to go ahead and specify base color just in case
                you find a duplicate; it is up to you.
              </p>,
            },
            {
              id: 'white-pattern-selections',
              title: 'What are the white pattern selection boxes for? Do I need to use them?',
              content: <p>
                To preface this section, all white pattern selections are
                overridden if the tool can successfully find and match your
                foal's white layer. This is because we want to show you the
                accurate prediction as frequently as possible.
                <br/><br/>
                The white pattern selections are there for two situations:
                your foal has no white layers OR your foal has white layers,
                but they are disappearing in the prediction (untracked layers).
                If your foal has no white layers, but has roan, the "Roan" box
                must be used to show roan on your prediction. If your foal has
                no white layers, but has two rabicano parents, the "Rabicano"
                box must be used to show rabicano on your prediction. {' '}
                <span className='font-bold'>Due to the many questions asked
                about how rabicano works in RV, we have prepared {' '}
                <TextLink to='/vision/faq?o=rabicano#rabicano' newtab='true'>another FAQ section</TextLink> for it.</span>
                <br/><br/>
                In both situations, there is no possible way for us to check
                that it is "correct" that roan and rabicano should be added to
                the image. If Realvision does not detect or cannot match a
                white layer, it is free rein as far as addable white patterns
                go. For both roan and rabicano, the image
                applied will be the same per breed and per gender.
                <br/><br/>
                Here is how we designed these boxes to be used for different purposes using some examples:
                <ol className='list-disc ml-4'>
                  <li>A foal has rabicano, but it is not showing in the prediction because the layer has not been added to the database OR the foal has no white layers. Instead, you can add rabicano using the "Rabicano" box to see how the horse will or could look if it had rabicano. One of several variants will be applied if the foal is an Arabian, Finnhorse, Akhal-Teke, or Thoroughbred (usually the loudest variant). Other breeds with rabicano have no levels of expression.</li>
                  <li>A foal has roan, but it is not showing in the prediction because the layer has not been added to the database OR the foal has no white layers. Instead, you can add roan using the "Roan'' box to see how the horse will or could look if it had roan.</li>
                </ol>
              </p>,
            },
            {
              id: 'missing-data',
              title: '"Some or all of this foal\'s layers are not able to be predicted / No data is available for this horse, sorry" - what does this mean?',
              content: <p>
                <h2 className='text-lg font-bold'>"Some or all of this foal's layers are not able to be predicted right now"</h2>
                The foal color layers have been entered in the database but may
                not have corresponding adult layers, OR corresponding layers for
                your horse's gender. That is, we have confirmed that foal layer
                "J" grows into mare layer "K", but have no entries for what
                stallion layer it grows into.
                <br/><br/>
                <h2 className='text-lg font-bold'>"No data is available for this horse, sorry"</h2>
                The foal's color layers are not in the database at all. Pretty
                straightforward, eh?
              </p>,
            },
            {
              id: 'no-whites',
              title: 'My foal was predicted, but without its white markings and/or patterns!',
              content: <p>
                Three things could be happening:
                <ol className='list-decimal ml-4'>
                  <li>
                    If its only white pattern is roan and/or rabicano without any white layers as a foal,
                    read <TextLink to='?o=white-pattern-selections#white-pattern-selections' newtab='true'>this section</TextLink>.
                  </li>
                  <li>
                    The white layer is not in the database or has not been
                    matched to equivalent layers for a mare or stallion.
                    Realvision has no white layer images to give you, so it
                    returns just the base color.
                  </li>
                  <li>
                    The white patterns you selected do not exist in the breed. {' '}
                    <span className='font-bold'>
                      Read {' '}
                      <TextLink to='?o=white-pattern-selections#white-pattern-selections' newtab='true'>this section</TextLink>{' '}
                      of the FAQ to see when the white pattern selection boxes
                      are actually used.
                    </span>
                  </li>
                </ol>
              </p>,
            },
            {
              id: 'rabicano',
              title: 'Does rabicano show up in Realvision? When? Where? Why? Who? What?',
              content: <p>
                Short answer: yes.
                <br/><br/>
                Long answer: It depends on your foal and/or breed. We will try
                to simplify this as much as possible, as many users have gotten
                very confused about this system, even though it is fundamentally
                no different from showing any other white patterns. As each foal
                layer is linked to a specific
                adult layer, we are able to see that a unique foal white layer will
                lead to the rabicano pattern in adulthood.
                <br/><br/>
                A good way to look at rabicano and roan predictions is that, like
                any other white pattern or marking, they require an existing white
                layer on the foal to function. Unfortunately, the only
                workarounds for this problem are too unreliable or are not worth the
                development time solely to avoid manual user input.
                <br/><br/>
                <span className='font-bold'>
                  There is no way to know if your foal is rabicano if
                  they have no white layers and have not been produced from a
                  rabicano x rabicano. 
                </span>
              </p>
            },
            {
              id: 'plus-minus',
              title: 'My foal\'s color and genotype both have a ± symbol in them. What does this mean?',
              content: <p>
                This is a plus-minus sign, meaning "with or without" in this
                context. You will see this symbol when your foal's layers
                are shared with a slightly different genotype, but with the same
                phenotypical result.
                <br/><br/>
                Some instances that you will see this symbol include: certain
                QH white patterns (some W10 layers and OLW layers can be used
                for a horse with or without SW1 or other genes), a certain
                bugged Mustang color (bay champagne with or without cream),
                and CR/CR Brumbies that may or may not have silver.
                <br/><br/>
                The presence of a ± symbol does not mean that the image result is inaccurate.
              </p>
            },
            {
              id: 'data-credits',
              title: 'Data credits? What do these mean? Who are these people?!',
              content: <p>
                OK, this is not a frequently asked question, but we decided to
                include it in the FAQ anyway to pay homage to all of the wonderful
                people who have volunteered to help us.
                <br/><br/>
                There are more than 9,000 individual art layers in this game.
                Understandably, it has taken a lot of time to find them all.
                We started Realvision in August of 2021 and are still working
                on it today. Everyone who has created breed color guides or
                helped collect layers is credited on the site. We couldn't have
                tackled this huge project without your help - thank you.
                <br/><br/>
                We would like to give special thanks to Jessa, who came up with
                this idea in the first place and jump-started the entire process,
                and Foam, who greatly contributed to the layer collections of most breeds.
              </p>
            },
            {
              id: 'layer-urls',
              title: 'How do I get a foal\'s layer URLs?',
              content: <div>
                <p>
                  Heads up! This walkthrough is only for users that are
                  able to use inspect element on Horse Reality pages.
                  This usually does not include mobile browsers.
                  If you're on a desktop though, here's what you do:
                </p>
                <ol className='list-decimal ml-4'>
                  <li>Go to any foal page (like <span className='font-bold'>https://www.horsereality.com/horses/1/</span>)</li>
                  <li>Press F12 on your keyboard, or right click the foal and select "Inspect"</li>
                  <li>Find the <code>img</code> blocks that say <code>class="foal"</code> on them</li>
                  <li>Copy each URL (the part after <code>src</code> and in quotes) into a box on Realvision</li>
                  <li>Realvision will show the body part of each layer (like "Body" or "Body Whites") if you've copied it correctly</li>
                </ol>
                <img
                  className='my-4 mx-auto rounded'
                  src='/static/faq/realvision-layer-urls.png'
                />
                <p>You should also check out <TextLink to='/extension'>our browser extension</TextLink>, which does all this for you.</p>
              </div>
            }
          ]}
        />
      </div>
    </div>
  )
}
  