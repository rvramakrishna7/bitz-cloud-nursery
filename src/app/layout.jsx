import { Fredoka, Fraunces, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = {
  title: "Meet Bitz · The Baby Cloud-Sprite | Baby's First Website (haX.baby)",
  description:
    "Interactive 90s-soul character portfolio of Bitz, Junior Weather Weaver at the Sky-Loft Nursery. Built for the haX.baby 48-Hour Hackathon (Track 2: Your Own Baby).",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${fraunces.variable} ${plusJakarta.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#a34063] selection:text-[#fff8f1]">
        {children}
      </body>
    </html>
  );
}
