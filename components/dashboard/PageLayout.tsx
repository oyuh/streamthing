import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import type { IconType } from 'react-icons';

const widthMap: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  full: 'max-w-none',
};

export type PageLayoutProps = {
  title: string;
  icon?: IconType;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  contentWidth?: keyof typeof widthMap;
  hideBackButton?: boolean;
  showSignOut?: boolean;
};

export default function PageLayout({
  title,
  icon: Icon,
  description,
  children,
  actions,
  contentWidth = 'lg',
  hideBackButton = false,
  showSignOut = false,
}: PageLayoutProps) {
  const widthClass = widthMap[contentWidth];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <header className="border-b border-zinc-800/50">
          <div className={`${widthClass} mx-auto px-4 py-4 sm:px-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!hideBackButton && (
                  <Link
                    href="/"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    <FaArrowLeft className="text-sm" />
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Icon className="text-base text-white/80" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg font-medium tracking-tight">{title}</h1>
                    {description && (
                      <p className="text-xs text-zinc-500">{description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {actions}
                {showSignOut && (
                  <Link
                    href="/api/discord/logout"
                    className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    Sign out
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className={`${widthClass} mx-auto px-4 py-6 sm:px-6`}>
          {children}
        </main>
      </div>
    </div>
  );
}
