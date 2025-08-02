import './globals.css';

export const metadata = {
  title: 'streamthing - Streaming Overlay Management',
  description: 'A powerful streaming overlay and management system built for modern content creators. Features Spotify integration, customizable themes, and real-time overlays.',
  keywords: 'streaming, overlay, spotify, twitch, obs, music, themes',
  authors: [{ name: 'Lawson Hart' }],
  creator: 'Lawson Hart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body>{children}</body>
    </html>
  )
}
