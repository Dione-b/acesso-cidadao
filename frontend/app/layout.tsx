import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Acesso Cidadão — Programas Sociais do Brasil",
  description:
    "Descubra os programas sociais do governo federal e estadual disponíveis para você e sua família. Catálogo aberto e colaborativo.",
  keywords: ["programas sociais", "benefícios", "governo", "CadÚnico", "Bolsa Família", "cidadão"],
  openGraph: {
    title: "Acesso Cidadão — Programas Sociais do Brasil",
    description:
      "Descubra os programas sociais do governo federal e estadual disponíveis para você e sua família.",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
