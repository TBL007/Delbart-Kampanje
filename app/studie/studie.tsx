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
      <section className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#EF233C]/0 to-foreground/40 px-4 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-center">
          Du har allerede levert undersøkelsen
        </h1>

        <Link href={"/"} className="w-full mt-20 sm:mt-30 md:mt-50">
          <div className="flex flex-col items-center text-xl sm:text-2xl md:text-3xl bg-[#EF233C]/40 p-3 sm:p-4 w-full rounded">
            Hjem
          </div>
        </Link>
        <button onClick={()=> localStorage.removeItem("studie")} className="text-sm mt-4 hover:text-blue-300">clear</button>
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
    <section className="flex flex-col items-left min-h-screen px-4 sm:px-6 md:px-12 mt-20 gap-6 sm:gap-8 md:gap-10 pb-8">
      <form onSubmit={handleSubmit} className="w-full">
        {questions.map((question, ndx) => (
          <div
            key={ndx}
            className="border-b-2 border-foreground pb-4 mb-6"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
              {question.question}
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-30 text-lg sm:text-2xl md:text-4xl mt-4 sm:mt-6 md:mt-8">
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
                    className="peer-checked:text-blue-300 cursor-pointer"
                  >
                    {valg.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <section className="flex flex-col h-fit items-center gap-4">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-4 text-center">
            Ditt svar er helt anonymt
          </h1>

          <button
            type="submit"
            className="hover:drop-shadow hover:text-blue-300 text-base sm:text-lg md:text-xl lg:text-2xl bg-foreground rounded-lg p-3 sm:p-4 w-full sm:w-3/5"
          >
            Lever undersøkelsen
          </button>
        </section>
      </form>
    </section>
  )
}