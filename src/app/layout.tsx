/**
 * Root Layout - Catalogue MCP
 * 
 * Layout racine pour Next.js 15 App Router avec Tailwind CSS
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Catalogue MCP',
  description: 'Universal catalog of MCP (Model Context Protocol) servers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}