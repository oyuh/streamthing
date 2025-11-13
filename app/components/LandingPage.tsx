'use client';

import { FaDiscord, FaGithub, FaSpotify, FaCode } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notice Banner */}
      <div className="border-b border-yellow-900/50 bg-yellow-950/20 px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-3">
            <div className="text-yellow-500">⚠️</div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-yellow-400">Temporary Landing Page</p>
              <p className="mt-1 text-yellow-600">
                This is a placeholder. To remove it, see the instructions in{' '}
                <code className="rounded bg-yellow-900/30 px-1.5 py-0.5 font-mono text-xs">
                  README.md
                </code>{' '}
                or replace{' '}
                <code className="rounded bg-yellow-900/30 px-1.5 py-0.5 font-mono text-xs">
                  app/components/LandingPage.tsx
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="mb-2 text-5xl font-bold text-white">streamthing</h1>
            <p className="text-sm text-zinc-500">Streaming overlay & management</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href="/api/discord/login"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-blue-900 bg-blue-950/30 px-6 py-4 font-medium text-white transition hover:border-blue-700 hover:bg-blue-900/30"
            >
              <FaDiscord className="text-xl" />
              <span>Login with Discord</span>
            </a>

            <a
              href="/request-song"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-green-900 bg-green-950/30 px-6 py-4 font-medium text-white transition hover:border-green-700 hover:bg-green-900/30"
            >
              <FaSpotify className="text-xl" />
              <span>Request a Song</span>
            </a>
          </div>

          {/* Footer Links */}
          <div className="mt-12 space-y-3 border-t border-zinc-800 pt-8">
            <p className="text-xs text-zinc-600">Open Source • Self-Hosted • MIT License</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/oyuh/streamthing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
              <span className="text-zinc-800">•</span>
              <a
                href="https://github.com/oyuh/streamthing#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
              >
                <FaCode />
                <span>Documentation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
