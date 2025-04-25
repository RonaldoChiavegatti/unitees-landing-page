"use client"

import { LoginForm } from "@/components/auth/login-form"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <LoginForm />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
