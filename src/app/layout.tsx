import type { Metadata } from "next";
import { Outfit, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://surpriser.vercel.app"),
  title: "A Summit Secret | An Alpine Invitation for You ⛰️",
  description:
    "A special invitation to conquer the breathtaking peaks of Albania together.",
  openGraph: {
    title: "A Summit Secret | An Alpine Invitation for You ⛰️",
    description: "Pack your boots. An alpine expedition awaits in Albania.",
    images: ["/images/albanian_alps.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
