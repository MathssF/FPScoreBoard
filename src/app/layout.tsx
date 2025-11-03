import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/context/lang";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FPScoreBoard",
  description: "CS2 Stats Dashboard powered by MatchZy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}