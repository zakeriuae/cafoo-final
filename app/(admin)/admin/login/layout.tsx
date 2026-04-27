import '../../globals.css'

export const metadata = {
  title: 'Admin Login | Cafoo Real Estate',
  description: 'Login to the admin panel',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
