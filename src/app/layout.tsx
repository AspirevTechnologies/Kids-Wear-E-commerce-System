import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/presentation/context/CartContext';
import { Navbar } from '@/presentation/components/organisms/Navbar';
import { Footer } from '@/presentation/components/organisms/Footer';

export const metadata: Metadata = {
  title: 'LittleStyles | Luxury Kids Boutique • Sri Lanka COD',
  description: 'Handcrafted kids wear, organic cotton rompers, party frocks & daily comfortable clothing with Islandwide Cash on Delivery across Sri Lanka.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden w-full max-w-full">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased overflow-x-hidden w-full max-w-full selection:bg-rose-100 selection:text-rose-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
