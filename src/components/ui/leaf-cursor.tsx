"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LeafCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(false);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

    useEffect(() => {
        // Only enable on desktop to avoid interference with touch devices
        const checkDesktop = () => {
            setIsDesktop(window.matchMedia("(min-width: 1024px) and (hover: hover)").matches);
        };

        checkDesktop();
        window.addEventListener("resize", checkDesktop);

        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleClick = (e: MouseEvent) => {
            const id = Date.now();
            setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

            // Remove burst after animation
            setTimeout(() => {
                setClicks((prev) => prev.filter((click) => click.id !== id));
            }, 1000);
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("click", handleClick);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <>
            {/* Neon Glow Cursor Follower */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                animate={{
                    x: mousePosition.x - 20, // Center the 40px glow
                    y: mousePosition.y - 20,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150, // Softer spring for a floaty feel
                    damping: 15,
                    mass: 0.1
                }}
                style={{ width: "40px", height: "40px" }}
            >
                <div className="w-full h-full rounded-full bg-primary/80 blur-lg" />
            </motion.div>

            {/* Click Burst Animation */}
            <AnimatePresence>
                {clicks.map((click) => (
                    <ClickBurst key={click.id} x={click.x} y={click.y} />
                ))}
            </AnimatePresence>
        </>
    );
}

function ClickBurst({ x, y }: { x: number; y: number }) {
    // Generate random particles for the burst
    const particles = Array.from({ length: 12 }).map((_, i) => { // Increased to 12 particles
        const angle = (i * 30 * Math.PI) / 180; // 12 directions (360/12 = 30 degrees)
        return {
            id: i,
            xDir: Math.cos(angle),
            yDir: Math.sin(angle),
        };
    });

    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9998]">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{ x, y, scale: 0, opacity: 1 }}
                    animate={{
                        x: x + particle.xDir * 80, // Increased distance
                        y: y + particle.yDir * 80,
                        scale: 0.8, // Start slightly larger
                        opacity: 0,
                        rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1.0, ease: "easeOut" }} // Slower fade
                    className="absolute"
                >
                    <LeafIcon className="w-6 h-6 text-primary fill-primary" /> {/* Increased from w-4 h-4 */}
                </motion.div>
            ))}
        </div>
    );
}

function LeafIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M12.0003 3C17.2917 4.2045 19.8398 9.07963 19.9881 14.3985C19.8665 14.5458 16.9298 14.0759 15.0003 13C12.4416 11.5735 9.1724 9.12217 8.0003 5C7.99042 9.28014 9.53123 13.9056 12.0003 17C9.37562 16.634 5.3727 15.6596 3.0003 12C2.0716 16.4851 4.57503 20.3551 8.0003 21C14.7356 22.2681 21.0772 17.6186 21.0003 11C20.9754 8.8542 20.1873 4.88725 18.0003 2C15.4298 2.05886 12.8712 2.76672 12.0003 3Z" />
        </svg>
    );
}
