import type { Metadata } from "next";
import { Chakra_Petch, Geist, Geist_Mono, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

const headingFont = Chakra_Petch({
  variable: "--font-heading",
  weight: ["600", "700"],
  subsets: ["latin", "vietnamese"],
});

const terminalFont = VT323({
  variable: "--font-terminal",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English Study",
  description: "Học ngữ pháp, bài học và luyện tập tiếng Anh với AI chấm bài chi tiết.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} ${headingFont.variable} ${terminalFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
