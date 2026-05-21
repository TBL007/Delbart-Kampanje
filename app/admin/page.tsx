import Link from "next/link";
import { requireAdmin } from "../utils/admin";
import { auth } from "../../auth";

export default async function AdminPage() {
  // Verify admin access
  await requireAdmin();
  
  const session = await auth();
  const cards = [{
    href:"/admin/users",
    title: "Bruker Administrasjon",
    desc: "Administrer admin brukere og tilgangen deres"
  },
  {
    href:"/admin/studie",
    title:"Statistikk",
    desc:"Se statistikk fra studie"
  },
  {
    href:"/admin/studio/structure",
    title:"Sanity",
    desc:"Administrer innholdet på siden"

  }

]
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className=" mb-8">Welcome, {session?.user?.email}</p>

        {/* Navigation Cards */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
          {cards.map((card,ndx)=>(
          <Link href={card.href} key={ndx}>
            <div className="group bg-foreground rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer hover:drop-shadow-xl ">
              <h2 className="text-2xl font-semibold mb-2 border-b-2 group-hover:text-blue-300">{card.title}</h2>
              <p className="">
                {card.desc}
              </p>
            </div>
          </Link>
          ))}

          
         
        </div>
      </div>
    </div>
  );
}