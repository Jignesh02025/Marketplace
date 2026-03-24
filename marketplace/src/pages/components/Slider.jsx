import { useEffect, useState } from "react";
import "./Slider.css";

const images = [
    "https://picsum.photos/1200/400?random=1",
    "https://picsum.photos/1200/400?random=2",
    "https://picsum.photos/1200/400?random=3",
    "https://picsum.photos/1200/400?random=4",
];

export default function Slider() {
    const [index, setIndex] = useState(0);

    // 🔄 Auto Slide
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 3 sec

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider">
            <img src={images[index]} alt="slider" />
        </div>
    );
}