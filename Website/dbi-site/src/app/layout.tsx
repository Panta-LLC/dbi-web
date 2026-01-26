import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delta Bay Impact",
  description:
    "Delta Bay Impact empowers African American youth and families in Contra Costa communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
