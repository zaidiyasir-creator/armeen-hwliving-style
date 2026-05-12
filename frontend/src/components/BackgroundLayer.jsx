import React from "react";

/**
 * Fixed cinematic background layer.
 * Renders the Shadow Grid architectural photograph as a darkened, parallax-style
 * full-viewport backdrop behind all content. Sections sit on top of this with
 * partial transparency so the image bleeds through subtly.
 */
const BackgroundLayer = () => (
    <div
        aria-hidden="true"
        data-testid="background-layer"
        style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            backgroundColor: "#050505",
            pointerEvents: "none",
        }}
    >
        <img
            src="/armeen/shadow-grid.png"
            alt=""
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                opacity: 0.65,
            }}
        />
        <div
            style={{
                position: "absolute",
                inset: 0,
                background:
                    "radial-gradient(ellipse at top, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.7) 55%, rgba(5,5,5,0.92) 100%)",
            }}
        />
    </div>
);

export default BackgroundLayer;
