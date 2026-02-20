import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Client Portal",
  description: "Starter for secure client/admin portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
