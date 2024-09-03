'use client'
// creating a wrapper to make it available to all the components
import { SessionProvider } from "next-auth/react"
export default function AuthProvider({
  children,
}) {
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}