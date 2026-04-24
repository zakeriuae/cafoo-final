import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cafoo Real Estate | Luxury Properties in Dubai',
  description: 'Cafoo Real Estate Advisors - Your trusted partner for luxury property investment in Dubai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
