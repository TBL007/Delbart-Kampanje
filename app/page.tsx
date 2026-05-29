
import { YouTubeEmbed } from '@next/third-parties/google'
import { client } from "../sanity/lib/client"
import { Innleggtype } from "./types"
import { urlFor } from './utils/sanity/image';
import Link from 'next/link';

export default async function Page() {
  const innlegg = await client.fetch<Innleggtype[]>(`*[_type=="innlegg"]{tittel,innhold}`)

  function getYouTubeID(url: string) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

   

  const itemType = (item: any) => {
    if (item._type === "tekstblokk") {
      return (
        <p className='text-xl'>{item.tekst}</p>
      )
    }
    if (item._type === "bildeblokk") {
      return (

        <img src={urlFor(item.bilde).url()} />

      )
    }
    if (item._type === "videoblokk") {
      return (

        <YouTubeEmbed
          videoid={getYouTubeID(item.url)}
          height={400}
          params="controls=1"

        />
      )
    }
  }


  return (
    <span className='w-dvw overflow-x-hidden '>
      <section className="flex flex-col items-center justify-center   ">
        <img className="aspect-16/9 w-full" src={"/splash.avif"} />
        <div className='absolute flex flex-col mb-10 h-fit items-center justify-start px-4'>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">
          Del ansvarlig. Del smart
        </h2>
        <Link href={"/studie"} className='items-center text-blue-300 hover:text-blue-400'>
          <h2 className="text-sm sm:text-base md:text-xl ">
            Delta i undersøkelsen vår
          </h2>
        </Link>
        </div>

      </section >
      <section className="flex flex-col items-left w-full mt-10 mb-10">
        {innlegg.map((innlegg, ndx) => (
          <section key={ndx} className="flex flex-col w-full items-left gap-4 sm:gap-8 px-4 sm:px-6 md:px-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl">{innlegg.tittel}</h2>
            {innlegg.innhold.map((item, ndx) => (
              <div key={ndx} className='w-full sm:w-4/5 md:w-3/5 h-fit  '>
                {itemType(item)}
              </div>
            ))}
          </section>
        ))}
      </section>


    </span>
  )
}