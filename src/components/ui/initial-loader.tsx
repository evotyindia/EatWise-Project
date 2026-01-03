"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

// Improved Scramble that waits for trigger
const DecryptText = ({ text, className, startDelay = 0 }: { text: string, className?: string, startDelay?: number }) => {
    const [display, setDisplay] = useState(text.split('').map(() => '0').join('')); // Initial placeholder
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%&@#";
        let interval: NodeJS.Timeout;

        const startTimer = setTimeout(() => {
            setOpacity(1);
            let iteration = 0;
            interval = setInterval(() => {
                setDisplay(prev =>
                    text.split("").map((letter, index) => {
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );

                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 2;
            }, 30);
        }, startDelay * 1000);

        return () => {
            clearTimeout(startTimer);
            if (interval) clearInterval(interval);
        }
    }, [text, startDelay]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.1 }}
        >
            {display}
        </motion.span>
    );
}

export function InitialLoader() {
    const [show, setShow] = useState(true);
    // Hydration Fix: Initialize empty, populate only on client
    const [particles, setParticles] = useState<{ x: string; y: string; moveToY: number; duration: number; delay: number; }[]>([]);

    useEffect(() => {
        // Generate particles deterministically or randomly ONLY on client side
        setParticles([...Array(20)].map(() => ({
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            moveToY: Math.random() * -100,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 2
        })));

        // Logic: Minimum 3 seconds OR Window Load, whichever is later.
        const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 3000));

        const loadPromise = new Promise((resolve) => {
            if (document.readyState === "complete") {
                resolve(true);
            } else {
                window.addEventListener("load", () => resolve(true));
            }
        });

        Promise.all([minDurationPromise, loadPromise]).then(() => {
            setShow(false);
        });
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        filter: "blur(20px)",
                        scale: 1.1,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
                >
                    {/* --- 1. Active Grid Background --- */}
                    <div className="absolute inset-0 z-0 perspective-[1000px]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] z-10" /> {/* Vignette */}

                        {/* Moving Grid Floor */}
                        <motion.div
                            initial={{ transform: "rotateX(60deg) translateY(0%)" }}
                            animate={{ transform: "rotateX(60deg) translateY(50px)" }} // Seamless loop attempt
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-100%] bg-[linear-gradient(to_right,#10b9811a_1px,transparent_1px),linear-gradient(to_bottom,#10b9811a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"
                            style={{ transformOrigin: "center top" }}
                        />

                        {/* Floating Particles - Hydration Safe */}
                        {particles.map((p, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-emerald-500 rounded-full"
                                initial={{
                                    x: p.x,
                                    y: p.y,
                                    opacity: 0
                                }}
                                animate={{
                                    y: [null, p.moveToY],
                                    opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay
                                }}
                            />
                        ))}
                    </div>

                    {/* --- 2. Main Center Content --- */}
                    <div className="relative z-10 flex flex-col items-center gap-8">

                        {/* Logo Container with Scanner */}
                        <div className="relative group">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, type: "spring" }}
                                className="relative flex items-center justify-center w-28 h-28 bg-black/50 border border-emerald-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden"
                            >
                                <Leaf className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />

                                {/* Scanner Light */}
                                <motion.div
                                    animate={{ top: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
                                    className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent"
                                />
                            </motion.div>

                            {/* Tech Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border border-dashed border-emerald-500/20 rounded-full"
                            />
                        </div>

                        {/* Typography with Scramble Effect */}
                        <div className="text-center space-y-2">
                            <div className="text-5xl md:text-7xl font-bold tracking-tight flex flex-col md:block items-center justify-center leading-tight">
                                <DecryptText
                                    text="EAT WISE"
                                    startDelay={0.5}
                                    className="text-white drop-shadow-2xl mr-0 md:mr-4 inline-block"
                                />
                                <div className="inline-block relative">
                                    <DecryptText
                                        text="INDIA"
                                        startDelay={1.2}
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 inline-block"
                                    />
                                    {/* Glitch underlay/glow for emphasis */}
                                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-50 -z-10" />
                                </div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, letterSpacing: "0em" }}
                                animate={{ opacity: 0.7, letterSpacing: "0.3em" }}
                                transition={{ duration: 1.5, delay: 2 }}
                                className="text-xs md:text-sm font-mono text-emerald-500/80 uppercase"
                            >
                                System Logic Initialized
                            </motion.p>
                        </div>
                    </div>

                    {/* --- 3. Tech Footer / Data Loader --- */}
                    <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center">
                        <div className="w-64 h-px bg-emerald-900/50 relative overflow-visible">
                            {/* Data Stream Line */}
                            <motion.div
                                initial={{ x: "-100%", opacity: 0 }}
                                animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399]"
                            />
                        </div>

                        {/* Dynamic Percentage (Fake) */}
                        <motion.div
                            className="mt-2 font-mono text-[10px] text-emerald-500/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Counter from={0} to={100} duration={4.5} />% PROCESSED
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Simple Counter Component for stats
function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
    const [count, setCount] = useState(from);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const update = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * (to - from) + from));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [from, to, duration]);

    return <span>{count}</span>;
}
