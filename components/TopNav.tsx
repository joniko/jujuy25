import Link from 'next/link';

export default function TopNav() {
  return (
    <nav className="sticky px-4 md:px-8 top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              Oremos 24/7 <span role="img" aria-label="fire">🔥</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/" 
              className="text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Guía
            </Link>
            <Link 
              href="/proposito" 
              className="text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Propósito
            </Link>
            <Link 
              href="/biblioteca" 
              className="text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Biblioteca
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

