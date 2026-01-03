"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNavbar } from "@/components/layout/bottom-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Check if the current path starts with /admin
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <BottomNavbar />
        </>
    );
}
