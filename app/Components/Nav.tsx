"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Nav() {
    const { data: session, status } = useSession()
    const [burger, setBurger] = useState(true)

    const publicLinks = [
        {
            href: "/",
            tekst: "Home"
        },
        {
            href: "/quiz",
            tekst: "Quiz"
        },
        {
            href: "/studie",
            tekst: "Undersøkelse"
        }
    ]

    const adminLinks = [
        {
            href: "/admin",
            tekst: "Dashboard"
        }
    ]

    const allLinks = publicLinks.concat(
        status === "authenticated" ? adminLinks : []
    )

    return (
        <nav className="fixed flex w-full justify-between bg-foreground h-20 overflow-x-hidden z-2000">
            <div className="items-center flex pl-1">
                <Link href={"/"}>
                    <img src={"/Politiet_logo_hvit.svg"} width={180} />
                </Link>
            </div>
            <div className="flex flex-row items-center mr-2 ">
                <ul className={`${burger ? "opacity-100 translate-x-0" : "opacity-0 translate-x-200"} flex flex-row text-3xl gap-4 items-center mr-4 transform transition duration-1000 ease-out`}>
                    {allLinks.map((link, ndx) => (
                        <Link key={ndx} href={link.href} className="flex justify-center text-center">
                            <h3 className="text-center hover:text-blue-300">{link.tekst}</h3>
                        </Link>
                    ))}
                    {status === "authenticated" && (
                        <button
                            onClick={() => signOut()}
                            className="text-red-500 hover:text-red-400"
                        >
                            Sign Out
                        </button>
                    )}
                    
                </ul>
                <button onClick={() => setBurger(!burger)} className="">
                    <img src={"/burger.png"} width={60} />
                </button>
            </div>
        </nav>
    )
}