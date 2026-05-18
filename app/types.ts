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