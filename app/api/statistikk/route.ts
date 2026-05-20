

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SurveyAnswer = {
  questionid: string
  value: string | string[] | number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const answers: SurveyAnswer[] = body ?? []
    console.log(answers)
    if (!answers.length) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      )
    }

    // 1. Create survey response
    const { data: response, error: responseError } = await supabase
      .from('survey_responses')
      .insert({})
      .select()
      .single()

    if (responseError) {
      throw responseError
    }

    // 2. Flatten answers
    const rows = answers.flatMap((answer) => {
      // Multiple choice
      if (Array.isArray(answer.value)) {
        return answer.value.map((v) => ({
          response_id: response.id,
          question_id: answer.questionid,
          answer_value: String(v),
        }))
      }

      // Single + scale
      return [
        {
          response_id: response.id,
          question_id: answer.questionid,
          answer_value: String(answer.value),
        },
      ]
    })

    // 3. Insert all answers
    const { error: answersError } = await supabase
      .from('survey_answers')
      .insert(rows)

    if (answersError) {
      throw answersError
    }

    return NextResponse.json({
      success: true,
      responseId: response.id,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}