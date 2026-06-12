import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luc Phung",
  description: "Personal website of Luc Phung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
