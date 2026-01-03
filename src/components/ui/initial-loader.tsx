"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

export function InitialLoader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // REMOVED: Session storage check to ensure it runs on every refresh as requested
        // const hasLoaded = sessionStorage.getItem("eatwise-initial-load"); ...

        const timer = setTimeout(() => {
            setShow(false);
            // sessionStorage.setItem("eatwise-initial-load", "true");
        }, 4500); // Slightly shorter duration for refresh UX

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
                        scale: 1.05,
                        filter: "blur(20px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
                >
                    {/* 1. Cinematic Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />

                        {/* Subtle Moving Gradients */}
                        <motion.div
                            animate={{
                                transform: ["translate(-50%, -50%) rotate(0deg) scale(1)", "translate(-50%, -50%) rotate(180deg) scale(1.1)"],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[100px] will-change-transform"
                        />
                        <motion.div
                            animate={{
                                transform: ["translate(50%, 50%) rotate(0deg) scale(1)", "translate(50%, 50%) rotate(-180deg) scale(1.2)"],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full bg-accent/5 blur-[100px] will-change-transform"
                        />
                    </div>

                    {/* 2. Main Content Wrapper - Centered Vertically */}
                    <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4">

                        {/* Logo Section */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative mb-16 will-change-transform"
                        >
                            <div className="relative flex items-center justify-center w-24 h-24 bg-card/5 backdrop-blur-sm rounded-3xl border border-white/5 shadow-[0_0_100px_-20px_hsl(var(--primary)/0.3)]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                                    className="relative z-10"
                                >
                                    <Leaf className="w-12 h-12 text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
                                </motion.div>

                                {/* Refined Orbitals */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-2 rounded-[2rem] border border-primary/20 opacity-50 will-change-transform"
                                    style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-6 rounded-full border border-accent/10 opacity-30 will-change-transform"
                                    style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                                />
                            </div>
                        </motion.div>

                        {/* Typography Section */}
                        <div className="flex flex-col items-center relative z-20">
                            <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4 overflow-hidden relative pb-4">

                                {/* "EAT" */}
                                <div className="flex">
                                    {["E", "a", "t"].map((char, i) => (
                                        <motion.span
                                            key={`1-${i}`}
                                            className="text-7xl md:text-9xl font-black tracking-tighter text-foreground"
                                            initial={{ y: 150, rotate: 5 }}
                                            animate={{ y: 0, rotate: 0 }}
                                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 + (i * 0.05) }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* "WISE" (Gradient) */}
                                <div className="flex">
                                    {["W", "i", "s", "e"].map((char, i) => (
                                        <motion.span
                                            key={`2-${i}`}
                                            className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                                            initial={{ y: 150, rotate: 5 }}
                                            animate={{ y: 0, rotate: 0 }}
                                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 + (i * 0.05) }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* "INDIA" (Gradient Variation) */}
                                <div className="flex">
                                    {["I", "n", "d", "i", "a"].map((char, i) => (
                                        <motion.span
                                            key={`3-${i}`}
                                            className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"
                                            initial={{ y: 150, rotate: 5 }}
                                            animate={{ y: 0, rotate: 0 }}
                                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.7 + (i * 0.05) }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Elegant Divider */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "200px", opacity: 0.5 }}
                                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                                className="h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent my-6"
                            />

                            {/* Subtext - High Tracking */}
                            <div className="overflow-hidden">
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 0.8 }}
                                    transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                                    className="text-sm md:text-lg text-foreground/80 font-medium tracking-[0.5em] uppercase text-center pl-[0.5em]" // Added pl to balance tracking
                                >
                                    AI for a Healthier You
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Footer / Progress - Pinned to bottom with safe area */}
                    <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 z-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <span className="text-[10px] text-muted-foreground/50 font-mono tracking-[0.2em]">
                                SYSTEM INITIALIZING
                            </span>

                            {/* Minimalist Line Loader */}
                            <div className="w-32 h-[1px] bg-foreground/10 overflow-hidden relative">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                                    className="absolute inset-0 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
