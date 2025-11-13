export type CascadiaPlayerScoreBreakdown = {
  animals: Record<string, number>;
  habitats: Record<string, number>;
  landscape: number;
  pinecone: number;
  total: number;
};

export type CascadiaScoreDetailData = {
  aurore: CascadiaPlayerScoreBreakdown;
  thomas: CascadiaPlayerScoreBreakdown;
};

export type WingspanPlayerScoreBreakdown = {
  birds: number;
  bonusCards: number;
  roundObjectives: number;
  eggs: number;
  storedFood: number;
  coveredCards: number;
  total: number;
};

export type WingspanScoreDetailData = {
  aurore: WingspanPlayerScoreBreakdown;
  thomas: WingspanPlayerScoreBreakdown;
};

export type Player = "aurore" | "thomas";
