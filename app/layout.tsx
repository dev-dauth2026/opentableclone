import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import AuthContext from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenTables",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-gray-100 min-h-screen w-screen text-black">
          <AuthContext>
            <main className="max-w-screen-2xl m-auto bg-white">
              <NavBar />

              {children}
            </main>
          </AuthContext>
        </main>
      </body>
    </html>
  );
}
