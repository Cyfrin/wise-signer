import type { Metadata } from "next";
import "./globals.css";
import { NetworkProvider } from '@/components/NetworkProvider';

export const metadata: Metadata = {
  title: "Wise Signer",
  description: "Can you sign the transactions correctly?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-white">
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  );
}