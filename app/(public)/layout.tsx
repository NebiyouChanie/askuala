import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Askuala Plus Educational Consultancy",
    template: "%s - Askuala Plus",
  },
  description:
    "Askuala Plus provides on‑demand tutoring, professional trainings, strategic consultations, research advisory, scholarship support, document reviews, data entry services, and educational capacity building.",
  keywords: [
    "tutoring",
    "online tutoring",
    "face-to-face tutoring",
    "professional training",
    "research advisory",
    "scholarship support",
    "document review",
    "data entry services",
    "curriculum development",
    "capacity building",
    "education Ethiopia",
    "Addis Ababa",
  ],
  openGraph: {
    title: "Askuala Plus Educational Consultancy",
    description:
      "On‑demand tutoring, trainings, consultations, and research advisory to empower learners and organizations.",
    url: "/",
    siteName: "Askuala Plus",
    type: "website",
    images: [
      {
        url: "/images/logo1.png",
        width: 1200,
        height: 630,
        alt: "Askuala Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Askuala Plus Educational Consultancy",
    description:
      "Tutoring, trainings, and research advisory for students, professionals, and institutions.",
    images: ["/images/logo1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
