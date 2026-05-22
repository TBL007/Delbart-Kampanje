"use client"
import { useEffect, useState } from "react"
import { SurveyQuestion } from "../types"
import { useRouter } from "next/navigation"
import Link from "next/link"






export default function Studie({ questions }: { questions: SurveyQuestion[] }) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState([])
    const question = questions[current]
    const [complete, setComplete] = useState(false)

    useEffect(() => {
        setComplete(JSON.parse(localStorage.getItem("studie") || '{"complete":false}').complete)
    }, [])

    const handleAnswer = (id: string, valg: string,) => {
        setAnswers(prev => [...prev, { questionid: id, value: valg }])
        setCurrent(prev => prev + 1)



    }

    function Complete() {
        return (
            <section className="flex flex-col items-center h-screen bg-gradient-to-b from-[#EF233C]/0 to-foreground/40">
                <h1 className="text-3xl"> Du har allerede levert undersøkelsen</h1>
                <Link href={"/"} className="w-full mt-50">
                    <div className="flex flex-col items-center text-3xl h-8 bg-[#EF233C]/40  h-fit p-2 w-full ">
                        Hjem
                    </div>
                </Link>
            </section>
        )
    }

    function Submit() {
        const router = useRouter()

        const handleSubmit = async () => {
            await fetch("/api/statistikk", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answers)
            })
            setAnswers([])
            localStorage.setItem("studie", '{"complete":true}')
            router.push("/")

        }
        return (
            <section className=" flex flex-col h-screen items-center">
                <h1 className="text-3xl mt-4">Du er ferdig</h1>
                <h1 className="text-3xl mt-4">Vennligst lever undersøkelsen</h1>
                <h1 className="text-3xl mt-4">Ditt svar er helt anonymt</h1>
                <button onClick={handleSubmit} className="hover:drop-shadow hover:text-blue-300 text-2xl bg-foreground rounded-lg p-2 mt-80 w-3/5">
                    <h1>Lever undersøkelsen</h1>
                </button>
            </section>
        )
    }
    if (complete) return <Complete />
    if (!questions.length) return <p>Loading...</p>
    if (current >= questions.length) return <Submit />
    return (
        <section className="flex flex-col items-left h-screen ml-12 mt-20">

            <h1 className="text-6xl">{question.question}</h1>

            <div className="flex flex-row gap-20 text-4xl mt-8 ml-12">
                {question.options.map((valg, ndx) => (
                    <button key={ndx} onClick={() => handleAnswer(question._id, valg.text)} className="hover:text-blue-300">
                        <p>{valg.text}</p>
                    </button>))}
            </div>
        </section>
    )
}
