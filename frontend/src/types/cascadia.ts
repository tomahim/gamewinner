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
