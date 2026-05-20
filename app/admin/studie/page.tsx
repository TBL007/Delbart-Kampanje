import { createClient } from '../../utils/supabase/server'
import { cookies } from 'next/headers'
import { client } from '../../../sanity/lib/client'

export default async function Page() {
  const questions = await client.fetch(`*[_type == "surveyQuestion"]`)

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // fetch stats for ALL questions in parallel
  const statsResults = await Promise.all(
    questions.map(async (q) => {
      const { data: stats } = await supabase.rpc('get_survey_stats', {
        qid: q._id,
      })

      return {
        question: q,
        stats: stats ?? [],
      }
    })
  )

  return (
    <div className='flex flex-col h-screen'>
      <h1>Admin</h1>

      {statsResults.map(({ question, stats }) => {
        const totalResponses = stats.reduce(
          (sum, s) => sum + Number(s.count),
          0
        )

        const statsMap = Object.fromEntries(
          stats.map((s) => [s.answer_value, s])
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
          <div key={question._id} style={{ marginBottom: 40 }}>
            <h2>
              {question.question} ({totalResponses})
            </h2>

            <ul>
              {fullStats.map((row) => (
                <li key={row.option}>
                  {row.option}: {row.count} ({row.percentage.toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}