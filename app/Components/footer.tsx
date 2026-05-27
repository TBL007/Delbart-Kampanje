"use client"
import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex flex-col sm:flex-row w-full h-auto sm:h-20 bg-foreground items-center justify-between pl-2 pr-2 py-4 sm:py-0 gap-4 sm:gap-0">

            <button onClick={() => window.scrollTo({ top: 0 })}>
                <img src={"/Politiet_logo_hvit.svg"} width={100} className="sm:w-[180px] w-[100px]" />
            </button>
            <Link href={"https://www.politiet.no/kontakt-politiet"}>
                <h1 className="text-xl sm:text-3xl md:text-5xl hover:text-blue-300 text-center">
                    Kontakt Politet
                </h1>
            </Link>
        </div>
    )
}