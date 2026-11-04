import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinguaLearn AI — Understand More. Learn Without Limits.",
  description:
    "Transform your study material into personalized learning experiences in your own language. Understand difficult concepts, practice intelligently and learn without limits.",
  keywords: [
    "multilingual learning",
    "AI education",
    "translation",
    "study assistant",
    "Tamil",
    "Hindi",
    "Telugu",
    "Malayalam",
    "DBMS",
    "quiz generation",
  ],
  openGraph: {
    title: "LinguaLearn AI",
    description: "Understand More. Learn Without Limits.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
          backgroundColor: "var(--color-ivory)",
          color: "var(--color-ink)",
        }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
