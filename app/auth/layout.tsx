import '../globals.css';  
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" richColors />
        <Header />
        <div className="flex items-center justify-center min-h-[100svh]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}