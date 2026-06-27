import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "CareerPilot AI - Your Smart Placement Mentor",
  description: "Get placement-ready in 7 days with custom roadmap analysis, mock interviews, and gap reviews.",
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

