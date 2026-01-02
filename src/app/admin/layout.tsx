"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenSquare, LogOut, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        // If not logged in and not on login page, redirect to login
        if (!user && pathname !== "/admin/login") {
            router.push("/admin/login");
            return;
        }

        // Check if user is allowed
        const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(e => e.trim());
        if (user && !allowedEmails.includes(user.email || "")) {
            // Unauthorized
            console.warn(`Unauthorized access attempt by: ${user.email}`);
            auth.signOut();
            alert("Access Denied: You are not authorized to view the Admin Panel.");
            router.push("/");
            return;
        }

        // If logged in (and authorized) and on login page, redirect to dashboard
        if (user && pathname === "/admin/login") {
            router.push("/admin");
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If on login page, render children without sidebar
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-muted/20">{children}</div>;
    }

    // If not logged in (and not on login page - handled by redirect), return null (or loading)
    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:block">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary flex items-center">
                        <FileText className="mr-2 h-6 w-6" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Button variant={pathname === "/admin" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                        <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </Button>
                    <Button variant={pathname === "/admin/create" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                        <Link href="/admin/create"><PenSquare className="mr-2 h-4 w-4" /> Write Blog</Link>
                    </Button>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t bg-card">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                        <div className="text-sm overflow-hidden">
                            <p className="font-medium truncate">{user.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => auth.signOut()}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Add mobile menu toggle if needed) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
