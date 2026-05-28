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
    
    <div className='flex flex-col h-fit min-h-screen items-center '>
      <h1 className='text-4xl mt-2 mb-4'>Studie</h1>
      <section className='flex felx-col grid grid-cols-1 md:grid-cols-2 gap-6'>

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
          <div key={question._id} style={{ marginBottom: 40 }} className='group bg-foreground p-2 rounded-lg hover:drop-shadow-lg'>
            <h2 className='text-2xl border-b-2 w-100 group-hover:border-blue-100'>
              {question.question} ({totalResponses})
            </h2>

            <ul className='text-xl'>
              {fullStats.map((row) => (
                <li key={row.option}>
                  {row.option}: {row.count} ({row.percentage.toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      </section>
    </div>
  )
}