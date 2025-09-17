import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
// import { Providers } from "@/utils/Providers";
import UserProvider from "@/utils/UserContext";
import AuthProvider from "@/utils/nextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: 'Notes App | Home',
//   description: 'A simple notes application built with Next.js',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en" 
// suppressHydrationWarning
>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastContainer />
          <AuthProvider>
            <UserProvider>
              <Navbar />
              {/* <Providers> */}{" "}
              {/* This is useQuery provider in newer version of nextjs */}
              {children}
            </UserProvider>
            {/* </Providers> */}
          </AuthProvider>
      </body>
    </html>
  );
}
