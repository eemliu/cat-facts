export const metadata = {
  title: 'Cat Facts',
  description: 'Fun web application to generate and favourite cat facts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
