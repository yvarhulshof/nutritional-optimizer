'use client';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
            <path d="M12 2C9.5 2 7.5 4 7 6.5C5.5 6.5 4 8 4 10c0 2.5 2 4 4 4h8c2 0 4-1.5 4-4 0-2-1.5-3.5-3-3.5C16.5 4 14.5 2 12 2Z" fill="currentColor" opacity="0.2"/>
            <path d="M12 2C9.5 2 7.5 4 7 6.5C5.5 6.5 4 8 4 10c0 2.5 2 4 4 4h8c2 0 4-1.5 4-4 0-2-1.5-3.5-3-3.5C16.5 4 14.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14v8M9 18l3 4M15 18l-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <span className="font-semibold text-gray-900 tracking-tight">NutriOpt</span>
            <span className="hidden sm:inline text-gray-400 text-xs ml-2">
              linear programming for your diet
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <a
            href="https://fdc.nal.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            USDA FoodData Central
          </a>
          <span>·</span>
          <a
            href="https://world.openfoodfacts.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            Open Food Facts
          </a>
        </div>
      </div>
    </header>
  );
}
