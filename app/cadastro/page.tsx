"use client"

import { SignupForm } from "@/components/auth/signup-form"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <SignupForm />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
