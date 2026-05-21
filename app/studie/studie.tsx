"use client"
import { useState } from "react"
import { SurveyQuestion } from "../types"





export default function Studie({ questions }: { questions: SurveyQuestion[] }) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState([])
    const question = questions[current]

    const handleAnswer = (id:string, valg:string,) => {
        setAnswers(prev => [...prev, { questionid: id, value: valg }])
        setCurrent(prev=> prev+1)
        
    }
    function Submit() {


        const handleSubmit = async () => {
            await fetch("/api/statistikk", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answers)
            })

        }
        return (
            <section>
                <button onClick={handleSubmit}><h1>Lever undersøkelsen</h1></button>
                <button onClick={()=> console.log(answers)}>log</button>
            </section>
        )
    }
    if (!questions.length) return <p>Loading...</p>
    if (current >= questions.length) return <Submit />
    return (
        <section className="felx felx-col h-screen">
            <h1>{question.question}</h1>
            {question.options.map((valg, ndx) => (
                <button key={ndx} onClick={() => handleAnswer(question._id, valg.text)} className="hover:text-blue-300">
                    <p>{valg.text}</p>
                </button>))}
        </section>
    )
}