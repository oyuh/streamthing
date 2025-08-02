'use client';

import { FaDiscord, FaGithub, FaSpotify, FaTwitch, FaCode, FaRocket, FaCog, FaPlay, FaHeart, FaStar, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-emerald-900 text-white overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-48 left-1/3 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header with Login */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <a
          href="/api/discord/login"
          className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 hover:border-indigo-400/60 px-6 py-3.5 rounded-2xl text-white font-medium shadow-2xl shadow-black/25 transition-all duration-300 hover:shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-500/0 to-purple-600/0 group-hover:from-indigo-600/10 group-hover:via-indigo-500/5 group-hover:to-purple-600/10 transition duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <div className="relative flex items-center gap-3">
            <FaDiscord size={20} className="text-indigo-400" />
            <span>Go to your Dashboard</span>
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </a>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="text-center z-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <FaStar className="text-purple-400" />
              <span className="text-sm text-purple-300">Open Source • Self-Hosted • Free</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
              streamthing
            </h1>

            <p className="text-2xl md:text-3xl text-gray-200 mb-6 leading-relaxed max-w-4xl mx-auto">
              The ultimate streaming overlay and management system
            </p>

            <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
              Built for modern content creators who demand professional overlays, real-time music integration, and powerful moderation tools
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
                <FaSpotify className="text-emerald-400 text-xl" />
                <span className="font-medium">Spotify Integration</span>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
                <FaTwitch className="text-purple-400 text-xl" />
                <span className="font-medium">Twitch Ready</span>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
                <FaCog className="text-blue-400 text-xl" />
                <span className="font-medium">Custom Themes</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#features"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div className="relative flex items-center gap-3 text-white">
                <FaPlay className="group-hover:scale-110 transition-transform duration-200" />
                <span>Explore Features</span>
              </div>
            </a>

            <a
              href="https://github.com/oyuh/streamthing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 hover:border-slate-500/70 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/0 to-slate-700/0 group-hover:from-slate-800/50 group-hover:to-slate-700/30 transition duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div className="relative flex items-center gap-3 text-white">
                <FaGithub className="group-hover:scale-110 transition-transform duration-200" />
                <span>View Source</span>
              </div>
            </a>
          </div>

          <p className="text-sm text-gray-400 max-w-2xl mx-auto mt-8">
            Self-hosted for security and performance • Deploy free with Vercel + Neon
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Meet the Creator
                </h2>
                <div className="space-y-6 text-gray-200 leading-relaxed text-lg">
                  <p>
                    Hey! I'm <span className="text-white font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Lawson</span>,
                    a passionate developer and content creator who loves building tools that make streaming more engaging and interactive.
                  </p>
                  <p>
                    I created streamthing because I wanted a flexible, powerful overlay system that could handle
                    real-time music displays, viewer interactions, and administrative controls all in one place.
                  </p>
                  <p>
                    After struggling with limited, expensive overlay solutions, I decided to build something better -
                    and share it with the community for free.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/oyuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border border-slate-700/50 hover:border-slate-500/70 px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <div className="relative flex items-center gap-3">
                    <FaGithub className="text-lg text-slate-300 group-hover:text-white transition-colors" />
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">GitHub</span>
                  </div>
                </a>
                <a
                  href="https://twitch.tv/wthlaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/60 px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-500/0 group-hover:from-purple-600/10 group-hover:to-purple-500/5 transition duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <div className="relative flex items-center gap-3">
                    <FaTwitch className="text-lg text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">Twitch</span>
                  </div>
                </a>
                <a
                  href="https://discordapp.com/users/527167786200465418"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border border-indigo-500/30 hover:border-indigo-400/60 px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-500/0 group-hover:from-indigo-600/10 group-hover:to-indigo-500/5 transition duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <div className="relative flex items-center gap-3">
                    <FaDiscord className="text-lg text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">Discord</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <h3 className="text-3xl font-bold mb-6 text-emerald-400">Tech Stack</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Framework:</span>
                      <span className="font-semibold text-white">Next.js 15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Language:</span>
                      <span className="font-semibold text-white">TypeScript</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Database:</span>
                      <span className="font-semibold text-white">PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">ORM:</span>
                      <span className="font-semibold text-white">Drizzle</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Styling:</span>
                      <span className="font-semibold text-white">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auth:</span>
                      <span className="font-semibold text-white">JWT + Discord</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">APIs:</span>
                      <span className="font-semibold text-white">Spotify, Twitch</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Deploy:</span>
                      <span className="font-semibold text-white">Vercel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              What streamthing can do
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create professional streaming overlays and manage your community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-emerald-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaSpotify className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Spotify Integration</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Real-time now playing overlays with customizable themes. Perfect for showing your audience
                  what music you're vibing to during streams.
                </p>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>Live music display</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-purple-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaCog className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Theme Customization</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Live CSS editor with multiple themes. Create neon, retro, minimalist, or completely custom
                  styles for your overlays with real-time preview.
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>Real-time editor</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-blue-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaRocket className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Moderation Tools</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  User management, song request moderation, and administrative controls. Keep your stream
                  organized and your community engaged.
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>Admin dashboard</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-red-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaHeart className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Song Requests</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Let viewers request songs with automatic moderation. Approve or reject requests with
                  one click and add them directly to your Spotify queue.
                </p>
                <div className="flex items-center gap-2 text-red-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>Viewer interaction</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-yellow-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaCode className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Open Source</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Completely open source and self-hosted. Customize everything to your needs and deploy
                  for free using modern cloud platforms.
                </p>
                <div className="flex items-center gap-2 text-yellow-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>MIT Licensed</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-teal-400/50 p-8 rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaTwitch className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">OBS Ready</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Designed specifically for OBS and streaming software. Add overlays as browser sources
                  and watch them update in real-time.
                </p>
                <div className="flex items-center gap-2 text-teal-400 font-medium">
                  <FaCheckCircle className="text-sm" />
                  <span>Browser sources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get up and running in minutes with our streamlined setup process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl">
                    1
                  </div>
                  <div className="absolute top-12 left-1/2 w-px h-16 bg-gradient-to-b from-purple-500 to-blue-500 last:hidden"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Connect Your Accounts</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Link your Discord for authentication and Spotify for music data.
                    Secure OAuth integration keeps your credentials safe.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl">
                    2
                  </div>
                  <div className="absolute top-12 left-1/2 w-px h-16 bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Customize Your Overlays</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Use the powerful theme editor to create beautiful overlays that match your brand.
                    Choose from presets or build completely custom styles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl">
                    3
                  </div>
                  <div className="absolute top-12 left-1/2 w-px h-16 bg-gradient-to-b from-emerald-500 to-red-500"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Add to OBS</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Copy the overlay URLs and add them as browser sources in OBS or your streaming software.
                    Responsive design works on any resolution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Go Live!</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Stream with dynamic overlays that update in real-time as you play music.
                    Engage your audience with interactive song requests.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Ready to self-host?
                </h3>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    streamthing is completely open source! Deploy your own instance in minutes:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-emerald-400 text-lg mt-0.5 flex-shrink-0" />
                      <span>Clone the repository from GitHub</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-emerald-400 text-lg mt-0.5 flex-shrink-0" />
                      <span>Set up PostgreSQL database (free with Neon)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-emerald-400 text-lg mt-0.5 flex-shrink-0" />
                      <span>Configure Spotify/Discord API keys</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-emerald-400 text-lg mt-0.5 flex-shrink-0" />
                      <span>Deploy with Vercel (completely free)</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <a
                      href="https://github.com/oyuh/streamthing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3 w-full justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 rounded-xl font-semibold text-white w-full text-center">
                        <div className="flex items-center gap-3 justify-center">
                          <FaGithub className="text-lg" />
                          <span>View Setup Guide</span>
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-12">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Ready to elevate your stream?
            </h3>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
              Join creators worldwide who trust streamthing for professional overlays and community management.
              Deploy your own instance completely free - no credit card required!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/api/discord/login"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-100"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center gap-3 text-white">
                  <FaDiscord className="text-xl group-hover:scale-110 transition-transform duration-200" />
                  <span>Try Demo</span>
                </div>
              </a>

              <a
                href="https://github.com/oyuh/streamthing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 hover:border-slate-500/70 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/0 to-slate-700/0 group-hover:from-slate-800/50 group-hover:to-slate-700/30 transition duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center gap-3 text-white">
                  <FaGithub className="text-xl group-hover:scale-110 transition-transform duration-200" />
                  <span>Deploy Your Own</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                  <FaRocket className="text-xl text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    streamthing
                  </div>
                  <div className="text-sm text-gray-400">Open Source Streaming Platform</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/oyuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a
                  href="https://twitch.tv/wthlaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FaTwitch className="text-xl" />
                </a>
                <a
                  href="https://discordapp.com/users/527167786200465418"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <FaDiscord className="text-xl" />
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-gray-400 text-sm">
              <p>
                &copy; 2025 Lawson Hart. Built with <FaHeart className="inline text-red-400 mx-1" /> for the streaming community.
                Licensed under MIT - free forever.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
