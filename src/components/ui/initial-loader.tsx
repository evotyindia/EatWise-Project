"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

export function InitialLoader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const hasLoaded = sessionStorage.getItem("eatwise-initial-load");
        if (hasLoaded) {
            setShow(false);
            return;
        }

        const timer = setTimeout(() => {
            setShow(false);
            sessionStorage.setItem("eatwise-initial-load", "true");
        }, 5500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        filter: "blur(10px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
                >
                    {/* 1. Optimized Background: Reduced composite cost */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        {/* Simplified Grid / Gradient Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-40" />

                        {/* Lighter weight blobs with will-change-transform */}
                        <motion.div
                            animate={{
                                transform: ["translate(-50%, -50%) rotate(0deg)", "translate(-50%, -50%) rotate(180deg)"],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-[80vw] h-[80vw] rounded-full bg-primary/5 blur-[80px] will-change-transform"
                            style={{ transformOrigin: "50% 50%" }}
                        />
                        <motion.div
                            animate={{
                                transform: ["translate(50%, 50%) rotate(0deg)", "translate(50%, 50%) rotate(-180deg)"],
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-0 right-0 w-[80vw] h-[80vw] rounded-full bg-accent/5 blur-[80px] will-change-transform"
                            style={{ transformOrigin: "50% 50%" }}
                        />
                    </div>

                    {/* 2. Main Content Container */}
                    <div className="relative z-10 flex flex-col items-center justify-center p-8">

                        {/* Logo Assembly Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative mb-12 will-change-transform"
                        >
                            <div className="relative flex items-center justify-center w-28 h-28 bg-card/20 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_40px_-10px_hsl(var(--primary))] ring-1 ring-white/10">
                                <motion.div
                                    initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
                                    animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                >
                                    <Leaf className="w-14 h-14 text-white drop-shadow-lg" />
                                </motion.div>

                                {/* Simplified Orbiting Rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-1 rounded-3xl border border-transparent opacity-60 will-change-transform"
                                    style={{ borderTopColor: 'hsl(var(--primary))', borderRightColor: 'transparent' }}
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-3 rounded-[2rem] border border-transparent opacity-30 will-change-transform"
                                    style={{ borderBottomColor: 'hsl(var(--accent))', borderLeftColor: 'transparent' }}
                                />
                            </div>
                        </motion.div>

                        {/* Typography Container */}
                        <div className="flex flex-col items-center">
                            <div className="flex overflow-hidden relative pb-2 px-4">
                                {/* Staggered Letter Reveal */}
                                {["E", "a", "t"].map((char, i) => (
                                    <motion.span
                                        key={`1-${i}`}
                                        className="text-6xl md:text-8xl font-bold tracking-tight text-foreground"
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}

                                <div className="w-4" />

                                {["W", "i", "s", "e"].map((char, i) => (
                                    <motion.span
                                        key={`2-${i}`}
                                        className="text-6xl md:text-8xl font-bold tracking-tight text-primary"
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 + (i * 0.1) }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Animated Line Separator */}
                            <div className="w-full h-px relative bg-transparent overflow-visible mt-2 mb-4">
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 1.5, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-px"
                                />
                                <motion.div
                                    initial={{ left: "0%", opacity: 0 }}
                                    animate={{ left: "100%", opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.2, delay: 1.5, ease: "easeInOut" }}
                                    className="absolute top-0 w-20 h-px bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]"
                                />
                            </div>

                            {/* Subtext */}
                            <div className="overflow-hidden h-12 flex items-center justify-center">
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                                    className="text-lg md:text-xl text-muted-foreground font-light tracking-[0.3em] uppercase text-center"
                                >
                                    Your Nutrition AI
                                </motion.p>
                            </div>
                        </div>

                        {/* 3. Footer Status */}
                        <div className="absolute bottom-12 flex flex-col items-center gap-4">
                            <div className="w-48 h-[2px] bg-secondary/30 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4.5, ease: "linear", delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_5px_hsl(var(--primary))]"
                                />
                            </div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="text-[10px] text-muted-foreground font-mono tracking-widest"
                            >
                                INITIALIZING...
                            </motion.span>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
