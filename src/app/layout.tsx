import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { NetworkProvider } from "@/components/NetworkProvider";
import GoogleAnalytics from "./GoogleAnalytics";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wise-signer.cyfrin.io"),
  title: "Wise Signer — Read before you sign | Cyfrin",
  description:
    "Train the one skill that protects your wallet: reading a transaction before you approve it. Spot phishing, address poisoning, and malicious calldata in a safe environment.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Wise Signer — Read before you sign",
    description:
      "Train the one skill that protects your wallet: reading a transaction before you approve it.",
    images: ["/wise-signer.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-screen bg-ink font-sans text-bone antialiased">
        <GoogleAnalytics />
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  );
}
