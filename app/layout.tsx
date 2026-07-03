import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Origami – Kita-App",
  description: "Tablet-first App für Kita-Betreuungspersonen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-nunito bg-creme text-navy">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
