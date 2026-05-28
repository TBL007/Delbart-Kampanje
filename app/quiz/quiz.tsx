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
        <section className="flex flex-col min-h-screen items-center mt-2 px-4 py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center"> Quiz fullført</h1>
            <div className="flex flex-col items-center p-4 gap-4 mt-20 sm:mt-40">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">Du klarte {points}/{questions.length}</h1>
                <button onClick={handlerestart} className="hover:drop-shadow hover:text-blue-300 text-base sm:text-lg md:text-xl lg:text-2xl bg-foreground rounded-lg p-3 sm:p-4 w-full sm:w-auto">Prøv på nytt</button>
                <Link href={"/"} className="hover:drop-shadow hover:text-blue-300 text-base sm:text-lg md:text-xl lg:text-2xl bg-foreground rounded-lg p-3 sm:p-4 w-full sm:w-auto text-center">Hjem</Link>
            </div>
            
        </section>
    )
    return (
        <section className="min-h-screen flex flex-col items-center mt-2 px-4 py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 text-center">{question.question}</h1>
            {question.image? <img src={urlFor(question.image).url()} className="w-full sm:w-4/5 md:w-3/5 lg:w-1/2 aspect-16/9" />: "" }
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-6 sm:mt-8 w-full px-2 sm:px-4">
                {question.answers.map((answer, ndx) => (
                    <button key={ndx} onClick={() => handleCorrect(answer.correct)} className=" hover:text-blue-300 hover:drop-shadow-xl p-2 sm:p-3 rounded ">
                        <h2 className="text-sm sm:text-base md:text-xl lg:text-3xl">
                            {answer.text}
                        </h2>
                    </button>))}
            </div>
        </section>
    )
   
}