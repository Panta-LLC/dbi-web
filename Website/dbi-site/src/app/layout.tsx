import type { Metadata } from "next";
import { Inter, Noto_Sans, Noto_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { StructuredData } from "@/components/StructuredData";
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
  title: "Delta Bay Impact | Every African American Student Deserves to Thrive",
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
    url: "https://dbi-site.vercel.app",
    siteName: "Delta Bay Impact",
    title: "Every African American Student in Contra Costa County Deserves to Thrive",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth.",
    images: [
      {
        url: "/dbi_logo.png",
        width: 1200,
        height: 630,
        alt: "Delta Bay Impact Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Every African American Student Deserves to Thrive | Delta Bay Impact",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth.",
    images: ["/dbi_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable} ${inter.variable} antialiased`}>
        <StructuredData />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
