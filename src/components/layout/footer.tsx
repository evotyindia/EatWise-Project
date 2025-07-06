export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t flex-shrink-0">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} EatWise India. All rights reserved.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Empowering India to Eat Smarter.
        </p>
      </div>
    </footer>
  )
}
