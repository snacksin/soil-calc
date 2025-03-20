import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garden Soil Calculator",
  description: "Calculate soil volumes and costs for garden beds",
  keywords: ["garden", "soil", "calculator", "gardening", "raised beds"],
  authors: [{ name: "Garden Soil Calculator Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <header className="header">
            <div className="container-custom">
              <h1>Garden Soil Calculator</h1>
              <button className="btn">Get Started</button>
            </div>
          </header>
          <main className="container-custom">
            {children}
          </main>
          <footer className="footer">
            <div className="container-custom">
              <p>&copy; 2025 Garden Soil Calculator Team</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
