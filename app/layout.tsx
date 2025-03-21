import './globals.css';

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
      <body>
        {children}
      </body>
    </html>
  );
}
