"use client";

import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AlertModal from "./components/modal/AlertModal";
import ConfirmModal from "./components/modal/ConfirmModal";
import HeaderSection from "./components/HeaderSection";
import Spinner from "./components/Spinner";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} font-base`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body>
        <Suspense fallback={<Spinner />}>
          <HeaderSection />
        </Suspense>
        <div className="layout">{children}</div>
        <div id="portal"></div>
        <AlertModal />
        <ConfirmModal />
        <SpeedInsights />
      </body>
    </html>
  );
}
