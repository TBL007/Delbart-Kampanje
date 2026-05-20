"use client"
import { useEffect, useState } from "react";
import { QuizQuestion } from "../types";
import { urlFor } from "../utils/sanity/image";

export default function Quiz({ questions }: { questions: QuizQuestion[], }) {
    const [current, setCurrent] = useState(0)
    const [end, setEnd] = useState(false)
    const [points, setPoints] = useState(0)

    const handleCorrect = (correct: boolean) => {
        if (correct) {
            setPoints(points+1)
        }
        if (current + 1 >= questions.length) {
            setEnd(true)
        } else setCurrent(current+1) 
    }
    const handlerestart = () => {
        setCurrent(0)
        setEnd(false)
        setPoints(0)
    }
    const question = questions[current]
    if (end) return (
        <section className="flex flex-col h-screen">
            <h1> Quiz ferdig</h1>
            <h1> du klarte {points}/{questions.length}</h1>
            <button onClick={handlerestart}> prøv på nytt</button>
        </section>
    )
    return (
        <section className="h-screen flex flex-col items-center ">
            <h1 className="text-4xl">{question.question}</h1>
            <img src={urlFor(question.image).url()} className="size-1/2 aspect-16/9"/>
            <div className="flex  grid-cols-2 gap-2">
                {question.answers.map((answer, ndx) => (
                    <button key={ndx} onClick={() => handleCorrect(answer.correct)} className="grid-cols-subgrid">
                        <h2 className="text-3xl">
                            {answer.text}
                        </h2>
                    </button>))}
            </div>
        </section>
    )
}