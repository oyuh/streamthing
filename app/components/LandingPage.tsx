'use client';

import { FaDiscord, FaGithub, FaSpotify, FaTwitch, FaCode, FaRocket, FaCog } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black text-white overflow-x-hidden">
      {/* Header with Login */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <a
          href="/api/discord/login"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition text-sm flex items-center gap-2"
        >
          <FaDiscord size={18} />
          Login
        </a>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-blue-800/20 to-green-800/20 animate-pulse"></div>
        <div className="text-center z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            streamthing
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed">
            A powerful streaming overlay and management system built for modern content creators
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
              <FaSpotify className="text-green-500" />
              <span className="text-sm">Spotify Integration</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
              <FaTwitch className="text-purple-500" />
              <span className="text-sm">Twitch Ready</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
              <FaCog className="text-blue-500" />
              <span className="text-sm">Customizable Themes</span>
            </div>
          </div>
          <a
            href="#about"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-lg font-semibold transition text-lg mb-4"
          >
            Learn More
          </a>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            streamthing is designed for self-hosting - each deployment is meant for one creator for security and performance.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-purple-400">About the Creator</h2>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Hey! I'm <span className="text-white font-semibold">Lawson</span>, a passionate developer and content creator
                  who loves building tools that make streaming more engaging and interactive.
                </p>
                <p>
                  I created streamthing because I wanted a flexible, powerful overlay system that could handle
                  real-time music displays, viewer interactions, and administrative controls all in one place.
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://github.com/oyuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
                >
                  <FaGithub />
                  GitHub
                </a>
                <a
                  href="https://twitch.tv/wthlaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTwitch />
                  Twitch
                </a>
                <a
                  href="https://discordapp.com/users/527167786200465418"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
                >
                  <FaDiscord />
                  Discord
                </a>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700">
              <h3 className="text-2xl font-bold mb-4 text-green-400">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Built with:</span>
                  <span className="font-semibold">Next.js & TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-semibold">PostgreSQL + Drizzle ORM</span>
                </div>
                <div className="flex justify-between">
                  <span>Styling:</span>
                  <span className="font-semibold">Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span>APIs:</span>
                  <span className="font-semibold">Spotify, Discord, Twitch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">What streamthing can do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 hover:border-green-500/50 transition">
              <FaSpotify className="text-green-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold mb-3">Spotify Integration</h3>
              <p className="text-zinc-300">
                Real-time now playing overlays with customizable themes. Perfect for showing your audience
                what music you're vibing to during streams.
              </p>
            </div>
            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 hover:border-purple-500/50 transition">
              <FaCog className="text-purple-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold mb-3">Theme Customization</h3>
              <p className="text-zinc-300">
                Live CSS editor with multiple themes. Create neon, retro, minimalist, or completely custom
                styles for your overlays with real-time preview.
              </p>
            </div>
            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500/50 transition">
              <FaRocket className="text-blue-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold mb-3">Moderation Tools</h3>
              <p className="text-zinc-300">
                User management, song request moderation, and administrative controls. Keep your stream
                organized and your community engaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-400">How it works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Connect Your Accounts</h3>
                  <p className="text-zinc-300">Link your Discord for authentication and Spotify for music data.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Customize Your Overlays</h3>
                  <p className="text-zinc-300">Use the theme editor to create beautiful overlays that match your brand.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Add to OBS</h3>
                  <p className="text-zinc-300">Add the overlay URLs as browser sources in OBS or your streaming software.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Go Live!</h3>
                  <p className="text-zinc-300">Stream with dynamic overlays that update in real-time as you play music.</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700">
              <h3 className="text-2xl font-bold mb-6 text-center">Want to self-host?</h3>
              <div className="space-y-4 text-sm text-zinc-300">
                <p>streamthing is open source! You can run your own instance:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Clone the repository from GitHub</li>
                  <li>Set up PostgreSQL database</li>
                  <li>Configure Spotify/Discord API keys</li>
                  <li>Deploy with Vercel, Railway, or your platform of choice</li>
                </ol>
                <a
                  href="https://github.com/oyuh/streamthing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition mt-4"
                >
                  <FaGithub />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to deploy your own?</h3>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
            streamthing is designed for self-hosting - each deployment is meant for one creator for security and performance.
            Deploy completely free using Vercel and Neon (no credit card required)!
          </p>
          <a
            href="https://github.com/oyuh/streamthing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg text-white font-semibold shadow-lg transition text-lg"
          >
            <FaGithub size={24} />
            Get Started on GitHub
          </a>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-zinc-500 text-sm">
            <p>&copy; 2025 Lawson Hart. Built with ❤️ for the streaming community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
