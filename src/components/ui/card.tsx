
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg", // Changed to rounded-xl and default shadow-lg
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // Changed from HTMLParagraphElement to HTMLDivElement for semantic correctness if it contains other elements or acts as a heading container
  React.HTMLAttributes<HTMLHeadingElement> // Changed from HTMLParagraphElement to HTMLHeadingElement for props
>(({ className, ...props }, ref) => (
  // Assuming CardTitle is used for h2, h3 etc. Using div with role heading for flexibility or direct h-tag
  <div // Can be changed to h2, h3 etc. based on usage context, or use role="heading" aria-level="2"
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Kept original styling
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"


const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Correctly HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p // Changed div to p for semantic correctness
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
