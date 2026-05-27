"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Nav() {
    const { data: session, status } = useSession()
    const [burger, setBurger] = useState(false)

    useEffect(() => {
        setBurger(window.matchMedia("(min-width: 768px)").matches)
    }, [])
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
        <nav className="fixed flex w-full justify-between bg-foreground h-16 sm:h-20 z-50">
            <div className="items-center flex pl-1 sm:pl-2">
                <Link href={"/"}>
                    <img src={"/Politiet_logo_hvit.svg"} width={100} className="sm:w-[180px] w-[100px]" />
                </Link>
            </div>
            <div className="flex flex-row items-center mr-2 ">
                
                    <ul className={`${burger? "" : ""} flex flex-row justify-center md:flex-row text-lg sm:text-2xl md:text-3xl gap-4 items-center p-4 md:p-0`}>
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
                    
            
                <button type="button" onClick={() => setBurger(!burger)} className="md:hidden w-auto shrink-0 z-20">
                    <img src={"/burger.png"} width={40} height={40} className="w-[60px] h-[60px] shrink-0" />
                </button>
            </div>
        </nav>
    )
}