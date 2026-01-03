"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { recordEvent } from "@/lib/analytics";

function ViewTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            // Basic view event
            recordEvent({
                type: "view",
                page: pathname,
                targetId: pathname, // Use path as ID for general pages
                meta: {
                    query: searchParams?.toString()
                }
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export function ViewTracker() {
    return (
        <Suspense fallback={null}>
            <ViewTrackerContent />
        </Suspense>
    );
}
