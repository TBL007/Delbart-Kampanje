import Quiz from "./quiz"
import { QuizQuestion } from "../types"

import { client } from "../../sanity/lib/client"



export default async function Quiz_Page() {
    
    const questions = await client.fetch<QuizQuestion[]>(`*[_type == "quizQuestion"]`)
    
    if (questions === null) return (<h1> Loading ....</h1>)
    return (

        <Quiz questions={questions.sort((a,b)=> b.order - a.order)} />

    )
    
}
