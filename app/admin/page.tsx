import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'
import { client } from '../../sanity/lib/client'

export default async function Page() {
  const questions = await client.fetch(`*[_type == "surveyQuestion"]`)

  const question = questions[0] 

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: stats, error } = await supabase.rpc('get_survey_stats', {
    qid: question._id,
  })

  if (error) {
    console.log(error)
  }

  const safeStats = stats ?? []

  const totalResponses =
    safeStats.length > 0
      ? safeStats.reduce((sum, s) => sum + Number(s.count), 0)
      : 0

  const statsMap = Object.fromEntries(
    safeStats.map((s) => [s.answer_value, s])
  )

  const fullStats = (question.options ?? []).map((opt) => {
    const label = opt.text
    const data = statsMap[label]

    return {
      option: label,
      count: data?.count ?? 0,
      percentage: totalResponses
        ? ((data?.count ?? 0) / totalResponses) * 100
        : 0,
    }
  })

  return (
    <ul>
      <h1>Admin</h1>

      {fullStats.map((row) => (
        <li key={row.option}>
          {row.option}: {row.count} ({row.percentage.toFixed(1)}%)
        </li>
      ))}
    </ul>
  )
}