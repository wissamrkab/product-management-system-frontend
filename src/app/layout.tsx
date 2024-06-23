import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'primereact/resources/themes/mira/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "./globals.css";
import Link from "next/link";
import Navmenu from "@/components/navmenu/navmenu";
import {Toast} from "primereact/toast";
import React from "react";
import {AppContextProvider} from "@/contexts/appContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <Navmenu/>
      <main className="content">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </main>
    </body>
    </html>
  );
}