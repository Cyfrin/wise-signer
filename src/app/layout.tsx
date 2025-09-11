import type { Metadata } from "next";
import "./globals.css";
import { NetworkProvider } from '@/components/NetworkProvider';
import GoogleAnalytics from './GoogleAnalytics';

export const metadata: Metadata = {
  title: "Wise Signer Web3 Wallet Security Training - Cyfrin",
  description: "Wise Signer helps you learn to identify dangerous wallet transactions. Recognize common attacks and deceptive transactions. Master multi-sig and hardware wallet security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-white">
        <GoogleAnalytics />
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  );
}
