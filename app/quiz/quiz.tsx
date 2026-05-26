"use client"
import { useEffect, useState } from "react";
import { QuizQuestion } from "../types";
import { urlFor } from "../utils/sanity/image";
import Link from "next/link";

export default function Quiz({ questions }: { questions: QuizQuestion[], }) {
    const [current, setCurrent] = useState(0)
    const [end, setEnd] = useState(false)
    const [points, setPoints] = useState(0)

    const handleCorrect = (correct: boolean) => {
        if (correct) {
            setPoints(points + 1)
        }
        if (current + 1 >= questions.length) {
            setEnd(true)
        } else setCurrent(current + 1)
    }
    const handlerestart = () => {
        setCurrent(0)
        setEnd(false)
        setPoints(0)
    }
    const question = questions[current]
    if (end) return (
        <section className="flex flex-col h-screen items-center mt-2">
            <h1 className="text-5xl "> Quiz fullført</h1>
            <div className="flex flex-col items-center p-2  ">
                <h1 className="text-4xl ">Du klarte {points}/{questions.length}</h1>
                <button onClick={handlerestart} className="hover:drop-shadow hover:text-blue-300 text-2xl bg-foreground rounded-lg p-2 mt-80">Prøv på nytt</button>
                <Link href={"/"} className="hover:drop-shadow hover:text-blue-300 text-2xl bg-foreground rounded-lg p-2 mt-2">Hjem</Link>
            </div>
            
        </section>
    )
    return (
        <section className="h-screen flex flex-col items-center mt-2 ">
            <h1 className="text-4xl mb-4">{question.question}</h1>
            <img src={urlFor(question.image).url()} className="size-1/2 aspect-16/9" />
            <div className="flex  grid grid-cols-2 gap-4 mt-8 justify-between w-full">
                {question.answers.map((answer, ndx) => (
                    <button key={ndx} onClick={() => handleCorrect(answer.correct)} className=" hover:text-blue-300  hover:drop-shadow-xl ">
                        <h2 className="text-3xl">
                            {answer.text}
                        </h2>
                    </button>))}
            </div>
        </section>
    )
}