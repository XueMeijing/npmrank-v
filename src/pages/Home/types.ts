export type RankingType =
  | ''
  | 'last-day'
  | 'last-week'
  | 'last-month'
  | 'last-year'
  | 'all-time'
  | '2015'
  | '2016';

export interface SelectRankingType {
  label: RankingType;
  value: RankingType;
}

export interface RankingPackage {
  rank?: number;
  id: string;
  npmUrl: string;
  githubUrl: string;
  homepageUrl: string;
  downloads: number;
  githubStar: string;
  version: string;
  updated: string;
  created: string;
}
