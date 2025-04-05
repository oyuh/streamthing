import './globals.css';

export const metadata = {
  title: 'stream shit lol',
  description: 'made by lawson hart!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
