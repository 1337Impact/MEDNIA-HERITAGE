import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const notoSans = Noto_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Medinago",
  description:
    "Medinago - A platform for sharing medical knowledge and resources.",
  icons: "medinago.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
