import './globals.css';
import { ThemeProvider } from './context/ThemeContext'; // Import the provider

export const metadata = {
  title: "Garden Soil Calculator",
  description: "Calculate your garden's soil volume accurately."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ThemeProvider needs 'use client', but layout is Server Component.
          We apply ThemeProvider inside body to keep <html>/<body> tags server-rendered
          while allowing context to work for client components within {children}.
          The ThemeProvider itself handles adding/removing the 'dark' class to <html>.
      */}
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
