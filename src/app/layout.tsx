import type { Metadata } from "next";
import { Syne, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MagneticCursor } from "@/components/CursorTrail";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://compilecreative.com"),
  title: "Compile Creative — Strategic Growth Partner",
  description:
    "We partner with ambitious founders to strengthen positioning, eliminate operational friction, and create systems that increase enterprise value.",
  keywords: [
    "brand strategy",
    "design systems",
    "growth consulting",
    "positioning",
    "enterprise value",
    "brand identity",
    "creative direction",
    "founder-led agency",
  ],
  authors: [{ name: "Saleh Azgor Rishad" }],
  creator: "Compile Creative",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Compile Creative — Strategic Growth Partner",
    description:
      "We partner with ambitious founders to strengthen positioning, eliminate operational friction, and create systems that increase enterprise value.",
    url: "https://compilecreative.com",
    siteName: "Compile Creative",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Compile Creative — Build Brands Worth More Tomorrow Than They Are Today.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compile Creative — Strategic Growth Partner",
    description:
      "We partner with ambitious founders to strengthen positioning, eliminate operational friction, and create systems that increase enterprise value.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://compilecreative.com" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Compile Creative",
              description:
                "Strategic growth partner bridging strategy, design, systems, and growth.",
              founder: {
                "@type": "Person",
                name: "Saleh Azgor Rishad",
                jobTitle: "Founder & Creative Director",
              },
              url: "https://compilecreative.com",
            }),
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${cormorantGaramond.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <MagneticCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
