CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.survey_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  submitted_at timestamp without time zone DEFAULT now(),
  CONSTRAINT survey_responses_pkey PRIMARY KEY (id)
);

CREATE TABLE public.survey_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL,
  question_id text NOT NULL,
  answer_value text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT survey_answers_pkey PRIMARY KEY (id),
  CONSTRAINT survey_answers_response_id_fkey
    FOREIGN KEY (response_id)
    REFERENCES public.survey_responses(id)
    ON DELETE CASCADE
);

-- Function: get_survey_stats
CREATE OR REPLACE FUNCTION public.get_survey_stats(qid text)
RETURNS TABLE (
  answer_value text,
  count bigint,
  total_responses bigint,
  percentage numeric
)
LANGUAGE sql
AS $$
  WITH total AS (
    SELECT COUNT(DISTINCT response_id) AS total_responses
    FROM survey_answers
    WHERE question_id = qid
  ),
  counts AS (
    SELECT answer_value, COUNT(*) AS count
    FROM survey_answers
    WHERE question_id = qid
    GROUP BY answer_value
  )
  SELECT
    c.answer_value,
    c.count,
    t.total_responses,
    ROUND(
      (c.count::decimal / NULLIF(t.total_responses, 0)) * 100,
      2
    ) AS percentage
  FROM counts c
  CROSS JOIN total t;
$$;

-- Trigger function: update_admin_users_updated_at
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger
CREATE TRIGGER trigger_update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_admin_users_updated_at();