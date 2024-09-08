"use client";
import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from "@/components/theme-provider";
import AsyncLayoutDynamic from "@/containers/async-layout-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AsyncLayoutDynamic>
            {children}
          </AsyncLayoutDynamic>
        </ThemeProvider>
      </body>
    </html>
  );
}
