export type Innleggtype = {
  _type: "innlegg";
  tittel: string;
  innhold?: InnleggBlock[];
};

export type InnleggBlock =
  | TekstBlokk
  | BildeBlokk
  | VideoBlokk;

export type TekstBlokk = {
  _type: "tekstblokk";
  tekst?: string;
};

export type BildeBlokk = {
  _type: "bildeblokk";
  bilde?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: any;
  };
  alt?: string;
};

export type VideoBlokk = {
  _type: "videoblokk";
  url?: string;
};

export type QuizAnswer = {
  text: string;
  correct: boolean;
};

export type QuizQuestion = {
  question: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
  };
  answers: QuizAnswer[];
  order: number;
};

export type SurveyQuestionType = "single" | "multiple" | "scale";

export interface SurveyQuestionOption {
  text: string;
}

export interface SurveyQuestion {
  _id?: string;
  _type: "surveyQuestion";

  question: string;

  type: SurveyQuestionType;

  options?: SurveyQuestionOption[];

  required?: boolean;

  order: number;
}