"use client"

import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLoginSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  )
}
