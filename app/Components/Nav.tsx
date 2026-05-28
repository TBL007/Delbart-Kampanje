"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Nav() {
    const { data: session, status } = useSession()
    const [burger, setBurger] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

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

    const handleToggle = () => {
        console.log("Toggle clicked, burger state:", burger)
        setBurger(prev => !prev)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault()
        console.log("Touch detected")
        handleToggle()
    }
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
            <div className="flex flex-row items-center mr-2 relative">
                <ul  className={`${burger ? "flex" : "hidden"} md:static md:flex md:relative flex-row justify-center text-lg sm:text-2xl bg-foreground md:bg-none md:text-3xl gap-4 items-center p-4 md:p-0 md:gap-6 w-full md:w-auto`}>
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

               <button 
                    ref={buttonRef}
                    onClick={handleToggle}
                    onTouchStart={handleTouchStart}
                    className={`${burger ? "bg-blue-200" : "bg-none"} p-2 cursor-pointer transition-colors md:hidden select-none relative z-50`}
                    aria-label="Toggle menu"
                    type="button"
                    style={{ touchAction: "manipulation" }}
                >
                    <img src={"/burger.png"} width={80} height={80} alt="menu" draggable={false} style={{ pointerEvents: "none", userSelect: "none" }} />
                </button>
            </div>
        </nav>
    )
}