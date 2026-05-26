"use client"

import { useEffect, useState } from "react"
import { SurveyQuestion } from "../types"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Studie({
  questions,
}: {
  questions: SurveyQuestion[]
}) {
  const [answers, setAnswers] = useState<
    { questionId: string; value: string }[]
  >([])

  const [complete, setComplete] = useState(false)

  useEffect(() => {
    setComplete(
      JSON.parse(
        localStorage.getItem("studie") ||
          '{"complete":false}'
      ).complete
    )
  }, [])

  function Complete() {
    return (
      <section className="flex flex-col items-center h-screen bg-gradient-to-b from-[#EF233C]/0 to-foreground/40">
        <h1 className="text-3xl">
          Du har allerede levert undersøkelsen
        </h1>

        <Link href={"/"} className="w-full mt-50">
          <div className="flex flex-col items-center text-3xl bg-[#EF233C]/40 p-2 w-full">
            Hjem
          </div>
        </Link>
        <button onClick={()=> localStorage.removeItem("studie")}>clear</button>
      </section>
    )
  }

  const router = useRouter()

  function handleAnswer(
    questionId: string,
    value: string
  ) {
    setAnswers((prev) => {
      // remove old value for same question
      const filtered = prev.filter(
        (a) => a.questionId !== questionId
      )

      return [
        ...filtered,
        { questionId, value },
      ]
    })
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    await fetch("/api/statistikk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    })

    localStorage.setItem(
      "studie",
      '{"complete":true}'
    )

    router.push("/")
  }

  if (complete) return <Complete />
  if (!questions.length) return <p>Loading...</p>

  return (
    <section className="flex flex-col items-left h-screen ml-12 mt-20 gap-10">
      <form onSubmit={handleSubmit}>
        {questions.map((question, ndx) => (
          <div
            key={ndx}
            className="border-b-2 border-foreground pb-4"
          >
            <h1 className="text-6xl">
              {question.question}
            </h1>

            <div className="flex flex-row gap-30 text-4xl mt-8 ml-12">
              {question.options.map((valg, ndx) => (
                <div
                  key={ndx}
                  className="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    id={`${question._id}-${ndx}`}
                    name={question._id}
                    value={valg.text}
                    onChange={(e) =>
                      handleAnswer(
                        question._id,
                        e.target.value
                      )
                    }
                    className="hidden peer"
                  />

                  <label
                    htmlFor={`${question._id}-${ndx}`}
                    className="peer-checked:text-blue-300"
                  >
                    {valg.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <section className="flex flex-col h-screen items-center">
          <h1 className="text-3xl mt-4">
            Ditt svar er helt anonymt
          </h1>

          <button
            type="submit"
            className="hover:drop-shadow hover:text-blue-300 text-2xl bg-foreground rounded-lg p-2 mt-2 w-3/5"
          >
            Lever undersøkelsen
          </button>
        </section>
      </form>
    </section>
  )
}