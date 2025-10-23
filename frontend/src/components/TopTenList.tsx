import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import type { PlayCount } from "../data/GamesListContext";

interface TopTenListProps {
  title: string;
  items: PlayCount[];
  startingRank?: number;
  countRange?: {
    min: number;
    max: number;
  };
}

function TopTenList({
  title,
  items,
  startingRank = 1,
  countRange,
}: TopTenListProps) {
  const listBarScale = useMemo<(value: number) => number>(() => {
    if (!items.length) {
      return () => 50;
    }

    if (countRange) {
      const { min, max } = countRange;
      if (max === min) {
        return () => 80;
      }
      const scale = scaleLinear().domain([min, max]).range([25, 100]);
      return (value: number) => scale(value);
    }

    const counts = items.map((pc) => pc.count);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    if (max === min) {
      return () => 80;
    }
    const scale = scaleLinear().domain([min, max]).range([25, 100]);
    return (value: number) => scale(value);
  }, [items, countRange]);

  return (
    <section className="top-ten">
      <h3 className="section-heading" tabIndex={-1}>
        {title}
      </h3>
      <ul className="top-ten-list">
        {items.map((playCount, index) => {
          const absoluteRank = startingRank + index;
          const barWidth = listBarScale(playCount.count);
          return (
            <li key={playCount.game.id} className="top-ten-item">
              <span className="list-rank">#{absoluteRank}</span>
              <div className="list-thumb">
                <img
                  src={playCount.game.imageUrl}
                  alt={playCount.game.name}
                  loading="lazy"
                />
              </div>
              <div className="list-details">
                <span className="list-name">{playCount.game.name}</span>
                <div className="list-progress">
                  <div
                    className="list-progress-fill"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="list-count">{playCount.count}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TopTenList;
