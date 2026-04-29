import { Toaster } from '@/components/ui/sonner'
import '../../globals.css'

export const metadata = {
  title: 'Admin Panel | Cafoo Real Estate',
  description: 'Manage your real estate platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased overflow-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
