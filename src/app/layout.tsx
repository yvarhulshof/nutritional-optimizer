import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriOpt — Personal Nutritional Optimizer",
  description:
    "Find the optimal diet using linear programming. Minimize cost or maximize nutrients while meeting all your nutritional targets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
