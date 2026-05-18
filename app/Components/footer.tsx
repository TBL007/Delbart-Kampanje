"use client"
import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex w-full h-20 bg-foreground items-center justify-between pl-1 pr-1">

            <button onClick={() => window.scrollTo({ top: 0 })}>
                <img src={"/Politiet_logo_hvit.svg"} width={180} />
            </button>
            <Link href={"https://www.politiet.no/kontakt-politiet"}>
                <h1 className="text-5xl">
                    Kontakt Politet
                </h1>
            </Link>
        </div>
    )
}