
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { useEffect, useState } from "react";
type post = {
  title:String,
  body:String,
  id:number,
  image:string
}
const client = createClient({
      projectId: '539k4mm7',
      dataset: 'production',
      useCdn: true, // `false` if you want to ensure fresh data
      apiVersion: '2024-01-01',
    })
    const builder = imageUrlBuilder(client);
  
export function urlFor(source) {
  return builder.image(source);
}
export default function App() {
  const [posts, setPosts] = useState<post[]>([])

  useEffect(() => {
    


    const handlePosts = (async()=>{
    let post = await client.fetch(`*[_type == "Text"]{id,title,body,image}`)
    setPosts(post)
    })
    handlePosts()
  }, [])

  return(<div>
    hei
    {posts.map(post=>(<div key={post.id}><h1>{post.title}</h1><p>{post.body}</p>
     {post.image && (
      <img
        src={urlFor(post.image).width(500).url()}
        alt={post.title}
      />
    )}
    </div>))}
  </div>)
}
