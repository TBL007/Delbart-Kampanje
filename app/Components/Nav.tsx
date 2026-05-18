"use client"
import { navigate } from "next/dist/client/components/segment-cache/navigation"
import Link from "next/link"
import { useState } from "react"



export default function Nav() {
    const links = [
        {
            href: "/",
            tekst: "Home"
        },
        {
            href: "/quiz",
            tekst: "Quiz"
        },
        {
            href: "/undersøkelse",
            tekst: "Undersøkelse"
        }
    ]
    const [burger, setBurger] =useState(false)
    return (
        <nav className="fixed flex w-full justify-between bg-foreground h-20 overflow-x-hidden z-2000">
            <div className="items-center flex pl-1">
                <Link href={"/"}>
                    <img src={"/Politiet_logo_hvit.svg"} width={180} />
                </Link>
            </div>
            <div className="flex flex-row items-center mr-2 ">
                <ul className={`${burger ? "opacity-100 translate-x-0" : "opacity-0 translate-x-130"} flex flex-row text-3xl gap-4 items-center mr-4 transform transition duration-1000 ease-out`}>
                    {links.map((link, ndx) => (<Link key={ndx} href={link.href} className="flex justify-center text-center"><h3 className="text-center">{link.tekst}</h3></Link>))}
                </ul>
                <button  onClick={()=>setBurger(!burger) }>
                    <img src={"/burger.png"} width={60} />
                </button>
            </div>
        </nav>
    )
}