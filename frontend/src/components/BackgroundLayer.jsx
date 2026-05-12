import React, { useEffect, useRef } from "react";

/**
 * Fixed cinematic background layer with subtle parallax drift.
 * The image slowly translates upward as the visitor scrolls — reinforcing
 * the architectural / "building upward" theme of the brand.
 */
const BackgroundLayer = () => {
    const imgRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY || 0;
                // Drift the image upward at ~8% of scroll speed (max ~60px on a long page)
                if (imgRef.current) {
                    const drift = Math.min(y * 0.08, 80);
                    imgRef.current.style.transform = `translate3d(0, ${-drift}px, 0) scale(1.06)`;
                }
                // Slightly intensify the dark overlay as user scrolls deeper for a "descending into depth" feel
                if (overlayRef.current) {
                    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
                    const ratio = Math.min(y / max, 1);
                    overlayRef.current.style.opacity = String(0.85 + ratio * 0.1);
                }
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            aria-hidden="true"
            data-testid="background-layer"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
                backgroundColor: "#050505",
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            <img
                ref={imgRef}
                src="/armeen/shadow-grid.png"
                alt=""
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    opacity: 0.7,
                    transform: "translate3d(0, 0, 0) scale(1.06)",
                    transition: "transform 80ms linear",
                    willChange: "transform",
                }}
            />
            <div
                ref={overlayRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at top, rgba(5,5,5,0.30) 0%, rgba(5,5,5,0.68) 55%, rgba(5,5,5,0.92) 100%)",
                    opacity: 0.85,
                    transition: "opacity 200ms ease-out",
                }}
            />
        </div>
    );
};

export default BackgroundLayer;
