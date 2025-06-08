"use client";

// Re-export Next.js navigation primitives
// This allows components to keep using "@/navigation" imports
// but they will now resolve to standard Next.js navigation.
import Link from 'next/link';
import { usePathname, useRouter, redirect } from 'next/navigation';

export { Link, usePathname, useRouter, redirect };
