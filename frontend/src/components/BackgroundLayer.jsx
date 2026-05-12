import React, { useEffect, useRef } from "react";

/**
 * Fixed cinematic background layer.
 *  - Uses WebP (with PNG fallback via <picture>) for fast first paint.
 *  - Subtle scroll parallax drift (~8% of scroll, max 80px upward).
 *  - Subtle mouse-tilt (rotateY ±0.5°, rotateX ±0.3°) — like looking up at a real skyscraper.
 *  - Parallax + tilt are DISABLED on mobile / coarse pointers / reduced-motion users.
 */
const BackgroundLayer = () => {
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const stageRef = useRef(null);
    const stateRef = useRef({ scrollDrift: 0, tiltX: 0, tiltY: 0 });

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const enableMotion = !reduceMotion && !coarsePointer && !isMobile;

        let ticking = false;

        const applyTransform = () => {
            ticking = false;
            const { scrollDrift, tiltX, tiltY } = stateRef.current;
            if (imgRef.current) {
                imgRef.current.style.transform =
                    `translate3d(${tiltY}px, ${-scrollDrift + tiltX}px, 0) scale(1.08)`;
            }
            if (stageRef.current && enableMotion) {
                stageRef.current.style.transform =
                    `perspective(1200px) rotateX(${tiltX * 0.04}deg) rotateY(${tiltY * -0.04}deg)`;
            }
        };

        const queue = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(applyTransform);
        };

        const onScroll = () => {
            const y = window.scrollY || 0;
            stateRef.current.scrollDrift = enableMotion ? Math.min(y * 0.08, 80) : 0;
            if (overlayRef.current) {
                const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
                const ratio = Math.min(y / max, 1);
                overlayRef.current.style.opacity = String(0.85 + ratio * 0.1);
            }
            queue();
        };

        const onPointer = (e) => {
            if (!enableMotion) return;
            const w = window.innerWidth || 1;
            const h = window.innerHeight || 1;
            // -1 → 1
            const nx = (e.clientX / w) * 2 - 1;
            const ny = (e.clientY / h) * 2 - 1;
            // Translate the bg image opposite to mouse for a parallax look (max ~12px)
            stateRef.current.tiltY = nx * 12;
            stateRef.current.tiltX = ny * 8;
            queue();
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("mousemove", onPointer, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("mousemove", onPointer);
        };
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
            <div
                ref={stageRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    transformStyle: "preserve-3d",
                    transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                    willChange: "transform",
                }}
            >
                <picture>
                    <source srcSet="/armeen/shadow-grid.webp" type="image/webp" />
                    <img
                        ref={imgRef}
                        src="/armeen/shadow-grid.png"
                        alt=""
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center top",
                            opacity: 0.7,
                            transform: "translate3d(0, 0, 0) scale(1.08)",
                            transition: "transform 120ms cubic-bezier(0.22, 1, 0.36, 1)",
                            willChange: "transform",
                        }}
                    />
                </picture>
            </div>
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
