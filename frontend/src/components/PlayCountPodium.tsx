import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import type { PlayCount } from "../data/GamesListContext";

interface PlayCountPodiumProps {
  topThree: PlayCount[];
}

const podiumSlots = [
  { rank: 2, className: "second" },
  { rank: 1, className: "first" },
  { rank: 3, className: "third" },
];

const cupTypeByRank: Record<number, "gold" | "silver" | "bronze"> = {
  1: "gold",
  2: "silver",
  3: "bronze",
};

function PlayCountPodium({ topThree }: PlayCountPodiumProps) {
  const podiumHeightScale = useMemo<(value: number) => number>(() => {
    if (!topThree.length) {
      return () => 200;
    }
    const counts = topThree.map((pc) => pc.count);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    if (max === min) {
      return () => 220;
    }
    const scale = scaleLinear().domain([min, max]).range([180, 260]);
    return (value: number) => scale(value);
  }, [topThree]);

  return (
    <section className="podium-section">
      <h2 className="section-heading">Most played</h2>
      <div className="podium">
        {podiumSlots.map(({ rank, className }) => {
          const playCount = topThree.find((_, index) => index === rank - 1);
          const stageHeight = podiumHeightScale(
            playCount ? playCount.count : 0
          );

          return (
            <div
              key={className}
              className={`podium-step ${className} ${
                playCount ? "active" : "empty"
              }`}
              style={{ height: `${stageHeight}px` }}
            >
              <div className="podium-platform">
                <div className="podium-rank">#{rank}</div>
                <div
                  className={`cup ${cupTypeByRank[rank]}`}
                  aria-hidden="true"
                >
                  {playCount ? playCount.count : "--"}
                </div>
                {playCount && (
                  <>
                    <div className="plays">{playCount.count} plays</div>
                    <div className="game-name">{playCount.game.name}</div>
                  </>
                )}
              </div>
              <div className="game-art">
                {playCount && (
                  <img
                    src={playCount.game.imageUrl}
                    alt={playCount.game.name}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PlayCountPodium;
