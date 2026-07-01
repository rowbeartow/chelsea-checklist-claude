import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chelsea Smart Checklist",
  description: "A private real estate checklist experience for Chelsea's clients."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
