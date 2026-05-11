import { useEffect } from "react";

export function useReveal() {
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 },
        );

        const observed = new WeakSet();
        const observeAll = () => {
            document.querySelectorAll(".reveal").forEach((el) => {
                if (!observed.has(el) && !el.classList.contains("in")) {
                    observed.add(el);
                    io.observe(el);
                }
            });
        };

        observeAll();

        // Watch the DOM for newly added .reveal elements (e.g. async-rendered cards)
        const mo = new MutationObserver(() => observeAll());
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, []);
}
