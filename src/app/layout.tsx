import type { Metadata } from "next";
import { Satisfy, Oxygen } from "next/font/google";
import "./globals.css";

const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
});

const oxygen = Oxygen({
  subsets: ['latin'], // Ensures Latin character support.
  weight: ['300', '400', '700'], // Include specific font weights.
});

export const metadata: Metadata = {
  title: "Seasons",
  description: "Generate cute & sustainable outfit ideas for any outfit depending on the season!",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={oxygen.className}>
        {children}
      </body>
    </html>
  );
}
