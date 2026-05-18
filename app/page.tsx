
import { YouTubeEmbed } from '@next/third-parties/google'
import { client } from "../sanity/lib/client"
import { Innleggtype } from "./types"
import { urlFor } from './utils/sanity/image';

export default async function Page() {
  const innlegg = await client.fetch(`*[_type=="innlegg"]{tittel,innhold}`)

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
    <>
      <section className="flex flex-col items-center justify-center">
        <img className="h-full" src={"https://loremipsum.imgix.net/GTlzd4xkx4LmWsG1Kw1BB/ad1834111245e6ee1da4372f1eb5876c/placeholder.com-1280x720.png?w=1920&q=60&auto=format,compress"} />
        <h2 className="text-6xl absolute pb-80">
          Del ansvarlig. Del smart
        </h2>
      </section >
      <section className="flex flex-col items-center ">
        {innlegg.map((innlegg, ndx) => (
          <section key={ndx} className="flex flex-col w-4/5 items-center gap-8  ">
            <h2 className="text-6xl">{innlegg.tittel}</h2>
            {innlegg.innhold.map((item, ndx) => (
              <div key={ndx} className='w-2/5 h-fit  '>
                {itemType(item)}
              </div>
            ))}
          </section> 
        ))}
      </section>


    </>
  )
}