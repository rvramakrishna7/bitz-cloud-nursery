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
  title: "Meet Bitz · The Baby Cloud-Sprite | Interactive Sky Sanctuary",
  description:
    "Interactive 3D-plushie character portfolio of Bitz, Junior Weather Weaver at the Sky-Loft Sanctuary.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${fraunces.variable} ${plusJakarta.variable} ${spaceMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen antialiased selection:bg-pink-400 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
