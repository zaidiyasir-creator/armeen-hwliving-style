import React from "react";

/**
 * Armeen HW Enterprise brand mark.
 * Always pass a height utility (e.g. h-10, h-12, h-14) via the `className` prop —
 * width is auto-derived from the source aspect ratio.
 */
const Logo = ({ className = "h-12", testId = "logo" }) => {
    return (
        <picture data-testid={testId}>
            <source srcSet="/armeen/logo.webp" type="image/webp" />
            <img
                src="/armeen/logo.png"
                alt="Armeen HW Enterprise · NS0146183-A"
                draggable="false"
                className={`${className} w-auto select-none object-contain`}
            />
        </picture>
    );
};

export default Logo;
