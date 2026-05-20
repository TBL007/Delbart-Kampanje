import { SurveyQuestion} from "../types"
import { client } from "../../sanity/lib/client"
import Studie from "./studie"



    
    
export default async function Forms(){
    const questions = await client.fetch<SurveyQuestion[]>(`*[_type == "surveyQuestion"]`)
    let current = 0
    return (
        <Studie questions={questions.sort((a,b)=>a.order - b.order)} />
    )
}