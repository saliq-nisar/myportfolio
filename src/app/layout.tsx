import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://saliqnisar.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Saliq Nisar | Frontend Developer",
  description:
    "Saliq Nisar is a Frontend Developer with 3+ years of experience building scalable SaaS products using React.js, Next.js, and TypeScript, specializing in real-time systems, REST APIs, performance optimization, and production-ready user interfaces.",
  keywords: [
    "Saliq Nisar",
    "Frontend Developer",
    "React.js",
    "Next.js",
    "TypeScript",
    "SaaS",
    "Real-Time Systems",
    "Portfolio",
  ],
  authors: [{ name: "Saliq Nisar" }],
  openGraph: {
    title: "Saliq Nisar | Frontend Developer",
    description:
      "Frontend Developer with 3+ years of experience building scalable SaaS products using React.js, Next.js, and TypeScript, specializing in real-time systems, REST APIs, and performance optimization.",
    url: siteUrl,
    siteName: "Saliq Nisar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saliq Nisar | Frontend Developer",
    description:
      "Frontend Developer with 3+ years of experience building scalable SaaS products using React.js, Next.js, and TypeScript, specializing in real-time systems, REST APIs, and performance optimization.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
