import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Noto_Sans, Noto_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { AppToaster } from "@/components/AppToaster";
import { StructuredData } from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Delta Bay Impact | Every African American Student Deserves to Thrive",
    template: "%s | Delta Bay Impact",
  },
  description:
    "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth in Contra Costa County.",
  keywords: [
    "African American youth support",
    "Contra Costa County",
    "educational equity",
    "student mentorship",
    "Bay Point",
    "Pittsburg",
    "Concord",
    "culturally responsive programs",
  ],
  authors: [{ name: "Delta Bay Impact" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: "Delta Bay Impact",
    title: "Every African American Student in Contra Costa County Deserves to Thrive",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Every African American Student Deserves to Thrive | Delta Bay Impact",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${inter.variable} antialiased bg-primary`}
      >
        <Suspense fallback={null}>
          <StructuredData />
        </Suspense>
        <Analytics />
        <AppToaster />
        {children}
      </body>
    </html>
  );
}
