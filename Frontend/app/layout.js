'use client';

import { useEffect } from "react";
// import Lenis from "@studio-freight/lenis";  // Lenis disabled to test scroll issue
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import {Provider} from "react-redux";
import { store } from "./redux/store";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "UI Audit",
//   description: "Your tool for auditing user interfaces",
// };

export default function RootLayout({ children }) {
  useEffect(() => {
    // Lenis disabled, so no smooth scroll initialization to test default scroll behavior

    // If needed in future, the Lenis setup can be re-enabled with adjusted config
    // const lenis = new Lenis({
    //   duration: 1.2,
    //   smooth: true,
    //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // });

    // function raf(time) {
    //   lenis.raf(time);
    //   requestAnimationFrame(raf);
    // }

    // requestAnimationFrame(raf);

    // return () => lenis.destroy();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
