"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Nav() {
    const { data: session, status } = useSession()
    const [burger, setBurger] = useState(false)
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)")
        setIsMobile(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
            if (!e.matches) setBurger(false)
        }

        mediaQuery.addEventListener("change", handler)
        return () => mediaQuery.removeEventListener("change", handler)
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
        <nav className="fixed flex w-full justify-between bg-foreground h-16 sm:h-20 z-50 border-b-1 border-black">
            <div className="items-center flex pl-1 sm:pl-2">
                <Link href={"/"}>
                    <img src={"/Politiet_logo_hvit.svg"} width={100} className="sm:w-[180px] w-[100px]" />
                </Link>
            </div>
            <div className="flex flex-row items-center mr-2  ">


                <button


                    className={` p-2 cursor-pointer transition-colors md:hidden select-none relative z-50`}
                    aria-label="Toggle menu"
                    type="button"
                    style={{ touchAction: "manipulation" }}
                    onClick={() => setBurger(!burger)}
                >
                    <img src={"/burger.png"} width={64} height={64} alt="menu" draggable={false} style={{ pointerEvents: "none", userSelect: "none" }} />
                </button>
            </div>
            <ul className={`${burger ? "translate-y-0 opacity-100" : "-translate-y-30 md:-translate-y-0 opacity-0 md:opacity-100"} -z-500 flex fixed w-dvw left-0 top-16 soft-in-out duration-3000   pl-2 pr-2 transition md:static  md:relative  flex-row justify-center text-lg sm:text-2xl  bg-foreground md:bg-none md:text-3xl gap-4 items-center   md:gap-6 md:w-auto`}>
                {allLinks.map((link, ndx) => (
                    <Link key={ndx} href={link.href} className="flex justify-center text-center w-full md:w-auto">
                        <h3 className="text-center hover:text-blue-300">{link.tekst}</h3>
                    </Link>
                ))}
                {status === "authenticated" && (
                    <button
                        onClick={() => signOut()}
                        className="text-red-500 hover:text-red-400 w-full md:w-auto"
                    >
                        Sign Out
                    </button>
                )}

            </ul>
        </nav>
    )
}