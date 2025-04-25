import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SearchProvider } from "@/context/search-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CompareShop - Compare Products Across Websites",
  description: "Compare fashion and skincare products from different websites all in one place.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SearchProvider>
            <Suspense>{children}</Suspense>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
