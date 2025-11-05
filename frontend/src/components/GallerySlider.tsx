import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import defaultImage from "../assets/home-header.gif";

const galleryImports = import.meta.glob("../assets/gallery/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function sortEntries(entries: [string, string][]) {
  return entries.sort((a, b) => {
    const nameA = a[0].toLowerCase();
    const nameB = b[0].toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

function GallerySlider() {
  const images = useMemo(() => {
    const sortedEntries = sortEntries(Object.entries(galleryImports));
    const sources = sortedEntries.map(([, value]) => value);
    return sources.length ? sources : [defaultImage];
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const imagesCount = images.length;
  const currentImage = images[currentIndex] ?? defaultImage;

  const goToIndex = useCallback(
    (index: number) => {
      if (!imagesCount) {
        return;
      }

      const normalizedIndex = (index + imagesCount) % imagesCount;
      setCurrentIndex(normalizedIndex);
    },
    [imagesCount]
  );

  const goToNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const goToPrevious = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(null);
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(event.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX === null || touchEndX === null) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 30;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }, [goToNext, goToPrevious, touchEndX, touchStartX]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
    },
    [goToNext, goToPrevious]
  );

  return (
    <div
      className="gallery-slider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Home gallery"
      tabIndex={0}
    >
      <img
        src={currentImage}
        alt={`Gallery slide ${currentIndex + 1} of ${imagesCount}`}
        className="gallery-slider__image"
      />

      {imagesCount > 1 && (
        <div className="gallery-slider__dots" role="tablist" aria-label="Select gallery slide">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`gallery-slider__dot${
                index === currentIndex ? " gallery-slider__dot--active" : ""
              }`}
              onClick={() => goToIndex(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GallerySlider;
