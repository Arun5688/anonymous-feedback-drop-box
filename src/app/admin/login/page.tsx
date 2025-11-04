"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const [adminToken, setAdminToken] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Check if already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) {
      router.push("/admin")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!adminToken.trim()) {
      setLoginError("Please enter an admin token")
      return
    }

    setIsLoggingIn(true)
    setLoginError("")

    try {
      // Verify token by attempting to fetch feedback
      const response = await fetch("/api/feedback/list?limit=1", {
        headers: {
          Authorization: `Bearer ${adminToken.trim()}`,
        },
      })

      if (!response.ok) {
        throw new Error("Invalid admin token")
      }

      // Store token and redirect to dashboard
      localStorage.setItem("adminToken", adminToken.trim())
      router.push("/admin")
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your admin token to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Admin Token
              </label>
              <Input
                id="token"
                type="password"
                placeholder="Enter admin token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                disabled={isLoggingIn}
                autoFocus
              />
            </div>

            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn || !adminToken.trim()}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center pt-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
