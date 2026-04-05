import { useEffect, useState, useCallback, useRef } from "react";
import "./Slider.css";

const images = [
  "https://picsum.photos/1200/400?random=1",
  "https://picsum.photos/1200/400?random=2",
  "https://picsum.photos/1200/400?random=3",
  "https://picsum.photos/1200/400?random=4",
];

export default function Slider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const total = images.length;

  const startAutoSlide = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);
  }, [total]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [startAutoSlide]);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIndex(((i % total) + total) % total);
    startAutoSlide();
  };

  return (
    <div className="slider">
      <img src={images[index]} alt={`Slide ${index + 1}`} key={index} />

      {/* Dots */}
      <div className="slider-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}