"use client"

import { useRouter } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleRegisterSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  )
}
